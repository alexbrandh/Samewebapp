'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { PerfumeSearchModal } from '@/components/ui/perfume-search-modal';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CurrencySwitcher } from '@/components/ui/currency-switcher';
import { useCart } from '@/lib/hooks/useShopify';
import { getCollections } from '@/lib/shopify';
import { useCustomer } from '@/contexts/customer-context';
import { useCurrency } from '@/contexts/currency-context';
import { useBanner } from '@/contexts/banner-context';
import { Loader2, Trash2, Package, Menu, X, Copy } from 'lucide-react';
import { List, CaretRight, User as UserIcon } from 'phosphor-react';
import { DiscountProgressBar } from '@/components/ui/discount-progress-bar';
import { CartRecommendations } from '@/components/cart/cart-recommendations';
import { cn } from '@/lib/utils';

interface HeaderProps {
  cartItemsCount?: number;
}

export function Header({ cartItemsCount = 0 }: HeaderProps) {
  const { cart, loading: cartLoading, removeCartItem, updateCartItem, addToCart } = useCart();
  const { isAuthenticated, customer } = useCustomer();
  const { isBannerVisible } = useBanner();
  const router = useRouter();
  const itemCount = cart?.totalQuantity || cartItemsCount;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const { formatPrice } = useCurrency();

  // Fetch all collections from Shopify
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setCollectionsLoading(true);
        const data = await getCollections();
        const collectionsArray = data?.edges?.map((edge: any) => edge.node) || [];
        setCollections(collectionsArray);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setCollections([]);
      } finally {
        setCollectionsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // Calculate free shipping progress
  const freeShippingThreshold = 200; // 200 AED for free shipping
  const currentTotal = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
  const amountRemaining = Math.max(0, freeShippingThreshold - currentTotal);
  const progressPercentage = Math.min(100, (currentTotal / freeShippingThreshold) * 100);

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

  // Calculate header top position based on banner state
  const showPromoMessage = isBannerVisible && itemCount > 0;

  // Header Height: 65px
  // Banner Heights (Measured):
  // Base: 59px | Expanded: 83px

  const headerTopClass = !isBannerVisible
    ? 'top-0'
    : showPromoMessage
      ? 'top-[77px] md:top-[83px]'
      : 'top-[53px] md:top-[59px]';

  return (
    <header className={`fixed left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border shadow-lg transition-all duration-300 ${headerTopClass}`}>
      <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">

        {/* LEFT SECTION - Oculto en móvil */}
        <div className="hidden lg:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Perfumes Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-muted text-xs font-medium uppercase tracking-wide text-foreground">
                  Perfumes
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-primary/10 p-6 no-underline outline-none focus:shadow-md hover:shadow-lg transition-shadow"
                          href="/collections/all"
                        >
                          <div className="mb-2 mt-4 text-lg font-semibold text-foreground">
                            Shop All
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Discover our complete collection of premium fragrances
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/collections/originals" title="Shop SAME. Originals">
                      Our exclusive original fragrances
                    </ListItem>
                    <ListItem href="/collections/women" title="Women">
                      Elegant and sophisticated scents
                    </ListItem>
                    <ListItem href="/collections/men" title="Men">
                      Bold and masculine fragrances
                    </ListItem>
                    <ListItem href="/collections/unisex" title="Unisex">
                      Versatile scents for everyone
                    </ListItem>
                    <ListItem href="/collections/bestsellers" title="Best Sellers">
                      Our most popular fragrances
                    </ListItem>
                    <ListItem href="/collections/new-arrivals" title="New Arrivals">
                      Latest additions to our collection
                    </ListItem>
                    <ListItem href="/pages/scent-families" title="Scent Families">
                      Explore different fragrance families
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Categories Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-muted text-xs font-medium uppercase tracking-wide text-foreground">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 w-[600px] max-h-[500px] overflow-y-auto">
                    {collectionsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <ul className="grid grid-cols-3 gap-3">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/collections/all"
                              className="block px-3 py-2 rounded-md hover:bg-muted transition-colors"
                            >
                              <span className="text-sm font-medium text-foreground">All Perfumes</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        {collections.map((collection) => (
                          <li key={collection.id}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={`/collections/${collection.handle}`}
                                className="block px-3 py-2 rounded-md hover:bg-muted transition-colors"
                              >
                                <span className="text-sm font-medium text-foreground">{collection.title}</span>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Perfume Quiz */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/pages/quiz" className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-muted text-xs font-medium capitalize text-foreground")}>
                    Perfume Quiz
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

        </div>

        {/* CENTER - LOGO centrado */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">
            <Image
              src="/2.png"
              alt="SAME."
              width={110}
              height={24}
              className="dark:hidden"
              priority
            />
            <Image
              src="/2B.png"
              alt="SAME."
              width={110}
              height={24}
              className="hidden dark:block"
            />
          </Link>
        </div>

        {/* LEFT SECTION Mobile - Menú Hamburguesa */}
        <div className="flex lg:hidden items-center">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-md transition-colors">
                <List size={24} weight="bold" className="text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[400px] bg-background p-0 flex flex-col">
              <SheetHeader className="px-6 py-5 border-b flex-row items-center justify-between">
                <SheetTitle className="text-xl font-semibold">Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                <nav className="px-4 py-6 space-y-1">
                  {/* Perfumes Section */}
                  <div className="mb-6">
                    <h3 className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Perfumes
                    </h3>
                    <Link
                      href="/collections/all"
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Shop All</span>
                      <CaretRight size={16} weight="bold" />
                    </Link>
                    <Link
                      href="/collections/originals"
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Shop SAME. Originals</span>
                      <CaretRight size={16} weight="bold" />
                    </Link>
                    <Link
                      href="/collections/women"
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Women</span>
                      <CaretRight size={16} weight="bold" />
                    </Link>
                    <Link
                      href="/collections/men"
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Men</span>
                      <CaretRight size={16} weight="bold" />
                    </Link>
                    <Link
                      href="/collections/unisex"
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Unisex</span>
                      <CaretRight size={16} weight="bold" />
                    </Link>
                    <Link
                      href="/collections/bestsellers"
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Best Sellers</span>
                      <CaretRight size={16} weight="bold" />
                    </Link>
                    <Link
                      href="/collections/new-arrivals"
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">New Arrivals</span>
                      <CaretRight size={16} weight="bold" />
                    </Link>
                    <Link
                      href="/pages/scent-families"
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Scent Families</span>
                      <CaretRight size={16} weight="bold" />
                    </Link>
                  </div>

                  <div className="border-t border-border my-4"></div>

                  {/* Categories Section - Collapsible */}
                  <div className="mb-6">
                    <h3 className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Categories
                    </h3>

                    {/* Toggle Button */}
                    <button
                      onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                    >
                      <span className="text-sm font-semibold">All Categories</span>
                      <CaretRight
                        size={16}
                        weight="bold"
                        className={`transition-transform duration-200 ${categoriesExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>

                    {/* Collapsible Content */}
                    {categoriesExpanded && (
                      <div className="ml-3 mt-1 space-y-1">
                        <Link
                          href="/collections/all"
                          className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="text-sm font-medium">All Perfumes</span>
                          <CaretRight size={14} weight="bold" />
                        </Link>
                        {collectionsLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          collections.map((collection) => (
                            <Link
                              key={collection.id}
                              href={`/collections/${collection.handle}`}
                              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span className="text-sm font-medium">{collection.title}</span>
                              <CaretRight size={14} weight="bold" />
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border my-4"></div>

                  {/* Perfume Quiz */}
                  <Link
                    href="/pages/quiz"
                    className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-semibold">Perfume Quiz</span>
                    <CaretRight size={16} weight="bold" />
                  </Link>

                  {/* Make a Bundle */}
                  <Link
                    href="/pages/bundle"
                    className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-semibold">Make a Bundle</span>
                    <CaretRight size={16} weight="bold" />
                  </Link>

                  <div className="border-t border-border my-4"></div>

                  {/* About Us Section */}
                  <div className="mb-6">
                    <h3 className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      About Us
                    </h3>
                    <Link
                      href="/about"
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">About Us</span>
                      <CaretRight size={16} weight="bold" />
                    </Link>
                    <Link
                      href="/pages/refer-a-friend"
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Refer a Friend</span>
                      <CaretRight size={16} weight="bold" />
                    </Link>
                  </div>

                  <div className="border-t border-border my-4"></div>

                  {/* Account Section */}
                  <div className="mb-6">
                    <h3 className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Account
                    </h3>
                    {isAuthenticated ? (
                      <>
                        <Link
                          href="/account"
                          className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="text-sm font-medium">My Account</span>
                          <CaretRight size={16} weight="bold" />
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="text-sm font-medium">My Orders</span>
                          <CaretRight size={16} weight="bold" />
                        </Link>
                        <Link
                          href="/account/favorites"
                          className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="text-sm font-medium">My Favorites</span>
                          <CaretRight size={16} weight="bold" />
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/account/login"
                        className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="text-sm font-medium">Sign In</span>
                        <CaretRight size={16} weight="bold" />
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-border my-4"></div>

                  {/* Help Section */}
                  <div className="mb-6">
                    <h3 className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Help
                    </h3>
                    <Link
                      href="/pages/contact"
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">Contact Us</span>
                      <CaretRight size={16} weight="bold" />
                    </Link>
                    <Link
                      href="/pages/faq"
                      className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-sm font-medium">FAQ</span>
                      <CaretRight size={16} weight="bold" />
                    </Link>
                  </div>
                </nav>
              </div>

              <div className="border-t border-border px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Currency</span>
                  <CurrencySwitcher openDirection="up" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* RIGHT SECTION Mobile - Account & Theme Toggle cerca del borde derecho */}
        <div className="flex lg:hidden items-center gap-1">
          {/* Account Icon */}
          <Link href={isAuthenticated ? '/account' : '/account/login'}>
            <button className="relative p-2 hover:bg-muted rounded-full transition-colors" aria-label="My Account">
              <UserIcon size={20} weight={isAuthenticated ? 'fill' : 'regular'} className="text-foreground" />
              {isAuthenticated && (
                <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

        </div>

        {/* RIGHT SECTION - Oculto en móvil */}
        <div className="hidden lg:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Make a Bundle */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/pages/bundle" className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-muted text-xs font-medium uppercase tracking-wide text-foreground")}>
                    MAKE A BUNDLE
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* About Us Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-muted text-xs font-medium uppercase tracking-wide text-foreground">
                  About Us
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <div className="mb-2">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Who We Are</p>
                      <ListItem href="/about" title="About Us">
                        Learn about our mission and values
                      </ListItem>
                      <ListItem href="/pages/refer-a-friend" title="Refer a Friend">
                        Share the love and get rewarded
                      </ListItem>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Help</p>
                      <ListItem href="/pages/contact" title="Contact Us">
                        Get in touch with our team
                      </ListItem>
                      <ListItem href="/pages/faq" title="FAQ">
                        Find answers to common questions
                      </ListItem>
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search */}
          <PerfumeSearchModal onSearch={handlePerfumeSearch}>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
                <rect fill="currentColor" className="text-primary" rx="13.5" height="27" width="27" y="0.5" x="0.5" />
                <circle strokeWidth="0.68331" stroke="white" r="7.3809" cy="13.1812" cx="13.1811" />
                <path strokeLinecap="round" strokeWidth="0.68331" stroke="white" d="M18.2117 18.635C18.6662 18.1806 18.6821 18.1532 18.9994 17.9417L22.6316 21.409C23.086 21.8634 23.086 22.6002 22.6316 23.0547C22.1771 23.5091 21.4403 23.5091 20.9859 23.0547L17.4126 19.4813C17.4126 19.4813 17.862 18.9848 18.2117 18.635Z" clipRule="evenodd" fillRule="evenodd" />
              </svg>
            </button>
          </PerfumeSearchModal>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Currency Switcher */}
          <CurrencySwitcher openDirection="down" />

          {/* Account */}
          <Link href={isAuthenticated ? '/account' : '/account/login'}>
            <button className="relative p-2 hover:bg-muted rounded-full transition-colors" aria-label="My Account">
              <UserIcon size={20} weight={isAuthenticated ? 'fill' : 'regular'} className="text-foreground" />
              {isAuthenticated && (
                <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          </Link>

          {/* Cart */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
                <svg className="w-5 h-5 text-foreground" viewBox="0 0 16 19" fill="none">
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
                  {itemCount} {itemCount === 1 ? 'Item' : 'Items'} in your bag
                </SheetTitle>
                <SheetDescription className="sr-only">Review your selected items</SheetDescription>
              </SheetHeader>

              <div className="flex-1 flex flex-col overflow-hidden">
                {cartLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
                                  <Link href={`/products/${line.merchandise?.product?.handle}`}>
                                    <img
                                      src={imageUrl}
                                      alt={line.merchandise?.product?.title || 'Product'}
                                      className="w-full h-full object-cover"
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
                                    title="Duplicate with other size/type"
                                    aria-label="Duplicate with other size/type"
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
                                      Remove
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
                            <div className="flex items-baseline justify-between text-muted-foreground mb-2">
                              <span className="text-sm">Shipping</span>
                              <span className="text-sm font-medium text-primary">
                                {originalTotal >= 200 ? 'Free' : 'Calculated at checkout'}
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
                        *Shipping, taxes, and discounts calculated at checkout
                      </p>

                      {cart.checkoutUrl ? (
                        <a href={cart.checkoutUrl} className="block">
                          <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-wide">
                            Check Out
                          </Button>
                        </a>
                      ) : (
                        <Button disabled className="w-full h-12 text-base font-semibold bg-primary/50 text-primary-foreground uppercase tracking-wide">
                          Loading Checkout...
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 px-6">
                    <h2 className="text-2xl font-semibold mb-2">Oops...</h2>
                    <p className="text-muted-foreground text-center mb-2">Your cart is currently empty.</p>
                    <p className="text-muted-foreground text-center mb-8">Let us help!</p>

                    {/* Recommendations */}
                    <div className="w-full space-y-3 mb-8">
                      <Link href="/collections/all" className="block">
                        <div className="flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer">
                          <div className="w-20 h-20 bg-background rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              src="/IDKO 1-100/2.png"
                              alt="Perfumes"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-lg font-medium">Perfumes</span>
                        </div>
                      </Link>

                      <Link href="/collections/bestsellers" className="block">
                        <div className="flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors cursor-pointer">
                          <div className="w-20 h-20 bg-background rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              src="/IDKO 1-100/14.png"
                              alt="Best-sellers"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-lg font-medium">Best-sellers</span>
                        </div>
                      </Link>
                    </div>

                    <Link href="/collections/all" className="w-full block mb-4">
                      <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-base font-medium uppercase">
                        Shop All
                      </Button>
                    </Link>

                    <p className="text-sm text-muted-foreground text-center">
                      Free shipping on 4+ items
                    </p>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div >
      </div >
    </header >
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-foreground">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
