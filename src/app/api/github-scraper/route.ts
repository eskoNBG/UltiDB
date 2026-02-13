import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com'

// Rate limiting - GitHub allows 60 requests/hour for unauthenticated
// and 5000 requests/hour for authenticated requests
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  owner: {
    login: string
  }
}

interface GitHubSearchResponse {
  total_count: number
  incomplete_results: boolean
  items: GitHubRepo[]
}

// Helper function to make authenticated GitHub API requests
async function githubFetch(endpoint: string) {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'UltimateDB-Scraper/1.0',
  }

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`GitHub API error: ${response.status} - ${error}`)
  }

  return response.json()
}

// Search for awesome lists on GitHub
async function searchAwesomeLists(query: string, perPage = 100, page = 1): Promise<GitHubSearchResponse> {
  const encodedQuery = encodeURIComponent(query)
  return githubFetch(
    `/search/repositories?q=${encodedQuery}&sort=stars&order=desc&per_page=${perPage}&page=${page}`
  )
}

// Get repository details
async function getRepo(owner: string, repo: string): Promise<GitHubRepo> {
  return githubFetch(`/repos/${owner}/${repo}`)
}

// Get repository README content
async function getReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'UltimateDB-Scraper/1.0',
          ...(GITHUB_TOKEN ? { 'Authorization': `token ${GITHUB_TOKEN}` } : {}),
        },
      }
    )

    if (!response.ok) return null
    return response.text()
  } catch {
    return null
  }
}

// Parse README to extract items
function parseReadmeForItems(readme: string): Array<{ title: string; description: string; url: string }> {
  const items: Array<{ title: string; description: string; url: string }> = []
  const lines = readme.split('\n')

  for (const line of lines) {
    // Match markdown links: [title](url) - description
    const match = line.match(/\*\s*\[([^\]]+)\]\(([^)]+)\)(?:\s*[-–—]\s*(.+))?/)
    if (match) {
      const [, title, url, description] = match
      if (url.startsWith('http')) {
        items.push({
          title: title.trim(),
          url: url.trim(),
          description: description?.trim() || '',
        })
      }
    }
  }

  return items
}

// Map repository to category
function mapRepoToCategory(repo: GitHubRepo): string {
  const topics = repo.topics || []
  const name = repo.name.toLowerCase()
  const description = (repo.description || '').toLowerCase()

  // Topic-based mapping
  if (topics.some(t => ['vue', 'react', 'angular', 'frontend', 'css', 'javascript'].includes(t))) {
    return 'frontend'
  }
  if (topics.some(t => ['nodejs', 'rust', 'go', 'python', 'backend', 'api'].includes(t))) {
    return 'backend'
  }
  if (topics.some(t => ['devops', 'docker', 'kubernetes', 'ci-cd', 'terraform'].includes(t))) {
    return 'devops'
  }
  if (topics.some(t => ['machine-learning', 'ai', 'deep-learning', 'neural-network', 'nlp'].includes(t))) {
    return 'ai-ml'
  }
  if (topics.some(t => ['data-science', 'data-analysis', 'pandas', 'visualization'].includes(t))) {
    return 'data-science'
  }
  if (topics.some(t => ['security', 'cybersecurity', 'hacking', 'ctf'].includes(t))) {
    return 'security'
  }
  if (topics.some(t => ['mobile', 'ios', 'android', 'swift', 'kotlin', 'flutter', 'react-native'].includes(t))) {
    return 'mobile'
  }
  if (topics.some(t => ['game', 'gamedev', 'unity', 'unreal', 'godot'].includes(t))) {
    return 'game-dev'
  }
  if (topics.some(t => ['blockchain', 'crypto', 'ethereum', 'bitcoin', 'web3'].includes(t))) {
    return 'blockchain'
  }
  if (topics.some(t => ['testing', 'test', 'jest', 'cypress'].includes(t))) {
    return 'testing'
  }
  if (topics.some(t => ['documentation', 'docs', 'readme'].includes(t))) {
    return 'documentation'
  }

  // Name-based mapping
  if (name.includes('frontend') || name.includes('react') || name.includes('vue') || name.includes('css')) {
    return 'frontend'
  }
  if (name.includes('backend') || name.includes('node') || name.includes('api')) {
    return 'backend'
  }
  if (name.includes('devops') || name.includes('docker') || name.includes('kubernetes')) {
    return 'devops'
  }
  if (name.includes('ai') || name.includes('machine-learning') || name.includes('deep-learning')) {
    return 'ai-ml'
  }
  if (name.includes('data') || name.includes('analysis')) {
    return 'data-science'
  }
  if (name.includes('security') || name.includes('hack')) {
    return 'security'
  }
  if (name.includes('mobile') || name.includes('ios') || name.includes('android')) {
    return 'mobile'
  }
  if (name.includes('game') || name.includes('gamedev')) {
    return 'game-dev'
  }

  // Description-based mapping
  if (description.includes('frontend') || description.includes('react') || description.includes('vue')) {
    return 'frontend'
  }
  if (description.includes('backend') || description.includes('api')) {
    return 'backend'
  }
  if (description.includes('devops') || description.includes('docker')) {
    return 'devops'
  }
  if (description.includes('machine learning') || description.includes('artificial intelligence')) {
    return 'ai-ml'
  }
  if (description.includes('data science') || description.includes('data analysis')) {
    return 'data-science'
  }

  return 'cli-tools' // Default category
}

