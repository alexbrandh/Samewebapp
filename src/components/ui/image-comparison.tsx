'use client';

import { useState } from "react";
import Image from "next/image";
import { DotsSixVertical } from "phosphor-react";
import { cn } from "@/lib/utils";

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
  aspectRatio?: string;
  beforeContent?: React.ReactNode;
  afterContent?: React.ReactNode;
}

function ImageComparison({
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  className,
  aspectRatio = "aspect-video",
  beforeContent,
  afterContent,
}: ImageComparisonProps) {
  const [inset, setInset] = useState<number>(50);
  const [onMouseDown, setOnMouseDown] = useState<boolean>(false);

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onMouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let x = 0;

    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
    } else if ("clientX" in e) {
      x = e.clientX - rect.left;
    }

    const percentage = (x / rect.width) * 100;
    setInset(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden rounded-2xl select-none",
        aspectRatio,
        className
      )}
      onMouseMove={onMouseMove}
      onMouseUp={() => setOnMouseDown(false)}
      onTouchMove={onMouseMove}
      onTouchEnd={() => setOnMouseDown(false)}
    >
      {/* Slider Handle */}
      <div
        className="bg-foreground/80 h-full w-1 absolute z-20 top-0 -ml-0.5 select-none"
        style={{
          left: inset + "%",
        }}
      >
        <button
          className="bg-foreground/90 rounded hover:scale-110 transition-all w-6 h-12 select-none -translate-y-1/2 absolute top-1/2 -ml-3 z-30 cursor-ew-resize flex justify-center items-center shadow-lg"
          onTouchStart={(e) => {
            setOnMouseDown(true);
            onMouseMove(e);
          }}
          onMouseDown={(e) => {
            setOnMouseDown(true);
            onMouseMove(e);
          }}
          onTouchEnd={() => setOnMouseDown(false)}
          onMouseUp={() => setOnMouseDown(false)}
          aria-label="Drag to compare"
        >
          <DotsSixVertical size={20} weight="bold" className="text-background" />
        </button>
      </div>

      {/* Before Image (clips from right) */}
      <div
        className="absolute left-0 top-0 z-10 w-full h-full select-none"
        style={{
          clipPath: "inset(0 0 0 " + inset + "%)",
        }}
      >
        <Image
          src={beforeImage}
          alt={beforeAlt}
          fill
          priority
          className="object-cover rounded-2xl select-none"
        />
        {beforeContent && (
          <div className="absolute inset-0 z-10">
            {beforeContent}
          </div>
        )}
      </div>

      {/* After Image (background) */}
      <div className="absolute left-0 top-0 w-full h-full select-none">
        <Image
          src={afterImage}
          alt={afterAlt}
          fill
          priority
          className="object-cover rounded-2xl select-none"
        />
        {afterContent && (
          <div className="absolute inset-0 z-10">
            {afterContent}
          </div>
        )}
      </div>
    </div>
  );
}

export { ImageComparison };
