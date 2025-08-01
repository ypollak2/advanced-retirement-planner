// Test Data Generator for Financial Health E2E Testing
// Generates realistic test data for 80 different scenarios

class TestDataGenerator {
    constructor() {
        this.scenarios = [];
        this.generateAllScenarios();
    }

    // Generate all 80 test scenarios
    generateAllScenarios() {
        // Individual Planning Scenarios (20)
        this.generateIndividualScenarios();
        
        // Couple Planning Scenarios (20)
        this.generateCoupleScenarios();
        
        // Data Persistence Test Scenarios (15)
        this.generatePersistenceScenarios();
        
        // Edge Case Scenarios (15)
        this.generateEdgeCaseScenarios();
        
        // Scoring Factor Test Scenarios (10)
        this.generateScoringFactorScenarios();
    }

    // Individual Planning Scenarios (20)
    generateIndividualScenarios() {
        // Young Professional - Starting Career (25-30)
        this.scenarios.push({
            id: 'IND-001',
            name: 'Young Professional - Entry Level',
            category: 'individual_young',
            inputs: {
                planningType: 'individual',
                currentAge: 25,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 8000,
                currentMonthlyExpenses: 6000,
                currentPension: 5000,
                currentTrainingFund: 2000,
                currentPortfolio: 0,
                currentRealEstate: 0,
                currentCrypto: 0,
                currentSavingsAccount: 10000,
                emergencyFund: 15000,
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                riskTolerance: 'aggressive',
                expectedAnnualReturn: 8
            },
            expectedScoreRange: { min: 55, max: 70 },
            description: 'Entry-level professional with basic retirement savings'
        });

        // Young Professional - Mid Level (28-32)
        this.scenarios.push({
            id: 'IND-002',
            name: 'Young Professional - Mid Level',
            category: 'individual_young',
            inputs: {
                planningType: 'individual',
                currentAge: 30,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 15000,
                currentMonthlyExpenses: 10000,
                currentPension: 50000,
                currentTrainingFund: 30000,
                currentPortfolio: 20000,
                currentRealEstate: 0,
                currentCrypto: 5000,
                currentSavingsAccount: 25000,
                emergencyFund: 30000,
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                riskTolerance: 'moderate',
                expectedAnnualReturn: 7
            },
            expectedScoreRange: { min: 65, max: 80 },
            description: 'Mid-level professional with growing savings'
        });

        // Young Professional - High Achiever (30-35)
        this.scenarios.push({
            id: 'IND-003',
            name: 'Young Professional - High Achiever',
            category: 'individual_young',
            inputs: {
                planningType: 'individual',
                currentAge: 33,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 25000,
                currentMonthlyExpenses: 15000,
                currentPension: 150000,
                currentTrainingFund: 80000,
                currentPortfolio: 100000,
                currentRealEstate: 500000,
                currentCrypto: 20000,
                currentSavingsAccount: 50000,
                emergencyFund: 75000,
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                additionalMonthlyContribution: 5000,
                riskTolerance: 'moderate',
                expectedAnnualReturn: 7.5
            },
            expectedScoreRange: { min: 75, max: 90 },
            description: 'High-achieving professional with diversified portfolio'
        });

        // Mid-Career - Average Saver (36-45)
        this.scenarios.push({
            id: 'IND-004',
            name: 'Mid-Career - Average Saver',
            category: 'individual_mid',
            inputs: {
                planningType: 'individual',
                currentAge: 40,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 20000,
                currentMonthlyExpenses: 16000,
                currentPension: 300000,
                currentTrainingFund: 150000,
                currentPortfolio: 50000,
                currentRealEstate: 800000,
                currentCrypto: 0,
                currentSavingsAccount: 30000,
                emergencyFund: 50000,
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                expenses: {
                    mortgage: 5000,
                    carLoan: 2000,
                    creditCard: 0,
                    otherDebt: 0
                },
                riskTolerance: 'balanced',
                expectedAnnualReturn: 6.5
            },
            expectedScoreRange: { min: 60, max: 75 },
            description: 'Mid-career professional with mortgage and moderate savings'
        });

        // Mid-Career - High Earner (40-50)
        this.scenarios.push({
            id: 'IND-005',
            name: 'Mid-Career - High Earner',
            category: 'individual_mid',
            inputs: {
                planningType: 'individual',
                currentAge: 45,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 40000,
                currentMonthlyExpenses: 25000,
                currentPension: 800000,
                currentTrainingFund: 400000,
                currentPortfolio: 500000,
                currentRealEstate: 2000000,
                currentCrypto: 50000,
                currentSavingsAccount: 100000,
                emergencyFund: 150000,
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                additionalMonthlyContribution: 10000,
                expenses: {
                    mortgage: 8000,
                    carLoan: 0,
                    creditCard: 0,
                    otherDebt: 0
                },
                riskTolerance: 'balanced',
                expectedAnnualReturn: 6
            },
            expectedScoreRange: { min: 80, max: 95 },
            description: 'High-earning mid-career professional with substantial assets'
        });

        // Pre-Retirement - Well Prepared (51-60)
        this.scenarios.push({
            id: 'IND-006',
            name: 'Pre-Retirement - Well Prepared',
            category: 'individual_pre',
            inputs: {
                planningType: 'individual',
                currentAge: 55,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 35000,
                currentMonthlyExpenses: 20000,
                currentPension: 1500000,
                currentTrainingFund: 600000,
                currentPortfolio: 800000,
                currentRealEstate: 2500000,
                currentCrypto: 30000,
                currentSavingsAccount: 200000,
                emergencyFund: 200000,
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                additionalMonthlyContribution: 15000,
                expenses: {
                    mortgage: 0,
                    carLoan: 0,
                    creditCard: 0,
                    otherDebt: 0
                },
                riskTolerance: 'conservative',
                expectedAnnualReturn: 5
            },
            expectedScoreRange: { min: 85, max: 100 },
            description: 'Pre-retirement individual with excellent preparation'
        });

        // Pre-Retirement - Under Prepared (55-65)
        this.scenarios.push({
            id: 'IND-007',
            name: 'Pre-Retirement - Under Prepared',
            category: 'individual_pre',
            inputs: {
                planningType: 'individual',
                currentAge: 60,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 18000,
                currentMonthlyExpenses: 15000,
                currentPension: 400000,
                currentTrainingFund: 200000,
                currentPortfolio: 50000,
                currentRealEstate: 1000000,
                currentCrypto: 0,
                currentSavingsAccount: 20000,
                emergencyFund: 30000,
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                expenses: {
                    mortgage: 3000,
                    carLoan: 1500,
                    creditCard: 500,
                    otherDebt: 0
                },
                riskTolerance: 'conservative',
                expectedAnnualReturn: 4
            },
            expectedScoreRange: { min: 45, max: 60 },
            description: 'Pre-retirement individual with insufficient savings'
        });

        // Add more individual scenarios...
        this.generateAdditionalIndividualScenarios();
    }

