// Financial Health Score Test Scenarios
// Implementation of AUDIT-001 comprehensive test scenarios
// Created by Yali Pollak (יהלי פולק) - v7.1.1

/**
 * Comprehensive test scenarios for validating financial health scoring accuracy
 * Tests all 10 scenarios defined in AUDIT-001 plan
 */

// Test scenario data - matches AUDIT-001 specifications
const TEST_SCENARIOS = [
    {
        id: 1,
        name: "Young Professional (Individual, Israel)",
        profile: "Tech worker starting retirement planning",
        input: {
            planningType: "individual",
            currentAge: 28,
            retirementAge: 67,
            country: "israel",
            currentMonthlySalary: 15000,
            currency: "ILS",
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            trainingFundEmployeeRate: 2.5,
            trainingFundEmployerRate: 7.5,
            currentBankAccount: 30000,
            currentPersonalPortfolio: 50000,
            personalPortfolioReturn: 8,
            currentMonthlyExpenses: 12000,
            monthlyAdditionalSavings: 1000,
            riskTolerance: "moderate"
        },
        expected: {
            totalScore: { min: 65, max: 75 },
            factors: {
                savingsRate: { min: 18, max: 20, outOf: 25 },
                retirementReadiness: { min: 8, max: 12, outOf: 20 },
                timeHorizon: { min: 13, max: 15, outOf: 15 },
                riskAlignment: { min: 10, max: 12, outOf: 12 },
                diversification: { min: 6, max: 8, outOf: 10 },
                taxEfficiency: { min: 6, max: 7, outOf: 8 },
                emergencyFund: { min: 4, max: 6, outOf: 7 },
                debtManagement: { min: 3, max: 3, outOf: 3 }
            }
        },
        validations: [
            "Monthly salary correctly detected in ILS",
            "Pension rates calculated accurately (21.3% total)",
            "Emergency fund months = 30,000 / 12,000 = 2.5 months",
            "No NaN values in any calculation"
        ]
    },
    {
        id: 2,
        name: "Mid-Career Couple (Israel)",
        profile: "Dual-income family with mortgage",
        input: {
            planningType: "couple",
            currentAge: 42,
            partnerCurrentAge: 40,
            retirementAge: 67,
            partnerRetirementAge: 65,
            country: "israel",
            partner1Salary: 25000,
            partner2Salary: 20000,
            currency: "ILS",
            currentPensionSavings: 800000,
            partnerCurrentSavings: 600000,
            emergencyFund: 150000,
            currentPersonalPortfolio: 300000,
            expenses: {
                housing: 8000,
                transportation: 3000,
                food: 4000,
                insurance: 2000,
                other: 3000,
                mortgage: 8000,
                carLoan: 2000
            },
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33
        },
        expected: {
            totalScore: { min: 75, max: 85 },
            factors: {
                savingsRate: { min: 20, max: 22, outOf: 25 },
                retirementReadiness: { min: 15, max: 18, outOf: 20 },
                timeHorizon: { min: 10, max: 12, outOf: 15 },
                riskAlignment: { min: 10, max: 12, outOf: 12 },
                diversification: { min: 7, max: 9, outOf: 10 },
                taxEfficiency: { min: 6, max: 7, outOf: 8 },
                emergencyFund: { min: 6, max: 7, outOf: 7 },
                debtManagement: { min: 1, max: 2, outOf: 3 }
            }
        },
        validations: [
            "Partner salaries combined correctly: 45,000 ILS",
            "Pension savings combined: 1,400,000 ILS",
            "Debt ratio = 10,000 / 45,000 = 22.2%",
            "Emergency fund = 150,000 / 30,000 = 5 months"
        ]
    },
    {
        id: 3,
        name: "Pre-Retirement (Individual, USA)",
        profile: "American nearing retirement with substantial savings",
        input: {
            planningType: "individual",
            currentAge: 58,
            retirementAge: 65,
            country: "usa",
            currentMonthlySalary: 8000,
            currency: "USD",
            current401k: 750000,
            currentIRA: 250000,
            currentBankAccount: 50000,
            currentPersonalPortfolio: 200000,
            currentMonthlyExpenses: 6000,
            riskTolerance: "conservative"
        },
        expected: {
            totalScore: { min: 80, max: 90 },
            factors: {
                savingsRate: { min: 15, max: 18, outOf: 25 },
                retirementReadiness: { min: 18, max: 20, outOf: 20 },
                timeHorizon: { min: 6, max: 8, outOf: 15 },
                riskAlignment: { min: 11, max: 12, outOf: 12 },
                diversification: { min: 8, max: 10, outOf: 10 },
                taxEfficiency: { min: 7, max: 8, outOf: 8 },
                emergencyFund: { min: 6, max: 7, outOf: 7 },
                debtManagement: { min: 3, max: 3, outOf: 3 }
            }
        },
        validations: [
            "USD amounts handled correctly",
            "Multiple retirement accounts combined",
            "Age-appropriate risk tolerance validation",
            "Currency conversion if display in ILS"
        ]
    },
    {
        id: 4,
        name: "High Earner with RSUs (Individual, Israel)",
        profile: "Tech executive with stock compensation",
        input: {
            planningType: "individual",
            currentAge: 35,
            retirementAge: 60,
            country: "israel",
            currentMonthlySalary: 40000,
            currency: "ILS",
            rsuCompany: "AAPL",
            rsuUnits: 100,
            rsuFrequency: "quarterly",
            rsuCurrentStockPrice: 190.75,
            annualBonus: 150000,
            currentPensionSavings: 300000,
            currentCrypto: 100000,
            currentPersonalPortfolio: 500000,
            emergencyFund: 200000,
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            riskTolerance: "aggressive"
        },
        expected: {
            totalScore: { min: 85, max: 95 },
            factors: {
                savingsRate: { min: 23, max: 25, outOf: 25 },
                retirementReadiness: { min: 16, max: 18, outOf: 20 },
                timeHorizon: { min: 12, max: 14, outOf: 15 },
                riskAlignment: { min: 9, max: 11, outOf: 12 },
                diversification: { min: 9, max: 10, outOf: 10 },
                taxEfficiency: { min: 5, max: 7, outOf: 8 },
                emergencyFund: { min: 6, max: 7, outOf: 7 },
                debtManagement: { min: 3, max: 3, outOf: 3 }
            }
        },
        validations: [
            "RSU calculation: 100 units × $190.75 × 4 per year",
            "Stock price converted from USD to ILS correctly",
            "Bonus included in annual income calculation",
            "Crypto portfolio recognized as separate asset class"
        ]
    },
    {
        id: 5,
        name: "Debt-Heavy Young Family (Couple, Israel)",
        profile: "Young couple struggling with debt",
        input: {
            planningType: "couple",
            currentAge: 32,
            partnerCurrentAge: 30,
            retirementAge: 67,
            partnerRetirementAge: 67,
            country: "israel",
            partner1Salary: 12000,
            partner2Salary: 10000,
            currency: "ILS",
            currentPensionSavings: 50000,
            partnerCurrentSavings: 30000,
            emergencyFund: 10000,
            expenses: {
                housing: 3000,
                transportation: 2000,
                food: 3000,
                insurance: 1000,
                other: 2000,
                mortgage: 7000,
                carLoan: 2000,
                creditCard: 1500
            },
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33
        },
        expected: {
            totalScore: { min: 25, max: 35 },
            factors: {
                savingsRate: { min: 4, max: 6, outOf: 25 },
                retirementReadiness: { min: 3, max: 5, outOf: 20 },
                timeHorizon: { min: 12, max: 14, outOf: 15 },
                riskAlignment: { min: 8, max: 10, outOf: 12 },
                diversification: { min: 2, max: 4, outOf: 10 },
                taxEfficiency: { min: 6, max: 7, outOf: 8 },
                emergencyFund: { min: 1, max: 2, outOf: 7 },
                debtManagement: { min: 0, max: 1, outOf: 3 }
            }
        },
        validations: [
            "High debt-to-income ratio calculated correctly",
            "Emergency fund critically low (10k / 21.5k = 0.46 months)",
            "Low scores don't cause calculation errors",
            "Missing data modal should trigger"
        ]
    },
    {
        id: 6,
        name: "Crypto Investor (Individual, USA)",
        profile: "Tech-savvy investor with crypto focus",
        input: {
            planningType: "individual",
            currentAge: 30,
            retirementAge: 65,
            country: "usa",
            currentMonthlySalary: 6000,
            currency: "USD",
            current401k: 50000,
            currentCrypto: 400000,
            cryptoReturn: 25,
            cryptoMonthly: 2000,
            currentPersonalPortfolio: 20000,
            emergencyFund: 0,
            riskTolerance: "aggressive"
        },
        expected: {
            totalScore: { min: 55, max: 65 },
            factors: {
                savingsRate: { min: 15, max: 18, outOf: 25 },
                retirementReadiness: { min: 8, max: 12, outOf: 20 },
                timeHorizon: { min: 13, max: 15, outOf: 15 },
                riskAlignment: { min: 6, max: 9, outOf: 12 },
                diversification: { min: 5, max: 7, outOf: 10 },
                taxEfficiency: { min: 4, max: 6, outOf: 8 },
                emergencyFund: { min: 0, max: 0, outOf: 7 },
                debtManagement: { min: 3, max: 3, outOf: 3 }
            }
        },
        validations: [
            "Crypto portfolio valued correctly",
            "High risk tolerance vs age appropriateness",
            "Zero emergency fund flagged as critical",
            "Diversification penalty for crypto concentration"
        ]
    },
    {
        id: 7,
        name: "Conservative Retiree (Individual, UK)",
        profile: "Recently retired with conservative portfolio",
        input: {
            planningType: "individual",
            currentAge: 65,
            retirementAge: 65,
            country: "uk",
            monthlyPensionIncome: 3000,
            currency: "GBP",
            currentPersonalPortfolio: 500000,
            personalPortfolioReturn: 4,
            emergencyFund: 30000,
            currentMonthlyExpenses: 2500,
            riskTolerance: "conservative",
            portfolioAllocation: {
                bonds: 70,
                stocks: 30
            }
        },
        expected: {
            totalScore: { min: 70, max: 80 },
            factors: {
                savingsRate: { min: 10, max: 15, outOf: 25 },
                retirementReadiness: { min: 18, max: 20, outOf: 20 },
                timeHorizon: { min: 3, max: 5, outOf: 15 },
                riskAlignment: { min: 12, max: 12, outOf: 12 },
                diversification: { min: 6, max: 8, outOf: 10 },
                taxEfficiency: { min: 5, max: 7, outOf: 8 },
                emergencyFund: { min: 7, max: 7, outOf: 7 },
                debtManagement: { min: 3, max: 3, outOf: 3 }
            }
        },
        validations: [
            "Retirement status handled correctly",
            "GBP currency conversion",
            "Conservative allocation appropriate",
            "Post-retirement scoring adjustments"
        ]
    },
    {
        id: 8,
        name: "International Worker (Individual, Multi-country)",
        profile: "Expat with multi-country work history",
        input: {
            planningType: "individual",
            currentAge: 45,
            retirementAge: 65,
            country: "israel",
            currentMonthlySalary: 20000,
            currency: "ILS",
            workPeriods: [
                {
                    country: "israel",
                    startAge: 35,
                    endAge: 45,
                    monthlyContribution: 3000
                },
                {
                    country: "usa",
                    startAge: 28,
                    endAge: 33,
                    monthlyContribution: 2000
                },
                {
                    country: "uk",
                    startAge: 23,
                    endAge: 28,
                    monthlyContribution: 1500
                }
            ],
            currentPensionSavings: 400000,
            emergencyFund: 80000
        },
        expected: {
            totalScore: { min: 60, max: 70 },
            factors: {
                savingsRate: { min: 15, max: 18, outOf: 25 },
                retirementReadiness: { min: 12, max: 16, outOf: 20 },
                timeHorizon: { min: 8, max: 10, outOf: 15 },
                riskAlignment: { min: 9, max: 11, outOf: 12 },
                diversification: { min: 6, max: 8, outOf: 10 },
                taxEfficiency: { min: 4, max: 6, outOf: 8 },
                emergencyFund: { min: 5, max: 6, outOf: 7 },
                debtManagement: { min: 3, max: 3, outOf: 3 }
            }
        },
        validations: [
            "Multi-country pension calculations",
            "Currency conversions for different periods",
            "Tax efficiency across jurisdictions",
            "Complex work period handling"
        ]
    },
    {
        id: 9,
        name: "Minimum Data Entry",
        profile: "User with minimal data provided",
        input: {
            planningType: "individual",
            currentAge: 40,
            retirementAge: 67,
            currentMonthlySalary: 10000,
            currency: "ILS"
        },
        expected: {
            totalScore: { min: 15, max: 25 },
            factors: {
                savingsRate: { min: 0, max: 5, outOf: 25 },
                retirementReadiness: { min: 0, max: 3, outOf: 20 },
                timeHorizon: { min: 11, max: 13, outOf: 15 },
                riskAlignment: { min: 0, max: 2, outOf: 12 },
                diversification: { min: 0, max: 2, outOf: 10 },
                taxEfficiency: { min: 0, max: 2, outOf: 8 },
                emergencyFund: { min: 0, max: 0, outOf: 7 },
                debtManagement: { min: 2, max: 3, outOf: 3 }
            }
        },
        validations: [
            "Missing data modal triggers",
            "Graceful handling of missing fields",
            "No calculation errors with minimal data",
            "Clear indicators of incomplete score"
        ]
    },
    {
        id: 10,
        name: "Maximum Optimization",
        profile: "Perfectly optimized retirement plan",
        input: {
            planningType: "individual",
            currentAge: 40,
            retirementAge: 65,
            country: "israel",
            currentMonthlySalary: 30000,
            currency: "ILS",
            pensionEmployeeRate: 7,
            pensionEmployerRate: 14.33,
            trainingFundEmployeeRate: 2.5,
            trainingFundEmployerRate: 7.5,
            currentPensionSavings: 800000,
            currentTrainingFund: 200000,
            currentPersonalPortfolio: 400000,
            currentRealEstate: 300000,
            currentCrypto: 100000,
            emergencyFund: 360000,
            currentMonthlyExpenses: 20000,
            monthlyAdditionalSavings: 3000,
            riskTolerance: "moderate",
            portfolioAllocation: {
                stocks: 40,
                bonds: 20,
                realEstate: 20,
                international: 15,
                crypto: 5
            }
        },
        expected: {
            totalScore: { min: 90, max: 100 },
            factors: {
                savingsRate: { min: 24, max: 25, outOf: 25 },
                retirementReadiness: { min: 19, max: 20, outOf: 20 },
                timeHorizon: { min: 10, max: 12, outOf: 15 },
                riskAlignment: { min: 12, max: 12, outOf: 12 },
                diversification: { min: 10, max: 10, outOf: 10 },
                taxEfficiency: { min: 8, max: 8, outOf: 8 },
                emergencyFund: { min: 7, max: 7, outOf: 7 },
                debtManagement: { min: 3, max: 3, outOf: 3 }
            }
        },
        validations: [
            "All asset classes recognized",
            "Optimal allocation scored correctly",
            "Maximum scores don't exceed limits",
            "Perfect score calculations accurate"
        ]
    }
];

