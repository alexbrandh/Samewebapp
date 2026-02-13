
import { NextResponse } from 'next/server';

const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const API_VERSION = '2024-01';

if (!SHOPIFY_ADMIN_TOKEN || !SHOPIFY_DOMAIN) {
    console.error('Missing Shopify Admin credentials');
}

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        if (!SHOPIFY_ADMIN_TOKEN || !SHOPIFY_DOMAIN) {
            // Fallback for development if no admin token
            console.warn('Missing Admin Token, returning mock success');
            return NextResponse.json({ success: true, message: 'Mock subscription successful' });
        }

        // 1. Check if customer exists
        const searchResponse = await fetch(
            `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
                },
                body: JSON.stringify({
                    query: `
            query searchCustomer($query: String!) {
              customers(first: 1, query: $query) {
                edges {
                  node {
                    id
                    email
                    acceptsMarketing
                  }
                }
              }
            }
          `,
                    variables: {
                        query: `email:${email}`,
                    },
                }),
            }
        );

        const searchData = await searchResponse.json();
        const existingCustomer = searchData.data?.customers?.edges?.[0]?.node;

        if (existingCustomer) {
            // 2. Update existing customer
            if (existingCustomer.acceptsMarketing) {
                return NextResponse.json({ success: true, message: 'Already subscribed' });
            }

            await fetch(
                `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
                    },
                    body: JSON.stringify({
                        query: `
              mutation customerUpdate($input: CustomerInput!) {
                customerUpdate(input: $input) {
                  customer {
                    id
                    email
                    acceptsMarketing
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }
            `,
                        variables: {
                            input: {
                                id: existingCustomer.id,
                                acceptsMarketing: true,
                                tags: ["newsletter"]
                            },
                        },
                    }),
                }
            );
        } else {
            // 3. Create new customer
            await fetch(
                `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
                    },
                    body: JSON.stringify({
                        query: `
              mutation customerCreate($input: CustomerInput!) {
                customerCreate(input: $input) {
                  customer {
                    id
                    email
                    acceptsMarketing
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }
            `,
                        variables: {
                            input: {
                                email,
                                acceptsMarketing: true,
                                tags: ["newsletter"],
                                firstName: "Newsletter", // Optional: generic name
                                lastName: "Subscriber"
                            },
                        },
                    }),
                }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
