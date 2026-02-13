import { useState, useEffect } from 'react';
import { getCollections } from '@/lib/shopify';

interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: {
    url: string;
  };
}

/**
 * Hook reutilizable para obtener colecciones de Shopify
 * Maneja loading, error y caching básico
 */
export function useCollectionsData() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      // Si ya tenemos colecciones, no volver a buscar
      if (collections.length > 0) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getCollections();
        const collectionsArray = data?.edges?.map((edge: any) => edge.node) || [];
        setCollections(collectionsArray);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error fetching collections'));
        console.error('Error fetching collections:', err);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return { collections, loading, error };
}
