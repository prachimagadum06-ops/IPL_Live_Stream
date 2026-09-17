from urllib.parse import urlparse

from flask import flash, redirect, render_template, session, url_for
from flask import request

from modules.auth import authenticate_user, create_password_reset, create_user, reset_password as reset_user_password
from modules.config import PASSWORD_RESET_BASE_URL
from modules.mailer import send_password_reset_email


def login():
    if session.get("user"):
        return redirect(url_for("pages.home"))

    if request.method == "POST":
        email = request.form.get("email", "")
        password = request.form.get("password", "")
        user = authenticate_user(email, password)
        if user:
            session["user"] = user
            next_url = request.form.get("next", "")
            if next_url and urlparse(next_url).netloc == "":
                return redirect(next_url)
            return redirect(url_for("pages.home"))
        flash("Invalid email or password.", "danger")

    return render_template("login.html", next_url=request.args.get("next", ""))


def register():
    if session.get("user"):
        return redirect(url_for("pages.home"))

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")

        if not name or not email or not password:
            flash("Please complete all fields.", "danger")
        elif len(password) < 6:
            flash("Password must be at least 6 characters.", "danger")
        elif password != confirm_password:
            flash("Passwords do not match.", "danger")
        else:
            created, message = create_user(name, email, password)
            if created:
                flash("Account created. Please log in.", "success")
                return redirect(url_for("auth.login"))
            flash(message, "danger")

    return render_template("register.html")


def logout():
    session.pop("user", None)
    flash("You have been logged out.", "success")
    return redirect(url_for("pages.home"))


def forgot_password():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        token = create_password_reset(email)
        if token:
            reset_url = f"{PASSWORD_RESET_BASE_URL or request.host_url.rstrip('/')}{url_for('auth.reset_password', token=token)}"
            send_password_reset_email(email, reset_url)

        flash("If an account exists for that email, a reset link has been sent.", "info")
        return redirect(url_for("auth.login"))

    return render_template("forgot-password.html")


def reset_password():
    token = request.args.get("token", "")
    if request.method == "POST":
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")
        if len(password) < 8:
            flash("Password must be at least 8 characters.", "danger")
        elif password != confirm_password:
            flash("Passwords do not match.", "danger")
        elif not reset_user_password(token, password):
            flash("This reset link is invalid or expired.", "danger")
        else:
            flash("Password updated. Please log in.", "success")
            return redirect(url_for("auth.login"))

    return render_template("reset-password.html", token=token)
