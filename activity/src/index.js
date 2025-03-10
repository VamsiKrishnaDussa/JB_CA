import Postmonger from 'postmonger';

const connection = new Postmonger.Session();
let activity = {};

document.addEventListener('DOMContentLoaded', function () {
    connection.on('initActivity', onInitActivity);
    connection.on('clickedNext', onDoneButtonClick);
    connection.on('clickedBack', onBackButtonClick);
    connection.on('clickedCancel', onCancelButtonClick);
    connection.trigger('ready');
});

function onInitActivity(payload) {
    activity = payload;
    const hasInArguments = activity.arguments && activity.arguments.execute && activity.arguments.execute.inArguments && activity.arguments.execute.inArguments.length > 0;
    const inArguments = hasInArguments ? activity.arguments.execute.inArguments : [];

    console.log('Activity Data:', JSON.stringify(activity, null, 4));
    console.log('InArguments:', inArguments);

    const mobileNumberArg = inArguments.find(arg => arg.mobileNumber);
    if (mobileNumberArg) {
        document.getElementById('MobileNumber').value = mobileNumberArg.mobileNumber;
    }
}

function onDoneButtonClick() {
    activity.metaData.isConfigured = true;
    const mobileNumber = document.getElementById('MobileNumber').value;

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