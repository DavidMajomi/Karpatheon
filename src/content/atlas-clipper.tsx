import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { Readability } from "@mozilla/readability"
import { useState, useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const AtlasClipper = () => {
  // DEMO MODE: If true, button ignores errors and always shows up.
  // Set to 'false' only when you are ready for production.
  const DEMO_MODE = true

  const [article, setArticle] = useState<any>(null)
  const [visible, setVisible] = useState(DEMO_MODE)

  useEffect(() => {
    console.log("Sidequest: Scout active. Demo Mode:", DEMO_MODE)

    const analyzePage = () => {
      const url = window.location.href
      let extractedData = null

      // --- STRATEGY 1: PDF ---
      if (document.contentType === "application/pdf" || url.endsWith(".pdf")) {
        console.log("Sidequest: PDF Strategy")
        extractedData = {
          title: document.title || "PDF Document",
          text: "PDF Content (Processed by Backend)",
          type: "pdf"
        }
      }
      
      // --- STRATEGY 2: ArXiv (Fixes the null crash) ---
      else if (url.includes("arxiv.org")) {
        console.log("Sidequest: ArXiv Strategy")
        try {
          // ArXiv abstract pages have specific classes
          const title = document.querySelector(".title")?.textContent?.replace("Title:", "").trim()
          const abstract = document.querySelector(".abstract")?.textContent?.replace("Abstract:", "").trim()
          
          if (title) {
            extractedData = { title, text: abstract || "", type: "paper" }
          }
        } catch (e) { console.warn("ArXiv scrape failed", e) }
      }

      // --- STRATEGY 3: YouTube (Fixes the empty content) ---
      else if (url.includes("youtube.com/watch")) {
        console.log("Sidequest: YouTube Strategy")
        try {
          // YouTube is an SPA, so we look for meta tags first (they populate faster than DOM)
          const title = document.querySelector('meta[name="title"]')?.getAttribute("content") || document.title
          const desc = document.querySelector('meta[name="description"]')?.getAttribute("content") || ""
          
          extractedData = { title, text: desc, type: "video" }
        } catch (e) { console.warn("YouTube scrape failed", e) }
      }

      // --- STRATEGY 4: Mozilla Readability (The Standard) ---
      if (!extractedData) {
        try {
          const documentClone = document.cloneNode(true) as Document
          const reader = new Readability(documentClone)
          const parsed = reader.parse()
          
          if (parsed) {
            console.log("Sidequest: Readability Strategy")
            extractedData = {
              title: parsed.title,
              text: parsed.textContent,
              type: "article"
            }
          }
        } catch (e) { console.warn("Readability failed", e) }
      }

      // --- STRATEGY 5: The "Demo God" Fallback ---
      // If everything failed, just grab the title so the button still works.
      if (!extractedData) {
        console.log("Sidequest: Fallback Strategy")
        extractedData = {
          title: document.title,
          text: "",
          type: "website"
        }
      }

      // SET STATE
      setArticle(extractedData)
      
      // If not in Demo Mode, only show if we found substantial content
      if (!DEMO_MODE && extractedData.text.length > 200) {
        setTimeout(() => setVisible(true), 500)
      }
    }

    // Wait 1s for SPAs (like YouTube) to settle
    const timer = setTimeout(analyzePage, 1000)
    return () => clearTimeout(timer)

  }, [])

  const handleAddToAtlas = async () => {
    // If clicked before scraping finished, scrape now
    const finalArticle = article || { 
      title: document.title, 
      text: "", 
      type: "website" 
    }

    console.log("Sidequest: Sending to backend...", finalArticle)
    
    // Visual Feedback
    const btn = document.getElementById("sq-add-btn")
    if(btn) btn.innerText = "Saved! +10 XP"
    setTimeout(() => setVisible(false), 2000)

    // Send message
    await chrome.runtime.sendMessage({
      name: "ADD_TO_ATLAS",
      body: {
        ...finalArticle,
        url: window.location.href
      }
    })
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-[2147483647] font-sans">
      <button 
        id="sq-add-btn"
        onClick={handleAddToAtlas}
        className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-all border-2 border-yellow-400 animate-bounce-in cursor-pointer group"
      >
        <span className="text-2xl group-hover:rotate-12 transition-transform">
          {article?.type === 'pdf' ? '📄' : 
           article?.type === 'paper' ? '🎓' : 
           article?.type === 'video' ? '📺' : '🧭'}
        </span>
        <div className="flex flex-col items-start">
          <span className="font-bold text-sm leading-none">Add to Atlas</span>
          {article?.type && <span className="text-[10px] text-gray-400 uppercase tracking-wider">{article.type} detected</span>}
        </div>
      </button>
    </div>
  )
}

export default AtlasClipper