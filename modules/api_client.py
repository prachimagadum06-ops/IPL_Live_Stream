import logging

import requests

from modules.config import API_BASE_URL, REQUEST_TIMEOUT

logger = logging.getLogger(__name__)


def fetch_json(endpoint):
    """Fetch one upstream JSON endpoint and raise on transport failures."""
    response = requests.get(f"{API_BASE_URL}/{endpoint}", timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    return response.json()
