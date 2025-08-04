const EnhancedRSUCompanySelector = ({ inputs, setInputs, language, workingCurrency = 'USD' }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [stockPrice, setStockPrice] = React.useState(null);
    const [stockPriceUSD, setStockPriceUSD] = React.useState(null);
    const [priceLoading, setPriceLoading] = React.useState(false);
    const [manualPriceMode, setManualPriceMode] = React.useState(false);
    const [manualPrice, setManualPrice] = React.useState('');
    const [priceSource, setPriceSource] = React.useState('');
    const [lastUpdated, setLastUpdated] = React.useState(null);
    const [currencyRate, setCurrencyRate] = React.useState(null);
    const [isCustomMode, setIsCustomMode] = React.useState(false);
    const [customTicker, setCustomTicker] = React.useState('');
    const [customCompanyName, setCustomCompanyName] = React.useState('');
    const [tickerValidation, setTickerValidation] = React.useState('');
    const [selectedSector, setSelectedSector] = React.useState('all');
    
    // Load comprehensive stock list (1000+ companies)
    const companies = React.useMemo(() => {
        // Use the comprehensive list if available, otherwise fallback to original list
        if (window.stockCompanies && window.stockCompanies.length > 0) {
            // Map to match the existing format
            return window.stockCompanies.map(company => ({
                symbol: company.symbol,
                name: company.name,
                category: company.sector,
                exchange: company.exchange
            }));
        }
        
        // Fallback to original list if stockCompanies.js is not loaded
        return [
            { symbol: 'AAPL', name: 'Apple Inc.', category: 'Technology' },
            { symbol: 'GOOGL', name: 'Alphabet (Google)', category: 'Technology' },
            { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'Technology' },
            { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'Technology' },
            { symbol: 'META', name: 'Meta Platforms (Facebook)', category: 'Technology' },
            { symbol: 'TSLA', name: 'Tesla Inc.', category: 'Technology' },
            { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'Technology' },
            // Keep a minimal list as fallback
        ];
    }, []);
    
    // Get all unique sectors for filtering
    const sectors = React.useMemo(() => {
        if (window.getAllSectors) {
            return ['all', ...window.getAllSectors()];
        }
        const uniqueSectors = [...new Set(companies.map(c => c.category))];
        return ['all', ...uniqueSectors.sort()];
    }, [companies]);
    
    // Currency symbol helper
    const getCurrencySymbol = (currency) => {
        const symbols = {
            'ILS': '₪',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'BTC': '₿',
            'ETH': 'Ξ'
        };
        return symbols[currency] || '$';
    };
    
    const currencySymbol = getCurrencySymbol(workingCurrency);
    
    // Initialize currency API
    React.useEffect(() => {
        if (workingCurrency !== 'USD' && window.CurrencyAPI) {
            const api = new window.CurrencyAPI();
            api.getExchangeRates().then(rates => {
                if (rates && rates[workingCurrency]) {
                    setCurrencyRate(rates[workingCurrency]);
                    console.log(`💱 Currency rate loaded: 1 USD = ${rates[workingCurrency]} ${workingCurrency}`);
                }
            }).catch(error => {
                console.warn('Failed to load currency rates:', error);
            });
        }
    }, [workingCurrency]);
    
    // Filter companies based on search query and sector
    const filteredCompanies = React.useMemo(() => {
        let filtered = companies;
        
        // Filter by sector if not 'all'
        if (selectedSector !== 'all') {
            filtered = filtered.filter(company => 
                company.category === selectedSector
            );
        }
        
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(company =>
                company.name.toLowerCase().includes(query) ||
                company.symbol.toLowerCase().includes(query) ||
                company.category.toLowerCase().includes(query)
            );
        }
        
        // Limit to 50 results for performance
        return filtered.slice(0, 50);
    }, [companies, searchQuery, selectedSector]);
    
    const handleCompanySelect = async (symbol) => {
        // Handle custom mode
        if (symbol === 'OTHER') {
            setIsCustomMode(true);
            setInputs({...inputs, rsuCompany: 'OTHER'});
            setIsDropdownOpen(false);
            setSearchQuery('');
            setManualPriceMode(false);
            return;
        }
        
        // Regular company selection
        setIsCustomMode(false);
        setCustomTicker('');
        setCustomCompanyName('');
        setInputs({...inputs, rsuCompany: symbol});
        setIsDropdownOpen(false);
        setSearchQuery('');
        
        if (symbol && symbol !== '') {
            // Fetch currency rate directly if needed for non-USD currencies
            let effectiveRate = currencyRate;
            if (workingCurrency !== 'USD' && (currencyRate === null || currencyRate <= 0)) {
                console.log('💱 Fetching currency rate for RSU conversion...');
                try {
                    const api = new window.CurrencyAPI();
                    const rates = await api.getExchangeRates();
                    if (rates && rates[workingCurrency]) {
                        effectiveRate = rates[workingCurrency];
                        setCurrencyRate(effectiveRate);
                        console.log(`✅ Currency rate fetched: 1 USD = ${effectiveRate} ${workingCurrency}`);
                    } else {
                        // Use fallback rate if API fails
                        effectiveRate = workingCurrency === 'ILS' ? 3.70 : 1;
                        console.warn(`⚠️ Using fallback rate: 1 USD = ${effectiveRate} ${workingCurrency}`);
                    }
                } catch (error) {
                    console.error('Failed to fetch currency rate:', error);
                    // Use fallback rate
                    effectiveRate = workingCurrency === 'ILS' ? 3.70 : 1;
                }
            }
            await fetchStockPriceForSymbol(symbol, effectiveRate);
        } else {
            // Reset price data for empty selection
            setStockPrice(null);
            setPriceSource('');
            setLastUpdated(null);
            setManualPriceMode(false);
        }
    };
    
    // Function to fetch stock price using the API
    const fetchStockPriceForSymbol = async (symbol, providedRate = null) => {
        if (!symbol || !window.fetchStockPrice) {
            console.warn('⚠️ fetchStockPrice function not available');
            setManualPriceMode(true);
            return;
        }
        
        setPriceLoading(true);
        setManualPriceMode(false);
        
        try {
            const priceUSD = await window.fetchStockPrice(symbol);
            if (priceUSD && priceUSD > 0) {
                setStockPriceUSD(priceUSD);
                
                // Convert to working currency with validation
                let convertedPrice = priceUSD;
                if (workingCurrency !== 'USD') {
                    // Use provided rate or state rate
                    const effectiveRate = providedRate || currencyRate;
                    if (!effectiveRate || effectiveRate <= 0 || !isFinite(effectiveRate)) {
                        console.warn(`⚠️ Invalid currency rate for ${workingCurrency}: ${effectiveRate}`);
                        throw new Error('Currency rate not available');
                    }
                    convertedPrice = Math.round(priceUSD * effectiveRate * 100) / 100; // Avoid floating point issues
                    console.log(`💱 Converting ${symbol}: $${priceUSD} USD → ${currencySymbol}${convertedPrice.toFixed(2)} ${workingCurrency} (rate: ${effectiveRate})`);
                }
                
                setStockPrice(convertedPrice);
                setLastUpdated(new Date().toLocaleTimeString());
                
                // Check cache info for source
                if (window.getStockPriceCacheInfo) {
                    const cacheInfo = window.getStockPriceCacheInfo();
                    const symbolData = cacheInfo.data.find(item => item.symbol === symbol);
                    if (symbolData) {
                        setPriceSource(symbolData.source);
                    }
                }
                
                // Update inputs with converted price
                setInputs(prev => ({
                    ...prev,
                    rsuCurrentStockPrice: convertedPrice
                }));
                
                console.log(`✅ Stock price fetched for ${symbol}: ${currencySymbol}${convertedPrice.toFixed(2)} ${workingCurrency}`);
            } else {
                throw new Error('Price not available');
            }
        } catch (error) {
            console.warn(`⚠️ Failed to fetch price for ${symbol}:`, error.message);
            // Fall back to manual input mode
            setManualPriceMode(true);
            setStockPrice(null);
            setPriceSource('manual');
        } finally {
            setPriceLoading(false);
        }
    };
    
    // Handle manual price input
    const handleManualPriceSubmit = () => {
        const price = parseFloat(manualPrice);
        if (price && price > 0) {
            setStockPrice(price);
            // For manual input, assume price is already in working currency
            if (workingCurrency === 'USD') {
                setStockPriceUSD(price);
            } else if (currencyRate && currencyRate > 0 && isFinite(currencyRate)) {
                setStockPriceUSD(Math.round((price / currencyRate) * 100) / 100);
            } else {
                // If no valid rate, we can't convert to USD
                setStockPriceUSD(null);
                console.warn('⚠️ Cannot convert manual price to USD - invalid currency rate');
            }
            setLastUpdated(new Date().toLocaleTimeString());
            setPriceSource('manual');
            
            // Update inputs with manual price
            setInputs(prev => ({
                ...prev,
                rsuCurrentStockPrice: price
            }));
            
            console.log(`✅ Manual price set for ${inputs.rsuCompany}: ${currencySymbol}${price}`);
        }
    };
    
    // Refresh stock price
    const refreshStockPrice = () => {
        if (inputs.rsuCompany && inputs.rsuCompany !== 'OTHER') {
            fetchStockPriceForSymbol(inputs.rsuCompany, currencyRate);
        }
    };
    
    // Handle custom ticker validation
    const validateCustomTicker = async () => {
        if (!customTicker) {
            setTickerValidation('');
            return;
        }
        
        const ticker = customTicker.toUpperCase();
        
        // Basic format validation
        if (!window.isValidTicker || !window.isValidTicker(ticker)) {
            setTickerValidation('invalid');
            return;
        }
        
        // Try to fetch price to validate ticker exists
        setTickerValidation('validating');
        try {
            if (window.fetchStockPrice) {
                const price = await window.fetchStockPrice(ticker);
                if (price && price > 0) {
                    setTickerValidation('valid');
                    // Update inputs with custom ticker
                    setInputs(prev => ({...prev, 
                        rsuCompany: ticker,
                        rsuCompanyName: customCompanyName || ticker
                    }));
                    // Fetch the price
                    await fetchStockPriceForSymbol(ticker, currencyRate);
                } else {
                    setTickerValidation('not_found');
                }
            }
        } catch (error) {
            setTickerValidation('not_found');
        }
    };
    
    const selectedCompany = isCustomMode && customTicker ? 
        { symbol: customTicker.toUpperCase(), name: customCompanyName || customTicker.toUpperCase(), category: 'Custom' } :
        companies.find(c => c.symbol === inputs.rsuCompany);
    
    return React.createElement('div', { key: 'enhanced-rsu-company' }, [
        React.createElement('label', {
            key: 'enhanced-rsu-label',
            className: "block text-sm font-medium text-gray-700 mb-2"
        }, [
            React.createElement('span', { key: 'label-text' }, 
                language === 'he' ? `חברה (${companies.length}+ חברות)` : `Company (${companies.length}+ Stocks)`),
            React.createElement('span', { 
                key: 'label-badge',
                className: "ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold"
            }, language === 'he' ? 'חיפוש חכם' : 'Smart Search')
        ]),
        
        // Sector Filter (only show if we have many companies)
        companies.length > 100 && React.createElement('div', {
            key: 'sector-filter',
            className: "mb-2"
        }, [
            React.createElement('select', {
                key: 'sector-select',
                value: selectedSector,
                onChange: (e) => setSelectedSector(e.target.value),
                className: "w-full p-2 border border-gray-300 rounded-lg text-sm"
            }, sectors.map(sector => 
                React.createElement('option', { 
                    key: sector, 
                    value: sector 
                }, sector === 'all' ? 
                    (language === 'he' ? 'כל הסקטורים' : 'All Sectors') : 
                    sector
                )
            ))
        ]),
        
        // Search Input with Dropdown
        React.createElement('div', {
            key: 'search-container',
            className: "relative"
        }, [
            React.createElement('div', {
                key: 'input-wrapper',
                className: "relative"
            }, [
                React.createElement('input', {
                    key: 'search-input',
                    type: 'text',
                    value: selectedCompany ? `${selectedCompany.name} (${selectedCompany.symbol})` : searchQuery,
                    onChange: (e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                        if (selectedCompany) {
                            setInputs({...inputs, rsuCompany: ''});
                        }
                    },
                    onFocus: () => setIsDropdownOpen(true),
                    placeholder: language === 'he' ? 'חפש חברה או סמל מניה...' : 'Search company or stock symbol...',
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm pr-10"
                }),
                React.createElement('div', {
                    key: 'search-icon',
                    className: "absolute right-3 top-1/2 transform -translate-y-1/2"
                }, isLoading ? 
                    React.createElement('div', { 
                        className: "animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full" 
                    }) :
                    React.createElement('span', { className: "text-gray-400 text-sm" }, '🔍')
                )
            ]),
            
            // Dropdown List (show even if no results to display the custom option)
            isDropdownOpen ? React.createElement('div', {
                key: 'dropdown',
                className: "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
            }, [
                filteredCompanies.length > 0 ? React.createElement('div', {
                    key: 'dropdown-header',
                    className: "px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600"
                }, `${filteredCompanies.length} ${language === 'he' ? 'תוצאות' : 'companies found'}`) : 
                React.createElement('div', {
                    key: 'no-results',
                    className: "px-3 py-4 text-center text-gray-500 text-sm"
                }, language === 'he' ? 'לא נמצאו תוצאות - בחר באפשרות למטה' : 'No results found - choose option below'),
                
                ...filteredCompanies.map((company, index) => 
                    React.createElement('div', {
                        key: `company-${company.symbol}`,
                        onClick: () => handleCompanySelect(company.symbol),
                        className: "px-3 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    }, [
                        React.createElement('div', {
                            key: 'company-main',
                            className: "flex items-center justify-between"
                        }, [
                            React.createElement('div', { key: 'company-info' }, [
                                React.createElement('div', {
                                    key: 'company-name',
                                    className: "font-semibold text-gray-800 text-sm truncate"
                                }, company.name),
                                React.createElement('div', {
                                    key: 'company-symbol',
                                    className: "text-xs text-gray-500 truncate"
                                }, `${company.symbol} • ${company.category}`)
                            ]),
                            React.createElement('div', {
                                key: 'select-arrow',
                                className: "text-indigo-500 font-bold"
                            }, '→')
                        ])
                    ])
                ),
                
                // Custom option - Make it more prominent
                React.createElement('div', {
                    key: 'custom-option',
                    onClick: () => handleCompanySelect('OTHER'),
                    className: "px-3 py-3 hover:bg-yellow-50 cursor-pointer border-t-2 border-yellow-200 bg-yellow-50"
                }, [
                    React.createElement('div', {
                        key: 'custom-content',
                        className: "flex items-center justify-between"
                    }, [
                        React.createElement('div', { key: 'custom-info' }, [
                            React.createElement('div', {
                                key: 'custom-name',
                                className: "font-semibold text-yellow-800 text-sm"
                            }, language === 'he' ? '🏢 לא מצאת את החברה שלך?' : "🏢 Can't find your company?"),
                            React.createElement('div', {
                                key: 'custom-desc',
                                className: "text-xs text-yellow-600"
                            }, language === 'he' ? 'לחץ כאן להזנת מחיר מניה ידנית' : 'Click here to enter stock price manually')
                        ]),
                        React.createElement('div', {
                            key: 'custom-arrow',
                            className: "text-yellow-600 font-bold"
                        }, '→')
                    ])
                ])
            ]) : null
        ]),
        
        // Click outside to close dropdown
        isDropdownOpen ? React.createElement('div', {
            key: 'backdrop',
            className: "fixed inset-0 z-40",
            onClick: () => setIsDropdownOpen(false)
        }) : null,
        
        // Custom ticker entry mode
        isCustomMode ? React.createElement('div', {
            key: 'custom-entry',
            className: "mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
        }, [
            React.createElement('h4', {
                key: 'custom-title',
                className: "font-semibold text-yellow-800 mb-3"
            }, language === 'he' ? 'הזן פרטי מניה מותאמת אישית' : 'Enter Custom Stock Details'),
            
            React.createElement('div', {
                key: 'custom-fields',
                className: "space-y-3"
            }, [
                // Custom ticker input
                React.createElement('div', { key: 'ticker-field' }, [
                    React.createElement('label', {
                        key: 'ticker-label',
                        className: "block text-sm font-medium text-gray-700 mb-1"
                    }, language === 'he' ? 'סמל מניה (Ticker)' : 'Stock Ticker Symbol'),
                    React.createElement('div', {
                        key: 'ticker-input-wrapper',
                        className: "flex gap-2"
                    }, [
                        React.createElement('input', {
                            key: 'ticker-input',
                            type: 'text',
                            value: customTicker,
                            onChange: (e) => {
                                const value = e.target.value.toUpperCase();
                                setCustomTicker(value);
                                setTickerValidation('');
                            },
                            placeholder: language === 'he' ? 'לדוגמה: AAPL' : 'e.g., AAPL',
                            className: `flex-1 p-2 border rounded-lg ${
                                tickerValidation === 'valid' ? 'border-green-500' :
                                tickerValidation === 'invalid' || tickerValidation === 'not_found' ? 'border-red-500' :
                                'border-gray-300'
                            }`
                        }),
                        React.createElement('button', {
                            key: 'validate-btn',
                            onClick: validateCustomTicker,
                            disabled: !customTicker || tickerValidation === 'validating',
                            className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                        }, tickerValidation === 'validating' ? '...' : 
                           language === 'he' ? 'אמת' : 'Validate')
                    ]),
                    tickerValidation && React.createElement('div', {
                        key: 'validation-msg',
                        className: `text-xs mt-1 ${
                            tickerValidation === 'valid' ? 'text-green-600' :
                            tickerValidation === 'not_found' ? 'text-red-600' :
                            tickerValidation === 'invalid' ? 'text-red-600' :
                            'text-gray-600'
                        }`
                    }, tickerValidation === 'valid' ? '✓ Valid ticker - price fetched' :
                       tickerValidation === 'not_found' ? '✗ Ticker not found - enter price manually' :
                       tickerValidation === 'invalid' ? '✗ Invalid format (use 1-5 letters)' :
                       tickerValidation === 'validating' ? 'Validating...' : '')
                ]),
                
                // Custom company name input
                React.createElement('div', { key: 'name-field' }, [
                    React.createElement('label', {
                        key: 'name-label',
                        className: "block text-sm font-medium text-gray-700 mb-1"
                    }, language === 'he' ? 'שם החברה (אופציונלי)' : 'Company Name (Optional)'),
                    React.createElement('input', {
                        key: 'name-input',
                        type: 'text',
                        value: customCompanyName,
                        onChange: (e) => setCustomCompanyName(e.target.value),
                        placeholder: language === 'he' ? 'לדוגמה: Apple Inc.' : 'e.g., Apple Inc.',
                        className: "w-full p-2 border border-gray-300 rounded-lg"
                    })
                ]),
                
                // Manual stock price input
                React.createElement('div', { key: 'price-field' }, [
                    React.createElement('label', {
                        key: 'price-label',
                        className: "block text-sm font-medium text-gray-700 mb-1"
                    }, language === 'he' ? `מחיר מניה (${currencySymbol})` : `Stock Price (${currencySymbol})`),
                    React.createElement('input', {
                        key: 'price-input',
                        type: 'number',
                        value: manualPrice,
                        onChange: (e) => setManualPrice(e.target.value),
                        placeholder: language === 'he' ? 'הזן מחיר מניה' : 'Enter stock price',
                        step: '0.01',
                        min: '0',
                        className: "w-full p-2 border border-gray-300 rounded-lg"
                    })
                ]),
                
                // RSU units input
                React.createElement('div', { key: 'units-field' }, [
                    React.createElement('label', {
                        key: 'units-label',
                        className: "block text-sm font-medium text-gray-700 mb-1"
                    }, language === 'he' ? 'מספר יחידות RSU' : 'Number of RSU Units'),
                    React.createElement('input', {
                        key: 'units-input',
                        type: 'number',
                        value: inputs.rsuUnits || 0,
                        onChange: (e) => setInputs({...inputs, rsuUnits: parseInt(e.target.value) || 0}),
                        placeholder: language === 'he' ? 'כמה יחידות RSU' : 'How many RSU units',
                        min: '0',
                        className: "w-full p-2 border border-gray-300 rounded-lg"
                    })
                ]),
                
                // Actions
                React.createElement('div', {
                    key: 'custom-actions',
                    className: "flex gap-2 pt-2"
                }, [
                    React.createElement('button', {
                        key: 'use-custom',
                        onClick: () => {
                            if (customTicker) {
                                const ticker = customTicker.toUpperCase();
                                const price = parseFloat(manualPrice) || 0;
                                setInputs(prev => ({...prev, 
                                    rsuCompany: ticker,
                                    rsuCompanyName: customCompanyName || ticker,
                                    rsuCurrentStockPrice: price
                                }));
                                if (price > 0) {
                                    setStockPrice(price);
                                    setLastUpdated(new Date().toLocaleTimeString());
                                    setPriceSource('manual');
                                }
                                setIsCustomMode(false);
                                if (tickerValidation !== 'valid' && price === 0) {
                                    setManualPriceMode(true);
                                }
                            }
                        },
                        disabled: !customTicker,
                        className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                    }, language === 'he' ? 'השתמש במניה זו' : 'Use This Stock'),
                    React.createElement('button', {
                        key: 'cancel-custom',
                        onClick: () => {
                            setIsCustomMode(false);
                            setCustomTicker('');
                            setCustomCompanyName('');
                            setTickerValidation('');
                            setManualPrice('');
                            setInputs(prev => ({...prev, rsuCompany: ''}));
                        },
                        className: "px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
                    }, language === 'he' ? 'ביטול' : 'Cancel')
                ])
            ])
        ]) : 
        
        // Selected company display with stock price
        selectedCompany ? React.createElement('div', {
            key: 'selected-display',
            className: "mt-2 p-4 bg-indigo-50 border border-indigo-200 rounded-lg"
        }, [
            React.createElement('div', {
                key: 'selected-info',
                className: "flex items-center justify-between mb-3"
            }, [
                React.createElement('div', { key: 'selected-details' }, [
                    React.createElement('div', {
                        key: 'selected-name',
                        className: "font-semibold text-indigo-800 text-sm"
                    }, `✅ ${selectedCompany.name}`),
                    React.createElement('div', {
                        key: 'selected-meta',
                        className: "text-xs text-indigo-600"
                    }, `${selectedCompany.symbol} • ${selectedCompany.category}`)
                ]),
                React.createElement('button', {
                    key: 'clear-selection',
                    onClick: () => {
                        setInputs({...inputs, rsuCompany: '', rsuCurrentStockPrice: 0});
                        setSearchQuery('');
                        setStockPrice(null);
                        setPriceSource('');
                        setLastUpdated(null);
                        setManualPriceMode(false);
                    },
                    className: "text-indigo-600 hover:text-indigo-800 text-xs font-semibold px-2 py-1 hover:bg-indigo-100 rounded"
                }, language === 'he' ? 'נקה' : 'Clear')
            ]),
            
            // Stock Price Section
            React.createElement('div', {
                key: 'stock-price-section',
                className: "bg-white rounded-lg p-3 border border-indigo-100"
            }, [
                React.createElement('div', {
                    key: 'price-header',
                    className: "flex items-center justify-between mb-2"
                }, [
                    React.createElement('span', {
                        key: 'price-label',
                        className: "text-sm font-medium text-gray-700"
                    }, language === 'he' ? 'מחיר המניה הנוכחי' : 'Current Stock Price'),
                    React.createElement('div', {
                        key: 'price-actions',
                        className: "flex gap-2"
                    }, [
                        !manualPriceMode && React.createElement('button', {
                            key: 'refresh-price',
                            onClick: refreshStockPrice,
                            disabled: priceLoading,
                            className: "text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                        }, priceLoading ? '🔄' : '↻'),
                        React.createElement('button', {
                            key: 'toggle-manual',
                            onClick: () => setManualPriceMode(!manualPriceMode),
                            className: "text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        }, manualPriceMode ? (language === 'he' ? 'API' : 'API') : (language === 'he' ? 'ידני' : 'Manual'))
                    ])
                ]),
                
                // Price Display or Manual Input
                priceLoading ? React.createElement('div', {
                    key: 'price-loading',
                    className: "flex items-center gap-2 text-sm text-gray-600"
                }, [
                    React.createElement('div', {
                        key: 'loading-spinner',
                        className: "animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
                    }),
                    language === 'he' ? 'טוען מחיר...' : 'Loading price...'
                ]) : manualPriceMode ? React.createElement('div', {
                    key: 'manual-price-input',
                    className: "flex gap-2"
                }, [
                    React.createElement('div', {
                        key: 'manual-price-wrapper',
                        className: "flex-1 relative"
                    }, [
                        React.createElement('span', {
                            key: 'currency-prefix',
                            className: "absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
                        }, currencySymbol),
                        React.createElement('input', {
                            key: 'manual-price-field',
                            type: 'number',
                            value: manualPrice,
                            onChange: (e) => setManualPrice(e.target.value),
                            placeholder: language === 'he' ? 'הזן מחיר...' : 'Enter price...',
                            className: "w-full pl-8 pr-2 py-1 border border-gray-300 rounded text-sm"
                        })
                    ]),
                    React.createElement('button', {
                        key: 'submit-manual-price',
                        onClick: handleManualPriceSubmit,
                        disabled: !manualPrice || parseFloat(manualPrice) <= 0,
                        className: "px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                    }, language === 'he' ? 'שמור' : 'Set')
                ]) : stockPrice && stockPriceUSD ? React.createElement('div', {
                    key: 'price-display',
                    className: "space-y-1"
                }, [
                    React.createElement('div', {
                        key: 'price-value',
                        className: "text-lg font-bold text-green-600"
                    }, `$${stockPriceUSD.toFixed(2)} USD`),
                    workingCurrency !== 'USD' && React.createElement('div', {
                        key: 'price-converted',
                        className: "text-xs text-gray-500"
                    }, `(${currencySymbol}${stockPrice.toFixed(2)} ${workingCurrency})`),
                    React.createElement('div', {
                        key: 'price-meta',
                        className: "text-xs text-gray-500 flex items-center gap-2"
                    }, [
                        React.createElement('span', { key: 'source' }, 
                            `${language === 'he' ? 'מקור' : 'Source'}: ${priceSource === 'fallback' ? (language === 'he' ? 'נתונים סטטיים' : 'Static Data') : priceSource === 'manual' ? (language === 'he' ? 'ידני' : 'Manual') : 'API'}`),
                        lastUpdated && React.createElement('span', { key: 'time' }, 
                            `${language === 'he' ? 'עודכן' : 'Updated'}: ${lastUpdated}`)
                    ])
                ]) : React.createElement('div', {
                    key: 'no-price',
                    className: "text-sm text-gray-500 italic"
                }, language === 'he' ? 'לחץ על כפתור הרענון כדי לקבל מחיר' : 'Click refresh to fetch price'),
                
                // Currency status
                workingCurrency !== 'USD' && React.createElement('div', {
                    key: 'currency-status',
                    className: "mt-2 text-xs text-gray-500 italic"
                }, currencyRate !== null && currencyRate > 0 ? 
                    `${language === 'he' ? 'שער חליפין' : 'Exchange rate'}: 1 USD = ${currencySymbol}${currencyRate.toFixed(2)} ${workingCurrency}` :
                    `${language === 'he' ? 'טוען שער חליפין...' : 'Loading exchange rate...'}`
                )
            ])
        ]) : null
    ]);
};

// Export to window for global access
window.EnhancedRSUCompanySelector = EnhancedRSUCompanySelector;