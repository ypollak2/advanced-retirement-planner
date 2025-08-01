// Debug script to analyze field mapping issues
(function debugFieldMapping() {
    console.log('🔍 FIELD MAPPING DEBUG');
    console.log('=====================');
    
    // Get inputs from localStorage
    const inputs = window.getAllInputs ? window.getAllInputs() : {};
    console.log('Total fields:', Object.keys(inputs).length);
    
    // Check what salary fields we have
    console.log('\n📊 SALARY FIELDS:');
    const salaryFields = Object.keys(inputs).filter(key => 
        key.toLowerCase().includes('salary') || 
        key.toLowerCase().includes('income')
    );
    salaryFields.forEach(field => {
        console.log(`  ${field}: ${inputs[field]}`);
    });
    
    // Check savings fields
    console.log('\n💰 SAVINGS FIELDS:');
    const savingsFields = Object.keys(inputs).filter(key => 
        key.toLowerCase().includes('saving') || 
        key.toLowerCase().includes('pension') ||
        key.toLowerCase().includes('portfolio') ||
        key.toLowerCase().includes('fund')
    );
    savingsFields.forEach(field => {
        console.log(`  ${field}: ${inputs[field]}`);
    });
    
    // Check contribution rate fields
    console.log('\n📈 CONTRIBUTION RATE FIELDS:');
    const rateFields = Object.keys(inputs).filter(key => 
        key.toLowerCase().includes('rate') || 
        key.toLowerCase().includes('contribution')
    );
    rateFields.forEach(field => {
        console.log(`  ${field}: ${inputs[field]}`);
    });
    
    // Test the actual calculation
    console.log('\n🧮 TESTING CALCULATIONS:');
    
    // Test 1: Current monthly income
    let monthlyIncome = 0;
    
    // Try different field names
    const incomeFieldsToTry = [
        'currentMonthlySalary',
        'monthlySalary', 
        'currentSalary',
        'salary',
        'monthlyIncome'
    ];
    
    for (const field of incomeFieldsToTry) {
        if (inputs[field]) {
            monthlyIncome = parseFloat(inputs[field]);
            console.log(`✅ Found monthly income in '${field}': ${monthlyIncome}`);
            break;
        }
    }
    
    if (monthlyIncome === 0) {
        console.log('❌ No monthly income field found');
    }
    
    // Test 2: Total savings
    let totalSavings = 0;
    const savingsFieldsToSum = [
        'currentSavings',
        'currentPension',
        'currentTrainingFund',
        'currentPersonalPortfolio',
        'personalPortfolio',
        'currentRealEstate',
        'realEstate',
        'currentCrypto'
    ];
    
    console.log('\n💵 Calculating total savings:');
    savingsFieldsToSum.forEach(field => {
        if (inputs[field]) {
            const value = parseFloat(inputs[field]) || 0;
            totalSavings += value;
            console.log(`  + ${field}: ${value}`);
        }
    });
    console.log(`  = Total: ${totalSavings}`);
    
    // Test the retirement calculation
    if (window.calculateRetirement) {
        console.log('\n🎯 Testing calculateRetirement with current inputs:');
        try {
            const result = window.calculateRetirement(inputs);
            console.log('Result:', {
                totalSavings: result.totalSavings,
                monthlyIncome: result.monthlyIncome,
                pensionSavings: result.pensionSavings,
                trainingFundValue: result.trainingFundValue,
                personalPortfolioValue: result.personalPortfolioValue
            });
        } catch (error) {
            console.error('Error in calculateRetirement:', error);
        }
    }
    
    // Check what the Review step is receiving
    console.log('\n📋 REVIEW STEP INPUTS:');
    console.log('planningType:', inputs.planningType);
    console.log('currentAge:', inputs.currentAge);
    console.log('retirementAge:', inputs.retirementAge);
    
    // Return analysis
    return {
        totalFields: Object.keys(inputs).length,
        hasMonthlyIncome: monthlyIncome > 0,
        monthlyIncome: monthlyIncome,
        totalSavings: totalSavings,
        missingCriticalFields: {
            monthlySalary: !inputs.currentMonthlySalary && !inputs.monthlySalary,
            pensionRate: !inputs.pensionContributionRate && !inputs.employeePensionRate,
            trainingRate: !inputs.trainingFundContributionRate && !inputs.trainingFundEmployeeRate
        }
    };
})();