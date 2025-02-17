import React from 'react';
import { fireEvent, act } from '@testing-library/react';
import { PricingTable } from '../PricingTable';
import { renderWithPaddle, setupPaddleMock, mockPricePreview } from '../../test/test-utils';

const mockProducts = [
  {
    id: 'pri_123',
    name: 'Basic',
    description: 'Perfect for starters',
    features: ['Feature 1', 'Feature 2'],
    highlight: true,
  },
  {
    id: 'pri_456',
    name: 'Pro',
    description: 'For growing teams',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
];

describe('PricingTable', () => {
  beforeEach(() => {
    const mock = setupPaddleMock();
    mock.PricePreview.mockResolvedValue(mockPricePreview);
  });

  it('renders all products', async () => {
    const { findByRole, findByText } = await renderWithPaddle(<PricingTable products={mockProducts} />);
    
    const basicHeading = await findByRole('heading', { name: 'Basic' });
    const proHeading = await findByRole('heading', { name: 'Pro' });
    expect(basicHeading).toBeInTheDocument();
    expect(proHeading).toBeInTheDocument();
    
    const starterText = await findByText('Perfect for starters');
    const teamsText = await findByText('For growing teams');
    expect(starterText).toBeInTheDocument();
    expect(teamsText).toBeInTheDocument();
  });

  it('renders features for each product', async () => {
    const { findAllByText } = await renderWithPaddle(<PricingTable products={mockProducts} />);
    
    for (const feature of mockProducts[0].features) {
      const elements = await findAllByText(feature);
      expect(elements.length).toBeGreaterThan(0);
    }
    
    for (const feature of mockProducts[1].features) {
      const elements = await findAllByText(feature);
      expect(elements.length).toBeGreaterThan(0);
    }
  });

  it('applies highlight styling to featured products', async () => {
    const { findByRole } = await renderWithPaddle(<PricingTable products={mockProducts} />);
    
    const basicHeading = await findByRole('heading', { name: 'Basic' });
    const basicPlan = basicHeading.closest('div');
    expect(basicPlan).toHaveClass('border-primary');
  });

  it('calls onPlanSelect when a plan is selected', async () => {
    const onPlanSelect = jest.fn();
    
    const { findAllByRole } = await renderWithPaddle(
      <PricingTable
        products={mockProducts}
        onPlanSelect={onPlanSelect}
      />
    );
    
    const choosePlanButtons = await findAllByRole('button', { name: 'Choose Plan' });
    await act(async () => {
      fireEvent.click(choosePlanButtons[0]);
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(onPlanSelect).toHaveBeenCalledWith('pri_123');
  });

  it('renders with custom theme settings', async () => {
    const { findByRole } = await renderWithPaddle(
      <PricingTable
        products={mockProducts}
        theme={{
          colorScheme: 'dark',
          accentColor: '#ff0000',
        }}
      />
    );
    
    const basicHeading = await findByRole('heading', { name: 'Basic' });
    const container = basicHeading.closest('div');
    expect(container).toBeInTheDocument();
  });
});
