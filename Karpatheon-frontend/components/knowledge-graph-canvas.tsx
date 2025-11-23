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

// --- Category Configuration ---
const CATEGORY_CONFIG = {
  'Math': {
    offsetX: 0,
    color: '#E8B86D', // Warmer, richer gold (like Skyrim's fire/gold)
    glowColor: 'rgba(232, 184, 109, 0.4)',
    bgGradient: ['rgba(232, 184, 109, 0.08)', 'rgba(139, 92, 46, 0)']
  },
  'AI': {
    offsetX: 1200,
    color: '#5EC8F2', // Brighter cyan-blue (like Skyrim's frost/ice)
    glowColor: 'rgba(94, 200, 242, 0.4)',
    bgGradient: ['rgba(94, 200, 242, 0.08)', 'rgba(30, 58, 138, 0)']
  },
  'Music': {
    offsetX: 2400,
    color: '#B58EF7', // Lighter purple (like Skyrim's magic/arcane)
    glowColor: 'rgba(181, 142, 247, 0.4)',
    bgGradient: ['rgba(181, 142, 247, 0.08)', 'rgba(88, 28, 135, 0)']
  }
}

// --- Layout Algorithm ---
const LEVEL_SPACING = 250
const ROW_SPACING = 150

function calculateLevels(nodes: GraphNode[], edges: GraphEdge[], category: string): Map<string, number> {
  const categoryNodes = nodes.filter(n => n.category === category)
  const levels = new Map<string, number>()
  const inDegree = new Map<string, number>()
  const adjList = new Map<string, string[]>()

  categoryNodes.forEach(node => {
    inDegree.set(node.id, 0)
    adjList.set(node.id, [])
  })

  edges.forEach(edge => {
    const fromNode = nodes.find(n => n.id === edge.from)
    const toNode = nodes.find(n => n.id === edge.to)
    
    // Only process edges within the same category for level calculation
    if (fromNode?.category === category && toNode?.category === category) {
      adjList.get(edge.from)?.push(edge.to)
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1)
    }
  })

  const queue: string[] = []
  categoryNodes.forEach(node => {
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

  categoryNodes.forEach(node => {
    if (!levels.has(node.id)) {
      levels.set(node.id, 0)
    }
  })

  return levels
}

function layoutGraph(nodes: GraphNode[], edges: GraphEdge[]): PositionedNode[] {
  const categories = [...new Set(nodes.map(n => n.category))]
  const positionedNodes: PositionedNode[] = []

  categories.forEach(category => {
    const categoryNodes = nodes.filter(n => n.category === category)
    const levels = calculateLevels(nodes, edges, category)
    
    // Group by level
    const levelGroups = new Map<number, GraphNode[]>()
    categoryNodes.forEach(node => {
      const level = levels.get(node.id) || 0
      if (!levelGroups.has(level)) levelGroups.set(level, [])
      levelGroups.get(level)!.push(node)
    })

    // Position nodes
    categoryNodes.forEach(node => {
      const level = levels.get(node.id) || 0
      const nodesAtLevel = levelGroups.get(level) || []
      const indexInLevel = nodesAtLevel.indexOf(node)
      const count = nodesAtLevel.length
      
      const categoryOffset = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG].offsetX
      const row = (indexInLevel - (count - 1) / 2) * 0.8

      positionedNodes.push({
        ...node,
        level,
        row,
        baseX: categoryOffset + (level * LEVEL_SPACING),
        baseY: row * ROW_SPACING,
        noiseX: Math.random() * 40 - 20,
        noiseY: Math.random() * 40 - 20,
        phase: Math.random() * Math.PI * 2,
        size: node.status === 'completed' ? 40 : 30,
        x: 0,
        y: 0,
      })
    })
  })

  return positionedNodes
}

