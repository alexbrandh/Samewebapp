import { NextResponse } from 'next/server';
import { getAdminAccessToken } from '@/lib/shopify-token';

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const API_VERSION = '2026-01';

// ── Helper: Admin API request ──
async function adminRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getAdminAccessToken();
  const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Shopify Admin API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// ── Sleep helper for rate limiting ──
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Product Data ──
interface ProductData {
  num: number;
  inspiration: string;
  brand: string;
  gender: 'Hombre' | 'Mujer' | 'Unisex';
  occasion: string;
}

const PRODUCTS: ProductData[] = [
  // SEDUCCIÓN (1-9)
  { num: 1, inspiration: 'Aventus', brand: 'Creed', gender: 'Hombre', occasion: 'Seducción' },
  { num: 2, inspiration: 'Layton', brand: 'Parfums de Marly', gender: 'Unisex', occasion: 'Seducción' },
  { num: 3, inspiration: 'Sauvage Elixir', brand: 'Dior', gender: 'Hombre', occasion: 'Seducción' },
  { num: 4, inspiration: 'Good Girl', brand: 'Carolina Herrera', gender: 'Mujer', occasion: 'Seducción' },
  { num: 5, inspiration: 'Coco Mademoiselle', brand: 'Chanel', gender: 'Mujer', occasion: 'Seducción' },
  { num: 6, inspiration: 'Intense Café', brand: 'Montale', gender: 'Mujer', occasion: 'Seducción' },
  { num: 7, inspiration: 'Tobacco Vanille', brand: 'Tom Ford', gender: 'Unisex', occasion: 'Seducción' },
  { num: 8, inspiration: 'Roses Musk', brand: 'Montale', gender: 'Mujer', occasion: 'Seducción' },
  { num: 9, inspiration: 'Le Beau', brand: 'Jean Paul Gaultier', gender: 'Hombre', occasion: 'Seducción' },

  // RUMBA / NOCHE (10-18)
  { num: 10, inspiration: 'Eros', brand: 'Versace', gender: 'Hombre', occasion: 'Rumba' },
  { num: 11, inspiration: '212 VIP Black', brand: 'Carolina Herrera', gender: 'Hombre', occasion: 'Rumba' },
  { num: 12, inspiration: 'Born in Roma Uomo', brand: 'Valentino', gender: 'Hombre', occasion: 'Rumba' },
  { num: 13, inspiration: 'La Vie Est Belle', brand: 'Lancôme', gender: 'Mujer', occasion: 'Rumba' },
  { num: 14, inspiration: 'Flowerbomb', brand: 'Viktor & Rolf', gender: 'Mujer', occasion: 'Rumba' },
  { num: 15, inspiration: 'Yara', brand: 'Lattafa', gender: 'Mujer', occasion: 'Rumba' },
  { num: 16, inspiration: 'Erba Pura', brand: 'Xerjoff', gender: 'Unisex', occasion: 'Rumba' },
  { num: 17, inspiration: 'Starry Nights', brand: 'Montale', gender: 'Unisex', occasion: 'Rumba' },
  { num: 18, inspiration: '9PM Elixir', brand: 'Afnan', gender: 'Hombre', occasion: 'Rumba' },

  // PLAYA / SOL (19-26)
  { num: 19, inspiration: 'Aqua Di Gio', brand: 'Armani', gender: 'Hombre', occasion: 'Playa' },
  { num: 20, inspiration: 'Aqua Di Gio Profondo', brand: 'Armani', gender: 'Hombre', occasion: 'Playa' },
  { num: 21, inspiration: 'Issey Miyake Pour Homme', brand: 'Issey Miyake', gender: 'Hombre', occasion: 'Playa' },
  { num: 22, inspiration: 'Swiss Army Classic', brand: 'Victorinox', gender: 'Hombre', occasion: 'Playa' },
  { num: 23, inspiration: 'Light Blue', brand: 'Dolce & Gabbana', gender: 'Mujer', occasion: 'Playa' },
  { num: 24, inspiration: 'Chance', brand: 'Chanel', gender: 'Mujer', occasion: 'Playa' },
  { num: 25, inspiration: 'Cloud', brand: 'Ariana Grande', gender: 'Mujer', occasion: 'Playa' },
  { num: 26, inspiration: 'Azzure', brand: 'Orientica', gender: 'Unisex', occasion: 'Playa' },

  // DIARIO / CASUAL (27-34)
  { num: 27, inspiration: 'Sauvage', brand: 'Dior', gender: 'Hombre', occasion: 'Diario' },
  { num: 28, inspiration: 'Bleu de Chanel', brand: 'Chanel', gender: 'Hombre', occasion: 'Diario' },
  { num: 29, inspiration: 'Y', brand: 'Yves Saint Laurent', gender: 'Hombre', occasion: 'Diario' },
  { num: 30, inspiration: '212', brand: 'Carolina Herrera', gender: 'Hombre', occasion: 'Diario' },
  { num: 31, inspiration: 'Yara Tous', brand: 'Lattafa', gender: 'Mujer', occasion: 'Diario' },
  { num: 32, inspiration: 'Bvlgari Omnia', brand: 'Bvlgari', gender: 'Mujer', occasion: 'Diario' },
  { num: 33, inspiration: 'Silver Mountain Water', brand: 'Creed', gender: 'Unisex', occasion: 'Diario' },
  { num: 34, inspiration: 'Santal 33', brand: 'Le Labo', gender: 'Unisex', occasion: 'Diario' },

  // NEGOCIOS / OFICINA (35-42)
  { num: 35, inspiration: 'Aventus Cologne', brand: 'Creed', gender: 'Hombre', occasion: 'Negocios' },
  { num: 36, inspiration: 'Bleu de Chanel Parfum', brand: 'Chanel', gender: 'Hombre', occasion: 'Negocios' },
  { num: 37, inspiration: 'Valentino Uomo Intense', brand: 'Valentino', gender: 'Hombre', occasion: 'Negocios' },
  { num: 38, inspiration: 'Chance Eau Tendre', brand: 'Chanel', gender: 'Mujer', occasion: 'Negocios' },
  { num: 39, inspiration: 'Coco Noir', brand: 'Chanel', gender: 'Mujer', occasion: 'Negocios' },
  { num: 40, inspiration: 'Narciso Rodriguez For Her', brand: 'Narciso Rodriguez', gender: 'Mujer', occasion: 'Negocios' },
  { num: 41, inspiration: 'Lafayette Street', brand: 'Bond No.9', gender: 'Unisex', occasion: 'Negocios' },
  { num: 42, inspiration: 'The Scent of Peace', brand: 'Bond No.9', gender: 'Unisex', occasion: 'Negocios' },

  // DEPORTE / FRESCO (43-49)
  { num: 43, inspiration: 'Dior Homme Cologne', brand: 'Dior', gender: 'Hombre', occasion: 'Deporte' },
  { num: 44, inspiration: 'CK One', brand: 'Calvin Klein', gender: 'Unisex', occasion: 'Deporte' },
  { num: 45, inspiration: 'Versace Pour Homme', brand: 'Versace', gender: 'Hombre', occasion: 'Deporte' },
  { num: 46, inspiration: 'Light Blue Forever', brand: 'Dolce & Gabbana', gender: 'Mujer', occasion: 'Deporte' },
  { num: 47, inspiration: 'Omnia Crystalline', brand: 'Bvlgari', gender: 'Mujer', occasion: 'Deporte' },
  { num: 48, inspiration: 'Azzaro Chrome', brand: 'Azzaro', gender: 'Hombre', occasion: 'Deporte' },
  { num: 49, inspiration: 'Nautica Voyage', brand: 'Nautica', gender: 'Hombre', occasion: 'Deporte' },
];

