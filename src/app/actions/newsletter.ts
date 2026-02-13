'use server';

const SHOPIFY_ADMIN_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2026-01`;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

export async function subscribeToNewsletter(email: string) {
  if (!email) {
    return { success: false, message: 'Email is required' };
  }

  console.log('--- DEBUG NEWSLETTER ---');
  console.log('Token configured:', !!SHOPIFY_ADMIN_ACCESS_TOKEN);
  console.log('Token length:', SHOPIFY_ADMIN_ACCESS_TOKEN ? SHOPIFY_ADMIN_ACCESS_TOKEN.length : 0);
  console.log('Env var keys:', Object.keys(process.env).filter(key => key.includes('SHOPIFY')));

  if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
    console.error('SHOPIFY_ADMIN_ACCESS_TOKEN is not configured');
    return { success: false, message: 'Server configuration error' };
  }

  try {
    // 1. Check if customer exists
    const searchResponse = await fetch(
      `${SHOPIFY_ADMIN_API_URL}/customers/search.json?query=email:${email}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
        },
      }
    );

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Error searching customer:', errorText);
      throw new Error('Failed to search customer');
    }

    const { customers } = await searchResponse.json();

    if (customers && customers.length > 0) {
      // 2. Customer exists, update them
      const customerId = customers[0].id;
      const existingTags = customers[0].tags || '';
      const newTags = existingTags.includes('newsletter') ? existingTags : `${existingTags},newsletter`;

      const updateResponse = await fetch(
        `${SHOPIFY_ADMIN_API_URL}/customers/${customerId}.json`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
          },
          body: JSON.stringify({
            customer: {
              id: customerId,
              email_marketing_consent: {
                state: 'subscribed',
                opt_in_level: 'single_opt_in',
                consent_updated_at: new Date(Date.now() - 5000).toISOString()
              },
              tags: newTags,
            },
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error('Failed to update customer');
      }
    } else {
      // 3. Customer does not exist, create them
      const createResponse = await fetch(
        `${SHOPIFY_ADMIN_API_URL}/customers.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
          },
          body: JSON.stringify({
            customer: {
              email: email,
              email_marketing_consent: {
                state: 'subscribed',
                opt_in_level: 'single_opt_in',
                consent_updated_at: new Date(Date.now() - 5000).toISOString()
              },
              tags: 'newsletter',
              verified_email: true,
              send_email_welcome: false
            },
          }),
        }
      );

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('Error creating customer:', errorText);
        throw new Error(`Failed to create customer: ${errorText}`);
      }
    }

    return { success: true, message: 'Successfully subscribed' };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, message: `Failed to subscribe: ${(error as Error).message}` };
  }
}
