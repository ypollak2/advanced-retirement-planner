// Savings Calculations Module
// Calculation functions for savings wizard

// Tax rate validation function
function validateTaxRate(value) {
    const rate = parseFloat(value);
    if (isNaN(rate) || rate < 0) return 0;
    if (rate > 50) return 50;
    if (rate > 1 && rate <= 50) return rate;
    if (rate > 0 && rate <= 1) return rate * 100;
    return rate;
}

// Format number as currency
function formatCurrency(amount, currency = 'ILS') {
    if (window.formatCurrency) {
        return window.formatCurrency(amount, currency);
    }
    
    // Fallback formatting
    const symbol = window.SavingsContent ? window.SavingsContent.getCurrencySymbol(currency) : '₪';
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Math.round(amount || 0));
    
    return `${symbol}${formatted}`;
}

// Calculate total savings with error handling
function calculateTotalSavings(inputs) {
    try {
        const currentSavings = inputs.currentSavings || 0;
        const currentTrainingFund = inputs.currentTrainingFund || 0;
        const emergencyFund = inputs.emergencyFund || 0;
        
        // Apply tax to personal portfolio for display purposes
        const grossPersonalPortfolio = inputs.currentPersonalPortfolio || 0;
        const portfolioTaxRate = (inputs.portfolioTaxRate !== undefined && inputs.portfolioTaxRate !== null ? inputs.portfolioTaxRate : 25) / 100;
        const netPersonalPortfolio = grossPersonalPortfolio * (1 - portfolioTaxRate);
        
        const currentRealEstate = inputs.currentRealEstate || 0;
        const currentCrypto = inputs.currentDigitalAssetFiatValue || inputs.currentCryptoFiatValue || inputs.currentCrypto || 0;
        const currentSavingsAccount = inputs.currentSavingsAccount || 0;
        const currentBankAccount = inputs.currentBankAccount || 0;
        
        // Partner savings if couple - apply tax to partner portfolios too
        const partner1Pension = inputs.partner1CurrentPension || 0;
        const partner1TrainingFund = inputs.partner1CurrentTrainingFund || 0;
        const partner1EmergencyFund = inputs.partner1EmergencyFund || 0;
        
        const grossPartner1Portfolio = inputs.partner1PersonalPortfolio || 0;
        const partner1TaxRate = (inputs.partner1PortfolioTaxRate !== undefined && inputs.partner1PortfolioTaxRate !== null ? inputs.partner1PortfolioTaxRate : 25) / 100;
        const netPartner1Portfolio = grossPartner1Portfolio * (1 - partner1TaxRate);
        
        const partner1RealEstate = inputs.partner1RealEstate || 0;
        const partner1Crypto = inputs.partner1DigitalAssetFiatValue || inputs.partner1CryptoFiatValue || inputs.partner1Crypto || 0;
        
        const partner2Pension = inputs.partner2CurrentPension || 0;
        const partner2TrainingFund = inputs.partner2CurrentTrainingFund || 0;
        const partner2EmergencyFund = inputs.partner2EmergencyFund || 0;
        
        const grossPartner2Portfolio = inputs.partner2PersonalPortfolio || 0;
        const partner2TaxRate = (inputs.partner2PortfolioTaxRate !== undefined && inputs.partner2PortfolioTaxRate !== null ? inputs.partner2PortfolioTaxRate : 25) / 100;
        const netPartner2Portfolio = grossPartner2Portfolio * (1 - partner2TaxRate);
        
        const partner2RealEstate = inputs.partner2RealEstate || 0;
        const partner2Crypto = inputs.partner2DigitalAssetFiatValue || inputs.partner2CryptoFiatValue || inputs.partner2Crypto || 0;
        
        const partner1BankAccount = inputs.partner1BankAccount || 0;
        const partner2BankAccount = inputs.partner2BankAccount || 0;
        
        // Calculate totals
        let total = currentSavings + currentTrainingFund + emergencyFund + netPersonalPortfolio + 
                   currentRealEstate + currentCrypto + currentSavingsAccount + currentBankAccount;
        
        if (inputs.planningType === 'couple') {
            total += partner1Pension + partner1TrainingFund + partner1EmergencyFund + netPartner1Portfolio + 
                    partner1RealEstate + partner1Crypto + partner1BankAccount +
                    partner2Pension + partner2TrainingFund + partner2EmergencyFund + netPartner2Portfolio + 
                    partner2RealEstate + partner2Crypto + partner2BankAccount;
        }
        
        return Math.round(total);
    } catch (error) {
        console.error('Error calculating total savings:', error);
        return 0;
    }
}

// Render net value after tax with proper formatting
function renderNetValue(grossAmount, taxRate, partnerId = null, prefix = '') {
    const rate = taxRate !== undefined && taxRate !== null ? taxRate : 25;
    const actualRate = rate > 1 ? rate / 100 : rate;
    const netAmount = grossAmount * (1 - actualRate);
    
    const formatted = formatCurrency(netAmount);
    
    if (prefix) {
        return `${prefix} ${formatted}`;
    }
    return formatted;
}

// Export functions
window.SavingsCalculations = {
    validateTaxRate,
    formatCurrency,
    calculateTotalSavings,
    renderNetValue
};

console.log('✅ Savings calculations module loaded');