'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
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

// Colecciones de ejemplo para mostrar mientras se configuran las credenciales de Shopify
const mockCollections: CategoryItem[] = [
  {
    id: 'mock-collection-1',
    name: 'Premium Fragrances',
    description: 'Exclusive high-end perfumes',
    image: '/IDKO 1-100/7.png',
    handle: 'premium-fragrances'
  },
  {
    id: 'mock-collection-2',
    name: 'Classic Collection',
    description: 'Traditional and timeless aromas',
    image: '/IDKO 1-100/19.png',
    handle: 'classic-collection'
  },
  {
    id: 'mock-collection-3',
    name: 'Daily Fresh',
    description: 'Refreshing colognes for everyday',
    image: '/IDKO 1-100/32.png',
    handle: 'daily-fresh'
  },
  {
    id: 'mock-collection-4',
    name: 'Oriental Luxury',
    description: 'Exotic and spiced essences',
    image: '/IDKO 1-100/45.png',
    handle: 'oriental-luxury'
  }
];

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

  // Usar colecciones mock si hay error de conexión con Shopify
  const rawCollections = error ? mockCollections : collections.map(collection => ({
    id: collection.id,
    name: collection.title,
    description: collection.description || 'Descubre esta colección especial',
    image: collection.image?.url || '/IDKO 1-100/1.png',
    handle: collection.handle
  }));

  // Filtrar duplicados por nombre y handle
  const displayCollections = rawCollections.filter((collection, index, self) =>
    index === self.findIndex(c => c.name === collection.name && c.handle === collection.handle)
  );

  // Duplicar las colecciones varias veces para asegurar suficiente contenido para el scroll infinito
  // Si hay pocos elementos, duplicamos más veces
  const duplicationFactor = displayCollections.length < 5 ? 8 : 4;
  const duplicatedCollections = Array(duplicationFactor).fill(displayCollections).flat();

  const isUsingMockData = error && mockCollections.length > 0;

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

    // Velocidad: 70 pixels por segundo (aumentado para mayor fluidez)
    const pixelsPerSecond = 70;
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
      <div className="w-full">
        {/* Categories Section */}
        <div className="w-full">
          {isUsingMockData && (
            <div className="mt-4 mb-8 p-3 bg-muted border border-border rounded-lg max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground text-center">
                📝 Demo mode: Showing example categories. Configure Shopify credentials to see real categories.
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading categories...</span>
            </div>
          ) : (
            <div className="flex w-screen items-center relative bg-primary text-primary-foreground py-2 lg:py-3 pl-4 overflow-hidden">

              {/* Etiqueta lateral */}
              <div className="w-max shrink-0 min-h-6 lg:min-h-9 h-full flex items-center pr-4 lg:pr-8 relative z-10 bg-primary">
                <p className="text-[10px] lg:text-[14px] font-medium font-display leading-tight">Categories</p>
              </div>

              {/* Contenedor de scroll horizontal con drag */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-x-auto md:overflow-x-hidden relative py-1 scrollbar-hide cursor-grab"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endPointerInteraction}
                onPointerLeave={endPointerInteraction}
                onPointerCancel={endPointerInteraction}
                onTouchStart={() => {
                  // Pausar animación al tocar
                  isUserInteractingRef.current = true;
                  if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
                  // Sincronizar acumulador
                  if (scrollContainerRef.current) {
                    scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
                  }
                }}
                onTouchMove={() => {
                  // Dejar que el navegador maneje el scroll nativo
                  if (scrollContainerRef.current) {
                    scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
                  }
                }}
                onTouchEnd={() => {
                  // Reanudar animación después de un tiempo para dejar que el momentum termine
                  if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);

                  // Sincronizar acumulador una última vez antes de soltar (aunque el momentum seguirá cambiándolo, 
                  // pero el loop lo actualizará en la rama if(isUserInteracting))
                  if (scrollContainerRef.current) {
                    scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
                  }

                  resumeTimeoutRef.current = setTimeout(() => {
                    isUserInteractingRef.current = false;
                    // Al reanudar, asegurarnos de que el acumulador esté fresco
                    if (scrollContainerRef.current) {
                      scrollAccumulatorRef.current = scrollContainerRef.current.scrollLeft;
                    }
                  }, 2000); // 2 segundos de espera tras soltar
                }}
                style={{
                  userSelect: 'none',
                  touchAction: 'pan-x pan-y', // Permitir scroll horizontal nativo
                  whiteSpace: 'nowrap',
                  WebkitOverflowScrolling: 'touch',
                  willChange: 'scroll-position' // Optimización para scroll
                }}
              >
                <div className="inline-flex items-center gap-4 lg:gap-6 pr-6">
                  {duplicatedCollections.map((collection, index) => (
                    <Link
                      key={`${collection.id}-${index}`}
                      href={`/collections/${collection.handle}`}
                      className="px-4 py-1.5 bg-foreground hover:bg-foreground/90 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-background/20 hover:scale-105 shrink-0 inline-flex items-center"
                      draggable={false}
                      onClick={(e) => {
                        if (isDraggingRef.current) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <span className="text-sm font-semibold text-background whitespace-nowrap select-none" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {collection.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Gradiente de desvanecimiento derecho */}
              <div className="absolute right-0 top-0 bottom-0 w-12 lg:w-20 bg-linear-to-l from-primary to-transparent pointer-events-none z-10" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}