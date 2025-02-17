import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Paddle, PricePreviewParams } from '@paddle/paddle-js';
import type { PaddleConfig, PaddleContextValue, EnrichedProduct } from '../types/paddle';

const PaddleContext = createContext<PaddleContextValue | null>(null);

export interface PaddleProviderProps {
  config: PaddleConfig;
  children: React.ReactNode;
}

export function PaddleProvider({ config, children }: PaddleProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    let mounted = true;

    const initializePaddleSDK = async () => {
      if (!mounted) return;
      
      try {
        const { initializePaddle } = await import('@paddle/paddle-js');
        
        const paddleInstance = await initializePaddle({
          token: config.clientToken,
          environment: config.environment || (window.location.hostname === 'localhost' ? 'sandbox' : 'production')
        });

        if (!mounted) return;

        if (!paddleInstance) {
          throw new Error('Failed to initialize Paddle');
        }

        // Batch state updates in React 18 style
        React.startTransition(() => {
          setPaddle(paddleInstance);
          setIsInitialized(true);
          setIsLoading(true);
        });
        
        // Start loading product details
        const enrichedProducts = (await Promise.all(
          config.products.map(async (productId) => {
            try {
              const params: PricePreviewParams = {
                items: [{ priceId: productId, quantity: 1 }]
              };
              
              if (!mounted) return null;

              const preview = await paddleInstance.PricePreview(params);
              const details = Array.isArray(preview.data.details) ? preview.data.details : [];
              const firstDetail = details[0];

              if (!firstDetail) return null;

              const product: EnrichedProduct = {
                id: productId,
                name: firstDetail.product?.name || 'Unknown Product',
                description: firstDetail.product?.description,
                prices: [{
                  id: firstDetail.price?.id || '',
                  amount: firstDetail.price?.unitPrice?.toString() || '0',
                  currency: preview.data.currencyCode
                }]
              };

              return product;
            } catch (err) {
              if (!mounted) return null;
              console.error(`Failed to load product ${productId}:`, err);
              const failedProduct: EnrichedProduct = {
                id: productId,
                name: 'Failed to load',
                prices: []
              };
              return failedProduct;
            }
          })
        )).filter((p): p is EnrichedProduct => p !== null);
        
        if (!mounted) return;
        
        // Batch state updates in React 18 style
        React.startTransition(() => {
          setProducts(enrichedProducts);
          setIsLoading(false);
        });
      } catch (err) {
        if (!mounted) return;
        React.startTransition(() => {
          setError(err instanceof Error ? err : new Error('Failed to initialize Paddle'));
          setIsLoading(false);
        });
      }
    };

    initializePaddleSDK();

    return () => {
      mounted = false;
    };
  }, [config.clientToken, config.environment, config.products]);

  const contextValue: PaddleContextValue = {
    config,
    products,
    isInitialized,
    isLoading,
    error,
    paddle
  };

  return (
    <PaddleContext.Provider value={contextValue}>
      {children}
    </PaddleContext.Provider>
  );
}

export function usePaddleContext() {
  const context = useContext(PaddleContext);
  if (!context) {
    throw new Error('usePaddleContext must be used within a PaddleProvider');
  }
  return context;
}
