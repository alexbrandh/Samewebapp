"use client";

import { Ref, forwardRef, useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { motion, useMotionValue } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const PhotoGallery = ({
  animationDelay = 0.5,
  title = "SAME.",
  subtitle = "Exclusive fragrances crafted for the discerning individual",
  buttonText = "View All Products",
  onButtonClick,
  photos,
}: {
  animationDelay?: number;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  photos?: Array<{
    id: number;
    order: number;
    x: string;
    y: string;
    zIndex: number;
    direction: "left" | "right";
    src: string;
  }>;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 1000);

    const animationTimer = setTimeout(
      () => {
        setIsLoaded(true);
      },
      (animationDelay + 0.4) * 1000
    );

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const photoVariants = {
    hidden: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    },
    visible: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 70,
        damping: 12,
        mass: 1,
      },
    },
  };

  const defaultPhotos = [
    {
      id: 1,
      order: 0,
      x: "-320px",
      y: "15px",
      zIndex: 15,
      direction: "left" as const,
      src: "/IDKO 1-100/8.png",
    },
    {
      id: 2,
      order: 1,
      x: "-160px",
      y: "32px",
      zIndex: 14,
      direction: "left" as const,
      src: "/IDKO 1-100/18.png",
    },
    {
      id: 3,
      order: 2,
      x: "0px",
      y: "8px",
      zIndex: 13,
      direction: "right" as const,
      src: "/IDKO 1-100/29.png",
    },
    {
      id: 4,
      order: 3,
      x: "160px",
      y: "22px",
      zIndex: 12,
      direction: "right" as const,
      src: "/IDKO 1-100/41.png",
    },
    {
      id: 5,
      order: 4,
      x: "320px",
      y: "44px",
      zIndex: 11,
      direction: "left" as const,
      src: "/IDKO 1-100/52.png",
    },
  ];

  const photosToUse = photos || defaultPhotos;

  return (
    <div className="mt-0 relative">
      <div className="absolute inset-0 max-md:hidden top-[200px] -z-10 h-[300px] w-full opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '3rem 3rem',
          mask: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 110%)'
        }}></div>
      </div>
      <p className="lg:text-md my-1 text-center text-xs font-light uppercase tracking-widest text-muted-foreground">
        {subtitle}
      </p>
      <h3 className="z-20 mx-auto max-w-2xl justify-center bg-linear-to-r from-foreground via-foreground/80 to-foreground bg-clip-text py-1 text-center text-4xl text-transparent md:text-7xl">
        {title}
      </h3>
      <div className="relative mb-8 h-[350px] w-full items-center justify-center lg:flex">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative h-[220px] w-[220px]">
              {[...photosToUse].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ 
                    x: photo.x, 
                    y: photo.y, 
                    opacity: isLoaded ? 1 : 0,
                    transition: {
                      type: "spring" as const,
                      stiffness: 70,
                      damping: 12,
                      mass: 1,
                      delay: photo.order * 0.15,
                    }
                  }}
                >
                  <Photo
                    width={220}
                    height={220}
                    src={photo.src}
                    alt="Perfume"
                    direction={photo.direction}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div className="flex w-full justify-center">
        <Button onClick={onButtonClick} className="rounded-full px-8 py-6 text-base font-semibold">
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

function getRandomNumberInRange(min: number, max: number): number {
  if (min >= max) {
    throw new Error("Min value should be less than max value");
  }
  return Math.random() * (max - min) + min;
}

const MotionImage = motion(
  forwardRef(function MotionImage(
    props: ImageProps,
    ref: Ref<HTMLImageElement>
  ) {
    return <Image ref={ref} {...props} />;
  })
);

type Direction = "left" | "right";

export const Photo = ({
  src,
  alt,
  className,
  direction,
  width,
  height,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  useEffect(() => {
    const randomRotation =
      getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1);
    setRotation(randomRotation);
  }, [direction]);

  function handleMouse(event: {
    currentTarget: { getBoundingClientRect: () => any };
    clientX: number;
    clientY: number;
  }) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 30 }}
      whileHover={{
        scale: 1.1,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 30,
      }}
      whileDrag={{
        scale: 1.1,
        zIndex: 30,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        transform: `rotate(0deg) rotateX(0deg) rotateY(0deg)`,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(
        className,
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing"
      )}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-sm">
        <MotionImage
          className={cn("rounded-3xl object-cover")}
          fill
          src={src}
          alt={alt}
          {...props}
          draggable={false}
        />
      </div>
    </motion.div>
  );
};
