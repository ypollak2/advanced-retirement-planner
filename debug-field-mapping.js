#!/usr/bin/env node

/**
 * TICKET-009: Financial Health Score Field Mapping Diagnostic Tool
 * 
 * This tool diagnoses field mapping issues in the Financial Health Score system.
 * 
 * Issue: User getting 31/100 instead of expected 70-80 score with multiple components showing 0:
 * - Savings Rate: 0/25
 * - Retirement Readiness: 0
 * - Risk Alignment: 0
 * - Tax Efficiency: 0
 * 
 * Usage: node debug-field-mapping.js
 */

console.log('\n🔍 TICKET-009: Financial Health Score Field Mapping Diagnostic');
console.log('============================================================\n');

const fs = require('fs');
const path = require('path');

// Mock typical user input data patterns to test field mapping
const TEST_SCENARIOS = {
    individual_good_data: {
        planningType: 'individual',
        currentAge: 35,
        retirementAge: 65,
        currentMonthlySalary: 15000,
        monthlySalary: 15000,
        pensionContributionRate: 6.5,
        pensionEmployerRate: 6.5,
        trainingFundContributionRate: 2.5,
        trainingFundEmployerRate: 2.5,
        currentPensionSavings: 150000,
        currentTrainingFund: 50000,
        currentPersonalPortfolio: 100000,
        riskTolerance: 'moderate',
        taxCountry: 'israel'
    },
    
    couple_good_data: {
        planningType: 'couple',
        currentAge: 35,
        retirementAge: 65,
        partner1Salary: 15000,
        partner2Salary: 12000,
        partner1Name: 'Partner 1',
        partner2Name: 'Partner 2',
        pensionContributionRate: 6.5,
        pensionEmployerRate: 6.5,
        trainingFundContributionRate: 2.5,
        trainingFundEmployerRate: 2.5,
        currentPensionSavings: 200000,
        currentTrainingFund: 80000,
        currentPersonalPortfolio: 150000,
        riskTolerance: 'moderate',
        taxCountry: 'israel'
    },
    
    typical_wizard_output: {
        // This simulates what the wizard might actually output
        planningType: 'individual',
        currentAge: 35,
        retirementAge: 65,
        // Potential field name variations that might be used
        salary: 15000,
        monthlyIncome: 15000,
        pensionEmployee: 6.5,
        pensionEmployer: 6.5,
        trainingFundEmployee: 2.5,
        trainingFundEmployer: 2.5,
        pensionSavings: 150000,
        trainingFund: 50000,
        portfolio: 100000,
        riskProfile: 'moderate',
        country: 'israel'
    }
};

