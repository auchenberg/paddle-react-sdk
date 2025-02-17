import React from 'react';
import { usePaddleContext } from '../context/PaddleContext';
import { PriceDisplay } from './PriceDisplay';
import { CheckoutButton } from './CheckoutButton';

import type { EnrichedProduct, ProductOverride } from '../types/paddle';

export interface PricingTableProps {
  products?: ProductOverride[];
  layout?: 'horizontal' | 'vertical';
  showComparison?: boolean;
  onPlanSelect?: (productId: string) => void;
  className?: string;
  theme?: {
    colorScheme?: 'light' | 'dark';
    accentColor?: string;
    borderRadius?: string;
  };
}

export function PricingTable({
  products: overrideProducts,
  layout = 'horizontal',
  showComparison = false,
  onPlanSelect,
  className = '',
  theme
}: PricingTableProps) {
  const { products: contextProducts } = usePaddleContext();
  const products = overrideProducts || contextProducts;

  const containerClass = `grid ${
    layout === 'horizontal' 
      ? 'grid-cols-1 md:grid-cols-3 gap-6' 
      : 'grid-cols-1 gap-6'
  } ${className}`;

  return (
    <div className={containerClass}>
      {products.map((product) => (
        <div
          key={product.id}
          className={`rounded-lg border p-6 ${
            product.highlight 
              ? 'border-primary shadow-lg' 
              : 'border-border'
          }`}
        >
          <h3 className="text-lg font-semibold">{product.name}</h3>
          {product.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          )}
          <div className="mt-4">
            <PriceDisplay 
              productId={product.id || ''}
              showTax
              className="text-2xl font-bold"
            />
          </div>
          {product.features && (
            <ul className="mt-4 space-y-2">
              {product.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center text-sm">
                  <svg
                    className="mr-2 h-4 w-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6">
            <CheckoutButton
              items={[{ priceId: product.id || '', quantity: 1 }]}
              settings={{ theme: theme?.colorScheme }}
              className="w-full"
              onClick={() => product.id && onPlanSelect?.(product.id)}
            >
              {product.cta || 'Choose Plan'}
            </CheckoutButton>
          </div>
        </div>
      ))}
    </div>
  );
}
