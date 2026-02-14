import React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

// ─── Organization Schema ────────────────────────────────────────────────────
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SAME.',
    url: SITE_URL,
    logo: `${SITE_URL}/2.png`,
    description: 'Fragancias de lujo que se sienten premium sin el precio exclusivo. Casa de perfumes colombiana con envíos a todo el país.',
    email: 'contact@sameperfumes.com',
    sameAs: [
      'https://www.instagram.com/sameperfumes',
      'https://www.tiktok.com/@sameperfumes',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@sameperfumes.com',
      contactType: 'customer service',
      availableLanguage: ['Spanish'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CO',
      addressLocality: 'Colombia',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Local Business Schema (GEO SEO) ───────────────────────────────────────
export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'SAME. Perfumes',
    url: SITE_URL,
    logo: `${SITE_URL}/2.png`,
    image: `${SITE_URL}/2.png`,
    description: 'Tienda online de perfumes de lujo accesible en Colombia. Fragancias inspiradas en las marcas más icónicas del mundo con envío a todo el país.',
    email: 'contact@sameperfumes.com',
    priceRange: '$$',
    currenciesAccepted: 'COP',
    paymentAccepted: 'Visa, MasterCard, Nequi, Daviplata, PSE',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 4.711,
      longitude: -74.0721,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Colombia',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Perfumes SAME.',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Eau de Parfum SAME.',
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Website Schema with SearchAction ───────────────────────────────────────
export function WebsiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SAME.',
    url: SITE_URL,
    description: 'Fragancias de lujo que se sienten premium sin el precio exclusivo',
    inLanguage: 'es-CO',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/collections/all?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Product Schema ─────────────────────────────────────────────────────────
interface ProductJsonLdProps {
  product: {
    title: string;
    handle: string;
    description?: string;
    featuredImage?: { url: string; altText?: string };
    images?: { edges: Array<{ node: { url: string } }> };
    variants?: { edges: Array<{ node: { price: { amount: string; currencyCode: string }; availableForSale: boolean } }> };
    tags?: string[];
    vendor?: string;
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const imageUrl = product.featuredImage?.url || product.images?.edges?.[0]?.node?.url;
  const variants = product.variants?.edges?.map(e => e.node) || [];
  const minPrice = variants.length > 0
    ? Math.min(...variants.map(v => parseFloat(v.price.amount)))
    : 0;
  const maxPrice = variants.length > 0
    ? Math.max(...variants.map(v => parseFloat(v.price.amount)))
    : 0;
  const currency = variants[0]?.price?.currencyCode || 'COP';
  const isAvailable = variants.some(v => v.availableForSale);

  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description?.replace(/<[^>]*>/g, '') || `Perfume ${product.title} de SAME. — Fragancia de lujo accesible`,
    url: `${SITE_URL}/products/${product.handle}`,
    brand: {
      '@type': 'Brand',
      name: 'SAME.',
    },
    category: 'Perfumes',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: currency,
      lowPrice: minPrice,
      highPrice: maxPrice,
      offerCount: variants.length,
      availability: isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'SAME.',
      },
    },
  };

  if (imageUrl) {
    data.image = imageUrl;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── FAQ Schema ─────────────────────────────────────────────────────────────
interface FAQJsonLdProps {
  items: Array<{ question: string; answer: string }>;
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── BreadcrumbList Schema ──────────────────────────────────────────────────
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Collection/ItemList Schema ─────────────────────────────────────────────
interface CollectionJsonLdProps {
  name: string;
  description?: string;
  url: string;
  products: Array<{
    title: string;
    handle: string;
    featuredImage?: { url: string };
    variants?: { edges: Array<{ node: { price: { amount: string; currencyCode: string } } }> };
  }>;
}

export function CollectionJsonLd({ name, description, url, products }: CollectionJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description: description || `Colección ${name} de SAME. — Perfumes de lujo accesible en Colombia`,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/products/${product.handle}`,
        name: product.title,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
