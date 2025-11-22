import { AssistantHeader } from '@/components/assistant-header'
import { AssistantChat } from '@/components/assistant-chat'
import { AssistantSidebar } from '@/components/assistant-sidebar'

export default function AssistantPage() {
  return (
    <main className="flex h-screen flex-col bg-background">
      <AssistantHeader />
      <div className="flex flex-1 overflow-hidden">
        <AssistantChat />
        <AssistantSidebar />
      </div>
    </main>
  )
}
