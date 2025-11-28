'use client'

import { useState } from 'react'
import { Search, Sparkles, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchResults } from '@/components/search-results'
import { apiClient } from '@/lib/api-client'
import type { SearchResponse } from '@/lib/types'
import { toast } from 'sonner'

export function SearchInterface() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsSearching(true)
      setSearchResults(null)

      try {
        const results = await apiClient.search({ query })
        setSearchResults(results)
        toast.success('Search completed', {
          description: `Found ${results.results.length} results`,
        })
      } catch (error: any) {
        // Check if it's a network error
        const isNetworkError = !error.status || error.message?.includes('Network') || error.message?.includes('fetch')

        if (isNetworkError) {
          toast.error('Cannot reach backend', {
            description: 'Please ensure the backend server is running at ' + (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'),
          })
        } else {
          toast.error('Search failed', {
            description: error.message || 'An unexpected error occurred. Please try again.',
          })
        }
      } finally {
        setIsSearching(false)
      }
    }
  }

  const suggestions = [
    { icon: TrendingUp, text: 'AI developments in 2025', category: 'Trending' },
    { icon: Clock, text: 'Quantum computing breakthroughs', category: 'Recent' },
    { icon: Sparkles, text: 'Leadership frameworks', category: 'Suggested' },
  ]

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Search Input */}
      <div className="mb-12">
        <form onSubmit={handleSearch} className="relative">
          <div className="group relative">
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute left-5 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything..."
              className="w-full rounded-xl border border-border bg-card px-14 py-5 text-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {query && (
              <Button
                type="submit"
                disabled={isSearching}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSearching ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  'Search'
                )}
              </Button>
            )}
          </div>
        </form>

        {/* Growth Indicator */}
        {!searchResults && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Karpatheon learns from every search to serve you better</span>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults && <SearchResults results={searchResults} />}

      {/* Suggestions */}
      {!searchResults && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-serif text-sm text-muted-foreground">Suggested Searches</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-3">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon
              return (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion.text)}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:bg-card/80"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground group-hover:text-primary transition-colors">
                      {suggestion.text}
                    </p>
                    <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                  </div>
                  <Search className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
