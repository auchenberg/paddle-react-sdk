# Paddle React SDK

A modern, type-safe React SDK for integrating Paddle payments into your React applications.

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- 🚀 Modern React Hooks and Components
- 📦 Built on official @paddle/paddle-js package
- 🔒 Full TypeScript support
- 🎨 Customizable UI components
- 🏗️ Automatic sandbox detection for development
- 🔄 Automatic product enrichment
- 💳 Simple checkout integration

## Installation

```bash
npm install @paddle/paddle-js @auchenberg/paddle-react
# or
yarn add @paddle/paddle-js @auchenberg/paddle-react
# or
pnpm add @paddle/paddle-js @auchenberg/paddle-react
```

## Quick Start

Wrap your application with `PaddleProvider`:

```tsx
import { PaddleProvider } from '@auchenberg/paddle-react';

function App() {
  return (
    <PaddleProvider
      config={{
        clientToken: 'your_paddle_client_token',
        products: ['pri_123'], // Your product IDs
      }}
    >
      <YourApp />
    </PaddleProvider>
  );
}
```

### Display Product Prices

```tsx
import { PriceDisplay } from '@auchenberg/paddle-react';

function ProductPrice() {
  return (
    <PriceDisplay
      productId="pri_123"
      showTax={true}
      showCurrency={true}
    />
  );
}
```

### Add Checkout Button

```tsx
import { CheckoutButton } from '@auchenberg/paddle-react';

function BuyButton() {
  return (
    <CheckoutButton
      items={[{ priceId: 'pri_123', quantity: 1 }]}
      settings={{
        theme: 'light',
        displayMode: 'overlay',
        successUrl: '/success'
      }}
    >
      Subscribe Now
    </CheckoutButton>
  );
}
```

### Create a Pricing Table

```tsx
import { PricingTable } from '@auchenberg/paddle-react';

function Pricing() {
  return (
    <PricingTable
      products={[
        {
          id: 'pri_123',
          name: 'Basic',
          description: 'Perfect for starters',
          features: ['Feature 1', 'Feature 2'],
          highlight: true
        },
        {
          id: 'pri_456',
          name: 'Pro',
          description: 'For growing teams',
          features: ['Feature 1', 'Feature 2', 'Feature 3'],
        }
      ]}
      layout="horizontal"
      theme={{
        colorScheme: 'light',
        accentColor: '#007bff'
      }}
    />
  );
}
```

### Use Hooks for Custom Integration

#### Price Management
```tsx
import { usePrice } from '@auchenberg/paddle-react';

function CustomPrice() {
  const { price, isLoading, error, formatPrice } = usePrice('pri_123');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading price</div>;

  return (
    <div>
      <div>Price: {price?.formatted}</div>
      <div>Custom format: {formatPrice(1000)}</div>
    </div>
  );
}
```

#### Checkout Management
```tsx
import { useCheckout } from '@auchenberg/paddle-react';

function CustomCheckout() {
  const { openCheckout } = useCheckout();

  const handlePurchase = () => {
    openCheckout({
      items: [{ priceId: 'pri_123', quantity: 1 }],
      settings: {
        theme: 'light',
        displayMode: 'overlay'
      }
    });
  };

  return <button onClick={handlePurchase}>Buy Now</button>;
}
```

## API Reference

### PaddleProvider

Configuration options:

```typescript
interface PaddleConfig {
  clientToken: string;
  environment?: 'sandbox' | 'production';
  customerId?: string; // Your system's user ID
  products: string[]; // Array of Paddle product IDs
}
```

### Components

#### PriceDisplay
```typescript
interface PriceDisplayProps {
  productId: string;
  showTax?: boolean;
  showCurrency?: boolean;
  className?: string;
}
```

#### CheckoutButton
```typescript
interface CheckoutButtonProps {
  items: Array<{ priceId: string; quantity: number }>;
  settings?: {
    theme?: 'light' | 'dark';
    displayMode?: 'inline' | 'overlay';
    frameTarget?: string;
    successUrl?: string;
  };
  className?: string;
  onClick?: () => void;
}
```

#### PricingTable
```typescript
interface PricingTableProps {
  products?: ProductOverride[];
  layout?: 'horizontal' | 'vertical';
  showComparison?: boolean;
  theme?: {
    colorScheme?: 'light' | 'dark';
    accentColor?: string;
    borderRadius?: string;
  };
  onPlanSelect?: (productId: string) => void;
}
```

### Hooks

#### usePrice
```typescript
function usePrice(productId: string): {
  price: PriceDetails | null;
  isLoading: boolean;
  error?: Error;
  formatPrice: (amount: number) => string;
  calculateTax: (amount: number) => number;
}
```

#### useCheckout
```typescript
function useCheckout(): {
  openCheckout: (options: CheckoutOpenOptions) => void;
  closeCheckout: () => void;
  isOpen: boolean;
}
```

## Development

```bash
# Install dependencies
npm install

# Run TypeScript type checking
npm run typecheck

# Run ESLint
npm run lint

# Build package
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [auchenberg]
