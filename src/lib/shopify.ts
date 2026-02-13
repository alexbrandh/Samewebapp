import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import type {
  ShopifyProduct,
  ShopifyCart,
  ProductsResponse,
  ProductResponse,
  CartResponse,
  CartCreateResponse,
  CartLinesAddResponse,
  CartLineInput,
  ProductFilters,
  SortOptions,
  PaginationOptions
} from './types/shopify';

// Verificar configuración
if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
  throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is required');
}

if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is required');
}

// Configuración del cliente de Shopify con endpoint correcto
export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2026-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

// GraphQL Queries

// Query para obtener productos
export const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 5) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          tags
          vendor
          productType
          metafields(identifiers: [
            {namespace: "custom", key: "inspiration_brand"},
            {namespace: "custom", key: "longevity"},
            {namespace: "custom", key: "key_ingredients"},
            {namespace: "custom", key: "aromatic_notes"},
            {namespace: "custom", key: "how_to_use"},
            {namespace: "custom", key: "ingredient_list"}
          ]) {
            namespace
            key
            value
            type
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Query para obtener un producto específico
export const GET_PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      options {
        id
        name
        values
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      tags
      vendor
      productType
      metafields(identifiers: [
        {namespace: "custom", key: "inspiration_brand"},
        {namespace: "custom", key: "longevity"},
        {namespace: "custom", key: "key_ingredients"},
        {namespace: "custom", key: "aromatic_notes"},
        {namespace: "custom", key: "how_to_use"},
        {namespace: "custom", key: "ingredient_list"}
      ]) {
        namespace
        key
        value
        type
      }
    }
  }
`;

// Funciones helper para obtener datos
export async function getProducts(first: number = 20, after?: string) {
  try {
    const response = await shopifyClient.request(GET_PRODUCTS_QUERY, {
      variables: { first, after },
    });
    return response.data?.products;
  } catch (error) {
    console.error('❌ Error fetching products from Shopify:', error);
    return null;
  }
}

export async function getProduct(handle: string) {
  try {
    const response = await shopifyClient.request(GET_PRODUCT_QUERY, {
      variables: { handle },
    });
    return response.data?.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Helper para formatear precios
export function formatPrice(amount: string, currencyCode: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

// Queries para el carrito
export const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    options {
                      id
                      name
                      values
                    }
                    variants(first: 20) {
                      edges {
                        node {
                          id
                          title
                          price {
                            amount
                            currencyCode
                          }
                          selectedOptions {
                            name
                            value
                          }
                          availableForSale
                        }
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const ADD_TO_CART_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    options {
                      id
                      name
                      values
                    }
                    variants(first: 20) {
                      edges {
                        node {
                          id
                          title
                          price {
                            amount
                            currencyCode
                          }
                          selectedOptions {
                            name
                            value
                          }
                          availableForSale
                        }
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  id
                  title
                  handle
                  options {
                    id
                    name
                    values
                  }
                  variants(first: 20) {
                    edges {
                      node {
                        id
                        title
                        price {
                          amount
                          currencyCode
                        }
                        selectedOptions {
                          name
                          value
                        }
                        availableForSale
                      }
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;

export const UPDATE_CART_LINES_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    options {
                      id
                      name
                      values
                    }
                    variants(first: 20) {
                      edges {
                        node {
                          id
                          title
                          price {
                            amount
                            currencyCode
                          }
                          selectedOptions {
                            name
                            value
                          }
                          availableForSale
                        }
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    options {
                      id
                      name
                      values
                    }
                    variants(first: 20) {
                      edges {
                        node {
                          id
                          title
                          price {
                            amount
                            currencyCode
                          }
                          selectedOptions {
                            name
                            value
                          }
                          availableForSale
                        }
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Funciones del carrito
export async function createCart(lines: CartLineInput[] = []) {
  try {
    const response = await shopifyClient.request(CREATE_CART_MUTATION, {
      variables: {
        input: {
          lines,
        },
      },
    });

    const result = response.data?.cartCreate;

    if (result?.userErrors?.length > 0) {
      console.error('Cart creation errors:', result.userErrors);
      throw new Error(result.userErrors[0].message);
    }

    return result?.cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

export async function addToCart(cartId: string, lines: CartLineInput[]) {
  try {
    const response = await shopifyClient.request(ADD_TO_CART_MUTATION, {
      variables: {
        cartId,
        lines,
      },
    });

    const result = response.data?.cartLinesAdd;

    if (result?.userErrors?.length > 0) {
      console.error('Add to cart errors:', result.userErrors);
      throw new Error(result.userErrors[0].message);
    }

    return result?.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export async function getCart(cartId: string) {
  try {
    const response = await shopifyClient.request(GET_CART_QUERY, {
      variables: { cartId },
    });

    return response.data?.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

export async function updateCartLines(cartId: string, lines: { id: string; quantity?: number; merchandiseId?: string }[]) {
  try {
    const response = await shopifyClient.request(UPDATE_CART_LINES_MUTATION, {
      variables: {
        cartId,
        lines,
      },
    });

    const result = response.data?.cartLinesUpdate;

    if (result?.userErrors?.length > 0) {
      console.error('Update cart errors:', result.userErrors);
      throw new Error(result.userErrors[0].message);
    }

    return result?.cart;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  try {
    const response = await shopifyClient.request(REMOVE_FROM_CART_MUTATION, {
      variables: {
        cartId,
        lineIds,
      },
    });

    const result = response.data?.cartLinesRemove;

    if (result?.userErrors?.length > 0) {
      console.error('Remove from cart errors:', result.userErrors);
      throw new Error(result.userErrors[0].message);
    }

    return result?.cart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

// Función para obtener productos por categoría/tag
export async function getProductsByTag(tag: string, first: number = 20) {
  const query = `
    query getProductsByTag($tag: String!, $first: Int!) {
      products(first: $first, query: $tag) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 5) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            featuredImage {
              url
              altText
              width
              height
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            tags
            vendor
            productType
            metafields(identifiers: [
              {namespace: "custom", key: "inspiration_brand"},
              {namespace: "custom", key: "longevity"},
              {namespace: "custom", key: "key_ingredients"},
              {namespace: "custom", key: "aromatic_notes"}
            ]) {
              namespace
              key
              value
              type
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    const response = await shopifyClient.request(query, {
      variables: { tag: `tag:${tag}`, first },
    });
    return response.data?.products;
  } catch (error) {
    console.error('Error fetching products by tag:', error);
    return null;
  }
}

