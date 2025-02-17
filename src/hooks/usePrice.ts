import { useEffect, useState } from 'react';
import { usePaddleContext } from '../context/PaddleContext';

interface PriceDetails {
  formatted: string;
  amount: string;
  currency: string;
  interval?: {
    type: 'month' | 'year';
    count: number;
  };
  trial?: {
    type: 'day' | 'month';
    count: number;
  };
  tax?: {
    rate: number;
    amount?: string;
  };
  market: {
    country: string;
  };
}

export function usePrice(productId: string) {
  const { paddle, isInitialized } = usePaddleContext();
  const [priceDetails, setPriceDetails] = useState<PriceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPriceDetails = async () => {
      if (!isInitialized || !paddle) return;

      try {
        const preview = await paddle.PricePreview({
          items: [{ priceId: productId, quantity: 1 }]
        });

        const previewDetails = Array.isArray(preview.data.details) ? preview.data.details : [];
        const firstDetail = previewDetails[0];
        
        if (!firstDetail) throw new Error('No price details available');

        const priceDetails: PriceDetails = {
          formatted: new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: preview.data.currencyCode
          }).format(firstDetail.price?.unitPrice || 0),
          amount: firstDetail.price?.unitPrice?.toString() || '0',
          currency: preview.data.currencyCode,
          tax: firstDetail.tax ? {
            rate: firstDetail.tax.rate,
            amount: firstDetail.tax.amount?.toString()
          } : undefined,
          market: {
            country: preview.data.address?.countryCode || 'US'
          }
        };

        setPriceDetails(priceDetails);
        setError(null);
        setIsLoading(false);
      } catch (err) {
        setPriceDetails(null);
        setError(err instanceof Error ? err : new Error('Failed to load price details'));
        setIsLoading(false);
      }
    };

    loadPriceDetails();
  }, [productId, isInitialized, paddle]);

  return {
    price: priceDetails,
    isLoading,
    error,
    formatPrice: (amount: number) => {
      if (!priceDetails) return '';
      return new Intl.NumberFormat(navigator.language, {
        style: 'currency',
        currency: priceDetails.currency
      }).format(amount);
    }
  };
}
