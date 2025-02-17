import type {
  Paddle,
  PaddleSetupOptions,
  CheckoutOpenOptions,
  PricePreviewParams,
  PricePreviewResponse,
  CheckoutSettings,
  Theme,
  DisplayMode
} from '@paddle/paddle-js';

export interface PaddleConfig {
  clientToken: string;
  environment?: 'sandbox' | 'production';
  // Your application's customer ID (e.g., Supabase user ID)
  customerId?: string;
  priceIds: string[]; // Changed from products for accuracy - price IDs are used for pricing
}

export interface PriceDetails {
  id: string;
  amount: string;
  currency: string;
  billing?: {
    interval: 'month' | 'year';
    frequency: number;
  };
  trial?: {
    interval: 'day' | 'month';
    frequency: number;
  };
}

export interface EnrichedPrice {
  id: string;
  name: string;
  description?: string;
  prices: PriceDetails[];
  features?: string[];
  highlight?: boolean;
  cta?: string;
}

// Helper type for price overrides in PricingTable
export type PriceOverride = Partial<Omit<EnrichedPrice, 'prices'>> & { id: string };

export interface PaddleContextValue {
  config: PaddleConfig;
  prices: EnrichedPrice[]; // Changed from products to prices to reflect that these are price-based products
  isInitialized: boolean;
  isLoading: boolean;
  error?: Error;
  paddle?: Paddle;
}

// Re-export types from @paddle/paddle-js
export type {
  Paddle,
  CheckoutOpenOptions,
  PricePreviewParams,
  PricePreviewResponse,
  CheckoutSettings,
  Theme,
  DisplayMode
};

// Re-export renamed types for backward compatibility
/** @deprecated Use PriceDetails instead */
export type ProductPrice = PriceDetails;
/** @deprecated Use EnrichedPrice instead */
export type EnrichedProduct = EnrichedPrice;
