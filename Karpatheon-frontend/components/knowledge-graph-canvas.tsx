'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { Search, ZoomIn, ZoomOut, Maximize2, Lock, CheckCircle2, PlayCircle, X } from 'lucide-react'

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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 }) // Track explicit size
  
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

  // 1. ROBUST RESIZE HANDLER (ResizeObserver)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const { width, height } = entry.contentRect
            setDimensions({ width, height })
        }
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [])

  // 2. MAIN RENDER LOOP
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set Canvas Size exactly to container
    const dpr = window.devicePixelRatio || 1
    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    ctx.scale(dpr, dpr)
    
    // Log once to prove we are starting
    console.log("Starting Canvas Render. Size:", dimensions.width, dimensions.height)

    const render = () => {
      timeRef.current += 0.005 
      const { x: camX, y: camY, zoom } = camera

      // Clear Screen (Dark Blue to prove it's drawing)
      ctx.fillStyle = '#0f172a' // Slate-950 (Dark Blue)
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      const centerX = dimensions.width / 2
      const centerY = dimensions.height / 2

      ctx.save()
      
      // Camera Transform
      ctx.translate(centerX, centerY)
      ctx.scale(zoom, zoom)
      ctx.translate(-centerX + camX, -centerY + camY)

      // Stars
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
          ctx.font = `${isActive ? '600' : '500'} 12px Inter, sans-serif`
          ctx.fillStyle = isActive ? '#fff' : 'rgba(255,255,255,0.6)'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          ctx.fillText(node.label, node.x, node.y + node.size + 8)
          
          if (zoom > 1.2) {
            ctx.font = '400 10px Inter, sans-serif'
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
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y
      setCamera(prev => ({ ...prev, x: prev.x + dx / prev.zoom, y: prev.y + dy / prev.zoom }))
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      return 
    }

    // Hit Test with explicit dimensions
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

  const handleWheel = (e: React.WheelEvent) => {
    const zoomSensitivity = 0.001
    const newZoom = Math.max(0.2, Math.min(3, camera.zoom - e.deltaY * zoomSensitivity))
    setCamera(prev => ({ ...prev, zoom: newZoom }))
  }

  const handleClick = (e: React.MouseEvent) => {
    if (Math.abs(e.clientX - lastMousePos.current.x) > 5) return 
    if (hoveredNode) setSelectedNode(hoveredNode === selectedNode ? null : hoveredNode)
    else setSelectedNode(null)
  }

  const activeNodeData = processedNodes.find(n => n.id === selectedNode)

  return (
    <div ref={containerRef} className="relative h-full w-full bg-slate-950 overflow-hidden select-none">
      
      {/* Search Bar */}
      <div className="absolute left-6 top-6 z-10">
        <div className="group flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur-md hover:border-white/20">
          <Search className="h-4 w-4 text-zinc-400 group-hover:text-white" />
          <input placeholder="Search..." className="h-8 w-64 border-none bg-transparent text-sm text-zinc-100 focus:outline-none" />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-6 top-6 z-10 flex flex-col gap-2">
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
        onWheel={handleWheel}
        onClick={handleClick}
        className="block"
        style={{ width: dimensions.width, height: dimensions.height }}
      />

      {/* Active Node Info */}
      {activeNodeData && (
        <div className="absolute right-6 bottom-6 w-80 rounded-xl border border-white/10 bg-black/80 p-5 backdrop-blur-xl">
          <div className="flex justify-between items-start">
             <div>
                <span className="text-xs uppercase text-zinc-400">{activeNodeData.category}</span>
                <h3 className="text-lg font-bold text-white">{activeNodeData.label}</h3>
             </div>
             <button onClick={() => setSelectedNode(null)}><X className="text-white h-5 w-5"/></button>
          </div>
          <button className="mt-4 w-full bg-white text-black py-2 rounded-lg font-bold flex items-center justify-center gap-2">
             <PlayCircle className="h-4 w-4" /> Open Note
          </button>
        </div>
      )}
    </div>
  )
}