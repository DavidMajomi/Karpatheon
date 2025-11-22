'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Zap, Calendar, Sparkles } from 'lucide-react'

export function RecommendationsSidebar() {
  return (
    <aside className="w-80 space-y-6">
      {/* Trending Topics */}
      <Card className="border-border/50 bg-card/50 p-6 backdrop-blur">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Trending in Your Graph
          </h3>
        </div>
        <div className="space-y-3">
          {[
            { topic: 'AI Safety & Alignment', growth: '+23%' },
            { topic: 'Organizational Design', growth: '+18%' },
            { topic: 'Biotech Innovation', growth: '+15%' },
            { topic: 'Climate Solutions', growth: '+12%' }
          ].map((item) => (
            <div key={item.topic} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{item.topic}</span>
              <Badge variant="secondary" className="text-xs">
                {item.growth}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Fresh Discoveries */}
      <Card className="border-border/50 bg-card/50 p-6 backdrop-blur">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Fresh Discoveries
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          New content added in the last 24 hours based on your evolving interests
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-foreground font-medium">18 new items</span>
        </div>
      </Card>

      {/* Recommendation Stats */}
      <Card className="border-border/50 bg-card/50 p-6 backdrop-blur">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Your Activity
          </h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Items explored</span>
              <span className="font-medium text-foreground">142</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div className="h-full w-[78%] rounded-full bg-primary" />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Saved for later</span>
              <span className="font-medium text-foreground">23</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div className="h-full w-[45%] rounded-full bg-accent" />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg. match score</span>
              <span className="font-medium text-foreground">94%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div className="h-full w-[94%] rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </Card>

      {/* Algorithm Transparency */}
      <Card className="border-border/50 bg-card/50 p-6 backdrop-blur">
        <h3 className="mb-3 font-serif text-lg font-semibold text-foreground">
          Why these recommendations?
        </h3>
        <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <p>Based on your recent searches for <span className="text-primary">quantum computing</span> and <span className="text-primary">AI alignment</span></p>
          <p className="pt-2">Connected to 12 topics in your knowledge graph</p>
          <p className="pt-2">Matched to your <span className="text-accent">technical depth</span> preference</p>
        </div>
      </Card>
    </aside>
  )
}
