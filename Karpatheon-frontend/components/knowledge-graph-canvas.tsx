'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { Search, ZoomIn, ZoomOut, Maximize2, CheckCircle2, X, MoreHorizontal, Calendar, Clock } from 'lucide-react'

// --- Data Types ---
type NodeStatus = 'locked' | 'unlocked' | 'completed'

interface GraphNode {
  id: string
  title: string
  description: string
  url: string
  category: string
  created_at: string
  status: NodeStatus
  topics: string[]
}

interface GraphEdge {
  from: string
  to: string
  relationship: string
}

interface PositionedNode extends GraphNode {
  level: number
  row: number
  baseX: number
  baseY: number
  noiseX: number
  noiseY: number
  phase: number
  size: number
  x: number
  y: number
}

// --- Demo Data ---
const DEMO_GRAPH_DATA = {
  "nodes": [
    {
      "id": "node-001",
      "title": "Introduction to Neural Networks",
      "description": "Fundamental concepts of artificial neural networks, including perceptrons, activation functions, and basic architecture patterns.",
      "url": "https://en.wikipedia.org/wiki/Neural_network_(machine_learning)",
      "category": "AI",
      "created_at": "2024-11-15T14:23:00Z",
      "status": "completed" as NodeStatus,
      "topics": ["machine learning", "deep learning", "perceptrons"]
    },
    {
      "id": "node-002",
      "title": "Linear Algebra Basics",
      "description": "Vector spaces, matrix operations, and linear transformations. Essential foundation for understanding neural network mathematics.",
      "url": "https://en.wikipedia.org/wiki/Linear_algebra",
      "category": "Math",
      "created_at": "2024-11-10T09:15:00Z",
      "status": "completed" as NodeStatus,
      "topics": ["vectors", "matrices", "transformations"]
    },
    {
      "id": "node-003",
      "title": "Backpropagation Algorithm",
      "description": "The core algorithm for training neural networks using gradient descent. Explains chain rule application and weight updates.",
      "url": "https://en.wikipedia.org/wiki/Backpropagation",
      "category": "AI",
      "created_at": "2024-11-20T16:45:00Z",
      "status": "unlocked" as NodeStatus,
      "topics": ["gradient descent", "optimization", "neural networks"]
    },
    {
      "id": "node-004",
      "title": "Calculus I - Derivatives",
      "description": "Understanding rates of change, derivatives, and differentiation rules. Critical for understanding gradient-based optimization.",
      "url": "https://en.wikipedia.org/wiki/Derivative",
      "category": "Math",
      "created_at": "2024-11-12T11:30:00Z",
      "status": "completed" as NodeStatus,
      "topics": ["derivatives", "calculus", "optimization"]
    },
    {
      "id": "node-005",
      "title": "Transformer Architecture",
      "description": "Attention mechanisms and the architecture behind GPT and BERT. Represents modern deep learning approaches.",
      "url": "https://en.wikipedia.org/wiki/Transformer_(machine_learning_model)",
      "category": "AI",
      "created_at": "2024-11-22T13:20:00Z",
      "status": "locked" as NodeStatus,
      "topics": ["attention", "transformers", "NLP"]
    },
    {
      "id": "node-006",
      "title": "Music Theory Fundamentals",
      "description": "Basic concepts of pitch, rhythm, harmony, and musical notation. Foundation for understanding music composition.",
      "url": "https://en.wikipedia.org/wiki/Music_theory",
      "category": "Music",
      "created_at": "2024-11-08T10:00:00Z",
      "status": "unlocked" as NodeStatus,
      "topics": ["scales", "harmony", "notation"]
    },
    {
      "id": "node-007",
      "title": "Modal Jazz Theory",
      "description": "Exploration of modes in jazz composition. Dorian, Phrygian, Lydian, and their applications in improvisation.",
      "url": "https://en.wikipedia.org/wiki/Modal_jazz",
      "category": "Music",
      "created_at": "2024-11-21T15:10:00Z",
      "status": "locked" as NodeStatus,
      "topics": ["modes", "jazz", "improvisation"]
    },
    {
      "id": "node-008",
      "title": "Convolutional Neural Networks",
      "description": "CNN architecture for computer vision tasks. Convolution layers, pooling, and feature extraction techniques.",
      "url": "https://en.wikipedia.org/wiki/Convolutional_neural_network",
      "category": "AI",
      "created_at": "2024-11-19T12:00:00Z",
      "status": "locked" as NodeStatus,
      "topics": ["computer vision", "CNNs", "image recognition"]
    }
  ],
  "edges": [
    { "from": "node-002", "to": "node-001", "relationship": "prerequisite" },
    { "from": "node-004", "to": "node-003", "relationship": "prerequisite" },
    { "from": "node-001", "to": "node-003", "relationship": "builds_on" },
    { "from": "node-003", "to": "node-005", "relationship": "prerequisite" },
    { "from": "node-001", "to": "node-008", "relationship": "prerequisite" },
    { "from": "node-006", "to": "node-007", "relationship": "prerequisite" },
    { "from": "node-002", "to": "node-004", "relationship": "related" }
  ]
}

