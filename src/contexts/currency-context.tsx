'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'AED';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    convertPrice: (amount: number | string) => string;
    formatPrice: (amount: number | string) => string;
    exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Fixed exchange rate: 1 USD = 3.67 AED
const EXCHANGE_RATE = 3.67;

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>('USD');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedCurrency = localStorage.getItem('currency') as Currency;
        if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'AED')) {
            setCurrencyState(savedCurrency);
        }
        setMounted(true);
    }, []);

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('currency', newCurrency);
    };

    const convertPrice = (amount: number | string): string => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) return '0.00';

        if (currency === 'USD') {
            return (numAmount / EXCHANGE_RATE).toFixed(2);
        } else {
            return numAmount.toFixed(2);
        }
    };
    const formatPrice = (amount: number | string): string => {
        const price = convertPrice(amount);
        return currency === 'USD' ? `$${price} USD` : `AED ${price}`;
    };

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                convertPrice,
                formatPrice,
                exchangeRate: EXCHANGE_RATE,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
