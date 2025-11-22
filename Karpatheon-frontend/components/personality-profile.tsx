'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Zap, BookOpen, TrendingUp, Clock, Brain } from 'lucide-react'

const personalityTraits = [
  {
    category: 'Learning Style',
    icon: Brain,
    traits: [
      { name: 'Deep Diver', score: 94, description: 'You prefer comprehensive understanding over surface-level knowledge' },
      { name: 'Systems Thinker', score: 89, description: 'You naturally connect concepts and see the bigger picture' },
      { name: 'Technical Focus', score: 92, description: 'You gravitate toward implementation details and concrete examples' },
    ],
  },
  {
    category: 'Exploration Patterns',
    icon: Target,
    traits: [
      { name: 'Vertical Explorer', score: 87, description: 'You tend to go deep into topics rather than broad exploration' },
      { name: 'Question-Driven', score: 91, description: 'Your curiosity is sparked by specific questions and problems' },
      { name: 'Iterative Learner', score: 85, description: 'You revisit topics to deepen understanding over time' },
    ],
  },
  {
    category: 'Knowledge Integration',
    icon: Zap,
    traits: [
      { name: 'Cross-Domain Connector', score: 88, description: 'You excel at linking ideas across different fields' },
      { name: 'Pattern Recognizer', score: 93, description: 'You quickly identify underlying patterns and principles' },
      { name: 'Practical Applicator', score: 90, description: 'You seek real-world applications for theoretical concepts' },
    ],
  },
]

export function PersonalityProfile() {
  return (
    <div className="space-y-6">
      {/* Core Archetype */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                Core Archetype
              </Badge>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">The Architect</h3>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              You build comprehensive mental models by connecting technical depth with systems thinking. 
              Your learning is driven by understanding how things work at a fundamental level, then applying 
              that knowledge to solve complex problems.
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20">
            <Brain className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          <div className="rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Avg. Session</span>
            </div>
            <div className="font-mono text-2xl font-semibold text-foreground">47 min</div>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Topics/Week</span>
            </div>
            <div className="font-mono text-2xl font-semibold text-foreground">12</div>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Depth Score</span>
            </div>
            <div className="font-mono text-2xl font-semibold text-foreground">8.7/10</div>
          </div>
        </div>
      </Card>

      {/* Personality Traits */}
      {personalityTraits.map((category) => {
        const Icon = category.icon
        return (
          <Card key={category.category} className="border-border/50 bg-background/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-xl font-semibold text-foreground">{category.category}</h3>
            </div>
            <div className="space-y-4">
              {category.traits.map((trait) => (
                <div key={trait.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-foreground">{trait.name}</span>
                    <span className="font-mono text-sm text-primary">{trait.score}%</span>
                  </div>
                  <div className="mb-2 h-2 overflow-hidden rounded-full bg-muted/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${trait.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{trait.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
