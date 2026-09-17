# IPL Live Streaming Platform

A Flask-based IPL cricket dashboard for live match viewing, scores, schedules, points tables, team profiles, historical winners, and user authentication.

## What The System Does

The application provides:

- Protected IPL home dashboard
- User registration, login, logout, and password reset
- MongoDB-backed user accounts and stream settings
- Live match score integration through an external cricket API
- IPL match schedule with local fallback data
- Points table with team performance charts
- Team profiles with included SVG team logos
- IPL winners and championship history
- Live match video embed
- Responsive Bootstrap interface

Users must log in before opening the main website. Login, registration, forgot-password, reset-password, static assets, and logout remain accessible without an active session.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Backend | Python, Flask |
| Routing | Flask Blueprints |
| Database | MongoDB Atlas with PyMongo |
| Authentication | Flask sessions and Werkzeug password hashing |
| Frontend | HTML, CSS, vanilla JavaScript |
| UI | Bootstrap 5 and Font Awesome |
| Charts | Chart.js |
| Video | YouTube embedded match video |
| External data | IPL cricket API through Flask proxy routes |

## System Architecture

```mermaid
flowchart TD
    Browser[User Browser]
    Flask[Flask Application]
    Auth[Authentication Controllers]
    Pages[Page Controllers]
    APIs[API Controllers]
    Mongo[(MongoDB Atlas)]
    Cricket[External Cricket API]
    Static[Static Assets]

    Browser --> Flask
    Flask --> Auth
    Flask --> Pages
    Flask --> APIs
    Flask --> Static
    Auth --> Mongo
    APIs --> Cricket
    APIs --> Static
    Auth --> Pages
```

## Application Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Flask
    participant MongoDB
    participant CricketAPI

    User->>Browser: Open website
    Browser->>Flask: GET /
    Flask-->>Browser: Redirect to /login if unauthenticated
    User->>Browser: Submit login form
    Browser->>Flask: POST /login
    Flask->>MongoDB: Find user by email
    MongoDB-->>Flask: Hashed password record
    Flask-->>Browser: Create session and redirect home
    Browser->>Flask: Request dashboard data
    Flask->>CricketAPI: Request score, schedule, or standings
    CricketAPI-->>Flask: JSON response
    Flask-->>Browser: JSON data for UI rendering
```

## Project Structure

```text
.
|-- app.py                         Flask app factory and blueprint registration
|-- main.py                        Development server entrypoint
|-- controllers/
|   |-- api_controller.py          External API and local fallback responses
|   |-- auth_controller.py         Login, registration, logout, password reset
|   |-- page_controller.py         HTML page controllers
|   `-- stream_controller.py       Stream URL persistence and Mongo status
|-- routes/
|   |-- api_routes.py              /api routes
|   |-- auth_routes.py             Authentication routes
|   |-- page_routes.py             Browser page routes
|   `-- stream_routes.py            Stream administration routes
|-- modules/
|   |-- api_client.py              External API client
|   |-- auth.py                    User and password-reset operations
|   |-- config.py                  Environment configuration
|   |-- mailer.py                  Optional SMTP reset email sender
|   |-- mongodb.py                 MongoDB client and persistence helpers
|   |-- points_data.py              Local points-table fallback
|   |-- schedule_data.py            Local schedule fallback
|   |-- team_data.py                Team directory data
|-- templates/                     Jinja HTML templates
|-- static/
|   |-- css/style.css              Application styles
|   |-- js/                        Frontend behavior and charts
|   `-- logos/                     Included IPL team SVG logos
|-- requirements.txt               Python dependencies
|-- .env                           Local secrets; do not commit
`-- README1.md                     Project documentation
```

## Routes

### Public Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/login` | Login form |
| GET/POST | `/register` | Create a user account |
| GET/POST | `/forgot-password` | Request password reset |
| GET/POST | `/reset-password?token=...` | Set a new password |
| POST | `/logout` | End the current session |
| GET | `/static/...` | CSS, JavaScript, logos, and assets |

### Authenticated Page Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/` | IPL home dashboard |
| GET | `/streaming` | Live match video and score details |
| GET | `/schedule` | Match schedule, times, venues, and logos |
| GET | `/points-table` | Standings and performance charts |
| GET | `/teams` | Team cards and squad details |
| GET | `/winners` | IPL championship history |

### API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/teams` | Team directory |
| GET | `/api/schedule` | Schedule data |
| GET | `/api/points-table` | Standings data |
| GET | `/api/live-score` | Current live score |
| GET | `/api/winners` | Historical winners |
| GET | `/api/stream-url` | Current configured stream URL |
| GET | `/api/mongodb/status` | MongoDB connection health |
| POST | `/set-stream` | Save a stream URL |

## Authentication

1. A visitor opens `/`.
2. Flask checks for `session['user']`.
3. If no session exists, Flask redirects to `/login`.
4. The user registers or logs in.
5. The password is checked against a Werkzeug password hash in MongoDB.
6. Flask stores a small user object in the signed session cookie.
7. The user can access the dashboard and IPL pages.
8. Logout removes the session.

Passwords are never stored as plain text.

### Password Reset

- Reset tokens are generated with a cryptographically secure random generator.
- Only a SHA-256 hash of the token is stored in MongoDB.
- Tokens expire after 30 minutes.
- Tokens are cleared after successful use.
- SMTP is optional. Without SMTP variables, the request remains generic but no email can be delivered.

