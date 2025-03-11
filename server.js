const express = require('express');
const path = require('path');
const inboundCallActivity = require('./activity/app/app');

const app = express();
const cors = require('cors'); // Import CORS

app.use(cors()); // Allow all origins


app.use(express.json());
inboundCallActivity(app, { rootDirectory: __dirname });

//  Correctly serve static files from "activity"
app.use('/activity/html', express.static(path.join(__dirname, 'activity/html')));
app.use('/activity/config', express.static(path.join(__dirname, 'activity/config')));
app.use('/activity/src', express.static(path.join(__dirname, 'activity/src')));

//  Ensure `/config-json.js` is accessible
app.get('/activity/config/config-json.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'activity/config/config-json.js'));
});


app.get("/config.json", (req, res) => {
    res.sendFile(path.join(__dirname, "activity/config/config-json.json"));
});


//config.js
app.get("/config.js", (req, res) => {
    res.sendFile(path.join(__dirname, "activity/config/config-json.js"));
});

// Serve index.html properly
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'activity/html/index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
