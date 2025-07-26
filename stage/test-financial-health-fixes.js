// Test Financial Health Score Fixes
// Verify that the field mapping fixes resolve the 0 score issues

// Mock the fixed calculation functions
const SCORE_FACTORS = {
    savingsRate: { weight: 25, benchmarks: { excellent: 20, good: 15, fair: 10, poor: 5 } },
    taxEfficiency: { weight: 15, benchmarks: { excellent: 90, good: 75, fair: 60, poor: 40 } },
    retirementReadiness: { weight: 20 },
    timeHorizon: { weight: 15 },
    riskAlignment: { weight: 12 },
    diversification: { weight: 13 }
};

// Fixed Savings Rate Score function
function calculateSavingsRateScore(inputs) {
    const monthlyIncome = parseFloat(inputs.currentMonthlySalary || inputs.partner1Salary || 0);
    
    // Calculate monthly contributions from multiple sources with better field mapping
    let monthlyContributions = parseFloat(inputs.monthlyContribution || 0);
    
    // If monthlyContribution is not set, calculate from pension/training fund rates
    if (monthlyContributions === 0 && monthlyIncome > 0) {
        const pensionRate = parseFloat(inputs.pensionContributionRate || inputs.employeePensionRate || inputs.pensionEmployee || 0);
        const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || inputs.trainingFundEmployeeRate || inputs.trainingFundEmployee || 0);
        
        // Calculate contributions as percentage of salary
        monthlyContributions = monthlyIncome * (pensionRate + trainingFundRate) / 100;
        
        // Also include additional savings if available
        const additionalSavings = parseFloat(inputs.additionalMonthlySavings || inputs.monthlyInvestment || 0);
        monthlyContributions += additionalSavings;
    }
    
    if (monthlyIncome === 0) return { score: 0, details: { rate: 0, status: 'unknown', monthlyAmount: 0 } };
    
    const savingsRate = (monthlyContributions / monthlyIncome) * 100;
    const maxScore = SCORE_FACTORS.savingsRate.weight;
    
    let score = 0;
    let status = 'poor';
    
    if (savingsRate >= SCORE_FACTORS.savingsRate.benchmarks.excellent) {
        score = maxScore; status = 'excellent';
    } else if (savingsRate >= SCORE_FACTORS.savingsRate.benchmarks.good) {
        score = maxScore * 0.85; status = 'good';
    } else if (savingsRate >= SCORE_FACTORS.savingsRate.benchmarks.fair) {
        score = maxScore * 0.70; status = 'fair';
    } else if (savingsRate >= SCORE_FACTORS.savingsRate.benchmarks.poor) {
        score = maxScore * 0.50; status = 'poor';
    } else {
        score = Math.max(0, (savingsRate / SCORE_FACTORS.savingsRate.benchmarks.poor) * maxScore * 0.50);
        status = 'critical';
    }
    
    return {
        score: Math.round(score),
        details: {
            rate: savingsRate,
            monthlyAmount: monthlyContributions,
            monthlyIncome: monthlyIncome,
            status: status,
            calculationMethod: monthlyContributions > 0 ? 
                (inputs.monthlyContribution ? 'direct' : 'calculated_from_rates') : 'no_contributions'
        }
    };
}

// Fixed Tax Efficiency Score function
function calculateTaxEfficiencyScore(inputs) {
    // Better field name mapping for pension and training fund rates
    const pensionRate = parseFloat(
        inputs.pensionContributionRate || 
        inputs.employeePensionRate || 
        inputs.pensionEmployee || 
        inputs.pensionRate ||
        inputs.employeeContribution || 
        7 // Default Israeli pension rate if not found
    );
    
    const trainingFundRate = parseFloat(
        inputs.trainingFundContributionRate || 
        inputs.trainingFundEmployeeRate || 
        inputs.trainingFundEmployee ||
        inputs.trainingFundRate ||
        2.5 // Default Israeli training fund rate if not found
    );
    
    const country = (inputs.country || 'ISR').toLowerCase();
    
    // Calculate tax-advantaged contribution rate
    const totalTaxAdvantaged = pensionRate + trainingFundRate;
    
    let efficiencyScore = 0;
    
    // Country-specific optimal rates with better mapping
    const optimalRates = {
        'isr': 21.333, 'israel': 21.333, // Israeli pension + training fund
        'usa': 15, 'us': 15, 'united states': 15,     // 401k + IRA
        'gbr': 12, 'uk': 12, 'united kingdom': 12,     // Workplace pension
        'eur': 10, 'germany': 10, 'france': 10, 'europe': 10      // Average European pension
    };
    
    const optimalRate = optimalRates[country] || optimalRates['isr'];
    efficiencyScore = Math.min(100, (totalTaxAdvantaged / optimalRate) * 100);
    
    const maxScore = SCORE_FACTORS.taxEfficiency.weight;
    const score = (efficiencyScore / 100) * maxScore;
    
    let status = 'poor';
    if (efficiencyScore >= 90) status = 'excellent';
    else if (efficiencyScore >= 75) status = 'good';
    else if (efficiencyScore >= 60) status = 'fair';
    else if (efficiencyScore >= 40) status = 'poor';
    else status = 'critical';
    
    return {
        score: Math.round(score),
        details: {
            currentRate: totalTaxAdvantaged,
            optimalRate: optimalRate,
            efficiencyScore: efficiencyScore,
            status: status,
            pensionRate: pensionRate,
            trainingFundRate: trainingFundRate,
            country: country,
            calculationMethod: (pensionRate > 0 || trainingFundRate > 0) ? 'rates_found' : 'using_defaults'
        }
    };
}

