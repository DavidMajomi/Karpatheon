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
  const [article, setArticle] = useState<any>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handlePageLoad = () => {
      console.log("Sidequest: Analyzing page...")
      const url = window.location.href
      const contentType = document.contentType

      // STRATEGY A: PDF Handling
      // We cannot read text here. We just send the URL to the backend.
      if (contentType === "application/pdf" || url.endsWith(".pdf")) {
        console.log("Sidequest: PDF Detected.")
        setArticle({
          title: document.title || "PDF Document",
          text: "", // Backend must download and parse this
          type: "pdf"
        })
        setTimeout(() => setVisible(true), 1000)
        return
      }

      // STRATEGY B: ArXiv Handling (Custom Scraper)
      // ArXiv breaks Readability, so we manually grab the exact divs we need.
      if (url.includes("arxiv.org/abs/")) {
        try {
            const title = document.querySelector(".title")?.textContent?.replace("Title:", "").trim()
            const abstract = document.querySelector(".abstract")?.textContent?.replace("Abstract:", "").trim()
            
            if (title && abstract) {
                console.log("Sidequest: ArXiv detected.")
                setArticle({ title, text: abstract, type: "paper" })
                setTimeout(() => setVisible(true), 1000)
                return
            }
        } catch (e) {
            console.warn("ArXiv scrape failed", e)
        }
      }

      // STRATEGY C: Default Readability (Blogs, Wikipedia, News)
      try {
        const documentClone = document.cloneNode(true) as Document
        const reader = new Readability(documentClone)
        const parsed = reader.parse()

        if (parsed && parsed.textContent.length > 300) {
          console.log("Sidequest: Standard Article detected.")
          setArticle({ ...parsed, type: "article" })
          setTimeout(() => setVisible(true), 1000)
        }
      } catch (err) {
        console.error("Sidequest: Readability failed", err)
        // Fallback: Still allow adding, just without text
        setArticle({ title: document.title, text: "", type: "unknown" })
        setTimeout(() => setVisible(true), 1000)
      }
    }

    // Wait 1s for DOM to settle (Fixes the ArXiv null error)
    const timer = setTimeout(handlePageLoad, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleAddToAtlas = async () => {
    setVisible(false)
    console.log("Sending to Backend:", article)
    
    await chrome.runtime.sendMessage({
      name: "ADD_TO_ATLAS",
      body: {
        title: article.title,
        url: window.location.href,
        text: article.text,
        type: article.type
      }
    })
    
    alert(`Added ${article.type} to Atlas!`)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-[2147483647]">
      <button 
        onClick={handleAddToAtlas}
        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-black transition-all border-2 border-yellow-400 animate-bounce-in cursor-pointer"
      >
        <span className="text-2xl">
          {article?.type === 'pdf' ? '📄' : article?.type === 'paper' ? '🎓' : '🧭'}
        </span>
        <span className="font-bold">Add to Atlas</span>
      </button>
    </div>
  )
}

export default AtlasClipper