## MongoDB Design

This project uses **MongoDB Atlas**, not AWS RDS. MongoDB is a document database, while Amazon RDS is a managed relational database service for engines such as PostgreSQL or MySQL.

The configured database is normally `ipl_streaming`.

### Collections

#### `users`

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password_hash": "werkzeug-generated-hash",
  "reset_token_hash": "optional-sha256-token-hash",
  "reset_expires_at": "optional-expiration-date"
}
```

#### `stream_settings`

```json
{
  "_id": "default",
  "url": "https://example.com/live.m3u8"
}
```

### MongoDB Connection Diagram

```mermaid
erDiagram
    USERS {
        object_id _id
        string name
        string email
        string password_hash
        string reset_token_hash
        datetime reset_expires_at
    }

    STREAM_SETTINGS {
        string _id
        string url
    }
```

## Configuration

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
MONGODB_DATABASE=ipl_streaming
SESSION_SECRET=replace-with-a-long-random-secret

# Optional external cricket API
API_BASE_URL=https://ipl-okn0.onrender.com
API_REQUEST_TIMEOUT=10

# Optional password-reset email delivery
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=your-email@example.com
PASSWORD_RESET_BASE_URL=http://127.0.0.1:5000
```

Never commit `.env` to source control. It is protected by `.gitignore`.

## Installation

### 1. Create or activate the virtual environment

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\venv\Scripts\Activate.ps1
```

### 2. Install dependencies

```powershell
python -m pip install -r requirements.txt
```

### 3. Configure MongoDB

Add the MongoDB URI and database name to `.env`.

### 4. Start the application

```powershell
python main.py
```

### 5. Open the website

```text
http://127.0.0.1:5000/login
```

## Data Fallback Behavior

The app prefers live external API data when it is available.

If the external service is empty or unavailable:

- Schedule uses `modules/schedule_data.py`.
- Points table uses `modules/points_data.py`.
- Team data uses `modules/team_data.py`.
- Mongo-backed settings use local fallback behavior when MongoDB is not configured.

This keeps the interface usable during API outages or local development.

## Page Behavior

### Home Dashboard

Shows:

- Current live score state
- Circular cricket dashboard image
- Points table preview
- Upcoming matches
- Team showcase with SVG logos

### Live Match Page

Shows:

- Embedded IPL match video
- Live match score details
- Run-rate information when available
- Team logos for live teams
- Live comments placeholder

### Schedule Page

Shows:

- Monthly schedule tabs
- Match date and scheduled time
- Team names and included SVG logos
- Venue
- Link to the live match page

### Points Table

Shows:

- Position
- Team logo and name
- Matches, wins, losses, ties, no-results
- Points and net run rate
- Points performance chart
- Win/loss chart

### Teams Page

Shows:

- All IPL team cards
- Included team SVG logos
- Owner, coach, captain, home ground, and titles
- Team details modal
- Key player list

### Winners Page

Shows:

- Historical IPL champions
- Runner-ups
- Match result and venue
- Winner logos when an included SVG asset exists
- Title-count chart
- MVP section and IPL timeline

## Screenshots

The existing project screenshots can be viewed from the original project documentation:

- [Home dashboard screenshot](https://github.com/user-attachments/assets/9d0f3130-9e36-4e92-8d28-e2eb8bc21263)
- [Live streaming screenshot](https://github.com/user-attachments/assets/2bef5db7-5125-42be-899a-81e0039e30be)
- [Mumbai Indians team screenshot](https://github.com/user-attachments/assets/8df2aee3-d530-4075-be77-882f79c5848f)
- [Chennai Super Kings team screenshot](https://github.com/user-attachments/assets/d758cae1-6949-41f9-989a-39cbce31b18a)
- [IPL history screenshot](https://github.com/user-attachments/assets/cf4d5762-0d25-4ac3-922f-f417a03ab534)

Recommended local screenshots to capture:

```text
screenshots/login.png
screenshots/home.png
screenshots/streaming.png
screenshots/schedule.png
screenshots/points-table.png
screenshots/teams.png
screenshots/winners.png
```

## Security Notes

- Keep `.env` private.
- Use a strong random `SESSION_SECRET` in production.
- Use HTTPS in production.
- Use a restricted MongoDB database user instead of an administrator account.
- Add the production server IP to the MongoDB Atlas network access list.
- Configure SMTP credentials through environment variables only.
- Use a production WSGI server instead of Flask debug mode.
- Do not expose `/set-stream` publicly without admin authorization.
- Add CSRF protection before deploying authentication publicly.

## Production Deployment Checklist

- [ ] Set `SESSION_SECRET` to a strong random value.
- [ ] Configure `MONGO_URI` or `MONGODB_URI`.
- [ ] Configure MongoDB Atlas network access.
- [ ] Create a restricted MongoDB user.
- [ ] Configure SMTP for password reset messages.
- [ ] Set `PASSWORD_RESET_BASE_URL` to the production HTTPS domain.
- [ ] Disable Flask debug mode.
- [ ] Run behind Gunicorn, Waitress, or another production WSGI server.
- [ ] Add HTTPS and secure cookie settings.
- [ ] Protect stream administration with authorization.
- [ ] Capture and attach fresh production screenshots.

## License

See [LICENSE](LICENSE).
