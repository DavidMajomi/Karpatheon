import { PersonalityHeader } from '@/components/personality-header'
import { PersonalityProfile } from '@/components/personality-profile'
import { PersonalityInsights } from '@/components/personality-insights'

export default function PersonalityPage() {
  return (
    <main className="min-h-screen bg-background">
      <PersonalityHeader />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">Your Learning Personality</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pantheon analyzes your exploration patterns, questioning style, and knowledge connections to create a personalized learning profile.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PersonalityProfile />
          </div>
          <div>
            <PersonalityInsights />
          </div>
        </div>
      </div>
    </main>
  )
}
