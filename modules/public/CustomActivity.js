

define(["postmonger"], function (Postmonger) {
    console.log("Loading Custom Activity script...");

    var connection = new Postmonger.Session();
    var payload = {};

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

        // Ensure necessary arguments exist
        payload.arguments = payload.arguments || {};
        payload.arguments.execute = payload.arguments.execute || {};
        payload.arguments.execute.inArguments = payload.arguments.execute.inArguments || [];
        console.log("printing arguments");
        console.log(payload.arguments);

        // Ensure metadata is configured
        payload.metaData = payload.metaData || {};
        if (!payload.metaData.isConfigured) {
            console.warn("Activity is not configured. Forcing configuration...");
            payload.metaData.isConfigured = true;
        }

        // Populate input field if available
        if (payload.arguments.execute.inArguments.length > 0) {
            let keyValue = payload.arguments.execute.inArguments[0].keyValue;
            if (keyValue) {
                $("#inputBox").val(keyValue);
                console.log("Loaded keyValue:", keyValue);
            } else {
                console.warn("No keyValue found in inArguments.");
            }
        } else {
            console.warn("No inArguments found.");
        }

        // Ensure SFMC knows activity is configured and save the update
        console.log("Triggering updateActivity...");
        connection.trigger("updateActivity", payload);

        // Explicitly trigger "save" to persist configuration
        console.log("Triggering saveActivity...");
        connection.trigger("save");
    }

    function onNextButtonClick() {
        console.log("Next button clicked. Processing input...");

        var keyValue = $("#inputBox").val().trim();
        console.log("keyValue Entered:", keyValue);

        if (!keyValue) {
            console.error("keyValue is missing!");
            alert("Please enter a key value.");
            return;
        }

        // Ensure execute.arguments structure exists
        payload.arguments.execute.inArguments = [{ keyValue: keyValue }];
        console.log("Payload prepared:", JSON.stringify(payload, null, 2));

        // Show loading indicator
        $("#loadingIndicator").show();

        // Call the API with the correct format
        $.ajax({
            url: "https://splitbranch-ab8b48b255d1.herokuapp.com/modules/execute",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                inArguments: [{ keyValue: keyValue }]
            }),
            success: function (response) {
                console.log("API Response:", JSON.stringify(response, null, 2));

                // Check if OptInStatus is missing in the response
                if (!response || !response.OptInStatus) {
                    console.error("Missing OptInStatus in API response.");
                    alert("The response from the API is missing the required OptInStatus.");
                    return;
                }

                let branchResult = response.OptInStatus === 'Yes' ? 'OptedIn' : 'OptedOut';

                // Ensure payload structure includes the required outArgument
                payload.arguments.execute.outArguments = [{ OptInStatus: response.OptInStatus }];
                payload.outcome = branchResult;

                console.log("Updated Payload with branchResult:", JSON.stringify(payload, null, 2));

                // Update SFMC with the modified payload
                connection.trigger("updateActivity", payload);
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

        var keyValue = $("#inputBox").val().trim();
        if (!keyValue) {
            console.error("keyValue is missing!");
            alert("Please enter a key value.");
            return;
        }

        // Ensure execute.arguments structure exists and set keyValue as input
        payload.arguments = payload.arguments || {};
        payload.arguments.execute = payload.arguments.execute || {};
        payload.arguments.execute.inArguments = [{ keyValue: keyValue }];
        payload.arguments.execute.editable = true;

        // Ensure activity is marked as configured
        payload.metaData = payload.metaData || {};
        payload.metaData.isConfigured = true;

        console.log("Final Payload Before Saving:", JSON.stringify(payload, null, 2));

        // Send data to SFMC to confirm configuration
        console.log("Triggering updateActivity...");
        connection.trigger("updateActivity", payload);
    }

    console.log("Custom Activity script initialized.");
});



