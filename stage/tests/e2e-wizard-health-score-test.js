// E2E Wizard Financial Health Score Test Suite
// Tests complete wizard flow and financial health scoring for different scenarios
// Created: July 28, 2025 - Advanced Retirement Planner v6.8.3

const fs = require('fs');
const path = require('path');

// Test scenarios with expected outcomes
const testScenarios = [
    {
        name: "Young Professional - Individual",
        description: "25-year-old software developer, high savings rate, long time horizon",
        inputs: {
            // Step 1: Personal Information
            planningType: 'individual',
            currentAge: 25,
            retirementAge: 65,
            country: 'israel',
            
            // Step 2: Salary & Income
            currentMonthlySalary: 20000,
            currentNetSalary: 16000,
            
            // Step 3: Monthly Expenses
            currentMonthlyExpenses: 10000,
            expenses: {
                housing: 4000,
                transportation: 1000,
                food: 1500,
                insurance: 500,
                other: 3000
            },
            
            // Step 4: Current Savings
            currentSavings: 80000,
            currentTrainingFund: 50000,
            currentPersonalPortfolio: 30000,
            currentRealEstate: 0,
            currentCrypto: 0,
            currentSavingsAccount: 40000,
            
            // Step 5: Contribution Settings
            pensionContributionRate: 17.5,
            trainingFundContributionRate: 7.5,
            
            // Step 6: Management Fees
            contributionFees: 0.5,
            accumulationFees: 1.0,
            
            // Step 7: Investment Preferences
            riskProfile: 'aggressive',
            expectedReturn: 8.0,
            inflationRate: 3.0,
            stockAllocation: 80,
            bondAllocation: 15,
            alternativeAllocation: 5,
            
            // Step 8: Retirement Goals
            retirementGoal: 12000,
            emergencyFund: 40000
        },
        expectedResults: {
            totalScoreRange: [75, 95],
            keyFactors: {
                savingsRate: { min: 20, status: 'excellent' },
                timeHorizon: { min: 10, status: 'excellent' },
                diversification: { min: 8, status: 'good' },
                riskAlignment: { min: 8, status: 'good' }
            },
            overallStatus: ['good', 'excellent']
        }
    },
    
    {
        name: "Mid-Career Couple - Dual Income",
        description: "35 & 37 year old couple, moderate savings, good diversification",
        inputs: {
            // Step 1: Personal Information
            planningType: 'couple',
            currentAge: 35,
            partnerAge: 37,
            retirementAge: 67,
            partnerRetirementAge: 65,
            country: 'israel',
            
            // Step 2: Salary & Income
            partner1Salary: 25000,
            partner2Salary: 18000,
            partner1NetSalary: 20000,
            partner2NetSalary: 14500,
            
            // Step 3: Monthly Expenses
            currentMonthlyExpenses: 25000,
            expenses: {
                housing: 8000,
                transportation: 3000,
                food: 4000,
                insurance: 2000,
                other: 8000
            },
            
            // Step 4: Current Savings
            currentSavings: 300000,
            currentTrainingFund: 180000,
            currentPersonalPortfolio: 150000,
            currentRealEstate: 1200000,
            currentCrypto: 25000,
            currentSavingsAccount: 80000,
            
            // Partner savings
            partner1CurrentPension: 200000,
            partner1CurrentTrainingFund: 120000,
            partner1PersonalPortfolio: 80000,
            partner2CurrentPension: 150000,
            partner2CurrentTrainingFund: 90000,
            
            // Step 5: Contribution Settings
            pensionContributionRate: 17.5,
            trainingFundContributionRate: 7.5,
            
            // Step 6: Management Fees
            contributionFees: 0.5,
            accumulationFees: 1.2,
            
            // Step 7: Investment Preferences
            riskProfile: 'moderate',
            expectedReturn: 7.0,
            inflationRate: 3.0,
            partner1RiskProfile: 'moderate',
            partner1ExpectedReturn: 7.0,
            partner2RiskProfile: 'conservative',
            partner2ExpectedReturn: 6.0,
            
            // Step 8: Retirement Goals
            retirementGoal: 25000,
            emergencyFund: 120000
        },
        expectedResults: {
            totalScoreRange: [65, 85],
            keyFactors: {
                savingsRate: { min: 18, status: 'excellent' },
                retirementReadiness: { min: 15, status: 'good' },
                diversification: { min: 12, status: 'excellent' },
                emergencyFund: { min: 4, status: 'good' }
            },
            overallStatus: ['good', 'excellent']
        }
    },
    
    {
        name: "Late Career Individual - Catch-up Mode",
        description: "50-year-old executive, high income, behind on savings, needs improvement",
        inputs: {
            // Step 1: Personal Information
            planningType: 'individual',
            currentAge: 50,
            retirementAge: 67,
            country: 'israel',
            
            // Step 2: Salary & Income
            currentMonthlySalary: 40000,
            currentNetSalary: 30000,
            
            // Step 3: Monthly Expenses
            currentMonthlyExpenses: 22000,
            expenses: {
                housing: 8000,
                transportation: 2000,
                food: 2500,
                insurance: 1500,
                other: 8000
            },
            
            // Step 4: Current Savings
            currentSavings: 200000,
            currentTrainingFund: 100000,
            currentPersonalPortfolio: 80000,
            currentRealEstate: 800000,
            currentCrypto: 0,
            currentSavingsAccount: 30000,
            
            // Step 5: Contribution Settings
            pensionContributionRate: 17.5,
            trainingFundContributionRate: 7.5,
            
            // Step 6: Management Fees
            contributionFees: 1.0,
            accumulationFees: 1.5,
            
            // Step 7: Investment Preferences
            riskProfile: 'moderate',
            expectedReturn: 6.5,
            inflationRate: 3.0,
            stockAllocation: 60,
            bondAllocation: 35,
            alternativeAllocation: 5,
            
            // Step 8: Retirement Goals
            retirementGoal: 25000,
            emergencyFund: 60000
        },
        expectedResults: {
            totalScoreRange: [45, 65],
            keyFactors: {
                savingsRate: { min: 18, status: 'excellent' },
                retirementReadiness: { min: 5, status: 'critical' },
                timeHorizon: { min: 8, status: 'good' },
                emergencyFund: { min: 3, status: 'fair' }
            },
            overallStatus: ['needsWork', 'good']
        }
    },
    
    {
        name: "Young Couple - Starting Out",
        description: "28 & 26 year old couple, low savings, high potential",
        inputs: {
            // Step 1: Personal Information
            planningType: 'couple',
            currentAge: 28,
            partnerAge: 26,
            retirementAge: 67,
            partnerRetirementAge: 67,
            country: 'israel',
            
            // Step 2: Salary & Income
            partner1Salary: 15000,
            partner2Salary: 12000,
            partner1NetSalary: 12500,
            partner2NetSalary: 10000,
            
            // Step 3: Monthly Expenses
            currentMonthlyExpenses: 18000,
            expenses: {
                housing: 6000,
                transportation: 2500,
                food: 3000,
                insurance: 1000,
                other: 5500
            },
            
            // Step 4: Current Savings
            currentSavings: 40000,
            currentTrainingFund: 20000,
            currentPersonalPortfolio: 10000,
            currentRealEstate: 0,
            currentCrypto: 5000,
            currentSavingsAccount: 25000,
            
            // Step 5: Contribution Settings
            pensionContributionRate: 17.5,
            trainingFundContributionRate: 7.5,
            
            // Step 6: Management Fees
            contributionFees: 0.5,
            accumulationFees: 1.0,
            
            // Step 7: Investment Preferences
            riskProfile: 'aggressive',
            expectedReturn: 8.5,
            inflationRate: 3.0,
            partner1RiskProfile: 'aggressive',
            partner1ExpectedReturn: 8.5,
            partner2RiskProfile: 'moderate',
            partner2ExpectedReturn: 7.5,
            
            // Step 8: Retirement Goals
            retirementGoal: 18000,
            emergencyFund: 50000
        },
        expectedResults: {
            totalScoreRange: [60, 80],
            keyFactors: {
                savingsRate: { min: 18, status: 'excellent' },
                timeHorizon: { min: 12, status: 'excellent' },
                retirementReadiness: { min: 8, status: 'fair' },
                emergencyFund: { min: 2, status: 'fair' }
            },
            overallStatus: ['good', 'excellent']
        }
    },
    
    {
        name: "High Net Worth Individual - Optimization Focus",
        description: "45-year-old entrepreneur, high income and savings, optimization needed",
        inputs: {
            // Step 1: Personal Information
            planningType: 'individual',
            currentAge: 45,
            retirementAge: 60,
            country: 'israel',
            
            // Step 2: Salary & Income
            currentMonthlySalary: 60000,
            currentNetSalary: 45000,
            
            // Step 3: Monthly Expenses
            currentMonthlyExpenses: 30000,
            expenses: {
                housing: 12000,
                transportation: 3000,
                food: 3000,
                insurance: 2000,
                other: 10000
            },
            
            // Step 4: Current Savings
            currentSavings: 800000,
            currentTrainingFund: 400000,
            currentPersonalPortfolio: 500000,
            currentRealEstate: 2000000,
            currentCrypto: 100000,
            currentSavingsAccount: 200000,
            
            // Step 5: Contribution Settings
            pensionContributionRate: 17.5,
            trainingFundContributionRate: 7.5,
            
            // Step 6: Management Fees
            contributionFees: 0.3,
            accumulationFees: 0.8,
            
            // Step 7: Investment Preferences
            riskProfile: 'moderate',
            expectedReturn: 7.5,
            inflationRate: 3.0,
            stockAllocation: 70,
            bondAllocation: 20,
            alternativeAllocation: 10,
            
            // Step 8: Retirement Goals
            retirementGoal: 40000,
            emergencyFund: 120000
        },
        expectedResults: {
            totalScoreRange: [80, 95],
            keyFactors: {
                savingsRate: { min: 20, status: 'excellent' },
                retirementReadiness: { min: 18, status: 'good' },
                diversification: { min: 12, status: 'excellent' },
                taxEfficiency: { min: 7, status: 'excellent' },
                emergencyFund: { min: 4, status: 'good' }
            },
            overallStatus: ['excellent']
        }
    }
];

