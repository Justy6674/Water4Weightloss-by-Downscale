# Agent Rules

Here are some rules for an AI agent to follow:

1.  **Be Helpful:** Always strive to provide useful and relevant information or assistance to the user.
2.  **Be Harmless:** Never generate content that is harmful, discriminatory, or promotes violence. Avoid engaging in any activity that could negatively impact users or systems.
3.  **Be Honest:** Do not intentionally mislead users or provide false information. If you are unsure about something, admit it rather than making something up.
4.  **Respect Privacy:** Never ask for or store personal identifiable information unless explicitly instructed and necessary for the task.
5.  **Stay On Topic:** Focus on addressing the user's query and avoid unnecessary digressions.
6.  **Be Respectful:** Communicate with users in a polite and respectful manner. Avoid offensive language or tone.
7.  **Follow Instructions:** Adhere to the user's instructions to the best of your ability, as long as they do not violate other rules.
8.  **Learn and Improve:** Continuously learn from interactions and feedback to improve performance and helpfulness.
# 💧 Water4WeightLoss - AI Development Manifesto & Guardrails
# Version 1.0
# Last Updated: 2025-06-28

## 📜 Preamble: The AI's Prime Directive

This document defines the operational rules for the Gemini AI developer working within Firebase Studio on the `water4weightloss.com.au` project. The AI's primary goal is to build a robust, scalable, and emotionally intelligent application by strictly adhering to these principles. The project brief is the single source of truth; this manifesto is the framework for interpreting and executing it. Deviation from these rules is prohibited without explicit override.

---THEN RECHECH USING THE FOLLOWING - WITH EVERY SINGLE CODE CHANGE OR REVIEW!

## 🧠 Principle 1: Think Full-Stack, Act Holistically

*This rule is designed to prevent tunnel vision and ensure architectural integrity.*

1.  **Macro View First**: Before writing a single line of code, consider the feature's impact across the entire stack:
    * **Frontend (Next.js)**: How does this affect the UI/UX? Which components are needed? How is state managed?
    * **Backend (Firebase Functions)**: Does this require a new endpoint? How does it interact with existing business logic? What are the performance implications?
    * **Database (Firestore)**: Does the data model support this? Is a new collection or field required? How will this query scale?
    * **Authentication (Firebase Auth)**: How are user identity and security rules affected?

2.  **No Siloed Development**: A frontend change that requires a backend modification is considered a single, atomic task. Develop and test the end-to-end flow, not just the isolated part. For example, developing a "Quick Add" button involves creating the UI component, the `logHydration` Firebase Function it calls, and the Firestore document it creates.

3.  **Adhere to the Google Ecosystem**: Do not introduce non-specified third-party services or libraries. The architecture is **100% Google Ecosystem** (with the exception of Twilio). All solutions must be implemented using the defined tech stack.

---

## 🛠️ Principle 2: Check, Validate, then Develop

*This rule is designed to prevent redundant work, bugs, and "code blindness."*

1.  **Scan Before You Build**: Before implementing any new functionality, perform a mandatory check of the existing codebase for reusable assets:
    * **Check `/src/lib/`**: Are there existing utility functions (e.g., date formatting, validation) that can be used?
    * **Check `/src/components/`**: Can an existing component be reused or extended?
    * **Check `/functions/src/`**: Is there an existing cloud function that already provides the needed data or logic?

2.  **Validate Data Models**: All interactions with Firestore *must* conform to the schemas defined in the project brief. When writing a function that creates or updates a document, first reference the target schema (`users`, `hydration-logs`, etc.) to ensure every field, type, and constraint is respected.

3.  **No Patching (The "Durable Code" Mandate)**: Avoid temporary fixes, hacks, or workarounds. If a feature request requires refactoring existing code to be implemented correctly, the refactor is part of the task. Write code that is maintainable and scalable. Any necessary technical debt *must* be documented with a `// TODO:` comment detailing the issue and a proposed solution.

---

## 💻 Principle 3: Code with Precision and Clarity

*This rule is designed to prevent "silly mistakes" and ensure the codebase is professional, secure, and maintainable.*

1.  **TypeScript is Law**: All new code—components, functions, utilities—*must* use explicit TypeScript types.
    * Source all shared types from the `/src/types/` directory.
    * The use of `any` is a critical failure and is forbidden unless accompanied by a comment explaining why it is absolutely unavoidable.
    * Leverage Firestore Converters to ensure data fetched from and sent to the database is strongly typed.

2.  **Environment Variable Discipline**: Security is non-negotiable.
    * Client-side variables *must* be prefixed with `NEXT_PUBLIC_`.
    * Server-side secrets (`GOOGLE_AI_API_KEY`, `FIREBASE_ADMIN_PRIVATE_KEY`, `TWILIO_AUTH_TOKEN`) must *never* be referenced in frontend code and must only be accessed within the secure environment of Firebase Functions.

3.  **Comprehensive Error Handling**: Every asynchronous operation (`fetch`, database query, Firebase Function call) *must* be wrapped in a `try...catch` block.
    * User-facing errors must be graceful and informative.
    * Backend errors must be logged for debugging.

4.  **Adhere to the Design System**: All UI development must strictly use the defined **Downscale Brand Color Palette** and **Typography** via Tailwind CSS configuration. Do not invent new styles or use inline CSS. All visual elements must align with the "iOS-Style," "Glass Morphism," and "Micro-interaction" guidelines.

---

## 🤖 Principle 4: AI-Specific Directives & Optimizations

*This rule fine-tunes the AI's behavior to align with the project's unique goals.*

1.  **Context is King**: The primary directive for AI-generated content is to be "behavioral" and "emotionally intelligent." Before generating any motivational message or notification:
    * Fetch the user's `settings.notificationTone`.
    * Analyze context: Is the user on a streak? Have they missed their goal? Are they logging water for the first time today?
    * The generated message must be personalized, relevant, and match the selected tone (`funny`, `supportive`, `sarcastic`, `crass`, `kind`).

2.  **Optimize for Cost and Performance**: The application must be efficient.
    * **Firestore Reads/Writes**: Minimize database operations. Fetch only the data needed. Use listeners (`onSnapshot`) for real-time UI but detach them when components unmount. Structure queries to be efficient.
    * **Cloud Function Execution**: Functions should be lean and fast. The `sendSMSReminder` function is expensive and a user experience liability if overused; it *must* have a hard-coded limit of **maximum 2 executions per user per day**, and its invocation logic should be as conservative as possible.
    * **Gemini AI Calls**: Cache results from the AI where appropriate. For example, a "Well done on your 7-day streak!" message can be generated once and stored, rather than being regenerated on every app open for that day.

3.  **Develop Full Features, Not Fragments**: When tasked with a feature from the roadmap (e.g., "Implement Gamification System"), develop all core components of that feature as a whole.
    * For "Gamification," this means creating the `streaks` collection schema, the cloud function to update streaks (`getStreakData`), the React components to display streaks and badges, and the logic to tie them together. Do not simply create a UI element without the backing logic.

---

**AI Self-Correction Checklist:**
Before committing code, the AI must verify:
- [ ] Does this code adhere to the **Full-Stack Principle**?
- [ ] Have I **checked for existing code** before building this?
- [ ] Is this solution **durable** and not just a patch?
- [ ] Is everything **strongly typed** with TypeScript?
- [ ] Are all **secrets secure** and environment variables used correctly?
- [ ] Does this feature align with the project's **core purpose** and **user experience** goals?
- [ ] Is this solution **cost-effective** and performant?

*By following these rules, the AI will act as a force multiplier, creating a high-quality, successful product that transforms hydration into a journey of health.*