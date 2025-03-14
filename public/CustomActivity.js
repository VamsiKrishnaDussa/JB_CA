define(["postmonger"], function (Postmonger) {
    var connection = new Postmonger.Session();
    var payload = {};

    $(window).ready(onRender);

    function onRender() {
        console.log("SFMC Custom Activity UI rendering...");
        connection.trigger("ready");

        connection.on("initActivity", function (data) {
            console.log("initActivity Data Received:", data);
            payload = data || {}; 
        });
    }

    connection.on("clickedNext", function () {
        var phoneNumber = $("#inputBox").val().trim();

        if (!phoneNumber) {
            console.error("Phone number is missing!");
            return;
        }

        payload.arguments.execute.inArguments = [{ phoneNumber: phoneNumber }];

        $.ajax({
            url: "https://customapp-9584657f551b.herokuapp.com/execute",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ inArguments: [{ phoneNumber: phoneNumber }] }),
            success: function (response) {
                console.log("API Response:", response);
                payload.arguments.execute.outArguments = [{ OptInStatus: response.optInStatus }];
                connection.trigger("updateActivity", payload);
            },
            error: function (err) {
                console.error("API call failed: ", err);
            }
        });
    });
});