'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { Search, ZoomIn, ZoomOut, Maximize2, Lock, CheckCircle2, X, MoreHorizontal, Calendar, Clock } from 'lucide-react'

// --- Data Types ---
type NodeStatus = 'locked' | 'unlocked' | 'completed'

interface Node {
  id: string
  label: string
  category: string 
  level: number 
  row: number   
  status: NodeStatus
  size: number
}

interface Edge {
  from: string
  to: string
}

// --- Mock Data ---
const skillTreeNodes: Node[] = [
  // MATH (Middle Lane)
  { id: 'm1', label: 'Algebra Basics', category: 'Math', level: 0, row: 0, status: 'completed', size: 30 },
  { id: 'm2', label: 'Functions', category: 'Math', level: 1, row: 0, status: 'completed', size: 30 },
  { id: 'm3', label: 'Calculus I', category: 'Math', level: 2, row: 0, status: 'unlocked', size: 40 },
  { id: 'm4', label: 'Derivatives', category: 'Math', level: 3, row: -0.5, status: 'locked', size: 25 },
  { id: 'm5', label: 'Integrals', category: 'Math', level: 3, row: 0.5, status: 'locked', size: 25 },
  
  // MUSIC (Bottom Lane)
  { id: 'mu1', label: 'Music Theory I', category: 'Music', level: 0, row: 2, status: 'unlocked', size: 35 },
  { id: 'mu2', label: 'Scales & Modes', category: 'Music', level: 1, row: 2, status: 'locked', size: 25 },
  { id: 'mu3', label: 'Harmony', category: 'Music', level: 1, row: 3, status: 'locked', size: 25 },

  // FITNESS (Top Lane)
  { id: 'f1', label: 'Physiology', category: 'Fitness', level: 0, row: -2, status: 'completed', size: 30 },
  { id: 'f2', label: 'Hypertrophy', category: 'Fitness', level: 1, row: -2, status: 'completed', size: 30 },
  { id: 'f3', label: 'Nutrition', category: 'Fitness', level: 1, row: -3, status: 'unlocked', size: 35 },
]

const skillTreeEdges: Edge[] = [
  { from: 'm1', to: 'm2' }, { from: 'm2', to: 'm3' }, { from: 'm3', to: 'm4' }, { from: 'm3', to: 'm5' },
  { from: 'mu1', to: 'mu2' }, { from: 'mu1', to: 'mu3' },
  { from: 'f1', to: 'f2' }, { from: 'f1', to: 'f3' },
]

const LEVEL_SPACING = 250 
const ROW_SPACING = 150   

