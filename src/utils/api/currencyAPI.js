// Currency Exchange Rate API - Live rates with fallback system
// Created by Yali Pollak (יהלי פולק) - v7.5.11

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
        
        // Rate boundaries for validation (min, max)
        this.rateBoundaries = {
            USD: { min: 2.5, max: 5.0 },
            EUR: { min: 3.0, max: 6.0 },
            GBP: { min: 3.5, max: 7.0 },
            BTC: { min: 0.00001, max: 0.001 },
            ETH: { min: 0.0001, max: 0.01 }
        };
        
        // API endpoints with CORS-friendly options and better fallbacks
        this.apiEndpoints = [
            {
                name: 'ExchangeRate-API',
                url: 'https://api.exchangerate-api.com/v4/latest/ILS',
                parse: (data) => {
                    const rates = data.rates;
                    // Validate rates before division
                    const usdRate = rates.USD || 0.27;
                    const eurRate = rates.EUR || 0.25;
                    const gbpRate = rates.GBP || 0.22;
                    
                    return {
                        USD: usdRate > 0 ? 1 / usdRate : 3.7,
                        EUR: eurRate > 0 ? 1 / eurRate : 4.0,
                        GBP: gbpRate > 0 ? 1 / gbpRate : 4.6
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
                parse: (data) => {
                    const btcRate = data.bitcoin?.ils || 150000;
                    const ethRate = data.ethereum?.ils || 10000;
                    
                    return {
                        BTC: btcRate > 0 ? 1 / btcRate : 1 / 150000,
                        ETH: ethRate > 0 ? 1 / ethRate : 1 / 10000
                    };
                }
            },
            {
                name: 'Fallback-Priority',
                url: null, // Use fallback rates
                parse: () => this.fallbackRates
            }
        ];
    }

    // Validate rate is within reasonable boundaries
    isRateValid(currency, rate) {
        if (!rate || rate <= 0 || !isFinite(rate)) {
            return false;
        }
        
        const boundaries = this.rateBoundaries[currency];
        if (!boundaries) {
            // Unknown currency, accept any positive rate
            return true;
        }
        
        // Check if rate is within boundaries
        if (rate < boundaries.min || rate > boundaries.max) {
            console.warn(`Rate for ${currency} (${rate}) is outside expected range [${boundaries.min}, ${boundaries.max}]`);
            return false;
        }
        
        return true;
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

    // Fetch exchange rates with improved fallback system
    async fetchExchangeRates() {
        // Try to get cached rates first
        const cachedRates = this.getCachedRates();
        if (cachedRates) {
            return cachedRates;
        }

        // Try CORS-friendly APIs with timeout and error handling
        for (const endpoint of this.apiEndpoints.slice(0, -1)) { // Skip fallback endpoint in loop
            try {
                console.log(`CurrencyAPI: Attempting to fetch from ${endpoint.name}...`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
                
                const response = await fetch(endpoint.url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Advanced-Retirement-Planner/6.6.3'
                    },
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                const rates = endpoint.parse(data);
                
                // Validate and update cache with fetched rates
                this.cache.clear();
                const validatedRates = {};
                
                Object.entries(rates).forEach(([currency, rate]) => {
                    if (this.isRateValid(currency, rate)) {
                        this.cache.set(currency, rate);
                        validatedRates[currency] = rate;
                    } else {
                        // Use fallback for invalid rates
                        const fallback = this.fallbackRates[currency];
                        if (fallback) {
                            console.warn(`Using fallback rate for ${currency}: ${fallback}`);
                            this.cache.set(currency, fallback);
                            validatedRates[currency] = fallback;
                        }
                    }
                });
                
                this.lastUpdated = Date.now();
                this.lastError = null;

                console.log(`CurrencyAPI: Successfully fetched rates from ${endpoint.name}`);
                return validatedRates;
                
            } catch (error) {
                console.warn(`CurrencyAPI: ${endpoint.name} failed:`, error.message);
                this.lastError = error.message;
                continue; // Try next endpoint
            }
        }
        
        // All APIs failed, use fallback rates
        console.log('CurrencyAPI: All APIs failed, using fallback rates');
        const fallbackRates = { 
            USD: 3.70,      // Updated July 2025 rates
            EUR: 4.02,      
            GBP: 4.65,      
            BTC: 150000,    // ~$40,000 per BTC
            ETH: 10000      // ~$2,700 per ETH
        };

        // Update cache with fallback rates
        this.cache.clear();
        Object.entries(fallbackRates).forEach(([currency, rate]) => {
            this.cache.set(currency, rate);
        });
        this.lastUpdated = Date.now();
        this.usingFallback = true;

        return fallbackRates;
    }

    // Backward compatibility alias for fetchExchangeRates
    async getExchangeRates() {
        return await this.fetchExchangeRates();
    }

    // Get specific currency rate with validation
    async getRate(fromCurrency, toCurrency = 'ILS') {
        const rates = await this.fetchExchangeRates();
        
        if (fromCurrency === toCurrency) return 1;
        
        if (fromCurrency === 'ILS') {
            const rate = rates[toCurrency];
            if (!rate || rate <= 0 || !isFinite(rate)) {
                console.warn(`Invalid rate for ${toCurrency}, using fallback`);
                return 1 / (this.fallbackRates[toCurrency] || 1);
            }
            return 1 / rate;
        }
        
        if (toCurrency === 'ILS') {
            const rate = rates[fromCurrency];
            if (!rate || rate <= 0 || !isFinite(rate)) {
                console.warn(`Invalid rate for ${fromCurrency}, using fallback`);
                return this.fallbackRates[fromCurrency] || 1;
            }
            return rate;
        }
        
        // Cross currency conversion (e.g., USD to EUR)
        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        
        if (!fromRate || fromRate <= 0 || !isFinite(fromRate) ||
            !toRate || toRate <= 0 || !isFinite(toRate)) {
            console.warn(`Invalid cross-currency rates for ${fromCurrency}/${toCurrency}, using fallbacks`);
            const fallbackFrom = this.fallbackRates[fromCurrency] || 1;
            const fallbackTo = this.fallbackRates[toCurrency] || 1;
            return fallbackFrom / fallbackTo;
        }
        
        return fromRate / toRate;
    }

    // Convert amount between currencies with validation
    async convertAmount(amount, fromCurrency, toCurrency = 'ILS') {
        // Validate input amount
        if (!amount || !isFinite(amount)) {
            console.warn(`Invalid amount for conversion: ${amount}`);
            return 0;
        }
        
        const rate = await this.getRate(fromCurrency, toCurrency);
        
        // Validate rate
        if (!rate || rate <= 0 || !isFinite(rate)) {
            console.warn(`Invalid conversion rate: ${rate}`);
            return amount; // Return original amount as fallback
        }
        
        const result = amount * rate;
        
        // Validate result
        if (!isFinite(result)) {
            console.warn(`Invalid conversion result: ${result}`);
            return amount; // Return original amount as fallback
        }
        
        return result;
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

    // Get error status for user-friendly display
    getErrorStatus() {
        return {
            hasError: !!this.lastError,
            errorMessage: this.lastError,
            usingFallback: !!this.usingFallback,
            lastUpdated: this.lastUpdated,
            cacheValid: this.isCacheValid()
        };
    }

    // Get user-friendly status message
    getStatusMessage(language = 'en') {
        const status = this.getErrorStatus();
        
        if (!status.hasError && !status.usingFallback) {
            return language === 'he' ? 
                'שערי החליפין מעודכנים' : 
                'Exchange rates are current';
        }
        
        if (status.usingFallback) {
            return language === 'he' ? 
                'משתמש בשערים מוערכים (API לא זמין)' : 
                'Using estimated rates (API unavailable)';
        }
        
        if (status.hasError) {
            return language === 'he' ? 
                'שגיאה בקבלת שערי חליפין - משתמש בערכים מוערכים' : 
                'Error fetching exchange rates - using estimated values';
        }
        
        return language === 'he' ? 'מעמד לא ידוע' : 'Unknown status';
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

console.log('CurrencyAPI v7.5.11 loaded successfully');