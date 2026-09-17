from flask import Blueprint

from controllers import api_controller

api = Blueprint("api", __name__, url_prefix="/api")

api.add_url_rule("/teams", view_func=api_controller.teams)
api.add_url_rule("/schedule", view_func=api_controller.schedule)
api.add_url_rule("/points-table", view_func=api_controller.points_table)
api.add_url_rule("/live-score", view_func=api_controller.live_score)
api.add_url_rule("/winners", view_func=api_controller.winners)
