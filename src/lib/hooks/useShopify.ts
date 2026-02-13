'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getProducts,
  getProduct,
  getProductsByTag,
  getCollections,
  getCollectionProducts,
  createCart,
  addToCart,
  getCart,
  updateCartLines,
  removeFromCart,
} from '../shopify';
import type { ShopifyProduct, ShopifyCart, ShopifyCollection, CartLineInput } from '../types/shopify';

// Hook para obtener productos
export function useProducts(first: number = 20) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  const fetchProducts = useCallback(async (after?: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getProducts(first, after);

      if (result) {
        const productNodes = result.edges.map((edge: any) => edge.node);

        if (after) {
          // Si es paginación, agregar a los productos existentes
          setProducts(prev => [...prev, ...productNodes]);
        } else {
          // Si es carga inicial, reemplazar productos
          setProducts(productNodes);
        }

        setHasNextPage(result.pageInfo.hasNextPage);
        setEndCursor(result.pageInfo.endCursor || null);
      }
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Error fetching products');
    } finally {
      setLoading(false);
    }
  }, [first]);

  const loadMore = useCallback(() => {
    if (hasNextPage && endCursor && !loading) {
      fetchProducts(endCursor);
    }
  }, [hasNextPage, endCursor, loading, fetchProducts]);

  const refresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    hasNextPage,
    loadMore,
    refresh,
  };
}

// Hook para obtener un producto específico
export function useProduct(handle: string) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getProduct(handle);
        setProduct(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  return { product, loading, error };
}

// Hook para obtener productos por categoría
export function useProductsByTag(tag: string, first: number = 20) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tag) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getProductsByTag(tag, first);

        if (result) {
          const productNodes = result.edges.map((edge: any) => edge.node);
          setProducts(productNodes);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching products by tag');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [tag, first]);

  return { products, loading, error };
}

