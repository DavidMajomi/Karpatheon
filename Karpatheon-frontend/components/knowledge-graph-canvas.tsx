'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { Search, ZoomIn, ZoomOut, Maximize2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Types
interface Node {
  id: string
  label: string
  x: number
  y: number
  baseX: number // original position for floating reference
  baseY: number
  size: number
  connections: number
  group: 'core' | 'secondary'
  phase: number // for random animation timing
}

interface Edge {
  from: string
  to: string
}

// Enhanced Sample Data with groups
const initialNodes: Omit<Node, 'baseX' | 'baseY' | 'phase'>[] = [
  { id: 'ai', label: 'Artificial Intelligence', x: 400, y: 300, size: 40, connections: 12, group: 'core' },
  { id: 'ml', label: 'Machine Learning', x: 300, y: 200, size: 30, connections: 8, group: 'core' },
  { id: 'dl', label: 'Deep Learning', x: 500, y: 200, size: 25, connections: 6, group: 'secondary' },
  { id: 'nlp', label: 'NLP', x: 250, y: 350, size: 22, connections: 5, group: 'secondary' },
  { id: 'cv', label: 'Computer Vision', x: 550, y: 350, size: 22, connections: 5, group: 'secondary' },
  { id: 'rl', label: 'Reinforcement Learning', x: 400, y: 450, size: 20, connections: 4, group: 'secondary' },
  { id: 'nn', label: 'Neural Networks', x: 600, y: 250, size: 20, connections: 7, group: 'secondary' },
  { id: 'transformers', label: 'Transformers', x: 200, y: 280, size: 24, connections: 6, group: 'secondary' },
]

// Prepare data with animation properties
const graphData = {
  nodes: initialNodes.map(n => ({
    ...n,
    baseX: n.x,
    baseY: n.y,
    phase: Math.random() * Math.PI * 2
  })),
  edges: [
    { from: 'ai', to: 'ml' }, { from: 'ai', to: 'dl' }, { from: 'ai', to: 'nlp' },
    { from: 'ai', to: 'cv' }, { from: 'ml', to: 'dl' }, { from: 'ml', to: 'rl' },
    { from: 'dl', to: 'nn' }, { from: 'dl', to: 'cv' }, { from: 'nlp', to: 'transformers' },
    { from: 'transformers', to: 'ml' },
  ]
}

