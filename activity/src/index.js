define(["postmonger"], function (Postmonger) {
    var connection = new Postmonger.Session();
    var activity = {};

    connection.on("initActivity", function (data) {
        activity = data;
        console.log("SFMC Activity Initialized", data);
        connection.trigger("ready");
    });

    connection.on("requestedSave", function () {
        if (!activity.arguments) {
            activity.arguments = {};
        }

        var mobileNumber = $("#mobileNumber").val();

        if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        activity.arguments.execute = {
            inArguments: [{ "mobileNumber": mobileNumber }],
            outArguments: []
        };

        console.log("Saving activity:", activity);
        connection.trigger("updateActivity", activity);
    });

    connection.on("requestedValidate", function () {
        var isValid = true;
        var mobileNumber = $("#mobileNumber").val();

        if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
            isValid = false;
            alert("Invalid mobile number. Please enter a 10-digit number.");
        }

        console.log("Validation result:", isValid);
        connection.trigger("validateActivity", isValid);
    });

    connection.trigger("ready");
});
