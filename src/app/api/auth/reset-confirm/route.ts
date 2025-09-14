import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const resetConfirmSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  const data = await req.json()
  const parsed = resetConfirmSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }
  // TODO: Validate token, update user password
  return NextResponse.json({ success: true })
}
