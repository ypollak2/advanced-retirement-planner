// Client-side code to use serverless functions for Yahoo Finance API

class ServerlessYahooFinance {
    constructor(options = {}) {
        // Configure your serverless function endpoints
        this.endpoints = {
            netlify: options.netlifyEndpoint || 'https://your-site.netlify.app/.netlify/functions/yahoo-finance',
            vercel: options.vercelEndpoint || 'https://your-app.vercel.app/api/yahoo-finance',
            aws: options.awsEndpoint || 'https://your-api-id.execute-api.region.amazonaws.com/prod/yahoo-finance'
        };
        
        this.preferredEndpoint = options.preferredEndpoint || 'netlify';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
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

    // Make request through serverless function
    async fetchThroughServerless(yahooUrl, endpoint = null) {
        const targetEndpoint = endpoint || this.endpoints[this.preferredEndpoint];
        const proxyUrl = `${targetEndpoint}?url=${encodeURIComponent(yahooUrl)}`;
        
        console.log(`🚀 Fetching through serverless: ${targetEndpoint}`);
        
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Serverless function failed: ${response.status} - ${errorText}`);
        }
        
        return await response.json();
    }

    // Fetch with fallback across multiple serverless providers
    async fetchWithFallback(yahooUrl) {
        const endpoints = Object.entries(this.endpoints);
        let lastError;

        for (const [provider, endpoint] of endpoints) {
            try {
                console.log(`🔄 Trying ${provider} endpoint...`);
                const data = await this.fetchThroughServerless(yahooUrl, endpoint);
                console.log(`✅ Success with ${provider}`);
                return data;
            } catch (error) {
                console.warn(`❌ ${provider} failed:`, error.message);
                lastError = error;
            }
        }

        throw new Error(`All serverless endpoints failed. Last error: ${lastError.message}`);
    }

    // Search for stocks/indices
    async searchSymbol(query) {
        const cacheKey = `search_${query}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        const yahooUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&lang=en-US&region=US&quotesCount=1&newsCount=0`;
        
        try {
            const data = await this.fetchWithFallback(yahooUrl);
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

        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
        
        try {
            const data = await this.fetchWithFallback(yahooUrl);
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

        const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
        
        try {
            const data = await this.fetchWithFallback(yahooUrl);
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
        
        // Use Promise.allSettled to handle partial failures gracefully
        const promises = symbols.map(async (symbol) => {
            try {
                const [quote, chart] = await Promise.allSettled([
                    this.getQuote(symbol),
                    this.getChartData(symbol, interval, range)
                ]);
                
                results[symbol] = {
                    quote: quote.status === 'fulfilled' ? quote.value : null,
                    chart: chart.status === 'fulfilled' ? chart.value : null,
                    success: quote.status === 'fulfilled' || chart.status === 'fulfilled',
                    errors: {
                        quote: quote.status === 'rejected' ? quote.reason.message : null,
                        chart: chart.status === 'rejected' ? chart.reason.message : null
                    }
                };
            } catch (error) {
                console.warn(`Failed to fetch data for ${symbol}:`, error);
                results[symbol] = { 
                    error: error.message, 
                    success: false 
                };
            }
        });

        await Promise.all(promises);
        return results;
    }

    // Update endpoint configuration
    updateEndpoints(newEndpoints) {
        this.endpoints = { ...this.endpoints, ...newEndpoints };
        console.log('📝 Updated serverless endpoints:', this.endpoints);
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }

    // Test all endpoints
    async testEndpoints() {
        const testSymbol = 'AAPL';
        const testUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${testSymbol}&lang=en-US&region=US&quotesCount=1&newsCount=0`;
        
        const results = {};
        
        for (const [provider, endpoint] of Object.entries(this.endpoints)) {
            try {
                console.log(`🧪 Testing ${provider}...`);
                const startTime = Date.now();
                await this.fetchThroughServerless(testUrl, endpoint);
                const responseTime = Date.now() - startTime;
                
                results[provider] = {
                    status: 'success',
                    responseTime: `${responseTime}ms`,
                    endpoint
                };
                console.log(`✅ ${provider} test passed (${responseTime}ms)`);
            } catch (error) {
                results[provider] = {
                    status: 'failed',
                    error: error.message,
                    endpoint
                };
                console.log(`❌ ${provider} test failed:`, error.message);
            }
        }
        
        return results;
    }
}

// Example usage and integration
const initializeServerlessYahooFinance = (config = {}) => {
    // Create serverless API instance
    const serverlessAPI = new ServerlessYahooFinance({
        netlifyEndpoint: config.netlifyEndpoint,
        vercelEndpoint: config.vercelEndpoint,
        awsEndpoint: config.awsEndpoint,
        preferredEndpoint: config.preferredEndpoint || 'netlify'
    });

    // Replace the global Yahoo Finance functions
    window.ServerlessYahooFinance = serverlessAPI;

    // Test endpoints on initialization
    if (config.testOnInit !== false) {
        serverlessAPI.testEndpoints().then(results => {
            console.log('🧪 Endpoint test results:', results);
        });
    }

    return serverlessAPI;
};

// Auto-initialize if config is provided
if (typeof window !== 'undefined' && window.SERVERLESS_YAHOO_CONFIG) {
    initializeServerlessYahooFinance(window.SERVERLESS_YAHOO_CONFIG);
}

// Export for manual usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ServerlessYahooFinance, initializeServerlessYahooFinance };
} else {
    window.ServerlessYahooFinance = ServerlessYahooFinance;
    window.initializeServerlessYahooFinance = initializeServerlessYahooFinance;
}