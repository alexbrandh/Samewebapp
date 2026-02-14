/**
 * Shopify Customer Account API
 * Gestiona autenticación, pedidos y datos de clientes
 */

import { shopifyClient } from './shopify';
import type {
  Customer,
  CustomerAccessToken,
  LoginCredentials,
  SignupCredentials,
  CustomerUpdateInput,
  Order,
  CustomerAddress,
} from './types/customer';

// ==========================================
// QUERIES Y MUTATIONS
// ==========================================

// Login - Crear access token
const CUSTOMER_LOGIN_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Signup - Crear nueva cuenta
const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Obtener datos del cliente
const GET_CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      displayName
      phone
      defaultAddress {
        id
        address1
        address2
        city
        province
        provinceCode
        zip
        country
        countryCode
        firstName
        lastName
        phone
        company
      }
      addresses(first: 10) {
        edges {
          node {
            id
            address1
            address2
            city
            province
            provinceCode
            zip
            country
            countryCode
            firstName
            lastName
            phone
            company
          }
        }
      }
      orders(first: 250) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

// Obtener pedidos del cliente
const GET_CUSTOMER_ORDERS_QUERY = `
  query getCustomerOrders($customerAccessToken: String!, $first: Int!, $after: String) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            lineItems(first: 50) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      id
                      handle
                    }
                  }
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                  discountedTotalPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
            shippingAddress {
              address1
              address2
              city
              province
              zip
              country
              countryCode
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

// Obtener un pedido específico
const GET_ORDER_QUERY = `
  query getOrder($customerAccessToken: String!, $orderId: ID!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 1, query: $orderId) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            cancelReason
            canceledAt
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            lineItems(first: 50) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      id
                      handle
                    }
                  }
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                  discountedTotalPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              country
              countryCode
              phone
            }
          }
        }
      }
    }
  }
