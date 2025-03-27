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
//         console.log("Received initActivity Data:", JSON.stringify(data, null, 2));
//         payload = data || {};
//         payload.arguments = payload.arguments || {};
//         payload.arguments.execute = payload.arguments.execute || {};
//         payload.arguments.execute.inArguments = payload.arguments.execute.inArguments || [];
//         payload.metaData = payload.metaData || {};

//         // Ensure activity is configured
//         payload.metaData.isConfigured = true;

//         connection.trigger("updateActivity", payload);
//     }

//     function onNextButtonClick() {
//         console.log("Next button clicked. Processing input...");
    
//         var keyValue = $("#inputBox").val().trim();
//         if (!keyValue) {
//             alert("Please enter a key value.");
//             return;
//         }
    
//         payload.arguments.execute.inArguments = [{ keyValue: keyValue }];
//         payload.arguments.execute.editable = true;
    
//         console.log("Payload prepared:", JSON.stringify(payload, null, 2));
    
//         $.ajax({
//             url: "https://splitbranch-ab8b48b255d1.herokuapp.com/modules/execute", // Example API endpoint
//             type: "POST",
//             contentType: "application/json",
//             data: JSON.stringify({ inArguments: [{ keyValue: keyValue }] }),
//             success: function (response) {
//                 if (!response || !response.outArguments || !response.outArguments[0].OptInStatus) {
//                     alert("The response from the API is missing the required OptInStatus.");
//                     return;
//                 }
    
//                 let branchResult = response.outArguments[0].OptInStatus === 'Yes' ? 'OptedIn' : 'OptedOut';
    
//                 payload.outcome = branchResult;
//                 payload.arguments.execute.outArguments = [{ OptInStatus: response.outArguments[0].OptInStatus }];
    
//                 console.log("Updated Payload:", JSON.stringify(payload, null, 2));
    
//                 connection.trigger("updateActivity", payload);
//             },
//             error: function (err) {
//                 console.error("API call failed:", err);
//                 alert("API call failed. Please check the console.");
//             }
//         });
//     }

//     function onDoneButtonClick() {
//         var keyValue = $("#inputBox").val().trim();
//         if (!keyValue) {
//             alert("Please enter a key value.");
//             return;
//         }

//         payload.arguments.execute.inArguments = [{ keyValue: keyValue }];
//         payload.arguments.execute.editable = true;
//         payload.metaData.isConfigured = true;

//         console.log("Final Payload Before Saving:", JSON.stringify(payload, null, 2));

//         connection.trigger("updateActivity", payload);
//     }

//     console.log("Custom Activity script initialized.");
// });



// // new code without arguments



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
            alert("Please enter a key value.");
            return;
        }
        
        payload.arguments.execute.inArguments = [{ keyValue: keyValue }];
        payload.arguments.execute.editable = true;
        
        console.log("Payload prepared:", JSON.stringify(payload, null, 2));
        
        $.ajax({
            url: "https://splitbranch-ab8b48b255d1.herokuapp.com/modules/execute", 
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ inArguments: [{ keyValue: keyValue }] }),
            success: function (response) {
                console.log("API Response:", response);
                if (!response || !response.outArguments || !response.outArguments[0].OptInStatus) {
                    alert("The response from the API is missing the required OptInStatus.");
                    return;
                }
                
                let branchResult = response.outArguments[0].OptInStatus === 'Yes' ? 'OptedIn' : 'OptedOut';
                
                payload.outcome = branchResult;
                payload.arguments.execute.outArguments = [{ OptInStatus: response.outArguments[0].OptInStatus }];
                
                console.log("Updated Payload:", JSON.stringify(payload, null, 2));
                
                connection.trigger("updateActivity", payload);
            },
            error: function (err) {
                console.error("API call failed:", err);
                alert("API call failed. Please check the console.");
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

    console.log("Custom Activity script initialized.");
});





