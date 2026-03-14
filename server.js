// webhook-forwarder.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Render server URL (your existing server.js deployment)
const renderServerURL = "https://us-central1-vehicle-tracker-dbcb8.cloudfunctions.net/tracker";

app.get('/simwebhook', async (req, res) => {
    try {
        console.log('Received from SIM800L:', req.query);

        // Forward all query params to Render server
        await axios.get(renderServerURL, { params: req.query });

        res.send('Forwarded to Render ✅');
    } catch (err) {
        console.error('Error forwarding:', err.message);
        res.status(500).send('Error forwarding data');
    }
});

app.listen(port, () => {
    console.log(`Webhook server running on port ${port}`);
});
