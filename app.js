const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'modules', 'public')));

console.log("Inbound Call Custom Activity Initialized");

async function authenticate() {
    try {
        console.log("Authenticating with SFMC.");
        
        const response = await axios.post(process.env.SFMC_AUTH_URL, {
            grant_type: "client_credentials",
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            account_id: process.env.ACCOUNT_ID,
        }, { headers: { "Content-Type": "application/json" } });
        
        console.log("Authentication Successful!");
        return response.data.access_token;
    } catch (error) {
        console.error("SFMC Authentication Failed:", error.response?.data || error.message);
        throw new Error("Failed to authenticate with SFMC");
    }
}

function buildPayload(phoneNumber) {
    return {
        contactKey: `Test_${phoneNumber}`,
        attributeSets: [{
            name: "Chat Message Subscriptions",
            items: [{
                values: [
                    { name: "ChannelId", value: phoneNumber },
                    { name: "ChannelType", value: "WhatsApp" },
                    { name: "MobileNumber", value: phoneNumber },
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

app.post('/modules/execute', async (req, res) => {
    console.log('Received /execute request:', JSON.stringify(req.body, null, 2));

    try {
        const { inArguments } = req.body;
        let phoneNumber = inArguments?.find(arg => arg.phoneNumber)?.phoneNumber || req.body.keyValue;
        console.log("phone number",phoneNumber);
        if (!phoneNumber) {
            console.error("Missing phone number in request payload.");
            return res.status(400).json({ error: "Missing phone number." });
        }

        // if (phoneNumber.includes('{{Event.')) {
        //     console.error("Placeholder detected instead of actual phone number.");
        //     return res.status(400).json({ error: "MobileNumber not resolved, check Journey Event Data." });
        // }

        console.log("Processing phone number:", phoneNumber);

        const accessToken = await authenticate();
        const payload = buildPayload(phoneNumber);
        console.log("Sending data to SFMC:", JSON.stringify(payload, null, 2));

        const response = await axios.post(process.env.SFMC_API_URL, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log("SFMC Response:", JSON.stringify(response.data, null, 2));
        const optInStatus = response.data?.operationStatus === "OK" ? "Yes" : "No";
        
        return res.status(200).json({
            branchResult: optInStatus === "Yes" ? "success" : "failure"
        });
    } catch (error) {
        console.error("Error processing request:", error.response?.data || error.message);
        return res.status(500).json({ error: error.response?.data || error.message });
    }
});

app.post('/modules/save', (req, res) => res.status(200).json({}));
app.post('/modules/publish', (req, res) => res.status(200).json({}));
app.post('/modules/validate', (req, res) => res.status(200).json({}));
app.post('/modules/stop', (req, res) => res.status(200).json({}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Custom Activity API running on port ${PORT}`));
