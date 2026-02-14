'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlass,
  X,
  User,
  Flower,
  Drop,
  Sparkle,
  ArrowRight,
  CaretDown,
  Check,
  Funnel,
  CircleNotch,
} from 'phosphor-react';
import { useCurrency } from '@/contexts/currency-context';
import { useProducts } from '@/lib/hooks/useShopify';
import {
  filterProducts,
  getUniqueInspirationBrands,
  getUniqueAromaticNotes,
  getMetafieldValue,
  getMetafieldArray,
} from '@/lib/utils/product-filters';
import { useRouter } from 'next/navigation';
import type { ShopifyProduct } from '@/lib/types/shopify';

// Tipos de datos
export type Gender = 'women' | 'men' | 'unisex';
export type Brand = string;
export type Note = string;
export type FragranceFamily = 'flowery' | 'warm' | 'gourmand' | 'fresh' | 'earthy' | 'herbal';

export interface PerfumeFilters {
  genders: Gender[];
  brands: Brand[];
  notes: Note[];
  families: FragranceFamily[];
}

type PerfumeSearchModalProps = {
  children: React.ReactNode;
  onSearch?: (filters: PerfumeFilters, query: string) => void;
};

// Datos de filtros
const GENDERS: { value: Gender; label: string }[] = [
  { value: 'women', label: 'Mujer' },
  { value: 'men', label: 'Hombre' },
  { value: 'unisex', label: 'Unisex' },
];

const FRAGRANCE_FAMILIES: { value: FragranceFamily; label: string }[] = [
  { value: 'flowery', label: 'Floral' },
  { value: 'warm', label: 'Cálido' },
  { value: 'gourmand', label: 'Gourmand' },
  { value: 'fresh', label: 'Fresco' },
  { value: 'earthy', label: 'Terroso' },
  { value: 'herbal', label: 'Herbal' },
];

// Collapsible filter section
function FilterSection({
  title,
  icon: Icon,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: React.ComponentType<any>;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 md:py-3.5 text-left group/section"
      >
        <span className="flex items-center gap-2.5 text-[11px] md:text-xs font-semibold tracking-wider uppercase text-foreground/80">
          <Icon size={15} weight="light" className="text-muted-foreground" />
          {title}
          {count > 0 && (
            <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-foreground text-background text-[9px] font-bold">
              {count}
            </span>
          )}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <CaretDown size={14} weight="light" className="text-muted-foreground group-hover/section:text-foreground transition-colors" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-3 md:pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Filter pill component
function FilterPill({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 md:px-3.5 md:py-2 rounded-full text-[11px] md:text-xs font-medium transition-all duration-200 border',
        isSelected
          ? 'bg-foreground text-background border-foreground shadow-sm'
          : 'bg-transparent text-foreground/70 border-border/60 hover:border-foreground/30 hover:text-foreground'
      )}
    >
      {isSelected && (
        <Check size={12} weight="bold" className="shrink-0" />
      )}
      {label}
    </motion.button>
  );
}

// Product result card
function ProductResultCard({
  product,
  formatPrice,
  onClick,
}: {
  product: ShopifyProduct;
  formatPrice: (price: string) => string;
  onClick: () => void;
}) {
  const price = product.variants.edges[0]?.node.price.amount || '0';
  const image = product.featuredImage?.url || product.images.edges[0]?.node?.url;
  const brand = getMetafieldValue(product, 'inspiration_brand');
  const notes = getMetafieldArray(product, 'aromatic_notes').slice(0, 3);

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group text-left"
    >
      <div className="w-14 h-14 md:w-[68px] md:h-[68px] rounded-lg overflow-hidden bg-muted shrink-0 ring-1 ring-border/30">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            width={68}
            height={68}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground/40 text-[10px]">Sin img</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[13px] md:text-sm text-foreground line-clamp-1 font-serif tracking-tight">
          {product.title}
        </h4>
        {brand && (
          <p className="text-[10px] md:text-[11px] text-muted-foreground mt-0.5 tracking-wide uppercase">
            Insp. {brand}
          </p>
        )}
        <p className="text-[12px] md:text-[13px] font-semibold text-foreground/80 mt-0.5">
          {formatPrice(price)}
        </p>
      </div>
      <ArrowRight
        size={16}
        weight="light"
        className="text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
      />
    </motion.button>
  );
}


