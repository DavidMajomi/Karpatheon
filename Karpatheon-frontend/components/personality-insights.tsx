'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Lightbulb, Award, Calendar } from 'lucide-react'

export function PersonalityInsights() {
  return (
    <div className="space-y-6">
      {/* Growth Trajectory */}
      <Card className="border-border/50 bg-background/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="font-serif text-lg font-semibold text-foreground">Growth Trajectory</h3>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-border/50 bg-background/50 p-3">
            <div className="mb-1 font-medium text-sm text-foreground">Technical Depth</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted/50">
                <div className="h-full w-[92%] rounded-full bg-primary" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">+12%</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/50 p-3">
            <div className="mb-1 font-medium text-sm text-foreground">Breadth of Knowledge</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted/50">
                <div className="h-full w-[78%] rounded-full bg-accent" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">+8%</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/50 p-3">
            <div className="mb-1 font-medium text-sm text-foreground">Connection Quality</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted/50">
                <div className="h-full w-[85%] rounded-full bg-primary" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">+15%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Strengths */}
      <Card className="border-border/50 bg-background/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          <h3 className="font-serif text-lg font-semibold text-foreground">Key Strengths</h3>
        </div>
        <div className="space-y-2">
          {[
            { strength: 'Technical Mastery', level: 'Elite' },
            { strength: 'Pattern Recognition', level: 'Advanced' },
            { strength: 'Systems Thinking', level: 'Advanced' },
          ].map((item) => (
            <div key={item.strength} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
              <span className="text-sm text-foreground">{item.strength}</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {item.level}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="border-border/50 bg-background/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-accent" />
          <h3 className="font-serif text-lg font-semibold text-foreground">Personalized Tips</h3>
        </div>
        <div className="space-y-3 text-sm leading-relaxed">
          <div className="rounded-lg border border-border/50 bg-background/50 p-3">
            <p className="text-foreground">
              Your deep-dive sessions are most productive in the morning. Consider scheduling complex topics before noon.
            </p>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/50 p-3">
            <p className="text-foreground">
              You retain 34% more when connecting new concepts to your existing knowledge graph immediately.
            </p>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/50 p-3">
            <p className="text-foreground">
              Try exploring more breadth in adjacent domains to unlock new cross-pollination insights.
            </p>
          </div>
        </div>
      </Card>

      {/* Evolution Timeline */}
      <Card className="border-border/50 bg-background/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-accent" />
          <h3 className="font-serif text-lg font-semibold text-foreground">Evolution</h3>
        </div>
        <div className="space-y-3">
          {[
            { period: 'This Month', change: 'Shifted toward AI ethics & governance' },
            { period: 'Last Quarter', change: 'Deepened technical ML expertise' },
            { period: '6 Months Ago', change: 'Explored product strategy frameworks' },
          ].map((item) => (
            <div key={item.period} className="border-l-2 border-primary/30 pl-3">
              <div className="mb-1 text-sm font-medium text-foreground">{item.period}</div>
              <div className="text-xs text-muted-foreground">{item.change}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