// --- Main Component ---
export function KnowledgeGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const minimapRef = useRef<HTMLCanvasElement>(null)
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 0.5 }) // Start zoomed out
  const [isDragging, setIsDragging] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  const lastMousePos = useRef({ x: 0, y: 0 })
  const frameRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  // Process nodes with layout algorithm
  const processedNodes = useMemo(() => {
    return layoutGraph(DEMO_GRAPH_DATA.nodes, DEMO_GRAPH_DATA.edges)
  }, [])

  // Calculate bounds for minimap
  const graphBounds = useMemo(() => {
    if (processedNodes.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 }
    
    const xs = processedNodes.map(n => n.baseX)
    const ys = processedNodes.map(n => n.baseY)
    const minX = Math.min(...xs) - 200
    const maxX = Math.max(...xs) + 200
    const minY = Math.min(...ys) - 200
    const maxY = Math.max(...ys) + 200
    
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY }
  }, [processedNodes])

  // Background stars with twinkle effect
  const backgroundStars = useMemo(() => {
    return Array.from({ length: 300 }).map(() => ({
      x: Math.random() * 6000 - 1000,
      y: Math.random() * 4000 - 2000,
      size: Math.random() * 2 + 0.5,
      baseOpacity: Math.random() * 0.6 + 0.4,
      twinkleSpeed: Math.random() * 0.5 + 0.5,
      twinkleOffset: Math.random() * Math.PI * 2
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

  // Render minimap
  useEffect(() => {
    const minimap = minimapRef.current
    if (!minimap || processedNodes.length === 0) return

    const ctx = minimap.getContext('2d')
    if (!ctx) return

    const width = 200
    const height = 120
    minimap.width = width
    minimap.height = height

    // Clear
    ctx.fillStyle = '#18181b'
    ctx.fillRect(0, 0, width, height)

    // Draw category regions
    const scaleX = width / graphBounds.width
    const scaleY = height / graphBounds.height

    Object.entries(CATEGORY_CONFIG).forEach(([category, config]) => {
      const categoryNodes = processedNodes.filter(n => n.category === category)
      if (categoryNodes.length === 0) return

      const xs = categoryNodes.map(n => n.baseX)
      const ys = categoryNodes.map(n => n.baseY)
      const minX = Math.min(...xs) - 100
      const maxX = Math.max(...xs) + 100
      const minY = Math.min(...ys) - 100
      const maxY = Math.max(...ys) + 100

      const x = (minX - graphBounds.minX) * scaleX
      const y = (minY - graphBounds.minY) * scaleY
      const w = (maxX - minX) * scaleX
      const h = (maxY - minY) * scaleY

      ctx.fillStyle = config.bgGradient[0]
      ctx.fillRect(x, y, w, h)
      
      ctx.strokeStyle = config.color
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, w, h)
    })

    // Draw nodes as tiny dots
    processedNodes.forEach(node => {
      const x = (node.baseX - graphBounds.minX) * scaleX
      const y = (node.baseY - graphBounds.minY) * scaleY
      
      const config = CATEGORY_CONFIG[node.category as keyof typeof CATEGORY_CONFIG]
      ctx.fillStyle = config.color
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw viewport rectangle
    const viewWidth = dimensions.width / camera.zoom
    const viewHeight = dimensions.height / camera.zoom
    const viewCenterX = dimensions.width / 2 - camera.x
    const viewCenterY = dimensions.height / 2 - camera.y
    
    const vx = ((viewCenterX - viewWidth/2) - graphBounds.minX) * scaleX
    const vy = ((viewCenterY - viewHeight/2) - graphBounds.minY) * scaleY
    const vw = viewWidth * scaleX
    const vh = viewHeight * scaleY

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.strokeRect(vx, vy, vw, vh)

  }, [processedNodes, graphBounds, camera, dimensions])

  // Render main canvas
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

      // Background stars with glow
      backgroundStars.forEach(star => {
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7
        const opacity = star.baseOpacity * twinkle
        
        // Star glow
        const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3)
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
        glowGradient.addColorStop(0.3, `rgba(200, 220, 255, ${opacity * 0.6})`)
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
        ctx.fill()
        
        // Star core
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw category background nebula regions with spiral galaxy effect
      Object.entries(CATEGORY_CONFIG).forEach(([category, config]) => {
        const categoryNodes = processedNodes.filter(n => n.category === category)
        if (categoryNodes.length === 0) return

        const xs = categoryNodes.map(n => n.baseX)
        const ys = categoryNodes.map(n => n.baseY)
        const minX = Math.min(...xs) - 150
        const maxX = Math.max(...xs) + 150
        const minY = Math.min(...ys) - 150
        const maxY = Math.max(...ys) + 150
        const centerCatX = (minX + maxX) / 2
        const centerCatY = (minY + maxY) / 2
        const width = maxX - minX
        const height = maxY - minY

        // Determine spiral direction per category
        const spiralDirection = category === 'Math' ? 1 : category === 'AI' ? -1 : 0.5
        const rotationOffset = timeRef.current * 0.05 * spiralDirection

        // Layer 1: Large organic cloud blobs
        ctx.globalCompositeOperation = 'screen'
        const numBlobs = 15
        for (let i = 0; i < numBlobs; i++) {
          const blobAngle = (i / numBlobs) * Math.PI * 2 + rotationOffset * 0.3
          const blobDist = (Math.random() * 0.4 + 0.2) * Math.min(width, height) / 2
          const blobX = centerCatX + Math.cos(blobAngle) * blobDist
          const blobY = centerCatY + Math.sin(blobAngle) * blobDist
          const blobSize = Math.random() * 120 + 80
          const blobOpacity = Math.random() * 0.06 + 0.02

          const blobGrad = ctx.createRadialGradient(blobX, blobY, 0, blobX, blobY, blobSize)
          blobGrad.addColorStop(0, config.color + Math.floor(blobOpacity * 255).toString(16).padStart(2, '0'))
          blobGrad.addColorStop(0.4, config.color + Math.floor(blobOpacity * 0.5 * 255).toString(16).padStart(2, '0'))
          blobGrad.addColorStop(1, 'rgba(0,0,0,0)')

          ctx.fillStyle = blobGrad
          ctx.beginPath()
          ctx.arc(blobX, blobY, blobSize, 0, Math.PI * 2)
          ctx.fill()
        }

        // Layer 2: Spiral arms (logarithmic spiral)
        const numArms = category === 'Music' ? 4 : 3 // Double helix for music
        const armRotationOffset = Math.PI * 2 / numArms

        for (let arm = 0; arm < numArms; arm++) {
          const armOffset = arm * armRotationOffset
          
          // Draw spiral path with gradient blobs
          for (let t = 0; t < Math.PI * 3; t += 0.15) {
            const spiralRadius = 50 + t * 40
            const angle = t * spiralDirection + armOffset + rotationOffset
            
            const spiralX = centerCatX + spiralRadius * Math.cos(angle)
            const spiralY = centerCatY + spiralRadius * Math.sin(angle)
            
            // Check if point is within category bounds
            if (spiralX < minX || spiralX > maxX || spiralY < minY || spiralY > maxY) continue
            
            // Fade out towards the edge
            const distFromCenter = Math.hypot(spiralX - centerCatX, spiralY - centerCatY)
            const maxDist = Math.min(width, height) / 2
            const fadeFactor = Math.max(0, 1 - distFromCenter / maxDist)
            
            const spiralSize = 40 + Math.sin(t * 2) * 10
            const spiralOpacity = (0.04 + Math.sin(t * 3) * 0.02) * fadeFactor

            const spiralGrad = ctx.createRadialGradient(spiralX, spiralY, 0, spiralX, spiralY, spiralSize)
            spiralGrad.addColorStop(0, config.color + Math.floor(spiralOpacity * 255).toString(16).padStart(2, '0'))
            spiralGrad.addColorStop(0.5, config.color + Math.floor(spiralOpacity * 0.4 * 255).toString(16).padStart(2, '0'))
            spiralGrad.addColorStop(1, 'rgba(0,0,0,0)')

            ctx.fillStyle = spiralGrad
            ctx.beginPath()
            ctx.arc(spiralX, spiralY, spiralSize, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        // Layer 3: Dust particles along spiral
        const numDust = 40
        for (let i = 0; i < numDust; i++) {
          const dustT = (i / numDust) * Math.PI * 2.5
          const dustArm = Math.floor(Math.random() * numArms)
          const dustArmOffset = dustArm * armRotationOffset
          const dustRadius = 60 + dustT * 35 + (Math.random() - 0.5) * 40
          const dustAngle = dustT * spiralDirection + dustArmOffset + rotationOffset + (Math.random() - 0.5) * 0.3
          
          const dustX = centerCatX + dustRadius * Math.cos(dustAngle)
          const dustY = centerCatY + dustRadius * Math.sin(dustAngle)
          
          if (dustX < minX || dustX > maxX || dustY < minY || dustY > maxY) continue
          
          const dustSize = Math.random() * 25 + 15
          const dustOpacity = Math.random() * 0.03 + 0.01
          
          const dustGrad = ctx.createRadialGradient(dustX, dustY, 0, dustX, dustY, dustSize)
          dustGrad.addColorStop(0, config.color + Math.floor(dustOpacity * 255).toString(16).padStart(2, '0'))
          dustGrad.addColorStop(1, 'rgba(0,0,0,0)')
          
          ctx.fillStyle = dustGrad
          ctx.beginPath()
          ctx.arc(dustX, dustY, dustSize, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.globalCompositeOperation = 'source-over'

        // Category label - fixed size, always visible at top
        const labelSize = 48
        ctx.font = `900 ${labelSize}px Inter`
        ctx.fillStyle = config.color
        ctx.globalAlpha = zoom < 0.8 ? 0.4 : 0.2
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillText(category.toUpperCase(), centerCatX, minY - 80)
        ctx.globalAlpha = 1
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
          const isCrossCategory = fromNode.category !== toNode.category
          
          const grad = ctx.createLinearGradient(fx, fy, tx, ty)
          
          if (isLocked) {
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)')
            grad.addColorStop(1, 'rgba(255, 255, 255, 0.05)')
            ctx.setLineDash([5, 5])
          } else if (isCrossCategory) {
            // Interdisciplinary connection - rainbow gradient
            grad.addColorStop(0, CATEGORY_CONFIG[fromNode.category as keyof typeof CATEGORY_CONFIG].color)
            grad.addColorStop(1, CATEGORY_CONFIG[toNode.category as keyof typeof CATEGORY_CONFIG].color)
            ctx.setLineDash([])
            ctx.lineWidth = 3
          } else {
            const categoryColor = CATEGORY_CONFIG[fromNode.category as keyof typeof CATEGORY_CONFIG].color
            grad.addColorStop(0, categoryColor + '66')
            grad.addColorStop(1, categoryColor + '66')
            ctx.setLineDash([])
          }

          ctx.strokeStyle = grad
          ctx.beginPath()
          ctx.moveTo(fx, fy)
          ctx.lineTo(tx, ty)
          ctx.stroke()
          ctx.lineWidth = 2
        }
      })

      // Nodes
      processedNodes.forEach(node => {
        node.x = node.baseX + node.noiseX + Math.sin(timeRef.current + node.phase) * 5
        node.y = node.baseY + node.noiseY + Math.cos(timeRef.current + node.phase) * 5

        const isSelected = selectedNode === node.id
        const isHovered = hoveredNode === node.id
        const isActive = isSelected || isHovered

        const config = CATEGORY_CONFIG[node.category as keyof typeof CATEGORY_CONFIG]
        let coreColor = '#52525b'
        let glowColor = 'rgba(255,255,255,0.05)'
        let glowSize = node.size * 2

        if (node.status === 'completed') {
          coreColor = config.color
          glowColor = config.glowColor
        } else if (node.status === 'unlocked') {
          coreColor = config.color
          glowColor = config.glowColor.replace('0.3', '0.2')
        }

        if (isActive) {
          glowSize = node.size * 3
          glowColor = node.status === 'locked' ? 'rgba(255,255,255,0.1)' : glowColor.replace(/[\d.]+\)/, '0.5)')
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
    if (hoveredNode) {
      setSelectedNode(hoveredNode)
      
      // Auto-pan to center the selected node
      const node = processedNodes.find(n => n.id === hoveredNode)
      if (node) {
        setCamera(prev => ({
          ...prev,
          x: -node.baseX + dimensions.width / 2,
          y: -node.baseY + dimensions.height / 2,
        }))
      }
    }
  }

  const activeNodeData = processedNodes.find(n => n.id === selectedNode)

  return (
    <div ref={containerRef} className="relative h-full w-full bg-zinc-950 overflow-hidden select-none">
      
      {/* Search Bar */}
      <div className={`absolute left-6 top-6 z-10 transition-opacity duration-300 ${activeNodeData ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="group flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur-md hover:border-white/20">
          <Search className="h-4 w-4 text-zinc-400 group-hover:text-white" />
          <input placeholder="Search constellation..." className="h-8 w-64 border-none bg-transparent text-sm text-zinc-100 focus:outline-none" />
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
        <button onClick={() => setCamera({ x: 0, y: 0, zoom: 0.5 })} className="p-2 rounded-xl border border-white/10 bg-black/40 text-zinc-400 hover:text-white">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Minimap */}
      <div className={`absolute right-6 bottom-6 z-10 rounded-xl border border-white/20 bg-black/60 p-2 backdrop-blur-md transition-opacity duration-300 ${activeNodeData ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <canvas ref={minimapRef} className="rounded-lg" />
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
                <div 
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800"
                  style={{ color: CATEGORY_CONFIG[activeNodeData.category as keyof typeof CATEGORY_CONFIG].color }}
                >
                  {activeNodeData.status === 'completed' ? (
                    <CheckCircle2 />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    <span style={{ color: CATEGORY_CONFIG[activeNodeData.category as keyof typeof CATEGORY_CONFIG].color }}>
                      {activeNodeData.category}
                    </span>
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
                  className="text-sm hover:underline"
                  style={{ color: CATEGORY_CONFIG[activeNodeData.category as keyof typeof CATEGORY_CONFIG].color }}
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