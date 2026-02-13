'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCurrency } from '@/contexts/currency-context';
import { useAddToCart } from '@/lib/hooks/useAddToCart';
import { FavoriteButton } from '@/components/product/favorite-button';
import type { ShopifyProduct } from '@/lib/types/shopify';

export interface ProductCardProps {
    product: ShopifyProduct | any;
    variant?: 'grid' | 'bundle';
    showVariants?: boolean;
    showFavorite?: boolean;
    showAddToCart?: boolean;
    showDescription?: boolean;
    showBadge?: boolean;
    badgeText?: string;
    animate?: boolean;
    // For bundle mode
    onAddToBundle?: (product: ShopifyProduct, variantId: string) => void;
    isInBundle?: boolean;
    // External cart handling
    onAddToCart?: (variantId: string) => void;
    isAddingToCart?: boolean;
}

export function ProductCard({
    product,
    variant = 'grid',
    showVariants = true,
    showFavorite = true,
    showAddToCart = true,
    showDescription = false,
    showBadge = true,
    badgeText,
    animate = true,
    onAddToBundle,
    isInBundle = false,
    onAddToCart,
    isAddingToCart: externalAddingToCart,
}: ProductCardProps) {
    const router = useRouter();
    const { formatPrice } = useCurrency();
    const { handleAddToCart: internalAddToCart, isAdding } = useAddToCart();

    const image = product.featuredImage?.url || product.images?.edges?.[0]?.node?.url;
    const isNew = product.tags?.some((t: string) =>
        ['new', 'nuevo', 'bestseller', 'mas vendidos', 'best-seller'].includes(t.toLowerCase())
    );

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

    // Determine initial variant (prefer 100ml + Extrait)
    const initialVariant = useMemo(() => {
        const exactMatch = variants.find((v: any) =>
            v.availableForSale &&
            v.selectedOptions?.some((opt: any) => opt.value === '100ml') &&
            v.selectedOptions?.some((opt: any) => opt.value === 'Extrait')
        );
        if (exactMatch) return exactMatch;

        const sizeMatch = variants.find((v: any) =>
            v.availableForSale &&
            v.selectedOptions?.some((opt: any) => opt.value === '100ml')
        );
        if (sizeMatch) return sizeMatch;

        return variants.find((v: any) => v.availableForSale) || variants[0];
    }, [variants]);

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        initialVariant?.selectedOptions?.forEach((opt: any) => {
            initial[opt.name] = opt.value;
        });
        return initial;
    });

    const selectedVariant = useMemo(() => {
        return variants.find((v: any) =>
            v.selectedOptions?.every((opt: any) =>
                selectedOptions[opt.name] === opt.value
            )
        ) || initialVariant;
    }, [variants, selectedOptions, initialVariant]);

    const price = selectedVariant?.price?.amount || '0';
    const hasVariants = variants.length > 1 && options.length > 0;
    const isAddingToCart = externalAddingToCart ?? isAdding(selectedVariant?.id);

    const handleOptionChange = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
    };

    // Extract inspiration brand - Try multiple paths/formats
    let inspirationBrand: string | null = null;

    // Try metafields array format (from GraphQL queries)
    if (product.metafields && Array.isArray(product.metafields)) {
        const metafield = product.metafields.find((m: any) =>
            m && m.key === 'inspiration_brand' && m.value
        );
        if (metafield?.value) {
            inspirationBrand = metafield.value;
        }
    }

    // Try edges format (some API responses)
    if (!inspirationBrand && product.metafields?.edges) {
        const edge = product.metafields.edges.find((e: any) =>
            e?.node?.key === 'inspiration_brand' && e?.node?.value
        );
        if (edge?.node?.value) {
            inspirationBrand = edge.node.value;
        }
    }

    // Fallback: Try to extract from description if not found in metafields
    if (!inspirationBrand && product.description) {
        // Match patterns like "Inspired by: Brand Name" or "Inspired by Brand Name"
        const match = product.description.match(/Inspired\s+by[:\s]+([^,\n.<]+)/i);
        if (match && match[1]) {
            inspirationBrand = match[1].trim();
        }
    }

    const handleAddToBag = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedVariant?.id || !selectedVariant?.availableForSale || isAddingToCart) return;

        if (onAddToCart) {
            onAddToCart(selectedVariant.id);
        } else {
            internalAddToCart(selectedVariant.id, 1);
        }
    };

    const handleBundleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToBundle && selectedVariant?.id) {
            onAddToBundle(product, selectedVariant.id);
        }
    };

    const displayBadge = badgeText || (isNew && showBadge ? 'NEW' : null);

    const CardWrapper = animate ? motion.div : 'div';
    const animationProps = animate ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    } : {};

    return (
        <CardWrapper
            {...animationProps}
            onClick={() => router.push(`/products/${product.handle ?? '#'}`)}
            className="w-full h-full flex flex-col gap-1 relative group cursor-pointer"
        >
            {/* Product Image */}
            <div className="w-full p-1.5 sm:p-3 lg:p-5 aspect-square lg:shrink shrink-0 flex items-end relative rounded-lg overflow-hidden transition-colors duration-300 ease-linear bg-muted hover:bg-background shadow-sm">
                <figure className="w-full absolute inset-0 h-full flex items-center justify-center">
                    {image ? (
                        <img
                            src={image}
                            alt={product.title}
                            className="h-full w-full object-cover group-hover:scale-[1.075] duration-500 ease-[cubic-bezier(0.5,1,0.89,1)]"
                            loading="lazy"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted-foreground/10">
                            <p className="text-muted-foreground text-center text-xs">No image</p>
                        </div>
                    )}
                </figure>

                {/* Favorite Button */}
                {showFavorite && (
                    <div className="absolute top-2 right-2 lg:top-5 lg:right-5 z-10">
                        <FavoriteButton productId={product.id} size={16} />
                    </div>
                )}

                <div className="flex items-end justify-between relative w-full">
                    <div className="w-full flex gap-1.5">
                        {displayBadge && (
                            <div className="w-max rounded-xs px-1 lg:px-1.5 font-medium h-4 lg:h-5 flex items-center bg-primary text-primary-foreground capitalize text-[9px] lg:text-[11px] leading-[calc(13/11)] shrink-0">
                                {displayBadge}
                            </div>
                        )}
                    </div>
                </div>

                {/* Add To Bag Button */}
                {showAddToCart && variant === 'grid' && (
                    <div className="absolute right-2 bottom-2 lg:right-5 lg:bottom-5 h-[32px] lg:h-[39px] shrink-0 z-10 w-max flex justify-end add-to-bag-container">
                        <div className="add-to-bag-shell relative h-full bg-background rounded-sm border border-border transition-colors duration-300 ease-linear w-max shadow-sm">
                            <button
                                type="button"
                                aria-label="Add to bag"
                                onClick={handleAddToBag}
                                disabled={!selectedVariant?.availableForSale || isAddingToCart}
                                className="add-to-bag-button relative h-full disabled:cursor-wait disabled:opacity-50"
                            >
                                <span className="sr-only">Add To Bag</span>
                                <span className="absolute right-0 bottom-0 h-[32px] lg:h-[39px] w-[36px] lg:w-[42px] flex items-center justify-center">
                                    {isAddingToCart ? (
                                        <svg className="w-[13px] lg:w-[15px] h-[13px] lg:h-[15px] animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-[13px] lg:w-[15px] h-[13px] lg:h-[15px]" viewBox="0 0 15 15" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11.8917 12.8029C11.7866 13.2938 11.3469 13.6496 10.845 13.6496H3.60293C3.10104 13.6496 2.66135 13.2938 2.55625 12.8029L1.09776 5.97302C1.02913 5.65682 1.10741 5.32991 1.31117 5.07802C1.51493 4.82506 1.81843 4.68036 2.14337 4.68036H12.3045C12.6284 4.68036 12.933 4.82506 13.1367 5.07802C13.3405 5.32991 13.4188 5.65682 13.3501 5.97302L11.8917 12.8029ZM7.22512 1.5972C8.2482 1.5972 9.16727 2.41932 9.5469 3.608H4.9044C5.28404 2.40753 6.19345 1.5972 7.22512 1.5972ZM13.9696 4.40385C13.561 3.89901 12.954 3.60854 12.3041 3.60854H10.6505C10.2076 1.78317 8.84023 0.525879 7.22516 0.525879C5.61868 0.525879 4.24169 1.78638 3.79879 3.60854H2.14297C1.49309 3.60854 0.886096 3.89901 0.476432 4.40385C0.0689133 4.9087 -0.0876598 5.56253 0.047465 6.19707L1.50595 13.0269C1.71615 14.0087 2.59768 14.7215 3.60253 14.7215H10.8446C11.8494 14.7215 12.731 14.0087 12.9412 13.0269L14.3996 6.19707C14.5348 5.56253 14.3782 4.9087 13.9696 4.40385Z" fill="currentColor"></path>
                                        </svg>
                                    )}
                                </span>
                            </button>
                        </div>
                        <div className="add-to-bag-label absolute top-0 left-0 h-full w-max px-[15px] flex items-center pointer-events-none transition-opacity duration-300 ease-linear opacity-0">
                            <p className="text-sm font-normal">+ Add To Bag</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="w-full flex-1 rounded-lg px-2.5 py-2 sm:px-4 sm:py-3 lg:py-4.5 flex flex-col transition-colors duration-200 ease-linear bg-background hover:bg-primary shadow-sm group/info">
                <div className="w-full flex justify-between items-start gap-1">
                    <div className="flex flex-col min-w-0 flex-1 min-h-[40px] sm:min-h-[48px] lg:min-h-[52px]">
                        <h3 className="text-[13px] sm:text-[15px] lg:text-[17px] leading-tight font-medium font-display text-foreground group-hover/info:text-primary-foreground transition-colors line-clamp-1">
                            {product.title}
                        </h3>
                        <p className="text-[9px] sm:text-[11px] leading-tight font-sans text-muted-foreground/80 group-hover/info:text-primary-foreground/80 transition-colors mt-1 uppercase tracking-wide line-clamp-1">
                            {inspirationBrand ? `Inspired by ${inspirationBrand}` : '\u00A0'}
                        </p>
                    </div>
                    <p className="text-[13px] sm:text-[15px] lg:text-[17px] leading-tight font-medium font-display text-foreground group-hover/info:text-primary-foreground transition-colors shrink-0">
                        <span className="font-display font-medium">
                            {formatPrice(price)}
                        </span>
                    </p>
                </div>

                {/* Description (optional) */}
                {showDescription && product.description && (
                    <p className="text-[11px] sm:text-[13px] leading-tight font-normal text-muted-foreground group-hover/info:text-primary-foreground/70 mt-1 line-clamp-2">
                        {product.description.replace(/<[^>]*>/g, '').substring(0, 80)}...
                    </p>
                )}

                {/* Custom Variant Selectors (Size & Extract) */}
                {showVariants && hasVariants && (
                    <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                        {/* Size Selector */}
                        {options.find(opt => opt.name === 'Size' || opt.name === 'Tamaño') && (
                            <div className="flex bg-muted/50 p-0.5 rounded-lg w-max border border-border">
                                {options.find(opt => opt.name === 'Size' || opt.name === 'Tamaño')?.values.map((size) => {
                                    const optionName = options.find(opt => opt.name === 'Size' || opt.name === 'Tamaño')?.name || 'Size';
                                    const isSelected = selectedOptions[optionName] === size;
                                    return (
                                        <button
                                            key={size}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOptionChange(optionName, size);
                                            }}
                                            className={`px-3 py-1 text-[10px] rounded-md transition-all font-medium ${isSelected
                                                ? 'bg-background text-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Extract Checkbox */}
                        {options.find(opt => /concen?tration|concentración|^type$|^tipo$|strength|intensidad/i.test(opt.name)) && (
                            <label className="flex items-center gap-2 cursor-pointer group/checkbox w-max px-1">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={
                                            selectedOptions['Concentration'] === 'Extrait' ||
                                            selectedOptions['Type'] === 'Extrait' ||
                                            selectedOptions['Concentración'] === 'Extrait' ||
                                            Object.entries(selectedOptions).some(([key, val]) =>
                                                /concen?tration|concentración|^type$|^tipo$|strength|intensidad/i.test(key) && val === 'Extrait'
                                            )
                                        }
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            const optName = options.find(opt => /concen?tration|concentración|^type$|^tipo$|strength|intensidad/i.test(opt.name))?.name;
                                            if (optName) {
                                                handleOptionChange(optName, e.target.checked ? 'Extrait' : 'Classic');
                                            }
                                        }}
                                    />
                                    <div className="w-4 h-4 border border-primary/50 rounded bg-background peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center shadow-sm">
                                        <Check className="w-3 h-3 text-background opacity-0 peer-checked:opacity-100 font-bold" strokeWidth={3} />
                                    </div>
                                </div>
                                <span className="text-[10px] font-medium text-muted-foreground group-hover/checkbox:text-primary transition-colors select-none">
                                    Add Extract (Longer Duration)
                                </span>
                            </label>
                        )}

                        {/* Fallback for other options */}
                        {options.filter(opt => !/^(size|tamaño|concen?tration|concentración|type|tipo|strength|intensidad)$/i.test(opt.name)).map((option) => (
                            <div key={option.name} className="flex flex-wrap gap-0.5 sm:gap-1 items-center">
                                <span className="text-[9px] sm:text-xs text-muted-foreground mr-0.5 sm:mr-1">{option.name}:</span>
                                {option.values.map((value) => (
                                    <button
                                        key={value}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOptionChange(option.name, value);
                                        }}
                                        className={`px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] border rounded transition-all ${selectedOptions[option.name] === value ? 'bg-foreground text-background' : 'bg-transparent border-border text-muted-foreground'}`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {/* Bundle Button (for bundle variant) */}
                {variant === 'bundle' && onAddToBundle && (
                    <button
                        onClick={handleBundleClick}
                        disabled={isInBundle || !selectedVariant?.availableForSale}
                        className={`mt-3 w-full py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${isInBundle
                            ? 'bg-primary text-primary-foreground cursor-default'
                            : !selectedVariant?.availableForSale
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                            }`}
                    >
                        {isInBundle ? (
                            <span className="flex items-center justify-center gap-2">
                                ✓ IN BUNDLE
                            </span>
                        ) : !selectedVariant?.availableForSale ? (
                            'OUT OF STOCK'
                        ) : (
                            'ADD TO BUNDLE'
                        )}
                    </button>
                )}
            </div>

            <style jsx>{`
        .add-to-bag-button {
          width: 36px;
          transition: width 550ms ease-in-out;
        }
        @media (min-width: 1024px) {
          .add-to-bag-button {
            width: 42px;
          }
        }
        .add-to-bag-button:hover {
          width: 138px;
        }
        .add-to-bag-label {
          opacity: 0;
          transition: opacity 300ms ease;
        }
        .add-to-bag-shell:has(.add-to-bag-button:hover) ~ .add-to-bag-label {
          opacity: 1;
          transition-delay: 150ms;
        }
      `}</style>
        </CardWrapper>
    );
}
