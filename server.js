const express = require("express");
const admin = require("firebase-admin");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

// Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Webhook poll URL (from webhook.site)
const WEBHOOK_URL = "https://webhook.site/eb7ba597-d35d-4121-b5c7-7602ec791cba/requests"; // replace token with your webhook ID

// Function to fetch latest webhook requests
async function fetchWebhookData() {
  try {
    const response = await axios.get(WEBHOOK_URL);
    const requests = response.data; // array of requests

    for (let req of requests) {
      if (req.method !== "GET") continue;

      const params = req.query;
      const { id, lat, lng, speed, battery, timestamp } = params;
      if (!id || !lat || !lng || !speed || !battery || !timestamp) continue;

      // Save to Firebase
      await db
        .collection("vehicles")
        .doc(id)
        .collection("locations")
        .add({
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          speed: parseFloat(speed),
          battery: parseFloat(battery),
          timestamp: parseInt(timestamp),
        });

      console.log("Stored:", params);
    }
  } catch (err) {
    console.error("Error fetching webhook:", err.message);
  }
}

// Poll every 10 seconds
setInterval(fetchWebhookData, 10000);

app.listen(port, () => console.log(`Server running on port ${port}`));