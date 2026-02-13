'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCustomer } from '@/contexts/customer-context';
import { getOrder } from '@/lib/shopify-customer';
import { formatPrice } from '@/lib/shopify';
import { ArrowLeft, Package, MapPin, CreditCard } from 'phosphor-react';
import type { Order } from '@/lib/types/customer';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken } = useCustomer();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!accessToken || !params.id) return;

      try {
        const orderId = decodeURIComponent(params.id as string);
        const orderData = await getOrder(accessToken, orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [accessToken, params.id]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Package size={64} className="text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find the order you're looking for.
        </p>
        <Link
          href="/account/orders"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Orders</span>
      </button>

      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Order #{order.orderNumber}
            </h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.processedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              order.fulfillmentStatus === 'FULFILLED'
                ? 'bg-green-100 text-green-800 border-green-200'
                : order.fulfillmentStatus === 'UNFULFILLED'
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            }`}>
              {order.fulfillmentStatus.replace('_', ' ')}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              order.financialStatus === 'PAID'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            }`}>
              {order.financialStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.lineItems.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0">
                  {/* Image */}
                  <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
                    {item.variant?.image?.url ? (
                      <Image
                        src={item.variant.image.url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={32} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.variant.product.handle}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {item.title}
                    </Link>
                    {item.variant.title !== 'Default Title' && (
                      <p className="text-sm text-muted-foreground">{item.variant.title}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {formatPrice(item.discountedTotalPrice.amount, item.discountedTotalPrice.currencyCode)}
                    </p>
                    {item.originalTotalPrice.amount !== item.discountedTotalPrice.amount && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(item.originalTotalPrice.amount, item.originalTotalPrice.currencyCode)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">
                  {formatPrice(order.subtotalPrice.amount, order.subtotalPrice.currencyCode)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {formatPrice(order.totalShippingPrice.amount, order.totalShippingPrice.currencyCode)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">
                  {formatPrice(order.totalTax.amount, order.totalTax.currencyCode)}
                </span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">
                  {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-primary" weight="fill" />
                <h2 className="text-lg font-semibold text-foreground">Shipping Address</h2>
              </div>
              <div className="text-sm text-foreground space-y-1">
                {order.shippingAddress.firstName && (
                  <p className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                )}
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
                  {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p className="mt-2">{order.shippingAddress.phone}</p>}
              </div>
            </div>
          )}

          {/* Payment Status */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} className="text-primary" weight="fill" />
              <h2 className="text-lg font-semibold text-foreground">Payment</h2>
            </div>
            <p className="text-sm text-foreground">
              Status: <span className="font-medium capitalize">{order.financialStatus.toLowerCase()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
