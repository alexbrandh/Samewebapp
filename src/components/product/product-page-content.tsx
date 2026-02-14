'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CaretLeft, CaretRight, CaretDown, Star, Clock, Check,
  Drop, Leaf, ShieldCheck, Truck, Package, CircleNotch,
  Sparkle, ArrowsClockwise
} from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/hooks/useShopify';
import { FavoriteButton } from '@/components/product/favorite-button';
import { useCurrency } from '@/contexts/currency-context';

interface ProductPageContentProps {
  product: any;
}

const normalizeTag = (tag: string) =>
  tag.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const OCCASION_META: Record<string, { label: string; className: string }> = {
  seduccion: { label: 'Seducción', className: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
  rumba: { label: 'Rumba', className: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800' },
  playa: { label: 'Playa', className: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
  diario: { label: 'Diario', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  negocios: { label: 'Negocios', className: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800' },
  deporte: { label: 'Deporte', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
};

const GENDER_MAP: Record<string, string> = {
  hombres: 'Para Él',
  mujeres: 'Para Ella',
  unisex: 'Unisex',
};

const getConcentrationInfo = (value: string) => {
  const lower = value.toLowerCase();
  if (lower === 'extrait' || lower === 'elixir') {
    return { display: 'Elixir', duration: '12–18 horas', desc: 'Máxima concentración. Fijación intensa y duradera.' };
  }
  return { display: 'Au Parfum', duration: '8–12 horas', desc: 'Concentración equilibrada con excelente rendimiento.' };
};

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
  const { formatPrice } = useCurrency();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const variants = product.variants?.edges?.map((edge: any) => edge.node) || [];

  const initialVariant = (() => {
    const exactMatch = variants.find((v: any) =>
      v.availableForSale &&
      v.selectedOptions.some((opt: any) => opt.value === '100ml') &&
      v.selectedOptions.some((opt: any) => opt.value === 'Extrait')
    );
    if (exactMatch) return exactMatch;
    const sizeMatch = variants.find((v: any) =>
      v.availableForSale &&
      v.selectedOptions.some((opt: any) => opt.value === '100ml')
    );
    if (sizeMatch) return sizeMatch;
    return variants.find((v: any) => v.availableForSale) || variants[0];
  })();

  const [selectedVariant, setSelectedVariant] = useState<any>(initialVariant);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const opts: Record<string, string> = {};
    initialVariant?.selectedOptions?.forEach((o: any) => { opts[o.name] = o.value; });
    return opts;
  });

  const options = product.options || [];
  const images = product.images?.edges?.map((edge: any) => edge.node) || [];
  const price = selectedVariant?.price?.amount || '0';
  const compareAtPrice = selectedVariant?.compareAtPrice?.amount || null;
  const freeShippingThreshold = 200000;
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const sizeOption = options.find((o: any) => /^(size|tamaño)$/i.test(o.name));
  const concentrationOption = options.find((o: any) => /concen?tration|concentración|^type$|^tipo$|strength|intensidad/i.test(o.name));

  const tags = (product.tags || []) as string[];
  const occasionTag = tags.find((t: string) => OCCASION_META[normalizeTag(t)]);
  const occasion = occasionTag ? OCCASION_META[normalizeTag(occasionTag)] : null;
  const genderTag = tags.find((t: string) => GENDER_MAP[normalizeTag(t)]);
  const gender = genderTag ? GENDER_MAP[normalizeTag(genderTag)] : null;
  const isBestseller = tags.some((t: string) => normalizeTag(t) === 'mas vendidos');

  const getMetafield = (key: string) =>
    product.metafields?.find((m: any) => m && m.key === key && m.namespace === 'custom')?.value || null;

  const inspirationBrand = getMetafield('inspiration_brand');
  const longevity = getMetafield('longevity');
  const keyIngredients = getMetafield('key_ingredients');
  const aromaticNotes = getMetafield('aromatic_notes');
  const howToUse = getMetafield('how_to_use');
  const ingredientList = getMetafield('ingredient_list');

  const keyIngredientsArray = keyIngredients ? keyIngredients.split(',').map((s: string) => s.trim()) : [];
  const aromaticNotesArray = aromaticNotes ? aromaticNotes.split(',').map((s: string) => s.trim()) : [];

  const handleOptionChange = useCallback((name: string, value: string) => {
    const newOptions = { ...selectedOptions, [name]: value };
    setSelectedOptions(newOptions);
    const variant = variants.find((v: any) =>
      v.selectedOptions.every((o: any) => newOptions[o.name] === o.value)
    );
    if (variant) setSelectedVariant(variant);
  }, [selectedOptions, variants]);

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return;
    setIsAdding(true);
    try {
      await addToCart(selectedVariant.id, 1);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);
  const toggleAccordion = (s: string) => setOpenAccordion(openAccordion === s ? null : s);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentConcentration = selectedOptions[concentrationOption?.name || ''] || 'Classic';
  const concInfo = getConcentrationInfo(currentConcentration);

  return (
    <>
      {/* Sticky Add to Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm"
          >
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0 flex items-center gap-4">
                  {images[0] && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border hidden sm:block">
                      <img src={images[0].url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-sm font-medium truncate text-foreground">{product.title}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{formatPrice(price)}</span>
                      {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) && (
                        <span className="text-xs text-muted-foreground line-through">{formatPrice(compareAtPrice)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding || addedToCart || !selectedVariant?.availableForSale}
                  className="h-10 px-6 text-sm font-medium bg-foreground hover:bg-foreground/90 text-background whitespace-nowrap rounded-md"
                >
                  {addedToCart ? (
                    <span className="flex items-center gap-1.5"><Check size={16} weight="bold" /> Agregado</span>
                  ) : isAdding ? (
                    <span className="flex items-center gap-1.5"><CircleNotch size={16} weight="bold" className="animate-spin" /> Agregando...</span>
                  ) : 'Agregar al carrito'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <CaretRight size={10} weight="light" />
            <Link href="/collections/all" className="hover:text-foreground transition-colors">Colección</Link>
            <CaretRight size={10} weight="light" />
            <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>

        {/* Product Hero */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

            {/* Left: Image Gallery */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="relative w-full aspect-square lg:aspect-4/5 rounded-xl overflow-hidden bg-muted/30">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]?.url || '/placeholder.png'}
                    alt={images[currentImageIndex]?.altText || product.title}
                    className="w-full h-full object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 hover:bg-background rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                      aria-label="Imagen anterior"
                    >
                      <CaretLeft size={20} weight="light" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 hover:bg-background rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                      aria-label="Imagen siguiente"
                    >
                      <CaretRight size={20} weight="light" />
                    </button>
                  </>
                )}

                <div className="absolute top-3 right-3 z-10">
                  <FavoriteButton productId={product.id} size={22} className="h-10 w-10 shadow-md" />
                </div>

                {isBestseller && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest bg-foreground text-background rounded-sm">
                      Bestseller
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
                  {images.map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-foreground shadow-sm'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`Ver imagen ${index + 1}`}
                    >
                      <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="space-y-5 lg:pt-2">

              {/* Tag badges */}
              {(occasion || gender) && (
                <div className="flex flex-wrap gap-2">
                  {occasion && (
                    <span className={`px-3 py-1 text-xs font-medium rounded-sm border ${occasion.className}`}>
                      {occasion.label}
                    </span>
                  )}
                  {gender && (
                    <span className="px-3 py-1 text-xs font-medium rounded-sm border border-border bg-muted/50 text-muted-foreground">
                      {gender}
                    </span>
                  )}
                </div>
              )}

              {/* Title + Inspiration */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground font-serif">
                  {product.title}
                </h1>
                {inspirationBrand && (
                  <p className="text-base lg:text-lg text-muted-foreground mt-1.5">
                    Inspirado en <span className="font-medium text-foreground/80">{inspirationBrand}</span>
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      weight={i < Math.floor(averageRating) ? 'fill' : 'light'}
                      className={i < Math.floor(averageRating) ? 'text-foreground' : 'text-muted-foreground/30'}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} ({reviews.length} reseñas)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl lg:text-3xl font-semibold text-foreground font-serif">
                  {formatPrice(price)}
                </span>
                {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(compareAtPrice)}
                    </span>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      -{Math.round((1 - parseFloat(price) / parseFloat(compareAtPrice)) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Concentration info */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Sparkle size={16} weight="light" />
                  <span>{concInfo.display}</span>
                </div>
                <span className="text-border">|</span>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock size={16} weight="light" />
                  <span>{concInfo.duration}</span>
                </div>
                {longevity && (
                  <>
                    <span className="text-border">|</span>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Drop size={16} weight="light" />
                      <span>{longevity}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-border" />

              {/* Size Selector */}
              {sizeOption && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-foreground">{sizeOption.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    {sizeOption.values.map((value: string) => {
                      const isSelected = selectedOptions[sizeOption.name] === value;
                      return (
                        <button
                          key={value}
                          onClick={() => handleOptionChange(sizeOption.name, value)}
                          className={`px-5 py-2.5 text-sm rounded-md border-2 transition-all font-medium min-w-[72px] ${
                            isSelected
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border bg-background text-foreground hover:border-foreground/50'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Concentration Toggle */}
              {concentrationOption && concentrationOption.values.length > 1 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Concentración</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {concentrationOption.values.map((value: string) => {
                      const isSelected = selectedOptions[concentrationOption.name] === value;
                      const info = getConcentrationInfo(value);
                      return (
                        <button
                          key={value}
                          onClick={() => handleOptionChange(concentrationOption.name, value)}
                          className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? 'border-foreground bg-foreground/5'
                              : 'border-border hover:border-foreground/30'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3">
                              <Check size={16} weight="bold" className="text-foreground" />
                            </div>
                          )}
                          <span className="block text-sm font-semibold text-foreground mb-1">
                            {info.display}
                          </span>
                          <span className="block text-xs text-muted-foreground leading-snug">
                            {info.desc}
                          </span>
                          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-muted-foreground">
                            <Clock size={12} weight="light" />
                            <span>{info.duration}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other options fallback */}
              {options.filter((o: any) => o !== sizeOption && o !== concentrationOption).map((option: any) => (
                <div key={option.name}>
                  <h3 className="text-sm font-medium mb-3">{option.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value: string) => {
                      const isSelected = selectedOptions[option.name] === value;
                      return (
                        <button
                          key={value}
                          onClick={() => handleOptionChange(option.name, value)}
                          className={`px-4 py-2 text-sm border-2 rounded-md transition-all ${
                            isSelected
                              ? 'bg-foreground text-background border-foreground'
                              : 'bg-background text-foreground border-border hover:border-foreground/50'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Add to Cart */}
              <div className="flex gap-3 pt-1">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding || addedToCart || !selectedVariant?.availableForSale}
                  className="flex-1 h-13 text-base font-medium bg-foreground hover:bg-foreground/90 text-background rounded-md"
                >
                  {addedToCart ? (
                    <span className="flex items-center gap-2"><Check size={18} weight="bold" /> Agregado al carrito</span>
                  ) : isAdding ? (
                    <span className="flex items-center gap-2"><CircleNotch size={18} weight="bold" className="animate-spin" /> Agregando...</span>
                  ) : (
                    'Agregar al carrito'
                  )}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 py-2">
                <div className="flex flex-col items-center text-center gap-1.5 py-3">
                  <Truck size={20} weight="light" className="text-muted-foreground" />
                  <span className="text-[11px] leading-tight text-muted-foreground">Envío gratis desde {formatPrice(freeShippingThreshold.toString())}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5 py-3">
                  <ShieldCheck size={20} weight="light" className="text-muted-foreground" />
                  <span className="text-[11px] leading-tight text-muted-foreground">100% Auténtico</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5 py-3">
                  <Package size={20} weight="light" className="text-muted-foreground" />
                  <span className="text-[11px] leading-tight text-muted-foreground">Envío 1-3 días hábiles</span>
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Description */}
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.description?.replace(/Inspired by:?\s*[^\n]*/gi, '').trim()}
                </p>
              </div>

              {/* Aromatic Notes */}
              {aromaticNotesArray.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                    <Drop size={16} weight="light" />
                    Notas Aromáticas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {aromaticNotesArray.map((note: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-muted/60 text-foreground text-xs font-medium rounded-sm border border-border"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Ingredients */}
              {keyIngredientsArray.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                    <Leaf size={16} weight="light" />
                    Ingredientes Clave
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keyIngredientsArray.map((ingredient: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-foreground/5 text-foreground text-xs font-medium rounded-sm border border-foreground/10"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Accordions */}
              <div className="space-y-0 border-t border-border">
                {howToUse && (
                  <div className="border-b border-border">
                    <button
                      onClick={() => toggleAccordion('how-to-use')}
                      className="w-full py-4 flex items-center justify-between hover:text-foreground transition-colors"
                    >
                      <span className="font-medium text-sm">Cómo Usar</span>
                      <CaretDown
                        size={16}
                        weight="light"
                        className={`transition-transform duration-200 ${openAccordion === 'how-to-use' ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {openAccordion === 'how-to-use' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-4 text-sm text-muted-foreground leading-relaxed">
                            {howToUse}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {ingredientList && (
                  <div className="border-b border-border">
                    <button
                      onClick={() => toggleAccordion('ingredients')}
                      className="w-full py-4 flex items-center justify-between hover:text-foreground transition-colors"
                    >
                      <span className="font-medium text-sm">Ingredientes (INCI)</span>
                      <CaretDown
                        size={16}
                        weight="light"
                        className={`transition-transform duration-200 ${openAccordion === 'ingredients' ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {openAccordion === 'ingredients' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-4 text-xs text-muted-foreground leading-relaxed">
                            {ingredientList}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="border-b border-border">
                  <button
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full py-4 flex items-center justify-between hover:text-foreground transition-colors"
                  >
                    <span className="font-medium text-sm">Envío y Devoluciones</span>
                    <CaretDown
                      size={16}
                      weight="light"
                      className={`transition-transform duration-200 ${openAccordion === 'shipping' ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openAccordion === 'shipping' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 text-sm text-muted-foreground leading-relaxed space-y-2">
                          <p>Envíos a toda Colombia. Tiempo de procesamiento: 1 día hábil.</p>
                          <ul className="space-y-1 ml-4 list-disc">
                            <li>Estándar: 4-7 días hábiles</li>
                            <li>Express: 1-3 días hábiles</li>
                          </ul>
                          <p>Pedidos con 4+ artículos califican para envío gratis estándar.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="border-t border-border">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
              {/* Rating Summary */}
              <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-6 font-serif">Reseñas</h2>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-semibold font-serif">{averageRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">de 5</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      weight={i < Math.floor(averageRating) ? 'fill' : 'light'}
                      className={i < Math.floor(averageRating) ? 'text-foreground' : 'text-muted-foreground/30'}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Basado en {reviews.length} reseñas
                </p>
                {/* Rating Distribution */}
                <div className="mt-4 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter(r => r.rating === star).length;
                    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-muted-foreground">{star}</span>
                        <Star size={12} weight="fill" className="text-foreground shrink-0" />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-foreground rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-muted-foreground">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-0">
                {reviews.map((review, idx) => (
                  <div key={review.id} className={`py-6 ${idx > 0 ? 'border-t border-border' : ''}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground shrink-0">
                        {review.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{review.name}</span>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              weight={i < review.rating ? 'fill' : 'light'}
                              className={i < review.rating ? 'text-foreground' : 'text-muted-foreground/30'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium text-sm mb-1.5">{review.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="border-t border-border">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href="/collections/all"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <CaretLeft size={16} weight="light" className="mr-1" />
              Ver toda la colección
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