`;

// Actualizar datos del cliente
const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        email
        firstName
        lastName
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Crear dirección
const CUSTOMER_ADDRESS_CREATE_MUTATION = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Actualizar dirección
const CUSTOMER_ADDRESS_UPDATE_MUTATION = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Eliminar dirección
const CUSTOMER_ADDRESS_DELETE_MUTATION = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// Recuperar contraseña
const CUSTOMER_RECOVER_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// ==========================================
// FUNCIONES
// ==========================================

/**
 * Login - Autenticar cliente
 */
export async function loginCustomer(credentials: LoginCredentials): Promise<CustomerAccessToken | null> {
  try {
    const response = await shopifyClient.request(CUSTOMER_LOGIN_MUTATION, {
      variables: {
        input: {
          email: credentials.email,
          password: credentials.password,
        },
      },
    });

    const result = response.data?.customerAccessTokenCreate;

    if (result?.customerUserErrors?.length > 0) {
      const errorMessage = result.customerUserErrors[0].message;

      // For inactive accounts or wrong credentials, don't use error log
      if (errorMessage.includes('Unidentified customer')) {
        console.warn('Login failed (Unidentified customer):', result.customerUserErrors);
      } else {
        console.error('Login errors:', result.customerUserErrors);
      }
      throw new Error(errorMessage);
    }

    return result?.customerAccessToken || null;
  } catch (error) {
    // Don't re-log if we just threw it above, or if it's the specific error
    if (error instanceof Error && error.message.includes('Unidentified customer')) {
      // Already logged as warn above or caught
    } else {
      console.error('Error logging in:', error);
    }
    throw error;
  }
}

/**
 * Signup - Crear nueva cuenta
 */
export async function signupCustomer(credentials: SignupCredentials) {
  try {
    // Clean and validate phone for E.164 format
    // E.164 requires: + followed by 7-15 digits, no spaces
    let phone: string | undefined = undefined;
    if (credentials.phone && credentials.phone.trim()) {
      // Remove all spaces, dashes, and parentheses
      const cleanedPhone = credentials.phone.replace(/[\s\-\(\)]/g, '').trim();
      // Only include if it starts with + and has at least 8 characters (+ and 7 digits minimum)
      if (cleanedPhone.startsWith('+') && cleanedPhone.length >= 8) {
        // Validate that after + there are only digits
        const digitsOnly = cleanedPhone.substring(1);
        if (/^\d+$/.test(digitsOnly)) {
          phone = cleanedPhone;
        }
      }
    }

    // Log the payload for debugging
    console.log('Signup payload:', {
      ...credentials,
      password: '***',
      phone: phone // Log the processed phone
    });

    try {
      const response = await shopifyClient.request(CUSTOMER_CREATE_MUTATION, {
        variables: {
          input: {
            email: credentials.email,
            password: credentials.password,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            ...(phone && { phone }), // Only include phone if valid
            acceptsMarketing: credentials.acceptsMarketing || false,
          },
        },
      });

      const result = response.data?.customerCreate;

      if (result?.customerUserErrors?.length > 0) {
        const firstErrorMessage = result.customerUserErrors[0].message;

        // Check if Shopify is telling us the email verification was sent
        // Shopify returns this as an "error" but it's actually success
        if (firstErrorMessage.toLowerCase().includes('we have sent an email') ||
          firstErrorMessage.toLowerCase().includes('please click the link') ||
          firstErrorMessage.toLowerCase().includes('verify your email')) {
          console.log('Signup success: email verification sent.');
          return { emailVerificationSent: true, email: credentials.email };
        }

        // Check if error is about phone
        const isPhoneError = result.customerUserErrors.some((e: any) =>
          e.message.toLowerCase().includes('phone') || e.field?.includes('phone')
        );

        if (isPhoneError && phone) {
          console.warn('Signup failed due to phone validation. Retrying without phone...');
          // Retry without phone
          return signupCustomer({
            ...credentials,
            phone: '' // Remove phone for retry
          });
        }

        // Check for common signup errors and provide user-friendly messages
        if (firstErrorMessage.toLowerCase().includes('has already been taken') ||
          firstErrorMessage.toLowerCase().includes('already exists')) {
          throw new Error('Ya existe una cuenta con este correo electrónico. Por favor inicia sesión o usa un correo diferente.');
        }

        if (firstErrorMessage.toLowerCase().includes('password') &&
          firstErrorMessage.toLowerCase().includes('too short')) {
          throw new Error('La contraseña es muy corta. Por favor usa al menos 5 caracteres.');
        }

        console.error('Signup errors:', result.customerUserErrors);
        throw new Error(firstErrorMessage);
      }

      return result?.customer;
    } catch (requestError) {
      throw requestError;
    }
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

/**
 * Obtener datos del cliente autenticado
 */
export async function getCustomer(accessToken: string): Promise<Customer | null> {
  try {
    const response = await shopifyClient.request(GET_CUSTOMER_QUERY, {
      variables: { customerAccessToken: accessToken },
    });

    const customer = response.data?.customer;

    if (!customer) {
      return null;
    }

    // Transformar addresses edges a array
    const addresses = customer.addresses?.edges?.map((edge: any) => edge.node) || [];

    return {
      ...customer,
      addresses,
      ordersCount: customer.orders?.edges?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

/**
 * Obtener pedidos del cliente
 */
export async function getCustomerOrders(
  accessToken: string,
  first: number = 20,
  after?: string
): Promise<{ orders: Order[]; hasNextPage: boolean; endCursor?: string }> {
  try {
    const response = await shopifyClient.request(GET_CUSTOMER_ORDERS_QUERY, {
      variables: {
        customerAccessToken: accessToken,
        first,
        after,
      },
    });

    const ordersData = response.data?.customer?.orders;

    if (!ordersData) {
      return { orders: [], hasNextPage: false };
    }

    const orders = ordersData.edges.map((edge: any) => {
      const node = edge.node;
      return {
        ...node,
        lineItems: node.lineItems?.edges?.map((li: any) => li.node) || [],
      };
    });

    return {
      orders,
      hasNextPage: ordersData.pageInfo.hasNextPage,
      endCursor: ordersData.pageInfo.endCursor,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { orders: [], hasNextPage: false };
  }
}

/**
 * Obtener un pedido específico
 */
export async function getOrder(accessToken: string, orderId: string): Promise<Order | null> {
  try {
    const response = await shopifyClient.request(GET_ORDER_QUERY, {
      variables: {
        customerAccessToken: accessToken,
        orderId,
      },
    });

    const orderEdge = response.data?.customer?.orders?.edges?.[0];

    if (!orderEdge) {
      return null;
    }

    const order = orderEdge.node;

    return {
      ...order,
      lineItems: order.lineItems?.edges?.map((li: any) => li.node) || [],
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

/**
 * Actualizar datos del cliente
 */
export async function updateCustomer(accessToken: string, input: CustomerUpdateInput) {
  try {
    const response = await shopifyClient.request(CUSTOMER_UPDATE_MUTATION, {
      variables: {
        customerAccessToken: accessToken,
        customer: input,
      },
    });

    const result = response.data?.customerUpdate;

    if (result?.customerUserErrors?.length > 0) {
      console.error('Update errors:', result.customerUserErrors);
      throw new Error(result.customerUserErrors[0].message);
    }

    return result?.customer;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

/**
 * Crear dirección
 */
export async function createAddress(accessToken: string, address: Partial<CustomerAddress>) {
  try {
    const response = await shopifyClient.request(CUSTOMER_ADDRESS_CREATE_MUTATION, {
      variables: {
        customerAccessToken: accessToken,
        address,
      },
    });

    const result = response.data?.customerAddressCreate;

    if (result?.customerUserErrors?.length > 0) {
      throw new Error(result.customerUserErrors[0].message);
    }

    return result?.customerAddress;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
}

/**
 * Actualizar dirección
 */
export async function updateAddress(accessToken: string, id: string, address: Partial<CustomerAddress>) {
  try {
    const response = await shopifyClient.request(CUSTOMER_ADDRESS_UPDATE_MUTATION, {
      variables: {
        customerAccessToken: accessToken,
        id,
        address,
      },
    });

    const result = response.data?.customerAddressUpdate;

    if (result?.customerUserErrors?.length > 0) {
      throw new Error(result.customerUserErrors[0].message);
    }

    return result?.customerAddress;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
}

/**
 * Eliminar dirección
 */
export async function deleteAddress(accessToken: string, id: string) {
  try {
    const response = await shopifyClient.request(CUSTOMER_ADDRESS_DELETE_MUTATION, {
      variables: {
        customerAccessToken: accessToken,
        id,
      },
    });

    const result = response.data?.customerAddressDelete;

    if (result?.customerUserErrors?.length > 0) {
      throw new Error(result.customerUserErrors[0].message);
    }

    return result?.deletedCustomerAddressId;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
}

/**
 * Recuperar contraseña
 */
export async function recoverPassword(email: string) {
  try {
    const response = await shopifyClient.request(CUSTOMER_RECOVER_MUTATION, {
      variables: { email },
    });

    const result = response.data?.customerRecover;

    if (result?.customerUserErrors?.length > 0) {
      throw new Error(result.customerUserErrors[0].message);
    }

    return true;
  } catch (error) {
    console.error('Error recovering password:', error);
    throw error;
  }
}

/**
 * Validar si un token sigue siendo válido
 */
export async function validateToken(accessToken: string): Promise<boolean> {
  try {
    const customer = await getCustomer(accessToken);
    return customer !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Helper: Obtener URL de login de Shopify
 */
export function getShopifyLoginUrl(returnUrl?: string): string {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const baseUrl = `https://${domain}/account/login`;

  if (returnUrl) {
    return `${baseUrl}?return_url=${encodeURIComponent(returnUrl)}`;
  }

  return baseUrl;
}

