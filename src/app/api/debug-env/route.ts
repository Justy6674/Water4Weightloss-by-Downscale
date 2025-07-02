import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envInfo = {
      hasServiceAccount: !!process.env.SERVICE_ACCOUNT_JSON,
      serviceAccountLength: process.env.SERVICE_ACCOUNT_JSON?.length || 0,
      hasGoogleAI: !!process.env.GOOGLE_AI_API_KEY,
      hasGemini: !!process.env.GEMINI_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      availableKeys: Object.keys(process.env)
        .filter(key => key.includes('FIREBASE') || key.includes('SERVICE') || key.includes('GOOGLE') || key.includes('GEMINI'))
    }

    // Try to parse service account if present
    if (process.env.SERVICE_ACCOUNT_JSON) {
      try {
        const cleanJson = process.env.SERVICE_ACCOUNT_JSON.replace(/\\n/g, '\n');
        const parsed = JSON.parse(cleanJson);
        envInfo.serviceAccountValid = !!(parsed.project_id && parsed.private_key && parsed.client_email);
        envInfo.projectId = parsed.project_id;
        envInfo.clientEmail = parsed.client_email;
      } catch (error) {
        envInfo.serviceAccountValid = false;
        envInfo.parseError = error instanceof Error ? error.message : 'Unknown parse error';
      }
    }

    return NextResponse.json(envInfo)
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        hasServiceAccount: !!process.env.SERVICE_ACCOUNT_JSON
      },
      { status: 500 }
    )
  }
} 