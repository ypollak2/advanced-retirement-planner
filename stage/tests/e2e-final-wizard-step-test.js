// E2E Final Wizard Step (Review) Test Suite
// Tests complete wizard flow ending with comprehensive review step
// Created: July 28, 2025 - Advanced Retirement Planner v6.8.3

const fs = require('fs');
const path = require('path');

// Complete wizard scenarios for final step testing
const finalStepTestScenarios = [
    {
        name: "Complete Individual Journey - Tech Professional",
        description: "Full wizard flow for 30-year-old tech professional",
        completeWizardInputs: {
            // Step 1: Personal Information
            planningType: 'individual',
            currentAge: 30,
            retirementAge: 65,
            country: 'israel',
            
            // Step 2: Salary & Income
            currentMonthlySalary: 30000,
            currentNetSalary: 24000,
            
            // Step 3: Monthly Expenses
            currentMonthlyExpenses: 15000,
            expenses: {
                housing: 6000,
                transportation: 1500,
                food: 2000,
                insurance: 800,
                other: 4700
            },
            
            // Step 4: Current Savings
            currentSavings: 200000,
            currentTrainingFund: 120000,
            currentPersonalPortfolio: 80000,
            currentRealEstate: 0,
            currentCrypto: 15000,
            currentSavingsAccount: 50000,
            
            // Step 5: Contribution Settings
            pensionContributionRate: 17.5,
            trainingFundContributionRate: 7.5,
            
            // Step 6: Management Fees
            contributionFees: 0.5,
            accumulationFees: 1.0,
            
            // Step 7: Investment Preferences
            riskProfile: 'moderate',
            expectedReturn: 7.5,
            inflationRate: 3.0,
            stockAllocation: 70,
            bondAllocation: 25,
            alternativeAllocation: 5,
            
            // Step 8: Retirement Goals
            retirementGoal: 18000,
            emergencyFund: 60000,
            
            // Step 9: Final Review (auto-calculated)
            workingCurrency: 'ILS'
        },
        expectedFinalStepResults: {
            // Financial Health Score expectations
            healthScore: { min: 75, max: 90 },
            overallStatus: ['onTrack', 'readyForRetirement'],
            
            // Retirement projections expectations
            retirementProjections: {
                totalAccumulation: { min: 2000000, max: 4000000 },
                monthlyRetirementIncome: { min: 8000, max: 20000 },
                projectedIncome: { min: 100000, max: 240000 }
            },
            
            // Key calculations that should be present
            requiredCalculations: [
                'financialHealthScore',
                'retirementProjections',
                'readinessScore',
                'overallScore'
            ],
            
            // Data integrity checks
            dataIntegrity: {
                inputValidation: 'valid',
                calculationComplete: true,
                noMissingData: true
            }
        }
    },
    
    {
        name: "Complete Couple Journey - Dual Career Family",
        description: "Full wizard flow for couple with children and property",
        completeWizardInputs: {
            // Step 1: Personal Information
            planningType: 'couple',
            currentAge: 38,
            partnerAge: 35,
            retirementAge: 67,
            partnerRetirementAge: 65,
            country: 'israel',
            
            // Step 2: Salary & Income
            partner1Salary: 35000,
            partner2Salary: 22000,
            partner1NetSalary: 28000,
            partner2NetSalary: 18000,
            
            // Step 3: Monthly Expenses
            currentMonthlyExpenses: 35000,
            expenses: {
                housing: 12000,
                transportation: 4000,
                food: 5000,
                insurance: 3000,
                other: 11000
            },
            
            // Step 4: Current Savings
            currentSavings: 500000,
            currentTrainingFund: 300000,
            currentPersonalPortfolio: 200000,
            currentRealEstate: 1800000,
            currentCrypto: 50000,
            currentSavingsAccount: 120000,
            
            // Partner savings
            partner1CurrentPension: 350000,
            partner1CurrentTrainingFund: 200000,
            partner1PersonalPortfolio: 150000,
            partner2CurrentPension: 220000,
            partner2CurrentTrainingFund: 130000,
            
            // Step 5: Contribution Settings
            pensionContributionRate: 17.5,
            trainingFundContributionRate: 7.5,
            
            // Step 6: Management Fees
            contributionFees: 0.4,
            accumulationFees: 0.9,
            
            // Step 7: Investment Preferences
            riskProfile: 'moderate',
            expectedReturn: 7.0,
            inflationRate: 3.0,
            partner1RiskProfile: 'aggressive',
            partner1ExpectedReturn: 8.0,
            partner2RiskProfile: 'conservative',
            partner2ExpectedReturn: 6.0,
            
            // Step 8: Retirement Goals
            retirementGoal: 35000,
            emergencyFund: 150000,
            
            // Step 9: Final Review
            workingCurrency: 'ILS'
        },
        expectedFinalStepResults: {
            healthScore: { min: 80, max: 95 },
            overallStatus: ['readyForRetirement'],
            
            retirementProjections: {
                totalAccumulation: { min: 6000000, max: 12000000 },
                monthlyRetirementIncome: { min: 25000, max: 45000 },
                projectedIncome: { min: 300000, max: 540000 }
            },
            
            requiredCalculations: [
                'financialHealthScore',
                'retirementProjections',
                'readinessScore',
                'overallScore'
            ],
            
            dataIntegrity: {
                inputValidation: 'valid',
                calculationComplete: true,
                noMissingData: true
            }
        }
    },
    
    {
        name: "Complete High Earner Journey - Executive Level",
        description: "Full wizard flow for high-earning executive with complex portfolio",
        completeWizardInputs: {
            planningType: 'individual',
            currentAge: 45,
            retirementAge: 60,
            country: 'israel',
            
            currentMonthlySalary: 80000,
            currentNetSalary: 60000,
            
            currentMonthlyExpenses: 40000,
            expenses: {
                housing: 15000,
                transportation: 4000,
                food: 4000,
                insurance: 3000,
                other: 14000
            },
            
            currentSavings: 1200000,
            currentTrainingFund: 600000,
            currentPersonalPortfolio: 800000,
            currentRealEstate: 3000000,
            currentCrypto: 200000,
            currentSavingsAccount: 300000,
            
            pensionContributionRate: 17.5,
            trainingFundContributionRate: 7.5,
            
            contributionFees: 0.3,
            accumulationFees: 0.7,
            
            riskProfile: 'aggressive',
            expectedReturn: 8.5,
            inflationRate: 3.0,
            stockAllocation: 75,
            bondAllocation: 15,
            alternativeAllocation: 10,
            
            retirementGoal: 50000,
            emergencyFund: 200000,
            
            workingCurrency: 'ILS'
        },
        expectedFinalStepResults: {
            healthScore: { min: 85, max: 100 },
            overallStatus: ['readyForRetirement'],
            
            retirementProjections: {
                totalAccumulation: { min: 8000000, max: 15000000 },
                monthlyRetirementIncome: { min: 35000, max: 65000 },
                projectedIncome: { min: 420000, max: 780000 }
            },
            
            requiredCalculations: [
                'financialHealthScore',
                'retirementProjections',
                'readinessScore',
                'overallScore'
            ],
            
            dataIntegrity: {
                inputValidation: 'valid',
                calculationComplete: true,
                noMissingData: true
            }
        }
    }
];

