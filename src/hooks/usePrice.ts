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
  market: {
    country: string;
    tax_rate: number;
  };
}

export function usePrice(productId: string) {
  const { paddle, isInitialized } = usePaddleContext();
  const [priceDetails, setPriceDetails] = useState<PriceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const loadPriceDetails = async () => {
      if (!isInitialized || !paddle) return;

      try {
        const preview = await paddle.PricePreview({
          items: [{ priceId: productId, quantity: 1 }]
        });

        const previewDetails = Array.isArray(preview.data.details) ? preview.data.details : [];
        const firstDetail = previewDetails[0];
        const priceDetails: PriceDetails = {
          formatted: new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: preview.data.currencyCode
          }).format(firstDetail?.price?.unitPrice || 0),
          amount: firstDetail?.price?.unitPrice?.toString() || '0',
          currency: preview.data.currencyCode,
          market: {
            country: preview.data.address?.countryCode || 'US',
            tax_rate: 0 // Tax rate is not directly available in preview response
          }
        };

        setPriceDetails(priceDetails);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load price details'));
        setIsLoading(false);
      }
    };

    loadPriceDetails();
  }, [productId, isInitialized]);

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
    },
    calculateTax: (amount: number) => {
      if (!priceDetails?.market.tax_rate) return 0;
      return amount * (priceDetails.market.tax_rate / 100);
    }
  };
}
