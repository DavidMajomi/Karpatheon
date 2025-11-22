'use client'

import { Brain, Zap, Target, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function AssistantSidebar() {
  return (
    <aside className="w-80 border-l border-border/50 bg-background/50 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Context Awareness */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-lg font-semibold text-foreground">Context Awareness</h3>
          </div>
          <Card className="border-border/50 bg-background/50 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Topics Indexed</span>
                <span className="font-mono text-sm font-semibold text-primary">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Notes Referenced</span>
                <span className="font-mono text-sm font-semibold text-accent">43</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Conversations</span>
                <span className="font-mono text-sm font-semibold text-foreground">18</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Learning Style */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <h3 className="font-serif text-lg font-semibold text-foreground">Your Learning Style</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
              <span className="text-sm text-muted-foreground">Depth Preference</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Technical
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
              <span className="text-sm text-muted-foreground">Response Style</span>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                Concise
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
              <span className="text-sm text-muted-foreground">Examples</span>
              <Badge variant="secondary" className="bg-muted/50 text-foreground border-border/50">
                Code-First
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-lg font-semibold text-foreground">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full rounded-lg border border-border/50 bg-background/50 p-3 text-left text-sm text-foreground hover:bg-background/80 transition-colors">
              Summarize recent learning
            </button>
            <button className="w-full rounded-lg border border-border/50 bg-background/50 p-3 text-left text-sm text-foreground hover:bg-background/80 transition-colors">
              Connect related topics
            </button>
            <button className="w-full rounded-lg border border-border/50 bg-background/50 p-3 text-left text-sm text-foreground hover:bg-background/80 transition-colors">
              Suggest next exploration
            </button>
          </div>
        </div>

        {/* Suggested Topics */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <h3 className="font-serif text-lg font-semibold text-foreground">Continue Learning</h3>
          </div>
          <div className="space-y-2">
            {[
              { topic: 'Attention Mechanisms', relevance: 96 },
              { topic: 'Transfer Learning', relevance: 94 },
              { topic: 'Model Optimization', relevance: 91 },
            ].map((item) => (
              <Card key={item.topic} className="border-border/50 bg-background/50 p-3 hover:bg-background/80 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{item.topic}</span>
                  <span className="font-mono text-xs text-muted-foreground">{item.relevance}%</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
