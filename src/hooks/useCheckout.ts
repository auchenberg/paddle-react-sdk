import { useState, useCallback } from 'react';
import type { CheckoutOpenOptions } from '@paddle/paddle-js';
import { usePaddleContext } from '../context/PaddleContext';

export function useCheckout() {
  const { isInitialized, paddle } = usePaddleContext();
  const [isOpen, setIsOpen] = useState(false);

  const openCheckout = useCallback((options: CheckoutOpenOptions) => {
    if (!isInitialized || !paddle) {
      console.error('Paddle is not initialized');
      return;
    }

    paddle.Checkout.open(options);
    setIsOpen(true);
  }, [isInitialized, paddle]);

  const closeCheckout = useCallback(() => {
    if (!isInitialized || !paddle) return;
    paddle.Checkout.close();
    setIsOpen(false);
  }, [isInitialized, paddle]);

  return {
    openCheckout,
    closeCheckout,
    isOpen
  };
}
