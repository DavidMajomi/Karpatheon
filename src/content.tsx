import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { Readability } from "@mozilla/readability"
import { useState, useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

/**
 * Generates a style element with adjusted CSS to work correctly within a Shadow DOM.
 *
 * Tailwind CSS relies on `rem` units, which are based on the root font size (typically defined on the <html>
 * or <body> element). However, in a Shadow DOM (as used by Plasmo), there is no native root element, so the
 * rem values would reference the actual page's root font size—often leading to sizing inconsistencies.
 *
 * To address this, we:
 * 1. Replace the `:root` selector with `:host(plasmo-csui)` to properly scope the styles within the Shadow DOM.
 * 2. Convert all `rem` units to pixel values using a fixed base font size, ensuring consistent styling
 *    regardless of the host page's font size.
 */
export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16

  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize

    return `${pixelsValue}px`
  })

  const styleElement = document.createElement("style")

  styleElement.textContent = updatedCssText

  return styleElement
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
    <div className="plasmo-fixed plasmo-bottom-6 plasmo-right-6 plasmo-z-[9999]">
      <button
        onClick={handleAddToAtlas}
        className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-900 plasmo-text-white plasmo-px-6 plasmo-py-4 plasmo-rounded-full plasmo-shadow-2xl hover:plasmo-bg-black plasmo-transition-all plasmo-border-2 plasmo-border-yellow-400 plasmo-animate-bounce-in"
      >
        <span className="plasmo-text-2xl">🧭</span>
        <span className="plasmo-font-bold">Add to Atlas</span>
      </button>
    </div>
  )
}

export default AtlasClipper