// Load field mapping dictionary to understand expected patterns
function loadFieldMappingDictionary() {
    try {
        const dictPath = path.join(__dirname, 'src/utils/fieldMappingDictionary.js');
        const dictContent = fs.readFileSync(dictPath, 'utf8');
        
        console.log('📋 Field Mapping Dictionary Analysis');
        console.log('====================================');
        
        // Extract field mapping patterns
        const salaryPatterns = dictContent.match(/salary:\s*\[(.*?)\]/s);
        const partnerSalaryPatterns = dictContent.match(/partnerSalary:\s*\[(.*?)\]/s);
        const pensionPatterns = dictContent.match(/pensionEmployeeRate:\s*\[(.*?)\]/s);
        
        if (salaryPatterns) {
            console.log('💰 Individual Salary Field Patterns:');
            const fields = salaryPatterns[1].split(',').map(f => f.trim().replace(/['"]/g, ''));
            fields.forEach(field => console.log(`  - ${field}`));
        }
        
        if (partnerSalaryPatterns) {
            console.log('\n👫 Partner Salary Field Patterns:');
            const fields = partnerSalaryPatterns[1].split(',').map(f => f.trim().replace(/['"]/g, ''));
            fields.forEach(field => console.log(`  - ${field}`));
        }
        
        if (pensionPatterns) {
            console.log('\n💼 Pension Rate Field Patterns:');
            const fields = pensionPatterns[1].split(',').map(f => f.trim().replace(/['"]/g, ''));
            fields.forEach(field => console.log(`  - ${field}`));
        }
        
        return true;
    } catch (error) {
        console.error('❌ Could not load field mapping dictionary:', error.message);
        return false;
    }
}

// Simulate the getFieldValue function logic (TICKET-009 FIX)
function simulateFieldSearch(inputs, fieldNames, options = {}) {
    const { combinePartners = false, allowZero = false, expectString = false } = options;
    
    console.log(`\n🔍 Searching for fields: [${fieldNames.join(', ')}]`);
    console.log(`   Planning type: ${inputs.planningType}`);
    console.log(`   Combine partners: ${combinePartners}`);
    console.log(`   Allow zero: ${allowZero}`);
    console.log(`   Expect string: ${expectString}`);
    
    // TICKET-009 FIX: Define string fields that should not be parsed as numbers
    const STRING_FIELDS = [
        'riskTolerance', 'riskProfile', 'investmentRisk', 'riskLevel',
        'taxCountry', 'country', 'taxLocation', 'location', 'countryCode',
        'planningType', 'rsuFrequency', 'currency', 'baseCurrency',
        'pensionFundProvider', 'bankName', 'insuranceProvider'
    ];
    
    const foundFields = [];
    const missingFields = [];
    
    for (const fieldName of fieldNames) {
        if (inputs[fieldName] !== undefined && inputs[fieldName] !== null && inputs[fieldName] !== '') {
            // Check if this is a string field or if we explicitly expect a string
            const isStringField = expectString || STRING_FIELDS.some(sf => 
                fieldName.toLowerCase().includes(sf.toLowerCase()) || 
                sf.toLowerCase().includes(fieldName.toLowerCase())
            );
            
            if (isStringField) {
                // For string fields, return the string value
                const stringValue = String(inputs[fieldName]).toLowerCase().trim();
                foundFields.push({ field: fieldName, value: stringValue, type: 'string' });
                console.log(`   ✅ Found string: ${fieldName} = "${stringValue}"`);
            } else {
                // For numeric fields, parse as number
                const numericValue = parseFloat(inputs[fieldName]);
                if (!isNaN(numericValue) && (allowZero || numericValue > 0)) {
                    foundFields.push({ field: fieldName, value: numericValue, type: 'number' });
                    console.log(`   ✅ Found number: ${fieldName} = ${numericValue}`);
                } else {
                    console.log(`   ⚠️  Found but invalid numeric: ${fieldName} = ${inputs[fieldName]}`);
                    missingFields.push(fieldName);
                }
            }
        } else {
            missingFields.push(fieldName);
        }
    }
    
    if (foundFields.length === 0) {
        console.log('   ❌ No valid fields found');
        console.log(`   📋 Available fields in input: [${Object.keys(inputs).join(', ')}]`);
        return expectString ? null : 0;
    }
    
    return foundFields[0].value;
}

// Test financial health scoring field requirements
function testFinancialHealthFieldMapping(inputs) {
    console.log(`\n💯 Testing Financial Health Score Field Mapping`);
    console.log(`===============================================`);
    console.log(`Planning Type: ${inputs.planningType}`);
    console.log(`Available Fields: ${Object.keys(inputs).length}`);
    console.log(`Fields: [${Object.keys(inputs).join(', ')}]`);
    
    // Test 1: Savings Rate (Income Detection)
    console.log('\n🔍 TEST 1: Savings Rate - Income Detection');
    let monthlyIncome = 0;
    
    if (inputs.planningType === 'couple') {
        const partnerFields = [
            'partner1NetSalary', 'partner2NetSalary', 'partner1NetIncome', 'partner2NetIncome',
            'partner1GrossSalary', 'partner2GrossSalary',
            'partner1Salary', 'partner2Salary', 'Partner1Salary', 'Partner2Salary',
            'partner1Income', 'partner2Income', 'partner1MonthlySalary', 'partner2MonthlySalary',
            'currentMonthlySalary', 'monthlySalary', 'salary', 'monthlyIncome'
        ];
        monthlyIncome = simulateFieldSearch(inputs, partnerFields, { combinePartners: true });
    } else {
        const individualFields = [
            'currentMonthlySalary', 'monthlySalary', 'salary', 'monthlyIncome',
            'currentSalary', 'monthly_salary', 'income', 'grossSalary',
            'netSalary', 'baseSalary', 'totalIncome', 'monthlyIncomeAmount'
        ];
        monthlyIncome = simulateFieldSearch(inputs, individualFields);
    }
    
    // Test 2: Pension and Training Fund Rates
    console.log('\n🔍 TEST 2: Contribution Rates');
    const pensionFields = [
        'pensionContributionRate', 'pensionEmployeeRate', 'pensionEmployee',
        'employeePensionRate', 'pension_contribution_rate', 'pension_rate'
    ];
    const pensionRate = simulateFieldSearch(inputs, pensionFields, { allowZero: true });
    
    const trainingFields = [
        'trainingFundContributionRate', 'trainingFundEmployeeRate', 'trainingFundEmployee',
        'employeeTrainingFundRate', 'training_fund_rate', 'trainingFund_rate'
    ];
    const trainingRate = simulateFieldSearch(inputs, trainingFields, { allowZero: true });
    
    // Test 3: Current Savings (Retirement Readiness)
    console.log('\n🔍 TEST 3: Retirement Readiness - Current Savings');
    const pensionSavingsFields = [
        'currentPensionSavings', 'currentSavings', 'pensionSavings',
        'retirementSavings', 'currentRetirementSavings', 'currentPension'
    ];
    const pensionSavings = simulateFieldSearch(inputs, pensionSavingsFields, { allowZero: true });
    
    const trainingFundFields = [
        'currentTrainingFund', 'trainingFund', 'trainingFundValue',
        'trainingFundBalance', 'kerenHishtalmut', 'kerenHishtalmutBalance'
    ];
    const trainingFundSavings = simulateFieldSearch(inputs, trainingFundFields, { allowZero: true });
    
    // Test 4: Risk Alignment
    console.log('\n🔍 TEST 4: Risk Alignment');
    const riskFields = [
        'riskTolerance', 'riskProfile', 'investmentRisk', 'riskLevel',
        'risk_tolerance', 'riskToleranceLevel', 'investmentRiskLevel'
    ];
    const riskValue = simulateFieldSearch(inputs, riskFields, { allowZero: true, expectString: true });
    
    // Test 5: Tax Efficiency
    console.log('\n🔍 TEST 5: Tax Efficiency - Country/Age');
    const countryFields = [
        'taxCountry', 'country', 'taxLocation', 'location', 'countryCode'
    ];
    const country = simulateFieldSearch(inputs, countryFields, { allowZero: true, expectString: true });
    
    const ageFields = [
        'currentAge', 'age', 'userAge', 'myAge'
    ];
    const age = simulateFieldSearch(inputs, ageFields, { allowZero: true });
    
    // Summary
    console.log('\n📊 FIELD MAPPING SUMMARY');
    console.log('========================');
    console.log(`💰 Monthly Income: ${monthlyIncome} (${monthlyIncome > 0 ? '✅ Found' : '❌ Missing'})`);
    console.log(`📈 Pension Rate: ${pensionRate}% (${pensionRate > 0 ? '✅ Found' : '❌ Missing'})`);
    console.log(`🎓 Training Rate: ${trainingRate}% (${trainingRate > 0 ? '✅ Found' : '❌ Missing'})`);
    console.log(`💼 Pension Savings: ${pensionSavings} (${pensionSavings > 0 ? '✅ Found' : '❌ Missing'})`);
    console.log(`📚 Training Savings: ${trainingFundSavings} (${trainingFundSavings > 0 ? '✅ Found' : '❌ Missing'})`);
    console.log(`⚖️  Risk Tolerance: ${riskValue} (${riskValue ? '✅ Found' : '❌ Missing'})`);
    console.log(`🌍 Country: ${country} (${country ? '✅ Found' : '❌ Missing'})`);
    console.log(`🎂 Age: ${age} (${age > 0 ? '✅ Found' : '❌ Missing'})`);
    
    // Calculate expected scores
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome * (pensionRate + trainingRate) / 100) / monthlyIncome) * 100 : 0;
    console.log(`\n📊 CALCULATED SAVINGS RATE: ${savingsRate.toFixed(2)}%`);
    
    if (monthlyIncome === 0) {
        console.log('❌ CRITICAL: No monthly income found - this will cause Savings Rate = 0/25');
    }
    if (pensionSavings === 0 && trainingFundSavings === 0) {
        console.log('❌ CRITICAL: No current savings found - this will cause Retirement Readiness = 0');
    }
    if (!riskValue) {
        console.log('❌ CRITICAL: No risk tolerance found - this will cause Risk Alignment = 0');
    }
    if (!country || age === 0) {
        console.log('❌ CRITICAL: No country/age found - this will cause Tax Efficiency = 0');
    }
    
    return {
        monthlyIncome,
        pensionRate,
        trainingRate,
        pensionSavings,
        trainingFundSavings,
        riskValue,
        country,
        age,
        savingsRate
    };
}

// Main diagnostic function
function runDiagnostics() {
    console.log('🚀 Starting Field Mapping Diagnostics...\n');
    
    // Load and analyze field mapping dictionary
    const dictLoaded = loadFieldMappingDictionary();
    
    // Test each scenario
    Object.entries(TEST_SCENARIOS).forEach(([scenarioName, inputData]) => {
        console.log(`\n\n🧪 TESTING SCENARIO: ${scenarioName.toUpperCase()}`);
        console.log('='.repeat(50 + scenarioName.length));
        
        const results = testFinancialHealthFieldMapping(inputData);
        
        // Predict Financial Health Score
        let predictedScore = 0;
        if (results.monthlyIncome > 0 && results.savingsRate > 10) predictedScore += 20; // Savings rate
        if (results.pensionSavings > 0 || results.trainingFundSavings > 0) predictedScore += 15; // Retirement readiness
        if (results.riskValue) predictedScore += 10; // Risk alignment
        if (results.country && results.age > 0) predictedScore += 8; // Tax efficiency
        predictedScore += 10; // Time horizon (usually works)
        predictedScore += 5; // Diversification (partial)
        
        console.log(`\n🎯 PREDICTED FINANCIAL HEALTH SCORE: ${predictedScore}/100`);
        
        if (predictedScore < 50) {
            console.log('🚨 LOW SCORE PREDICTED - Field mapping issues detected!');
        } else {
            console.log('✅ GOOD SCORE PREDICTED - Field mapping appears to be working');
        }
    });
    
    // Recommendations
    console.log('\n\n💡 RECOMMENDATIONS');
    console.log('==================');
    console.log('1. Check actual form field names in wizard components');
    console.log('2. Compare with field mapping dictionary patterns');
    console.log('3. Add missing field name variations to dictionary');
    console.log('4. Test getFieldValue() function with actual form data');
    console.log('5. Add debug logging to production to see real field names');
    
    console.log('\n📋 NEXT STEPS');
    console.log('=============');
    console.log('1. Run: node debug-field-mapping.js > field-mapping-analysis.txt');
    console.log('2. Analyze wizard step components for actual field names');
    console.log('3. Update fieldMappingDictionary.js with missing patterns');
    console.log('4. Test with browser console debug tool');
    console.log('5. Validate with comprehensive test scenarios');
}

// Run the diagnostics
runDiagnostics();

console.log('\n✅ Field mapping diagnostics complete!');
console.log('📄 Results saved for analysis and planning.');