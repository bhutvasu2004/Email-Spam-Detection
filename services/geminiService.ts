
import { GoogleGenAI, Type } from "@google/genai";
import type { Prediction } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    is_spam: {
      type: Type.BOOLEAN,
      description: "Is the email content considered spam?",
    },
    reason: {
      type: Type.STRING,
      description: "A brief explanation for the classification.",
    },
  },
  required: ["is_spam", "reason"],
};

export async function detectSpam(emailContent: string): Promise<Prediction> {
  try {
    const prompt = `
      Analyze the following email content and determine if it is spam.
      Your analysis should be based on common spam characteristics such as suspicious links, urgent requests for personal information, grammatical errors, unsolicited offers, and generic greetings.
      Provide a clear 'true' or 'false' classification for 'is_spam' and a concise reason for your decision.

      Email Content:
      ---
      ${emailContent}
      ---
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedPrediction: Prediction = JSON.parse(jsonText);

    // Basic validation
    if (typeof parsedPrediction.is_spam !== 'boolean' || typeof parsedPrediction.reason !== 'string') {
        throw new Error("Invalid response format from API");
    }

    return parsedPrediction;
  } catch (error) {
    console.error("Error detecting spam:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get prediction from Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while detecting spam.");
  }
}
