const express = require('express');
const app = express();
const inboundCallActivity = require('./activity/app/app');

// Middleware (optional)
app.use(express.json());

// Initialize the Inbound Call Activity
inboundCallActivity(app, { rootDirectory: __dirname });

// Start server on port 3000 (or another port)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
