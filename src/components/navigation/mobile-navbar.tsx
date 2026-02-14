'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { House, ListBullets, Drop, Tote, Sparkle, X, CaretRight, Heart, MusicNotes, SunHorizon, Coffee, Briefcase, Lightning, ArrowRight } from 'phosphor-react';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useCart } from '@/lib/hooks/useShopify';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '@/contexts/currency-context';
import { DiscountProgressBar } from '@/components/ui/discount-progress-bar';

import type { IconProps } from 'phosphor-react';

interface CategoryDef {
  id: string;
  label: string;
  tagline: string;
  handle: string;
  icon: React.ComponentType<IconProps>;
}

const CATEGORIES: CategoryDef[] = [
  { id: 'seduccion', label: 'Seducción', tagline: 'Magnetismo y cercanía', handle: 'seduccion', icon: Heart },
  { id: 'rumba', label: 'Rumba / Noche', tagline: 'Presencia que se siente', handle: 'rumba-noche', icon: MusicNotes },
  { id: 'playa', label: 'Playa / Sol', tagline: 'Frescura y libertad', handle: 'playa-sol', icon: SunHorizon },
  { id: 'diario', label: 'Diario / Casual', tagline: 'Tu esencia de cada día', handle: 'diario-casual', icon: Coffee },
  { id: 'negocios', label: 'Negocios / Oficina', tagline: 'Elegancia y poder', handle: 'negocios-oficina', icon: Briefcase },
  { id: 'deporte', label: 'Deporte / Fresco', tagline: 'Energía y vitalidad', handle: 'deporte-fresco', icon: Lightning },
];

export function MobileNavbar() {
  const [showCategories, setShowCategories] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { cart, removeCartItem, updateCartItem } = useCart();
  const { formatPrice } = useCurrency();

  const itemCount = cart?.totalQuantity || 0;
  const freeShippingThreshold = 200000;
  const currentTotal = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
  const amountRemaining = Math.max(0, freeShippingThreshold - currentTotal);
  const progressPercentage = Math.min(100, (currentTotal / freeShippingThreshold) * 100);

  const isActive = (path: string) => pathname === path;

  return (
    <>

      {/* Mobile Bottom Navbar - ExpandableTabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex justify-center px-4 pb-4 pt-2 pointer-events-none">
        <ExpandableTabs
          tabs={[
            { title: "Inicio", icon: House },
            { title: "Categorías", icon: ListBullets },
            { type: "separator" as const },
            { title: "Crea tu Aroma", icon: Sparkle },
            { type: "separator" as const },
            { title: "Perfumes", icon: Drop },
            { title: "Carrito", icon: Tote, badge: itemCount },
          ]}
          onChange={(index) => {
            if (index === null) return;
            switch (index) {
              case 0: router.push('/'); break;
              case 1: setShowCategories(true); break;
              // index 2 = separator
              case 3: router.push('/pages/crea-tu-aroma'); break;
              // index 4 = separator
              case 5: router.push('/collections/all'); break;
              case 6: setShowCart(true); break;
            }
          }}
          className="pointer-events-auto shadow-lg border-border/50 bg-background/95 backdrop-blur-md"
        />
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
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-101 lg:hidden max-h-[85vh] overflow-hidden"
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 pt-1">
                <div>
                  <h2 className="text-lg font-serif font-semibold text-foreground">Categorías</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Explora por ocasión</p>
                </div>
                <button
                  onClick={() => setShowCategories(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={18} weight="light" className="text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 pb-8 overflow-y-auto max-h-[calc(85vh-80px)]">
                {/* All Perfumes - Featured Link */}
                <Link
                  href="/collections/all"
                  onClick={() => setShowCategories(false)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-foreground text-background mb-5 group active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <Drop size={20} weight="light" />
                    <span className="text-sm font-semibold tracking-wide">Todos los perfumes</span>
                  </div>
                  <ArrowRight size={18} weight="light" className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>

                {/* Occasion Categories Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((cat, idx) => {
                    const Icon = cat.icon;
                    return (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                      >
                        <Link
                          href={`/collections/${cat.handle}`}
                          onClick={() => setShowCategories(false)}
                          className="flex flex-col items-start p-4 rounded-2xl border border-border/60 bg-background hover:bg-muted/60 active:scale-[0.97] transition-all group h-full"
                        >
                          <div className="w-9 h-9 rounded-xl bg-muted/80 flex items-center justify-center mb-3 group-hover:bg-foreground/10 transition-colors">
                            <Icon size={18} weight="light" className="text-foreground" />
                          </div>
                          <span className="text-sm font-medium text-foreground leading-tight">{cat.label}</span>
                          <span className="text-[11px] text-muted-foreground mt-1 leading-snug">{cat.tagline}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Quiz CTA */}
                <Link
                  href="/pages/quiz"
                  onClick={() => setShowCategories(false)}
                  className="flex items-center justify-between mt-5 p-4 rounded-2xl border border-dashed border-border/80 bg-muted/30 group active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <Sparkle size={18} weight="light" className="text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium text-foreground">No sabes cuál elegir?</span>
                      <p className="text-[11px] text-muted-foreground">Haz nuestro quiz</p>
                    </div>
                  </div>
                  <CaretRight size={16} weight="bold" className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
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
                  <h2 className="text-xl font-semibold text-foreground">Tu carrito</h2>
                  <span className="sr-only">Review your selected items</span>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
                  </p>
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={20} weight="light" />
                </button>
              </div>

              {/* Envío gratis en 4+ artículos */}
              {currentTotal < freeShippingThreshold && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-medium">
                      {amountRemaining > 0
                        ? `Agrega ${formatPrice(amountRemaining.toString())} para envío gratis`
                        : '¡Envío gratis desbloqueado!'}
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
                  <Tote size={64} weight="light" className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-6">Tu carrito está vacío</p>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      router.push('/collections/all');
                    }}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Explorar perfumes
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
                        <Image
                          src={image}
                          alt={product.title}
                          width={80}
                          height={96}
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
                              <X size={16} weight="light" />
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
                          <span className="text-sm">Precio Original</span>
                          <span className="text-sm line-through">
                            {formatPrice(originalTotal.toFixed(2))}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between text-primary font-medium">
                          <span className="text-sm">Descuento ({(discountPercent * 100).toFixed(0)}%)</span>
                          <span className="text-sm">
                            -{formatPrice(discountAmount.toFixed(2))}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex items-baseline justify-between text-muted-foreground">
                      <span className="text-sm">Envío</span>
                      <span className="text-sm font-medium text-primary">
                        {currentTotal >= freeShippingThreshold || itemCount >= 6 ? 'Gratis' : 'Calculado al pagar'}
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
                  PROCEDER AL PAGO
                </a>
              ) : (
                <button disabled className="block w-full bg-primary/50 text-primary-foreground text-center py-4 rounded-lg font-semibold cursor-not-allowed">
                  CARGANDO...
                </button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
