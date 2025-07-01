
'use server';

/**
 * @fileOverview AI flow for generating hydration reminder messages using the direct Google AI SDK.
 *
 * - generateReminder - Generates a context-aware reminder message.
 * - ReminderInput - The input type for the generateReminder function.
 * - ReminderOutput - The return type for the generateReminder function.
 */

import { model } from '@/server/google-ai';
import { z } from 'zod';


const ReminderInputSchema = z.object({
  userName: z.string().optional().describe("The user's name, if available."),
  hydrationPercentage: z.number().describe('The current hydration percentage of the user.'),
  timeSinceLastDrink: z.string().describe('Time elapsed since the last recorded drink (e.g., "2 hours").'),
  preferredTone: z.string().describe('The user-preferred tone for the message (e.g., funny, supportive, sarcastic, crass, kind).'),
  timeOfDay: z.string().describe('The current time of day (e.g., morning, afternoon, evening).'),
});
export type ReminderInput = z.infer<typeof ReminderInputSchema>;

const ReminderOutputSchema = z.object({
  message: z.string().describe('The concise, personalized reminder message.'),
});
export type ReminderOutput = z.infer<typeof ReminderOutputSchema>;


const promptTemplate = `You are an AI assistant that sends brief, effective hydration reminders.
  Your goal is to gently nudge the user to drink some water.
  Keep the message very short (1-2 sentences).
  Return a JSON object matching this schema: { "message": "The concise, personalized reminder message." }

  Use the following information to craft the reminder:
  - User's Name: __USER_NAME__
  - Current Hydration: __HYDRATION_PERCENTAGE__% of daily goal
  - Time Since Last Drink: __TIME_SINCE_LAST_DRINK__
  - Preferred Tone: __PREFERRED_TONE__
  - Time of Day: __TIME_OF_DAY__

  TASK: Generate a reminder message with the specified tone. For example, a funny reminder could be "Are you a camel? It's been __TIME_SINCE_LAST_DRINK__ since your last drink!". A supportive one could be "Hey __USER_NAME__, just a gentle reminder to take a sip of water and keep up the great work!".
  `;

export async function generateReminder(input: ReminderInput): Promise<ReminderOutput> {
  console.log('DIRECT AI SDK: Generating reminder with input:', JSON.stringify(input, null, 2));

  const prompt = promptTemplate
    .replace(/__USER_NAME__/g, input.userName || 'there')
    .replace(/__HYDRATION_PERCENTAGE__/g, String(input.hydrationPercentage))
    .replace(/__TIME_SINCE_LAST_DRINK__/g, input.timeSinceLastDrink)
    .replace(/__PREFERRED_TONE__/g, input.preferredTone)
    .replace(/__TIME_OF_DAY__/g, input.timeOfDay);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text();

    console.log('DIRECT AI SDK SUCCESS: Received raw response from Gemini:', jsonString);

    // Clean the jsonString to remove markdown code block markers
    const cleanedJsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedOutput = ReminderOutputSchema.parse(JSON.parse(cleanedJsonString));
    
    console.log('DIRECT AI SDK SUCCESS: Parsed and validated output:', parsedOutput);
    return parsedOutput;

  } catch (e) {
    console.error("DIRECT AI SDK CRITICAL FAILURE in generateReminder:", e);
    if (e instanceof Error) {
      throw new Error(`Gemini API call failed for reminder: ${e.message}`);
    }
    throw new Error('An unknown error occurred while calling the Gemini API for a reminder.');
  }
}
