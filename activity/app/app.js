    //const express = require('express');
    const axios = require('axios');
    const configJSON = require('../config/config-json');
    require("dotenv").config();

    module.exports = function inboundCallActivity(app, options) {
        const moduleDirectory = `${options.rootDirectory}/activity`;

        // Serve static resources
        app.get('/activity/app/', (req, res) => res.redirect('/activity/html/index.html'));
        app.get('/activity/html/index.html', (req, res) => res.sendFile(`${moduleDirectory}/html/index.html`));
        app.get('/activity/config/config.json', (req, res) => res.status(200).json(configJSON(req)));

        /**
         * Authenticate with SFMC
         */
        async function authenticate() {
            try {
                console.log("Authenticating with SFMC...");
                console.log("1");
                console.log(process.env.client_id);
                console.log(process.env.SFMC_API_URL);
                const response = await axios.post(process.env.SFMC_AUTH_URL, {
                    grant_type: "client_credentials",
                    client_id: process.env.client_id,
                    client_secret: process.env.client_secret,
                    account_id: process.env.account_id,
                }, {
                    headers: { "Content-Type": "application/json" }
                });

                console.log("Authentication Successful!");
                return response.data.access_token;
            } catch (error) {
                console.error("Authentication failed:", error.response ? error.response.data : error.message);
                throw new Error("Failed to authenticate with SFMC");
            }
        }

        /**
         * Build payload for SFMC
         */
        function buildPayload(mobileNumber) {
            return {
                contactKey: `Test_${mobileNumber}`,
                attributeSets: [{
                    name: "Chat Message Subscriptions",
                    items: [{
                        values: [
                            { name: "ChannelId", value: mobileNumber },
                            { name: "ChannelType", value: "WhatsApp" },
                            { name: "MobileNumber", value: mobileNumber },
                            { name: "OptInMethodID", value: "1" },
                            { name: "OptInStatusID", value: "2" },
                            { name: "OptOutDate", value: "3/7/2025" },
                            { name: "OptOutMethodID", value: "1" },
                            { name: "OptOutStatusID", value: 0 },
                            { name: "Source", value: 4 },
                        ],
                    }],
                }]
            };
        }

        /**
         * Execute Journey Activity - Process Inbound Call
         */
        app.post('/execute', async (req, res) => {
            console.log('Received /execute request:', JSON.stringify(req.body));

            try {
                const { inArguments } = req.body;
                if (!inArguments || !inArguments.length || !inArguments[0].mobileNumber) {
                    return res.status(400).json({ error: "Missing mobileNumber in request" });
                }

                const mobileNumber = inArguments[0].mobileNumber;
                console.log("Processing mobile number:", mobileNumber);

                const accessToken = await authenticate();
                const payload = buildPayload(mobileNumber);

                console.log("Sending data to SFMC:", JSON.stringify(payload, null, 2));

                const response = await axios.post(process.env.SFMC_API_URL, payload, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                console.log("SFMC Response:", response.data);

                // Assuming response determines opt-in/opt-out status
                console.log()
                const optInStatus = response.data.operationStatus === "OK" ? "Yes" : "No";

                const responseObject = {
                    success: true,
                    optInStatus: optInStatus
                };

                console.log("Response Object:", JSON.stringify(responseObject));
                return res.status(200).json(responseObject);
            } catch (error) {
                console.error("Error processing request:", error.response ? error.response.data : error.message);
                return res.status(500).json({ error: error.message });
            }
        });
    };