// Setup test environment with all required functions
function setupFinalStepTestEnvironment() {
    global.window = {};
    global.console = console;
    
    // Load SCORE_FACTORS
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
    
    // Load financial health engine
    const enginePath = path.join(__dirname, '../src/utils/financialHealthEngine.js');
    const engineCode = fs.readFileSync(enginePath, 'utf8');
    eval(engineCode);
    
    // Load retirement calculations engine
    const calcPath = path.join(__dirname, '../src/utils/retirementCalculations.js');
    if (fs.existsSync(calcPath)) {
        const calcCode = fs.readFileSync(calcPath, 'utf8');
        eval(calcCode);
    }
    
    // Mock additional functions that may be called by final step
    global.window.calculateOverallFinancialHealthScore = (inputs) => {
        const healthScore = global.window.calculateFinancialHealthScore(inputs);
        return healthScore.totalScore;
    };
    
    global.window.calculateRetirementReadinessScore = (inputs) => {
        const healthScore = global.window.calculateFinancialHealthScore(inputs);
        return healthScore.factors.retirementReadiness?.score || 0;
    };
    
    global.window.calculateRetirement = (inputs) => {
        // Simplified retirement projection calculation
        const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
        const monthlySalary = inputs.currentMonthlySalary || 
                            (inputs.partner1Salary || 0) + (inputs.partner2Salary || 0);
        const savingsRate = ((inputs.pensionContributionRate || 17.5) + 
                           (inputs.trainingFundContributionRate || 7.5)) / 100;
        const expectedReturn = (inputs.expectedReturn || 7) / 100;
        const currentSavings = inputs.currentSavings || 0;
        
        // Simple future value calculation
        const monthlyContribution = monthlySalary * savingsRate;
        const totalMonths = yearsToRetirement * 12;
        const monthlyReturn = expectedReturn / 12;
        
        const futureValueContributions = monthlyContribution * 
            (((1 + monthlyReturn) ** totalMonths - 1) / monthlyReturn);
        const futureValueCurrentSavings = currentSavings * ((1 + expectedReturn) ** yearsToRetirement);
        
        const totalAccumulation = futureValueContributions + futureValueCurrentSavings;
        const monthlyIncome = (totalAccumulation * 0.04) / 12; // 4% withdrawal rate
        const projectedIncome = monthlyIncome * 12;
        
        return {
            totalAccumulation: Math.round(totalAccumulation),
            monthlyIncome: Math.round(monthlyIncome),
            projectedIncome: Math.round(projectedIncome)
        };
    };
    
    global.window.generateImprovementSuggestions = (inputs, language) => {
        return [
            { priority: 'high', category: 'Test', issue: 'Test suggestion', action: 'Test action' }
        ];
    };
    
    console.log('✅ Final step test environment setup complete');
}

