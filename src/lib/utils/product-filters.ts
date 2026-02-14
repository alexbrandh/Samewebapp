import { ShopifyProduct, ShopifyMetafield } from '../types/shopify';

/**
 * Extrae el valor de un metafield específico de un producto
 */
export function getMetafieldValue(product: ShopifyProduct, key: string): string | null {
  if (!product.metafields) return null;
  
  const metafield = product.metafields.find((mf) => mf != null && mf.key === key);
  return metafield?.value || null;
}

/**
 * Extrae valores de un metafield que contiene lista separada por comas
 */
export function getMetafieldArray(product: ShopifyProduct, key: string): string[] {
  const value = getMetafieldValue(product, key);
  if (!value) return [];
  
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Normaliza el nombre de una marca extrayendo solo la marca base
 */
function normalizeBrandName(brandName: string): string {
  // Mapa de normalizaciones conocidas
  const brandMap: Record<string, string> = {
    // Carolina Herrera
    '212': 'Carolina Herrera',
    'CH': 'Carolina Herrera',
    // Cartier
    'Cartier': 'Cartier',
    // Otras marcas comunes
    'Tom Ford': 'Tom Ford',
    'Dior': 'Dior',
    'Chanel': 'Chanel',
    'YSL': 'Yves Saint Laurent',
    'Yves Saint Laurent': 'Yves Saint Laurent',
    'MFK': 'Maison Francis Kurkdjian',
    'Maison Francis Kurkdjian': 'Maison Francis Kurkdjian',
    'Juliette Has A Gun': 'Juliette Has A Gun',
    'Maison Margiela': 'Maison Margiela',
    'Le Labo': 'Le Labo',
    'Hermès': 'Hermès',
    'Hermes': 'Hermès',
    'Creed': 'Creed',
    'Versace': 'Versace',
    'Gucci': 'Gucci',
    'Prada': 'Prada',
    'Armani': 'Giorgio Armani',
    'Giorgio Armani': 'Giorgio Armani',
    'Givenchy': 'Givenchy',
    'Burberry': 'Burberry',
    'Dolce & Gabbana': 'Dolce & Gabbana',
    'D&G': 'Dolce & Gabbana',
    'Jean Paul Gaultier': 'Jean Paul Gaultier',
    'JPG': 'Jean Paul Gaultier',
    'Lancôme': 'Lancôme',
    'Lancome': 'Lancôme',
    'Valentino': 'Valentino',
    'Viktor & Rolf': 'Viktor & Rolf',
    'Paco Rabanne': 'Paco Rabanne'
  };
  
  // Buscar si el nombre contiene alguna de las claves conocidas
  const lowerBrand = brandName.toLowerCase();
  
  // Primero intentar match exacto
  for (const [key, normalized] of Object.entries(brandMap)) {
    if (brandName === key) {
      return normalized;
    }
  }
  
  // Luego buscar si el nombre contiene alguna marca conocida
  for (const [key, normalized] of Object.entries(brandMap)) {
    if (lowerBrand.includes(key.toLowerCase())) {
      return normalized;
    }
  }
  
  // Si empieza con números (como "212"), extraer hasta el primer espacio
  if (/^\d/.test(brandName)) {
    const match = brandName.match(/^(\d+)/);
    if (match) {
      const numericPart = match[1];
      return brandMap[numericPart] || brandName;
    }
  }
  
  // Si no se encuentra match, retornar el nombre original
  return brandName;
}

/**
 * Obtiene todas las marcas de inspiración únicas de una lista de productos
 */
export function getUniqueInspirationBrands(products: ShopifyProduct[]): string[] {
  const brands = new Set<string>();
  
  products.forEach((product) => {
    const brand = getMetafieldValue(product, 'inspiration_brand');
    if (brand) {
      // Normalizar el nombre de la marca
      const normalizedBrand = normalizeBrandName(brand);
      brands.add(normalizedBrand);
    }
  });
  
  return Array.from(brands).sort();
}

/**
 * Obtiene todas las notas aromáticas únicas de una lista de productos
 */
export function getUniqueAromaticNotes(products: ShopifyProduct[]): string[] {
  const notes = new Set<string>();
  
  products.forEach((product) => {
    const productNotes = getMetafieldArray(product, 'aromatic_notes');
    productNotes.forEach((note) => notes.add(note));
  });
  
  return Array.from(notes).sort();
}

/**
 * Obtiene todos los géneros únicos de una lista de productos basados en tags
 * Siempre retorna todas las opciones de género disponibles
 */
export function getUniqueGenders(products: ShopifyProduct[]): string[] {
  // Siempre retornar todas las opciones de género
  return ['Men', 'Unisex', 'Women'];
}

/**
 * Obtiene todas las familias de fragancias únicas de una lista de productos basadas en tags
 */
export function getUniqueFragranceFamilies(products: ShopifyProduct[]): string[] {
  const families = new Set<string>();
  const familyKeywords = [
    'floral', 'flowery', 'fresh', 'gourmand', 'herbal', 'earthy', 'warm',
    'woody', 'aromatic', 'citrus', 'oriental', 'fruity', 'aquatic', 'spicy'
  ];
  
  products.forEach((product) => {
    product.tags.forEach((tag) => {
      const lowerTag = tag.toLowerCase();
      if (familyKeywords.includes(lowerTag)) {
        // Capitalizar primera letra
        families.add(tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase());
      }
    });
  });
  
  return Array.from(families).sort();
}

/**
 * Filtra productos basándose en múltiples criterios
 */
export interface ProductFilterOptions {
  searchQuery?: string;
  genders?: string[];
  brands?: string[];
  aromaticNotes?: string[];
  fragranceFamilies?: string[];
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
}

export function filterProducts(
  products: ShopifyProduct[],
  options: ProductFilterOptions
): ShopifyProduct[] {
  return products.filter((product) => {
    // Filtro de búsqueda por texto
    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase();
      const titleMatch = product.title.toLowerCase().includes(query);
      const descriptionMatch = product.description?.toLowerCase().includes(query);
      const brandMatch = getMetafieldValue(product, 'inspiration_brand')
        ?.toLowerCase()
        .includes(query);
      const notesMatch = getMetafieldArray(product, 'aromatic_notes').some((note) =>
        note.toLowerCase().includes(query)
      );
      
      if (!titleMatch && !descriptionMatch && !brandMatch && !notesMatch) {
        return false;
      }
    }
    
    // Filtro por género (basado en tags)
    if (options.genders && options.genders.length > 0) {
      const hasGenderMatch = options.genders.some((gender) => {
        const lowerGender = gender.toLowerCase();
        return product.tags.some((tag) => {
          const lowerTag = tag.toLowerCase();
          return lowerTag === lowerGender || 
                 (lowerGender === 'men' && lowerTag === 'male') ||
                 (lowerGender === 'women' && lowerTag === 'female');
        });
      });
      
      if (!hasGenderMatch) return false;
    }
    
    // Filtro por marca de inspiración
    if (options.brands && options.brands.length > 0) {
      const productBrand = getMetafieldValue(product, 'inspiration_brand');
      if (!productBrand) return false;
      
      // Normalizar la marca del producto y comparar con las marcas seleccionadas
      const normalizedProductBrand = normalizeBrandName(productBrand);
      if (!options.brands.includes(normalizedProductBrand)) {
        return false;
      }
    }
    
    // Filtro por notas aromáticas
    if (options.aromaticNotes && options.aromaticNotes.length > 0) {
      const productNotes = getMetafieldArray(product, 'aromatic_notes');
      const hasNoteMatch = options.aromaticNotes.some((note) =>
        productNotes.some((pNote) => 
          pNote.toLowerCase() === note.toLowerCase()
        )
      );
      
      if (!hasNoteMatch) return false;
    }
    
    // Filtro por familia de fragancia (basado en tags)
    if (options.fragranceFamilies && options.fragranceFamilies.length > 0) {
      const hasFamilyMatch = options.fragranceFamilies.some((family) =>
        product.tags.some((tag) => 
          tag.toLowerCase() === family.toLowerCase()
        )
      );
      
      if (!hasFamilyMatch) return false;
    }
    
    // Filtro por rango de precio
    const price = parseFloat(product.variants.edges[0]?.node.price.amount || '0');
    if (options.minPrice !== undefined && price < options.minPrice) {
      return false;
    }
    if (options.maxPrice !== undefined && price > options.maxPrice) {
      return false;
    }
    
    // Filtro por tags específicos
    if (options.tags && options.tags.length > 0) {
      const hasTagMatch = options.tags.some((filterTag) =>
        product.tags.some((productTag) => 
          productTag.toLowerCase() === filterTag.toLowerCase()
        )
      );
      
      if (!hasTagMatch) return false;
    }
    
    return true;
  });
}

