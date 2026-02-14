import type { Metadata } from 'next';
import { FAQJsonLd } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sameperfumes.com';

const allFaqItems = [
  { question: '¿Cómo puedo realizar el pago?', answer: 'Aceptamos pagos con tarjeta de crédito y débito (Visa, MasterCard, American Express), Nequi, Daviplata, PSE y transferencia bancaria. Todos los pagos se procesan de forma segura.' },
  { question: '¿Las fragancias tienen buena duración?', answer: 'Sí. Nuestras fragancias están formuladas con alta concentración de esencia, lo que garantiza una duración de 8 a 12 horas en su versión Classic y de 12 a 18 horas en la versión Extract.' },
  { question: '¿Sus perfumes huelen igual a los originales?', answer: 'Nuestras fragancias están inspiradas en los originales y logran una similitud del 99%. La diferencia puede ser mínima debido a los lotes de materias primas, pero la experiencia olfativa es prácticamente idéntica.' },
  { question: '¿Cuánto tarda el envío?', answer: 'Los envíos dentro de Colombia tardan de 3 a 5 días hábiles. Trabajamos con la empresa logística Coordinadora para garantizar que tu pedido llegue de forma segura y a tiempo.' },
  { question: '¿Hacen envíos a todo el país?', answer: 'Sí, realizamos envíos a todo el territorio colombiano a través de nuestra alianza con Coordinadora.' },
  { question: '¿Puedo devolver un producto?', answer: 'Por razones de higiene, no aceptamos devoluciones de perfumes abiertos. Si recibes un producto defectuoso, dañado o incorrecto, contáctanos dentro de las 48 horas siguientes a la entrega.' },
  { question: '¿Por qué son tan económicas comparadas con las marcas de lujo?', answer: 'Porque eliminamos los altos costos de marketing y distribución, para ofrecer fragancias de alta calidad a un precio justo, sin comprometer la experiencia ni el lujo.' },
  { question: '¿Sus perfumes son EDT, EDP o Parfum?', answer: 'Nuestras fragancias Classic son Eau de Parfum (EDP) con una concentración de esencia entre 15% y 20%. La línea Extract tiene una concentración superior, similar a un Parfum.' },
];

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes — FAQ',
  description: 'Resuelve tus dudas sobre SAME. perfumes: métodos de pago (Nequi, Daviplata, PSE), tiempos de envío en Colombia, duración de las fragancias, devoluciones y más.',
  alternates: {
    canonical: `${SITE_URL}/pages/faq`,
  },
  openGraph: {
    title: 'Preguntas Frecuentes | SAME. Perfumes',
    description: 'Resuelve tus dudas sobre pagos, envíos, devoluciones y calidad de nuestros perfumes.',
    url: `${SITE_URL}/pages/faq`,
    type: 'website',
    locale: 'es_CO',
    siteName: 'SAME.',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQJsonLd items={allFaqItems} />
      {children}
    </>
  );
}
