// define(["postmonger"], function (Postmonger) {
//     "use strict";

//     var connection = new Postmonger.Session();
//     var payload = {}; // Stores activity data

//     // Event Listeners
//     connection.on("initActivity", initialize);
//     connection.on("clickedNext", save);

//     // Trigger 'ready' event when the window loads
//     $(window).ready(function () {
//       connection.trigger("ready");
//     });

//     // Initialize function: Receives payload from SFMC
//     function initialize(data) {
//       if (data) {
//         payload = data;
//       }

//       console.log("Activity Initialized:", payload);

//       // Enable "Next" button
//       connection.trigger("updateButton", { button: "next", enabled: true });
//     }

//     // Save function: Sends data back to SFMC
//     function save() {
//       payload["arguments"] = payload["arguments"] || {};
//       payload["arguments"].execute = payload["arguments"].execute || {};
//       payload["arguments"].execute.inArguments = [
//         { mobileNumber: $("#mobileNumber").val() } // Get mobile number from input field
//       ];

//       payload["metaData"] = payload["metaData"] || {};
//       payload["metaData"].isConfigured = true;

//       console.log("Saving Payload:", payload);

//       connection.trigger("updateActivity", payload);
//     }
//   });


define([
    "postmonger"
], function (Postmonger) {
    var connection = new Postmonger.Session();

    connection.on("initActivity", initialize);

    function initialize(data) {
        console.log("Activity Initialized", data);
    }

    connection.trigger("ready"); // Ensure this is called
});
