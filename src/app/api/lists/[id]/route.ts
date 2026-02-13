import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get the list with items
    const list = await db.awesomeList.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true, slug: true, icon: true, color: true }
        },
        items: {
          orderBy: { itemOrder: 'asc' }
        }
      }
    })

    if (!list) {
      return NextResponse.json(
        { success: false, error: 'List not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...list,
        topics: list.topics ? JSON.parse(list.topics) : [],
        items: list.items.map(item => ({
          ...item,
          tags: item.tags ? JSON.parse(item.tags) : []
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching list:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch list' },
      { status: 500 }
    )
  }
}
