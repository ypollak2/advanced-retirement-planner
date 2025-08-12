// Currency Helpers Module
// Currency formatting and conversion utilities

window.formatCurrency = (amount, currency = 'ILS') => {
    // Handle invalid amounts (NaN, undefined, null, etc.)
    if (amount === undefined || amount === null || isNaN(amount) || !isFinite(amount)) {
        amount = 0;
    }
    
    // Ensure amount is a number
    amount = parseFloat(amount) || 0;
    
    // Handle different currencies
    const currencySymbols = {
        ILS: '₪',
        USD: '$',
        EUR: '€',
        GBP: '£',
        BTC: '₿',
        ETH: 'Ξ'
    };
    
    // For crypto currencies, use fixed decimal places
    if (currency === 'BTC' || currency === 'ETH') {
        return `${currencySymbols[currency] || currency}${amount.toFixed(6)}`;
    }
    
    // For regular currencies, use Intl.NumberFormat if available
    try {
        // Use en-US for all currencies to ensure thousand separators
        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true
        });
        const symbol = currencySymbols[currency] || currency + ' ';
        return `${symbol}${formatter.format(Math.round(amount))}`;
    } catch (e) {
        // Fallback for unsupported currencies
        const symbol = currencySymbols[currency] || currency + ' ';
        return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
    }
};

window.convertCurrency = (amount, currency, exchangeRates) => {
    // Critical fix: Add null/zero check to prevent division by zero errors
    if (!exchangeRates || typeof exchangeRates !== 'object') {
        console.warn(`Exchange rates object is invalid:`, exchangeRates);
        return 'N/A';
    }
    
    if (!currency || !exchangeRates[currency] || exchangeRates[currency] === 0) {
        const rateValue = exchangeRates[currency];
        console.warn(`Exchange rate for ${currency} is invalid:`, rateValue);
        return 'N/A';
    }
    
    // Validate amount is a valid number
    if (amount === null || amount === undefined || isNaN(amount)) {
        console.warn(`Invalid amount for currency conversion:`, amount);
        return 'N/A';
    }
    
    const convertedAmount = amount / exchangeRates[currency];
    const formatters = {
        USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }),
        GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }),
        EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }),
        ILS: new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 }),
        BTC: (amount) => `₿${(amount).toFixed(6)}`,
        ETH: (amount) => `Ξ${(amount).toFixed(4)}`
    };
    
    // Handle crypto currencies with special formatting
    if (currency === 'BTC' || currency === 'ETH') {
        return formatters[currency](convertedAmount);
    }
    
    // Handle regular currencies
    if (!formatters[currency]) {
        console.warn(`No formatter available for currency: ${currency}`);
        return `${convertedAmount.toFixed(2)} ${currency}`;
    }
    
    return formatters[currency].format(convertedAmount);
};

// Export functions
window.CurrencyHelpers = {
    formatCurrency: window.formatCurrency,
    convertCurrency: window.convertCurrency
};

console.log('✅ Currency helpers module loaded');