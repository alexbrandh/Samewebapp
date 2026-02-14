'use client';

import { useCurrency } from '@/contexts/currency-context';

interface CurrencySwitcherProps {
    openDirection?: 'up' | 'down';
}

// Colombia flag SVG
const COLFlag = () => (
    <svg className="w-4 h-3 rounded-[2px]" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FCD116" d="M0 0h640v240H0z" />
        <path fill="#003893" d="M0 240h640v120H0z" />
        <path fill="#CE1126" d="M0 360h640v120H0z" />
    </svg>
);

export function CurrencySwitcher({ openDirection = 'up' }: CurrencySwitcherProps) {
    const { currency } = useCurrency();

    return (
        <div className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium uppercase tracking-wide text-foreground">
            <COLFlag />
            <span>{currency}</span>
        </div>
    );
}
