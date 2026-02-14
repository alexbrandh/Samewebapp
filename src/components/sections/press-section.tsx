'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CircleNotch } from 'phosphor-react';
import { useCollections } from '@/lib/hooks/useShopify';

interface PressLogo {
  name: string;
  logo: string;
  url: string;
}

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
  handle: string;
}


export function PressSection() {
  const { collections, loading, error } = useCollections();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const animationRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);

  const rawCollections: CategoryItem[] = collections.map((collection: any) => ({
    id: collection.id,
    name: collection.title,
    description: collection.description || 'Descubre esta colección especial',
    image: collection.image?.url || '',
    handle: collection.handle
  }));

  // Filtrar duplicados por nombre y handle
  const displayCollections = rawCollections.filter((collection: CategoryItem, index: number, self: CategoryItem[]) =>
    index === self.findIndex((c: CategoryItem) => c.name === collection.name && c.handle === collection.handle)
  );

  // Duplicar las colecciones varias veces para asegurar suficiente contenido para el scroll infinito
  const duplicationFactor = displayCollections.length < 5 ? 8 : 4;
  const duplicatedCollections = Array(duplicationFactor).fill(displayCollections).flat();

  const lastTimestampRef = useRef<number>(0);
  const isUserInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollAccumulatorRef = useRef<number>(0);

  const scroll = useCallback((timestamp: number) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;

    // Si no hay timestamp previo, inicializar
    if (!lastTimestampRef.current) {
      lastTimestampRef.current = timestamp;
      scrollAccumulatorRef.current = container.scrollLeft;
    }

    const deltaTime = timestamp - lastTimestampRef.current;
    lastTimestampRef.current = timestamp;

    // Si el usuario está interactuando (táctil o mouse) o hay un timeout de espera, no auto-scrollear
    if (isDraggingRef.current || isUserInteractingRef.current) {
      // Sincronizar el acumulador con la posición real mientras el usuario interactúa
      scrollAccumulatorRef.current = container.scrollLeft;
      animationRef.current = requestAnimationFrame(scroll);
      return;
    }

    // Velocidad: 35 pixels por segundo
    const pixelsPerSecond = 35;
    const moveAmount = (pixelsPerSecond * deltaTime) / 1000;

    // Usar acumulador para evitar problemas de sub-pixel rounding
    scrollAccumulatorRef.current += moveAmount;
    container.scrollLeft = scrollAccumulatorRef.current;

    // Lógica de loop infinito
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
    // Inicializar referencia
    if (scrollContainerRef.current) {
      scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
    }

    // Iniciar animación
    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [scroll]);

  // Pointer drag handlers (mouse + touch)
  // Pointer drag handlers (mouse + touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;

    // Solo activar drag manual si NO es touch (en touch usamos nativo)
    if (e.pointerType === 'touch') return;

    isDownRef.current = true;
    startXRef.current = e.clientX;
    setStartX(e.clientX);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    // Sincronizar acumulador
    scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;

    // NO capturar pointer todavía, esperar a que se mueva
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    if (e.pointerType === 'touch') return;

    if (!isDownRef.current) return;

    // Si aún no estamos haciendo drag, verificar umbral
    if (!isDraggingRef.current) {
      const dist = Math.abs(e.clientX - startXRef.current);
      if (dist > 5) {
        isDraggingRef.current = true;
        setIsDragging(true);
        scrollContainerRef.current.setPointerCapture(e.pointerId);
        scrollContainerRef.current.style.cursor = 'grabbing';
      } else {
        return; // No hacer nada si no ha superado el umbral
      }
    }

    e.preventDefault();
    const x = e.clientX;
    const walk = (x - startXRef.current) * 2; // Velocidad del drag
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    // Sincronizar acumulador
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
        // Sincronizar acumulador final
        scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
      }
    }
  };

  return (
    <section className="w-full">
      {loading ? (
        <div className="flex justify-center items-center py-6">
          <CircleNotch size={20} weight="light" className="animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Cargando categorías...</span>
        </div>
      ) : (
        <div className="relative flex w-full items-stretch bg-foreground overflow-hidden">

          {/* Etiqueta lateral */}
          <div className="shrink-0 flex items-center py-2.5 lg:py-3 pl-4 pr-3 lg:pl-6 lg:pr-5 relative z-20 bg-foreground">
            <span className="text-[10px] lg:text-xs font-semibold uppercase tracking-[0.15em] text-background/60">
              Categorías
            </span>
            <span className="ml-3 lg:ml-4 w-px h-4 bg-background/20" />
          </div>

          {/* Contenedor de scroll horizontal con drag */}
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
              willChange: 'scroll-position',
            }}
          >
            <div className="inline-flex items-stretch h-full pr-8">
              {duplicatedCollections.map((collection, index) => (
                <Link
                  key={`${collection.id}-${index}`}
                  href={`/collections/${collection.handle}`}
                  className="group relative px-5 shrink-0 inline-flex items-center border-x border-transparent hover:border-background/30 hover:bg-background/8 transition-all duration-300"
                  draggable={false}
                  onClick={(e) => {
                    if (isDraggingRef.current) {
                      e.preventDefault();
                    }
                  }}
                >
                  <span className="text-[13px] font-medium text-background/70 group-hover:text-background whitespace-nowrap select-none transition-colors duration-300">
                    {collection.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Gradientes de desvanecimiento */}
          <div className="absolute left-[90px] lg:left-[120px] top-0 bottom-0 w-8 lg:w-12 bg-linear-to-r from-foreground to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 lg:w-20 bg-linear-to-l from-foreground to-transparent pointer-events-none z-10" />
        </div>
      )}
    </section>
  );
}