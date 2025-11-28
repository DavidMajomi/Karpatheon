import os
from typing import List, Dict, Any
from exa_py import Exa
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate


class SearchService:
    """Service for intelligent search and discovery using Exa and Gemini."""
    
    def __init__(self):
        self.exa = Exa(api_key=os.getenv("EXA_API_KEY"))
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0
        )
    
    async def refine_query(self, user_query: str) -> str:
        """
        Phase 1, Step 1: Use Gemini to refine the user's query into an optimal search query.
        """
        prompt = PromptTemplate.from_template(
            """You are a search query optimization expert. Transform the user's question into a precise, 
            effective search query that will return the most relevant results.
            
            User Question: {query}
            
            Return ONLY the optimized search query, nothing else."""
        )
        
        formatted = prompt.format(query=user_query)
        response = self.llm.invoke(formatted)
        return response.content.strip()
    
    async def initial_search(self, refined_query: str, num_results: int = 10) -> List[Dict[str, Any]]:
        """
        Phase 1, Step 2: Perform initial search using Exa API.
        Returns list of search results with titles, URLs, and snippets.
        """
        search_response = self.exa.search(
            refined_query,
            num_results=num_results,
            type="neural"
        )
        
        results = []
        for result in search_response.results:
            results.append({
                "title": result.title,
                "url": result.url,
                "snippet": getattr(result, 'text', '')[:500]  # First 500 chars as snippet
            })
        
        return results
    
    async def select_relevant_links(self, search_results: List[Dict[str, Any]], user_query: str, num_links: int = 5) -> List[str]:
        """
        Phase 1, Step 3: Use Gemini to analyze search results and select the most relevant URLs.
        """
        # Format search results for LLM
        results_text = "\n\n".join([
            f"{i+1}. Title: {r['title']}\n   URL: {r['url']}\n   Snippet: {r['snippet']}"
            for i, r in enumerate(search_results)
        ])
        
        prompt = PromptTemplate.from_template(
            """You are an expert at identifying the most relevant sources for answering questions.
            
            User Question: {query}
            
            Search Results:
            {results}
            
            Select the {num_links} most relevant URLs that are most likely to contain deep, comprehensive 
            information to answer the user's question. Consider:
            - Relevance to the question
            - Likely depth of content
            - Authority of source
            
            Return ONLY the URLs, one per line, nothing else."""
        )
        
        formatted = prompt.format(query=user_query, results=results_text, num_links=num_links)
        response = self.llm.invoke(formatted)
        
        # Extract URLs from response
        selected_urls = [line.strip() for line in response.content.strip().split('\n') if line.strip()]
        return selected_urls[:num_links]
    
    async def retrieve_deep_context(self, urls: List[str]) -> Dict[str, str]:
        """
        Phase 1, Step 4: Use Exa to retrieve full content from selected URLs.
        Returns dict mapping URL to full text content.
        """
        contents_response = self.exa.get_contents(urls)
        
        context_map = {}
        for content in contents_response.results:
            if hasattr(content, 'text') and content.text:
                context_map[content.url] = content.text
        
        return context_map
    
    async def discover(self, user_query: str) -> Dict[str, Any]:
        """
        Main orchestration method for recursive crawl and discovery.
        Combines all phases to return aggregated context and metadata.
        """
        # Step 1: Refine query
        refined_query = await self.refine_query(user_query)
        
        # Step 2: Initial search
        search_results = await self.initial_search(refined_query)
        
        # Step 3: Select relevant links
        selected_urls = await self.select_relevant_links(search_results, user_query)
        
        # Step 4: Retrieve deep context
        context_map = await self.retrieve_deep_context(selected_urls)
        
        # Step 5: Aggregate context
        aggregated_context = "\n\n---\n\n".join([
            f"Source: {url}\n\n{content}"
            for url, content in context_map.items()
        ])
        
        return {
            "original_query": user_query,
            "refined_query": refined_query,
            "search_results": search_results,
            "selected_urls": selected_urls,
            "context_map": context_map,
            "aggregated_context": aggregated_context
        }
