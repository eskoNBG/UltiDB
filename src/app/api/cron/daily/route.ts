import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// This endpoint is designed to be called by an external cron service
// like cron-job.org, GitHub Actions, or Vercel Cron

export async function GET(request: Request) {
  // Verify cron secret if provided
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    console.log('Starting daily cron job...')
    const results: any = {}

    // 1. Run the sync
    console.log('Step 1: Syncing lists from sindresorhus/awesome...')
    const syncResponse = await fetch('http://localhost:3000/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        removeOutdated: true,
        runTracker: false,
      })
    })
    results.sync = await syncResponse.json()
    console.log('Sync result:', results.sync)

    // 2. Run the tracker
    console.log('Step 2: Running tracker...')
    const trackerResponse = await fetch('http://localhost:3000/api/tracker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 50 })
    })
    results.tracker = await trackerResponse.json()
    console.log('Tracker result:', results.tracker)

    // 3. Seed tracker data for demo (in production, real GitHub data would be used)
    console.log('Step 3: Seeding tracker data...')
    const seedResponse = await fetch('http://localhost:3000/api/tracker/seed', {
      method: 'POST'
    })
    results.seed = await seedResponse.json()
    console.log('Seed result:', results.seed)

    // 4. Get final stats
    const stats = await db.awesomeList.count()
    const categories = await db.category.count()

    console.log('Daily cron completed!')

    return NextResponse.json({
      success: true,
      message: 'Daily cron job completed',
      timestamp: new Date().toISOString(),
      results,
      stats: {
        totalLists: stats,
        totalCategories: categories,
      }
    })
  } catch (error) {
    console.error('Cron error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

// Also allow POST for manual triggers
export const POST = GET
