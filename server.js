const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const LAMBDA_BASE_URL = "https://7a66a5m3s5fum5krjut3ltbv640iyohp.lambda-url.eu-central-1.on.aws/";

// הגדרת נתיב root
app.get("/", (req, res) => {
  res.send("Welcome to the Instagram Proxy Server!");
});

// תיקון הנתיב כאן
app.get("/api/instagram/:metric", async (req, res) => {
  const metric = req.params.metric;
  const period = req.query.period || "day";

  try {
    const response = await axios.get(`${LAMBDA_BASE_URL}ig-user-insights`, {
      params: {
        metric,
        period,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

