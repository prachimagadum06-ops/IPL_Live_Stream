import logging

from flask import Flask, jsonify, redirect, render_template, request, session, url_for

from modules.config import SESSION_SECRET
from routes.api_routes import api
from routes.auth_routes import auth
from routes.page_routes import pages
from routes.stream_routes import stream

logging.basicConfig(level=logging.DEBUG)


def create_app():
    app = Flask(__name__)
    app.secret_key = SESSION_SECRET

    app.register_blueprint(pages)
    app.register_blueprint(api)
    app.register_blueprint(auth)
    app.register_blueprint(stream)

    @app.before_request
    def require_login():
        public_endpoints = {
            "auth.login", "auth.register", "auth.logout",
            "auth.forgot_password", "auth.reset_password", "static"
        }
        if request.endpoint in public_endpoints or session.get("user"):
            return None

        return redirect(url_for("auth.login", next=request.full_path))

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template("index.html"), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"status_code": 500, "error": "Internal server error"}), 500

    return app


app = create_app()
