'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, GitFork, ExternalLink } from 'lucide-react'
import type { AwesomeList } from '@/lib/types'

interface ListCardProps {
  list: AwesomeList
  className?: string
}

const languageColors: Record<string, string> = {
  JavaScript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  TypeScript: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Python: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Go: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
  Rust: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  Java: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Ruby: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  C: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'C++': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'C#': 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
  PHP: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
  Swift: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  Kotlin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function ListCard({ list, className = '' }: ListCardProps) {
  return (
    <Link href={`/list/${list.id}`} className="block h-full">
      <Card className={`group h-full hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer overflow-hidden ${className}`}>
        <CardContent className="p-4 h-full flex flex-col">
          {/* Header mit Name und Kategorie */}
          <div className="mb-3">
            <div className="flex items-start gap-2 mb-1.5">
              <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2 flex-1 break-words">
                {list.name}
              </h3>
            </div>
            
            {list.category && (
              <Badge 
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 font-medium"
              >
                {list.category.name}
              </Badge>
            )}
          </div>
          
          {/* Beschreibung */}
          <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-2 flex-1 min-h-[32px] break-words overflow-hidden">
            {list.description || 'No description available'}
          </p>

          {/* Footer mit Stats */}
          <div className="flex items-center justify-between pt-2 border-t mt-auto">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1 text-xs">
                <Star className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="font-medium text-foreground">{formatNumber(list.stars)}</span>
              </span>
              <span className="flex items-center gap-1 text-xs">
                <GitFork className="h-3.5 w-3.5 shrink-0" />
                <span>{formatNumber(list.forks)}</span>
              </span>
            </div>
            
            {list.language && (
              <Badge 
                variant="outline" 
                className={`text-[10px] px-1.5 py-0 h-5 font-medium border-0 ${languageColors[list.language] || 'bg-muted text-muted-foreground'}`}
              >
                {list.language}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Compact version for search results
export function ListCardCompact({ list, className = '' }: ListCardProps) {
  return (
    <Link 
      href={`/list/${list.id}`}
      className={`block p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{list.name}</h4>
            {list.category && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                {list.category.name}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {list.description || 'No description'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
          <Star className="h-3.5 w-3.5 text-amber-500" />
          <span className="font-medium text-foreground">{formatNumber(list.stars)}</span>
        </div>
      </div>
    </Link>
  )
}

// Wide card version for list pages
export function ListCardWide({ list, className = '' }: ListCardProps) {
  return (
    <Link 
      href={`/list/${list.id}`}
      className={`block p-4 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/40 transition-all ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold truncate">{list.name}</h4>
            {list.category && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5 shrink-0">
                {list.category.name}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {list.description || 'No description'}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="font-medium text-foreground">{formatNumber(list.stars)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <GitFork className="h-4 w-4" />
            <span>{formatNumber(list.forks)}</span>
          </span>
          {list.language && (
            <Badge 
              variant="outline" 
              className={`text-xs px-2 border-0 ${languageColors[list.language] || ''}`}
            >
              {list.language}
            </Badge>
          )}
          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  )
}
