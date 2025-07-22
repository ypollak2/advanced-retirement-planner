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

// Advanced caching system with TTL and refresh strategies
const priceCache = new Map();
const refreshingCache = new Set(); // Track symbols being refreshed
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const STALE_WHILE_REVALIDATE_DURATION = 15 * 60 * 1000; // 15 minutes
const LOCALSTORAGE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for localStorage
const MAX_CACHE_SIZE = 100; // Prevent memory leaks
const LOCALSTORAGE_KEY = 'stockPriceCache_v2';

// Cache entry structure with metadata
class CacheEntry {
    constructor(price, source = 'api') {
        this.price = price;
        this.timestamp = Date.now();
        this.source = source;
        this.accessCount = 1;
        this.lastAccessed = Date.now();
    }
    
    isExpired() {
        return Date.now() - this.timestamp > CACHE_DURATION;
    }
    
    isStale() {
        return Date.now() - this.timestamp > STALE_WHILE_REVALIDATE_DURATION;
    }
    
    touch() {
        this.accessCount++;
        this.lastAccessed = Date.now();
    }
}

// LocalStorage cache management
function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem(LOCALSTORAGE_KEY);
        if (!stored) return;
        
        const data = JSON.parse(stored);
        let loadedCount = 0;
        
        for (const [symbol, entryData] of Object.entries(data)) {
            const age = Date.now() - entryData.timestamp;
            if (age < LOCALSTORAGE_DURATION) {
                const entry = new CacheEntry(entryData.price, entryData.source + '-localStorage');
                entry.timestamp = entryData.timestamp; // Preserve original timestamp
                priceCache.set(symbol, entry);
                loadedCount++;
            }
        }
        
        if (loadedCount > 0) {
            console.log(`📱 Loaded ${loadedCount} stock prices from localStorage`);
        }
    } catch (error) {
        console.warn('Failed to load from localStorage:', error);
    }
}

function saveToLocalStorage() {
    try {
        const data = {};
        for (const [symbol, entry] of priceCache.entries()) {
            // Only save API-sourced data to localStorage
            if (entry.source.includes('api') || entry.source.includes('fallback')) {
                data[symbol] = {
                    price: entry.price,
                    timestamp: entry.timestamp,
                    source: entry.source.replace('-localStorage', '') // Remove localStorage suffix
                };
            }
        }
        
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.warn('Failed to save to localStorage:', error);
    }
}

// LRU cache management
function evictLeastUsed() {
    if (priceCache.size <= MAX_CACHE_SIZE) return;
    
    let leastUsed = null;
    let leastUsedKey = null;
    
    for (const [key, entry] of priceCache.entries()) {
        if (!leastUsed || entry.lastAccessed < leastUsed.lastAccessed) {
            leastUsed = entry;
            leastUsedKey = key;
        }
    }
    
    if (leastUsedKey) {
        priceCache.delete(leastUsedKey);
        console.log(`🗑️ Evicted ${leastUsedKey} from cache (LRU)`);
    }
    
    // Save to localStorage after eviction
    saveToLocalStorage();
}

// Initialize cache from localStorage on load
loadFromLocalStorage();

// Online/Offline status management
let isOnline = navigator.onLine;
let offlineQueue = [];

window.addEventListener('online', () => {
    isOnline = true;
    console.log('🌐 App back online - processing queued requests');
    processOfflineQueue();
});

window.addEventListener('offline', () => {
    isOnline = false;
    console.log('📱 App went offline - using cached data');
});

async function processOfflineQueue() {
    if (offlineQueue.length === 0) return;
    
    console.log(`🔄 Processing ${offlineQueue.length} queued stock price requests...`);
    const queueCopy = [...offlineQueue];
    offlineQueue = [];
    
    for (const symbol of queueCopy) {
        try {
            await fetchStockPrice(symbol, false); // Force fresh fetch
        } catch (error) {
            console.log(`Failed to refresh ${symbol}:`, error.message);
        }
    }
}

// Enhanced offline detection
function isAppOnline() {
    return navigator.onLine && isOnline;
}

// Real-time stock price fetching function - CORS-safe version
async function fetchRealTimePrice(symbol) {
    try {
        // Try Yahoo Finance API first (most reliable for CORS)
        const yahooUrl = `${STOCK_API_ENDPOINTS.YAHOO_FINANCE}/${symbol}`;
        console.log(`📊 StockAPI: Attempting to fetch ${symbol} from Yahoo Finance...`);
        
        const response = await fetch(yahooUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
            if (price && !isNaN(price)) {
                console.log(`✅ StockAPI: Successfully fetched ${symbol}: $${price}`);
                return parseFloat(price);
            }
        }
        
        console.log(`⚠️ StockAPI: Yahoo Finance failed for ${symbol}, using fallback`);
        return null;
    } catch (error) {
        console.log(`❌ StockAPI: External API error for ${symbol}:`, error.message);
        return null; // This will cause the main function to use fallback prices
    }
}

// Background refresh function for stale-while-revalidate
async function backgroundRefresh(symbol) {
    if (refreshingCache.has(symbol)) return; // Already refreshing
    
    refreshingCache.add(symbol);
    try {
        console.log(`🔄 Background refreshing ${symbol}...`);
        const freshPrice = await fetchRealTimePrice(symbol);
        if (freshPrice) {
            const entry = new CacheEntry(freshPrice, 'api-background');
            priceCache.set(symbol, entry);
            evictLeastUsed();
            saveToLocalStorage();
            console.log(`✅ Background refresh complete for ${symbol}: $${freshPrice}`);
        }
    } catch (error) {
        console.log(`❌ Background refresh failed for ${symbol}:`, error.message);
    } finally {
        refreshingCache.delete(symbol);
    }
}

// Main function to fetch stock price with stale-while-revalidate
async function fetchStockPrice(symbol, useCache = true) {
    if (!symbol) return null;
    
    const upperSymbol = symbol.toUpperCase();
    
    // Check cache first (stale-while-revalidate pattern)
    if (useCache && priceCache.has(upperSymbol)) {
        const cached = priceCache.get(upperSymbol);
        cached.touch(); // Update access tracking
        
        if (!cached.isExpired()) {
            // Fresh cache hit
            return cached.price;
        } else if (!cached.isStale()) {
            // Stale but not too old - return stale data and refresh in background
            backgroundRefresh(upperSymbol);
            return cached.price;
        }
        // If too stale, fall through to fresh fetch
    }
    
    // Check if we're offline and handle gracefully
    if (!isAppOnline()) {
        console.log('📱 App is offline, using cached/fallback data for', upperSymbol);
        
        // Add to offline queue for later processing
        if (!offlineQueue.includes(upperSymbol)) {
            offlineQueue.push(upperSymbol);
        }
        
        const fallbackPrice = FALLBACK_PRICES[upperSymbol];
        if (fallbackPrice) {
            const entry = new CacheEntry(fallbackPrice, 'fallback-offline');
            priceCache.set(upperSymbol, entry);
            return fallbackPrice;
        }
        return null;
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
            const entry = new CacheEntry(realTimePrice, 'api');
            priceCache.set(upperSymbol, entry);
            evictLeastUsed();
            saveToLocalStorage();
            
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
        const entry = new CacheEntry(fallbackPrice, 'fallback');
        priceCache.set(upperSymbol, entry);
        evictLeastUsed();
        
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