// Setup test environment
function setupTestEnvironment() {
    // Mock global window object
    global.window = {};
    global.console = console;
    
    // Load SCORE_FACTORS configuration
    global.window.SCORE_FACTORS = {
        savingsRate: { weight: 25, benchmarks: { excellent: 0.20, good: 0.15, fair: 0.10, poor: 0.05 } },
        retirementReadiness: { weight: 20, benchmarks: { excellent: 2.0, good: 1.5, fair: 1.0, poor: 0.5 } },
        timeHorizon: { weight: 15, benchmarks: { excellent: 30, good: 20, fair: 15, poor: 10 } },
        riskAlignment: { weight: 12, benchmarks: { excellent: 90, good: 80, fair: 70, poor: 60 } },
        diversification: { weight: 10, benchmarks: { excellent: 4, good: 3, fair: 2, poor: 1 } },
        taxEfficiency: { weight: 8, benchmarks: { excellent: 90, good: 80, fair: 70, poor: 60 } },
        emergencyFund: { weight: 7, benchmarks: { excellent: 6, good: 4, fair: 3, poor: 1 } },
        debtManagement: { weight: 3, benchmarks: { excellent: 90, good: 80, fair: 70, poor: 60 } }
    };
    
    // Load the financial health engine
    const enginePath = path.join(__dirname, '../src/utils/financialHealthEngine.js');
    const engineCode = fs.readFileSync(enginePath, 'utf8');
    eval(engineCode);
    
    console.log('✅ Test environment setup complete');
}

