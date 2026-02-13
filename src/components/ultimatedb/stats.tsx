'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Database, List, FolderOpen, RefreshCw } from 'lucide-react'

interface StatsProps {
  categories: number
  lists: number
  items: number
  updatedToday?: number
}

export function Stats({ categories, lists, items, updatedToday }: StatsProps) {
  const stats = [
    {
      label: 'Categories',
      value: categories,
      icon: FolderOpen,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      label: 'Awesome Lists',
      value: lists,
      icon: List,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900'
    },
    {
      label: 'Curated Items',
      value: items,
      icon: Database,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900'
    },
  ]

  // Add updates today card if we have the data
  if (updatedToday !== undefined) {
    stats.push({
      label: 'Updated Today',
      value: updatedToday,
      icon: RefreshCw,
      color: 'text-amber-500',
      bg: 'bg-amber-100 dark:bg-amber-900'
    })
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bg} shrink-0`}>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
