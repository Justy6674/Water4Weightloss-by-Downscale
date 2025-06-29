
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

### 1. Prerequisites

  * Node.js (v18 or later)
  * NPM (or Yarn)
  * Firebase CLI

### 2. Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd water4weightloss
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install
    ```

### 3. Environment & Credentials Setup

You will need to set up environment variables in a `.env.local` file for both the client-side (browser) and server-side (for local development).

#### Step 1: Create the `.env.local` File

Create a file named `.env.local` in the root of your project. Copy and paste the following template into it:

```bash
# .env.local

# --- Firebase Client SDK (Public Keys) ---
# Find these in Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# --- Firebase Admin SDK (Server-Side Secrets for Local Dev) ---
# You will get these from your service-account.json file in the next step
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# --- Other Services (Server-Side Secrets) ---
GOOGLE_AI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

#### Step 2: Get a Service Account Key

For local development, the server needs secret credentials to act on your behalf.

1.  In your Firebase Project Settings, go to the **Service accounts** tab.
2.  Click **Generate new private key** and a JSON file will be downloaded. This file is your **`service-account.json`**.
3.  **Do not commit this file to git.** It is only used to copy credentials from.

#### Step 3: Populate `.env.local` with Your Credentials

Now, copy the values from `service-account.json` and your Firebase project settings into your `.env.local` file.

*   Fill in the `NEXT_PUBLIC_*` variables from your Firebase project settings.
*   Fill in the `FIREBASE_*` server-side variables using the values from the `service-account.json` file you just downloaded.

**IMPORTANT:** For the `FIREBASE_PRIVATE_KEY`, you must copy the entire key, including the `-----BEGIN...` and `-----END...` markers, and wrap it in **double quotes** to handle the newline characters correctly.

Example:
```bash
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-....@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_LINE_1\nYOUR_KEY_LINE_2\n-----END PRIVATE KEY-----\n"
```

### 4. Run the Application

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3002`.

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
├── service-account.json # Used to copy credentials from (DO NOT COMMIT)
├── firebase.json       # Firebase project configuration
```
-----

*Built with ❤️ by Downscale Weight Loss Clinic*

*Transforming hydration into a journey of health, one drop at a time.*
