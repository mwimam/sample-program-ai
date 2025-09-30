import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import readline from "readline";

// Load environment variables from .env file
dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Function to get user input
function getUserInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  // Store conversation history for short-term memory
  const conversationHistory = [];
  
  console.log("🤖 AI Chat Assistant");
  console.log("=".repeat(50));
  console.log("Type 'exit' to quit the program");
  console.log("=".repeat(50));

  while (true) {
    try {
      // Get user input
      const userPrompt = await getUserInput("\n💬 You: ");

      // Check for exit command
      if (userPrompt.trim().toLowerCase() === 'exit') {
        console.log("\n👋 Goodbye! Thanks for chatting!");
        break;
      }

      if (!userPrompt.trim()) {
        console.log("⚠️  Please enter a message or type 'exit' to quit.");
        continue;
      }

      // Add user message to conversation history
      conversationHistory.push({
        role: "user",
        parts: [{ text: userPrompt }]
      });

      console.log("\n🤔 Thinking...");

      // Create contents array with conversation history
      const contents = conversationHistory.slice(-10); // Keep last 10 messages for memory

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        maxOutputTokens: 200,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        frequencyPenalty: 0.5,
        presencePenalty: 0.5,
        stopSequences: ["Stop"],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_LOW_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_LOW_AND_ABOVE",
          },
        ],
      });

      const aiResponse = response.text;
      
      // Add AI response to conversation history
      conversationHistory.push({
        role: "model",
        parts: [{ text: aiResponse }]
      });

      console.log("\n🤖 AI:", aiResponse);
      console.log("-".repeat(50));

    } catch (error) {
      console.error("❌ Error:", error.message);
      console.log("Please try again or type 'exit' to quit.");
    }
  }
}

main();
