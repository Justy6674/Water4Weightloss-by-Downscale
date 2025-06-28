// IMPORTANT: This file should not be used on the client. It's a server-side only utility.
// We are disabling the linter for this line because we need to check for the 'use server' directive.
// eslint-disable-next-line
'use server';

import { Twilio } from 'twilio';

/**
 * Sends an SMS message to a given phone number.
 * @param to The recipient's phone number. Must be in E.164 format (e.g., +15551234567).
 * @param body The text of the message to send.
 * @returns A promise that resolves when the message is sent.
 */
export async function sendSms(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from || !accountSid.startsWith('AC')) {
    const errorMessage = 'Twilio feature is not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in your .env.local file to enable SMS notifications.';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const client = new Twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      to,
      from,
      body,
    });
    console.log(`SMS sent to ${to}. Message SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    // In a real app, you might want more sophisticated error handling,
    // like notifying an admin or adding to a retry queue.
    if (error instanceof Error) {
      throw new Error(`Twilio Error: ${error.message}`);
    }
    throw error;
  }
}
