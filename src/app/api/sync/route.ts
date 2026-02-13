import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

// Fetch README from sindresorhus/awesome
async function fetchAwesomeReadme(): Promise<string> {
  const response = await fetch(
    'https://raw.githubusercontent.com/sindresorhus/awesome/main/readme.md'
  )
  if (!response.ok) throw new Error(`Failed to fetch README: ${response.status}`)
  return response.text()
}

// Parse awesome lists from README
function parseAwesomeLists(readme: string): Array<{
  name: string
  slug: string
  description: string
  url: string
  category: string
}> {
  const lists: Array<{
    name: string
    slug: string
    description: string
    url: string
    category: string
  }> = []

  const lines = readme.split('\n')
  let currentCategory = 'General'

  for (const line of lines) {
    const headerMatch = line.match(/^##\s+(.+)$/)
    if (headerMatch) {
      currentCategory = headerMatch[1].trim()
      continue
    }

    if (line.startsWith('# ') || line.startsWith('<h') || line.startsWith('<div')) continue

    const listMatch = line.match(/^[-*]\s+\[([^\]]+)\]\(([^)]+)\)(?:\s*[-–—]\s*(.+))?/)
    if (listMatch) {
      const [, name, url, description] = listMatch
      if (url.includes('github.com')) {
        lists.push({
          name: name.trim(),
          slug: url.replace('https://github.com/', '').replace('/', '-').toLowerCase(),
          description: description?.trim() || '',
          url: url.trim(),
          category: currentCategory,
        })
      }
    }
  }

  return lists
}

// Category mapping from README sections
const categoryMapping: Record<string, string> = {
  'Platforms': 'platforms',
  'Programming Languages': 'programming-languages',
  'Front-End Development': 'frontend',
  'Back-End Development': 'backend',
  'Computer Science': 'computer-science',
  'Big Data': 'big-data',
  'Theory': 'theory',
  'Books': 'books',
  'Editors': 'editors',
  'Gaming': 'gaming',
  'Development Environment': 'dev-environment',
  'Entertainment': 'entertainment',
  'Databases': 'databases',
  'Media': 'media',
  'Learn': 'learn',
  'Security': 'security',
  'Content Management Systems': 'content-management',
  'Hardware': 'hardware',
  'Business': 'business',
  'Work': 'work',
  'Networking': 'networking',
  'Decentralized Systems': 'decentralized',
  'Health and Social Science': 'health-social',
  'Events': 'events',
  'Testing': 'testing',
  'Miscellaneous': 'miscellaneous',
  'Related': 'related',
}

// Fallback category by name
function getCategorySlug(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('react') || lower.includes('vue') || lower.includes('angular') || lower.includes('css')) return 'frontend'
  if (lower.includes('node') || lower.includes('python') || lower.includes('rust') || lower.includes('go')) return 'programming-languages'
  if (lower.includes('docker') || lower.includes('kubernetes')) return 'devops'
  if (lower.includes('ai') || lower.includes('machine-learning')) return 'ai-ml'
  if (lower.includes('security')) return 'security'
  if (lower.includes('mobile') || lower.includes('android') || lower.includes('ios')) return 'mobile'
  if (lower.includes('game')) return 'gaming'
  if (lower.includes('test')) return 'testing'
  return 'miscellaneous'
}

// Fetch repo info from GitHub
async function fetchRepoInfo(owner: string, repo: string) {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'UltimateDB-Sync/1.0',
    }
    if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers })
    if (!response.ok) return null
    
    const data = await response.json()
    return {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      language: data.language || null,
      updatedAt: data.updated_at ? new Date(data.updated_at) : null,
      topics: data.topics || [],
    }
  } catch {
    return null
  }
}

