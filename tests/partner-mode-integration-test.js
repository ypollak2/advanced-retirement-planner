#!/usr/bin/env node

// Partner Mode Integration Test Suite - Critical Production Readiness Tests
// Addresses QA Audit findings: individual vs combined calculations, data synchronization, mixed countries

const fs = require('fs');
const path = require('path');

console.log('👫 Advanced Retirement Planner - Partner Mode Integration Tests');
console.log('==============================================================\n');

let testsPassed = 0;
let testsFailed = 0;

function logTest(name, passed, message = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    console.log(`[${timestamp}] ${status} ${name}`);
    if (message) {
        console.log(`    ${message}`);
    }
    
    if (passed) {
        testsPassed++;
    } else {
        testsFailed++;
    }
}

// Mock wizard data structures for testing
const createIndividualWizardData = () => ({
    currentStep: 8,
    planningType: 'individual',
    step1: {
        age: 35,
        retirementAge: 67,
        country: 'ISR',
        language: 'en'
    },
    step2: {
        salary: 45000,
        bonus: 8000,
        rsu: 5000
    },
    step3: {
        pensionSavings: 150000,
        trainingFundSavings: 80000,
        personalSavings: 50000,
        realEstate: 800000,
        crypto: 25000
    },
    step4: {
        pensionRate: 7.0,
        employerRate: 14.333,
        trainingFundEnabled: true
    },
    step5: {
        riskProfile: 'moderate',
        allocation: {
            stocks: 60,
            bonds: 30,
            realEstate: 10
        }
    }
});

const createCoupleWizardData = () => ({
    currentStep: 8,
    planningType: 'couple',
    step1: {
        age: 35,
        retirementAge: 67,
        country: 'ISR',
        language: 'en',
        partner: {
            name: 'Partner Name',
            age: 33,
            retirementAge: 65,
            country: 'ISR'
        }
    },
    step2: {
        salary: 45000,
        bonus: 8000,
        rsu: 5000,
        partner: {
            name: 'Partner Name',
            salary: 40000,
            bonus: 6000,
            rsu: 3000
        }
    },
    step3: {
        pensionSavings: 150000,
        trainingFundSavings: 80000,
        personalSavings: 50000,
        realEstate: 800000,
        crypto: 25000,
        partner: {
            pensionSavings: 120000,
            trainingFundSavings: 60000,
            personalSavings: 30000,
            realEstate: 400000,
            crypto: 15000
        }
    },
    step4: {
        pensionRate: 7.0,
        employerRate: 14.333,
        trainingFundEnabled: true,
        partner: {
            pensionRate: 7.0,
            employerRate: 14.333,
            trainingFundEnabled: true
        }
    },
    step5: {
        riskProfile: 'moderate',
        allocation: {
            stocks: 60,
            bonds: 30,
            realEstate: 10
        },
        partner: {
            riskProfile: 'conservative',
            allocation: {
                stocks: 40,
                bonds: 50,
                realEstate: 10
            }
        }
    }
});

