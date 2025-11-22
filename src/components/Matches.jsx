// src/components/Matches.jsx
import React, { useEffect, useState } from "react";
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

export default function Matches() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMatches = (useCache = true) => {
    setLoading(true);
    fetchMatches("?status=SCHEDULED&limit=10", useCache)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Load immediately (use cache if available)
    loadMatches(true);

    // Check if we should set up auto-refresh
    const checkAndRefresh = () => {
      const matches = data?.matches || [];
      if (hasActiveMatches(matches)) {
        // Only refresh if there are active matches
        loadMatches(false); // Bypass cache for refresh
      }
    };

    // Check every hour (3600000 ms) if we should refresh
    const interval = setInterval(() => {
      if (data) {
        checkAndRefresh();
      }
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, [data]);

  if (loading && !data) return <div>Loading matches…</div>;
  const matches = data?.matches || [];
  return (
    <section className="matches-card">
      <h3>Upcoming Matches</h3>
      {loading && data && <div className="refreshing">Refreshing...</div>}
      <ul>
        {matches.map((m) => (
          <li key={m.id}>
            <div className="match-row">
              <span>{new Date(m.utcDate).toLocaleString()}</span>
              <span>
                {m.homeTeam.name} — {m.awayTeam.name}
              </span>
              <span className={`status-${m.status.toLowerCase()}`}>{m.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
