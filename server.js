// const express = require('express');
// const path = require('path');
// const inboundCallActivity = require('./activity/app/app');

// const app = express();
// const cors = require('cors'); // Import CORS

// app.use(cors()); // Allow all origins


// app.use(express.json());
// inboundCallActivity(app, { rootDirectory: __dirname });

// //  Correctly serve static files from "activity"
// app.use('/activity/html', express.static(path.join(__dirname, 'activity/html')));
// app.use('/activity/config', express.static(path.join(__dirname, 'activity/config')));
// app.use('/activity/src', express.static(path.join(__dirname, 'activity/src')));

// //  Ensure `/config-json.js` is accessible
// app.get('/activity/config/config-json.js', (req, res) => {
//     res.type('application/javascript');
//     res.sendFile(path.join(__dirname, 'activity/config/config-json.js'));
// });


// app.get("/config.json", (req, res) => {
//     res.sendFile(path.join(__dirname, "activity/config/config-json.json"));
// });


// //config.js
// app.get("/config.js", (req, res) => {
//     res.sendFile(path.join(__dirname, "activity/config/config-json.js"));
// });

// // Serve index.html properly
// app.get('/index.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'activity/html/index.html'));
// });

// app.get('/styles.css',(req,res)=>{
//     res.sendFile(path.join(__dirname,'activity/html/styles.css'));
// }
// )

// app.post("/activity/save", (req, res) => {
//     console.log("Activity Save Triggered", req.body);
//     res.status(200).send({ success: true });
// });

// app.post("/activity/validate", (req, res) => {
//     console.log("Activity Validation Triggered", req.body);
//     res.status(200).send({ success: true });
// });


// // Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });


define(["postmonger"], function (Postmonger) {
    var connection = new Postmonger.Session();
    var activity = {};

    connection.on("initActivity", function (data) {
        activity = data;
        console.log("SFMC Activity Initialized", data);
        connection.trigger("ready");
    });

    connection.on("requestedSave", function () {
        activity.arguments.execute.inArguments = [{ "mobileNumber": "{{Contact.Attribute.MobileNumber}}" }];
        connection.trigger("updateActivity", activity);
    });
});
