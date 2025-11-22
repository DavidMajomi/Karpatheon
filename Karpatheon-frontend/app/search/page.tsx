import { SearchInterface } from '@/components/search-interface'
import { SearchHeader } from '@/components/search-header'
import { SearchInsights } from '@/components/search-insights'

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <SearchHeader />
      <SearchInterface />
      <SearchInsights />
    </main>
  )
}
