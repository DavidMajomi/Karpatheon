'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Zap, Calendar, Sparkles } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

export function RecommendationsSidebar() {
  const [stats, setStats] = useState({
    totalDiscoveries: 0,
    avgSimilarity: 0,
    newItems: 0
  })

  const userId = 'demo_user'

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await apiClient.listDiscoveries(userId, 0.0, 100)
      const discoveries = response.discoveries

      setStats({
        totalDiscoveries: discoveries.length,
        avgSimilarity: discoveries.length > 0
          ? discoveries.reduce((acc, d) => acc + d.similarity_to_kb, 0) / discoveries.length
          : 0,
        newItems: discoveries.filter(d => {
          const crawledDate = new Date(d.crawled_at)
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          return crawledDate > dayAgo
        }).length
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

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
            { topic: 'AI & Machine Learning', growth: '+23%' },
            { topic: 'Leadership', growth: '+18%' },
            { topic: 'Technology', growth: '+15%' },
            { topic: 'Business Strategy', growth: '+12%' }
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
          <span className="text-foreground font-medium">{stats.newItems} new items</span>
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
              <span className="text-muted-foreground">Items discovered</span>
              <span className="font-medium text-foreground">{stats.totalDiscoveries}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min((stats.totalDiscoveries / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg. match score</span>
              <span className="font-medium text-foreground">
                {(stats.avgSimilarity * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${stats.avgSimilarity * 100}%` }}
              />
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
          <p>Based on your seed interests and <span className="text-primary">knowledge graph</span></p>
          <p className="pt-2">Ranked by similarity to your existing knowledge base</p>
          <p className="pt-2">Powered by <span className="text-accent">Exa AI</span> and Neo4j vector search</p>
        </div>
      </Card>
    </aside>
  )
}
