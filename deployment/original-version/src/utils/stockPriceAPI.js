// Stock Price API Integration for RSU Tracking
// Created by Yali Pollak (יהלי פולק) - v5.3.5

// CORS-free stock price API endpoints
const STOCK_API_ENDPOINTS = {
    // Alpha Vantage free tier (5 API calls per minute, 500 per day)
    ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
    // Yahoo Finance alternative (CORS-free)
    YAHOO_FINANCE: 'https://query1.finance.yahoo.com/v8/finance/chart',
    // Finnhub.io (free tier - 60 calls per minute)
    FINNHUB: 'https://finnhub.io/api/v1/quote'
};

// Fallback stock prices for major tech companies (updated manually)
const FALLBACK_PRICES = {
    'AAPL': 175.50,   // Apple
    'GOOGL': 183.00,  // Alphabet (Google)
    'MSFT': 375.80,   // Microsoft
    'AMZN': 145.30,   // Amazon
    'META': 315.20,   // Meta (Facebook)
    'NFLX': 425.60,   // Netflix
    'TSLA': 235.40,   // Tesla
    'NVDA': 875.30,   // NVIDIA
    'AMD': 125.80,    // AMD
    'INTC': 45.70,    // Intel
    'CRM': 225.90,    // Salesforce
    'ORCL': 115.60,   // Oracle
    'ADBE': 485.20,   // Adobe
    'NOW': 675.40,    // ServiceNow
    'SHOP': 65.80,    // Shopify
    'SPOT': 185.30,   // Spotify
    'ZM': 75.20,      // Zoom
    'UBER': 45.90,    // Uber
    'ABNB': 125.70,   // Airbnb
    'COIN': 85.40,    // Coinbase
    'PLTR': 18.90,    // Palantir
    'SNOW': 145.60,   // Snowflake
    'DDOG': 95.30,    // Datadog
    'CRWD': 225.80,   // CrowdStrike
    'OKTA': 85.20,    // Okta
    'TWLO': 65.40,    // Twilio
    'WORK': 45.60,    // Slack (acquired by Salesforce)
    'TEAM': 185.90,   // Atlassian
    'MDB': 385.70,    // MongoDB
    'ESTC': 75.30,    // Elastic
    'WDAY': 245.80,   // Workday
    'NICE': 185.40,   // NICE
    'CYBR': 165.20,   // CyberArk
    'MNDY': 185.60    // monday.com
};

