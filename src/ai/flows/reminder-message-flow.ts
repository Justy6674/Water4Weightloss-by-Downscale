
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
  - User's Name: ${'input.userName'}
  - Current Hydration: ${'input.hydrationPercentage'}% of daily goal
  - Time Since Last Drink: ${'input.timeSinceLastDrink'}
  - Preferred Tone: ${'input.preferredTone'}
  - Time of Day: ${'input.timeOfDay'}

  TASK: Generate a reminder message with the specified tone. For example, a funny reminder could be "Are you a camel? It's been ${'input.timeSinceLastDrink'} since your last drink!". A supportive one could be "Hey ${'input.userName'}, just a gentle reminder to take a sip of water and keep up the great work!".
  `;

export async function generateReminder(input: ReminderInput): Promise<ReminderOutput> {
  console.log('DIRECT AI SDK: Generating reminder with input:', JSON.stringify(input, null, 2));

  const prompt = promptTemplate
    .replace('${"input.userName"}', input.userName || 'there')
    .replace('${"input.hydrationPercentage"}', String(input.hydrationPercentage))
    .replace('${"input.timeSinceLastDrink"}', input.timeSinceLastDrink)
    .replace('${"input.preferredTone"}', input.preferredTone)
    .replace('${"input.timeOfDay"}', input.timeOfDay)
    .replace('${"input.timeSinceLastDrink"}', input.timeSinceLastDrink)
    .replace('${"input.userName"}', input.userName || 'there');

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text();

    console.log('DIRECT AI SDK SUCCESS: Received raw response from Gemini:', jsonString);

    const parsedOutput = ReminderOutputSchema.parse(JSON.parse(jsonString));
    
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
