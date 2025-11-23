from fastapi import APIRouter
from app.schemas.base import SearchRequest, SearchResponse, SearchResult, ChatRequest, ChatResponse
from app.services.search_service import SearchService
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

router = APIRouter()


@router.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    """
    Direct search endpoint using Exa.
    Returns refined query and search results without deep crawling.
    """
    service = SearchService()
    
    # Refine query
    refined_query = await service.refine_query(request.query)
    
    # Perform search
    search_results = await service.initial_search(refined_query)
    
    # Convert to SearchResult schema
    results = [
        SearchResult(
            title=r["title"],
            url=r["url"],
            snippet=r["snippet"]
        )
        for r in search_results
    ]
    
    return SearchResponse(
        original_query=request.query,
        refined_query=refined_query,
        results=results
    )


@router.post("/discovery", response_model=ChatResponse)
async def discovery(request: ChatRequest):
    """
    Discovery endpoint with recursive crawling and Gemini synthesis.
    
    This endpoint:
    1. Refines the user's query
    2. Performs initial search with Exa
    3. Selects most relevant links using Gemini
    4. Retrieves full content from selected URLs
    5. Synthesizes a grounded response using Gemini
    """
    search_service = SearchService()
    
    # Phase 1: Intelligent Crawl & Discovery
    discovery_result = await search_service.discover(request.query)
    
    # Phase 2: Synthesis & Output with Gemini
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.3
    )
    
    # Construct system instruction and prompt
    system_instruction = """You are an expert technical consultant. Your task is to answer the user's question 
    using ONLY the provided context from web sources. 
    
    Rules:
    - Base your answer entirely on the provided context
    - If the context doesn't contain enough information, say so
    - Cite specific sources when making claims
    - Be comprehensive but concise
    - Use technical accuracy"""
    
    prompt = PromptTemplate.from_template(
        """{system_instruction}
        
        User Question: {query}
        
        --- CONTEXT FROM WEB SOURCES ---
        {context}
        --- END CONTEXT ---
        
        Provide a comprehensive answer to the user's question based on the context above."""
    )
    
    formatted_prompt = prompt.format(
        system_instruction=system_instruction,
        query=request.query,
        context=discovery_result["aggregated_context"]
    )
    
    # Generate response
    response = llm.invoke(formatted_prompt)
    
    # Extract sources from context_map
    sources = list(discovery_result["context_map"].keys())
    
    # Suggested actions based on the query
    suggested_actions = [
        "Explore related concepts in the knowledge graph",
        "Save this information to your notes",
        "Search for more recent updates"
    ]
    
    return ChatResponse(
        response=response.content,
        sources=sources,
        suggested_actions=suggested_actions
    )
