import React, { useEffect, useState, useRef } from "react";
import { fetchMatches } from "../api";

// Check if there are active matches (live or starting within next 3 hours)
const hasActiveMatches = (matches) => {
  if (!matches || matches.length === 0) return false;
  
  const now = new Date();
  const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  
  return matches.some((match) => {
    const matchDate = new Date(match.utcDate);
    // Active if live, or scheduled within next 3 hours
    return match.status === "IN_PLAY" || 
           match.status === "LIVE" ||
           (match.status === "SCHEDULED" && matchDate <= threeHoursFromNow);
  });
};

export default function MatchesPage() {
  const [matches, setMatches] = useState({
    upcoming: [],
    finished: [],
    live: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const matchesRef = useRef({ upcoming: [], finished: [], live: [] });

  useEffect(() => {
    const loadMatches = async (useCache = true) => {
      try {
        setLoading(true);

        // Fetch different types of matches (use cache by default to save API calls)
        const [upcomingData, finishedData, liveData] = await Promise.all([
          fetchMatches("?status=SCHEDULED&limit=20", useCache),
          fetchMatches("?status=FINISHED&limit=20", useCache),
          fetchMatches("?status=IN_PLAY&limit=10", useCache),
        ]);

        const newMatches = {
          upcoming: upcomingData.matches || [],
          finished: finishedData.matches || [],
          live: liveData.matches || [],
        };

        matchesRef.current = newMatches;
        setMatches(newMatches);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Load immediately (use cache if available)
    loadMatches(true);

    // Check every hour if we should refresh (only if there are active matches)
    const interval = setInterval(() => {
      const currentMatches = matchesRef.current;
      const hasLive = currentMatches.live.length > 0;
      const hasActiveUpcoming = hasActiveMatches(currentMatches.upcoming);
      
      // Only refresh if there are live matches or active upcoming matches
      if (hasLive || hasActiveUpcoming) {
        loadMatches(false); // Bypass cache for refresh
      }
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      time: date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getMatchStatusColor = (status) => {
    switch (status) {
      case "FINISHED":
        return "var(--pl-success)";
      case "SCHEDULED":
        return "var(--pl-accent)";
      case "IN_PLAY":
        return "var(--pl-error)";
      case "PAUSED":
        return "var(--pl-warning)";
      default:
        return "var(--pl-text-secondary)";
    }
  };

  const getWinnerClass = (winner, homeTeam, awayTeam) => {
    if (winner === "HOME_TEAM") return "winner-home";
    if (winner === "AWAY_TEAM") return "winner-away";
    return "draw";
  };

  const MatchCard = ({ match }) => {
    const { date, time } = formatDate(match.utcDate);
    const winnerClass = getMatchStatusColor(match.status);

    return (
      <div className="match-card">
        <div className="match-header">
          <div className="match-date">
            <span className="date">{date}</span>
            <span className="time">{time}</span>
          </div>
          <div className="match-status" style={{ color: winnerClass }}>
            {match.status === "IN_PLAY" ? "LIVE" : match.status}
          </div>
          <div className="matchday">Matchday {match.matchday}</div>
        </div>

        <div className="match-teams">
          <div
            className={`team ${
              match.score?.winner === "HOME_TEAM" ? "winner" : ""
            }`}
          >
            <img
              src={match.homeTeam.crest}
              alt={match.homeTeam.name}
              className="team-crest"
            />
            <span className="team-name">{match.homeTeam.shortName}</span>
          </div>

          <div className="vs-divider">
            {match.status === "FINISHED" ? (
              <div className="score-display">
                <div className="full-time">
                  {match.score?.fullTime?.home} - {match.score?.fullTime?.away}
                </div>
                {match.score?.halfTime && (
                  <div className="half-time">
                    HT: {match.score.halfTime.home} -{" "}
                    {match.score.halfTime.away}
                  </div>
                )}
              </div>
            ) : match.status === "IN_PLAY" ? (
              <div className="live-indicator">
                <span className="live-dot"></span>
                LIVE
              </div>
            ) : (
              <span className="vs">VS</span>
            )}
          </div>

          <div
            className={`team ${
              match.score?.winner === "AWAY_TEAM" ? "winner" : ""
            }`}
          >
            <img
              src={match.awayTeam.crest}
              alt={match.awayTeam.name}
              className="team-crest"
            />
            <span className="team-name">{match.awayTeam.shortName}</span>
          </div>
        </div>

        {match.referees && match.referees.length > 0 && (
          <div className="match-referee">
            <span className="referee-label">Referee:</span>
            <span className="referee-name">{match.referees[0].name}</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="loading">Loading matches...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Group matches by matchday (gameweek)
  const groupMatchesByMatchday = (matches) => {
    return matches.reduce((groups, match) => {
      const matchday = match.matchday;
      if (!groups[matchday]) {
        groups[matchday] = [];
      }
      groups[matchday].push(match);
      return groups;
    }, {});
  };

  const currentMatches = matches[activeTab];
  const groupedMatches = groupMatchesByMatchday(currentMatches);

  return (
    <div className="matches-page">
      <div className="page-header">
        <h1>⚽ Premier League Matches</h1>
        <p>Stay updated with all the latest match results and fixtures</p>
      </div>

      <div className="matches-tabs">
        <button
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          📅 Upcoming ({matches.upcoming.length})
        </button>
        <button
          className={`tab ${activeTab === "live" ? "active" : ""}`}
          onClick={() => setActiveTab("live")}
        >
          🔴 Live ({matches.live.length})
        </button>
        <button
          className={`tab ${activeTab === "finished" ? "active" : ""}`}
          onClick={() => setActiveTab("finished")}
        >
          ✅ Finished ({matches.finished.length})
        </button>
      </div>

      {currentMatches.length === 0 ? (
        <div className="no-matches">
          <p>No {activeTab} matches available</p>
        </div>
      ) : (
        <div className="matches-by-matchday">
          {Object.keys(groupedMatches)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((matchday) => (
              <div key={matchday} className="matchday-group">
                <div className="matchday-header">
                  <h3>Matchday {matchday}</h3>
                  <span className="match-count">
                    {groupedMatches[matchday].length} matches
                  </span>
                </div>
                <div className="matches-grid-two-column">
                  {groupedMatches[matchday].map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
