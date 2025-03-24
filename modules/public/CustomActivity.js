$(window).ready(onRender);

function onRender() {
    console.log("SFMC Custom Activity UI rendering...");
    connection.trigger("ready");

    connection.on("initActivity", onInitActivity);
    connection.on("clickedNext", onNextButtonClick);
    connection.on("clickedDone", onDoneButtonClick);
    connection.on("error", function (err) {
        console.error("Postmonger Error:", err);
    });

    console.log("Event listeners attached. Waiting for user input...");
}

function onInitActivity(data) {
    console.log("Received initActivity Data:", JSON.stringify(data, null, 2));
    payload = data || {};
    console.log(payload);

    payload.arguments = payload.arguments || {};
    payload.arguments.execute = payload.arguments.execute || {};
    payload.arguments.execute.inArguments = payload.arguments.execute.inArguments || [];
    payload.arguments.execute.outArguments = payload.arguments.execute.outArguments || [];
    console.log("printing arguments");
    console.log(payload.arguments);

    // Populate input field if available
    if (payload.arguments.execute.inArguments.length > 0) {
        let phoneNumber = payload.arguments.execute.inArguments[0].phoneNumber;
        console.log("printing phone number");
        console.log(phoneNumber);
        if (phoneNumber) {
            $("#inputBox").val(phoneNumber);
            console.log("Loaded phone number:", phoneNumber);
        } else {
            console.warn("No phone number found in inArguments.");
        }
    } else {
        console.warn("No inArguments found.");
    }

    // Trigger activity save
    connection.trigger("updateActivity", payload);
    connection.trigger("save"); // Save activity data
}

function onNextButtonClick() {
    console.log("Next button clicked. Processing input...");

    var phoneNumber = $("#inputBox").val().trim();
    console.log("Phone Number Entered:", phoneNumber);

    if (!phoneNumber) {
        console.error("Phone number is missing!");
        alert("Please enter a phone number.");
        return;
    }

    payload.arguments.execute.inArguments = [{ phoneNumber: phoneNumber }];
    console.log("Payload prepared:", JSON.stringify(payload, null, 2));

    $("#loadingIndicator").show();

    $.ajax({
        url: "https://splitbranch-ab8b48b255d1.herokuapp.com/execute",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            inArguments: [{ phoneNumber: phoneNumber }]
        }),
        success: function (response) {
            console.log("API Response:", JSON.stringify(response, null, 2));

            let branchResult = response.optInStatus === 'Yes' ? 'OptedIn' : 'OptedOut';

            payload.arguments.execute.outArguments = [{ OptInStatus: response.optInStatus }];
            payload.outcome = branchResult;

            connection.trigger("updateActivity", payload);
            console.log(`Triggered updateActivity with branch: ${branchResult}`);

            $("#loadingIndicator").hide();
        },
        error: function (err) {
            console.error("API call failed:", err);
            alert("API call failed. Please check the console.");
            $("#loadingIndicator").hide();
        }
    });
}

function onDoneButtonClick() {
    console.log("Done button clicked. Finalizing activity...");

    var phoneNumber = $("#inputBox").val().trim();
    if (!phoneNumber) {
        console.error("Phone number is missing!");
        alert("Please enter a phone number.");
        return;
    }

    payload.arguments = payload.arguments || {};
    payload.arguments.execute = payload.arguments.execute || {};
    payload.arguments.execute.inArguments = [{ phoneNumber: phoneNumber }];
    payload.arguments.execute.outArguments = [{ OptInStatus: "Pending" }];
    payload.arguments.execute.editable = true;

    payload.metaData = payload.metaData || {};
    payload.metaData.isConfigured = true;

    console.log("Final Payload Before Saving:", JSON.stringify(payload, null, 2));
    connection.trigger("updateActivity", payload);
    connection.trigger("save"); // Trigger save when done
}
