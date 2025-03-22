import os
import requests
import logging
from flask import Flask, render_template, jsonify, request

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "ipl-streaming-secret")

# Base API URL
API_BASE_URL = "https://ipl-okn0.onrender.com"

# Default streaming URL (to be updated dynamically)
DEFAULT_STREAM_URL = ""

@app.route('/')
def index():
    """Render the home page."""
    return render_template('index.html')

@app.route('/streaming')
def streaming():
    """Render the streaming page."""
    stream_url = request.args.get('stream_url', DEFAULT_STREAM_URL)
    return render_template('streaming.html', stream_url=stream_url)

@app.route('/teams')
def teams():
    """Render the teams page."""
    return render_template('teams.html')

@app.route('/schedule')
def schedule():
    """Render the schedule page."""
    return render_template('schedule.html')

@app.route('/points-table')
def points_table():
    """Render the points table page."""
    return render_template('points-table.html')

@app.route('/winners')
def winners():
    """Render the historical winners page."""
    return render_template('winners.html')

@app.route('/api/schedule')
def get_schedule():
    """Proxy for the schedule API endpoint."""
    try:
        response = requests.get(f"{API_BASE_URL}/ipl-2025-schedule")
        return jsonify(response.json())
    except Exception as e:
        logger.error(f"Error fetching schedule: {str(e)}")
        return jsonify({"status_code": 500, "error": "Failed to fetch schedule data"})

@app.route('/api/points-table')
def get_points_table():
    """Proxy for the points table API endpoint."""
    try:
        response = requests.get(f"{API_BASE_URL}/ipl-2025-points-table")
        return jsonify(response.json())
    except Exception as e:
        logger.error(f"Error fetching points table: {str(e)}")
        return jsonify({"status_code": 500, "error": "Failed to fetch points table data"})

@app.route('/api/live-score')
def get_live_score():
    """Proxy for the live score API endpoint."""
    try:
        response = requests.get(f"{API_BASE_URL}/ipl-2025-live-score")
        return jsonify(response.json())
    except Exception as e:
        logger.error(f"Error fetching live score: {str(e)}")
        return jsonify({"status_code": 500, "error": "Failed to fetch live score data"})

@app.route('/api/winners')
def get_winners():
    """Proxy for the winners API endpoint."""
    try:
        response = requests.get(f"{API_BASE_URL}/ipl-winners")
        return jsonify(response.json())
    except Exception as e:
        logger.error(f"Error fetching winners: {str(e)}")
        return jsonify({"status_code": 500, "error": "Failed to fetch winners data"})

@app.route('/set-stream', methods=['POST'])
def set_stream():
    """Set the streaming URL (for admin use)."""
    global DEFAULT_STREAM_URL
    data = request.json
    if 'url' in data:
        DEFAULT_STREAM_URL = data['url']
        return jsonify({"status": "success", "message": "Stream URL updated"})
    return jsonify({"status": "error", "message": "Invalid request"})

@app.route('/api/stream-url')
def get_stream_url():
    """Get the current streaming URL."""
    return jsonify({"status": "success", "url": DEFAULT_STREAM_URL})

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors."""
    return render_template('index.html'), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors."""
    return jsonify({"status_code": 500, "error": "Internal server error"}), 500
