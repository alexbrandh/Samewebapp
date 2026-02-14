'use client';

import { useBanner } from '@/contexts/banner-context';
import { cn } from '@/lib/utils';

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
    const { isBannerVisible } = useBanner();

    return (
        <main className={cn(
            "transition-[padding] duration-300",
            isBannerVisible ? 'pt-[84px]' : 'pt-[56px]'
        )}>
            {children}
        </main>
    );
}
