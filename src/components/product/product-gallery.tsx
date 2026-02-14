'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: Array<{ url: string; altText?: string }>;
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-4/5 rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No image available</p>
      </div>
    );
  }

  return (
    <div className="sticky top-20">
      {/* Main Image */}
      <div className="relative w-full aspect-4/5 rounded-lg overflow-hidden bg-gray-50 mb-4">
        <Image
          src={images[selectedImage]?.url}
          alt={images[selectedImage]?.altText || title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-full aspect-square rounded-md overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-black scale-95'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText || `${title} ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
