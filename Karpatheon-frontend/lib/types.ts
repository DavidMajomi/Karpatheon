// TypeScript types matching backend schemas

// Search & Discovery
export interface SearchRequest {
  query: string
}

export interface SearchResult {
  title: string
  url: string
  snippet: string
}

export interface SearchResponse {
  original_query: string
  refined_query: string
  results: SearchResult[]
}

// Chat
export interface ChatRequest {
  query: string
  mode?: 'execution' | 'curiosity' | 'learning'
  context_filter?: string[]
}

export interface ChatResponse {
  response: string
  sources: string[]
  suggested_actions?: string[]
}

// Knowledge Graph
export interface ConceptNode {
  id: string
  label: string
  properties: Record<string, any>
}

export interface GraphContext {
  central_concept: string
  related_nodes: ConceptNode[]
}

// File Ingestion
export interface FileResponse {
  filename: string
  file_id: string
  status: string
  chunk_count: number
  graph_nodes_created?: number
}

// API Error
export interface APIError {
  message: string
  status?: number
  details?: any
}
