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
    let mounted = true;
    const loadPriceDetails = async () => {
      if (!isInitialized || !paddle) return;
      
      if (mounted) {
        setIsLoading(true);
        setPriceDetails(null);
        setError(null);
      }

      try {
        const preview = await paddle.PricePreview({
          items: [{ priceId: productId, quantity: 1 }]
        });

        if (!preview?.data?.details || !Array.isArray(preview.data.details) || !preview.data.currencyCode) {
          throw new Error('Invalid price preview response');
        }

        const firstDetail = preview.data.details[0];
        if (!firstDetail?.price?.unitPrice) {
          throw new Error('No price details available');
        }

        const unitPrice = firstDetail.price.unitPrice;
        
        const priceDetails: PriceDetails = {
          formatted: new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: preview.data.currencyCode
          }).format(typeof unitPrice === 'string' ? parseFloat(unitPrice) : unitPrice),
          amount: unitPrice.toString(),
          currency: preview.data.currencyCode,
          tax: firstDetail.tax ? {
            rate: firstDetail.tax.rate,
            amount: firstDetail.tax.amount?.toString()
          } : undefined,
          market: {
            country: preview.data.address?.countryCode || 'US'
          }
        };

        if (mounted) {
          setError(null);
          setPriceDetails(priceDetails);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load price details'));
          setPriceDetails(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadPriceDetails();
    
    return () => {
      mounted = false;
    };
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
