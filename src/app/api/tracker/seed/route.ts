import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// Seed mock update data for demonstration
export async function POST() {
  try {
    const lists = await db.awesomeList.findMany({
      take: 30,
      orderBy: { stars: 'desc' }
    })

    if (lists.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No lists found'
      })
    }

    const commitMessages = [
      'Update README.md',
      'Add new resources',
      'Fix broken links',
      'Update dependencies',
      'Add new section',
      'Remove deprecated items',
    ]

    const authors = ['sindresorhus', 'octocat', 'dependabot', 'developer', 'contributor']

    const updatedListIds = new Set<string>()
    let updatesCreated = 0

    // Create updates for today
    for (const list of lists.slice(0, 12)) {
      const numCommits = Math.floor(Math.random() * 2) + 1
      
      for (let i = 0; i < numCommits; i++) {
        const hoursAgo = Math.floor(Math.random() * 12)
        
        const id = Array.from({ length: 25 }, () => 
          'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
        ).join('')

        const sha = Array.from({ length: 40 }, () => 
          '0123456789abcdef'[Math.floor(Math.random() * 16)]
        ).join('')

        const message = commitMessages[Math.floor(Math.random() * commitMessages.length)]
        const author = authors[Math.floor(Math.random() * authors.length)]

        // Use SQLite datetime function for commitDate
        const commitDateStr = `datetime('now', '-${hoursAgo} hours')`

        try {
          await db.$executeRawUnsafe(`
            INSERT INTO ListUpdate (id, listId, commitSha, commitMessage, commitDate, additions, deletions, filesChanged, author, createdAt)
            VALUES ('${id}', '${list.id}', '${sha}', '${message}', ${commitDateStr}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 5) + 1}, '${author}', datetime('now'))
          `)
          updatesCreated++
          updatedListIds.add(list.id)
        } catch (e) {
          console.log('Insert error:', e)
        }
      }
    }

    // Update daily stats
    const statsId = Array.from({ length: 25 }, () => 
      'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
    ).join('')

    try {
      await db.$executeRawUnsafe(`
        INSERT OR REPLACE INTO DailyStats (id, date, listsUpdated, totalCommits, newLists, createdAt, updatedAt)
        VALUES ('${statsId}', date('now'), ${updatedListIds.size}, ${updatesCreated}, 0, datetime('now'), datetime('now'))
      `)
    } catch (e) {
      console.log('Stats error:', e)
    }

    return NextResponse.json({
      success: true,
      message: `Created ${updatesCreated} updates for ${updatedListIds.size} lists`,
      data: {
        updatesCreated,
        listsUpdated: updatedListIds.size,
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
