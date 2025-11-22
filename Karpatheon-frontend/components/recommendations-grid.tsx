'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Bookmark, BookmarkCheck, Clock, TrendingUp, Sparkles } from 'lucide-react'

const recommendations = [
  {
    id: 1,
    type: 'article',
    title: 'The Emergence of Superintelligent Systems',
    source: 'MIT Technology Review',
    description: 'A deep dive into how AGI could fundamentally reshape human civilization within the next decade.',
    url: 'https://example.com',
    readTime: '12 min',
    matchScore: 98,
    topics: ['AI', 'Future Tech', 'Philosophy'],
    image: '/abstract-ai-neural-network.jpg',
    published: '2 days ago'
  },
  {
    id: 2,
    type: 'podcast',
    title: 'Building Resilient Organizations in Chaos',
    source: 'Masters of Scale',
    description: 'Reid Hoffman interviews top CEOs about navigating uncertainty and building antifragile companies.',
    url: 'https://example.com',
    readTime: '45 min',
    matchScore: 96,
    topics: ['Leadership', 'Business Strategy'],
    image: '/business-leadership-abstract.jpg',
    published: '1 day ago'
  },
  {
    id: 3,
    type: 'article',
    title: 'Quantum Computing Reaches Practical Milestone',
    source: 'Nature',
    description: 'New breakthrough in error correction brings quantum advantage closer to commercial reality.',
    url: 'https://example.com',
    readTime: '8 min',
    matchScore: 94,
    topics: ['Quantum Computing', 'Science'],
    image: '/quantum-computer-abstract.jpg',
    published: '5 hours ago'
  },
  {
    id: 4,
    type: 'video',
    title: 'The Architecture of Exceptional Products',
    source: 'Y Combinator',
    description: 'Product leaders from Stripe, Figma, and Notion discuss their design philosophy and execution frameworks.',
    url: 'https://example.com',
    readTime: '28 min',
    matchScore: 93,
    topics: ['Product Design', 'Startups'],
    image: '/minimal-product-design.png',
    published: '1 week ago'
  },
  {
    id: 5,
    type: 'article',
    title: 'The Psychology of Peak Performance',
    source: 'Harvard Business Review',
    description: 'Research-backed strategies elite performers use to maintain cognitive excellence under pressure.',
    url: 'https://example.com',
    readTime: '15 min',
    matchScore: 92,
    topics: ['Psychology', 'Performance'],
    image: '/brain-performance-abstract.jpg',
    published: '3 days ago'
  },
  {
    id: 6,
    type: 'podcast',
    title: 'The Future of Work and Human Purpose',
    source: 'Ezra Klein Show',
    description: 'Exploring how AI automation will transform labor, meaning, and human identity in the 21st century.',
    url: 'https://example.com',
    readTime: '52 min',
    matchScore: 91,
    topics: ['Future of Work', 'AI', 'Society'],
    image: '/future-work-abstract.jpg',
    published: '2 days ago'
  }
]

export function RecommendationsGrid() {
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<'all' | 'article' | 'podcast' | 'video'>('all')

  const toggleSave = (id: number) => {
    setSavedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filteredRecommendations = filter === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.type === filter)

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
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

      {/* Recommendations Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredRecommendations.map((item) => (
          <Card 
            key={item.id} 
            className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={item.image || "/placeholder.svg"} 
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              
              {/* Match Score Badge */}
              <div className="absolute right-3 top-3">
                <Badge className="gap-1 bg-primary/90 text-primary-foreground backdrop-blur">
                  <Sparkles className="h-3 w-3" />
                  {item.matchScore}% match
                </Badge>
              </div>

              {/* Type Badge */}
              <div className="absolute left-3 top-3">
                <Badge variant="secondary" className="capitalize backdrop-blur">
                  {item.type}
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
                    {item.source} • {item.published}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSave(item.id)}
                  className="shrink-0 text-muted-foreground hover:text-primary"
                >
                  {savedItems.has(item.id) ? (
                    <BookmarkCheck className="h-5 w-5 fill-primary text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>

              <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {item.topics.map((topic) => (
                    <Badge 
                      key={topic} 
                      variant="outline" 
                      className="text-xs font-normal"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {item.readTime}
                  </span>
                  <Button size="sm" variant="ghost" className="gap-2">
                    View
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
