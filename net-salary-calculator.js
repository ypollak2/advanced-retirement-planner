// Net Salary Calculator - Real Examples
// Shows exactly how much money is left after all deductions

// Quick calculator function to demonstrate net salary calculations
function calculateNetSalary(grossSalary, country = 'israel') {
    let deductions = {};
    let netSalary = 0;
    
    switch (country.toLowerCase()) {
        case 'israel':
            return calculateIsraeliNetSalary(grossSalary);
        case 'uk':
            return calculateUKNetSalary(grossSalary);
        case 'usa':
            return calculateUSNetSalary(grossSalary);
        case 'germany':
            return calculateGermanNetSalary(grossSalary);
        case 'france':
            return calculateFrenchNetSalary(grossSalary);
        case 'australia':
            return calculateAustralianNetSalary(grossSalary);
        default:
            return { error: 'Unsupported country' };
    }
}

// Israeli calculation (most comprehensive)
function calculateIsraeliNetSalary(monthlyGross) {
    const annualGross = monthlyGross * 12;
    
    // Income tax calculation (2025 brackets)
    let incomeTax = 0;
    let remaining = annualGross;
    
    const brackets = [
        { max: 81480, rate: 0.10 },
        { max: 116760, rate: 0.14 },
        { max: 188280, rate: 0.20 },
        { max: 269280, rate: 0.31 },
        { max: 558240, rate: 0.35 },
        { max: 718440, rate: 0.47 },
        { max: Infinity, rate: 0.50 }
    ];
    
    let previousMax = 0;
    for (const bracket of brackets) {
        if (remaining <= 0) break;
        const taxableInThisBracket = Math.min(remaining, bracket.max - previousMax);
        if (taxableInThisBracket > 0) {
            incomeTax += taxableInThisBracket * bracket.rate;
            remaining -= taxableInThisBracket;
        }
        previousMax = bracket.max;
    }
    
    // Other deductions
    const nationalInsurance = Math.min(annualGross, 494580) * 0.12; // 12% up to ceiling
    const healthInsurance = annualGross * 0.031; // 3.1%
    const pensionEmployee = monthlyGross * 0.07 * 12; // 7% employee portion
    
    // Training fund (complex Israeli system)
    let trainingFundEmployee = 0;
    let trainingFundTaxPenalty = 0;
    
    if (monthlyGross > 15792) {
        // Above threshold: 2.5% employee contribution
        const totalTrainingFund = monthlyGross * 0.10 * 12; // 10% total
        trainingFundEmployee = monthlyGross * 0.025 * 12; // 2.5% employee portion
        
        // Tax penalty on excess over ₪1,579/month tax-deductible limit
        const maxTaxDeductible = 1579 * 12;
        const actualContribution = totalTrainingFund;
        if (actualContribution > maxTaxDeductible) {
            trainingFundTaxPenalty = (actualContribution - maxTaxDeductible) * 0.20; // Taxed at marginal rate
        }
    } else {
        // Below threshold: 7.5% employer only, 0% employee
        trainingFundEmployee = 0;
    }
    
    const totalAnnualDeductions = 
        incomeTax + 
        nationalInsurance + 
        healthInsurance + 
        pensionEmployee + 
        trainingFundEmployee + 
        trainingFundTaxPenalty;
    
    const netAnnual = annualGross - totalAnnualDeductions;
    const netMonthly = netAnnual / 12;
    
    return {
        country: 'Israel',
        grossSalary: monthlyGross,
        deductions: {
            incomeTax: Math.round(incomeTax / 12),
            nationalInsurance: Math.round(nationalInsurance / 12),
            healthInsurance: Math.round(healthInsurance / 12),
            pensionEmployee: Math.round(pensionEmployee / 12),
            trainingFundEmployee: Math.round(trainingFundEmployee / 12),
            trainingFundTaxPenalty: Math.round(trainingFundTaxPenalty / 12),
            total: Math.round(totalAnnualDeductions / 12)
        },
        netSalary: Math.round(netMonthly),
        deductionPercentage: Math.round((totalAnnualDeductions / annualGross) * 100),
        takeHomePercentage: Math.round((netAnnual / annualGross) * 100),
        currency: '₪'
    };
}

// UK calculation
function calculateUKNetSalary(monthlyGross) {
    const annualGross = monthlyGross * 12;
    const personalAllowance = 12570 * 4.7; // £12,570 converted to NIS
    
    let incomeTax = 0;
    if (annualGross > personalAllowance) {
        const taxableIncome = annualGross - personalAllowance;
        if (taxableIncome <= 177199) { // Basic rate
            incomeTax = taxableIncome * 0.20;
        } else if (taxableIncome <= 588158) { // Higher rate
            incomeTax = 177199 * 0.20 + (taxableIncome - 177199) * 0.40;
        } else { // Additional rate
            incomeTax = 177199 * 0.20 + 410959 * 0.40 + (taxableIncome - 588158) * 0.45;
        }
    }
    
    const nationalInsurance = Math.max(0, (annualGross - personalAllowance) * 0.12);
    const pensionEmployee = monthlyGross * 0.04 * 12; // 4% employee contribution
    
    const totalDeductions = incomeTax + nationalInsurance + pensionEmployee;
    const netAnnual = annualGross - totalDeductions;
    
    return {
        country: 'United Kingdom',
        grossSalary: monthlyGross,
        deductions: {
            incomeTax: Math.round(incomeTax / 12),
            nationalInsurance: Math.round(nationalInsurance / 12),
            pensionEmployee: Math.round(pensionEmployee / 12),
            total: Math.round(totalDeductions / 12)
        },
        netSalary: Math.round(netAnnual / 12),
        deductionPercentage: Math.round((totalDeductions / annualGross) * 100),
        takeHomePercentage: Math.round((netAnnual / annualGross) * 100),
        currency: '₪'
    };
}

// Example usage and test cases
console.log('=== NET SALARY CALCULATOR EXAMPLES ===\n');

// Israel examples
console.log('🇮🇱 ISRAEL EXAMPLES:');
console.log('Average salary (₪20,000):', calculateIsraeliNetSalary(20000));
console.log('High salary (₪35,000):', calculateIsraeliNetSalary(35000));
console.log('');

// UK example
console.log('🇬🇧 UK EXAMPLE:');
console.log('Average salary (₪13,733):', calculateUKNetSalary(13733));
console.log('');

// Quick comparison function
function compareCountries(grossSalary) {
    console.log(`=== COMPARISON FOR ₪${grossSalary.toLocaleString()} GROSS SALARY ===`);
    
    const countries = [
        { name: 'Israel', calc: calculateIsraeliNetSalary },
        { name: 'UK', calc: calculateUKNetSalary }
    ];
    
    countries.forEach(country => {
        const result = country.calc(grossSalary);
        console.log(`${country.name}: ₪${result.netSalary.toLocaleString()} net (${result.takeHomePercentage}% take-home)`);
    });
    console.log('');
}

// Comparison examples
compareCountries(20000);
compareCountries(30000);

// Export for use in the main application
if (typeof window !== 'undefined') {
    window.calculateNetSalary = calculateNetSalary;
    window.calculateIsraeliNetSalary = calculateIsraeliNetSalary;
    window.calculateUKNetSalary = calculateUKNetSalary;
}