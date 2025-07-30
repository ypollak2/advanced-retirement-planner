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

// Fallback stock prices for major tech companies (updated July 30, 2025)
const FALLBACK_PRICES = {
    'AAPL': 195.50,   // Apple
    'GOOGL': 197.00,  // Alphabet (Google) - Updated from screenshot
    'MSFT': 435.00,   // Microsoft
    'AMZN': 170.50,   // Amazon
    'META': 560.00,   // Meta (Facebook)
    'NFLX': 495.00,   // Netflix
    'TSLA': 270.00,   // Tesla
    'NVDA': 130.00,   // NVIDIA (post-split)
    'AMD': 160.00,    // AMD
    'INTC': 36.50,    // Intel
    'CRM': 275.00,    // Salesforce
    'ORCL': 150.00,   // Oracle
    'ADBE': 540.00,   // Adobe
    'NOW': 800.00,    // ServiceNow
    'SHOP': 78.00,    // Shopify
    'SPOT': 335.00,   // Spotify
    'ZM': 68.00,      // Zoom
    'UBER': 78.50,    // Uber
    'ABNB': 140.00,   // Airbnb
    'COIN': 215.00,   // Coinbase
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
const STOCK_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
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
        return Date.now() - this.timestamp > STOCK_CACHE_DURATION;
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
        // Handle quota exceeded or disabled localStorage
        if (error.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded - clearing old data');
            try {
                localStorage.removeItem(LOCALSTORAGE_KEY);
                localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({}));
            } catch (e) {
                console.error('Cannot access localStorage:', e);
            }
        } else {
            console.warn('Failed to save to localStorage:', error);
        }
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
let isProcessingQueue = false;

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
    if (offlineQueue.length === 0 || isProcessingQueue) return;
    
    isProcessingQueue = true;
    try {
        console.log(`🔄 Processing ${offlineQueue.length} queued stock price requests...`);
        const queueCopy = [...new Set(offlineQueue)]; // Remove duplicates
        offlineQueue = [];
        
        // Process in batches to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < queueCopy.length; i += batchSize) {
            const batch = queueCopy.slice(i, i + batchSize);
            await Promise.all(
                batch.map(symbol => 
                    fetchStockPrice(symbol, false).catch(error => 
                        console.log(`Failed to refresh ${symbol}:`, error.message)
                    )
                )
            );
        }
    } finally {
        isProcessingQueue = false;
    }
}

// Enhanced offline detection
function isAppOnline() {
    return navigator.onLine && isOnline;
}

// Initialize CORS proxy service
let corsProxy;
if (window.CORSProxyService) {
    corsProxy = new window.CORSProxyService();
    console.log('✅ CORS Proxy Service initialized for stock price API');
}

// Real-time stock price fetching function - CORS-safe version
async function fetchRealTimePrice(symbol) {
    try {
        // Try Yahoo Finance API with CORS proxy
        const yahooUrl = `${STOCK_API_ENDPOINTS.YAHOO_FINANCE}/${symbol}`;
        console.log(`📊 StockAPI: Attempting to fetch ${symbol} from Yahoo Finance...`);
        
        let data;
        
        // Use CORS proxy if available
        if (corsProxy) {
            try {
                data = await corsProxy.fetchWithProxy(yahooUrl);
            } catch (proxyError) {
                console.log(`⚠️ CORS proxy failed, trying direct fetch...`);
                // Fallback to direct fetch
                const response = await fetch(yahooUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                if (response.ok) {
                    data = await response.json();
                }
            }
        } else {
            // No CORS proxy available, try direct fetch
            const response = await fetch(yahooUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            if (response.ok) {
                data = await response.json();
            }
        }
        
        if (data) {
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
const refreshPromises = new Map(); // Track ongoing refresh promises

async function backgroundRefresh(symbol) {
    // Return existing promise if already refreshing
    if (refreshPromises.has(symbol)) {
        return refreshPromises.get(symbol);
    }
    
    const refreshPromise = (async () => {
        refreshingCache.add(symbol);
        try {
            console.log(`🔄 Background refreshing ${symbol}...`);
            const freshPrice = await fetchRealTimePrice(symbol);
            if (freshPrice && freshPrice > 0 && isFinite(freshPrice)) {
                const entry = new CacheEntry(freshPrice, 'api-background');
                priceCache.set(symbol, entry);
                evictLeastUsed();
                saveToLocalStorage();
                console.log(`✅ Background refresh complete for ${symbol}: $${freshPrice}`);
                return freshPrice;
            }
        } catch (error) {
            console.log(`❌ Background refresh failed for ${symbol}:`, error.message);
            throw error;
        } finally {
            refreshingCache.delete(symbol);
            refreshPromises.delete(symbol);
        }
    })();
    
    refreshPromises.set(symbol, refreshPromise);
    return refreshPromise;
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
    
    // Try to fetch real-time price from APIs (with timeout and retry)
    const maxRetries = 2;
    let lastError = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const timeout = 5000 + (attempt * 2000); // Increase timeout with each retry
            const realTimePrice = await Promise.race([
                fetchRealTimePrice(upperSymbol),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
            ]);
            
            if (realTimePrice && realTimePrice > 0 && isFinite(realTimePrice)) {
                console.log(`📈 Real-time price fetched for ${upperSymbol}: $${realTimePrice}`);
                
                // Cache real-time price
                const entry = new CacheEntry(realTimePrice, 'api');
                priceCache.set(upperSymbol, entry);
                evictLeastUsed();
                saveToLocalStorage();
                
                return realTimePrice;
            }
        } catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
                console.log(`🔄 Retry ${attempt + 1}/${maxRetries} for ${upperSymbol}...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
            }
        }
    }
    
    console.warn(`⚠️ Failed to fetch real-time price for ${upperSymbol} after ${maxRetries + 1} attempts:`, lastError?.message || 'Unknown error');
    
    // Fallback to hardcoded prices if API fails
    if (FALLBACK_PRICES[upperSymbol]) {
        const fallbackPrice = FALLBACK_PRICES[upperSymbol];
        console.log(`📊 Using fallback price for ${upperSymbol}: $${fallbackPrice} (Last updated: July 30, 2025)`);
        
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