// Cache for API responses (5 minutes)
const priceCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Real-time stock price fetching function
async function fetchRealTimePrice(symbol) {
    try {
        // Use Yahoo Finance API - it's CORS-free and doesn't require API key
        const response = await fetch(`${STOCK_API_ENDPOINTS.YAHOO_FINANCE}/${symbol}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Extract current price from Yahoo Finance response
        if (data?.chart?.result?.[0]?.meta?.regularMarketPrice) {
            return parseFloat(data.chart.result[0].meta.regularMarketPrice);
        }
        
        throw new Error('Invalid response format from Yahoo Finance');
        
    } catch (error) {
        console.warn(`Failed to fetch real-time price for ${symbol}:`, error.message);
        
        // Try alternative Finnhub API as backup (requires free API key)
        try {
            // Note: This would require users to set up their own Finnhub API key
            // For now, we'll just return null and fall back to hardcoded prices
            return null;
        } catch (backupError) {
            return null;
        }
    }
}

// Main function to fetch stock price
async function fetchStockPrice(symbol, useCache = true) {
    if (!symbol) return null;
    
    const upperSymbol = symbol.toUpperCase();
    
    // Check cache first
    if (useCache && priceCache.has(upperSymbol)) {
        const cached = priceCache.get(upperSymbol);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.price;
        }
    }
    
    // Try to fetch real-time price from Yahoo Finance API (CORS-free)
    try {
        const realTimePrice = await fetchRealTimePrice(upperSymbol);
        if (realTimePrice && realTimePrice > 0) {
            console.log(`📈 Real-time price fetched for ${upperSymbol}: $${realTimePrice}`);
            
            // Cache real-time price
            priceCache.set(upperSymbol, {
                price: realTimePrice,
                timestamp: Date.now(),
                source: 'yahoo-finance'
            });
            
            return realTimePrice;
        }
    } catch (error) {
        console.warn(`⚠️ Failed to fetch real-time price for ${upperSymbol}:`, error.message);
    }
    
    // Fallback to hardcoded prices if API fails
    if (FALLBACK_PRICES[upperSymbol]) {
        const fallbackPrice = FALLBACK_PRICES[upperSymbol];
        console.log(`📊 Using fallback price for ${upperSymbol}: $${fallbackPrice}`);
        
        // Cache fallback price
        priceCache.set(upperSymbol, {
            price: fallbackPrice,
            timestamp: Date.now(),
            source: 'fallback'
        });
        
        return fallbackPrice;
    }
    
    console.log(`❌ No price data available for ${upperSymbol}`);
    return null;
}

// Function to get multiple stock prices at once
async function fetchMultipleStockPrices(symbols) {
    const promises = symbols.map(symbol => 
        fetchStockPrice(symbol).then(price => ({ symbol, price }))
    );
    
    try {
        const results = await Promise.allSettled(promises);
        return results.map(result => 
            result.status === 'fulfilled' ? result.value : { symbol: null, price: null }
        ).filter(item => item.symbol && item.price);
    } catch (error) {
        console.error('Error fetching multiple stock prices:', error);
        return [];
    }
}

// Function to validate and format stock symbol
function validateStockSymbol(symbol) {
    if (!symbol || typeof symbol !== 'string') return null;
    
    const cleaned = symbol.toUpperCase().trim();
    
    // Basic validation - 1 to 5 letters
    if (!/^[A-Z]{1,5}$/.test(cleaned)) {
        return null;
    }
    
    return cleaned;
}

// Function to get company name from symbol
function getCompanyName(symbol) {
    const companies = {
        'AAPL': 'Apple Inc.',
        'GOOGL': 'Alphabet Inc. (Google)',
        'MSFT': 'Microsoft Corporation',
        'AMZN': 'Amazon.com Inc.',
        'META': 'Meta Platforms Inc.',
        'NFLX': 'Netflix Inc.',
        'TSLA': 'Tesla Inc.',
        'NVDA': 'NVIDIA Corporation',
        'AMD': 'Advanced Micro Devices Inc.',
        'INTC': 'Intel Corporation',
        'CRM': 'Salesforce Inc.',
        'ORCL': 'Oracle Corporation',
        'ADBE': 'Adobe Inc.',
        'NOW': 'ServiceNow Inc.',
        'SHOP': 'Shopify Inc.',
        'SPOT': 'Spotify Technology S.A.',
        'ZM': 'Zoom Video Communications',
        'UBER': 'Uber Technologies Inc.',
        'ABNB': 'Airbnb Inc.',
        'COIN': 'Coinbase Global Inc.',
        'PLTR': 'Palantir Technologies Inc.',
        'SNOW': 'Snowflake Inc.',
        'DDOG': 'Datadog Inc.',
        'CRWD': 'CrowdStrike Holdings Inc.',
        'OKTA': 'Okta Inc.',
        'TWLO': 'Twilio Inc.',
        'WORK': 'Slack Technologies Inc.',
        'TEAM': 'Atlassian Corporation Plc',
        'MDB': 'MongoDB Inc.',
        'ESTC': 'Elastic N.V.',
        'WDAY': 'Workday Inc.',
        'NICE': 'NICE Ltd.',
        'CYBR': 'CyberArk Software Ltd.',
        'MNDY': 'monday.com Ltd.'
    };
    
    return companies[symbol.toUpperCase()] || symbol;
}

// Function to clear cache
function clearPriceCache() {
    priceCache.clear();
    console.log('Stock price cache cleared');
}

// Function to get cache info
function getCacheInfo() {
    const cacheData = Array.from(priceCache.entries()).map(([symbol, data]) => ({
        symbol,
        price: data.price,
        age: Math.round((Date.now() - data.timestamp) / 1000), // seconds
        source: data.source
    }));
    
    return {
        size: priceCache.size,
        data: cacheData
    };
}

// Export functions to window for global access
window.fetchStockPrice = fetchStockPrice;
window.fetchMultipleStockPrices = fetchMultipleStockPrices;
window.validateStockSymbol = validateStockSymbol;
window.getCompanyName = getCompanyName;
window.clearStockPriceCache = clearPriceCache;
window.getStockPriceCacheInfo = getCacheInfo;

// Also make it available as a module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchStockPrice,
        fetchMultipleStockPrices,
        validateStockSymbol,
        getCompanyName,
        clearPriceCache,
        getCacheInfo
    };
}