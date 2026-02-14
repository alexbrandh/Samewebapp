'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCustomer } from '@/contexts/customer-context';
import { getCustomerOrders } from '@/lib/shopify-customer';
import { formatPrice } from '@/lib/shopify';
import { ShoppingBag, Heart, MapPin, Package, Gift } from 'phosphor-react';
import type { Order } from '@/lib/types/customer';

export default function AccountDashboard() {
  const { customer, accessToken } = useCustomer();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!accessToken) return;

      try {
        const { orders } = await getCustomerOrders(accessToken, 3); // Solo las últimas 3
        setRecentOrders(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentOrders();
  }, [accessToken]);

  const stats = [
    {
      name: 'Pedidos Totales',
      value: customer?.ordersCount || 0,
      icon: ShoppingBag,
      href: '/account/orders',
    },
    {
      name: 'Referir y Ganar',
      value: 'Obtén 10%',
      icon: Gift,
      href: '/pages/refer-a-friend',
    },
    {
      name: 'Direcciones',
      value: customer?.addresses?.length || 0,
      icon: MapPin,
      href: '/account/profile#addresses',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          ¡Hola, {customer?.firstName}!
        </h2>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de cuenta. Administra tus pedidos, favoritos y configuración de perfil.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Icon size={24} className="text-primary" weight="fill" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Información del Perfil</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="text-foreground font-medium">
                {customer?.firstName} {customer?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground font-medium">{customer?.email}</p>
            </div>
            {customer?.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="text-foreground font-medium">{customer?.phone}</p>
              </div>
            )}
          </div>
          <Link
            href="/account/profile"
            className="mt-4 text-sm text-primary hover:underline inline-block"
          >
            Editar Perfil →
          </Link>
        </div>

        {/* Default Address */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Dirección Principal</h3>
          {customer?.defaultAddress ? (
            <div className="space-y-1 text-sm text-foreground">
              <p>{customer.defaultAddress.address1}</p>
              {customer.defaultAddress.address2 && <p>{customer.defaultAddress.address2}</p>}
              <p>
                {customer.defaultAddress.city}, {customer.defaultAddress.province}{' '}
                {customer.defaultAddress.zip}
              </p>
              <p>{customer.defaultAddress.country}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Sin dirección principal configurada</p>
          )}
          <Link
            href="/account/profile#addresses"
            className="mt-4 text-sm text-primary hover:underline inline-block"
          >
            Administrar Direcciones →
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Pedidos Recientes</h3>
          <Link href="/account/orders" className="text-sm text-primary hover:underline">
            Ver todos →
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando pedidos...</p>
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Package size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Pedido #{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.processedAt).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {order.fulfillmentStatus.replace('_', ' ').toLowerCase()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Aún no has realizado ningún pedido</p>
            <Link
              href="/collections/all"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Empezar a Comprar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
