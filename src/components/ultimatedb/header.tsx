'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  Database, Github, Menu, X, Moon, Sun,
  Shield, Brain, Film, Music, Gamepad2, BookOpen,
  Download, Cloud, GraduationCap, Smartphone, Terminal,
  Globe, Package, Wrench, FileBox, Image as ImageIcon, Video, FileText,
  Users, HardDrive, AlertTriangle, Sparkles, RefreshCw, Clock, GitCommit
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface UpdatedList {
  id: string
  name: string
  slug: string
  repositoryUrl: string
  lastCommit?: {
    message: string
    date: Date
    author: string
  }
  commitsToday: number
}

interface HeaderProps {
  totalLists?: number
  totalItems?: number
}

// FMHY Categories for the dropdown menu
const fmhyCategories = [
  { title: 'Adblocking & Privacy', href: '/?category=fmhy-privacy', icon: Shield, description: 'Block ads, trackers and protect your privacy' },
  { title: 'Artificial Intelligence', href: '/?category=fmhy-ai', icon: Brain, description: 'AI and machine learning tools & resources' },
  { title: 'Streaming', href: '/?category=fmhy-streaming', icon: Film, description: 'Stream movies, shows and video content' },
  { title: 'Listening', href: '/?category=fmhy-listening', icon: Music, description: 'Music, podcasts and audio resources' },
  { title: 'Gaming', href: '/?category=fmhy-gaming', icon: Gamepad2, description: 'Games, emulators and gaming tools' },
  { title: 'Reading', href: '/?category=fmhy-reading', icon: BookOpen, description: 'Books, manga, comics and literature' },
  { title: 'Downloading', href: '/?category=fmhy-downloading', icon: Download, description: 'Software, media and file downloads' },
  { title: 'Torrenting', href: '/?category=fmhy-torrenting', icon: Cloud, description: 'Torrent clients, trackers and guides' },
  { title: 'Educational', href: '/?category=fmhy-educational', icon: GraduationCap, description: 'Learning resources and courses' },
  { title: 'Android & iOS', href: '/?category=fmhy-mobile', icon: Smartphone, description: 'Mobile apps and tools' },
  { title: 'Linux & macOS', href: '/?category=fmhy-linux-macos', icon: Terminal, description: 'Unix-based system resources' },
  { title: 'Non-English', href: '/?category=fmhy-non-english', icon: Globe, description: 'International content resources' },
]

const fmhyTools = [
  { title: 'Developer Tools', href: '/?category=fmhy-dev-tools', icon: Terminal, description: 'Code editors, IDEs and dev resources' },
  { title: 'Internet Tools', href: '/?category=fmhy-internet-tools', icon: Globe, description: 'Browsers, extensions and web tools' },
  { title: 'System Tools', href: '/?category=fmhy-system-tools', icon: Wrench, description: 'System utilities for all platforms' },
  { title: 'File Tools', href: '/?category=fmhy-file-tools', icon: FileBox, description: 'File management and conversion' },
  { title: 'Image Tools', href: '/?category=fmhy-image-tools', icon: ImageIcon, description: 'Image editing and AI generators' },
  { title: 'Video Tools', href: '/?category=fmhy-video-tools', icon: Video, description: 'Video editing and streaming tools' },
  { title: 'Text Tools', href: '/?category=fmhy-text-tools', icon: FileText, description: 'Text editors and writing tools' },
  { title: 'Social Media Tools', href: '/?category=fmhy-social-tools', icon: Users, description: 'Social media downloaders & utilities' },
  { title: 'Gaming Tools', href: '/?category=fmhy-gaming-tools', icon: Gamepad2, description: 'Mods, trainers and emulators' },
  { title: 'Storage', href: '/?category=fmhy-storage', icon: HardDrive, description: 'Cloud storage and backup solutions' },
]

