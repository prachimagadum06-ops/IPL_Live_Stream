import logging
import smtplib
from email.message import EmailMessage

from modules.config import SMTP_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USERNAME

logger = logging.getLogger(__name__)


def send_password_reset_email(recipient, reset_url):
    if not SMTP_HOST or not SMTP_FROM:
        logger.warning("SMTP is not configured; password reset email was not sent")
        return False

    message = EmailMessage()
    message["Subject"] = "Reset your IPL Live password"
    message["From"] = SMTP_FROM
    message["To"] = recipient
    message.set_content(
        "Use this link to reset your IPL Live password. It expires in 30 minutes:\n\n"
        f"{reset_url}\n\nIf you did not request this, you can ignore this email."
    )

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.starttls()
            if SMTP_USERNAME and SMTP_PASSWORD:
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(message)
        return True
    except OSError as error:
        logger.error("Could not send password reset email: %s", error)
        return False