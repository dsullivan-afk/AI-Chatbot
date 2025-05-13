// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a friendly chatbot in a 3D world.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await openaiRes.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
