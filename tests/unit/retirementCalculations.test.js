// Unit tests for retirementCalculations.js
// Tests all calculation functions with various scenarios and edge cases

const { TestFramework } = require('../utils/test-framework');
const test = new TestFramework();

// Mock window object for browser environment
global.window = {
    formatCurrency: null,
    convertCurrency: null,
    getNetReturn: null,
    calculateWeightedReturn: null
};

// Load the module
require('../../src/utils/retirementCalculations.js');

// Test suite
test.describe('Retirement Calculations Unit Tests', () => {
    
    test.describe('formatCurrency', () => {
        test.it('should format positive amounts correctly', () => {
            const result = window.formatCurrency(10000);
            test.expect(result).toBe('₪10,000');
        });

        test.it('should format zero correctly', () => {
            const result = window.formatCurrency(0);
            test.expect(result).toBe('₪0');
        });

        test.it('should format negative amounts correctly', () => {
            const result = window.formatCurrency(-5000);
            test.expect(result).toBe('-₪5,000');
        });

        test.it('should format large amounts correctly', () => {
            const result = window.formatCurrency(1000000);
            test.expect(result).toBe('₪1,000,000');
        });

        test.it('should handle decimal amounts', () => {
            const result = window.formatCurrency(1234.56);
            test.expect(result).toBe('₪1,235');
        });
    });

    test.describe('convertCurrency', () => {
        const mockExchangeRates = {
            USD: 3.5,
            EUR: 4.0,
            GBP: 4.5,
            ILS: 1.0,
            BTC: 150000,
            ETH: 10000
        };

        test.it('should convert ILS to USD correctly', () => {
            const result = window.convertCurrency(3500, 'USD', mockExchangeRates);
            test.expect(result).toBe('$1,000');
        });

        test.it('should convert ILS to EUR correctly', () => {
            const result = window.convertCurrency(4000, 'EUR', mockExchangeRates);
            test.expect(result).toBe('1.000 €');
        });

        test.it('should convert ILS to GBP correctly', () => {
            const result = window.convertCurrency(4500, 'GBP', mockExchangeRates);
            test.expect(result).toBe('£1,000');
        });

        test.it('should convert ILS to BTC correctly', () => {
            const result = window.convertCurrency(150000, 'BTC', mockExchangeRates);
            test.expect(result).toBe('₿1.000000');
        });

        test.it('should convert ILS to ETH correctly', () => {
            const result = window.convertCurrency(10000, 'ETH', mockExchangeRates);
            test.expect(result).toBe('Ξ1.0000');
        });

        test.it('should return N/A for invalid exchange rates', () => {
            const result = window.convertCurrency(1000, 'USD', null);
            test.expect(result).toBe('N/A');
        });

        test.it('should return N/A for zero exchange rate', () => {
            const result = window.convertCurrency(1000, 'USD', { USD: 0 });
            test.expect(result).toBe('N/A');
        });

        test.it('should return N/A for missing currency', () => {
            const result = window.convertCurrency(1000, 'JPY', mockExchangeRates);
            test.expect(result).toBe('N/A');
        });

        test.it('should return N/A for invalid amount', () => {
            const result = window.convertCurrency(null, 'USD', mockExchangeRates);
            test.expect(result).toBe('N/A');
        });

        test.it('should return N/A for NaN amount', () => {
            const result = window.convertCurrency(NaN, 'USD', mockExchangeRates);
            test.expect(result).toBe('N/A');
        });

        test.it('should handle undefined currency', () => {
            const result = window.convertCurrency(1000, undefined, mockExchangeRates);
            test.expect(result).toBe('N/A');
        });

        test.it('should handle negative amounts', () => {
            const result = window.convertCurrency(-3500, 'USD', mockExchangeRates);
            test.expect(result).toBe('-$1,000');
        });
    });

    test.describe('getNetReturn', () => {
        test.it('should calculate net return correctly', () => {
            const result = window.getNetReturn(7.5, 1.2);
            test.expect(result).toBe(6.3);
        });

        test.it('should handle zero management fee', () => {
            const result = window.getNetReturn(7.5, 0);
            test.expect(result).toBe(7.5);
        });

        test.it('should handle negative gross return', () => {
            const result = window.getNetReturn(-2.5, 1.2);
            test.expect(result).toBe(-3.7);
        });

        test.it('should handle zero gross return', () => {
            const result = window.getNetReturn(0, 1.2);
            test.expect(result).toBe(-1.2);
        });

        test.it('should handle decimal precision', () => {
            const result = window.getNetReturn(7.555, 1.234);
            test.expect(Math.round(result * 1000) / 1000).toBe(6.321);
        });
    });

    test.describe('calculateWeightedReturn', () => {
        const mockHistoricalReturns = {
            5: { 0: 3.5, 1: 5.2, 2: 7.8, 3: 2.1, 4: 4.5 },
            10: { 0: 4.2, 1: 6.1, 2: 8.5, 3: 2.8, 4: 5.2 },
            15: { 0: 4.8, 1: 6.8, 2: 9.2, 3: 3.5, 4: 5.8 },
            20: { 0: 5.5, 1: 7.5, 2: 10.0, 3: 4.2, 4: 6.5 },
            25: { 0: 6.0, 1: 8.0, 2: 10.5, 3: 4.8, 4: 7.0 },
            30: { 0: 6.5, 1: 8.5, 2: 11.0, 3: 5.5, 4: 7.5 }
        };

        test.it('should calculate weighted return for single allocation', () => {
            const allocations = [
                { index: 2, percentage: 100, customReturn: null }
            ];
            const result = window.calculateWeightedReturn(allocations, 20, mockHistoricalReturns);
            test.expect(result).toBe(10.0);
        });

        test.it('should calculate weighted return for multiple allocations', () => {
            const allocations = [
                { index: 0, percentage: 30, customReturn: null },
                { index: 2, percentage: 70, customReturn: null }
            ];
            const result = window.calculateWeightedReturn(allocations, 20, mockHistoricalReturns);
            test.expect(result).toBe(30 * 5.5 / 100 + 70 * 10.0 / 100);
        });

        test.it('should use custom returns when provided', () => {
            const allocations = [
                { index: 0, percentage: 50, customReturn: 8.0 },
                { index: 1, percentage: 50, customReturn: 12.0 }
            ];
            const result = window.calculateWeightedReturn(allocations, 20, mockHistoricalReturns);
            test.expect(result).toBe(10.0);
        });

        test.it('should handle partial allocations', () => {
            const allocations = [
                { index: 0, percentage: 40, customReturn: null },
                { index: 1, percentage: 30, customReturn: null }
            ];
            const result = window.calculateWeightedReturn(allocations, 20, mockHistoricalReturns);
            test.expect(result).toBe(40 * 5.5 / 100 + 30 * 7.5 / 100);
        });

        test.it('should return 0 for empty allocations', () => {
            const result = window.calculateWeightedReturn([], 20, mockHistoricalReturns);
            test.expect(result).toBe(0);
        });

        test.it('should handle null allocations', () => {
            const result = window.calculateWeightedReturn(null, 20, mockHistoricalReturns);
            test.expect(result).toBe(0);
        });

        test.it('should handle undefined allocations', () => {
            const result = window.calculateWeightedReturn(undefined, 20, mockHistoricalReturns);
            test.expect(result).toBe(0);
        });

        test.it('should handle invalid allocation objects', () => {
            const allocations = [
                null,
                { index: 0, percentage: 50, customReturn: null },
                undefined,
                { index: 1, percentage: 50, customReturn: null }
            ];
            const result = window.calculateWeightedReturn(allocations, 20, mockHistoricalReturns);
            test.expect(result).toBe(50 * 5.5 / 100 + 50 * 7.5 / 100);
        });

        test.it('should handle missing historical returns', () => {
            const allocations = [
                { index: 0, percentage: 100, customReturn: null }
            ];
            const result = window.calculateWeightedReturn(allocations, 20, null);
            test.expect(result).toBe(0);
        });

        test.it('should use closest time horizon', () => {
            const allocations = [
                { index: 0, percentage: 100, customReturn: null }
            ];
            const result = window.calculateWeightedReturn(allocations, 12, mockHistoricalReturns);
            test.expect(result).toBe(4.2); // Should use 10-year returns
        });

        test.it('should handle edge case time horizons', () => {
            const allocations = [
                { index: 0, percentage: 100, customReturn: null }
            ];
            const result1 = window.calculateWeightedReturn(allocations, 3, mockHistoricalReturns);
            test.expect(result1).toBe(3.5); // Should use 5-year returns
            
            const result2 = window.calculateWeightedReturn(allocations, 35, mockHistoricalReturns);
            test.expect(result2).toBe(6.5); // Should use 30-year returns
        });

        test.it('should handle zero percentages', () => {
            const allocations = [
                { index: 0, percentage: 0, customReturn: null },
                { index: 1, percentage: 100, customReturn: null }
            ];
            const result = window.calculateWeightedReturn(allocations, 20, mockHistoricalReturns);
            test.expect(result).toBe(7.5);
        });

        test.it('should handle string percentages', () => {
            const allocations = [
                { index: 0, percentage: '50', customReturn: null },
                { index: 1, percentage: '50', customReturn: null }
            ];
            const result = window.calculateWeightedReturn(allocations, 20, mockHistoricalReturns);
            test.expect(result).toBe(50 * 5.5 / 100 + 50 * 7.5 / 100);
        });

        test.it('should handle invalid percentages', () => {
            const allocations = [
                { index: 0, percentage: 'invalid', customReturn: null },
                { index: 1, percentage: 100, customReturn: null }
            ];
            const result = window.calculateWeightedReturn(allocations, 20, mockHistoricalReturns);
            test.expect(result).toBe(7.5);
        });

        test.it('should handle missing index in historical returns', () => {
            const allocations = [
                { index: 99, percentage: 100, customReturn: null }
            ];
            const result = window.calculateWeightedReturn(allocations, 20, mockHistoricalReturns);
            test.expect(result).toBe(0);
        });
    });
});

// Run the tests
test.run();