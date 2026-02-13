import { NextResponse } from "next/server";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = "2024-01";

const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

async function shopifyAdminRequest(query: string, variables: any = {}) {
  const response = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  if (json.errors) {
    console.error("Shopify GraphQL Errors:", JSON.stringify(json.errors, null, 2));
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}

// Authenticated Referral API

// 1. Verify User (Storefront)
async function verifyStorefrontToken(token: string) {
  const response = await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({
      query: `
        query getCustomer($token: String!) {
          customer(customerAccessToken: $token) {
            id
            email
            firstName
            lastName
          }
        }
      `,
      variables: { token }
    }),
  });
  const json = await response.json();
  return json.data?.customer;
}

// 2. Admin API Helper
async function getCustomerMetafield(customerId: string) {
  // customerId is global ID (gid://shopify/Customer/...), Admin API needs local ID or accepts global?
  // Admin API accepts Global ID in newer versions, but let's be safe.
  // Actually `customer` query by ID works with Global ID.

  const query = `
    query getCustomerMetafield($id: ID!) {
      customer(id: $id) {
        metafield(namespace: "custom", key: "referral_code") {
          value
        }
      }
    }
  `;
  const data = await shopifyAdminRequest(query, { id: customerId });
  return data.customer?.metafield?.value;
}

async function saveCustomerMetafield(customerId: string, code: string) {
  const mutation = `
    mutation updateCustomerMetafield($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          metafields(first: 1) {
            edges {
              node {
                key
                value
              }
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
  const variables = {
    input: {
      id: customerId,
      metafields: [
        {
          namespace: "custom",
          key: "referral_code",
          type: "single_line_text_field",
          value: code
        }
      ]
    }
  };

  const data = await shopifyAdminRequest(mutation, variables);
  if (data.customerUpdate?.userErrors?.length > 0) {
    console.error("Metafield Save Error:", data.customerUpdate.userErrors);
    // We warn but don't fail the written discount
  }
}

export async function POST(request: Request) {
  if (!ADMIN_ACCESS_TOKEN) {
    console.error("Missing Admin Token");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // 1. Verify User
    const customer = await verifyStorefrontToken(accessToken);
    if (!customer) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    console.log("Verified Customer:", customer.email);

    // 2. Check for Existing Code
    const existingCode = await getCustomerMetafield(customer.id);
    if (existingCode) {
      console.log("Found existing code:", existingCode);
      return NextResponse.json({ success: true, code: existingCode, isNew: false });
    }

    // 3. Generate New Code
    // Format: REF-{NAME}-{RANDOM}
    // Fallback to "FRIEND" if no name
    const namePart = (customer.firstName || customer.email.split('@')[0]).substring(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    const newCode = `REF-${namePart}-${random}`;

    console.log("Generating New Code:", newCode);

    // 4. Create Discount (Admin) - REUSE existing function call
    // 2. Create a new DiscountCodeBasic for this referral
    const createMutation = `
                mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
                  discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
                    codeDiscountNode {
                      id
                    }
                    userErrors {
                      field
                      message
                    }
                  }
                }
            `;

    const variables = {
      basicCodeDiscount: {
        title: `Referral: ${customer.email}`,
        code: newCode,
        startsAt: new Date().toISOString(),
        // "Give $15, Get $15". The FRIEND uses this code.
        // Should the code be usable ONCE per friend, but UNLIMITED times total?
        // "usageLimit" is total usage limit.
        // If "No Limit" is the goal (Refer as many friends as you want), usageLimit should be null (unlimited).
        // But verify "appliesOncePerCustomer: true" prevents the SAME friend from using it twice.
        usageLimit: null,
        customerSelection: {
          all: true
        },
        customerGets: {
          value: {
            percentage: 0.10 // 10% off
          },
          items: {
            all: true
          }
        },
        minimumRequirement: {
          subtotal: {
            greaterThanOrEqualToSubtotal: "50.0"
          }
        },
        appliesOncePerCustomer: true
      }
    };

    const data = await shopifyAdminRequest(createMutation, variables);

    if (data.discountCodeBasicCreate?.userErrors?.length > 0) {
      console.error("Discount Create User Errors:", data.discountCodeBasicCreate.userErrors);
      throw new Error("Failed to create discount: " + JSON.stringify(data.discountCodeBasicCreate.userErrors));
    }

    // 5. Save to Metafield
    await saveCustomerMetafield(customer.id, newCode);

    return NextResponse.json({ success: true, code: newCode, isNew: true });

  } catch (error: any) {
    console.error("Referral creation error details:", error);
    return NextResponse.json(
      { error: "Failed to create referral code", details: error.message },
      { status: 500 }
    );
  }
}
