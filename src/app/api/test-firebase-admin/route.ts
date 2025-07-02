import { NextRequest, NextResponse } from 'next/server';
import { testFirebaseAdmin } from '@/lib/actions';

export async function GET(request: NextRequest) {
  try {
    const result = await testFirebaseAdmin();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
} 