/**
 * Shopify Admin API Token Management
 * Usa Client Credentials Grant para obtener y renovar tokens automáticamente.
 * Los tokens del Client Credentials Grant expiran cada ~24h.
 */

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;

// Cache del token en memoria
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Obtiene un Admin API access token válido.
 * Si hay Client Credentials configuradas, usa el grant para obtener/renovar tokens.
 * Si no, usa el token estático de SHOPIFY_ADMIN_ACCESS_TOKEN.
 */
export async function getAdminAccessToken(): Promise<string> {
  // Si no hay Client Credentials, usar token estático
  if (!SHOPIFY_CLIENT_ID || !SHOPIFY_CLIENT_SECRET) {
    const staticToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    if (!staticToken) {
      throw new Error('No Shopify Admin credentials configured (neither Client Credentials nor static token)');
    }
    return staticToken;
  }

  // Si el token cacheado aún es válido (con 5 min de margen), usarlo
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 5 * 60 * 1000) {
    return cachedToken;
  }

  // Obtener nuevo token via Client Credentials Grant
  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: SHOPIFY_CLIENT_ID,
          client_secret: SHOPIFY_CLIENT_SECRET,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get admin token: ${response.status} - ${error}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    // expires_in está en segundos, convertir a timestamp
    tokenExpiresAt = now + (data.expires_in || 86399) * 1000;

    return cachedToken!;
  } catch (error) {
    // Fallback al token estático si el refresh falla
    const fallback = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    if (fallback) {
      console.warn('Client Credentials refresh failed, using static token:', error);
      return fallback;
    }
    throw error;
  }
}
