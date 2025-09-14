import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { hash } from 'bcryptjs'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'

export async function POST(req: NextRequest) {
  await connectDB()
  const data = await req.json()
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
  }
  const { email, password, name } = parsed.data
  if (await User.findOne({ email })) {
    return NextResponse.json({ errors: { email: ['Email already in use'] } }, { status: 400 })
  }
  const hashed = await hash(password, 12)
  const user = await User.create({ email, password: hashed, name, verified: false })
  // TODO: Set session cookie and handle onboarding redirect
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } })
}
