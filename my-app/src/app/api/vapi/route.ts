import { VapiClient } from '@vapi-ai/server-sdk';
import { NextRequest, NextResponse } from 'next/server'

const vapi = new VapiClient({
  token: "" // Get your private api key from the dashboard
});

const aldenPhoneNumber = "c81fef05-58be-4f3f-a794-63534c8c1124"

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

async function getCall(id: string) {
  const call = await vapi.calls.get(id);
  return call;
}

export async function GET(request: NextRequest) {
  // Example: Get query parameters
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: "Missing ID" },
      { status: 400 }
    )
  }
  const callResponse = await getCall(id)
  return NextResponse.json({
    message: callResponse,
    timestamp: new Date().toISOString()
  }, { status: 201 })
}

export async function POST(request: NextRequest) {
  try {
    // Example: Parse JSON body
    const body = await request.json()

    const {phoneNumber: customerPhoneNumber} = body

    const vapiRequest = await createCall(customerPhoneNumber)
    return NextResponse.json({
      message: vapiRequest,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      { error: JSON.stringify(error)},
      { status: 400 }
    )
  }
} 