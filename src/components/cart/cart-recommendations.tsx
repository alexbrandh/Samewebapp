'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { useCurrency } from '@/contexts/currency-context';
import { useAddToCart } from '@/lib/hooks/useAddToCart';
import { Plus, CircleNotch } from 'phosphor-react';
import type { ShopifyProduct } from '@/lib/types/shopify';

interface CartRecommendationsProps {
    excludeIds?: string[];
    maxItems?: number;
}

export function CartRecommendations({ excludeIds = [], maxItems = 3 }: CartRecommendationsProps) {
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();
    const { handleAddToCart, isAdding } = useAddToCart();

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                // Fetch products - returns { edges: [...] }
                const result = await getProducts(12);

                if (result?.edges) {
                    // Extract nodes from edges
                    const allProducts = result.edges.map((edge: any) => edge.node);

                    // Filter out products already in cart and shuffle
                    const availableProducts = allProducts
                        .filter((p: ShopifyProduct) => !excludeIds.includes(p.id))
                        .sort(() => Math.random() - 0.5)
                        .slice(0, maxItems);

                    setProducts(availableProducts);
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchRecommendations();
    }, [excludeIds.join(','), maxItems]);

    if (loading) {
        return (
            <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                    <CircleNotch size={14} className="animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Cargando sugerencias...</span>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="mt-4 pt-4 border-t border-border">
                <h3 className="text-xs font-semibold mb-2 uppercase tracking-wide text-muted-foreground">Completa Tu Colección</h3>
                <Link href="/collections/all" className="text-xs text-primary hover:underline">
                    Ver más perfumes →
                </Link>
            </div>
        );
    }

    const getVariantInfo = (product: ShopifyProduct) => {
        const variants = product.variants?.edges?.map((e: any) => e.node) || [];

        // Priority: 100ml + Extrait > 100ml + any > any Extrait > any available
        const preferred =
            // First try 100ml + Extrait
            variants.find((v: any) =>
                v.availableForSale &&
                v.selectedOptions?.some((opt: any) => opt.value === '100ml') &&
                v.selectedOptions?.some((opt: any) => opt.value === 'Extrait')
            ) ||
            // Then try 100ml with any type
            variants.find((v: any) =>
                v.availableForSale &&
                v.selectedOptions?.some((opt: any) => opt.value === '100ml')
            ) ||
            // Then try any size with Extrait
            variants.find((v: any) =>
                v.availableForSale &&
                v.selectedOptions?.some((opt: any) => opt.value === 'Extrait')
            ) ||
            // Fallback to any available variant
            variants.find((v: any) => v.availableForSale) ||
            variants[0];

        return preferred;
    };

    return (
        <div className="mt-4 pt-4 border-t border-border">
            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wide text-muted-foreground">También Te Puede Gustar</h3>
            <div className="space-y-2">
                {products.map((product) => {
                    const image = product.featuredImage?.url || product.images?.edges?.[0]?.node?.url;
                    const variant = getVariantInfo(product);
                    const price = variant?.price?.amount || product.priceRange?.minVariantPrice?.amount || '0';
                    const variantId = variant?.id;
                    const isCurrentlyAdding = variantId ? isAdding(variantId) : false;

                    return (
                        <div
                            key={product.id}
                            className="flex items-center gap-3 group p-1.5 -mx-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <Link
                                href={`/products/${product.handle}`}
                                className="w-12 h-12 bg-muted rounded-md overflow-hidden shrink-0 border border-border"
                            >
                                {image ? (
                                    <Image
                                        src={image}
                                        alt={product.title}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                        <span className="text-[8px] text-muted-foreground">No img</span>
                                    </div>
                                )}
                            </Link>

                            <div className="flex-1 min-w-0">
                                <Link href={`/products/${product.handle}`}>
                                    <h4 className="text-xs font-medium line-clamp-1 group-hover:text-primary transition-colors">
                                        {product.title}
                                    </h4>
                                </Link>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {formatPrice(price)}
                                </p>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (variantId) {
                                        handleAddToCart(variantId, 1);
                                    }
                                }}
                                disabled={isCurrentlyAdding || !variant?.availableForSale}
                                className="w-7 h-7 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all shrink-0 disabled:opacity-50 disabled:cursor-wait"
                                aria-label={`Add ${product.title} to cart`}
                            >
                                {isCurrentlyAdding ? (
                                    <CircleNotch size={12} className="animate-spin" />
                                ) : (
                                    <Plus size={12} weight="bold" />
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
