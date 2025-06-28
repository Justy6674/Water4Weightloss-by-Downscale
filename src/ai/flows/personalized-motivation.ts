'use server';

/**
 * @fileOverview AI-powered personalized motivation flow.
 *
 * - generateMotivation - A function that generates personalized motivational messages based on user's hydration habits and progress.
 * - MotivationInput - The input type for the generateMotivation function.
 * - MotivationOutput - The return type for the generateMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationInputSchema = z.object({
  hydrationPercentage: z
    .number()
    .describe('The current hydration percentage of the user.'),
  streak: z.number().describe('The current hydration streak of the user.'),
  lastDrinkSizeMl: z.number().describe('The size of the last drink in ml.'),
  timeOfDay: z
    .string()
    .describe('The current time of day (e.g., morning, afternoon, evening).'),
  preferredTone: z
    .string()
    .describe(
      'The user preferred tone of the motivation message (e.g., funny, supportive, sarcastic, crass, kind)'
    ),
  milestoneStatus: z.enum(['onTrack', 'ahead', 'goalMet', 'none']).describe("The user's status towards their next hydration milestone. 'onTrack' means they are working towards it, 'ahead' means they've surpassed the current milestone's goal, 'goalMet' means the total daily goal is done, 'none' means all milestones for the day are passed."),
  nextMilestoneInfo: z.string().optional().describe("Information about the next milestone if applicable, e.g., '1000ml by 10 AM'.")
});
export type MotivationInput = z.infer<typeof MotivationInputSchema>;

const MotivationOutputSchema = z.object({
  message: z.string().describe('The personalized motivational message.'),
});
export type MotivationOutput = z.infer<typeof MotivationOutputSchema>;

export async function generateMotivation(input: MotivationInput): Promise<MotivationOutput> {
  return personalizedMotivationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedMotivationPrompt',
  input: {schema: MotivationInputSchema},
  output: {schema: MotivationOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized motivational messages to users who are tracking their water intake.

  The goal is to keep the user motivated to stay hydrated and achieve their daily hydration goals.
  The message should be personalized based on the user's current hydration status, streak, last drink size, time of day and preferred tone.
  Also consider the user's progress towards their time-based milestones.

  Hydration Percentage: {{{hydrationPercentage}}}%
  Streak: {{{streak}}} days
  Last Drink Size: {{{lastDrinkSizeMl}}} ml
  Time of Day: {{{timeOfDay}}}
  Preferred Tone: {{{preferredTone}}}

  Milestone Status: {{{milestoneStatus}}}
  {{#if nextMilestoneInfo}}
  Next Milestone: {{{nextMilestoneInfo}}}
  {{/if}}

  Generate a motivational message with the specified tone. Keep the message concise.
  
  - If milestoneStatus is 'ahead', congratulate them for being ahead of schedule.
  - If milestoneStatus is 'onTrack', encourage them to keep going to hit their next milestone.
  - If milestoneStatus is 'goalMet', give them a big congratulation for hitting their daily goal.
  - If milestoneStatus is 'none', tell them they did a great job today and to remember to hydrate tomorrow.
  `,
});

const personalizedMotivationFlow = ai.defineFlow(
  {
    name: 'personalizedMotivationFlow',
    inputSchema: MotivationInputSchema,
    outputSchema: MotivationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