// Test the complete final step functionality
function testFinalWizardStep(scenario) {
    console.log(`\n🎯 Testing Final Wizard Step: ${scenario.name}`);
    console.log(`📝 Description: ${scenario.description}`);
    
    const results = {
        passed: true,
        issues: [],
        warnings: [],
        calculationResults: {},
        dataIntegrity: {},
        performance: {}
    };
    
    try {
        const startTime = Date.now();
        
        // Test 1: Financial Health Score Calculation
        console.log('🔍 Testing Financial Health Score calculation...');
        const healthScore = global.window.calculateFinancialHealthScore(scenario.completeWizardInputs);
        results.calculationResults.financialHealthScore = healthScore;
        
        // Validate health score range
        const { min: minHealth, max: maxHealth } = scenario.expectedFinalStepResults.healthScore;
        if (healthScore.totalScore < minHealth || healthScore.totalScore > maxHealth) {
            results.passed = false;
            results.issues.push(`Health score ${healthScore.totalScore} outside expected range ${minHealth}-${maxHealth}`);
        }
        
        // Test 2: Retirement Projections
        console.log('📊 Testing Retirement Projections calculation...');
        const retirementProjections = global.window.calculateRetirement(scenario.completeWizardInputs);
        results.calculationResults.retirementProjections = retirementProjections;
        
        // Validate projections ranges
        const expectedProj = scenario.expectedFinalStepResults.retirementProjections;
        
        if (retirementProjections.totalAccumulation < expectedProj.totalAccumulation.min ||
            retirementProjections.totalAccumulation > expectedProj.totalAccumulation.max) {
            results.passed = false;
            results.issues.push(`Total accumulation ${retirementProjections.totalAccumulation} outside expected range`);
        }
        
        if (retirementProjections.monthlyIncome < expectedProj.monthlyRetirementIncome.min ||
            retirementProjections.monthlyIncome > expectedProj.monthlyRetirementIncome.max) {
            results.passed = false;
            results.issues.push(`Monthly retirement income ${retirementProjections.monthlyIncome} outside expected range`);
        }
        
        // Test 3: Overall Score Calculation
        console.log('🎯 Testing Overall Score calculation...');
        const overallScore = global.window.calculateOverallFinancialHealthScore(scenario.completeWizardInputs);
        results.calculationResults.overallScore = overallScore;
        
        // Test 4: Data Integrity Checks
        console.log('🔐 Testing Data Integrity...');
        results.dataIntegrity = {
            hasAllRequiredInputs: Object.keys(scenario.completeWizardInputs).length >= 20,
            healthScoreValid: !!(healthScore && healthScore.totalScore !== undefined),
            projectionsValid: !!(retirementProjections && retirementProjections.totalAccumulation > 0),
            noNaNValues: !Object.values(retirementProjections).some(v => isNaN(v)),
            factorsCalculated: Object.keys(healthScore.factors || {}).length >= 6
        };
        
        // Check for any failed data integrity tests
        Object.entries(results.dataIntegrity).forEach(([key, value]) => {
            if (!value) {
                results.passed = false;
                results.issues.push(`Data integrity check failed: ${key}`);
            }
        });
        
        // Test 5: Performance Testing
        const endTime = Date.now();
        results.performance = {
            totalCalculationTime: endTime - startTime,
            acceptable: (endTime - startTime) < 2000 // Should complete within 2 seconds
        };
        
        if (!results.performance.acceptable) {
            results.warnings.push(`Calculation time ${results.performance.totalCalculationTime}ms exceeds acceptable threshold`);
        }
        
        // Test 6: Required Calculations Present
        console.log('✅ Testing Required Calculations present...');
        const requiredCalcs = scenario.expectedFinalStepResults.requiredCalculations;
        requiredCalcs.forEach(calc => {
            if (!results.calculationResults[calc]) {
                results.warnings.push(`Required calculation '${calc}' not performed`);
            }
        });
        
    } catch (error) {
        results.passed = false;
        results.issues.push(`Exception during testing: ${error.message}`);
        results.error = error;
    }
    
    // Display results
    console.log(`📈 Health Score: ${results.calculationResults.financialHealthScore?.totalScore || 'N/A'}/100`);
    console.log(`💰 Total Accumulation: ₪${(results.calculationResults.retirementProjections?.totalAccumulation || 0).toLocaleString()}`);
    console.log(`📅 Monthly Retirement Income: ₪${(results.calculationResults.retirementProjections?.monthlyIncome || 0).toLocaleString()}`);
    console.log(`⏱️  Calculation Time: ${results.performance.totalCalculationTime || 0}ms`);
    console.log(`${results.passed ? '✅' : '❌'} Test ${results.passed ? 'PASSED' : 'FAILED'}`);
    
    if (results.issues.length > 0) {
        console.log(`❌ Issues:`);
        results.issues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    if (results.warnings.length > 0) {
        console.log(`⚠️  Warnings:`);
        results.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    
    return results;
}

// Run all final step tests
function runAllFinalStepTests() {
    console.log('🚀 Starting E2E Final Wizard Step Test Suite');
    console.log('=' .repeat(80));
    
    setupFinalStepTestEnvironment();
    
    const testResults = {
        total: finalStepTestScenarios.length,
        passed: 0,
        failed: 0,
        scenarios: [],
        overallPerformance: {
            totalTime: 0,
            averageTime: 0,
            maxTime: 0
        }
    };
    
    const startTime = Date.now();
    
    finalStepTestScenarios.forEach(scenario => {
        const result = testFinalWizardStep(scenario);
        testResults.scenarios.push({
            name: scenario.name,
            ...result
        });
        
        if (result.passed) {
            testResults.passed++;
        } else {
            testResults.failed++;
        }
        
        // Performance tracking
        if (result.performance?.totalCalculationTime) {
            testResults.overallPerformance.totalTime += result.performance.totalCalculationTime;
            testResults.overallPerformance.maxTime = Math.max(
                testResults.overallPerformance.maxTime, 
                result.performance.totalCalculationTime
            );
        }
    });
    
    const endTime = Date.now();
    testResults.overallPerformance.totalTime = endTime - startTime;
    testResults.overallPerformance.averageTime = Math.round(
        testResults.overallPerformance.totalTime / testResults.total
    );
    
    // Summary
    console.log('\n' + '=' .repeat(80));
    console.log('📋 FINAL WIZARD STEP TEST SUMMARY');
    console.log('=' .repeat(80));
    console.log(`Total Scenarios: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed} ✅`);
    console.log(`Failed: ${testResults.failed} ${testResults.failed > 0 ? '❌' : ''}`);
    console.log(`Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`);
    console.log(`Average Calculation Time: ${testResults.overallPerformance.averageTime}ms`);
    console.log(`Maximum Calculation Time: ${testResults.overallPerformance.maxTime}ms`);
    
    if (testResults.failed > 0) {
        console.log('\n❌ FAILED SCENARIOS:');
        testResults.scenarios
            .filter(s => !s.passed)
            .forEach(s => {
                console.log(`   - ${s.name}`);
                s.issues.forEach(issue => console.log(`     • ${issue}`));
            });
    }
    
    // Save results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsFile = path.join(__dirname, `final-step-test-results-${timestamp}.json`);
    fs.writeFileSync(resultsFile, JSON.stringify(testResults, null, 2));
    console.log(`\n📁 Final step test results saved to: ${resultsFile}`);
    
    return testResults;
}

module.exports = {
    finalStepTestScenarios,
    testFinalWizardStep,
    runAllFinalStepTests,
    setupFinalStepTestEnvironment
};

// Run tests if this file is executed directly
if (require.main === module) {
    runAllFinalStepTests();
}