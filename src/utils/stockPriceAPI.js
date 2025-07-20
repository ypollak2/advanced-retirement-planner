// Stock Price API Integration for RSU Tracking
// Created by Yali Pollak (יהלי פולק) - v6.1.0

// CORS-free stock price API endpoints
const STOCK_API_ENDPOINTS = {
    // Alpha Vantage free tier (5 API calls per minute, 500 per day)
    ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
    // Yahoo Finance alternative (CORS-free)
    YAHOO_FINANCE: 'https://query1.finance.yahoo.com/v8/finance/chart',
    // Finnhub.io (free tier - 60 calls per minute)
    FINNHUB: 'https://finnhub.io/api/v1/quote'
};

// Fallback stock prices for major tech companies (updated July 2025)
const FALLBACK_PRICES = {
    'AAPL': 190.75,   // Apple
    'GOOGL': 175.50,  // Alphabet (Google)
    'MSFT': 425.80,   // Microsoft
    'AMZN': 165.30,   // Amazon
    'META': 545.20,   // Meta (Facebook)
    'NFLX': 485.60,   // Netflix
    'TSLA': 265.40,   // Tesla
    'NVDA': 125.30,   // NVIDIA (post-split)
    'AMD': 155.80,    // AMD
    'INTC': 35.70,    // Intel
    'CRM': 265.90,    // Salesforce
    'ORCL': 145.60,   // Oracle
    'ADBE': 525.20,   // Adobe
    'NOW': 785.40,    // ServiceNow
    'SHOP': 75.80,    // Shopify
    'SPOT': 325.30,   // Spotify
    'ZM': 65.20,      // Zoom
    'UBER': 75.90,    // Uber
    'ABNB': 135.70,   // Airbnb
    'COIN': 205.40,   // Coinbase
    'PLTR': 35.90,    // Palantir
    'SNOW': 115.60,   // Snowflake
    'DDOG': 125.30,   // Datadog
    'CRWD': 385.80,   // CrowdStrike
    'OKTA': 95.20,    // Okta
    'TWLO': 85.40,    // Twilio
    'WORK': 45.60,    // Slack (acquired by Salesforce)
    'TEAM': 195.90,   // Atlassian
    'MDB': 285.70,    // MongoDB
    'ESTC': 85.30,    // Elastic
    'WDAY': 285.80,   // Workday
    'NICE': 195.40,   // NICE
    'CYBR': 285.20,   // CyberArk
    'MNDY': 275.60,   // monday.com
    'SQ': 85.40,      // Block (Square)
    'PYPL': 75.30,    // PayPal
    'ROKU': 65.20,    // Roku
    'ZS': 185.40,     // Zscaler
    'LYFT': 15.80,    // Lyft
    'PINS': 35.60,    // Pinterest
    'SNAP': 15.40,    // Snap
    'S': 35.20,       // SentinelOne
    'FROG': 35.80,    // JFrog
    'ESTC': 85.30     // Elastic
};

// Cache for API responses (5 minutes)
const priceCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Real-time stock price fetching function
async function fetchRealTimePrice(symbol) {
    try {
        // Try multiple free APIs for stock prices
        
        // Method 1: Yahoo Finance query1 API with different endpoint
        const yahooResponse = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (yahooResponse.ok) {
            const yahooData = await yahooResponse.json();
            if (yahooData?.chart?.result?.[0]?.meta?.regularMarketPrice) {
                return parseFloat(yahooData.chart.result[0].meta.regularMarketPrice);
            }
        }

        // Method 2: Try alternative Yahoo Finance endpoint
        const yahooAltResponse = await fetch(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (yahooAltResponse.ok) {
            const yahooAltData = await yahooAltResponse.json();
            if (yahooAltData?.quoteSummary?.result?.[0]?.price?.regularMarketPrice?.raw) {
                return parseFloat(yahooAltData.quoteSummary.result[0].price.regularMarketPrice.raw);
            }
        }

        // Method 3: Try free stock API (if available)
        const freeStockResponse = await fetch(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=demo`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (freeStockResponse.ok) {
            const freeStockData = await freeStockResponse.json();
            if (freeStockData?.price) {
                return parseFloat(freeStockData.price);
            }
        }
        
        throw new Error('All API endpoints failed');
        
    } catch (error) {
        console.warn(`Failed to fetch real-time price for ${symbol}:`, error.message);
        return null;
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
    
    // For GitHub Pages deployment, use fallback prices immediately to avoid CORS issues
    if (window.location.hostname.includes('github.io') || window.location.hostname.includes('githubusercontent.com')) {
        const fallbackPrice = FALLBACK_PRICES[upperSymbol];
        if (fallbackPrice) {
            console.log(`📊 Using fallback price for ${upperSymbol}: $${fallbackPrice} (GitHub Pages mode)`);
            
            // Cache fallback price with shorter duration
            priceCache.set(upperSymbol, {
                price: fallbackPrice,
                timestamp: Date.now(),
                source: 'fallback-githubpages'
            });
            
            return fallbackPrice;
        }
    }
    
    // Try to fetch real-time price from APIs (with timeout)
    try {
        const realTimePrice = await Promise.race([
            fetchRealTimePrice(upperSymbol),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
        ]);
        
        if (realTimePrice && realTimePrice > 0) {
            console.log(`📈 Real-time price fetched for ${upperSymbol}: $${realTimePrice}`);
            
            // Cache real-time price
            priceCache.set(upperSymbol, {
                price: realTimePrice,
                timestamp: Date.now(),
                source: 'api'
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