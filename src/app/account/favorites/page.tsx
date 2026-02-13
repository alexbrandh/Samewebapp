'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash } from 'phosphor-react';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useCurrency } from '@/contexts/currency-context';

export default function FavoritesPage() {
  const { favorites, loading, actionLoading, removeFavorite } = useFavorites();
  const { formatPrice } = useCurrency();

  const handleRemove = async (productId: string) => {
    await removeFavorite(productId);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            Loading your favorite products...
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Heart size={64} className="text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">No Favorites Yet</h2>
        <p className="text-muted-foreground mb-6">
          Save your favorite products here for quick access later!
        </p>
        <Link
          href="/collections/all"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">My Favorites</h2>
        <p className="text-muted-foreground">
          {favorites.length} product{favorites.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden group">
            {/* Image */}
            <div className="relative aspect-square bg-muted">
              <Link href={`/products/${product.handle}`} className="block w-full h-full">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart size={48} className="text-muted-foreground" />
                  </div>
                )}
              </Link>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(product.id)}
                disabled={actionLoading}
                className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors disabled:opacity-50"
                aria-label="Remove from favorites"
              >
                <Trash size={20} className="text-destructive" />
              </button>
            </div>

            {/* Info */}
            <div className="p-4">
              <Link href={`/products/${product.handle}`}>
                <h3 className="font-semibold text-foreground hover:text-primary transition-colors mb-2">
                  {product.title}
                </h3>
              </Link>
              <p className="text-lg font-bold text-foreground">
                {formatPrice(product.price)}
              </p>

              {/* View Product Button */}
              <Link href={`/products/${product.handle}`}>
                <button className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  View Product
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-2">💡 About Favorites</h3>
        <p className="text-sm text-muted-foreground">
          Your favorite products are saved to your account and will be available across all your devices.
          Click the heart icon on any product to add it to your favorites.
        </p>
      </div>
    </div>
  );
}