// Main scraper function
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const {
      mode = 'search', // 'search', 'repo', or 'featured'
      query = 'awesome',
      owner,
      repo,
      limit = 50,
      fetchItems = false, // Whether to fetch README items
    } = body

    let created = 0
    let updated = 0
    let skipped = 0
    const errors: string[] = []

    if (mode === 'repo' && owner && repo) {
      // Single repository mode
      const repoData = await getRepo(owner, repo)
      const categorySlug = mapRepoToCategory(repoData)

      const category = await db.category.findUnique({
        where: { slug: categorySlug },
      })

      const existing = await db.awesomeList.findUnique({
        where: { repositoryUrl: repoData.html_url },
      })

      if (existing) {
        // Update existing
        await db.awesomeList.update({
          where: { id: existing.id },
          data: {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            lastUpdated: new Date(repoData.updated_at),
          },
        })
        updated++
      } else {
        // Create new
        const newList = await db.awesomeList.create({
          data: {
            name: repoData.full_name,
            slug: repoData.full_name.replace('/', '-').toLowerCase(),
            description: repoData.description,
            repositoryUrl: repoData.html_url,
            categoryId: category?.id || null,
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            language: repoData.language,
            topics: repoData.topics.length > 0 ? JSON.stringify(repoData.topics) : null,
          },
        })

        // Fetch items if requested
        if (fetchItems) {
          const readme = await getReadme(owner, repo)
          if (readme) {
            const items = parseReadmeForItems(readme)
            for (const item of items.slice(0, 100)) { // Limit to 100 items
              await db.awesomeItem.create({
                data: {
                  listId: newList.id,
                  title: item.title,
                  description: item.description,
                  url: item.url,
                },
              })
            }
          }
        }

        created++
      }
    } else if (mode === 'search') {
      // Search mode - search for awesome lists
      const searchResults = await searchAwesomeLists(query, limit)

      for (const repoData of searchResults.items) {
        try {
          const categorySlug = mapRepoToCategory(repoData)

          const category = await db.category.findUnique({
            where: { slug: categorySlug },
          })

          const existing = await db.awesomeList.findUnique({
            where: { repositoryUrl: repoData.html_url },
          })

          if (existing) {
            skipped++
            continue
          }

          await db.awesomeList.create({
            data: {
              name: repoData.full_name,
              slug: repoData.full_name.replace('/', '-').toLowerCase(),
              description: repoData.description,
              repositoryUrl: repoData.html_url,
              categoryId: category?.id || null,
              stars: repoData.stargazers_count,
              forks: repoData.forks_count,
              language: repoData.language,
              topics: repoData.topics.length > 0 ? JSON.stringify(repoData.topics) : null,
              lastUpdated: new Date(repoData.updated_at),
            },
          })

          created++
        } catch (error) {
          errors.push(`${repoData.full_name}: ${(error as Error).message}`)
        }
      }
    } else if (mode === 'featured') {
      // Featured lists - top awesome lists
      const featuredQueries = [
        'awesome-list',
        'awesome javascript',
        'awesome python',
        'awesome react',
        'awesome nodejs',
        'awesome machine learning',
        'awesome docker',
        'awesome security',
        'awesome devops',
        'awesome mobile',
      ]

      for (const q of featuredQueries) {
        try {
          const results = await searchAwesomeLists(q, 10)

          for (const repoData of results.items) {
            try {
              const categorySlug = mapRepoToCategory(repoData)

              const category = await db.category.findUnique({
                where: { slug: categorySlug },
              })

              const existing = await db.awesomeList.findUnique({
                where: { repositoryUrl: repoData.html_url },
              })

              if (existing) {
                skipped++
                continue
              }

              await db.awesomeList.create({
                data: {
                  name: repoData.full_name,
                  slug: repoData.full_name.replace('/', '-').toLowerCase(),
                  description: repoData.description,
                  repositoryUrl: repoData.html_url,
                  categoryId: category?.id || null,
                  stars: repoData.stargazers_count,
                  forks: repoData.forks_count,
                  language: repoData.language,
                  topics: repoData.topics.length > 0 ? JSON.stringify(repoData.topics) : null,
                  isCurated: true,
                  lastUpdated: new Date(repoData.updated_at),
                },
              })

              created++
            } catch (error) {
              errors.push(`${repoData.full_name}: ${(error as Error).message}`)
            }
          }
        } catch (error) {
          errors.push(`Query "${q}": ${(error as Error).message}`)
        }
      }
    }

    // Get final counts
    const listsCount = await db.awesomeList.count()
    const categoriesCount = await db.category.count()
    const itemsCount = await db.awesomeItem.count()

    return NextResponse.json({
      success: true,
      message: `Created ${created} lists, updated ${updated}, skipped ${skipped}`,
      data: {
        created,
        updated,
        skipped,
        errors: errors.length > 0 ? errors : undefined,
        totals: {
          lists: listsCount,
          categories: categoriesCount,
          items: itemsCount,
        },
      },
    })
  } catch (error) {
    console.error('GitHub scraper error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

// GET endpoint to show scraper documentation
export async function GET() {
  return NextResponse.json({
    name: 'UltimateDB GitHub Scraper API',
    version: '1.0.0',
    description: 'Scrape and import awesome lists from GitHub',
    authentication: GITHUB_TOKEN
      ? 'Token configured - 5000 requests/hour'
      : 'No token - 60 requests/hour (set GITHUB_TOKEN env var)',
    endpoints: {
      'POST /api/github-scraper': {
        description: 'Run the scraper',
        parameters: {
          mode: {
            type: 'string',
            enum: ['search', 'repo', 'featured'],
            default: 'search',
            description: 'Scraper mode',
          },
          query: {
            type: 'string',
            default: 'awesome',
            description: 'Search query (for search mode)',
          },
          owner: {
            type: 'string',
            description: 'Repository owner (for repo mode)',
          },
          repo: {
            type: 'string',
            description: 'Repository name (for repo mode)',
          },
          limit: {
            type: 'number',
            default: 50,
            description: 'Max results per query',
          },
          fetchItems: {
            type: 'boolean',
            default: false,
            description: 'Fetch README items for each list',
          },
        },
        examples: [
          {
            description: 'Search for awesome lists',
            body: { mode: 'search', query: 'awesome react', limit: 20 },
          },
          {
            description: 'Import a specific repository',
            body: { mode: 'repo', owner: 'sindresorhus', repo: 'awesome', fetchItems: true },
          },
          {
            description: 'Import featured lists',
            body: { mode: 'featured' },
          },
        ],
      },
    },
  })
}
