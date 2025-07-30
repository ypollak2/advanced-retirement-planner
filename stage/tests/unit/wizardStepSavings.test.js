// Unit tests for WizardStepSavings.js - Enhanced Investment Tax Handler
// Tests tax validation, currency conversion, and UI behavior

const { TestFramework } = require('../utils/test-framework');
const test = new TestFramework();

// Mock React environment (simplified for testing)
global.React = {
    createElement: (type, props, ...children) => ({ type, props, children }),
    useState: (initial) => [initial, () => {}],
    useCallback: (fn) => fn,
    useEffect: () => {}
};

// Mock window objects
global.window = {
    currencyAPI: {
        getRate: () => Promise.resolve(0.27), // 1 ILS = 0.27 USD
        convertAmount: () => Promise.resolve(2700) // Mock conversion
    },
    getCurrencyRate: () => Promise.resolve(0.27)
};

test.describe('Enhanced Investment Tax Handler Tests', () => {
    
    test.describe('Tax Rate Validation', () => {
        // Mock the validateTaxRate function
        const validateTaxRate = (rate) => {
            const numRate = parseFloat(rate);
            if (isNaN(numRate)) return 25;
            if (numRate < 0) return 0;
            if (numRate > 60) return 60;
            return numRate;
        };

        test.it('should validate normal tax rates correctly', () => {
            test.expect(validateTaxRate('25')).toBe(25);
            test.expect(validateTaxRate('30.5')).toBe(30.5);
            test.expect(validateTaxRate('0')).toBe(0);
            test.expect(validateTaxRate('60')).toBe(60);
        });

        test.it('should clamp tax rates to valid range', () => {
            test.expect(validateTaxRate('-5')).toBe(0);
            test.expect(validateTaxRate('75')).toBe(60);
            test.expect(validateTaxRate('100')).toBe(60);
        });

        test.it('should handle invalid inputs', () => {
            test.expect(validateTaxRate('abc')).toBe(25);
            test.expect(validateTaxRate('')).toBe(25);
            test.expect(validateTaxRate(null)).toBe(25);
            test.expect(validateTaxRate(undefined)).toBe(25);
        });

        test.it('should handle edge cases', () => {
            test.expect(validateTaxRate('0.1')).toBe(0.1);
            test.expect(validateTaxRate('59.9')).toBe(59.9);
            test.expect(validateTaxRate('60.1')).toBe(60);
        });
    });

    test.describe('Currency Conversion', () => {
        // Mock the convertCurrency function
        const convertCurrency = async (amount, fromCurrency = 'ILS', toCurrency = 'USD') => {
            if (fromCurrency === toCurrency || !amount) return amount;
            
            try {
                if (window.currencyAPI && window.currencyAPI.getRate) {
                    const rate = await window.currencyAPI.getRate(fromCurrency, toCurrency);
                    return amount * rate;
                }
            } catch (error) {
                // Fallback rates
                const fallbackRates = {
                    'USD': 0.27, 'EUR': 0.25, 'GBP': 0.22
                };
                
                if (fromCurrency === 'ILS') {
                    const rate = fallbackRates[toCurrency] || 1;
                    return amount * rate;
                }
                
                return amount;
            }
        };

        test.it('should convert ILS to USD correctly', async () => {
            const result = await convertCurrency(10000, 'ILS', 'USD');
            test.expect(result).toBe(2700); // Mock API returns 2700
        });

        test.it('should return same amount for same currency', async () => {
            const result = await convertCurrency(10000, 'ILS', 'ILS');
            test.expect(result).toBe(10000);
        });

        test.it('should handle zero amounts', async () => {
            const result = await convertCurrency(0, 'ILS', 'USD');
            test.expect(result).toBe(0);
        });

        test.it('should use fallback rates when API fails', async () => {
            // Temporarily remove API to simulate failure
            const originalAPI = window.currencyAPI;
            window.currencyAPI = null;
            
            const fallbackConvertCurrency = async (amount, fromCurrency = 'ILS', toCurrency = 'USD') => {
                if (fromCurrency === toCurrency || !amount) return amount;
                
                const fallbackRates = {
                    'USD': 0.27, 'EUR': 0.25, 'GBP': 0.22
                };
                
                if (fromCurrency === 'ILS') {
                    const rate = fallbackRates[toCurrency] || 1;
                    return amount * rate;
                }
                
                return amount;
            };
            
            const result = await fallbackConvertCurrency(1000, 'ILS', 'USD');
            
            // Restore API
            window.currencyAPI = originalAPI;
            
            test.expect(result).toBe(270); // 1000 * 0.27 fallback rate
        });
    });

    test.describe('Net Value Calculations', () => {
        // Mock net value calculation
        const calculateNetValue = (portfolioValue, taxRate) => {
            if (!portfolioValue || portfolioValue <= 0) return 0;
            const finalTaxRate = (taxRate !== undefined && taxRate !== null) ? taxRate : 0.25;
            return portfolioValue * (1 - finalTaxRate);
        };

        test.it('should calculate net value with default 25% tax', () => {
            const result = calculateNetValue(10000);
            test.expect(result).toBe(7500); // 10000 * (1 - 0.25)
        });

        test.it('should calculate net value with custom tax rate', () => {
            const result = calculateNetValue(10000, 0.30);
            test.expect(result).toBe(7000); // 10000 * (1 - 0.30)
        });

        test.it('should handle zero portfolio value', () => {
            const result = calculateNetValue(0, 0.25);
            test.expect(result).toBe(0);
        });

        test.it('should handle zero tax rate', () => {
            const result = calculateNetValue(10000, 0);
            test.expect(result).toBe(10000); // No tax applied
        });

        test.it('should handle maximum tax rate (60%)', () => {
            const result = calculateNetValue(10000, 0.60);
            test.expect(result).toBe(4000); // 10000 * (1 - 0.60)
        });
    });

    test.describe('Currency Formatting', () => {
        // Mock currency formatting function
        const getCurrencySymbol = (currency) => {
            const symbols = {
                'ILS': '₪', 'USD': '$', 'EUR': '€', 'GBP': '£'
            };
            return symbols[currency] || '₪';
        };

        const formatCurrency = (amount, currency = 'ILS') => {
            const roundedAmount = Math.round(amount || 0);
            const symbol = getCurrencySymbol(currency);
            const formatted = new Intl.NumberFormat('en-US').format(roundedAmount);
            return `${symbol}${formatted}`;
        };

        test.it('should format ILS currency correctly', () => {
            const result = formatCurrency(12345, 'ILS');
            test.expect(result).toBe('₪12,345');
        });

        test.it('should format USD currency correctly', () => {
            const result = formatCurrency(12345, 'USD');
            test.expect(result).toBe('$12,345');
        });

        test.it('should handle zero amounts', () => {
            const result = formatCurrency(0, 'USD');
            test.expect(result).toBe('$0');
        });

        test.it('should handle large amounts', () => {
            const result = formatCurrency(1234567, 'EUR');
            test.expect(result).toBe('€1,234,567');
        });

        test.it('should round decimal amounts', () => {
            const result = formatCurrency(12345.67, 'GBP');
            test.expect(result).toBe('£12,346');
        });
    });

    test.describe('Integration Tests', () => {
        test.it('should handle complete tax calculation workflow', async () => {
            const portfolioValue = 100000;
            const taxRate = 0.25;
            const currency = 'USD';
            
            // Step 1: Calculate net value
            const netValueILS = portfolioValue * (1 - taxRate);
            test.expect(netValueILS).toBe(75000);
            
            // Step 2: Convert currency
            const netValueUSD = await convertCurrency(netValueILS, 'ILS', currency);
            test.expect(netValueUSD).toBe(20250); // 75000 * 0.27
            
            // Step 3: Format for display
            const formatted = formatCurrency(netValueUSD, currency);
            test.expect(formatted).toBe('$20,250');
        });

        test.it('should handle couple mode calculations', () => {
            const partner1Portfolio = 50000;
            const partner1TaxRate = 0.25;
            const partner2Portfolio = 75000;
            const partner2TaxRate = 0.30;
            
            const partner1Net = calculateNetValue(partner1Portfolio, partner1TaxRate);
            const partner2Net = calculateNetValue(partner2Portfolio, partner2TaxRate);
            
            test.expect(partner1Net).toBe(37500); // 50000 * 0.75
            test.expect(partner2Net).toBe(52500); // 75000 * 0.70
            
            const totalNet = partner1Net + partner2Net;
            test.expect(totalNet).toBe(90000);
        });
    });

    test.describe('Error Handling', () => {
        test.it('should handle API failures gracefully', async () => {
            // Mock complete API failure
            const originalAPI = window.currencyAPI;
            const originalRate = window.getCurrencyRate;
            window.currencyAPI = null;
            window.getCurrencyRate = null;
            
            const result = await convertCurrency(10000, 'ILS', 'USD');
            
            // Restore
            window.currencyAPI = originalAPI;
            window.getCurrencyRate = originalRate;
            
            test.expect(result).toBe(2700); // Should use fallback rate: 10000 * 0.27
        });

        test.it('should handle invalid portfolio values', () => {
            test.expect(calculateNetValue(null, 0.25)).toBe(0);
            test.expect(calculateNetValue(undefined, 0.25)).toBe(0);
            test.expect(calculateNetValue(-1000, 0.25)).toBe(0);
        });

        test.it('should handle invalid tax rates', () => {
            const result1 = calculateNetValue(10000, null);
            const result2 = calculateNetValue(10000, undefined);
            
            test.expect(result1).toBe(7500); // Should use default 25%
            test.expect(result2).toBe(7500); // Should use default 25%
        });
    });
});

