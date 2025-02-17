// Removed unused import
import { renderHook, waitFor, act } from '@testing-library/react';
import { usePrice } from '../usePrice';
import { createWrapper, setupPaddleMock, mockPricePreview } from '../../test/test-utils';

describe('usePrice', () => {
  beforeEach(() => {
    const mock = setupPaddleMock();
    mock.PricePreview.mockResolvedValue(mockPricePreview);
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
    const { result } = renderHook(() => usePrice('pri_123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.price?.amount).toBe('10');
    expect(result.current.price?.currency).toBe('USD');
  });

  it('handles errors gracefully', async () => {
    const mock = setupPaddleMock();
    mock.PricePreview.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => usePrice('pri_123'), {
      wrapper: createWrapper(),
    });

    // First wait for loading to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Then verify error state
    expect(result.current.error).toBeDefined();
    expect(result.current.price).toBe(null);
  });
});
