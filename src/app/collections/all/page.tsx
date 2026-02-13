'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MagnifyingGlass, CaretDown, X, Users, Sparkle, Tag, CurrencyDollar, CircleNotch } from 'phosphor-react';
import { useProducts } from '@/lib/hooks/useShopify';
import { getCollections } from '@/lib/shopify';
import { ProductCard } from '@/components/product/product-card';
import type { ShopifyProduct } from '@/lib/types/shopify';
import {
  filterProducts,
  sortProducts,
  getUniqueInspirationBrands,
  getUniqueGenders,
  getUniqueFragranceFamilies,
  type SortOption
} from '@/lib/utils/product-filters';
import { CategoryMarquee } from '@/components/sections/category-marquee';

function AllProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, loading, error, hasNextPage, loadMore } = useProducts(12);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedFragranceFamily, setSelectedFragranceFamily] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('featured');

  // Collections state
  const [shopifyCollections, setShopifyCollections] = useState<any[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);

  // Dropdown states
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showFragranceDropdown, setShowFragranceDropdown] = useState(false);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  // Read URL search params and apply as filters
  useEffect(() => {
    const q = searchParams.get('q');
    const gender = searchParams.get('gender');
    const brands = searchParams.get('brands');
    const notes = searchParams.get('notes');
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
          image: edge.node.image?.url || '/IDKO 1-100/10.png' // fallback image
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

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    setShowSortDropdown(false);
    setShowGenderDropdown(false);
    setShowFragranceDropdown(false);
    setShowCollectionDropdown(false);
    setShowBrandDropdown(false);
    setShowPriceDropdown(false);
  };

  // Toggle dropdown and close others
  const toggleDropdown = (dropdown: string) => {
    switch (dropdown) {
      case 'sort':
        if (showSortDropdown) {
          setShowSortDropdown(false);
        } else {
          closeAllDropdowns();
          setShowSortDropdown(true);
        }
        break;
      case 'gender':
        if (showGenderDropdown) {
          setShowGenderDropdown(false);
        } else {
          closeAllDropdowns();
          setShowGenderDropdown(true);
        }
        break;
      case 'fragrance':
        if (showFragranceDropdown) {
          setShowFragranceDropdown(false);
        } else {
          closeAllDropdowns();
          setShowFragranceDropdown(true);
        }
        break;
      case 'collection':
        if (showCollectionDropdown) {
          setShowCollectionDropdown(false);
        } else {
          closeAllDropdowns();
          setShowCollectionDropdown(true);
        }
        break;
      case 'brand':
        if (showBrandDropdown) {
          setShowBrandDropdown(false);
        } else {
          closeAllDropdowns();
          setShowBrandDropdown(true);
        }
        break;
      case 'price':
        if (showPriceDropdown) {
          setShowPriceDropdown(false);
        } else {
          closeAllDropdowns();
          setShowPriceDropdown(true);
        }
        break;
    }
  };

  // Extraer opciones de filtros dinámicamente de los productos reales
  const genderOptions = useMemo(() => getUniqueGenders(products), [products]);
  const brandOptions = useMemo(() => getUniqueInspirationBrands(products), [products]);
  const fragranceOptions = useMemo(() => {
    const families = getUniqueFragranceFamilies(products);
    const iconMap: Record<string, string> = {
      'Floral': '🌸',
      'Flowery': '🌸',
      'Fresh': '🌿',
      'Gourmand': '🍰',
      'Herbal': '🌱',
      'Earthy': '🌏',
      'Warm': '🔥',
      'Woody': '🪵',
      'Citrus': '🍋',
      'Fruity': '🍓',
      'Spicy': '🌶️',
      'Aromatic': '🌺'
    };
    return families.map(name => ({
      name,
      icon: iconMap[name] || '🌸'
    }));
  }, [products]);

  // Aplicar filtros y ordenamiento
  const filteredProducts = useMemo(() => {
    let filtered = filterProducts(products, {
      searchQuery,
      genders: selectedGender,
      brands: selectedBrand,
      aromaticNotes: [],
      fragranceFamilies: selectedFragranceFamily,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    });

    return sortProducts(filtered, sortBy as SortOption);
  }, [products, searchQuery, selectedGender, selectedBrand, selectedFragranceFamily, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Category Navigation Bar */}
      <CategoryMarquee
        items={[
          {
            id: 'all',
            label: 'ALL PERFUMES',
            handle: 'all',
            href: '/collections/all'
          },
          ...shopifyCollections.map(c => ({
            id: c.id,
            label: c.label,
            handle: c.handle,
            href: c.href
          }))
        ]}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isLoading={collectionsLoading}
      />

      {/* Filters and Search Bar */}
      <div className="bg-muted/30 border-b border-border relative">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
            {/* Search */}
            <div className="relative w-full lg:w-64 shrink-0">
              <MagnifyingGlass size={16} weight="regular" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search perfumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Filter Buttons */}
            <div className="w-full lg:flex-1">
              <div className="flex gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">

                {/* Sort By Dropdown */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDropdown('sort')}
                    className={`gap-1.5 text-xs lg:text-sm justify-start shrink-0 min-w-fit ${showSortDropdown ? 'bg-primary/10 border-primary text-primary' : ''}`}
                  >
                    <span className="truncate">
                      Sort: {sortBy === 'featured' && 'Featured'}
                      {sortBy === 'price-low' && 'Price Low'}
                      {sortBy === 'price-high' && 'Price High'}
                      {sortBy === 'newest' && 'Newest'}
                      {sortBy === 'bestselling' && 'Best Selling'}
                    </span>
                    <CaretDown size={14} weight="bold" className={`transition-transform shrink-0 ${showSortDropdown ? 'rotate-180' : ''}`} />
                  </Button>
                  {showSortDropdown && (
                    <>
                      {/* Backdrop - funciona en móvil y desktop */}
                      <div className="fixed inset-0 bg-black/20 lg:bg-transparent z-[9998]" onClick={closeAllDropdowns} />
                      <div className="fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-auto lg:top-full lg:left-0 lg:right-auto lg:mt-2 w-full lg:w-56 bg-card border-t lg:border border-border lg:rounded-xl shadow-2xl z-[9999] rounded-t-2xl lg:rounded-t-xl overflow-hidden max-h-[60vh] lg:max-h-[400px] flex flex-col">
                        <div className="p-3 bg-primary/10 border-b border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">Sort By</span>
                            <button onClick={closeAllDropdowns} className="text-muted-foreground hover:text-foreground">
                              <X size={16} weight="regular" />
                            </button>
                          </div>
                        </div>
                        <div className="p-2">
                          {[
                            { value: 'featured', label: 'Featured' },
                            { value: 'newest', label: 'Newest' },
                            { value: 'bestselling', label: 'Best Selling' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortBy(option.value);
                                setShowSortDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${sortBy === option.value
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-foreground hover:bg-muted'
                                }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Gender Dropdown */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDropdown('gender')}
                    className={`gap-1.5 text-xs lg:text-sm transition-colors shrink-0 ${showGenderDropdown ? 'bg-primary/10 border-primary text-primary' : ''}`}
                  >
                    <Users size={14} weight="regular" className="shrink-0" />
                    <span className="hidden sm:inline">Gender</span>
                    <CaretDown size={14} weight="bold" className={`transition-transform shrink-0 ${showGenderDropdown ? 'rotate-180' : ''}`} />
                  </Button>
                  {showGenderDropdown && (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={closeAllDropdowns} />
                      <div className="fixed bottom-32 left-0 right-0 lg:absolute lg:bottom-auto lg:top-full lg:left-auto lg:right-auto mt-0 lg:mt-2 w-full lg:w-52 bg-card border-t lg:border border-border lg:rounded-xl shadow-xl z-[70] rounded-t-2xl lg:rounded-t-xl overflow-hidden max-h-[50vh] flex flex-col">
                        <div className="p-3 bg-primary/10 border-b border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">Gender</span>
                            <button onClick={closeAllDropdowns} className="text-muted-foreground hover:text-foreground">
                              <X size={16} weight="regular" />
                            </button>
                          </div>
                        </div>
                        <div className="p-2 max-h-64 overflow-y-auto">
                          {genderOptions.map((option) => (
                            <label key={option} className="flex items-center gap-3 p-2.5 hover:bg-muted rounded-lg cursor-pointer transition-colors group">
                              <input
                                type="checkbox"
                                checked={selectedGender.includes(option)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedGender([...selectedGender, option]);
                                  } else {
                                    setSelectedGender(selectedGender.filter(g => g !== option));
                                  }
                                }}
                                className="w-4 h-4 accent-primary rounded border-border focus:ring-primary"
                              />
                              <span className="text-sm text-foreground group-hover:text-primary font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Fragrance Family Dropdown */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDropdown('fragrance')}
                    className={`gap-1.5 text-xs lg:text-sm transition-colors shrink-0 ${showFragranceDropdown ? 'bg-primary/10 border-primary text-primary' : ''}`}
                  >
                    <Sparkle size={14} weight="regular" className="shrink-0" />
                    <span className="hidden sm:inline">Fragrance Family</span>
                    <CaretDown size={14} weight="bold" className={`transition-transform shrink-0 ${showFragranceDropdown ? 'rotate-180' : ''}`} />
                  </Button>
                  {showFragranceDropdown && (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={closeAllDropdowns} />
                      <div className="fixed bottom-32 left-0 right-0 lg:absolute lg:bottom-auto lg:top-full lg:left-auto lg:right-auto mt-0 lg:mt-2 w-full lg:w-56 bg-card border-t lg:border border-border lg:rounded-xl shadow-xl z-[70] rounded-t-2xl lg:rounded-t-xl overflow-hidden max-h-[50vh] flex flex-col">
                        <div className="p-3 bg-primary/10 border-b border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">Fragrance Family</span>
                            <button onClick={closeAllDropdowns} className="text-muted-foreground hover:text-foreground">
                              <X size={16} weight="regular" />
                            </button>
                          </div>
                        </div>
                        <div className="p-2 max-h-64 overflow-y-auto">
                          {fragranceOptions.map((option) => (
                            <label key={option.name} className="flex items-center gap-3 p-2.5 hover:bg-muted rounded-lg cursor-pointer transition-colors group">
                              <input
                                type="checkbox"
                                checked={selectedFragranceFamily.includes(option.name)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFragranceFamily([...selectedFragranceFamily, option.name]);
                                  } else {
                                    setSelectedFragranceFamily(selectedFragranceFamily.filter(f => f !== option.name));
                                  }
                                }}
                                className="w-4 h-4 accent-primary rounded border-border focus:ring-primary"
                              />
                              <span className="text-xl">{option.icon}</span>
                              <span className="text-sm text-foreground group-hover:text-primary font-medium">{option.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Inspiration Brand Dropdown */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDropdown('brand')}
                    className={`gap-1.5 text-xs lg:text-sm transition-colors shrink-0 ${showBrandDropdown ? 'bg-primary/10 border-primary text-primary' : ''}`}
                  >
                    <Tag size={14} weight="regular" className="shrink-0" />
                    <span className="hidden sm:inline">Inspiration Brand</span>
                    <CaretDown size={14} weight="bold" className={`transition-transform shrink-0 ${showBrandDropdown ? 'rotate-180' : ''}`} />
                  </Button>
                  {showBrandDropdown && (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={closeAllDropdowns} />
                      <div className="fixed bottom-32 left-0 right-0 lg:absolute lg:bottom-auto lg:top-full lg:left-auto lg:right-auto mt-0 lg:mt-2 w-full lg:w-56 bg-card border-t lg:border border-border lg:rounded-xl shadow-xl z-[70] rounded-t-2xl lg:rounded-t-xl overflow-hidden max-h-[50vh] flex flex-col">
                        <div className="p-3 bg-primary/10 border-b border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">Inspiration Brand</span>
                            <button onClick={closeAllDropdowns} className="text-muted-foreground hover:text-foreground">
                              <X size={16} weight="regular" />
                            </button>
                          </div>
                        </div>
                        <div className="p-2 max-h-64 overflow-y-auto">
                          {brandOptions.map((option) => (
                            <label key={option} className="flex items-center gap-3 p-2.5 hover:bg-muted rounded-lg cursor-pointer transition-colors group">
                              <input
                                type="checkbox"
                                checked={selectedBrand.includes(option)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedBrand([...selectedBrand, option]);
                                  } else {
                                    setSelectedBrand(selectedBrand.filter(b => b !== option));
                                  }
                                }}
                                className="w-4 h-4 accent-primary rounded border-border focus:ring-primary"
                              />
                              <span className="text-sm text-foreground group-hover:text-primary font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedGender.length > 0 || selectedFragranceFamily.length > 0 || selectedBrand.length > 0) && (
            <div className="flex gap-2 mt-4 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedGender.map((gender) => (
                <Badge key={gender} variant="secondary" className="gap-1">
                  Gender: {gender}
                  <button
                    onClick={() => setSelectedGender(selectedGender.filter(g => g !== gender))}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {selectedFragranceFamily.map((fragrance) => (
                <Badge key={fragrance} variant="secondary" className="gap-1">
                  {fragrance}
                  <button
                    onClick={() => setSelectedFragranceFamily(selectedFragranceFamily.filter(f => f !== fragrance))}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {selectedBrand.map((brand) => (
                <Badge key={brand} variant="secondary" className="gap-1">
                  Inspired by: {brand}
                  <button
                    onClick={() => setSelectedBrand(selectedBrand.filter(b => b !== brand))}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <button
                onClick={() => {
                  setSelectedGender([]);
                  setSelectedFragranceFamily([]);
                  setSelectedBrand([]);
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-foreground">All Perfumes</h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${filteredProducts.length} products`}
          </p>
        </div>

        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <CircleNotch size={32} weight="bold" className="animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-xl text-muted-foreground mb-4">No products found</p>
            <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedGender([]);
                setSelectedBrand([]);
                setSelectedFragranceFamily([]);
                setPriceRange([0, 200]);
              }}
              variant="outline"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
              {filteredProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {hasNextPage && (
              <div className="text-center mt-12">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                  className="min-w-[200px]"
                >
                  {loading ? (
                    <>
                      <CircleNotch size={16} weight="bold" className="animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More Products'
                  )}
                </Button>
              </div>
            )}

            {products.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg mb-4">
                  No products found
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGender([]);
                    setSelectedFragranceFamily([]);
                    setSelectedBrand([]);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function AllProductsLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <CircleNotch size={32} weight="bold" className="animate-spin text-primary" />
      <span className="ml-2 text-muted-foreground">Loading...</span>
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
