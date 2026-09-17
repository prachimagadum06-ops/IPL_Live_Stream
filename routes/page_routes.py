from flask import Blueprint

from controllers import page_controller

pages = Blueprint("pages", __name__)

pages.add_url_rule("/", view_func=page_controller.home)
pages.add_url_rule("/streaming", view_func=page_controller.live_stream)
pages.add_url_rule("/teams", view_func=page_controller.teams)
pages.add_url_rule("/schedule", view_func=page_controller.schedule)
pages.add_url_rule("/points-table", view_func=page_controller.points_table)
pages.add_url_rule("/winners", view_func=page_controller.winners)
