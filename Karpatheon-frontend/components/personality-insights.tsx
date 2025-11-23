'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Lightbulb, Award, Calendar } from 'lucide-react'

export function PersonalityInsights() {
  return (
    <div className="space-y-8">
      {/* Growth Trajectory */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary">
            <TrendingUp className="h-4 w-4" />
          </div>
          <h3 className="font-serif text-lg font-medium text-foreground">Growth Trajectory</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="group rounded-lg border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/40">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-medium text-sm text-foreground">Technical Depth</div>
              <span className="font-mono text-xs text-primary">+12%</span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-muted/50">
              <div className="h-full w-[92%] rounded-full bg-primary transition-all group-hover:bg-primary/90" />
            </div>
          </div>
          <div className="group rounded-lg border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/40">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-medium text-sm text-foreground">Breadth</div>
              <span className="font-mono text-xs text-accent">+8%</span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-muted/50">
              <div className="h-full w-[78%] rounded-full bg-accent transition-all group-hover:bg-accent/90" />
            </div>
          </div>
          <div className="group rounded-lg border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/40">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-medium text-sm text-foreground">Connections</div>
              <span className="font-mono text-xs text-primary">+15%</span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-muted/50">
              <div className="h-full w-[85%] rounded-full bg-primary transition-all group-hover:bg-primary/90" />
            </div>
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary">
            <Award className="h-4 w-4" />
          </div>
          <h3 className="font-serif text-lg font-medium text-foreground">Key Strengths</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { strength: 'Technical Mastery', level: 'Elite' },
            { strength: 'Pattern Recognition', level: 'Advanced' },
            { strength: 'Systems Thinking', level: 'Advanced' },
          ].map((item) => (
            <div key={item.strength} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 p-3 transition-colors hover:bg-muted/40">
              <span className="text-sm font-medium text-foreground">{item.strength}</span>
              <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10">
                {item.level}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/5 text-accent">
            <Lightbulb className="h-4 w-4" />
          </div>
          <h3 className="font-serif text-lg font-medium text-foreground">Personalized Tips</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-yellow-50/50 p-4 dark:bg-yellow-900/10">
            <p className="text-sm leading-relaxed text-foreground/90">
              Your deep-dive sessions are most productive in the morning. Consider scheduling complex topics before noon.
            </p>
          </div>
          <div className="rounded-lg bg-blue-50/50 p-4 dark:bg-blue-900/10">
            <p className="text-sm leading-relaxed text-foreground/90">
              You retain 34% more when connecting new concepts to your existing knowledge graph immediately.
            </p>
          </div>
          <div className="rounded-lg bg-green-50/50 p-4 dark:bg-green-900/10">
            <p className="text-sm leading-relaxed text-foreground/90">
              Try exploring more breadth in adjacent domains to unlock new cross-pollination insights.
            </p>
          </div>
        </div>
      </div>

      {/* Evolution Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/5 text-accent">
            <Calendar className="h-4 w-4" />
          </div>
          <h3 className="font-serif text-lg font-medium text-foreground">Evolution</h3>
        </div>
        <div className="relative space-y-6 pl-2">
          <div className="absolute bottom-2 left-[11px] top-2 w-px bg-border/50" />
          {[
            { period: 'This Month', change: 'Shifted toward AI ethics & governance' },
            { period: 'Last Quarter', change: 'Deepened technical ML expertise' },
            { period: '6 Months Ago', change: 'Explored product strategy frameworks' },
          ].map((item) => (
            <div key={item.period} className="relative pl-6">
              <div className="absolute left-0 top-1.5 h-5 w-5 rounded-full border-4 border-background bg-primary/20" />
              <div className="mb-1 text-sm font-medium text-foreground">{item.period}</div>
              <div className="text-xs text-muted-foreground">{item.change}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
