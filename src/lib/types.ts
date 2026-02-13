// Type definitions for UltimateDB

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  listCount: number
}

export interface AwesomeList {
  id: string
  name: string
  slug: string
  description: string | null
  repositoryUrl: string
  categoryId: string | null
  stars: number
  forks: number
  language: string | null
  topics: string[]
  isCurated: boolean
  lastUpdated: Date | null
  createdAt: Date
  updatedAt: Date
  category?: {
    name: string
    slug: string
    icon: string | null
    color: string | null
  } | null
  itemCount?: number
}

export interface AwesomeItem {
  id: string
  listId: string
  title: string
  description: string | null
  url: string | null
  category: string | null
  itemOrder: number | null
  tags: string[]
  createdAt: Date
}

export interface ListDetail extends AwesomeList {
  items: AwesomeItem[]
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface SearchResults {
  lists: Array<{
    id: string
    name: string
    description: string | null
    stars: number
    language: string | null
    categoryName: string | null
  }>
  items: Array<{
    id: string
    title: string
    description: string | null
    url: string | null
    listName: string
    listId: string
  }>
}
