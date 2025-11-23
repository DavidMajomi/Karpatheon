import { SearchInterface } from '@/components/search-interface'
import { AppHeader } from '@/components/app-header'
import { SearchInsights } from '@/components/search-insights'

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <AppHeader />
      <SearchInterface />
      <SearchInsights />
    </main>
  )
}
