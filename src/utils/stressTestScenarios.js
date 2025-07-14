// Stress Test Scenarios for Advanced Retirement Planner
// Created by Yali Pollak (יהלי פולק) - v5.3.0

// Predefined stress test scenarios
const STRESS_TEST_SCENARIOS = {
    conservative: {
        id: 'conservative',
        name: {
            he: 'תרחיש שמרני',
            en: 'Conservative Scenario'
        },
        description: {
            he: 'תרחיש זהיר עם תשואות נמוכות ואינפלציה גבוהה',
            en: 'Cautious scenario with low returns and high inflation'
        },
        parameters: {
            pensionReturn: 4.5,           // 2.5% lower than base
            trainingFundReturn: 4.0,      // 2.5% lower than base
            personalPortfolioReturn: 5.5, // 2.5% lower than base
            realEstateReturn: 3.5,        // 2.5% lower than base
            cryptoReturn: 8.0,            // 7% lower than base
            inflationRate: 5.5,           // 2.5% higher than base
            salaryGrowthRate: 1.5,        // 2% lower than base
            marketCrashYear: null,        // No crash in conservative
            economicShockImpact: 0
        },
        reasoning: 'Conservative approach assumes lower investment returns due to economic uncertainty, higher inflation, and slower salary growth.'
    },
    
    optimistic: {
        id: 'optimistic',
        name: {
            he: 'תרחיש אופטימי',
            en: 'Optimistic Scenario'
        },
        description: {
            he: 'תרחיש אופטימי עם תשואות גבוהות ואינפלציה נמוכה',
            en: 'Optimistic scenario with high returns and low inflation'
        },
        parameters: {
            pensionReturn: 9.5,           // 2.5% higher than base
            trainingFundReturn: 9.0,      // 2.5% higher than base  
            personalPortfolioReturn: 10.5, // 2.5% higher than base
            realEstateReturn: 8.5,        // 2.5% higher than base
            cryptoReturn: 22.0,           // 7% higher than base
            inflationRate: 1.5,           // 1.5% lower than base
            salaryGrowthRate: 5.5,        // 2% higher than base
            marketCrashYear: null,        // No crash in optimistic
            economicShockImpact: 0
        },
        reasoning: 'Optimistic scenario assumes strong economic growth, technological advancement driving higher returns, and controlled inflation.'
    },
    
    marketCrash: {
        id: 'marketCrash',
        name: {
            he: 'קריסת שוק',
            en: 'Market Crash Scenario'
        },
        description: {
            he: 'תרחיש של קריסת שוק משמעותית בעוד 10 שנים',
            en: 'Significant market crash scenario in 10 years'
        },
        parameters: {
            pensionReturn: 7.0,           // Base return
            trainingFundReturn: 6.5,      // Base return
            personalPortfolioReturn: 8.0, // Base return
            realEstateReturn: 6.0,        // Base return
            cryptoReturn: 15.0,           // Base return
            inflationRate: 3.0,           // Base inflation
            salaryGrowthRate: 3.5,        // Base growth
            marketCrashYear: 10,          // Crash in year 10
            economicShockImpact: -35      // 35% portfolio loss
        },
        reasoning: 'Simulates a major market crash (like 2008 or COVID-19) occurring 10 years from now, with 35% portfolio loss and subsequent recovery.'
    },
    
    highInflation: {
        id: 'highInflation',
        name: {
            he: 'אינפלציה גבוהה',
            en: 'High Inflation Scenario'
        },
        description: {
            he: 'תרחיש של אינפלציה גבוהה מתמשכת כמו בשנות ה-70',
            en: 'Persistent high inflation scenario like the 1970s'
        },
        parameters: {
            pensionReturn: 8.0,           // 1% higher to compensate
            trainingFundReturn: 7.5,      // 1% higher to compensate
            personalPortfolioReturn: 9.0, // 1% higher to compensate
            realEstateReturn: 9.0,        // 3% higher (real estate hedge)
            cryptoReturn: 18.0,           // 3% higher (inflation hedge)
            inflationRate: 7.5,           // 4.5% higher than base
            salaryGrowthRate: 6.0,        // 2.5% higher (inflation adjustment)
            marketCrashYear: null,
            economicShockImpact: 0
        },
        reasoning: 'High inflation scenario where asset prices rise but purchasing power erodes. Real estate and crypto serve as inflation hedges.'
    },
    
    economicStagnation: {
        id: 'economicStagnation',
        name: {
            he: 'קיפאון כלכלי',
            en: 'Economic Stagnation'
        },
        description: {
            he: 'תרחיש של קיפאון כלכלי עם צמיחה איטית ותשואות נמוכות',
            en: 'Economic stagnation with slow growth and low returns'
        },
        parameters: {
            pensionReturn: 5.5,           // 1.5% lower than base
            trainingFundReturn: 5.0,      // 1.5% lower than base
            personalPortfolioReturn: 6.5, // 1.5% lower than base
            realEstateReturn: 4.0,        // 2% lower than base
            cryptoReturn: 10.0,           // 5% lower than base
            inflationRate: 2.5,           // 0.5% lower than base
            salaryGrowthRate: 1.0,        // 2.5% lower than base
            marketCrashYear: null,
            economicShockImpact: 0
        },
        reasoning: 'Economic stagnation with low growth, minimal salary increases, and reduced investment returns across all asset classes.'
    }
};

