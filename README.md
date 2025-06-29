
# 💧 Water4WeightLoss - Gamified Hydration Coach

A behavioral, emotionally intelligent hydration coach that adapts to your tone, preferences, and hydration history. Built by **Downscale Weight Loss Clinic**, every interaction is designed to be thoughtful, motivational, and visually satisfying.

## 🎯 Core Purpose

The goal of this application is to transform hydration from a daily chore into an engaging, gamified experience. By providing consistent water intake tracking and behavioral motivation, we directly support users' weight loss goals.

## ✨ Core Features

  * **💧 Hydration Logging**: Manual (ml/oz), quick-add buttons, and voice logging with a real-time interactive water glass visualization.
  * **🎮 Gamification System**: Daily streaks, weekly challenges, achievement badges, and progress milestones to keep users engaged.
  * **🤖 AI-Powered Motivation**: Personalized motivational messages from Google's Gemini AI that adapt to the user's tone (funny, supportive, crass, etc.) and context.
  * **⚖️ Weight Loss Integration**: Track body metrics like weight and waist measurements, visualize the correlation with hydration, and set goals.
  * **🔔 Smart Notifications**: Intelligent push notifications (and backup SMS reminders) with AI-generated content timed to the user's schedule.
  * **📱 Outstanding User Experience**: A clean, modern, mobile-first design with dark/light modes, offline capabilities, and a high standard of accessibility.

## 🏗️ Architecture & Tech Stack

This project is built on a **100% Google Ecosystem** for seamless integration, security, and scalability.

  * **Frontend**: React + Next.js 15
  * **Backend**: Firebase Functions (Node.js)
  * **Database**: Firestore (NoSQL)
  * **Authentication**: Firebase Auth
  * **AI**: Google Gemini AI (`gemini-1.5-flash`)
  * **Hosting**: Firebase Hosting
  * **Analytics**: Google Analytics 4
  * **Push Notifications**: Firebase Cloud Messaging (FCM)
  * **SMS**: Twilio (via Firebase Functions)
  * **Styling**: Tailwind CSS

## 🎨 Design System

All UI components must adhere to the official Downscale brand identity.

| Element               | Value                                                 |
| --------------------- | ----------------------------------------------------- |
| **Cream** (BG/UI)     | `#f7f2d3`                                             |
| **Brown** (Headers)   | `#b68a71`                                             |
| **Gray** (Text)       | `#666d70`                                             |
| **Bright Blue** (CTAs)| `#5271ff`                                             |
| **Slate** (Main BG)   | `#334155`                                             |
| **Primary Font** | `Inter` (from Google Fonts)                           |
| **Display Font** | `Roboto` (from Google Fonts)                          |
| **Visual Style** | iOS-Style, Glass Morphism, CSS Water Effects          |

## 🚀 Developer Setup: Getting Started

Follow these steps to set up the development environment.

### 1\. Prerequisites

  * Node.js (v18 or later)
  * NPM (or Yarn)
  * Firebase CLI

### 2\. Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd water4weightloss
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install
    ```

3.  **Install backend dependencies:**

    ```bash
    cd functions
    npm install
    cd ..
    ```

### 3\. Environment Variables & Service Account

**Step 1: Create `.env.local`**

Create a file named `.env.local` in the root directory and populate it with the necessary keys from your Firebase project and third-party services. These keys are for client-side functionality and server-side APIs like Google AI and Twilio.

```bash
# .env.local

# --- Firebase Client SDK (Public Keys) ---
# These are safe to expose to the browser and are used to identify your app.
# Find these in your Firebase project settings under "General" -> "Your apps" -> "SDK setup and configuration".
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY= # From your Google Cloud Console -> reCAPTCHA

# --- Other Services (Server-Side Secrets) ---
# These are for server-side functions and MUST NOT be prefixed with NEXT_PUBLIC_
GOOGLE_AI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

**Step 2: Add `service-account.json`**

For secure server-side operations (like sending push notifications), the application uses a Firebase service account.

1.  In your Firebase Project Settings, go to the **Service accounts** tab.
2.  Click **Generate new private key** and download the JSON file.
3.  Rename the downloaded file to `service-account.json`.
4.  Place this file in the **root directory** of the project.
5.  **Important:** This file contains highly sensitive secrets and should **never** be committed to public version control. Ensure it is listed in your `.gitignore` file. **The application reads this file directly for local development.**

### 4\. Run the Application

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🗂️ Project Structure

The codebase is organized into a clean, modern Next.js and Firebase project structure.

```
water4weightloss/
├── functions/          # All Backend Firebase Functions
│   └── src/
├── public/             # Static assets (images, fonts)
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # Reusable React components
│   ├── lib/            # Helper functions, Firebase config
│   └── types/          # TypeScript type definitions
├── service-account.json # Server-side credentials (DO NOT COMMIT)
└── firebase.json       # Firebase project configuration
```

## 🤖 AI Development & Contribution

This project is being built with an AI development agent (Gemini). To ensure quality, consistency, and adherence to the project vision, all contributions (human or AI) **must** follow the rules outlined in the **`STUDIO_AI_RULES.md`** file.

This manifesto governs our development philosophy, including:

  * Thinking full-stack and avoiding tunnel vision.
  * Writing durable, high-quality code instead of quick patches.
  * Prioritizing security and cost-optimization for Firebase services.

## 📈 Project Vision & Roadmap

This section outlines the business and strategic goals for the project.

### Pricing Model (Australia Only)

  * **Standard**: $9.95 AUD/month
  * **Downscale Patients**: 50% lifetime discount ($4.98 AUD/month)

### Launch Strategy

  * **Phase 1 (Month 1 - MVP)**: Core tracking, basic AI, and authentication.
  * **Phase 2 (Month 2 - Gamification)**: Streaks, badges, and body metric tracking.
  * **Phase 3 (Month 3 - Monetization)**: Premium features and SMS integration (2 max a day to keep costs down).
  * **Phase 4 (Month 4+)**: Scaling, partnerships, and potential expansion.

-----

*Built with ❤️ by Downscale Weight Loss Clinic*

*Transforming hydration into a journey of health, one drop at a time.*
