import React from 'react';
import { usePrice } from '../hooks/usePrice';

export interface PriceDisplayProps {
  productId: string;
  showTax?: boolean;
  className?: string;
}

export function PriceDisplay({ productId, showTax = false, className = '' }: PriceDisplayProps) {
  const { price, isLoading, error } = usePrice(productId);

  if (isLoading) {
    return <span className={className}>Loading...</span>;
  }

  if (error || !price) {
    return <span className={className}>Price unavailable</span>;
  }

  return (
    <div className={className}>
      <span>{price.formatted}</span>
      {showTax && price.tax && price.tax.rate > 0 && (
        <span className="text-gray-500 ml-1" data-testid="tax-info">
          +{price.tax.rate}% tax
        </span>
      )}
    </div>
  );
}
