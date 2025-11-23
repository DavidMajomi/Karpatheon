'use client'

import { Brain, ExternalLink, BookMarked, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SearchResponse } from '@/lib/types'

interface SearchResultsProps {
  results: SearchResponse
}

export function SearchResults({ results }: SearchResultsProps) {
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
                Karpatheon Insight
              </h3>
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
                Powered by Exa
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              Your query "{results.original_query}" was refined to "{results.refined_query}"
              for optimal search results. I've found {results.results.length} highly relevant sources.
            </p>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found <span className="font-semibold text-foreground">{results.results.length}</span> highly relevant results
        </p>
        <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
          <TrendingUp className="mr-2 h-4 w-4" />
          View Learning Timeline
        </Button>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {results.results.map((result, index) => (
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
                  </div>
                  <h3 className="font-serif text-xl font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {result.title}
                  </h3>
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
                  onClick={() => window.open(result.url, '_blank')}
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
