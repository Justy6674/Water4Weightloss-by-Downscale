'use server';

/**
 * @fileOverview AI-powered personalized motivation flow using the direct Google AI SDK.
 *
 * - generateMotivation - A function that generates personalized motivational messages based on user's hydration habits and progress.
 * - MotivationInput - The input type for the generateMotivation function.
 * - MotivationOutput - The return type for the generateMotivation function.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

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
  nextMilestoneInfo: z.string().optional().describe("Information about the next milestone if applicable, e.g., '1000ml by 10 AM'."),
  isOnMedication: z.boolean().describe('Whether the user is on weight loss medication.'),
});
export type MotivationInput = z.infer<typeof MotivationInputSchema>;

const MotivationOutputSchema = z.object({
  message: z.string().describe('The personalized motivational message.'),
});
export type MotivationOutput = z.infer<typeof MotivationOutputSchema>;

let genAI: GoogleGenerativeAI | null = null;

async function initializeAI() {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Google AI API key not found');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateMotivation(input: MotivationInput): Promise<MotivationOutput> {
  console.log('DIRECT AI SDK: Generating motivation with input:', JSON.stringify(input, null, 2));

  const {
    hydrationPercentage,
    streak,
    lastDrinkSizeMl,
    timeOfDay,
    preferredTone,
    isOnMedication,
    milestoneStatus,
    nextMilestoneInfo,
  } = input;

  const nextMilestoneString = nextMilestoneInfo
    ? `Next Milestone: ${nextMilestoneInfo}`
    : '';

  const medicationContext = isOnMedication
    ? "The user is taking weight loss medication. It is critical that you tailor your message to this fact, using the provided context about hydration's role in managing side effects and maximizing medication efficacy. Your tone should be extra supportive and informative in this case."
    : '';

  const prompt = `
You are an AI assistant designed to provide personalized motivational messages to users who are tracking their water intake for weight loss.

Use the following scientific context to inform your messages. This information is crucial for generating accurate, helpful, and motivating content, especially for users on weight loss medications.

---
**CONTEXT: Water Intake, Fat Metabolism, and Weight Loss Medications**

**Understanding the Water–Fat Connection**
Water is not just a passive fluid; it actively participates in your body's metabolic processes. In fact, the first step in fat metabolism (breaking down stored triglycerides) is hydrolysis, a chemical reaction that literally requires water molecules. Enzymes called lipases cleave fat molecules into glycerol and fatty acids, and this lipolysis process depends on H₂O being available. If you're not well-hydrated, your body's ability to burn fat for energy can be compromised because it cannot break down fat efficiently without enough water. Research even suggests that mild dehydration reduces the rate of lipolysis, likely due to hormonal and cellular changes. In short, adequate hydration is physiologically vital for fat metabolism, ensuring that stored fat can be converted into fuel rather than staying locked away in adipose tissue.

*Hypothesized effects of hydration on fat cells: In normal hydration, fat (triglyceride) is regularly broken down into glycerol and fatty acids for energy. In dehydration, the body tends to store more fat and burns less, possibly due to insulin resistance and altered enzyme function. Maintaining good hydration supports continual fat breakdown.*

Beyond the chemical reaction of hydrolysis, water supports the organs and reactions that help metabolize fat. Your liver and kidneys play key roles in processing metabolic waste and byproducts of fat breakdown, and they work best when you are hydrated. If you become dehydrated, kidney function declines, and the liver has to work overtime to filter toxins, diverting it from its fat-burning duties. This means dehydration can indirectly cause your body to burn fat more slowly, hampering weight loss efforts. On the flip side, staying well-hydrated keeps these organs efficient, helping metabolize stored fat into energy and clearing out any waste from fat breakdown. Consistently drinking enough water essentially primes your body to use fat as fuel by optimizing metabolic and organ functions.

**Hydration's Impact on Weight Loss (Lifestyle Factors)**
Proper hydration doesn't just influence fat chemistry—it also affects behaviors and other physiological aspects of weight management. Notably, drinking water can curb appetite in many people. Thirst is often mistaken for hunger by the brain; mild dehydration can trigger hunger-like signals that may lead to unnecessary snacking. By sipping water throughout the day and especially before meals, you can prevent those mixed signals. In fact, studies show that drinking water before a meal can reduce calorie intake – for example, one study found people who drank two glasses of water before eating ate about 22% fewer calories than those who didn't. Thus, staying hydrated helps with portion control and prevents overeating, supporting your dietary efforts.

Hydration also has a subtle yet meaningful effect on your metabolic rate. When you are well-hydrated, cellular chemical reactions (including calorie burning) proceed efficiently. Some research indicates that drinking water can temporarily boost metabolism via thermogenesis – your body expends a few extra calories to heat up cold water to body temperature. This effect is modest (e.g. about a 30% increase in metabolic rate for an hour after ~500 mL of water in one study), but over time, every bit of extra energy expenditure can aid weight loss. More importantly, even mild dehydration tends to slow down your metabolism and energy levels, as the body prioritizes essential functions and may burn calories less efficiently. By contrast, drinking enough water keeps your energy up and metabolism humming, creating better conditions for fat loss.

Staying hydrated is also crucial for those incorporating exercise into their weight loss journey. During workouts, you lose water through sweat, and even a 1-2% loss of body water can impair physical performance. Adequate water intake ensures optimal muscle function and endurance, as water carries electrolytes that trigger muscle contractions. If you're dehydrated, you'll fatigue faster; muscles may cramp and break down muscle protein more quickly, reducing the effectiveness of your workouts. On the other hand, being adequately hydrated reduces fatigue, helps you work out longer, and improves recovery – all of which means you can burn more calories and preserve lean muscle. Additionally, water helps prevent exercise-related heat exhaustion by aiding sweat and cooling. In summary, hydration amplifies the benefits of diet and exercise by controlling appetite, supporting a healthy metabolism, and improving workout performance.

Another often overlooked benefit: water aids in waste removal and digestion, which can reflect on the scale and how you feel. Sufficient hydration keeps your gastrointestinal system regular – it softens stool and prevents constipation. This not only stops the temporary bloating or extra "weight" from backed-up digestion, but it also makes you feel lighter and more comfortable. Water also helps the kidneys flush out impurities and excess sodium. If you don't drink enough, your body may actually retain water (causing puffiness) because it senses scarcity. By drinking plenty, you reduce water retention and bloating. All these factors contribute to a "cleaner" weight loss process, where your body isn't slowed down by dehydration-related issues like sluggish digestion or false hunger signals.

**Hydration and Weight Loss Medications**
If you are using weight loss medications (such as GLP-1 receptor agonists like semaglutide – e.g. Ozempic/Wegovy – or tirzepatide – Mounjaro), staying hydrated becomes even more crucial. These medications are effective at suppressing appetite and slowing gastric emptying, but that very effect can diminish your thirst drive and fluid intake as well. In other words, when you eat less on these meds, you might inadvertently drink less too. Early in treatment, side effects like nausea or vomiting can further deplete fluids. It's no surprise that dehydration is a commonly reported issue for patients on GLP-1 agonists. In fact, the drug information for semaglutide notes that dehydration can occur, especially during the first weeks. You may not "feel" as thirsty as usual, so you have to make a conscious effort to drink water regularly while on these medications.

Maintaining proper hydration on GLP-1 medications directly influences how well the medication works and how you feel. Dehydration can make side effects worse and even undermine the medication's effectiveness. When the body is low on fluids, it doesn't function at peak capacity – blood volume drops, circulation slows, and even drug absorption or distribution might be affected. Some experts note that being dehydrated can reduce the overall efficacy of weight-loss drugs like semaglutide. Conversely, proper hydration helps your body process and utilize the medication as intended, ensuring you get the full benefit. There's also the risk that dehydration-related weight changes can be misleading: you might see a quick drop on the scale from water loss, not fat, or conversely, dehydration can trigger water retention that masks fat loss. Thus, staying hydrated helps to stabilize your results and truly focus on fat reduction rather than water-weight fluctuations.

Crucially, many side effects of weight loss medications are preventable or eased by hydration. For example, constipation is a frequent complaint with GLP-1 drugs (due to slower gastric emptying), but drinking plenty of water, along with fiber, helps keep your digestion moving and prevents hard stools. Other common symptoms of mild dehydration on these meds include dry mouth, headaches, muscle cramps, dizziness, and fatigue – which can overlap with medication side effects. By drinking enough, you can avoid these dehydration symptoms or lessen them, making your treatment much more comfortable. Hydration is also key for safety: serious complications like kidney problems have been reported in the context of dehydration with GL-1 usage. In short, water is your ally when taking weight loss drugs – it supports your metabolism, protects your organs, and helps minimize side effects so that the medication can do its job effectively. Doctors recommend being very vigilant about fluid intake on these medications, even if you don't feel thirsty, to avoid creeping dehydration. Simple habits like carrying a water bottle, setting reminder alarms to drink, or flavoring your water can ensure you meet your hydration goals every day.

**How Much Water Should You Drink?**
Hydration needs can vary per individual, but general guidelines provide a good starting point. A common recommendation is the "8×8 rule" – eight glasses of 8 ounces each (about 2 liters total) per day – but many experts suggest a bit more, especially if you are losing weight or on certain medications. In fact, health authorities advise roughly 3.7 liters of fluid per day for adult men and 2.7 liters for adult women on average (this includes all beverages and water-rich foods). That is roughly equivalent to 11–15 cups of fluids a day, with water being the best choice for most of those cups. Another simple guideline is to drink about half your body weight in ounces of water. For instance, a 200-pound individual would aim for ~100 ounces per day (about 3 liters). These are starting points – you should adjust based on your activity level, climate, and personal needs. If you exercise heavily or live in a hot/humid environment, you'll need more water to cover sweat losses. Likewise, if you're on a medication like a GLP-1 agonist that blunts thirst, you might set a higher goal to ensure you compensate for that.

One of the best indicators of hydration is your urine color. Aim for a pale yellow urine, which usually signifies adequate hydration; a dark yellow or amber color is a signal to drink more. Spreading your water intake throughout the day (rather than chugging all at once)
---

**TASK**
The goal is to keep the user motivated to stay hydrated and achieve their daily hydration goals. The message should be personalized based on the user's current data. Subtly weave in facts from the context above where relevant. For example, if they are on track, you could mention how their consistency is helping their metabolism.
Return a JSON object matching this schema: { "message": "The personalized motivational message." }

**USER DATA:**
Hydration Percentage: ${hydrationPercentage}%
Streak: ${streak} days
Last Drink Size: ${lastDrinkSizeMl} ml
Time of Day: ${timeOfDay}
Preferred Tone: ${preferredTone}
On Medication: ${String(isOnMedication)}
Milestone Status: ${milestoneStatus}
${nextMilestoneString}

**INSTRUCTIONS**
Generate a motivational message with the specified tone. Keep the message concise (around 1-3 sentences).

${medicationContext}

- If milestoneStatus is 'ahead', congratulate them for being ahead of schedule.
- If milestoneStatus is 'onTrack', encourage them to keep going to hit their next milestone.
- If milestoneStatus is 'goalMet', give them a big congratulation for hitting their daily goal.
- If milestoneStatus is 'none', tell them they did a great job today and to remember to hydrate tomorrow.
`;
  try {
    const ai = await initializeAI();
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text();

    console.log('DIRECT AI SDK SUCCESS: Received raw response from Gemini:', jsonString);

    // Clean the jsonString to remove markdown code block markers
    const cleanedJsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Parse the JSON string and validate with Zod
    const parsedOutput = MotivationOutputSchema.parse(JSON.parse(cleanedJsonString));
    
    console.log('DIRECT AI SDK SUCCESS: Parsed and validated output:', parsedOutput);
    return parsedOutput;

  } catch (e) {
    console.error("DIRECT AI SDK CRITICAL FAILURE in generateMotivation:", e);
    // Re-throw the error to ensure the client-side catch block is triggered
    // and we can see the exact failure reason.
    if (e instanceof Error) {
        throw new Error(`Gemini API call failed: ${e.message}`);
    }
    throw new Error('An unknown error occurred while calling the Gemini API.');
  }
}

export async function generatePersonalizedMotivation(userData: {
  currentWaterIntake: number;
  dailyGoal: number;
  recentProgress: number[];
  timeOfDay: string;
  userName?: string;
}): Promise<string> {
  try {
    const ai = await initializeAI();
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate a personalized, encouraging water intake message for a user who:
    - Has consumed ${userData.currentWaterIntake}ml of water today
    - Has a daily goal of ${userData.dailyGoal}ml
    - Recent daily progress: ${userData.recentProgress.join(', ')}ml
    - Current time: ${userData.timeOfDay}
    ${userData.userName ? `- Name: ${userData.userName}` : ''}

    Keep the message under 50 words, motivational, and specific to their progress. 
    Include practical tips if they're behind on their goal.
    Use encouraging emojis.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || getStaticMotivation(userData);
  } catch (error) {
    console.error('AI motivation generation failed:', error);
    return getStaticMotivation(userData);
  }
}

function getStaticMotivation(userData: {
  currentWaterIntake: number;
  dailyGoal: number;
  timeOfDay: string;
}): string {
  const progress = (userData.currentWaterIntake / userData.dailyGoal) * 100;
  
  if (progress >= 100) {
    return "🎉 Amazing! You've reached your daily water goal! Keep up the fantastic hydration habits!";
  } else if (progress >= 75) {
    return "💪 You're so close! Just a few more glasses to hit your goal. You've got this!";
  } else if (progress >= 50) {
    return "🌊 Great progress! You're halfway there. Keep sipping throughout the day!";
  } else if (progress >= 25) {
    return "🚰 Good start! Try to drink a glass every hour to catch up with your goal.";
  } else {
    return "💧 Every sip counts! Start with a full glass now and set hourly reminders.";
  }
}