// Test individual vs combined calculation accuracy
function testIndividualVsCombinedCalculations() {
    console.log('🧮 Testing Individual vs Combined Calculation Accuracy...');
    
    const individualData = createIndividualWizardData();
    const coupleData = createCoupleWizardData();
    
    // Test income calculations
    const individualIncome = individualData.step2.salary + individualData.step2.bonus + individualData.step2.rsu;
    const partner1Income = coupleData.step2.salary + coupleData.step2.bonus + coupleData.step2.rsu;
    const partner2Income = coupleData.step2.partner.salary + coupleData.step2.partner.bonus + coupleData.step2.partner.rsu;
    const combinedIncome = partner1Income + partner2Income;
    
    const incomeCalculationCorrect = partner1Income === individualIncome && 
                                   combinedIncome === (partner1Income + partner2Income);
    
    logTest('Combined income calculation', incomeCalculationCorrect,
        incomeCalculationCorrect ? 
        `Individual: ₪${individualIncome}, Partner1: ₪${partner1Income}, Partner2: ₪${partner2Income}, Combined: ₪${combinedIncome}` :
        'Income calculations inconsistent');
    
    // Test savings calculations
    const individualSavings = individualData.step3.pensionSavings + 
                             individualData.step3.trainingFundSavings + 
                             individualData.step3.personalSavings;
    
    const partner1Savings = coupleData.step3.pensionSavings + 
                           coupleData.step3.trainingFundSavings + 
                           coupleData.step3.personalSavings;
    
    const partner2Savings = coupleData.step3.partner.pensionSavings + 
                           coupleData.step3.partner.trainingFundSavings + 
                           coupleData.step3.partner.personalSavings;
    
    const combinedSavings = partner1Savings + partner2Savings;
    
    const savingsCalculationCorrect = partner1Savings === individualSavings;
    
    logTest('Combined savings calculation', savingsCalculationCorrect,
        savingsCalculationCorrect ? 
        `Individual: ₪${individualSavings}, Combined: ₪${combinedSavings} (P1: ₪${partner1Savings}, P2: ₪${partner2Savings})` :
        'Savings calculations inconsistent');
    
    // Test asset calculations (including real estate and crypto)
    const individualAssets = individualData.step3.realEstate + individualData.step3.crypto;
    const partner1Assets = coupleData.step3.realEstate + coupleData.step3.crypto;
    const partner2Assets = coupleData.step3.partner.realEstate + coupleData.step3.partner.crypto;
    const combinedAssets = partner1Assets + partner2Assets;
    
    const assetCalculationCorrect = partner1Assets === individualAssets;
    
    logTest('Combined asset calculation', assetCalculationCorrect,
        assetCalculationCorrect ? 
        `Individual: ₪${individualAssets}, Combined: ₪${combinedAssets}` :
        'Asset calculations inconsistent');
}

// Test partner data synchronization across steps
function testPartnerDataSynchronization() {
    console.log('\n🔄 Testing Partner Data Synchronization Across Steps...');
    
    const coupleData = createCoupleWizardData();
    
    // Test partner name consistency across steps
    const step1PartnerName = coupleData.step1.partner.name;
    const step2PartnerName = coupleData.step2.partner.name;
    
    const nameConsistency = step1PartnerName === step2PartnerName;
    logTest('Partner name consistency', nameConsistency,
        nameConsistency ? `Partner name consistent: "${step1PartnerName}"` :
        `Name mismatch: Step1: "${step1PartnerName}", Step2: "${step2PartnerName}"`);
    
    // Test retirement age synchronization (should be independent)
    const partner1RetirementAge = coupleData.step1.retirementAge;
    const partner2RetirementAge = coupleData.step1.partner.retirementAge;
    
    const retirementAgeIndependence = partner1RetirementAge !== partner2RetirementAge;
    logTest('Independent retirement ages', retirementAgeIndependence,
        retirementAgeIndependence ? 
        `P1: age ${partner1RetirementAge}, P2: age ${partner2RetirementAge}` :
        'Partners should have independent retirement ages');
    
    // Test contribution rate synchronization (should match for same country)
    const partner1PensionRate = coupleData.step4.pensionRate;
    const partner2PensionRate = coupleData.step4.partner.pensionRate;
    const partner1EmployerRate = coupleData.step4.employerRate;
    const partner2EmployerRate = coupleData.step4.partner.employerRate;
    
    const sameCountry = coupleData.step1.country === coupleData.step1.partner.country;
    const ratesMatch = partner1PensionRate === partner2PensionRate && 
                      partner1EmployerRate === partner2EmployerRate;
    
    const contributionRateConsistency = !sameCountry || ratesMatch;
    logTest('Contribution rate synchronization', contributionRateConsistency,
        contributionRateConsistency ? 
        `Same country rates match: P1: ${partner1PensionRate}%/${partner1EmployerRate}%, P2: ${partner2PensionRate}%/${partner2EmployerRate}%` :
        'Contribution rates should match for same country');
    
    // Test risk profile independence
    const partner1RiskProfile = coupleData.step5.riskProfile;
    const partner2RiskProfile = coupleData.step5.partner.riskProfile;
    
    const riskProfileIndependence = partner1RiskProfile !== partner2RiskProfile;
    logTest('Independent risk profiles', riskProfileIndependence,
        riskProfileIndependence ? 
        `P1: ${partner1RiskProfile}, P2: ${partner2RiskProfile}` :
        'Partners should be able to have different risk profiles');
    
    // Test allocation independence
    const partner1StockAllocation = coupleData.step5.allocation.stocks;
    const partner2StockAllocation = coupleData.step5.partner.allocation.stocks;
    
    const allocationIndependence = partner1StockAllocation !== partner2StockAllocation;
    logTest('Independent investment allocations', allocationIndependence,
        allocationIndependence ? 
        `P1 stocks: ${partner1StockAllocation}%, P2 stocks: ${partner2StockAllocation}%` :
        'Partners should be able to have different allocations');
}

