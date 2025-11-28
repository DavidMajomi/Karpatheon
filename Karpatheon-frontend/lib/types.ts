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

// Discovery Types
export interface ContentData {
  title: string
  byline?: string
  excerpt?: string
  textContent: string
  contentLength: number
  siteName?: string
  publishedTime?: string
}

export interface InterestPayload {
  url: string
  title: string
  timestamp: string
  content: ContentData
  method: string
}

export interface IngestResponse {
  status: string
  interest_url: string
  crawled_count: number
  stored_path: string
  top_similarity_score: number
}

export interface DiscoveryItem {
  url: string
  title: string
  snippet: string
  similarity_to_kb: number
  similarity_to_interest: number
  source_interest_url: string
  crawled_at: string
}

export interface DiscoveryResponse {
  discoveries: DiscoveryItem[]
  total_available: number
  filtered_count: number
  min_similarity_used: number
}
