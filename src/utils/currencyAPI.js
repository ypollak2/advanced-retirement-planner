// Currency Exchange Rate API - Live rates with fallback system
// Created by Yali Pollak (יהלי פולק) - v5.3.0

class CurrencyAPI {
    constructor() {
        this.cache = new Map();
        this.lastUpdated = null;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.fallbackRates = {
            USD: 3.7,
            GBP: 4.6,
            EUR: 4.0,
            BTC: 0.000002,
            ETH: 0.0003
        };
        
        // Multiple API endpoints for redundancy
        this.apiEndpoints = [
            {
                name: 'ExchangeRate-API',
                url: 'https://api.exchangerate-api.com/v4/latest/ILS',
                parse: (data) => ({
                    USD: 1 / data.rates.USD,
                    GBP: 1 / data.rates.GBP,
                    EUR: 1 / data.rates.EUR
                })
            },
            {
                name: 'Fixer.io',
                url: 'https://api.fixer.io/latest?base=ILS',
                parse: (data) => data.rates
            },
            {
                name: 'CoinGecko-Crypto',
                url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=ils',
                parse: (data) => ({
                    BTC: 1 / data.bitcoin.ils,
                    ETH: 1 / data.ethereum.ils
                })
            }
        ];
    }

    // Check if cache is valid
    isCacheValid() {
        return this.lastUpdated && 
               (Date.now() - this.lastUpdated) < this.cacheTimeout;
    }

    // Get cached rates if valid
    getCachedRates() {
        if (this.isCacheValid() && this.cache.size > 0) {
            return Object.fromEntries(this.cache);
        }
        return null;
    }

    // Fetch from single API endpoint
    async fetchFromEndpoint(endpoint) {
        try {
            const response = await fetch(endpoint.url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return endpoint.parse(data);
        } catch (error) {
            console.warn(`CurrencyAPI: ${endpoint.name} failed:`, error.message);
            return null;
        }
    }

    // Fetch exchange rates with fallback
    async fetchExchangeRates() {
        // Return cached rates if still valid
        const cached = this.getCachedRates();
        if (cached) {
            console.log('CurrencyAPI: Using cached exchange rates');
            return cached;
        }

        let rates = { ...this.fallbackRates };
        let successfulFetches = 0;

        // Try each API endpoint
        for (const endpoint of this.apiEndpoints) {
            try {
                const endpointRates = await this.fetchFromEndpoint(endpoint);
                if (endpointRates) {
                    rates = { ...rates, ...endpointRates };
                    successfulFetches++;
                    console.log(`CurrencyAPI: Successfully fetched from ${endpoint.name}`);
                }
            } catch (error) {
                console.warn(`CurrencyAPI: ${endpoint.name} error:`, error);
            }
        }

        // Update cache
        this.cache.clear();
        Object.entries(rates).forEach(([currency, rate]) => {
            this.cache.set(currency, rate);
        });
        this.lastUpdated = Date.now();

        console.log(`CurrencyAPI: Updated rates with ${successfulFetches} successful fetches`);
        return rates;
    }

    // Get specific currency rate
    async getRate(fromCurrency, toCurrency = 'ILS') {
        const rates = await this.fetchExchangeRates();
        
        if (fromCurrency === toCurrency) return 1;
        if (fromCurrency === 'ILS') return rates[toCurrency] || 1;
        if (toCurrency === 'ILS') return 1 / (rates[fromCurrency] || 1);
        
        // Cross currency conversion (e.g., USD to EUR)
        const fromRate = rates[fromCurrency] || 1;
        const toRate = rates[toCurrency] || 1;
        return toRate / fromRate;
    }

    // Convert amount between currencies
    async convertAmount(amount, fromCurrency, toCurrency = 'ILS') {
        const rate = await this.getRate(fromCurrency, toCurrency);
        return amount * rate;
    }

    // Format currency with proper symbol and formatting
    formatCurrency(amount, currency = 'ILS', locale = 'he-IL') {
        const symbols = {
            ILS: '₪',
            USD: '$',
            GBP: '£',
            EUR: '€',
            BTC: '₿',
            ETH: 'Ξ'
        };

        const symbol = symbols[currency] || currency;
        
        if (currency === 'BTC' || currency === 'ETH') {
            return `${symbol}${amount.toFixed(6)}`;
        }
        
        try {
            const formatter = new Intl.NumberFormat(locale, {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            return `${symbol}${formatter.format(Math.round(amount))}`;
        } catch (error) {
            return `${symbol}${Math.round(amount).toLocaleString()}`;
        }
    }

    // Get last update timestamp
    getLastUpdated() {
        return this.lastUpdated;
    }

    // Force refresh rates
    async forceRefresh() {
        this.cache.clear();
        this.lastUpdated = null;
        return await this.fetchExchangeRates();
    }

    // Get cache status
    getCacheStatus() {
        return {
            isValid: this.isCacheValid(),
            lastUpdated: this.lastUpdated,
            cacheSize: this.cache.size,
            timeToExpiry: this.lastUpdated ? 
                Math.max(0, this.cacheTimeout - (Date.now() - this.lastUpdated)) : 0
        };
    }
}

// Create global instance
const currencyAPI = new CurrencyAPI();

// Export functions to window for global access
window.CurrencyAPI = CurrencyAPI;
window.currencyAPI = currencyAPI;
window.fetchExchangeRates = () => currencyAPI.fetchExchangeRates();
window.convertCurrency = (amount, from, to) => currencyAPI.convertAmount(amount, from, to);
window.formatCurrencyAmount = (amount, currency, locale) => currencyAPI.formatCurrency(amount, currency, locale);
window.getCurrencyRate = (from, to) => currencyAPI.getRate(from, to);

// Initialize rates on load
document.addEventListener('DOMContentLoaded', () => {
    currencyAPI.fetchExchangeRates().catch(error => {
        console.warn('Initial currency rate fetch failed:', error);
    });
});

console.log('CurrencyAPI v5.3.0 loaded successfully');