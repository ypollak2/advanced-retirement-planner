// Test setup for Vitest
// Created by Yali Pollak (יהלי פולק) - v6.0.0-beta.1

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock global objects
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Intl if needed
if (!global.Intl) {
  global.Intl = {
    NumberFormat: vi.fn().mockImplementation(() => ({
      format: vi.fn((number: number) => number.toString()),
    })),
  } as any;
}

// Set up test environment
process.env.NODE_ENV = 'test';