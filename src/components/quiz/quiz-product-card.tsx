"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sparkle, Check, ShoppingCart, CircleNotch } from "phosphor-react";
import { useCurrency } from "@/contexts/currency-context";
import { useCart } from "@/lib/hooks/useShopify";
import { motion } from "framer-motion";

interface QuizProductCardProps {
    product: any;
    delay?: number;
}

export function QuizProductCard({ product, delay = 0 }: QuizProductCardProps) {
    const router = useRouter();
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    const [isAdding, setIsAdding] = useState(false);

    // --- Variant Logic (Matched to ProductCard) ---

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

    // Determine initial variant
    const initialVariant = useMemo(() => {
        // Try to match 100ml + Extrait first
        const exactMatch = variants.find((v: any) =>
            v.availableForSale &&
            v.selectedOptions?.some((opt: any) => opt.value === '100ml') &&
            v.selectedOptions?.some((opt: any) => opt.value === 'Extrait')
        );
        if (exactMatch) return exactMatch;

        // Try just 100ml
        const sizeMatch = variants.find((v: any) =>
            v.availableForSale &&
            v.selectedOptions?.some((opt: any) => opt.value === '100ml')
        );
        if (sizeMatch) return sizeMatch;

        // Default
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

    const handleOptionChange = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
    };

    const handleAddToBag = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedVariant?.id || !selectedVariant?.availableForSale) return;

        try {
            setIsAdding(true);
            await addToCart(selectedVariant.id, 1);
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay }}
            className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all group lg:min-h-[320px]"
            onClick={() => router.push(`/products/${product.handle}`)}
        >
            <div className="flex gap-4 md:gap-6 h-full">
                {/* Image Section */}
                <div className="w-28 h-28 md:w-40 md:h-40 bg-linear-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {product.featuredImage?.url || product.images?.edges[0]?.node?.url ? (
                        <img
                            src={product.featuredImage?.url || product.images?.edges[0]?.node?.url}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Sparkle size={32} weight="fill" className="text-primary/30" />
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold line-clamp-1">
                                    {product.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="text-lg font-bold text-primary">
                                        {product.match}%
                                    </div>
                                    <span className="text-[10px] md:text-xs text-muted-foreground uppercase">
                                        Match
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                            {product.tags.slice(0, 3).map((tag: string) => {
                                let displayTag = tag;
                                const lower = tag.toLowerCase();
                                if (lower === 'mujeres' || lower === 'mujer') displayTag = 'Women';
                                if (lower === 'hombres' || lower === 'hombre') displayTag = 'Men';
                                if (lower === 'unisex') displayTag = 'Unisex';
                                if (lower === 'nuevo' || lower === 'mas vendidos') displayTag = 'New';

                                return (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-[10px] md:text-xs capitalize"
                                    >
                                        {displayTag}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* Variant Selectors */}
                    {hasVariants && (
                        <div className="space-y-2 mb-2" onClick={(e) => e.stopPropagation()}>
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
                                                className={`px-2 py-1 text-[10px] rounded-md transition-all font-medium ${isSelected
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
                                            <Check className="w-3 h-3 text-background opacity-0 peer-checked:opacity-100 font-bold" weight="bold" />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-muted-foreground group-hover/checkbox:text-primary transition-colors select-none">
                                        Add Extract
                                    </span>
                                </label>
                            )}
                        </div>
                    )}

                    {/* Price and Action */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                        <span className="text-lg md:text-xl font-bold">
                            {formatPrice(price)}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => router.push(`/products/${product.handle}`)}
                                className="hidden sm:block px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 rounded-full transition-colors"
                            >
                                Details
                            </button>
                            <button
                                onClick={handleAddToBag}
                                disabled={isAdding || !selectedVariant?.availableForSale}
                                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs md:text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isAdding ? (
                                    <CircleNotch size={16} weight="bold" className="animate-spin" />
                                ) : (
                                    <ShoppingCart size={16} weight="bold" />
                                )}
                                <span>Add</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
