import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// FMHY Wiki categories from their GitHub wiki
const FMHY_WIKI_URL = 'https://raw.githubusercontent.com/fmhy/FMHYedit/main'

// Real FMHY categories with their wiki pages
const fmhyWikiPages = [
  {
    name: 'FMHY - Adblocking & Privacy',
    slug: 'fmhy-privacy',
    wikiPath: 'docs/adblockvpnguide.md',
    description: 'Learn how to block ads, trackers and other nasty things.',
    categorySlug: 'security',
    topics: ['privacy', 'adblocking', 'security', 'trackers', 'vpn'],
  },
  {
    name: 'FMHY - Streaming',
    slug: 'fmhy-streaming',
    wikiPath: 'docs/videopiracyguide.md',
    description: 'Stream, download, torrent and binge all your favourite movies and shows!',
    categorySlug: 'frontend',
    topics: ['streaming', 'movies', 'tv-shows', 'video', 'piracy'],
  },
  {
    name: 'FMHY - Listening',
    slug: 'fmhy-listening',
    wikiPath: 'docs/audiopiracyguide.md',
    description: 'Stream, download and torrent songs, podcasts and more!',
    categorySlug: 'data-science',
    topics: ['music', 'podcasts', 'audio', 'streaming'],
  },
  {
    name: 'FMHY - Gaming',
    slug: 'fmhy-gaming',
    wikiPath: 'docs/gamingpiracyguide.md',
    description: 'Download and play all your favourite games or emulate some old but gold ones!',
    categorySlug: 'game-dev',
    topics: ['gaming', 'games', 'emulation', 'downloads'],
  },
  {
    name: 'FMHY - Reading',
    slug: 'fmhy-reading',
    wikiPath: 'docs/readingpiracyguide.md',
    description: 'Whether you are a bookworm, otaku or comic book fan, find your favourite pieces of literature here!',
    categorySlug: 'documentation',
    topics: ['books', 'manga', 'comics', 'reading'],
  },
  {
    name: 'FMHY - Downloading',
    slug: 'fmhy-downloading',
    wikiPath: 'docs/downloadpiracyguide.md',
    description: 'Download all your favourite software, movies, shows, music, games and more!',
    categorySlug: 'cli-tools',
    topics: ['downloads', 'software', 'media', 'tools'],
  },
  {
    name: 'FMHY - Torrenting',
    slug: 'fmhy-torrenting',
    wikiPath: 'docs/torrentpiracyguide.md',
    description: 'Download your favourite media using the BitTorrent protocol.',
    categorySlug: 'devops',
    topics: ['torrenting', 'bittorrent', 'p2p', 'downloads'],
  },
  {
    name: 'FMHY - Educational',
    slug: 'fmhy-educational',
    wikiPath: 'docs/edupiracyguide.md',
    description: 'Educational content for all ages. Learning resources, courses, tutorials and more.',
    categorySlug: 'documentation',
    topics: ['education', 'learning', 'courses', 'tutorials'],
  },
  {
    name: 'FMHY - Android & iOS',
    slug: 'fmhy-mobile',
    wikiPath: 'docs/android-iosguide.md',
    description: 'All forms of content for Android and iOS.',
    categorySlug: 'mobile',
    topics: ['android', 'ios', 'mobile', 'apps'],
  },
  {
    name: 'FMHY - Linux & macOS',
    slug: 'fmhy-linux-macos',
    wikiPath: 'docs/linuxguide.md',
    description: 'The $HOME of Linux and macOS.',
    categorySlug: 'backend',
    topics: ['linux', 'macos', 'unix', 'tools'],
  },
  {
    name: 'FMHY - Non-English',
    slug: 'fmhy-non-english',
    wikiPath: 'docs/non-english.md',
    description: 'Content in languages other than English.',
    categorySlug: 'documentation',
    topics: ['international', 'languages', 'non-english', 'global'],
  },
  {
    name: 'FMHY - Miscellaneous',
    slug: 'fmhy-misc',
    wikiPath: 'docs/miscguide.md',
    description: 'Various topics like food, travel, news, shopping, fun sites and more!',
    categorySlug: 'cli-tools',
    topics: ['misc', 'various', 'fun', 'lifestyle'],
  },
  {
    name: 'FMHY - Developer Tools',
    slug: 'fmhy-dev-tools',
    wikiPath: 'docs/devtools.md',
    description: 'Tools and resources for developers.',
    categorySlug: 'backend',
    topics: ['developer', 'tools', 'programming', 'coding'],
  },
  {
    name: 'FMHY - Internet Tools',
    slug: 'fmhy-internet-tools',
    wikiPath: 'docs/internettools.md',
    description: 'Internet tools and resources.',
    categorySlug: 'frontend',
    topics: ['internet', 'browsers', 'extensions', 'tools'],
  },
  {
    name: 'FMHY - System Tools',
    slug: 'fmhy-system-tools',
    wikiPath: 'docs/system-tools.md',
    description: 'System tools and utilities.',
    categorySlug: 'cli-tools',
    topics: ['system', 'utilities', 'tools', 'windows'],
  },
  {
    name: 'FMHY - File Tools',
    slug: 'fmhy-file-tools',
    wikiPath: 'docs/filetools.md',
    description: 'File management tools and utilities.',
    categorySlug: 'cli-tools',
    topics: ['files', 'tools', 'converters', 'utilities'],
  },
  {
    name: 'FMHY - Image Tools',
    slug: 'fmhy-image-tools',
    wikiPath: 'docs/imagetools.md',
    description: 'Image editing, conversion and management tools.',
    categorySlug: 'ai-ml',
    topics: ['images', 'tools', 'editing', 'ai'],
  },
  {
    name: 'FMHY - Video Tools',
    slug: 'fmhy-video-tools',
    wikiPath: 'docs/videotools.md',
    description: 'Video editing, conversion and streaming tools.',
    categorySlug: 'frontend',
    topics: ['video', 'tools', 'editing', 'streaming'],
  },
  {
    name: 'FMHY - Storage',
    slug: 'fmhy-storage',
    wikiPath: 'docs/storage.md',
    description: 'Cloud storage, file hosting and backup solutions.',
    categorySlug: 'devops',
    topics: ['storage', 'cloud', 'backup', 'hosting'],
  },
  {
    name: 'FMHY - AI Tools',
    slug: 'fmhy-ai',
    wikiPath: 'docs/ai.md',
    description: 'AI and machine learning tools and resources.',
    categorySlug: 'ai-ml',
    topics: ['ai', 'machine-learning', 'artificial-intelligence', 'tools'],
  },
]

