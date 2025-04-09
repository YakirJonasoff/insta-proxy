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

// General proxy route: /api/instagram/:metric → Lambda
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
    console.error("❌ Error proxying to Lambda:", err.message);
    res.status(500).json({ error: "Failed to fetch data", detail: err.message });
  }
});

// Main route: /ig-user-insights → Proxy to Lambda
app.get("/ig-user-insights", async (req, res) => {
  try {
    console.log("↪️ Proxying /ig-user-insights to Lambda");
    console.log("Query params:", req.query);

    const response = await axios.get(`${LAMBDA_BASE_URL}ig-user-insights`, {
      params: req.query,
    });

    res.json(response.data);
  } catch (err) {
    console.error("❌ Lambda proxy error:", err.message);
    res.status(500).json({ error: "Failed to proxy to Lambda", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});
