'use client'

import { Sparkles, User, Network, MessageSquare, BookOpen, Brain, Home, Settings, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function RecommendationsHeader() {
  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              Pantheon
            </h1>
          </Link>
          
          <nav className="flex items-center gap-1">
            <Link href="/search">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Home className="h-4 w-4" />
                Search
              </Button>
            </Link>
            <Link href="/recommendations">
              <Button variant="ghost" size="sm" className="gap-2 text-primary">
                <Compass className="h-4 w-4" />
                Discover
              </Button>
            </Link>
            <Link href="/knowledge-graph">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Network className="h-4 w-4" />
                Knowledge Graph
              </Button>
            </Link>
            <Link href="/assistant">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <MessageSquare className="h-4 w-4" />
                Assistant
              </Button>
            </Link>
            <Link href="/notes">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <BookOpen className="h-4 w-4" />
                Notes
              </Button>
            </Link>
            <Link href="/personality">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Brain className="h-4 w-4" />
                Personality
              </Button>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
