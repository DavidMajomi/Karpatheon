import { PersonalityHeader } from '@/components/personality-header'
import { PersonalityProfile } from '@/components/personality-profile'
import { PersonalityInsights } from '@/components/personality-insights'
import { PersonalityNotes } from '@/components/personality-notes'
import { PersonalityTraitsSidebar } from '@/components/personality-traits-sidebar'

export default function PersonalityPage() {
  return (
    <main className="flex h-screen flex-col bg-background/95 overflow-hidden">
      <PersonalityHeader />

      <div className="flex-1 overflow-hidden p-4">
        <div className="mx-auto grid h-full max-w-[1920px] grid-cols-12 gap-4">
          {/* Left Column - Traits / Sources */}
          <div className="col-span-3 h-full overflow-hidden">
            <PersonalityTraitsSidebar />
          </div>

          {/* Middle Column - Main Content */}
          <div className="col-span-6 h-full overflow-y-auto rounded-2xl border border-border/50 bg-background shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="p-8 space-y-8">
              <PersonalityProfile />
              <PersonalityInsights />
            </div>
          </div>

          {/* Right Column - Notes */}
          <div className="col-span-3 h-full overflow-hidden">
            <PersonalityNotes className="h-full" />
          </div>
        </div>
      </div>
    </main>
  )
}
