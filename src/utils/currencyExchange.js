// Currency Exchange API Integration
// Provides real-time exchange rates for multiple currencies

class CurrencyExchangeAPI {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.baseCurrency = 'ILS';
        this.supportedCurrencies = ['USD', 'EUR', 'GBP', 'BTC', 'ETH'];
        this.apiEndpoints = {
            fiat: 'https://api.exchangerate-api.com/v4/latest/ILS',
            crypto: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=ils'
        };
    }

    async fetchFiatRates() {
        try {
            const response = await fetch(this.apiEndpoints.fiat);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Convert ILS-based rates to proper format
            const rates = {};
            if (data.rates) {
                rates.USD = 1 / (data.rates.USD || 3.7); // ILS per USD
                rates.EUR = 1 / (data.rates.EUR || 4.0); // ILS per EUR  
                rates.GBP = 1 / (data.rates.GBP || 4.7); // ILS per GBP
            }
            
            return rates;
        } catch (error) {
            console.error('Error fetching fiat rates:', error);
            // Fallback rates
            return {
                USD: 0.27, // ~3.7 ILS per USD
                EUR: 0.25, // ~4.0 ILS per EUR
                GBP: 0.21  // ~4.7 ILS per GBP
            };
        }
    }

    async fetchCryptoRates() {
        try {
            const response = await fetch(this.apiEndpoints.crypto);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            const rates = {};
            if (data.bitcoin && data.bitcoin.ils) {
                rates.BTC = 1 / data.bitcoin.ils; // ILS per BTC
            }
            if (data.ethereum && data.ethereum.ils) {
                rates.ETH = 1 / data.ethereum.ils; // ILS per ETH
            }
            
            return rates;
        } catch (error) {
            console.error('Error fetching crypto rates:', error);
            // Fallback rates (approximate)
            return {
                BTC: 0.000025, // ~40,000 ILS per BTC
                ETH: 0.0003    // ~3,300 ILS per ETH
            };
        }
    }

    async getAllRates() {
        const cacheKey = 'all_rates';
        const cached = this.cache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const [fiatRates, cryptoRates] = await Promise.all([
                this.fetchFiatRates(),
                this.fetchCryptoRates()
            ]);

            const allRates = { ...fiatRates, ...cryptoRates };
            
            // Cache the results
            this.cache.set(cacheKey, {
                data: allRates,
                timestamp: Date.now()
            });

            return allRates;
        } catch (error) {
            console.error('Error fetching all rates:', error);
            // Return fallback rates
            return {
                USD: 0.27,
                EUR: 0.25,
                GBP: 0.21,
                BTC: 0.000025,
                ETH: 0.0003
            };
        }
    }

    formatCurrency(amount, currency) {
        const symbols = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            BTC: '₿',
            ETH: 'Ξ',
            ILS: '₪'
        };

        const decimals = currency === 'BTC' || currency === 'ETH' ? 6 : 2;
        
        return `${symbols[currency] || currency}${amount.toFixed(decimals)}`;
    }

    convertFromILS(amountILS, targetCurrency, rates) {
        if (!rates[targetCurrency]) {
            return null;
        }
        
        const converted = amountILS * rates[targetCurrency];
        return {
            amount: converted,
            formatted: this.formatCurrency(converted, targetCurrency)
        };
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CurrencyExchangeAPI;
} else {
    window.CurrencyExchangeAPI = CurrencyExchangeAPI;
}