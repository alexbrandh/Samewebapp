'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/hooks/useShopify';
import { getProducts } from '@/lib/shopify';
import { PageContainer } from '@/components/ui/page-container';
import { Footer } from '@/components/sections/footer';
import { useCurrency } from '@/contexts/currency-context';
import Image from 'next/image';
import type { ShopifyProduct } from '@/lib/types/shopify';
import {
  X, Check, ShoppingCart, Plus, Minus, Sparkle, Drop,
  Flask, Gift, MagnifyingGlass, CircleNotch, ArrowRight,
  ArrowLeft, SlidersHorizontal
} from 'phosphor-react';

// ── Pricing ──
const PRICES = {
  essence: { '30ml': 55000, '50ml': 85000, '100ml': 105000 },
  elixir: { '30ml': 95000, '50ml': 145000, '100ml': 205000 },
} as const;

type PerfumeType = 'essence' | 'elixir';
type PerfumeSize = '30ml' | '50ml' | '100ml';
type Category = 'todos' | 'mujer' | 'hombre' | 'unisex';

interface Extra {
  id: string;
  name: string;
  description: string;
  firstPrice: number;
  additionalPrice: number;
  icon: React.ReactNode;
  quantity: number;
}

const STEP_LABELS = ['Tipo y Tamaño', 'Elige Aromas', 'Personaliza'];

