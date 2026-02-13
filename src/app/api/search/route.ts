import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const type = searchParams.get('type') || 'all' // all, lists, items
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        data: { lists: [], items: [] }
      })
    }

    const results: {
      lists: Array<{
        id: string
        name: string
        description: string | null
        stars: number
        language: string | null
        categoryName: string | null
      }>
      items: Array<{
        id: string
        title: string
        description: string | null
        url: string | null
        listName: string
        listId: string
      }>
    } = { lists: [], items: [] }

    // Search in lists
    if (type === 'all' || type === 'lists') {
      const lists = await db.awesomeList.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } }
          ]
        },
        include: {
          category: { select: { name: true } }
        },
        orderBy: { stars: 'desc' },
        take: limit
      })

      results.lists = lists.map(list => ({
        id: list.id,
        name: list.name,
        description: list.description,
        stars: list.stars,
        language: list.language,
        categoryName: list.category?.name || null
      }))
    }

    // Search in items
    if (type === 'all' || type === 'items') {
      const items = await db.awesomeItem.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } }
          ]
        },
        include: {
          list: {
            select: { name: true, id: true }
          }
        },
        take: limit
      })

      results.items = items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        url: item.url,
        listName: item.list.name,
        listId: item.listId
      }))
    }

    return NextResponse.json({
      success: true,
      data: results,
      query: q
    })
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}
