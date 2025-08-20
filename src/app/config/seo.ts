import type { PageSEO } from '../../shared/types/seo.types'

const baseUrl = 'https://mylife-ai.com' // Ajustar para a URL de produção

export const seoConfig: PageSEO = {
  '/': {
    en: {
      title: 'MyLife.AI - Modern React TypeScript Application',
      description: 'A modern, responsive web application built with React 19, TypeScript, and advanced theming. Features cutting-edge technologies and best practices for 2025.',
      keywords: 'React, TypeScript, Vite, TanStack, Tailwind CSS, Modern Web Development, Responsive Design, Dark Mode, Light Mode',
      ogTitle: 'MyLife.AI - Modern React TypeScript Application',
      ogDescription: 'Experience the future of web development with our modern React TypeScript application featuring advanced theming and responsive design.',
      ogImage: `${baseUrl}/og-image.jpg`,
      ogUrl: baseUrl,
      twitterCard: 'summary_large_image',
      twitterSite: '@mylifeai',
      canonical: baseUrl,
      robots: 'index, follow',
      lang: 'en',
    },
    'pt-br': {
      title: 'MyLife.AI - Aplicação Moderna React TypeScript',
      description: 'Uma aplicação web moderna e responsiva construída com React 19, TypeScript e sistema avançado de temas. Com tecnologias de ponta e melhores práticas para 2025.',
      keywords: 'React, TypeScript, Vite, TanStack, Tailwind CSS, Desenvolvimento Web Moderno, Design Responsivo, Modo Escuro, Modo Claro',
      ogTitle: 'MyLife.AI - Aplicação Moderna React TypeScript',
      ogDescription: 'Experimente o futuro do desenvolvimento web com nossa aplicação moderna React TypeScript com sistema avançado de temas e design responsivo.',
      ogImage: `${baseUrl}/og-image.jpg`,
      ogUrl: baseUrl,
      twitterCard: 'summary_large_image',
      twitterSite: '@mylifeai',
      canonical: baseUrl,
      robots: 'index, follow',
      lang: 'pt-br',
    },
  },
  '/about': {
    en: {
      title: 'About MyLife.AI - Modern React Development Showcase',
      description: 'Learn about MyLife.AI, a showcase of modern React development practices, responsive design, and advanced theming built with React 19, TypeScript, and Vite.',
      keywords: 'About MyLife.AI, React 19, TypeScript, Vite, Modern Development, Responsive Design, Advanced Theming, Technology Stack',
      ogTitle: 'About MyLife.AI - Modern React Development Showcase',
      ogDescription: 'Discover the technology stack and features behind MyLife.AI - a modern React TypeScript application.',
      ogImage: `${baseUrl}/og-image-about.jpg`,
      ogUrl: `${baseUrl}/about`,
      twitterCard: 'summary_large_image',
      canonical: `${baseUrl}/about`,
      robots: 'index, follow',
      lang: 'en',
    },
    'pt-br': {
      title: 'Sobre MyLife.AI - Demonstração de Desenvolvimento React Moderno',
      description: 'Conheça o MyLife.AI, uma demonstração das práticas modernas de desenvolvimento React, design responsivo e sistema avançado de temas com React 19, TypeScript e Vite.',
      keywords: 'Sobre MyLife.AI, React 19, TypeScript, Vite, Desenvolvimento Moderno, Design Responsivo, Sistema Avançado de Temas, Stack Tecnológica',
      ogTitle: 'Sobre MyLife.AI - Demonstração de Desenvolvimento React Moderno',
      ogDescription: 'Descubra a stack tecnológica e funcionalidades por trás do MyLife.AI - uma aplicação moderna React TypeScript.',
      ogImage: `${baseUrl}/og-image-about.jpg`,
      ogUrl: `${baseUrl}/about`,
      twitterCard: 'summary_large_image',
      canonical: `${baseUrl}/about`,
      robots: 'index, follow',
      lang: 'pt-br',
    },
  },
  '/login': {
    en: {
      title: 'Sign In - MyLife.AI',
      description: 'Sign in to your MyLife.AI account. Experience modern form handling with React Hook Form, Zod validation, and advanced TypeScript integration.',
      keywords: 'Login, Sign In, Authentication, React Hook Form, Zod Validation, TypeScript, Modern Forms',
      ogTitle: 'Sign In - MyLife.AI',
      ogDescription: 'Access your MyLife.AI account with our modern, secure authentication system.',
      ogImage: `${baseUrl}/og-image-login.jpg`,
      ogUrl: `${baseUrl}/login`,
      twitterCard: 'summary',
      canonical: `${baseUrl}/login`,
      robots: 'noindex, nofollow', // Login pages typically shouldn't be indexed
      lang: 'en',
    },
    'pt-br': {
      title: 'Entrar - MyLife.AI',
      description: 'Entre na sua conta MyLife.AI. Experimente o manuseio moderno de formulários com React Hook Form, validação Zod e integração avançada com TypeScript.',
      keywords: 'Login, Entrar, Autenticação, React Hook Form, Validação Zod, TypeScript, Formulários Modernos',
      ogTitle: 'Entrar - MyLife.AI',
      ogDescription: 'Acesse sua conta MyLife.AI com nosso sistema de autenticação moderno e seguro.',
      ogImage: `${baseUrl}/og-image-login.jpg`,
      ogUrl: `${baseUrl}/login`,
      twitterCard: 'summary',
      canonical: `${baseUrl}/login`,
      robots: 'noindex, nofollow',
      lang: 'pt-br',
    },
  },
}

// Structured Data
export const getStructuredData = (page: string, lang: 'en' | 'pt-br') => {
  const siteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MyLife.AI',
    url: baseUrl,
    description: seoConfig[page]?.[lang]?.description || seoConfig['/'][lang].description,
    inLanguage: lang,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MyLife.AI',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://github.com/mylifeai',
      'https://twitter.com/mylifeai',
      'https://linkedin.com/company/mylifeai',
    ],
  }

  if (page === '/') {
    return JSON.stringify([siteData, organizationData])
  }

  return JSON.stringify(siteData)
}