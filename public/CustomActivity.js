define(["postmonger"], function (Postmonger) {
    var connection = new Postmonger.Session();
    var payload = {};

    $(window).ready(onRender);

    function onRender() {
        console.log("SFMC Custom Activity UI rendering...");
        connection.trigger("ready");

        connection.on("initActivity", function (data) {
            console.log("initActivity Data Received:", data);
            payload = data || {}; // Ensure payload is not undefined
        });

        connection.on("error", function (err) {
            console.error("Error received:", err);
        });
    }

    connection.on("initActivity", function (data) {
        console.log("SFMC initActivity triggered.");
        if (data) {
            payload = data;
        } else {
            payload = {}; // Ensure it's not undefined
        }
        connection.trigger("ready"); // Ensure UI loads
    });

    connection.on("clickedNext", function () {
        var phoneNumber = $("#inputBox").val().trim(); // Trim spaces

        if (!phoneNumber) {
            console.error("Phone number is missing!");
            return;
        }

        payload.arguments.execute.inArguments = [{ phoneNumber: phoneNumber }];

        // Call API to fetch opt-in status
        $.ajax({
            url: "https://customapp-9584657f551b.herokuapp.com/execute",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ phoneNumber: phoneNumber }),
            success: function (response) {
                console.log("API Response:", response);

                if (response.optInStatus === "Yes") {
                    payload.arguments.execute.outArguments = [{ OptInStatus: "Yes" }];
                    connection.trigger("updateActivity", payload);
                    console.log("Return Success: Yes");
                } else {
                    payload.arguments.execute.outArguments = [{ OptInStatus: "No" }];
                    connection.trigger("updateActivity", payload);
                    console.log("Return Fail: No");
                }
            },
            error: function (err) {
                console.error("API call failed: ", err);
            }
        });
    });

    connection.on("clickedBack", function () {
        console.log("Back button clicked.");
    });

    connection.on("gotoStep", function (step) {
        console.log("Going to step:", step);
    });
});
