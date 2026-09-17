import logging
import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from pymongo.errors import PyMongoError
from werkzeug.security import check_password_hash, generate_password_hash

from modules.mongodb import get_database

logger = logging.getLogger(__name__)


def _collection():
    database = get_database()
    return database.users if database is not None else None


def create_user(name, email, password):
    collection = _collection()
    if collection is None:
        return False, "MongoDB is not available right now."

    normalized_email = email.strip().lower()
    try:
        if collection.find_one({"email": normalized_email}, {"_id": 1}):
            return False, "An account with that email already exists."

        collection.insert_one({
            "name": name.strip(),
            "email": normalized_email,
            "password_hash": generate_password_hash(password),
        })
        return True, ""
    except PyMongoError as error:
        logger.error("Could not create user: %s", error)
        return False, "Could not create the account. Please try again."


def authenticate_user(email, password):
    collection = _collection()
    if collection is None:
        return None

    try:
        user = collection.find_one({"email": email.strip().lower()})
        if user and check_password_hash(user.get("password_hash", ""), password):
            return {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}
    except PyMongoError as error:
        logger.error("Could not authenticate user: %s", error)

    return None


def create_password_reset(email):
    collection = _collection()
    if collection is None:
        return None

    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)

    try:
        result = collection.update_one(
            {"email": email.strip().lower()},
            {"$set": {"reset_token_hash": token_hash, "reset_expires_at": expires_at}},
        )
        return token if result.modified_count else None
    except PyMongoError as error:
        logger.error("Could not create password reset token: %s", error)
        return None


def reset_password(token, password):
    collection = _collection()
    if collection is None:
        return False

    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    try:
        user = collection.find_one({
            "reset_token_hash": token_hash,
            "reset_expires_at": {"$gt": datetime.now(timezone.utc)},
        })
        if not user:
            return False

        collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"password_hash": generate_password_hash(password)},
             "$unset": {"reset_token_hash": "", "reset_expires_at": ""}},
        )
        return True
    except PyMongoError as error:
        logger.error("Could not reset password: %s", error)
        return False
