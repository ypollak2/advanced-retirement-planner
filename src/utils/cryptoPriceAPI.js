// Crypto Price API Integration for Portfolio Tracking
// Created by Yali Pollak (יהלי פולק) - v6.6.2

// CORS-free crypto price API endpoints
const CRYPTO_API_ENDPOINTS = {
    // CoinGecko API (free tier - 100 calls per minute)
    COINGECKO: 'https://api.coingecko.com/api/v3/simple/price',
    // Fallback endpoint for CoinGecko
    COINGECKO_FALLBACK: 'https://api.coingecko.com/api/v3/coins/markets'
};

// Supported cryptocurrencies with their CoinGecko IDs
const SUPPORTED_CRYPTOS = {
    'BTC': { id: 'bitcoin', name: 'Bitcoin', symbol: '₿' },
    'ETH': { id: 'ethereum', name: 'Ethereum', symbol: 'Ξ' },
    'USDT': { id: 'tether', name: 'Tether', symbol: '₮' },
    'SOL': { id: 'solana', name: 'Solana', symbol: 'SOL' },
    'ADA': { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    'DOT': { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
    'MATIC': { id: 'matic-network', name: 'Polygon', symbol: 'MATIC' },
    'AVAX': { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
    'LINK': { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
    'UNI': { id: 'uniswap', name: 'Uniswap', symbol: 'UNI' }
};

// Fallback crypto prices (updated July 2025 - realistic estimates)
const FALLBACK_CRYPTO_PRICES = {
    'bitcoin': { usd: 67000, eur: 62000, ils: 245000 },
    'ethereum': { usd: 3500, eur: 3250, ils: 12800 },
    'tether': { usd: 1.00, eur: 0.92, ils: 3.65 },
    'solana': { usd: 185, eur: 171, ils: 677 },
    'cardano': { usd: 0.45, eur: 0.42, ils: 1.65 },
    'polkadot': { usd: 7.20, eur: 6.65, ils: 26.30 },
    'matic-network': { usd: 0.85, eur: 0.78, ils: 3.10 },
    'avalanche-2': { usd: 28.50, eur: 26.30, ils: 104.00 },
    'chainlink': { usd: 15.80, eur: 14.60, ils: 57.80 },
    'uniswap': { usd: 8.50, eur: 7.85, ils: 31.00 }
};

// Currency mapping for CoinGecko API
const CURRENCY_MAPPING = {
    'ILS': 'ils',
    'USD': 'usd', 
    'EUR': 'eur',
    'GBP': 'gbp'
};

// Cache management
let cryptoPriceCache = {};
let lastCacheUpdate = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch crypto prices from CoinGecko API
async function fetchCryptoPrices(currency = 'usd') {
    const cacheKey = `crypto_prices_${currency}`;
    const now = Date.now();
    
    // Return cached data if still valid
    if (cryptoPriceCache[cacheKey] && lastCacheUpdate && (now - lastCacheUpdate < CACHE_DURATION)) {
        console.log('📦 Using cached crypto prices');
        return cryptoPriceCache[cacheKey];
    }
    
    try {
        const coinIds = Object.values(SUPPORTED_CRYPTOS).map(crypto => crypto.id).join(',');
        const apiCurrency = CURRENCY_MAPPING[currency.toUpperCase()] || currency.toLowerCase();
        
        const response = await fetch(
            `${CRYPTO_API_ENDPOINTS.COINGECKO}?ids=${coinIds}&vs_currencies=${apiCurrency}&include_24hr_change=true`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Advanced-Retirement-Planner/6.6.2'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform data to our format
        const prices = {};
        Object.entries(SUPPORTED_CRYPTOS).forEach(([symbol, info]) => {
            if (data[info.id]) {
                prices[symbol] = {
                    price: data[info.id][apiCurrency],
                    change24h: data[info.id][`${apiCurrency}_24h_change`] || 0,
                    lastUpdate: now
                };
            }
        });
        
        // Cache the results
        cryptoPriceCache[cacheKey] = prices;
        lastCacheUpdate = now;
        
        console.log(`✅ Fetched crypto prices for ${Object.keys(prices).length} currencies in ${currency.toUpperCase()}`);
        return prices;
        
    } catch (error) {
        console.warn('⚠️ Failed to fetch crypto prices from CoinGecko:', error.message);
        
        // Return fallback prices
        const fallbackPrices = {};
        const apiCurrency = CURRENCY_MAPPING[currency.toUpperCase()] || 'usd';
        
        Object.entries(SUPPORTED_CRYPTOS).forEach(([symbol, info]) => {
            if (FALLBACK_CRYPTO_PRICES[info.id] && FALLBACK_CRYPTO_PRICES[info.id][apiCurrency]) {
                fallbackPrices[symbol] = {
                    price: FALLBACK_CRYPTO_PRICES[info.id][apiCurrency],
                    change24h: 0,
                    lastUpdate: now,
                    isFallback: true
                };
            }
        });
        
        console.log(`📋 Using fallback crypto prices for ${currency.toUpperCase()}`);
        return fallbackPrices;
    }
}

// Get single crypto price
async function getCryptoPrice(cryptoSymbol, currency = 'usd') {
    const prices = await fetchCryptoPrices(currency);
    return prices[cryptoSymbol.toUpperCase()] || null;
}

// Calculate fiat value of crypto holdings
function calculateCryptoValue(amount, cryptoSymbol, price) {
    if (!amount || !price) return 0;
    return parseFloat(amount) * parseFloat(price);
}

// Format crypto amount with appropriate decimals
function formatCryptoAmount(amount, cryptoSymbol) {
    const crypto = SUPPORTED_CRYPTOS[cryptoSymbol.toUpperCase()];
    if (!crypto || !amount) return '0';
    
    // Different decimal places for different cryptos
    const decimals = cryptoSymbol.toUpperCase() === 'BTC' ? 8 : 
                    cryptoSymbol.toUpperCase() === 'ETH' ? 6 : 
                    cryptoSymbol.toUpperCase() === 'USDT' ? 2 : 4;
    
    return parseFloat(amount).toFixed(decimals);
}

// Get crypto symbol for display
function getCryptoSymbol(cryptoSymbol) {
    const crypto = SUPPORTED_CRYPTOS[cryptoSymbol.toUpperCase()];
    return crypto ? crypto.symbol : cryptoSymbol.toUpperCase();
}

// Get crypto full name
function getCryptoName(cryptoSymbol) {
    const crypto = SUPPORTED_CRYPTOS[cryptoSymbol.toUpperCase()];
    return crypto ? crypto.name : cryptoSymbol.toUpperCase();
}

// Validate crypto symbol
function isValidCryptoSymbol(symbol) {
    return Object.keys(SUPPORTED_CRYPTOS).includes(symbol.toUpperCase());
}

// Export functions to window for global access
window.fetchCryptoPrices = fetchCryptoPrices;
window.getCryptoPrice = getCryptoPrice;
window.calculateCryptoValue = calculateCryptoValue;
window.formatCryptoAmount = formatCryptoAmount;
window.getCryptoSymbol = getCryptoSymbol;
window.getCryptoName = getCryptoName;
window.isValidCryptoSymbol = isValidCryptoSymbol;
window.SUPPORTED_CRYPTOS = SUPPORTED_CRYPTOS;

console.log('✅ Crypto Price API loaded successfully');