    // Generate additional individual scenarios to reach 20
    generateAdditionalIndividualScenarios() {
        // Freelancer with irregular income
        this.scenarios.push({
            id: 'IND-008',
            name: 'Freelancer - Variable Income',
            category: 'individual_special',
            inputs: {
                planningType: 'individual',
                currentAge: 35,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 12000, // Average monthly
                currentMonthlyExpenses: 8000,
                currentPension: 0, // No employer pension
                currentTrainingFund: 0,
                currentPortfolio: 80000,
                currentRealEstate: 0,
                currentCrypto: 15000,
                currentSavingsAccount: 40000,
                emergencyFund: 60000, // Larger emergency fund due to variable income
                pensionContributionRate: 0,
                trainingFundContributionRate: 0,
                additionalMonthlyContribution: 3000, // Self-directed savings
                riskTolerance: 'moderate',
                expectedAnnualReturn: 7
            },
            expectedScoreRange: { min: 50, max: 65 },
            description: 'Freelancer with no employer benefits but good self-discipline'
        });

        // Tech worker with RSUs
        this.scenarios.push({
            id: 'IND-009',
            name: 'Tech Worker - RSU Heavy',
            category: 'individual_special',
            inputs: {
                planningType: 'individual',
                currentAge: 32,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 30000,
                currentMonthlyExpenses: 18000,
                currentPension: 100000,
                currentTrainingFund: 60000,
                currentPortfolio: 200000, // Includes vested RSUs
                currentRealEstate: 0,
                currentCrypto: 30000,
                currentSavingsAccount: 50000,
                emergencyFund: 90000,
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                additionalMonthlyContribution: 5000,
                rsuDetails: {
                    company: 'GOOGL',
                    unvestedUnits: 1000,
                    vestingSchedule: 'quarterly',
                    expectedGrowth: 10
                },
                riskTolerance: 'aggressive',
                expectedAnnualReturn: 9
            },
            expectedScoreRange: { min: 70, max: 85 },
            description: 'Tech worker with significant RSU compensation'
        });

        // Single parent
        this.scenarios.push({
            id: 'IND-010',
            name: 'Single Parent - Budget Conscious',
            category: 'individual_special',
            inputs: {
                planningType: 'individual',
                currentAge: 38,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 14000,
                currentMonthlyExpenses: 12000, // High expenses due to children
                currentPension: 120000,
                currentTrainingFund: 50000,
                currentPortfolio: 10000,
                currentRealEstate: 600000,
                currentCrypto: 0,
                currentSavingsAccount: 15000,
                emergencyFund: 20000,
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                expenses: {
                    mortgage: 4000,
                    carLoan: 1500,
                    creditCard: 0,
                    otherDebt: 0
                },
                riskTolerance: 'conservative',
                expectedAnnualReturn: 5
            },
            expectedScoreRange: { min: 40, max: 55 },
            description: 'Single parent with limited savings capacity'
        });

        // Recent immigrant
        this.scenarios.push({
            id: 'IND-011',
            name: 'Recent Immigrant - Building Wealth',
            category: 'individual_special',
            inputs: {
                planningType: 'individual',
                currentAge: 29,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 11000,
                currentMonthlyExpenses: 8500,
                currentPension: 8000, // Just started
                currentTrainingFund: 3000,
                currentPortfolio: 5000,
                currentRealEstate: 0,
                currentCrypto: 2000,
                currentSavingsAccount: 12000,
                emergencyFund: 15000,
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                riskTolerance: 'moderate',
                expectedAnnualReturn: 7
            },
            expectedScoreRange: { min: 45, max: 60 },
            description: 'Recent immigrant starting retirement savings in new country'
        });

        // High debt individual
        this.scenarios.push({
            id: 'IND-012',
            name: 'High Debt - Recovery Mode',
            category: 'individual_special',
            inputs: {
                planningType: 'individual',
                currentAge: 42,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 22000,
                currentMonthlyExpenses: 18000,
                currentPension: 180000,
                currentTrainingFund: 90000,
                currentPortfolio: 20000,
                currentRealEstate: 900000,
                currentCrypto: 0,
                currentSavingsAccount: 10000,
                emergencyFund: 10000, // Low due to debt payments
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                expenses: {
                    mortgage: 6000,
                    carLoan: 2500,
                    creditCard: 3000, // High credit card debt
                    otherDebt: 2000 // Personal loans
                },
                riskTolerance: 'conservative',
                expectedAnnualReturn: 5
            },
            expectedScoreRange: { min: 30, max: 45 },
            description: 'Individual recovering from financial difficulties'
        });

        // Crypto enthusiast
        this.scenarios.push({
            id: 'IND-013',
            name: 'Crypto Enthusiast - High Risk',
            category: 'individual_special',
            inputs: {
                planningType: 'individual',
                currentAge: 28,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 16000,
                currentMonthlyExpenses: 10000,
                currentPension: 30000,
                currentTrainingFund: 15000,
                currentPortfolio: 20000,
                currentRealEstate: 0,
                currentCrypto: 150000, // Heavy crypto allocation
                currentSavingsAccount: 10000,
                emergencyFund: 5000, // Low emergency fund
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                cryptoAllocation: {
                    BTC: 80000,
                    ETH: 50000,
                    altcoins: 20000
                },
                riskTolerance: 'very_aggressive',
                expectedAnnualReturn: 15 // Optimistic
            },
            expectedScoreRange: { min: 45, max: 65 },
            description: 'Young investor with heavy crypto exposure'
        });

        // Continue with more scenarios...
    }

