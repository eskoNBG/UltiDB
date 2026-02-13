import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const language = searchParams.get('language')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      OR?: Array<{ name: { contains: string } } | { description: { contains: string } }>
      categoryId?: string
      language?: string
    } = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }

    if (category) {
      const categoryRecord = await db.category.findFirst({
        where: { slug: category }
      })
      if (categoryRecord) {
        where.categoryId = categoryRecord.id
      }
    }

    if (language) {
      where.language = language
    }

    // Get total count
    const total = await db.awesomeList.count({ where })

    // Get lists with pagination
    const lists = await db.awesomeList.findMany({
      where,
      include: {
        category: {
          select: { name: true, slug: true, icon: true, color: true }
        },
        _count: {
          select: { items: true }
        }
      },
      orderBy: [
        { stars: 'desc' },
        { name: 'asc' }
      ],
      skip,
      take: limit
    })

    return NextResponse.json({
      success: true,
      data: lists.map(list => ({
        ...list,
        itemCount: list._count.items,
        topics: list.topics ? JSON.parse(list.topics) : []
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching lists:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lists' },
      { status: 500 }
    )
  }
}
