import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // TODO: Clear session cookie
  return NextResponse.json({ success: true })
}