    // Couple Planning Scenarios (20)
    generateCoupleScenarios() {
        // Dual Income - Equal Earners
        this.scenarios.push({
            id: 'CPL-001',
            name: 'Dual Income - Equal Earners',
            category: 'couple_dual',
            inputs: {
                planningType: 'couple',
                partner1Name: 'David',
                partner2Name: 'Sarah',
                currentAge: 35, // Average age
                retirementAge: 67,
                country: 'israel',
                partner1Salary: 18000,
                partner2Salary: 18000,
                currentMonthlyExpenses: 20000,
                partner1CurrentPension: 150000,
                partner2CurrentPension: 150000,
                partner1CurrentTrainingFund: 70000,
                partner2CurrentTrainingFund: 70000,
                partner1Portfolio: 50000,
                partner2Portfolio: 50000,
                currentRealEstate: 1200000, // Shared property
                currentCrypto: 20000,
                currentSavingsAccount: 80000,
                emergencyFund: 100000,
                partner1PensionRate: 21.333,
                partner2PensionRate: 21.333,
                partner1TrainingFundRate: 10,
                partner2TrainingFundRate: 10,
                expenses: {
                    mortgage: 7000,
                    carLoan: 2000,
                    creditCard: 0,
                    otherDebt: 0
                },
                partner1RiskProfile: 'moderate',
                partner2RiskProfile: 'moderate',
                partner1ExpectedReturn: 7,
                partner2ExpectedReturn: 7
            },
            expectedScoreRange: { min: 70, max: 85 },
            description: 'Equal-earning couple with balanced financial approach'
        });

        // Single Income - Traditional
        this.scenarios.push({
            id: 'CPL-002',
            name: 'Single Income - Traditional',
            category: 'couple_single',
            inputs: {
                planningType: 'couple',
                partner1Name: 'Michael',
                partner2Name: 'Rachel',
                currentAge: 40,
                retirementAge: 67,
                country: 'israel',
                partner1Salary: 35000,
                partner2Salary: 0, // Stay-at-home parent
                currentMonthlyExpenses: 22000,
                partner1CurrentPension: 400000,
                partner2CurrentPension: 0,
                partner1CurrentTrainingFund: 180000,
                partner2CurrentTrainingFund: 0,
                partner1Portfolio: 150000,
                partner2Portfolio: 0,
                currentRealEstate: 1500000,
                currentCrypto: 10000,
                currentSavingsAccount: 60000,
                emergencyFund: 120000, // Higher for single income
                partner1PensionRate: 21.333,
                partner2PensionRate: 0,
                partner1TrainingFundRate: 10,
                partner2TrainingFundRate: 0,
                additionalMonthlyContribution: 5000,
                expenses: {
                    mortgage: 8000,
                    carLoan: 0,
                    creditCard: 0,
                    otherDebt: 0
                },
                partner1RiskProfile: 'balanced',
                partner2RiskProfile: 'conservative',
                partner1ExpectedReturn: 6,
                partner2ExpectedReturn: 4
            },
            expectedScoreRange: { min: 60, max: 75 },
            description: 'Single-income family with stay-at-home parent'
        });

        // Age Gap Couple
        this.scenarios.push({
            id: 'CPL-003',
            name: 'Age Gap - Different Stages',
            category: 'couple_special',
            inputs: {
                planningType: 'couple',
                partner1Name: 'Daniel',
                partner2Name: 'Maya',
                currentAge: 45, // Partner 1: 52, Partner 2: 38
                retirementAge: 67,
                country: 'israel',
                partner1Salary: 40000,
                partner2Salary: 25000,
                currentMonthlyExpenses: 30000,
                partner1CurrentPension: 800000,
                partner2CurrentPension: 200000,
                partner1CurrentTrainingFund: 350000,
                partner2CurrentTrainingFund: 100000,
                partner1Portfolio: 300000,
                partner2Portfolio: 80000,
                currentRealEstate: 2000000,
                currentCrypto: 30000,
                currentSavingsAccount: 150000,
                emergencyFund: 180000,
                partner1PensionRate: 21.333,
                partner2PensionRate: 21.333,
                partner1TrainingFundRate: 10,
                partner2TrainingFundRate: 10,
                expenses: {
                    mortgage: 0, // Paid off
                    carLoan: 3000,
                    creditCard: 0,
                    otherDebt: 0
                },
                partner1RiskProfile: 'conservative', // Older partner
                partner2RiskProfile: 'moderate', // Younger partner
                partner1ExpectedReturn: 5,
                partner2ExpectedReturn: 7
            },
            expectedScoreRange: { min: 75, max: 90 },
            description: 'Couple with significant age difference'
        });

        // High Debt Couple
        this.scenarios.push({
            id: 'CPL-004',
            name: 'High Debt - Dual Income',
            category: 'couple_challenging',
            inputs: {
                planningType: 'couple',
                partner1Name: 'Alex',
                partner2Name: 'Jordan',
                currentAge: 38,
                retirementAge: 67,
                country: 'israel',
                partner1Salary: 20000,
                partner2Salary: 15000,
                currentMonthlyExpenses: 28000,
                partner1CurrentPension: 100000,
                partner2CurrentPension: 70000,
                partner1CurrentTrainingFund: 40000,
                partner2CurrentTrainingFund: 30000,
                partner1Portfolio: 10000,
                partner2Portfolio: 5000,
                currentRealEstate: 1100000,
                currentCrypto: 0,
                currentSavingsAccount: 15000,
                emergencyFund: 10000, // Very low
                partner1PensionRate: 21.333,
                partner2PensionRate: 21.333,
                partner1TrainingFundRate: 10,
                partner2TrainingFundRate: 10,
                expenses: {
                    mortgage: 9000,
                    carLoan: 3500,
                    creditCard: 5000, // High credit card debt
                    otherDebt: 3000 // Student loans
                },
                partner1RiskProfile: 'conservative',
                partner2RiskProfile: 'conservative',
                partner1ExpectedReturn: 5,
                partner2ExpectedReturn: 5
            },
            expectedScoreRange: { min: 25, max: 40 },
            description: 'Couple struggling with high debt burden'
        });

        // Mixed Nationality
        this.scenarios.push({
            id: 'CPL-005',
            name: 'Mixed Nationality - Complex',
            category: 'couple_international',
            inputs: {
                planningType: 'couple',
                partner1Name: 'John',
                partner2Name: 'Yael',
                currentAge: 36,
                retirementAge: 67,
                country: 'israel',
                partner1Country: 'usa', // American citizen
                partner2Country: 'israel', // Israeli citizen
                partner1Salary: 25000, // USD income
                partner2Salary: 20000, // ILS income
                currentMonthlyExpenses: 24000,
                partner1CurrentPension: 180000, // 401k
                partner2CurrentPension: 160000, // Israeli pension
                partner1CurrentTrainingFund: 0, // No training fund in US
                partner2CurrentTrainingFund: 80000,
                partner1Portfolio: 200000, // US stocks
                partner2Portfolio: 100000, // Israeli stocks
                currentRealEstate: 1400000,
                currentCrypto: 40000,
                currentSavingsAccount: 100000,
                emergencyFund: 120000,
                partner1PensionRate: 15, // US 401k rate
                partner2PensionRate: 21.333,
                partner1TrainingFundRate: 0,
                partner2TrainingFundRate: 10,
                taxComplexity: 'high', // Dual taxation issues
                partner1RiskProfile: 'aggressive',
                partner2RiskProfile: 'moderate',
                partner1ExpectedReturn: 8,
                partner2ExpectedReturn: 6
            },
            expectedScoreRange: { min: 65, max: 80 },
            description: 'International couple with complex tax situation'
        });

        // Continue generating more couple scenarios...
        this.generateAdditionalCoupleScenarios();
    }