// --- Layout Algorithm ---
const LEVEL_SPACING = 250
const ROW_SPACING = 150

function calculateLevels(nodes: GraphNode[], edges: GraphEdge[]): Map<string, number> {
  const levels = new Map<string, number>()
  const inDegree = new Map<string, number>()
  const adjList = new Map<string, string[]>()

  nodes.forEach(node => {
    inDegree.set(node.id, 0)
    adjList.set(node.id, [])
  })

  edges.forEach(edge => {
    adjList.get(edge.from)?.push(edge.to)
    inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1)
  })

  const queue: string[] = []
  nodes.forEach(node => {
    if (inDegree.get(node.id) === 0) {
      levels.set(node.id, 0)
      queue.push(node.id)
    }
  })

  while (queue.length > 0) {
    const current = queue.shift()!
    const currentLevel = levels.get(current) || 0

    adjList.get(current)?.forEach(neighbor => {
      const newLevel = currentLevel + 1
      const existingLevel = levels.get(neighbor) || 0
      levels.set(neighbor, Math.max(existingLevel, newLevel))

      const degree = inDegree.get(neighbor)! - 1
      inDegree.set(neighbor, degree)

      if (degree === 0) {
        queue.push(neighbor)
      }
    })
  }

  nodes.forEach(node => {
    if (!levels.has(node.id)) {
      levels.set(node.id, 0)
    }
  })

  return levels
}

function calculateRows(nodes: GraphNode[], levels: Map<string, number>): Map<string, number> {
  const rows = new Map<string, number>()
  const categories = new Map<string, GraphNode[]>()
  
  nodes.forEach(node => {
    if (!categories.has(node.category)) categories.set(node.category, [])
    categories.get(node.category)!.push(node)
  })

  const categoryOffsets: Record<string, number> = {
    'Math': 0,
    'AI': -2,
    'Music': 2,
  }

  categories.forEach((categoryNodes, category) => {
    const baseOffset = categoryOffsets[category] || 0
    const levelGroups = new Map<number, GraphNode[]>()
    
    categoryNodes.forEach(node => {
      const level = levels.get(node.id) || 0
      if (!levelGroups.has(level)) levelGroups.set(level, [])
      levelGroups.get(level)!.push(node)
    })

    levelGroups.forEach((nodesAtLevel) => {
      const count = nodesAtLevel.length
      nodesAtLevel.forEach((node, idx) => {
        const offset = (idx - (count - 1) / 2) * 0.5
        rows.set(node.id, baseOffset + offset)
      })
    })
  })

  return rows
}

function layoutGraph(nodes: GraphNode[], edges: GraphEdge[]): PositionedNode[] {
  const levels = calculateLevels(nodes, edges)
  const rows = calculateRows(nodes, levels)

  return nodes.map(node => {
    const level = levels.get(node.id) || 0
    const row = rows.get(node.id) || 0

    return {
      ...node,
      level,
      row,
      baseX: level * LEVEL_SPACING,
      baseY: row * ROW_SPACING,
      noiseX: Math.random() * 40 - 20,
      noiseY: Math.random() * 40 - 20,
      phase: Math.random() * Math.PI * 2,
      size: node.status === 'completed' ? 40 : 30,
      x: 0,
      y: 0,
    }
  })
}