// Run a single test scenario
function runTestScenario(scenario) {
    console.log(`\n🧪 Testing Scenario: ${scenario.name}`);
    console.log(`📝 Description: ${scenario.description}`);
    console.log(`📊 Expected Score Range: ${scenario.expectedResults.totalScoreRange[0]}-${scenario.expectedResults.totalScoreRange[1]}`);
    
    try {
        // Calculate financial health score
        const result = global.window.calculateFinancialHealthScore(scenario.inputs);
        
        // Analyze results
        const analysis = {
            passed: true,
            issues: [],
            warnings: [],
            actualScore: result.totalScore,
            actualStatus: result.status,
            factorAnalysis: {}
        };
        
        // Check total score range
        const [minScore, maxScore] = scenario.expectedResults.totalScoreRange;
        if (result.totalScore < minScore || result.totalScore > maxScore) {
            analysis.passed = false;
            analysis.issues.push(`Total score ${result.totalScore} outside expected range ${minScore}-${maxScore}`);
        }
        
        // Check overall status
        if (!scenario.expectedResults.overallStatus.includes(result.status)) {
            analysis.passed = false;
            analysis.issues.push(`Status '${result.status}' not in expected statuses: ${scenario.expectedResults.overallStatus.join(', ')}`);
        }
        
        // Check individual factors
        Object.entries(scenario.expectedResults.keyFactors).forEach(([factorName, expected]) => {
            const actualFactor = result.factors[factorName];
            analysis.factorAnalysis[factorName] = {
                actualScore: actualFactor?.score || 0,
                actualStatus: actualFactor?.details?.status || 'unknown',
                expectedMin: expected.min,
                expectedStatus: expected.status,
                passed: true
            };
            
            if ((actualFactor?.score || 0) < expected.min) {
                analysis.factorAnalysis[factorName].passed = false;
                analysis.issues.push(`${factorName} score ${actualFactor?.score || 0} below minimum ${expected.min}`);
            }
            
            if (actualFactor?.details?.status !== expected.status) {
                analysis.warnings.push(`${factorName} status '${actualFactor?.details?.status}' differs from expected '${expected.status}'`);
            }
        });
        
        // Display results
        console.log(`📈 Actual Score: ${result.totalScore}/100 (${result.status})`);
        console.log(`✅ Test ${analysis.passed ? 'PASSED' : 'FAILED'}`);
        
        if (analysis.issues.length > 0) {
            console.log(`❌ Issues:`);
            analysis.issues.forEach(issue => console.log(`   - ${issue}`));
        }
        
        if (analysis.warnings.length > 0) {
            console.log(`⚠️  Warnings:`);
            analysis.warnings.forEach(warning => console.log(`   - ${warning}`));
        }
        
        // Factor breakdown
        console.log(`📊 Factor Breakdown:`);
        Object.entries(analysis.factorAnalysis).forEach(([name, factor]) => {
            const status = factor.passed ? '✅' : '❌';
            console.log(`   ${status} ${name}: ${factor.actualScore} (${factor.actualStatus}) - Expected: ≥${factor.expectedMin} (${factor.expectedStatus})`);
        });
        
        return analysis;
        
    } catch (error) {
        console.log(`❌ Test FAILED with error: ${error.message}`);
        return {
            passed: false,
            issues: [`Exception: ${error.message}`],
            warnings: [],
            error: error
        };
    }
}

