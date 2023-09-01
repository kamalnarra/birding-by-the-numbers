import time
from pymongo import MongoClient
import functions_framework
import os
import io
import re
import csv
import requests
from bs4 import BeautifulSoup
from bson import ObjectId

client = MongoClient(os.environ.get("DB_URI"))


EBIRD_HOME_URL = "https://ebird.org/home"
EBIRD_LOGIN_URL = "https://secure.birds.cornell.edu/cassso/login?service=https%3A%2F%2Febird.org%2Flogin%2Fcas%3Fportal%3Debird&locale=en_US"
EBIRD_CSV_URL = "https://ebird.org/lifelist?r=world&time=life&fmt=csv"
EBIRD_LOCATION_URL = "https://ebird.org/mylocations/edit/"
DATABASE_NAME = "birding-by-the-numbers"
COLLECTION_NAME = "users"

def login(username, password):
    session = requests.Session()

    session.get(EBIRD_HOME_URL, allow_redirects=False).headers["set-cookie"].split(";")[0].split("=")[1]

    login_get_response = session.get(EBIRD_LOGIN_URL)

    session.cookies.update(login_get_response.cookies)
    csrf_token = BeautifulSoup(login_get_response.content, "html.parser").find("input", {"type": "hidden", "name": "lt", "value": re.compile(r"LT-.*")})["value"]

    form_data = {
        "username": username,
        "password": password,
        "rememberMe": "on",
        "lt": csrf_token,
        "execution": "e1s1",
        "_eventId": "submit"
    }

    tokenized_url = session.post(EBIRD_LOGIN_URL, data=form_data, cookies=session.cookies, allow_redirects=False).headers.get("Location")

    session.get(tokenized_url, cookies=session.cookies, allow_redirects=False)

    return session

def main(user_id, username, password):
    session = login(username, password)
    csv_response = session.get(EBIRD_CSV_URL, cookies=session.cookies, allow_redirects=False)

    csv_reader = csv.reader(io.StringIO(csv_response.content.decode("utf-8")))

    header = next(csv_reader)

    bird_objects = []

    for row in csv_reader:
        bird_data = {}
        for i, column_name in enumerate(header):
            bird_data[column_name] = row[i]
        loc_response = requests.get(EBIRD_LOCATION_URL + bird_data["LocID"], cookies=session.cookies)
        lat, long = BeautifulSoup(loc_response.text, "html.parser").find("span", {"id": "moveToLatLng"}).text.strip().split(",")
        bird_data["latitude"] = lat
        bird_data["longitude"] = long
        bird_objects.append(bird_data)

    for bird in bird_objects:
        del bird["Row #"]
        del bird["Count"]
        del bird["Exotic"]
        clean_dict = {}
        for key, value in bird.items():
            clean_key = key.lower().replace(" ", "_")
            clean_dict[clean_key] = value
        bird.clear()
        bird.update(clean_dict)

    collection = client[DATABASE_NAME][COLLECTION_NAME]
    collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"birds": bird_objects}},
    )


@functions_framework.cloud_event
def handler(cloud_event):
    def callback(session):
        next = session.client["birding-by-the-numbers"].users.find(session=session).sort("lastUpdated", 1).limit(1).next()
        session.client["birding-by-the-numbers"].users.update_one({"_id": next["_id"]}, {"$set": {"lastUpdated": time.time()}})
        return next


    with client.start_session() as session:
        user = session.with_transaction(callback)

    main(user["_id"], user["ebirdUsername"], user["ebirdPassword"])


if __name__ == "__main__":
    handler(None)