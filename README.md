# ⚽ Premier League Dashboard

A modern, responsive React dashboard for tracking Premier League standings, live matches, and team information. Built with React 19, Vite, and Express.js, featuring real-time match updates and smart API caching to minimize requests.

![Premier League Dashboard](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?logo=vite)
![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express)

## ✨ Features

- **📊 Standings Table**: View current Premier League table with team positions, points, wins, draws, and losses
- **⚽ Match Tracking**: Browse upcoming, live, and finished matches with detailed information
- **👥 Team Directory**: See all Premier League teams with official crests and information
- **🔄 Smart Auto-refresh**: Matches update automatically every hour when matches are active (live or starting soon)
- **💾 API Caching**: Intelligent caching system to minimize API calls and stay within rate limits
- **📱 Responsive Design**: Fully responsive design that works on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Beautiful gradient-based design with Premier League color scheme

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A free API token from [football-data.org](https://www.football-data.org/client/register)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ADudhe01/premier-league-site.git
   cd premier-league-site
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Get API Token**
   - Visit [football-data.org](https://www.football-data.org/client/register)
   - Create a free account
   - Copy your API token

4. **Configure Environment Variables**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Open `server/.env` and add your token:
   ```env
   FOOTBALL_DATA_TOKEN=your_actual_token_here
   ```

5. **Run the Application**
   ```bash
   npm run dev
   ```

   This starts both servers concurrently:
   - **Frontend**: http://localhost:5173 (or the port Vite assigns)
   - **Backend API**: http://localhost:4000

## 📁 Project Structure

```
premier-league-site/
├── public/                 # Static assets
│   ├── favicon.png        # App favicon
│   └── vite.svg
├── server/                # Express backend
│   ├── server.js          # API proxy server
│   ├── package.json
│   └── .env              # Environment variables (not in git)
├── src/
│   ├── assets/           # Images and assets
│   │   └── image.png     # Premier League logo
│   ├── components/       # React components
│   │   ├── Matches.jsx   # Dashboard matches widget
│   │   ├── MatchesPage.jsx # Full matches page
│   │   ├── Standings.jsx # Standings table
│   │   └── Teams.jsx     # Teams grid
│   ├── api.js            # API client with caching
│   ├── App.jsx           # Main app component
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 🛠️ Tech Stack

- **Frontend**:
  - React 19.1.1
  - Vite 5.4.10
  - React Router DOM 7.9.4
  - Modern CSS with CSS Variables

- **Backend**:
  - Express.js 5.1.0
  - Node-fetch 3.3.2
  - CORS 2.8.5
  - dotenv 17.2.3

- **API**:
  - [football-data.org API](https://www.football-data.org/) (v4)

## 📝 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the Vite frontend server
- `npm run dev:server` - Start only the Express backend server
- `npm run build` - Build the production-ready frontend
- `npm run preview` - Preview the production build

## 🎯 Features in Detail

### Smart Caching System
The app uses localStorage to cache API responses, reducing the number of API calls:
- Initial loads use cached data when available
- Automatic refresh only occurs when matches are active
- Manual refresh bypasses cache for fresh data

### Auto-Refresh Logic
- Checks every hour for active matches
- Only refreshes if there are:
  - Live matches (IN_PLAY status)
  - Upcoming matches starting within 3 hours
- Otherwise, stays idle to conserve API quota

### Responsive Design
- Desktop: 2-column grid layout for standings and teams
- Tablet: Single column with optimized spacing
- Mobile: Stacked layout with touch-friendly interactions

## 🔧 Configuration

### Environment Variables

Create a `server/.env` file with:

```env
FOOTBALL_DATA_TOKEN=your_api_token_here
PORT=4000  # Optional, defaults to 4000
```

### API Base URL

The frontend uses `VITE_API_BASE` environment variable (defaults to `http://localhost:4000`).

## 📱 Screenshots

The dashboard features:
- Dark theme with Premier League color scheme
- Gradient backgrounds
- Smooth animations and transitions
- Team crests and match information
- Real-time match status indicators

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Data provided by [football-data.org](https://www.football-data.org/)
- Premier League official branding and colors

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ⚽ and ❤️ for Premier League fans
