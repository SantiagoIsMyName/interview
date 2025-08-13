import { VapiClient } from '@vapi-ai/server-sdk';

const vapi = new VapiClient({
  token: '98aa2e5a-a3af-4abf-b881-96a3119bb394' // Get your private api key from the dashboard
});

const aldenPhoneNumber = "18777963351"

async function createCall(customerPhoneNumber: string) {
  const call = await vapi.calls.create({
    phoneNumberId: aldenPhoneNumber, // Create a free phone number in the dashboard
    customer: { number: customerPhoneNumber}, // Your customer's phone number
    assistant: {
      model: {
        provider: 'openai',
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Keep your responses concise and friendly.'
          }
        ]
      }
    }
  });
  return call;
}


import { NextRequest, NextResponse } from 'next/server'

// Example API endpoint showing how to handle different HTTP methods
// This is just a demonstration - candidates should create their own endpoints

export async function GET(request: NextRequest) {
  // Example: Get query parameters
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  return NextResponse.json({
    message: 'This is an example GET endpoint',
    id: id || 'no id provided',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    // Example: Parse JSON body
    const body = await request.json()

    const {phoneNumber: customerPhoneNumber} = body
    // return createCall(customerPhoneNumber)
    return NextResponse.json({
      message: 'This is an example POST endpoint',
      received: body,
      timestamp: new Date().toISOString()
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
} 