// --- Main Component ---
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

  // Process nodes with layout algorithm
  const processedNodes = useMemo(() => {
    return layoutGraph(DEMO_GRAPH_DATA.nodes, DEMO_GRAPH_DATA.edges)
  }, [])

  // Background stars
  const backgroundStars = useMemo(() => {
    return Array.from({ length: 150 }).map(() => ({
      x: Math.random() * 4000 - 2000,
      y: Math.random() * 4000 - 2000,
      size: Math.random() * 1.5,
      opacity: Math.random() * 0.5 + 0.1
    }))
  }, [])

  // Resize handler
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

  // Render loop
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

      ctx.fillStyle = '#09090b'
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      const centerX = dimensions.width / 2
      const centerY = dimensions.height / 2

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.scale(zoom, zoom)
      ctx.translate(-centerX + camX, -centerY + camY)

      // Background stars
      backgroundStars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Edges
      ctx.lineWidth = 2
      DEMO_GRAPH_DATA.edges.forEach(edge => {
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
          ctx.fillText(node.title, node.x, node.y + node.size + 8)
          
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

  // Event handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y
      setCamera(prev => ({ ...prev, x: prev.x + dx / prev.zoom, y: prev.y + dy / prev.zoom }))
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      return
    }

    const rect = containerRef.current!.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left - dimensions.width/2) / camera.zoom - camera.x + dimensions.width/2
    const mouseY = (e.clientY - rect.top - dimensions.height/2) / camera.zoom - camera.y + dimensions.height/2

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
    if (canvasRef.current) {
      canvasRef.current.style.cursor = found ? 'pointer' : isDragging ? 'grabbing' : 'grab'
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (Math.abs(e.clientX - lastMousePos.current.x) > 5) return
    if (hoveredNode) setSelectedNode(hoveredNode)
  }

  const activeNodeData = processedNodes.find(n => n.id === selectedNode)

  return (
    <div ref={containerRef} className="relative h-full w-full bg-zinc-950 overflow-hidden select-none">
      
      {/* Search Bar */}
      <div className={`absolute left-6 top-6 z-10 transition-opacity duration-300 ${activeNodeData ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="group flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur-md hover:border-white/20">
          <Search className="h-4 w-4 text-zinc-400 group-hover:text-white" />
          <input placeholder="Search nodes..." className="h-8 w-64 border-none bg-transparent text-sm text-zinc-100 focus:outline-none" />
        </div>
      </div>

      {/* Controls */}
      <div className={`absolute right-6 top-6 z-10 flex flex-col gap-2 transition-opacity duration-300 ${activeNodeData ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button onClick={() => setCamera(c => ({...c, zoom: Math.min(c.zoom + 0.2, 3)}))} className="p-2 rounded-xl border border-white/10 bg-black/40 text-zinc-400 hover:text-white">
          <ZoomIn className="h-4 w-4" />
        </button>
        <button onClick={() => setCamera(c => ({...c, zoom: Math.max(c.zoom - 0.2, 0.2)}))} className="p-2 rounded-xl border border-white/10 bg-black/40 text-zinc-400 hover:text-white">
          <ZoomOut className="h-4 w-4" />
        </button>
        <button onClick={() => setCamera({ x: 0, y: 0, zoom: 1 })} className="p-2 rounded-xl border border-white/10 bg-black/40 text-zinc-400 hover:text-white">
          <Maximize2 className="h-4 w-4" />
        </button>
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

      {/* Full Screen Note Overlay */}
      {activeNodeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative h-[90vh] w-[90vw] max-w-5xl flex flex-col rounded-3xl border border-white/10 bg-zinc-900/95 shadow-2xl animate-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-amber-400">
                  {activeNodeData.status === 'completed' ? (
                    <CheckCircle2 />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {activeNodeData.category}
                    <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
                    <span>Level {activeNodeData.level}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{activeNodeData.title}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white">
                  <MoreHorizontal />
                </button>
                <button 
                  onClick={() => setSelectedNode(null)} 
                  className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="mx-auto max-w-3xl space-y-8 h-full flex flex-col">
                {/* Meta Data */}
                <div className="flex gap-6 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created {new Date(activeNodeData.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    15 min read
                  </div>
                </div>

                {/* Source Link */}
                <a 
                  href={activeNodeData.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-sky-400 hover:text-sky-300 underline"
                >
                  View Source →
                </a>

                {/* Description */}
                <p className="text-zinc-400 leading-relaxed">{activeNodeData.description}</p>

                {/* Title Input */}
                <input 
                  type="text" 
                  defaultValue={`Notes on ${activeNodeData.title}`}
                  className="w-full bg-transparent text-4xl font-bold text-white placeholder:text-zinc-700 focus:outline-none"
                />
                
                {/* Writable Body */}
                <textarea 
                  className="flex-1 w-full resize-none bg-transparent text-lg leading-relaxed text-zinc-300 placeholder:text-zinc-700 focus:outline-none"
                  placeholder="Start typing your thoughts here..."
                  defaultValue=""
                />
              </div>
            </div>

            {/* Footer */}
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