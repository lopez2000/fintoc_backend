const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const validateWebhookSignature = require('./webhookSignatureValidator'); // Import the signature validation function
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// Assuming the Fintoc secret API key is stored in an environment variable
const FINTOC_API_KEY = process.env.FINTOC_API_KEY;
const LINK_TOKEN = process.env.LINK_TOKEN;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET; // Add this environment variable for the webhook secret

app.use(bodyParser.json());

// Define endpoint to handle webhook requests from Fintoc
app.post('/', async (req, res) => {
  try {
    // Validate webhook signature
    const isValidSignature = validateWebhookSignature(req, WEBHOOK_SECRET);

    if (!isValidSignature) {
      console.log('Invalid webhook signature');
      return res.status(403).send('Invalid webhook signature');
    }

    console.log('Valid webhook signature');

    console.log('Webhook received:', req.body);

    const webhookType = req.body.type;

    if (webhookType === 'account.refresh_intent.succeeded') {
      // Handle account webhook
      const refreshedObjectId = req.body.data.refreshed_object_id;
      const url = `https://api.fintoc.com/v1/accounts/${refreshedObjectId}/movements?link_token=${LINK_TOKEN}`;
      const headers = {
        'Authorization': `${FINTOC_API_KEY}`,
        'Accept': 'application/json'
      };
      const response = await axios.get(url, { headers });
      console.log('Movements:', response.data);
      res.send('Movements retrieved');

    } else if (webhookType === 'account.refresh_intent.failed') {
      // Handle account webhook
      console.log('Account webhook received');
      console.log('Account refresh failed');
      res.send('Account refresh failed');

    } else if (webhookType === 'account.refresh_intent.rejected') {
      console.log('Account webhook received');
      console.log('Account refresh rejected');
      res.send('Account refresh rejected');

    } else if (webhookType === 'account.refresh_intent.movements_removed') {
      console.log('Account webhook received');
      console.log('Movements removed');
      res.send('Movements removed');

    } else if (webhookType === 'link.credentials_changed') {
      // Handle link webhook
      console.log('Link webhook received');
      res.send('Link webhook received');
      
    } else {
      console.log('Unsupported webhook type:', webhookType);
      res.send('Unsupported webhook type');
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Error handling webhook');
  }
});

// Request accounts balances

app.get('/', async (req, res) => {
  try {
    const url = `https://api.fintoc.com/v1/accounts?link_token=${LINK_TOKEN}`;
    const headers = {
      'Authorization': `${FINTOC_API_KEY}`,
      'Accept': 'application/json'
    };

    const response = await axios.get(url, { headers });

    res.json(response.data);
    console.log('OK')
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).send('Error fetching accounts');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