// Parse markdown content to extract items
function parseMarkdownItems(markdown: string): Array<{
  title: string
  description: string
  url: string
  tags: string[]
}> {
  const items: Array<{
    title: string
    description: string
    url: string
    tags: string[]
  }> = []

  const lines = markdown.split('\n')
  let currentCategory = ''

  for (const line of lines) {
    // Track headers as categories
    const headerMatch = line.match(/^#{1,3}\s+(.+)$/)
    if (headerMatch) {
      currentCategory = headerMatch[1].trim()
      continue
    }

    // Match markdown links: - [title](url) or * [title](url)
    const linkMatch = line.match(/^[\-\*]\s+\[([^\]]+)\]\(([^)]+)\)(?:\s*[-–—]\s*(.+))?/)
    if (linkMatch) {
      const [, title, url, description] = linkMatch
      if (url.startsWith('http') && !url.includes('github.com/fmhy')) {
        items.push({
          title: title.trim(),
          url: url.trim(),
          description: description?.trim() || '',
          tags: currentCategory ? [currentCategory] : [],
        })
      }
    }
  }

  return items
}

// Fetch wiki page content
async function fetchWikiPage(path: string): Promise<string | null> {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/fmhy/FMHYedit/main/${path}`)
    if (!response.ok) return null
    return response.text()
  } catch {
    return null
  }
}

// Main sync function
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const {
      fetchItems = true, // Whether to fetch items from wiki pages
      categories = null, // Specific categories to sync (null = all)
    } = body

    let created = 0
    let updated = 0
    let skipped = 0
    let itemsCreated = 0
    const errors: string[] = []

    const categoriesToSync = categories
      ? fmhyWikiPages.filter(c => categories.includes(c.slug))
      : fmhyWikiPages

    for (const wikiPage of categoriesToSync) {
      try {
        // Get category
        const category = await db.category.findUnique({
          where: { slug: wikiPage.categorySlug },
        })

        // Check if list exists
        const existing = await db.awesomeList.findFirst({
          where: {
            OR: [
              { slug: wikiPage.slug },
              { repositoryUrl: `https://fmhy.net/${wikiPage.slug}` },
            ],
          },
        })

        let listRecord

        if (existing) {
          // Update existing
          listRecord = await db.awesomeList.update({
            where: { id: existing.id },
            data: {
              description: wikiPage.description,
              topics: JSON.stringify(wikiPage.topics),
              lastUpdated: new Date(),
            },
          })
          updated++
        } else {
          // Create new
          listRecord = await db.awesomeList.create({
            data: {
              name: wikiPage.name,
              slug: wikiPage.slug,
              description: wikiPage.description,
              repositoryUrl: `https://fmhy.net/${wikiPage.slug}`,
              categoryId: category?.id || null,
              stars: 50000, // FMHY has ~50k stars
              forks: 0,
              language: null,
              topics: JSON.stringify(wikiPage.topics),
              isCurated: true,
              lastUpdated: new Date(),
            },
          })
          created++
        }

        // Fetch items if requested
        if (fetchItems && wikiPage.wikiPath) {
          const content = await fetchWikiPage(wikiPage.wikiPath)
          if (content) {
            const parsedItems = parseMarkdownItems(content)

            // Delete old items for this list
            await db.awesomeItem.deleteMany({
              where: { listId: listRecord.id },
            })

            // Create new items
            for (const item of parsedItems.slice(0, 200)) { // Limit to 200 items
              await db.awesomeItem.create({
                data: {
                  listId: listRecord.id,
                  title: item.title,
                  description: item.description,
                  url: item.url,
                  tags: item.tags.length > 0 ? JSON.stringify(item.tags) : null,
                },
              })
              itemsCreated++
            }
          }
        }
      } catch (error) {
        errors.push(`${wikiPage.name}: ${(error as Error).message}`)
      }
    }

    // Get final counts
    const listsCount = await db.awesomeList.count()
    const categoriesCount = await db.category.count()
    const itemsCount = await db.awesomeItem.count()

    return NextResponse.json({
      success: true,
      message: `Synced FMHY: Created ${created}, Updated ${updated}, Skipped ${skipped}, Items: ${itemsCreated}`,
      data: {
        created,
        updated,
        skipped,
        itemsCreated,
        errors: errors.length > 0 ? errors : undefined,
        totals: {
          lists: listsCount,
          categories: categoriesCount,
          items: itemsCount,
        },
      },
    })
  } catch (error) {
    console.error('FMHY sync error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

// GET endpoint to show sync documentation
export async function GET() {
  return NextResponse.json({
    name: 'FMHY Sync API',
    version: '1.0.0',
    description: 'Sync FMHY wiki pages and categories to the database',
    source: 'https://github.com/fmhy/FMHYedit',
    categories: fmhyWikiPages.map(c => ({
      slug: c.slug,
      name: c.name,
      wikiPath: c.wikiPath,
    })),
    endpoints: {
      'POST /api/fmhy-sync': {
        description: 'Sync FMHY data',
        parameters: {
          fetchItems: {
            type: 'boolean',
            default: true,
            description: 'Fetch items from wiki pages',
          },
          categories: {
            type: 'array',
            description: 'Specific categories to sync (null = all)',
          },
        },
        examples: [
          {
            description: 'Sync all FMHY data',
            body: { fetchItems: true },
          },
          {
            description: 'Sync specific categories',
            body: {
              fetchItems: true,
              categories: ['fmhy-streaming', 'fmhy-gaming'],
            },
          },
        ],
      },
    },
  })
}
