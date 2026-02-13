'use client';

import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/contexts/currency-context';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CurrencySwitcherProps {
    openDirection?: 'up' | 'down';
}

export function CurrencySwitcher({ openDirection = 'up' }: CurrencySwitcherProps) {
    const { currency, setCurrency } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const dropdownPosition = openDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-1';

    // Flag SVG components
    const USFlag = () => (
        <svg className="w-4 h-3 rounded-[2px]" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
            <g fillRule="evenodd">
                <g strokeWidth="1pt">
                    <path fill="#bd3d44" d="M0 0h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8V197H0zm0 78.8h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8v39.4H0zm0 78.8h972.8V560H0z" transform="scale(.67 .857)" />
                    <path fill="#fff" d="M0 39.4h972.8v39.4H0zm0 78.8h972.8v39.3H0zm0 78.7h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8v39.4H0z" transform="scale(.67 .857)" />
                </g>
                <path fill="#192f5d" d="M0 0h389.1v275.7H0z" transform="scale(.67 .857)" />
            </g>
        </svg>
    );

    const UAEFlag = () => (
        <svg className="w-4 h-3 rounded-[2px]" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
            <path fill="#00732f" d="M0 0h640v160H0z" />
            <path fill="#fff" d="M0 160h640v160H0z" />
            <path fill="#000" d="M0 320h640v160H0z" />
            <path fill="#f00" d="M0 0h180v480H0z" />
        </svg>
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-3 text-xs font-medium uppercase tracking-wide text-foreground hover:bg-muted"
                onClick={() => setIsOpen(!isOpen)}
            >
                {currency === 'USD' ? <USFlag /> : <UAEFlag />}
                {currency}
                <ChevronDown className={cn("h-3 w-3 opacity-50 transition-transform", isOpen && "rotate-180")} />
            </Button>

            {isOpen && (
                <div className={cn(
                    "absolute right-0 w-[110px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 z-50",
                    dropdownPosition
                )}>
                    <div
                        className={cn(
                            "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                            currency === 'USD' && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => {
                            setCurrency('USD');
                            setIsOpen(false);
                        }}
                    >
                        <USFlag />
                        <span className="flex-1">USD</span>
                        {currency === 'USD' && <Check className="h-3 w-3" />}
                    </div>
                    <div
                        className={cn(
                            "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                            currency === 'AED' && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => {
                            setCurrency('AED');
                            setIsOpen(false);
                        }}
                    >
                        <UAEFlag />
                        <span className="flex-1">AED</span>
                        {currency === 'AED' && <Check className="h-3 w-3" />}
                    </div>
                </div>
            )}
        </div>
    );
}
