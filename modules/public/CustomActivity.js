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
    }

    function onInitActivity(data) {
        console.log("Received initActivity Data:", JSON.stringify(data, null, 2));
        payload = data || {};
        payload.arguments = payload.arguments || {};
        payload.arguments.execute = payload.arguments.execute || {};
        payload.arguments.execute.inArguments = payload.arguments.execute.inArguments || [];
        payload.metaData = payload.metaData || {};
        payload.metaData.isConfigured = true;
        connection.trigger("updateActivity", payload);
    }

    function onNextButtonClick() {
        console.log("Next button clicked. Processing input...");

        var keyValue = $("#inputBox").val().trim();
        if (!keyValue) {
            console.error("keyValue is missing!");
            alert("Please enter a key value.");
            return;
        }

        payload.arguments.execute.inArguments = [{ keyValue: keyValue }];
        console.log("Payload prepared:", JSON.stringify(payload, null, 2));

        $("#loadingIndicator").show();

        $.ajax({
            url: "https://splitbranch-ab8b48b255d1.herokuapp.com/modules/execute",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ inArguments: [{ keyValue: keyValue }] }),
            success: function (response) {
                console.log("API Response:", JSON.stringify(response, null, 2));

                if (!response?.outArguments || !response.outArguments[0][0].OptInStatus) {
                    console.error("Missing OptInStatus in API response.");
                    alert("The response from the API is missing the required OptInStatus.");
                    return;
                }

                let optInStatus = response.outArguments[0][0].OptInStatus;
                let branchResult = optInStatus === 'Yes' ? 'OptedIn' : 'OptedOut';

                payload.arguments.execute.outArguments = [{ OptInStatus: optInStatus }];
                payload.outcome = branchResult;

                console.log("Updated Payload with branchResult:", JSON.stringify(payload, null, 2));

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
        var keyValue = $("#inputBox").val().trim();
        if (!keyValue) {
            alert("Please enter a key value.");
            return;
        }

        payload.arguments.execute.inArguments = [{ keyValue: keyValue }];
        payload.arguments.execute.editable = true;
        payload.metaData.isConfigured = true;

        console.log("Final Payload Before Saving:", JSON.stringify(payload, null, 2));
        connection.trigger("updateActivity", payload);
    }
});
