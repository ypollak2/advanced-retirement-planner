// Stock Price API Integration for RSU Tracking
// Created by Yali Pollak (יהלי פולק) - v5.2.1

// Multiple API endpoints for stock price fetching with fallbacks
const STOCK_API_ENDPOINTS = {
    // Alpha Vantage (requires API key - demo mode)
    alphaVantage: {
        url: (symbol) => `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=demo`,
        parsePrice: (data) => {
            if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
                return parseFloat(data['Global Quote']['05. price']);
            }
            return null;
        }
    },
    
    // Yahoo Finance (via unofficial API)
    yahooFinance: {
        url: (symbol) => `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
        parsePrice: (data) => {
            if (data && data.chart && data.chart.result && data.chart.result[0] && 
                data.chart.result[0].meta && data.chart.result[0].meta.regularMarketPrice) {
                return parseFloat(data.chart.result[0].meta.regularMarketPrice);
            }
            return null;
        }
    },
    
    // Finnhub (requires API key - demo mode)
    finnhub: {
        url: (symbol) => `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=demo`,
        parsePrice: (data) => {
            if (data && data.c) {
                return parseFloat(data.c);
            }
            return null;
        }
    },
    
    // IEX Cloud (requires API key - demo mode)
    iexCloud: {
        url: (symbol) => `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=demo`,
        parsePrice: (data) => {
            if (data && data.latestPrice) {
                return parseFloat(data.latestPrice);
            }
            return null;
        }
    }
};

// Fallback stock prices for major tech companies (updated manually)
const FALLBACK_PRICES = {
    'AAPL': 175.50,   // Apple
    'GOOGL': 135.25,  // Alphabet (Google)
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
    
    // Try different APIs in order
    const apiKeys = Object.keys(STOCK_API_ENDPOINTS);
    
    for (const apiKey of apiKeys) {
        try {
            const api = STOCK_API_ENDPOINTS[apiKey];
            const response = await fetch(api.url(upperSymbol), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                // Add CORS handling
                mode: 'cors'
            });
            
            if (response.ok) {
                const data = await response.json();
                const price = api.parsePrice(data);
                
                if (price && price > 0) {
                    // Cache the result
                    priceCache.set(upperSymbol, {
                        price: price,
                        timestamp: Date.now(),
                        source: apiKey
                    });
                    
                    console.log(`✅ Stock price for ${upperSymbol}: $${price} (source: ${apiKey})`);
                    return price;
                }
            }
        } catch (error) {
            console.warn(`⚠️ API ${apiKey} failed for ${upperSymbol}:`, error.message);
            continue;
        }
    }
    
    // Fall back to manual prices if APIs fail
    if (FALLBACK_PRICES[upperSymbol]) {
        const fallbackPrice = FALLBACK_PRICES[upperSymbol];
        console.log(`📊 Using fallback price for ${upperSymbol}: $${fallbackPrice}`);
        
        // Cache fallback price with shorter duration
        priceCache.set(upperSymbol, {
            price: fallbackPrice,
            timestamp: Date.now(),
            source: 'fallback'
        });
        
        return fallbackPrice;
    }
    
    console.error(`❌ Could not fetch price for ${upperSymbol}`);
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