// Chart Formatting Module
// Standardized chart formatting utilities

// Standardized Chart Currency Formatting System
window.standardChartFormatting = {
    // Get currency symbol
    getCurrencySymbol: (currency) => {
        const symbols = {
            'ILS': '₪',
            'USD': '$',
            'EUR': '€', 
            'GBP': '£',
            'BTC': '₿',
            'ETH': 'Ξ',
            'JPY': '¥',
            'CAD': 'C$',
            'AUD': 'A$'
        };
        return symbols[currency] || '₪';
    },

    // Standardized Y-axis formatter for charts
    formatYAxisValue: (value, currency = 'ILS') => {
        const symbol = window.standardChartFormatting.getCurrencySymbol(currency);
        
        if (Math.abs(value) >= 1000000) {
            return `${symbol}${(value / 1000000).toFixed(1)}M`;
        } else if (Math.abs(value) >= 1000) {
            return `${symbol}${(value / 1000).toFixed(0)}K`;
        } else {
            return `${symbol}${Math.round(value).toLocaleString()}`;
        }
    },

    // Standardized tooltip formatter for charts
    formatTooltipValue: (value, currency = 'ILS', language = 'en') => {
        const symbol = window.standardChartFormatting.getCurrencySymbol(currency);
        const formattedValue = Math.round(value).toLocaleString(language === 'he' ? 'he-IL' : 'en-US');
        return `${symbol}${formattedValue}`;
    },

    // Standardized chart scale configuration
    getStandardScaleConfig: (currency = 'ILS', language = 'en') => {
        return {
            x: {
                title: {
                    display: true,
                    text: language === 'he' ? 'גיל' : 'Age',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: `${language === 'he' ? 'סכום' : 'Amount'} (${window.standardChartFormatting.getCurrencySymbol(currency)})`,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                ticks: {
                    callback: function(value) {
                        return window.standardChartFormatting.formatYAxisValue(value, currency);
                    },
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                beginAtZero: true
            }
        };
    },

    // Standardized tooltip configuration
    getStandardTooltipConfig: (currency = 'ILS', language = 'en') => {
        return {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += window.standardChartFormatting.formatTooltipValue(context.parsed.y, currency, language);
                    }
                    return label;
                }
            }
        };
    }
};

// Data validation helper
window.validatePartnerData = (partnerData) => {
    if (!partnerData || typeof partnerData !== 'object') {
        return false;
    }
    
    const requiredFields = ['age', 'salary'];
    return requiredFields.every(field => field in partnerData && 
        partnerData[field] !== null && 
        partnerData[field] !== undefined);
};

// Export functions
window.ChartFormatting = {
    standardChartFormatting: window.standardChartFormatting,
    validatePartnerData: window.validatePartnerData
};

console.log('✅ Chart formatting module loaded');