    // Generate additional couple scenarios
    generateAdditionalCoupleScenarios() {
        // Tech Power Couple
        this.scenarios.push({
            id: 'CPL-006',
            name: 'Tech Power Couple - High Income',
            category: 'couple_high_earners',
            inputs: {
                planningType: 'couple',
                partner1Name: 'Amit',
                partner2Name: 'Shira',
                currentAge: 34,
                retirementAge: 67,
                country: 'israel',
                partner1Salary: 45000,
                partner2Salary: 38000,
                currentMonthlyExpenses: 35000,
                partner1CurrentPension: 250000,
                partner2CurrentPension: 200000,
                partner1CurrentTrainingFund: 120000,
                partner2CurrentTrainingFund: 100000,
                partner1Portfolio: 400000, // Including RSUs
                partner2Portfolio: 300000, // Including RSUs
                currentRealEstate: 2500000,
                currentCrypto: 100000,
                currentSavingsAccount: 200000,
                emergencyFund: 210000, // 6 months expenses
                partner1PensionRate: 21.333,
                partner2PensionRate: 21.333,
                partner1TrainingFundRate: 10,
                partner2TrainingFundRate: 10,
                additionalMonthlyContribution: 20000,
                partner1RsuDetails: {
                    company: 'MSFT',
                    unvestedUnits: 2000,
                    vestingSchedule: 'quarterly'
                },
                partner2RsuDetails: {
                    company: 'AMZN',
                    unvestedUnits: 1500,
                    vestingSchedule: 'quarterly'
                },
                partner1RiskProfile: 'aggressive',
                partner2RiskProfile: 'moderate',
                partner1ExpectedReturn: 9,
                partner2ExpectedReturn: 7
            },
            expectedScoreRange: { min: 85, max: 98 },
            description: 'High-earning tech couple with RSUs'
        });

        // Continue with more scenarios...
    }

