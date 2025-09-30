import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:
      "Explain how AI works in a few words, explain it like i'm a 5 year old, what is temperature, topP, topK, frequencyPenalty, presencePenalty, stopSequences, safetySettings, maxOutputTokens, explain it like i'm a 5 year old in bahasa Indonesia",
    maxOutputTokens: 100,
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
  console.log(response.text);
}

main();
