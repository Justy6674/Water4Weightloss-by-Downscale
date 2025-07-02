import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Check for Firebase Admin environment variables (individual approach)
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Check AI environment variables
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const googleAiApiKey = process.env.GOOGLE_AI_API_KEY;

  // Get all available environment variable keys
  const availableKeys = Object.keys(process.env).filter(key => 
    key.startsWith('FIREBASE_') || 
    key.startsWith('NEXT_PUBLIC_FIREBASE_') ||
    key.includes('GEMINI') ||
    key.includes('GOOGLE_AI') ||
    key.includes('SERVICE_ACCOUNT')
  );

  const debugInfo = {
    // Firebase Admin individual vars
    hasFirebaseProjectId: !!firebaseProjectId,
    hasFirebaseClientEmail: !!firebaseClientEmail,
    hasFirebasePrivateKey: !!firebasePrivateKey,
    firebaseProjectId: firebaseProjectId || 'MISSING',
    privateKeyLength: firebasePrivateKey ? firebasePrivateKey.length : 0,
    privateKeyStartsWith: firebasePrivateKey ? firebasePrivateKey.substring(0, 30) + '...' : 'MISSING',

    // AI vars
    hasGeminiApiKey: !!geminiApiKey,
    hasGoogleAiApiKey: !!googleAiApiKey,

    // Environment info
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    
    // Available keys
    availableKeys: availableKeys,

    // Firebase Admin validation
    firebaseAdminValid: !!(firebaseProjectId && firebaseClientEmail && firebasePrivateKey),
  };

  return NextResponse.json(debugInfo);
} 