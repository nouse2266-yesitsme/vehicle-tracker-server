const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get('/data', async (req, res) => {
  try {
    const { lat, lng, speed, timestamp, behavior, battery } = req.query;
    await db.collection('vehicles').doc('car1').collection('locations').add({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      speed: parseFloat(speed),
      timestamp: parseInt(timestamp),
      behavior,
      battery: parseFloat(battery)
    });
    console.log('Data stored:', req.query);
    res.send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));