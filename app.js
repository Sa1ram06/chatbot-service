const express = require("express");
const OpenAI = require('openai');
const bodyParser = require("body-parser");
const cors = require('cors');  // Import cors

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

app.use(cors());  // This will allow all origins

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling


// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to handle chat requests
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama3-70b-instruct",
      messages: [{ "role": "user", "content": message }],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
      stream: false, // Change to false to get complete response in one go
    });

    // Extract and send the response back to frontend
    const responseText = completion.choices[0]?.message?.content || '';
    res.json({ response: responseText });
  } catch (error) {
    console.error('Error during completion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
