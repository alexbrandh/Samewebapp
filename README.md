# IDENTIKO - Tienda Online de Perfumes de Lujo

Tienda online de perfumes desarrollada con tecnologías modernas de alto rendimiento: **Next.js 16**, **TypeScript**, **Tailwind CSS 4** y **Shopify Storefront API**.

> **Diseño y Creación por:** Alejandro Brand

## Estado del Proyecto

**Estado:** Entregado y Operativo
**Versión:** 1.0.0

Este proyecto ha sido completado y entregado para la marca **IDENTIKO**. La arquitectura es "Headless", utilizando Vercel para el frontend y Shopify para la gestión de productos y checkout.

## Características Técnicas

- **Progressive Web App (PWA):** Instalable en móviles y funcioanamiento offline básico.
- **Arquitectura Headless:** Separación entre frontend (Vercel) y backend (Shopify) para máximo rendimiento.
- **Diseño Premium:** Interfaz de usuario personalizada con animaciones suaves y estética de lujo.
- **Rendimiento:** Optimizado con Next.js 16 (App Router) y Turbopack para cargas instantáneas.
- **Responsive:** Diseño adaptable a cualquier dispositivo móvil o de escritorio.
- **SEO:** Estructura técnica optimizada para motores de búsqueda.
- **Integraciones:**
    - Shopify Storefront API para gestión de catálogo y carrito.
    - Google Tag Manager para integraciones de marketing (Meta Pixel, Google Analytics, etc.).

## Stack Tecnológico

- **Frontend Framework:** Next.js 16
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4
- **Componentes UI:** shadcn/ui
- **Ecommerce Engine:** Shopify
- **Hosting:** Vercel
- **PWA:** next-pwa

## Gestión del Sitio

### Contenido y Productos
La gestión del catálogo (productos, precios, inventario) se realiza exclusivamente desde el panel de administración de Shopify. Los cambios se reflejan automáticamente en la web.

### Marketing y Analítica
Las herramientas de seguimiento y marketing (Pixels) se gestionan a través de Google Tag Manager por el equipo de marketing, sin necesidad de intervención en el código.

## Configuración y Despliegue

El código fuente está alojado en este repositorio. Los despliegues se gestionan a través de Vercel, conectado directamente a la rama principal.

### Variables de Entorno
El proyecto requiere las siguientes variables de entorno para funcionar:
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

---
© 2026 IDENTIKO. Todos los derechos reservados.
