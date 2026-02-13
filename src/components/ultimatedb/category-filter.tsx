'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { 
  Layers, Code, Palette, Server, GraduationCap, Database,
  BookOpen, Book, Edit, Gamepad, Settings, Film,
  Image as ImageIcon, Shield, Folder, Cpu, Briefcase, Globe, Link,
  Heart, Calendar, CheckCircle, Package, ExternalLink,
  Brain, Smartphone, Rocket, BarChart, Terminal
} from 'lucide-react'
import type { Category } from '@/lib/types'

interface CategoryFilterProps {
  categories: Category[]
  activeCategory?: string | null
  className?: string
}

const iconMap: Record<string, React.ReactNode> = {
  Layers: <Layers className="h-3 w-3 sm:h-4 sm:w-4" />,
  Code: <Code className="h-3 w-3 sm:h-4 sm:w-4" />,
  Palette: <Palette className="h-3 w-3 sm:h-4 sm:w-4" />,
  Server: <Server className="h-3 w-3 sm:h-4 sm:w-4" />,
  GraduationCap: <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />,
  Database: <Database className="h-3 w-3 sm:h-4 sm:w-4" />,
  BookOpen: <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />,
  Book: <Book className="h-3 w-3 sm:h-4 sm:w-4" />,
  Edit: <Edit className="h-3 w-3 sm:h-4 sm:w-4" />,
  Gamepad: <Gamepad className="h-3 w-3 sm:h-4 sm:w-4" />,
  Settings: <Settings className="h-3 w-3 sm:h-4 sm:w-4" />,
  Film: <Film className="h-3 w-3 sm:h-4 sm:w-4" />,
  Image: <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />,
  Shield: <Shield className="h-3 w-3 sm:h-4 sm:w-4" />,
  Folder: <Folder className="h-3 w-3 sm:h-4 sm:w-4" />,
  Cpu: <Cpu className="h-3 w-3 sm:h-4 sm:w-4" />,
  Briefcase: <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />,
  Globe: <Globe className="h-3 w-3 sm:h-4 sm:w-4" />,
  Link: <Link className="h-3 w-3 sm:h-4 sm:w-4" />,
  Heart: <Heart className="h-3 w-3 sm:h-4 sm:w-4" />,
  Calendar: <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />,
  CheckCircle: <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />,
  Package: <Package className="h-3 w-3 sm:h-4 sm:w-4" />,
  ExternalLink: <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />,
  Brain: <Brain className="h-3 w-3 sm:h-4 sm:w-4" />,
  Smartphone: <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />,
  Rocket: <Rocket className="h-3 w-3 sm:h-4 sm:w-4" />,
  BarChart: <BarChart className="h-3 w-3 sm:h-4 sm:w-4" />,
  Terminal: <Terminal className="h-3 w-3 sm:h-4 sm:w-4" />,
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200',
  green: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200',
  orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200',
  purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200',
  cyan: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 dark:bg-cyan-900 dark:text-cyan-200',
  gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200',
  emerald: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-200',
  amber: 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200',
  red: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200',
  pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-200',
  violet: 'bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900 dark:text-violet-200',
  yellow: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200',
}

export function CategoryFilter({ categories, activeCategory, className = '' }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className={className}>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-1.5 sm:gap-2 pb-2 justify-center flex-wrap">
          <Button
            variant={!activeCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryClick(null)}
            className="shrink-0 h-8 sm:h-9 text-xs sm:text-sm px-3 sm:px-4"
          >
            All
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryClick(category.slug)}
              className={`shrink-0 gap-1 sm:gap-1.5 h-8 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-4 ${activeCategory !== category.slug && category.color ? colorMap[category.color] || '' : ''}`}
            >
              {category.icon && iconMap[category.icon]}
              <span className="hidden sm:inline">{category.name}</span>
              <span className="sm:hidden">{category.name.split(' ')[0]}</span>
              {category.listCount > 0 && (
                <span className="text-[10px] sm:text-xs opacity-70 hidden md:inline">
                  ({category.listCount})
                </span>
              )}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  )
}

// Grid version for mobile or sidebar
export function CategoryGrid({ categories, activeCategory, className = '' }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 ${className}`}>
      <Button
        variant={!activeCategory ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleCategoryClick(null)}
        className="h-auto py-2 sm:py-3 text-xs sm:text-sm"
      >
        All Categories
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.slug ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryClick(category.slug)}
          className={`h-auto py-2 sm:py-3 justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm ${activeCategory !== category.slug && category.color ? colorMap[category.color] || '' : ''}`}
        >
          {category.icon && iconMap[category.icon]}
          <span className="truncate">{category.name}</span>
        </Button>
      ))}
    </div>
  )
}
