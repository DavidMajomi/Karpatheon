// layout-algorithm.ts
// Converts the demo JSON into positioned nodes for your canvas

interface GraphNode {
  id: string
  title: string
  description: string
  url: string
  category: string
  created_at: string
  status: 'locked' | 'unlocked' | 'completed'
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

const LEVEL_SPACING = 250
const ROW_SPACING = 150

/**
 * Calculate the "level" (X-axis depth) of each node using topological sort
 * Nodes with no incoming edges are level 0
 * Each edge adds +1 to the target's level
 */
export function calculateLevels(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Map<string, number> {
  const levels = new Map<string, number>()
  const inDegree = new Map<string, number>()
  const adjList = new Map<string, string[]>()

  // Initialize
  nodes.forEach(node => {
    inDegree.set(node.id, 0)
    adjList.set(node.id, [])
  })

  // Build adjacency list and count incoming edges
  edges.forEach(edge => {
    adjList.get(edge.from)?.push(edge.to)
    inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1)
  })

  // Start with nodes that have no prerequisites
  const queue: string[] = []
  nodes.forEach(node => {
    if (inDegree.get(node.id) === 0) {
      levels.set(node.id, 0)
      queue.push(node.id)
    }
  })

  // BFS to assign levels
  while (queue.length > 0) {
    const current = queue.shift()!
    const currentLevel = levels.get(current) || 0

    adjList.get(current)?.forEach(neighbor => {
      const newLevel = currentLevel + 1
      const existingLevel = levels.get(neighbor) || 0
      
      // Take the maximum level (longest path)
      levels.set(neighbor, Math.max(existingLevel, newLevel))

      const degree = inDegree.get(neighbor)! - 1
      inDegree.set(neighbor, degree)

      if (degree === 0) {
        queue.push(neighbor)
      }
    })
  }

  // Handle disconnected nodes
  nodes.forEach(node => {
    if (!levels.has(node.id)) {
      levels.set(node.id, 0)
    }
  })

  return levels
}

/**
 * Calculate the "row" (Y-axis lane) for each node
 * Groups by category and spreads them vertically to avoid overlap
 */
export function calculateRows(
  nodes: GraphNode[],
  levels: Map<string, number>
): Map<string, number> {
  const rows = new Map<string, number>()
  
  // Group nodes by category
  const categories = new Map<string, GraphNode[]>()
  nodes.forEach(node => {
    const cat = node.category
    if (!categories.has(cat)) categories.set(cat, [])
    categories.get(cat)!.push(node)
  })

  // Assign row offsets to each category (lanes)
  const categoryOffsets: Record<string, number> = {
    'Math': 0,      // Center lane
    'AI': -2,       // Top lane
    'Music': 2,     // Bottom lane
  }

  // Within each category, spread nodes vertically based on their level
  categories.forEach((categoryNodes, category) => {
    const baseOffset = categoryOffsets[category] || 0
    
    // Group by level within category
    const levelGroups = new Map<number, GraphNode[]>()
    categoryNodes.forEach(node => {
      const level = levels.get(node.id) || 0
      if (!levelGroups.has(level)) levelGroups.set(level, [])
      levelGroups.get(level)!.push(node)
    })

    // Spread nodes at the same level vertically
    levelGroups.forEach((nodesAtLevel, level) => {
      const count = nodesAtLevel.length
      nodesAtLevel.forEach((node, idx) => {
        // Center the group and space them out
        const offset = (idx - (count - 1) / 2) * 0.5
        rows.set(node.id, baseOffset + offset)
      })
    })
  })

  return rows
}

/**
 * Main function: Convert graph JSON to positioned nodes for canvas
 */
export function layoutGraph(
  nodes: GraphNode[],
  edges: GraphEdge[]
): PositionedNode[] {
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
