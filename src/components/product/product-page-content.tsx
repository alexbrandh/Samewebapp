'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Star, Clock, Sparkles, Feather, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/hooks/useShopify';
import { FavoriteButton } from '@/components/product/favorite-button';
import { useCurrency } from '@/contexts/currency-context';

interface ProductPageContentProps {
  product: any;
}

// Mock reviews data
const reviews = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    date: 'October 15, 2024',
    title: 'Absolutely love this fragrance!',
    content: 'This perfume has become my daily go-to. The scent is sophisticated without being overpowering, and it lasts all day. I get compliments every time I wear it!'
  },
  {
    id: 2,
    name: 'Emily R.',
    rating: 5,
    date: 'October 10, 2024',
    title: 'Perfect for every occasion',
    content: 'I was looking for a signature scent and this is it! It works beautifully for both day and evening wear. The packaging is gorgeous too.'
  },
  {
    id: 3,
    name: 'Jessica L.',
    rating: 5,
    date: 'October 5, 2024',
    title: 'Long-lasting and elegant',
    content: 'Finally found a perfume that actually lasts! The floral notes are perfectly balanced with the woody base. Worth every penny.'
  },
  {
    id: 4,
    name: 'Maria G.',
    rating: 5,
    date: 'September 28, 2024',
    title: 'My new favorite!',
    content: 'The fragrance is sophisticated and unique. I love how it evolves throughout the day. Definitely recommend!'
  }
];

