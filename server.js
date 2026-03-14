const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');   // <- added this

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Webhook endpoint
app.get('/simwebhook', async (req, res) => {
  try {
    const { id, lat, lng, speed, battery, timestamp, behavior } = req.query;

    if (!id || !lat || !lng || !speed || !battery || !timestamp) {
      return res.status(400).send('Missing parameters');
    }

    // Forward to Render HTTPS server
    const renderUrl = `https://your-render-server-url/data?id=${id}&lat=${lat}&lng=${lng}&speed=${speed}&battery=${battery}&timestamp=${timestamp}${behavior ? `&behavior=${behavior}` : ''}`;

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