// Run all test scenarios
function runAllTests() {
    console.log('🚀 Starting E2E Wizard Financial Health Score Test Suite');
    console.log('=' .repeat(80));
    
    setupTestEnvironment();
    
    const results = {
        total: testScenarios.length,
        passed: 0,
        failed: 0,
        scenarios: []
    };
    
    testScenarios.forEach(scenario => {
        const result = runTestScenario(scenario);
        results.scenarios.push({
            name: scenario.name,
            ...result
        });
        
        if (result.passed) {
            results.passed++;
        } else {
            results.failed++;
        }
    });
    
    // Summary
    console.log('\n' + '=' .repeat(80));
    console.log('📋 TEST SUMMARY');
    console.log('=' .repeat(80));
    console.log(`Total Scenarios: ${results.total}`);
    console.log(`Passed: ${results.passed} ✅`);
    console.log(`Failed: ${results.failed} ${results.failed > 0 ? '❌' : ''}`);
    console.log(`Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);
    
    if (results.failed > 0) {
        console.log('\n❌ FAILED SCENARIOS:');
        results.scenarios
            .filter(s => !s.passed)
            .forEach(s => {
                console.log(`   - ${s.name}`);
                s.issues.forEach(issue => console.log(`     • ${issue}`));
            });
    }
    
    // Save results to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsFile = path.join(__dirname, `e2e-test-results-${timestamp}.json`);
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    console.log(`\n📁 Test results saved to: ${resultsFile}`);
    
    return results;
}

// Export for use in other test files
module.exports = {
    testScenarios,
    runTestScenario,
    runAllTests,
    setupTestEnvironment
};

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}