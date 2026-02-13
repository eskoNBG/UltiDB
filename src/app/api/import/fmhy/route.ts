import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// FMHY categories to import as awesome lists
const fmhyCategories = [
  {
    name: 'FMHY - Adblocking & Privacy',
    slug: 'fmhy-privacy',
    description: 'Learn how to block ads, trackers and other nasty things. Comprehensive guide to privacy tools and ad-blocking solutions.',
    repositoryUrl: 'https://fmhy.net/privacy',
    stars: 50000,
    forks: 0,
    language: null,
    categorySlug: 'security',
    topics: ['privacy', 'adblocking', 'security', 'trackers']
  },
  {
    name: 'FMHY - Artificial Intelligence',
    slug: 'fmhy-ai',
    description: 'Explore the world of AI and machine learning. Tools, resources, and guides for AI enthusiasts.',
    repositoryUrl: 'https://fmhy.net/ai',
    stars: 45000,
    forks: 0,
    language: null,
    categorySlug: 'ai-ml',
    topics: ['ai', 'machine-learning', 'artificial-intelligence', 'tools']
  },
  {
    name: 'FMHY - Streaming',
    slug: 'fmhy-streaming',
    description: 'Stream, download, torrent and binge all your favourite movies and shows! Complete streaming resource collection.',
    repositoryUrl: 'https://fmhy.net/video',
    stars: 80000,
    forks: 0,
    language: null,
    categorySlug: 'frontend',
    topics: ['streaming', 'movies', 'tv-shows', 'video']
  },
  {
    name: 'FMHY - Listening',
    slug: 'fmhy-listening',
    description: 'Stream, download and torrent songs, podcasts and more! Music and audio content resources.',
    repositoryUrl: 'https://fmhy.net/audio',
    stars: 35000,
    forks: 0,
    language: null,
    categorySlug: 'data-science',
    topics: ['music', 'podcasts', 'audio', 'streaming']
  },
  {
    name: 'FMHY - Gaming',
    slug: 'fmhy-gaming',
    description: 'Download and play all your favourite games or emulate some old but gold ones! Gaming resources and tools.',
    repositoryUrl: 'https://fmhy.net/gaming',
    stars: 60000,
    forks: 0,
    language: null,
    categorySlug: 'game-dev',
    topics: ['gaming', 'games', 'emulation', 'downloads']
  },
  {
    name: 'FMHY - Reading',
    slug: 'fmhy-reading',
    description: 'Whether you are a bookworm, otaku or comic book fan, find your favourite pieces of literature here!',
    repositoryUrl: 'https://fmhy.net/reading',
    stars: 40000,
    forks: 0,
    language: null,
    categorySlug: 'documentation',
    topics: ['books', 'manga', 'comics', 'reading']
  },
  {
    name: 'FMHY - Downloading',
    slug: 'fmhy-downloading',
    description: 'Download all your favourite software, movies, shows, music, games and more! Comprehensive download resources.',
    repositoryUrl: 'https://fmhy.net/downloading',
    stars: 70000,
    forks: 0,
    language: null,
    categorySlug: 'cli-tools',
    topics: ['downloads', 'software', 'media', 'tools']
  },
  {
    name: 'FMHY - Torrenting',
    slug: 'fmhy-torrenting',
    description: 'Download your favourite media using the BitTorrent protocol. Torrent clients, trackers, and guides.',
    repositoryUrl: 'https://fmhy.net/torrenting',
    stars: 55000,
    forks: 0,
    language: null,
    categorySlug: 'devops',
    topics: ['torrenting', 'bittorrent', 'p2p', 'downloads']
  },
  {
    name: 'FMHY - Educational',
    slug: 'fmhy-educational',
    description: 'Educational content for all ages. Learning resources, courses, tutorials and more.',
    repositoryUrl: 'https://fmhy.net/educational',
    stars: 30000,
    forks: 0,
    language: null,
    categorySlug: 'documentation',
    topics: ['education', 'learning', 'courses', 'tutorials']
  },
  {
    name: 'FMHY - Android & iOS',
    slug: 'fmhy-mobile',
    description: 'All forms of content for Android and iOS. Apps, games, tools and more for mobile devices.',
    repositoryUrl: 'https://fmhy.net/mobile',
    stars: 45000,
    forks: 0,
    language: null,
    categorySlug: 'mobile',
    topics: ['android', 'ios', 'mobile', 'apps']
  },
  {
    name: 'FMHY - Linux & macOS',
    slug: 'fmhy-linux-macos',
    description: 'The $HOME of Linux and macOS. Tools, apps, and resources for Unix-based systems.',
    repositoryUrl: 'https://fmhy.net/linux-macos',
    stars: 25000,
    forks: 0,
    language: null,
    categorySlug: 'backend',
    topics: ['linux', 'macos', 'unix', 'tools']
  },
  {
    name: 'FMHY - Non-English',
    slug: 'fmhy-non-english',
    description: 'Content in languages other than English. International resources for global users.',
    repositoryUrl: 'https://fmhy.net/non-english',
    stars: 15000,
    forks: 0,
    language: null,
    categorySlug: 'documentation',
    topics: ['international', 'languages', 'non-english', 'global']
  },
  {
    name: 'FMHY - Miscellaneous',
    slug: 'fmhy-misc',
    description: 'Various topics like food, travel, news, shopping, fun sites and more! Everything else you might need.',
    repositoryUrl: 'https://fmhy.net/misc',
    stars: 20000,
    forks: 0,
    language: null,
    categorySlug: 'cli-tools',
    topics: ['misc', 'various', 'fun', 'lifestyle']
  },
  {
    name: 'FMHY - Beginners Guide',
    slug: 'fmhy-beginners',
    description: 'Get started with FMHY. Beginners guide to finding free media and resources on the internet.',
    repositoryUrl: 'https://fmhy.net/beginners-guide',
    stars: 65000,
    forks: 0,
    language: null,
    categorySlug: 'documentation',
    topics: ['beginners', 'guide', 'tutorial', 'getting-started']
  },
  {
    name: 'FMHY - Developer Tools',
    slug: 'fmhy-dev-tools',
    description: 'Tools and resources for developers. Code editors, IDEs, frameworks and more.',
    repositoryUrl: 'https://fmhy.net/developer-tools',
    stars: 35000,
    forks: 0,
    language: null,
    categorySlug: 'backend',
    topics: ['developer', 'tools', 'programming', 'coding']
  },
  {
    name: 'FMHY - Internet Tools',
    slug: 'fmhy-internet-tools',
    description: 'Internet tools and resources. Browsers, extensions, search engines and more.',
    repositoryUrl: 'https://fmhy.net/internet-tools',
    stars: 28000,
    forks: 0,
    language: null,
    categorySlug: 'frontend',
    topics: ['internet', 'browsers', 'extensions', 'tools']
  },
  {
    name: 'FMHY - System Tools',
    slug: 'fmhy-system-tools',
    description: 'System tools and utilities for Windows, Linux and macOS.',
    repositoryUrl: 'https://fmhy.net/system-tools',
    stars: 32000,
    forks: 0,
    language: null,
    categorySlug: 'cli-tools',
    topics: ['system', 'utilities', 'tools', 'windows']
  },
  {
    name: 'FMHY - File Tools',
    slug: 'fmhy-file-tools',
    description: 'File management tools and utilities. Converters, compressors, editors and more.',
    repositoryUrl: 'https://fmhy.net/file-tools',
    stars: 22000,
    forks: 0,
    language: null,
    categorySlug: 'cli-tools',
    topics: ['files', 'tools', 'converters', 'utilities']
  },
  {
    name: 'FMHY - Image Tools',
    slug: 'fmhy-image-tools',
    description: 'Image editing, conversion and management tools. AI image generators and editors.',
    repositoryUrl: 'https://fmhy.net/image-tools',
    stars: 38000,
    forks: 0,
    language: null,
    categorySlug: 'ai-ml',
    topics: ['images', 'tools', 'editing', 'ai']
  },
  {
    name: 'FMHY - Video Tools',
    slug: 'fmhy-video-tools',
    description: 'Video editing, conversion and streaming tools. Complete video toolkit.',
    repositoryUrl: 'https://fmhy.net/video-tools',
    stars: 42000,
    forks: 0,
    language: null,
    categorySlug: 'frontend',
    topics: ['video', 'tools', 'editing', 'streaming']
  },
  {
    name: 'FMHY - Text Tools',
    slug: 'fmhy-text-tools',
    description: 'Text editors, converters and utilities. Writing and text processing tools.',
    repositoryUrl: 'https://fmhy.net/text-tools',
    stars: 18000,
    forks: 0,
    language: null,
    categorySlug: 'documentation',
    topics: ['text', 'tools', 'editors', 'writing']
  },
  {
    name: 'FMHY - Social Media Tools',
    slug: 'fmhy-social-tools',
    description: 'Social media tools and resources. Downloaders, managers and utilities.',
    repositoryUrl: 'https://fmhy.net/social-media-tools',
    stars: 30000,
    forks: 0,
    language: null,
    categorySlug: 'cli-tools',
    topics: ['social-media', 'tools', 'downloaders', 'utilities']
  },
  {
    name: 'FMHY - Gaming Tools',
    slug: 'fmhy-gaming-tools',
    description: 'Gaming tools and utilities. Mods, trainers, emulators and more.',
    repositoryUrl: 'https://fmhy.net/gaming-tools',
    stars: 48000,
    forks: 0,
    language: null,
    categorySlug: 'game-dev',
    topics: ['gaming', 'tools', 'mods', 'emulators']
  },
  {
    name: 'FMHY - Storage',
    slug: 'fmhy-storage',
    description: 'Cloud storage, file hosting and backup solutions. Free and paid options.',
    repositoryUrl: 'https://fmhy.net/storage',
    stars: 25000,
    forks: 0,
    language: null,
    categorySlug: 'devops',
    topics: ['storage', 'cloud', 'backup', 'hosting']
  },
  {
    name: 'FMHY - Unsafe',
    slug: 'fmhy-unsafe',
    description: 'Potentially unsafe or unverified sites. Use with caution. Warning list for users.',
    repositoryUrl: 'https://fmhy.net/unsafe',
    stars: 12000,
    forks: 0,
    language: null,
    categorySlug: 'security',
    topics: ['unsafe', 'warning', 'security', 'caution']
  },
]

