'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCustomer } from '@/contexts/customer-context';
import { getCustomerOrders } from '@/lib/shopify-customer';
import { formatPrice } from '@/lib/shopify';
import { Package, CaretRight } from 'phosphor-react';
import type { Order } from '@/lib/types/customer';

export default function OrdersPage() {
  const { accessToken } = useCustomer();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string>();

  useEffect(() => {
    fetchOrders();
  }, [accessToken]);

  const fetchOrders = async (after?: string) => {
    if (!accessToken) return;

    try {
      setIsLoading(true);
      const result = await getCustomerOrders(accessToken, 20, after);
      
      if (after) {
        setOrders([...orders, ...result.orders]);
      } else {
        setOrders(result.orders);
      }
      
      setHasNextPage(result.hasNextPage);
      setEndCursor(result.endCursor);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FULFILLED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PARTIALLY_FULFILLED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'UNFULFILLED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getFinancialStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REFUNDED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando tus pedidos...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Package size={64} className="text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Sin Pedidos Aún</h2>
        <p className="text-muted-foreground mb-6">
          Aún no has realizado ningún pedido. ¡Empieza a comprar para ver tus pedidos aquí!
        </p>
        <Link
          href="/collections/all"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Mis Pedidos</h2>
        <p className="text-muted-foreground">
          Ver y rastrear todos tus pedidos
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${encodeURIComponent(order.id)}`}
            className="block bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Package size={24} className="text-primary" weight="fill" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Pedido #{order.orderNumber}
                  </h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  Realizado el {new Date(order.processedAt).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.fulfillmentStatus)}`}>
                    {order.fulfillmentStatus.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getFinancialStatusColor(order.financialStatus)}`}>
                    {order.financialStatus}
                  </span>
                </div>

                {/* Items count */}
                <p className="text-sm text-muted-foreground mt-3">
                  {order.lineItems?.length || 0} artículo(s)
                </p>
              </div>

              {/* Price & Arrow */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Total</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                  </p>
                </div>
                <CaretRight size={24} className="text-muted-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="text-center pt-6">
          <button
            onClick={() => fetchOrders(endCursor)}
            disabled={isLoading}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Cargando...' : 'Cargar Más'}
          </button>
        </div>
      )}
    </div>
  );
}
