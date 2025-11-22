// src/api.js
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000"; // Default to server port

async function getJSON(path, useCache = true, cacheKey = null) {
  const url = `${BASE}/api${path}`;
  cacheKey = cacheKey || url;
  if (useCache) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  }
  const res = await fetch(url);
  if (!res.ok) {
    let errorMessage = "Network error";
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      errorMessage = `Network error: ${res.status} ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }
  const json = await res.json();
  if (useCache) {
    localStorage.setItem(cacheKey, JSON.stringify(json));
  }
  return json;
}

export function fetchStandings(useCache = true) {
  return getJSON("/standings", useCache, "pl-standings");
}
export function fetchMatches(query = "", useCache = true) {
  return getJSON(`/matches${query}`, useCache, `pl-matches${query}`);
}
export function fetchTeams(useCache = true) {
  return getJSON("/teams", useCache, "pl-teams");
}
