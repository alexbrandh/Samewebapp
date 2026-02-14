/**
 * Shopify Admin API Client
 * Para crear, editar y eliminar productos y colecciones
 */

import { getAdminAccessToken } from './shopify-token';

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const API_VERSION = '2026-01';

// Tipos
export interface CreateProductInput {
  title: string;
  body_html?: string;
  vendor?: string;
  product_type?: string;
  tags?: string[];
  variants?: Array<{
    price: string;
    sku?: string;
    inventory_quantity?: number;
  }>;
  images?: Array<{
    src: string;
    alt?: string;
  }>;
}

export interface CreateCollectionInput {
  title: string;
  body_html?: string;
  image?: {
    src: string;
    alt?: string;
  };
}

/**
 * Hacer peticiones al Admin API
 */
async function adminRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getAdminAccessToken();
  const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Shopify Admin API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * PRODUCTOS
 */

// Crear producto
export async function createProduct(input: CreateProductInput) {
  const product = {
    title: input.title,
    body_html: input.body_html || '',
    vendor: input.vendor || 'SAME.',
    product_type: input.product_type || 'Perfume',
    tags: input.tags?.join(', ') || '',
    variants: input.variants || [{
      price: '0.00',
      inventory_quantity: 0,
    }],
    images: input.images || [],
  };

  const response = await adminRequest('products.json', {
    method: 'POST',
    body: JSON.stringify({ product }),
  });

  return response.product;
}

// Listar productos
export async function listProducts(limit = 50) {
  const response = await adminRequest(`products.json?limit=${limit}`);
  return response.products;
}

// Obtener producto por ID
export async function getProduct(productId: string) {
  const response = await adminRequest(`products/${productId}.json`);
  return response.product;
}

// Actualizar producto
export async function updateProduct(productId: string, updates: Partial<CreateProductInput>) {
  const response = await adminRequest(`products/${productId}.json`, {
    method: 'PUT',
    body: JSON.stringify({ product: updates }),
  });
  return response.product;
}

// Eliminar producto
export async function deleteProduct(productId: string) {
  await adminRequest(`products/${productId}.json`, {
    method: 'DELETE',
  });
  return { success: true };
}

/**
 * COLECCIONES
 */

// Crear colección (Custom Collection)
export async function createCollection(input: CreateCollectionInput) {
  const collection = {
    title: input.title,
    body_html: input.body_html || '',
    image: input.image,
  };

  const response = await adminRequest('custom_collections.json', {
    method: 'POST',
    body: JSON.stringify({ custom_collection: collection }),
  });

  return response.custom_collection;
}

// Listar colecciones
export async function listCollections(limit = 50) {
  const response = await adminRequest(`custom_collections.json?limit=${limit}`);
  return response.custom_collections;
}

// Obtener colección por ID
export async function getCollection(collectionId: string) {
  const response = await adminRequest(`custom_collections/${collectionId}.json`);
  return response.custom_collection;
}

// Actualizar colección
export async function updateCollection(collectionId: string, updates: Partial<CreateCollectionInput>) {
  const response = await adminRequest(`custom_collections/${collectionId}.json`, {
    method: 'PUT',
    body: JSON.stringify({ custom_collection: updates }),
  });
  return response.custom_collection;
}

// Eliminar colección
export async function deleteCollection(collectionId: string) {
  await adminRequest(`custom_collections/${collectionId}.json`, {
    method: 'DELETE',
  });
  return { success: true };
}

// Agregar producto a colección
export async function addProductToCollection(collectionId: string, productId: string) {
  const response = await adminRequest('collects.json', {
    method: 'POST',
    body: JSON.stringify({
      collect: {
        product_id: productId,
        collection_id: collectionId,
      },
    }),
  });
  return response.collect;
}

// Remover producto de colección
export async function removeProductFromCollection(collectId: string) {
  await adminRequest(`collects/${collectId}.json`, {
    method: 'DELETE',
  });
  return { success: true };
}
