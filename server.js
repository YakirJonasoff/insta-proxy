const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// כאן תשים את ה־URL של Lambda שלך
const LAMBDA_BASE_URL = "https://7a66a5m3s5fum5krjut31tbv640iyohp.lambda-url.eu-central-1.on.aws/";

app.get("/", (req, res) => {
res.send("Welcome to the Instagram Proxy Server!");
});

app.get(/api/instagram/:metric", async (req, res) => {
// הגדרת endpoint עבור Instagram metrics
app.get("/api/instagram/:metric", async (req, res) => {
    const metric = req.params.metric; // metric שנשלח בבקשה
    const period = req.query.period || "day"; // תקופת הזמן, ברירת מחדל היא "day"

    try {
        const response = await axios.get(`${LAMBDA_BASE_URL}ig-user-insights`, {
            params: {
                metric,
                period,
            },
        });
        res.json(response.data); // מחזיר את הנתונים שהתקבלו מ־Lambda
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch data", detail: err.message }); // אם הייתה שגיאה בבקשה
    }
});

// שרת מאזין בפורט 3000
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
