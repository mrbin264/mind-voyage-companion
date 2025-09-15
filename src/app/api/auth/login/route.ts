import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { compare } from 'bcryptjs'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'
import { sign } from 'jsonwebtoken'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  await connectDB()
  const data = await req.json()
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }
  const { email, password } = parsed.data
  const user = await User.findOne({ email })
  if (!user || !user.password) {
    return NextResponse.json(
      { errors: { email: ['Invalid credentials'] } },
      { status: 401 }
    )
  }
  const valid = await compare(password, user.password)
  if (!valid) {
    return NextResponse.json(
      { errors: { password: ['Invalid credentials'] } },
      { status: 401 }
    )
  }

  // Create JWT token
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret-key'
  const token = sign(
    {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
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
