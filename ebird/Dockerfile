FROM python:3.8-slim-buster

RUN pip install pymongo pika
COPY . /app

ENTRYPOINT ["/usr/local/bin/python3", "/app/main.py"]
