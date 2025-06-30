
'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// This is the single, centralized point for initializing the Google AI SDK.
// It is a server-only module and must not be imported into client components.

const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  // This error will be thrown during server-side rendering or action execution
  // if the API key is not configured, preventing silent failures.
  throw new Error('CRITICAL: The GOOGLE_AI_API_KEY environment variable is not set. The AI features cannot function without it. Please ensure it is defined in your .env.local file for local development and as a secret for deployment.');
}

const genAI = new GoogleGenerativeAI(apiKey);

// We configure the model to expect JSON responses, which makes parsing more reliable.
export const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
  },
});
