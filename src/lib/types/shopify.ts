// Tipos TypeScript para Shopify Storefront API

export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyMetafield {
  key: string;
  value: string;
  type: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  image?: ShopifyImage;
  quantityAvailable?: number;
  product?: ShopifyProduct;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  options?: {
    id: string;
    name: string;
    values: string[];
  }[];
  descriptionHtml?: string;
  availableForSale?: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  featuredImage?: ShopifyImage;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  seo?: {
    title?: string;
    description?: string;
  };
  metafields?: ShopifyMetafield[];
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: ShopifyProductVariant;
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
    compareAtAmountPerQuantity?: ShopifyMoney;
  };
  attributes: {
    key: string;
    value: string;
  }[];
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: {
      node: ShopifyCartLine;
    }[];
  };
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
    totalTaxAmount?: ShopifyMoney;
    totalDutyAmount?: ShopifyMoney;
  };
  buyerIdentity: {
    email?: string;
    phone?: string;
    customer?: {
      id: string;
    };
    countryCode?: string;
  };
  attributes: {
    key: string;
    value: string;
  }[];
  discountCodes: {
    code: string;
    applicable: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image?: ShopifyImage;
  products: {
    edges: {
      node: ShopifyProduct;
    }[];
  };
  seo: {
    title?: string;
    description?: string;
  };
}

// Tipos para las respuestas de GraphQL
export interface ProductsResponse {
  products: {
    edges: {
      node: ShopifyProduct;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  };
}

export interface ProductResponse {
  product: ShopifyProduct | null;
}

export interface CollectionsResponse {
  collections: {
    edges: {
      node: ShopifyCollection;
    }[];
  };
}

export interface CartResponse {
  cart: ShopifyCart | null;
}

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart | null;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart | null;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart | null;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart | null;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

// Tipos para inputs
export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  attributes?: {
    key: string;
    value: string;
  }[];
}

export interface CartInput {
  lines?: CartLineInput[];
  attributes?: {
    key: string;
    value: string;
  }[];
  buyerIdentity?: {
    email?: string;
    phone?: string;
    countryCode?: string;
  };
  discountCodes?: string[];
}

// Tipos para filtros y opciones
export interface ProductFilters {
  available?: boolean;
  productType?: string;
  vendor?: string;
  tag?: string;
  query?: string;
}

export interface SortOptions {
  sortKey: 'TITLE' | 'PRICE' | 'BEST_SELLING' | 'CREATED_AT' | 'ID' | 'MANUAL' | 'UPDATED_AT' | 'VENDOR';
  reverse?: boolean;
}

export interface PaginationOptions {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
}

// Tipos de error
export interface ShopifyError {
  message: string;
  locations?: {
    line: number;
    column: number;
  }[];
  path?: string[];
  extensions?: {
    code: string;
    [key: string]: any;
  };
}

export interface ShopifyResponse<T> {
  data?: T;
  errors?: ShopifyError[];
  extensions?: {
    cost: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}