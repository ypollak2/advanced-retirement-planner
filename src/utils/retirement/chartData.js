// Chart Data Module
// Chart data generation utilities

window.generateRetirementChartData = (inputs, workPeriods, partnerWorkPeriods, chartView = 'combined') => {
    if (!inputs || typeof inputs !== 'object' || !workPeriods) {
        console.warn('generateRetirementChartData: Invalid inputs provided.');
        return [];
    }

    const { currentAge, retirementAge, inflationRate = 3, ...rest } = inputs;
    if (currentAge >= retirementAge) {
        console.warn('generateRetirementChartData: Current age must be less than retirement age.');
        return [];
    }

    const chartData = [];
    let simulationInputs = { ...inputs };

    for (let age = currentAge; age <= retirementAge; age++) {
        const results = window.calculateRetirement(simulationInputs, workPeriods, partnerWorkPeriods);
        if (!results) continue;

        const yearsElapsed = age - currentAge;
        const inflationDivisor = Math.pow(1 + (inflationRate / 100), yearsElapsed);

        let dataPoint = {
            age: age,
            totalSavings: results.totalSavings,
            inflationAdjusted: results.totalSavings / inflationDivisor,
            pensionSavings: results.totalSavings, // Simplified for chart
            trainingFund: results.trainingFundValue,
            personalPortfolio: results.personalPortfolioValue,
            crypto: results.currentCrypto,
            realEstate: results.currentRealEstate,
        };

        if (inputs.planningType === 'couple' && results.partnerResults) {
            const partnerData = chartView === 'partner1' ? results.partnerResults.partner1 : results.partnerResults.partner2;
            if (partnerData) {
                dataPoint.totalSavings = partnerData.totalSavings;
                dataPoint.inflationAdjusted = partnerData.totalSavings / inflationDivisor;
                dataPoint.pensionSavings = partnerData.totalSavings;
            }
        }

        chartData.push(dataPoint);
        simulationInputs.currentAge++;
    }

    return chartData;
};

// Export functions
window.ChartData = {
    generateRetirementChartData: window.generateRetirementChartData
};

console.log('✅ Chart data module loaded');