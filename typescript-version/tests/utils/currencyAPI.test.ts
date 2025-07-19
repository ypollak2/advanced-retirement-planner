// Currency API Tests - TypeScript Implementation
// Created by Yali Pollak (יהלי פולק) - v6.0.0-beta.1

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CurrencyAPI, currencyAPI } from '@/utils/currencyAPI';
import { Currency, Language } from '@/types';

// Mock fetch for testing
global.fetch = vi.fn();

describe('CurrencyAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CurrencyAPI Class', () => {
    it('should create a new instance', () => {
      const api = new CurrencyAPI();
      expect(api).toBeInstanceOf(CurrencyAPI);
    });

    it('should have all required methods', () => {
      const api = new CurrencyAPI();
      expect(typeof api.fetchExchangeRates).toBe('function');
      expect(typeof api.getRate).toBe('function');
      expect(typeof api.convertAmount).toBe('function');
      expect(typeof api.formatCurrency).toBe('function');
      expect(typeof api.getCurrencySymbol).toBe('function');
    });
  });

  describe('formatCurrency', () => {
    it('should format ILS currency correctly', () => {
      const result = currencyAPI.formatCurrency(1000, Currency.ILS, Language.HE);
      expect(result).toMatch(/₪/);
      expect(result).toMatch(/1[,.]?000/);
    });

    it('should format USD currency correctly', () => {
      const result = currencyAPI.formatCurrency(1000, Currency.USD, Language.EN);
      expect(result).toMatch(/\$/);
      expect(result).toMatch(/1[,.]?000/);
    });

    it('should format BTC with 6 decimal places', () => {
      const result = currencyAPI.formatCurrency(0.123456789, Currency.BTC, Language.EN);
      expect(result).toBe('₿0.123457');
    });

    it('should format ETH with 6 decimal places', () => {
      const result = currencyAPI.formatCurrency(1.123456789, Currency.ETH, Language.EN);
      expect(result).toBe('Ξ1.123457');
    });
  });

  describe('getCurrencySymbol', () => {
    it('should return correct symbols for all currencies', () => {
      expect(currencyAPI.getCurrencySymbol(Currency.ILS)).toBe('₪');
      expect(currencyAPI.getCurrencySymbol(Currency.USD)).toBe('$');
      expect(currencyAPI.getCurrencySymbol(Currency.EUR)).toBe('€');
      expect(currencyAPI.getCurrencySymbol(Currency.GBP)).toBe('£');
      expect(currencyAPI.getCurrencySymbol(Currency.BTC)).toBe('₿');
      expect(currencyAPI.getCurrencySymbol(Currency.ETH)).toBe('Ξ');
    });
  });

  describe('getRate', () => {
    it('should return 1 for same currency conversion', async () => {
      const rate = await currencyAPI.getRate(Currency.ILS, Currency.ILS);
      expect(rate).toBe(1);
    });

    it('should return a positive number for different currencies', async () => {
      const rate = await currencyAPI.getRate(Currency.USD, Currency.ILS);
      expect(rate).toBeGreaterThan(0);
    });
  });

  describe('convertAmount', () => {
    it('should return conversion result with correct structure', async () => {
      const result = await currencyAPI.convertAmount(100, Currency.ILS, Currency.USD);
      
      expect(result).toHaveProperty('originalAmount', 100);
      expect(result).toHaveProperty('convertedAmount');
      expect(result).toHaveProperty('fromCurrency', Currency.ILS);
      expect(result).toHaveProperty('toCurrency', Currency.USD);
      expect(result).toHaveProperty('rate');
      expect(result).toHaveProperty('timestamp');
      
      expect(typeof result.convertedAmount).toBe('number');
      expect(typeof result.rate).toBe('number');
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should throw error for negative amounts', async () => {
      await expect(
        currencyAPI.convertAmount(-100, Currency.ILS, Currency.USD)
      ).rejects.toThrow('Amount cannot be negative');
    });
  });

  describe('getSupportedCurrencies', () => {
    it('should return all supported currencies', () => {
      const currencies = currencyAPI.getSupportedCurrencies();
      expect(currencies).toContain(Currency.ILS);
      expect(currencies).toContain(Currency.USD);
      expect(currencies).toContain(Currency.EUR);
      expect(currencies).toContain(Currency.GBP);
      expect(currencies).toContain(Currency.BTC);
      expect(currencies).toContain(Currency.ETH);
    });
  });

  describe('isCurrencySupported', () => {
    it('should return true for supported currencies', () => {
      expect(currencyAPI.isCurrencySupported('ILS')).toBe(true);
      expect(currencyAPI.isCurrencySupported('USD')).toBe(true);
      expect(currencyAPI.isCurrencySupported('BTC')).toBe(true);
    });

    it('should return false for unsupported currencies', () => {
      expect(currencyAPI.isCurrencySupported('JPY')).toBe(false);
      expect(currencyAPI.isCurrencySupported('XYZ')).toBe(false);
      expect(currencyAPI.isCurrencySupported('')).toBe(false);
    });
  });

  describe('getCacheStatus', () => {
    it('should return cache status object', () => {
      const status = currencyAPI.getCacheStatus();
      
      expect(status).toHaveProperty('isValid');
      expect(status).toHaveProperty('lastUpdated');
      expect(status).toHaveProperty('cacheSize');
      expect(status).toHaveProperty('timeToExpiry');
      
      expect(typeof status.isValid).toBe('boolean');
      expect(typeof status.cacheSize).toBe('number');
      expect(typeof status.timeToExpiry).toBe('number');
    });
  });
});