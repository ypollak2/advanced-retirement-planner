// Debug script for WizardStepReview issues
// Run this in the browser console when on the Review step

(function() {
    console.log('🔍 === DEBUGGING WIZARD REVIEW STEP ===');
    
    // 1. Check if we're on the review step
    const reviewStep = document.querySelector('[class*="review"], #step-9, [data-step="9"]');
    console.log('✅ On Review Step:', !!reviewStep);
    
    // 2. Check available global functions
    console.log('\n📦 Global Functions Available:');
    console.log('- generateRetirementProjectionChart:', typeof window.generateRetirementProjectionChart);
    console.log('- calculateRetirement:', typeof window.calculateRetirement);
    console.log('- calculateFinancialHealthScore:', typeof window.calculateFinancialHealthScore);
    console.log('- formatCurrency:', typeof window.formatCurrency);
    console.log('- enhancedGetFieldValue:', typeof window.enhancedGetFieldValue);
    
    // 3. Check current inputs
    console.log('\n📋 Current Inputs:');
    const inputs = window.getAllInputs ? window.getAllInputs() : {};
    console.log('Planning Type:', inputs.planningType);
    console.log('Input Keys:', Object.keys(inputs).length, 'fields');
    
    // Key fields check
    const keyFields = {
        'Salary Data': {
            individual: ['currentMonthlySalary', 'currentSalary', 'monthlySalary'],
            couple: ['partner1Salary', 'partner2Salary']
        },
        'Bonus/RSU Data': {
            individual: ['annualBonus', 'quarterlyRSU'],
            couple: ['partner1Bonus', 'partner2Bonus', 'partner1RSU', 'partner2RSU']
        },
        'Savings Data': {
            individual: ['currentSavings', 'currentTrainingFund', 'currentPersonalPortfolio'],
            couple: ['partner1CurrentPension', 'partner2CurrentPension', 'partner1PersonalPortfolio', 'partner2PersonalPortfolio']
        },
        'Contribution Rates': {
            individual: ['employeePensionRate', 'trainingFundEmployeeRate'],
            couple: ['partner1PensionEmployeeRate', 'partner2PensionEmployeeRate']
        }
    };
    
    const mode = inputs.planningType === 'couple' ? 'couple' : 'individual';
    console.log('\n🔍 Key Fields Check (' + mode + ' mode):');
    
    Object.entries(keyFields).forEach(([category, fields]) => {
        console.log(`\n${category}:`);
        fields[mode].forEach(field => {
            const value = inputs[field];
            const exists = value !== undefined && value !== null && value !== '';
            console.log(`  - ${field}: ${exists ? '✅' : '❌'} ${exists ? value : 'MISSING'}`);
        });
    });
    
    // 4. Test Retirement Projection Chart
    console.log('\n📊 Testing Retirement Projection Chart:');
    try {
        if (window.generateRetirementProjectionChart) {
            const chartData = window.generateRetirementProjectionChart(inputs);
            console.log('- Chart data generated:', Array.isArray(chartData) ? '✅' : '❌');
            console.log('- Data points:', chartData ? chartData.length : 0);
            if (chartData && chartData.length > 0) {
                console.log('- First data point:', chartData[0]);
                console.log('- Last data point:', chartData[chartData.length - 1]);
            }
        } else {
            console.log('❌ generateRetirementProjectionChart function not found!');
        }
    } catch (error) {
        console.error('❌ Chart generation error:', error);
    }
    
    // 5. Test Retirement Calculations
    console.log('\n💰 Testing Retirement Calculations:');
    try {
        if (window.calculateRetirement) {
            const results = window.calculateRetirement(inputs);
            console.log('- Calculation completed:', !!results);
            console.log('- Total Savings:', results.totalSavings || 0);
            console.log('- Monthly Income:', results.monthlyIncome || 0);
            console.log('- Total Net Income:', results.totalNetIncome || 0);
            
            if (results.totalSavings === 0) {
                console.log('⚠️ Total savings is 0 - checking individual components:');
                console.log('  - Pension:', results.pensionSavings || 0);
                console.log('  - Training Fund:', results.trainingFundValue || 0);
                console.log('  - Portfolio:', results.personalPortfolioValue || 0);
                console.log('  - Real Estate:', results.currentRealEstate || 0);
                console.log('  - Crypto:', results.currentCrypto || 0);
            }
        } else {
            console.log('❌ calculateRetirement function not found!');
        }
    } catch (error) {
        console.error('❌ Retirement calculation error:', error);
    }
    
    // 6. Test Financial Health Score
    console.log('\n🏥 Testing Financial Health Score:');
    try {
        if (window.calculateFinancialHealthScore) {
            const score = window.calculateFinancialHealthScore(inputs);
            console.log('- Score calculated:', !!score);
            console.log('- Total Score:', score.totalScore || 0);
            console.log('- Components:', score.components || {});
            
            if (score.components) {
                Object.entries(score.components).forEach(([component, data]) => {
                    const value = data.score || 0;
                    const max = data.maxScore || 0;
                    const percent = max > 0 ? Math.round((value / max) * 100) : 0;
                    console.log(`  - ${component}: ${value}/${max} (${percent}%)`);
                });
            }
        } else {
            console.log('❌ calculateFinancialHealthScore function not found!');
        }
    } catch (error) {
        console.error('❌ Financial health score error:', error);
    }
    
    // 7. Check DOM elements
    console.log('\n🖼️ Checking DOM Elements:');
    const elements = {
        'Retirement Projection Panel': document.querySelector('[class*="retirement-projection"]'),
        'Component Scores Section': document.querySelector('.component-scores, #component-scores'),
        'Financial Health Section': document.querySelector('[class*="financial-health"]'),
        'Total Accumulation Display': Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent.includes('Total Accumulation') || el.textContent.includes('צבירה צפויה')
        ),
        'Monthly Income Display': Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent.includes('Monthly Income') && !el.textContent.includes('Retirement')
        ),
        'Savings Rate Display': Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent.includes('Savings Rate')
        ),
        'Tax Efficiency Display': Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent.includes('Tax Efficiency')
        )
    };
    
    Object.entries(elements).forEach(([name, element]) => {
        console.log(`- ${name}: ${element ? '✅ Found' : '❌ Not found'}`);
        if (element && name.includes('Display')) {
            console.log(`  Content: "${element.textContent.trim()}"`);
        }
    });
    
    // 8. Field mapping test
    console.log('\n🔗 Testing Field Mapping:');
    if (window.enhancedGetFieldValue) {
        // Test salary detection
        const salary = window.enhancedGetFieldValue(inputs, [
            'currentMonthlySalary', 'monthlySalary', 'currentSalary',
            'partner1Salary', 'partner2Salary'
        ], { combinePartners: inputs.planningType === 'couple', debugMode: true });
        console.log('- Salary detection:', salary);
        
        // Test contribution rates
        const pensionRate = window.enhancedGetFieldValue(inputs, [
            'employeePensionRate', 'pensionEmployeeRate',
            'partner1PensionEmployeeRate', 'partner2PensionEmployeeRate'
        ], { allowZero: true, debugMode: true });
        console.log('- Pension rate detection:', pensionRate);
    }
    
    // 9. Generate recommendations
    console.log('\n💡 Recommendations:');
    const issues = [];
    
    if (!window.generateRetirementProjectionChart) {
        issues.push('❌ Chart generation function missing - check chartDataGenerator.js loading');
    }
    if (!window.calculateRetirement) {
        issues.push('❌ Retirement calculation function missing - check retirementCalculations.js loading');
    }
    if (!window.calculateFinancialHealthScore) {
        issues.push('❌ Financial health score function missing - check financialHealthEngine.js loading');
    }
    
    // Check for missing data
    if (mode === 'couple') {
        if (!inputs.partner1Salary || !inputs.partner2Salary) {
            issues.push('❌ Partner salary data missing');
        }
        if (!inputs.partner1PensionEmployeeRate && !inputs.partner2PensionEmployeeRate) {
            issues.push('❌ Partner contribution rates missing');
        }
    } else {
        if (!inputs.currentMonthlySalary && !inputs.monthlySalary) {
            issues.push('❌ Salary data missing');
        }
        if (!inputs.employeePensionRate && !inputs.pensionEmployeeRate) {
            issues.push('❌ Contribution rates missing');
        }
    }
    
    if (issues.length > 0) {
        console.log('Issues found:');
        issues.forEach(issue => console.log(issue));
    } else {
        console.log('✅ All core functions and data appear to be available');
    }
    
    console.log('\n📝 Debug data saved to window.debugData');
    window.debugData = {
        inputs,
        functions: {
            generateRetirementProjectionChart: !!window.generateRetirementProjectionChart,
            calculateRetirement: !!window.calculateRetirement,
            calculateFinancialHealthScore: !!window.calculateFinancialHealthScore
        },
        elements: Object.fromEntries(
            Object.entries(elements).map(([k, v]) => [k, !!v])
        )
    };
})();