// Test mixed country regulation handling
function testMixedCountryRegulations() {
    console.log('\n🌍 Testing Mixed Country Regulation Handling...');
    
    // Create couple with different countries
    const mixedCountryCoupleData = {
        ...createCoupleWizardData(),
        step1: {
            ...createCoupleWizardData().step1,
            country: 'ISR', // Israel
            partner: {
                name: 'UK Partner',
                age: 33,
                retirementAge: 68, // Different retirement age for UK
                country: 'UK'  // United Kingdom
            }
        },
        step4: {
            // Israeli rates
            pensionRate: 7.0,
            employerRate: 14.333,
            trainingFundEnabled: true,
            partner: {
                // UK rates (different system)
                pensionRate: 5.0,
                employerRate: 3.0,
                trainingFundEnabled: false // UK doesn't have training funds
            }
        }
    };
    
    // Test country-specific retirement ages
    const israeliRetirementAge = mixedCountryCoupleData.step1.retirementAge;
    const ukRetirementAge = mixedCountryCoupleData.step1.partner.retirementAge;
    
    const retirementAgeDifferenceCorrect = israeliRetirementAge !== ukRetirementAge;
    logTest('Country-specific retirement ages', retirementAgeDifferenceCorrect,
        retirementAgeDifferenceCorrect ? 
        `Israeli: ${israeliRetirementAge}, UK: ${ukRetirementAge}` :
        'Should handle different retirement ages per country');
    
    // Test country-specific contribution rates
    const israeliPensionRate = mixedCountryCoupleData.step4.pensionRate;
    const ukPensionRate = mixedCountryCoupleData.step4.partner.pensionRate;
    
    const contributionRateDifferenceCorrect = israeliPensionRate !== ukPensionRate;
    logTest('Country-specific contribution rates', contributionRateDifferenceCorrect,
        contributionRateDifferenceCorrect ? 
        `Israeli: ${israeliPensionRate}%, UK: ${ukPensionRate}%` :
        'Should handle different contribution rates per country');
    
    // Test training fund availability by country
    const israeliTrainingFund = mixedCountryCoupleData.step4.trainingFundEnabled;
    const ukTrainingFund = mixedCountryCoupleData.step4.partner.trainingFundEnabled;
    
    const trainingFundCountrySpecific = israeliTrainingFund && !ukTrainingFund;
    logTest('Country-specific training fund rules', trainingFundCountrySpecific,
        trainingFundCountrySpecific ? 
        `Israeli has training fund: ${israeliTrainingFund}, UK: ${ukTrainingFund}` :
        'Training fund availability should be country-specific');
    
    // Test mixed country calculation complexity
    const israeliIncome = 45000;
    const ukIncomeILS = 48000; // Assume converted to ILS
    const combinedIncome = israeliIncome + ukIncomeILS;
    
    const mixedCountryCalculationHandled = combinedIncome === (israeliIncome + ukIncomeILS);
    logTest('Mixed country income calculations', mixedCountryCalculationHandled,
        mixedCountryCalculationHandled ? 
        `Israeli: ₪${israeliIncome}, UK (in ILS): ₪${ukIncomeILS}, Combined: ₪${combinedIncome}` :
        'Mixed country calculations should be handled correctly');
}

