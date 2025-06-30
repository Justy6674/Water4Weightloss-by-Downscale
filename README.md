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
  * Firebase CLI (version 13.11.2 or later is recommended)

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

The application requires credentials for Firebase (Client and Admin SDKs), Google AI, and Twilio. This is handled via an environment file for local development.

1.  Create a file named `.env.local` in the root of your project. You can copy the example file:
    ```bash
    cp .env.local.example .env.local
    ```
2.  Fill in all the required variables in your new `.env.local` file.

#### Step 1: Frontend & Public Credentials

Fill in these values in your `.env.local` file. These are safe for the browser.

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
```

#### Step 2: Backend & Server-Side Secrets

Fill in these values in your `.env.local` file. These are for your server and must be kept secret.

```bash
# --- Google AI (Server-Side Secret) ---
GOOGLE_AI_API_KEY=

# --- Twilio for SMS Reminders (Server-Side Secrets) ---
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# --- Firebase Admin SDK (Local Backend Secret) ---
# This is required for server actions to work locally.
# 1. Go to your Firebase Project Settings > Service accounts.
# 2. Click "Generate new private key" to download your service-account.json file.
# 3. Open the downloaded file in a text editor.
# 4. VERY IMPORTANT: Convert the multi-line JSON into a SINGLE LINE.
#    You can use an online tool for this, or carefully do it by hand.
# 5. Paste the entire single-line JSON content as the value for this variable:
SERVICE_ACCOUNT_JSON=
```
It should look something like this (this is an example, do not use it):
`SERVICE_ACCOUNT_JSON={"type": "service_account", "project_id": "...", "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n", ...}`

### 4. Setting Secrets for Deployment

For the deployed application on App Hosting, you must securely provide the secrets.

1.  Ensure you are logged into the Firebase CLI (`firebase login`).
2.  Set the secret for your Firebase Service Account credentials. Run this command from your project root, replacing the path to your downloaded file if necessary:
    ```bash
    firebase apphosting:secrets:set firebaseServiceAccountKey --file=service-account.json
    ```
3. You will also need to set secrets for `googleAiApiKey`, `twilioSid`, `twilioToken`, and `twilioPhone`, etc. as defined in `apphosting.yaml`.

### 5. Run the Application

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3002` or another specified port.

## 🗂️ Project Structure

The codebase is organized into a clean, modern Next.js project structure.

```
water4weightloss/
├── public/             # Static assets (images, fonts, manifest.json, service worker)
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # Reusable React components
│   ├── lib/            # Client-side helpers, Firebase config (client)
│   ├── server/         # Server-side only modules (e.g., Firebase Admin)
│   ├── ai/             # Genkit AI flows
│   └── services/       # Third-party service clients (e.g., Twilio)
├── .env.local          # Environment variables (DO NOT COMMIT)
├── service-account.json # Source for credentials, not used directly by app
├── firebase.json       # Firebase project configuration
```
-----

*Built with ❤️ by Downscale Weight Loss Clinic*

*Transforming hydration into a journey of health, one drop at a time.*
