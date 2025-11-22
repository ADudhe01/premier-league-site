// src/components/Standings.jsx
import React, { useEffect, useState } from "react";
import { fetchStandings } from "../api";

export default function Standings() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    let mounted = true;
    fetchStandings()
      .then((d) => {
        if (!mounted) return;
        setData(d);
      })
      .catch((e) => setErr(e.message));
    return () => (mounted = false);
  }, []);

  if (err) return <div className="error">Error: {err}</div>;
  if (!data) return <div className="loading">Loading standings…</div>;

  // doc: standings are under data.standings[].table
  const table = data.standings.find((s) => s.type === "TOTAL")?.table || [];
  return (
    <section className="standings-card">
      <h2>Premier League — Standings</h2>
      <table className="table-standings">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>GP</th>
            <th>Pts</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row) => (
            <tr key={row.team.id}>
              <td>{row.position}</td>
              <td className="team-cell">
                <img
                  src={row.team.crest || row.team.crestUrl}
                  alt=""
                  className="crest"
                />
                {row.team.name}
              </td>
              <td>{row.playedGames}</td>
              <td>{row.points}</td>
              <td>{row.won}</td>
              <td>{row.draw}</td>
              <td>{row.lost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
