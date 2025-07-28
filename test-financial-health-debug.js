// Financial Health Score Debug Test
// Test the enhanced field mapping and scoring fixes

console.log('🧪 Starting Financial Health Score Debug Test...\n');

// Enhanced test data with multiple field name variations
const testScenarios = [
    {
        name: 'Individual Planning - Standard Fields',
        inputs: {
            planningType: 'individual',
            currentAge: 35,
            retirementAge: 67,
            country: 'ISR',
            currentMonthlySalary: 20000,
            pensionContributionRate: 7,
            trainingFundContributionRate: 2.5,
            currentSavings: 300000,
            currentTrainingFund: 100000,
            currentPersonalPortfolio: 150000,
            currentRealEstate: 1200000,
            currentSavingsAccount: 50000,
            expenses: {
                housing: 8000,
                transportation: 2000,
                food: 3000,
                insurance: 1500,
                other: 2500,
                mortgage: 4000,
                carLoan: 1200,
                creditCard: 800,
                otherDebt: 0
            },
            emergencyFund: 50000,
            stockPercentage: 60,
            riskTolerance: 'moderate'
        }
    },
    {
        name: 'Couple Planning - Partner Fields',
        inputs: {
            planningType: 'couple',
            currentAge: 35,
            retirementAge: 67,
            country: 'ISR',
            partner1Salary: 18000,
            partner2Salary: 15000,
            pensionContributionRate: 7,
            trainingFundContributionRate: 2.5,
            currentSavings: 500000,
            currentTrainingFund: 200000,
            currentPersonalPortfolio: 250000,
            currentRealEstate: 1500000,
            currentSavingsAccount: 80000,
            expenses: {
                housing: 12000,
                transportation: 3000,
                food: 4500,
                insurance: 2000,
                other: 3500,
                mortgage: 6000,
                carLoan: 1800,
                creditCard: 1200,
                otherDebt: 500
            },
            emergencyFund: 80000,
            stockPercentage: 65,
            riskTolerance: 'moderate'
        }
    },
    {
        name: 'Missing Data Scenario',
        inputs: {
            planningType: 'individual',
            currentAge: 30,
            retirementAge: 67,
            country: 'ISR'
            // Missing salary and contribution data
        }
    }
];

// Mock the financial health engine loading
console.log('📦 Loading Financial Health Engine...');

// Since we can't load in Node.js, we'll create a mock version
const mockFinancialHealthEngine = `
// Mock financial health scoring for debugging
window.calculateFinancialHealthScore = function(inputs) {
    console.log('🔍 Mock Financial Health Score Calculation');
    console.log('Input fields received:', Object.keys(inputs));
    
    // Mock scoring
    return {
        totalScore: 75,
        factors: {
            savingsRate: { score: 18, details: { rate: 14.5, status: 'good' }},
            retirementReadiness: { score: 15, details: { ratio: 0.8, status: 'good' }},
            timeHorizon: { score: 13, details: { yearsToRetirement: 32, status: 'excellent' }},
            riskAlignment: { score: 10, details: { stockPercentage: 60, status: 'good' }},
            diversification: { score: 8, details: { assetClasses: 4, status: 'good' }},
            taxEfficiency: { score: 6, details: { efficiencyScore: 75, status: 'good' }},
            emergencyFund: { score: 5, details: { months: 3.2, status: 'fair' }},
            debtManagement: { score: 2, details: { ratio: 0.15, status: 'good' }}
        },
        status: 'good',
        suggestions: [],
        peerComparison: { ageGroup: '30-39', yourScore: 75, peerAverage: 55 }
    };
};
`;

console.log('📊 Running Test Scenarios...\n');

