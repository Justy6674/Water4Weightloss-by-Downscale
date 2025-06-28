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

### 3\. Environment Variables

Create a file named `.env.local` in the root directory and populate it with the necessary keys from your Firebase project and third-party services.

```bash
# .env.local

# Firebase Config (for the client-side app)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google AI (for Firebase Functions)
GOOGLE_AI_API_KEY=

# Twilio (for Firebase Functions)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Note: Firebase Admin credentials should be configured via environment variables
# in the Google Cloud console for deployed functions, not stored in a file.
```

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
  * **Phase 3 (Month 3 - Monetization)**: Premium features and SMS integration.
  * **Phase 4 (Month 4+)**: Scaling, partnerships, and potential expansion.

-----

*Built with ❤️ by Downscale Weight Loss Clinic*

*Transforming hydration into a journey of health, one drop at a time.*