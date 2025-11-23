'use client'

import { Brain, TrendingUp, Target, Zap } from 'lucide-react'

export function SearchInsights() {
  const insights = [
    {
      icon: Brain,
      label: 'Learning',
      value: '47 queries analyzed',
      description: 'Understanding your interests',
    },
    {
      icon: Target,
      label: 'Precision',
      value: '94% relevance',
      description: 'Results accuracy improving',
    },
    {
      icon: TrendingUp,
      label: 'Growth',
      value: '+23% this week',
      description: 'Knowledge expansion',
    },
    {
      icon: Zap,
      label: 'Speed',
      value: '0.3s avg',
      description: 'Response time',
    },
  ]

  return (
    <div className="border-t border-border/50 bg-card/30 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Your Karpatheon Intelligence
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Growing and learning with every search
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <div
                key={index}
                className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all group-hover:bg-primary/20">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {insight.label}
                    </p>
                    <p className="font-serif text-2xl font-semibold text-foreground">
                      {insight.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