/**
 * Ordena productos según diferentes criterios
 */
export type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest' | 'bestselling';

export function sortProducts(
  products: ShopifyProduct[],
  sortBy: SortOption
): ShopifyProduct[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.variants.edges[0]?.node.price.amount || '0');
        const priceB = parseFloat(b.variants.edges[0]?.node.price.amount || '0');
        return priceA - priceB;
      });
      
    case 'price-high':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.variants.edges[0]?.node.price.amount || '0');
        const priceB = parseFloat(b.variants.edges[0]?.node.price.amount || '0');
        return priceB - priceA;
      });
      
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      
    case 'bestselling':
      // Priorizar productos con tag 'bestseller' o 'best-seller'
      return sorted.sort((a, b) => {
        const aIsBestseller = a.tags.some(tag => 
          tag.toLowerCase().includes('bestseller') || tag.toLowerCase().includes('best-seller')
        );
        const bIsBestseller = b.tags.some(tag => 
          tag.toLowerCase().includes('bestseller') || tag.toLowerCase().includes('best-seller')
        );
        
        if (aIsBestseller && !bIsBestseller) return -1;
        if (!aIsBestseller && bIsBestseller) return 1;
        return 0;
      });
      
    case 'featured':
    default:
      // Mantener orden original (featured)
      return sorted;
  }
}
