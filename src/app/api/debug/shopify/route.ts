import { NextResponse } from "next/server";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = "2024-01";
const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

async function testQuery(query: string, label: string) {
    try {
        const response = await fetch(SHOPIFY_GRAPHQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN!,
            },
            body: JSON.stringify({ query }),
        });

        const json = await response.json();
        return { label, status: response.status, data: json };
    } catch (e: any) {
        return { label, error: e.message };
    }
}

export async function GET() {
    if (!ADMIN_ACCESS_TOKEN) {
        return NextResponse.json({ error: "Configuration Error: SHOPIFY_ADMIN_ACCESS_TOKEN is missing in process.env" }, { status: 500 });
    }

    const checks = [];

    // 1. Basic Connection & Read Scope
    checks.push(await testQuery(`{ shop { name myshopifyDomain } }`, "Read Shop Info"));

    // 2. Check Price Rules Read Scope
    checks.push(await testQuery(`{ priceRules(first: 1) { edges { node { id title } } } }`, "Read Price Rules"));

    // 3. Test Creation (We won't actually create, just check if we get a 'Access Denied' immediately or schema error)
    // We'll try to query a mutation schema specifically or just rely on the Read check failing if scopes are missing.
    // Usually if you can't read price rules, you can't write them.

    return NextResponse.json({
        env: {
            domain: SHOPIFY_DOMAIN,
            tokenPrefix: ADMIN_ACCESS_TOKEN.substring(0, 6) + "...",
        },
        checks
    });
}
