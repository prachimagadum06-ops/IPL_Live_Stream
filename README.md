# IPL Live Streaming Platform

A comprehensive web application for Indian Premier League (IPL) cricket fans to watch live matches, track scores, view team information, and explore historical data.

## Features

- **Live Streaming**: Watch IPL matches with an integrated HLS player
- **Live Scores**: Real-time match statistics and scoring updates
- **Team Profiles**: Detailed information about all IPL teams including owners, captains, key players, and home grounds
- **Match Schedule**: Complete fixture list for the IPL 2025 season with venue details
- **Points Table**: Up-to-date standings of all teams in the tournament
- **Historical Data**: Past winners and tournament statistics

## Technologies

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Video Streaming**: HLS.js
- **Visualizations**: Chart.js
- **Design**: Bootstrap 5 with custom theming
- **Icons**: Font Awesome

## 🏏 Main Page - Live Scores, Points Table & Upcoming Matches  
The home page provides a comprehensive dashboard with **live scores, points table, upcoming matches, and IPL 2025 teams** in a well-structured UI.  

![Main Page - Live Scores, Points Table, Upcoming Matches](https://github.com/user-attachments/assets/9d0f3130-9e36-4e92-8d28-e2eb8bc21263)
*Figure 1: Home page displaying real-time IPL updates and team details*  

## 🎥 IPL Live Streaming & Match Details  
The **streaming page** offers **ad-free live streaming**, along with live match details and user comments.  

![IPL Live Stream & Match Details](https://github.com/user-attachments/assets/2bef5db7-5125-42be-899a-81e0039e30be)  
*Figure 2: Watch live IPL matches with real-time comments and match stats*  

## 🔍 Team Details - Mumbai Indians & Chennai Super Kings  
Detailed team pages showcasing squad, ownership, coach, captain, and home ground information for all IPL teams.  
**Example screenshots for MI & CSK:**  

### **Mumbai Indians (MI)**
![Mumbai Indians Team Details](https://github.com/user-attachments/assets/8df2aee3-d530-4075-be77-882f79c5848f)  
*Figure 3: MI team details, including squad, ownership, and home ground*  

### **Chennai Super Kings (CSK)**
![Chennai Super Kings Team Details](https://github.com/user-attachments/assets/d758cae1-6949-41f9-989a-39cbce31b18a)  
*Figure 4: CSK team details with full roster and management info*  

## 🏆 IPL Championship History & Most Valuable Players  
A historical record of **IPL winners, MVPs, and key milestones** from **2008 to 2024**, including the timeline of major IPL moments.  

![IPL History & MVPs](https://github.com/user-attachments/assets/cf4d5762-0d25-4ac3-922f-f417a03ab534)  
*Figure 5: IPL winners timeline and most valuable players over the years*  

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/cu-sanjay/Cricket-Streaming
   cd Cricket-Streaming
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the application:
   ```
   python main.py
   ```

4. Visit `http://localhost:5000` in your browser

### MongoDB (optional)

Set these environment variables before starting the app to persist the stream URL in MongoDB:

```powershell
$env:MONGODB_URI = "mongodb+srv://<user>:<password>@<cluster>/<database>"
$env:MONGODB_DATABASE = "ipl_streaming"
python main.py
```

The app also loads a local `.env` file and accepts either `MONGODB_URI` or `MONGO_URI`.

The connection status is available at `/api/mongodb/status`. Without `MONGODB_URI`, the app continues using its local in-memory stream setting.

### Authentication

- Register: `/register`
- Login: `/login`
- Logout: `POST /logout`
- Forgot password: `/forgot-password`
- Reset password: `/reset-password?token=...`

User accounts are stored in MongoDB with hashed passwords in the `users` collection.
Password reset emails require `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, and `SMTP_FROM` in `.env`. Reset tokens expire after 30 minutes.

## API Integration

The application fetches data from multiple endpoints:
- Live Scores: `/api/live-score`
- Match Schedule: `/api/schedule`
- Points Table: `/api/points-table`
- Historical Winners: `/api/winners`

## Responsive Design

The platform is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones

## Team Branding

Each IPL team is represented with:
- Official team colors
- SVG team logos
- Consistent visual identity throughout the application

## Future Enhancements

- User authentication and personalized experiences
- Fantasy cricket integration
- Advanced statistics and player performance metrics
- Live chat and social features
- Multi-language support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- IPL for the inspiration
- Cricket data providers
- Open-source community for the excellent libraries and tools
