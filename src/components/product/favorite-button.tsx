'use client';

import { useState } from 'react';
import { Heart } from 'phosphor-react';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useCustomer } from '@/contexts/customer-context';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: number;
  variant?: 'default' | 'minimal';
}

export function FavoriteButton({ 
  productId, 
  className,
  size = 20,
  variant = 'default'
}: FavoriteButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useCustomer();
  const { isFavorite, toggleFavorite, actionLoading } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isFav = isFavorite(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      router.push('/account/login');
      return;
    }

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Toggle favorite
    await toggleFavorite(productId);
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleClick}
        disabled={actionLoading}
        className={cn(
          "p-2 rounded-full transition-all",
          isFav 
            ? "text-primary" 
            : "text-muted-foreground hover:text-foreground",
          actionLoading && "opacity-50 cursor-not-allowed",
          isAnimating && "scale-125",
          className
        )}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart 
          size={size} 
          weight={isFav ? 'fill' : 'regular'}
          className="transition-all"
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={actionLoading}
      className={cn(
        "p-2 bg-background/80 backdrop-blur-sm rounded-lg transition-all",
        "hover:bg-background",
        isFav 
          ? "text-primary" 
          : "text-foreground",
        actionLoading && "opacity-50 cursor-not-allowed",
        isAnimating && "scale-110",
        className
      )}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        size={size} 
        weight={isFav ? 'fill' : 'regular'}
        className="transition-all"
      />
    </button>
  );
}