export function KnowledgeGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  const lastMousePos = useRef({ x: 0, y: 0 })
  const frameRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  // Initialize Nodes
  const processedNodes = useMemo(() => {
    return skillTreeNodes.map(node => ({
      ...node,
      baseX: (node.level * LEVEL_SPACING), 
      baseY: (node.row * ROW_SPACING),
      noiseX: Math.random() * 40 - 20,
      noiseY: Math.random() * 40 - 20,
      phase: Math.random() * Math.PI * 2,
      x: 0, 
      y: 0 
    }))
  }, [])

  // Initialize Stars
  const backgroundStars = useMemo(() => {
    return Array.from({ length: 150 }).map(() => ({
      x: Math.random() * 4000 - 2000,
      y: Math.random() * 4000 - 2000,
      size: Math.random() * 1.5,
      opacity: Math.random() * 0.5 + 0.1
    }))
  }, [])

  // Resize Handler
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height })
        }
    })
    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [])

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    ctx.scale(dpr, dpr)
    
    const render = () => {
      timeRef.current += 0.005 
      const { x: camX, y: camY, zoom } = camera

      // Clear (Dark Blue)
      ctx.fillStyle = '#09090b' // Zinc-950
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      const centerX = dimensions.width / 2
      const centerY = dimensions.height / 2

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.scale(zoom, zoom)
      ctx.translate(-centerX + camX, -centerY + camY)

      // Background Stars
      backgroundStars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Edges
      ctx.lineWidth = 2
      skillTreeEdges.forEach(edge => {
        const fromNode = processedNodes.find(n => n.id === edge.from)
        const toNode = processedNodes.find(n => n.id === edge.to)
        
        if (fromNode && toNode) {
          const fx = fromNode.baseX + fromNode.noiseX + Math.sin(timeRef.current + fromNode.phase) * 5
          const fy = fromNode.baseY + fromNode.noiseY + Math.cos(timeRef.current + fromNode.phase) * 5
          const tx = toNode.baseX + toNode.noiseX + Math.sin(timeRef.current + toNode.phase) * 5
          const ty = toNode.baseY + toNode.noiseY + Math.cos(timeRef.current + toNode.phase) * 5

          const isLocked = fromNode.status === 'locked' || toNode.status === 'locked'
          const grad = ctx.createLinearGradient(fx, fy, tx, ty)
          
          if (isLocked) {
             grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)')
             grad.addColorStop(1, 'rgba(255, 255, 255, 0.05)')
             ctx.setLineDash([5, 5])
          } else {
             grad.addColorStop(0, 'rgba(211, 168, 78, 0.4)')
             grad.addColorStop(1, 'rgba(100, 200, 255, 0.4)')
             ctx.setLineDash([])
          }

          ctx.strokeStyle = grad
          ctx.beginPath()
          ctx.moveTo(fx, fy)
          ctx.lineTo(tx, ty)
          ctx.stroke()
        }
      })

      // Nodes
      processedNodes.forEach(node => {
        node.x = node.baseX + node.noiseX + Math.sin(timeRef.current + node.phase) * 5
        node.y = node.baseY + node.noiseY + Math.cos(timeRef.current + node.phase) * 5

        const isSelected = selectedNode === node.id
        const isHovered = hoveredNode === node.id
        const isActive = isSelected || isHovered

        let coreColor = '#52525b' 
        let glowColor = 'rgba(255,255,255,0.05)'
        let glowSize = node.size * 2

        if (node.status === 'completed') {
          coreColor = '#FCD34D' 
          glowColor = 'rgba(251, 191, 36, 0.2)'
        } else if (node.status === 'unlocked') {
          coreColor = '#38bdf8' 
          glowColor = 'rgba(56, 189, 248, 0.2)'
        }

        if (isActive) {
           glowSize = node.size * 3
           glowColor = node.status === 'locked' ? 'rgba(255,255,255,0.1)' : glowColor.replace('0.2', '0.4')
        }

        // Glow
        ctx.globalCompositeOperation = 'screen'
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize)
        glow.addColorStop(0, glowColor)
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalCompositeOperation = 'source-over'

        // Core
        ctx.fillStyle = coreColor
        ctx.beginPath()
        ctx.arc(node.x, node.y, isActive ? node.size * 0.6 : node.size * 0.5, 0, Math.PI * 2)
        ctx.fill()

        // Text
        if (zoom > 0.6 || isActive) {
          ctx.font = `${isActive ? '600' : '500'} 12px Inter`
          ctx.fillStyle = isActive ? '#fff' : 'rgba(255,255,255,0.6)'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          ctx.fillText(node.label, node.x, node.y + node.size + 8)
          
          if (zoom > 1.2) {
            ctx.font = '400 10px Inter'
            ctx.fillStyle = 'rgba(255,255,255,0.4)'
            ctx.fillText(node.category.toUpperCase(), node.x, node.y + node.size + 24)
          }
        }
      })

      ctx.restore()
      frameRef.current = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(frameRef.current)
  }, [dimensions, camera, hoveredNode, selectedNode, backgroundStars, processedNodes])

  // --- Handlers ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y
      setCamera(prev => ({ ...prev, x: prev.x + dx / prev.zoom, y: prev.y + dy / prev.zoom }))
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      return 
    }

    const mouseX = (e.clientX - containerRef.current!.getBoundingClientRect().left - dimensions.width/2) / camera.zoom - camera.x + dimensions.width/2
    const mouseY = (e.clientY - containerRef.current!.getBoundingClientRect().top - dimensions.height/2) / camera.zoom - camera.y + dimensions.height/2

    let found = null
    for (let i = processedNodes.length - 1; i >= 0; i--) {
      const node = processedNodes[i]
      const dist = Math.hypot(mouseX - node.x, mouseY - node.y)
      if (dist < node.size + 15) {
        found = node.id
        break
      }
    }
    setHoveredNode(found)
    if (canvasRef.current) canvasRef.current.style.cursor = found ? 'pointer' : isDragging ? 'grabbing' : 'grab'
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (Math.abs(e.clientX - lastMousePos.current.x) > 5) return 
    if (hoveredNode) setSelectedNode(hoveredNode) // Keep selected if clicked again
  }

  const activeNodeData = processedNodes.find(n => n.id === selectedNode)

  return (
    <div ref={containerRef} className="relative h-full w-full bg-zinc-950 overflow-hidden select-none">
      
      {/* Search Bar */}
      <div className={`absolute left-6 top-6 z-10 transition-opacity duration-300 ${activeNodeData ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="group flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur-md hover:border-white/20">
          <Search className="h-4 w-4 text-zinc-400 group-hover:text-white" />
          <input placeholder="Search..." className="h-8 w-64 border-none bg-transparent text-sm text-zinc-100 focus:outline-none" />
        </div>
      </div>

      {/* Controls */}
      <div className={`absolute right-6 top-6 z-10 flex flex-col gap-2 transition-opacity duration-300 ${activeNodeData ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button onClick={() => setCamera(c => ({...c, zoom: Math.min(c.zoom + 0.2, 3)}))} className="p-2 rounded-xl border border-white/10 bg-black/40 text-zinc-400 hover:text-white"><ZoomIn className="h-4 w-4" /></button>
        <button onClick={() => setCamera(c => ({...c, zoom: Math.max(c.zoom - 0.2, 0.2)}))} className="p-2 rounded-xl border border-white/10 bg-black/40 text-zinc-400 hover:text-white"><ZoomOut className="h-4 w-4" /></button>
        <button onClick={() => setCamera({ x: 0, y: 0, zoom: 1 })} className="p-2 rounded-xl border border-white/10 bg-black/40 text-zinc-400 hover:text-white"><Maximize2 className="h-4 w-4" /></button>
      </div>

      {/* Canvas */}
      <canvas 
        ref={canvasRef} 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onWheel={(e) => {
          const newZoom = Math.max(0.2, Math.min(3, camera.zoom - e.deltaY * 0.001))
          setCamera(prev => ({ ...prev, zoom: newZoom }))
        }}
        onClick={handleClick}
        className="block"
        style={{ width: dimensions.width, height: dimensions.height }}
      />

      {/* --- FULL SCREEN NOTE OVERLAY --- */}
      {activeNodeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          
          {/* Note Card */}
          <div className="relative h-[90vh] w-[90vw] max-w-5xl flex flex-col rounded-3xl border border-white/10 bg-zinc-900/95 shadow-2xl animate-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-amber-400">
                   {activeNodeData.status === 'completed' ? <CheckCircle2 /> : <div className="h-4 w-4 rounded-full bg-current shadow-[0_0_10px_currentColor]"/>}
                </div>
                <div>
                   <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                      {activeNodeData.category}
                      <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
                      <span>Level {activeNodeData.level}</span>
                   </div>
                   <h2 className="text-2xl font-bold text-white">{activeNodeData.label}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <button className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"><MoreHorizontal /></button>
                 <button 
                    onClick={() => setSelectedNode(null)} 
                    className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                 </button>
              </div>
            </div>

            {/* Editor Area (Placeholder) */}
            <div className="flex-1 overflow-y-auto p-8">
               <div className="mx-auto max-w-3xl space-y-8">
                  {/* Meta Data */}
                  <div className="flex gap-6 text-sm text-zinc-400">
                     <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Created Today</div>
                     <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> 15 min read</div>
                  </div>

                  {/* Title Input */}
                  <input 
                    type="text" 
                    defaultValue={`Notes on ${activeNodeData.label}`}
                    className="w-full bg-transparent text-4xl font-bold text-white placeholder:text-zinc-700 focus:outline-none"
                  />
                  
                  {/* Content Placeholder */}
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-zinc-300 leading-relaxed">
                       Start typing your thoughts here. This node is currently 
                       <span className="font-bold text-amber-400"> {activeNodeData.status}</span>. 
                       Connecting ideas allows you to build a stronger constellation of knowledge.
                    </p>
                    <div className="h-4"></div>
                    <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                       <li>Key Concept 1: [Waiting for input...]</li>
                       <li>Key Concept 2: [Waiting for input...]</li>
                       <li>Key Concept 3: [Waiting for input...]</li>
                    </ul>
                  </div>
               </div>
            </div>

            {/* Footer / Action Bar */}
            <div className="border-t border-white/10 p-4 flex justify-between items-center bg-zinc-900/50 rounded-b-3xl">
               <span className="text-xs text-zinc-500">Last edited just now</span>
               <button className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black hover:bg-zinc-200">
                  Save Note
               </button>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}