// CryptoPortfolioInput.js - Enhanced crypto input with token selection and real-time conversion
// Created by Yali Pollak (יהלי פולק) - v6.6.2

const CryptoPortfolioInput = ({ 
    inputs, 
    setInputs, 
    language = 'en', 
    workingCurrency = 'ILS',
    fieldPrefix = 'current',
    compact = false,
    className = ""
}) => {
    const createElement = React.createElement;
    
    // State for crypto prices and loading
    const [cryptoPrices, setCryptoPrices] = React.useState({});
    const [pricesLoading, setPricesLoading] = React.useState(false);
    const [lastUpdated, setLastUpdated] = React.useState(null);
    const [priceError, setPriceError] = React.useState(null);
    
    // Field names based on prefix
    const amountField = `${fieldPrefix}CryptoAmount`;
    const tokenField = `${fieldPrefix}CryptoToken`;
    const fiatValueField = `${fieldPrefix}CryptoFiatValue`;
    
    // Get current values
    const cryptoAmount = inputs[amountField] || 0;
    const cryptoToken = inputs[tokenField] || 'BTC';
    const cryptoFiatValue = inputs[fiatValueField] || 0;
    
    // Multi-language content
    const content = {
        he: {
            cryptocurrency: 'מטבעות דיגיטליים',
            amount: 'כמות',
            token: 'מטבע',
            fiatValue: 'שווי במטבע בסיס',
            selectToken: 'בחר מטבע דיגיטלי',
            loading: 'טוען מחירים...',
            error: 'שגיאה בטעינת מחירים',
            lastUpdated: 'עודכן לאחרונה',
            fallbackPrice: 'מחיר נוכחי (משוער)',
            refreshPrices: 'רענן מחירים'
        },
        en: {
            cryptocurrency: 'Cryptocurrency',
            amount: 'Amount',
            token: 'Token',
            fiatValue: 'Fiat Value',
            selectToken: 'Select cryptocurrency',
            loading: 'Loading prices...',
            error: 'Error loading prices',
            lastUpdated: 'Last updated',
            fallbackPrice: 'Current price (estimated)',
            refreshPrices: 'Refresh prices'
        }
    };
    
    const t = content[language];
    
    // Currency symbol helper
    const getCurrencySymbol = (currency) => {
        const symbols = {
            'ILS': '₪',
            'USD': '$',
            'EUR': '€',
            'GBP': '£'
        };
        return symbols[currency] || currency;
    };
    
    const currencySymbol = getCurrencySymbol(workingCurrency);
    
    // Fetch crypto prices on mount and token change
    React.useEffect(() => {
        const fetchPrices = async () => {
            if (!window.fetchCryptoPrices) {
                console.warn('⚠️ Crypto price API not loaded');
                return;
            }
            
            setPricesLoading(true);
            setPriceError(null);
            
            try {
                const prices = await window.fetchCryptoPrices(workingCurrency);
                setCryptoPrices(prices);
                setLastUpdated(new Date());
                
                // Update fiat value if we have amount and token
                if (cryptoAmount && cryptoToken && prices[cryptoToken]) {
                    const fiatValue = cryptoAmount * prices[cryptoToken].price;
                    setInputs(prev => ({
                        ...prev,
                        [fiatValueField]: Math.round(fiatValue)
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch crypto prices:', error);
                setPriceError(error.message);
            } finally {
                setPricesLoading(false);
            }
        };
        
        fetchPrices();
    }, [cryptoToken, workingCurrency]);
    
    // Handle amount change
    const handleAmountChange = (newAmount) => {
        const amount = parseFloat(newAmount) || 0;
        setInputs(prev => ({
            ...prev,
            [amountField]: amount,
            [fiatValueField]: amount && cryptoPrices[cryptoToken] ? 
                Math.round(amount * cryptoPrices[cryptoToken].price) : 0
        }));
    };
    
    // Handle token change
    const handleTokenChange = (newToken) => {
        setInputs(prev => ({
            ...prev,
            [tokenField]: newToken,
            [fiatValueField]: cryptoAmount && cryptoPrices[newToken] ? 
                Math.round(cryptoAmount * cryptoPrices[newToken].price) : 0
        }));
    };
    
    // Get current price info
    const getCurrentPrice = () => {
        const priceInfo = cryptoPrices[cryptoToken];
        if (!priceInfo) return null;
        
        return {
            price: priceInfo.price,
            change24h: priceInfo.change24h,
            isFallback: priceInfo.isFallback,
            symbol: window.getCryptoSymbol ? window.getCryptoSymbol(cryptoToken) : cryptoToken
        };
    };
    
    const currentPrice = getCurrentPrice();
    
    // Format price with appropriate decimals
    const formatPrice = (price) => {
        if (price >= 1000) return price.toLocaleString(language === 'he' ? 'he-IL' : 'en-US', { maximumFractionDigits: 0 });
        if (price >= 1) return price.toLocaleString(language === 'he' ? 'he-IL' : 'en-US', { maximumFractionDigits: 2 });
        return price.toLocaleString(language === 'he' ? 'he-IL' : 'en-US', { maximumFractionDigits: 6 });
    };
    
    return createElement('div', { className }, [
        // Title (only if not compact)
        !compact && createElement('label', {
            key: 'crypto-title',
            className: "block text-lg font-medium text-yellow-700 mb-3"
        }, t.cryptocurrency),
        
        // Main input grid
        createElement('div', {
            key: 'crypto-inputs',
            className: compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
        }, [
            // Amount input
            createElement('div', { key: 'amount-field' }, [
                createElement('label', {
                    key: 'amount-label',
                    className: compact ? "block text-sm font-medium text-gray-700 mb-1" : "block text-sm font-medium text-gray-700 mb-2"
                }, `${t.amount}${currentPrice ? ` (${currentPrice.symbol})` : ''}`),
                createElement('input', {
                    key: 'amount-input',
                    type: 'number',
                    step: cryptoToken === 'BTC' ? '0.00000001' : cryptoToken === 'ETH' ? '0.000001' : '0.0001',
                    min: '0',
                    value: cryptoAmount || '',
                    onChange: (e) => handleAmountChange(e.target.value),
                    placeholder: cryptoToken === 'BTC' ? '0.00000000' : cryptoToken === 'ETH' ? '0.000000' : '0.0000',
                    className: compact ? 
                        "w-full p-2 text-base border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500" :
                        "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                })
            ]),
            
            // Token selector
            createElement('div', { key: 'token-field' }, [
                createElement('label', {
                    key: 'token-label',
                    className: compact ? "block text-sm font-medium text-gray-700 mb-1" : "block text-sm font-medium text-gray-700 mb-2"
                }, t.token),
                createElement('select', {
                    key: 'token-select',
                    value: cryptoToken,
                    onChange: (e) => handleTokenChange(e.target.value),
                    className: compact ? 
                        "w-full p-2 text-base border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500" :
                        "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                }, [
                    // Generate options from supported cryptos
                    ...(window.SUPPORTED_CRYPTOS ? Object.entries(window.SUPPORTED_CRYPTOS).map(([symbol, info]) =>
                        createElement('option', { 
                            key: symbol, 
                            value: symbol 
                        }, `${info.name} (${symbol})`)
                    ) : [
                        createElement('option', { key: 'BTC', value: 'BTC' }, 'Bitcoin (BTC)'),
                        createElement('option', { key: 'ETH', value: 'ETH' }, 'Ethereum (ETH)'),
                        createElement('option', { key: 'USDT', value: 'USDT' }, 'Tether (USDT)'),
                        createElement('option', { key: 'SOL', value: 'SOL' }, 'Solana (SOL)')
                    ])
                ])
            ])
        ]),
        
        // Price info and fiat value
        createElement('div', {
            key: 'crypto-info',
            className: compact ? "mt-2 space-y-2" : "space-y-3"
        }, [
            // Current price display
            currentPrice && createElement('div', {
                key: 'price-info',
                className: compact ? 
                    "flex justify-between items-center text-xs text-gray-600" :
                    "flex justify-between items-center p-2 bg-yellow-100 rounded text-sm"
            }, [
                createElement('span', { key: 'price-label' }, 
                    `1 ${cryptoToken} = ${currencySymbol}${formatPrice(currentPrice.price)}`),
                createElement('div', { key: 'price-meta', className: "flex items-center space-x-2" }, [
                    currentPrice.change24h !== 0 && createElement('span', {
                        key: 'change-24h',
                        className: currentPrice.change24h > 0 ? 'text-green-600' : 'text-red-600'
                    }, `${currentPrice.change24h > 0 ? '+' : ''}${currentPrice.change24h.toFixed(2)}%`),
                    currentPrice.isFallback && createElement('span', {
                        key: 'fallback-indicator',
                        className: "text-orange-600 text-xs",
                        title: t.fallbackPrice
                    }, '⚠️')
                ])
            ]),
            
            // Loading state
            pricesLoading && createElement('div', {
                key: 'loading',
                className: compact ? "text-xs text-gray-500" : "text-sm text-gray-500 text-center"
            }, t.loading),
            
            // Error state
            priceError && createElement('div', {
                key: 'error',
                className: compact ? "text-xs text-red-600" : "text-sm text-red-600 text-center"
            }, `${t.error}: ${priceError}`),
            
            // Fiat value display
            cryptoFiatValue > 0 && createElement('div', {
                key: 'fiat-value',
                className: compact ? 
                    "p-2 bg-green-50 rounded border text-sm" :
                    "p-3 bg-green-50 rounded-lg border border-green-200"
            }, [
                createElement('div', {
                    key: 'fiat-label',
                    className: compact ? "text-xs font-medium text-green-700" : "text-sm font-medium text-green-700 mb-1"
                }, t.fiatValue),
                createElement('div', {
                    key: 'fiat-amount',
                    className: compact ? "text-lg font-bold text-green-800" : "text-2xl font-bold text-green-800"
                }, `${currencySymbol}${cryptoFiatValue.toLocaleString()}`)
            ]),
            
            // Last updated (only if not compact)
            !compact && lastUpdated && createElement('div', {
                key: 'last-updated',
                className: "text-xs text-gray-500 text-center"
            }, `${t.lastUpdated}: ${lastUpdated.toLocaleTimeString()}`)
        ])
    ]);
};

// Export to window for global access
window.CryptoPortfolioInput = CryptoPortfolioInput;
console.log('✅ CryptoPortfolioInput component loaded successfully');