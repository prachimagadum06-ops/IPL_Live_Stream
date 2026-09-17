from flask import jsonify, request

from modules.config import DEFAULT_STREAM_URL
from modules.mongodb import read_stream_url, write_stream_url

_stream_url = DEFAULT_STREAM_URL


def set_stream():
    global _stream_url

    data = request.get_json(silent=True) or {}
    if "url" not in data:
        return jsonify({"status": "error", "message": "Invalid request"})

    _stream_url = data["url"]
    write_stream_url(_stream_url)
    return jsonify({"status": "success", "message": "Stream URL updated"})


def stream_url():
    stored_url = read_stream_url()
    return jsonify({"status": "success", "url": _stream_url if stored_url is None else stored_url})


def database_status():
    from modules.mongodb import check_connection

    return jsonify(check_connection())
