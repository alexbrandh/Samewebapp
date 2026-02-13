"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkle, ShoppingCart, CircleNotch } from "phosphor-react";
import { useCart } from "@/lib/hooks/useShopify";
import { useCurrency } from "@/contexts/currency-context";

interface BestMatchCardProps {
    product: any;
}

export function BestMatchCard({ product }: BestMatchCardProps) {
    const router = useRouter();
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    const [addingToCart, setAddingToCart] = useState(false);

    // --- Logic modified from ProductCard ---

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

    // Determine initial variant (prefer what was passed as 'selectedVariant' from quiz logic, or default logic)
    // The quiz logic passes a 'selectedVariant' in the product object, we can use that as initial.
    const initialVariant = useMemo(() => {
        if (product.selectedVariant) return product.selectedVariant;

        const exactMatch = variants.find((v: any) =>
            v.availableForSale &&
            v.selectedOptions?.some((opt: any) => opt.value === '100ml') &&
            v.selectedOptions?.some((opt: any) => opt.value === 'Extrait')
        );
        if (exactMatch) return exactMatch;

        return variants.find((v: any) => v.availableForSale) || variants[0];
    }, [product.selectedVariant, variants]);

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

    const handleOptionChange = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
    };

    const handleAddToBag = async () => {
        if (!selectedVariant?.id || !selectedVariant?.availableForSale) return;

        try {
            setAddingToCart(true);
            await addToCart(selectedVariant.id, 1);
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setAddingToCart(false);
        }
    };

    return (
        <div className="bg-linear-to-br from-card via-card to-primary/5 border-2 border-primary rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="text-6xl font-bold text-primary">
                            {product.match}%
                        </div>
                        <div className="text-sm text-muted-foreground uppercase">
                            Match
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">
                            {product.title}
                        </h2>
                        {product.description && (
                            <p className="text-lg text-muted-foreground line-clamp-3">
                                {product.description.replace(/<[^>]*>/g, '').substring(0, 150)}...
                            </p>
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                            Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {product.tags.slice(0, 5).map((tag: string) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* --- Variant Selectors --- */}
                    {hasVariants && (
                        <div className="space-y-4 py-4 border-y border-border/50">
                            {/* Size Selector */}
                            {options.find(opt => opt.name === 'Size' || opt.name === 'Tamaño') && (
                                <div className="flex bg-muted/50 p-1 rounded-xl w-max border border-border">
                                    {options.find(opt => opt.name === 'Size' || opt.name === 'Tamaño')?.values.map((size) => {
                                        const optionName = options.find(opt => opt.name === 'Size' || opt.name === 'Tamaño')?.name || 'Size';
                                        const isSelected = selectedOptions[optionName] === size;
                                        return (
                                            <button
                                                key={size}
                                                onClick={() => handleOptionChange(optionName, size)}
                                                className={`px-4 py-2 text-sm rounded-lg transition-all font-medium ${isSelected
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
                            {options.find(opt => opt.name === 'Concentration' || opt.name === 'Concentración' || opt.name === 'Type' || opt.name === 'Tipo') && (
                                <label className="flex items-center gap-3 cursor-pointer group/checkbox w-max p-2 hover:bg-muted/30 rounded-lg transition-colors">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={
                                                selectedOptions['Concentration'] === 'Extrait' ||
                                                selectedOptions['Type'] === 'Extrait' ||
                                                selectedOptions['Concentración'] === 'Extrait'
                                            }
                                            onChange={(e) => {
                                                const optName = options.find(opt => ['Concentration', 'Concentración', 'Type', 'Tipo'].includes(opt.name))?.name;
                                                if (optName) {
                                                    handleOptionChange(optName, e.target.checked ? 'Extrait' : 'Classic');
                                                }
                                            }}
                                        />
                                        <div className="w-5 h-5 border-2 border-muted-foreground/30 rounded bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors">
                                            <svg className="w-3.5 h-3.5 text-primary-foreground absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground group-hover/checkbox:text-foreground transition-colors select-none">
                                        Add Extract (Longer Duration)
                                    </span>
                                </label>
                            )}
                        </div>
                    )}

                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">
                            {formatPrice(price)}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleAddToBag}
                            disabled={addingToCart || !selectedVariant?.availableForSale}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {addingToCart ? (
                                <CircleNotch size={20} weight="bold" className="animate-spin" />
                            ) : (
                                <ShoppingCart size={20} weight="bold" />
                            )}
                            <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                        </button>
                        <button
                            onClick={() => router.push(`/products/${product.handle}`)}
                            className="px-6 py-4 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/5 transition-all"
                        >
                            View Details
                        </button>
                    </div>
                </div>

                <div className="relative aspect-square bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center overflow-hidden">
                    {product.featuredImage?.url || product.images?.edges[0]?.node?.url ? (
                        <img
                            src={product.featuredImage?.url || product.images?.edges[0]?.node?.url}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <Sparkle size={64} weight="fill" className="mx-auto mb-4 text-primary/30" />
                            <p className="text-sm">No Image Available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
