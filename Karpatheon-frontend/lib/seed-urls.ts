import type { InterestPayload } from './types'

export const SEED_URLS = [
    {
        url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
        title: "Artificial Intelligence",
        category: "AI & ML"
    },
    {
        url: "https://en.wikipedia.org/wiki/Machine_learning",
        title: "Machine Learning",
        category: "AI & ML"
    },
    {
        url: "https://en.wikipedia.org/wiki/Deep_learning",
        title: "Deep Learning",
        category: "AI & ML"
    },
    {
        url: "https://en.wikipedia.org/wiki/Neural_network",
        title: "Neural Network",
        category: "AI & ML"
    },
    {
        url: "https://en.wikipedia.org/wiki/Natural_language_processing",
        title: "Natural Language Processing",
        category: "AI & ML"
    },
    {
        url: "https://en.wikipedia.org/wiki/Computer_vision",
        title: "Computer Vision",
        category: "AI & ML"
    },
    {
        url: "https://en.wikipedia.org/wiki/Leadership",
        title: "Leadership",
        category: "Business"
    },
    {
        url: "https://en.wikipedia.org/wiki/Strategic_management",
        title: "Strategic Management",
        category: "Business"
    },
    {
        url: "https://en.wikipedia.org/wiki/Innovation",
        title: "Innovation",
        category: "Business"
    },
    {
        url: "https://en.wikipedia.org/wiki/Quantum_computing",
        title: "Quantum Computing",
        category: "Technology"
    }
]

// Helper to create payload from seed URL
export function createInterestPayload(seedUrl: typeof SEED_URLS[0]): InterestPayload {
    return {
        url: seedUrl.url,
        title: seedUrl.title,
        timestamp: new Date().toISOString(),
        content: {
            title: seedUrl.title,
            textContent: `Content about ${seedUrl.title}. This will be re-crawled by the backend.`,
            contentLength: 100,
            excerpt: `Brief overview of ${seedUrl.title}`,
            siteName: "Wikipedia"
        },
        method: "readability"
    }
}
