import { NextResponse } from "next/server";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = "2024-01";

if (!SHOPIFY_DOMAIN || !ADMIN_ACCESS_TOKEN) {
  console.error("Missing Shopify Admin API credentials");
}

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
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}

export async function POST(request: Request) {
  if (!ADMIN_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "Server configuration error: Missing Admin Token" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { email, answers } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Generate Tags from Answers
    const tags: string[] = ["quiz:completed"];

    // Map answers to tags
    // Example: answers = { "scent-preferences": ["floral", "fresh"], "gender-preference": "feminine" }
    // Result: "preference:floral", "preference:fresh", "gender:feminine"

    Object.entries(answers).forEach(([key, value]) => {
      // Clean key name (e.g., "scent-preferences" -> "preference")
      let category = key;
      if (key === "scent-preferences") category = "preference";
      if (key === "scent-dislikes") category = "dislike";
      if (key === "fragrance-intensity") category = "intensity";
      if (key === "gender-preference") category = "gender";
      if (key === "purchased-before") category = "customer_type"; // yes/no

      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (typeof v === "string") tags.push(`quiz:${category}:${v.toLowerCase()}`);
        });
      } else if (typeof value === "string") {
        tags.push(`quiz:${category}:${value.toLowerCase()}`);
      }
    });

    console.log(`Processing quiz for ${email}. Generated tags:`, tags);

    // 2. Check if customer exists
    const searchQuery = `
      query getCustomer($query: String!) {
        customers(first: 1, query: $query) {
          edges {
            node {
              id
              tags
            }
          }
        }
      }
    `;

    const searchResult = await shopifyAdminRequest(searchQuery, { query: `email:${email}` });
    const existingCustomer = searchResult.customers.edges[0]?.node;

    let customerId;

    if (existingCustomer) {
      // 3A. Update existing customer
      console.log("Updating existing customer:", existingCustomer.id);
      customerId = existingCustomer.id;

      // Merge tags (don't duplicate)
      const currentTags = existingCustomer.tags || [];
      const newTags = [...new Set([...currentTags, ...tags])];

      const updateMutation = `
        mutation customerUpdate($input: CustomerInput!) {
          customerUpdate(input: $input) {
            customer {
              id
              email
              tags
              emailMarketingConsent {
                marketingState
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      try {
        await shopifyAdminRequest(updateMutation, {
          input: {
            id: customerId,
            tags: newTags,
            emailMarketingConsent: {
              marketingState: "SUBSCRIBED",
              marketingOptInLevel: "SINGLE_OPT_IN"
            }
          }
        });
      } catch (err: any) {
        console.error("Error updating customer:", err);
        // Continue even if update fails, though ideally we want it to succeed
      }

    } else {
      // 3B. Create new customer
      console.log("Creating new customer...");
      const createMutation = `
        mutation customerCreate($input: CustomerInput!) {
          customerCreate(input: $input) {
            customer {
              id
              email
              tags
              emailMarketingConsent {
                marketingState
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const createResult = await shopifyAdminRequest(createMutation, {
        input: {
          email,
          tags: tags,
          emailMarketingConsent: {
            marketingState: "SUBSCRIBED",
            marketingOptInLevel: "SINGLE_OPT_IN"
          }
        }
      });

      if (createResult.customerCreate?.userErrors?.length > 0) {
        console.error("Customer create errors:", createResult.customerCreate.userErrors);
        throw new Error(createResult.customerCreate.userErrors[0].message);
      }

      customerId = createResult.customerCreate?.customer?.id;
    }

    return NextResponse.json({ success: true, customerId });

  } catch (error: any) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { error: "Failed to process quiz submission", details: error.message },
      { status: 500 }
    );
  }
}
