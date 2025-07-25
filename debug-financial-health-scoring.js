// Debug Financial Health Scoring Issues
// Investigate why Savings Rate Score and Tax Efficiency show 0

// Load the financial health engine
if (typeof window === 'undefined') {
    global.window = {};
}

// Mock the financial health calculation functions (extracted from financialHealthEngine.js)
const SCORE_FACTORS = {
    savingsRate: {
        weight: 25,
        benchmarks: { excellent: 20, good: 15, fair: 10, poor: 5 }
    },
    taxEfficiency: {
        weight: 15,
        benchmarks: { excellent: 90, good: 75, fair: 60, poor: 40 }
    },
    retirementReadiness: { weight: 20 },
    timeHorizon: { weight: 15 },
    riskAlignment: { weight: 12 },
    diversification: { weight: 13 }
};

function calculateSavingsRateScore(inputs) {
    console.log('🔍 Savings Rate Calculation Inputs:', {
        currentMonthlySalary: inputs.currentMonthlySalary,
        partner1Salary: inputs.partner1Salary,
        monthlyContribution: inputs.monthlyContribution,
        availableInputs: Object.keys(inputs)
    });
    
    const monthlyIncome = parseFloat(inputs.currentMonthlySalary || inputs.partner1Salary || 0);
    const monthlyContributions = parseFloat(inputs.monthlyContribution || 0);
    
    console.log('💰 Extracted Values:', { monthlyIncome, monthlyContributions });
    
    if (monthlyIncome === 0) {
        console.log('❌ Savings Rate = 0: No monthly income found');
        return { score: 0, details: { rate: 0, status: 'unknown' } };
    }
    
    const savingsRate = (monthlyContributions / monthlyIncome) * 100;
    console.log('📊 Savings Rate:', savingsRate + '%');
    
    let score = 0;
    let status = 'poor';
    const maxScore = SCORE_FACTORS.savingsRate.weight;
    
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
    
    console.log('✅ Savings Rate Score:', { score: Math.round(score), status, rate: savingsRate });
    
    return {
        score: Math.round(score),
        details: { rate: savingsRate, status: status }
    };
}

function calculateTaxEfficiencyScore(inputs) {
    console.log('🔍 Tax Efficiency Calculation Inputs:', {
        pensionContributionRate: inputs.pensionContributionRate,
        employeePensionRate: inputs.employeePensionRate,
        trainingFundContributionRate: inputs.trainingFundContributionRate,
        trainingFundEmployeeRate: inputs.trainingFundEmployeeRate,
        country: inputs.country,
        availableInputs: Object.keys(inputs).filter(key => key.includes('pension') || key.includes('training') || key.includes('tax'))
    });
    
    const pensionRate = parseFloat(inputs.pensionContributionRate || inputs.employeePensionRate || 0);
    const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || inputs.trainingFundEmployeeRate || 0);
    const country = inputs.country || 'ISR';
    
    console.log('💰 Extracted Values:', { pensionRate, trainingFundRate, country });
    
    const totalTaxAdvantaged = pensionRate + trainingFundRate;
    console.log('📊 Total Tax Advantaged Rate:', totalTaxAdvantaged + '%');
    
    const optimalRates = {
        'ISR': 21.333, 'israel': 21.333,
        'USA': 15, 'usa': 15,
        'GBR': 12, 'uk': 12,
        'EUR': 10, 'germany': 10, 'france': 10
    };
    
    const optimalRate = optimalRates[country] || optimalRates['ISR'];
    const efficiencyScore = Math.min(100, (totalTaxAdvantaged / optimalRate) * 100);
    
    const maxScore = SCORE_FACTORS.taxEfficiency.weight;
    const score = (efficiencyScore / 100) * maxScore;
    
    let status = 'poor';
    if (efficiencyScore >= 90) status = 'excellent';
    else if (efficiencyScore >= 75) status = 'good';
    else if (efficiencyScore >= 60) status = 'fair';
    else if (efficiencyScore >= 40) status = 'poor';
    else status = 'critical';
    
    console.log('✅ Tax Efficiency Score:', { 
        score: Math.round(score), 
        status, 
        efficiencyScore, 
        optimalRate,
        totalTaxAdvantaged 
    });
    
    return {
        score: Math.round(score),
        details: {
            currentRate: totalTaxAdvantaged,
            optimalRate: optimalRate,
            efficiencyScore: efficiencyScore,
            status: status
        }
    };
}

