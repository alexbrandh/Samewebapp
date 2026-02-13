'use client';

import React from 'react';

interface DiscountProgressBarProps {
    itemCount: number;
    className?: string;
    isFreeShipping?: boolean;
}

export function DiscountProgressBar({ itemCount, className = '', isFreeShipping = false }: DiscountProgressBarProps) {
    // Calculate individual bar widths (each bar represents 1 product)
    const getBarCompletion = (itemIndex: number) => {
        return itemCount >= itemIndex ? 100 : 0;
    };

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {/* Progress Bars Container - Horizontal */}
            <div className="flex items-center justify-between gap-0.5 w-full max-w-sm mx-auto">
                {/* 2 items = 10% */}
                <div className="flex flex-col items-center gap-1 w-[25%]">
                    <div className="flex gap-0.5 w-full justify-center">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${getBarCompletion(i)}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-[9px] font-medium text-foreground text-center leading-tight">
                        2 items<br />10% OFF
                    </p>
                </div>

                <div className="h-6 w-px bg-border shrink-0" />

                {/* 4 items = 15% */}
                <div className="flex flex-col items-center gap-1 w-[25%]">
                    <div className="flex gap-0.5 w-full justify-center">
                        {[3, 4].map((i) => (
                            <div key={i} className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${getBarCompletion(i)}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-[9px] font-medium text-foreground text-center leading-tight">
                        4 items<br />15% OFF
                    </p>
                </div>

                <div className="h-6 w-px bg-border shrink-0" />

                {/* 6 items = 20% */}
                <div className="flex flex-col items-center gap-1 w-[25%]">
                    <div className="flex gap-0.5 w-full justify-center">
                        {[5, 6].map((i) => (
                            <div key={i} className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${getBarCompletion(i)}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <p className={`text-[9px] font-medium text-center leading-tight transition-colors ${itemCount >= 6 ? 'text-primary font-bold' : 'text-foreground'}`}>
                        6 items<br />20% OFF
                    </p>
                </div>
            </div>

            {/* Info Message */}
            <div className="text-center bg-muted/50 py-1.5 rounded text-xs">
                {itemCount === 0 && (
                    <p className="text-muted-foreground">Add products to unlock discounts</p>
                )}
                {itemCount > 0 && itemCount < 2 && (
                    <p className="text-foreground">
                        {isFreeShipping ? (
                            <>Free Shipping unlocked! Add <strong>1</strong> more for <strong>10% discount</strong></>
                        ) : (
                            <>Add <strong>1</strong> more for <strong>10% discount</strong></>
                        )}
                    </p>
                )}
                {itemCount >= 2 && itemCount < 4 && (
                    <p className="text-foreground">
                        {isFreeShipping ? (
                            <>10% unlocked! Free Shipping unlocked! Add <strong>{4 - itemCount}</strong> for <strong>15% OFF</strong></>
                        ) : (
                            <>10% unlocked! Add <strong>{4 - itemCount}</strong> for <strong>15% OFF</strong></>
                        )}
                    </p>
                )}
                {itemCount >= 4 && itemCount < 6 && (
                    <p className="text-foreground">
                        {isFreeShipping ? (
                            <>15% unlocked! Free Shipping unlocked! Add <strong>{6 - itemCount}</strong> for <strong>20% OFF</strong></>
                        ) : (
                            <>15% unlocked! Add <strong>{6 - itemCount}</strong> for <strong>20% OFF</strong></>
                        )}
                    </p>
                )}
                {itemCount >= 6 && (
                    <p className="text-foreground font-medium">
                        {isFreeShipping ? '🎉 You have 20% OFF + FREE shipping' : '🎉 You have 20% OFF'}
                    </p>
                )}
            </div>
        </div>
    );
}
