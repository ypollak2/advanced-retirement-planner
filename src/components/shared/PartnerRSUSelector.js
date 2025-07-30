// PartnerRSUSelector.js - Enhanced RSU Company Selection for Partners in Couples Mode
// Provides same functionality as EnhancedRSUCompanySelector but for partner fields

const PartnerRSUSelector = ({ inputs, setInputs, language, workingCurrency = 'USD', partnerKey = 'partner' }) => {
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
    
    // Partner-specific field names
    const companyField = `${partnerKey}RsuCompany`;
    const unitsField = `${partnerKey}RsuUnits`;
    const priceField = `${partnerKey}RsuCurrentStockPrice`;
    const frequencyField = `${partnerKey}RsuFrequency`;
    const quarterlyField = `${partnerKey}QuarterlyRSU`;
    
    // Comprehensive list of tech companies with RSUs (same as main component)
    const companies = [
        // FAANG + Major Tech
        { symbol: 'AAPL', name: 'Apple Inc.', category: 'Big Tech' },
        { symbol: 'GOOGL', name: 'Alphabet (Google)', category: 'Big Tech' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'Big Tech' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'Big Tech' },
        { symbol: 'META', name: 'Meta Platforms (Facebook)', category: 'Big Tech' },
        { symbol: 'NFLX', name: 'Netflix Inc.', category: 'Big Tech' },
        
        // Top Tech Companies
        { symbol: 'TSLA', name: 'Tesla Inc.', category: 'Electric Vehicles' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'Semiconductors' },
        { symbol: 'AMD', name: 'Advanced Micro Devices', category: 'Semiconductors' },
        { symbol: 'INTC', name: 'Intel Corporation', category: 'Semiconductors' },
        { symbol: 'CRM', name: 'Salesforce Inc.', category: 'Cloud Software' },
        { symbol: 'ORCL', name: 'Oracle Corporation', category: 'Enterprise Software' },
        { symbol: 'ADBE', name: 'Adobe Inc.', category: 'Creative Software' },
        { symbol: 'NOW', name: 'ServiceNow Inc.', category: 'Cloud Software' },
        
        // Growth Tech
        { symbol: 'SHOP', name: 'Shopify Inc.', category: 'E-commerce' },
        { symbol: 'SPOT', name: 'Spotify Technology', category: 'Media Streaming' },
        { symbol: 'ZM', name: 'Zoom Video Communications', category: 'Communication' },
        { symbol: 'UBER', name: 'Uber Technologies', category: 'Rideshare' },
        { symbol: 'ABNB', name: 'Airbnb Inc.', category: 'Travel' },
        { symbol: 'COIN', name: 'Coinbase Global', category: 'Cryptocurrency' },
        { symbol: 'PLTR', name: 'Palantir Technologies', category: 'Data Analytics' },
        { symbol: 'SNOW', name: 'Snowflake Inc.', category: 'Cloud Data' },
        { symbol: 'DDOG', name: 'Datadog Inc.', category: 'Monitoring' },
        
        // Enterprise & Cloud
        { symbol: 'CRWD', name: 'CrowdStrike Holdings', category: 'Cybersecurity' },
        { symbol: 'OKTA', name: 'Okta Inc.', category: 'Identity Management' },
        { symbol: 'TWLO', name: 'Twilio Inc.', category: 'Communication APIs' },
        { symbol: 'WORK', name: 'Slack Technologies', category: 'Collaboration' },
        { symbol: 'TEAM', name: 'Atlassian Corporation', category: 'Developer Tools' },
        { symbol: 'MDB', name: 'MongoDB Inc.', category: 'Database' },
        { symbol: 'ESTC', name: 'Elastic N.V.', category: 'Search & Analytics' },
        
        // Israeli Tech Companies
        { symbol: 'WDAY', name: 'Workday Inc.', category: 'HR Software' },
        { symbol: 'NICE', name: 'NICE Ltd.', category: 'Analytics' },
        { symbol: 'CYBR', name: 'CyberArk Software', category: 'Cybersecurity' },
        { symbol: 'MNDY', name: 'monday.com Ltd.', category: 'Collaboration' },
        { symbol: 'S', name: 'SentinelOne Inc.', category: 'Cybersecurity' },
        { symbol: 'FROG', name: 'JFrog Ltd.', category: 'DevOps' },
        
        // Other Notable Tech
        { symbol: 'LYFT', name: 'Lyft Inc.', category: 'Rideshare' },
        { symbol: 'PINS', name: 'Pinterest Inc.', category: 'Social Media' },
        { symbol: 'SNAP', name: 'Snap Inc.', category: 'Social Media' },
        { symbol: 'TWTR', name: 'Twitter Inc.', category: 'Social Media' },
        { symbol: 'SQ', name: 'Block Inc. (Square)', category: 'Fintech' },
        { symbol: 'PYPL', name: 'PayPal Holdings', category: 'Fintech' },
        { symbol: 'ROKU', name: 'Roku Inc.', category: 'Streaming' },
        { symbol: 'ZS', name: 'Zscaler Inc.', category: 'Cybersecurity' }
    ];
    
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
                    console.log(`💱 Partner RSU Currency rate loaded: 1 USD = ${rates[workingCurrency]} ${workingCurrency}`);
                }
            }).catch(error => {
                console.warn('Failed to load partner RSU currency rates:', error);
            });
        }
    }, [workingCurrency]);
    
    // Filter companies based on search query
    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const handleCompanySelect = async (symbol) => {
        setInputs({...inputs, [companyField]: symbol});
        setIsDropdownOpen(false);
        setSearchQuery('');
        
        if (symbol && symbol !== 'OTHER' && symbol !== '') {
            // Wait for currency rate if needed before fetching stock price
            if (workingCurrency !== 'USD' && (currencyRate === null || currencyRate <= 0)) {
                console.log('⏳ Partner RSU: Waiting for currency rate to load...');
                // Try to wait up to 3 seconds for currency rate
                let waitTime = 0;
                while ((currencyRate === null || currencyRate <= 0) && waitTime < 3000) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    waitTime += 100;
                }
            }
            await fetchStockPriceForSymbol(symbol);
        } else {
            // Reset price data for OTHER or empty selection
            setStockPrice(null);
            setPriceSource('');
            setLastUpdated(null);
            setManualPriceMode(false);
        }
    };
    
    // Function to fetch stock price using the API
    const fetchStockPriceForSymbol = async (symbol) => {
        if (!symbol || !window.fetchStockPrice) {
            console.warn('⚠️ Partner RSU: fetchStockPrice function not available');
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
                    if (!currencyRate || currencyRate <= 0 || !isFinite(currencyRate)) {
                        console.warn(`⚠️ Partner RSU: Invalid currency rate for ${workingCurrency}: ${currencyRate}`);
                        throw new Error('Currency rate not available');
                    }
                    convertedPrice = Math.round(priceUSD * currencyRate * 100) / 100; // Avoid floating point issues
                    console.log(`💱 Partner RSU Converting ${symbol}: $${priceUSD} USD → ${currencySymbol}${convertedPrice.toFixed(2)} ${workingCurrency} (rate: ${currencyRate})`);
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
                
                // Update inputs with converted price and recalculate quarterly RSU
                const units = inputs[unitsField] || 0;
                const frequency = inputs[frequencyField] || 'quarterly';
                let quarterlyValue = 0;
                if (units > 0) {
                    let annualValue = 0;
                    if (frequency === 'monthly') {
                        annualValue = units * convertedPrice * 12;
                    } else if (frequency === 'quarterly') {
                        annualValue = units * convertedPrice * 4;
                    } else if (frequency === 'yearly') {
                        annualValue = units * convertedPrice;
                    }
                    quarterlyValue = annualValue / 4;
                }
                
                setInputs(prev => ({
                    ...prev,
                    [priceField]: convertedPrice,
                    [quarterlyField]: quarterlyValue
                }));
                
                console.log(`✅ Partner RSU: Stock price fetched for ${symbol}: ${currencySymbol}${convertedPrice.toFixed(2)} ${workingCurrency}`);
            } else {
                throw new Error('Price not available');
            }
        } catch (error) {
            console.warn(`⚠️ Partner RSU: Failed to fetch price for ${symbol}:`, error.message);
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
                console.warn('⚠️ Partner RSU: Cannot convert manual price to USD - invalid currency rate');
            }
            setLastUpdated(new Date().toLocaleTimeString());
            setPriceSource('manual');
            
            // Update inputs with manual price and recalculate quarterly RSU
            const units = inputs[unitsField] || 0;
            const frequency = inputs[frequencyField] || 'quarterly';
            let quarterlyValue = 0;
            if (units > 0) {
                let annualValue = 0;
                if (frequency === 'monthly') {
                    annualValue = units * price * 12;
                } else if (frequency === 'quarterly') {
                    annualValue = units * price * 4;
                } else if (frequency === 'yearly') {
                    annualValue = units * price;
                }
                quarterlyValue = annualValue / 4;
            }
            
            setInputs(prev => ({
                ...prev,
                [priceField]: price,
                [quarterlyField]: quarterlyValue
            }));
            
            console.log(`✅ Partner RSU: Manual price set for ${inputs[companyField]}: ${currencySymbol}${price}`);
        }
    };
    
    // Refresh stock price
    const refreshStockPrice = () => {
        if (inputs[companyField] && inputs[companyField] !== 'OTHER') {
            fetchStockPriceForSymbol(inputs[companyField]);
        }
    };
    
    // Handle units change with price recalculation
    const handleUnitsChange = (units) => {
        const numericUnits = parseInt(units) || 0;
        const currentPrice = inputs[priceField] || 0;
        const frequency = inputs[frequencyField] || 'quarterly';
        
        let quarterlyValue = 0;
        if (numericUnits > 0 && currentPrice > 0) {
            let annualValue = 0;
            if (frequency === 'monthly') {
                annualValue = numericUnits * currentPrice * 12;
            } else if (frequency === 'quarterly') {
                annualValue = numericUnits * currentPrice * 4;
            } else if (frequency === 'yearly') {
                annualValue = numericUnits * currentPrice;
            }
            quarterlyValue = annualValue / 4;
        }
        
        setInputs(prev => ({
            ...prev,
            [unitsField]: numericUnits,
            [quarterlyField]: quarterlyValue
        }));
    };
    
    // Handle frequency change with price recalculation
    const handleFrequencyChange = (frequency) => {
        const units = inputs[unitsField] || 0;
        const currentPrice = inputs[priceField] || 0;
        
        let quarterlyValue = 0;
        if (units > 0 && currentPrice > 0) {
            let annualValue = 0;
            if (frequency === 'monthly') {
                annualValue = units * currentPrice * 12;
            } else if (frequency === 'quarterly') {
                annualValue = units * currentPrice * 4;
            } else if (frequency === 'yearly') {
                annualValue = units * currentPrice;
            }
            quarterlyValue = annualValue / 4;
        }
        
        setInputs(prev => ({
            ...prev,
            [frequencyField]: frequency,
            [quarterlyField]: quarterlyValue
        }));
    };
    
    const selectedCompany = companies.find(c => c.symbol === inputs[companyField]);
    
    return React.createElement('div', { key: 'partner-rsu-selector' }, [
        React.createElement('label', {
            key: 'partner-rsu-label',
            className: "block text-sm font-medium text-gray-700 mb-2"
        }, [
            React.createElement('span', { key: 'label-text' }, 
                language === 'he' ? 'חברה (40+ אפשרויות)' : 'Company (40+ Options)'),
            React.createElement('span', { 
                key: 'label-badge',
                className: "ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold"
            }, language === 'he' ? 'חיפוש חכם' : 'Smart Search')
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
                            setInputs({...inputs, [companyField]: ''});
                        }
                    },
                    onFocus: () => setIsDropdownOpen(true),
                    placeholder: language === 'he' ? 'חפש חברה או סמל מניה...' : 'Search company or stock symbol...',
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm pr-10"
                }),
                React.createElement('div', {
                    key: 'search-icon',
                    className: "absolute right-3 top-1/2 transform -translate-y-1/2"
                }, isLoading ? 
                    React.createElement('div', { 
                        className: "animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full" 
                    }) :
                    React.createElement('span', { className: "text-gray-400 text-sm" }, '🔍')
                )
            ]),
            
            // Dropdown List
            isDropdownOpen && filteredCompanies.length > 0 ? React.createElement('div', {
                key: 'dropdown',
                className: "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
            }, [
                React.createElement('div', {
                    key: 'dropdown-header',
                    className: "px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600"
                }, `${filteredCompanies.length} ${language === 'he' ? 'תוצאות' : 'companies found'}`),
                
                ...filteredCompanies.map((company, index) => 
                    React.createElement('div', {
                        key: `company-${company.symbol}`,
                        onClick: () => handleCompanySelect(company.symbol),
                        className: "px-3 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
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
                                className: "text-green-500 font-bold"
                            }, '→')
                        ])
                    ])
                ),
                
                // Custom option
                React.createElement('div', {
                    key: 'custom-option',
                    onClick: () => handleCompanySelect('OTHER'),
                    className: "px-3 py-3 hover:bg-yellow-50 cursor-pointer border-t-2 border-yellow-200 bg-yellow-25"
                }, [
                    React.createElement('div', {
                        key: 'custom-content',
                        className: "flex items-center justify-between"
                    }, [
                        React.createElement('div', { key: 'custom-info' }, [
                            React.createElement('div', {
                                key: 'custom-name',
                                className: "font-semibold text-yellow-800 text-sm"
                            }, language === 'he' ? '🏢 חברה אחרת' : '🏢 Other Company'),
                            React.createElement('div', {
                                key: 'custom-desc',
                                className: "text-xs text-yellow-600"
                            }, language === 'he' ? 'הזן פרטים ידנית' : 'Enter details manually')
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
        
        // Selected company display with stock price
        selectedCompany ? React.createElement('div', {
            key: 'selected-display',
            className: "mt-2 p-4 bg-green-50 border border-green-200 rounded-lg"
        }, [
            React.createElement('div', {
                key: 'selected-info',
                className: "flex items-center justify-between mb-3"
            }, [
                React.createElement('div', { key: 'selected-details' }, [
                    React.createElement('div', {
                        key: 'selected-name',
                        className: "font-semibold text-green-800 text-sm"
                    }, `✅ ${selectedCompany.name}`),
                    React.createElement('div', {
                        key: 'selected-meta',
                        className: "text-xs text-green-600"
                    }, `${selectedCompany.symbol} • ${selectedCompany.category}`)
                ]),
                React.createElement('button', {
                    key: 'clear-selection',
                    onClick: () => {
                        setInputs({
                            ...inputs, 
                            [companyField]: '', 
                            [priceField]: 0,
                            [quarterlyField]: 0
                        });
                        setSearchQuery('');
                        setStockPrice(null);
                        setPriceSource('');
                        setLastUpdated(null);
                        setManualPriceMode(false);
                    },
                    className: "text-green-600 hover:text-green-800 text-xs font-semibold px-2 py-1 hover:bg-green-100 rounded"
                }, language === 'he' ? 'נקה' : 'Clear')
            ]),
            
            // Stock Price Section
            React.createElement('div', {
                key: 'stock-price-section',
                className: "bg-white rounded-lg p-3 border border-green-100"
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
                        className: "animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"
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
                        className: "px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
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
        ]) : null,
        
        // RSU Units and Frequency
        React.createElement('div', { key: 'rsu-details', className: "mt-3 grid grid-cols-2 gap-3" }, [
            React.createElement('div', { key: 'rsu-units-container' }, [
                React.createElement('label', {
                    key: 'rsu-units-label',
                    className: "block text-xs font-medium text-gray-600 mb-1"
                }, language === 'he' ? 'מספר יחידות RSU' : 'RSU Units'),
                React.createElement('input', {
                    key: 'rsu-units-input',
                    type: 'number',
                    value: inputs[unitsField] || 0,
                    onChange: (e) => handleUnitsChange(e.target.value),
                    placeholder: language === 'he' ? 'כמות' : 'Units',
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                })
            ]),
            React.createElement('div', { key: 'rsu-frequency-container' }, [
                React.createElement('label', {
                    key: 'rsu-frequency-label',
                    className: "block text-xs font-medium text-gray-600 mb-1"
                }, language === 'he' ? 'תדירות הענקה' : 'Vesting Frequency'),
                React.createElement('select', {
                    key: 'rsu-frequency-select',
                    value: inputs[frequencyField] || 'quarterly',
                    onChange: (e) => handleFrequencyChange(e.target.value),
                    className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                }, [
                    React.createElement('option', { key: 'monthly-option', value: 'monthly' }, 
                        language === 'he' ? 'חודשי' : 'Monthly'),
                    React.createElement('option', { key: 'quarterly-option', value: 'quarterly' }, 
                        language === 'he' ? 'רבעוני' : 'Quarterly'),
                    React.createElement('option', { key: 'yearly-option', value: 'yearly' }, 
                        language === 'he' ? 'שנתי' : 'Yearly')
                ])
            ])
        ]),
        
        // RSU Value Display
        (inputs[unitsField] > 0 && inputs[priceField] > 0) && React.createElement('div', {
            key: 'rsu-value-display',
            className: "mt-3 p-3 bg-green-50 rounded-lg text-sm border border-green-200"
        }, [
            React.createElement('div', {
                key: 'rsu-calculation',
                className: "text-green-700 font-medium"
            }, [
                React.createElement('span', { key: 'calc-text' }, 
                    `${inputs[unitsField]} ${language === 'he' ? 'יחידות' : 'units'} × ${currencySymbol}${inputs[priceField]} = `),
                React.createElement('span', { 
                    key: 'calc-value',
                    className: "font-bold text-green-800"
                }, `${currencySymbol}${(inputs[unitsField] * inputs[priceField]).toLocaleString()}`)
            ]),
            React.createElement('div', {
                key: 'rsu-frequency-info',
                className: "text-xs text-green-600 mt-1"
            }, language === 'he' ? 
                `הענקה ${inputs[frequencyField] === 'monthly' ? 'חודשית' : inputs[frequencyField] === 'quarterly' ? 'רבעונית' : 'שנתית'}` :
                `Vesting ${inputs[frequencyField] || 'quarterly'}`)
        ])
    ]);
};

// Export to window for global access
window.PartnerRSUSelector = PartnerRSUSelector;
console.log('✅ PartnerRSUSelector component loaded successfully');