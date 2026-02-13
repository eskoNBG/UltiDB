'use client'

import { useEffect, useState, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/ultimatedb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, ExternalLink, Star, GitFork, Search, 
  Github, Clock, Tag, AlertCircle 
} from 'lucide-react'
import type { ListDetail } from '@/lib/types'

function ListDetailContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const listId = params.id as string
  
  const [list, setList] = useState<ListDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState<ListDetail['items']>([])

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const res = await fetch(`/api/lists/${listId}`)
        const data = await res.json()

        if (data.success) {
          setList(data.data)
          setFilteredItems(data.data.items || [])
        } else {
          setError(data.error || 'List not found')
        }
      } catch (err) {
        console.error('Error fetching list:', err)
        setError('Failed to load list')
      } finally {
        setLoading(false)
      }
    }

    fetchList()
  }, [listId])

  // Filter items based on search
  useEffect(() => {
    if (!list) return
    
    if (!searchQuery.trim()) {
      setFilteredItems(list.items)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = list.items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      (item.description?.toLowerCase().includes(query)) ||
      (item.url?.toLowerCase().includes(query))
    )
    setFilteredItems(filtered)
  }, [searchQuery, list])

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Unknown'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !list) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'List not found'}
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lists
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start gap-4 mb-4">
                <h1 className="text-3xl font-bold">{list.name}</h1>
                <a
                  href={list.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1"
                >
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </a>
              </div>
              
              {list.category && (
                <Badge variant="outline" className="mb-4">
                  {list.category.name}
                </Badge>
              )}
              
              <p className="text-muted-foreground text-lg">
                {list.description || 'No description available'}
              </p>
            </div>

            {/* Search items */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Items list */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Items ({filteredItems.length})</span>
                  {searchQuery && (
                    <span className="text-sm font-normal text-muted-foreground">
                      Filtered from {list.items.length} items
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery 
                      ? `No items matching "${searchQuery}"`
                      : 'No items in this list'
                    }
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{item.title}</h3>
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.slice(0, 5).map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {item.tags.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{item.tags.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats card */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    <span>Stars</span>
                  </div>
                  <span className="font-semibold">{formatNumber(list.stars)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitFork className="h-5 w-5" />
                    <span>Forks</span>
                  </div>
                  <span className="font-semibold">{formatNumber(list.forks)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    <span>Items</span>
                  </div>
                  <span className="font-semibold">{list.items.length}</span>
                </div>

                {list.language && (
                  <div className="flex items-center justify-between">
                    <span>Language</span>
                    <Badge variant="secondary">{list.language}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Topics card */}
            {list.topics && list.topics.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {list.topics.map((topic, i) => (
                      <Badge key={i} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info card */}
            <Card>
              <CardHeader>
                <CardTitle>Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Added {formatDate(list.createdAt)}</span>
                </div>
                {list.lastUpdated && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Updated {formatDate(list.lastUpdated)}</span>
                  </div>
                )}
                <a
                  href={list.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Github className="h-4 w-4" />
                  View Repository
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-auto">
        <div className="container">
          <p className="text-sm text-muted-foreground text-center">
            Curated with ❤️ from GitHub Awesome Lists
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function ListDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <ListDetailContent />
    </Suspense>
  )
}
