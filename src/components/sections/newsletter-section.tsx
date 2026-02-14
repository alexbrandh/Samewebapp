'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Check } from 'phosphor-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setIsSubmitted(true);
      setEmail('');

      // Reset después de 3 segundos
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error subscribing:', error);
      // Optional: Show error state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-linear-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Título */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-4"
          >
            Recibe las novedades primero.
          </motion.h2>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground mb-8 font-light leading-relaxed"
          >
            Mantente al día con lanzamientos, ediciones limitadas y otras novedades esenciales.
          </motion.p>

          {/* Formulario de newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Ingresa tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-full border border-border focus:border-foreground focus:ring-0 text-center sm:text-left bg-background text-foreground"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="bg-foreground text-background hover:bg-foreground/90 px-6 py-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Suscribirse
                      <ArrowRight size={16} weight="light" className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400"
              >
                <Check size={24} weight="light" />
                <span className="text-lg font-medium">¡Gracias por suscribirte!</span>
              </motion.div>
            )}
          </motion.div>

          {/* Texto legal */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-sm text-muted-foreground mt-6 max-w-lg mx-auto"
          >
            Al suscribirte, aceptas recibir correos de marketing de SAME. Puedes cancelar tu suscripción en cualquier momento.
          </motion.p>
        </div>
      </div>
    </section>
  );
}