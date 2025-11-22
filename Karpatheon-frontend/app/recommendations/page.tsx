'use client'

import { RecommendationsHeader } from '@/components/recommendations-header'
import { RecommendationsGrid } from '@/components/recommendations-grid'
import { RecommendationsSidebar } from '@/components/recommendations-sidebar'

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <RecommendationsHeader />
      
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
                Curated For You
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Handpicked content that grows with your curiosity
              </p>
            </div>
            
            <RecommendationsGrid />
          </div>
          
          <RecommendationsSidebar />
        </div>
      </main>
    </div>
  )
}
