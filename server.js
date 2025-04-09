const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const LAMBDA_BASE_URL = "https://7a66a5m3s5fum5krjut3ltbv640iyohp.lambda-url.eu-central-1.on.aws/";

app.use(cors());
app.use(express.json());

// Root route – Welcome message
app.get("/", (req, res) => {
  res.send("Welcome to the Instagram Proxy Server!");
});

// General route: /api/instagram/:metric (e.g. /api/instagram/reach)
app.get("/api/instagram/:metric", async (req, res) => {
  const metric = req.params.metric;
  const period = req.query.period || "day";
  const since = req.query.since;
  const until = req.query.until;

  try {
    const response = await axios.get(`${LAMBDA_BASE_URL}ig-user-insights`, {
      params: { metric, period, since, until },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data", detail: err.message });
  }
});

// Direct Meta API route (for BASE44 and manual calls)
app.get("/ig-user-insights", async (req, res) => {
  try {
    console.log("↪️ Received request to /ig-user-insights");
    console.log("Query params:", req.query);

    const { metric, period, since, until } = req.query;

    if (!metric || !period) {
      console.error("❌ Missing required query parameters: metric or period");
      return res.status(400).json({ error: "Missing required query parameters: metric or period" });
    }

    const token = process.env.IG_ACCESS_TOKEN;
    if (!token) {
      console.error("❌ Missing IG_ACCESS_TOKEN");
      return res.status(500).json({ error: "Missing access token" });
    }

    const igUserId = "17841400020917423";
    let url = `https://graph.facebook.com/v18.0/${igUserId}/insights?metric=${metric}&period=${period}&access_token=${token}`;
    if (since) url += `&since=${since}`;
    if (until) url += `&until=${until}`;

    const response = await axios.get(url);
    console.log("✅ Data fetched successfully from Meta");
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error in /ig-user-insights:", err.message);
    if (err.response?.data) {
      console.error("📄 Meta API Error:", JSON.stringify(err.response.data, null, 2));
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Optional: fallback proxy to Lambda for /ig-user-insights (if needed)
app.get("/proxy-lambda/ig-user-insights", async (req, res) => {
  try {
    const response = await axios.get(`${LAMBDA_BASE_URL}ig-user-insights`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to proxy to Lambda", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});
