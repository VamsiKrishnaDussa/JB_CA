// define([
//     "postmonger"
// ], function (Postmonger) {
//     var connection = new Postmonger.Session();
//     var mobileNumber = "";

//     // Initialize SFMC Custom Activity
//     connection.on("initActivity", function (data) {
//         console.log("SFMC Activity Initialized", data);
//     });

//     // Handle form submission
//     function submitMobileNumber() {
//         mobileNumber = document.getElementById("mobileNumber").value.trim();

//         if (!mobileNumber) {
//             alert("Please enter a valid mobile number.");
//             return;
//         }

//         // Send mobile number to API
//         fetch("https://customactivityv2-c60375761890.herokuapp.com/execute", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ mobileNumber: mobileNumber })
//         })
//             .then(response => response.json())
//             .then(data => {
//                 console.log("API Response:", data);
//                 document.getElementById("status").innerText = "Opt-In Status: " + (data.optInStatus || "Unknown");

//                 // Send data back to SFMC
//                 connection.trigger("updateActivity", {
//                     arguments: {
//                         execute: {
//                             inArguments: [{ mobileNumber: mobileNumber }],
//                             outArguments: [{ optInStatus: data.optInStatus }]
//                         }
//                     }
//                 });
//             })
//             .catch(error => {
//                 console.error("Error:", error);
//                 document.getElementById("status").innerText = "Error checking status.";
//             });
//     }

//     // Bind submit button
//     document.addEventListener("DOMContentLoaded", function () {
//         document.getElementById("submitBtn").addEventListener("click", submitMobileNumber);
//     });

//     // Notify SFMC that custom activity is ready
//     connection.trigger("ready");
// });



define(["postmonger"], function (Postmonger) {
    var connection = new Postmonger.Session();

    // Wait for SFMC to initialize
    connection.on("initActivity", function (data) {
        console.log("SFMC Activity Initialized", data);

        // Notify SFMC that Custom Activity is ready
        connection.trigger("ready");
    });

    // Ensure form submission works after the form loads
    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("submitBtn").addEventListener("click", function () {
            var mobileNumber = document.getElementById("mobileNumber").value.trim();
            
            if (!mobileNumber) {
                alert("Please enter a valid mobile number.");
                return;
            }

            console.log("Mobile Number Entered:", mobileNumber);
        });
    });
});