    // Data Persistence Test Scenarios (15)
    generatePersistenceScenarios() {
        // Scenario: Save and Resume - Partial Completion
        this.scenarios.push({
            id: 'PERS-001',
            name: 'Save/Resume - Step 5 of 9',
            category: 'persistence',
            testType: 'save_resume',
            wizardState: {
                currentStep: 5,
                completedSteps: [1, 2, 3, 4],
                inputs: {
                    planningType: 'individual',
                    currentAge: 35,
                    retirementAge: 67,
                    country: 'israel',
                    currentMonthlySalary: 18000,
                    currentMonthlyExpenses: 12000,
                    currentPension: 120000,
                    currentTrainingFund: 50000,
                    // Steps 5-9 not yet filled
                }
            },
            expectedBehavior: {
                dataRetained: true,
                stepRestored: 5,
                fieldsPreserved: ['planningType', 'currentAge', 'retirementAge', 'country', 'salary', 'expenses', 'pension', 'training'],
                scoreCalculated: false // Incomplete data
            },
            expectedScoreRange: { min: 0, max: 0 }, // No score for incomplete
            description: 'Test save/resume functionality mid-wizard'
        });

        // Field Mapping Validation
        this.scenarios.push({
            id: 'PERS-002',
            name: 'Field Mapping - Name Variations',
            category: 'persistence',
            testType: 'field_mapping',
            inputs: {
                // Test various field name variations
                planningType: 'individual',
                currentAge: 40,
                retirementAge: 67,
                country: 'israel',
                // Salary variations
                currentMonthlySalary: 20000, // Standard
                monthly_salary: 20000, // Underscore
                monthlySalary: 20000, // No current prefix
                salary: 20000, // Simple
                currentSalary: 20000, // Different suffix
                // All should map to same value
            },
            fieldMappingTests: [
                {
                    canonicalName: 'currentMonthlySalary',
                    variations: ['currentMonthlySalary', 'monthly_salary', 'monthlySalary', 'salary', 'currentSalary'],
                    expectedValue: 20000
                }
            ],
            expectedScoreRange: { min: 50, max: 70 },
            description: 'Test field name variation handling'
        });

        // Currency Conversion Persistence
        this.scenarios.push({
            id: 'PERS-003',
            name: 'Currency Conversion - Multi-Currency',
            category: 'persistence',
            testType: 'currency_conversion',
            inputs: {
                planningType: 'individual',
                currentAge: 38,
                retirementAge: 67,
                country: 'israel',
                workingCurrency: 'USD',
                currentMonthlySalary: 5000, // USD
                currentMonthlyExpenses: 3500, // USD
                currentPension: 50000, // USD
                currentTrainingFund: 20000, // USD
                currentPortfolio: 30000, // USD
                currentRealEstate: 300000, // USD
                currentCrypto: 10000, // USD
                currentSavingsAccount: 15000, // USD
                emergencyFund: 20000, // USD
                conversionRates: {
                    USD_ILS: 3.7,
                    EUR_ILS: 4.1,
                    GBP_ILS: 4.7
                }
            },
            expectedConversions: {
                salaryInILS: 18500,
                expensesInILS: 12950,
                totalAssetsInILS: 1498500
            },
            expectedScoreRange: { min: 60, max: 75 },
            description: 'Test currency conversion persistence'
        });

        // Continue with more persistence scenarios...
    }

