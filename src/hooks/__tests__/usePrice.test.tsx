// Removed unused import
import { renderHook, waitFor, act } from '@testing-library/react';
import { usePrice } from '../usePrice';
import { createWrapper, setupPaddleMock } from '../../test/test-utils';

// Use the actual PaddleProvider with our mock paddle instance
const mockPaddle = setupPaddleMock();

describe('usePrice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockPaddle.PricePreview.mockResolvedValue({
      data: {
        details: [{
          price: { unitPrice: 10 },
          tax: { rate: 0, amount: '0' }
        }],
        currencyCode: 'USD',
        address: { countryCode: 'US' }
      }
    });
  });

  it('returns loading state initially', async () => {
    const { result } = renderHook(() => usePrice('pri_123'), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      expect(result.current.isLoading).toBe(true);
      expect(result.current.price).toBe(null);
    });
  });

  it('returns price details when loaded', async () => {
    const { result, unmount } = renderHook(() => usePrice('pri_123'), {
      wrapper: createWrapper(),
    });

    try {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.price?.amount).toBe('10');
        expect(result.current.price?.currency).toBe('USD');
      });
    } finally {
      unmount();
    }
  });

  it('handles errors gracefully', async () => {
    mockPaddle.PricePreview.mockRejectedValueOnce(new Error('API Error'));

    const { result, unmount } = renderHook(() => usePrice('pri_123'), {
      wrapper: createWrapper(),
    });

    try {
      // First verify loading state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.price).toBe(null);

      // Then wait for error state
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeDefined();
        expect(result.current.price).toBe(null);
      });
    } finally {
      unmount();
    }
  });
});
