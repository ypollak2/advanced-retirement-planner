// Currency Selector Component - Live exchange rates with visual indicators
// Created by Yali Pollak (יהלי פולק)

const CurrencySelector = ({ 
    selectedCurrency = 'ILS',
    onCurrencyChange,
    amount = 0,
    language = 'en',
    showRates = true,
    compact = false
}) => {
    const [rates, setRates] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    const [lastUpdated, setLastUpdated] = React.useState(null);
    const [error, setError] = React.useState(null);

    // Supported currencies with metadata
    const currencies = {
        ILS: {
            symbol: '₪',
            name: { he: 'שקל ישראלי', en: 'Israeli Shekel' },
            flag: '🇮🇱',
            isBase: true
        },
        USD: {
            symbol: '$',
            name: { he: 'דולר אמריקאי', en: 'US Dollar' },
            flag: '🇺🇸',
            isBase: false
        },
        EUR: {
            symbol: '€',
            name: { he: 'יורו', en: 'Euro' },
            flag: '🇪🇺',
            isBase: false
        },
        GBP: {
            symbol: '£',
            name: { he: 'לירה בריטית', en: 'British Pound' },
            flag: '🇬🇧',
            isBase: false
        },
        BTC: {
            symbol: '₿',
            name: { he: 'ביטקוין', en: 'Bitcoin' },
            flag: '₿',
            isCrypto: true
        },
        ETH: {
            symbol: 'Ξ',
            name: { he: 'אתריום', en: 'Ethereum' },
            flag: 'Ξ',
            isCrypto: true
        }
    };

    // Load exchange rates
    const loadRates = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const exchangeRates = await window.currencyAPI.fetchExchangeRates();
            setRates(exchangeRates);
            setLastUpdated(window.currencyAPI.getLastUpdated());
        } catch (err) {
            setError(err.message);
            console.error('Failed to load exchange rates:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Load rates on component mount
    React.useEffect(() => {
        loadRates();
        
        // Auto-refresh every 5 minutes
        const interval = setInterval(loadRates, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Format amount in selected currency
    const formatAmount = (amount, currency) => {
        if (!window.currencyAPI) return `${currencies[currency]?.symbol || ''}${amount}`;
        return window.currencyAPI.formatCurrency(amount, currency, language === 'he' ? 'he-IL' : 'en-US');
    };

    // Convert amount to selected currency
    const convertAmount = (amount, toCurrency) => {
        if (toCurrency === 'ILS') return amount;
        const rate = rates[toCurrency];
        if (!rate) return amount;
        
        if (currencies[toCurrency]?.isCrypto) {
            return amount * rate;
        }
        return amount / rate;
    };

    // Get rate display text
    const getRateDisplay = (currency) => {
        if (currency === 'ILS') return '1.00';
        const rate = rates[currency];
        if (!rate) return '---';
        
        if (currencies[currency]?.isCrypto) {
            return rate.toFixed(6);
        }
        return (1 / rate).toFixed(3);
    };

    // Time since last update
    const getTimeSinceUpdate = () => {
        if (!lastUpdated) return '';
        const minutes = Math.floor((Date.now() - lastUpdated) / 60000);
        if (minutes < 1) return language === 'he' ? 'עכשיו' : 'now';
        if (minutes < 60) return language === 'he' ? `לפני ${minutes} דק'` : `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return language === 'he' ? `לפני ${hours} שע'` : `${hours}h ago`;
    };

    // Handle currency selection
    const handleCurrencySelect = (currency) => {
        if (onCurrencyChange) {
            onCurrencyChange(currency);
        }
    };

    // Compact view for smaller spaces
    if (compact) {
        return React.createElement('div', {
            className: 'currency-selector-compact'
        }, [
            React.createElement('select', {
                key: 'select',
                value: selectedCurrency,
                onChange: (e) => handleCurrencySelect(e.target.value),
                className: 'currency-select-compact'
            }, Object.entries(currencies).map(([code, currency]) =>
                React.createElement('option', {
                    key: code,
                    value: code
                }, `${currency.flag} ${code}`)
            )),
            
            amount > 0 && React.createElement('div', {
                key: 'amount',
                className: 'converted-amount-compact'
            }, formatAmount(convertAmount(amount, selectedCurrency), selectedCurrency))
        ]);
    }

    // Full currency selector interface
    return React.createElement('div', {
        className: 'currency-selector-container'
    }, [
        // Header
        React.createElement('div', {
            key: 'header',
            className: 'currency-selector-header'
        }, [
            React.createElement('h3', {
                key: 'title',
                className: 'currency-selector-title'
            }, [
                React.createElement('span', { key: 'icon' }, '💱'),
                ' ',
                language === 'he' ? 'בחירת מטבע' : 'Currency Selection'
            ]),
            
            isLoading && React.createElement('div', {
                key: 'loading',
                className: 'currency-loading'
            }, '🔄'),
            
            !isLoading && lastUpdated && React.createElement('div', {
                key: 'updated',
                className: 'currency-last-updated'
            }, getTimeSinceUpdate())
        ]),

        // Error display
        error && React.createElement('div', {
            key: 'error',
            className: 'currency-error'
        }, [
            React.createElement('span', { key: 'icon' }, '⚠️'),
            ' ',
            language === 'he' ? 'שגיאה בטעינת שערי החליפין' : 'Error loading exchange rates'
        ]),

        // Currency grid
        React.createElement('div', {
            key: 'grid',
            className: 'currency-grid'
        }, Object.entries(currencies).map(([code, currency]) => {
            const isSelected = selectedCurrency === code;
            const convertedAmount = amount > 0 ? convertAmount(amount, code) : 0;
            
            return React.createElement('div', {
                key: code,
                onClick: () => handleCurrencySelect(code),
                className: `currency-option ${isSelected ? 'selected' : ''} ${currency.isCrypto ? 'crypto' : ''}`
            }, [
                React.createElement('div', {
                    key: 'flag',
                    className: 'currency-flag'
                }, currency.flag),
                
                React.createElement('div', {
                    key: 'info',
                    className: 'currency-info'
                }, [
                    React.createElement('div', {
                        key: 'code',
                        className: 'currency-code'
                    }, code),
                    React.createElement('div', {
                        key: 'name',
                        className: 'currency-name'
                    }, currency.name[language] || currency.name.en)
                ]),
                
                showRates && React.createElement('div', {
                    key: 'rate',
                    className: 'currency-rate'
                }, [
                    React.createElement('div', {
                        key: 'rate-value',
                        className: 'rate-value'
                    }, getRateDisplay(code)),
                    React.createElement('div', {
                        key: 'rate-label',
                        className: 'rate-label'
                    }, language === 'he' ? 'לשקל' : 'to ILS')
                ]),
                
                amount > 0 && React.createElement('div', {
                    key: 'converted',
                    className: 'currency-converted'
                }, [
                    React.createElement('div', {
                        key: 'amount',
                        className: 'converted-amount'
                    }, formatAmount(convertedAmount, code)),
                    React.createElement('div', {
                        key: 'label',
                        className: 'converted-label'
                    }, language === 'he' ? 'שווה ערך' : 'equivalent')
                ])
            ]);
        })),
        
        // Currency explanation info panel
        React.createElement('div', {
            key: 'explanation',
            className: 'currency-explanation'
        }, [
            React.createElement('div', {
                key: 'info-panel',
                className: 'bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4'
            }, [
                React.createElement('div', {
                    key: 'info-header',
                    className: 'flex items-center mb-2'
                }, [
                    React.createElement('span', { key: 'icon', className: 'text-blue-600 mr-2' }, '💱'),
                    React.createElement('h4', {
                        key: 'title',
                        className: 'text-sm font-semibold text-blue-800'
                    }, language === 'he' ? 'מידע על המרת מטבע' : 'Currency Conversion Info')
                ]),
                React.createElement('div', {
                    key: 'info-content',
                    className: 'text-xs text-blue-700 space-y-1'
                }, [
                    React.createElement('p', { key: 'line1' }, language === 'he' ? 
                        'כל הערכים מוצגים במטבע שנבחר לאחר המרה משקלים.' :
                        'All values are displayed in the selected currency after conversion from Israeli Shekels.'),
                    React.createElement('p', { key: 'line2' }, language === 'he' ? 
                        'שערי החליפין מתעדכנים בזמן אמת כל 5 דקות.' :
                        'Exchange rates are updated in real-time every 5 minutes.'),
                    React.createElement('p', { key: 'line3' }, language === 'he' ? 
                        'החישובים מבוצעים בשקלים ולאחר מכן מומרים למטבע הנבחר.' :
                        'Calculations are performed in Israeli Shekels and then converted to the selected currency.')
                ])
            ])
        ]),

        // Refresh button
        React.createElement('div', {
            key: 'actions',
            className: 'currency-actions'
        }, [
            React.createElement('button', {
                key: 'refresh',
                onClick: loadRates,
                disabled: isLoading,
                className: 'btn-professional btn-outline text-sm'
            }, [
                React.createElement('span', { key: 'icon' }, isLoading ? '🔄' : '🔃'),
                ' ',
                language === 'he' ? 'רענן שערים' : 'Refresh Rates'
            ])
        ])
    ]);
};

// Export to window for global access
window.CurrencySelector = CurrencySelector;