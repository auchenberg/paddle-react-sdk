import React from 'react';
import { useCheckout } from '../hooks/useCheckout';
// Removed unused import

export interface CheckoutButtonProps {
  items: Array<{ priceId: string; quantity: number }>;
  customData?: Record<string, unknown>;
  settings?: {
    theme?: 'light' | 'dark';
    displayMode?: 'inline' | 'overlay';
    frameTarget?: string;
    successUrl?: string;
  };
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CheckoutButton({ 
  children, 
  items,
  customData,
  settings,
  className = '',
  onClick
}: CheckoutButtonProps) {
  const { openCheckout } = useCheckout();

  const handleClick = async () => {
    onClick?.();
    await openCheckout({
      items,
      customData,
      settings: {
        ...(settings || {}),
        displayMode: 'overlay'
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center px-4 py-2 font-medium rounded-md ${className}`}
    >
      {children}
    </button>
  );
}
