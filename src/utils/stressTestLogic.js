// Stress Testing Logic for Retirement Planning
// Dependencies: calculateRetirement from retirementCalculations.js

const runStressTest = (scenarioType, inputs, workPeriods, pensionIndexAllocation, trainingFundIndexAllocation, historicalReturns, language) => {
    // Immediate safety check
    if (typeof scenarioType !== 'string') {
        console.error('Invalid scenario type');
        return null;
    }
    
    console.log('=== STRESS TEST START ===');
    console.log('Scenario:', scenarioType);
    
    const scenarios = {
        financial_crisis_2008: {
            name: language === 'he' ? "משבר פיננסי 2008" : "2008 Financial Crisis",
            description: language === 'he' 
                ? "ירידה של 40% במניות, 30% בנדל״ן, עלייה באבטלה ותשואות נמוכות למשך 3 שנים"
                : "40% stock decline, 30% real estate decline, unemployment rise, low returns for 3 years",
            incomeReduction: 15,
            portfolioDecline: 40,
            realEstateDecline: 30,
            inflationIncrease: 1,
            duration: 3,
            recoveryYears: 5
        },
        covid_pandemic: {
            name: language === 'he' ? "משבר קורונה 2020" : "COVID-19 Pandemic 2020",
            description: language === 'he' 
                ? "ירידת הכנסה של 25%, תנודתיות גבוהה, עלייה בהוצאות רפואיות והתאוששות במשך שנתיים"
                : "25% income reduction, high volatility, increased medical expenses, recovery over two years",
            incomeReduction: 25,
            portfolioDecline: 25,
            realEstateDecline: 10,
            inflationIncrease: 3,
            duration: 2,
            recoveryYears: 3
        },
        high_inflation: {
            name: language === 'he' ? "אינפלציה גבוהה" : "High Inflation Scenario",
            description: language === 'he' 
                ? "אינפלציה של 15% לשנה, עליית מחירי מזון ודלק, ירידה בכוח הקנייה למשך 5 שנים"
                : "15% annual inflation, rising food & fuel prices, decreased purchasing power for 5 years",
            incomeReduction: 5,
            portfolioDecline: 15,
            realEstateDecline: 5,
            inflationIncrease: 12,
            duration: 5,
            recoveryYears: 7
        }
    };

    const scenario = scenarios[scenarioType];
    if (!scenario) {
        console.error('Unknown scenario type:', scenarioType);
        return null;
    }

    // Calculate stressed results
    const stressedResults = calculateStressedResults(scenario, inputs, workPeriods, pensionIndexAllocation, trainingFundIndexAllocation, historicalReturns);
    
    return {
        scenario,
        stressedResults,
        recommendations: generateStressTestRecommendations(scenario, stressedResults, language)
    };
};

const calculateStressedResults = (scenario, inputs, workPeriods, pensionIndexAllocation, trainingFundIndexAllocation, historicalReturns) => {
    // Create stressed inputs
    const stressedInputs = {
        ...inputs,
        inflationRate: inputs.inflationRate + scenario.inflationIncrease,
        personalPortfolioReturn: Math.max(0, inputs.personalPortfolioReturn - scenario.portfolioDecline),
        realEstateReturn: Math.max(0, inputs.realEstateReturn - scenario.realEstateDecline),
        cryptoReturn: Math.max(0, inputs.cryptoReturn - scenario.portfolioDecline * 1.5)
    };

    // Create stressed work periods
    const stressedWorkPeriods = workPeriods.map(period => ({
        ...period,
        salary: period.salary * (1 - scenario.incomeReduction / 100),
        monthlyContribution: period.monthlyContribution * (1 - scenario.incomeReduction / 100),
        pensionReturn: Math.max(0, period.pensionReturn - scenario.portfolioDecline / 2)
    }));

    // Calculate with stressed parameters
    return calculateRetirement(stressedInputs, stressedWorkPeriods, pensionIndexAllocation, trainingFundIndexAllocation, historicalReturns);
};

const generateStressTestRecommendations = (scenario, stressedResults, language) => {
    const recommendations = [];
    
    if (language === 'he') {
        recommendations.push(
            "הגדל את החירום הפונד לכיסוי 6-12 חודשים",
            "שקול גיוון השקעות לנכסים בטוחים יותר",
            "בחן אפשרויות להגדלת הכנסה נוספת",
            "צמצם הוצאות לא חיוניות"
        );
    } else {
        recommendations.push(
            "Increase emergency fund to cover 6-12 months",
            "Consider diversifying to safer investments",
            "Explore additional income opportunities",
            "Reduce non-essential expenses"
        );
    }
    
    return recommendations;
};

// Export to window for global access
window.runStressTest = runStressTest;
window.calculateStressedResults = calculateStressedResults;
window.generateStressTestRecommendations = generateStressTestRecommendations;