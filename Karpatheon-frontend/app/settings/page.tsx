import { SettingsHeader } from '@/components/settings-header'
import { SettingsNav } from '@/components/settings-nav'
import { RecommendationsSettings } from '@/components/recommendations-settings'

export default function SettingsPage() {
  return (
    <main className="flex h-screen flex-col bg-background">
      <SettingsHeader />
      <div className="flex flex-1 overflow-hidden">
        <SettingsNav />
        <RecommendationsSettings />
      </div>
    </main>
  )
}
