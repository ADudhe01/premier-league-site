// src/components/Teams.jsx
import React, { useEffect, useState } from "react";
import { fetchTeams } from "../api";

export default function Teams() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchTeams()
      .then((d) => {
        if (!mounted) return;
        setData(d);
      })
      .catch((e) => setErr(e.message));
    return () => (mounted = false);
  }, []);

  if (err) return <div className="error">Error: {err}</div>;
  if (!data) return <div className="loading">Loading teams…</div>;

  const teams = data.teams || [];

  return (
    <section className="teams-card">
      <h3>Premier League Teams</h3>
      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-item">
            <img
              src={team.crest || team.crestUrl}
              alt={`${team.name} crest`}
              className="team-crest"
            />
            <span className="team-name">{team.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

