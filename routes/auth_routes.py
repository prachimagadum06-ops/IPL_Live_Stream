from flask import Blueprint

from controllers import auth_controller

auth = Blueprint("auth", __name__)

auth.add_url_rule("/login", view_func=auth_controller.login, methods=["GET", "POST"])
auth.add_url_rule("/register", view_func=auth_controller.register, methods=["GET", "POST"])
auth.add_url_rule("/logout", view_func=auth_controller.logout, methods=["POST"])
auth.add_url_rule("/forgot-password", view_func=auth_controller.forgot_password, methods=["GET", "POST"])
auth.add_url_rule("/reset-password", view_func=auth_controller.reset_password, methods=["GET", "POST"])
