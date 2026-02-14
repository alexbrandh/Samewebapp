'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCustomer } from '@/contexts/customer-context';
import { PageContainer } from '@/components/ui/page-container';
import { User, ShoppingBag, Heart, SignOut, House } from 'phosphor-react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, customer, logout } = useCustomer();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect a login si no está autenticado (excepto en páginas públicas)
    const publicPages = ['/account/login', '/account/recover'];
    if (!isLoading && !isAuthenticated && !publicPages.includes(pathname)) {
      router.push('/account/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <PageContainer className="overflow-x-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </PageContainer>
    );
  }

  // No mostrar layout en páginas públicas (login y recover)
  const publicPages = ['/account/login', '/account/recover'];
  if (publicPages.includes(pathname)) {
    return <>{children}</>;
  }

  // Si no está autenticado, no mostrar nada (el useEffect redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    {
      name: 'Panel',
      href: '/account',
      icon: House,
    },
    {
      name: 'Mis Pedidos',
      href: '/account/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Favoritos',
      href: '/account/favorites',
      icon: Heart,
    },
    {
      name: 'Perfil',
      href: '/account/profile',
      icon: User,
    },
  ];

  return (
    <PageContainer className="overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mi Cuenta</h1>
          <p className="text-muted-foreground">
            Bienvenido de nuevo, {customer?.firstName || 'Cliente'}!
          </p>
        </div>

        {/* Layout de 2 columnas */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Navegación */}
          <aside className="w-full lg:w-64 shrink-0">
            <nav className="bg-card border border-border rounded-lg p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <SignOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </nav>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </PageContainer>
  );
}