export function PerfumeSearchModal({ children, onSearch }: PerfumeSearchModalProps) {
  const router = useRouter();
  const { products, loading } = useProducts(50);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { formatPrice } = useCurrency();
  const inputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState<PerfumeFilters>({
    genders: [],
    brands: [],
    notes: [],
    families: [],
  });

  // Extraer datos dinámicos de productos reales
  const dynamicBrands = useMemo(() => getUniqueInspirationBrands(products), [products]);
  const dynamicNotes = useMemo(() => getUniqueAromaticNotes(products), [products]);

  // Filtrar productos según búsqueda y filtros
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return filterProducts(products, {
      searchQuery: query,
      genders: filters.genders.map(g => g.charAt(0).toUpperCase() + g.slice(1)),
      brands: filters.brands,
      aromaticNotes: filters.notes,
      fragranceFamilies: filters.families.map(f => f.charAt(0).toUpperCase() + f.slice(1)),
    }).slice(0, 10);
  }, [products, query, filters]);

  // Manejar tecla de atajo Cmd/Ctrl + K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus input when opening
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const toggleFilter = <T extends keyof PerfumeFilters>(
    category: T,
    value: PerfumeFilters[T][number]
  ) => {
    setFilters((prev) => {
      const currentValues = prev[category] as any[];
      const isSelected = currentValues.includes(value);

      return {
        ...prev,
        [category]: isSelected
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  };

  const removeFilter = useCallback((category: keyof PerfumeFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: (prev[category] as any[]).filter((v) => v !== value),
    }));
  }, []);

  const clearFilters = () => {
    setFilters({ genders: [], brands: [], notes: [], families: [] });
    setQuery('');
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    onSearch?.(filters, query);
    setOpen(false);
  };

  const activeFilterCount =
    filters.genders.length + filters.brands.length + filters.notes.length + filters.families.length;

  const hasActiveFilters = activeFilterCount > 0 || query.length > 0;

  // Collect all active filter chips for display
  const activeChips = useMemo(() => {
    const chips: { category: keyof PerfumeFilters; value: string; label: string }[] = [];
    filters.genders.forEach(v => {
      const g = GENDERS.find(g => g.value === v);
      chips.push({ category: 'genders', value: v, label: g?.label || v });
    });
    filters.brands.forEach(v => chips.push({ category: 'brands', value: v, label: v }));
    filters.notes.forEach(v => chips.push({ category: 'notes', value: v, label: v }));
    filters.families.forEach(v => {
      const f = FRAGRANCE_FAMILIES.find(f => f.value === v);
      chips.push({ category: 'families', value: v, label: f?.label || v });
    });
    return chips;
  }, [filters]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="w-[96vw] max-w-[96vw] md:max-w-5xl p-0 overflow-hidden gap-0 bg-background border-border/50 shadow-2xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Buscar Perfumes</DialogTitle>
        <DialogDescription className="sr-only">Busca perfumes por marca, notas o género</DialogDescription>

        <div className="flex flex-col h-[88vh] md:h-[680px]">
          {/* Search Header */}
          <div className="relative border-b border-border/50 px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center gap-3">
              <MagnifyingGlass
                size={22}
                weight="light"
                className="text-muted-foreground shrink-0"
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar por nombre, marca o nota..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 py-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-base md:text-lg font-light tracking-wide"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                  className="p-1 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <X size={16} weight="light" />
                </button>
              )}
              <div className="hidden md:flex items-center gap-1.5 text-muted-foreground/40 text-[11px] shrink-0 select-none">
                <kbd className="px-1.5 py-0.5 rounded-sm border border-border/60 bg-muted/40 font-mono text-[10px]">Esc</kbd>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0 md:hidden"
              >
                <X size={20} weight="light" />
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          <AnimatePresence>
            {activeChips.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-border/50 overflow-hidden"
              >
                <div className="px-4 md:px-6 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                  <Funnel size={14} weight="light" className="text-muted-foreground shrink-0" />
                  <div className="flex items-center gap-1.5 flex-nowrap">
                    {activeChips.map((chip) => (
                      <motion.button
                        key={`${chip.category}-${chip.value}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        onClick={() => removeFilter(chip.category, chip.value)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground/5 border border-border/50 text-[11px] text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors shrink-0 group/chip"
                      >
                        {chip.label}
                        <X size={10} weight="bold" className="opacity-50 group-hover/chip:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors shrink-0 ml-auto pl-2"
                  >
                    Limpiar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
            {/* Left Panel - Filters */}
            <div className="w-full md:w-[340px] lg:w-[380px] overflow-y-auto px-4 md:px-6 shrink-0 max-h-[35vh] md:max-h-none">
              <FilterSection
                title="Género"
                icon={User}
                count={filters.genders.length}
                defaultOpen={true}
              >
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {GENDERS.map((gender) => (
                    <FilterPill
                      key={gender.value}
                      label={gender.label}
                      isSelected={filters.genders.includes(gender.value)}
                      onClick={() => toggleFilter('genders', gender.value)}
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection
                title="Marca de inspiración"
                icon={Sparkle}
                count={filters.brands.length}
                defaultOpen={true}
              >
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {dynamicBrands.map((brand) => (
                    <FilterPill
                      key={brand}
                      label={brand}
                      isSelected={filters.brands.includes(brand)}
                      onClick={() => toggleFilter('brands', brand)}
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection
                title="Notas aromáticas"
                icon={Drop}
                count={filters.notes.length}
                defaultOpen={false}
              >
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {dynamicNotes.map((note) => (
                    <FilterPill
                      key={note}
                      label={note}
                      isSelected={filters.notes.includes(note)}
                      onClick={() => toggleFilter('notes', note)}
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection
                title="Familias olfativas"
                icon={Flower}
                count={filters.families.length}
                defaultOpen={false}
              >
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {FRAGRANCE_FAMILIES.map((family) => (
                    <FilterPill
                      key={family.value}
                      label={family.label}
                      isSelected={filters.families.includes(family.value)}
                      onClick={() => toggleFilter('families', family.value)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Action Buttons - Mobile */}
              <div className="flex md:hidden gap-2 py-3 border-t border-border/50">
                <button
                  onClick={handleSearch}
                  disabled={!hasActiveFilters}
                  className="flex-1 py-2.5 bg-foreground text-background text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-30"
                >
                  Ver todos los resultados
                </button>
              </div>
            </div>

            {/* Right Panel - Results */}
            <div className="flex-1 border-t md:border-t-0 md:border-l border-border/50 flex flex-col min-h-0 overflow-hidden bg-muted/20">
              {/* Results header */}
              <div className="px-4 md:px-5 py-3 flex items-center justify-between shrink-0">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                  {loading ? 'Cargando...' : filteredProducts.length > 0
                    ? `${filteredProducts.length} resultado${filteredProducts.length !== 1 ? 's' : ''}`
                    : 'Resultados'}
                </span>
                {hasActiveFilters && filteredProducts.length > 0 && (
                  <button
                    onClick={handleSearch}
                    className="text-[11px] font-medium text-foreground/60 hover:text-foreground underline-offset-2 hover:underline transition-colors flex items-center gap-1"
                  >
                    Ver todos
                    <ArrowRight size={12} weight="light" />
                  </button>
                )}
              </div>

              {/* Results list */}
              <div className="flex-1 overflow-y-auto px-2 md:px-3 pb-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <CircleNotch size={28} weight="light" className="animate-spin text-muted-foreground/50" />
                    <p className="text-muted-foreground/50 text-xs">Buscando perfumes...</p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="space-y-0.5">
                    <AnimatePresence mode="popLayout">
                      {filteredProducts.map((product: ShopifyProduct, index: number) => (
                        <ProductResultCard
                          key={product.id}
                          product={product}
                          formatPrice={formatPrice}
                          onClick={() => {
                            router.push(`/products/${product.handle}`);
                            setOpen(false);
                          }}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : hasActiveFilters ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <MagnifyingGlass size={32} weight="light" className="text-muted-foreground/30" />
                    <div className="text-center">
                      <p className="text-foreground/60 text-sm font-medium">Sin resultados</p>
                      <p className="text-muted-foreground/50 text-xs mt-1">Prueba con otros filtros o términos</p>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="mt-2 px-4 py-1.5 text-[11px] font-medium border border-border/60 rounded-full text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <MagnifyingGlass size={32} weight="light" className="text-muted-foreground/20" />
                    <div className="text-center">
                      <p className="text-foreground/50 text-sm font-medium">Encuentra tu fragancia</p>
                      <p className="text-muted-foreground/40 text-xs mt-1 max-w-[200px]">
                        Escribe un nombre o usa los filtros para descubrir tu perfume ideal
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
