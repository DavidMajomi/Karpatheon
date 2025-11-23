import axios, { AxiosInstance, AxiosError } from 'axios'
import type {
    SearchRequest,
    SearchResponse,
    ChatRequest,
    ChatResponse,
    GraphContext,
    FileResponse,
    APIError,
    InterestPayload,
    IngestResponse,
    DiscoveryResponse,
} from './types'

class APIClient {
    private client: AxiosInstance

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                const apiError: APIError = {
                    message: error.message,
                    status: error.response?.status,
                    details: error.response?.data,
                }
                return Promise.reject(apiError)
            }
        )
    }

    // Search endpoints
    async search(request: SearchRequest): Promise<SearchResponse> {
        const response = await this.client.post<SearchResponse>('/api/search/search', request)
        return response.data
    }

    async discovery(request: ChatRequest): Promise<ChatResponse> {
        const response = await this.client.post<ChatResponse>('/api/search/discovery', request)
        return response.data
    }

    // Chat endpoints
    async chatQuery(request: ChatRequest): Promise<ChatResponse> {
        const response = await this.client.post<ChatResponse>('/api/chat/query', request)
        return response.data
    }

    async dailySynthesis(): Promise<{ brief: string }> {
        const response = await this.client.post<{ brief: string }>('/api/chat/synthesis')
        return response.data
    }

    // Graph endpoints
    async getConceptContext(conceptId: string): Promise<GraphContext> {
        const response = await this.client.get<GraphContext>(`/api/graph/context/${conceptId}`)
        return response.data
    }

    // Ingestion endpoints
    async uploadFile(userId: string, file: File): Promise<FileResponse> {
        const formData = new FormData()
        formData.append('user_id', userId)
        formData.append('file', file)

        const response = await this.client.post<FileResponse>('/api/ingestion/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    }

    // Discovery endpoints
    async ingestInterest(userId: string, payload: InterestPayload): Promise<IngestResponse> {
        const response = await this.client.post<IngestResponse>(
            `/api/discovery/ingest?user_id=${userId}`,
            payload
        )
        return response.data
    }

    async listDiscoveries(
        userId: string,
        minSimilarity: number = 0.7,
        limit: number = 20
    ): Promise<DiscoveryResponse> {
        const response = await this.client.get<DiscoveryResponse>(
            `/api/discovery/list`,
            { params: { user_id: userId, min_similarity: minSimilarity, limit } }
        )
        return response.data
    }
}

// Export singleton instance
export const apiClient = new APIClient()
