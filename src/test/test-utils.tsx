import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { PaddleProvider } from '../context/PaddleContext';
import type { PaddleConfig } from '../types/paddle';

export const mockPricePreview = {
  data: {
    currencyCode: 'USD',
    details: [{
      price: { unitPrice: 10.00 },
      product: { name: 'Test Product' }
    }]
  }
};

import type { Paddle } from '@paddle/paddle-js';

type MockPaddle = {
  Initialize: jest.Mock;
  Environment: { set: jest.Mock };
  PricePreview: jest.Mock;
  Checkout: {
    open: jest.Mock;
    close: jest.Mock;
  };
  initialized?: boolean;
};

const createPaddleMock = (): MockPaddle => {
  // Create shared mock methods with proper async behavior
  const defaultPricePreviewResponse = {
    data: {
      currencyCode: 'USD',
      details: [{
        price: { unitPrice: 10.00 },
        product: { name: 'Test Product' }
      }]
    }
  };

  // Create mock methods with proper async behavior
  const mockCheckout = {
    open: jest.fn().mockImplementation((options) => Promise.resolve(undefined)),
    close: jest.fn().mockImplementation(() => Promise.resolve(undefined))
  };

  const mockPricePreview = jest.fn();

  const mockEnvironment = { set: jest.fn() };

  // Create the mock instance that Initialize will return
  const mockInstance = {
    Environment: mockEnvironment,
    PricePreview: mockPricePreview,
    Checkout: mockCheckout,
    initialized: true
  };

  // Create the main mock with all methods immediately available
  const mockPaddle: MockPaddle = {
    Initialize: jest.fn().mockImplementation(() => {
      mockPaddle.initialized = true;
      return Promise.resolve(mockInstance);
    }),
    Environment: mockEnvironment,
    PricePreview: mockPricePreview,
    Checkout: mockCheckout,
    initialized: true
  };

  // Reset all mocks to their default behavior
  jest.clearAllMocks();

  // Set up default mock implementations
  mockPricePreview.mockImplementation(() => Promise.resolve(defaultPricePreviewResponse));

  // Ensure the mock is properly initialized
  (global as any).Paddle = mockPaddle;

  return mockPaddle;
};

export const createWrapper = () => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <PaddleProvider config={{ clientToken: 'test_token', products: ['pri_123'] }}>
        {children}
      </PaddleProvider>
    );
  };
};

export function setupPaddleMock() {
  const mockPaddle = createPaddleMock();
  (global as any).Paddle = mockPaddle;
  return mockPaddle;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  paddleConfig?: Partial<PaddleConfig>;
}

export function renderWithPaddle(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const defaultConfig: PaddleConfig = {
    clientToken: 'test_token',
    products: ['pri_123'],
    ...options.paddleConfig
  };

  return render(ui, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <PaddleProvider config={defaultConfig}>
        {children}
      </PaddleProvider>
    ),
    ...options
  });
}

export * from '@testing-library/react';
