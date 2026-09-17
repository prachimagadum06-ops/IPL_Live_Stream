import os

from dotenv import load_dotenv

load_dotenv()

API_BASE_URL = os.environ.get("API_BASE_URL", "https://ipl-okn0.onrender.com")
DEFAULT_STREAM_URL = os.environ.get("DEFAULT_STREAM_URL", "")
SESSION_SECRET = os.environ.get("SESSION_SECRET", "ipl-streaming-secret")
REQUEST_TIMEOUT = float(os.environ.get("API_REQUEST_TIMEOUT", "10"))
MONGODB_URI = os.environ.get("MONGODB_URI") or os.environ.get("MONGO_URI", "")
MONGODB_DATABASE = os.environ.get("MONGODB_DATABASE", "ipl_streaming")
SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USERNAME = os.environ.get("SMTP_USERNAME", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM = os.environ.get("SMTP_FROM", SMTP_USERNAME)
PASSWORD_RESET_BASE_URL = os.environ.get("PASSWORD_RESET_BASE_URL", "")