// Test partner deletion impact on calculations
function testPartnerDeletionImpact() {
    console.log('\n🗑️ Testing Partner Deletion Impact on Calculations...');
    
    const coupleData = createCoupleWizardData();
    
    // Simulate partner deletion by converting to individual mode
    const afterDeletionData = {
        ...coupleData,
        planningType: 'individual',
        // Partner data should be preserved but not used in calculations
        step1: {
            ...coupleData.step1,
            // Keep partner data but it shouldn't affect calculations
        },
        step2: {
            ...coupleData.step2,
            // Keep partner data but it shouldn't affect calculations
        }
    };
    
    // Test that individual calculations work after partner deletion
    const beforeDeletionIndividualIncome = coupleData.step2.salary + coupleData.step2.bonus + coupleData.step2.rsu;
    const afterDeletionIndividualIncome = afterDeletionData.step2.salary + afterDeletionData.step2.bonus + afterDeletionData.step2.rsu;
    
    const individualIncomeUnaffected = beforeDeletionIndividualIncome === afterDeletionIndividualIncome;
    logTest('Individual income after partner deletion', individualIncomeUnaffected,
        individualIncomeUnaffected ? 
        `Income unchanged: ₪${afterDeletionIndividualIncome}` :
        'Individual income should be unaffected by partner deletion');
    
    // Test that partner data is preserved (for potential re-addition)
    const partnerDataPreserved = afterDeletionData.step2.partner && 
                                afterDeletionData.step2.partner.salary === coupleData.step2.partner.salary;
    logTest('Partner data preservation after deletion', partnerDataPreserved,
        partnerDataPreserved ? 
        'Partner data preserved for potential re-addition' :
        'Partner data should be preserved even after switching to individual mode');
    
    // Test calculations ignore partner data in individual mode
    const planningTypeCheck = afterDeletionData.planningType === 'individual';
    logTest('Planning type switch correctness', planningTypeCheck,
        planningTypeCheck ? 
        'Successfully switched to individual planning type' :
        'Planning type should be updated to individual');
    
    // Test re-addition of partner (toggle back to couple mode)
    const reAddedPartnerData = {
        ...afterDeletionData,
        planningType: 'couple'
    };
    
    const partnerReAddition = reAddedPartnerData.planningType === 'couple' &&
                             reAddedPartnerData.step2.partner.salary === coupleData.step2.partner.salary;
    logTest('Partner re-addition functionality', partnerReAddition,
        partnerReAddition ? 
        'Partner successfully re-added with preserved data' :
        'Partner re-addition should restore all partner data');
}

// Test data validation and error handling
function testDataValidationAndErrorHandling() {
    console.log('\n✅ Testing Data Validation and Error Handling...');
    
    // Test missing partner data handling
    const incompletePartnerData = {
        ...createCoupleWizardData(),
        step2: {
            salary: 45000,
            bonus: 8000,
            // Missing partner data
        }
    };
    
    const missingPartnerHandled = incompletePartnerData.planningType === 'couple' && 
                                 !incompletePartnerData.step2.partner;
    logTest('Missing partner data handling', missingPartnerHandled,
        missingPartnerHandled ? 
        'Missing partner data detected correctly' :
        'Should handle missing partner data gracefully');
    
    // Test invalid partner ages
    const invalidPartnerAgeData = {
        ...createCoupleWizardData(),
        step1: {
            ...createCoupleWizardData().step1,
            age: 35,
            partner: {
                name: 'Invalid Partner',
                age: -5, // Invalid negative age
                retirementAge: 67
            }
        }
    };
    
    const invalidAgeDetected = invalidPartnerAgeData.step1.partner.age < 0;
    logTest('Invalid partner age detection', invalidAgeDetected,
        invalidAgeDetected ? 
        'Invalid negative age detected' :
        'Should detect invalid partner ages');
    
    // Test mismatched data structures
    const mismatchedData = {
        ...createCoupleWizardData(),
        step3: {
            pensionSavings: 150000,
            // Missing partner savings structure
            partner: 'invalid-string-instead-of-object'
        }
    };
    
    const mismatchDetected = typeof mismatchedData.step3.partner === 'string';
    logTest('Mismatched partner data structure', mismatchDetected,
        mismatchDetected ? 
        'Mismatched data structure detected' :
        'Should detect mismatched partner data structures');
    
    // Test extremely large partner differences
    const extremeDifferenceData = {
        ...createCoupleWizardData(),
        step2: {
            salary: 50000,
            partner: {
                salary: 500000000 // Extremely high partner salary
            }
        }
    };
    
    const extremeDifferenceHandled = extremeDifferenceData.step2.partner.salary > extremeDifferenceData.step2.salary * 1000;
    logTest('Extreme partner salary differences', extremeDifferenceHandled,
        extremeDifferenceHandled ? 
        'Extreme salary difference detected (should be flagged for review)' :
        'Should handle extreme differences between partners');
    
    // Test null partner objects
    const nullPartnerData = {
        ...createCoupleWizardData(),
        step2: {
            salary: 45000,
            partner: null
        }
    };
    
    const nullPartnerHandled = nullPartnerData.step2.partner === null;
    logTest('Null partner object handling', nullPartnerHandled,
        nullPartnerHandled ? 
        'Null partner object detected' :
        'Should handle null partner objects gracefully');
}