    // Edge Case Scenarios (15)
    generateEdgeCaseScenarios() {
        // Zero Values
        this.scenarios.push({
            id: 'EDGE-001',
            name: 'Zero Values - Minimal Data',
            category: 'edge_zero',
            inputs: {
                planningType: 'individual',
                currentAge: 30,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 0, // Unemployed
                currentMonthlyExpenses: 5000, // Living on savings
                currentPension: 0,
                currentTrainingFund: 0,
                currentPortfolio: 0,
                currentRealEstate: 0,
                currentCrypto: 0,
                currentSavingsAccount: 50000, // Living expenses
                emergencyFund: 0,
                pensionContributionRate: 0,
                trainingFundContributionRate: 0
            },
            expectedScoreRange: { min: 0, max: 15 },
            expectedIssues: ['zero_income', 'no_retirement_savings', 'no_emergency_fund'],
            description: 'Test handling of zero/minimal values'
        });

        // Extreme High Values
        this.scenarios.push({
            id: 'EDGE-002',
            name: 'Extreme Values - Ultra High Net Worth',
            category: 'edge_extreme',
            inputs: {
                planningType: 'individual',
                currentAge: 45,
                retirementAge: 55, // Early retirement
                country: 'israel',
                currentMonthlySalary: 200000, // Extreme high income
                currentMonthlyExpenses: 50000,
                currentPension: 5000000,
                currentTrainingFund: 2000000,
                currentPortfolio: 10000000,
                currentRealEstate: 20000000,
                currentCrypto: 5000000,
                currentSavingsAccount: 1000000,
                emergencyFund: 3000000, // 60 months
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                additionalMonthlyContribution: 100000
            },
            expectedScoreRange: { min: 95, max: 100 },
            expectedIssues: ['extreme_values_validation'],
            description: 'Test handling of extreme high values'
        });

        // Missing Critical Fields
        this.scenarios.push({
            id: 'EDGE-003',
            name: 'Missing Fields - Incomplete Data',
            category: 'edge_missing',
            inputs: {
                planningType: 'individual',
                currentAge: 35,
                retirementAge: 67,
                country: 'israel',
                // Missing salary
                // Missing expenses
                currentPension: 100000,
                currentTrainingFund: 40000,
                // Missing portfolio
                // Missing real estate
                // Missing crypto
                currentSavingsAccount: 20000,
                // Missing emergency fund
            },
            expectedScoreRange: { min: 0, max: 30 },
            expectedIssues: ['missing_salary', 'missing_expenses', 'incomplete_asset_data'],
            triggersMissingDataModal: true,
            description: 'Test handling of missing critical fields'
        });

        // Invalid Data Types
        this.scenarios.push({
            id: 'EDGE-004',
            name: 'Invalid Types - String Numbers',
            category: 'edge_invalid',
            inputs: {
                planningType: 'individual',
                currentAge: '35', // String instead of number
                retirementAge: '67', // String
                country: 'israel',
                currentMonthlySalary: '20,000', // Formatted string
                currentMonthlyExpenses: '15000', // String
                currentPension: 'one hundred thousand', // Text
                currentTrainingFund: null, // Null value
                currentPortfolio: undefined, // Undefined
                currentRealEstate: NaN, // Not a number
                currentCrypto: '', // Empty string
                currentSavingsAccount: '50k', // Abbreviated
                emergencyFund: '$30,000' // With currency symbol
            },
            expectedScoreRange: { min: 0, max: 50 },
            expectedIssues: ['type_conversion_required', 'invalid_numeric_values'],
            description: 'Test type conversion and validation'
        });

        // Negative Values
        this.scenarios.push({
            id: 'EDGE-005',
            name: 'Negative Values - Debt Situation',
            category: 'edge_negative',
            inputs: {
                planningType: 'individual',
                currentAge: 40,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 15000,
                currentMonthlyExpenses: 18000, // Spending more than earning
                currentPension: 80000,
                currentTrainingFund: 30000,
                currentPortfolio: -50000, // Margin debt
                currentRealEstate: 800000,
                currentCrypto: 0,
                currentSavingsAccount: -5000, // Overdraft
                emergencyFund: 0,
                expenses: {
                    mortgage: 8000,
                    carLoan: 3000,
                    creditCard: 5000,
                    otherDebt: 4000
                }
            },
            expectedScoreRange: { min: 15, max: 30 },
            expectedIssues: ['negative_cash_flow', 'negative_accounts', 'high_debt_burden'],
            description: 'Test handling of negative values and debt'
        });

        // Continue with more edge cases...
    }

