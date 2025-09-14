import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { compare } from 'bcryptjs'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/db'

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
  // TODO: Set session cookie
  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
  })
}
