'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/3d-testimonails';

const testimonials = [
  {
    name: 'Sofia Martinez',
    username: '@sofi_m',
    body: 'El mejor perfume que he tenido. Dura todo el dia y recibo cumplidos donde quiera que voy.',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    city: 'Bogota',
  },
  {
    name: 'Carlos Ramirez',
    username: '@carlos_r',
    body: 'La calidad es impresionante. No puedo creer que sea tan accesible para lo premium que huele.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    city: 'Medellin',
  },
  {
    name: 'Isabella Torres',
    username: '@isa_torres',
    body: 'La presentacion es elegante y el aroma es sofisticado. SAME. se ha convertido en mi favorita.',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    city: 'Cali',
  },
  {
    name: 'Andres Gutierrez',
    username: '@andres_g',
    body: 'Increible duracion y proyeccion. Mis amigos siempre me preguntan que perfume uso.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    city: 'Barranquilla',
  },
  {
    name: 'Valentina Rojas',
    username: '@vale_rojas',
    body: 'Regale tres perfumes SAME. en Navidad y todos quedaron encantados. La mejor decision.',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    city: 'Cartagena',
  },
  {
    name: 'Miguel Lopez',
    username: '@migue_lop',
    body: 'El Elixir es otro nivel. 18 horas de duracion no es exageracion, es realidad.',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    city: 'Pereira',
  },
  {
    name: 'Camila Herrera',
    username: '@cami_h',
    body: 'Me encanta que sean veganos y cruelty-free. Calidad sin comprometer mis valores.',
    img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
    city: 'Bucaramanga',
  },
  {
    name: 'Daniel Moreno',
    username: '@dani_mor',
    body: 'Las feromonas marcan la diferencia. Es como tener un arma secreta de confianza.',
    img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop',
    city: 'Manizales',
  },
  {
    name: 'Laura Castillo',
    username: '@lau_cast',
    body: 'El quiz me ayudo a encontrar mi aroma perfecto. Servicio al cliente excepcional.',
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    city: 'Santa Marta',
  },
];

function TestimonialCard({ img, name, username, body, city }: (typeof testimonials)[number]) {
  return (
    <Card className="w-50 border border-border bg-card shadow-sm">
      <CardContent>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-foreground flex items-center gap-1">
              {name} <span className="text-xs text-muted-foreground">{city}</span>
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-secondary-foreground">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export function Testimonials3DSection() {
  return (
    <section className="w-full py-10 lg:py-16 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-1">
            <div className="border border-border bg-card py-1 px-4 rounded-lg text-sm font-medium text-foreground">
              Testimonios
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-center mt-4 text-muted-foreground max-w-2xl mx-auto">
            Miles de personas ya confian en SAME. para sus fragancias del dia a dia.
          </p>
        </div>

        <div className="relative flex h-96 w-full flex-row items-center justify-center overflow-hidden gap-1.5 perspective-near rounded-lg">
          <div
            className="flex flex-row items-center gap-4"
            style={{
              transform:
                'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
            }}
          >
            <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
              {testimonials.map((review) => (
                <TestimonialCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
              {testimonials.map((review) => (
                <TestimonialCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
              {testimonials.map((review) => (
                <TestimonialCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
              {testimonials.map((review) => (
                <TestimonialCard key={review.username} {...review} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-linear-to-b from-background"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
