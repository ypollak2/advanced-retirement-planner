// CORS Proxy Solutions for Yahoo Finance API
// Multiple approaches to solve the CORS issue with Yahoo Finance API calls

// Solution 1: Simple CORS Proxy Service
class CORSProxyService {
    constructor() {
        this.proxyUrls = [
            'https://corsproxy.io/?',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://proxy.hoppscotch.io/',
            'https://cors.bridged.cc/',
            'https://api.allorigins.win/raw?url=',
        ];
        this.currentProxyIndex = 0;
    }

    // Get current proxy URL
    getCurrentProxy() {
        return this.proxyUrls[this.currentProxyIndex];
    }

    // Rotate to next proxy if current one fails
    rotateProxy() {
        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyUrls.length;
        console.log(`Switching to proxy: ${this.getCurrentProxy()}`);
    }

    // Validate URL is from allowed domains
    isAllowedDomain(url) {
        const allowedDomains = [
            'query1.finance.yahoo.com',
            'query2.finance.yahoo.com',
            'finance.yahoo.com'
        ];
        
        try {
            const urlObj = new URL(url);
            return allowedDomains.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain));
        } catch {
            return false;
        }
    }

    // Main function to fetch with CORS proxy
    async fetchWithProxy(url, options = {}) {
        // Security: Validate URL before proxying
        if (!this.isAllowedDomain(url)) {
            throw new Error('Security Error: URL not in allowed domains list');
        }

        const maxRetries = this.proxyUrls.length;
        let lastError;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const proxy = this.getCurrentProxy();
                const proxyUrl = proxy + encodeURIComponent(url);
                
                console.log(`Attempt ${attempt + 1}: Using proxy ${proxy}`);
                
                const response = await fetch(proxyUrl, {
                    ...options,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        ...options.headers
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log(`✅ Success with proxy: ${proxy}`);
                return data;

            } catch (error) {
                console.warn(`❌ Proxy ${this.getCurrentProxy()} failed:`, error.message);
                lastError = error;
                this.rotateProxy();
            }
        }

        throw new Error(`All proxy services failed. Last error: ${lastError.message}`);
    }
}

// Solution 2: Enhanced Yahoo Finance API Wrapper with CORS handling
class YahooFinanceAPI {
    constructor() {
        this.corsProxy = new CORSProxyService();
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.maxCacheSize = 50; // Prevent unbounded growth
        this.cleanupInterval = null;
        
        // Start periodic cleanup
        this.startCacheCleanup();
    }

    // Check if cached data is still valid
    isCacheValid(cacheEntry) {
        return Date.now() - cacheEntry.timestamp < this.cacheTimeout;
    }

    // Get cached data or null if expired/missing
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && this.isCacheValid(cached)) {
            console.log(`📦 Using cached data for: ${key}`);
            return cached.data;
        }
        return null;
    }

    // Cache data with timestamp
    setCachedData(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // Search for stocks/indices
    async searchSymbol(query) {
        const cacheKey = `search_${query}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&lang=en-US&region=US&quotesCount=1&newsCount=0`;
        
        try {
            const data = await this.corsProxy.fetchWithProxy(url);
            this.setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`Failed to search for symbol ${query}:`, error);
            throw error;
        }
    }

    // Get historical chart data
    async getChartData(symbol, interval = '1d', range = '2y') {
        const cacheKey = `chart_${symbol}_${interval}_${range}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
        
        try {
            const data = await this.corsProxy.fetchWithProxy(url);
            this.setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`Failed to get chart data for ${symbol}:`, error);
            throw error;
        }
    }

    // Get quote data
    async getQuote(symbol) {
        const cacheKey = `quote_${symbol}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
        
        try {
            const data = await this.corsProxy.fetchWithProxy(url);
            this.setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`Failed to get quote for ${symbol}:`, error);
            throw error;
        }
    }

    // Batch fetch multiple symbols
    async batchFetch(symbols, interval = '1d', range = '2y') {
        const results = {};
        const promises = symbols.map(async (symbol) => {
            try {
                const [quote, chart] = await Promise.all([
                    this.getQuote(symbol),
                    this.getChartData(symbol, interval, range)
                ]);
                results[symbol] = { quote, chart, success: true };
            } catch (error) {
                console.warn(`Failed to fetch data for ${symbol}:`, error);
                results[symbol] = { error: error.message, success: false };
            }
        });

        await Promise.all(promises);
        return results;
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }
    
    // Start periodic cache cleanup
    startCacheCleanup() {
        // Clean up every minute
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            let removed = 0;
            
            for (const [key, value] of this.cache.entries()) {
                if (now - value.timestamp > this.cacheTimeout) {
                    this.cache.delete(key);
                    removed++;
                }
            }
            
            if (removed > 0) {
                console.log(`🧹 Cleaned up ${removed} expired cache entries`);
            }
            
            // Enforce max cache size
            if (this.cache.size > this.maxCacheSize) {
                const entriesToRemove = this.cache.size - this.maxCacheSize;
                const sortedEntries = Array.from(this.cache.entries())
                    .sort((a, b) => a[1].timestamp - b[1].timestamp);
                
                for (let i = 0; i < entriesToRemove; i++) {
                    this.cache.delete(sortedEntries[i][0]);
                }
                
                console.log(`🗑️ Removed ${entriesToRemove} oldest cache entries`);
            }
        }, 60 * 1000);
    }
    
    // Cleanup method to prevent memory leaks
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.clearCache();
    }
}

