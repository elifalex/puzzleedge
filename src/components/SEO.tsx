import { useEffect } from 'react';
import { Platform } from 'react-native';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

export function SEO({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = 'https://puzzleedge.app/assets/icon.png',
  ogType = 'website'
}: SEOProps) {
  const fullTitle = title.includes('PuzzleEdge') ? title : `${title} | PuzzleEdge`;
  const defaultKeywords = [
    'LinkedIn puzzles',
    'LinkedIn puzzle game',
    'LinkedIn Queens puzzle',
    'puzzle games',
    'brain teasers',
    'logic puzzles',
    'daily puzzles',
    'free puzzle games',
    'Queens puzzle',
    'brain games',
    'mind games',
    'puzzle challenge'
  ];
  const allKeywords = [...new Set([...keywords, ...defaultKeywords])].join(', ');

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Primary Meta Tags
    updateMeta('title', fullTitle);
    updateMeta('description', description);
    updateMeta('keywords', allKeywords);
    updateMeta('author', 'PuzzleEdge');
    updateMeta('theme-color', '#4F6EF7');

    // Open Graph
    updateMeta('og:type', ogType, true);
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:site_name', 'PuzzleEdge', true);
    if (canonicalUrl) {
      updateMeta('og:url', canonicalUrl, true);
    }

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);

    // SEO
    updateMeta('robots', 'index, follow');
    updateMeta('language', 'English');

    // Canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
    }

    // Schema.org structured data
    const schemaId = 'schema-org-data';
    let schemaScript = document.getElementById(schemaId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PuzzleEdge",
      "description": "Play LinkedIn Puzzles including Queens puzzle game. Free daily brain teasers and logic puzzles.",
      "url": canonicalUrl || "https://puzzleedge.app",
      "applicationCategory": "GameApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "genre": ["Puzzle", "Brain Games", "Logic Games"],
      "gamePlatform": "Web browser",
      "screenshot": ogImage
    });
  }, [fullTitle, description, allKeywords, canonicalUrl, ogImage, ogType]);

  return null;
}
