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
  // DEMO MODE: Set to true to show button on ALL pages for testing
  const DEMO_MODE = true

  const [visible, setVisible] = useState(DEMO_MODE)

  useEffect(() => {
    console.log("Sidequest: Scout script loaded.")

    // In demo mode, button is always visible - skip detection
    if (DEMO_MODE) {
      console.log("Sidequest: DEMO MODE - button always visible")
      return
    }

    try {
      // Check if we're on a PDF page
      if (document.contentType === "application/pdf") {
        console.warn("Sidequest: PDF detected - content scripts don't work in PDFs by default")
        return
      }

      // Check if document has a valid body
      if (!document.body) {
        console.warn("Sidequest: No document body found - cannot parse")
        return
      }

      // Fallback scraper for basic content extraction
      const fallbackScrape = () => {
        const title = document.title
        const url = window.location.href
        const bodyText = document.body.innerText || ""

        console.log("Sidequest: Fallback scraper used")
        console.log("Sidequest: Title:", title)
        console.log("Sidequest: Content length:", bodyText.length)

        return {
          title,
          textContent: bodyText,
          length: bodyText.length
        }
      }

      let parsed = null
      let usedFallback = false

      // Try Readability first
      try {
        const documentClone = document.cloneNode(true) as Document
        const reader = new Readability(documentClone)
        parsed = reader.parse()
        console.log("Sidequest: Readability result:", parsed)
      } catch (readabilityErr) {
        console.warn("Sidequest: Readability failed, using fallback scraper", readabilityErr)
        parsed = fallbackScrape()
        usedFallback = true
      }

      if (parsed && parsed.textContent && parsed.textContent.length > 200) {
        console.log(`Sidequest: Article detected! (${usedFallback ? 'fallback' : 'readability'})`)
        setTimeout(() => setVisible(true), 1000)
      } else {
        console.log("Sidequest: Page content too short or not an article.")
      }
    } catch (err) {
      console.error("Sidequest: Scraper crashed", err)
      console.error("Sidequest: URL:", window.location.href)
      console.error("Sidequest: Content type:", document.contentType)
    }
  }, [DEMO_MODE])

  const handleAddToAtlas = async () => {
    console.log("Sidequest: Button clicked - extracting content...")

    // Extract content for the payload
    let payload = {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      content: null as any,
      method: "unknown"
    }

    try {
      // Try Readability first
      const documentClone = document.cloneNode(true) as Document
      const reader = new Readability(documentClone)
      const parsed = reader.parse()

      if (parsed) {
        payload.content = {
          title: parsed.title,
          byline: parsed.byline,
          excerpt: parsed.excerpt,
          textContent: parsed.textContent?.substring(0, 500) + "...", // First 500 chars
          contentLength: parsed.textContent?.length || 0,
          siteName: parsed.siteName,
          publishedTime: parsed.publishedTime
        }
        payload.method = "readability"
      }
    } catch (err) {
      console.warn("Sidequest: Readability failed, using fallback", err)

      // Fallback to basic scraping
      payload.content = {
        title: document.title,
        textContent: document.body.innerText?.substring(0, 500) + "...",
        contentLength: document.body.innerText?.length || 0
      }
      payload.method = "fallback"
    }

    console.log("🎯 PAYLOAD:", JSON.stringify(payload, null, 2))
    console.table({
      URL: payload.url,
      Title: payload.title,
      Method: payload.method,
      "Content Length": payload.content?.contentLength || 0
    })

    alert(`Added to Atlas!\n\nMethod: ${payload.method}\nContent: ${payload.content?.contentLength || 0} chars\n\nCheck console for full payload`)
    setVisible(false)
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
