const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// Assuming the Fintoc secret API key is stored in an environment variable
const FINTOC_API_KEY = process.env.FINTOC_API_KEY;
const LINK_TOKEN = process.env.LINK_TOKEN;

app.use(bodyParser.json());

// Define endpoint to handle webhook requests from Fintoc
/* app.post('/api/webhook', async (req, res) => {
  try {
    console.log('Webhook received:', req.body);
    // Extract the refreshed_object_id from the webhook payload
    const refreshedObjectId = req.body.data.refreshed_object_id;

    // Make a request to the Fintoc API to retrieve movements for the account
    const url = `https://api.fintoc.com/v1/accounts/${refreshedObjectId}/movements?link_token=${LINK_TOKEN}`; // Replace YOUR_LINK_TOKEN with your link token
    const headers = {
      'Authorization': `${FINTOC_API_KEY}`,
      'Accept': 'application/json'
    };

    const response = await axios.get(url, { headers });

    // Handle the response from the Fintoc API
    console.log('Movements:', response.data);

    // Respond to the webhook request with a success message
    res.status(200).send('Webhook received and processed successfully');
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error processing webhook:', error);
    res.status(500).send('Error processing webhook');
  }
}); */

app.post('/', (req, res) => {
  console.log('Webhook received:', req.body);
  res.status(200).send('Webhook received and processed successfully');
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
