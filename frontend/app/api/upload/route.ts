import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    console.log('Frontend upload API called')
    
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/upload`, {
      method: 'POST',
      body: formData,
    })

    console.log('Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error:', errorText)
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Upload successful:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
