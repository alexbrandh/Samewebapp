'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Check, X, Heart, Leaf, Star, DotsSixVertical } from 'phosphor-react';

const comparisons = [
  { feature: 'Feromonas Patentadas', same: true, others: false },
  { feature: 'Garantía de Satisfacción', same: true, others: false },
  { feature: 'Duración de 18 Horas', same: true, others: false },
  { feature: 'Sin Químicos Dañinos', same: true, others: false },
  { feature: 'Vegano & Libre de Crueldad', same: true, others: false },
  { feature: 'Aromas Artesanales', same: true, others: false },
];

const features = [
  {
    icon: Heart,
    title: 'Belleza Ética & Vegana',
    description: 'Descubre una nueva consciencia con nuestra línea vegana y libre de crueldad. Calidad y ética se fusionan para ofrecerte productos responsables, sin comprometer tus valores.',
  },
  {
    icon: Leaf,
    title: 'Pureza Sin Químicos Dañinos',
    description: 'Experimenta nuestra línea libre de parabenos y ftalatos, donde la pureza se une a la calidad para consentir tu piel con la riqueza de la naturaleza.',
  },
  {
    icon: Star,
    title: 'Aromas Artesanales',
    description: 'Experimenta la sofisticación con nuestros aromas artesanales, donde la experiencia y la pasión se fusionan para dar vida a experiencias olfativas únicas.',
  },
];

// Brand Comparison Slider Component
function BrandComparisonSlider() {
  const [inset, setInset] = useState<number>(50);
  const [onMouseDown, setOnMouseDown] = useState<boolean>(false);

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onMouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let x = 0;

    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
    } else if ("clientX" in e) {
      x = e.clientX - rect.left;
    }

    const percentage = (x / rect.width) * 100;
    setInset(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div
      className="relative w-full h-full select-none"
      onMouseMove={onMouseMove}
      onMouseUp={() => setOnMouseDown(false)}
      onTouchMove={onMouseMove}
      onTouchEnd={() => setOnMouseDown(false)}
    >
      {/* Slider Handle */}
      <div
        className="bg-foreground/80 h-full w-1 absolute z-20 top-0 -ml-0.5 select-none"
        style={{
          left: inset + "%",
        }}
      >
        <button
          className="bg-foreground/90 rounded hover:scale-110 transition-all w-6 h-12 select-none -translate-y-1/2 absolute top-1/2 -ml-3 z-30 cursor-ew-resize flex justify-center items-center shadow-lg"
          onTouchStart={(e) => {
            setOnMouseDown(true);
            onMouseMove(e);
          }}
          onMouseDown={(e) => {
            setOnMouseDown(true);
            onMouseMove(e);
          }}
          onTouchEnd={() => setOnMouseDown(false)}
          onMouseUp={() => setOnMouseDown(false)}
          aria-label="Drag to compare"
        >
          <DotsSixVertical size={20} weight="bold" className="text-background" />
        </button>
      </div>

      {/* SAME Side (clips from right) */}
      <div
        className="absolute left-0 top-0 z-10 w-full h-full select-none"
        style={{
          clipPath: "inset(0 0 0 " + inset + "%)",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background p-3 sm:p-6 lg:p-12">
          <div className="w-full max-w-md space-y-2 sm:space-y-6">
            <div className="text-center flex flex-col items-center">
              <div className="w-32 sm:w-48 lg:w-64 mb-1 sm:mb-3">
                {/* Logo negro para modo claro */}
                <Image
                  src="/2.png"
                  alt="SAME."
                  width={256}
                  height={70}
                  className="w-full h-auto dark:hidden"
                  priority
                />
                {/* Logo blanco para modo oscuro */}
                <Image
                  src="/2B.png"
                  alt="SAME."
                  width={256}
                  height={70}
                  className="w-full h-auto hidden dark:block"
                  priority
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Fragancias de Lujo, Ahora Accesibles
              </p>
            </div>
            <div className="space-y-1.5 sm:space-y-3">
              {comparisons.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-card border border-border rounded-lg px-2 py-1.5 sm:px-4 sm:py-3 shadow-sm"
                >
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {item.feature}
                  </span>
                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10">
                    <Check size={16} weight="bold" className="text-primary sm:hidden" />
                    <Check size={20} weight="bold" className="text-primary hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-2 sm:pt-4">
              <Badge className="bg-primary text-primary-foreground">
                Calidad Premium
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* OTHERS Side (background) */}
      <div className="absolute left-0 top-0 w-full h-full select-none bg-muted/50">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-12">
          <div className="w-full max-w-md space-y-2 sm:space-y-6">
            <div className="text-center">
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-muted-foreground mb-1 sm:mb-2">
                OTHERS
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground/70">
                Marcas Convencionales
              </p>
            </div>
            <div className="space-y-1.5 sm:space-y-3">
              {comparisons.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-background/50 border border-border/50 rounded-lg px-2 py-1.5 sm:px-4 sm:py-3"
                >
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {item.feature}
                  </span>
                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-destructive/10">
                    <X size={16} weight="bold" className="text-destructive sm:hidden" />
                    <X size={20} weight="bold" className="text-destructive hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-2 sm:pt-4">
              <Badge variant="outline" className="bg-background/50 text-muted-foreground">
                Estándar
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BrandComparisonSection() {

  return (
    <section className="w-full py-10 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-2 mb-3"
        >
          <div className="flex justify-center">
            <Badge className="bg-card text-foreground border border-border">
              Comparison
            </Badge>
          </div>
          <div className="flex gap-1 flex-col text-center">
            <h2 className="text-3xl md:text-5xl tracking-tighter font-bold text-foreground">
              Fragancias de Lujo, Ahora Accesibles
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed tracking-tight text-muted-foreground text-justify">
              Descubre cómo SAME. redefine el lujo en fragancias, inspiradas en los perfumes más icónicos del mundo. Con la adición exclusiva de feromonas y a un precio accesible, SAME. te ofrece una experiencia única.
            </p>
          </div>
        </motion.div>

        {/* Image Comparison Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mb-4"
        >
          <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl border border-border aspect-4/5 md:aspect-video">
            <BrandComparisonSlider />
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="space-y-2">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl md:text-3xl font-bold text-foreground text-center"
          >
            Tu Firma Intangible
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + (index * 0.1),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon size={32} weight="light" className="text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
