import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { act } from '@testing-library/react';
import React from 'react';

// Configure testing environment
configure({
  asyncUtilTimeout: 2000,
  testIdAttribute: 'data-testid',
});

// Configure Jest environment
(global as any).IS_REACT_ACT_ENVIRONMENT = true;

// Configure async testing
jest.setTimeout(10000); // Increase timeout for async tests

// Ensure React.startTransition is mocked for tests
(global as any).React = React;
React.startTransition = (callback: () => void) => {
  act(() => {
    callback();
  });
};

// Mock console.error to reduce noise from expected async act warnings
const originalError = console.error;
console.error = (...args: any[]) => {
  if (args[0]?.includes('Warning: An update to') && args[0]?.includes('inside a test was not wrapped in act')) {
    return;
  }
  originalError.call(console, ...args);
};
