import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { hash } from 'bcryptjs'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'
import { sign } from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  await connectDB()
  const data = await req.json()
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }
  const { email, password, name } = parsed.data
  if (await User.findOne({ email })) {
    return NextResponse.json(
      { errors: { email: ['Email already in use'] } },
      { status: 400 }
    )
  }
  const hashed = await hash(password, 12)
  const user = await User.create({
    email,
    password: hashed,
    name,
    verified: false,
  })

  // Create JWT token
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret-key'
  const token = sign(
    { 
      userId: user._id.toString(), 
      email: user.email, 
      name: user.name 
    },
    secret,
    { expiresIn: '7d' }
  )

  // Set secure cookie
  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
  })

  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return response
}