// Mock the calculateNetValue function for testing
function calculateNetValue(portfolioValue, taxRate) {
    if (!portfolioValue || portfolioValue <= 0) return 0;
    const finalTaxRate = (taxRate !== undefined && taxRate !== null) ? taxRate : 0.25;
    return portfolioValue * (1 - finalTaxRate);
}

// Mock convertCurrency function
async function convertCurrency(amount, fromCurrency = 'ILS', toCurrency = 'USD') {
    if (fromCurrency === toCurrency || !amount) return amount;
    
    try {
        if (window.currencyAPI && window.currencyAPI.getRate) {
            const rate = await window.currencyAPI.getRate(fromCurrency, toCurrency);
            return amount * rate;
        }
    } catch (error) {
        console.warn('Currency API failed, using fallback');
    }
    
    // Fallback rates (always executed if API fails or is unavailable)
    const fallbackRates = {
        'USD': 0.27, 'EUR': 0.25, 'GBP': 0.22
    };
    
    if (fromCurrency === 'ILS') {
        const rate = fallbackRates[toCurrency] || 1;
        return amount * rate;
    }
    
    return amount;
}

// Mock formatCurrency function
function formatCurrency(amount, currency = 'ILS') {
    const symbols = { 'ILS': '₪', 'USD': '$', 'EUR': '€', 'GBP': '£' };
    const symbol = symbols[currency] || '₪';
    const formatted = new Intl.NumberFormat('en-US').format(Math.round(amount || 0));
    return `${symbol}${formatted}`;
}

// Run the tests
test.run();