// Function to run stress test calculations
function runStressTest(inputs, workPeriods, scenario) {
    if (!window.calculateRetirement) {
        console.error('calculateRetirement function not available');
        return null;
    }
    
    // Create modified inputs based on scenario parameters
    const stressInputs = { ...inputs };
    const stressWorkPeriods = workPeriods.map(period => ({ ...period }));
    
    // Apply scenario parameters
    const params = scenario.parameters;
    
    // Update inflation rate
    stressInputs.inflationRate = params.inflationRate;
    stressInputs.salaryGrowthRate = params.salaryGrowthRate;
    
    // Update investment returns
    stressInputs.trainingFundReturn = params.trainingFundReturn;
    stressInputs.personalPortfolioReturn = params.personalPortfolioReturn;
    stressInputs.realEstateReturn = params.realEstateReturn;
    stressInputs.cryptoReturn = params.cryptoReturn;
    
    // Update work periods with new pension returns
    stressWorkPeriods.forEach(period => {
        period.pensionReturn = params.pensionReturn;
    });
    
    // Calculate base results
    let results = window.calculateRetirement(stressInputs, stressWorkPeriods, [], []);
    
    // Apply market crash if specified
    if (params.marketCrashYear && params.economicShockImpact) {
        results = applyMarketCrash(results, params.marketCrashYear, params.economicShockImpact, stressInputs);
    }
    
    // Add scenario metadata
    results.scenarioId = scenario.id;
    results.scenarioName = scenario.name;
    results.scenarioDescription = scenario.description;
    results.scenarioParameters = params;
    results.reasoning = scenario.reasoning;
    
    return results;
}

// Apply market crash impact to results
function applyMarketCrash(results, crashYear, impactPercentage, inputs) {
    const currentAge = inputs.currentAge || 30;
    const crashAge = currentAge + crashYear;
    const retirementAge = inputs.retirementAge || 67;
    
    if (crashAge >= retirementAge) {
        // Crash happens after retirement, no impact on accumulation
        return results;
    }
    
    // Calculate portfolio value at crash time
    const yearsToRetirement = retirementAge - currentAge;
    const yearsToCrash = crashYear;
    const yearsAfterCrash = yearsToRetirement - yearsToCrash;
    
    // Estimate portfolio value at crash (simplified calculation)
    const preGrowthRate = 0.07; // Average growth before crash
    const postGrowthRate = 0.08; // Recovery growth after crash
    
    const currentSavings = inputs.currentSavings || 0;
    const monthlyContribution = (inputs.monthlyContribution || 0) + (inputs.trainingFundMonthly || 0);
    
    // Portfolio value at crash time
    let portfolioAtCrash = currentSavings * Math.pow(1 + preGrowthRate, yearsToCrash);
    portfolioAtCrash += monthlyContribution * 12 * yearsToCrash * ((Math.pow(1 + preGrowthRate, yearsToCrash) - 1) / preGrowthRate);
    
    // Apply crash impact
    const postCrashPortfolio = portfolioAtCrash * (1 + impactPercentage / 100);
    
    // Calculate recovery value
    const finalPortfolio = postCrashPortfolio * Math.pow(1 + postGrowthRate, yearsAfterCrash);
    const additionalContributions = monthlyContribution * 12 * yearsAfterCrash * ((Math.pow(1 + postGrowthRate, yearsAfterCrash) - 1) / postGrowthRate);
    
    // Update results
    results.totalSavings = finalPortfolio + additionalContributions;
    results.monthlyIncome = results.totalSavings * 0.04 / 12; // 4% withdrawal rule
    results.marketCrashImpact = {
        crashYear: crashYear,
        impactPercentage: impactPercentage,
        portfolioLoss: portfolioAtCrash * (-impactPercentage / 100),
        recoveryYears: yearsAfterCrash
    };
    
    return results;
}

// Generate comparison data for all scenarios
function generateStressTestComparison(inputs, workPeriods, language = 'he') {
    const baselineResults = window.calculateRetirement ? window.calculateRetirement(inputs, workPeriods, [], []) : null;
    
    const comparison = {
        baseline: {
            name: language === 'he' ? 'תרחיש בסיס' : 'Baseline Scenario',
            results: baselineResults,
            parameters: {
                pensionReturn: 7.0,
                inflationRate: inputs.inflationRate || 3.0,
                salaryGrowthRate: inputs.salaryGrowthRate || 3.5
            }
        },
        scenarios: {}
    };
    
    // Run all stress tests
    Object.values(STRESS_TEST_SCENARIOS).forEach(scenario => {
        const results = runStressTest(inputs, workPeriods, scenario);
        comparison.scenarios[scenario.id] = {
            scenario: scenario,
            results: results
        };
    });
    
    return comparison;
}

