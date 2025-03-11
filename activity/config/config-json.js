module.exports = function configJSON(req) {
    return {
        workflowApiVersion: "1.1",
        metaData: { icon: "images/icon.svg", category: "customer" },
        type: "REST",
        lang: { "en-US": { name: "Opt-In Check", description: "Checks if the user is opted in or out." } },
        arguments: {
            execute: {
                inArguments: [{ mobileNumber: "{{Contact.Attribute.MobileNumber}}" }],
                outArguments: [{ optInStatus: "" }],
                "url": "https://customactivityv2-c60375761890.herokuapp.com/execute",
                timeout: 10000,
                retryCount: 3,
                retryDelay: 1000
            }
        }
    };
};
