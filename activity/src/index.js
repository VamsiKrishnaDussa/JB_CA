require(['postmonger', 'jquery'], function (Postmonger, $) {
    var connection = new Postmonger.Session();
    var activity = {};

    $(document).ready(function () {
        connection.on('initActivity', onInitActivity);
        connection.on('clickedNext', onDoneButtonClick);
        connection.on('clickedBack', onBackButtonClick);
        connection.on('clickedCancel', onCancelButtonClick);
        connection.trigger('ready');
    });

    function onInitActivity(payload) {
        activity = payload;
        var hasInArguments = activity.arguments &&
            activity.arguments.execute &&
            activity.arguments.execute.inArguments &&
            activity.arguments.execute.inArguments.length > 0;

        var inArguments = hasInArguments ? activity.arguments.execute.inArguments : [];

        console.log('Activity Data:', JSON.stringify(activity, null, 4));
        console.log('InArguments:', inArguments);

        var mobileNumberArg = inArguments.find(arg => arg.mobileNumber);
        if (mobileNumberArg) {
            $('#MobileNumber').val(mobileNumberArg.mobileNumber);
        }
    }

    function onDoneButtonClick() {
        activity.metaData.isConfigured = true;
        var mobileNumber = $('#MobileNumber').val().trim();

        if (!mobileNumber) {
            alert("⚠ Please enter a mobile number!");
            return;
        }

        activity.arguments.execute.inArguments = [{ mobileNumber }];
        activity.name = `Check Opt-In for ${mobileNumber}`;

        console.log('Updated Activity:', JSON.stringify(activity, null, 4));
        connection.trigger('updateActivity', activity);
    }

    function onBackButtonClick() {
        connection.trigger('prevStep');
    }

    function onCancelButtonClick() {
        connection.trigger('setActivityDirtyState', false);
        connection.trigger('requestInspectorClose');
    }
});