// Hook para el carrito
export function useCart() {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to fix checkout URL domain if needed
  const fixCheckoutUrl = (cart: ShopifyCart | null) => {
    if (!cart?.checkoutUrl) return cart;

    // 1. Domain Fix
    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    if (shopifyDomain && !cart.checkoutUrl.includes(shopifyDomain)) {
      try {
        const url = new URL(cart.checkoutUrl);
        cart.checkoutUrl = cart.checkoutUrl.replace(url.host, shopifyDomain);
      } catch (e) {
        console.error('Error fixing checkout URL:', e);
      }
    }

    // 2. Discount Code Injection (from Referral)
    if (typeof window !== 'undefined') {
      try {
        const cookies = document.cookie.split(';');
        const discountCookie = cookies.find(c => c.trim().startsWith('discount_code='));
        if (discountCookie) {
          const code = discountCookie.split('=')[1];
          if (code && !cart.checkoutUrl.includes('discount=')) {
            const separator = cart.checkoutUrl.includes('?') ? '&' : '?';
            cart.checkoutUrl = `${cart.checkoutUrl}${separator}discount=${code}`;
          }
        }
      } catch (e) {
        console.error('Error appending discount code:', e);
      }
    }

    return cart;
  };

  const fetchCart = useCallback(async (cartId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getCart(cartId);
      setCart(fixCheckoutUrl(result));

      if (result) {
        localStorage.setItem('shopify-cart-id', result.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching cart');
      // Si hay error, limpiar el carrito del localStorage
      localStorage.removeItem('shopify-cart-id');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCartId = localStorage.getItem('shopify-cart-id');
    if (savedCartId) {
      fetchCart(savedCartId);
    }
  }, [fetchCart]);

  // Escuchar eventos de actualización del carrito desde otros componentes
  useEffect(() => {
    const handleCartUpdate = (event: any) => {
      const updatedCart = event.detail?.cart;
      if (updatedCart) {
        setCart(fixCheckoutUrl(updatedCart));
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const createNewCart = async (lines: CartLineInput[] = []) => {
    try {
      setLoading(true);
      setError(null);

      const result = await createCart(lines);
      setCart(fixCheckoutUrl(result));

      if (result) {
        localStorage.setItem('shopify-cart-id', result.id);
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (linesOrId: string | CartLineInput[], quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      let currentCart = cart;

      // Si no hay carrito, crear uno nuevo
      if (!currentCart) {
        currentCart = await createNewCart();
      }

      if (!currentCart) {
        throw new Error('Failed to create cart');
      }

      let lines: CartLineInput[];

      if (Array.isArray(linesOrId)) {
        lines = linesOrId;
      } else {
        lines = [
          {
            merchandiseId: linesOrId,
            quantity,
          },
        ];
      }

      const result = await addToCart(currentCart.id, lines);
      setCart(fixCheckoutUrl(result));
      if (result) {
        // Persistir y notificar a otros componentes
        localStorage.setItem('shopify-cart-id', result.id);
        try {
          window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart: result } }));
        } catch { }
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding item to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (lineId: string, quantity: number, merchandiseId?: string) => {
    if (!cart) return;

    try {
      setLoading(true);
      setError(null);

      const lines = [{ id: lineId, quantity, merchandiseId }];
      const result = await updateCartLines(cart.id, lines);
      setCart(fixCheckoutUrl(result));
      if (result) {
        localStorage.setItem('shopify-cart-id', result.id);
        try { window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart: result } })); } catch { }
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating cart item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeCartItem = async (lineId: string) => {
    if (!cart) return;

    try {
      setLoading(true);
      setError(null);

      const result = await removeFromCart(cart.id, [lineId]);
      setCart(fixCheckoutUrl(result));
      if (result) {
        localStorage.setItem('shopify-cart-id', result.id);
        try { window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart: result } })); } catch { }
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing cart item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart(null);
    localStorage.removeItem('shopify-cart-id');
  };

  // Calcular totales del carrito
  const cartTotals = {
    itemCount: cart?.totalQuantity || 0,
    subtotal: cart?.cost?.subtotalAmount?.amount || '0',
    total: cart?.cost?.totalAmount?.amount || '0',
    currencyCode: cart?.cost?.totalAmount?.currencyCode || 'EUR',
  };

  return {
    cart,
    loading,
    error,
    cartTotals,
    createCart: createNewCart,
    addToCart: addItemToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    refreshCart: () => cart && fetchCart(cart.id),
  };
}

// Hook para buscar productos
export function useProductSearch() {
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getProducts(20); // Por ahora usar getProducts, luego implementar búsqueda

      if (result) {
        // Filtrar productos por título que contenga el query
        const filteredProducts = result.edges
          .map((edge: any) => edge.node)
          .filter((product: any) =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.tags.some((tag: any) => tag.toLowerCase().includes(query.toLowerCase()))
          );

        setResults(filteredProducts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching products');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  };
}

// Hook para obtener colecciones
export function useCollections(first: number = 20) {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getCollections(first);

        if (result) {
          const collectionNodes = result.edges.map((edge: any) => edge.node);
          setCollections(collectionNodes);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching collections');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [first]);

  return { collections, loading, error };
}

// Hook para obtener productos de una colección específica
export function useCollectionProducts(handle: string, first: number = 20) {
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  const fetchCollectionProducts = useCallback(async (after?: string) => {
    if (!handle) return;

    try {
      setLoading(true);
      setError(null);

      const result = await getCollectionProducts(handle, first, after);

      if (result) {
        setCollection(result);

        if (result.products) {
          const productNodes = result.products.edges.map((edge: any) => edge.node);

          if (after) {
            // Si es paginación, agregar a los productos existentes
            setProducts(prev => [...prev, ...productNodes]);
          } else {
            // Si es carga inicial, reemplazar productos
            setProducts(productNodes);
          }

          setHasNextPage(result.products.pageInfo.hasNextPage);
          setEndCursor(result.products.pageInfo.endCursor || null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching collection products');
    } finally {
      setLoading(false);
    }
  }, [handle, first]);

  const loadMore = useCallback(() => {
    if (hasNextPage && endCursor && !loading) {
      fetchCollectionProducts(endCursor);
    }
  }, [hasNextPage, endCursor, loading, fetchCollectionProducts]);

  const refresh = useCallback(() => {
    fetchCollectionProducts();
  }, [fetchCollectionProducts]);

  useEffect(() => {
    fetchCollectionProducts();
  }, [fetchCollectionProducts]);

  return {
    collection,
    products,
    loading,
    error,
    hasNextPage,
    loadMore,
    refresh,
  };
}