import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// Sample awesome lists data for demo
const additionalLists = [
  {
    name: 'awesome-vue',
    slug: 'awesome-vue',
    description: 'A curated list of awesome things related to Vue.js',
    repositoryUrl: 'https://github.com/vuejs/awesome-vue',
    stars: 72000,
    forks: 9000,
    language: 'Vue',
    categorySlug: 'frontend',
    topics: ['vue', 'javascript', 'frontend']
  },
  {
    name: 'awesome-angular',
    slug: 'awesome-angular',
    description: 'A curated list of awesome Angular resources',
    repositoryUrl: 'https://github.com/PatrickJS/awesome-angular',
    stars: 9000,
    forks: 1300,
    language: 'TypeScript',
    categorySlug: 'frontend',
    topics: ['angular', 'typescript', 'frontend']
  },
  {
    name: 'awesome-rust',
    slug: 'awesome-rust',
    description: 'A curated list of Rust code and resources',
    repositoryUrl: 'https://github.com/rust-unofficial/awesome-rust',
    stars: 47000,
    forks: 2800,
    language: 'Rust',
    categorySlug: 'backend',
    topics: ['rust', 'systems-programming', 'backend']
  },
  {
    name: 'awesome-go',
    slug: 'awesome-go',
    description: 'A curated list of awesome Go frameworks, libraries and software',
    repositoryUrl: 'https://github.com/avelino/awesome-go',
    stars: 130000,
    forks: 11000,
    language: 'Go',
    categorySlug: 'backend',
    topics: ['golang', 'backend', 'microservices']
  },
  {
    name: 'awesome-swift',
    slug: 'awesome-swift',
    description: 'A curated list of awesome Swift frameworks, libraries and software',
    repositoryUrl: 'https://github.com/matteocrippa/awesome-swift',
    stars: 25000,
    forks: 3100,
    language: 'Swift',
    categorySlug: 'mobile',
    topics: ['swift', 'ios', 'mobile']
  },
  {
    name: 'awesome-flutter',
    slug: 'awesome-flutter',
    description: 'An awesome list that curates the best Flutter libraries, tools, tutorials, articles',
    repositoryUrl: 'https://github.com/Solido/awesome-flutter',
    stars: 53000,
    forks: 6500,
    language: 'Dart',
    categorySlug: 'mobile',
    topics: ['flutter', 'dart', 'mobile', 'cross-platform']
  },
  {
    name: 'awesome-react-native',
    slug: 'awesome-react-native',
    description: 'An awesome style list that curates the best React Native libraries',
    repositoryUrl: 'https://github.com/jondot/awesome-react-native',
    stars: 35000,
    forks: 4000,
    language: 'JavaScript',
    categorySlug: 'mobile',
    topics: ['react-native', 'javascript', 'mobile']
  },
  {
    name: 'awesome-docker',
    slug: 'awesome-docker',
    description: 'A curated list of Docker resources and projects',
    repositoryUrl: 'https://github.com/veggiemonk/awesome-docker',
    stars: 29000,
    forks: 3400,
    language: null,
    categorySlug: 'devops',
    topics: ['docker', 'containers', 'devops']
  },
  {
    name: 'awesome-kubernetes',
    slug: 'awesome-kubernetes',
    description: 'A curated list for awesome Kubernetes resources',
    repositoryUrl: 'https://github.com/ramitsurana/awesome-kubernetes',
    stars: 15000,
    forks: 2300,
    language: null,
    categorySlug: 'devops',
    topics: ['kubernetes', 'k8s', 'containers', 'devops']
  },
  {
    name: 'awesome-terraform',
    slug: 'awesome-terraform',
    description: 'A curated list of resources on HashiCorp Terraform',
    repositoryUrl: 'https://github.com/shuaibiyy/awesome-terraform',
    stars: 5000,
    forks: 700,
    language: 'HCL',
    categorySlug: 'devops',
    topics: ['terraform', 'iac', 'devops']
  },
  {
    name: 'awesome-deep-learning',
    slug: 'awesome-deep-learning',
    description: 'A curated list of awesome Deep Learning tutorials, projects and communities',
    repositoryUrl: 'https://github.com/ChristosChristofidis/awesome-deep-learning',
    stars: 24000,
    forks: 4400,
    language: null,
    categorySlug: 'ai-ml',
    topics: ['deep-learning', 'neural-networks', 'ai']
  },
  {
    name: 'awesome-nlp',
    slug: 'awesome-nlp',
    description: 'A curated list of resources dedicated to Natural Language Processing',
    repositoryUrl: 'https://github.com/keon/awesome-nlp',
    stars: 15000,
    forks: 2300,
    language: null,
    categorySlug: 'ai-ml',
    topics: ['nlp', 'natural-language-processing', 'ai']
  },
  {
    name: 'awesome-computer-vision',
    slug: 'awesome-computer-vision',
    description: 'A curated list of awesome computer vision resources',
    repositoryUrl: 'https://github.com/jbhuang0604/awesome-computer-vision',
    stars: 20000,
    forks: 4400,
    language: null,
    categorySlug: 'ai-ml',
    topics: ['computer-vision', 'ai', 'image-processing']
  },
  {
    name: 'awesome-datascience',
    slug: 'awesome-datascience',
    description: 'An open source Data Science repository to learn and apply towards real world problems',
    repositoryUrl: 'https://github.com/academic/awesome-datascience',
    stars: 23000,
    forks: 5000,
    language: null,
    categorySlug: 'data-science',
    topics: ['data-science', 'machine-learning', 'python']
  },
  {
    name: 'awesome-sql',
    slug: 'awesome-sql',
    description: 'A curated list of awesome SQL software, libraries, resources',
    repositoryUrl: 'https://github.com/danhuss/awesome-sql',
    stars: 900,
    forks: 80,
    language: null,
    categorySlug: 'data-science',
    topics: ['sql', 'database', 'data']
  },
  {
    name: 'awesome-cybersecurity',
    slug: 'awesome-cybersecurity',
    description: 'A curated list of awesome cybersecurity resources',
    repositoryUrl: 'https://github.com/fabionoth/awesome-cybersecurity',
    stars: 6000,
    forks: 800,
    language: null,
    categorySlug: 'security',
    topics: ['security', 'cybersecurity', 'hacking']
  },
  {
    name: 'awesome-web-security',
    slug: 'awesome-web-security',
    description: 'A curated list of Web Security materials and resources',
    repositoryUrl: 'https://github.com/qazbnm456/awesome-web-security',
    stars: 11000,
    forks: 1600,
    language: null,
    categorySlug: 'security',
    topics: ['security', 'web-security', 'hacking']
  },
  {
    name: 'awesome-gamedev',
    slug: 'awesome-gamedev',
    description: 'A curated list of game development resources',
    repositoryUrl: 'https://github.com/Calinou/awesome-gamedev',
    stars: 2200,
    forks: 200,
    language: null,
    categorySlug: 'game-dev',
    topics: ['gamedev', 'games', 'game-development']
  },
  {
    name: 'awesome-unity',
    slug: 'awesome-unity',
    description: 'A curated list of awesome Unity assets, resources, and more',
    repositoryUrl: 'https://github.com/RyanNielson/awesome-unity',
    stars: 6000,
    forks: 850,
    language: 'C#',
    categorySlug: 'game-dev',
    topics: ['unity', 'gamedev', 'csharp']
  },
  {
    name: 'awesome-ethereum',
    slug: 'awesome-ethereum',
    description: 'Awesome Ethereum Resources',
    repositoryUrl: 'https://github.com/bekatom/awesome-ethereum',
    stars: 3000,
    forks: 400,
    language: null,
    categorySlug: 'blockchain',
    topics: ['ethereum', 'blockchain', 'web3', 'smart-contracts']
  },
  {
    name: 'awesome-bitcoin',
    slug: 'awesome-bitcoin',
    description: 'A curated list of bitcoin services and tools',
    repositoryUrl: 'https://github.com/igorbarinov/awesome-bitcoin',
    stars: 1500,
    forks: 240,
    language: null,
    categorySlug: 'blockchain',
    topics: ['bitcoin', 'cryptocurrency', 'blockchain']
  },
  {
    name: 'awesome-testing',
    slug: 'awesome-testing',
    description: 'A curated list of testing resources',
    repositoryUrl: 'https://github.com/TheJambo/awesome-testing',
    stars: 1800,
    forks: 200,
    language: null,
    categorySlug: 'testing',
    topics: ['testing', 'qa', 'test-automation']
  },
  {
    name: 'awesome-jest',
    slug: 'awesome-jest',
    description: 'Awesome Jest resources',
    repositoryUrl: 'https://github.com/jest-community/awesome-jest',
    stars: 1200,
    forks: 90,
    language: 'JavaScript',
    categorySlug: 'testing',
    topics: ['jest', 'testing', 'javascript']
  },
  {
    name: 'awesome-documentation',
    slug: 'awesome-documentation',
    description: 'A curated list of awesome documentation tools',
    repositoryUrl: 'https://github.com/documentationjs/awesome-documentation',
    stars: 400,
    forks: 50,
    language: null,
    categorySlug: 'documentation',
    topics: ['documentation', 'docs', 'technical-writing']
  },
  {
    name: 'awesome-readme',
    slug: 'awesome-readme',
    description: 'A curated list of awesome READMEs',
    repositoryUrl: 'https://github.com/matiassingers/awesome-readme',
    stars: 14000,
    forks: 1400,
    language: null,
    categorySlug: 'documentation',
    topics: ['readme', 'documentation', 'github']
  },
]

export async function POST() {
  try {
    let created = 0
    let skipped = 0

    for (const listData of additionalLists) {
      const { categorySlug, topics, ...listInfo } = listData
      
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
          topics: topics ? JSON.stringify(topics) : null
        }
      })
      
      created++
    }

    // Get final counts
    const listsCount = await db.awesomeList.count()
    const categoriesCount = await db.category.count()
    const itemsCount = await db.awesomeItem.count()

    return NextResponse.json({
      success: true,
      message: `Imported ${created} new lists, skipped ${skipped} existing`,
      data: {
        created,
        skipped,
        totals: {
          lists: listsCount,
          categories: categoriesCount,
          items: itemsCount
        }
      }
    })
  } catch (error) {
    console.error('Error importing lists:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to import lists' },
      { status: 500 }
    )
  }
}
