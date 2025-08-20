export interface SEOMetaTags {
  title: string
  description: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterSite?: string
  twitterCreator?: string
  canonical?: string
  robots?: string
  lang?: string
}

export interface PageSEO {
  [key: string]: {
    en: SEOMetaTags
    'pt-br': SEOMetaTags
  }
}