export default function ProductPageContent({ product }: ProductPageContentProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('ingredients');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const { formatPrice } = useCurrency();

  // Get all variants
  const variants = product.variants?.edges?.map((edge: any) => edge.node) || [];

  // Determine preferred variant (Default: 100ml & Extrait)
  const initialVariant = (() => {
    // 1. Try to find 100ml + Extrait (available)
    const exactMatch = variants.find((v: any) =>
      v.availableForSale &&
      v.selectedOptions.some((opt: any) => opt.value === '100ml') &&
      v.selectedOptions.some((opt: any) => opt.value === 'Extrait')
    );
    if (exactMatch) return exactMatch;

    // 2. Try to find just 100ml (available)
    const sizeMatch = variants.find((v: any) =>
      v.availableForSale &&
      v.selectedOptions.some((opt: any) => opt.value === '100ml')
    );
    if (sizeMatch) return sizeMatch;

    // 3. Fallback: First available or just first
    return variants.find((v: any) => v.availableForSale) || variants[0];
  })();

  // Initialize state with the preferred variant
  const [selectedVariant, setSelectedVariant] = useState<any>(initialVariant);

  // Initialize selected options from the selected variant
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initialOptions: Record<string, string> = {};
    initialVariant?.selectedOptions?.forEach((option: any) => {
      initialOptions[option.name] = option.value;
    });
    return initialOptions;
  });

  // Extract unique options from product (or derived from variants if necessary)
  const options = product.options || [];

  // Handle option selection
  const handleOptionChange = (name: string, value: string) => {
    const newOptions = { ...selectedOptions, [name]: value };
    setSelectedOptions(newOptions);

    // Find the variant that matches all selected options
    const variant = variants.find((v: any) => {
      return v.selectedOptions.every((option: any) => {
        return newOptions[option.name] === option.value;
      });
    });

    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const images = product.images?.edges?.map((edge: any) => edge.node) || [];
  const price = selectedVariant?.price?.amount || '0';
  const currencyCode = selectedVariant?.price?.currencyCode || 'EUR';



  // Free shipping threshold (AED)
  const freeShippingThreshold = 200;

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return;

    setIsAdding(true);
    try {
      await addToCart(selectedVariant.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  // Detect scroll for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Show sticky bar after scrolling 500px
      setShowStickyBar(scrollPosition > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Extract metafields from product
  const getMetafield = (key: string) => {
    return product.metafields?.find((m: any) =>
      m && m.key === key && m.namespace === 'custom'
    )?.value || null;
  };

  const inspirationBrand = getMetafield('inspiration_brand');
  const longevity = getMetafield('longevity');
  const keyIngredients = getMetafield('key_ingredients');
  const aromaticNotes = getMetafield('aromatic_notes');
  const howToUse = getMetafield('how_to_use');
  const ingredientList = getMetafield('ingredient_list');

  // Parse comma-separated strings to arrays
  const keyIngredientsArray = keyIngredients ? keyIngredients.split(',').map((s: string) => s.trim()) : [];
  const aromaticNotesArray = aromaticNotes ? aromaticNotes.split(',').map((s: string) => s.trim()) : [];

  return (
    <>
      {/* Sticky Add to Bag Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl shadow-lg border-b border-border"
          >
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base md:text-lg font-medium truncate mb-1 text-foreground">{product.title}</h2>
                  <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    <span className="text-base md:text-lg font-light text-foreground">{formatPrice(price)}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 md:w-3.5 md:h-3.5 ${i < Math.floor(averageRating)
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground/30'
                            }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        {reviews.length} Reviews
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant?.availableForSale}
                  className="w-full md:w-auto h-11 md:h-12 px-6 md:px-8 text-sm md:text-base font-medium bg-foreground hover:bg-foreground/90 text-background whitespace-nowrap"
                >
                  {isAdding ? 'Adding...' : 'ADD TO BAG'}
                </Button>
              </div>
              <p className="text-xs text-primary mt-2 text-center md:text-right">
                Add {formatPrice(freeShippingThreshold.toString())} and receive free shipping!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background">
        {/* Product Hero Section */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

            {/* Left: Image Gallery */}
            <div className="lg:sticky lg:top-28 h-fit flex items-center justify-center">
              <div className="relative w-full h-[60vh] lg:h-[calc(100vh-180px)] max-h-[700px] flex items-center justify-center rounded-lg overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]?.url || '/placeholder.png'}
                    alt={images[currentImageIndex]?.altText || product.title}
                    className="w-full h-full object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/95 hover:bg-background flex items-center justify-center transition-colors shadow-lg"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/95 hover:bg-background flex items-center justify-center transition-colors shadow-lg"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-1.5 rounded-full transition-all ${index === currentImageIndex
                            ? 'bg-foreground w-8'
                            : 'bg-foreground/30 w-1.5 hover:bg-foreground/50'
                            }`}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>

                    {/* Image Counter */}
                    <div className="absolute top-6 right-6 bg-background/95 px-3 py-1 text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-light tracking-tight mb-2">
                  {product.title}
                  {inspirationBrand && (
                    <span className="block lg:inline-block lg:ml-3 text-lg lg:text-2xl font-medium text-muted-foreground/80 mt-1 lg:mt-0 align-baseline">
                      Inspired by {inspirationBrand}
                    </span>
                  )}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(averageRating)
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground/30'
                          }`}
                      />
                    ))}
                  </div>
                  <span>{averageRating.toFixed(1)} ({reviews.length} reviews)</span>
                </div>
              </div>

              {/* Variant Selectors */}
              <div className="space-y-4 pt-4 border-t border-border mt-4">
                {options.map((option: any) => {
                  const isSize = /^(size|tamaño)$/i.test(option.name);
                  const isConcentration = /concen?tration|concentración|^type$|^tipo$|strength|intensidad/i.test(option.name);

                  if (isSize) {
                    return (
                      <div key={option.name}>
                        <h3 className="text-sm font-medium mb-3">{option.name}</h3>
                        <div className="flex bg-muted/50 p-1 rounded-lg w-max border border-border">
                          {option.values.map((value: string) => {
                            const isSelected = selectedOptions[option.name] === value;
                            return (
                              <button
                                key={value}
                                onClick={() => handleOptionChange(option.name, value)}
                                className={`px-4 py-1.5 text-sm rounded-md transition-all font-medium ${isSelected
                                  ? 'bg-background text-foreground shadow-sm'
                                  : 'text-muted-foreground hover:text-foreground'
                                  }`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (isConcentration) {
                    return (
                      <div key={option.name} className="mt-4">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <label className={`flex items-center gap-3 cursor-pointer group/checkbox border p-4 rounded-xl transition-all shadow-sm ${selectedOptions[option.name] === 'Extrait'
                            ? 'bg-primary/10 border-primary'
                            : 'bg-card border-border hover:border-primary/50'
                            }`}>
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={selectedOptions[option.name] === 'Extrait'}
                                onChange={(e) => {
                                  handleOptionChange(option.name, e.target.checked ? 'Extrait' : 'Classic');
                                }}
                              />
                              <div className={`w-5 h-5 border-2 rounded-md transition-colors flex items-center justify-center ${selectedOptions[option.name] === 'Extrait'
                                ? 'bg-primary border-primary'
                                : 'border-muted-foreground/30 bg-background'
                                }`}>
                                <Check className={`w-3.5 h-3.5 text-primary-foreground transition-opacity ${selectedOptions[option.name] === 'Extrait' ? 'opacity-100' : 'opacity-0'
                                  }`} strokeWidth={3} />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-foreground group-hover/checkbox:text-primary transition-colors mb-1">
                                Add Extra Extract • Premium Upgrade
                              </span>
                              <div className="flex flex-col gap-0.5 mb-2">
                                <span className="text-[11px] text-muted-foreground leading-tight">• Higher concentration of pure essence</span>
                                <span className="text-[11px] text-muted-foreground leading-tight">• Deeper fixation</span>
                                <span className="text-[11px] text-muted-foreground leading-tight">• Extended longevity</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-[#8B7355] font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Longevity: {selectedOptions[option.name] === 'Extrait' ? '12-18 hours' : '8-12 hours'}</span>
                              </div>
                            </div>
                          </label>


                        </div>
                      </div>
                    );
                  }

                  // Default handler for other options
                  return (
                    <div key={option.name}>
                      <h3 className="text-sm font-medium mb-3">{option.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value: string) => {
                          const isSelected = selectedOptions[option.name as string] === value;
                          // Check if this specific combination is available
                          const isAvailable = variants.some((v: any) => {
                            const potentialOptions = { ...selectedOptions, [option.name as string]: value };
                            return v.selectedOptions.every((opt: any) => potentialOptions[opt.name as string] === opt.value) && v.availableForSale;
                          });

                          return (
                            <button
                              key={value}
                              onClick={() => handleOptionChange(option.name, value)}
                              className={`px-4 py-2 text-sm border rounded-full transition-all
                                ${isSelected
                                  ? 'bg-foreground text-background border-foreground'
                                  : 'bg-background text-foreground border-border hover:border-foreground'
                                }
                                ${!isAvailable && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                              `}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price */}
              <div className="text-2xl font-light mt-6">
                {formatPrice(price)}
              </div>




              {/* Short Description */}
              <div className="border-t border-border pt-6">
                <p className="text-base leading-relaxed text-muted-foreground">
                  {product.description?.replace(/Inspired by:?\s*[^\n]*/gi, '').trim()}
                </p>
              </div>

              {/* Longevity */}
              {longevity && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Longevity:</span>
                  <span className="font-medium">{longevity}</span>
                </div>
              )}

              {/* Key Ingredients Badges */}
              {keyIngredientsArray.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Key Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {keyIngredientsArray.map((ingredient: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Aromatic Notes Badges */}
              {aromaticNotesArray.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Aromatic Notes</h3>
                  <div className="flex flex-wrap gap-2">
                    {aromaticNotesArray.map((note: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-muted text-foreground text-xs font-medium rounded-full border border-border"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Details */}
              {selectedVariant?.title && selectedVariant.title !== 'Default Title' && (
                <div className="text-sm text-muted-foreground">
                  <p>{selectedVariant.title}</p>
                </div>
              )}

              {/* Add to Cart & Favorite */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant?.availableForSale}
                  className="flex-1 h-14 text-base font-medium bg-foreground hover:bg-foreground/90 text-background"
                >
                  {isAdding ? 'Adding to cart...' : 'Add to cart'}
                </Button>
                <div className="flex items-center">
                  <FavoriteButton
                    productId={product.id}
                    size={24}
                    variant="default"
                    className="h-14 w-14 shrink-0"
                  />
                </div>
              </div>

              {/* Free Shipping Banner */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center text-sm text-foreground">
                🚚 Orders over {formatPrice(freeShippingThreshold.toString())} qualify for <span className="font-semibold">free shipping</span>
              </div>

              {/* Accordions for How to Use and Ingredients */}
              <div className="space-y-3 border-t border-border pt-6">
                {howToUse && (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleAccordion('how-to-use')}
                      className="w-full px-4 py-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium text-sm">How to Use</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${openAccordion === 'how-to-use' ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    {openAccordion === 'how-to-use' && (
                      <div className="px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                        {howToUse}
                      </div>
                    )}
                  </div>
                )}

                {ingredientList && (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleAccordion('ingredients')}
                      className="w-full px-4 py-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium text-sm">Full Ingredient List (INCI)</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${openAccordion === 'ingredients' ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    {openAccordion === 'ingredients' && (
                      <div className="px-4 py-3 text-xs text-muted-foreground leading-relaxed">
                        {ingredientList}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>


        {/* Customer Reviews */}
        <div className="py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-2xl lg:text-3xl font-light mb-4">Customer Reviews</h2>
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(averageRating)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground/30'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-lg">
                  {averageRating.toFixed(1)} out of 5
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Based on {reviews.length} reviews
              </p>
            </div>

            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review.id} className="border-t border-border pt-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating
                                ? 'fill-primary text-primary'
                                : 'text-muted-foreground/30'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.name}</span>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <h4 className="font-medium mb-2">{review.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="py-12 border-t border-border">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-sm hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
