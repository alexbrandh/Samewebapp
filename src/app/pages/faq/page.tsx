'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '@/components/ui/page-container';
import { CaretDown } from 'phosphor-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    name: 'Métodos de Pago',
    items: [
      {
        question: '¿Cómo puedo realizar el pago?',
        answer: 'Aceptamos pagos con tarjeta de crédito y débito (Visa, MasterCard, American Express), Nequi, Daviplata, PSE y transferencia bancaria. Todos los pagos se procesan de forma segura.',
      },
      {
        question: '¿Cómo puedo realizar mi compra?',
        answer: 'Selecciona el perfume que deseas, elige la cantidad y agrégalo al carrito. Luego ve al carrito, completa tus datos de envío y elige tu método de pago. ¡Es rápido y sencillo!',
      },
      {
        question: 'Hice una compra, ¿y ahora qué sigue?',
        answer: 'Recibirás un correo de confirmación con los detalles de tu pedido. Luego te enviaremos la guía de rastreo una vez que tu pedido sea despachado, para que puedas seguirlo en tiempo real.',
      },
      {
        question: '¿Por qué son tan económicas comparadas con las marcas de lujo?',
        answer: 'Porque eliminamos los altos costos de marketing y distribución, para ofrecer fragancias de alta calidad a un precio justo, sin comprometer la experiencia ni el lujo.',
      },
    ],
  },
  {
    name: 'Producto',
    items: [
      {
        question: '¿Cómo logran el 99% de igualdad?',
        answer: 'Utilizamos las mismas materias primas y procesos técnicos de elaboración que las grandes casas de perfumería. Nuestros perfumistas expertos analizan las composiciones originales para replicar la experiencia olfativa con la mayor fidelidad posible.',
      },
      {
        question: '¿Las fragancias tienen buena duración?',
        answer: 'Sí. Nuestras fragancias están formuladas con alta concentración de esencia, lo que garantiza una duración de 8 a 12 horas en su versión Classic y de 12 a 18 horas en la versión Extract.',
      },
      {
        question: '¿Sus perfumes huelen igual a los originales?',
        answer: 'Nuestras fragancias están inspiradas en los originales y logran una similitud del 99%. La diferencia puede ser mínima debido a los lotes de materias primas, pero la experiencia olfativa es prácticamente idéntica.',
      },
      {
        question: '¿Sus perfumes son EDT, EDP o Parfum?',
        answer: 'Nuestras fragancias Classic son Eau de Parfum (EDP) con una concentración de esencia entre 15% y 20%. La línea Extract tiene una concentración superior, similar a un Parfum.',
      },
      {
        question: '¿Por qué no puedo oler mi perfume después de un tiempo?',
        answer: 'Esto se llama "fatiga olfativa" y es completamente normal. Tu nariz se acostumbra al aroma que llevas puesto, pero las personas a tu alrededor sí lo perciben. No te preocupes, ¡tu perfume sigue ahí!',
      },
    ],
  },
  {
    name: 'Envíos',
    items: [
      {
        question: '¿Cuánto tarda el envío?',
        answer: 'Los envíos dentro de Colombia tardan de 3 a 5 días hábiles. Trabajamos con la empresa logística Coordinadora para garantizar que tu pedido llegue de forma segura y a tiempo.',
      },
      {
        question: '¿Hacen envíos a todo el país?',
        answer: 'Sí, realizamos envíos a todo el territorio colombiano a través de nuestra alianza con Coordinadora. Sin importar dónde estés, te llevamos tu fragancia.',
      },
      {
        question: '¿Cómo puedo rastrear mi pedido?',
        answer: 'Una vez despachado tu pedido, recibirás un correo con el número de guía. Puedes rastrearlo directamente en nuestra página o en el sitio web de Coordinadora.',
      },
      {
        question: '¿Cuánto cuesta el envío?',
        answer: 'El costo del envío varía según la ciudad de destino. Podrás ver el valor exacto al momento de completar tu compra antes de confirmar el pago.',
      },
    ],
  },
  {
    name: 'Devoluciones',
    items: [
      {
        question: '¿Puedo devolver un producto?',
        answer: 'Por razones de higiene, no aceptamos devoluciones de perfumes abiertos. Si recibes un producto defectuoso, dañado o incorrecto, contáctanos dentro de las 48 horas siguientes a la entrega.',
      },
      {
        question: '¿Qué hago si mi pedido llegó dañado?',
        answer: 'Contáctanos inmediatamente por WhatsApp o correo electrónico con fotos del producto y el empaque. Evaluaremos tu caso y te ofreceremos una solución lo antes posible.',
      },
      {
        question: '¿Cuál es la política de reembolso?',
        answer: 'Si tu producto aplica para devolución, procesaremos el reembolso en un plazo de 5 a 10 días hábiles al mismo método de pago utilizado en la compra.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(faqCategories[0].name);

  const currentCategory = faqCategories.find(cat => cat.name === selectedCategory) || faqCategories[0];

  const toggleQuestion = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Preguntas Frecuentes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/90"
          >
            Encuentra respuestas a las preguntas más comunes
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Category Sidebar */}
          <div className="md:w-56 shrink-0">
            <div className="flex md:flex-col gap-2">
              {faqCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setOpenIndex(null);
                  }}
                  className={`px-5 py-3 rounded-lg text-sm font-semibold transition-all text-left ${
                    selectedCategory === category.name
                      ? 'bg-[#555] text-white shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="flex-1 space-y-3">
            {currentCategory.items.map((faq, index) => {
              const key = `${selectedCategory}-${index}`;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-border rounded-lg overflow-hidden bg-card"
                >
                  <button
                    onClick={() => toggleQuestion(key)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
                  >
                    <span className="text-base font-semibold text-foreground pr-4">
                      {faq.question}
                    </span>
                    <CaretDown
                      size={18}
                      weight="bold"
                      className={`text-muted-foreground transition-transform shrink-0 ${
                        openIndex === key ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openIndex === key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1 text-muted-foreground leading-relaxed border-t border-border">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center bg-muted rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
            ¿Aún tienes preguntas?
          </h3>
          <p className="text-muted-foreground mb-6">
            ¿No encuentras la respuesta que buscas? Escríbenos directamente.
          </p>
          <a
            href="https://wa.me/573000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            Escríbenos por WhatsApp
          </a>
        </motion.div>
      </div>
    </PageContainer>
  );
}
