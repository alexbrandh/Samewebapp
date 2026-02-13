'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  MagnifyingGlass,
  X,
  User,
  UsersFour,
  Flower,
  Drop,
  Sparkle,
  ArrowRight
} from 'phosphor-react';
import { useCurrency } from '@/contexts/currency-context';
import { useProducts } from '@/lib/hooks/useShopify';
import {
  filterProducts,
  getUniqueInspirationBrands,
  getUniqueAromaticNotes,
  getUniqueGenders
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
const GENDERS: { value: Gender; label: string; icon: any }[] = [
  { value: 'women', label: 'Women', icon: User },
  { value: 'men', label: 'Men', icon: User },
  { value: 'unisex', label: 'Unisex', icon: UsersFour },
];

const BRANDS: Brand[] = [
  'Tom Ford',
  'MFK',
  'Juliette Has A Gun',
  'YSL',
  'Maison Margiela',
  'Le Labo',
  'Dior',
  'Chanel',
  'Hermès',
  'Creed',
];

const AROMATIC_NOTES: Note[] = [
  'Amber',
  'Powdery',
  'Fruity',
  'Gourmand',
  'Citrus',
  'Vanilla',
  'Apple',
  'Wood',
  'Floral',
  'Spicy',
  'Musk',
  'Oud',
];

const FRAGRANCE_FAMILIES: { value: FragranceFamily; label: string }[] = [
  { value: 'flowery', label: 'Flowery' },
  { value: 'warm', label: 'Warm' },
  { value: 'gourmand', label: 'Gourmand' },
  { value: 'fresh', label: 'Fresh' },
  { value: 'earthy', label: 'Earthy' },
  { value: 'herbal', label: 'Herbal' },
];


export function PerfumeSearchModal({ children, onSearch }: PerfumeSearchModalProps) {
  const router = useRouter();
  const { products, loading } = useProducts(50); // Cargar más productos para búsqueda
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { formatPrice } = useCurrency();
  const [filters, setFilters] = useState<PerfumeFilters>({
    genders: [],
    brands: [],
    notes: [],
    families: [],
  });

  // Extraer datos dinámicos de productos reales
  const dynamicBrands = useMemo(() => getUniqueInspirationBrands(products), [products]);
  const dynamicNotes = useMemo(() => getUniqueAromaticNotes(products), [products]);
  const dynamicGenders = useMemo(() => getUniqueGenders(products), [products]);

  // Filtrar productos según búsqueda y filtros
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return filterProducts(products, {
      searchQuery: query,
      genders: filters.genders.map(g => g.charAt(0).toUpperCase() + g.slice(1)),
      brands: filters.brands,
      aromaticNotes: filters.notes,
      fragranceFamilies: filters.families.map(f => f.charAt(0).toUpperCase() + f.slice(1)),
    }).slice(0, 10); // Limitar a 10 resultados
  }, [products, query, filters]);

  // Manejar tecla de atajo Cmd/Ctrl + K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const clearFilters = () => {
    setFilters({
      genders: [],
      brands: [],
      notes: [],
      families: [],
    });
    setQuery('');
  };

  const handleSearch = () => {
    onSearch?.(filters, query);
    setOpen(false);
  };

  const hasActiveFilters =
    filters.genders.length > 0 ||
    filters.brands.length > 0 ||
    filters.notes.length > 0 ||
    filters.families.length > 0 ||
    query.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="w-[94vw] max-w-[94vw] md:max-w-6xl p-0 overflow-hidden gap-0 bg-background/95 backdrop-blur-xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Search Perfumes</DialogTitle>
        <DialogDescription className="sr-only">Search for perfumes by brand, notes, or gender</DialogDescription>

        <div className="flex flex-col h-[85vh] md:h-[700px]">
          {/* Search Header */}
          <div className="relative border-b border-border p-4 md:p-6">
            <div className="flex items-center gap-3">
              <MagnifyingGlass
                size={20}
                weight="regular"
                className="text-muted-foreground shrink-0"
              />
              <input
                type="text"
                placeholder="Search perfumes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 py-2 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
              />
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X size={24} weight="regular" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
            {/* Left Panel - Filters */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-6 relative max-h-[40vh] md:max-h-none">
              {/* Gender Filter */}
              <div>
                <h3 className="flex items-center gap-2 text-xs md:text-sm font-semibold text-foreground mb-2 md:mb-3">
                  <User size={16} weight="bold" />
                  GENDER
                </h3>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {GENDERS.map((gender) => (
                    <button
                      key={gender.value}
                      onClick={() => toggleFilter('genders', gender.value)}
                      className={cn(
                        'px-2.5 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all border',
                        filters.genders.includes(gender.value)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-border hover:bg-muted'
                      )}
                    >
                      {gender.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="flex items-center gap-2 text-xs md:text-sm font-semibold text-foreground mb-2 md:mb-3">
                  <Sparkle size={16} weight="bold" />
                  INSPIRATION BRAND
                </h3>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {dynamicBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleFilter('brands', brand)}
                      className={cn(
                        'px-2.5 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all border',
                        filters.brands.includes(brand)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-border hover:bg-muted'
                      )}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aromatic Notes Filter */}
              <div>
                <h3 className="flex items-center gap-2 text-xs md:text-sm font-semibold text-foreground mb-2 md:mb-3">
                  <Drop size={16} weight="bold" />
                  AROMATIC NOTES
                </h3>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {dynamicNotes.map((note) => (
                    <button
                      key={note}
                      onClick={() => toggleFilter('notes', note)}
                      className={cn(
                        'px-2.5 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all border',
                        filters.notes.includes(note)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-border hover:bg-muted'
                      )}
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fragrance Families - Visible solo en móvil aquí */}
              <div className="md:hidden">
                <h3 className="flex items-center gap-2 text-xs font-semibold text-foreground mb-2">
                  <Flower size={16} weight="bold" />
                  FRAGRANCE FAMILIES
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {FRAGRANCE_FAMILIES.map((family) => (
                    <button
                      key={family.value}
                      onClick={() => toggleFilter('families', family.value)}
                      className={cn(
                        'px-2.5 py-1.5 rounded-full text-xs font-medium transition-all border',
                        filters.families.includes(family.value)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-border hover:bg-muted'
                      )}
                    >
                      {family.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons - Solo en móvil al final del primer panel */}
              <div className="flex md:hidden gap-2 pt-4 border-t border-border">
                <Button
                  onClick={handleSearch}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!hasActiveFilters}
                >
                  <MagnifyingGlass size={16} weight="bold" className="mr-2" />
                  Search
                </Button>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  disabled={!hasActiveFilters}
                >
                  Clear
                </Button>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden md:flex gap-3 pt-4 border-t border-border">
                <Button
                  onClick={handleSearch}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!hasActiveFilters}
                >
                  <MagnifyingGlass size={16} weight="bold" className="mr-2" />
                  Search
                </Button>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  disabled={!hasActiveFilters}
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Right Panel - Search Results */}
            <div className="w-full md:w-96 bg-muted/20 border-t md:border-t-0 md:border-l border-border p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
              {/* Search Results */}
              <div>
                <h3 className="flex items-center gap-2 text-sm md:text-sm font-semibold text-foreground mb-3 sticky top-0 bg-muted/20 py-2 -mx-4 px-4 md:static md:bg-transparent md:py-0 md:mx-0 md:px-0 z-10">
                  <MagnifyingGlass size={18} weight="bold" />
                  RESULTS {filteredProducts.length > 0 && `(${filteredProducts.length})`}
                </h3>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="space-y-2">
                    {filteredProducts.map((product: ShopifyProduct) => {
                      const price = product.variants.edges[0]?.node.price.amount || '0';
                      const image = product.featuredImage?.url || product.images.edges[0]?.node?.url;

                      return (
                        <button
                          key={product.id}
                          onClick={() => {
                            router.push(`/products/${product.handle}`);
                            setOpen(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors border border-transparent hover:border-border group text-left"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                            {image ? (
                              <img
                                src={image}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {product.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatPrice(price)}
                            </p>
                          </div>
                          <ArrowRight size={16} weight="bold" className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                ) : hasActiveFilters ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-sm">No products found</p>
                    <p className="text-muted-foreground text-xs mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-sm">Start searching</p>
                    <p className="text-muted-foreground text-xs mt-1">Select filters or type a query</p>
                  </div>
                )}
              </div>

              {/* Fragrance Families - Solo visible en desktop */}
              <div className="hidden md:block pt-4 border-t border-border">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Flower size={16} weight="bold" />
                  Fragrance Families
                </h3>
                <div className="flex flex-wrap gap-2">
                  {FRAGRANCE_FAMILIES.map((family) => (
                    <button
                      key={family.value}
                      onClick={() => toggleFilter('families', family.value)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                        filters.families.includes(family.value)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-border hover:bg-muted'
                      )}
                    >
                      {family.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
