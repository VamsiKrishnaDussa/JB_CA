define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    var payload = {};

    $(window).ready(onRender);

    // Event Listeners
    connection.on("initActivity", initialize);
    connection.on("requestedTokens", onGetTokens);
    connection.on("requestedEndpoints", onGetEndpoints);
    connection.on("clickedNext", onClickedNext);

    function onRender() {
        console.log("Custom Activity Loaded");

        connection.trigger("ready");
        connection.trigger("requestTokens");
        connection.trigger("requestEndpoints");

        // Initially disable the "Next" button
        connection.trigger("updateButton", { button: "next", enabled: false });

        // Enable the Next button when a mobile number is entered
        $("#mobileNumber").on("input", function () {
            var mobile = $("#mobileNumber").val().trim();
            console.log("Mobile Number Entered:", mobile);

            connection.trigger("updateButton", {
                button: "next",
                enabled: mobile.length > 0,
            });
        });

        // Debugging initActivity event
        connection.on("initActivity", function(data) {
            console.log("initActivity received:", data);
        });
    }

    function initialize(data) {
        console.log("Initializing Activity with Data:", data);

        if (data) {
            payload = data;
        }

        var hasInArguments = Boolean(
            payload["arguments"] &&
            payload["arguments"].execute &&
            payload["arguments"].execute.inArguments &&
            payload["arguments"].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments
            ? payload["arguments"].execute.inArguments
            : [];

        var mobileNumber = "";
        $.each(inArguments, function (index, inArgument) {
            if (inArgument.mobileNumber) {
                mobileNumber = inArgument.mobileNumber;
            }
        });

        console.log("Retrieved Mobile Number:", mobileNumber);
        $("#mobileNumber").val(mobileNumber);
    }

    function onGetTokens(tokens) {
        console.log("Tokens Received:", tokens);
    }

    function onGetEndpoints(endpoints) {
        console.log("SFMC Endpoints Received:", endpoints);
    }

    function onClickedNext() {
        var mobileNumber = $("#mobileNumber").val().trim();
        console.log("Next Button Clicked - Mobile Number:", mobileNumber);

        if (!mobileNumber) {
            alert("Please enter a mobile number.");
            return;
        }

        console.log("Sending API Request...");

        // Save mobile number to payload
        payload["arguments"].execute.inArguments = [{ mobileNumber: mobileNumber }];
        payload["metaData"].isConfigured = true;

        console.log("Updated Payload:", payload);

        // Send data to SFMC
        connection.trigger("updateActivity", payload);
    }
});
