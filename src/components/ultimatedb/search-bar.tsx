'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
  autoFocus?: boolean
}

export function SearchBar({ 
  placeholder = "Search awesome lists...", 
  className = '',
  onSearch,
  autoFocus = false
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [value, setValue] = useState(initialQuery)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const trimmedValue = value.trim()
    
    if (onSearch) {
      onSearch(trimmedValue)
    } else {
      if (trimmedValue) {
        router.push(`/?q=${encodeURIComponent(trimmedValue)}`)
      } else {
        router.push('/')
      }
    }
  }, [value, router, onSearch])

  const handleClear = useCallback(() => {
    setValue('')
    if (!onSearch) {
      router.push('/')
    }
  }, [router, onSearch])

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="pl-9 sm:pl-12 pr-20 sm:pr-24 h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg bg-background border-2 focus:border-primary transition-colors"
        />
        <div className="absolute right-1.5 sm:right-2 flex items-center gap-1 sm:gap-2">
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 sm:h-10 sm:w-10 p-0"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
          <Button type="submit" size="sm" className="h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
            <span className="hidden sm:inline">Search</span>
            <Search className="h-3.5 w-3.5 sm:hidden" />
          </Button>
        </div>
      </div>
    </form>
  )
}
