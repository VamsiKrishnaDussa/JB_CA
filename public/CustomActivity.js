define(["postmonger"], function (Postmonger) {
    console.log("Loading Custom Activity script...");

    var connection = new Postmonger.Session();
    var payload = {};

    $(window).ready(onRender);

    function onRender() {
        console.log("SFMC Custom Activity UI rendering...");
        connection.trigger("ready");

        connection.on("initActivity", function (data) {
            console.log("initActivity Data Received:", JSON.stringify(data, null, 2));
            payload = data || {};
        });

        connection.on("error", function (err) {
            console.error("Postmonger Error:", err);
        });

        console.log("Event listeners attached. Waiting for user input...");
    }

    connection.on("clickedNext", function () {
        console.log("Next button clicked. Processing input...");

        var phoneNumber = $("#inputBox").val().trim();
        console.log("Phone Number Entered:", phoneNumber);

        if (!phoneNumber) {
            console.error("Phone number is missing!");
            return;
        }

        payload.arguments = payload.arguments || {};
        payload.arguments.execute = payload.arguments.execute || {};
        payload.arguments.execute.inArguments = [{ phoneNumber: phoneNumber }];

        console.log("Payload prepared:", JSON.stringify(payload, null, 2));

        $.ajax({
            url: "https://customapp-9584657f551b.herokuapp.com/execute",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ inArguments: [{ phoneNumber: phoneNumber }] }),
            success: function (response) {
                console.log("API Response:", JSON.stringify(response, null, 2));

                payload.arguments.execute.outArguments = [{ OptInStatus: response.optInStatus }];
                console.log("Updated Payload with API response:", JSON.stringify(payload, null, 2));

                connection.trigger("updateActivity", payload);
                console.log("Triggered updateActivity with updated payload.");
            },
            error: function (err) {
                console.error("API call failed:", err);
            }
        });
    });

    // Ensuring that "Done" works properly
    connection.on("clickedDone", function () {
        console.log("Done button clicked. Finalizing activity...");

        if (!payload.arguments || !payload.arguments.execute || !payload.arguments.execute.inArguments) {
            console.error("Invalid payload detected before finalizing.");
            return;
        }

        console.log("Final Payload Before Saving:", JSON.stringify(payload, null, 2));

        connection.trigger("updateActivity", payload);
        console.log("Activity updated. Ready to save.");
    });

    console.log("Custom Activity script initialized.");
});
