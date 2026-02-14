'use client';

import { motion } from 'framer-motion';
import { Heart, Drop, Star } from 'phosphor-react';

const pillars = [
  {
    icon: Heart,
    title: 'Formulación Consciente',
    description: 'Fragancias veganas y cruelty-free, desarrolladas bajo estándares responsables.',
  },
  {
    icon: Drop,
    title: 'Química Limpia',
    description: 'Fórmulas libres de parabenos y ftalatos, pensadas para ofrecer pureza, seguridad y alto desempeño.',
  },
  {
    icon: Star,
    title: 'Precisión Olfativa',
    description: 'Aromas creados con materias primas de alta calidad y procesos técnicos que garantizan equilibrio y duración.',
  },
];

export function SignatureSection() {
  return (
    <section className="py-16 lg:py-24 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2
            className="text-3xl md:text-4xl font-bold italic mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            SAME. Tu firma invisible.
          </h2>
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-4 px-4"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon size={30} weight="light" className="text-white" />
                </div>
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
