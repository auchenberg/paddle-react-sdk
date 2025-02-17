# Migration Guide

## 2.0.0

### Breaking Changes

#### Terminology Updates
We've updated our terminology to correctly reflect that Paddle uses price IDs rather than product IDs. This affects several components and interfaces:

1. PriceDisplay Component
- Renamed `productId` prop to `priceId`
```diff
- <PriceDisplay productId="pri_123" />
+ <PriceDisplay priceId="pri_123" />
```

2. PaddleConfig Interface
- Renamed `products` array to `priceIds`
```diff
const config = {
  clientToken: 'your_token',
-  products: ['pri_123'],
+  priceIds: ['pri_123'],
}
```

3. usePrice Hook
- Updated parameter name from `productId` to `priceId`
```diff
- const { price } = usePrice('pri_123'); // productId parameter
+ const { price } = usePrice('pri_123'); // priceId parameter
```

4. PricingTable Component
- Renamed `products` prop to `prices`
- Renamed `ProductOverride` type to `PriceOverride`
- Updated `onPlanSelect` callback parameter from `productId` to `priceId`
```diff
<PricingTable
-  products={[{ id: 'pri_123', name: 'Basic' }]}
+  prices={[{ id: 'pri_123', name: 'Basic' }]}
-  onPlanSelect={(productId) => {}}
+  onPlanSelect={(priceId) => {}}
/>
```

5. Type Renames
- `ProductPrice` → `PriceDetails`
- `EnrichedProduct` → `EnrichedPrice`
- `ProductOverride` → `PriceOverride`

Note: The old type names are still available but marked as deprecated.
