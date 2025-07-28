// Financial Health Score Debugger - Debug input flow and field mapping issues
// Created to fix field mapping mismatches between wizard and scoring engine

/**
 * Debug utility to analyze inputs flowing into Financial Health Score
 */
window.debugFinancialHealthInputs = (inputs) => {
    console.log('🔍 === FINANCIAL HEALTH SCORE INPUT DEBUGGING ===');
    console.log('📋 Raw Inputs Object:', inputs);
    
    // Analyze input structure
    const inputAnalysis = {
        totalFields: Object.keys(inputs).length,
        planningType: inputs.planningType || 'unknown',
        country: inputs.country || inputs.taxCountry || 'unknown',
        
        // Salary fields analysis
        salaryFields: {
            found: Object.keys(inputs).filter(k => k.toLowerCase().includes('salary')),
            currentMonthlySalary: {
                exists: 'currentMonthlySalary' in inputs,
                value: inputs.currentMonthlySalary,
                type: typeof inputs.currentMonthlySalary,
                isValid: !!(inputs.currentMonthlySalary && inputs.currentMonthlySalary > 0)
            },
            partner1Salary: {
                exists: 'partner1Salary' in inputs,
                value: inputs.partner1Salary,
                type: typeof inputs.partner1Salary,
                isValid: !!(inputs.partner1Salary && inputs.partner1Salary > 0)
            },
            partner2Salary: {
                exists: 'partner2Salary' in inputs,
                value: inputs.partner2Salary,
                type: typeof inputs.partner2Salary,
                isValid: !!(inputs.partner2Salary && inputs.partner2Salary > 0)
            }
        },
        
        // Contribution fields analysis
        contributionFields: {
            found: Object.keys(inputs).filter(k => k.toLowerCase().includes('contribution') || k.toLowerCase().includes('pension') || k.toLowerCase().includes('training')),
            pensionContributionRate: {
                exists: 'pensionContributionRate' in inputs,
                value: inputs.pensionContributionRate,
                type: typeof inputs.pensionContributionRate,
                isValid: !!(inputs.pensionContributionRate && inputs.pensionContributionRate > 0)
            },
            trainingFundContributionRate: {
                exists: 'trainingFundContributionRate' in inputs,
                value: inputs.trainingFundContributionRate,
                type: typeof inputs.trainingFundContributionRate,
                isValid: !!(inputs.trainingFundContributionRate && inputs.trainingFundContributionRate > 0)
            }
        },
        
        // Asset fields analysis
        assetFields: {
            found: Object.keys(inputs).filter(k => k.toLowerCase().includes('current') && (k.includes('saving') || k.includes('portfolio') || k.includes('real') || k.includes('crypto'))),
            currentSavings: {
                exists: 'currentSavings' in inputs,
                value: inputs.currentSavings,
                type: typeof inputs.currentSavings,
                isValid: !!(inputs.currentSavings && inputs.currentSavings > 0)
            },
            emergencyFund: {
                exists: 'emergencyFund' in inputs,
                value: inputs.emergencyFund,
                type: typeof inputs.emergencyFund,
                isValid: !!(inputs.emergencyFund && inputs.emergencyFund > 0)
            }
        },
        
        // Expense structure analysis
        expenseStructure: {
            hasExpensesObject: !!inputs.expenses,
            expenseCategories: inputs.expenses ? Object.keys(inputs.expenses) : [],
            totalExpenses: inputs.expenses ? Object.values(inputs.expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0) : 0
        },
        
        // Portfolio allocation analysis
        portfolioAllocation: {
            hasPortfolioAllocations: !!inputs.portfolioAllocations,
            allocationType: Array.isArray(inputs.portfolioAllocations) ? 'array' : typeof inputs.portfolioAllocations,
            allocationCount: inputs.portfolioAllocations ? (Array.isArray(inputs.portfolioAllocations) ? inputs.portfolioAllocations.length : 0) : 0
        }
    };
    
    console.log('📊 Input Analysis:', inputAnalysis);
    
    // Test each scoring component with debug information
    console.log('🧪 === TESTING INDIVIDUAL SCORING COMPONENTS ===');
    
    // Test Savings Rate
    try {
        console.log('💰 Testing Savings Rate Score...');
        const savingsRateResult = window.calculateSavingsRateScore ? window.calculateSavingsRateScore(inputs) : null;
        console.log('Savings Rate Result:', savingsRateResult);
        if (savingsRateResult?.score === 0) {
            console.warn('⚠️ Savings Rate returned 0:', savingsRateResult.details?.debugInfo);
        }
    } catch (error) {
        console.error('❌ Savings Rate Error:', error);
    }
    
    // Test Tax Efficiency
    try {
        console.log('💸 Testing Tax Efficiency Score...');
        const taxEfficiencyResult = window.calculateTaxEfficiencyScore ? window.calculateTaxEfficiencyScore(inputs) : null;
        console.log('Tax Efficiency Result:', taxEfficiencyResult);
        if (taxEfficiencyResult?.score === 0) {
            console.warn('⚠️ Tax Efficiency returned 0:', taxEfficiencyResult.details?.debugInfo);
        }
    } catch (error) {
        console.error('❌ Tax Efficiency Error:', error);
    }
    
    // Test Risk Alignment
    try {
        console.log('📈 Testing Risk Alignment Score...');
        const riskAlignmentResult = window.calculateRiskAlignmentScore ? window.calculateRiskAlignmentScore(inputs) : null;
        console.log('Risk Alignment Result:', riskAlignmentResult);
        if (riskAlignmentResult?.score === 0) {
            console.warn('⚠️ Risk Alignment returned 0:', riskAlignmentResult.details);
        }
    } catch (error) {
        console.error('❌ Risk Alignment Error:', error);
    }
    
    // Test Diversification
    try {
        console.log('🎯 Testing Diversification Score...');
        const diversificationResult = window.calculateDiversificationScore ? window.calculateDiversificationScore(inputs) : null;
        console.log('Diversification Result:', diversificationResult);
        if (diversificationResult?.score === 0) {
            console.warn('⚠️ Diversification returned 0:', diversificationResult.details);
        }
    } catch (error) {
        console.error('❌ Diversification Error:', error);
    }
    
    // Generate field mapping recommendations
    console.log('💡 === FIELD MAPPING RECOMMENDATIONS ===');
    const fieldMappingIssues = [];
    
    // Check salary field issues
    if (inputs.planningType === 'couple') {
        if (!inputs.partner1Salary && !inputs.partner2Salary) {
            fieldMappingIssues.push('Missing partner salary fields for couple planning');
        }
    } else {
        if (!inputs.currentMonthlySalary) {
            fieldMappingIssues.push('Missing currentMonthlySalary for individual planning');
        }
    }
    
    // Check contribution rate issues
    if (!inputs.pensionContributionRate && !inputs.trainingFundContributionRate) {
        fieldMappingIssues.push('Missing contribution rate fields');
    }
    
    // Check asset diversification issues
    const assetFields = ['currentSavings', 'currentPersonalPortfolio', 'currentRealEstate', 'currentCryptoFiatValue', 'currentSavingsAccount', 'currentTrainingFund'];
    const foundAssets = assetFields.filter(field => inputs[field] && inputs[field] > 0);
    if (foundAssets.length === 0) {
        fieldMappingIssues.push('No asset fields found for diversification calculation');
    }
    
    if (fieldMappingIssues.length > 0) {
        console.warn('🚨 Field Mapping Issues Found:', fieldMappingIssues);
    } else {
        console.log('✅ No obvious field mapping issues detected');
    }
    
    return {
        inputAnalysis,
        fieldMappingIssues,
        recommendations: generateFieldMappingRecommendations(inputs)
    };
};

