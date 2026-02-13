import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_ADMIN_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2026-01/graphql.json`;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// Mutation para actualizar metafield del cliente
const UPDATE_CUSTOMER_METAFIELD = `
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        metafield(namespace: "custom", key: "favorites") {
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Query para obtener customer ID desde email
const GET_CUSTOMER_BY_EMAIL = `
  query getCustomer($email: String!) {
    customers(first: 1, query: $email) {
      edges {
        node {
          id
          email
          metafield(namespace: "custom", key: "favorites") {
            value
          }
        }
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const { action, productId, customerId } = await request.json();

    if (!customerId) {
      console.error('❌ Customer ID is required');
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    if (!ADMIN_ACCESS_TOKEN) {
      console.error('❌ Admin API not configured');
      return NextResponse.json({ error: 'Admin API not configured' }, { status: 500 });
    }

    // 1. Obtener metafield actual del customer
    const GET_CUSTOMER_METAFIELD = `
      query getCustomerMetafield($id: ID!) {
        customer(id: $id) {
          id
          metafield(namespace: "custom", key: "favorites") {
            value
          }
        }
      }
    `;

    const metafieldResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: GET_CUSTOMER_METAFIELD,
        variables: { id: customerId },
      }),
    });

    const metafieldData = await metafieldResponse.json();

    if (metafieldData.errors) {
      console.error('❌ Error getting metafield:', metafieldData.errors);
      return NextResponse.json({ error: 'Failed to get favorites', details: metafieldData.errors }, { status: 500 });
    }

    // 2. Obtener favoritos actuales
    let currentFavorites: string[] = [];

    const metafieldValue = metafieldData.data?.customer?.metafield?.value;
    if (metafieldValue) {
      try {
        currentFavorites = JSON.parse(metafieldValue);
      } catch (e) {
        console.error('Error parsing favorites:', e);
      }
    }

    // 3. Actualizar la lista según la acción
    let updatedFavorites: string[];

    if (action === 'add') {
      // Agregar si no existe
      if (!currentFavorites.includes(productId)) {
        updatedFavorites = [...currentFavorites, productId];
      } else {
        updatedFavorites = currentFavorites;
      }
    } else if (action === 'remove') {
      // Remover
      updatedFavorites = currentFavorites.filter(id => id !== productId);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // 4. Actualizar metafield en Shopify
    const updateResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: UPDATE_CUSTOMER_METAFIELD,
        variables: {
          input: {
            id: customerId,
            metafields: [
              {
                namespace: 'custom',
                key: 'favorites',
                value: JSON.stringify(updatedFavorites),
                type: 'list.single_line_text_field',
              },
            ],
          },
        },
      }),
    });

    const updateData = await updateResponse.json();

    if (updateData.errors || updateData.data?.customerUpdate?.userErrors?.length > 0) {
      console.error('❌ Update errors:', updateData.errors || updateData.data?.customerUpdate?.userErrors);
      return NextResponse.json({
        error: 'Failed to update favorites',
        details: updateData.errors || updateData.data?.customerUpdate?.userErrors
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      favorites: updatedFavorites,
    });

  } catch (error: any) {
    console.error('❌ API error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({
      error: error.message || 'Internal server error',
      details: error.toString()
    }, { status: 500 });
  }
}
