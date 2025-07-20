// Service Worker for Advanced Retirement Planner
// Created by Yali Pollak (יהלי פולק) - v6.2.0

const CACHE_NAME = 'retirement-planner-v6.2.0';
const STATIC_CACHE_NAME = 'retirement-planner-static-v6.2.0';
const DYNAMIC_CACHE_NAME = 'retirement-planner-dynamic-v6.2.0';

// Files to cache immediately on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/src/components/RetirementPlannerApp.js',
    '/src/components/RetirementWizard.js',
    '/src/components/Dashboard.js',
    '/src/components/PermanentSidePanel.js',
    '/src/utils/retirementCalculations.js',
    '/src/utils/stockPriceAPI.js',
    '/src/utils/currencyAPI.js',
    '/src/data/marketConstants.js',
    '/config/cors-proxy-solution.js'
];

// API patterns that should be cached dynamically
const API_CACHE_PATTERNS = [
    /^https:\/\/query[12]\.finance\.yahoo\.com/,
    /^https:\/\/api\.twelvedata\.com/,
    /^https:\/\/api\.exchangerate-api\.com/,
    /^https:\/\/api\.coingecko\.com/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('📦 Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('📱 Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Failed to cache static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME &&
                            cacheName.startsWith('retirement-planner-')) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-HTTP requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests with different strategies
    if (isStaticAsset(request)) {
        // Static assets: Cache first with network fallback
        event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    } else if (isAPIRequest(request)) {
        // API requests: Network first with cache fallback
        event.respondWith(networkFirstWithCache(request));
    } else {
        // Everything else: Network first with cache fallback
        event.respondWith(networkFirst(request));
    }
});

// Cache strategies
async function cacheFirst(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        return new Response('Offline - Content not available', { status: 503 });
    }
}

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Offline - Content not available', { status: 503 });
    }
}

async function networkFirstWithCache(request) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const networkResponse = await fetch(request, { 
            signal: controller.signal 
        });
        clearTimeout(timeoutId);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error(`Network response not ok: ${networkResponse.status}`);
    } catch (error) {
        console.log('Network failed for API request, checking cache:', error.message);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return fallback response for stock price APIs
        if (request.url.includes('finance.yahoo.com') || 
            request.url.includes('twelvedata.com')) {
            return new Response(JSON.stringify({
                error: 'offline',
                message: 'Stock price API unavailable offline'
            }), {
                headers: { 'Content-Type': 'application/json' },
                status: 503
            });
        }
        
        return new Response('API unavailable offline', { status: 503 });
    }
}

// Helper functions
function isStaticAsset(request) {
    return request.destination === 'script' || 
           request.destination === 'style' ||
           request.destination === 'document' ||
           request.url.includes('/src/') ||
           request.url.includes('/config/') ||
           request.url.endsWith('.html') ||
           request.url.endsWith('.js') ||
           request.url.endsWith('.css');
}

function isAPIRequest(request) {
    return API_CACHE_PATTERNS.some(pattern => pattern.test(request.url));
}

// Background sync for stock price updates
self.addEventListener('sync', (event) => {
    if (event.tag === 'stock-price-sync') {
        console.log('🔄 Background sync: Updating stock prices...');
        event.waitUntil(syncStockPrices());
    }
});

async function syncStockPrices() {
    try {
        // Get stored symbols that need updating
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const keys = await cache.keys();
        
        const stockApiRequests = keys.filter(request => 
            request.url.includes('finance.yahoo.com') || 
            request.url.includes('twelvedata.com')
        );
        
        // Refresh stock prices in background
        const refreshPromises = stockApiRequests.slice(0, 10).map(async (request) => {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    await cache.put(request, response);
                }
            } catch (error) {
                console.log('Failed to refresh:', request.url);
            }
        });
        
        await Promise.allSettled(refreshPromises);
        console.log('✅ Background stock price sync completed');
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// Listen for messages from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_STOCK_PRICES') {
        const symbols = event.data.symbols || [];
        cacheStockPricesForOffline(symbols);
    }
});

async function cacheStockPricesForOffline(symbols) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    
    for (const symbol of symbols) {
        try {
            const requests = [
                `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
                `https://api.twelvedata.com/price?symbol=${symbol}&apikey=demo`
            ];
            
            for (const url of requests) {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        await cache.put(url, response.clone());
                        break; // Stop after first successful request
                    }
                } catch (error) {
                    console.log(`Failed to cache ${url}:`, error);
                }
            }
        } catch (error) {
            console.log(`Failed to cache prices for ${symbol}:`, error);
        }
    }
}