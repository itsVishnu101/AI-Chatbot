/**
 * Simple Express proxy server to forward requests to Google Gemini API.
 * Keep your GEMINI_API_KEY in server's .env (never in the client).
 *
 * For a real production app, add auth, rate limiting, request validation,
 * and proper error handling.
 */

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'models/gemini-1.0';

if (!GEMINI_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set in .env');
}

app.use(cors());
app.use(express.json());

// Example endpoint: POST /api/gemini
// Body: { message: "Hello", conversationId: "..." }
app.post('/api/gemini', async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // NOTE:
    // Replace the URL and request format according to the Gemini API spec you have access to.
    // Below is an example using a hypothetical REST endpoint - adjust as needed.
    const url = `https://gemini.googleapis.com/v1/${GEMINI_MODEL}:generateMessage`;

    const payload = {
      input: {
        // simple chat prompt wrapper; adapt to actual Gemini payload.
        text: message
      },
      // add conversationId, context, or other proto fields if necessary
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_KEY}`,
      },
      timeout: 30000
    });

    // Return Gemini response raw (frontend will parse)
    return res.json(response.data);
  } catch (err) {
    console.error('Error calling Gemini:', err?.response?.data || err.message || err);
    return res.status(500).json({
      error: 'Failed to call Gemini API',
      details: err?.response?.data || err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
