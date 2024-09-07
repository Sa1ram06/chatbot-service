/*
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
})
 
async function main() {
  const completion = await openai.chat.completions.create({
    model: "meta/llama-3.1-8b-instruct",
    messages: [{"role":"user","content":"weekend trip ideas"}],
    temperature: 0.2,
    top_p: 0.7,
    max_tokens: 1024,
    stream: true
  })
   
  for await (const chunk of completion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '')
  }
  
}

main();
*/

const express = require('express');
const OpenAI = require('openai');
const bodyParser = require("body-parser");

const app = express();
const port = 3000; // Or any port you prefer

const staticMiddleware = express.static("public");

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddleware);

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

// Start the server
app.listen(port, () => {
  console.log(`Chatbot running at http://localhost:${port}/chatbot.html`);
});
