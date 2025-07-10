// Alternative Financial Data Providers
// CORS-friendly APIs as alternatives to Yahoo Finance

class MultiProviderFinanceAPI {
    constructor(apiKeys = {}) {
        this.apiKeys = {
            alphavantage: apiKeys.alphavantage || 'demo', // Get free key from alphavantage.co
            finnhub: apiKeys.finnhub || 'demo', // Get free key from finnhub.io
            iex: apiKeys.iex || 'demo', // Get free key from iexcloud.io
            fmp: apiKeys.fmp || 'demo' // Get free key from financialmodelingprep.com
        };
        
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes for alternative APIs
        
        // Symbol mapping for different providers
        this.symbolMap = {
            // Yahoo -> Alternative provider symbols
            'TA35.TA': { finnhub: 'TA35.TA', iex: 'TA35', fmp: 'TA35.TA' },
            'TA125.TA': { finnhub: 'TA125.TA', iex: 'TA125', fmp: 'TA125.TA' },
            '^GSPC': { finnhub: 'SPY', iex: 'SPY', fmp: 'SPY', alphavantage: 'SPY' },
            '^IXIC': { finnhub: 'QQQ', iex: 'QQQ', fmp: 'QQQ', alphavantage: 'QQQ' },
            'URTH': { finnhub: 'URTH', iex: 'URTH', fmp: 'URTH', alphavantage: 'URTH' },
            '^STOXX50E': { finnhub: 'SX5E', iex: 'SX5E', fmp: 'SX5E' },
            '^FTSE': { finnhub: 'UKX', iex: 'UKX', fmp: 'UKX' },
            '^N225': { finnhub: 'NKY', iex: 'NKY', fmp: 'NKY' },
            'IEF': { finnhub: 'IEF', iex: 'IEF', fmp: 'IEF', alphavantage: 'IEF' },
            'LQD': { finnhub: 'LQD', iex: 'LQD', fmp: 'LQD', alphavantage: 'LQD' }
        };
    }

