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

