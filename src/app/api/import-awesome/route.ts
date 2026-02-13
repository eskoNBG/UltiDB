import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// Fetch README from sindresorhus/awesome
async function fetchAwesomeReadme(): Promise<string> {
  const response = await fetch(
    'https://raw.githubusercontent.com/sindresorhus/awesome/main/readme.md'
  )
  if (!response.ok) {
    throw new Error(`Failed to fetch README: ${response.status}`)
  }
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
    // Track section headers as categories
    const headerMatch = line.match(/^##\s+(.+)$/)
    if (headerMatch) {
      currentCategory = headerMatch[1].trim()
      continue
    }

    // Skip the main header and table of contents
    if (line.startsWith('# ') || line.startsWith('<h') || line.startsWith('<div')) {
      continue
    }

    // Match list items: - [Name](URL) - Description
    const listMatch = line.match(/^[-*]\s+\[([^\]]+)\]\(([^)]+)\)(?:\s*[-–—]\s*(.+))?/)
    if (listMatch) {
      const [, name, url, description] = listMatch

      // Only include GitHub repositories
      if (url.includes('github.com')) {
        lists.push({
          name: name.trim(),
          slug: url
            .replace('https://github.com/', '')
            .replace('/', '-')
            .toLowerCase(),
          description: description?.trim() || '',
          url: url.trim(),
          category: currentCategory,
        })
      }
    }
  }

  return lists
}

// Map README category to database category slug
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
  'Higher Education': 'learn',
  'Events': 'events',
  'Testing': 'testing',
  'Miscellaneous': 'miscellaneous',
  'Related': 'related',
}

// Fallback mapping based on list name
function mapCategoryByName(name: string): string | null {
  const lower = name.toLowerCase()
  
  if (lower.includes('react') || lower.includes('vue') || lower.includes('angular') || 
      lower.includes('css') || lower.includes('html') || lower.includes('web')) {
    return 'frontend'
  }
  if (lower.includes('node') || lower.includes('django') || lower.includes('flask') ||
      lower.includes('api') || lower.includes('server')) {
    return 'backend'
  }
  if (lower.includes('python') || lower.includes('javascript') || lower.includes('typescript') ||
      lower.includes('rust') || lower.includes('go') || lower.includes('java') ||
      lower.includes('ruby') || lower.includes('php') || lower.includes('swift')) {
    return 'programming-languages'
  }
  if (lower.includes('docker') || lower.includes('kubernetes') || lower.includes('devops')) {
    return 'devops'
  }
  if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('deep learning') ||
      lower.includes('neural') || lower.includes('gpt')) {
    return 'ai-ml'
  }
  if (lower.includes('data') || lower.includes('sql') || lower.includes('database')) {
    return 'databases'
  }
  if (lower.includes('security') || lower.includes('hack') || lower.includes('crypto')) {
    return 'security'
  }
  if (lower.includes('mobile') || lower.includes('android') || lower.includes('ios') ||
      lower.includes('flutter') || lower.includes('react native')) {
    return 'mobile'
  }
  if (lower.includes('game') || lower.includes('unity') || lower.includes('godot') ||
      lower.includes('unreal')) {
    return 'gaming'
  }
  if (lower.includes('test') || lower.includes('jest') || lower.includes('cypress')) {
    return 'testing'
  }
  if (lower.includes('blockchain') || lower.includes('bitcoin') || lower.includes('ethereum') ||
      lower.includes('web3')) {
    return 'decentralized'
  }
  if (lower.includes('cli') || lower.includes('terminal') || lower.includes('shell')) {
    return 'cli-tools'
  }
  if (lower.includes('learn') || lower.includes('tutorial') || lower.includes('course')) {
    return 'learn'
  }
  
  return null
}

// Fetch stars from GitHub API (optional, for better sorting)
async function fetchGitHubStars(owner: string, repo: string): Promise<{ stars: number; forks: number; language: string | null } | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'UltimateDB-Importer/1.0',
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      language: data.language || null,
    }
  } catch {
    return null
  }
}

// Main import function
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const {
      fetchStars = false,
      limit = 0,
    } = body

    console.log('Fetching awesome README...')
    const readme = await fetchAwesomeReadme()

    console.log('Parsing awesome lists...')
    const parsedLists = parseAwesomeLists(readme)

    console.log(`Found ${parsedLists.length} awesome lists`)

    let created = 0
    let updated = 0
    let skipped = 0
    const errors: string[] = []

    const listsToProcess = limit > 0 ? parsedLists.slice(0, limit) : parsedLists

    for (const listData of listsToProcess) {
      try {
        // Map category
        let categorySlug = categoryMapping[listData.category]
        if (!categorySlug) {
          categorySlug = mapCategoryByName(listData.name) || 'miscellaneous'
        }
        
        const category = await db.category.findUnique({
          where: { slug: categorySlug },
        })

        // Check if already exists
        const existing = await db.awesomeList.findUnique({
          where: { repositoryUrl: listData.url },
        })

        if (existing) {
          skipped++
          continue
        }

        // Optionally fetch stars
        let stars = 1000
        let forks = 0
        let language = null

        if (fetchStars) {
          const match = listData.url.match(/github\.com\/([^/]+)\/([^/]+)/)
          if (match) {
            const [, owner, repo] = match
            const ghData = await fetchGitHubStars(owner, repo)
            if (ghData) {
              stars = ghData.stars
              forks = ghData.forks
              language = ghData.language
            }
          }
        }

        // Create the list
        await db.awesomeList.create({
          data: {
            name: listData.name,
            slug: listData.slug,
            description: listData.description || `Awesome ${listData.name} resources`,
            repositoryUrl: listData.url,
            categoryId: category?.id || null,
            stars,
            forks,
            language,
            topics: JSON.stringify([listData.category]),
            isCurated: true,
            lastUpdated: new Date(),
          },
        })

        created++

        if ((created + skipped) % 50 === 0) {
          console.log(`Progress: ${created} created, ${skipped} skipped`)
        }
      } catch (error) {
        errors.push(`${listData.name}: ${(error as Error).message}`)
      }
    }

    // Get final counts
    const listsCount = await db.awesomeList.count()
    const categoriesCount = await db.category.count()
    const itemsCount = await db.awesomeItem.count()

    return NextResponse.json({
      success: true,
      message: `Imported ${created} lists, skipped ${skipped} existing`,
      data: {
        totalFound: parsedLists.length,
        processed: listsToProcess.length,
        created,
        updated,
        skipped,
        errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
        totals: {
          lists: listsCount,
          categories: categoriesCount,
          items: itemsCount,
        },
      },
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

// GET endpoint for documentation
export async function GET() {
  try {
    const readme = await fetchAwesomeReadme()
    const parsedLists = parseAwesomeLists(readme)

    const categories = new Set<string>()
    const lines = readme.split('\n')
    for (const line of lines) {
      const match = line.match(/^##\s+(.+)$/)
      if (match) {
        categories.add(match[1].trim())
      }
    }

    return NextResponse.json({
      name: 'Awesome List Importer',
      version: '1.0.0',
      source: 'https://github.com/sindresorhus/awesome',
      stats: {
        totalLists: parsedLists.length,
        categories: Array.from(categories),
      },
      sampleLists: parsedLists.slice(0, 10),
      categoryMapping,
    })
  } catch (error) {
    return NextResponse.json({
      name: 'Awesome List Importer',
      version: '1.0.0',
      source: 'https://github.com/sindresorhus/awesome',
      error: 'Failed to fetch README preview',
      message: (error as Error).message,
    })
  }
}
