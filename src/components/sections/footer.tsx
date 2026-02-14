'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Envelope, Phone, MapPin, FacebookLogo, InstagramLogo, TiktokLogo } from 'phosphor-react';
import { FooterBackgroundGradient, TextHoverEffect } from '@/components/ui/hover-footer';

const comprarLinks = [
  { label: 'Perfumes', href: '/collections/all' },
  { label: 'Más Vendidos', href: '/collections/bestsellers' },
  { label: 'Crea tu Aroma', href: '/pages/crea-tu-aroma' },
  { label: 'Descúbrete', href: '/pages/quiz' },
  { label: 'Nosotros', href: '/about' },
];

const ayudaLinks = [
  { label: 'Contacto', href: '/pages/contact' },
  { label: 'Preguntas frecuentes', href: '/pages/faq' },
  { label: 'Rastrea tu Pedido', href: '/pages/track-order' },
  { label: 'Políticas de envío', href: '/pages/shipping-policy' },
  { label: 'Política de reembolso', href: '/pages/refund-policy' },
  { label: 'Política de privacidad', href: '/pages/privacy-policy' },
  { label: 'Términos y condiciones', href: '/pages/terms' },
];

const contactInfo = [
  {
    icon: <Envelope size={18} weight="light" className="text-[#ede8d0]" />,
    text: 'contact@sameperfumes.com',
    href: 'mailto:contact@sameperfumes.com',
  },
  {
    icon: <Phone size={18} weight="light" className="text-[#ede8d0]" />,
    text: '+57 300 000 0000',
    href: 'tel:+573000000000',
  },
  {
    icon: <MapPin size={18} weight="light" className="text-[#ede8d0]" />,
    text: 'Colombia',
  },
];

const socialLinks = [
  { icon: FacebookLogo, label: 'Facebook', href: 'https://www.facebook.com/same.perfumes' },
  { icon: InstagramLogo, label: 'Instagram', href: 'https://www.instagram.com/same.perfumes/' },
  { icon: TiktokLogo, label: 'TikTok', href: 'https://www.tiktok.com/@same.perfumes' },
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] relative h-fit rounded-3xl overflow-hidden m-4 md:m-8 text-white">
      <div className="max-w-7xl mx-auto p-8 md:p-14 z-50 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center">
              <Image src="/2B.png" alt="SAME." width={120} height={32} className="h-8 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Fragancias de lujo que se sienten premium sin el precio exclusivo.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed italic">
              Los nombres e imágenes de los perfumes se emplean únicamente como referencia. SAME. reconoce los derechos de propiedad de los titulares mencionados.
            </p>
          </div>

          {/* Comprar */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              Comprar
            </h4>
            <ul className="space-y-3">
              {comprarLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#ede8d0] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              Ayuda
            </h4>
            <ul className="space-y-3">
              {ayudaLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#ede8d0] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              Contacto
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-[#ede8d0] transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-gray-400">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-gray-700 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          {/* Social icons */}
          <div className="flex space-x-6 text-gray-400">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:text-[#ede8d0] transition-colors"
              >
                <Icon size={20} weight="light" />
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} SAME. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Text hover effect */}
      <div className="lg:flex hidden h-120 -mt-52 -mb-36 relative z-40">
        <TextHoverEffect text="SAME." />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default Footer;