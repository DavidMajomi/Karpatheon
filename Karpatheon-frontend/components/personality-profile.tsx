'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, TrendingUp, Clock, Brain, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PersonalityProfile() {
  return (
    <div className="space-y-6">
      {/* Core Archetype - Document Header Style */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-3xl font-medium text-foreground">The Architect</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="rounded-full bg-primary/5 px-3 font-normal text-primary hover:bg-primary/10">
                    Core Archetype
                  </Badge>
                  <span>•</span>
                  <span>Updated today</span>
                </div>
              </div>
            </div>
            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
              You build comprehensive mental models by connecting technical depth with systems thinking.
              Your learning is driven by understanding how things work at a fundamental level, then applying
              that knowledge to solve complex problems.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/30 p-4 transition-colors hover:bg-muted/50">
            <div className="mb-1 text-sm font-medium text-muted-foreground">Avg. Session</div>
            <div className="font-mono text-2xl text-foreground">47 min</div>
          </div>
          <div className="rounded-xl bg-muted/30 p-4 transition-colors hover:bg-muted/50">
            <div className="mb-1 text-sm font-medium text-muted-foreground">Topics/Week</div>
            <div className="font-mono text-2xl text-foreground">12</div>
          </div>
          <div className="rounded-xl bg-muted/30 p-4 transition-colors hover:bg-muted/50">
            <div className="mb-1 text-sm font-medium text-muted-foreground">Depth Score</div>
            <div className="font-mono text-2xl text-foreground">8.7</div>
          </div>
        </div>
      </div>

    </div>
  )
}
