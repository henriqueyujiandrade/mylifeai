import { useEffect } from 'react'
import { useLanguage } from './useLanguage'
import { seoConfig, getStructuredData } from '../../app/config/seo'
import type { Language } from '../types/i18n.types'

export function useSEO(page: string) {
  const { language } = useLanguage()

  useEffect(() => {
    const seoData = seoConfig[page]?.[language] || seoConfig['/'][language]
    
    // Update document title
    document.title = seoData.title

    // Update lang attribute on html element
    document.documentElement.lang = seoData.lang || language

    // Update or create meta tags
    updateMetaTag('description', seoData.description)
    updateMetaTag('keywords', seoData.keywords)
    updateMetaTag('robots', seoData.robots || 'index, follow')
    
    // Open Graph tags
    updateMetaTag('og:title', seoData.ogTitle || seoData.title, 'property')
    updateMetaTag('og:description', seoData.ogDescription || seoData.description, 'property')
    updateMetaTag('og:image', seoData.ogImage, 'property')
    updateMetaTag('og:url', seoData.ogUrl, 'property')
    updateMetaTag('og:type', 'website', 'property')
    updateMetaTag('og:locale', language === 'pt-br' ? 'pt_BR' : 'en_US', 'property')

    // Twitter Card tags
    updateMetaTag('twitter:card', seoData.twitterCard || 'summary')
    updateMetaTag('twitter:site', seoData.twitterSite)
    updateMetaTag('twitter:creator', seoData.twitterCreator)
    updateMetaTag('twitter:title', seoData.ogTitle || seoData.title)
    updateMetaTag('twitter:description', seoData.ogDescription || seoData.description)
    updateMetaTag('twitter:image', seoData.ogImage)

    // Canonical URL
    updateLinkTag('canonical', seoData.canonical)

    // Structured Data
    updateStructuredData(getStructuredData(page, language as Language))

    // Cleanup function to avoid memory leaks
    return () => {
      // Optional: could clean up meta tags if needed
    }
  }, [page, language])
}

function updateMetaTag(name: string, content?: string, attribute: 'name' | 'property' = 'name') {
  if (!content) return

  let element = document.querySelector(`meta[${attribute}="${name}"]`)
  
  if (element) {
    element.setAttribute('content', content)
  } else {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    element.setAttribute('content', content)
    document.head.appendChild(element)
  }
}

function updateLinkTag(rel: string, href?: string) {
  if (!href) return

  let element = document.querySelector(`link[rel="${rel}"]`)
  
  if (element) {
    element.setAttribute('href', href)
  } else {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    element.setAttribute('href', href)
    document.head.appendChild(element)
  }
}

function updateStructuredData(jsonLD: string) {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  // Add new structured data
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = jsonLD
  document.head.appendChild(script)
}