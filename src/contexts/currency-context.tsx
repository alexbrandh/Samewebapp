'use client';

import React, { createContext, useContext } from 'react';

type Currency = 'COP';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    convertPrice: (amount: number | string) => string;
    formatPrice: (amount: number | string) => string;
    exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const currency: Currency = 'COP';

    const setCurrency = (_newCurrency: Currency) => {
        // Solo COP disponible
    };

    const convertPrice = (amount: number | string): string => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) return '0';
        return Math.round(numAmount).toString();
    };

    const formatPrice = (amount: number | string): string => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) return '$0 COP';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numAmount);
    };

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                convertPrice,
                formatPrice,
                exchangeRate: 1,
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