// Solution 3: Fallback with multiple data sources
class MultiSourceFinanceAPI {
    constructor() {
        this.yahooAPI = new YahooFinanceAPI();
        this.fallbackData = {
            // Default returns for major indices if APIs fail
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
    }

    async getIndexData(symbols) {
        try {
            // Try Yahoo Finance first
            console.log('🔄 Attempting to fetch from Yahoo Finance...');
            const data = await this.yahooAPI.batchFetch(symbols);
            
            // Check if we got successful results
            const successfulResults = Object.values(data).filter(result => result.success).length;
            const successRate = successfulResults / symbols.length;
            
            if (successRate > 0.5) { // If more than 50% successful
                console.log(`✅ Yahoo Finance successful (${Math.round(successRate * 100)}% success rate)`);
                return this.processYahooData(data);
            } else {
                throw new Error(`Low success rate: ${Math.round(successRate * 100)}%`);
            }
            
        } catch (error) {
            console.warn('⚠️ Yahoo Finance failed, using fallback data:', error.message);
            return this.getFallbackData(symbols);
        }
    }

    processYahooData(yahooData) {
        const processed = {};
        
        for (const [symbol, data] of Object.entries(yahooData)) {
            if (data.success && data.chart?.chart?.result?.[0]) {
                const result = data.chart.chart.result[0];
                const meta = result.meta;
                const timestamps = result.timestamp || [];
                const closes = result.indicators?.quote?.[0]?.close || [];
                
                // Calculate returns from historical data
                const returns = this.calculateReturns(closes, timestamps);
                
                processed[symbol] = {
                    currentPrice: meta.regularMarketPrice || meta.previousClose,
                    currency: meta.currency || 'USD',
                    ...returns,
                    lastUpdated: new Date().toISOString(),
                    source: 'yahoo'
                };
            } else {
                // Use fallback for failed symbols
                processed[symbol] = this.getFallbackForSymbol(symbol);
            }
        }
        
        return processed;
    }

    calculateReturns(closes, timestamps) {
        if (!closes || closes.length < 2) {
            return { returnRate: 0.05, risk: 0.15, confidence: 'low' };
        }

        // Remove null values and calculate returns
        const validPrices = closes.filter(price => price !== null && price > 0);
        
        if (validPrices.length < 2) {
            return { returnRate: 0.05, risk: 0.15, confidence: 'low' };
        }

        const returns = [];
        for (let i = 1; i < validPrices.length; i++) {
            const returnRate = (validPrices[i] - validPrices[i-1]) / validPrices[i-1];
            returns.push(returnRate);
        }

        // Calculate annualized return and risk
        const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
        
        // Annualize (assuming daily data)
        const annualizedReturn = (1 + avgReturn) ** 252 - 1;
        const annualizedRisk = Math.sqrt(variance * 252);

        return {
            returnRate: Math.max(0, Math.min(0.30, annualizedReturn)), // Cap between 0-30%
            risk: Math.max(0.05, Math.min(0.50, annualizedRisk)), // Cap between 5-50%
            confidence: 'high'
        };
    }

    getFallbackData(symbols) {
        console.log('📊 Using fallback data for all symbols');
        const data = {};
        
        symbols.forEach(symbol => {
            data[symbol] = this.getFallbackForSymbol(symbol);
        });
        
        return data;
    }

    getFallbackForSymbol(symbol) {
        const fallback = this.fallbackData[symbol] || { returnRate: 0.06, risk: 0.15 };
        
        return {
            currentPrice: 100, // Placeholder price
            currency: 'USD',
            ...fallback,
            lastUpdated: new Date().toISOString(),
            source: 'fallback',
            confidence: 'medium'
        };
    }
}

// Export for use in your application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CORSProxyService, YahooFinanceAPI, MultiSourceFinanceAPI };
} else {
    // Browser environment
    window.CORSProxyService = CORSProxyService;
    window.YahooFinanceAPI = YahooFinanceAPI;
    window.MultiSourceFinanceAPI = MultiSourceFinanceAPI;
}