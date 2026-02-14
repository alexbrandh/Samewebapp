import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/shopify';
import ProductPageContent from '@/components/product/product-page-content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'Este producto no está disponible en SAME.',
    };
  }

  const imageUrl = product.featuredImage?.url || product.images?.edges?.[0]?.node?.url;
  const price = product.variants?.edges?.[0]?.node?.price?.amount;
  const description = product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || `Compra ${product.title} de SAME. — Perfume de lujo accesible con envío a toda Colombia.`;

  return {
    title: `${product.title} — Perfume de Lujo`,
    description,
    alternates: {
      canonical: `${SITE_URL}/products/${handle}`,
    },
    openGraph: {
      title: `${product.title} | SAME. Perfumes`,
      description,
      type: 'website',
      siteName: 'SAME.',
      locale: 'es_CO',
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630, alt: product.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} — SAME.`,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) return notFound();

  // JSON-LD structured data for Google Shopping / rich results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description?.replace(/<[^>]*>/g, '').substring(0, 500),
    image: product.featuredImage?.url || product.images?.edges?.[0]?.node?.url,
    brand: { '@type': 'Brand', name: 'SAME.' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: product.priceRange?.minVariantPrice?.currencyCode || 'COP',
      lowPrice: product.priceRange?.minVariantPrice?.amount,
      highPrice: product.priceRange?.maxVariantPrice?.amount,
      availability: product.availableForSale !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'SAME.' },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageContent product={product} />
    </>
  );
}