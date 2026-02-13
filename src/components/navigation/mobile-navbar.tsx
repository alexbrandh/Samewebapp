'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { House, GridFour, Package, ShoppingCart, X, MagnifyingGlass, CaretRight } from 'phosphor-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useCart } from '@/lib/hooks/useShopify';
import { motion, AnimatePresence } from 'framer-motion';
import { PerfumeSearchModal } from '@/components/ui/perfume-search-modal';
import { getCollections } from '@/lib/shopify';
import { useCurrency } from '@/contexts/currency-context';
import { DiscountProgressBar } from '@/components/ui/discount-progress-bar';
import { CurrencySwitcher } from '@/components/ui/currency-switcher';

interface Collection {
  id: string;
  title: string;
  handle: string;
}

export function MobileNavbar() {
  const [showCategories, setShowCategories] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { cart, removeCartItem, updateCartItem } = useCart();
  const { formatPrice } = useCurrency();

  // Fetch collections from Shopify
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const data = await getCollections();
        // Extract nodes from Shopify edges structure
        const collectionsArray = data?.edges?.map((edge: any) => edge.node) || [];
        setCollections(collectionsArray);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    if (showCategories && collections.length === 0) {
      fetchCollections();
    }
  }, [showCategories]);

  const itemCount = cart?.totalQuantity || 0;
  const freeShippingThreshold = 200;
  const currentTotal = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
  const amountRemaining = Math.max(0, freeShippingThreshold - currentTotal);
  const progressPercentage = Math.min(100, (currentTotal / freeShippingThreshold) * 100);

  const isActive = (path: string) => pathname === path;

  // Handle perfume search
  const handlePerfumeSearch = (filters: any, query: string) => {
    const params = new URLSearchParams();

    if (query) params.set('q', query);
    if (filters.genders.length > 0) params.set('gender', filters.genders.join(','));
    if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
    if (filters.notes.length > 0) params.set('notes', filters.notes.join(','));
    if (filters.families.length > 0) params.set('families', filters.families.join(','));

    router.push(`/collections/all?${params.toString()}`);
  };

  return (
    <>
      {/* Search Button Sticky - encima del navbar móvil */}
      <div className="fixed bottom-16 left-0 right-0 z-40 lg:hidden px-4 pb-3">
        <div className="flex items-center gap-2">
          {/* Search Button - shorter */}
          <PerfumeSearchModal onSearch={handlePerfumeSearch}>
            <button className="flex-1 bg-card border border-border rounded-full shadow-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-muted transition-colors">
              <MagnifyingGlass size={20} weight="regular" className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Search perfumes...</span>
            </button>
          </PerfumeSearchModal>

          {/* Currency Switcher */}
          <div className="bg-card border border-border rounded-full shadow-lg h-[46px] flex items-center">
            <CurrencySwitcher />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navbar - solo visible en móvil */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 lg:hidden">
        <div className="grid grid-cols-4 h-16">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            <House size={20} weight="regular" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Categorías */}
          <button
            onClick={() => setShowCategories(true)}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors active:text-primary"
          >
            <GridFour size={20} weight="regular" />
            <span className="text-xs font-medium">Categories</span>
          </button>

          {/* Perfumes */}
          <Link
            href="/collections/all"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/collections/all') ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            <Package size={20} weight="regular" />
            <span className="text-xs font-medium">Perfumes</span>
          </Link>

          {/* Carrito */}
          <button
            onClick={() => setShowCart(true)}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors active:text-primary relative"
          >
            <ShoppingCart size={20} weight="regular" />
            <span className="text-xs font-medium">Cart</span>
            {itemCount > 0 && (
              <span className="absolute top-1 right-1/4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Categories Modal - Slide from Bottom */}
      <AnimatePresence>
        {showCategories && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategories(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-100 lg:hidden"
            />

            {/* Categories Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-101 lg:hidden max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Categories</h2>
                <span className="sr-only">Browse categories</span>
                <button
                  onClick={() => setShowCategories(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={20} weight="regular" className="text-muted-foreground" />
                </button>
              </div>

              {/* Categories List */}
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-72px)]">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* All Perfumes Link */}
                    <Link
                      href="/collections/all"
                      onClick={() => setShowCategories(false)}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <span className="text-sm font-medium text-foreground">All Perfumes</span>
                      <CaretRight size={16} weight="bold" className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>

                    {/* Collections from Shopify */}
                    {collections.map((collection) => (
                      <Link
                        key={collection.id}
                        href={`/collections/${collection.handle}`}
                        onClick={() => setShowCategories(false)}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <span className="text-sm font-medium text-foreground">{collection.title}</span>
                        <CaretRight size={16} weight="bold" className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Sheet */}
      <Sheet open={showCart} onOpenChange={setShowCart}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-card z-10 px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Your Cart</h2>
                  <span className="sr-only">Review your selected items</span>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={20} weight="regular" />
                </button>
              </div>

              {/* Free Shipping Progress */}
              {currentTotal < freeShippingThreshold && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-medium">
                      {amountRemaining > 0
                        ? `Add ${formatPrice(amountRemaining.toString())} for free shipping`
                        : 'Free shipping unlocked!'}
                    </span>
                    <span className="font-semibold">{formatPrice(currentTotal.toString())}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Discount Progress Bar */}
            {cart && cart.lines?.edges && cart.lines.edges.length > 0 && (
              <div className="px-6 py-4 border-b border-border">
                <DiscountProgressBar
                  itemCount={itemCount}
                  isFreeShipping={amountRemaining <= 0}
                />
              </div>
            )}

            {/* Cart Items */}
            <div className="px-6 py-4">
              {!cart || cart.lines.edges.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={64} weight="regular" className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-6">Your cart is empty</p>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      router.push('/collections/all');
                    }}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Explore Perfumes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.lines.edges.map(({ node: item }) => {
                    const product = (item.merchandise as any).product;
                    const image = product?.images?.edges[0]?.node?.url || '/placeholder.png';
                    const price = parseFloat(item.merchandise.price.amount);
                    const total = price * item.quantity;

                    return (
                      <div key={item.id} className="flex gap-3 bg-muted/50 p-3 rounded-lg">
                        <img
                          src={image}
                          alt={product.title}
                          className="w-20 h-24 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-sm text-foreground truncate">
                              {product.title}
                            </h3>
                            <button
                              onClick={() => removeCartItem(item.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                            >
                              <X size={16} weight="regular" />
                            </button>
                          </div>

                          {/* Variant Options Selector */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {product?.options?.map((option: any) => {
                              if (option.name === 'Title' || option.values.length <= 1) return null;

                              const selectedValue = (item.merchandise as any).selectedOptions?.find(
                                (o: any) => o.name === option.name
                              )?.value;

                              return (
                                <select
                                  key={option.id}
                                  value={selectedValue}
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    const currentOptions = (item.merchandise as any).selectedOptions;

                                    if (!currentOptions) return;

                                    const newOptions = currentOptions.map((o: any) =>
                                      o.name === option.name ? { ...o, value: newValue } : o
                                    );

                                    const variants = product.variants?.edges;
                                    if (!variants) return;

                                    const matchingVariant = variants.find(({ node }: any) =>
                                      node.selectedOptions.every((vOpt: any) =>
                                        newOptions.some((nOpt: any) => nOpt.name === vOpt.name && nOpt.value === vOpt.value)
                                      )
                                    );

                                    if (matchingVariant && matchingVariant.node.id !== item.merchandise.id) {
                                      updateCartItem(item.id, item.quantity, matchingVariant.node.id);
                                    }
                                  }}
                                  className="h-7 text-xs border border-input bg-background rounded px-2 py-0 focus:ring-1 focus:ring-primary"
                                >
                                  {option.values.map((value: string) => (
                                    <option key={value} value={value}>
                                      {value}
                                    </option>
                                  ))}
                                </select>
                              );
                            })}
                          </div>

                          {/* Quantity and Price */}
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  const newQty = item.quantity - 1;
                                  if (newQty === 0) {
                                    removeCartItem(item.id);
                                  } else {
                                    updateCartItem(item.id, newQty);
                                  }
                                }}
                                className="w-7 h-7 flex items-center justify-center border border-input rounded-md hover:bg-muted text-xs"
                              >
                                −
                              </button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center border border-input rounded-md hover:bg-muted text-xs"
                              >
                                +
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                              {formatPrice(total.toString())}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer con Checkout */}
          {cart && cart.lines.edges.length > 0 && (
            <div className="border-t border-border bg-card p-6 space-y-4">
              {/* Discount Calculation */}
              {(() => {
                let discountPercent = 0;
                if (itemCount >= 6) discountPercent = 0.2;
                else if (itemCount >= 4) discountPercent = 0.15;
                else if (itemCount >= 2) discountPercent = 0.1;

                const originalTotal = parseFloat(cart.cost?.subtotalAmount?.amount || '0');
                const discountAmount = originalTotal * discountPercent;
                const finalTotal = originalTotal - discountAmount;

                return (
                  <div className="space-y-2">
                    {discountPercent > 0 && (
                      <>
                        <div className="flex items-baseline justify-between text-muted-foreground">
                          <span className="text-sm">Original Price</span>
                          <span className="text-sm line-through">
                            {formatPrice(originalTotal.toFixed(2))}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between text-primary font-medium">
                          <span className="text-sm">Discount ({(discountPercent * 100).toFixed(0)}%)</span>
                          <span className="text-sm">
                            -{formatPrice(discountAmount.toFixed(2))}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex items-baseline justify-between text-muted-foreground">
                      <span className="text-sm">Shipping</span>
                      <span className="text-sm font-medium text-primary">
                        {currentTotal >= freeShippingThreshold || itemCount >= 6 ? 'Free' : 'Calculated at checkout'}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-2 border-t border-border">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-lg text-foreground">
                        {formatPrice(finalTotal.toFixed(2))}
                      </span>
                    </div>
                  </div>
                );
              })()}
              {cart.checkoutUrl ? (
                <a
                  href={cart.checkoutUrl}
                  className="block w-full bg-primary text-primary-foreground text-center py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  PROCEED TO CHECKOUT
                </a>
              ) : (
                <button disabled className="block w-full bg-primary/50 text-primary-foreground text-center py-4 rounded-lg font-semibold cursor-not-allowed">
                  LOADING CHECKOUT...
                </button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
