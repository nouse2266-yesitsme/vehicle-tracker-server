const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Endpoint for SIM800L to send data (plain HTTP)
app.get("/simwebhook", async (req, res) => {
  try {
    const { id, lat, lng, speed, battery, timestamp, behavior } = req.query;
    if (!id || !lat || !lng || !speed || !battery || !timestamp) {
      return res.status(400).send("Missing parameters");
    }

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
        behavior: behavior || null,
      });

    console.log("Data stored:", req.query);
    res.send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error storing data");
  }
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);