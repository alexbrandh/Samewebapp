"use client";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "El mejor perfume que he tenido. Dura todo el día y recibo cumplidos donde quiera que voy. SAME. ha cambiado completamente mi experiencia con las fragancias.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    name: "Sofia Martinez",
    role: "Bloguera de Moda",
  },
  {
    text: "Al principio era escéptica, pero este perfume realmente cumple con las expectativas. El aroma es sofisticado y duradero. ¡Vale cada peso!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    name: "Marcus Chen",
    role: "Director Creativo",
  },
  {
    text: "La presentación es elegante, el envío fue rápido y el aroma es sofisticado. SAME. se ha convertido en mi opción preferida para fragancias de calidad.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    name: "Isabella Romano",
    role: "Diseñadora de Interiores",
  },
  {
    text: "Como aficionado a Creed Aventus, encontrar la versión de SAME. fue un juego cambiador. Mismo lujo, proyección increíble y amigable con mi billetera.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    name: "David Anderson",
    role: "Emprendedor",
  },
  {
    text: "La colección inspirada en Chanel es fenomenal. Ahora tengo tres botellas. Los aromas duran todo el día y la calidad es inigualable.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    name: "Emma Thompson",
    role: "Ejecutiva de Marketing",
  },
  {
    text: "SAME. transformó mi colección de fragancias. Sus alternativas a YSL y Dior son exactas, y el servicio al cliente es excepcional. ¡Muy recomendado!",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    name: "James Wilson",
    role: "Agente Inmobiliario",
  },
  {
    text: "La prueba me ayudó a descubrir mi aroma perfecto. La fragancia inspirada en Le Labo es exactamente lo que estaba buscando. ¡Estoy completamente enamorado!",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
    name: "Olivia Parker",
    role: "Influencer de Estilo de Vida",
  },
  {
    text: "Calidad excepcional y atención al detalle. Cada fragancia se siente premium y lujosa. SAME. cumple su promesa de lujo accesible.",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop",
    name: "Ryan Foster",
    role: "Fotógrafo",
  },
  {
    text: "¡Regalé perfumes SAME. a mis damas de honor y todas quedaron encantadas! Botellas hermosas, aromas increíbles y perfectos para ocasiones especiales.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    name: "Ava Rodriguez",
    role: "Organizadora de Eventos",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsSection() {
  return (
    <section className="bg-background py-10 lg:py-16 relative overflow-hidden">
      <div className="container z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border border-border bg-card py-1 px-4 rounded-lg text-sm font-medium text-foreground">
              Testimonios
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mt-2 text-foreground text-center">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-center mt-2 text-muted-foreground">
            Descubre por qué miles confían en SAME. para sus fragancias.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-3 mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
}
