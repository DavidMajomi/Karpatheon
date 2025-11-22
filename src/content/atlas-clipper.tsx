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
  const [visible, setVisible] = useState(false)
  
  // DEBUG: Force it visible initially to prove the UI works
  // const [visible, setVisible] = useState(true) 

  useEffect(() => {
    console.log("Sidequest: Scout script loaded.")
    
    try {
      const documentClone = document.cloneNode(true) as Document
      const reader = new Readability(documentClone)
      const parsed = reader.parse()

      console.log("Sidequest: Readability result:", parsed)

      if (parsed && parsed.textContent.length > 200) { // Lowered threshold for testing
        console.log("Sidequest: Article detected! Showing button.")
        // Delay to prevent fighting with page load
        setTimeout(() => setVisible(true), 1000)
      } else {
        console.log("Sidequest: Page content too short or not an article.")
      }
    } catch (err) {
      console.error("Sidequest: Scraper crashed", err)
    }
  }, [])

  const handleAddToAtlas = async () => {
    console.log("Sidequest: Button clicked")
    setVisible(false)
    // Add your sendMessage logic here
    alert("Added to Atlas!") 
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999]"> {/* High Z-Index is critical */}
      <button 
        onClick={handleAddToAtlas}
        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-black transition-all border-2 border-yellow-400 animate-bounce-in"
      >
        <span className="text-2xl">🧭</span>
        <span className="font-bold">Add to Atlas</span>
      </button>
    </div>
  )
}

export default AtlasClipper