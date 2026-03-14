const express = require('express');
<<<<<<< HEAD
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
=======
const bodyParser = require('body-parser');
const axios = require('axios');   // <- added this
>>>>>>> 71610cb (Initial commit: added server.js and project files)

const app = express();
const port = process.env.PORT || 3000;

<<<<<<< HEAD
// Parse URL-encoded data (for GET query parameters)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize Firebase Admin SDK using service account JSON from environment variable
if (!process.env.FIREBASE_KEY_JSON) {
  console.error('FIREBASE_KEY_JSON not found in environment variables!');
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Webhook endpoint to receive SIM800L data via HTTP
=======
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Webhook endpoint
>>>>>>> 71610cb (Initial commit: added server.js and project files)
app.get('/simwebhook', async (req, res) => {
  try {
    const { id, lat, lng, speed, battery, timestamp, behavior } = req.query;

<<<<<<< HEAD
    // Validate required parameters
    if (!id || !lat || !lng || !speed || !battery || !timestamp) {
      console.warn('Missing parameters:', req.query);
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
    console.error('Error storing data:', err);
    res.status(500).send('Error storing data');
  }
});

// Optional: health check endpoint
app.get('/', (req, res) => {
  res.send('Webhook server is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Webhook server running at http://localhost:${port}`);
});
=======
    if (!id || !lat || !lng || !speed || !battery || !timestamp) {
      return res.status(400).send('Missing parameters');
    }

    // Forward to Render HTTPS server
    const renderUrl = `https://vehicle-tracker-server-sfqi.onrender.com/data?id=${id}&lat=${lat}&lng=${lng}&speed=${speed}&battery=${battery}&timestamp=${timestamp}${behavior ? `&behavior=${behavior}` : ''}`;

    await axios.get(renderUrl);

    console.log('Forwarded data to Render:', req.query);
    res.send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error forwarding data');
  }
});

app.listen(port, () => {
  console.log(`Webhook forwarder running at http://localhost:${port}`);
});
>>>>>>> 71610cb (Initial commit: added server.js and project files)