const fmhyOther = [
  { title: 'Beginners Guide', href: '/?category=fmhy-beginners', icon: Sparkles, description: 'Get started with FMHY' },
  { title: 'Miscellaneous', href: '/?category=fmhy-misc', icon: Package, description: 'Food, travel, shopping and more' },
  { title: 'Unsafe Sites', href: '/?category=fmhy-unsafe', icon: AlertTriangle, description: 'Warning list - use with caution' },
]

export function Header({ totalLists, totalItems }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileFmhyOpen, setMobileFmhyOpen] = useState(false)
  const [mobileUpdatesOpen, setMobileUpdatesOpen] = useState(false)
  const [updatedLists, setUpdatedLists] = useState<UpdatedList[]>([])
  const [updatesToday, setUpdatesToday] = useState(0)
  const { theme, setTheme } = useTheme()

  // Fetch updated lists
  useEffect(() => {
    fetch('/api/tracker')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUpdatedLists(data.data.today.updatedLists || [])
          setUpdatesToday(data.data.today.listsUpdated || 0)
        }
      })
      .catch(err => console.error('Failed to fetch updates:', err))
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl shrink-0">
          <Database className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="hidden xs:inline">UltimateDB</span>
          <Badge variant="secondary" className="ml-1 hidden sm:inline-flex text-xs">
            Beta
          </Badge>
        </Link>

        {/* Navigation - Desktop */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {/* FMHY Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="gap-2 text-sm">
                <Sparkles className="h-4 w-4" />
                FMHY
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[700px] p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-xs font-semibold mb-2 text-muted-foreground flex items-center gap-2">
                        <Film className="h-3 w-3" /> Content
                      </h3>
                      <ul className="space-y-0.5">
                        {fmhyCategories.map((category) => (
                          <ListItem key={category.href} title={category.title} href={category.href} icon={category.icon}>
                            {category.description}
                          </ListItem>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold mb-2 text-muted-foreground flex items-center gap-2">
                        <Wrench className="h-3 w-3" /> Tools
                      </h3>
                      <ul className="space-y-0.5">
                        {fmhyTools.map((category) => (
                          <ListItem key={category.href} title={category.title} href={category.href} icon={category.icon}>
                            {category.description}
                          </ListItem>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold mb-2 text-muted-foreground flex items-center gap-2">
                        <Package className="h-3 w-3" /> Other
                      </h3>
                      <ul className="space-y-0.5">
                        {fmhyOther.map((category) => (
                          <ListItem key={category.href} title={category.title} href={category.href} icon={category.icon}>
                            {category.description}
                          </ListItem>
                        ))}
                      </ul>
                      <div className="mt-3 pt-3 border-t">
                        <a href="https://fmhy.net" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                          fmhy.net →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Updated Lists Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="gap-2 text-sm">
                <RefreshCw className="h-4 w-4" />
                Updated
                {updatesToday > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                    {updatesToday}
                  </Badge>
                )}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[400px] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Recently Updated Lists</h3>
                    <Badge variant="outline" className="text-xs">
                      {updatesToday} today
                    </Badge>
                  </div>
                  
                  {updatedLists.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No updates tracked yet. Run the tracker to see updates.
                    </p>
                  ) : (
                    <ul className="space-y-1 max-h-[300px] overflow-y-auto">
                      {updatedLists.map((list) => (
                        <li key={list.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/list/${list.id}`}
                              className="block p-2 rounded-md hover:bg-accent transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                <GitCommit className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{list.name}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {list.lastCommit?.message || 'Updated'}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatTimeAgo(list.lastCommit?.date)}</span>
                                    <span>•</span>
                                    <span>{list.commitsToday} commit{list.commitsToday > 1 ? 's' : ''}</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Awesome Lists Link - removed, now default home */}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Stats - Tablet/Desktop */}
        {(totalLists || totalItems) && (
          <div className="hidden md:flex items-center gap-3 lg:gap-4 text-xs sm:text-sm text-muted-foreground">
            {totalLists && <span>{totalLists.toLocaleString()} Lists</span>}
            {totalItems && <span>{totalItems.toLocaleString()} Items</span>}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-8 w-8 sm:h-9 sm:w-9">
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button variant="outline" size="sm" asChild className="hidden sm:flex">
            <a href="https://github.com/sindresorhus/awesome" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </a>
          </Button>

          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 sm:h-9 sm:w-9" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t py-3 sm:py-4 px-4 space-y-3 sm:space-y-4 max-h-[80vh] overflow-y-auto">
          {/* FMHY Mobile Accordion */}
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-between h-9 sm:h-10" onClick={() => setMobileFmhyOpen(!mobileFmhyOpen)}>
              <span className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4" />
                FMHY
              </span>
              <span className="text-xs">{mobileFmhyOpen ? '▲' : '▼'}</span>
            </Button>

            {mobileFmhyOpen && (
              <div className="pl-3 sm:pl-4 space-y-3 sm:space-y-4 border-l-2 ml-2">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Film className="h-3 w-3" /> Content
                  </h4>
                  <div className="space-y-0.5">
                    {fmhyCategories.map((cat) => (
                      <Link key={cat.href} href={cat.href} className="block text-xs sm:text-sm py-1 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Wrench className="h-3 w-3" /> Tools
                  </h4>
                  <div className="space-y-0.5">
                    {fmhyTools.map((cat) => (
                      <Link key={cat.href} href={cat.href} className="block text-xs sm:text-sm py-1 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Package className="h-3 w-3" /> Other
                  </h4>
                  <div className="space-y-0.5">
                    {fmhyOther.map((cat) => (
                      <Link key={cat.href} href={cat.href} className="block text-xs sm:text-sm py-1 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <a href="https://fmhy.net" target="_blank" rel="noopener noreferrer" className="block text-xs sm:text-sm text-primary hover:underline py-1">
                    fmhy.net →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Updated Lists Mobile */}
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-between h-9 sm:h-10" onClick={() => setMobileUpdatesOpen(!mobileUpdatesOpen)}>
              <span className="flex items-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4" />
                Updated
                {updatesToday > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    {updatesToday}
                  </Badge>
                )}
              </span>
              <span className="text-xs">{mobileUpdatesOpen ? '▲' : '▼'}</span>
            </Button>

            {mobileUpdatesOpen && (
              <div className="pl-3 sm:pl-4 border-l-2 ml-2 space-y-1">
                {updatedLists.slice(0, 10).map((list) => (
                  <Link
                    key={list.id}
                    href={`/list/${list.id}`}
                    className="block text-xs sm:text-sm py-1.5 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <GitCommit className="h-3 w-3 text-green-500" />
                      <span className="truncate">{list.name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate ml-5">
                      {list.lastCommit?.message}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 sm:gap-2 pt-2 border-t">
            <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="justify-start h-9 sm:h-10">
              {theme === 'dark' ? <><Sun className="h-4 w-4 mr-2" />Light Mode</> : <><Moon className="h-4 w-4 mr-2" />Dark Mode</>}
            </Button>
            <Button variant="ghost" asChild className="justify-start h-9 sm:h-10">
              <a href="https://github.com/sindresorhus/awesome" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>

          {(totalLists || totalItems) && (
            <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground pt-2 border-t">
              {totalLists && <span>{totalLists.toLocaleString()} Lists</span>}
              {totalItems && <span>{totalItems.toLocaleString()} Items</span>}
            </div>
          )}
        </div>
      )}
    </header>
  )
}

// List Item Component for Navigation Menu
const ListItem = ({
  className,
  title,
  children,
  href,
  icon: Icon,
  ...props
}: {
  className?: string
  title: string
  children: React.ReactNode
  href: string
  icon?: React.ComponentType<{ className?: string }>
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-0.5 rounded-md p-1.5 sm:p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            {Icon && <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
            <span className="text-xs sm:text-sm font-medium leading-none">{title}</span>
          </div>
          <p className="line-clamp-1 text-[10px] sm:text-xs leading-snug text-muted-foreground pl-5 sm:pl-6">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

// Helper function to format time ago
function formatTimeAgo(date: Date | undefined): string {
  if (!date) return 'Unknown'
  
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}
