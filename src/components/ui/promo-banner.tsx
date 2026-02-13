'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Tag, Info } from 'phosphor-react';
import { useBanner } from '@/contexts/banner-context';
import { useCart } from '@/lib/hooks/useShopify';
import { useCustomer } from '@/contexts/customer-context';
import { CurrencySwitcher } from '@/components/ui/currency-switcher';

export function PromoBanner() {
  const [isClosed, setIsClosed] = useState(false);
  const { setBannerVisible } = useBanner();
  const { cart } = useCart();
  const { isAuthenticated } = useCustomer();
  const [showInfoModal, setShowInfoModal] = useState(false);

  const itemCount = cart?.totalQuantity || 0;
  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
  const isFreeShipping = itemCount >= 6;

  // Calculate discount progress
  const getDiscountLevel = () => {
    if (itemCount >= 6) return { level: 'max', text: '20% OFF', achieved: true };
    if (itemCount >= 4) return { level: 'third', text: '15% OFF', achieved: true };
    if (itemCount >= 2) return { level: 'second', text: '10% OFF', achieved: true };
    return { level: 'none', text: '10% OFF', achieved: false };
  };

  const discountInfo = getDiscountLevel();

  // Calculate individual bar widths (each bar represents 1 product)
  const getBarCompletion = (itemIndex: number) => {
    return itemCount >= itemIndex ? 100 : 0;
  };

  const handleClose = () => {
    setIsClosed(true);
    setBannerVisible(false);
  };

  if (isClosed) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-md">
        <div className="relative flex items-center justify-center px-4 md:px-6 py-2.5 md:py-3 gap-1 md:gap-6">

          {/* Black Friday Logo - Left */}
          <div className="shrink-0 hidden sm:block">
            <Tag size={20} weight="fill" className="text-foreground" />
          </div>

          {/* Center Section with Text + Progress */}
          <div className="flex items-center gap-2 md:gap-6 overflow-x-auto no-scrollbar w-full max-w-[700px] justify-center">
            {/* Text Message - Visible on larger screens */}
            <div className="hidden xl:flex items-center gap-2 shrink-0">
              <span className="text-sm font-bold text-foreground whitespace-nowrap">
                Buy More, Save More
              </span>
              <button onClick={() => setShowInfoModal(!showInfoModal)}>
                <Info size={14} weight="fill" className="text-foreground hover:opacity-70" />
              </button>
            </div>

            {/* Progress Bars Container - Horizontal - Fluid Width */}
            <div className="flex items-center gap-1.5 md:gap-3 flex-1 justify-center max-w-[480px]">
              {/* 2 items - 10% */}
              <div className="flex flex-col items-center gap-1.5 flex-1 min-w-[60px]">
                <div className="flex gap-1 w-full justify-center">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-1.5 md:h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground transition-all duration-500"
                        style={{ width: `${getBarCompletion(i)}%` }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] md:text-xs font-bold text-foreground text-center leading-tight">
                  2 items<br />10% OFF
                </p>
              </div>

              <div className="h-8 w-px bg-foreground/20 shrink-0" />

              {/* 4 items - 15% */}
              <div className="flex flex-col items-center gap-1.5 flex-1 min-w-[60px]">
                <div className="flex gap-1 w-full justify-center">
                  {[3, 4].map((i) => (
                    <div key={i} className="h-1.5 md:h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground transition-all duration-500"
                        style={{ width: `${getBarCompletion(i)}%` }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] md:text-xs font-bold text-foreground text-center leading-tight">
                  4 items<br />15% OFF
                </p>
              </div>

              <div className="h-8 w-px bg-foreground/20 shrink-0" />

              {/* 6 items - 20% */}
              <div className="flex flex-col items-center gap-1.5 flex-1 min-w-[60px]">
                <div className="flex gap-1 w-full justify-center">
                  {[5, 6].map((i) => (
                    <div key={i} className="h-1.5 md:h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground transition-all duration-500"
                        style={{ width: `${getBarCompletion(i)}%` }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] md:text-xs font-bold text-foreground text-center leading-tight">
                  6 items<br />20% OFF
                </p>
              </div>

              <button
                onClick={() => setShowInfoModal(!showInfoModal)}
                className="lg:hidden ml-1"
              >
                <Info size={12} weight="fill" className="text-foreground" />
              </button>
            </div>
          </div>

          {/* Right Section - Register/Alert (Hidden on mobile) */}
          <div className="hidden lg:flex shrink-0 items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link href="/account/login?mode=signup">
                  <button className="px-3 md:px-4 py-1.5 bg-foreground text-background text-xs font-semibold rounded hover:opacity-90 transition-opacity whitespace-nowrap">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Tag size={14} weight="fill" />
                <span className="whitespace-nowrap">Up to <strong>20% OFF!</strong></span>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="shrink-0 p-1 hover:bg-black/10 rounded-full transition-colors text-foreground"
            aria-label="Close banner"
          >
            <X size={14} weight="bold" />
          </button>
        </div>

        {/* Info Message */}
        {itemCount > 0 && itemCount < 2 && (
          <div className="bg-foreground/10 px-3 md:px-6 py-1 text-center">
            <p className="text-xs text-foreground">
              Add <strong>1</strong> more product to get <strong>10% discount</strong>
            </p>
          </div>
        )}
        {itemCount >= 2 && itemCount < 4 && (
          <div className="bg-foreground/10 px-3 md:px-6 py-1 text-center">
            <p className="text-xs text-foreground">
              You have 10% OFF! Add <strong>{4 - itemCount}</strong> more for <strong>15% OFF</strong>
            </p>
          </div>
        )}
        {itemCount >= 4 && itemCount < 6 && (
          <div className="bg-foreground/10 px-3 md:px-6 py-1 text-center">
            <p className="text-xs text-foreground">
              You have 15% OFF! Add <strong>{6 - itemCount}</strong> more for <strong>20% OFF</strong>
            </p>
          </div>
        )}
        {itemCount >= 6 && (
          <div className="bg-foreground/10 px-3 md:px-6 py-1 text-center">
            <p className="text-xs text-foreground">
              🎉 <strong>Congratulations! You have 20% OFF</strong>
            </p>
          </div>
        )}
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-60"
            onClick={() => setShowInfoModal(false)}
          />
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-70 bg-card border border-border rounded-lg shadow-xl p-6 max-w-md w-[90%]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-foreground">SAME. BENEFITS</h3>
              <button onClick={() => setShowInfoModal(false)}>
                <X size={20} weight="bold" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Tag size={20} weight="fill" className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">2+ products</p>
                  <p>Get 10% discount</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Tag size={20} weight="fill" className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">4+ products</p>
                  <p>Get 15% discount</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Tag size={20} weight="fill" className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">6+ items</p>
                  <p>Get 20% discount</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-xs">
                  {!isAuthenticated && "Register to access these exclusive discounts."}
                  {isAuthenticated && "Discounts will be automatically applied at checkout."}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
