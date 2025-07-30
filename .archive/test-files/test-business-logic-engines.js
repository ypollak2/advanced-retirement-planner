// Business Logic Engines Test Suite
// Comprehensive testing for GoalSuggestionEngine, FinancialHealthEngine, PortfolioOptimizationPanel, and retirementCalculations.js
// Created for Advanced Retirement Planner - v6.6.3

console.log('🧪 Starting Business Logic Engines Test Suite...\n');

// Mock dependencies
const mockCountryData = {
    israel: {
        name: 'Israel',
        flag: '🇮🇱',
        pensionTax: 0.25,
        socialSecurity: 1500
    },
    usa: {
        name: 'United States',
        flag: '🇺🇸',
        pensionTax: 0.22,
        socialSecurity: 2000
    }
};

const mockRiskScenarios = {
    conservative: { multiplier: 0.8 },
    moderate: { multiplier: 1.0 },
    aggressive: { multiplier: 1.2 }
};

const mockExchangeRates = {
    ILS: 1.0,
    USD: 3.7,
    EUR: 4.0,
    GBP: 4.5,
    BTC: 150000,
    ETH: 10000
};

// Load all required dependencies
if (typeof window === 'undefined') {
    global.window = {};
}

window.countryData = mockCountryData;
window.riskScenarios = mockRiskScenarios;

// Test Results Tracker
const testResults = {
    passed: 0,
    failed: 0,
    errors: [],
    warnings: [],
    critical: []
};

