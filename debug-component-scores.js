// Debug script for Component Scores issues
// Run this in the browser console to analyze field mapping

(function debugComponentScores() {
    console.log('🔍 DEBUG: Component Scores Field Mapping Analysis');
    console.log('================================================');
    
    // Get current inputs
    const inputs = window.getAllInputs ? window.getAllInputs() : {};
    console.log('\n📋 Total input fields:', Object.keys(inputs).length);
    
    // 1. Analyze salary fields
    console.log('\n💰 SALARY FIELD ANALYSIS:');
    const salaryFields = [
        'currentMonthlySalary', 'monthlySalary', 'currentSalary', 
        'salary', 'monthlyIncome', 'grossSalary',
        'partner1Salary', 'partner2Salary',
        'partner1MonthlySalary', 'partner2MonthlySalary'
    ];
    
    const foundSalaryFields = {};
    salaryFields.forEach(field => {
        if (inputs[field] !== undefined && inputs[field] !== null && inputs[field] !== '') {
            foundSalaryFields[field] = inputs[field];
        }
    });
    
    if (Object.keys(foundSalaryFields).length > 0) {
        console.log('✅ Found salary fields:', foundSalaryFields);
    } else {
        console.log('❌ No salary fields found!');
        console.log('Available fields containing "salary":', 
            Object.keys(inputs).filter(k => k.toLowerCase().includes('salary'))
        );
    }
    
    // 2. Analyze savings fields
    console.log('\n💵 SAVINGS FIELD ANALYSIS:');
    const savingsFields = [
        'currentSavings', 'currentPension', 'currentTrainingFund',
        'currentPersonalPortfolio', 'currentRealEstate', 'currentCrypto',
        'partner1CurrentPension', 'partner2CurrentPension',
        'partner1CurrentTrainingFund', 'partner2CurrentTrainingFund',
        'partner1PersonalPortfolio', 'partner2PersonalPortfolio'
    ];
    
    const foundSavingsFields = {};
    let totalCurrentSavings = 0;
    
    savingsFields.forEach(field => {
        if (inputs[field] !== undefined && inputs[field] !== null && inputs[field] !== '') {
            const value = parseFloat(inputs[field]) || 0;
            foundSavingsFields[field] = value;
            totalCurrentSavings += value;
        }
    });
    
    if (Object.keys(foundSavingsFields).length > 0) {
        console.log('✅ Found savings fields:', foundSavingsFields);
        console.log('📊 Total current savings:', totalCurrentSavings);
    } else {
        console.log('❌ No savings fields found!');
        console.log('Available fields containing "saving" or "pension":', 
            Object.keys(inputs).filter(k => 
                k.toLowerCase().includes('saving') || 
                k.toLowerCase().includes('pension') ||
                k.toLowerCase().includes('portfolio')
            )
        );
    }
    
    // 3. Analyze contribution fields
    console.log('\n📈 CONTRIBUTION FIELD ANALYSIS:');
    const contributionFields = [
        'monthlyContribution', 'pensionEmployeeRate', 'employeePensionRate',
        'trainingFundEmployeeRate', 'personalPortfolioMonthly',
        'partner1PensionEmployeeRate', 'partner2PensionEmployeeRate',
        'partner1EmployeeRate', 'partner2EmployeeRate'
    ];
    
    const foundContributionFields = {};
    contributionFields.forEach(field => {
        if (inputs[field] !== undefined && inputs[field] !== null && inputs[field] !== '') {
            foundContributionFields[field] = inputs[field];
        }
    });
    
    if (Object.keys(foundContributionFields).length > 0) {
        console.log('✅ Found contribution fields:', foundContributionFields);
    } else {
        console.log('❌ No contribution fields found!');
        console.log('Available fields containing "contribution" or "rate":', 
            Object.keys(inputs).filter(k => 
                k.toLowerCase().includes('contribution') || 
                k.toLowerCase().includes('rate')
            )
        );
    }
    
    // 4. Test retirement calculation
    console.log('\n🧮 RETIREMENT CALCULATION TEST:');
    if (window.calculateRetirement) {
        try {
            const result = window.calculateRetirement(inputs);
            console.log('Calculation result:', {
                totalSavings: result.totalSavings || 0,
                monthlyIncome: result.monthlyIncome || 0,
                pensionSavings: result.pensionSavings || 0,
                trainingFundValue: result.trainingFundValue || 0
            });
            
            if (result.totalSavings === 0) {
                console.log('⚠️ Total savings is 0 - missing critical inputs');
            }
        } catch (e) {
            console.error('❌ Calculation error:', e.message);
        }
    }
    
    // 5. Provide field mapping recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    const recommendations = [];
    
    if (Object.keys(foundSalaryFields).length === 0) {
        recommendations.push('1. No salary data found - check field names in WizardStepSalary');
    }
    
    if (totalCurrentSavings === 0) {
        recommendations.push('2. No current savings found - check field names in WizardStepSavings');
    }
    
    if (Object.keys(foundContributionFields).length === 0) {
        recommendations.push('3. No contribution rates found - check field names in WizardStepContributions');
    }
    
    if (!inputs.currentAge || !inputs.retirementAge) {
        recommendations.push('4. Age data missing - required for calculations');
    }
    
    if (!inputs.planningType) {
        recommendations.push('5. Planning type not set - affects field mapping');
    }
    
    if (recommendations.length > 0) {
        recommendations.forEach(rec => console.log(rec));
    } else {
        console.log('✅ All critical fields appear to be present');
    }
    
    // 6. Show actual field names being used
    console.log('\n📝 ACTUAL FIELD NAMES IN USE:');
    const categorizedFields = {
        personal: Object.keys(inputs).filter(k => k.includes('current') || k.includes('age')),
        partner1: Object.keys(inputs).filter(k => k.includes('partner1')),
        partner2: Object.keys(inputs).filter(k => k.includes('partner2')),
        other: Object.keys(inputs).filter(k => 
            !k.includes('current') && !k.includes('age') && 
            !k.includes('partner1') && !k.includes('partner2')
        )
    };
    
    Object.entries(categorizedFields).forEach(([category, fields]) => {
        if (fields.length > 0) {
            console.log(`\n${category.toUpperCase()}:`, fields.slice(0, 10).join(', '));
            if (fields.length > 10) {
                console.log(`... and ${fields.length - 10} more`);
            }
        }
    });
    
    // Save debug data
    window.componentScoresDebug = {
        inputs,
        foundSalaryFields,
        foundSavingsFields,
        foundContributionFields,
        totalCurrentSavings,
        recommendations,
        timestamp: new Date().toISOString()
    };
    
    console.log('\n💾 Debug data saved to window.componentScoresDebug');
})();