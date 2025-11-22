// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // store token in .env as FOOTBALL_DATA_TOKEN

const app = express();
app.use(cors());
app.use(express.json());

const API_BASE = "https://api.football-data.org/v4"; // v4 preferred
const TOKEN = process.env.FOOTBALL_DATA_TOKEN;

if (!TOKEN) {
  console.warn("⚠️  WARNING: FOOTBALL_DATA_TOKEN is not set. API calls will fail.");
  console.warn("   Create a .env file in the server/ directory with: FOOTBALL_DATA_TOKEN=your_token_here");
}

// simple forward helper
async function forward(reqPath) {
  if (!TOKEN) {
    throw new Error("API token is missing. Please set FOOTBALL_DATA_TOKEN in your .env file.");
  }
  const res = await fetch(`${API_BASE}${reqPath}`, {
    headers: { "X-Auth-Token": TOKEN },
  });
  if (!res.ok) {
    const text = await res.text();
    let errorMsg = `Upstream error ${res.status}: ${text}`;
    try {
      const errorJson = JSON.parse(text);
      if (errorJson.message) {
        errorMsg = errorJson.message;
      }
    } catch {
      // Use the text as-is if not JSON
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

// Example endpoints
app.get("/api/standings", async (req, res) => {
  // PL code is "PL"
  try {
    const data = await forward("/competitions/PL/standings");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/matches", async (req, res) => {
  // pass optional matchday/query params from client as needed
  const q = req.url.replace("/api/matches", "") || "";
  try {
    const data = await forward(`/competitions/PL/matches${q}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/teams", async (req, res) => {
  try {
    const data = await forward("/competitions/PL/teams");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Proxy listening on ${PORT}`));
