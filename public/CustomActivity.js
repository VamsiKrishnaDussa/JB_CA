define(["postmonger"], function (Postmonger) {
    var connection = new Postmonger.Session();
    var payload = {};

    $(window).ready(onRender);

    connection.on("initActivity", function (data) {
        if (data) {
            payload = data;
        }
        connection.trigger("ready");
    });

    connection.on("clickedNext", function () {
        var phoneNumber = $("#phoneNumber").val();
        payload.arguments.execute.inArguments = [{ phoneNumber: phoneNumber }];

        // Call API to fetch opt-in status
        $.ajax({
            url: "https://customapp-9584657f551b.herokuapp.com/execute",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ phoneNumber: phoneNumber }),
            success: function (response) {
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

    function onRender() {
        connection.trigger("ready");
    }
});
