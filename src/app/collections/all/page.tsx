'use client';

import { useState, useMemo, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MagnifyingGlass, CaretDown, X, Users, Sparkle, Tag, CircleNotch, Faders, ArrowUp } from 'phosphor-react';
import { useProducts } from '@/lib/hooks/useShopify';
import { getCollections } from '@/lib/shopify';
import { ProductCard } from '@/components/product/product-card';
import {
  filterProducts,
  sortProducts,
  getUniqueInspirationBrands,
  getUniqueGenders,
  getUniqueFragranceFamilies,
  type SortOption
} from '@/lib/utils/product-filters';
import { CategoryMarquee } from '@/components/sections/category-marquee';

// Skeleton loader for product cards
function ProductSkeleton() {
  return (
    <div className="w-full flex flex-col rounded-lg overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-muted" />
      <div className="px-3 py-3 space-y-2">
        <div className="flex justify-between">
          <div className="h-3.5 bg-muted rounded-md w-24" />
          <div className="h-3.5 bg-muted rounded-md w-16" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 bg-muted rounded-md w-16" />
          <div className="h-5 bg-muted rounded-md w-12" />
        </div>
      </div>
    </div>
  );
}

// Stagger animation config
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }
  }
};

// Filter dropdown component
function FilterDropdown({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/10 lg:bg-transparent z-9998" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-auto lg:top-full lg:left-0 lg:right-auto lg:mt-2 w-full lg:w-56 bg-card border-t lg:border border-border lg:rounded-xl shadow-2xl z-9999 rounded-t-2xl lg:rounded-t-xl overflow-hidden max-h-[60vh] lg:max-h-[400px] flex flex-col"
      >
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{title}</span>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} weight="light" />
            </button>
          </div>
        </div>
        <div className="p-2 max-h-64 overflow-y-auto">{children}</div>
      </motion.div>
    </>
  );
}

