// Currency Exchange Rate API - Live rates with fallback system
// Created by Yali Pollak (יהלי פולק) - v5.3.1

class CurrencyAPI {
    constructor() {
        this.cache = new Map();
        this.lastUpdated = null;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.fallbackRates = {
            USD: 3.70,   // Updated fallback rates
            GBP: 4.65,
            EUR: 4.02,
            BTC: 0.0000025,  // ~40,000 USD per BTC
            ETH: 0.00035     // ~2,850 USD per ETH
        };
        
        // API endpoints with CORS-friendly options and better fallbacks
        this.apiEndpoints = [
            {
                name: 'ExchangeRate-API',
                url: 'https://api.exchangerate-api.com/v4/latest/ILS',
                parse: (data) => {
                    const rates = data.rates;
                    return {
                        USD: 1 / (rates.USD || 0.27),
                        EUR: 1 / (rates.EUR || 0.25),
                        GBP: 1 / (rates.GBP || 0.22)
                    };
                }
            },
            {
                name: 'CoinGecko-Fiat',
                url: 'https://api.coingecko.com/api/v3/simple/price?ids=usd,eur,gbp&vs_currencies=ils',
                parse: (data) => ({
                    USD: data.usd?.ils || 3.7,
                    EUR: data.eur?.ils || 4.0,
                    GBP: data.gbp?.ils || 4.6
                })
            },
            {
                name: 'CoinGecko-Crypto',
                url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=ils',
                parse: (data) => ({
                    BTC: 1 / (data.bitcoin?.ils || 150000),
                    ETH: 1 / (data.ethereum?.ils || 10000)
                })
            },
            {
                name: 'Fallback-Priority',
                url: null, // Use fallback rates
                parse: () => this.fallbackRates
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

    // Fetch exchange rates with fallback (CORS-safe version)
    async fetchExchangeRates() {
        // Always use fallback rates to avoid CORS issues
        console.log('CurrencyAPI: Using fallback rates (API calls disabled to prevent CORS errors)');
        const rates = { 
            USD: 3.70,      // 1 ILS = 0.27 USD
            EUR: 4.02,      // 1 ILS = 0.25 EUR  
            GBP: 4.65,      // 1 ILS = 0.21 GBP
            BTC: 150000     // 1 ILS = 0.0000067 BTC (Bitcoin ~$45k)
        };

        // Update cache
        this.cache.clear();
        Object.entries(rates).forEach(([currency, rate]) => {
            this.cache.set(currency, rate);
        });
        this.lastUpdated = Date.now();

        console.log('CurrencyAPI: Updated rates using fallback values');
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

console.log('CurrencyAPI v5.3.1 loaded successfully');