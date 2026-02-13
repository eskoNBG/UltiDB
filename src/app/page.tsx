'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header, SearchBar, ListCard, CategoryFilter, Stats } from '@/components/ultimatedb'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'
import type { Category, AwesomeList, PaginatedResponse } from '@/lib/types'

function HomeContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const categorySlug = searchParams.get('category')
  
  const [categories, setCategories] = useState<Category[]>([])
  const [lists, setLists] = useState<AwesomeList[]>([])
  const [stats, setStats] = useState({ categories: 0, lists: 0, items: 0 })
  const [updatedToday, setUpdatedToday] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data)
        }
      })
      .catch(err => console.error('Failed to fetch categories:', err))
  }, [])

  // Fetch stats
  useEffect(() => {
    fetch('/api/seed')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data)
        }
      })
      .catch(err => console.error('Failed to fetch stats:', err))
  }, [])

  // Fetch tracker stats
  useEffect(() => {
    fetch('/api/tracker')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUpdatedToday(data.data.today.listsUpdated || 0)
        }
      })
      .catch(err => console.error('Failed to fetch tracker stats:', err))
  }, [])

  // Fetch lists
  const fetchLists = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '12')
      
      if (query) params.set('search', query)
      if (categorySlug) params.set('category', categorySlug)

      const res = await fetch(`/api/lists?${params.toString()}`)
      const data: PaginatedResponse<AwesomeList> = await res.json()

      if (data.success) {
        setLists(data.data)
        setPagination(data.pagination)
      } else {
        setError('Failed to load lists')
      }
    } catch (err) {
      console.error('Error fetching lists:', err)
      setError('An error occurred while loading lists')
    } finally {
      setLoading(false)
    }
  }, [page, query, categorySlug])

  useEffect(() => {
    fetchLists()
  }, [fetchLists])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [query, categorySlug])

  return (
    <div className="min-h-screen flex flex-col">
      <Header totalLists={stats.lists} totalItems={stats.items} />
      
      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Section - Centered */}
        <section className="w-full bg-gradient-to-b from-primary/5 to-background py-6 sm:py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
              Discover Awesome Lists
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto">
              Your centralized hub for exploring curated GitHub awesome lists.
              Find the best resources for any technology or topic.
            </p>
            
            <div className="max-w-xl mx-auto">
              <SearchBar 
                placeholder="Search lists, frameworks, libraries..." 
                className="w-full"
                autoFocus
              />
            </div>
          </div>
        </section>

        {/* Stats - Centered */}
        <section className="w-full py-3 sm:py-4 border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Stats 
              categories={stats.categories}
              lists={stats.lists}
              items={stats.items}
              updatedToday={updatedToday}
            />
          </div>
        </section>

        {/* Categories - Centered */}
        <section className="w-full py-3 sm:py-4 border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryFilter 
              categories={categories}
              activeCategory={categorySlug}
            />
          </div>
        </section>

        {/* Lists Grid - Centered */}
        <section className="w-full py-6 sm:py-8 flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {categorySlug 
                    ? categories.find(c => c.slug === categorySlug)?.name || 'Lists'
                    : query 
                      ? `Search results for "${query}"`
                      : 'All Awesome Lists'
                  }
                </h2>
                <p className="text-sm text-muted-foreground">
                  {pagination.total} {pagination.total === 1 ? 'list' : 'lists'} found
                </p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fetchLists()}
                disabled={loading}
                className="shrink-0"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Error state */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading state */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3 p-4 border rounded-lg">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-3">
                      <Skeleton className="h-4 w-14" />
                      <Skeleton className="h-4 w-14" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && lists.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-base sm:text-lg text-muted-foreground mb-4">
                  No lists found
                </p>
                <p className="text-sm text-muted-foreground">
                  {query 
                    ? 'Try a different search term'
                    : categorySlug 
                      ? 'No lists in this category yet'
                      : 'Check back later for new lists'
                  }
                </p>
              </div>
            )}

            {/* Lists grid */}
            {!loading && lists.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {lists.map((list) => (
                    <ListCard key={list.id} list={list} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-6 sm:mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1 flex-wrap justify-center">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum: number
                        if (pagination.pages <= 5) {
                          pageNum = i + 1
                        } else if (page <= 3) {
                          pageNum = i + 1
                        } else if (page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i
                        } else {
                          pageNum = page - 2 + i
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className="w-9 sm:w-10"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 sm:py-8 w-full mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Built with Next.js, Prisma, and shadcn/ui
            </p>
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <a 
                href="https://github.com/sindresorhus/awesome" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Awesome Lists
              </a>
              <span>•</span>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
