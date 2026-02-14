'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/lib/hooks/useShopify';
import { useCurrency } from '@/contexts/currency-context';
import { CircleNotch, Check } from 'phosphor-react';

interface ProductInfoProps {
  title: string;
  description: string;
  price: string;
  currencyCode: string;
  variantId: string;
  availableForSale: boolean;
  isNew?: boolean;
}

export default function ProductInfo({
  title,
  description,
  price,
  currencyCode,
  variantId,
  availableForSale,
  isNew,
}: ProductInfoProps) {
  const { addToCart, loading } = useCart();
  const { formatPrice } = useCurrency();
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!variantId || !availableForSale) return;

    try {
      await addToCart(variantId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="lg:sticky lg:top-20">
      {/* Title & Price */}
      <div className="mb-6">
        {isNew && (
          <span className="inline-block px-2 py-1 text-xs font-semibold bg-foreground text-background rounded-sm mb-3">
            NUEVO
          </span>
        )}
        <h1 className="text-4xl lg:text-5xl font-semibold text-foreground mb-4">
          {title}
        </h1>
        <p className="text-2xl font-semibold text-foreground">
          {formatPrice(price)}
        </p>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Add to Bag Button */}
      <div className="mb-6">
        <Button
          onClick={handleAddToCart}
          disabled={!availableForSale || loading}
          className="w-full h-14 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
          size="lg"
        >
          {loading ? (
            <>
              <CircleNotch size={16} weight="light" className="mr-2 animate-spin" />
              Agregando...
            </>
          ) : added ? (
            <>
              <Check size={16} weight="light" className="mr-2" />
              ¡Agregado!
            </>
          ) : (
            'Agregar al Carrito'
          )}
        </Button>
      </div>

      {/* Free Shipping Message */}
      <div className="mb-8 p-4 bg-muted rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">¡Genial!</span> ¡Agrega y recibe envío gratis!
        </p>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="ingredients" className="w-full mb-8">
        <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-muted">
          <TabsTrigger value="ingredients" className="text-sm py-2.5">
            Ingredientes
          </TabsTrigger>
          <TabsTrigger value="directions" className="text-sm py-2.5">
            Instrucciones
          </TabsTrigger>
          <TabsTrigger value="shipping" className="text-sm py-2.5">
            Envío
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="mt-4 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Ingredientes Clave</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <strong>Aceites de Fragancia Premium</strong> - Cuidadosamente seleccionados para un aroma duradero
              </li>
              <li>
                <strong>Extractos Naturales</strong> - Derivados de fuentes botánicas
              </li>
              <li>
                <strong>Fórmula Segura para la Piel</strong> - Dermatológicamente testeada
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="directions" className="mt-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Aplica en puntos de pulso (muñecas, cuello, detrás de las orejas) para una difusión óptima del aroma.
            Para mejores resultados, aplica sobre piel limpia e hidratada. Evita frotar las muñecas
            ya que esto puede descomponer las moléculas de la fragancia.
          </p>
        </TabsContent>

        <TabsContent value="shipping" className="mt-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Actualmente realizamos envíos dentro de Colombia. Por favor permite 1 día para procesamiento.
            </p>
            <p>
              <strong>Opciones de Envío:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Estándar (4-7 días hábiles)</li>
              <li>Express (3 días hábiles)</li>
            </ul>
            <p className="font-semibold">
              ¡Pedidos con 4+ artículos califican para envío gratis estándar!
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="font-semibold text-card-foreground mb-2">Aroma Duradero</h3>
          <p className="text-sm text-muted-foreground">
            Formulación premium que asegura que tu fragancia dure todo el día
          </p>
        </div>
        <div className="p-6 bg-card border border-border rounded-lg">
          <h3 className="font-semibold text-card-foreground mb-2">Ingredientes Limpios</h3>
          <p className="text-sm text-muted-foreground">
            Elaborado con ingredientes seguros para la piel y de alta calidad
          </p>
        </div>
      </div>

      {/* Back to Shop Link */}
      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          ← Volver a la Tienda
        </Link>
      </div>
    </div>
  );
}
