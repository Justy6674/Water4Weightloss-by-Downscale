
'use server';

/**
 * @fileOverview AI flow for generating hydration reminder messages.
 *
 * - generateReminder - Generates a context-aware reminder message.
 * - ReminderInput - The input type for the generateReminder function.
 * - ReminderOutput - The return type for the generateReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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


export async function generateReminder(input: ReminderInput): Promise<ReminderOutput> {
  return reminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reminderMessagePrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: ReminderInputSchema},
  output: {schema: ReminderOutputSchema},
  prompt: `You are an AI assistant that sends brief, effective hydration reminders.
  Your goal is to gently nudge the user to drink some water.
  Keep the message very short (1-2 sentences).

  Use the following information to craft the reminder:
  - User's Name: {{userName}}
  - Current Hydration: {{hydrationPercentage}}% of daily goal
  - Time Since Last Drink: {{timeSinceLastDrink}}
  - Preferred Tone: {{preferredTone}}
  - Time of Day: {{timeOfDay}}

  TASK: Generate a reminder message with the specified tone. For example, a funny reminder could be "Are you a camel? It's been {{timeSinceLastDrink}} since your last drink!". A supportive one could be "Hey {{userName}}, just a gentle reminder to take a sip of water and keep up the great work!".
  `,
});


const reminderFlow = ai.defineFlow(
  {
    name: 'reminderFlow',
    inputSchema: ReminderInputSchema,
    outputSchema: ReminderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