function AllProductsContent() {
  const searchParams = useSearchParams();
  const { products, loading, hasNextPage, loadMore } = useProducts(20);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterOverflow, setFilterOverflow] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedFragranceFamily, setSelectedFragranceFamily] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  // Collections state
  const [shopifyCollections, setShopifyCollections] = useState<any[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const activeFilterCount = selectedGender.length + selectedFragranceFamily.length + selectedBrand.length;

  // Reset overflow when filters close
  useEffect(() => {
    if (!showFilters) setFilterOverflow(false);
  }, [showFilters]);

  // Scroll-to-top button
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Read URL search params and apply as filters
  useEffect(() => {
    const q = searchParams.get('q');
    const gender = searchParams.get('gender');
    const brands = searchParams.get('brands');
    const families = searchParams.get('families');

    if (q) setSearchQuery(q);
    if (gender) setSelectedGender(gender.split(',').filter(Boolean));
    if (brands) setSelectedBrand(brands.split(',').filter(Boolean));
    if (families) setSelectedFragranceFamily(families.split(',').filter(Boolean));
  }, [searchParams]);

  // Fetch all Shopify collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setCollectionsLoading(true);
        const data = await getCollections();
        const collectionsArray = data?.edges?.map((edge: any) => ({
          id: edge.node.id,
          label: edge.node.title,
          handle: edge.node.handle,
          href: `/collections/${edge.node.handle}`,
        })) || [];
        setShopifyCollections(collectionsArray);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setShopifyCollections([]);
      } finally {
        setCollectionsLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const toggleDropdown = (key: string) => {
    setOpenDropdown(prev => prev === key ? null : key);
  };
  const closeDropdowns = () => setOpenDropdown(null);

  // Extraer opciones de filtros dinámicamente
  const genderOptions = useMemo(() => getUniqueGenders(products), [products]);
  const brandOptions = useMemo(() => getUniqueInspirationBrands(products), [products]);
  const fragranceOptions = useMemo(() => {
    const families = getUniqueFragranceFamilies(products);
    return families.map(name => ({ name }));
  }, [products]);

  // Aplicar filtros y ordenamiento
  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, {
      searchQuery,
      genders: selectedGender,
      brands: selectedBrand,
      aromaticNotes: [],
      fragranceFamilies: selectedFragranceFamily,
    });
    return sortProducts(filtered, sortBy as SortOption);
  }, [products, searchQuery, selectedGender, selectedBrand, selectedFragranceFamily, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedGender([]);
    setSelectedBrand([]);
    setSelectedFragranceFamily([]);
  };

  const sortLabel = {
    featured: 'Destacados',
    'price-low': 'Menor Precio',
    'price-high': 'Mayor Precio',
    newest: 'Más Nuevos',
    bestselling: 'Más Vendidos',
  }[sortBy] || 'Destacados';

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Category Navigation Bar */}
      <CategoryMarquee
        items={[
          { id: 'all', label: 'TODOS LOS PERFUMES', handle: 'all', href: '/collections/all' },
          ...shopifyCollections.map(c => ({ id: c.id, label: c.label, handle: c.handle, href: c.href }))
        ]}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isLoading={collectionsLoading}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6 sm:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Catálogo completo
            </p>
            <div className="flex items-end justify-between gap-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05]">
                Todos los Perfumes
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground tabular-nums pb-1 shrink-0"
              >
                {loading && products.length === 0 ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CircleNotch size={12} weight="bold" className="animate-spin" />
                    Cargando
                  </span>
                ) : (
                  `${filteredProducts.length} fragancia${filteredProducts.length !== 1 ? 's' : ''}`
                )}
              </motion.p>
            </div>
          </motion.div>

          {/* Search + Filter Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
          >
            <div className="relative flex-1 max-w-lg">
              <MagnifyingGlass size={18} weight="light" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre, marca de inspiración..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 text-foreground placeholder:text-muted-foreground transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X size={14} weight="bold" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 border shrink-0 ${
                showFilters || activeFilterCount > 0
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-border hover:border-foreground/30'
              }`}
            >
              <Faders size={16} weight="light" />
              <span>Filtros</span>
              {activeFilterCount > 0 && (
                <span className="ml-0.5 w-5 h-5 rounded-full bg-background text-foreground text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </motion.div>
        </div>

        <div className="h-px bg-border" />
      </section>

      {/* Expandable Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => { if (showFilters) setFilterOverflow(true); }}
            className={`bg-muted/20 border-b border-border ${filterOverflow ? 'overflow-visible' : 'overflow-hidden'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
              <div className="flex flex-wrap gap-2 items-center">
                {/* Sort */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDropdown('sort')}
                    className={`gap-1.5 text-xs sm:text-sm rounded-full transition-all duration-200 ${openDropdown === 'sort' ? 'bg-foreground text-background border-foreground' : 'border-border/60 hover:border-foreground/30'}`}
                  >
                    Ordenar: {sortLabel}
                    <CaretDown size={12} weight="bold" className={`transition-transform duration-200 ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
                  </Button>
                  <FilterDropdown isOpen={openDropdown === 'sort'} onClose={closeDropdowns} title="Ordenar Por">
                    {[
                      { value: 'featured', label: 'Destacados' },
                      { value: 'newest', label: 'Más Nuevos' },
                      { value: 'bestselling', label: 'Más Vendidos' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); closeDropdowns(); }}
                        className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${
                          sortBy === opt.value ? 'bg-foreground/10 text-foreground font-semibold' : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </FilterDropdown>
                </div>

                {/* Gender */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDropdown('gender')}
                    className={`gap-1.5 text-xs sm:text-sm rounded-full transition-all duration-200 ${
                      openDropdown === 'gender' || selectedGender.length > 0 ? 'bg-foreground text-background border-foreground' : 'border-border/60 hover:border-foreground/30'
                    }`}
                  >
                    <Users size={14} weight="light" />
                    Género
                    {selectedGender.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-background text-foreground text-[9px] font-bold flex items-center justify-center">{selectedGender.length}</span>
                    )}
                    <CaretDown size={12} weight="bold" className={`transition-transform duration-200 ${openDropdown === 'gender' ? 'rotate-180' : ''}`} />
                  </Button>
                  <FilterDropdown isOpen={openDropdown === 'gender'} onClose={closeDropdowns} title="Género">
                    {genderOptions.map((option) => (
                      <label key={option} className="flex items-center gap-3 p-2.5 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedGender.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedGender([...selectedGender, option]);
                            else setSelectedGender(selectedGender.filter(g => g !== option));
                          }}
                          className="w-4 h-4 accent-foreground rounded-sm"
                        />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </FilterDropdown>
                </div>

                {/* Fragrance Family */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDropdown('fragrance')}
                    className={`gap-1.5 text-xs sm:text-sm rounded-full transition-all duration-200 ${
                      openDropdown === 'fragrance' || selectedFragranceFamily.length > 0 ? 'bg-foreground text-background border-foreground' : 'border-border/60 hover:border-foreground/30'
                    }`}
                  >
                    <Sparkle size={14} weight="light" />
                    Familia Olfativa
                    {selectedFragranceFamily.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-background text-foreground text-[9px] font-bold flex items-center justify-center">{selectedFragranceFamily.length}</span>
                    )}
                    <CaretDown size={12} weight="bold" className={`transition-transform duration-200 ${openDropdown === 'fragrance' ? 'rotate-180' : ''}`} />
                  </Button>
                  <FilterDropdown isOpen={openDropdown === 'fragrance'} onClose={closeDropdowns} title="Familia Olfativa">
                    {fragranceOptions.map((option) => (
                      <label key={option.name} className="flex items-center gap-3 p-2.5 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedFragranceFamily.includes(option.name)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedFragranceFamily([...selectedFragranceFamily, option.name]);
                            else setSelectedFragranceFamily(selectedFragranceFamily.filter(f => f !== option.name));
                          }}
                          className="w-4 h-4 accent-foreground rounded-sm"
                        />
                        <span className="text-sm font-medium">{option.name}</span>
                      </label>
                    ))}
                  </FilterDropdown>
                </div>

                {/* Inspiration Brand */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDropdown('brand')}
                    className={`gap-1.5 text-xs sm:text-sm rounded-full transition-all duration-200 ${
                      openDropdown === 'brand' || selectedBrand.length > 0 ? 'bg-foreground text-background border-foreground' : 'border-border/60 hover:border-foreground/30'
                    }`}
                  >
                    <Tag size={14} weight="light" />
                    Marca de Inspiración
                    {selectedBrand.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-background text-foreground text-[9px] font-bold flex items-center justify-center">{selectedBrand.length}</span>
                    )}
                    <CaretDown size={12} weight="bold" className={`transition-transform duration-200 ${openDropdown === 'brand' ? 'rotate-180' : ''}`} />
                  </Button>
                  <FilterDropdown isOpen={openDropdown === 'brand'} onClose={closeDropdowns} title="Marca de Inspiración">
                    {brandOptions.map((option) => (
                      <label key={option} className="flex items-center gap-3 p-2.5 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedBrand.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedBrand([...selectedBrand, option]);
                            else setSelectedBrand(selectedBrand.filter(b => b !== option));
                          }}
                          className="w-4 h-4 accent-foreground rounded-sm"
                        />
                        <span className="text-sm font-medium">{option}</span>
                      </label>
                    ))}
                  </FilterDropdown>
                </div>

                {/* Clear All */}
                {activeFilterCount > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={clearAllFilters}
                    className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors ml-1"
                  >
                    Limpiar todo
                  </motion.button>
                )}
              </div>

              {/* Active Filter Badges */}
              <AnimatePresence>
                {activeFilterCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-1.5 mt-3 flex-wrap overflow-hidden"
                  >
                    {selectedGender.map((g) => (
                      <Badge key={g} variant="secondary" className="gap-1 rounded-full pl-2.5 pr-1.5 py-1 text-xs">
                        {g}
                        <button onClick={() => setSelectedGender(selectedGender.filter(x => x !== g))} className="ml-0.5 hover:text-destructive p-0.5 rounded-full hover:bg-destructive/10 transition-colors">
                          <X size={10} weight="bold" />
                        </button>
                      </Badge>
                    ))}
                    {selectedFragranceFamily.map((f) => (
                      <Badge key={f} variant="secondary" className="gap-1 rounded-full pl-2.5 pr-1.5 py-1 text-xs">
                        {f}
                        <button onClick={() => setSelectedFragranceFamily(selectedFragranceFamily.filter(x => x !== f))} className="ml-0.5 hover:text-destructive p-0.5 rounded-full hover:bg-destructive/10 transition-colors">
                          <X size={10} weight="bold" />
                        </button>
                      </Badge>
                    ))}
                    {selectedBrand.map((b) => (
                      <Badge key={b} variant="secondary" className="gap-1 rounded-full pl-2.5 pr-1.5 py-1 text-xs">
                        {b}
                        <button onClick={() => setSelectedBrand(selectedBrand.filter(x => x !== b))} className="ml-0.5 hover:text-destructive p-0.5 rounded-full hover:bg-destructive/10 transition-colors">
                          <X size={10} weight="bold" />
                        </button>
                      </Badge>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10" ref={gridRef}>
        {/* Skeleton Loading */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
              <MagnifyingGlass size={24} weight="light" className="text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">Sin resultados</p>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs">
              No encontramos fragancias con los filtros seleccionados. Intenta con otros criterios.
            </p>
            <Button onClick={clearAllFilters} variant="outline" className="rounded-full px-8">
              Limpiar filtros
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={`${searchQuery}-${selectedGender.join()}-${selectedBrand.join()}-${selectedFragranceFamily.join()}-${sortBy}`}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6"
            >
              {filteredProducts.map((product: any) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {hasNextPage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center mt-14 sm:mt-20"
              >
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-12 py-5 text-sm font-semibold hover:bg-foreground hover:text-background transition-all duration-300 border-foreground/20 group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <CircleNotch size={16} weight="bold" className="animate-spin" />
                      Cargando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Ver más fragancias
                      <CaretDown size={14} weight="bold" className="group-hover:translate-y-0.5 transition-transform" />
                    </span>
                  )}
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-40 w-10 h-10 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            aria-label="Volver arriba"
          >
            <ArrowUp size={18} weight="bold" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// Loading fallback component
function AllProductsLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
      <CircleNotch size={28} weight="bold" className="animate-spin text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Cargando catálogo...</span>
    </div>
  );
}

// Main export with Suspense boundary
export default function AllProductsPage() {
  return (
    <Suspense fallback={<AllProductsLoading />}>
      <AllProductsContent />
    </Suspense>
  );
}
