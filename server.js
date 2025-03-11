const express = require('express');
const path = require('path');
const inboundCallActivity = require('./activity/app/app');

const app = express();

// Middleware
app.use(express.json());

// Serve Static Files
app.use('/activity/html', express.static(path.join(__dirname, 'activity/html')));
app.use('/activity/config', express.static(path.join(__dirname, 'activity/config')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Route for Config JSON
app.get('/activity/config/config-json.js', (req, res) => {
    const configJSON = require('./activity/config/config-json.js');
    res.status(200).json(configJSON(req));
});

// Initialize SFMC Inbound Call Activity
inboundCallActivity(app, { rootDirectory: __dirname });

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
