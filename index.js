const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON dan form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve file statis dari folder "public"
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint untuk menerima pesan user dan memanggil OpenRouter API
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Ganti YOUR_OPENROUTER_API_KEY dengan API key OpenRouter versi gratismu
    const OPENROUTER_API_KEY = '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';

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "gpt-4o-mini",    // model yang tersedia versi gratis, sesuaikan jika berubah
      messages: [
        { role: "user", content: userMessage }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Ambil balasan chatbot dari response API
    const botReply = response.data.choices[0].message.content;
    res.json({ reply: botReply });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from OpenRouter' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
