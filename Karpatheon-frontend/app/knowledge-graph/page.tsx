import { KnowledgeGraphHeader } from '@/components/knowledge-graph-header'
import { KnowledgeGraphCanvas } from '@/components/knowledge-graph-canvas'
import { KnowledgeGraphSidebar } from '@/components/knowledge-graph-sidebar'

export default function KnowledgeGraphPage() {
  return (
    // 1. h-screen forces full viewport height
    <main className="flex h-screen flex-col bg-zinc-950 overflow-hidden">
      
      {/* Header stays at the top */}
      <KnowledgeGraphHeader />
      
      {/* Main Content Area */}
      <div className="relative flex flex-1 w-full overflow-hidden">
        
        {/* 2. The Canvas acts as the background layer for this section */}
        <div className="absolute inset-0 z-0">
          <KnowledgeGraphCanvas />
        </div>

        {/* 3. The Sidebar sits on top (z-10) or to the right. 
             If you want it to overlay the graph: */}
        <div className="pointer-events-none absolute inset-0 z-10 flex justify-end p-6">
           {/* Enable pointer events only on the actual sidebar content */}
           <div className="pointer-events-auto h-full">
             <KnowledgeGraphSidebar />
           </div>
        </div>

      </div>
    </main>
  )
}
