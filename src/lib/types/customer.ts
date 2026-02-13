// Tipos para Shopify Customer Account API

export interface CustomerAddress {
  id: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  provinceCode?: string;
  zip: string;
  country: string;
  countryCode: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  displayName: string;
  defaultAddress?: CustomerAddress;
  addresses: CustomerAddress[];
  ordersCount: number;
  createdAt: string;
  updatedAt: string;
  metafields?: CustomerMetafield[];
}

export interface CustomerMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface OrderLineItem {
  id: string;
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      url: string;
      altText?: string;
    };
    product: {
      id: string;
      handle: string;
    };
  };
  originalTotalPrice: {
    amount: string;
    currencyCode: string;
  };
  discountedTotalPrice: {
    amount: string;
    currencyCode: string;
  };
}

export interface Order {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus: 'FULFILLED' | 'UNFULFILLED' | 'PARTIALLY_FULFILLED' | 'RESTOCKED';
  financialStatus: 'PENDING' | 'AUTHORIZED' | 'PARTIALLY_PAID' | 'PAID' | 'PARTIALLY_REFUNDED' | 'REFUNDED' | 'VOIDED';
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalShippingPrice: {
    amount: string;
    currencyCode: string;
  };
  totalTax: {
    amount: string;
    currencyCode: string;
  };
  lineItems: OrderLineItem[];
  shippingAddress?: CustomerAddress;
  trackingInfo?: {
    company?: string;
    number?: string;
    url?: string;
  }[];
  cancelReason?: string;
  canceledAt?: string;
}

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface CustomerAuthError {
  message: string;
  field?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptsMarketing?: boolean;
}

export interface CustomerUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  acceptsMarketing?: boolean;
}

export interface FavoriteProduct {
  id: string;
  handle: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  image?: {
    url: string;
    altText?: string;
  };
}
