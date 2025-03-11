require(['postmonger', 'jquery'], function (Postmonger, $) {
    var connection = new Postmonger.Session();
    var activity = {};

    $(document).ready(function () {
        connection.on('initActivity', onInitActivity);
        connection.trigger('ready');
    });

    // function onInitActivity(payload) {
    //     console.log('in activity');
    //     connection.trigger('ready');
    //     // activity = payload;
    //     // var hasInArguments = activity.arguments &&
    //     //     activity.arguments.execute &&
    //     //     activity.arguments.execute.inArguments &&
    //     //     activity.arguments.execute.inArguments.length > 0;

    //     // var inArguments = hasInArguments ? activity.arguments.execute.inArguments : [];

    //     // console.log('Activity Data:', JSON.stringify(activity, null, 4));
    //     // console.log('InArguments:', inArguments);

    //     // var mobileNumberArg = inArguments.find(arg => arg.mobileNumber);
    //     // if (mobileNumberArg) {
    //     //     $('#MobileNumber').val(mobileNumberArg.mobileNumber);
    //     // }
    // }

    connection.on("initActivity", function (data) {
        console.log("Activity Data:", data);
        $("#mobileNumber").val(data.inArguments?.[0]?.mobileNumber || "");
    });
    
});
