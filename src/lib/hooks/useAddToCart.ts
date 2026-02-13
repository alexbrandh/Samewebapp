import { useState } from 'react';
import { useCart } from './useShopify';

/**
 * Hook reutilizable para manejar la lógica de agregar productos al carrito
 * Maneja estados de loading, errores y modo demo
 */
export function useAddToCart() {
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = async (
    merchandiseId: string,
    quantity: number = 1,
    isUsingMockData: boolean = false
  ) => {
    setAddingToCart(merchandiseId);
    try {
      await addToCart(merchandiseId, quantity);
      return { success: true };
    } catch (error) {
      // Si estamos usando datos mock o el ID no parece de Shopify, simular
      const looksLikeShopifyId = merchandiseId.startsWith('gid://');
      if (isUsingMockData || !looksLikeShopifyId) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true };
      } else {
        console.error('Error adding to cart:', error);
        return { success: false, error };
      }
    } finally {
      setAddingToCart(null);
    }
  };

  return {
    addingToCart,
    handleAddToCart,
    isAdding: (id: string) => addingToCart === id,
  };
}
