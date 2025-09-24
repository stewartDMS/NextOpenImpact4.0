import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Welcome to NextOpenImpact 4.0 API',
    version: '4.0.0',
    status: 'active',
    features: [
      'Modern Next.js architecture',
      'TypeScript support',
      'Vercel deployment ready',
      'API routes',
      'Server-side rendering'
    ]
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({
      message: 'Data received successfully',
      receivedData: body,
      timestamp: new Date().toISOString()
    })
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON data' },
      { status: 400 }
    )
  }
}