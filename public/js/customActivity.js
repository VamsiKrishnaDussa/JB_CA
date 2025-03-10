define(["postmonger"], function (Postmonger) {
  "use strict";

  var connection = new Postmonger.Session();
  var payload = {};
  var steps = [
    { label: "Step 1", key: "step1" },
    { label: "Step 2", key: "step2" },
    { label: "Step 3", key: "step3" }
  ];
  var currentStep = steps[0].key;

  $(window).ready(onRender);

  connection.on("initActivity", initialize);
  connection.on("requestedTokens", onGetTokens);
  connection.on("requestedEndpoints", onGetEndpoints);
  connection.on("clickedNext", onClickedNext);
  connection.on("clickedBack", onClickedBack);
  connection.on("gotoStep", onGotoStep);

  function onRender() {
    connection.trigger("ready");

    // When the "Send Request" button is clicked, call the API
    $("#sendRequest").click(function () {
      var mobileNumber = $("#mobileNumber").val();
      if (mobileNumber) {
        sendPostRequest(mobileNumber);
      } else {
        alert("Please enter a mobile number.");
      }
    });
  }

  function initialize(data) {
    if (data) {
      payload = data;
    }
  }

  function sendPostRequest(mobileNumber) {
    // Update the UI
    showStep("step2");

    // Prepare the payload for the POST request
    var requestData = {
      "contactKey": "postmandemo6",
      "attributeSets": [
        {
          "name": "Chat Message Subscriptions",
          "items": [
            {
              "values": [
                { "name": "ChannelId", "value": mobileNumber },
                { "name": "ChannelType", "value": "WhatsApp" },
                { "name": "MobileNumber", "value": mobileNumber },
                { "name": "OptInMethodID", "value": "1" },
                { "name": "OptInStatusID", "value": "2" },
                { "name": "OptOutDate", "value": "3/7/2025" },
                { "name": "OptOutMethodID", "value": "1" },
                { "name": "OptOutStatusID", "value": 0 },
                { "name": "Source", "value": 4 }
              ]
            }
          ]
        },
        {
          "name": "Chat Message Demographics",
          "items": [
            {
              "values": [
                { "name": "Carrier ID", "value": "0" },
                { "name": "Channel", "value": "Mobile" },
                { "name": "Locale", "value": "IN" },
                { "name": "Mobile Number", "value": mobileNumber },
                { "name": "Modified Date", "value": "3/7/2025" },
                { "name": "Priority", "value": "1" },
                { "name": "Status", "value": 1 }
              ]
            }
          ]
        }
      ]
    };

    // Make the POST request
    $.ajax({
      url: "https://mcs7y3dcpf-lv8b7ccjgjhdpl-78.rest.marketingcloudapis.com/contacts/v1/contacts",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(requestData),
      success: function (response) {
        var operationStatus = response.OperationStatus;
        if (operationStatus === "OK") {
          showStep("step3");
          $("#status").html("Success");
          updateJourney("Yes");
        } else {
          showStep("step3");
          $("#status").html("Failed");
          updateJourney("No");
        }
      },
      error: function () {
        showStep("step3");
        $("#status").html("Error occurred");
        updateJourney("No");
      }
    });
  }

  function showStep(stepKey) {
    $(".step").hide();
    $("#" + stepKey).show();
  }

  function updateJourney(status) {
    payload["arguments"].execute.outArguments = [{ operationStatus: status }];
    connection.trigger("updateActivity", payload);
  }

  function onGetTokens(tokens) {
    // You can handle tokens here if needed
  }

  function onGetEndpoints(endpoints) {
    // You can handle endpoints here if needed
  }

  function onClickedNext() {
    connection.trigger("nextStep");
  }

  function onClickedBack() {
    connection.trigger("prevStep");
  }

  function onGotoStep(step) {
    showStep(step);
    connection.trigger("ready");
  }
});
