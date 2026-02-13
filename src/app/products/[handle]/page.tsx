import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/shopify';
import type { ShopifyProduct } from '@/lib/types/shopify';
import ProductPageContent from '@/components/product/product-page-content';

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  let product: ShopifyProduct | any = await getProduct(handle);

  // Fallback a datos mock cuando el producto por handle no existe en Shopify
  if (!product) {
    const mockProducts = [
      {
        handle: 'pasha-flare',
        title: 'Perfume Elegance Premium',
        description: 'A sophisticated fragrance with floral and citrus notes. This elegant perfume combines the freshness of bergamot with the warmth of jasmine, creating a perfect balance for any occasion.',
        images: {
          edges: [
            { node: { url: '/IDKO 1-100/4.png', altText: 'Perfume Elegance Premium' } },
            { node: { url: '/IDKO 1-100/5.png', altText: 'Perfume Elegance Premium Bottle' } },
            { node: { url: '/IDKO 1-100/6.png', altText: 'Perfume Elegance Premium Detail' } },
          ],
        },
        featuredImage: { url: '/IDKO 1-100/4.png' },
        variants: {
          edges: [
            { node: { id: 'variant-1', price: { amount: '89.99', currencyCode: 'EUR' }, availableForSale: true } },
          ],
        },
        tags: ['new', 'premium'],
      },
      {
        handle: 'eau-de-parfum-classic',
        title: 'Eau de Parfum Classic',
        description: 'Classic fragrance with touches of vanilla and sandalwood. A timeless scent that combines sweet vanilla notes with the woody warmth of sandalwood, perfect for those who appreciate traditional elegance.',
        images: {
          edges: [
            { node: { url: '/IDKO 1-100/17.png', altText: 'Eau de Parfum Classic' } },
            { node: { url: '/IDKO 1-100/18.png', altText: 'Eau de Parfum Classic Bottle' } },
          ],
        },
        featuredImage: { url: '/IDKO 1-100/17.png' },
        variants: {
          edges: [
            { node: { id: 'variant-2', price: { amount: '65.00', currencyCode: 'EUR' }, availableForSale: true } },
          ],
        },
        tags: ['bestseller'],
      },
      {
        handle: 'cologne-fresh-breeze',
        title: 'Cologne Fresh Breeze',
        description: 'Refreshing cologne perfect for everyday wear. This invigorating scent features crisp aquatic notes and fresh citrus, ideal for those who prefer a clean, energizing fragrance.',
        images: {
          edges: [
            { node: { url: '/IDKO 1-100/33.png', altText: 'Cologne Fresh Breeze' } },
            { node: { url: '/IDKO 1-100/34.png', altText: 'Cologne Fresh Breeze Bottle' } },
          ],
        },
        featuredImage: { url: '/IDKO 1-100/33.png' },
        variants: {
          edges: [
            { node: { id: 'variant-3', price: { amount: '45.50', currencyCode: 'EUR' }, availableForSale: true } },
          ],
        },
        tags: ['fresh', 'daily'],
      },
      {
        handle: 'luxury-oud-collection',
        title: 'Luxury Oud Collection',
        description: 'Exclusive fragrance with oud and oriental spices. An opulent blend of rare oud wood and exotic spices, creating a rich and captivating scent for special occasions.',
        images: {
          edges: [
            { node: { url: '/IDKO 1-100/48.png', altText: 'Luxury Oud Collection' } },
            { node: { url: '/IDKO 1-100/49.png', altText: 'Luxury Oud Collection Bottle' } },
          ],
        },
        featuredImage: { url: '/IDKO 1-100/48.png' },
        variants: {
          edges: [
            { node: { id: 'variant-4', price: { amount: '125.00', currencyCode: 'EUR' }, availableForSale: true } },
          ],
        },
        tags: ['luxury', 'oud'],
      },
    ];
    const fallback = mockProducts.find((p) => p.handle === handle);
    if (!fallback) return notFound();
    product = fallback;
  }

  return <ProductPageContent product={product} />;
}