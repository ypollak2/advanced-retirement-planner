// Salary Calculations Module
// Handles income calculations and conversions

// Auto-calculate net salary from gross using country-specific tax calculations
function calculateNetFromGross(grossSalary, country = 'israel') {
    if (!grossSalary || grossSalary <= 0) return 0;
    if (!window.TaxCalculators || !window.TaxCalculators.calculateNetSalary) {
        // Fallback calculation if TaxCalculators not available
        return Math.round(grossSalary * 0.66); // ~66% take-home for Israel
    }
    const result = window.TaxCalculators.calculateNetSalary(grossSalary, country);
    return result.netSalary || Math.round(grossSalary * 0.66);
}

// Helper function to convert income to monthly based on frequency
function convertToMonthly(amount, frequency) {
    if (!amount || amount === 0) return 0;
    switch (frequency) {
        case 'monthly':
            return amount;
        case 'quarterly':
            return amount / 3;
        case 'yearly':
            return amount / 12;
        default:
            return amount; // Default to monthly
    }
}

// Helper function to apply tax if income is before tax
function applyTax(amount, isAfterTax, taxRate = 30) {
    if (!amount || amount === 0) return 0;
    if (isAfterTax) return amount;
    return amount * (1 - taxRate / 100);
}

// Calculate total income using NET (after-tax) amounts
function calculateTotalIncome(inputs, language = 'en') {
    // In couple mode, main person fields are not used - only partner fields
    let mainSalary = 0;
    let partner1Salary = 0;
    let partner2Salary = 0;
    let mainAdditionalIncomeMonthly = 0;
    let partnerAdditionalIncomeMonthly = 0;
    
    if (inputs.planningType === 'couple') {
        // COUPLE MODE: Use partner fields only
        partner1Salary = inputs.partner1NetSalary || calculateNetFromGross(inputs.partner1Salary || 0, inputs.country);
        partner2Salary = inputs.partner2NetSalary || calculateNetFromGross(inputs.partner2Salary || 0, inputs.country);
        
        // In couple mode, mainAdditionalIncome should be attributed to Partner 1
        // Calculate Partner 1 additional income (includes main person additional income fields)
        if (window.AdditionalIncomeTax && window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome) {
            try {
                // Partner 1 gets the "main" additional income fields
                const partner1TaxResult = window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome(inputs);
                mainAdditionalIncomeMonthly = partner1TaxResult.totalMonthlyNet || 0;
            } catch (error) {
                console.warn('Error calculating partner 1 additional income tax:', error);
                // Fallback to simplified calculation for Partner 1
                mainAdditionalIncomeMonthly = calculateFallbackAdditionalIncome(inputs);
            }
        }
        
        // Partner 2 additional income (using partner-specific fields)
        if (window.AdditionalIncomeTax) {
            try {
                const partnerInputs = {
                    country: inputs.country || 'israel',
                    currentMonthlySalary: inputs.partner2Salary || 0,
                    annualBonus: inputs.partnerAnnualBonus || 0,
                    quarterlyRSU: inputs.partnerQuarterlyRSU || 0,
                    // Enhanced partner RSU fields - use partner2 specific fields
                    rsuUnits: inputs.partner2RsuUnits || inputs.partnerRsuUnits || 0,
                    rsuCurrentStockPrice: inputs.partner2RsuCurrentStockPrice || inputs.partnerRsuCurrentStockPrice || 0,
                    rsuFrequency: inputs.partner2RsuFrequency || inputs.partnerRsuFrequency || 'quarterly',
                    freelanceIncome: inputs.partnerFreelanceIncome || 0,
                    rentalIncome: inputs.partnerRentalIncome || 0,
                    dividendIncome: inputs.partnerDividendIncome || 0,
                    otherIncome: inputs.partnerOtherIncome || 0
                };
                const partnerTaxResult = window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome(partnerInputs);
                partnerAdditionalIncomeMonthly = partnerTaxResult.totalMonthlyNet || 0;
            } catch (error) {
                console.warn('Error calculating partner 2 additional income tax:', error);
                // Fallback to simplified calculation for Partner 2
                partnerAdditionalIncomeMonthly = calculatePartnerFallbackAdditionalIncome(inputs);
            }
        }
    } else {
        // SINGLE MODE: Use main person fields
        mainSalary = inputs.currentNetSalary || calculateNetFromGross(inputs.currentMonthlySalary || 0, inputs.country);
        
        // Calculate main person additional income
        if (window.AdditionalIncomeTax && window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome) {
            try {
                const mainTaxResult = window.AdditionalIncomeTax.getMonthlyAfterTaxAdditionalIncome(inputs);
                mainAdditionalIncomeMonthly = mainTaxResult.totalMonthlyNet || 0;
            } catch (error) {
                console.warn('Error calculating main additional income tax:', error);
                // Fallback to simplified calculation with frequency and tax handling
                mainAdditionalIncomeMonthly = calculateFallbackAdditionalIncome(inputs);
            }
        }
    }
    
    // Return total monthly income using NET amounts
    const totalIncome = mainSalary + partner1Salary + partner2Salary + mainAdditionalIncomeMonthly + partnerAdditionalIncomeMonthly;
    
    // Debug logging
    console.log(`💰 Total Monthly Income Calculation (NET):`, {
        mainSalary,
        partner1Salary, 
        partner2Salary,
        mainAdditionalIncomeMonthly,
        partnerAdditionalIncomeMonthly,
        totalIncome
    });
    
    return totalIncome;
}

