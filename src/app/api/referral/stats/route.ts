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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");

        if (!code) {
            return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
        }

        // Query Shopify for discount code usage
        const query = `
      query getDiscountCodeUsage($query: String!) {
        codeDiscountNodes(first: 1, query: $query) {
          edges {
            node {
              id
              codeDiscount {
                ... on DiscountCodeBasic {
                  title
                  usageLimit
                  asyncUsageCount
                  codes(first: 1) {
                    edges {
                      node {
                        code
                        asyncUsageCount
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

        const data = await shopifyAdminRequest(query, { query: `title:${code}` });

        const discountNode = data.codeDiscountNodes?.edges?.[0]?.node;

        if (!discountNode) {
            return NextResponse.json({
                code,
                usageCount: 0,
                found: false
            });
        }

        const discount = discountNode.codeDiscount;
        const usageCount = discount?.asyncUsageCount || 0;

        return NextResponse.json({
            code,
            usageCount,
            found: true
        });

    } catch (error: any) {
        console.error("Error fetching referral stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch referral stats", details: error.message },
            { status: 500 }
        );
    }
}
