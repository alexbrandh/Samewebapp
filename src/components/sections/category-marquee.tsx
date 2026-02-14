'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CircleNotch } from 'phosphor-react';

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

        const pixelsPerSecond = 40;
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
    }, [scroll, items]);

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
            <div className="flex items-center justify-center py-3 border-b border-border/30">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <CircleNotch size={14} weight="bold" className="animate-spin" />
                    <span className="text-xs">Cargando categorías...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative z-10 w-full overflow-hidden border-b border-border/30">
            <div className="flex w-full items-center relative">

                {/* Left fade */}
                <div className="absolute left-0 top-0 bottom-0 w-8 lg:w-14 bg-linear-to-r from-background via-background/80 to-transparent pointer-events-none z-10" />

                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-x-auto md:overflow-x-hidden relative scrollbar-hide cursor-grab"
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
                    <div className="inline-flex items-center gap-1.5 lg:gap-2 px-10 lg:px-16 py-2.5 lg:py-3">
                        {duplicatedItems.map((item, index) => (
                            <Link
                                key={`${item.id}-${index}`}
                                href={item.href}
                                className={`relative flex items-center justify-center px-3.5 lg:px-4 py-1.5 rounded-full shrink-0 transition-all duration-300 text-[11px] lg:text-xs tracking-wide ${selectedCategory === item.handle
                                    ? 'bg-foreground text-background font-semibold'
                                    : 'text-muted-foreground hover:text-foreground font-medium hover:bg-muted/50'
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

                {/* Right fade */}
                <div className="absolute right-0 top-0 bottom-0 w-8 lg:w-14 bg-linear-to-l from-background via-background/80 to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
}

