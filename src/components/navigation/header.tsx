'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { PerfumeSearchModal } from '@/components/ui/perfume-search-modal';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useCart } from '@/lib/hooks/useShopify';
import { useCustomer } from '@/contexts/customer-context';
import { useCurrency } from '@/contexts/currency-context';
import { useBanner } from '@/contexts/banner-context';
import { CircleNotch, Package, X, Copy, List, User as UserIcon, InstagramLogo, TiktokLogo, Drop, Star } from 'phosphor-react';
import { DiscountProgressBar } from '@/components/ui/discount-progress-bar';
import { CartRecommendations } from '@/components/cart/cart-recommendations';

interface HeaderProps {
  cartItemsCount?: number;
}

export function Header({ cartItemsCount = 0 }: HeaderProps) {
  const { cart, loading: cartLoading, removeCartItem, updateCartItem, addToCart } = useCart();
  const { isAuthenticated, customer } = useCustomer();
  const { isBannerVisible } = useBanner();
  const router = useRouter();
  const itemCount = cart?.totalQuantity || cartItemsCount;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { formatPrice } = useCurrency();

  // Calculate free shipping progress
  const freeShippingThreshold = 200000; // 200.000 COP para envío gratis
  const currentTotal = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
  const amountRemaining = Math.max(0, freeShippingThreshold - currentTotal);

  // Handle perfume search
  const handlePerfumeSearch = (filters: any, query: string) => {
    // Build search query parameters
    const params = new URLSearchParams();

    if (query) params.set('q', query);
    if (filters.genders.length > 0) params.set('gender', filters.genders.join(','));
    if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
    if (filters.notes.length > 0) params.set('notes', filters.notes.join(','));
    if (filters.families.length > 0) params.set('families', filters.families.join(','));

    // Navigate to search results page
    router.push(`/collections/all?${params.toString()}`);
  };

  // Small banner height: ~28px
  const headerTopClass = !isBannerVisible
    ? 'top-0'
    : 'top-[28px]';

  return (
    <header className={`fixed left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-8 ${headerTopClass}`}>
      {/* Top Bar */}
      <div className="bg-foreground dark:bg-white border border-border/30 rounded-full max-w-5xl mx-auto mt-2 shadow-sm">
        <div className="flex items-center justify-between h-11 px-5">

          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 transition-colors"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? (
                <X size={20} strokeWidth={1.5} className="text-background dark:text-neutral-900" />
              ) : (
                <List size={20} weight="bold" className="text-background dark:text-neutral-900" />
              )}
            </button>
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <Image
                src="/2B.png"
                alt="SAME."
                width={90}
                height={20}
                className="dark:hidden"
                priority
              />
              <Image
                src="/2.png"
                alt="SAME."
                width={90}
                height={20}
                className="hidden dark:block"
              />
            </Link>
          </div>

          {/* RIGHT: Icons */}
          <div className="flex items-center gap-0.5">
            {/* Search */}
            <PerfumeSearchModal onSearch={handlePerfumeSearch}>
              <button className="p-2 transition-colors hover:opacity-60 hidden sm:flex" aria-label="Buscar">
                <svg className="w-[18px] h-[18px] text-background dark:text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </PerfumeSearchModal>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Account */}
            <Link href={isAuthenticated ? '/account' : '/account/login'}>
              <button className="p-2 transition-colors hover:opacity-60" aria-label="Mi Cuenta">
                <UserIcon size={18} weight={isAuthenticated ? 'fill' : 'regular'} className="text-background dark:text-neutral-900" />
              </button>
            </Link>

            {/* Cart */}
            <Sheet>
            <SheetTrigger asChild>
              <button className="relative p-2 transition-colors hover:opacity-60">
                <svg className="w-[18px] h-[18px] text-background dark:text-neutral-900" viewBox="0 0 16 19" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.6042 4.39594C3.77079 4.39594 3.0642 5.00875 2.94634 5.83379L1.5109 15.8819C1.36677 16.8908 2.14962 17.7934 3.16875 17.7934H13.4801C14.4992 17.7934 15.2821 16.8908 15.138 15.8819L13.7025 5.83379C13.5846 5.00875 12.8781 4.39594 12.0447 4.39594H4.6042ZM2.11741 5.71537C2.29421 4.47782 3.35408 3.55859 4.6042 3.55859H12.0447C13.2948 3.55859 14.3546 4.47782 14.5314 5.71537L15.9669 15.7635C16.1831 17.2768 15.0088 18.6308 13.4801 18.6308H3.16875C1.64006 18.6308 0.465779 17.2768 0.681969 15.7635L2.11741 5.71537Z" fill="currentColor" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.76633 4.39605H4.34766V3.97738C4.34766 1.78073 6.12839 0 8.32504 0C10.5217 0 12.3024 1.78073 12.3024 3.97738V4.39605H11.8837H4.76633ZM11.4374 3.55871C11.2327 2.02245 9.91728 0.837343 8.32504 0.837343C6.7328 0.837343 5.41735 2.02245 5.21267 3.55871H11.4374Z" fill="currentColor" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-primary-foreground bg-primary rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md bg-card p-0 flex flex-col">
              <SheetHeader className="px-6 py-5 border-b">
                <SheetTitle className="text-xl font-normal">
                  {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'} en tu bolsa
                </SheetTitle>
                <SheetDescription className="sr-only">Revisa tus artículos seleccionados</SheetDescription>
              </SheetHeader>

              <div className="flex-1 flex flex-col overflow-hidden">
                {cartLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <CircleNotch size={32} weight="light" className="animate-spin text-muted-foreground" />
                  </div>
                ) : cart && cart.lines?.edges && cart.lines.edges.length > 0 ? (
                  <>
                    {/* Discount Progress Bar */}
                    <div className="px-6 py-4 border-b">
                      <DiscountProgressBar
                        itemCount={itemCount}
                        isFreeShipping={amountRemaining <= 0}
                      />
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      <ul className="space-y-6">
                        {cart.lines.edges.map(({ node: line }: any) => {
                          const imageUrl = line.merchandise?.product?.featuredImage?.url ||
                            line.merchandise?.product?.images?.edges?.[0]?.node?.url;

                          return (
                            <li key={line.id} className="flex gap-4">
                              <div className="w-22 h-28 bg-muted rounded shrink-0 overflow-hidden">
                                {imageUrl ? (
                                  <Link href={`/products/${line.merchandise?.product?.handle}`} className="relative block w-full h-full">
                                    <Image
                                      src={imageUrl}
                                      alt={line.merchandise?.product?.title || 'Producto'}
                                      fill
                                      sizes="88px"
                                      className="object-cover"
                                    />
                                  </Link>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <Package className="w-8 h-8" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                <div className="flex justify-between gap-4 mb-2">
                                  <Link href={`/products/${line.merchandise?.product?.handle}`} className="font-medium text-sm leading-tight hover:underline">
                                    {line.merchandise?.product?.title}
                                  </Link>
                                  <p className="text-sm font-semibold whitespace-nowrap">
                                    {formatPrice(line.cost?.totalAmount?.amount || '0')}
                                  </p>
                                </div>

                                {/* Variant Options Selector */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {line.merchandise?.product?.options?.map((option: any) => {
                                    if (option.name === 'Title' || option.values.length <= 1) return null;

                                    const selectedValue = line.merchandise.selectedOptions?.find(
                                      (o: any) => o.name === option.name
                                    )?.value;

                                    return (
                                      <select
                                        key={option.id}
                                        value={selectedValue}
                                        onChange={(e) => {
                                          const newValue = e.target.value;
                                          const currentOptions = line.merchandise.selectedOptions;

                                          if (!currentOptions) {
                                            console.warn('Missing selectedOptions for line item:', line.id);
                                            return;
                                          }

                                          const newOptions = currentOptions.map((o: any) =>
                                            o.name === option.name ? { ...o, value: newValue } : o
                                          );

                                          const variants = line.merchandise.product.variants?.edges;
                                          if (!variants) {
                                            console.warn('Missing variants for product:', line.merchandise.product.id);
                                            return;
                                          }

                                          const matchingVariant = variants.find(({ node }: any) =>
                                            node.selectedOptions.every((vOpt: any) =>
                                              newOptions.some((nOpt: any) => nOpt.name === vOpt.name && nOpt.value === vOpt.value)
                                            )
                                          );

                                          if (matchingVariant && matchingVariant.node.id !== line.merchandise.id) {
                                            updateCartItem(line.id, line.quantity, matchingVariant.node.id);
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
                                  <button
                                    onClick={async () => {
                                      // Smart Duplicate: Try to find a DIFFERENT variant to add
                                      // so it creates a new line item
                                      const currentVariantId = line.merchandise.id;
                                      const allVariants = line.merchandise.product.variants?.edges || [];

                                      // Find first variant that is NOT the current one and is available
                                      const otherVariant = allVariants.find((v: any) =>
                                        v.node.id !== currentVariantId && v.node.availableForSale
                                      );

                                      const variantToAdd = otherVariant ? otherVariant.node.id : currentVariantId;

                                      await addToCart(variantToAdd, 1);
                                    }}
                                    className="h-7 w-7 text-xs border border-input bg-background hover:bg-muted hover:border-primary text-muted-foreground hover:text-primary rounded flex items-center justify-center transition-colors shrink-0"
                                    title="Duplicar con otro tamaño/tipo"
                                    aria-label="Duplicar con otro tamaño/tipo"
                                  >
                                    <Copy size={14} />
                                  </button>
                                </div>

                                {/* Quantity Controls - Bottom */}
                                <div className="flex items-center justify-between mt-auto">
                                  <div className="flex items-center border border-input rounded h-7 bg-background">
                                    <button
                                      onClick={() => {
                                        const newQty = line.quantity - 1;
                                        if (newQty === 0) {
                                          removeCartItem(line.id);
                                        } else {
                                          updateCartItem(line.id, newQty);
                                        }
                                      }}
                                      className="px-2 h-full flex items-center justify-center hover:bg-muted transition-colors text-xs"
                                      aria-label="Decrease quantity"
                                    >
                                      −
                                    </button>
                                    <span className="px-3 h-full flex items-center justify-center text-xs font-medium border-x border-input min-w-[32px]">
                                      {line.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateCartItem(line.id, line.quantity + 1)}
                                      className="px-2 h-full flex items-center justify-center hover:bg-muted transition-colors text-xs"
                                      aria-label="Increase quantity"
                                    >
                                      +
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-3">

                                    <button
                                      onClick={() => removeCartItem(line.id)}
                                      className="text-xs text-muted-foreground hover:text-destructive underline decoration-dotted underline-offset-4"
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Cart Recommendations */}
                      <CartRecommendations
                        excludeIds={cart.lines?.edges?.map((e: any) => e.node.merchandise.product.id) || []}
                        maxItems={3}
                      />
                    </div>


                    <div className="border-t px-6 py-6 mt-auto">
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
                          <div className="space-y-2 mb-4">
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
                            <div className="flex items-baseline justify-between text-muted-foreground mb-2">
                              <span className="text-sm">Envío</span>
                              <span className="text-sm font-medium text-primary">
                                {originalTotal >= 200000 ? 'Gratis' : 'Calculado al pagar'}
                              </span>
                            </div>
                            <div className="flex items-baseline justify-between pt-2 border-t border-border">
                              <span className="text-lg font-bold">Subtotal</span>
                              <span className="text-2xl font-bold">
                                {formatPrice(finalTotal.toFixed(2))}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                      <p className="text-xs text-muted-foreground mb-5">
                        *Envío, impuestos y descuentos calculados al pagar
                      </p>

                      {cart.checkoutUrl ? (
                        <a href={cart.checkoutUrl} className="block">
                          <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-wide">
                            Pagar
                          </Button>
                        </a>
                      ) : (
                        <Button disabled className="w-full h-12 text-base font-semibold bg-primary/50 text-primary-foreground uppercase tracking-wide">
                          Cargando...
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 px-6">
                    <h2 className="text-2xl font-semibold mb-2">Oops...</h2>
                    <p className="text-muted-foreground text-center mb-2">Tu carrito está vacío.</p>
                    <p className="text-muted-foreground text-center mb-8">¡Te ayudamos!</p>

                    {/* Recommendations */}
                    <div className="w-full space-y-3 mb-8">
                      <Link href="/collections/all" className="block">
                        <div className="flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer">
                          <div className="w-20 h-20 bg-background rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                            <Drop size={32} weight="light" className="text-muted-foreground" />
                          </div>
                          <span className="text-lg font-medium">Perfumes</span>
                        </div>
                      </Link>

                      <Link href="/collections/bestsellers" className="block">
                        <div className="flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer">
                          <div className="w-20 h-20 bg-background rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                            <Star size={32} weight="light" className="text-muted-foreground" />
                          </div>
                          <span className="text-lg font-medium">Más Vendidos</span>
                        </div>
                      </Link>
                    </div>

                    <Link href="/collections/all" className="w-full block mb-4">
                      <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-base font-medium uppercase">
                        Ver Todo
                      </Button>
                    </Link>

                    <p className="text-sm text-muted-foreground text-center">
                      Envío gratis en 4+ artículos
                    </p>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </div>

      {/* Dropdown Menu Panel - Neon Style */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden bg-[#ede8d0] dark:bg-neutral-900 border border-border/30 rounded-3xl max-w-5xl mx-auto mt-1 shadow-sm"
          >
            <nav className="px-8 py-8 flex flex-col gap-1">
              <Link
                href="/collections/all"
                onClick={() => setMenuOpen(false)}
                className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity py-2"
              >
                Perfumes
              </Link>
              <Link
                href="/collections/bestsellers"
                onClick={() => setMenuOpen(false)}
                className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity py-2"
              >
                Más Vendidos
              </Link>
              <Link
                href="/pages/quiz"
                onClick={() => setMenuOpen(false)}
                className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity py-2"
              >
                Descúbrete
              </Link>
              <Link
                href="/pages/crea-tu-aroma"
                onClick={() => setMenuOpen(false)}
                className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity py-2"
              >
                Crea tu Aroma
              </Link>
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity py-2"
              >
                Nosotros
              </Link>
              <Link
                href="/pages/contact"
                onClick={() => setMenuOpen(false)}
                className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity py-2"
              >
                Contacto
              </Link>

              {/* Social Icons */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-neutral-900/10 dark:border-neutral-100/10">
                <a
                  href="https://www.instagram.com/sameperfumes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity"
                >
                  <InstagramLogo size={22} weight="light" />
                </a>
                <a
                  href="https://www.tiktok.com/@sameperfumes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity"
                >
                  <TiktokLogo size={22} weight="light" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
