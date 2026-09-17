import logging

from flask import jsonify

from modules.api_client import fetch_json
from modules.points_data import POINTS_TABLE_DATA
from modules.schedule_data import SCHEDULE_DATA
from modules.team_data import TEAM_DATA

logger = logging.getLogger(__name__)


def teams():
    return jsonify({"status_code": 200, "teams": TEAM_DATA})


def upstream(endpoint, error_message):
    try:
        return jsonify(fetch_json(endpoint))
    except Exception as error:
        logger.error("%s: %s", error_message, error)
        return jsonify({"status_code": 500, "error": error_message})


def schedule():
    try:
        data = fetch_json("ipl-2025-schedule")
        if data.get("schedule"):
            return jsonify(data)
    except Exception as error:
        logger.warning("Using local schedule fallback: %s", error)

    return jsonify({"status_code": 200, "schedule": SCHEDULE_DATA, "source": "local-fallback"})


def points_table():
    try:
        data = fetch_json("ipl-2025-points-table")
        if data.get("points_table"):
            return jsonify(data)
    except Exception as error:
        logger.warning("Using local points-table fallback: %s", error)

    return jsonify({"status_code": 200, "points_table": POINTS_TABLE_DATA, "source": "local-fallback"})


def live_score():
    return upstream("ipl-2025-live-score", "Failed to fetch live score data")


def winners():
    return upstream("ipl-winners", "Failed to fetch winners data")
