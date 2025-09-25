import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, accountType, companyName, companySize, industry, website } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with appropriate fields based on account type
    const userData = {
      name,
      email,
      password: hashedPassword,
      accountType: accountType || 'general',
    } as {
      name: string
      email: string
      password: string
      accountType: string
      companyName?: string
      companySize?: string
      industry?: string
      website?: string
    }

    if (accountType === 'company') {
      userData.companyName = companyName
      userData.companySize = companySize
      userData.industry = industry
      userData.website = website
    }

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        accountType: true,
      }
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    console.error('Registration error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}