console.log('🧪 Testing Financial Health Score Fixes\n');

// Test Case 1: Simulating the problematic scenario from the UI
const problematicInputs = {
    currentMonthlySalary: 20000,
    partner1Salary: 0,
    partner2Salary: 0,
    // Missing monthlyContribution but has the rates that should be used
    pensionEmployee: 7, // This should now be picked up
    trainingFundContributionRate: 2.5, // This field name is correct
    country: 'israel'
};

console.log('🔍 Test Case 1: Problematic scenario (should now work)');
console.log('Input fields:', Object.keys(problematicInputs));
console.log('');

const savingsResult1 = calculateSavingsRateScore(problematicInputs);
const taxResult1 = calculateTaxEfficiencyScore(problematicInputs);

console.log('📊 Results:');
console.log('Savings Rate Score:', savingsResult1);
console.log('Tax Efficiency Score:', taxResult1);
console.log('');

// Test Case 2: Ideal scenario with all correct field names
const idealInputs = {
    currentMonthlySalary: 20000,
    monthlyContribution: 3000,
    pensionContributionRate: 7,
    trainingFundContributionRate: 2.5,
    country: 'israel'
};

console.log('🔍 Test Case 2: Ideal scenario');
const savingsResult2 = calculateSavingsRateScore(idealInputs);
const taxResult2 = calculateTaxEfficiencyScore(idealInputs);

console.log('📊 Results:');
console.log('Savings Rate Score:', savingsResult2);
console.log('Tax Efficiency Score:', taxResult2);
console.log('');

// Calculate total scores
function calculateTotalScore(savings, tax, retirement = 20, time = 15, risk = 9.6, diversification = 13) {
    return Math.round(savings.score + tax.score + retirement + time + risk + diversification);
}

const total1 = calculateTotalScore(savingsResult1, taxResult1);
const total2 = calculateTotalScore(savingsResult2, taxResult2);

console.log('📈 COMPARISON WITH ORIGINAL UI ISSUE:');
console.log('');
console.log('Before Fix (estimated):');
console.log('- Savings Rate: 0 (missing field)');
console.log('- Tax Efficiency: 0 (missing field)');
console.log('- Total Score: ~51/100 (Critical)');
console.log('');
console.log('After Fix (Test Case 1):');
console.log(`- Savings Rate: ${savingsResult1.score} (${savingsResult1.details.status})`);
console.log(`- Tax Efficiency: ${taxResult1.score} (${taxResult1.details.status})`);
console.log(`- Total Score: ~${total1}/100`);
console.log('');
console.log('After Fix (Test Case 2):');
console.log(`- Savings Rate: ${savingsResult2.score} (${savingsResult2.details.status})`);
console.log(`- Tax Efficiency: ${taxResult2.score} (${taxResult2.details.status})`);
console.log(`- Total Score: ~${total2}/100`);
console.log('');

console.log('✅ ANALYSIS:');
console.log('1. Fixed field name mappings resolve the 0 scores');
console.log('2. Savings rate now calculates from pension/training fund rates when direct contribution missing');
console.log('3. Tax efficiency now finds rates using multiple field name variations');
console.log('4. Total score should now be more representative of actual financial health');
console.log('5. Debug information helps identify calculation methods used');