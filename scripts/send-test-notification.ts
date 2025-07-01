
import { generateReminder, ReminderInput } from '../src/ai/flows/reminder-message-flow';
import { execSync } from 'child_process';

// This function will fetch the GOOGLE_AI_API_KEY from App Hosting secrets.
function getGoogleAiApiKey(): string {
    try {
        console.log('Fetching Google AI API Key from secrets...');
        // Use gcloud to get the secret.
        const key = execSync('gcloud secrets versions access latest --secret=googleAiApiKey').toString().trim();
        if (!key) {
            throw new Error('Google AI API Key secret is empty.');
        }
        console.log('Successfully fetched Google AI API Key.');
        return key;
    } catch (error) {
        console.error('CRITICAL: Failed to retrieve Google AI API Key.', error);
        if (process.env.GOOGLE_AI_API_KEY) {
            console.log('Falling back to GOOGLE_AI_API_KEY environment variable.');
            return process.env.GOOGLE_AI_API_KEY;
        }
        process.exit(1);
    }
}


async function testAiReminderGeneration() {
  // Set the API key in the environment for the AI SDK to use.
  process.env.GOOGLE_AI_API_KEY = getGoogleAiApiKey();

  const testInput: ReminderInput = {
    userName: 'Test User',
    hydrationPercentage: 50,
    timeSinceLastDrink: '2 hours',
    preferredTone: 'funny',
    timeOfDay: 'afternoon',
  };

  try {
    console.log('Generating test reminder...');
    const reminder = await generateReminder(testInput);
    
    console.log("--- AI HEALTH CHECK: PASSED ---");
    console.log("Successfully generated a test reminder message:");
    console.log(`MESSAGE: "${reminder.message}"`);
    console.log("This confirms the AI flow is working correctly.");

  } catch (error) {
    console.error("--- AI HEALTH CHECK: FAILED ---");
    console.error("An error occurred during AI message generation:", error);
  }
}

testAiReminderGeneration();