/**
 * Helper: Obtener URL de cuenta de Shopify
 */
export function getShopifyAccountUrl(): string {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  return `https://${domain}/account`;
}

// ========================================
// FAVORITES (FAVORITOS)
// ========================================

/**
 * Query: Obtener productos favoritos del cliente
 */
const GET_CUSTOMER_FAVORITES_QUERY = `
  query getCustomerFavorites($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      metafield(namespace: "custom", key: "favorites") {
        value
        type
      }
    }
  }
`;

/**
 * Query: Obtener detalles de productos por IDs
 */
const GET_PRODUCTS_BY_IDS_QUERY = `
  query getProductsByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
        description
        tags
        vendor
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
          width
          height
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 1) {
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
      }
    }
  }
`;

/**
 * Mutation: Actualizar favoritos del cliente
 */
const UPDATE_CUSTOMER_FAVORITES_MUTATION = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        metafield(namespace: "custom", key: "favorites") {
          value
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Obtener productos favoritos del cliente
 */
export async function getFavorites(accessToken: string): Promise<any[]> {
  try {
    const response = await shopifyClient.request(GET_CUSTOMER_FAVORITES_QUERY, {
      variables: {
        customerAccessToken: accessToken,
      },
    });

    const metafield = response.data?.customer?.metafield;

    if (!metafield || !metafield.value) {
      return [];
    }

    // El valor es un JSON string con array de product IDs
    let productIds: string[] = [];

    try {
      const parsed = JSON.parse(metafield.value);
      productIds = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error parsing favorites metafield:', e);
      return [];
    }

    if (productIds.length === 0) {
      return [];
    }

    // Obtener detalles de los productos
    const productsResponse = await shopifyClient.request(GET_PRODUCTS_BY_IDS_QUERY, {
      variables: {
        ids: productIds,
      },
    });

    const products = productsResponse.data?.nodes || [];

    // Filtrar solo productos válidos y mapear
    return products
      .filter((product: any) => product && product.id)
      .map((product: any) => ({
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description,
        price: product.priceRange?.minVariantPrice?.amount,
        compareAtPrice: product.compareAtPriceRange?.minVariantPrice?.amount,
        image: product.featuredImage?.url || product.images?.edges?.[0]?.node?.url,
        availableForSale: product.availableForSale,
        vendor: product.vendor,
        tags: product.tags || [],
      }));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

/**
 * Agregar producto a favoritos (usando Admin API endpoint)
 */
export async function addToFavorites(
  accessToken: string,
  productId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Obtener ID del customer actual
    const customer = await getCustomer(accessToken);

    if (!customer?.id) {
      return { success: false, error: 'Customer ID not found' };
    }

    // Llamar al API endpoint que usa Admin API
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add',
        productId,
        customerId: customer.id,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to add to favorites'
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error adding to favorites:', error);
    return {
      success: false,
      error: error.message || 'Failed to add to favorites'
    };
  }
}

/**
 * Remover producto de favoritos (usando Admin API endpoint)
 */
export async function removeFromFavorites(
  accessToken: string,
  productId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Obtener ID del customer actual
    const customer = await getCustomer(accessToken);

    if (!customer?.id) {
      return { success: false, error: 'Customer ID not found' };
    }

    // Llamar al API endpoint que usa Admin API
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'remove',
        productId,
        customerId: customer.id,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to remove from favorites'
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error removing from favorites:', error);
    return {
      success: false,
      error: error.message || 'Failed to remove from favorites'
    };
  }
}
