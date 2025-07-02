import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'API key not found',
          details: 'GOOGLE_AI_API_KEY or GEMINI_API_KEY environment variable is not set',
          env_keys: Object.keys(process.env).filter(key => key.includes('AI') || key.includes('GEMINI'))
        },
        { status: 500 }
      )
    }

    // Get the request body
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      )
    }

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    })

    // Create a simple prompt
    const prompt = `
    You are a helpful AI assistant. Generate a response for this request: "${message}"
    
    Return a JSON object with this format: { "message": "Your response here" }
    `

    // Call the API
    const result = await model.generateContent(prompt)
    const response = await result.response
    const jsonString = response.text()

    // Clean and parse the response
    const cleanedJsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsedResponse = JSON.parse(cleanedJsonString)

    return NextResponse.json({
      success: true,
      ai_response: parsedResponse,
      raw_response: jsonString,
      api_key_present: !!apiKey,
      api_key_length: apiKey?.length || 0
    })

  } catch (error) {
    console.error('Google AI Test Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        error_type: error?.constructor?.name || 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
        env_info: {
          has_google_ai_key: !!process.env.GOOGLE_AI_API_KEY,
          has_gemini_key: !!process.env.GEMINI_API_KEY,
          node_env: process.env.NODE_ENV,
          vercel_env: process.env.VERCEL_ENV
        }
      },
      { status: 500 }
    )
  }
} 