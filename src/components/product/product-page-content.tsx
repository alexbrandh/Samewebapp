'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretLeft, CaretRight, CaretDown, Star, Clock, Check } from 'phosphor-react';
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
    name: 'Valentina R.',
    rating: 5,
    date: '15 de enero, 2026',
    title: '¡Me encanta esta fragancia!',
    content: 'Este perfume se ha convertido en mi favorito del día a día. El aroma es sofisticado sin ser abrumador, y dura todo el día. ¡Recibo cumplidos cada vez que lo uso!'
  },
  {
    id: 2,
    name: 'Camila S.',
    rating: 5,
    date: '10 de enero, 2026',
    title: 'Perfecto para toda ocasión',
    content: 'Estaba buscando un aroma único y ¡este es! Funciona perfectamente tanto de día como de noche. El empaque también es hermoso.'
  },
  {
    id: 3,
    name: 'Andrés M.',
    rating: 5,
    date: '5 de enero, 2026',
    title: 'Duradero y elegante',
    content: '¡Por fin encontré un perfume que realmente dura! Las notas están perfectamente equilibradas con la base amaderada. Vale cada peso.'
  },
  {
    id: 4,
    name: 'Sofía L.',
    rating: 4,
    date: '28 de diciembre, 2025',
    title: '¡Mi nuevo favorito!',
    content: 'La fragancia es sofisticada y única. Me encanta cómo evoluciona a lo largo del día. ¡Definitivamente lo recomiendo!'
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



  // Umbral de envío gratis (COP)
  const freeShippingThreshold = 200000;

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
                          size={14}
                          weight={i < Math.floor(averageRating) ? 'fill' : 'light'}
                          className={i < Math.floor(averageRating) ? 'text-primary' : 'text-muted-foreground/30'}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        {reviews.length} Reseñas
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant?.availableForSale}
                  className="w-full md:w-auto h-11 md:h-12 px-6 md:px-8 text-sm md:text-base font-medium bg-foreground hover:bg-foreground/90 text-background whitespace-nowrap"
                >
                  {isAdding ? 'Agregando...' : 'AGREGAR AL CARRITO'}
                </Button>
              </div>
              <p className="text-xs text-primary mt-2 text-center md:text-right">
                ¡Agrega {formatPrice(freeShippingThreshold.toString())} y recibe envío gratis!
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
                      aria-label="Imagen anterior"
                    >
                      <CaretLeft size={24} weight="light" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/95 hover:bg-background flex items-center justify-center transition-colors shadow-lg"
                      aria-label="Imagen siguiente"
                    >
                      <CaretRight size={24} weight="light" />
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
                          aria-label={`Ver imagen ${index + 1}`}
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
                      Inspirado en {inspirationBrand}
                    </span>
                  )}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        weight={i < Math.floor(averageRating) ? 'fill' : 'light'}
                        className={i < Math.floor(averageRating) ? 'text-primary' : 'text-muted-foreground/30'}
                      />
                    ))}
                  </div>
                  <span>{averageRating.toFixed(1)} ({reviews.length} reseñas)</span>
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
                                <Check size={14} weight="bold" className={`text-primary-foreground transition-opacity ${selectedOptions[option.name] === 'Extrait' ? 'opacity-100' : 'opacity-0'
                                  }`} />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-foreground group-hover/checkbox:text-primary transition-colors mb-1">
                                Agregar Extracto Extra • Mejora Premium
                              </span>
                              <div className="flex flex-col gap-0.5 mb-2">
                                <span className="text-[11px] text-muted-foreground leading-tight">• Mayor concentración de esencia pura</span>
                                <span className="text-[11px] text-muted-foreground leading-tight">• Mayor fijación</span>
                                <span className="text-[11px] text-muted-foreground leading-tight">• Mayor duración</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-[#8B7355] font-medium">
                                <Clock size={14} weight="light" />
                                <span>Duración: {selectedOptions[option.name] === 'Extrait' ? '12-18 horas' : '8-12 horas'}</span>
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
                  <Clock size={16} weight="light" className="text-primary" />
                  <span className="text-muted-foreground">Duración:</span>
                  <span className="font-medium">{longevity}</span>
                </div>
              )}

              {/* Key Ingredients Badges */}
              {keyIngredientsArray.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Ingredientes Clave</h3>
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
                  <h3 className="text-sm font-medium mb-3">Notas Aromáticas</h3>
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
                  {isAdding ? 'Agregando...' : 'Agregar al carrito'}
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
                🚚 Pedidos de más de {formatPrice(freeShippingThreshold.toString())} califican para <span className="font-semibold">envío gratis</span>
              </div>

              {/* Accordions for How to Use and Ingredients */}
              <div className="space-y-3 border-t border-border pt-6">
                {howToUse && (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleAccordion('how-to-use')}
                      className="w-full px-4 py-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium text-sm">Cómo Usar</span>
                      <CaretDown
                        size={16}
                        weight="light"
                        className={`transition-transform ${openAccordion === 'how-to-use' ? 'rotate-180' : ''
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
                      <span className="font-medium text-sm">Lista Completa de Ingredientes (INCI)</span>
                      <CaretDown
                        size={16}
                        weight="light"
                        className={`transition-transform ${openAccordion === 'ingredients' ? 'rotate-180' : ''
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
              <h2 className="text-2xl lg:text-3xl font-light mb-4">Reseñas de Clientes</h2>
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      weight={i < Math.floor(averageRating) ? 'fill' : 'light'}
                      className={i < Math.floor(averageRating) ? 'text-primary' : 'text-muted-foreground/30'}
                    />
                  ))}
                </div>
                <span className="text-lg">
                  {averageRating.toFixed(1)} de 5
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Basado en {reviews.length} reseñas
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
                              size={16}
                              weight={i < review.rating ? 'fill' : 'light'}
                              className={i < review.rating ? 'text-primary' : 'text-muted-foreground/30'}
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
              <CaretLeft size={16} weight="light" className="mr-1" />
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
