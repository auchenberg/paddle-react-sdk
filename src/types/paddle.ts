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
  products: string[];
}

export interface ProductPrice {
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

export interface EnrichedProduct {
  id: string;
  name: string;
  description?: string;
  prices: ProductPrice[];
  features?: string[];
  highlight?: boolean;
  cta?: string;
}

// Helper type for product overrides in PricingTable
export type ProductOverride = Partial<Omit<EnrichedProduct, 'prices'>> & { id: string };

export interface PaddleContextValue {
  config: PaddleConfig;
  products: EnrichedProduct[];
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