// ── Occasion metadata ──
const OCCASION_META: Record<string, { title: string; description: string }> = {
  'Seducción': {
    title: 'Seducción',
    description: 'Magnéticos, envolventes, cercanos. Fragancias diseñadas para cautivar.',
  },
  'Rumba': {
    title: 'Rumba / Noche',
    description: 'Presencia, proyección, impacto. Para las noches que importan.',
  },
  'Playa': {
    title: 'Playa / Sol',
    description: 'Frescos, ligeros, vacaciones. Aromas que evocan la brisa del mar.',
  },
  'Diario': {
    title: 'Diario / Casual',
    description: 'Versátiles, limpios, cotidianos. Tu firma de cada día.',
  },
  'Negocios': {
    title: 'Negocios / Oficina',
    description: 'Elegancia, profesionalismo. Fragancias que proyectan confianza.',
  },
  'Deporte': {
    title: 'Deporte / Fresco',
    description: 'Energía, limpieza, post-gym. Frescura que te acompaña.',
  },
};

// ── Build product payload ──
function buildProductPayload(p: ProductData) {
  const numStr = String(p.num).padStart(2, '0');
  const title = `SAME ${numStr}`;
  const handle = `same-${numStr}`;

  const genderLabel = p.gender === 'Hombre' ? 'para Él' : p.gender === 'Mujer' ? 'para Ella' : 'Unisex';

  const description = `<p><strong>${title}</strong> — Inspirado en <em>${p.inspiration}</em> de <em>${p.brand}</em>.</p>
<p>Una fragancia ${genderLabel} de la colección <strong>${OCCASION_META[p.occasion]?.title || p.occasion}</strong>.</p>
<p>Disponible en dos concentraciones: <strong>Au Parfum</strong> (clásica, equilibrada) y <strong>Elixir</strong> (intensa, duradera).</p>
<p>Tamaños: 30ml, 50ml y 100ml.</p>`;

  // Tags: gender + occasion + special tags
  const tags = [
    p.gender === 'Hombre' ? 'Hombres' : p.gender === 'Mujer' ? 'Mujeres' : 'Unisex',
    p.occasion,
  ];

  // Mark some as bestsellers or new based on images
  const bestsellerNums = [1, 3, 5, 10, 12, 13, 19, 27, 28]; // top picks
  const newNums = [41, 42, 43, 44, 45, 46, 47, 48, 49]; // deporte category = newer

  if (bestsellerNums.includes(p.num)) tags.push('Mas vendidos');
  if (newNums.includes(p.num)) tags.push('Nuevo');

  return {
    product: {
      title,
      handle,
      body_html: description,
      vendor: 'SAME.',
      product_type: 'Perfume',
      tags: tags.join(', '),
      published: true,
      options: [
        { name: 'Tipo', values: ['Au Parfum', 'Elixir'] },
        { name: 'Tamaño', values: ['30ml', '50ml', '100ml'] },
      ],
      variants: [
        { option1: 'Au Parfum', option2: '30ml', price: '55000.00', sku: `SAME${numStr}-AP-30`, inventory_management: null, inventory_policy: 'continue' },
        { option1: 'Au Parfum', option2: '50ml', price: '85000.00', sku: `SAME${numStr}-AP-50`, inventory_management: null, inventory_policy: 'continue' },
        { option1: 'Au Parfum', option2: '100ml', price: '105000.00', sku: `SAME${numStr}-AP-100`, inventory_management: null, inventory_policy: 'continue' },
        { option1: 'Elixir', option2: '30ml', price: '95000.00', sku: `SAME${numStr}-EL-30`, inventory_management: null, inventory_policy: 'continue' },
        { option1: 'Elixir', option2: '50ml', price: '145000.00', sku: `SAME${numStr}-EL-50`, inventory_management: null, inventory_policy: 'continue' },
        { option1: 'Elixir', option2: '100ml', price: '205000.00', sku: `SAME${numStr}-EL-100`, inventory_management: null, inventory_policy: 'continue' },
      ],
      metafields: [
        {
          namespace: 'custom',
          key: 'inspiration_brand',
          value: `${p.inspiration} de ${p.brand}`,
          type: 'single_line_text_field',
        },
      ],
    },
  };
}