/**
 * Generate specific recommendations for fixing field mapping issues
 */
function generateFieldMappingRecommendations(inputs) {
    const recommendations = [];
    
    // Salary recommendations
    if (inputs.planningType === 'couple') {
        if (!inputs.partner1Salary || !inputs.partner2Salary) {
            recommendations.push({
                category: 'Salary Data',
                issue: 'Missing partner salary information',
                solution: 'Add partner1Salary and partner2Salary fields in wizard Step 2',
                priority: 'high'
            });
        }
    } else {
        if (!inputs.currentMonthlySalary) {
            recommendations.push({
                category: 'Salary Data',
                issue: 'Missing monthly salary information',
                solution: 'Add currentMonthlySalary field in wizard Step 2',
                priority: 'high'
            });
        }
    }
    
    // Contribution recommendations
    if (!inputs.pensionContributionRate) {
        recommendations.push({
            category: 'Contribution Rates',
            issue: 'Missing pension contribution rate',
            solution: 'Add pensionContributionRate field in wizard Step 4',
            priority: 'high'
        });
    }
    
    if (!inputs.trainingFundContributionRate && inputs.country === 'israel') {
        recommendations.push({
            category: 'Contribution Rates',
            issue: 'Missing training fund contribution rate for Israeli user',
            solution: 'Add trainingFundContributionRate field in wizard Step 4',
            priority: 'high'
        });
    }
    
    // Asset diversification recommendations
    const assetFields = ['currentSavings', 'currentPersonalPortfolio', 'currentRealEstate', 'emergencyFund'];
    const foundAssets = assetFields.filter(field => inputs[field] && inputs[field] > 0);
    if (foundAssets.length < 2) {
        recommendations.push({
            category: 'Asset Diversification',
            issue: `Only ${foundAssets.length} asset class(es) found`,
            solution: 'Add more asset fields or improve field mapping in scoring engine',
            priority: 'medium'
        });
    }
    
    // Portfolio allocation recommendations
    if (!inputs.portfolioAllocations && !inputs.stockPercentage) {
        recommendations.push({
            category: 'Risk Alignment',
            issue: 'No portfolio allocation data found',
            solution: 'Add portfolioAllocations array or stockPercentage field',
            priority: 'medium'
        });
    }
    
    return recommendations;
}

