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
  * **Backend**: Firebase (Server Actions)
  * **Database**: Firestore (NoSQL)
  * **Authentication**: Firebase Auth
  * **AI**: Google Gemini AI (`gemini-1.5-flash`) via Genkit
  * **Hosting**: Firebase Hosting
  * **Push Notifications**: Firebase Cloud Messaging (FCM)
  * **SMS**: Twilio
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

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### 3. Credentials Setup

The application requires credentials for Firebase, Google AI, and Twilio. This is handled via an environment file.

1.  Create a file named `.env.local` in the root of your project.
2.  Copy the contents of the `.env` template file into your new `.env.local` file.
3.  Fill in all the required variables.

#### Step 1: Frontend & Service Credentials (`.env.local`)

Fill in these values in your `.env.local` file:

```bash
# --- Firebase Client SDK (Public Keys) ---
# Find these in Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# --- Google AI (Server-Side Secret) ---
# This is used by Genkit AI flows
GOOGLE_AI_API_KEY=

# --- Twilio for SMS Reminders (Server-Side Secrets) ---
# Required if you want to test SMS notifications locally
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

#### Step 2: Backend Credentials (`.env.local`)

For the backend (Server Actions, Push Notifications) to work locally, it needs your Firebase Admin service account credentials.

1.  In your Firebase Project Settings, go to the **Service accounts** tab.
2.  Click **Generate new private key** and a JSON file will be downloaded.
3.  Open this file in a text editor.
4.  **Important**: You need to convert the multi-line JSON into a single line. You can use an online tool for this, or carefully do it by hand by replacing all newlines with `\n`.
5.  In your `.env.local` file, add the following variable and paste the **entire single-line JSON content** as its value:

    ```bash
    # --- Firebase Admin SDK (Local Backend Secret) ---
    FIREBASE_SERVICE_ACCOUNT_KEY=PASTE_YOUR_SINGLE_LINE_JSON_HERE
    ```

    It should look something like this (this is an example, do not use it):
    `FIREBASE_SERVICE_ACCOUNT_KEY={"type": "service_account", "project_id": "...", ...}`

### 4. Run the Application

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3002` or another specified port.

## ⏰ Setting Up Scheduled Reminders

The application includes a `sendReminder` server action that can send Push and SMS notifications. To make this run automatically, you need to trigger it on a schedule. The recommended way is using **Google Cloud Scheduler**.

1.  **Deploy your application.** The scheduler needs a public URL to call.
2.  Go to the **Google Cloud Scheduler** in your Google Cloud Console.
3.  Create a new job with the following settings:
    *   **Target type**: `HTTP`
    *   **URL**: `https://<your-deployed-app-url>/api/cron/send-reminders` (You will need to create this API route that calls the `sendReminder` action for each user).
    *   **Frequency**: A cron schedule like `0 * * * *` to run it every hour.
    *   **Authentication**: You should secure this endpoint, for example, by requiring a secret key in the header that your scheduler job provides.

*Note: A full implementation of the cron job API route is beyond the scope of this file but involves fetching all users and calling the `sendReminder(userId)` action for each.*

## 🗂️ Project Structure

The codebase is organized into a clean, modern Next.js project structure.

```
water4weightloss/
├── public/             # Static assets (images, fonts, manifest.json, service worker)
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # Reusable React components
│   ├── lib/            # Helper functions, Firebase config (client & admin)
│   ├── ai/             # Genkit AI flows
│   └── services/       # Third-party service clients (e.g., Twilio)
├── .env.local          # Environment variables (DO NOT COMMIT)
├── service-account.json # Source for credentials, not used directly by app
├── firebase.json       # Firebase project configuration
```
-----

*Built with ❤️ by Downscale Weight Loss Clinic*

*Transforming hydration into a journey of health, one drop at a time.*
