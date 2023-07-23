import pika
import os
import json
from datetime import datetime, timedelta
import time
from pymongo import MongoClient
from bson.objectid import ObjectId

connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        os.environ.get("MQ_HOST"),
        os.environ.get("MQ_PORT"),
        "/",
        pika.PlainCredentials(
            os.environ.get("MQ_USERNAME"), os.environ.get("MQ_PASSWORD")
        ),
    )
)
channel = connection.channel()
db = MongoClient(os.environ.get("DB_URI"))


def callback(ch, method, properties, body):
    data = json.loads(body)
    user_id = data["user_id"]
    date_updated = datetime.fromisoformat(data["date_updated"].split("Z")[0])
    if date_updated + timedelta(hours=1) > datetime.now():
        time.sleep((date_updated + timedelta(hours=1) - datetime.now()).total_seconds())

    print("UPDATING USER")
    db["birding-by-the-numbers"]["users"].update_one(
        {"_id": ObjectId(user_id)}, {"$set": {"updated": datetime.now().isoformat()}}
    )

    channel.basic_publish(
        exchange="",
        routing_key="users",
        body=json.dumps(
            {"user_id": data["user_id"], "date_updated": datetime.now().isoformat()}
        ),
    )
    channel.basic_ack(delivery_tag=method.delivery_tag)


if __name__ == "__main__":
    channel.queue_declare(queue="users", durable=True)
    channel.basic_consume(queue="users", on_message_callback=callback)
    channel.start_consuming()