testScenarios.forEach((scenario, index) => {
    console.log(`\n=== Test ${index + 1}: ${scenario.name} ===`);
    console.log('Input Analysis:');
    
    const inputs = scenario.inputs;
    
    // Analyze input structure
    console.log('- Planning Type:', inputs.planningType || 'Not specified');
    console.log('- Salary Fields:', Object.keys(inputs).filter(k => k.toLowerCase().includes('salary')));
    console.log('- Pension Fields:', Object.keys(inputs).filter(k => k.toLowerCase().includes('pension')));
    console.log('- Training Fund Fields:', Object.keys(inputs).filter(k => k.toLowerCase().includes('training')));
    console.log('- Savings Fields:', Object.keys(inputs).filter(k => k.toLowerCase().includes('savings')));
    console.log('- Has Expenses Structure:', !!inputs.expenses);
    console.log('- Total Input Fields:', Object.keys(inputs).length);
    
    // Simulate field mapping
    console.log('\nField Mapping Simulation:');
    
    // Income detection
    let monthlyIncome = 0;
    if (inputs.planningType === 'couple') {
        const p1 = parseFloat(inputs.partner1Salary || inputs.Partner1Salary || 0);
        const p2 = parseFloat(inputs.partner2Salary || inputs.Partner2Salary || 0);
        monthlyIncome = p1 + p2;
        console.log(`- Couple Income: ₪${p1} + ₪${p2} = ₪${monthlyIncome}`);
    } else {
        monthlyIncome = parseFloat(inputs.currentMonthlySalary || inputs.monthlySalary || inputs.salary || 0);
        console.log(`- Individual Income: ₪${monthlyIncome}`);
    }
    
    // Contribution rates
    const pensionRate = parseFloat(inputs.pensionContributionRate || inputs.pensionEmployeeRate || 0);
    const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || inputs.trainingFundEmployeeRate || 0);
    console.log(`- Pension Rate: ${pensionRate}%`);
    console.log(`- Training Fund Rate: ${trainingFundRate}%`);
    
    // Savings Rate Calculation
    if (monthlyIncome > 0 && (pensionRate > 0 || trainingFundRate > 0)) {
        const monthlyContributions = monthlyIncome * (pensionRate + trainingFundRate) / 100;
        const savingsRate = (monthlyContributions / monthlyIncome) * 100;
        console.log(`- Monthly Contributions: ₪${monthlyContributions.toLocaleString()}`);
        console.log(`- Savings Rate: ${savingsRate.toFixed(1)}%`);
    } else {
        console.log('- Savings Rate: Cannot calculate (missing data)');
    }
    
    // Emergency Fund Analysis
    if (inputs.expenses) {
        const monthlyExpenses = Object.values(inputs.expenses).reduce((sum, val) => sum + parseFloat(val || 0), 0);
        const emergencyMonths = inputs.emergencyFund ? (inputs.emergencyFund / monthlyExpenses) : 0;
        console.log(`- Monthly Expenses: ₪${monthlyExpenses.toLocaleString()}`);
        console.log(`- Emergency Fund Coverage: ${emergencyMonths.toFixed(1)} months`);
    }
    
    // Asset Diversification
    const assetFields = ['currentSavings', 'currentTrainingFund', 'currentPersonalPortfolio', 'currentRealEstate'];
    const assetCount = assetFields.filter(field => inputs[field] && parseFloat(inputs[field]) > 0).length;
    console.log(`- Asset Classes: ${assetCount}/4`);
    
    console.log('\nExpected Issues:');
    if (monthlyIncome === 0) {
        console.log('❌ No income data found - Savings Rate will be 0%');
    }
    if (pensionRate === 0 && trainingFundRate === 0) {
        console.log('❌ No contribution rates found - Tax Efficiency will be 0%');
    }
    if (!inputs.expenses && !inputs.emergencyFund) {
        console.log('❌ No expense or emergency fund data - Emergency Fund score will be 0%');
    }
    if (assetCount < 2) {
        console.log('❌ Insufficient asset diversification - Diversification score will be low');
    }
    
    console.log('\n' + '='.repeat(60));
});

console.log('\n🎯 Debug Test Complete!');
console.log('\nNext Steps:');
console.log('1. Load this test in a browser to see actual Financial Health Engine behavior');
console.log('2. Compare expected vs actual results');
console.log('3. Verify field mapping improvements are working');
console.log('4. Check that zero scores now have proper explanations');