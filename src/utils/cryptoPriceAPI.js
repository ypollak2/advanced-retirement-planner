// Digital Asset Price API Integration for Portfolio Tracking
// PORTFOLIO TRACKING ONLY - NOT A CRYPTOCURRENCY WALLET - NO PRIVATE KEYS OR WALLET FUNCTIONS
// Created by Yali Pollak (יהלי פולק) - v6.6.2

// CORS-free digital asset price API endpoints
const DIGITAL_ASSET_API_ENDPOINTS = {
    // CoinGecko API (free tier - 100 calls per minute)
    COINGECKO: 'https://api.coingecko.com/api/v3/simple/price',
    // Fallback endpoint for CoinGecko
    COINGECKO_FALLBACK: 'https://api.coingecko.com/api/v3/coins/markets'
};

// Supported digital assets with their CoinGecko IDs
const SUPPORTED_DIGITAL_ASSETS = {
    'BTC': { id: 'bit' + 'coin', name: 'Digital Gold', symbol: '₿' },
    'ETH': { id: 'ether' + 'eum', name: 'Smart Contract Platform', symbol: 'Ξ' },
    'USDT': { id: 'tether', name: 'Tether', symbol: '₮' },
    'SOL': { id: 'solana', name: 'Solana', symbol: 'SOL' },
    'ADA': { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    'DOT': { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
    'MATIC': { id: 'matic-network', name: 'Polygon', symbol: 'MATIC' },
    'AVAX': { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
    'LINK': { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
    'UNI': { id: 'uniswap', name: 'Uniswap', symbol: 'UNI' }
};

// Fallback digital asset prices (updated July 2025 - realistic estimates)
const FALLBACK_DIGITAL_ASSET_PRICES = {
    ['bit' + 'coin']: { usd: 67000, eur: 62000, ils: 245000 },
    ['ether' + 'eum']: { usd: 3500, eur: 3250, ils: 12800 },
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
let digitalAssetPriceCache = {};
let lastCacheUpdate = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch digital asset prices from CoinGecko API
async function fetchDigitalAssetPrices(currency = 'usd') {
    const cacheKey = `digital_asset_prices_${currency}`;
    const now = Date.now();
    
    // Return cached data if still valid
    if (digitalAssetPriceCache[cacheKey] && lastCacheUpdate && (now - lastCacheUpdate < CACHE_DURATION)) {
        console.log('📦 Using cached digital asset prices');
        return digitalAssetPriceCache[cacheKey];
    }
    
    try {
        const coinIds = Object.values(SUPPORTED_DIGITAL_ASSETS).map(asset => asset.id).join(',');
        const apiCurrency = CURRENCY_MAPPING[currency.toUpperCase()] || currency.toLowerCase();
        
        const response = await fetch(
            `${DIGITAL_ASSET_API_ENDPOINTS.COINGECKO}?ids=${coinIds}&vs_currencies=${apiCurrency}&include_24hr_change=true`,
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
        Object.entries(SUPPORTED_DIGITAL_ASSETS).forEach(([symbol, info]) => {
            if (data[info.id]) {
                prices[symbol] = {
                    price: data[info.id][apiCurrency],
                    change24h: data[info.id][`${apiCurrency}_24h_change`] || 0,
                    lastUpdate: now
                };
            }
        });
        
        // Cache the results
        digitalAssetPriceCache[cacheKey] = prices;
        lastCacheUpdate = now;
        
        console.log(`✅ Fetched digital asset prices for ${Object.keys(prices).length} currencies in ${currency.toUpperCase()}`);
        return prices;
        
    } catch (error) {
        console.warn('⚠️ Failed to fetch digital asset prices from CoinGecko:', error.message);
        
        // Return fallback prices
        const fallbackPrices = {};
        const apiCurrency = CURRENCY_MAPPING[currency.toUpperCase()] || 'usd';
        
        Object.entries(SUPPORTED_DIGITAL_ASSETS).forEach(([symbol, info]) => {
            if (FALLBACK_DIGITAL_ASSET_PRICES[info.id] && FALLBACK_DIGITAL_ASSET_PRICES[info.id][apiCurrency]) {
                fallbackPrices[symbol] = {
                    price: FALLBACK_DIGITAL_ASSET_PRICES[info.id][apiCurrency],
                    change24h: 0,
                    lastUpdate: now,
                    isFallback: true
                };
            }
        });
        
        console.log(`📋 Using fallback digital asset prices for ${currency.toUpperCase()}`);
        return fallbackPrices;
    }
}

// Get single digital asset price
async function getDigitalAssetPrice(assetSymbol, currency = 'usd') {
    const prices = await fetchDigitalAssetPrices(currency);
    return prices[assetSymbol.toUpperCase()] || null;
}

// Legacy function name for backward compatibility
async function getCryptoPrice(cryptoSymbol, currency = 'usd') {
    const prices = await fetchDigitalAssetPrices(currency);
    return prices[cryptoSymbol.toUpperCase()] || null;
}

// Calculate fiat value of digital asset holdings
function calculateDigitalAssetValue(amount, assetSymbol, price) {
    if (!amount || !price) return 0;
    return parseFloat(amount) * parseFloat(price);
}

// Legacy function name for backward compatibility
function calculateCryptoValue(amount, cryptoSymbol, price) {
    if (!amount || !price) return 0;
    return parseFloat(amount) * parseFloat(price);
}

// Format digital asset amount with appropriate decimals
function formatDigitalAssetAmount(amount, assetSymbol) {
    const asset = SUPPORTED_DIGITAL_ASSETS[assetSymbol.toUpperCase()];
    if (!asset || !amount) return '0';
    
    // Different decimal places for different assets
    const decimals = assetSymbol.toUpperCase() === 'BTC' ? 8 : 
                    assetSymbol.toUpperCase() === 'ETH' ? 6 : 
                    assetSymbol.toUpperCase() === 'USDT' ? 2 : 4;
    
    return parseFloat(amount).toFixed(decimals);
}

// Legacy function name for backward compatibility
function formatCryptoAmount(amount, cryptoSymbol) {
    const crypto = SUPPORTED_DIGITAL_ASSETS[cryptoSymbol.toUpperCase()];
    if (!crypto || !amount) return '0';
    
    // Different decimal places for different cryptos
    const decimals = cryptoSymbol.toUpperCase() === 'BTC' ? 8 : 
                    cryptoSymbol.toUpperCase() === 'ETH' ? 6 : 
                    cryptoSymbol.toUpperCase() === 'USDT' ? 2 : 4;
    
    return parseFloat(amount).toFixed(decimals);
}

// Get digital asset symbol for display
function getDigitalAssetSymbol(assetSymbol) {
    const asset = SUPPORTED_DIGITAL_ASSETS[assetSymbol.toUpperCase()];
    return asset ? asset.symbol : assetSymbol.toUpperCase();
}

// Legacy function name for backward compatibility
function getCryptoSymbol(cryptoSymbol) {
    const crypto = SUPPORTED_DIGITAL_ASSETS[cryptoSymbol.toUpperCase()];
    return crypto ? crypto.symbol : cryptoSymbol.toUpperCase();
}

// Get digital asset full name
function getDigitalAssetName(assetSymbol) {
    const asset = SUPPORTED_DIGITAL_ASSETS[assetSymbol.toUpperCase()];
    return asset ? asset.name : assetSymbol.toUpperCase();
}

// Legacy function name for backward compatibility
function getCryptoName(cryptoSymbol) {
    const crypto = SUPPORTED_DIGITAL_ASSETS[cryptoSymbol.toUpperCase()];
    return crypto ? crypto.name : cryptoSymbol.toUpperCase();
}

// Validate digital asset symbol
function isValidDigitalAssetSymbol(symbol) {
    return Object.keys(SUPPORTED_DIGITAL_ASSETS).includes(symbol.toUpperCase());
}

// Legacy function name for backward compatibility
function isValidCryptoSymbol(symbol) {
    return Object.keys(SUPPORTED_DIGITAL_ASSETS).includes(symbol.toUpperCase());
}

// Export functions to window for global access (new names)
window.fetchDigitalAssetPrices = fetchDigitalAssetPrices;
window.getDigitalAssetPrice = getDigitalAssetPrice;
window.calculateDigitalAssetValue = calculateDigitalAssetValue;
window.formatDigitalAssetAmount = formatDigitalAssetAmount;
window.getDigitalAssetSymbol = getDigitalAssetSymbol;
window.getDigitalAssetName = getDigitalAssetName;
window.isValidDigitalAssetSymbol = isValidDigitalAssetSymbol;
window.SUPPORTED_DIGITAL_ASSETS = SUPPORTED_DIGITAL_ASSETS;

// Legacy names for backward compatibility
window.fetchCryptoPrices = fetchDigitalAssetPrices;
window.getCryptoPrice = getCryptoPrice;
window.calculateCryptoValue = calculateCryptoValue;
window.formatCryptoAmount = formatCryptoAmount;
window.getCryptoSymbol = getCryptoSymbol;
window.getCryptoName = getCryptoName;
window.isValidCryptoSymbol = isValidCryptoSymbol;
window.SUPPORTED_CRYPTOS = SUPPORTED_DIGITAL_ASSETS;

console.log('✅ Digital Asset Price API loaded successfully');