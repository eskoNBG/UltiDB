import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// Categories from awesomelists.top + additional ones
const initialCategories = [
  { name: 'Platforms', slug: 'platforms', description: 'Platform-specific resources', icon: 'Layers', color: 'blue' },
  { name: 'Programming Languages', slug: 'programming-languages', description: 'Programming language resources', icon: 'Code', color: 'green' },
  { name: 'Front-End Development', slug: 'frontend', description: 'Web UI & Frontend frameworks', icon: 'Palette', color: 'cyan' },
  { name: 'Back-End Development', slug: 'backend', description: 'Server-side & API frameworks', icon: 'Server', color: 'emerald' },
  { name: 'Computer Science', slug: 'computer-science', description: 'CS fundamentals & algorithms', icon: 'GraduationCap', color: 'purple' },
  { name: 'Big Data', slug: 'big-data', description: 'Big data processing & analytics', icon: 'Database', color: 'orange' },
  { name: 'Theory', slug: 'theory', description: 'Computer science theory', icon: 'BookOpen', color: 'amber' },
  { name: 'Books', slug: 'books', description: 'Programming books & resources', icon: 'Book', color: 'yellow' },
  { name: 'Editors', slug: 'editors', description: 'Code editors & IDEs', icon: 'Edit', color: 'pink' },
  { name: 'Gaming', slug: 'gaming', description: 'Game development resources', icon: 'Gamepad', color: 'violet' },
  { name: 'Dev Environment', slug: 'dev-environment', description: 'Development tools & setup', icon: 'Settings', color: 'gray' },
  { name: 'Entertainment', slug: 'entertainment', description: 'Entertainment & media', icon: 'Film', color: 'red' },
  { name: 'Databases', slug: 'databases', description: 'Database systems & tools', icon: 'Database', color: 'blue' },
  { name: 'Media', slug: 'media', description: 'Media processing & tools', icon: 'Image', color: 'cyan' },
  { name: 'Learn', slug: 'learn', description: 'Learning resources & tutorials', icon: 'GraduationCap', color: 'green' },
  { name: 'Security', slug: 'security', description: 'Security tools & resources', icon: 'Shield', color: 'red' },
  { name: 'Content Management', slug: 'content-management', description: 'CMS platforms & tools', icon: 'Folder', color: 'orange' },
  { name: 'Hardware', slug: 'hardware', description: 'Hardware & IoT resources', icon: 'Cpu', color: 'gray' },
  { name: 'Business', slug: 'business', description: 'Business & entrepreneurship', icon: 'Briefcase', color: 'amber' },
  { name: 'Work', slug: 'work', description: 'Work & productivity tools', icon: 'Briefcase', color: 'emerald' },
  { name: 'Networking', slug: 'networking', description: 'Network tools & resources', icon: 'Globe', color: 'blue' },
  { name: 'Decentralized Systems', slug: 'decentralized', description: 'Blockchain & Web3', icon: 'Link', color: 'purple' },
  { name: 'Health & Social Science', slug: 'health-social', description: 'Health & social science resources', icon: 'Heart', color: 'pink' },
  { name: 'Events', slug: 'events', description: 'Tech events & conferences', icon: 'Calendar', color: 'yellow' },
  { name: 'Testing', slug: 'testing', description: 'Testing frameworks & tools', icon: 'CheckCircle', color: 'emerald' },
  { name: 'Miscellaneous', slug: 'miscellaneous', description: 'Other awesome resources', icon: 'Package', color: 'gray' },
  { name: 'Related', slug: 'related', description: 'Related awesome lists', icon: 'ExternalLink', color: 'blue' },
  // Additional categories for FMHY
  { name: 'AI & ML', slug: 'ai-ml', description: 'Machine learning & AI tools', icon: 'Brain', color: 'purple' },
  { name: 'Mobile', slug: 'mobile', description: 'Mobile development', icon: 'Smartphone', color: 'pink' },
  { name: 'DevOps', slug: 'devops', description: 'DevOps & infrastructure', icon: 'Rocket', color: 'orange' },
  { name: 'Data Science', slug: 'data-science', description: 'Data science & analysis', icon: 'BarChart', color: 'cyan' },
  { name: 'CLI Tools', slug: 'cli-tools', description: 'Command line utilities', icon: 'Terminal', color: 'gray' },
]

// Sample awesome lists
const sampleLists = [
  {
    name: 'awesome-react',
    slug: 'awesome-react',
    description: 'A collection of awesome things regarding React ecosystem',
    repositoryUrl: 'https://github.com/enaqx/awesome-react',
    stars: 68000,
    forks: 8200,
    language: 'JavaScript',
    categorySlug: 'frontend',
    items: [
      { title: 'React', description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces', url: 'https://reactjs.org/' },
      { title: 'Next.js', description: 'The React Framework for Production', url: 'https://nextjs.org/' },
      { title: 'React Router', description: 'Declarative routing for React', url: 'https://reactrouter.com/' },
    ]
  },
  {
    name: 'awesome-python',
    slug: 'awesome-python',
    description: 'A curated list of awesome Python frameworks, libraries, software and resources',
    repositoryUrl: 'https://github.com/vinta/awesome-python',
    stars: 228000,
    forks: 24900,
    language: 'Python',
    categorySlug: 'programming-languages',
    items: [
      { title: 'Django', description: 'The web framework for perfectionists with deadlines', url: 'https://djangoproject.com/' },
      { title: 'Flask', description: 'A lightweight WSGI web application framework', url: 'https://flask.palletsprojects.com/' },
    ]
  },
  {
    name: 'awesome-nodejs',
    slug: 'awesome-nodejs',
    description: 'Delightful Node.js packages and resources',
    repositoryUrl: 'https://github.com/sindresorhus/awesome-nodejs',
    stars: 59000,
    forks: 5800,
    language: 'JavaScript',
    categorySlug: 'programming-languages',
    items: [
      { title: 'Express', description: 'Fast, unopinionated, minimalist web framework', url: 'https://expressjs.com/' },
      { title: 'NestJS', description: 'A progressive Node.js framework for building efficient applications', url: 'https://nestjs.com/' },
    ]
  },
]

export async function POST() {
  try {
    // Create categories
    for (const cat of initialCategories) {
      await db.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat
      })
    }

    // Create sample lists with items
    for (const listData of sampleLists) {
      const { items, categorySlug, ...listInfo } = listData
      
      const category = await db.category.findUnique({
        where: { slug: categorySlug }
      })

      const existingList = await db.awesomeList.findUnique({
        where: { slug: listInfo.slug }
      })

      if (existingList) continue // Skip if already exists

      const list = await db.awesomeList.create({
        data: {
          ...listInfo,
          categoryId: category?.id || null
        }
      })

      // Create items for this list
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        await db.awesomeItem.create({
          data: {
            listId: list.id,
            title: item.title,
            description: item.description,
            url: item.url,
            itemOrder: i + 1
          }
        })
      }
    }

    // Get counts
    const categoriesCount = await db.category.count()
    const listsCount = await db.awesomeList.count()
    const itemsCount = await db.awesomeItem.count()

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        categories: categoriesCount,
        lists: listsCount,
        items: itemsCount
      }
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const categoriesCount = await db.category.count()
    const listsCount = await db.awesomeList.count()
    const itemsCount = await db.awesomeItem.count()

    return NextResponse.json({
      success: true,
      data: {
        categories: categoriesCount,
        lists: listsCount,
        items: itemsCount
      }
    })
  } catch (error) {
    console.error('Error getting stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get stats' },
      { status: 500 }
    )
  }
}
