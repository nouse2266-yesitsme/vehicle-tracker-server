const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Parse URL-encoded data (for GET query parameters)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize Firebase Admin SDK using service account JSON from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Webhook endpoint to receive data
app.get('/webhook', async (req, res) => {
  try {
    const { id, lat, lng, speed, battery, timestamp, behavior } = req.query;

    if (!id || !lat || !lng || !speed || !battery || !timestamp) {
      return res.status(400).send('Missing parameters');
    }

    // Store data in Firestore under vehicles → <id> → locations → auto doc
    await db
      .collection('vehicles')
      .doc(id)
      .collection('locations')
      .add({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        speed: parseFloat(speed),
        battery: parseFloat(battery),
        timestamp: parseInt(timestamp),
        behavior: behavior || null,
      });

    console.log(`Data stored for ${id}:`, req.query);
    res.send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error storing data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Webhook server running at http://localhost:${port}`);
});
