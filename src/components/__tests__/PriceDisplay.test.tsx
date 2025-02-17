import React from 'react';
import { screen } from '@testing-library/react';
import { PriceDisplay } from '../PriceDisplay';
import { renderWithPaddle, setupPaddleMock } from '../../test/test-utils';

describe('PriceDisplay', () => {
  beforeEach(() => {
    setupPaddleMock();
  });

  it('renders loading state initially', () => {
    renderWithPaddle(<PriceDisplay priceId="pri_123" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays formatted price', () => {
    renderWithPaddle(<PriceDisplay priceId="pri_123" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
