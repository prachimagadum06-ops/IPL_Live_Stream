import logging

from pymongo import MongoClient
from pymongo.errors import PyMongoError

from modules.config import MONGODB_DATABASE, MONGODB_URI

logger = logging.getLogger(__name__)
_client = None


def get_client():
    global _client

    if not MONGODB_URI:
        return None

    if _client is None:
        _client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)

    return _client


def get_database():
    client = get_client()
    return client[MONGODB_DATABASE] if client else None


def check_connection():
    database = get_database()
    if database is None:
        return {"enabled": False, "connected": False, "message": "MONGODB_URI is not configured"}

    try:
        database.command("ping")
        return {"enabled": True, "connected": True, "database": MONGODB_DATABASE}
    except PyMongoError as error:
        logger.warning("MongoDB connection failed: %s", error)
        return {"enabled": True, "connected": False, "database": MONGODB_DATABASE}


def read_stream_url():
    database = get_database()
    if database is None:
        return None

    try:
        document = database.stream_settings.find_one({"_id": "default"})
        return document.get("url", "") if document else ""
    except PyMongoError as error:
        logger.warning("Could not read stream URL from MongoDB: %s", error)
        return None


def write_stream_url(url):
    database = get_database()
    if database is None:
        return False

    try:
        database.stream_settings.update_one(
            {"_id": "default"},
            {"$set": {"url": url}},
            upsert=True,
        )
        return True
    except PyMongoError as error:
        logger.warning("Could not save stream URL to MongoDB: %s", error)
        return False
