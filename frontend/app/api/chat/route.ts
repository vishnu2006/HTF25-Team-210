import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Chat API called with:', body)
    
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('Chat response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Chat backend error:', errorText)
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Chat response:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Chat API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
