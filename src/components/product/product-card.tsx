'use client';

import { useState, useMemo, useId } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CircleNotch, Tote } from 'phosphor-react';
import { useCurrency } from '@/contexts/currency-context';
import { useAddToCart } from '@/lib/hooks/useAddToCart';
import { FavoriteButton } from '@/components/product/favorite-button';
import type { ShopifyProduct } from '@/lib/types/shopify';

const getConcentrationDisplay = (value: string) => {
    const lower = value.toLowerCase();
    if (lower === 'extrait' || lower === 'elixir') return 'Elixir';
    if (lower === 'classic' || lower === 'au parfum') return 'Au Parfum';
    return value;
};

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
    const uid = useId();
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
            v.selectedOptions?.some((opt: any) => opt.value === 'Elixir' || opt.value === 'Extrait')
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

    // Fallback: Try to extract from description
    if (!inspirationBrand && product.description) {
        // Spanish: "Inspirado en Aventus de Creed" → extract "Creed"
        const esMatch = product.description.match(/Inspirado\s+en\s+.+?\s+de\s+([^.,\n]+)/i);
        if (esMatch && esMatch[1]) {
            inspirationBrand = esMatch[1].trim();
        }
        // English fallback: "Inspired by Brand Name"
        if (!inspirationBrand) {
            const enMatch = product.description.match(/Inspired\s+by[:\s]+([^,\n.<]+)/i);
            if (enMatch && enMatch[1]) {
                inspirationBrand = enMatch[1].trim();
            }
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

    const sizeOption = options.find(opt => opt.name === 'Size' || opt.name === 'Tamaño');
    const concentrationOption = options.find(opt => /concen?tration|concentración|^type$|^tipo$|strength|intensidad/i.test(opt.name));
    const otherOptions = options.filter(opt => opt !== sizeOption && opt !== concentrationOption);

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
            className="w-full h-full flex flex-col relative group cursor-pointer rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(255,255,255,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] transition-shadow duration-300 border border-border/30"
        >
            {/* Product Image */}
            <div className="w-full aspect-square relative overflow-hidden bg-muted shrink-0">
                {image ? (
                    <Image
                        src={image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted-foreground/10">
                        <p className="text-muted-foreground text-center text-xs">Sin imagen</p>
                    </div>
                )}

                {/* Badge */}
                {displayBadge && (
                    <div className="absolute top-2.5 left-2.5 lg:top-3 lg:left-3 z-10">
                        <span className="px-1.5 py-0.5 lg:px-2 text-[9px] lg:text-[10px] font-semibold uppercase tracking-widest bg-foreground/90 text-background backdrop-blur-sm rounded-sm">
                            {displayBadge}
                        </span>
                    </div>
                )}

                {/* Inspiration Brand Label */}
                {inspirationBrand && (
                    <div className={`absolute left-2.5 lg:left-3 z-10 max-w-[calc(100%-3.5rem)] ${displayBadge ? 'top-8 lg:top-9' : 'top-2.5 lg:top-3'}`}>
                        <span className="px-1.5 py-0.5 text-[8px] lg:text-[9px] font-medium tracking-wider uppercase bg-black/50 text-white/90 backdrop-blur-sm rounded-sm leading-tight block truncate">
                            Inspirado en <span className="font-semibold text-white">{inspirationBrand}</span>
                        </span>
                    </div>
                )}

                {/* Favorite Button */}
                {showFavorite && (
                    <div className="absolute top-2.5 right-2.5 lg:top-3 lg:right-3 z-10">
                        <FavoriteButton productId={product.id} size={16} />
                    </div>
                )}

                {/* Add To Bag */}
                {showAddToCart && variant === 'grid' && (
                    <div className="absolute right-2.5 bottom-2.5 lg:right-3 lg:bottom-3 z-10">
                        <button
                            type="button"
                            aria-label="Agregar al carrito"
                            onClick={handleAddToBag}
                            disabled={!selectedVariant?.availableForSale || isAddingToCart}
                            className="h-8 w-8 lg:h-9 lg:w-9 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-full border border-border/30 shadow-sm hover:bg-background hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isAddingToCart ? (
                                <CircleNotch size={16} weight="bold" className="animate-spin" />
                            ) : (
                                <Tote size={16} weight="light" />
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col bg-background group-hover:bg-[#ede8d0] transition-colors duration-200">
                <div className="flex justify-between items-start gap-2 mb-0.5">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-[13px] sm:text-sm lg:text-[15px] leading-tight font-semibold font-display text-foreground group-hover:text-[#222] transition-colors line-clamp-1">
                            {product.title}
                        </h3>
                    </div>
                    <span className="text-[13px] sm:text-sm lg:text-[15px] leading-tight font-semibold font-display text-foreground group-hover:text-[#222] transition-colors shrink-0">
                        {formatPrice(price)}
                    </span>
                </div>

                <div className="mb-auto" />

                {/* Description (optional) */}
                {showDescription && product.description && (
                    <p className="text-[11px] sm:text-xs leading-tight text-muted-foreground mt-1.5 line-clamp-2">
                        {product.description.replace(/<[^>]*>/g, '').substring(0, 80)}...
                    </p>
                )}

                {/* Variant Selectors */}
                {showVariants && hasVariants && (
                    <div className="mt-2 flex flex-wrap gap-1.5 items-center" onClick={(e) => e.stopPropagation()}>
                        {/* Concentration Toggle (Au Parfum / Elixir) — shown first */}
                        {concentrationOption && (
                            <div className="flex bg-muted/60 p-px rounded-full border border-border/50 overflow-hidden">
                                {concentrationOption.values.map((val) => {
                                    const isSelected = selectedOptions[concentrationOption.name] === val;
                                    return (
                                        <button
                                            key={val}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOptionChange(concentrationOption.name, val);
                                            }}
                                            className="relative px-2.5 py-0.5 text-[10px] rounded-full font-medium transition-colors duration-150"
                                        >
                                            {isSelected && (
                                                <motion.span
                                                    layoutId={`conc-${uid}`}
                                                    className="absolute inset-0 bg-background rounded-full shadow-sm"
                                                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                                                />
                                            )}
                                            <span className={`relative z-1 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {getConcentrationDisplay(val)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Size Selector */}
                        {sizeOption && (
                            <div className="flex bg-muted/60 p-px rounded-full border border-border/50 overflow-hidden">
                                {sizeOption.values.map((size) => {
                                    const isSelected = selectedOptions[sizeOption.name] === size;
                                    return (
                                        <button
                                            key={size}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOptionChange(sizeOption.name, size);
                                            }}
                                            className="relative px-2.5 py-0.5 text-[10px] rounded-full font-medium transition-colors duration-150"
                                        >
                                            {isSelected && (
                                                <motion.span
                                                    layoutId={`size-${uid}`}
                                                    className="absolute inset-0 bg-background rounded-full shadow-sm"
                                                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                                                />
                                            )}
                                            <span className={`relative z-1 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {size}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Fallback for other options */}
                        {otherOptions.map((option) => (
                            <div key={option.name} className="flex items-center gap-1">
                                <span className="text-[9px] text-muted-foreground">{option.name}:</span>
                                <div className="flex bg-muted/60 p-px rounded-full border border-border/50 overflow-hidden">
                                    {option.values.map((value) => {
                                        const isSelected = selectedOptions[option.name] === value;
                                        return (
                                            <button
                                                key={value}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOptionChange(option.name, value);
                                                }}
                                                className="relative px-2 py-0.5 text-[10px] rounded-full font-medium transition-colors duration-150"
                                            >
                                                {isSelected && (
                                                    <motion.span
                                                        layoutId={`opt-${option.name}-${uid}`}
                                                        className="absolute inset-0 bg-background rounded-full shadow-sm"
                                                        transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                                                    />
                                                )}
                                                <span className={`relative z-1 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {value}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
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
                                ✓ EN BUNDLE
                            </span>
                        ) : !selectedVariant?.availableForSale ? (
                            'AGOTADO'
                        ) : (
                            'AGREGAR AL BUNDLE'
                        )}
                    </button>
                )}
            </div>
        </CardWrapper>
    );
}