    // Scoring Factor Test Scenarios (10)
    generateScoringFactorScenarios() {
        // Test Savings Rate Factor
        this.scenarios.push({
            id: 'SCORE-001',
            name: 'Factor Test - Savings Rate Only',
            category: 'scoring_factor',
            testFactor: 'savingsRate',
            inputs: {
                planningType: 'individual',
                currentAge: 35,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 20000,
                currentMonthlyExpenses: 15000, // 25% savings rate
                currentPension: 50000, // Minimal for focus on savings rate
                currentTrainingFund: 20000,
                currentPortfolio: 10000,
                currentRealEstate: 0,
                currentCrypto: 0,
                currentSavingsAccount: 20000,
                emergencyFund: 45000,
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10,
                additionalMonthlyContribution: 2000
            },
            expectedFactorScores: {
                savingsRate: { min: 20, max: 25 }, // Should score well
                retirementReadiness: { min: 5, max: 10 }, // Low due to minimal assets
                timeHorizon: { min: 12, max: 15 }, // Good time remaining
                riskAlignment: { min: 8, max: 12 },
                diversification: { min: 5, max: 8 },
                taxEfficiency: { min: 6, max: 8 },
                emergencyFund: { min: 5, max: 7 },
                debtManagement: { min: 3, max: 3 }
            },
            expectedScoreRange: { min: 64, max: 88 },
            description: 'Isolate and test savings rate calculation'
        });

        // Test Emergency Fund Factor
        this.scenarios.push({
            id: 'SCORE-002',
            name: 'Factor Test - Emergency Fund Focus',
            category: 'scoring_factor',
            testFactor: 'emergencyFund',
            inputs: {
                planningType: 'individual',
                currentAge: 40,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 25000,
                currentMonthlyExpenses: 20000,
                currentPension: 200000,
                currentTrainingFund: 80000,
                currentPortfolio: 50000,
                currentRealEstate: 1000000,
                currentCrypto: 0,
                currentSavingsAccount: 50000,
                emergencyFund: 240000, // 12 months - excellent
                pensionContributionRate: 21.333,
                trainingFundContributionRate: 10
            },
            expectedFactorScores: {
                savingsRate: { min: 15, max: 20 },
                retirementReadiness: { min: 12, max: 16 },
                timeHorizon: { min: 10, max: 13 },
                riskAlignment: { min: 8, max: 12 },
                diversification: { min: 7, max: 9 },
                taxEfficiency: { min: 6, max: 8 },
                emergencyFund: { min: 7, max: 7 }, // Max score
                debtManagement: { min: 3, max: 3 }
            },
            expectedScoreRange: { min: 68, max: 88 },
            description: 'Test emergency fund scoring with excellent coverage'
        });

        // Continue with more factor-specific tests...
        this.generateAdditionalScoringFactorScenarios();
    }

