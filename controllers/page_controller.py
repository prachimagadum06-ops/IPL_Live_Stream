from flask import render_template, request

from modules.config import DEFAULT_STREAM_URL


def home():
    return render_template("index.html")


def live_stream():
    stream_url = request.args.get("stream_url", DEFAULT_STREAM_URL)
    return render_template("streaming.html", stream_url=stream_url)


def teams():
    return render_template("teams.html")


def schedule():
    return render_template("schedule.html")


def points_table():
    return render_template("points-table.html")


def winners():
    return render_template("winners.html")
