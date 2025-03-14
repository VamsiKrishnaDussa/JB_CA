// // const express = require("express");
// // const path = require("path");

// // const app = express();

// // // Ensure static files are served from the correct directory
// // app.use(express.static(path.join(__dirname, "modules", "public")));

// // app.listen(process.env.PORT || 3000, () => {
// //     console.log("Server is running...");
// // });




// const express = require('express');
// const axios = require('axios');
// const bodyParser = require('body-parser');
// const path = require('path');
// require("dotenv").config();
// const cors = require("cors");

// const app = express(); 
// app.use(cors()); 
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'modules', 'public')));


// console.log("Inbound Call Custom Activity Initialized");



// async function authenticate() {
//     try {
//         console.log("Authenticating with SFMC...");
//         const response = await axios.post(process.env.SFMC_AUTH_URL, {
//             grant_type: "client_credentials",
//             client_id: process.env.CLIENT_ID,
//             client_secret: process.env.CLIENT_SECRET,
//             account_id: process.env.ACCOUNT_ID,
//         }, { headers: { "Content-Type": "application/json" } });

//         console.log("Authentication Successful!");
//         return response.data.access_token;
//     } catch (error) {
//         console.error("SFMC Authentication Failed:", error.response?.data || error.message);
//         throw new Error("Failed to authenticate with SFMC");
//     }
// }

// function buildPayload(phoneNumber) {
//     return {
//         contactKey: `Test_${phoneNumber}`,
//         attributeSets: [{
//             name: "Chat Message Subscriptions",
//             items: [{
//                 values: [
//                     { name: "ChannelId", value: phoneNumber },
//                     { name: "ChannelType", value: "WhatsApp" },
//                     { name: "MobileNumber", value: phoneNumber },
//                     { name: "OptInMethodID", value: "1" },
//                     { name: "OptInStatusID", value: "2" },
//                     { name: "OptOutDate", value: "3/7/2025" },
//                     { name: "OptOutMethodID", value: "1" },
//                     { name: "OptOutStatusID", value: 0 },
//                     { name: "Source", value: 4 },
//                 ],
//             }],
//         }]
//     };
// }

// app.post('/execute', async (req, res) => {
//     console.log('Received /execute request:', JSON.stringify(req.body));

//     try {
//         const { inArguments } = req.body;
//         if (!inArguments || !inArguments.length || !inArguments[0].phoneNumber) {
//             return res.status(400).json({ error: "Missing phoneNumber in request" });
//         }

//         const phoneNumber = inArguments[0].phoneNumber;
//         console.log("Processing phone number:", phoneNumber);

//         const accessToken = await authenticate();
//         const payload = buildPayload(phoneNumber);

//         console.log("Sending data to SFMC:", JSON.stringify(payload, null, 2));

//         const response = await axios.post(process.env.SFMC_API_URL, payload, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         console.log("SFMC Response:", response.data);
//         const optInStatus = response.data?.operationStatus === "OK" ? "Yes" : "No";

//         return res.status(200).json({ success: true, optInStatus });
//     } catch (error) {
//         console.error("Error processing request:", error.response?.data || error.message);
//         return res.status(500).json({ error: error.message });
//     }
// });

// app.post('/save', (req, res) => res.status(200).json({ success: true }));
// app.post('/publish', (req, res) => res.status(200).json({ success: true }));
// app.post('/validate', (req, res) => res.status(200).json({ success: true }));
// app.post('/stop', (req, res) => res.status(200).json({ success: true }));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Custom Activity API running on port ${PORT}`));


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

// Authenticate with SFMC
// async function authenticate() {
//     try {
//         console.log("Authenticating with SFMC...");
//         const response = await axios.post(process.env.SFMC_AUTH_URL, {
//             grant_type: "client_credentials",
//             client_id: process.env.CLIENT_ID,
//             client_secret: process.env.CLIENT_SECRET,
//             account_id: process.env.ACCOUNT_ID,
//         }, { headers: { "Content-Type": "application/json" } });