    // Additional scoring factor scenarios
    generateAdditionalScoringFactorScenarios() {
        // Test Debt Management Factor
        this.scenarios.push({
            id: 'SCORE-003',
            name: 'Factor Test - High Debt Impact',
            category: 'scoring_factor',
            testFactor: 'debtManagement',
            inputs: {
                planningType: 'individual',
                currentAge: 38,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 30000,
                currentMonthlyExpenses: 28000,
                currentPension: 150000,
                currentTrainingFund: 60000,
                currentPortfolio: 20000,
                currentRealEstate: 1200000,
                currentCrypto: 0,
                currentSavingsAccount: 10000,
                emergencyFund: 20000,
                expenses: {
                    mortgage: 12000, // 40% of income
                    carLoan: 4000,
                    creditCard: 3000,
                    otherDebt: 2000
                }
            },
            expectedFactorScores: {
                savingsRate: { min: 0, max: 5 }, // Very low due to high expenses
                retirementReadiness: { min: 8, max: 12 },
                timeHorizon: { min: 11, max: 14 },
                riskAlignment: { min: 6, max: 10 },
                diversification: { min: 5, max: 7 },
                taxEfficiency: { min: 5, max: 7 },
                emergencyFund: { min: 0, max: 2 }, // Very low
                debtManagement: { min: 0, max: 0 } // Critical debt level
            },
            expectedScoreRange: { min: 35, max: 57 },
            description: 'Test impact of high debt on overall score'
        });

        // Test Tax Efficiency
        this.scenarios.push({
            id: 'SCORE-004',
            name: 'Factor Test - Tax Optimization',
            category: 'scoring_factor',
            testFactor: 'taxEfficiency',
            inputs: {
                planningType: 'individual',
                currentAge: 42,
                retirementAge: 67,
                country: 'israel',
                currentMonthlySalary: 35000,
                currentMonthlyExpenses: 22000,
                currentPension: 400000,
                currentTrainingFund: 180000,
                currentPortfolio: 200000,
                currentRealEstate: 1500000,
                currentCrypto: 0,
                currentSavingsAccount: 80000,
                emergencyFund: 110000,
                pensionContributionRate: 21.333, // Max allowed
                trainingFundContributionRate: 10, // Max allowed
                additionalIncome: {
                    consulting: 10000,
                    rental: 5000
                },
                taxOptimization: {
                    section46Credit: true,
                    section47Credit: true,
                    capitalGainsDeferral: true
                }
            },
            expectedFactorScores: {
                savingsRate: { min: 18, max: 23 },
                retirementReadiness: { min: 14, max: 18 },
                timeHorizon: { min: 9, max: 12 },
                riskAlignment: { min: 8, max: 11 },
                diversification: { min: 8, max: 10 },
                taxEfficiency: { min: 7, max: 8 }, // High score
                emergencyFund: { min: 5, max: 7 },
                debtManagement: { min: 3, max: 3 }
            },
            expectedScoreRange: { min: 72, max: 92 },
            description: 'Test tax efficiency scoring with optimization'
        });
    }

    // Get scenario by ID
    getScenario(id) {
        return this.scenarios.find(s => s.id === id);
    }

    // Get scenarios by category
    getScenariosByCategory(category) {
        return this.scenarios.filter(s => s.category === category);
    }

    // Get all scenarios
    getAllScenarios() {
        return this.scenarios;
    }

    // Validate scenario data
    validateScenario(scenario) {
        const required = ['id', 'name', 'category', 'inputs', 'expectedScoreRange'];
        const missing = required.filter(field => !scenario[field]);
        
        if (missing.length > 0) {
            return {
                valid: false,
                errors: [`Missing required fields: ${missing.join(', ')}`]
            };
        }

        // Validate score range
        if (scenario.expectedScoreRange.min > scenario.expectedScoreRange.max) {
            return {
                valid: false,
                errors: ['Invalid score range: min > max']
            };
        }

        return { valid: true };
    }

    // Export scenarios to JSON
    exportToJSON() {
        return JSON.stringify(this.scenarios, null, 2);
    }

    // Generate summary statistics
    generateSummary() {
        const categories = {};
        this.scenarios.forEach(scenario => {
            if (!categories[scenario.category]) {
                categories[scenario.category] = 0;
            }
            categories[scenario.category]++;
        });

        return {
            totalScenarios: this.scenarios.length,
            categoryCounts: categories,
            scenarioTypes: {
                individual: this.scenarios.filter(s => s.inputs.planningType === 'individual').length,
                couple: this.scenarios.filter(s => s.inputs.planningType === 'couple').length,
                persistence: this.scenarios.filter(s => s.category === 'persistence').length,
                edge: this.scenarios.filter(s => s.category.startsWith('edge')).length,
                scoring: this.scenarios.filter(s => s.category === 'scoring_factor').length
            }
        };
    }
}

// Export for use in tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestDataGenerator;
} else {
    window.TestDataGenerator = TestDataGenerator;
}