// Context
export { PaddleProvider } from './context/PaddleContext';

// Components
export { PriceDisplay } from './components/PriceDisplay';
export { CheckoutButton } from './components/CheckoutButton';
export { PricingTable } from './components/PricingTable';

// Hooks
export { usePaddleContext } from './context/PaddleContext';
export { usePrice } from './hooks/usePrice';
export { useCheckout } from './hooks/useCheckout';

// Types
export type {
  PaddleConfig,
  EnrichedPrice,
  CheckoutOpenOptions,
  PaddleContextValue,
  PriceOverride
} from './types/paddle';
