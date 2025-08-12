// Savings Content Module
// Multi-language content for savings wizard

const savingsContent = {
    he: {
        title: 'חיסכונות והשקעות',
        subtitle: 'פירוט החיסכונות וההשקעות הנוכחים לכל בן זוג',
        currentSavings: 'חיסכונות נוכחים',
        pensionSavings: 'חיסכון פנסיוני',
        trainingFund: 'קרן השתלמות',
        emergencyFund: 'קרן חירום',
        personalPortfolio: 'תיק השקעות אישי',
        realEstate: 'נדל״ן',
        cryptocurrency: 'מטבעות דיגיטליים',
        bankAccount: 'חשבון בנק',
        totalSavings: 'סך החיסכונות',
        investmentCategories: 'קטגוריות השקעה',
        partnerBreakdown: 'פירוט בני הזוג',
        partner1Savings: 'חיסכונות בן/בת זוג 1',
        partner2Savings: 'חיסכונות בן/בת זוג 2',
        currentValue: 'ערך נוכחי',
        monthlyContribution: 'הפקדה חודשית',
        capitalGainsTax: 'מס רווחי הון (%)',
        netValueAfterTax: 'שווי נטו לאחר מס',
        savingsAccount: 'חשבון חסכון',
        taxRateError: 'שיעור המס חייב להיות בין 0% ל-50%',
        israelTaxRates: 'מס רווחי הון בישראל: 25% (אזרחים), 30% (תושבי חוץ)',
        israelTaxRatesShort: 'ישראל: 25% (תושבים), 30% (תושבי חוץ)',
        currencyConversion: 'המרה מ-ILS ל-{currency} בשער שוטף',
        net: 'נטו:'
    },
    en: {
        title: 'Savings & Investments',
        subtitle: 'Detailed breakdown of current savings and investments for each partner',
        currentSavings: 'Current Savings',
        pensionSavings: 'Pension Savings',
        trainingFund: 'Training Fund',
        emergencyFund: 'Emergency Fund',
        personalPortfolio: 'Personal Portfolio',
        realEstate: 'Real Estate',
        cryptocurrency: 'Cryptocurrency',
        bankAccount: 'Bank Account',
        totalSavings: 'Total Savings',
        investmentCategories: 'Investment Categories',
        partnerBreakdown: 'Partner Breakdown',
        partner1Savings: 'Partner 1 Savings',
        partner2Savings: 'Partner 2 Savings',
        currentValue: 'Current Value',
        monthlyContribution: 'Monthly Contribution',
        capitalGainsTax: 'Capital Gains Tax (%)',
        netValueAfterTax: 'Net Value After Tax',
        savingsAccount: 'Savings Account',
        taxRateError: 'Tax rate must be between 0% and 50%',
        israelTaxRates: 'Israel: 25% (residents), 30% (non-residents)',
        israelTaxRatesShort: 'Israel: 25% (residents), 30% (non-residents)',
        currencyConversion: 'Converted from ILS to {currency} at live rate',
        net: 'Net:'
    }
};

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
    return symbols[currency] || '₪';
};

// Export functions
window.SavingsContent = {
    getSavingsContent: () => savingsContent,
    getCurrencySymbol
};

console.log('✅ Savings content module loaded');