// ── Animations ──
const fadeSlide = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const cardItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ── Main Component ──
export default function CreaTuAromaPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAromas, setSelectedAromas] = useState<ShopifyProduct[]>([]);
  const [selectedType, setSelectedType] = useState<PerfumeType>('elixir');
  const [selectedSize, setSelectedSize] = useState<PerfumeSize>('100ml');
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('todos');
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const { formatPrice } = useCurrency();
  const { createCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [extras, setExtras] = useState<Extra[]>([
    {
      id: 'feromonas',
      name: 'Feromonas',
      description: 'Magnetismo y atracción potenciados',
      firstPrice: 10000,
      additionalPrice: 8000,
      icon: <Sparkle size={18} weight="fill" />,
      quantity: 0,
    },
    {
      id: 'fijador',
      name: 'Fijador',
      description: 'Mayor duración en la piel',
      firstPrice: 5000,
      additionalPrice: 5000,
      icon: <Drop size={18} weight="fill" />,
      quantity: 0,
    },
  ]);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts(100);
      if (data?.edges) {
        setProducts(data.edges.map((edge: any) => edge.node));
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // ── Derived state ──
  const isMixologyEligible = selectedType === 'elixir' && selectedSize === '100ml';
  const maxAromas = isMixologyEligible ? 2 : 1;
  const basePrice = PRICES[selectedType][selectedSize];
  const extrasTotal = extras.reduce((sum, e) => {
    if (e.quantity === 0) return sum;
    return sum + e.firstPrice + (e.quantity - 1) * e.additionalPrice;
  }, 0);
  const totalPrice = basePrice + extrasTotal;

  // ── Filter products ──
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (activeCategory !== 'todos') {
      const tagMap: Record<string, string[]> = {
        mujer: ['women', 'woman', 'mujer', 'mujeres', 'female'],
        hombre: ['men', 'man', 'hombre', 'hombres', 'male'],
        unisex: ['unisex'],
      };
      const tags = tagMap[activeCategory] || [];
      filtered = filtered.filter(p =>
        tags.some(tag => p.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase())))
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const tagMatch = p.tags?.some(t => t.toLowerCase().includes(q));
        let metaMatch = false;
        if (p.metafields && Array.isArray(p.metafields)) {
          metaMatch = p.metafields.some((m: any) =>
            m?.value?.toLowerCase?.()?.includes(q)
          );
        }
        return titleMatch || tagMatch || metaMatch;
      });
    }

    return filtered;
  }, [products, activeCategory, searchQuery]);

  // ── Handlers ──
  const handleSelectAroma = (product: ShopifyProduct) => {
    setSelectedAromas(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= maxAromas) return [...prev.slice(0, maxAromas - 1), product];
      return [...prev, product];
    });
  };

  const handleExtraQuantity = (id: string, delta: number) => {
    setExtras(prev =>
      prev.map(e => e.id === id ? { ...e, quantity: Math.max(0, Math.min(5, e.quantity + delta)) } : e)
    );
  };

  const goToStep = (s: number) => {
    setStep(s);
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Checkout ──
  const handleCheckout = async () => {
    if (selectedAromas.length === 0) return;
    setIsCheckingOut(true);
    try {
      const lines = selectedAromas.map(product => {
        const variants = product.variants?.edges?.map((e: any) => e.node) || [];
        const matchingVariant = variants.find((v: any) =>
          v.selectedOptions?.some((opt: any) =>
            opt.value.toLowerCase().includes(selectedSize.replace('ml', '')) ||
            opt.value.toLowerCase() === selectedSize
          ) &&
          v.selectedOptions?.some((opt: any) =>
            opt.value.toLowerCase().includes(selectedType === 'elixir' ? 'elixir' : 'parfum') ||
            opt.value.toLowerCase().includes(selectedType === 'essence' ? 'essence' : 'elixir')
          ) && v.availableForSale
        );
        const sizeMatch = !matchingVariant ? variants.find((v: any) =>
          v.selectedOptions?.some((opt: any) =>
            opt.value.toLowerCase().includes(selectedSize.replace('ml', '')) ||
            opt.value.toLowerCase() === selectedSize
          ) && v.availableForSale
        ) : null;
        const variant = matchingVariant || sizeMatch || variants.find((v: any) => v.availableForSale) || variants[0];
        return {
          merchandiseId: variant.id,
          quantity: 1,
          attributes: [
            { key: 'Tipo', value: selectedType === 'elixir' ? 'Elixir' : 'Au Parfum' },
            { key: 'Tamaño', value: selectedSize },
            ...(isMixologyEligible && selectedAromas.length === 2
              ? [{ key: 'Mixología', value: selectedAromas.map(a => a.title).join(' + ') }]
              : []),
            ...extras.filter(e => e.quantity > 0).map(e => ({
              key: e.name,
              value: `x${e.quantity}`,
            })),
          ],
        };
      });
      const resultCart = await createCart(lines);
      if (resultCart?.checkoutUrl) window.location.href = resultCart.checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // ── Render ──
  return (
    <PageContainer>
      <main className="relative pt-20 lg:pt-24 pb-24 lg:pb-0">

        {/* ━━ Hero ━━ */}
        <section className="border-b bg-background">
          <div className="container mx-auto px-4 py-12 md:py-16 text-center max-w-3xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground mb-3 font-medium"
            >
              Experiencia exclusiva
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold tracking-tight mb-3"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Crea tu Aroma
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-sm md:text-base max-w-md mx-auto"
            >
              Personaliza tu fragancia en tres simples pasos.
            </motion.p>
          </div>
        </section>

        {/* ━━ Step Indicator ━━ */}
        <div ref={contentRef} className="border-b bg-background/95 backdrop-blur-sm sticky top-[52px] z-30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between max-w-md mx-auto py-3">
              {STEP_LABELS.map((label, i) => {
                const num = i + 1;
                const isActive = step === num;
                const isDone = step > num;
                return (
                  <button
                    key={num}
                    onClick={() => {
                      if (num < step || (num === 2 && step >= 1) || (num === 3 && selectedAromas.length > 0)) {
                        goToStep(num);
                      }
                    }}
                    className="flex items-center gap-2 group relative"
                  >
                    <div className={`
                      w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                      ${isDone ? 'bg-foreground text-background' : ''}
                      ${isActive ? 'bg-foreground text-background scale-110' : ''}
                      ${!isDone && !isActive ? 'bg-muted text-muted-foreground' : ''}
                    `}>
                      {isDone ? <Check size={13} weight="bold" /> : num}
                    </div>
                    <span className={`text-xs font-medium transition-colors hidden sm:block
                      ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                    `}>
                      {label}
                    </span>
                    {i < 2 && (
                      <div className={`w-8 sm:w-12 h-px mx-1 transition-colors duration-300 ${isDone ? 'bg-foreground' : 'bg-border'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ━━ Content ━━ */}
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

            {/* ── Main Area ── */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">

                {/* ━━ STEP 1: Type & Size ━━ */}
                {step === 1 && (
                  <motion.div key="step1" {...fadeSlide} className="space-y-8">

                    {/* Type Selection */}
                    <section>
                      <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                        Concentración
                      </h2>
                      <p className="text-sm text-muted-foreground mb-5">
                        Elige la intensidad de tu perfume
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Au Parfum */}
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedType('essence')}
                          className={`relative p-5 rounded-xl border text-left transition-all duration-200 group
                            ${selectedType === 'essence'
                              ? 'border-foreground bg-foreground/3 shadow-sm'
                              : 'border-border hover:border-foreground/30'
                            }`}
                        >
                          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                            ${selectedType === 'essence' ? 'border-foreground bg-foreground' : 'border-muted-foreground/30'}`}>
                            {selectedType === 'essence' && <Check size={11} weight="bold" className="text-background" />}
                          </div>
                          <p className="font-bold text-base mb-1">Au Parfum</p>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                            Clásica, equilibrada y versátil. Perfecta para el día a día.
                          </p>
                          <p className="text-sm font-bold">Desde {formatPrice('55000')}</p>
                        </motion.button>

                        {/* Elixir */}
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedType('elixir')}
                          className={`relative p-5 rounded-xl border text-left transition-all duration-200 group
                            ${selectedType === 'elixir'
                              ? 'border-foreground bg-foreground/3 shadow-sm'
                              : 'border-border hover:border-foreground/30'
                            }`}
                        >
                          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                            ${selectedType === 'elixir' ? 'border-foreground bg-foreground' : 'border-muted-foreground/30'}`}>
                            {selectedType === 'elixir' && <Check size={11} weight="bold" className="text-background" />}
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-base">Elixir</p>
                            <span className="px-1.5 py-0.5 bg-foreground text-background text-[10px] font-bold rounded-sm tracking-wide">
                              POPULAR
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                            Intensa y duradera. Mayor concentración, más fijación.
                          </p>
                          <p className="text-sm font-bold">Desde {formatPrice('95000')}</p>
                        </motion.button>
                      </div>
                    </section>

                    {/* Size Selection */}
                    <section>
                      <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                        Tamaño
                      </h2>
                      <p className="text-sm text-muted-foreground mb-5">
                        Selecciona tu presentación
                      </p>

                      <div className="flex gap-3">
                        {(['30ml', '50ml', '100ml'] as PerfumeSize[]).map(size => {
                          const price = PRICES[selectedType][size];
                          const isMix = selectedType === 'elixir' && size === '100ml';
                          const isActive = selectedSize === size;

                          return (
                            <motion.button
                              key={size}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setSelectedSize(size)}
                              className={`flex-1 relative p-4 rounded-xl border text-center transition-all duration-200
                                ${isActive
                                  ? 'border-foreground bg-foreground/3 shadow-sm'
                                  : 'border-border hover:border-foreground/30'
                                }`}
                            >
                              <div className="text-2xl font-bold leading-none mb-0.5">
                                {size.replace('ml', '')}
                              </div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">ml</div>
                              <div className="text-sm font-bold">{formatPrice(price.toString())}</div>
                              {isMix && (
                                <div className="mt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-foreground/70">
                                  <Flask size={11} weight="fill" />
                                  Mixología
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Mixology hint */}
                      <AnimatePresence>
                        {isMixologyEligible && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 p-3 rounded-xl bg-foreground/3 border border-foreground/10 flex items-center gap-3">
                              <Flask size={18} weight="fill" className="text-foreground/70 shrink-0" />
                              <p className="text-xs text-muted-foreground">
                                <strong className="text-foreground">Mixología desbloqueada.</strong>{' '}
                                Podrás mezclar 2 aromas en una sola fragancia.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>

                    {/* Next */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => goToStep(2)}
                      className="w-full py-3.5 bg-foreground text-background font-bold rounded-xl text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors"
                    >
                      Elegir aromas
                      <ArrowRight size={16} weight="bold" />
                    </motion.button>
                  </motion.div>
                )}

                {/* ━━ STEP 2: Choose Aromas ━━ */}
                {step === 2 && (
                  <motion.div key="step2" {...fadeSlide} className="space-y-5">

                    {/* Mixology banner */}
                    {isMixologyEligible ? (
                      <div className="p-3 rounded-xl bg-foreground/3 border border-foreground/10 flex items-center gap-3">
                        <Flask size={18} weight="fill" className="text-foreground/70 shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          Selecciona <strong className="text-foreground">2 aromas</strong> para mezclarlos en una fragancia única.
                        </p>
                        <span className="ml-auto text-xs font-bold shrink-0">
                          {selectedAromas.length}/{maxAromas}
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-muted/50 border flex items-center gap-3">
                        <p className="text-xs text-muted-foreground flex-1">
                          Selecciona <strong className="text-foreground">1 aroma</strong> para tu {selectedType === 'elixir' ? 'Elixir' : 'Au Parfum'} de {selectedSize}.
                        </p>
                        <span className="text-xs font-bold shrink-0">
                          {selectedAromas.length}/{maxAromas}
                        </span>
                      </div>
                    )}

                    {/* Selected aromas chips */}
                    <AnimatePresence>
                      {selectedAromas.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-wrap gap-2 overflow-hidden"
                        >
                          {selectedAromas.map(aroma => (
                            <motion.button
                              key={aroma.id}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              onClick={() => handleSelectAroma(aroma)}
                              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-foreground text-background text-xs font-medium group"
                            >
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-background/20 shrink-0">
                                {aroma.images?.edges?.[0]?.node?.url && (
                                  <Image
                                    src={aroma.images.edges[0].node.url}
                                    alt={aroma.title}
                                    width={24}
                                    height={24}
                                    className="object-cover w-full h-full"
                                  />
                                )}
                              </div>
                              <span className="max-w-[120px] truncate">{aroma.title}</span>
                              <X size={12} weight="bold" className="opacity-60 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Search + Category Tabs */}
                    <div className="space-y-3">
                      {/* Search */}
                      <div className="relative">
                        <MagnifyingGlass size={16} weight="light" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          ref={searchRef}
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Buscar fragancia o marca..."
                          className="w-full pl-9 pr-9 py-2.5 bg-muted/50 border border-border rounded-xl text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X size={14} weight="bold" />
                          </button>
                        )}
                      </div>

                      {/* Category tabs */}
                      <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
                        {[
                          { key: 'todos' as Category, label: 'Todos' },
                          { key: 'hombre' as Category, label: 'Hombre' },
                          { key: 'mujer' as Category, label: 'Mujer' },
                          { key: 'unisex' as Category, label: 'Unisex' },
                        ].map(cat => (
                          <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200
                              ${activeCategory === cat.key
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                              }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                      <div className="flex items-center justify-center py-16">
                        <CircleNotch size={24} weight="light" className="animate-spin text-muted-foreground" />
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-center py-16">
                        <MagnifyingGlass size={32} weight="light" className="mx-auto text-muted-foreground/40 mb-3" />
                        <p className="text-sm text-muted-foreground">
                          {searchQuery ? `Sin resultados para "${searchQuery}"` : 'No hay fragancias en esta categoría'}
                        </p>
                      </div>
                    ) : (
                      <motion.div
                        variants={stagger}
                        initial="initial"
                        animate="animate"
                        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                      >
                        {filteredProducts.map(product => (
                          <AromaCard
                            key={product.id}
                            product={product}
                            isSelected={selectedAromas.some(a => a.id === product.id)}
                            onSelect={handleSelectAroma}
                          />
                        ))}
                      </motion.div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => goToStep(1)}
                        className="flex items-center justify-center gap-2 px-5 py-3 border border-border text-foreground font-medium rounded-xl text-sm hover:bg-muted/50 transition-colors"
                      >
                        <ArrowLeft size={14} weight="bold" />
                        Atrás
                      </button>
                      <button
                        onClick={() => goToStep(3)}
                        disabled={selectedAromas.length === 0}
                        className="flex-1 py-3 bg-foreground text-background font-bold rounded-xl text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Personalizar
                        <ArrowRight size={14} weight="bold" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ━━ STEP 3: Customize ━━ */}
                {step === 3 && (
                  <motion.div key="step3" {...fadeSlide} className="space-y-6">
                    <section>
                      <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                        Extras
                      </h2>
                      <p className="text-sm text-muted-foreground mb-5">
                        Potencia tu fragancia con nuestros complementos
                      </p>

                      <div className="space-y-3">
                        {extras.map(extra => (
                          <motion.div
                            key={extra.id}
                            whileHover={{ y: -1 }}
                            className={`p-4 rounded-xl border transition-all duration-200 ${
                              extra.quantity > 0 ? 'border-foreground bg-foreground/2' : 'border-border'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  extra.quantity > 0 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                                }`}>
                                  {extra.icon}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-sm">{extra.name}</p>
                                  <p className="text-xs text-muted-foreground">{extra.description}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleExtraQuantity(extra.id, -1)}
                                  disabled={extra.quantity === 0}
                                  className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-20"
                                >
                                  <Minus size={12} weight="bold" />
                                </button>
                                <span className="w-7 text-center text-sm font-bold tabular-nums">{extra.quantity}</span>
                                <button
                                  onClick={() => handleExtraQuantity(extra.id, 1)}
                                  className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors"
                                >
                                  <Plus size={12} weight="bold" />
                                </button>
                              </div>
                            </div>
                            {extra.quantity > 0 && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-muted-foreground mt-2 ml-12"
                              >
                                +{formatPrice((extra.firstPrice + (extra.quantity - 1) * extra.additionalPrice).toString())}
                              </motion.p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    {/* Free Gift */}
                    <AnimatePresence>
                      {isMixologyEligible && (
                        <motion.section
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl border border-dashed border-foreground/20 bg-foreground/2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-foreground/10 flex items-center justify-center shrink-0">
                              <Gift size={18} weight="fill" className="text-foreground/70" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm">Perfumero 10ml sorpresa</p>
                              <p className="text-xs text-muted-foreground">Incluido con tu Elixir 100ml</p>
                            </div>
                            <span className="text-xs font-bold text-foreground/70 bg-foreground/5 px-2 py-1 rounded-lg shrink-0">
                              GRATIS
                            </span>
                          </div>
                        </motion.section>
                      )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => goToStep(2)}
                        className="flex items-center justify-center gap-2 px-5 py-3 border border-border text-foreground font-medium rounded-xl text-sm hover:bg-muted/50 transition-colors"
                      >
                        <ArrowLeft size={14} weight="bold" />
                        Atrás
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleCheckout}
                        disabled={selectedAromas.length === 0 || isCheckingOut}
                        className="flex-1 py-3.5 bg-foreground text-background font-bold rounded-xl text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {isCheckingOut ? (
                          <CircleNotch size={16} weight="light" className="animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart size={16} weight="light" />
                            Pagar {formatPrice(totalPrice.toString())}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* ━━ Desktop Sidebar ━━ */}
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-28">
                <div className="rounded-xl border bg-background overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Tu creación</p>
                    <p className="font-bold text-sm">
                      {selectedType === 'elixir' ? 'Elixir' : 'Au Parfum'} · {selectedSize}
                      {isMixologyEligible && selectedAromas.length === 2 ? ' · Mix' : ''}
                    </p>
                  </div>

                  <div className="p-4 space-y-4 text-sm">
                    {/* Selected aromas */}
                    {selectedAromas.length > 0 ? (
                      <div className="space-y-2">
                        {selectedAromas.map((aroma, i) => (
                          <div key={aroma.id} className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-muted">
                              {aroma.images?.edges?.[0]?.node?.url && (
                                <Image
                                  src={aroma.images.edges[0].node.url}
                                  alt={aroma.title}
                                  width={36}
                                  height={36}
                                  className="object-cover w-full h-full"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs truncate">{aroma.title}</p>
                              {aroma.metafields?.find((m: any) => m?.key === 'inspiration_brand')?.value && (
                                <p className="text-[10px] text-muted-foreground truncate">
                                  Insp. {aroma.metafields.find((m: any) => m?.key === 'inspiration_brand')?.value}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {isMixologyEligible && selectedAromas.length === 2 && (
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1">
                            <Flask size={10} weight="fill" />
                            Se mezclan en una fragancia
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Selecciona tus aromas</p>
                    )}

                    {/* Extras in sidebar */}
                    {extras.some(e => e.quantity > 0) && (
                      <div className="pt-3 border-t space-y-1.5">
                        {extras.filter(e => e.quantity > 0).map(e => (
                          <div key={e.id} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{e.name} ×{e.quantity}</span>
                            <span>+{formatPrice((e.firstPrice + (e.quantity - 1) * e.additionalPrice).toString())}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Gift */}
                    {isMixologyEligible && (
                      <div className="pt-3 border-t flex items-center gap-2 text-xs">
                        <Gift size={13} weight="fill" className="text-foreground/60" />
                        <span className="text-muted-foreground">Perfumero 10ml</span>
                        <span className="ml-auto font-bold text-foreground/60">Gratis</span>
                      </div>
                    )}

                    {/* Total */}
                    <div className="pt-3 border-t">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Perfume base</span>
                        <span>{formatPrice(basePrice.toString())}</span>
                      </div>
                      {extrasTotal > 0 && (
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Extras</span>
                          <span>+{formatPrice(extrasTotal.toString())}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-base pt-2 mt-2 border-t">
                        <span>Total</span>
                        <span>{formatPrice(totalPrice.toString())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ━━ Mobile Bottom Bar ━━ */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
          {/* Expandable summary */}
          <AnimatePresence>
            {showMobileSummary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-background border-t"
              >
                <div className="p-4 space-y-3 max-h-[40vh] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider">Tu Creación</p>
                    <button onClick={() => setShowMobileSummary(false)}>
                      <X size={16} weight="bold" className="text-muted-foreground" />
                    </button>
                  </div>

                  <div className="text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo</span>
                      <span className="font-medium">{selectedType === 'elixir' ? 'Elixir' : 'Au Parfum'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tamaño</span>
                      <span className="font-medium">{selectedSize}</span>
                    </div>
                    {selectedAromas.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Aromas</span>
                        <span className="font-medium text-right max-w-[60%] truncate">
                          {selectedAromas.map(a => a.title).join(' + ')}
                        </span>
                      </div>
                    )}
                    {extras.filter(e => e.quantity > 0).map(e => (
                      <div key={e.id} className="flex justify-between">
                        <span className="text-muted-foreground">{e.name} ×{e.quantity}</span>
                        <span>+{formatPrice((e.firstPrice + (e.quantity - 1) * e.additionalPrice).toString())}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main bar */}
          <div className="bg-background/95 backdrop-blur-md border-t px-4 py-3 safe-area-bottom">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileSummary(prev => !prev)}
                className="flex items-center gap-2 min-w-0"
              >
                <div className="text-left min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
                  <p className="font-bold text-base leading-tight">{formatPrice(totalPrice.toString())}</p>
                </div>
                <SlidersHorizontal size={14} weight="light" className="text-muted-foreground shrink-0" />
              </button>

              <div className="flex-1">
                {step < 3 ? (
                  <button
                    onClick={() => {
                      if (step === 1) goToStep(2);
                      else if (step === 2 && selectedAromas.length > 0) goToStep(3);
                    }}
                    disabled={step === 2 && selectedAromas.length === 0}
                    className="w-full py-3 bg-foreground text-background font-bold rounded-xl text-xs tracking-wide flex items-center justify-center gap-1.5 disabled:opacity-30"
                  >
                    Siguiente
                    <ArrowRight size={13} weight="bold" />
                  </button>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={selectedAromas.length === 0 || isCheckingOut}
                    className="w-full py-3 bg-foreground text-background font-bold rounded-xl text-xs tracking-wide flex items-center justify-center gap-1.5 disabled:opacity-30"
                  >
                    {isCheckingOut ? (
                      <CircleNotch size={14} weight="light" className="animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart size={14} weight="light" />
                        Pagar
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </PageContainer>
  );
}

// ── Aroma Card ──
function AromaCard({
  product,
  isSelected,
  onSelect,
}: {
  product: ShopifyProduct;
  isSelected: boolean;
  onSelect: (product: ShopifyProduct) => void;
}) {
  const image = product.images?.edges?.[0]?.node;

  let inspirationText: string | null = null;
  if (product.metafields && Array.isArray(product.metafields)) {
    const meta = product.metafields.find((m: any) => m?.key === 'inspiration_brand' && m?.value);
    if (meta?.value) inspirationText = meta.value;
  }

  return (
    <motion.button
      variants={cardItem}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(product)}
      className={`group relative bg-background rounded-xl border overflow-hidden text-left transition-all duration-200
        ${isSelected
          ? 'border-foreground shadow-md ring-1 ring-foreground/10'
          : 'border-border hover:border-foreground/20 hover:shadow-sm'
        }`}
    >
      {/* Check */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-2.5 right-2.5 z-10 w-6 h-6 bg-foreground rounded-full flex items-center justify-center shadow-sm"
          >
            <Check size={12} weight="bold" className="text-background" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted/50">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Flask size={24} weight="light" className="text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="font-semibold text-xs leading-snug line-clamp-2">{product.title}</p>
        {inspirationText && (
          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
            Insp. {inspirationText}
          </p>
        )}
      </div>
    </motion.button>
  );
}
