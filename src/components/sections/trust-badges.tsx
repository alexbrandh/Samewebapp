'use client';

import { motion } from 'framer-motion';
import { Package, WhatsappLogo, ShieldCheck } from 'phosphor-react';
import Link from 'next/link';

const badges = [
  {
    icon: Package,
    title: 'Envíos a Todo el País',
    description: 'Trabajamos con la empresa logística Coordinadora para llevarte tu fragancia a cualquier rincón de Colombia.',
  },
  {
    icon: WhatsappLogo,
    title: 'Atención al Cliente',
    description: 'Estamos para ayudarte. Escríbenos directamente por WhatsApp.',
    href: 'https://wa.me/573000000000',
  },
  {
    icon: ShieldCheck,
    title: 'Pago Seguro',
    description: 'Tus datos de pago se procesan de forma segura y encriptada.',
  },
];

export function TrustBadges() {
  return (
    <section className="py-12 lg:py-16 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            const content = (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon size={28} weight="light" className="text-white" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-widest">
                  {badge.title}
                </h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  {badge.description}
                </p>
              </motion.div>
            );

            if (badge.href) {
              return (
                <Link
                  key={badge.title}
                  href={badge.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  {content}
                </Link>
              );
            }

            return content;
          })}
        </div>
      </div>
    </section>
  );
}
