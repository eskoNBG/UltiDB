/**
 * UltimateDB GitHub Scraper
 * 
 * This script imports awesome lists from GitHub into the database.
 * It uses the GitHub Search API to find repositories with the "awesome" topic.
 * 
 * Usage: 
 *   bun run scripts/scrape-awesome-lists.ts
 * 
 * Or via API:
 *   POST /api/scrape
 */

import { db } from '../src/lib/db'

// GitHub API configuration
const GITHUB_API = 'https://api.github.com'

// Rate limiting helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Fetch with retry logic
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.status === 403) {
        // Rate limited, wait and retry
        const resetTime = response.headers.get('x-ratelimit-reset')
        if (resetTime) {
          const waitTime = (parseInt(resetTime) * 1000) - Date.now() + 1000
          console.log(`Rate limited. Waiting ${Math.ceil(waitTime / 1000)}s...`)
          await delay(waitTime)
          continue
        }
      }
      return response
    } catch (error) {
      if (i === retries - 1) throw error
      console.log(`Retry ${i + 1}/${retries}...`)
      await delay(1000 * (i + 1))
    }
  }
  throw new Error('Max retries exceeded')
}

// Search awesome repositories on GitHub
async function searchAwesomeRepos(page = 1, perPage = 100) {
  const query = 'topic:awesome+stars:>100'
  const url = `${GITHUB_API}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${perPage}&page=${page}`
  
  const response = await fetchWithRetry(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'UltimateDB-Scraper',
      ...(process.env.GITHUB_TOKEN && {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      })
    }
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Get or create category
async function getOrCreateCategory(name: string, slug: string) {
  let category = await db.category.findUnique({ where: { slug } })
  
  if (!category) {
    category = await db.category.create({
      data: {
        name,
        slug,
        description: `Awesome ${name} resources`
      }
    })
    console.log(`  Created category: ${name}`)
  }
  
  return category
}

// Parse category from repo name
function parseCategoryFromRepo(repoName: string, repoDescription: string | null): { name: string; slug: string } | null {
  // Extract category from repo name
  const nameWithoutAwesome = repoName
    .replace(/^awesome-/, '')
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  if (nameWithoutAwesome && nameWithoutAwesome.length > 1) {
    return {
      name: nameWithoutAwesome,
      slug: repoName.replace(/^awesome-/, '').toLowerCase()
    }
  }
  
  return null
}

// Main scraper function
async function scrapeAwesomeLists(maxPages = 5) {
  console.log('🚀 Starting UltimateDB GitHub Scraper...\n')
  
  let totalProcessed = 0
  let totalCreated = 0
  let totalUpdated = 0
  let totalSkipped = 0

  for (let page = 1; page <= maxPages; page++) {
    console.log(`📄 Fetching page ${page}/${maxPages}...`)
    
    try {
      const data = await searchAwesomeRepos(page, 100)
      const repos = data.items || []
      
      console.log(`   Found ${repos.length} repositories`)
      
      if (repos.length === 0) {
        console.log('   No more results, stopping...')
        break
      }

      for (const repo of repos) {
        totalProcessed++
        
        try {
          // Check if list already exists
          const existing = await db.awesomeList.findUnique({
            where: { repositoryUrl: repo.html_url }
          })

          if (existing) {
            // Update existing list with new stats
            await db.awesomeList.update({
              where: { id: existing.id },
              data: {
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                lastUpdated: new Date(repo.updated_at)
              }
            })
            totalUpdated++
            continue
          }

          // Parse category
          let category = null
          const categoryInfo = parseCategoryFromRepo(repo.name, repo.description)
          
          if (categoryInfo) {
            category = await getOrCreateCategory(categoryInfo.name, categoryInfo.slug)
          }

          // Create new awesome list
          await db.awesomeList.create({
            data: {
              name: repo.name,
              slug: repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
              description: repo.description,
              repositoryUrl: repo.html_url,
              categoryId: category?.id || null,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              topics: repo.topics ? JSON.stringify(repo.topics) : null,
              lastUpdated: new Date(repo.updated_at)
            }
          })
          
          totalCreated++
          console.log(`   ✅ Created: ${repo.name} (${repo.stargazers_count.toLocaleString()} stars)`)
          
          // Rate limiting
          await delay(100)
          
        } catch (error) {
          totalSkipped++
          console.error(`   ❌ Error processing ${repo.name}:`, (error as Error).message)
        }
      }

      // Rate limiting between pages
      if (page < maxPages) {
        console.log('   Waiting before next page...')
        await delay(2000)
      }
      
    } catch (error) {
      console.error(`Error on page ${page}:`, (error as Error).message)
      break
    }
  }

  console.log('\n📊 Scraping Summary:')
  console.log(`   Total processed: ${totalProcessed}`)
  console.log(`   Created: ${totalCreated}`)
  console.log(`   Updated: ${totalUpdated}`)
  console.log(`   Skipped: ${totalSkipped}`)
  
  // Get final counts
  const listsCount = await db.awesomeList.count()
  const categoriesCount = await db.category.count()
  
  console.log(`\n📈 Database Stats:`)
  console.log(`   Total lists: ${listsCount}`)
  console.log(`   Total categories: ${categoriesCount}`)
  
  console.log('\n✨ Scraping complete!')
}

// Run scraper
scrapeAwesomeLists()
  .catch(error => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
  .finally(() => {
    // Close database connection
    db.$disconnect()
  })