export async function POST() {
  try {
    let created = 0
    let skipped = 0
    const errors: string[] = []

    for (const listData of fmhyCategories) {
      const { categorySlug, topics, ...listInfo } = listData
      
      try {
        // Check if already exists
        const existing = await db.awesomeList.findUnique({
          where: { repositoryUrl: listInfo.repositoryUrl }
        })

        if (existing) {
          skipped++
          continue
        }

        // Get category
        const category = await db.category.findUnique({
          where: { slug: categorySlug }
        })

        // Create list
        await db.awesomeList.create({
          data: {
            ...listInfo,
            categoryId: category?.id || null,
            topics: topics ? JSON.stringify(topics) : null,
            isCurated: true
          }
        })
        
        created++
      } catch (error) {
        errors.push(`${listData.name}: ${(error as Error).message}`)
      }
    }

    // Get final counts
    const listsCount = await db.awesomeList.count()
    const categoriesCount = await db.category.count()

    return NextResponse.json({
      success: true,
      message: `Imported ${created} FMHY lists, skipped ${skipped} existing`,
      data: {
        created,
        skipped,
        errors: errors.length > 0 ? errors : undefined,
        totals: {
          lists: listsCount,
          categories: categoriesCount
        }
      }
    })
  } catch (error) {
    console.error('Error importing FMHY lists:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to import FMHY lists' },
      { status: 500 }
    )
  }
}
