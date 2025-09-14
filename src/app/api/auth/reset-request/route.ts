import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const resetRequestSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  const data = await req.json()
  const parsed = resetRequestSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }
  // TODO: Generate token, send email
  return NextResponse.json({ success: true })
}