// ── Main seed function ──
export async function POST(request: Request) {
  // Simple auth check
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  if (secret !== 'same2026seed') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: { products: any[]; collections: any[]; assignments: any[]; errors: string[] } = {
    products: [],
    collections: [],
    assignments: [],
    errors: [],
  };

  try {
    // ── Step 1: Create occasion collections ──
    console.log('Creating occasion collections...');
    const collectionMap: Record<string, string> = {};

    for (const [key, meta] of Object.entries(OCCASION_META)) {
      try {
        const col = await adminRequest('custom_collections.json', {
          method: 'POST',
          body: JSON.stringify({
            custom_collection: {
              title: meta.title,
              body_html: `<p>${meta.description}</p>`,
              published: true,
            },
          }),
        });
        collectionMap[key] = col.custom_collection.id;
        results.collections.push({ title: meta.title, id: col.custom_collection.id });
        console.log(`  ✓ Collection: ${meta.title} (${col.custom_collection.id})`);
        await sleep(500);
      } catch (err: any) {
        results.errors.push(`Collection "${meta.title}": ${err.message}`);
        console.error(`  ✗ Collection "${meta.title}":`, err.message);
      }
    }

    // ── Step 1b: Create gender collections ──
    const genderCollections = [
      { key: 'Hombres', title: 'Hombre', desc: 'Fragancias para él. Encuentra tu aroma ideal.' },
      { key: 'Mujeres', title: 'Mujer', desc: 'Fragancias para ella. Descubre tu esencia.' },
      { key: 'Unisex', title: 'Unisex', desc: 'Fragancias sin género. Para todos.' },
    ];

    const genderCollectionMap: Record<string, string> = {};

    for (const gc of genderCollections) {
      try {
        const col = await adminRequest('custom_collections.json', {
          method: 'POST',
          body: JSON.stringify({
            custom_collection: {
              title: gc.title,
              body_html: `<p>${gc.desc}</p>`,
              published: true,
            },
          }),
        });
        genderCollectionMap[gc.key] = col.custom_collection.id;
        results.collections.push({ title: gc.title, id: col.custom_collection.id });
        console.log(`  ✓ Gender Collection: ${gc.title} (${col.custom_collection.id})`);
        await sleep(500);
      } catch (err: any) {
        results.errors.push(`Gender Collection "${gc.title}": ${err.message}`);
      }
    }

    // ── Step 1c: Create special collections ──
    const specialCollections = [
      { key: 'bestsellers', title: 'Más Vendidos', desc: 'Las fragancias más populares de SAME.' },
      { key: 'new', title: 'Nuevos', desc: 'Los últimos lanzamientos de SAME.' },
    ];

    const specialCollectionMap: Record<string, string> = {};

    for (const sc of specialCollections) {
      try {
        const col = await adminRequest('custom_collections.json', {
          method: 'POST',
          body: JSON.stringify({
            custom_collection: {
              title: sc.title,
              body_html: `<p>${sc.desc}</p>`,
              published: true,
            },
          }),
        });
        specialCollectionMap[sc.key] = col.custom_collection.id;
        results.collections.push({ title: sc.title, id: col.custom_collection.id });
        console.log(`  ✓ Special Collection: ${sc.title} (${col.custom_collection.id})`);
        await sleep(500);
      } catch (err: any) {
        results.errors.push(`Special Collection "${sc.title}": ${err.message}`);
      }
    }

    // ── Step 2: Create products ──
    console.log('\nCreating products...');

    for (const p of PRODUCTS) {
      const numStr = String(p.num).padStart(2, '0');
      try {
        const payload = buildProductPayload(p);
        const result = await adminRequest('products.json', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        const productId = result.product.id;
        results.products.push({
          num: p.num,
          title: `SAME ${numStr}`,
          id: productId,
          inspiration: `${p.inspiration} - ${p.brand}`,
        });
        console.log(`  ✓ SAME ${numStr} - ${p.inspiration} (${p.brand}) [${p.gender}] → ${productId}`);

        // ── Step 3: Assign to collections ──
        // Occasion collection
        if (collectionMap[p.occasion]) {
          try {
            await adminRequest('collects.json', {
              method: 'POST',
              body: JSON.stringify({
                collect: { product_id: productId, collection_id: collectionMap[p.occasion] },
              }),
            });
          } catch (err: any) {
            results.errors.push(`Assign SAME ${numStr} → ${p.occasion}: ${err.message}`);
          }
        }

        // Gender collection
        const genderTag = p.gender === 'Hombre' ? 'Hombres' : p.gender === 'Mujer' ? 'Mujeres' : 'Unisex';
        if (genderCollectionMap[genderTag]) {
          try {
            await adminRequest('collects.json', {
              method: 'POST',
              body: JSON.stringify({
                collect: { product_id: productId, collection_id: genderCollectionMap[genderTag] },
              }),
            });
          } catch (err: any) {
            results.errors.push(`Assign SAME ${numStr} → ${genderTag}: ${err.message}`);
          }
        }

        // Special collections (bestsellers/new)
        const bestsellerNums = [1, 3, 5, 10, 12, 13, 19, 27, 28];
        const newNums = [41, 42, 43, 44, 45, 46, 47, 48, 49];

        if (bestsellerNums.includes(p.num) && specialCollectionMap['bestsellers']) {
          try {
            await adminRequest('collects.json', {
              method: 'POST',
              body: JSON.stringify({
                collect: { product_id: productId, collection_id: specialCollectionMap['bestsellers'] },
              }),
            });
          } catch (err: any) {
            results.errors.push(`Assign SAME ${numStr} → bestsellers: ${err.message}`);
          }
        }

        if (newNums.includes(p.num) && specialCollectionMap['new']) {
          try {
            await adminRequest('collects.json', {
              method: 'POST',
              body: JSON.stringify({
                collect: { product_id: productId, collection_id: specialCollectionMap['new'] },
              }),
            });
          } catch (err: any) {
            results.errors.push(`Assign SAME ${numStr} → new: ${err.message}`);
          }
        }

        // Rate limiting: ~2 calls per second max
        await sleep(600);
      } catch (err: any) {
        results.errors.push(`Product SAME ${numStr}: ${err.message}`);
        console.error(`  ✗ SAME ${numStr}: ${err.message}`);
        await sleep(600);
      }
    }

    console.log('\n=== SEED COMPLETE ===');
    console.log(`Products: ${results.products.length}/${PRODUCTS.length}`);
    console.log(`Collections: ${results.collections.length}`);
    console.log(`Errors: ${results.errors.length}`);

    return NextResponse.json({
      success: true,
      summary: {
        productsCreated: results.products.length,
        collectionsCreated: results.collections.length,
        errors: results.errors.length,
      },
      products: results.products,
      collections: results.collections,
      errors: results.errors,
    });
  } catch (error: any) {
    console.error('Seed failed:', error);
    return NextResponse.json(
      { error: error.message, partialResults: results },
      { status: 500 }
    );
  }
}
