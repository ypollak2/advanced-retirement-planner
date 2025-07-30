// DigitalAssetPortfolioInput.js - Enhanced digital asset input with crypto token selection and real-time conversion (crypto assets, not auth tokens)
// PORTFOLIO TRACKING ONLY - NOT A CRYPTOCURRENCY WALLET - NO PRIVATE KEYS OR WALLET FUNCTIONS
// Created by Yali Pollak (יהלי פולק) - v6.6.2

const DigitalAssetPortfolioInput = ({ 
    inputs, 
    setInputs, 
    language = 'en', 
    workingCurrency = 'ILS',
    fieldPrefix = 'current',
    compact = false,
    className = ""
}) => {
    const createElement = React.createElement;
    
    // State for digital asset prices and loading
    const [assetPrices, setAssetPrices] = React.useState({});
    const [pricesLoading, setPricesLoading] = React.useState(false);
    const [lastUpdated, setLastUpdated] = React.useState(null);
    const [priceError, setPriceError] = React.useState(null);
    
    // Field names based on prefix - Digital asset/crypto currency UI fields (not auth tokens)
    const amountField = `${fieldPrefix}DigitalAssetAmount`;
    const tokenField = `${fieldPrefix}DigitalAssetToken`; // crypto asset selector field
    const fiatValueField = `${fieldPrefix}DigitalAssetFiatValue`;
    
    // Get current values
    const assetAmount = inputs[amountField] || 0;
    const assetToken = inputs[tokenField] || 'BTC'; // crypto asset type (BTC/ETH/etc)
    const assetFiatValue = inputs[fiatValueField] || 0;
    
    // Multi-language content
    const content = {
        he: {
            digitalAsset: 'נכסים דיגיטליים',
            amount: 'כמות',
            token: 'נכס', // crypto asset (not auth token)
            fiatValue: 'שווי במטבע בסיס',
            selectToken: 'בחר נכס דיגיטלי', // crypto asset selector
            loading: 'טוען מחירים...',
            error: 'שגיאה בטעינת מחירים',
            lastUpdated: 'עודכן לאחרונה',
            fallbackPrice: 'מחיר נוכחי (משוער)',
            refreshPrices: 'רענן מחירים'
        },
        en: {
            digitalAsset: 'Digital Asset',
            amount: 'Amount',
            token: 'Token', // crypto asset (not auth token)
            fiatValue: 'Fiat Value',
            selectToken: 'Select digital asset', // crypto asset selector
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
    
    // Fetch digital asset prices on mount and token change
    React.useEffect(() => {
        const fetchPrices = async () => {
            if (!window.fetchDigitalAssetPrices) {
                console.warn('⚠️ Digital asset price API not loaded');
                return;
            }
            
            setPricesLoading(true);
            setPriceError(null);
            
            try {
                const prices = await window.fetchDigitalAssetPrices(workingCurrency);
                setAssetPrices(prices);
                setLastUpdated(new Date());
                
                // Update fiat value if we have amount and token
                if (assetAmount && assetToken && prices[assetToken]) {
                    const fiatValue = assetAmount * prices[assetToken].price;
                    setInputs(prev => ({
                        ...prev,
                        [fiatValueField]: Math.round(fiatValue)
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch digital asset prices:', error);
                setPriceError(error.message);
            } finally {
                setPricesLoading(false);
            }
        };
        
        fetchPrices();
    }, [assetToken, workingCurrency]);
    
    // Handle amount change
    const handleAmountChange = (newAmount) => {
        const amount = parseFloat(newAmount) || 0;
        setInputs(prev => ({
            ...prev,
            [amountField]: amount,
            [fiatValueField]: amount && assetPrices[assetToken] ? 
                Math.round(amount * assetPrices[assetToken].price) : 0
        }));
    };
    
    // Handle token change
    const handleTokenChange = (newToken) => {
        setInputs(prev => ({
            ...prev,
            [tokenField]: newToken,
            [fiatValueField]: assetAmount && assetPrices[newToken] ? 
                Math.round(assetAmount * assetPrices[newToken].price) : 0
        }));
    };
    
    // Get current price info
    const getCurrentPrice = () => {
        const priceInfo = assetPrices[assetToken];
        if (!priceInfo) return null;
        
        return {
            price: priceInfo.price,
            change24h: priceInfo.change24h,
            isFallback: priceInfo.isFallback,
            symbol: window.getDigitalAssetSymbol ? window.getDigitalAssetSymbol(assetToken) : assetToken
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
            key: 'asset-title',
            className: "block text-lg font-medium text-yellow-700 mb-3"
        }, t.digitalAsset),
        
        // Main input grid
        createElement('div', {
            key: 'asset-inputs',
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
                    step: assetToken === 'BTC' ? '0.00000001' : assetToken === 'ETH' ? '0.000001' : '0.0001',
                    min: '0',
                    value: assetAmount || '',
                    onChange: (e) => handleAmountChange(e.target.value),
                    placeholder: assetToken === 'BTC' ? '0.00000000' : assetToken === 'ETH' ? '0.000000' : '0.0000',
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
                    value: assetToken,
                    onChange: (e) => handleTokenChange(e.target.value),
                    className: compact ? 
                        "w-full p-2 text-base border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500" :
                        "w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                }, [
                    // Generate options from supported digital assets
                    ...(window.SUPPORTED_DIGITAL_ASSETS ? Object.entries(window.SUPPORTED_DIGITAL_ASSETS).map(([symbol, info]) =>
                        createElement('option', { 
                            key: symbol, 
                            value: symbol 
                        }, `${info.name} (${symbol})`)
                    ) : [
                        createElement('option', { key: 'BTC', value: 'BTC' }, 'Digital Gold (BTC)'),
                        createElement('option', { key: 'ETH', value: 'ETH' }, 'Smart Contract Platform (ETH)'),
                        createElement('option', { key: 'USDT', value: 'USDT' }, 'Tether (USDT)'),
                        createElement('option', { key: 'SOL', value: 'SOL' }, 'Solana (SOL)')
                    ])
                ])
            ])
        ]),
        
        // Price info and fiat value
        createElement('div', {
            key: 'asset-info',
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
                    `1 ${assetToken} = ${currencySymbol}${formatPrice(currentPrice.price)}`),
                createElement('div', { key: 'price-meta', className: "flex items-center space-x-2" }, [
                    currentPrice.change24h !== 0 && assetAmount > 0 && createElement('span', {
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
            
            // Error state with enhanced tooltip
            priceError && createElement('div', {
                key: 'error',
                className: compact ? 
                    "p-2 bg-orange-50 border border-orange-200 rounded text-xs" :
                    "p-3 bg-orange-50 border border-orange-200 rounded-lg mb-3",
                title: `${t.error}: ${priceError}` // Tooltip with full error
            }, [
                createElement('div', {
                    key: 'error-content',
                    className: 'flex items-center'
                }, [
                    createElement('span', { 
                        key: 'icon', 
                        className: 'text-orange-600 mr-2' 
                    }, '⚠️'),
                    createElement('div', {
                        key: 'error-text',
                        className: 'flex-1'
                    }, [
                        createElement('div', {
                            key: 'main-message',
                            className: compact ? 'text-xs font-medium text-orange-800' : 'text-sm font-medium text-orange-800'
                        }, t.fallbackPrice),
                        createElement('div', {
                            key: 'sub-message',
                            className: compact ? 'text-xs text-orange-600' : 'text-xs text-orange-600 mt-1'
                        }, language === 'he' ? 
                            'מחירים מוערכים בלבד - עשויים להיות לא מדויקים' :
                            'Estimated prices only - may not be accurate')
                    ])
                ])
            ]),
            
            // Fiat value display
            assetFiatValue > 0 && createElement('div', {
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
                }, `${currencySymbol}${assetFiatValue.toLocaleString()}`)
            ]),
            
            // Last updated (only if not compact)
            !compact && lastUpdated && createElement('div', {
                key: 'last-updated',
                className: "text-xs text-gray-500 text-center"
            }, `${t.lastUpdated}: ${lastUpdated.toLocaleTimeString()}`)
        ])
    ]);
};

// Export to window for global access - maintain backward compatibility
window.CryptoPortfolioInput = DigitalAssetPortfolioInput;
window.DigitalAssetPortfolioInput = DigitalAssetPortfolioInput;
console.log('✅ DigitalAssetPortfolioInput component loaded successfully');