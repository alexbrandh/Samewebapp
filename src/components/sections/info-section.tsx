'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drop, Clock, Fire, Sparkle, ArrowRight } from 'phosphor-react';
import Link from 'next/link';

const concentrations = [
  {
    id: 'parfum',
    name: 'Eau de Parfum',
    shortName: 'EDP',
    concentration: '15-20%',
    duration: '8 – 12 h',
    intensity: 'Alta',
    description: 'Nuestra concentracion clasica. Ideal para quienes buscan una fragancia elegante con gran presencia y duracion notable a lo largo del dia.',
    drops: 3,
    color: 'from-foreground/5 to-foreground/10',
    borderColor: 'border-foreground/20',
    badge: 'Clasico',
  },
  {
    id: 'elixir',
    name: 'Elixir',
    shortName: 'ELX',
    concentration: '25-35%',
    duration: '12 – 18 h',
    intensity: 'Maxima',
    description: 'Nuestra formula mas concentrada. Para quienes quieren dejar huella. Una sola aplicacion basta para un aroma que perdura desde la manana hasta la noche.',
    drops: 5,
    color: 'from-foreground/10 to-foreground/20',
    borderColor: 'border-foreground/30',
    badge: 'Premium',
  },
];

export function InfoSection() {
  const [activeTab, setActiveTab] = useState<'parfum' | 'elixir'>('parfum');
  const active = concentrations.find((c) => c.id === activeTab)!;

  return (
    <section className="py-14 lg:py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-2">
            <div className="border border-border bg-card py-1 px-4 rounded-lg text-sm font-medium text-foreground">
              Dos concentraciones
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
            Personaliza tu aroma
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            Cada fragancia SAME. esta disponible en dos niveles de intensidad. Elige la que se adapte a tu estilo.
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-muted/50 rounded-full p-1 border border-border">
            {concentrations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id as 'parfum' | 'elixir')}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === c.id
                    ? 'bg-foreground text-background shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Concentration Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={`relative rounded-2xl border ${active.borderColor} bg-linear-to-br ${active.color} p-6 sm:p-10 overflow-hidden`}>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.03]">
                <Drop size={192} weight="fill" />
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Info */}
                <div className="space-y-6">
                  <div>
                    <div className="inline-block bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full mb-3">
                      {active.badge}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                      {active.name}
                    </h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {active.description}
                    </p>
                  </div>

                  {/* Concentration Visual (drops) */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Drop
                        key={i}
                        size={20}
                        weight={i < active.drops ? 'fill' : 'light'}
                        className={i < active.drops ? 'text-foreground' : 'text-muted-foreground/30'}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {active.concentration} esencia
                    </span>
                  </div>
                </div>

                {/* Right: Stats */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-background/60 border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                      <Clock size={20} weight="light" className="text-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Duracion</p>
                      <p className="text-xl font-bold text-foreground mt-0.5">{active.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-background/60 border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                      <Fire size={20} weight="light" className="text-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Intensidad</p>
                      <p className="text-xl font-bold text-foreground mt-0.5">{active.intensity}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-background/60 border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                      <Sparkle size={20} weight="light" className="text-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Concentracion</p>
                      <p className="text-xl font-bold text-foreground mt-0.5">{active.concentration}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/collections/all"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-semibold hover:bg-foreground/90 transition-colors duration-300"
          >
            Explorar fragancias
            <ArrowRight size={16} weight="light" />
          </Link>
        </div>
      </div>
    </section>
  );
}
