'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Bookmark, BookmarkCheck, Clock, Sparkles, TrendingUp } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { SEED_URLS, createInterestPayload } from '@/lib/seed-urls'
import { toast } from 'sonner'
import type { DiscoveryItem } from '@/lib/types'
import Image from 'next/image'

export function RecommendationsGrid() {
  const [discoveries, setDiscoveries] = useState<DiscoveryItem[]>([])
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'article' | 'podcast' | 'video'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [isIngesting, setIsIngesting] = useState(false)
  const [selectedSeed, setSelectedSeed] = useState<number | null>(null)

  const userId = 'demo_user' // In production, get from auth

  useEffect(() => {
    loadDiscoveries()
  }, [])

  const loadDiscoveries = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.listDiscoveries(userId, 0.7, 20)
      setDiscoveries(response.discoveries)
    } catch (error: any) {
      // Silently fail on initial load
      console.error('Failed to load discoveries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleIngest = async (seedIndex: number) => {
    setIsIngesting(true)
    setSelectedSeed(seedIndex)

    try {
      const seed = SEED_URLS[seedIndex]
      const payload = createInterestPayload(seed)

      const result = await apiClient.ingestInterest(userId, payload)

      toast.success('Discovery complete!', {
        description: `Found ${result.crawled_count} related articles`
      })

      // Fetch discoveries
      await loadDiscoveries()
    } catch (error: any) {
      toast.error('Discovery failed', {
        description: error.message
      })
    } finally {
      setIsIngesting(false)
      setSelectedSeed(null)
    }
  }

  const toggleSave = (url: string) => {
    setSavedItems(prev => {
      const next = new Set(prev)
      if (next.has(url)) {
        next.delete(url)
      } else {
        next.add(url)
      }
      return next
    })
  }

  // Generate placeholder image URL based on title
  const getImageUrl = (title: string) => {
    const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `https://picsum.photos/seed/${seed}/400/250`
  }

  // Determine type from URL or default to article
  const getContentType = (url: string): 'article' | 'podcast' | 'video' => {
    if (url.includes('youtube.com') || url.includes('vimeo.com')) return 'video'
    if (url.includes('spotify.com') || url.includes('podcast')) return 'podcast'
    return 'article'
  }

  const filteredDiscoveries = filter === 'all'
    ? discoveries
    : discoveries.filter(d => getContentType(d.url) === filter)

  return (
    <div className="space-y-6">
      {/* Seed Interests Pills */}
      {discoveries.length === 0 && (
        <div className="mb-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Discover Content
          </h2>
          <div className="flex flex-wrap gap-2">
            {SEED_URLS.map((seed, index) => (
              <Button
                key={index}
                onClick={() => handleIngest(index)}
                disabled={isIngesting}
                variant={selectedSeed === index ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {isIngesting && selectedSeed === index ? (
                  <>
                    <Sparkles className="mr-2 h-3 w-3 animate-spin" />
                    Discovering...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-3 w-3" />
                    {seed.title}
                  </>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {discoveries.length > 0 && (
        <div className="flex items-center gap-2 border-b border-border/50 pb-4">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className="rounded-full"
          >
            All Content
          </Button>
          <Button
            variant={filter === 'article' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('article')}
            className="rounded-full"
          >
            Articles
          </Button>
          <Button
            variant={filter === 'podcast' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('podcast')}
            className="rounded-full"
          >
            Podcasts
          </Button>
          <Button
            variant={filter === 'video' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('video')}
            className="rounded-full"
          >
            Videos
          </Button>
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredDiscoveries.map((item) => (
          <Card
            key={item.url}
            className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={getImageUrl(item.title)}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

              {/* Match Score Badge */}
              <div className="absolute right-3 top-3">
                <Badge className="gap-1 bg-primary/90 text-primary-foreground backdrop-blur">
                  <Sparkles className="h-3 w-3" />
                  {(item.similarity_to_kb * 100).toFixed(0)}% match
                </Badge>
              </div>

              {/* Type Badge */}
              <div className="absolute left-3 top-3">
                <Badge variant="secondary" className="capitalize backdrop-blur">
                  {getContentType(item.url)}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-semibold leading-tight text-balance text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(item.crawled_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSave(item.url)}
                  className="shrink-0 text-muted-foreground hover:text-primary"
                >
                  {savedItems.has(item.url) ? (
                    <BookmarkCheck className="h-5 w-5 fill-primary text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <p className="text-pretty text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {item.snippet}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-accent" />
                  <span>Interest: {(item.similarity_to_interest * 100).toFixed(0)}%</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-2"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  View
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {discoveries.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-6">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <h3 className="mb-2 font-serif text-2xl font-semibold">
            Start Your Discovery Journey
          </h3>
          <p className="mb-6 max-w-md text-muted-foreground">
            Click on any seed interest above to discover related content curated just for you
          </p>
        </div>
      )}
    </div>
  )
}