/**
 * Test specific field mapping scenarios
 */
window.testFieldMapping = (inputs) => {
    console.log('🧪 === FIELD MAPPING TESTS ===');
    
    const testCases = [
        {
            name: 'Individual Salary Detection',
            test: () => {
                const testInputs = { ...inputs, planningType: 'individual', currentMonthlySalary: 15000 };
                return window.getFieldValue ? window.getFieldValue(testInputs, ['currentMonthlySalary', 'monthlySalary', 'salary']) : null;
            }
        },
        {
            name: 'Couple Salary Detection',
            test: () => {
                const testInputs = { ...inputs, planningType: 'couple', partner1Salary: 10000, partner2Salary: 8000 };
                return window.getFieldValue ? window.getFieldValue(testInputs, ['partner1Salary', 'partner2Salary'], { combinePartners: true }) : null;
            }
        },
        {
            name: 'Pension Rate Detection',
            test: () => {
                const testInputs = { ...inputs, pensionContributionRate: 21.333 };
                return window.getFieldValue ? window.getFieldValue(testInputs, ['pensionContributionRate', 'pensionEmployeeRate', 'pensionEmployee']) : null;
            }
        }
    ];
    
    testCases.forEach(testCase => {
        try {
            const result = testCase.test();
            console.log(`✅ ${testCase.name}:`, result);
        } catch (error) {
            console.error(`❌ ${testCase.name}:`, error);
        }
    });
};

console.log('✅ Financial Health Debugger loaded successfully - use debugFinancialHealthInputs(inputs) to debug');