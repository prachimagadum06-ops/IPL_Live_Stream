from flask import Blueprint

from controllers import stream_controller

stream = Blueprint("stream", __name__)

stream.add_url_rule("/set-stream", view_func=stream_controller.set_stream, methods=["POST"])
stream.add_url_rule("/api/stream-url", view_func=stream_controller.stream_url)
stream.add_url_rule("/api/mongodb/status", view_func=stream_controller.database_status)
