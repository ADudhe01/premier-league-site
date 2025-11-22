import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Standings from "./components/Standings";
import Matches from "./components/Matches";
import MatchesPage from "./components/MatchesPage";
import Teams from "./components/Teams";
import logoImage from "./assets/image.png";
import "./index.css";

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="navigation">
      <Link 
        to="/" 
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        🏠 Dashboard
      </Link>
      <Link 
        to="/matches" 
        className={`nav-link ${location.pathname === '/matches' ? 'active' : ''}`}
      >
        ⚽ Matches
      </Link>
    </nav>
  );
}

function Dashboard() {
  return (
    <main className="app-main">
      <section className="main-content">
        <Standings />
      </section>

      <aside className="sidebar">
        <Teams />
      </aside>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>
            <img src={logoImage} alt="Premier League" className="header-logo" />
            Premier League Dashboard
          </h1>
          <Navigation />
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/matches" element={<MatchesPage />} />
        </Routes>

        <footer className="app-footer">
          <p>
            Data from{" "}
            <a
              href="https://www.football-data.org/"
              target="_blank"
              rel="noreferrer"
            >
              football-data.org
            </a>
          </p>
        </footer>
      </div>
    </Router>
  );
}
