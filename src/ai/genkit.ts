import {config} from 'dotenv';
config(); // Ensures .env.local is loaded for local development

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GenkitError: The GOOGLE_AI_API_KEY environment variable is not set. Please ensure it is defined in your .env.local file for local development, and that the server has been restarted after changes.");
}

export const ai = genkit({
  plugins: [googleAI({apiKey})],
});
