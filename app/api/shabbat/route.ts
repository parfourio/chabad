import { NextResponse } from 'next/server'
import { getShabbatTimes } from '@/lib/hebcal'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  try {
    const data = await getShabbatTimes('95476') // Sonoma, CA
    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