// Función para buscar productos
export async function searchProducts(query: string, first: number = 20) {
  try {
    const response = await shopifyClient.request(GET_PRODUCTS_QUERY, {
      variables: { first, query },
    });
    return response.data?.products;
  } catch (error) {
    console.error('Error searching products:', error);
    return null;
  }
}

// GraphQL query para obtener colecciones
export const GET_COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            id
            url
            altText
            width
            height
          }
          products(first: 10) {
            edges {
              node {
                id
                title
                handle
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query para obtener productos de una colección específica
export const GET_COLLECTION_PRODUCTS_QUERY = `
  query getCollectionProducts($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 5) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            tags
            vendor
            productType
            metafields(identifiers: [
              {namespace: "custom", key: "inspiration_brand"},
              {namespace: "custom", key: "longevity"},
              {namespace: "custom", key: "key_ingredients"},
              {namespace: "custom", key: "aromatic_notes"},
              {namespace: "custom", key: "how_to_use"},
              {namespace: "custom", key: "ingredient_list"}
            ]) {
              namespace
              key
              value
              type
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

// Función para obtener todas las colecciones
export async function getCollections(first: number = 20) {
  try {
    const response = await shopifyClient.request(GET_COLLECTIONS_QUERY, {
      variables: { first }
    });

    return response.data?.collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

// Función para obtener productos de una colección específica
export async function getCollectionProducts(handle: string, first: number = 20, after?: string) {
  try {
    const response = await shopifyClient.request(GET_COLLECTION_PRODUCTS_QUERY, {
      variables: { handle, first, after }
    });

    return response.data?.collection;
  } catch (error) {
    console.error('Error fetching collection products:', error);
    throw error;
  }
}