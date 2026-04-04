import { NextResponse } from 'next/server'
import { getMarketPrices } from '@/lib/market-data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const prices = await getMarketPrices()
    
    return NextResponse.json({
      success: true,
      data: prices,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching market prices:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch market prices',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
