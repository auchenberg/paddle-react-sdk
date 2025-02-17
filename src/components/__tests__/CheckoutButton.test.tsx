import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react';
import { CheckoutButton } from '../CheckoutButton';
import { renderWithPaddle, setupPaddleMock } from '../../test/test-utils';

describe('CheckoutButton', () => {
  const mockPaddle = setupPaddleMock();
  
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders children correctly', async () => {
    const { findByRole } = await renderWithPaddle(
      <CheckoutButton items={[{ priceId: 'pri_123', quantity: 1 }]}>
        Subscribe Now
      </CheckoutButton>
    );
    
    const button = await findByRole('button', { name: 'Subscribe Now' });
    expect(button).toBeInTheDocument();
  });

  it('opens checkout when clicked', async () => {
    const { findByRole } = await renderWithPaddle(
      <CheckoutButton
        items={[{ priceId: 'pri_123', quantity: 1 }]}
        settings={{ theme: 'light' }}
      >
        Subscribe Now
      </CheckoutButton>
    );

    const button = await findByRole('button', { name: 'Subscribe Now' });
    expect(button).toBeInTheDocument();

    // Click the button and wait for async operations
    await act(async () => {
      fireEvent.click(button);
    });

    // Wait for all microtasks to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockPaddle.Checkout.open).toHaveBeenCalledWith({
      items: [{ priceId: 'pri_123', quantity: 1 }],
      customData: undefined,
      settings: {
        theme: 'light',
        displayMode: 'overlay'
      }
    });
  });

  it('calls onClick handler when provided', async () => {
    const onClickMock = jest.fn();
    
    const { findByRole } = await renderWithPaddle(
      <CheckoutButton
        items={[{ priceId: 'pri_123', quantity: 1 }]}
        onClick={onClickMock}
      >
        Subscribe Now
      </CheckoutButton>
    );

    const button = await findByRole('button', { name: 'Subscribe Now' });
    await act(async () => {
      fireEvent.click(button);
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(onClickMock).toHaveBeenCalled();
  });

  it('applies custom className to button', async () => {
    const { findByRole } = await renderWithPaddle(
      <CheckoutButton
        items={[{ priceId: 'pri_123', quantity: 1 }]}
        className="custom-button"
      >
        Subscribe Now
      </CheckoutButton>
    );

    const button = await findByRole('button', { name: 'Subscribe Now' });
    expect(button).toHaveClass('custom-button');
  });
});
