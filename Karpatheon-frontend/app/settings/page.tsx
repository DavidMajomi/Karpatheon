import { AppHeader } from '@/components/app-header'
import { SettingsNav } from '@/components/settings-nav'
import { RecommendationsSettings } from '@/components/recommendations-settings'

export default function SettingsPage() {
  return (
    <main className="flex h-screen flex-col bg-background">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <SettingsNav />
        <RecommendationsSettings />
      </div>
    </main>
  )
}
