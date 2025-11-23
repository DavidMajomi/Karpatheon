'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, TrendingUp, ExternalLink, Clock, Zap } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { SEED_URLS, createInterestPayload } from '@/lib/seed-urls'
import { toast } from 'sonner'
import type { DiscoveryItem } from '@/lib/types'
import Image from 'next/image'

export function DiscoveryInterface() {
    const [discoveries, setDiscoveries] = useState<DiscoveryItem[]>([])
    const [isIngesting, setIsIngesting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedSeed, setSelectedSeed] = useState<number | null>(null)

    const userId = 'demo_user' // In production, get from auth

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

    const loadDiscoveries = async () => {
        setIsLoading(true)
        try {
            const response = await apiClient.listDiscoveries(userId, 0.7, 20)
            setDiscoveries(response.discoveries)
        } catch (error: any) {
            toast.error('Failed to load discoveries')
        } finally {
            setIsLoading(false)
        }
    }

    // Generate placeholder image URL based on title
    const getImageUrl = (title: string) => {
        const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return `https://picsum.photos/seed/${seed}/400/250`
    }

    return (
        <div className="container mx-auto max-w-7xl p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-8 w-8 text-primary" />
                    <h1 className="font-serif text-4xl font-bold">Curated For You</h1>
                </div>
                <p className="text-muted-foreground">
                    Handpicked content that grows with your curiosity
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex items-center gap-4 border-b">
                <button className="border-b-2 border-primary pb-2 font-medium text-primary">
                    All Content
                </button>
                <button className="pb-2 text-muted-foreground hover:text-foreground">
                    Articles
                </button>
                <button className="pb-2 text-muted-foreground hover:text-foreground">
                    Podcasts
                </button>
                <button className="pb-2 text-muted-foreground hover:text-foreground">
                    Videos
                </button>
            </div>

            {/* Seed Interests - Compact Pills */}
            <div className="mb-8">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Seed Interests
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

            {/* Discoveries Grid - Beautiful Cards */}
            {discoveries.length > 0 && (
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Trending in Your Graph
                        </h2>
                        <Badge variant="secondary" className="rounded-full">
                            <Zap className="mr-1 h-3 w-3" />
                            {discoveries.length} new items
                        </Badge>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {discoveries.map((item, index) => (
                            <Card
                                key={index}
                                className="group overflow-hidden border-0 bg-card shadow-sm transition-all hover:shadow-lg"
                            >
                                {/* Image */}
                                <div className="relative aspect-video overflow-hidden bg-muted">
                                    <Image
                                        src={getImageUrl(item.title)}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* Match Badge */}
                                    <div className="absolute right-3 top-3">
                                        <Badge
                                            className="rounded-full bg-primary/90 text-xs font-semibold backdrop-blur-sm"
                                        >
                                            {(item.similarity_to_kb * 100).toFixed(0)}% match
                                        </Badge>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    {/* Metadata */}
                                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="rounded-full">
                                            Article
                                        </Badge>
                                        <span>•</span>
                                        <Clock className="h-3 w-3" />
                                        <span>
                                            {new Date(item.crawled_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="mb-2 font-serif text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                                        {item.snippet}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Sparkles className="h-3 w-3 text-accent" />
                                                <span>Interest: {(item.similarity_to_interest * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(item.url, '_blank')}
                                            className="gap-1"
                                        >
                                            View
                                            <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

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