export function KnowledgeGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  
  // Animation ref
  const frameRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  // Generate static background stars once
  const backgroundStars = useMemo(() => {
    return Array.from({ length: 100 }).map(() => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 2000 - 1000,
      size: Math.random() * 1.5,
      opacity: Math.random() * 0.5 + 0.1
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = container.offsetWidth * window.devicePixelRatio
      canvas.height = container.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      
      // Update canvas style size for clarity
      canvas.style.width = `${container.offsetWidth}px`
      canvas.style.height = `${container.offsetHeight}px`
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const render = () => {
      timeRef.current += 0.005 // Animation speed
      
      // Clear with dark void color
      ctx.fillStyle = '#09090b' // Zinc-950 (Tailwind dark bg)
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const width = container.offsetWidth
      const height = container.offsetHeight

      ctx.save()
      
      // Center and Zoom
      ctx.translate(width / 2, height / 2)
      ctx.scale(zoom, zoom)
      ctx.translate(-width / 2, -height / 2)

      // 1. Draw Background Stars (Parallax feeling)
      backgroundStars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x + width/2, star.y + height/2, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // 2. Draw Edges
      ctx.lineWidth = 1
      graphData.edges.forEach(edge => {
        const fromNode = graphData.nodes.find(n => n.id === edge.from)
        const toNode = graphData.nodes.find(n => n.id === edge.to)
        
        if (fromNode && toNode) {
          // Floating positions
          const fx = fromNode.baseX + Math.sin(timeRef.current + fromNode.phase) * 5
          const fy = fromNode.baseY + Math.cos(timeRef.current + fromNode.phase) * 5
          const tx = toNode.baseX + Math.sin(timeRef.current + toNode.phase) * 5
          const ty = toNode.baseY + Math.cos(timeRef.current + toNode.phase) * 5

          // Highlight connections if node is hovered/selected
          const isConnected = 
            hoveredNode === fromNode.id || hoveredNode === toNode.id ||
            selectedNode === fromNode.id || selectedNode === toNode.id

          const opacity = isConnected ? 0.6 : 0.15
          
          // Gradient Line
          const grad = ctx.createLinearGradient(fx, fy, tx, ty)
          grad.addColorStop(0, `rgba(211, 168, 78, ${opacity})`)
          grad.addColorStop(1, `rgba(100, 200, 255, ${opacity})`)
          
          ctx.strokeStyle = grad
          ctx.beginPath()
          ctx.moveTo(fx, fy)
          ctx.lineTo(tx, ty)
          ctx.stroke()
        }
      })

      // 3. Draw Nodes (The Stars)
      graphData.nodes.forEach(node => {
        // Calculate floating position
        const x = node.baseX + Math.sin(timeRef.current + node.phase) * 5
        const y = node.baseY + Math.cos(timeRef.current + node.phase) * 5
        
        // Update live position for click detection
        node.x = x
        node.y = y

        const isSelected = selectedNode === node.id
        const isHovered = hoveredNode === node.id
        const isActive = isSelected || isHovered

        // GLOW EFFECT (Additive Blending)
        ctx.globalCompositeOperation = 'screen' 
        
        // Outer Atmosphere
        const glowRadius = node.size * (isActive ? 3 : 2)
        const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, glowRadius)
        glowGrad.addColorStop(0, isSelected ? 'rgba(211, 168, 78, 0.4)' : 'rgba(100, 200, 255, 0.15)')
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)')
        
        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Core Star
        ctx.globalCompositeOperation = 'source-over' // Reset blending
        
        const coreRadius = isActive ? node.size * 0.6 : node.size * 0.4
        ctx.fillStyle = isSelected ? '#FCD34D' : '#e0f2fe' // Amber vs Sky Blue
        ctx.beginPath()
        ctx.arc(x, y, coreRadius, 0, Math.PI * 2)
        ctx.fill()

        // Inner white hot center
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(x, y, coreRadius * 0.4, 0, Math.PI * 2)
        ctx.fill()

        // Rings for Core nodes
        if (node.group === 'core' || isActive) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${isActive ? 0.3 : 0.1})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(x, y, node.size * 0.8, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Labels
        if (zoom > 0.8 || isActive) {
          ctx.fillStyle = isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'
          ctx.font = `${isActive ? '600' : '400'} ${isActive ? 14 : 12}px 'Inter', sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(node.label, x, y + node.size + 15)
        }
      })

      ctx.restore()
      frameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [zoom, selectedNode, hoveredNode, backgroundStars])

  // Event Handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    // Calculate mouse position relative to canvas center and zoom
    const mouseX = (e.clientX - rect.left - rect.width / 2) / zoom + rect.width / 2
    const mouseY = (e.clientY - rect.top - rect.height / 2) / zoom + rect.height / 2

    let found = null
    for (const node of graphData.nodes) {
      // Simple distance check (using slightly larger hit area than visual size)
      const dist = Math.hypot(mouseX - node.x, mouseY - node.y)
      if (dist < node.size + 10) {
        found = node.id
        break
      }
    }
    setHoveredNode(found)
    canvas.style.cursor = found ? 'pointer' : 'default'
  }

  const handleClick = () => {
    if (hoveredNode) setSelectedNode(hoveredNode === selectedNode ? null : hoveredNode)
    else setSelectedNode(null)
  }

  return (
    <div ref={containerRef} className="relative h-full w-full bg-zinc-950 overflow-hidden">
      
      {/* Top Left: Search Bar with Glassmorphism */}
      <div className="absolute left-6 top-6 z-10 flex flex-col gap-2">
        <div className="group flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur-md transition-all hover:border-white/20 hover:bg-black/60">
          <Search className="h-4 w-4 text-zinc-400 group-hover:text-white" />
          <Input 
            placeholder="Search constellation..." 
            className="h-8 w-64 border-0 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Top Right: Controls */}
      <div className="absolute right-6 top-6 z-10 flex flex-col gap-2">
        {[
          { icon: ZoomIn, action: () => setZoom(z => Math.min(z + 0.2, 3)) },
          { icon: ZoomOut, action: () => setZoom(z => Math.max(z - 0.2, 0.5)) },
          { icon: Maximize2, action: () => setZoom(1) }
        ].map((btn, i) => (
          <Button 
            key={i}
            size="icon" 
            variant="ghost"
            onClick={btn.action}
            className="h-10 w-10 rounded-xl border border-white/10 bg-black/40 text-zinc-400 backdrop-blur-md hover:bg-white/10 hover:text-white"
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Canvas Layer */}
      <canvas 
        ref={canvasRef} 
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="block h-full w-full touch-none"
      />

      {/* Bottom Left: Status / Legend */}
      <div className="absolute bottom-6 left-6 flex gap-4">
        <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3 text-xs font-medium text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span>Live Node</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              <span>Selected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}