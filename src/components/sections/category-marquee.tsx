'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CircleNotch, GridFour } from 'phosphor-react';

interface CategoryItem {
    id: string;
    label: string;
    handle: string;
    href: string;
}

interface CategoryMarqueeProps {
    items: CategoryItem[];
    selectedCategory: string;
    onSelectCategory: (handle: string) => void;
    isLoading?: boolean;
}

export function CategoryMarquee({
    items,
    selectedCategory,
    onSelectCategory,
    isLoading = false
}: CategoryMarqueeProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const animationRef = useRef<number | null>(null);
    const isDraggingRef = useRef(false);
    const isDownRef = useRef(false);
    const startXRef = useRef(0);

    const lastTimestampRef = useRef<number>(0);
    const isUserInteractingRef = useRef(false);
    const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scrollAccumulatorRef = useRef<number>(0);

    // Duplicar items para scroll infinito
    // Si hay pocos elementos, duplicamos más veces
    const duplicationFactor = items.length < 5 ? 8 : 4;
    const duplicatedItems = items.length > 0 ? Array(duplicationFactor).fill(items).flat() : [];

    const scroll = useCallback((timestamp: number) => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;

        if (!lastTimestampRef.current) {
            lastTimestampRef.current = timestamp;
            scrollAccumulatorRef.current = container.scrollLeft;
        }

        const deltaTime = timestamp - lastTimestampRef.current;
        lastTimestampRef.current = timestamp;

        if (isDraggingRef.current || isUserInteractingRef.current) {
            scrollAccumulatorRef.current = container.scrollLeft;
            animationRef.current = requestAnimationFrame(scroll);
            return;
        }

        // Velocidad: 50 pixels por segundo (un poco más lento para lectura)
        const pixelsPerSecond = 50;
        const moveAmount = (pixelsPerSecond * deltaTime) / 1000;

        scrollAccumulatorRef.current += moveAmount;
        container.scrollLeft = scrollAccumulatorRef.current;

        // Loop infinito
        if (container.scrollLeft >= (container.scrollWidth - container.clientWidth) / 2) {
            const oneSetWidth = container.scrollWidth / duplicationFactor;
            if (container.scrollLeft >= oneSetWidth * (duplicationFactor / 2)) {
                const adjustment = oneSetWidth * (duplicationFactor / 2);
                container.scrollLeft -= adjustment;
                scrollAccumulatorRef.current -= adjustment;
            }
        }

        animationRef.current = requestAnimationFrame(scroll);
    }, [duplicationFactor]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
        }
        animationRef.current = requestAnimationFrame(scroll);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (resumeTimeoutRef.current) {
                clearTimeout(resumeTimeoutRef.current);
            }
        };
    }, [scroll, items]); // Reiniciar si items cambian

    // Pointer Handlers
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!scrollContainerRef.current) return;
        if (e.pointerType === 'touch') return;

        isDownRef.current = true;
        startXRef.current = e.clientX;
        setStartX(e.clientX);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!scrollContainerRef.current) return;
        if (e.pointerType === 'touch') return;
        if (!isDownRef.current) return;

        if (!isDraggingRef.current) {
            const dist = Math.abs(e.clientX - startXRef.current);
            if (dist > 5) {
                isDraggingRef.current = true;
                setIsDragging(true);
                scrollContainerRef.current.setPointerCapture(e.pointerId);
                scrollContainerRef.current.style.cursor = 'grabbing';
            } else {
                return;
            }
        }

        e.preventDefault();
        const x = e.clientX;
        const walk = (x - startXRef.current) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
        scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
    };

    const endPointerInteraction = (e: React.PointerEvent<HTMLDivElement>) => {
        isDownRef.current = false;
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDragging(false);
            if (scrollContainerRef.current) {
                scrollContainerRef.current.style.cursor = 'grab';
                if (scrollContainerRef.current.hasPointerCapture(e.pointerId)) {
                    scrollContainerRef.current.releasePointerCapture(e.pointerId);
                }
                scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-4 bg-background border-b border-border">
                <CircleNotch size={24} weight="bold" className="animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-background border-b border-border relative z-10 w-full overflow-hidden">
            <div className="flex w-full items-center relative py-2.5 lg:py-4">

                {/* Label lateral - Improved design */}
                <div className="w-max shrink-0 h-full flex items-center gap-2 pl-4 pr-3 lg:pl-8 lg:pr-6 relative z-20 bg-background">
                    <GridFour size={16} weight="fill" className="text-primary" />
                    <p className="text-xs lg:text-sm font-bold tracking-wider text-foreground uppercase">Categories</p>
                    <div className="h-4 w-px bg-border ml-1" />
                </div>

                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-x-auto md:overflow-x-hidden relative py-1 scrollbar-hide cursor-grab"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={endPointerInteraction}
                    onPointerLeave={endPointerInteraction}
                    onPointerCancel={endPointerInteraction}
                    onTouchStart={() => {
                        isUserInteractingRef.current = true;
                        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
                        if (scrollContainerRef.current) {
                            scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
                        }
                    }}
                    onTouchMove={() => {
                        if (scrollContainerRef.current) {
                            scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
                        }
                    }}
                    onTouchEnd={() => {
                        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
                        if (scrollContainerRef.current) {
                            scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
                        }
                        resumeTimeoutRef.current = setTimeout(() => {
                            isUserInteractingRef.current = false;
                            if (scrollContainerRef.current) {
                                scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
                            }
                        }, 2000);
                    }}
                    style={{
                        userSelect: 'none',
                        touchAction: 'pan-x pan-y',
                        whiteSpace: 'nowrap',
                        WebkitOverflowScrolling: 'touch',
                        willChange: 'scroll-position'
                    }}
                >
                    <div className="inline-flex items-center gap-2 lg:gap-3 pr-8 pl-1">
                        {duplicatedItems.map((item, index) => (
                            <Link
                                key={`${item.id}-${index}`}
                                href={item.href}
                                className={`flex items-center justify-center px-4 py-2 rounded-full shrink-0 transition-all duration-200 text-xs lg:text-sm font-semibold uppercase tracking-wide ${selectedCategory === item.handle
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50'
                                    }`}
                                draggable={false}
                                onClick={(e) => {
                                    if (isDraggingRef.current) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    } else {
                                        onSelectCategory(item.handle);
                                    }
                                }}
                            >
                                <span className="whitespace-nowrap">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Fade Out Right */}
                <div className="absolute right-0 top-0 bottom-0 w-10 lg:w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
}