// Main sync function
export async function POST(request: Request) {
  const startTime = Date.now()
  
  try {
    const body = await request.json().catch(() => ({}))
    const { 
      removeOutdated = true, // Remove lists not updated in 6 months
      runTracker = true, // Run tracker after sync
    } = body

    console.log('Starting daily sync...')

    // 1. Fetch latest README
    const readme = await fetchAwesomeReadme()
    const parsedLists = parseAwesomeLists(readme)
    console.log(`Found ${parsedLists.length} lists in README`)

    // 2. Get current lists from database
    const currentLists = await db.awesomeList.findMany({
      select: { id: true, slug: true, repositoryUrl: true, lastUpdated: true }
    })
    const currentUrls = new Set(currentLists.map(l => l.repositoryUrl))
    const currentSlugs = new Map(currentLists.map(l => [l.repositoryUrl, l]))

    let added = 0
    let updated = 0
    let removed = 0
    let skipped = 0

    // 3. Process new and existing lists
    for (const listData of parsedLists) {
      try {
        const categorySlug = categoryMapping[listData.category] || getCategorySlug(listData.name)
        const category = await db.category.findUnique({ where: { slug: categorySlug } })

        const match = listData.url.match(/github\.com\/([^/]+)\/([^/]+)/)
        const owner = match?.[1]
        const repo = match?.[2]

        if (currentUrls.has(listData.url)) {
          // Update existing list
          if (owner && repo) {
            const repoInfo = await fetchRepoInfo(owner, repo)
            if (repoInfo) {
              await db.awesomeList.update({
                where: { repositoryUrl: listData.url },
                data: {
                  stars: repoInfo.stars,
                  forks: repoInfo.forks,
                  language: repoInfo.language,
                  lastUpdated: repoInfo.updatedAt,
                  categoryId: category?.id || null,
                }
              })
              updated++
            } else {
              skipped++
            }
          } else {
            skipped++
          }
        } else {
          // Add new list
          let repoInfo = null
          if (owner && repo) {
            repoInfo = await fetchRepoInfo(owner, repo)
          }

          await db.awesomeList.create({
            data: {
              name: listData.name,
              slug: listData.slug,
              description: listData.description || `Awesome ${listData.name} resources`,
              repositoryUrl: listData.url,
              categoryId: category?.id || null,
              stars: repoInfo?.stars || 0,
              forks: repoInfo?.forks || 0,
              language: repoInfo?.language || null,
              topics: JSON.stringify([...(repoInfo?.topics || []), listData.category]),
              isCurated: true,
              lastUpdated: repoInfo?.updatedAt || new Date(),
            }
          })
          added++
        }

        // Small delay to avoid rate limiting
        if (owner && repo) {
          await new Promise(r => setTimeout(r, 50))
        }
      } catch (error) {
        console.error(`Error processing ${listData.name}:`, error)
      }
    }

    // 4. Remove outdated lists (not updated in 6 months)
    if (removeOutdated) {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const outdatedLists = await db.awesomeList.findMany({
        where: {
          lastUpdated: { lt: sixMonthsAgo },
          isCurated: false, // Only remove non-curated lists
        },
        select: { id: true, name: true }
      })

      for (const list of outdatedLists) {
        try {
          await db.awesomeList.delete({ where: { id: list.id } })
          removed++
          console.log(`Removed outdated list: ${list.name}`)
        } catch (error) {
          console.error(`Error removing ${list.name}:`, error)
        }
      }
    }

    // 5. Update tracker data
    let trackerResult = null
    if (runTracker) {
      try {
        // Seed tracker with mock updates for demonstration
        await fetch('http://localhost:3000/api/tracker/seed', { method: 'POST' })
        trackerResult = { success: true }
      } catch (error) {
        console.error('Tracker error:', error)
        trackerResult = { success: false, error: (error as Error).message }
      }
    }

    // Get final counts
    const finalCounts = await db.awesomeList.count()
    const categoriesCount = await db.category.count()

    const duration = ((Date.now() - startTime) / 1000).toFixed(1)

    return NextResponse.json({
      success: true,
      message: `Sync completed in ${duration}s`,
      data: {
        added,
        updated,
        removed,
        skipped,
        totalLists: finalCounts,
        categories: categoriesCount,
        tracker: trackerResult,
      }
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

// GET endpoint for status
export async function GET() {
  const lastSync = await db.awesomeList.findFirst({
    select: { updatedAt: true },
    orderBy: { updatedAt: 'desc' }
  })

  const counts = {
    lists: await db.awesomeList.count(),
    categories: await db.category.count(),
    items: await db.awesomeItem.count(),
  }

  return NextResponse.json({
    success: true,
    data: {
      lastSync: lastSync?.updatedAt || null,
      counts,
    }
  })
}
