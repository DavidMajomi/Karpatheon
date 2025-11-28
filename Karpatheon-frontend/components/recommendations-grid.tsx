'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Bookmark, BookmarkCheck, Clock, Sparkles, TrendingUp } from 'lucide-react'
// import { apiClient } from '@/lib/api-client' // Original import
import { SEED_URLS, createInterestPayload } from '@/lib/seed-urls'
import { toast } from 'sonner'
import type { DiscoveryItem, DiscoveryResponse, IngestResponse, InterestPayload } from '@/lib/types' // Assuming these are defined
import Image from 'next/image'

// ======================================================================
// 1. MOCK DATA & CLIENT FOR FRONTEND ISOLATION
// ----------------------------------------------------------------------

// Mock DiscoveryResponse Data
const MOCK_DISCOVERY_DATA: DiscoveryResponse = {
  discoveries: [
    {
      url: "https://medium.com/engineering/microservices-patterns-in-2025",
      title: "Microservices & Serverless: 5 Patterns to Watch in 2025",
      snippet: "An in-depth analysis of emerging architectural patterns, including sidecar proxies, event sourcing, and next-generation FaaS frameworks for building resilient, scalable systems.",
      similarity_to_kb: 0.8921,
      similarity_to_interest: 0.9543,
      source_interest_url: "https://seed-url.com/modern-backend-trends",
      crawled_at: "2025-11-20T10:00:00.000Z"
    },
    {
      url: "https://www.youtube.com/watch?v=ai_explainability_deep_dive",
      title: "Deep Dive into Explainable AI (XAI) for Financial Models",
      snippet: "A 45-minute video lecture covering SHAP values, LIME, and other post-hoc interpretation methods to ensure compliance and auditability in black-box machine learning systems.",
      similarity_to_kb: 0.8115,
      similarity_to_interest: 0.7505,
      source_interest_url: "https://seed-url.com/modern-backend-trends",
      crawled_at: "2025-11-21T14:30:00.000Z"
    },
    {
      url: "spotify.com/podcast/data_governance_podcast_ep12",
      title: "Podcast: The Future of Data Governance in a Decentralized World",
      snippet: "An episode discussing Data Mesh concepts, ownership boundaries, and how organizations are adapting to stricter privacy regulations like CCPA and GDPR with decentralized data planes.",
      similarity_to_kb: 0.7630,
      similarity_to_interest: 0.8876,
      source_interest_url: "https://seed-url.com/modern-backend-trends",
      crawled_at: "2025-11-22T08:15:00.000Z"
    },
    {
      url: "https://www.infoworld.com/article/3712345/quantum-computing-for-developers.html",
      title: "Quantum Computing: A Developer's Introduction to Qiskit",
      snippet: "An article providing practical examples of quantum circuits and algorithms, focusing on what developers can start learning today to prepare for the post-classical computing era.",
      similarity_to_kb: 0.7010,
      similarity_to_interest: 0.6950,
      source_interest_url: "https://seed-url.com/modern-backend-trends",
      crawled_at: "2025-11-23T09:00:00.000Z"
    }
  ],
  total_available: 4,
  filtered_count: 4,
  min_similarity_used: 0.7
};

// Mock IngestResponse Data
const MOCK_INGEST_RESPONSE: IngestResponse = {
  status: "success",
  interest_url: "https://seed-url.com/modern-backend-trends",
  crawled_count: 5,
  stored_path: "data/discoveries/demo_user/20251123_133642_b2b310ba.json",
  top_similarity_score: 0.9543
}

// Mock API Client
const mockApiClient = {
  listDiscoveries: async (userId: string, minSimilarity: number, limit: number): Promise<DiscoveryResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[MOCK] Fetching discoveries for user ${userId}...`);
    return MOCK_DISCOVERY_DATA;
  },
  ingestInterest: async (userId: string, payload: InterestPayload): Promise<IngestResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`[MOCK] Ingesting interest from ${payload.url}...`);
    return MOCK_INGEST_RESPONSE;
  }
}
// ======================================================================
// 2. COMPONENT LOGIC
// ----------------------------------------------------------------------

export function RecommendationsGrid() {
  const [discoveries, setDiscoveries] = useState<DiscoveryItem[]>([])
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'article' | 'podcast' | 'video'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [isIngesting, setIsIngesting] = useState(false)
  const [selectedSeed, setSelectedSeed] = useState<number | null>(null)

  const userId = 'demo_user' // In production, get from auth

  useEffect(() => {
    // NOTE: Using mockApiClient for isolated frontend testing
    loadDiscoveries()
  }, [])

  const loadDiscoveries = async () => {
    setIsLoading(true)
    try {
      // Replace apiClient with mockApiClient for testing
      const response = await mockApiClient.listDiscoveries(userId, 0.7, 20)
      setDiscoveries(response.discoveries)
    } catch (error: any) {
      // Silently fail on initial load
      console.error('Failed to load discoveries:', {
        message: error.message,
        status: error?.status,
        details: error?.details
      })
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

      // Replace apiClient with mockApiClient for testing
      const result = await mockApiClient.ingestInterest(userId, payload)

      toast.success('Discovery complete!', {
        description: `Found ${result.crawled_count} related articles`
      })

      // Fetch discoveries (will fetch MOCK_DISCOVERY_DATA)
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
    // Modified check to capture mock data format
    if (url.includes('googleusercontent.com/spotify.com') || url.includes('podcast')) return 'podcast'
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
        {isLoading ? (
          // Simple loading placeholder
          [...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse h-[350px] bg-card/50" />
          ))
        ) : (
          filteredDiscoveries.map((item) => (
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
                      <Clock className="inline h-3 w-3 mr-1" />
                      {new Date(item.crawled_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
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
          ))
        )}
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