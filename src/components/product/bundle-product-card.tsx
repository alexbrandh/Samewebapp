'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCurrency } from '@/contexts/currency-context';
import type { ShopifyProduct } from '@/lib/types/shopify';
import { Tag, Check } from 'phosphor-react';

interface BundleProductCardProps {
  product: ShopifyProduct;
  onAddToBundle: (product: ShopifyProduct, variantId: string) => void;
  isInBundle: boolean;
}

export function BundleProductCard({ product, onAddToBundle, isInBundle }: BundleProductCardProps) {
  const { formatPrice } = useCurrency();
  const image = product.images?.edges?.[0]?.node;

  // Get all variants
  const variants = useMemo(() =>
    product.variants?.edges?.map((edge: any) => edge.node) || [],
    [product.variants]
  );

  // Extract unique options
  const options = useMemo(() => {
    const optionsMap: Record<string, Set<string>> = {};
    variants.forEach((variant: any) => {
      variant.selectedOptions?.forEach((opt: any) => {
        if (!optionsMap[opt.name]) {
          optionsMap[opt.name] = new Set();
        }
        optionsMap[opt.name].add(opt.value);
      });
    });
    return Object.entries(optionsMap).map(([name, values]) => ({
      name,
      values: Array.from(values)
    }));
  }, [variants]);

  // Determine initial variant (prefer 100ml + Extrait if available)
  const initialVariant = useMemo(() => {
    // Try to find 100ml + Extrait
    const exactMatch = variants.find((v: any) =>
      v.availableForSale &&
      v.selectedOptions?.some((opt: any) => opt.value === '100ml') &&
      v.selectedOptions?.some((opt: any) => opt.value === 'Elixir' || opt.value === 'Extrait')
    );
    if (exactMatch) return exactMatch;

    // Try 100ml only
    const sizeMatch = variants.find((v: any) =>
      v.availableForSale &&
      v.selectedOptions?.some((opt: any) => opt.value === '100ml')
    );
    if (sizeMatch) return sizeMatch;

    // Fallback to first available
    return variants.find((v: any) => v.availableForSale) || variants[0];
  }, [variants]);

  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    initialVariant?.selectedOptions?.forEach((opt: any) => {
      initial[opt.name] = opt.value;
    });
    return initial;
  });

  // Find current variant based on selected options
  const selectedVariant = useMemo(() => {
    return variants.find((v: any) =>
      v.selectedOptions?.every((opt: any) =>
        selectedOptions[opt.name] === opt.value
      )
    ) || initialVariant;
  }, [variants, selectedOptions, initialVariant]);

  const price = selectedVariant?.price?.amount || product.priceRange.minVariantPrice.amount;
  const compareAtPrice = selectedVariant?.compareAtPrice;

  // Handle option selection
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  // Extract inspiration brand from metafields
  const inspirationBrand = product.metafields?.find((m: any) =>
    m && m.key === 'inspiration_brand'
  )?.value;

  // Extraer etiquetas relevantes
  // Tag Translation Helper
  const getDisplayTag = (tag: string | undefined) => {
    if (!tag) return null;
    const lower = tag.toLowerCase();
    if (lower === 'mujeres' || lower === 'women') return 'WOMEN';
    if (lower === 'hombres' || lower === 'men') return 'MEN';
    if (lower === 'unisex') return 'UNISEX';
    if (lower === 'nuevo' || lower === 'new') return 'NEW';
    if (lower === 'mas vendidos' || lower === 'best-seller' || lower === 'bestseller') return 'BEST SELLER';
    return tag;
  };

  const categoryTag = product.tags?.find(tag =>
    ['Mujeres', 'Hombres', 'Unisex', 'women', 'men', 'unisex'].includes(tag)
  );

  const displayCategoryTag = getDisplayTag(categoryTag);

  const specialTag = product.tags?.find(tag =>
    ['Nuevo', 'Mas vendidos', 'Best-seller', 'new', 'bestseller'].includes(tag)
  );

  const displaySpecialTag = getDisplayTag(specialTag);

  // Check if product has multiple variants
  const hasVariants = variants.length > 1 && options.length > 0;

  return (
    <div className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <Link href={`/products/${product.handle}`} className="block relative aspect-square overflow-hidden bg-muted">
        {image && (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Tags Overlay */}
        {(categoryTag || specialTag) && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {displayCategoryTag && (
              <span className="inline-block px-2 py-1 bg-background/90 backdrop-blur-sm text-foreground rounded text-xs font-medium">
                {displayCategoryTag}
              </span>
            )}
            {displaySpecialTag && (
              <span className="inline-block px-2 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded text-xs font-medium">
                {displaySpecialTag}
              </span>
            )}
          </div>
        )}

        {/* Discount Badge */}
        {compareAtPrice && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs font-bold">
              {Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(price)) / parseFloat(compareAtPrice.amount)) * 100)}% OFF
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/products/${product.handle}`} className="block mb-2">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Inspired By Tag (from metafield) */}
        {inspirationBrand && (
          <div className="mb-3 text-xs text-muted-foreground flex items-start gap-1">
            <Tag size={14} className="mt-0.5 shrink-0" weight="light" />
            <p className="line-clamp-2 uppercase tracking-wide">
              Inspired by {inspirationBrand}
            </p>
          </div>
        )}

        {/* Variant Selectors */}
        {hasVariants && (
          <div className="mb-3 space-y-2">
            {options.map((option) => (
              <div key={option.name}>
                <p className="text-xs text-muted-foreground mb-1.5">{option.name}:</p>
                <div className="flex flex-wrap gap-1">
                  {option.values.map((value) => {
                    const isSelected = selectedOptions[option.name] === value;
                    // Check if this option value is available with current other selections
                    const isAvailable = variants.some((v: any) => {
                      const testOptions = { ...selectedOptions, [option.name]: value };
                      return v.selectedOptions?.every((opt: any) =>
                        testOptions[opt.name] === opt.value
                      ) && v.availableForSale;
                    });

                    return (
                      <button
                        key={value}
                        onClick={() => handleOptionChange(option.name, value)}
                        disabled={!isAvailable && !isSelected}
                        className={`px-2 py-1 text-xs border rounded transition-all
                          ${isSelected
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-background text-foreground border-border hover:border-foreground'
                          }
                          ${!isAvailable && !isSelected ? 'opacity-40 cursor-not-allowed line-through' : ''}
                        `}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
              {formatPrice(price)}
            </span>
            {compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(compareAtPrice.amount)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Bundle Button */}
        <button
          onClick={() => onAddToBundle(product, selectedVariant?.id || variants[0]?.id)}
          disabled={isInBundle || !selectedVariant?.availableForSale}
          className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${isInBundle
            ? 'bg-primary text-primary-foreground cursor-default'
            : !selectedVariant?.availableForSale
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
            }`}
        >
          {isInBundle ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={18} weight="bold" />
              IN BUNDLE
            </span>
          ) : !selectedVariant?.availableForSale ? (
            'OUT OF STOCK'
          ) : (
            'ADD TO BUNDLE'
          )}
        </button>
      </div>
    </div>
  );
}
