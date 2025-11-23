'use client'

import { Sparkles, User, Network, MessageSquare, BookOpen, Brain, Home, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function PersonalityHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
              Pantheon
            </span>
          </Link>

          <div className="mx-4 h-6 w-px bg-border/50" />

          <h1 className="text-sm font-medium text-muted-foreground">Personality Profile</h1>
        </div>

        <nav className="flex items-center gap-1 rounded-full border border-border/50 bg-background/50 p-1">
          <Link href="/search">
            <Button variant="ghost" size="sm" className="rounded-full px-4 text-muted-foreground hover:text-foreground">
              Search
            </Button>
          </Link>
          <Link href="/knowledge-graph">
            <Button variant="ghost" size="sm" className="rounded-full px-4 text-muted-foreground hover:text-foreground">
              Graph
            </Button>
          </Link>
          <Link href="/assistant">
            <Button variant="ghost" size="sm" className="rounded-full px-4 text-muted-foreground hover:text-foreground">
              Chat
            </Button>
          </Link>
          <Link href="/personality">
            <Button variant="secondary" size="sm" className="rounded-full px-4 shadow-sm">
              Profile
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 rounded-full bg-primary/10 ring-2 ring-background" />
        </div>
      </div>
    </header>
  )
}
