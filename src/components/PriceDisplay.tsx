import React from 'react';
import { usePrice } from '../hooks/usePrice';

export interface PriceDisplayProps {
  productId: string;
  showTax?: boolean;
  showCurrency?: boolean;
  className?: string;
}

export function PriceDisplay({ productId, showTax = false, showCurrency = true, className = '' }: PriceDisplayProps) {
  const { price, isLoading, error } = usePrice(productId);

  if (isLoading) {
    return <span className={className}>Loading...</span>;
  }

  if (error || !price) {
    return <span className={className}>Price unavailable</span>;
  }

  return (
    <span className={className}>
      {price.formatted}
      {showTax && price.market.tax_rate > 0 && (
        <small className="text-gray-500 ml-1">
          +{price.market.tax_rate}% tax
        </small>
      )}
    </span>
  );
}