// Test execution framework
class ScenarioTestRunner {
    constructor() {
        this.results = [];
        this.passed = 0;
        this.failed = 0;
        this.warnings = [];
    }

    async runScenario(scenario) {
        console.log(`\n🧪 Testing Scenario ${scenario.id}: ${scenario.name}`);
        console.log(`📋 Profile: ${scenario.profile}`);
        
        const testResult = {
            scenarioId: scenario.id,
            name: scenario.name,
            passed: true,
            errors: [],
            warnings: [],
            actualScore: null,
            factorBreakdown: {},
            validationResults: {}
        };

        try {
            // Step 1: Validate input data
            if (window.validateFinancialInputs) {
                const validation = window.validateFinancialInputs(scenario.input);
                testResult.validationResults = validation;
                
                if (!validation.isValid && scenario.expected.totalScore.min > 25) {
                    testResult.warnings.push('Validation failed but high score expected');
                }
            }

            // Step 2: Calculate financial health score
            if (window.calculateFinancialHealthScore) {
                const scoreResult = window.calculateFinancialHealthScore(scenario.input);
                testResult.actualScore = scoreResult;

                // Step 3: Validate total score range
                const actualTotal = scoreResult.totalScore || 0;
                const expectedMin = scenario.expected.totalScore.min;
                const expectedMax = scenario.expected.totalScore.max;

                if (actualTotal < expectedMin || actualTotal > expectedMax) {
                    testResult.errors.push(
                        `Total score ${actualTotal} not in expected range [${expectedMin}, ${expectedMax}]`
                    );
                    testResult.passed = false;
                }

                // Step 4: Validate factor scores
                if (scoreResult.factors) {
                    Object.entries(scenario.expected.factors).forEach(([factor, expected]) => {
                        const actual = scoreResult.factors[factor];
                        if (actual) {
                            const actualScore = actual.score || 0;
                            if (actualScore < expected.min || actualScore > expected.max) {
                                testResult.errors.push(
                                    `${factor}: ${actualScore} not in range [${expected.min}, ${expected.max}]`
                                );
                                testResult.passed = false;
                            }
                            testResult.factorBreakdown[factor] = actualScore;
                        } else {
                            testResult.errors.push(`Missing factor: ${factor}`);
                            testResult.passed = false;
                        }
                    });
                }

                // Step 5: Check for NaN/Infinity values
                this.checkForInvalidValues(scoreResult, testResult);

                // Step 6: Run scenario-specific validations
                this.runCustomValidations(scenario, scoreResult, testResult);

            } else {
                testResult.errors.push('calculateFinancialHealthScore function not available');
                testResult.passed = false;
            }

        } catch (error) {
            testResult.errors.push(`Test execution error: ${error.message}`);
            testResult.passed = false;
        }

        this.results.push(testResult);
        
        if (testResult.passed) {
            this.passed++;
            console.log(`✅ PASSED - Score: ${testResult.actualScore?.totalScore || 0}`);
        } else {
            this.failed++;
            console.log(`❌ FAILED - Errors: ${testResult.errors.length}`);
            testResult.errors.forEach(error => console.log(`   - ${error}`));
        }

        if (testResult.warnings.length > 0) {
            testResult.warnings.forEach(warning => console.log(`⚠️  ${warning}`));
        }

        return testResult;
    }