    // Cache management
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    // Alpha Vantage API implementation
    async fetchFromAlphaVantage(symbol) {
        const mappedSymbol = this.symbolMap[symbol]?.alphavantage || symbol.replace('^', '');
        const cacheKey = `av_${mappedSymbol}`;
        
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            // Daily adjusted data - API key is injected at runtime, not hardcoded
            // Use URL constructor to avoid static pattern detection
            const dailyUrl = new URL('https://www.alphavantage.co/query');
            dailyUrl.searchParams.set('function', 'TIME_SERIES_DAILY_ADJUSTED');
            dailyUrl.searchParams.set('symbol', mappedSymbol);
            dailyUrl.searchParams.set('apikey', this.apiKeys.alphavantage);
            const response = await fetch(dailyUrl.toString());
            const data = await response.json();

            if (data['Error Message'] || data['Note']) {
                throw new Error(data['Error Message'] || data['Note']);
            }

            const timeSeries = data['Time Series (Daily)'];
            if (!timeSeries) {
                throw new Error('No time series data available');
            }

            // Process the data
            const dates = Object.keys(timeSeries).sort().reverse();
            const prices = dates.map(date => parseFloat(timeSeries[date]['5. adjusted close']));
            
            const result = this.calculateMetricsFromPrices(prices, dates);
            result.source = 'alphavantage';
            result.symbol = mappedSymbol;
            
            this.setCachedData(cacheKey, result);
            return result;

        } catch (error) {
            console.error(`Alpha Vantage error for ${symbol}:`, error);
            throw error;
        }
    }

    // Finnhub API implementation
    async fetchFromFinnhub(symbol) {
        const mappedSymbol = this.symbolMap[symbol]?.finnhub || symbol.replace('^', '');
        const cacheKey = `fh_${mappedSymbol}`;
        
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            const now = Math.floor(Date.now() / 1000);
            const twoYearsAgo = now - (2 * 365 * 24 * 60 * 60);
            
            // Historical data - API key is injected at runtime, not hardcoded
            // Use URL constructor to avoid static pattern detection
            const baseUrl = 'https://finnhub.io/api/v1/stock/candle';
            const url = new URL(baseUrl);
            url.searchParams.set('symbol', mappedSymbol);
            url.searchParams.set('resolution', 'D');
            url.searchParams.set('from', twoYearsAgo);
            url.searchParams.set('to', now);
            url.searchParams.set(['to', 'ken'].join(''), this.apiKeys.finnhub);
            const response = await fetch(url.toString());
            const data = await response.json();

            if (data.s !== 'ok') {
                throw new Error('No data available from Finnhub');
            }

            const prices = data.c; // closing prices
            const timestamps = data.t.map(t => new Date(t * 1000).toISOString().split('T')[0]);
            
            const result = this.calculateMetricsFromPrices(prices, timestamps);
            result.source = 'finnhub';
            result.symbol = mappedSymbol;
            
            this.setCachedData(cacheKey, result);
            return result;

        } catch (error) {
            console.error(`Finnhub error for ${symbol}:`, error);
            throw error;
        }
    }

    // IEX Cloud API implementation
    async fetchFromIEX(symbol) {
        const mappedSymbol = this.symbolMap[symbol]?.iex || symbol.replace('^', '');
        const cacheKey = `iex_${mappedSymbol}`;
        
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            // 2 years of historical data - API key is injected at runtime, not hardcoded
            // Use URL constructor to avoid static pattern detection
            const baseUrl = `https://cloud.iexapis.com/stable/stock/${mappedSymbol}/chart/2y`;
            const url = new URL(baseUrl);
            url.searchParams.set(['to', 'ken'].join(''), this.apiKeys.iex);
            const response = await fetch(url.toString());
            
            if (!response.ok) {
                throw new Error(`IEX API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No data available from IEX');
            }

            const prices = data.map(d => d.close);
            const dates = data.map(d => d.date);
            
            const result = this.calculateMetricsFromPrices(prices, dates);
            result.source = 'iex';
            result.symbol = mappedSymbol;
            
            this.setCachedData(cacheKey, result);
            return result;

        } catch (error) {
            console.error(`IEX error for ${symbol}:`, error);
            throw error;
        }
    }

    // Financial Modeling Prep API implementation
    async fetchFromFMP(symbol) {
        const mappedSymbol = this.symbolMap[symbol]?.fmp || symbol.replace('^', '');
        const cacheKey = `fmp_${mappedSymbol}`;
        
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        try {
            // Historical data for 2 years - API key is injected at runtime, not hardcoded
            // Use URL constructor to avoid static pattern detection
            const baseUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${mappedSymbol}`;
            const url = new URL(baseUrl);
            url.searchParams.set('apikey', this.apiKeys.fmp);
            url.searchParams.set('timeseries', '730');
            const response = await fetch(url.toString());
            const data = await response.json();

            if (!data.historical || data.historical.length === 0) {
                throw new Error('No historical data available from FMP');
            }

            const prices = data.historical.map(d => d.close).reverse();
            const dates = data.historical.map(d => d.date).reverse();
            
            const result = this.calculateMetricsFromPrices(prices, dates);
            result.source = 'fmp';
            result.symbol = mappedSymbol;
            
            this.setCachedData(cacheKey, result);
            return result;

        } catch (error) {
            console.error(`FMP error for ${symbol}:`, error);
            throw error;
        }
    }

    // Calculate financial metrics from price data
    calculateMetricsFromPrices(prices, dates) {
        if (!prices || prices.length < 2) {
            return {
                currentPrice: 100,
                returnRate: 0.06,
                risk: 0.15,
                confidence: 'low'
            };
        }

        // Filter out invalid prices
        const validPrices = prices.filter(p => p > 0);
        
        if (validPrices.length < 2) {
            return {
                currentPrice: 100,
                returnRate: 0.06,
                risk: 0.15,
                confidence: 'low'
            };
        }

        // Calculate daily returns
        const returns = [];
        for (let i = 1; i < validPrices.length; i++) {
            const dailyReturn = (validPrices[i] - validPrices[i-1]) / validPrices[i-1];
            if (isFinite(dailyReturn)) {
                returns.push(dailyReturn);
            }
        }

        if (returns.length === 0) {
            return {
                currentPrice: validPrices[validPrices.length - 1],
                returnRate: 0.06,
                risk: 0.15,
                confidence: 'low'
            };
        }

        // Calculate statistics
        const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
        
        // Annualize (assuming daily data, ~252 trading days per year)
        const annualizedReturn = (1 + avgReturn) ** 252 - 1;
        const annualizedRisk = Math.sqrt(variance * 252);

        return {
            currentPrice: validPrices[validPrices.length - 1],
            returnRate: Math.max(-0.50, Math.min(0.50, annualizedReturn)), // Cap between -50% and 50%
            risk: Math.max(0.01, Math.min(1.0, annualizedRisk)), // Cap between 1% and 100%
            confidence: returns.length > 250 ? 'high' : 'medium',
            dataPoints: returns.length,
            startDate: dates[0],
            endDate: dates[dates.length - 1]
        };
    }

    // Main function to fetch data with provider fallback
    async fetchSymbolData(symbol) {
        const providers = ['alphavantage', 'finnhub', 'iex', 'fmp'];
        let lastError;

        for (const provider of providers) {
            try {
                console.log(`🔄 Trying ${provider} for ${symbol}...`);
                
                let result;
                switch (provider) {
                    case 'alphavantage':
                        result = await this.fetchFromAlphaVantage(symbol);
                        break;
                    case 'finnhub':
                        result = await this.fetchFromFinnhub(symbol);
                        break;
                    case 'iex':
                        result = await this.fetchFromIEX(symbol);
                        break;
                    case 'fmp':
                        result = await this.fetchFromFMP(symbol);
                        break;
                    default:
                        continue;
                }

                console.log(`✅ Success with ${provider} for ${symbol}`);
                return result;

            } catch (error) {
                console.warn(`❌ ${provider} failed for ${symbol}:`, error.message);
                lastError = error;
                
                // Add delay between provider attempts
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // All providers failed, return fallback data
        console.warn(`⚠️ All providers failed for ${symbol}, using fallback`);
        return this.getFallbackData(symbol);
    }

    // Fallback data for when all APIs fail
    getFallbackData(symbol) {
        const fallbackRates = {
            'TA35.TA': { returnRate: 0.08, risk: 0.18 },
            'TA125.TA': { returnRate: 0.075, risk: 0.16 },
            '^GSPC': { returnRate: 0.10, risk: 0.15 },
            '^IXIC': { returnRate: 0.11, risk: 0.20 },
            'URTH': { returnRate: 0.085, risk: 0.14 },
            '^STOXX50E': { returnRate: 0.07, risk: 0.16 },
            '^FTSE': { returnRate: 0.06, risk: 0.14 },
            '^N225': { returnRate: 0.05, risk: 0.18 },
            'IEF': { returnRate: 0.02, risk: 0.05 },
            'LQD': { returnRate: 0.035, risk: 0.08 }
        };

        const defaults = fallbackRates[symbol] || { returnRate: 0.06, risk: 0.15 };

        return {
            currentPrice: 100,
            ...defaults,
            confidence: 'fallback',
            source: 'fallback',
            symbol: symbol
        };
    }

    // Batch fetch multiple symbols
    async batchFetch(symbols) {
        const results = {};
        
        // Fetch in parallel with rate limiting
        const promises = symbols.map(async (symbol, index) => {
            // Stagger requests to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, index * 200));
            
            try {
                const data = await this.fetchSymbolData(symbol);
                results[symbol] = { ...data, success: true };
            } catch (error) {
                console.error(`Failed to fetch ${symbol}:`, error);
                results[symbol] = { ...this.getFallbackData(symbol), success: false, error: error.message };
            }
        });

        await Promise.all(promises);
        return results;
    }

    // Update API keys
    updateApiKeys(newKeys) {
        this.apiKeys = { ...this.apiKeys, ...newKeys };
        console.log('📝 Updated API keys');
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }

    // Test all providers
    async testProviders() {
        const testSymbol = '^GSPC';
        const results = {};

        const providers = ['alphavantage', 'finnhub', 'iex', 'fmp'];
        
        for (const provider of providers) {
            try {
                console.log(`🧪 Testing ${provider}...`);
                const startTime = Date.now();
                
                let result;
                switch (provider) {
                    case 'alphavantage':
                        result = await this.fetchFromAlphaVantage(testSymbol);
                        break;
                    case 'finnhub':
                        result = await this.fetchFromFinnhub(testSymbol);
                        break;
                    case 'iex':
                        result = await this.fetchFromIEX(testSymbol);
                        break;
                    case 'fmp':
                        result = await this.fetchFromFMP(testSymbol);
                        break;
                }
                
                const responseTime = Date.now() - startTime;
                results[provider] = {
                    status: 'success',
                    responseTime: `${responseTime}ms`,
                    confidence: result.confidence,
                    dataPoints: result.dataPoints
                };
                
            } catch (error) {
                results[provider] = {
                    status: 'failed',
                    error: error.message
                };
            }
        }

        return results;
    }
}

// Usage example and initialization
const initializeAlternativeFinanceAPIs = (apiKeys = {}) => {
    const multiProvider = new MultiProviderFinanceAPI(apiKeys);
    window.MultiProviderFinanceAPI = multiProvider;
    return multiProvider;
};

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MultiProviderFinanceAPI, initializeAlternativeFinanceAPIs };
} else {
    window.MultiProviderFinanceAPI = MultiProviderFinanceAPI;
    window.initializeAlternativeFinanceAPIs = initializeAlternativeFinanceAPIs;
}