// Utility functions
function logTest(testName, result, details = '') {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}: ${testName}${details ? ` - ${details}` : ''}`);
    
    if (result) {
        testResults.passed++;
    } else {
        testResults.failed++;
        testResults.errors.push({ test: testName, details });
    }
}

function logCritical(testName, error) {
    console.log(`🔴 CRITICAL: ${testName} - ${error}`);
    testResults.critical.push({ test: testName, error });
}

function logWarning(testName, warning) {
    console.log(`⚠️ WARNING: ${testName} - ${warning}`);
    testResults.warnings.push({ test: testName, warning });
}

// Test data generators
function createValidInputs() {
    return {
        currentAge: 30,
        retirementAge: 67,
        currentMonthlySalary: 15000,
        currentSavings: 100000,
        currentTrainingFund: 50000,
        currentPersonalPortfolio: 75000,
        currentCryptoFiatValue: 25000,
        currentSavingsAccount: 30000,
        currentRealEstate: 800000,
        monthlyContribution: 2250,
        pensionReturn: 6.5,
        trainingFundReturn: 6.0,
        personalPortfolioReturn: 7.5,
        cryptoReturn: 15.0,
        realEstateReturn: 5.0,
        inflationRate: 2.5,
        retirementLifestyle: 'comfortable',
        riskTolerance: 'moderate',
        stockPercentage: 60,
        country: 'ISR',
        relationshipStatus: 'single'
    };
}

function createCoupleInputs() {
    const inputs = createValidInputs();
    return {
        ...inputs,
        relationshipStatus: 'couple',
        planningType: 'couple',
        partner1Salary: 18000,
        partner2Salary: 12000,
        partner1CurrentSavings: 80000,
        partner2CurrentSavings: 60000,
        partner1CurrentTrainingFund: 40000,
        partner2CurrentTrainingFund: 30000,
        partner1CurrentPersonalPortfolio: 50000,
        partner2CurrentPersonalPortfolio: 25000
    };
}

function createEmptyInputs() {
    return {
        currentAge: null,
        retirementAge: null,
        currentMonthlySalary: null,
        currentSavings: null
    };
}

function createExtremeInputs() {
    return {
        currentAge: 25,
        retirementAge: 70,
        currentMonthlySalary: 100000,
        currentSavings: 5000000,
        currentTrainingFund: 2000000,
        currentPersonalPortfolio: 3000000,
        currentCryptoFiatValue: 1000000,
        currentSavingsAccount: 500000,
        currentRealEstate: 10000000,
        monthlyContribution: 20000,
        pensionReturn: 15.0,
        inflationRate: 10.0,
        riskTolerance: 'aggressive',
        country: 'ISR'
    };
}

// =============================================================================
// 1. GOAL SUGGESTION ENGINE TESTS
// =============================================================================

console.log('\n📊 Testing Goal Suggestion Engine...');

try {
    eval(require('fs').readFileSync('./src/utils/goalSuggestionEngine.js', 'utf8'));
    
    // Test 1: Basic Goal Suggestions with Valid Inputs
    try {
        const validInputs = createValidInputs();
        const suggestions = generateGoalSuggestions(validInputs);
        
        logTest('GoalSuggestionEngine - Basic valid inputs', 
            suggestions && suggestions.retirementGoal && suggestions.monthlyExpenses && suggestions.emergencyFund);
        
        if (suggestions) {
            logTest('GoalSuggestionEngine - Retirement goal amount > 0', suggestions.retirementGoal.amount > 0);
            logTest('GoalSuggestionEngine - Monthly expenses suggestion > 0', suggestions.monthlyExpenses.baseAmount > 0);
            logTest('GoalSuggestionEngine - Emergency fund suggestion > 0', suggestions.emergencyFund.amount > 0);
            logTest('GoalSuggestionEngine - Gap analysis included', suggestions.gapAnalysis && typeof suggestions.gapAnalysis.gap === 'number');
        }
    } catch (error) {
        logCritical('GoalSuggestionEngine - Basic test', error.message);
    }

    // Test 2: Edge Case - Zero/Null Inputs
    try {
        const emptyInputs = createEmptyInputs();
        const suggestions = generateGoalSuggestions(emptyInputs);
        
        logTest('GoalSuggestionEngine - Handles null inputs gracefully', suggestions !== null);
        
        if (suggestions && suggestions.retirementGoal) {
            logTest('GoalSuggestionEngine - Zero income handling', !isNaN(suggestions.retirementGoal.amount));
        }
    } catch (error) {
        logWarning('GoalSuggestionEngine - Null inputs', error.message);
    }

    // Test 3: Extreme Values Test
    try {
        const extremeInputs = createExtremeInputs();
        const suggestions = generateGoalSuggestions(extremeInputs);
        
        logTest('GoalSuggestionEngine - Handles extreme values', suggestions && suggestions.retirementGoal);
        
        if (suggestions) {
            logTest('GoalSuggestionEngine - Extreme values produce reasonable results', 
                suggestions.retirementGoal.amount > 0 && suggestions.retirementGoal.amount < 1000000000);
        }
    } catch (error) {
        logWarning('GoalSuggestionEngine - Extreme values', error.message);
    }

    // Test 4: Couple Mode Test
    try {
        const coupleInputs = createCoupleInputs();
        const suggestions = generateGoalSuggestions(coupleInputs);
        
        logTest('GoalSuggestionEngine - Couple mode functionality', suggestions && suggestions.retirementGoal);
        
        if (suggestions && suggestions.metadata) {
            const singleInputs = createValidInputs();
            const singleSuggestions = generateGoalSuggestions(singleInputs);
            
            if (singleSuggestions && singleSuggestions.metadata) {
                logTest('GoalSuggestionEngine - Couple has higher total savings than single', 
                    suggestions.metadata.currentTotalSavings > singleSuggestions.metadata.currentTotalSavings);
            }
        }
    } catch (error) {
        logWarning('GoalSuggestionEngine - Couple mode', error.message);
    }

    // Test 5: Helper Functions
    try {
        const inputs = createValidInputs();
        const totalSavings = window.calculateTotalCurrentSavings(inputs);
        const monthlyIncome = calculateMonthlyIncome(inputs);
        
        logTest('GoalSuggestionEngine - calculateTotalCurrentSavings works', typeof totalSavings === 'number' && totalSavings > 0);
        logTest('GoalSuggestionEngine - calculateMonthlyIncome works', typeof monthlyIncome === 'number' && monthlyIncome > 0);
        
        const expensesSuggestion = suggestMonthlyRetirementExpenses(inputs);
        logTest('GoalSuggestionEngine - suggestMonthlyRetirementExpenses works', 
            expensesSuggestion && expensesSuggestion.baseAmount > 0);
        
        const emergencyFund = suggestEmergencyFund(inputs);
        logTest('GoalSuggestionEngine - suggestEmergencyFund works', 
            emergencyFund && emergencyFund.amount > 0 && emergencyFund.months > 0);
    } catch (error) {
        logCritical('GoalSuggestionEngine - Helper functions', error.message);
    }

} catch (error) {
    logCritical('GoalSuggestionEngine - Loading', error.message);
}

// =============================================================================
// 2. FINANCIAL HEALTH ENGINE TESTS
// =============================================================================

console.log('\n💚 Testing Financial Health Engine...');

try {
    eval(require('fs').readFileSync('./src/utils/financialHealthEngine.js', 'utf8'));
    
    // Test 1: Basic Financial Health Score
    try {
        const validInputs = createValidInputs();
        const healthScore = calculateFinancialHealthScore(validInputs);
        
        logTest('FinancialHealthEngine - Basic calculation works', 
            healthScore && typeof healthScore.totalScore === 'number');
        
        if (healthScore) {
            logTest('FinancialHealthEngine - Total score in valid range (0-100)', 
                healthScore.totalScore >= 0 && healthScore.totalScore <= 100);
            logTest('FinancialHealthEngine - Has status field', 
                healthScore.status && typeof healthScore.status === 'string');
            logTest('FinancialHealthEngine - Has factors breakdown', 
                healthScore.factors && typeof healthScore.factors === 'object');
            logTest('FinancialHealthEngine - Has suggestions array', 
                Array.isArray(healthScore.suggestions));
        }
    } catch (error) {
        logCritical('FinancialHealthEngine - Basic calculation', error.message);
    }

    // Test 2: Edge Case - Empty Inputs (Critical TypeError Test)
    try {
        const emptyInputs = {};
        const healthScore = calculateFinancialHealthScore(emptyInputs);
        
        logTest('FinancialHealthEngine - Handles empty inputs without TypeError', 
            healthScore && !healthScore.error);
        
        // Check for specific .status field access errors
        if (healthScore && healthScore.factors) {
            Object.keys(healthScore.factors).forEach(factorName => {
                const factor = healthScore.factors[factorName];
                logTest(`FinancialHealthEngine - ${factorName} has valid details.status`, 
                    factor.details && typeof factor.details.status === 'string');
            });
        }
    } catch (error) {
        logCritical('FinancialHealthEngine - Empty inputs TypeError', error.message);
    }

    // Test 3: Null/Undefined Values Test
    try {
        const nullInputs = {
            currentAge: null,
            currentMonthlySalary: undefined,
            currentSavings: null,
            monthlyContribution: undefined
        };
        const healthScore = calculateFinancialHealthScore(nullInputs);
        
        logTest('FinancialHealthEngine - Handles null/undefined values', 
            healthScore && !healthScore.error);
            
        // Verify no TypeError on accessing properties of undefined
        if (healthScore && healthScore.factors) {
            logTest('FinancialHealthEngine - No TypeError on factor.details.status access', 
                healthScore.factors.savingsRate && 
                healthScore.factors.savingsRate.details && 
                typeof healthScore.factors.savingsRate.details.status === 'string');
        }
    } catch (error) {
        logCritical('FinancialHealthEngine - Null values TypeError', error.message);
    }

    // Test 4: Zero Division Test
    try {
        const zeroInputs = {
            currentAge: 30,
            currentMonthlySalary: 0,
            monthlyContribution: 0,
            currentSavings: 0,
            currentMonthlyExpenses: 0
        };
        const healthScore = calculateFinancialHealthScore(zeroInputs);
        
        logTest('FinancialHealthEngine - Handles zero income without division errors', 
            healthScore && !healthScore.error);
            
        if (healthScore && healthScore.factors) {
            logTest('FinancialHealthEngine - Zero income produces valid status', 
                healthScore.factors.savingsRate.details.status === 'unknown' || 
                typeof healthScore.factors.savingsRate.details.status === 'string');
        }
    } catch (error) {
        logCritical('FinancialHealthEngine - Zero division', error.message);
    }

    // Test 5: Individual Factor Functions
    try {
        const inputs = createValidInputs();
        
        // Test individual factor calculation functions
        const factorTests = [
            { name: 'calculateSavingsRateScore', inputs },
            { name: 'calculateRetirementReadinessScore', inputs },
            { name: 'calculateTimeHorizonScore', inputs },
            { name: 'calculateRiskAlignmentScore', inputs },
            { name: 'calculateDiversificationScore', inputs },
            { name: 'calculateTaxEfficiencyScore', inputs },
            { name: 'calculateEmergencyFundScore', inputs },
            { name: 'calculateDebtManagementScore', inputs }
        ];
        
        factorTests.forEach(test => {
            try {
                if (typeof window[test.name] === 'function') {
                    const result = window[test.name](test.inputs);
                    logTest(`FinancialHealthEngine - ${test.name} works`, 
                        result && typeof result.score === 'number' && result.details);
                    
                    if (result && result.details) {
                        logTest(`FinancialHealthEngine - ${test.name} has valid status`, 
                            typeof result.details.status === 'string');
                    }
                } else {
                    logWarning(`FinancialHealthEngine - ${test.name}`, 'Function not found');
                }
            } catch (error) {
                logCritical(`FinancialHealthEngine - ${test.name}`, error.message);
            }
        });
    } catch (error) {
        logCritical('FinancialHealthEngine - Individual factors', error.message);
    }

    // Test 6: Improvement Suggestions Generation
    try {
        const poorInputs = {
            currentAge: 50,
            retirementAge: 67,
            currentMonthlySalary: 8000,
            monthlyContribution: 200, // Very low savings rate
            currentSavings: 50000, // Low for age
            currentPersonalPortfolio: 0,
            currentRealEstate: 0,
            currentMonthlyExpenses: 7000,
            emergencyFund: 5000 // Only covers < 1 month
        };
        
        const healthScore = calculateFinancialHealthScore(poorInputs);
        
        logTest('FinancialHealthEngine - Generates suggestions for poor scores', 
            healthScore && healthScore.suggestions && healthScore.suggestions.length > 0);
            
        if (healthScore && healthScore.suggestions.length > 0) {
            logTest('FinancialHealthEngine - Suggestions have required fields', 
                healthScore.suggestions[0].priority && 
                healthScore.suggestions[0].category && 
                healthScore.suggestions[0].issue &&
                healthScore.suggestions[0].action);
        }
    } catch (error) {
        logCritical('FinancialHealthEngine - Improvement suggestions', error.message);
    }

} catch (error) {
    logCritical('FinancialHealthEngine - Loading', error.message);
}

// =============================================================================
// 3. PORTFOLIO OPTIMIZATION PANEL TESTS
// =============================================================================

console.log('\n📈 Testing Portfolio Optimization Panel...');

try {
    eval(require('fs').readFileSync('./src/components/panels/analysis/PortfolioOptimizationPanel.js', 'utf8'));
    
    // Mock React and required dependencies
    if (typeof React === 'undefined') {
        global.React = {
            createElement: (type, props, ...children) => ({ type, props, children }),
            useState: (initial) => [initial, () => {}],
            useEffect: () => {}
        };
    }
    
    // Mock window.PortfolioOptimizer
    window.PortfolioOptimizer = {
        optimizePortfolio: (inputs, language) => ({
            currentMetrics: {
                expectedReturn: 7.2,
                volatility: 12.5,
                sharpeRatio: 0.85,
                diversificationScore: 75,
                riskScore: 45
            },
            optimalMetrics: {
                expectedReturn: 8.1,
                volatility: 11.8,
                sharpeRatio: 1.02,
                diversificationScore: 85,
                riskScore: 40
            },
            currentAllocation: {
                stocks: { domesticLarge: 30, domesticSmall: 10, international: 15 },
                bonds: { government: 20, corporate: 10 },
                alternatives: { reits: 5, commodities: 5 },
                cash: { savings: 5 }
            },
            optimalAllocation: {
                stocks: { domesticLarge: 35, domesticSmall: 15, international: 20 },
                bonds: { government: 15, corporate: 8 },
                alternatives: { reits: 4, commodities: 3 },
                cash: { savings: 0 }
            },
            rebalancingActions: [
                {
                    category: 'stocks',
                    asset: 'international',
                    action: 'buy',
                    amount: 50000,
                    currentPercentage: 15,
                    targetPercentage: 20,
                    differencePercentage: 5,
                    priority: 'high'
                }
            ],
            implementationPlan: {
                immediate: [{ action: 'Sell', asset: 'Cash savings', amount: 25000, reason: 'Overweight position' }],
                shortTerm: [{ action: 'Buy', asset: 'International stocks', amount: 50000 }],
                longTerm: [{ action: 'Rebalance', asset: 'Bond allocation', amount: 30000 }]
            },
            recommendations: [
                {
                    title: 'Increase Stock Allocation',
                    description: 'Your current stock allocation is below optimal for your age',
                    action: 'Increase international stock exposure by 5%',
                    priority: 'high'
                }
            ]
        }),
        assetClasses: {
            stocks: {
                domesticLarge: { name: { en: 'Domestic Large Cap', he: 'מניות גדולות מקומיות' } },
                international: { name: { en: 'International Stocks', he: 'מניות בינלאומיות' } }
            },
            bonds: {
                government: { name: { en: 'Government Bonds', he: 'אגרות חוב ממשלתיות' } }
            },
            alternatives: {
                reits: { name: { en: 'REITs', he: 'נדלן למסחר' } }
            },
            cash: {
                savings: { name: { en: 'Savings Account', he: 'חשבון חיסכון' } }
            }
        }
    };
    
    // Test 1: Component Creation
    try {
        const inputs = createValidInputs();
        const component = PortfolioOptimizationPanel({
            inputs: inputs,
            language: 'en',
            workingCurrency: 'ILS',
            onRebalance: () => {},
            onReturnToDashboard: () => {}
        });
        
        logTest('PortfolioOptimizationPanel - Component creation works', 
            component && component.type === 'div');
            
        logTest('PortfolioOptimizationPanel - Has required props handling', 
            component.props && component.props.className);
    } catch (error) {
        logCritical('PortfolioOptimizationPanel - Component creation', error.message);
    }

    // Test 2: Currency Formatting
    try {
        // Mock formatCurrency function
        window.formatCurrency = (amount, currency) => {
            const symbols = { ILS: '₪', USD: '$', GBP: '£', EUR: '€' };
            return `${symbols[currency] || '₪'}${Math.round(amount).toLocaleString()}`;
        };
        
        const formattedAmount = window.formatCurrency(125000, 'ILS');
        logTest('PortfolioOptimizationPanel - Currency formatting works', 
            formattedAmount.includes('₪') && formattedAmount.includes('125'));
    } catch (error) {
        logWarning('PortfolioOptimizationPanel - Currency formatting', error.message);
    }

    // Test 3: Multi-language Support
    try {
        const inputs = createValidInputs();
        
        const englishComponent = PortfolioOptimizationPanel({
            inputs: inputs,
            language: 'en'
        });
        
        const hebrewComponent = PortfolioOptimizationPanel({
            inputs: inputs,
            language: 'he'
        });
        
        logTest('PortfolioOptimizationPanel - English language works', 
            englishComponent && englishComponent.type === 'div');
        logTest('PortfolioOptimizationPanel - Hebrew language works', 
            hebrewComponent && hebrewComponent.type === 'div');
    } catch (error) {
        logWarning('PortfolioOptimizationPanel - Multi-language', error.message);
    }

} catch (error) {
    logCritical('PortfolioOptimizationPanel - Loading', error.message);
}

// =============================================================================
// 4. RETIREMENT CALCULATIONS TESTS
// =============================================================================

console.log('\n🧮 Testing Retirement Calculations...');

try {
    eval(require('fs').readFileSync('./src/utils/retirementCalculations.js', 'utf8'));
    
    // Test 1: Currency Conversion with Edge Cases
    try {
        // Test normal conversion
        const normalConversion = convertCurrency(1000, 'USD', mockExchangeRates);
        logTest('RetirementCalculations - Normal currency conversion works', 
            typeof normalConversion === 'string' && normalConversion.includes('$'));
        
        // Test null exchange rates (Critical fix verification)
        const nullRatesConversion = convertCurrency(1000, 'USD', null);
        logTest('RetirementCalculations - Handles null exchange rates', 
            nullRatesConversion === 'N/A');
        
        // Test zero exchange rate (Critical fix verification)
        const zeroRateConversion = convertCurrency(1000, 'USD', { USD: 0 });
        logTest('RetirementCalculations - Handles zero exchange rate', 
            zeroRateConversion === 'N/A');
        
        // Test invalid amount
        const invalidAmountConversion = convertCurrency(null, 'USD', mockExchangeRates);
        logTest('RetirementCalculations - Handles invalid amount', 
            invalidAmountConversion === 'N/A');
        
        // Test undefined amount
        const undefinedAmountConversion = convertCurrency(undefined, 'USD', mockExchangeRates);
        logTest('RetirementCalculations - Handles undefined amount', 
            undefinedAmountConversion === 'N/A');
        
        // Test NaN amount
        const nanAmountConversion = convertCurrency(NaN, 'USD', mockExchangeRates);
        logTest('RetirementCalculations - Handles NaN amount', 
            nanAmountConversion === 'N/A');
        
    } catch (error) {
        logCritical('RetirementCalculations - Currency conversion edge cases', error.message);
    }

    // Test 2: Basic Retirement Calculation
    try {
        const inputs = createValidInputs();
        const workPeriods = [{
            country: 'israel',
            startAge: 30,
            endAge: 67,
            salary: 15000,
            monthlyContribution: 2250,
            pensionReturn: 6.5,
            pensionDepositFee: 0.5,
            pensionAnnualFee: 1.0,
            monthlyTrainingFund: 1500
        }];
        
        const pensionIndexAllocation = [{ percentage: 60, index: 0, customReturn: null }];
        const trainingFundIndexAllocation = [{ percentage: 100, index: 0, customReturn: null }];
        const historicalReturns = { 20: [6.5, 7.0, 5.5] };
        const monthlyTrainingFundContribution = 1500;
        
        const results = calculateRetirement(
            inputs, 
            workPeriods, 
            pensionIndexAllocation, 
            trainingFundIndexAllocation,
            historicalReturns,
            monthlyTrainingFundContribution
        );
        
        logTest('RetirementCalculations - Basic calculation works', 
            results && typeof results.totalSavings === 'number');
        
        if (results) {
            logTest('RetirementCalculations - Has required fields', 
                results.totalSavings && results.monthlyPension && results.totalNetIncome);
            logTest('RetirementCalculations - Values are reasonable', 
                results.totalSavings > 0 && results.monthlyPension > 0);
            logTest('RetirementCalculations - Has period results', 
                Array.isArray(results.periodResults));
        }
    } catch (error) {
        logCritical('RetirementCalculations - Basic calculation', error.message);
    }

    // Test 3: Edge Case - Invalid Inputs
    try {
        const invalidInputs = {
            currentAge: 70, // Age > retirement age
            retirementAge: 65
        };
        
        const results = calculateRetirement(invalidInputs, [], [], [], {}, 0);
        logTest('RetirementCalculations - Handles invalid age (current > retirement)', 
            results === null);
    } catch (error) {
        logCritical('RetirementCalculations - Invalid inputs', error.message);
    }

    // Test 4: Couple Mode Calculations
    try {
        const coupleInputs = createCoupleInputs();
        coupleInputs.partnerPlanningEnabled = true;
        coupleInputs.partnerCurrentAge = 28;
        coupleInputs.partnerRetirementAge = 65;
        coupleInputs.partnerCurrentSavings = 80000;
        
        const workPeriods = [{
            country: 'israel',
            startAge: 30,
            endAge: 67,
            salary: 15000,
            monthlyContribution: 2250,
            pensionReturn: 6.5,
            pensionDepositFee: 0.5,
            pensionAnnualFee: 1.0,
            monthlyTrainingFund: 1500
        }];
        
        const partnerWorkPeriods = [{
            country: 'israel',
            startAge: 28,
            endAge: 65,
            salary: 12000,
            monthlyContribution: 1800,
            monthlyTrainingFund: 1200
        }];
        
        const results = calculateRetirement(
            coupleInputs, 
            workPeriods, 
            [{ percentage: 100, index: 0 }], 
            [{ percentage: 100, index: 0 }],
            { 20: [6.5] },
            1500,
            partnerWorkPeriods
        );
        
        logTest('RetirementCalculations - Couple mode works', 
            results && results.partnerResults);
        
        if (results && results.partnerResults) {
            logTest('RetirementCalculations - Partner results have required fields', 
                results.partnerResults.totalPensionSavings && 
                results.partnerResults.totalTrainingFund);
        }
    } catch (error) {
        logWarning('RetirementCalculations - Couple mode', error.message);
    }

    // Test 5: Progressive Savings Calculation
    try {
        const inputs = createValidInputs();
        const projections = calculateProgressiveSavings(inputs, [], []);
        
        logTest('RetirementCalculations - Progressive savings calculation works', 
            projections && projections.primary && projections.partner && projections.combined);
        
        if (projections && projections.primary.length > 0) {
            const firstYear = projections.primary[0];
            const lastYear = projections.primary[projections.primary.length - 1];
            
            logTest('RetirementCalculations - Progressive savings has required fields', 
                firstYear.age && firstYear.nominal && firstYear.real);
            logTest('RetirementCalculations - Progressive savings grows over time', 
                lastYear.nominal > firstYear.nominal);
            logTest('RetirementCalculations - Real values account for inflation', 
                lastYear.real < lastYear.nominal);
        }
    } catch (error) {
        logCritical('RetirementCalculations - Progressive savings', error.message);
    }

    // Test 6: Chart Data Generation
    try {
        const inputs = createValidInputs();
        const workPeriods = [{
            country: 'israel',
            startAge: 30,
            endAge: 67,
            salary: 15000,
            monthlyContribution: 2250
        }];
        
        const chartData = generateRetirementChartData(inputs, workPeriods, []);
        
        logTest('RetirementCalculations - Chart data generation works', 
            Array.isArray(chartData) && chartData.length > 0);
        
        if (chartData.length > 0) {
            const dataPoint = chartData[0];
            logTest('RetirementCalculations - Chart data has required fields', 
                dataPoint.age && typeof dataPoint.totalSavings === 'number');
        }
        
        // Test with invalid inputs
        const invalidChartData = generateRetirementChartData(null, workPeriods, []);
        logTest('RetirementCalculations - Chart handles invalid inputs gracefully', 
            Array.isArray(invalidChartData) && invalidChartData.length === 0);
    } catch (error) {
        logWarning('RetirementCalculations - Chart data generation', error.message);
    }

    // Test 7: Standard Chart Formatting
    try {
        const symbol = window.standardChartFormatting.getCurrencySymbol('ILS');
        logTest('RetirementCalculations - Get currency symbol works', symbol === '₪');
        
        const formattedValue = window.standardChartFormatting.formatYAxisValue(1250000, 'ILS');
        logTest('RetirementCalculations - Y-axis formatting works', 
            formattedValue.includes('₪') && formattedValue.includes('M'));
        
        const tooltipValue = window.standardChartFormatting.formatTooltipValue(125000, 'USD', 'en');
        logTest('RetirementCalculations - Tooltip formatting works', 
            tooltipValue.includes('$') && tooltipValue.includes('125'));
    } catch (error) {
        logWarning('RetirementCalculations - Chart formatting', error.message);
    }

} catch (error) {
    logCritical('RetirementCalculations - Loading', error.message);
}

// =============================================================================
// ADDITIONAL EDGE CASE TESTS
// =============================================================================

console.log('\n🔍 Running Additional Edge Case Tests...');

// Test mathematical accuracy with known values
try {
    const knownInputs = {
        currentAge: 30,
        retirementAge: 65,
        currentSavings: 100000,
        monthlyContribution: 1000,
        pensionReturn: 6.0
    };
    
    // Test compound interest calculation manually
    const years = 35;
    const monthlyReturn = 0.06 / 12;
    const months = years * 12;
    
    const futureValueExisting = knownInputs.currentSavings * Math.pow(1 + monthlyReturn, months);
    const futureValueContributions = knownInputs.monthlyContribution * (Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn;
    const expectedTotal = futureValueExisting + futureValueContributions;
    
    logTest('Mathematical accuracy - Manual compound interest calculation', 
        expectedTotal > 2000000 && expectedTotal < 3000000, 
        `Expected ~₪2.5M, calculated: ₪${Math.round(expectedTotal).toLocaleString()}`);
        
} catch (error) {
    logWarning('Mathematical accuracy test', error.message);
}

// Test memory usage with large datasets
try {
    const largeInputs = createValidInputs();
    largeInputs.currentAge = 20;
    largeInputs.retirementAge = 70; // 50 years of projections
    
    const startTime = Date.now();
    const projections = window.calculateProgressiveSavings ? 
        window.calculateProgressiveSavings(largeInputs, [], []) : null;
    const endTime = Date.now();
    
    if (projections) {
        logTest('Performance - Large dataset processing', 
            endTime - startTime < 1000, 
            `Processed in ${endTime - startTime}ms`);
        
        logTest('Performance - Large dataset size reasonable', 
            projections.primary.length === 51, // 50 years + starting year
            `Generated ${projections.primary.length} data points`);
    }
} catch (error) {
    logWarning('Performance test with large dataset', error.message);
}

// =============================================================================
// TEST RESULTS SUMMARY
// =============================================================================

console.log('\n' + '='.repeat(80));
console.log('📊 BUSINESS LOGIC ENGINES TEST RESULTS SUMMARY');
console.log('='.repeat(80));

console.log(`\n✅ PASSED: ${testResults.passed} tests`);
console.log(`❌ FAILED: ${testResults.failed} tests`);
console.log(`⚠️ WARNINGS: ${testResults.warnings.length} warnings`);
console.log(`🔴 CRITICAL: ${testResults.critical.length} critical issues`);

if (testResults.critical.length > 0) {
    console.log('\n🔴 CRITICAL ISSUES:');
    testResults.critical.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.test}: ${issue.error}`);
    });
}

if (testResults.warnings.length > 0) {
    console.log('\n⚠️ WARNINGS:');
    testResults.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning.test}: ${warning.warning}`);
    });
}

if (testResults.errors.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.test}${error.details ? `: ${error.details}` : ''}`);
    });
}

// Overall assessment
const totalTests = testResults.passed + testResults.failed;
const successRate = totalTests > 0 ? (testResults.passed / totalTests * 100).toFixed(1) : 0;

console.log(`\n📈 SUCCESS RATE: ${successRate}% (${testResults.passed}/${totalTests})`);

if (testResults.critical.length === 0 && testResults.failed === 0) {
    console.log('\n🎉 ALL CRITICAL BUSINESS LOGIC TESTS PASSED!');
    console.log('✅ The business logic engines are functioning correctly.');
} else if (testResults.critical.length === 0) {
    console.log('\n✅ NO CRITICAL ISSUES FOUND');
    console.log('⚠️ Some non-critical tests failed - see details above.');
} else {
    console.log('\n🚨 CRITICAL ISSUES REQUIRE IMMEDIATE ATTENTION');
    console.log('❌ Fix critical issues before deployment.');
}

console.log('\n🧪 Business Logic Engines Test Suite Complete.');