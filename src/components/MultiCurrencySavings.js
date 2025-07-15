// Multi-Currency Savings Display Component
// Shows savings values in multiple currencies with real-time conversion
// Created by Yali Pollak (יהלי פולק) - v5.3.2

function MultiCurrencySavings(props) {
    const amount = props.amount;
    const title = props.title || 'Savings';
    const language = props.language || 'en';
    const showLoading = props.showLoading !== false;
    const compact = props.compact || false;
    const currencies = props.currencies || ['USD', 'EUR', 'GBP', 'BTC'];
    const [rates, setRates] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [lastUpdated, setLastUpdated] = React.useState(null);

    // Content translations
    const content = {
        he: {
            title: 'חיסכון במטבעות שונים',
            lastUpdated: 'עודכן',
            loading: 'טוען שערי חליפין...',
            error: 'שגיאה בטעינת שערי חליפין',
            refresh: 'רענן',
            baseCurrency: 'מטבע בסיס',
            convertedValue: 'ערך מומר',
            ago: 'לפני',
            minutes: 'דקות',
            seconds: 'שניות'
        },
        en: {
            title: 'Multi-Currency Savings',
            lastUpdated: 'Updated',
            loading: 'Loading exchange rates...',
            error: 'Error loading exchange rates',
            refresh: 'Refresh',
            baseCurrency: 'Base Currency',
            convertedValue: 'Converted Value',
            ago: 'ago',
            minutes: 'minutes',
            seconds: 'seconds'
        }
    };

    const t = content[language] || content.en;

    // Currency metadata
    const currencyInfo = {
        ILS: { name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
        USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
        EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
        GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
        BTC: { name: 'Bitcoin', symbol: '₿', flag: '₿' }
    };

    // Load exchange rates
    React.useEffect(() => {
        const loadRates = async () => {
            if (!window.currencyAPI) {
                setError('Currency API not available');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                
                const fetchedRates = await window.currencyAPI.fetchExchangeRates();
                setRates(fetchedRates);
                setLastUpdated(new Date());
                
                console.log('MultiCurrencySavings: Rates loaded successfully');
            } catch (err) {
                console.error('MultiCurrencySavings: Error loading rates:', err);
                setError(err.message);
                
                // Use fallback rates
                setRates({
                    USD: 3.70,
                    EUR: 4.02,
                    GBP: 4.65,
                    BTC: 0.0000025
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadRates();
        
        // Auto-refresh every 5 minutes
        const interval = setInterval(loadRates, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Convert amount to target currency
    const convertAmount = (targetCurrency) => {
        const rate = rates[targetCurrency];
        if (!rate) return 0;
        
        return amount / rate;
    };

    // Format currency amount
    const formatCurrency = (amount, currency) => {
        const info = currencyInfo[currency];
        if (!info) return `${amount.toFixed(2)} ${currency}`;

        if (currency === 'BTC') {
            return `${info.symbol}${amount.toFixed(6)}`;
        }

        const formatter = new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        return `${info.symbol}${formatter.format(Math.round(amount))}`;
    };

    // Get time since last update
    const getTimeSinceUpdate = () => {
        if (!lastUpdated) return '';
        
        const now = new Date();
        const diffMs = now - lastUpdated;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        
        if (diffMinutes < 1) {
            return `${diffSeconds} ${t.seconds} ${t.ago}`;
        }
        return `${diffMinutes} ${t.minutes} ${t.ago}`;
    };

    // Handle refresh
    const handleRefresh = async () => {
        if (window.currencyAPI) {
            setIsLoading(true);
            try {
                const freshRates = await window.currencyAPI.forceRefresh();
                setRates(freshRates);
                setLastUpdated(new Date());
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (compact) {
        return React.createElement('div', {
            className: 'multi-currency-compact'
        }, [
            React.createElement('div', {
                key: 'primary',
                className: 'text-lg font-bold text-gray-800'
            }, formatCurrency(amount, 'ILS')),
            React.createElement('div', {
                key: 'conversions',
                className: 'text-sm text-gray-500 space-x-2'
            }, currencies.map(currency => 
                React.createElement('span', {
                    key: currency,
                    className: 'inline-block'
                }, [
                    currencyInfo[currency]?.flag || '',
                    ' ',
                    formatCurrency(convertAmount(currency), currency)
                ])
            ))
        ]);
    }

    return React.createElement('div', {
        className: 'multi-currency-savings p-4 bg-white rounded-lg shadow-sm border border-gray-200'
    }, [
        // Header
        React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-4'
        }, [
            React.createElement('h3', {
                key: 'title',
                className: 'text-lg font-semibold text-gray-800'
            }, [
                React.createElement('span', { key: 'icon' }, '💰'),
                ' ',
                title
            ]),
            React.createElement('button', {
                key: 'refresh',
                onClick: handleRefresh,
                disabled: isLoading,
                className: 'text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50'
            }, isLoading ? '🔄' : t.refresh)
        ]),

        // Base currency (ILS)
        React.createElement('div', {
            key: 'base-currency',
            className: 'mb-4 p-3 bg-blue-50 rounded-lg'
        }, [
            React.createElement('div', {
                key: 'base-label',
                className: 'text-sm font-medium text-blue-700 mb-1'
            }, [
                currencyInfo.ILS.flag,
                ' ',
                t.baseCurrency,
                ' (ILS)'
            ]),
            React.createElement('div', {
                key: 'base-amount',
                className: 'text-2xl font-bold text-blue-800'
            }, formatCurrency(amount, 'ILS'))
        ]),

        // Loading state
        isLoading && showLoading ? React.createElement('div', {
            key: 'loading',
            className: 'text-center py-4'
        }, [
            React.createElement('div', {
                key: 'spinner',
                className: 'animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2'
            }),
            React.createElement('p', {
                key: 'loading-text',
                className: 'text-sm text-gray-600'
            }, t.loading)
        ]) : null,

        // Error state
        error ? React.createElement('div', {
            key: 'error',
            className: 'text-center py-4 text-red-600'
        }, [
            React.createElement('p', {
                key: 'error-text',
                className: 'text-sm'
            }, `${t.error}: ${error}`)
        ]) : null,

        // Currency conversions
        !isLoading && !error ? React.createElement('div', {
            key: 'conversions',
            className: 'space-y-3'
        }, currencies.map(currency => {
            const convertedAmount = convertAmount(currency);
            const info = currencyInfo[currency];
            
            return React.createElement('div', {
                key: currency,
                className: 'flex items-center justify-between p-3 bg-gray-50 rounded-lg'
            }, [
                React.createElement('div', {
                    key: 'currency-info',
                    className: 'flex items-center space-x-2'
                }, [
                    React.createElement('span', {
                        key: 'flag',
                        className: 'text-lg'
                    }, info?.flag || ''),
                    React.createElement('div', { key: 'details' }, [
                        React.createElement('div', {
                            key: 'name',
                            className: 'font-medium text-gray-800'
                        }, currency),
                        React.createElement('div', {
                            key: 'full-name',
                            className: 'text-xs text-gray-500'
                        }, info?.name || currency)
                    ])
                ]),
                React.createElement('div', {
                    key: 'amount',
                    className: 'text-right'
                }, [
                    React.createElement('div', {
                        key: 'converted-amount',
                        className: 'font-bold text-gray-800'
                    }, formatCurrency(convertedAmount, currency)),
                    React.createElement('div', {
                        key: 'rate',
                        className: 'text-xs text-gray-500'
                    }, `Rate: ${rates[currency]?.toFixed(4)} ILS`)
                ])
            ]);
        })) : null,

        // Last updated
        lastUpdated && !isLoading ? React.createElement('div', {
            key: 'last-updated',
            className: 'mt-4 pt-3 border-t border-gray-200 text-center'
        }, [
            React.createElement('p', {
                key: 'update-text',
                className: 'text-xs text-gray-500'
            }, `${t.lastUpdated}: ${getTimeSinceUpdate()}`)
        ]) : null
    ]);
}

// Export to window for global access
window.MultiCurrencySavings = MultiCurrencySavings;

console.log('MultiCurrencySavings component loaded successfully');