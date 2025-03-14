// define(["postmonger"], function (Postmonger) {
//     console.log("Loading Custom Activity script...");

//     var connection = new Postmonger.Session();
//     var payload = {};

//     $(window).ready(onRender);

//     function onRender() {
//         console.log("SFMC Custom Activity UI rendering...");
//         connection.trigger("ready");

//         connection.on("initActivity", onInitActivity);
//         connection.on("clickedNext", onNextButtonClick);
//         connection.on("clickedDone", onDoneButtonClick);
//         connection.on("error", function (err) {
//             console.error("Postmonger Error:", err);
//         });

//         console.log("Event listeners attached. Waiting for user input...");
//     }

//     function onInitActivity(data) {
//         console.log("initActivity Data Received:", JSON.stringify(data, null, 2));
//         payload = data || {};

//         // Populate input field if available
//         if (payload.arguments?.execute?.inArguments?.[0]?.phoneNumber) {
//             $("#inputBox").val(payload.arguments.execute.inArguments[0].phoneNumber);
//         }
//     }

//     function onNextButtonClick() {
//         console.log("Next button clicked. Processing input...");

//         var phoneNumber = $("#inputBox").val().trim();
//         console.log("Phone Number Entered:", phoneNumber);

//         if (!phoneNumber) {
//             console.error("Phone number is missing!");
//             alert("Please enter a phone number.");
//             return;
//         }

//         // Correctly format the payload
//         payload.arguments = payload.arguments || {};
//         payload.arguments.execute = payload.arguments.execute || {};
//         payload.arguments.execute.inArguments = [{ phoneNumber: phoneNumber }];

//         console.log("Payload prepared:", JSON.stringify(payload, null, 2));

//         // Show loading indicator
//         $("#loadingIndicator").show();

//         // Call the API with the correct format
//         $.ajax({
//             url: "https://customapp-9584657f551b.herokuapp.com/execute",  
//             type: "POST",
//             contentType: "application/json",
//             data: JSON.stringify({
//                 inArguments: [{ phoneNumber: phoneNumber }]
//             }),
//             success: function (response) {
//                 console.log("API Response:", JSON.stringify(response, null, 2));

//                 // Determine the correct branch based on opt-in status
//                 let branchResult = response.optInStatus === 'Yes' ? 'OptedIn' : 'OptedOut';

//                 // Update the payload with branch result for routing
//                 payload.arguments.execute.outArguments = [{ OptInStatus: response.optInStatus }];
//                 payload.outcome = branchResult; // Set branch outcome

//                 console.log("Updated Payload with branchResult:", JSON.stringify(payload, null, 2));

//                 // Trigger updateActivity to notify SFMC of branch routing
//                 connection.trigger("updateActivity", payload);
//                 console.log(`Triggered updateActivity with branch: ${branchResult}`);
//                 // Hide loading indicator
//                 $("#loadingIndicator").hide();
//             },
//             error: function (err) {
//                 console.error("API call failed:", err);
//                 alert("API call failed. Please check the console.");
//                 $("#loadingIndicator").hide();
//             }
//         });
//     }

//     function onDoneButtonClick() {
//         console.log("Done button clicked. Finalizing activity...");

//         if (!payload.arguments?.execute?.inArguments) {
//             console.error("Invalid payload detected before finalizing.");
//             alert("An error occurred. Please check the console.");
//             return;
//         }

//         console.log("Final Payload Before Saving:", JSON.stringify(payload, null, 2));

//         connection.trigger("updateActivity", payload);
//         console.log("Activity updated. Ready to save.");
//     }

//     console.log("Custom Activity script initialized.");
// });









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
        console.log("initActivity Data Received:", JSON.stringify(data, null, 2));
        payload = data || {};

        // Ensure arguments exist
        payload.arguments = payload.arguments || {};
        payload.arguments.execute = payload.arguments.execute || {};
        payload.arguments.execute.inArguments = payload.arguments.execute.inArguments || [];

        // Populate input field if available
        let phoneNumber = payload.arguments.execute.inArguments[0]?.phoneNumber || "";
        $("#inputBox").val(phoneNumber);
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

        // Correctly format the payload
        payload.arguments.execute.inArguments = [{ phoneNumber: phoneNumber }];
        console.log("Payload prepared:", JSON.stringify(payload, null, 2));

        // Show loading indicator
        $("#loadingIndicator").show();

        // Call the API with the correct format
        $.ajax({
            url: "https://customapp-9584657f551b.herokuapp.com/execute",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                inArguments: [{ phoneNumber: phoneNumber }]
            }),
            success: function (response) {
                console.log("API Response:", JSON.stringify(response, null, 2));

                // Determine the correct branch based on opt-in status
                let optInStatus = response.optInStatus || "Unknown"; // Add fallback
                let branchResult = optInStatus === "Yes" ? "OptedIn" : "OptedOut";

                // Update the payload with branch result for routing
                payload.arguments.execute.outArguments = [{ OptInStatus: optInStatus }];
                payload.arguments.execute.outArguments.push({ branchResult }); // Ensure SFMC recognizes this

                console.log("Updated Payload with branchResult:", JSON.stringify(payload, null, 2));

                // Trigger updateActivity to notify SFMC of branch routing
                connection.trigger("updateActivity", payload);
                console.log(`Triggered updateActivity with branch: ${branchResult}`);

                // Hide loading indicator
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

        if (!payload.arguments?.execute?.inArguments) {
            console.error("Invalid payload detected before finalizing.");
            alert("An error occurred. Please check the console.");
            return;
        }

        console.log("Final Payload Before Saving:", JSON.stringify(payload, null, 2));

        connection.trigger("updateActivity", payload);
        console.log("Activity updated. Ready to save.");
    }

    console.log("Custom Activity script initialized.");
});
