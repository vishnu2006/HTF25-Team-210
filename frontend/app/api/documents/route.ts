import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const domain = searchParams.get('domain')
    
    const response = await fetch(
      `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/documents/${userId}?domain=${domain || ''}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      throw new Error('Backend API error')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')
    const body = await request.json()
    
    const response = await fetch(
      `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/documents/${documentId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      throw new Error('Backend API error')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
