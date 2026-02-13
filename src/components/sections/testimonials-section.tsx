"use client";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "SAME.'s Tom Ford-inspired fragrance is absolutely divine! The longevity is incredible, and I constantly receive compliments. Best perfume investment I've made.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    name: "Sofia Martinez",
    role: "Fashion Blogger",
  },
  {
    text: "I was skeptical at first, but the Maison Margiela dupe exceeded all expectations. It smells identical to the original at a fraction of the price!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    name: "Marcus Chen",
    role: "Creative Director",
  },
  {
    text: "The packaging is elegant, shipping was fast, and the scent is sophisticated. SAME. has become my go-to for quality fragrances.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    name: "Isabella Romano",
    role: "Interior Designer",
  },
  {
    text: "As someone who loves Creed Aventus, finding SAME.'s version was a game-changer. Same luxury feel, amazing projection, and wallet-friendly.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    name: "David Anderson",
    role: "Entrepreneur",
  },
  {
    text: "The Chanel-inspired collection is phenomenal! I own three bottles now. The scents last all day and the quality is unmatched.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    name: "Emma Thompson",
    role: "Marketing Executive",
  },
  {
    text: "SAME. transformed my fragrance collection. Their YSL and Dior alternatives are spot-on, and customer service is exceptional. Highly recommend!",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    name: "James Wilson",
    role: "Real Estate Agent",
  },
  {
    text: "The quiz helped me discover my perfect scent! The Le Labo inspired fragrance is exactly what I was looking for. Absolutely in love!",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
    name: "Olivia Parker",
    role: "Lifestyle Influencer",
  },
  {
    text: "Outstanding quality and attention to detail. Each fragrance feels premium and luxurious. SAME. delivers on their promise of accessible luxury.",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop",
    name: "Ryan Foster",
    role: "Photographer",
  },
  {
    text: "I gifted SAME. perfumes to my bridesmaids and they were all obsessed! Beautiful bottles, amazing scents, and perfect for special occasions.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    name: "Ava Rodriguez",
    role: "Event Planner",
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
              Testimonials
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mt-2 text-foreground text-center">
            What our customers say
          </h2>
          <p className="text-center mt-2 text-muted-foreground">
            Discover why thousands trust SAME. for their signature scents.
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
