const express = require('express');
const path = require('path');
const inboundCallActivity = require('./activity/app/app');

const app = express();

// Middleware
app.use(express.json());
inboundCallActivity(app, { rootDirectory: __dirname });

//  Correct Static File Paths Based on Your Folder Structure
app.use('/activity/html', express.static(path.join(__dirname, 'activity/html')));
app.use('/activity/config', express.static(path.join(__dirname, 'activity/config')));
app.use('/activity/src', express.static(path.join(__dirname, 'activity/src')));

//  Ensure `/config-json.js` Serves Correctly
app.get('/activity/config/config-json.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'activity/config/config-json.js'));
});

//  Ensure index.html is served correctly
app.get('/activity/html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'activity/html/index.html'));
});

//  Default Route to Confirm Server is Running
app.get('/', (req, res) => {
    res.send(" Server is running and serving static files!");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
