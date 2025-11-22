'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Sample knowledge graph data
const graphData = {
  nodes: [
    { id: 'ai', label: 'Artificial Intelligence', x: 400, y: 300, size: 50, connections: 12 },
    { id: 'ml', label: 'Machine Learning', x: 300, y: 200, size: 40, connections: 8 },
    { id: 'dl', label: 'Deep Learning', x: 500, y: 200, size: 35, connections: 6 },
    { id: 'nlp', label: 'Natural Language Processing', x: 250, y: 350, size: 30, connections: 5 },
    { id: 'cv', label: 'Computer Vision', x: 550, y: 350, size: 30, connections: 5 },
    { id: 'rl', label: 'Reinforcement Learning', x: 400, y: 450, size: 25, connections: 4 },
    { id: 'nn', label: 'Neural Networks', x: 600, y: 250, size: 28, connections: 7 },
    { id: 'transformers', label: 'Transformers', x: 200, y: 280, size: 32, connections: 6 },
  ],
  edges: [
    { from: 'ai', to: 'ml' },
    { from: 'ai', to: 'dl' },
    { from: 'ai', to: 'nlp' },
    { from: 'ai', to: 'cv' },
    { from: 'ml', to: 'dl' },
    { from: 'ml', to: 'rl' },
    { from: 'dl', to: 'nn' },
    { from: 'dl', to: 'cv' },
    { from: 'nlp', to: 'transformers' },
    { from: 'transformers', to: 'ml' },
  ],
}

export function KnowledgeGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      // Apply zoom
      ctx.save()
      ctx.translate(canvas.offsetWidth / 2, canvas.offsetHeight / 2)
      ctx.scale(zoom, zoom)
      ctx.translate(-canvas.offsetWidth / 2, -canvas.offsetHeight / 2)

      // Draw edges
      ctx.strokeStyle = 'rgba(211, 168, 78, 0.2)'
      ctx.lineWidth = 2
      graphData.edges.forEach(edge => {
        const fromNode = graphData.nodes.find(n => n.id === edge.from)
        const toNode = graphData.nodes.find(n => n.id === edge.to)
        if (fromNode && toNode) {
          ctx.beginPath()
          ctx.moveTo(fromNode.x, fromNode.y)
          ctx.lineTo(toNode.x, toNode.y)
          ctx.stroke()
        }
      })

      // Draw nodes
      graphData.nodes.forEach(node => {
        const isSelected = selectedNode === node.id
        
        // Outer glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size)
        gradient.addColorStop(0, isSelected ? 'rgba(211, 168, 78, 0.3)' : 'rgba(211, 168, 78, 0.15)')
        gradient.addColorStop(1, 'rgba(211, 168, 78, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size * 1.5, 0, Math.PI * 2)
        ctx.fill()

        // Node circle
        ctx.fillStyle = isSelected ? '#D3A84E' : 'rgba(211, 168, 78, 0.8)'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size / 2, 0, Math.PI * 2)
        ctx.fill()

        // Node border
        ctx.strokeStyle = isSelected ? '#D3A84E' : 'rgba(211, 168, 78, 0.4)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Label
        ctx.fillStyle = '#FFFFF5'
        ctx.font = isSelected ? 'bold 14px Inter' : '12px Inter'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(node.label, node.x, node.y + node.size + 15)
      })

      ctx.restore()
    }

    draw()

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left - canvas.offsetWidth / 2) / zoom + canvas.offsetWidth / 2
      const y = (e.clientY - rect.top - canvas.offsetHeight / 2) / zoom + canvas.offsetHeight / 2

      let clicked = false
      graphData.nodes.forEach(node => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
        if (distance < node.size / 2) {
          setSelectedNode(node.id)
          clicked = true
        }
      })

      if (!clicked) setSelectedNode(null)
    }

    canvas.addEventListener('click', handleClick)
    return () => canvas.removeEventListener('click', handleClick)
  }, [selectedNode, zoom])

  return (
    <div className="relative flex-1">
      {/* Controls */}
      <div className="absolute left-6 top-6 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/95 p-2 backdrop-blur">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search knowledge..." 
            className="h-8 w-64 border-0 bg-transparent focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="absolute right-6 top-6 z-10 flex flex-col gap-2">
        <Button 
          size="icon" 
          variant="outline" 
          className="h-10 w-10 border-border/50 bg-background/95 backdrop-blur"
          onClick={() => setZoom(Math.min(zoom + 0.2, 3))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          className="h-10 w-10 border-border/50 bg-background/95 backdrop-blur"
          onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          className="h-10 w-10 border-border/50 bg-background/95 backdrop-blur"
          onClick={() => setZoom(1)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Canvas */}
      <canvas 
        ref={canvasRef} 
        className="h-full w-full"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(211, 168, 78, 0.03) 0%, transparent 50%)' }}
      />

      {/* Legend */}
      <div className="absolute bottom-6 left-6 rounded-lg border border-border/50 bg-background/95 p-4 backdrop-blur">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Core Topics</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-8 bg-primary/20" />
            <span className="text-muted-foreground">Connections</span>
          </div>
        </div>
      </div>
    </div>
  )
}
