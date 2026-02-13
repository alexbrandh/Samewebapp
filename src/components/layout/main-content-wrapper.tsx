'use client';

import { useBanner } from '@/contexts/banner-context';
import { useCart } from '@/lib/hooks/useShopify';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
    const { isBannerVisible } = useBanner();
    const { cart } = useCart();
    const itemCount = cart?.totalQuantity || 0;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Avoid hydration mismatch by rendering default state first
    if (!mounted) {
        return <main className="pt-[104px] md:pt-[108px] transition-[padding] duration-300">{children}</main>;
    }

    const showPromoMessage = isBannerVisible && itemCount > 0;

    // Banner Heights (Approximate based on styling):
    // Mobile Base: ~40px | Expanded: ~70px
    // Desktop Base: ~44px | Expanded: ~74px

    // Header Height: 64px (h-16)

    // Total Padding Needed = Banner + Header
    // Base: 59 + 65 = 124px
    // Expanded: 83 + 65 = 148px

    const getPaddingClass = () => {
        if (!isBannerVisible) return 'pt-[65px]'; // Only Header
        if (showPromoMessage) return 'pt-[142px] md:pt-[148px]'; // Expanded (Banner + Header)
        return 'pt-[118px] md:pt-[124px]'; // Base (Banner + Header)
    };

    return (
        <main className={cn("transition-[padding] duration-300", getPaddingClass())}>
            {children}
        </main>
    );
}
