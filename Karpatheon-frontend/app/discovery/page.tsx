import { DiscoveryInterface } from '@/components/discovery-interface'
import { AppHeader } from '@/components/app-header'

export default function DiscoveryPage() {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background">
            <AppHeader />
            <main className="flex-1 overflow-auto">
                <DiscoveryInterface />
            </main>
        </div>
    )
}
