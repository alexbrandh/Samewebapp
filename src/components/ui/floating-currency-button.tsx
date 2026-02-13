'use client';

import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/contexts/currency-context';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingCurrencyButton() {
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

    const toggleCurrency = () => {
        if (isOpen) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    };

    const selectCurrency = (newCurrency: 'USD' | 'AED') => {
        setCurrency(newCurrency);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="fixed bottom-[190px] left-4 lg:bottom-[90px] lg:left-6 z-40">
            {/* Currency Options Popup */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-2 left-0 bg-card border border-border rounded-lg shadow-xl overflow-hidden"
                    >
                        <button
                            onClick={() => selectCurrency('USD')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium w-full hover:bg-muted transition-colors ${currency === 'USD' ? 'bg-primary/10 text-primary' : 'text-foreground'
                                }`}
                        >
                            🇺🇸 USD
                        </button>
                        <button
                            onClick={() => selectCurrency('AED')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium w-full hover:bg-muted transition-colors ${currency === 'AED' ? 'bg-primary/10 text-primary' : 'text-foreground'
                                }`}
                        >
                            🇦🇪 AED
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
                onClick={toggleCurrency}
                className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 bg-card hover:bg-muted border border-border text-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Change Currency"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.3,
                    delay: 0.7,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="text-xs lg:text-sm font-bold">{currency}</span>
            </motion.button>
        </div>
    );
}