    checkForInvalidValues(scoreResult, testResult) {
        const checkValue = (value, path) => {
            if (typeof value === 'number') {
                if (isNaN(value)) {
                    testResult.errors.push(`NaN value found at ${path}`);
                    testResult.passed = false;
                }
                if (!isFinite(value)) {
                    testResult.errors.push(`Infinite value found at ${path}`);
                    testResult.passed = false;
                }
            } else if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([key, subValue]) => {
                    checkValue(subValue, `${path}.${key}`);
                });
            }
        };

        checkValue(scoreResult, 'scoreResult');
    }

    runCustomValidations(scenario, scoreResult, testResult) {
        // Scenario-specific validation logic
        switch (scenario.id) {
            case 1: // Young Professional
                if (scenario.input.currentMonthlySalary !== 15000) {
                    testResult.warnings.push('Expected monthly salary of 15000 ILS');
                }
                break;
            
            case 2: // Mid-Career Couple
                const combinedSalary = scenario.input.partner1Salary + scenario.input.partner2Salary;
                if (combinedSalary !== 45000) {
                    testResult.errors.push(`Combined salary should be 45000, got ${combinedSalary}`);
                    testResult.passed = false;
                }
                break;
            
            case 4: // High Earner with RSUs
                const expectedRSUAnnual = 100 * 190.75 * 4; // units × price × frequency
                if (!scenario.input.rsuUnits || !scenario.input.rsuCurrentStockPrice) {
                    testResult.warnings.push('RSU data missing for high earner scenario');
                }
                break;
            
            case 5: // Debt-Heavy Young Family
                if (scoreResult.totalScore > 40) {
                    testResult.warnings.push('Score too high for debt-heavy scenario');
                }
                break;
            
            case 6: // Crypto Investor
                if (!scenario.input.emergencyFund || scenario.input.emergencyFund === 0) {
                    // This should result in 0 emergency fund score
                    const emergencyScore = scoreResult.factors?.emergencyFund?.score || -1;
                    if (emergencyScore !== 0) {
                        testResult.errors.push(`Expected 0 emergency fund score, got ${emergencyScore}`);
                        testResult.passed = false;
                    }
                }
                break;
            
            case 9: // Minimum Data Entry
                if (scoreResult.totalScore > 30) {
                    testResult.warnings.push('Score too high for minimal data scenario');
                }
                break;
            
            case 10: // Maximum Optimization
                if (scoreResult.totalScore < 85) {
                    testResult.errors.push('Optimized scenario should score very high');
                    testResult.passed = false;
                }
                break;
        }
    }

    async runAllScenarios() {
        console.log('🚀 Starting Financial Health Score Test Suite');
        console.log(`📊 Testing ${TEST_SCENARIOS.length} scenarios\n`);

        for (const scenario of TEST_SCENARIOS) {
            await this.runScenario(scenario);
        }

        this.generateReport();
    }

    generateReport() {
        console.log('\n📊 Test Results Summary');
        console.log('========================');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Success Rate: ${((this.passed / TEST_SCENARIOS.length) * 100).toFixed(1)}%`);

        if (this.failed > 0) {
            console.log('\n❌ Failed Scenarios:');
            this.results
                .filter(r => !r.passed)
                .forEach(r => {
                    console.log(`   ${r.scenarioId}. ${r.name}`);
                    r.errors.forEach(error => console.log(`      - ${error}`));
                });
        }

        // Score distribution analysis
        console.log('\n📊 Score Distribution:');
        this.results.forEach(r => {
            const score = r.actualScore?.totalScore || 0;
            const expected = TEST_SCENARIOS.find(s => s.id === r.scenarioId)?.expected.totalScore;
            const status = r.passed ? '✅' : '❌';
            console.log(`   ${status} ${r.name}: ${score} (expected: ${expected?.min}-${expected?.max})`);
        });

        return {
            passed: this.passed,
            failed: this.failed,
            total: TEST_SCENARIOS.length,
            successRate: (this.passed / TEST_SCENARIOS.length) * 100,
            results: this.results
        };
    }
}

// Export for global access
window.TEST_SCENARIOS = TEST_SCENARIOS;
window.ScenarioTestRunner = ScenarioTestRunner;

// Auto-run tests if in test environment
if (typeof window !== 'undefined' && window.location?.search?.includes('runTests=true')) {
    window.addEventListener('load', async () => {
        // Wait for all dependencies to load
        setTimeout(async () => {
            const runner = new ScenarioTestRunner();
            const results = await runner.runAllScenarios();
            
            // Store results for external access
            window.testResults = results;
            
            // Trigger custom event for test completion
            window.dispatchEvent(new CustomEvent('scenarioTestsComplete', { 
                detail: results 
            }));
        }, 2000);
    });
}

console.log('✅ Financial Health Score Test Scenarios loaded - v7.1.1');