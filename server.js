const express = require('express');
const path = require('path');
const inboundCallActivity = require('./activity/app/app');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static files for the front-end
app.use('/activity/html', express.static(path.join(__dirname, 'activity/html')));
app.use('/activity/app', express.static(path.join(__dirname, 'activity/app')));
app.use('/activity/config', express.static(path.join(__dirname, 'activity/config')));
app.use('/activity/styles', express.static(path.join(__dirname, 'activity/styles')));

// Initialize the Inbound Call Activity
inboundCallActivity(app, { rootDirectory: __dirname });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/activity/html/index.html`);
});




// // const express = require('express');
// // const app = express();
// // const inboundCallActivity = require('./activity/app/app');

// // // Middleware (optional)
// // app.use(express.json());

// // // Initialize the Inbound Call Activity
// // inboundCallActivity(app, { rootDirectory: __dirname });

// // // Start server on port 3000 (or another port)
// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //     console.log(`Server is running on http://localhost:${PORT}`);
// // });
