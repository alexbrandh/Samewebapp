'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCustomer } from '@/contexts/customer-context';
import { getFavorites, addToFavorites, removeFromFavorites } from '@/lib/shopify-customer';

export interface FavoriteProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  price: string;
  compareAtPrice?: string;
  image?: string;
  availableForSale: boolean;
  vendor?: string;
  tags: string[];
}

export function useFavorites() {
  const { accessToken, isAuthenticated } = useCustomer();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar favoritos
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated || !accessToken) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const products = await getFavorites(accessToken);
      setFavorites(products);
    } catch (err: any) {
      console.error('Error loading favorites:', err);
      setError(err.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, [accessToken, isAuthenticated]);

  // Cargar favoritos al montar y cuando cambie la autenticación
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Verificar si un producto está en favoritos
  const isFavorite = useCallback(
    (productId: string): boolean => {
      return favorites.some((fav) => fav.id === productId);
    },
    [favorites]
  );

  // Agregar a favoritos
  const addFavorite = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!isAuthenticated || !accessToken) {
        setError('You must be logged in to add favorites');
        return false;
      }

      setActionLoading(true);
      setError(null);

      try {
        const result = await addToFavorites(accessToken, productId);

        if (result.success) {
          // Recargar favoritos
          await loadFavorites();
          return true;
        } else {
          setError(result.error || 'Failed to add to favorites');
          return false;
        }
      } catch (err: any) {
        console.error('Error adding to favorites:', err);
        setError(err.message || 'Failed to add to favorites');
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [accessToken, isAuthenticated, loadFavorites]
  );

  // Remover de favoritos
  const removeFavorite = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!isAuthenticated || !accessToken) {
        setError('You must be logged in to remove favorites');
        return false;
      }

      setActionLoading(true);
      setError(null);

      try {
        const result = await removeFromFavorites(accessToken, productId);

        if (result.success) {
          // Recargar favoritos
          await loadFavorites();
          return true;
        } else {
          setError(result.error || 'Failed to remove from favorites');
          return false;
        }
      } catch (err: any) {
        console.error('Error removing from favorites:', err);
        setError(err.message || 'Failed to remove from favorites');
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [accessToken, isAuthenticated, loadFavorites]
  );

  // Toggle favorito (agregar o remover)
  const toggleFavorite = useCallback(
    async (productId: string): Promise<boolean> => {
      if (isFavorite(productId)) {
        return await removeFavorite(productId);
      } else {
        return await addFavorite(productId);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return {
    favorites,
    loading,
    actionLoading,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refetch: loadFavorites,
  };
}