//         console.log("Authentication Successful!");
//         return response.data.access_token;
//     } catch (error) {
//         console.error("SFMC Authentication Failed:", error.response?.data || error.message);
//         throw new Error("Failed to authenticate with SFMC");
//     }
// }

async function authenticate() {
    try {
        console.log("🔹 Authenticating with SFMC...");
        
        // Print environment variables for debugging
        console.log("🔹 SFMC_AUTH_URL:", process.env.SFMC_AUTH_URL);
        console.log("🔹 CLIENT_ID:", process.env.CLIENT_ID);
        console.log("🔹 CLIENT_SECRET:", process.env.CLIENT_SECRET ? "***** (hidden)" : "❌ MISSING");
        console.log("🔹 ACCOUNT_ID:", process.env.ACCOUNT_ID);

        const response = await axios.post(process.env.SFMC_AUTH_URL, {
            grant_type: "client_credentials",
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            account_id: process.env.ACCOUNT_ID,
        }, { headers: { "Content-Type": "application/json" } });

        console.log("✅ Authentication Successful! Token:", response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error("❌ SFMC Authentication Failed:", error.response?.data || error.message);
        throw new Error("Failed to authenticate with SFMC");
    }
}


// Build payload for SFMC
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

// Handle /execute API request
// app.post('/execute', async (req, res) => {
//     console.log('Received /execute request:', JSON.stringify(req.body));

//     try {
//         const { inArguments } = req.body;
//         if (!inArguments || !inArguments.length || !inArguments[0].phoneNumber) {
//             return res.status(400).json({ error: "Missing phoneNumber in request" });
//         }

//         const phoneNumber = inArguments[0].phoneNumber;
//         console.log("Processing phone number:", phoneNumber);

//         // Authenticate and send data to SFMC
//         const accessToken = await authenticate();
//         phoneNumber='918686793220';
//         const payload = buildPayload(phoneNumber);

//         console.log("Sending data to SFMC:", JSON.stringify(payload, null, 2));

//         const response = await axios.post(process.env.SFMC_API_URL, payload, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         console.log("SFMC Response:", response.data);
//         const optInStatus = response.data?.operationStatus === "OK" ? "Yes" : "No";

//         return res.status(200).json({ success: true, optInStatus });
//     } catch (error) {
//         console.error("Error processing request:", error.response?.data || error.message);
//         return res.status(500).json({ error: error.message });
//     }
// });


app.post('/execute', async (req, res) => {
    console.log('📩 Received /execute request:', JSON.stringify(req.body, null, 2));

    try {
        const { inArguments } = req.body;

        // Extract phone number, handle undefined values
        let phoneNumber = inArguments?.[0]?.phoneNumber;
        if (!phoneNumber || phoneNumber.includes("{{")) {
            console.warn("⚠️ Received unresolved SFMC token. Using default number.");
            phoneNumber = "918686793220"; // Default test number
        }

        console.log("📞 Processing phone number:", phoneNumber);

        // Authenticate and send data to SFMC
        const accessToken = await authenticate();
        const payload = buildPayload(phoneNumber);

        console.log("📤 Sending data to SFMC:", JSON.stringify(payload, null, 2));

        const response = await axios.post(process.env.SFMC_API_URL, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log("✅ SFMC Response:", JSON.stringify(response.data, null, 2));
        const optInStatus = response.data?.operationStatus === "OK" ? "Yes" : "No";

        return res.status(200).json({ success: true, optInStatus });
    } catch (error) {
        console.error("❌ Error processing request:", error.response?.data || error.message);
        return res.status(500).json({ error: error.response?.data || error.message });
    }
});



// Other endpoints required by SFMC
app.post('/save', (req, res) => res.status(200).json({ success: true }));
app.post('/publish', (req, res) => res.status(200).json({ success: true }));
app.post('/validate', (req, res) => res.status(200).json({ success: true }));
app.post('/stop', (req, res) => res.status(200).json({ success: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Custom Activity API running on port ${PORT}`));

