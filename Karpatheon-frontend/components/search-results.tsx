'use client'

import { Brain, ExternalLink, BookMarked, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  // Mock results - in real app, this would come from API
  const results = [
    {
      title: 'Understanding the Neural Architecture Behind Modern AI Systems',
      url: 'research.pantheon.ai',
      snippet: 'Deep dive into transformer architectures and their evolution. This comprehensive analysis explores the mathematical foundations and practical implementations...',
      relevance: 98,
      source: 'Research Paper',
    },
    {
      title: 'AI Ethics Framework for Enterprise Leaders',
      url: 'insights.pantheon.ai',
      snippet: 'A practical guide for CEOs navigating AI implementation in organizations. Covers governance, risk management, and ethical considerations...',
      relevance: 95,
      source: 'Expert Analysis',
    },
    {
      title: 'The Future of Human-AI Collaboration in Creative Industries',
      url: 'trends.pantheon.ai',
      snippet: 'Exploring how artificial intelligence is reshaping creative workflows without replacing human ingenuity. Case studies from leading tech companies...',
      relevance: 92,
      source: 'Industry Report',
    },
  ]

  return (
    <div className="space-y-8">
      {/* AI Insight Banner */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 ring-1 ring-accent/30">
            <Brain className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Pantheon Insight
              </h3>
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
                Personalized
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              Based on your search patterns, I've noticed you're exploring {query}. 
              I've prioritized sources from peer-reviewed research and enterprise case studies, 
              which align with your previous interests in strategic decision-making and innovation.
            </p>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found <span className="font-semibold text-foreground">{results.length}</span> highly relevant results
        </p>
        <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
          <TrendingUp className="mr-2 h-4 w-4" />
          View Learning Timeline
        </Button>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <article
            key={index}
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{result.url}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {result.source}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {result.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 ring-1 ring-primary/20">
                  <span className="text-xs font-semibold text-primary">{result.relevance}%</span>
                </div>
              </div>

              {/* Snippet */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {result.snippet}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-primary hover:text-primary/80"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <BookMarked className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
