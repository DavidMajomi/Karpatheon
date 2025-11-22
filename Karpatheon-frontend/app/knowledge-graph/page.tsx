import { KnowledgeGraphHeader } from '@/components/knowledge-graph-header'
import { KnowledgeGraphCanvas } from '@/components/knowledge-graph-canvas'
import { KnowledgeGraphSidebar } from '@/components/knowledge-graph-sidebar'

export default function KnowledgeGraphPage() {
  return (
    <main className="flex h-screen flex-col bg-background">
      <KnowledgeGraphHeader />
      <div className="flex flex-1 overflow-hidden">
        <KnowledgeGraphCanvas />
        <KnowledgeGraphSidebar />
      </div>
    </main>
  )
}
