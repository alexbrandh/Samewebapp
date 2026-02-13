'use client';

import { WhatsappLogo } from 'phosphor-react';
import { motion } from 'framer-motion';

export function WhatsAppButton() {
  const phoneNumber = '971585621027'; // +971 58 562 1027 sin espacios ni +
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[130px] left-4 lg:bottom-6 lg:left-6 z-40 flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Contact us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <WhatsappLogo size={22} weight="fill" className="lg:w-8 lg:h-8" />

      {/* Tooltip - Solo visible en desktop */}
      <span className="hidden lg:block absolute left-full ml-3 px-3 py-2 bg-foreground text-background text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Chat with us
      </span>

      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping" />
    </motion.a>
  );
}