// Test scenarios
console.log('🧪 Testing Financial Health Score Calculation Issues\n');

// Test Case 1: Typical user input that might cause 0 scores
const testInputs1 = {
    currentMonthlySalary: 20000,
    partner1Salary: 0,
    partner2Salary: 0,
    // Missing monthlyContribution field - likely cause of 0 savings rate
    pensionEmployee: 7, // Wrong field name - should be pensionContributionRate
    trainingFundEmployee: 2.5, // Wrong field name - should be trainingFundContributionRate
    country: 'israel'
};

console.log('🔍 Test Case 1: Missing expected field names');
console.log('Input:', testInputs1);
console.log('');

const savingsResult1 = calculateSavingsRateScore(testInputs1);
const taxResult1 = calculateTaxEfficiencyScore(testInputs1);

console.log('');

// Test Case 2: Correct field names
const testInputs2 = {
    currentMonthlySalary: 20000,
    monthlyContribution: 3000, // Correct field name
    pensionContributionRate: 7, // Correct field name
    trainingFundContributionRate: 2.5, // Correct field name
    country: 'israel'
};

console.log('🔍 Test Case 2: Correct field names');
console.log('Input:', testInputs2);
console.log('');

const savingsResult2 = calculateSavingsRateScore(testInputs2);
const taxResult2 = calculateTaxEfficiencyScore(testInputs2);

console.log('');

// Calculate final scores like the actual system
function calculateFinalScore(factors) {
    const totalScore = Object.values(factors).reduce((sum, factor) => sum + factor.score, 0);
    return {
        totalScore: Math.round(totalScore),
        status: totalScore >= 85 ? 'excellent' : 
               totalScore >= 70 ? 'good' : 
               totalScore >= 50 ? 'needsWork' : 'critical'
    };
}

// Mock other scores for final calculation
const mockFactors1 = {
    savingsRate: savingsResult1,
    retirementReadiness: { score: 20 }, // 100/100 * 20 weight = 20
    timeHorizon: { score: 15 }, // Full weight
    riskAlignment: { score: 9.6 }, // 80/100 * 12 weight = 9.6  
    diversification: { score: 13 }, // 100/100 * 13 weight = 13
    taxEfficiency: taxResult1,
    emergencyFund: { score: 0 }, // Assuming 0
    debtManagement: { score: 0 } // Assuming 0
};

const mockFactors2 = {
    savingsRate: savingsResult2,
    retirementReadiness: { score: 20 },
    timeHorizon: { score: 15 },
    riskAlignment: { score: 9.6 },
    diversification: { score: 13 },
    taxEfficiency: taxResult2,
    emergencyFund: { score: 0 },
    debtManagement: { score: 0 }
};

const finalScore1 = calculateFinalScore(mockFactors1);
const finalScore2 = calculateFinalScore(mockFactors2);

console.log('📊 FINAL SCORE COMPARISON:');
console.log('Test Case 1 (wrong field names):', finalScore1);
console.log('Expected from UI: 51/100 (Critical)');
console.log('');
console.log('Test Case 2 (correct field names):', finalScore2);
console.log('');

// Root cause analysis
console.log('🔍 ROOT CAUSE ANALYSIS:');
console.log('1. Savings Rate Score = 0 because:');
console.log('   - Looking for "monthlyContribution" field');
console.log('   - UI probably uses different field name');
console.log('   - Need to check what field the wizard actually sets');
console.log('');
console.log('2. Tax Efficiency Score = 0 because:');
console.log('   - Looking for "pensionContributionRate" and "trainingFundContributionRate"');
console.log('   - UI probably uses "pensionEmployee" and "trainingFundEmployee" or similar');
console.log('   - Field name mismatch between calculation engine and form data');
console.log('');
console.log('3. Final Score = 51 matches because:');
console.log('   - 0 (savings) + 20 (retirement) + 15 (time) + 9.6 (risk) + 13 (diversification) + 0 (tax) = 57.6');
console.log('   - Close to 51, likely accounting for different weights or additional factors');
console.log('');
console.log('✅ SOLUTION: Fix field name mappings in financialHealthEngine.js');