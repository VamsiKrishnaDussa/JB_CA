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
    connection.trigger("requestTokens");
    connection.trigger("requestEndpoints");
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
    showStep("step2");

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

    $.ajax({
      url: "https://mcs7y3dcpf-lv8b7ccjgjhdpl-78.rest.marketingcloudapis.com/contacts/v1/contacts",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(requestData),
      headers: {
        "Authorization": "Bearer YOUR_ACCESS_TOKEN"
      },
      success: function (response) {
        console.log("Response from SFMC:", response);
        var operationStatus = response.OperationStatus;
        showStep("step3");
        $("#status").html(operationStatus === "OK" ? "Success" : "Failed");
        updateJourney(operationStatus === "OK" ? "Yes" : "No");
      },
      error: function (xhr) {
        console.error("Error response:", xhr);
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
    console.log("Received Tokens:", tokens);
  }

  function onGetEndpoints(endpoints) {
    console.log("Received Endpoints:", endpoints);
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