// Translate Claude scenario description into stress test parameters
function translateClaudeScenario(scenarioDescription, language = 'he') {
    // Parse scenario description using keyword matching
    const description = scenarioDescription.toLowerCase();
    
    let parameters = {
        pensionReturn: 7.0,
        trainingFundReturn: 6.5,
        personalPortfolioReturn: 8.0,
        realEstateReturn: 6.0,
        cryptoReturn: 15.0,
        inflationRate: 3.0,
        salaryGrowthRate: 3.5,
        marketCrashYear: null,
        economicShockImpact: 0
    };
    
    let scenarioName = language === 'he' ? 'תרחיש מותאם' : 'Custom Scenario';
    let reasoning = 'Custom scenario based on user description.';
    
    // Detect economic conditions
    if (description.includes('recession') || description.includes('crisis') || description.includes('crash')) {
        parameters.pensionReturn -= 2.0;
        parameters.trainingFundReturn -= 2.0;
        parameters.personalPortfolioReturn -= 2.5;
        parameters.marketCrashYear = 5;
        parameters.economicShockImpact = -25;
        scenarioName = language === 'he' ? 'תרחיש משבר כלכלי' : 'Economic Crisis Scenario';
        reasoning = 'Economic crisis scenario with market crash and reduced returns.';
    }
    
    if (description.includes('inflation') || description.includes('high inflation')) {
        const inflationIncrease = description.includes('high') ? 4.0 : 2.0;
        parameters.inflationRate += inflationIncrease;
        parameters.realEstateReturn += 2.0; // Real estate hedge
        parameters.cryptoReturn += 3.0; // Crypto hedge
        scenarioName = language === 'he' ? 'תרחיש אינפלציה גבוהה' : 'High Inflation Scenario';
        reasoning = 'High inflation scenario with asset price adjustments for inflation hedges.';
    }
    
    if (description.includes('optimistic') || description.includes('boom') || description.includes('growth')) {
        parameters.pensionReturn += 2.0;
        parameters.trainingFundReturn += 2.0;
        parameters.personalPortfolioReturn += 2.5;
        parameters.realEstateReturn += 2.0;
        parameters.inflationRate -= 1.0;
        parameters.salaryGrowthRate += 2.0;
        scenarioName = language === 'he' ? 'תרחיש צמיחה' : 'Growth Scenario';
        reasoning = 'Optimistic growth scenario with higher returns and controlled inflation.';
    }
    
    if (description.includes('stagnation') || description.includes('slow growth')) {
        parameters.pensionReturn -= 1.5;
        parameters.trainingFundReturn -= 1.5;
        parameters.personalPortfolioReturn -= 1.5;
        parameters.salaryGrowthRate -= 2.0;
        scenarioName = language === 'he' ? 'תרחיש קיפאון' : 'Stagnation Scenario';
        reasoning = 'Economic stagnation with reduced growth and returns.';
    }
    
    if (description.includes('war') || description.includes('geopolitical')) {
        parameters.pensionReturn -= 1.0;
        parameters.personalPortfolioReturn -= 2.0;
        parameters.inflationRate += 2.0;
        parameters.marketCrashYear = 3;
        parameters.economicShockImpact = -15;
        scenarioName = language === 'he' ? 'תרחיש גיאופוליטי' : 'Geopolitical Risk Scenario';
        reasoning = 'Geopolitical instability affecting markets and inflation.';
    }
    
    // Extract specific numbers if mentioned
    const percentMatches = description.match(/(\d+)%/g);
    if (percentMatches) {
        const percentValues = percentMatches.map(match => parseFloat(match.replace('%', '')));
        
        if (description.includes('return')) {
            if (percentValues[0] <= 10) {
                parameters.pensionReturn = percentValues[0];
                parameters.personalPortfolioReturn = percentValues[0] + 1;
            }
        }
        
        if (description.includes('inflation')) {
            if (percentValues[0] <= 15) {
                parameters.inflationRate = percentValues[0];
            }
        }
    }
    
    return {
        id: 'claude_custom',
        name: {
            he: scenarioName,
            en: scenarioName
        },
        description: {
            he: scenarioDescription,
            en: scenarioDescription
        },
        parameters: parameters,
        reasoning: reasoning,
        source: 'claude_translation'
    };
}

// Export functions to window for global access
window.STRESS_TEST_SCENARIOS = STRESS_TEST_SCENARIOS;
window.runStressTest = runStressTest;
window.generateStressTestComparison = generateStressTestComparison;
window.translateClaudeScenario = translateClaudeScenario;

// Also make it available as a module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STRESS_TEST_SCENARIOS,
        runStressTest,
        generateStressTestComparison,
        translateClaudeScenario
    };
}