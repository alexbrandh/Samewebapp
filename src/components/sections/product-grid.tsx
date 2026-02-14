'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CaretLeft, CaretRight, CircleNotch } from 'phosphor-react';
import { useProducts, useProductsByTag } from '@/lib/hooks/useShopify';
import { ProductCard } from '@/components/product/product-card';


interface ProductGridProps {
  title?: string;
  tag?: string;
}

export function ProductGrid({ title, tag }: ProductGridProps) {
  const { products: allProducts, loading: loadingAll, error: errorAll } = useProducts(50);
  const { products: taggedProducts, loading: loadingTagged, error: errorTagged } = useProductsByTag(tag || '', 50);

  const loading = tag ? loadingTagged : loadingAll;
  const error = tag ? errorTagged : errorAll;
  const products = tag ? taggedProducts : allProducts;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const displayProducts = products;

  // Número de productos a mostrar por slide (responsive)
  const [productsPerSlide, setProductsPerSlide] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setProductsPerSlide(2);  // 2 columns on mobile
      } else if (window.innerWidth < 1024) {
        setProductsPerSlide(2);
      } else if (window.innerWidth < 1280) {
        setProductsPerSlide(3);
      } else {
        setProductsPerSlide(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(displayProducts.length / productsPerSlide);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && displayProducts.length > productsPerSlide) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5000); // Cambiar cada 5 segundos
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex, displayProducts.length, productsPerSlide]);

  const handleInteraction = () => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Obtener productos para el slide actual
  const startIndex = currentIndex * productsPerSlide;
  const currentProducts = displayProducts.slice(startIndex, startIndex + productsPerSlide);

  if (loading) {
    return (
      <section className="w-full py-20 bg-background">
        <div className="flex items-center justify-center">
          <CircleNotch size={48} weight="light" className="animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10 lg:py-16 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-16 lg:px-20">
        {title && (
          <h2 className="text-3xl font-bold tracking-tight text-center mb-8">{title}</h2>
        )}
        {/* Slider Container */}
        <div className="relative" onMouseEnter={handleInteraction} onTouchStart={handleInteraction}>

          {/* Navigation Arrows */}
          {displayProducts.length > productsPerSlide && (
            <>
              <button
                onClick={() => { prevSlide(); handleInteraction(); }}
                className="absolute left-2 sm:left-6 top-[35%] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/95 backdrop-blur-sm border border-border hover:bg-muted flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                aria-label="Productos anteriores"
              >
                <CaretLeft size={20} weight="light" className="sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={() => { nextSlide(); handleInteraction(); }}
                className="absolute right-2 sm:right-6 top-[35%] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/95 backdrop-blur-sm border border-border hover:bg-muted flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                aria-label="Productos siguientes"
              >
                <CaretRight size={20} weight="light" className="sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Products Slider */}
          <div className="overflow-hidden px-2 py-6 sm:px-3 sm:py-4">
            <AnimatePresence mode="wait">
              <motion.ul
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4"
              >
                {currentProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    animate={false}
                  />
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          {displayProducts.length > productsPerSlide && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setCurrentIndex(index); handleInteraction(); }}
                  className={`h-2 rounded-full transition-all ${index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted w-2 hover:bg-primary/50'
                    }`}
                  aria-label={`Ir a diapositiva ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .add-to-bag-button {
          width: 42px;
          transition: width 550ms ease-in-out;
        }
        .add-to-bag-button:hover {
          width: 138px;
        }
        .add-to-bag-label {
          opacity: 0;
          transition: opacity 300ms ease;
        }
        .add-to-bag-shell:has(.add-to-bag-button:hover) ~ .add-to-bag-label {
          opacity: 1;
          transition-delay: 150ms;
        }
      `}</style>
    </section>
  );
}