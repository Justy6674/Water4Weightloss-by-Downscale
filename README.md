
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

### 3\. Environment & Credentials Setup

#### Step 1: Set Up Client-Side Keys (`.env.local`)

These keys are public and are used by the browser to connect to your Firebase project.

1.  Create a file named `.env.local` in the root of your project.
2.  Copy and paste the following, filling in the values from your Firebase project settings. You can find these under **Project Settings > General > Your apps > SDK setup and configuration**.

    ```bash
    # .env.local

    # --- Firebase Client SDK (Public Keys) ---
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

    # --- Other Services (Server-Side Secrets) ---
    GOOGLE_AI_API_KEY=
    TWILIO_ACCOUNT_SID=
    TWILIO_AUTH_TOKEN=
    TWILIO_PHONE_NUMBER=
    ```

#### Step 2: Set Up Server-Side Credentials (`service-account.json`)

These are secret credentials used by the server (e.g., for sending push notifications). This is **only required for running the application on your local machine**. The live, deployed application uses a secure, automatic method.

1.  In your Firebase Project Settings, go to the **Service accounts** tab.
2.  Click **Generate new private key** and a JSON file will be downloaded.
3.  Rename this file to **`service-account.json`**.
4.  Place this file in the **root directory** of your project.

The application is configured to automatically detect and use this file when you run `npm run dev`.

### 4\. Run the Application

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🗂️ Project Structure

The codebase is organized into a clean, modern Next.js project structure.

```
water4weightloss/
├── public/             # Static assets (images, fonts, manifest.json)
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # Reusable React components
│   ├── lib/            # Helper functions, Firebase config
│   └── types/          # TypeScript type definitions
├── .env.local          # Environment variables (DO NOT COMMIT if public repo)
├── service-account.json # Server credentials for local dev (DO NOT COMMIT)
├── firebase.json       # Firebase project configuration
```

## 🤖 AI Development & Contribution

This project is being built with an AI development agent (Gemini). To ensure quality, consistency, and adherence to the project vision, all contributions (human or AI) **must** follow the rules outlined in the **`STUDIO_AI_RULES.md`** file.

This manifesto governs our development philosophy, including:

  * Thinking full-stack and avoiding tunnel vision.
  * Writing durable, high-quality code instead of quick patches.
  * Prioritizing security and cost-optimization for Firebase services.

-----

*Built with ❤️ by Downscale Weight Loss Clinic*

*Transforming hydration into a journey of health, one drop at a time.*
