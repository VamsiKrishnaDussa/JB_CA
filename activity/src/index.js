// define(["postmonger"], function (Postmonger) {
//     var connection = new Postmonger.Session();
//     var activity = {};

//     connection.on("initActivity", function (data) {
//         activity = data;
//         console.log("SFMC Activity Initialized", data);
//         connection.trigger("ready");
//     });

//     connection.on("requestedSave", function () {
//         activity.arguments.execute.inArguments = [{ "mobileNumber": "{{Contact.Attribute.MobileNumber}}" }];
//         connection.trigger("updateActivity", activity);
//     });
// });


define(["postmonger"], function (Postmonger) {
    var connection = new Postmonger.Session();
    var activity = {};

    // SFMC Journey Builder initializes the activity
    connection.on("initActivity", function (data) {
        activity = data;
        console.log("SFMC Activity Initialized", data);
        connection.trigger("ready");
    });

   
    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("submitBtn").addEventListener("click", function () {
            var mobileNumber = document.getElementById("mobileNumber").value;
            console.log("Captured Mobile Number:", mobileNumber);

            // Store mobile number in activity arguments
            activity.arguments.execute.inArguments = [{ "mobileNumber": mobileNumber }];
            
            // Notify SFMC that activity is updated
            connection.trigger("updateActivity", activity);
        });
    });

    // Handle Save Event in SFMC
    connection.on("requestedSave", function () {
        connection.trigger("updateActivity", activity);
    });
});

