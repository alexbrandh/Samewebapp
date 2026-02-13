'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { InstagramLogo } from 'phosphor-react';

const footerLinks = {
  shop: [
    { name: 'All Perfumes', href: '/collections/all' },
    { name: 'Women', href: '/collections/women' },
    { name: 'Men', href: '/collections/men' },
    { name: 'Unisex', href: '/collections/unisex' },
    { name: 'Best Sellers', href: '/collections/bestsellers' },
  ],
  about: [
    { name: 'About Us', href: '/about' },
    { name: 'Refer a Friend', href: '/pages/refer-a-friend' },
  ],
  help: [
    { name: 'Contact Us', href: '/pages/contact' },
    { name: 'FAQ', href: '/pages/faq' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/same.perfumes/', icon: InstagramLogo },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand and social */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <Link href="/" className="inline-block mb-6">
                <img
                  src="/2.png"
                  alt="SAME."
                  className="h-8 w-auto dark:hidden"
                />
                <img
                  src="/2B.png"
                  alt="SAME."
                  className="h-8 w-auto hidden dark:block"
                />
              </Link>

              {/* Description */}
              <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                Luxury fragrances that feel high-end without the exclusive price.
                Same doesn't shout who you are. It accompanies you while you show it.
              </p>

              {/* Social links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300"
                      aria-label={social.name}
                    >
                      <Icon size={16} weight="bold" />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Shop links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-medium text-foreground mb-4" style={{ fontFamily: 'var(--font-sans)' }}>Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* About links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-medium text-foreground mb-4" style={{ fontFamily: 'var(--font-sans)' }}>About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-medium text-foreground mb-4" style={{ fontFamily: 'var(--font-sans)' }}>Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          {/* Copyright */}
          <p className="text-muted-foreground text-sm">
            © 2026 SAME. All rights reserved.
          </p>

          {/* Legal links */}
          <div className="flex space-x-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}