// Fallback calculation for main person additional income
function calculateFallbackAdditionalIncome(inputs) {
    const freelanceMonthly = convertToMonthly(
        applyTax(inputs.freelanceIncome || 0, inputs.freelanceIncomeAfterTax, inputs.freelanceIncomeTaxRate),
        inputs.freelanceIncomeFrequency || 'monthly'
    );
    const rentalMonthly = convertToMonthly(
        applyTax(inputs.rentalIncome || 0, inputs.rentalIncomeAfterTax, inputs.rentalIncomeTaxRate),
        inputs.rentalIncomeFrequency || 'monthly'
    );
    const dividendMonthly = convertToMonthly(
        applyTax(inputs.dividendIncome || 0, inputs.dividendIncomeAfterTax, inputs.dividendIncomeTaxRate),
        inputs.dividendIncomeFrequency || 'quarterly'
    );
    const annualBonusMonthly = (inputs.annualBonus || 0) / 12 * 0.5; // Assume ~50% tax
    const quarterlyRSUMonthly = (inputs.quarterlyRSU || 0) / 3 * 0.55; // Assume ~45% tax
    const otherMonthly = convertToMonthly(
        applyTax(inputs.otherIncome || 0, inputs.otherIncomeAfterTax, inputs.otherIncomeTaxRate),
        inputs.otherIncomeFrequency || 'monthly'
    );
    return freelanceMonthly + rentalMonthly + dividendMonthly + 
                                annualBonusMonthly + quarterlyRSUMonthly + otherMonthly;
}

// Fallback calculation for partner additional income
function calculatePartnerFallbackAdditionalIncome(inputs) {
    const partnerFreelanceIncome = inputs.partnerFreelanceIncome || 0;
    const partnerRentalIncome = inputs.partnerRentalIncome || 0;
    const partnerDividendIncome = inputs.partnerDividendIncome || 0;
    const partnerAnnualBonusMonthly = (inputs.partnerAnnualBonus || 0) / 12 * 0.55; // Assume ~45% tax
    const partnerQuarterlyRSUMonthly = (inputs.partnerQuarterlyRSU || 0) / 3 * 0.57; // Assume ~43% tax
    const partnerOtherIncome = inputs.partnerOtherIncome || 0;
    return partnerFreelanceIncome + partnerRentalIncome + partnerDividendIncome + 
                                   partnerAnnualBonusMonthly + partnerQuarterlyRSUMonthly + partnerOtherIncome;
}

// Export to window
window.SalaryCalculations = {
    calculateNetFromGross,
    convertToMonthly,
    applyTax,
    calculateTotalIncome,
    calculateFallbackAdditionalIncome,
    calculatePartnerFallbackAdditionalIncome
};

console.log('✅ Salary calculations module loaded');