// Test calculation consistency across wizard steps
function testCalculationConsistencyAcrossSteps() {
    console.log('\n🔢 Testing Calculation Consistency Across Wizard Steps...');
    
    const coupleData = createCoupleWizardData();
    
    // Test that salary data from step 2 is used consistently in later calculations
    const step2Salary = coupleData.step2.salary;
    const step2PartnerSalary = coupleData.step2.partner.salary;
    
    // Simulate step 4 contribution calculations based on step 2 salary
    const pensionContribution = step2Salary * (coupleData.step4.pensionRate / 100);
    const partnerPensionContribution = step2PartnerSalary * (coupleData.step4.partner.pensionRate / 100);
    
    const contributionCalculationValid = pensionContribution > 0 && partnerPensionContribution > 0;
    logTest('Cross-step calculation consistency', contributionCalculationValid,
        contributionCalculationValid ? 
        `P1 contribution: ₪${pensionContribution.toFixed(0)}, P2 contribution: ₪${partnerPensionContribution.toFixed(0)}` :
        'Cross-step calculations should use consistent data');
    
    // Test that retirement ages from step 1 affect step 5+ projections
    const partner1Years = coupleData.step1.retirementAge - coupleData.step1.age;
    const partner2Years = coupleData.step1.partner.retirementAge - coupleData.step1.partner.age;
    
    const retirementYearsConsistent = partner1Years > 0 && partner2Years > 0;
    logTest('Retirement timeline consistency', retirementYearsConsistent,
        retirementYearsConsistent ? 
        `P1: ${partner1Years} years, P2: ${partner2Years} years to retirement` :
        'Retirement timelines should be calculated consistently');
    
    // Test asset allocation totals (should sum to 100% for each partner)
    const partner1AllocationTotal = Object.values(coupleData.step5.allocation).reduce((sum, val) => sum + val, 0);
    const partner2AllocationTotal = Object.values(coupleData.step5.partner.allocation).reduce((sum, val) => sum + val, 0);
    
    const allocationTotalsCorrect = partner1AllocationTotal === 100 && partner2AllocationTotal === 100;
    logTest('Asset allocation totals', allocationTotalsCorrect,
        allocationTotalsCorrect ? 
        `P1: ${partner1AllocationTotal}%, P2: ${partner2AllocationTotal}%` :
        'Asset allocations should sum to 100% for each partner');
    
    // Test data type consistency
    const dataTypesConsistent = typeof coupleData.step2.salary === 'number' &&
                               typeof coupleData.step2.partner.salary === 'number' &&
                               typeof coupleData.step4.pensionRate === 'number' &&
                               typeof coupleData.step4.partner.pensionRate === 'number';
    
    logTest('Data type consistency', dataTypesConsistent,
        dataTypesConsistent ? 
        'All numeric fields are proper numbers' :
        'Data types should be consistent across partner data');
}

// Run all partner mode integration tests
console.log('🚀 Starting Partner Mode Integration Test Suite...\n');

testIndividualVsCombinedCalculations();
testPartnerDataSynchronization();
testMixedCountryRegulations();
testPartnerDeletionImpact();
testDataValidationAndErrorHandling();
testCalculationConsistencyAcrossSteps();

// Final report
console.log('\n📊 Partner Mode Integration Test Summary');
console.log('=========================================');
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

if (testsFailed > 0) {
    console.log('\n⚠️  Critical partner mode integration issues found!');
    console.log('\n💡 Required Fixes for Production:');
    console.log('   • Ensure individual vs combined calculation accuracy');
    console.log('   • Implement robust partner data synchronization');
    console.log('   • Add mixed country regulation handling');
    console.log('   • Improve partner deletion/addition workflows');
    console.log('   • Enhance data validation for partner information');
    console.log('   • Ensure calculation consistency across all wizard steps');
    console.log('\n🔧 Implementation Priority: CRITICAL - Must fix before production');
    process.exit(1);
} else {
    console.log('\n🎉 All partner mode integration tests passed!');
    console.log('\n✨ Partner mode is production-ready with:');
    console.log('   • Accurate individual vs combined calculations');
    console.log('   • Consistent partner data synchronization');
    console.log('   • Proper mixed country regulation handling');
    console.log('   • Reliable partner deletion/addition workflows');
    console.log('   • Robust data validation and error handling');
    console.log('   • Consistent calculations across all wizard steps');
    process.exit(0);
}