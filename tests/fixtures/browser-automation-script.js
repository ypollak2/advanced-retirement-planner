// Browser Automation Script for Testing Financial Health Score
// Run this directly in the browser console on https://ypollak2.github.io/advanced-retirement-planner/

console.log('🤖 Starting automated test for Financial Health Score...');

// Test data for high-income individual (should score 70-90, NOT 27-29)
const testData = {
    // Step 1: Personal Information
    planningType: 'individual',
    currentAge: '35',
    retirementAge: '67',
    country: 'israel',
    
    // Step 2: Salary
    currentMonthlySalary: '50000',
    annualBonus: '100000',
    monthlyOtherIncome: '0',
    
    // Step 3: Expenses
    currentMonthlyExpenses: '25000',
    
    // Step 4: Savings
    currentPension: '500000',
    currentTrainingFund: '300000',
    currentPortfolio: '200000',
    currentRealEstate: '0',
    currentCrypto: '0',
    currentSavingsAccount: '50000',
    emergencyFund: '150000',
    
    // Step 5: Contributions
    pensionEmployeeContribution: '6',
    pensionEmployerContribution: '6.5',
    pensionEmployerBenefitsContribution: '6',
    trainingFundEmployeeContribution: '2.5',
    trainingFundEmployerContribution: '7.5',
    
    // Step 6: Fees
    pensionManagementFee: '0.5',
    pensionYearlyYield: '7',
    trainingFundManagementFee: '0.5',
    trainingFundYearlyYield: '7',
    
    // Step 7: Investment
    riskTolerance: 'balanced',
    expectedAnnualReturn: '7',
    
    // Step 8: Goals (optional)
    desiredRetirementSavings: '5000000',
    desiredMonthlyRetirementIncome: '30000'
};

// Helper function to wait
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to set input value
function setInputValue(name, value) {
    const input = document.querySelector(`[name="${name}"]`) || 
                 document.querySelector(`#${name}`) ||
                 document.querySelector(`input[placeholder*="${name}"]`);
    if (input) {
        input.value = value;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
        console.log(`✅ Set ${name} = ${value}`);
        return true;
    } else {
        console.warn(`⚠️ Could not find input: ${name}`);
        return false;
    }
}

// Helper function to click button
function clickButton(text) {
    const buttons = Array.from(document.querySelectorAll('button'));
    const button = buttons.find(btn => 
        btn.textContent.includes(text) || 
        btn.textContent.includes('Next') || 
        btn.textContent.includes('הבא') ||
        btn.textContent.includes('המשך')
    );
    if (button && !button.disabled) {
        button.click();
        console.log(`✅ Clicked button: ${text || 'Next'}`);
        return true;
    } else {
        console.warn(`⚠️ Could not find/click button: ${text}`);
        return false;
    }
}

// Helper function to select radio/checkbox
function selectOption(value) {
    const option = document.querySelector(`[value="${value}"]`) ||
                  document.querySelector(`input[type="radio"][name*="${value}"]`);
    if (option) {
        option.click();
        console.log(`✅ Selected option: ${value}`);
        return true;
    }
    return false;
}

// Main automation function
async function runAutomatedTest() {
    console.log('📋 Test Scenario: High-income individual, age 35');
    console.log('✅ Expected Score: 70-90');
    console.log('❌ Bug if Score: 27-29');
    console.log('');
    
    try {
        // Check if we're on the right page
        if (!window.location.href.includes('advanced-retirement-planner')) {
            console.error('❌ Please run this script on https://ypollak2.github.io/advanced-retirement-planner/');
            return;
        }
        
        // Start the wizard if needed
        if (document.querySelector('.planning-type-selection') || document.querySelector('[data-testid="start-wizard"]')) {
            console.log('🚀 Starting wizard...');
            clickButton('Start') || clickButton('התחל');
            await sleep(1000);
        }
        
        // Step 1: Personal Information
        console.log('\n📍 Step 1: Personal Information');
        if (window.retirementWizard && window.retirementWizard.currentStep === 1) {
            selectOption('individual');
            await sleep(500);
            setInputValue('currentAge', testData.currentAge);
            setInputValue('retirementAge', testData.retirementAge);
            selectOption('israel');
            await sleep(1000);
            clickButton('Next');
            await sleep(1500);
        }
        
        // Step 2: Salary & Income
        console.log('\n📍 Step 2: Salary & Income');
        if (window.retirementWizard && window.retirementWizard.currentStep === 2) {
            setInputValue('currentMonthlySalary', testData.currentMonthlySalary);
            setInputValue('annualBonus', testData.annualBonus);
            await sleep(1000);
            clickButton('Next');
            await sleep(1500);
        }
        
        // Step 3: Monthly Expenses
        console.log('\n📍 Step 3: Monthly Expenses');
        if (window.retirementWizard && window.retirementWizard.currentStep === 3) {
            setInputValue('currentMonthlyExpenses', testData.currentMonthlyExpenses);
            await sleep(1000);
            clickButton('Next');
            await sleep(1500);
        }
        
        // Step 4: Current Savings
        console.log('\n📍 Step 4: Current Savings');
        if (window.retirementWizard && window.retirementWizard.currentStep === 4) {
            setInputValue('currentPension', testData.currentPension);
            setInputValue('currentTrainingFund', testData.currentTrainingFund);
            setInputValue('currentPortfolio', testData.currentPortfolio);
            setInputValue('emergencyFund', testData.emergencyFund);
            await sleep(1000);
            clickButton('Next');
            await sleep(1500);
        }
        
        // Step 5: Contribution Rates
        console.log('\n📍 Step 5: Contribution Rates');
        if (window.retirementWizard && window.retirementWizard.currentStep === 5) {
            setInputValue('pensionEmployeeContribution', testData.pensionEmployeeContribution);
            setInputValue('pensionEmployerContribution', testData.pensionEmployerContribution);
            setInputValue('trainingFundEmployeeContribution', testData.trainingFundEmployeeContribution);
            setInputValue('trainingFundEmployerContribution', testData.trainingFundEmployerContribution);
            await sleep(1000);
            clickButton('Next');
            await sleep(1500);
        }
        
        // Step 6: Management Fees
        console.log('\n📍 Step 6: Management Fees');
        if (window.retirementWizard && window.retirementWizard.currentStep === 6) {
            setInputValue('pensionManagementFee', testData.pensionManagementFee);
            setInputValue('pensionYearlyYield', testData.pensionYearlyYield);
            await sleep(1000);
            clickButton('Next');
            await sleep(1500);
        }
        
        // Step 7: Investment Preferences
        console.log('\n📍 Step 7: Investment Preferences');
        if (window.retirementWizard && window.retirementWizard.currentStep === 7) {
            selectOption('balanced');
            setInputValue('expectedAnnualReturn', testData.expectedAnnualReturn);
            await sleep(1000);
            clickButton('Next');
            await sleep(1500);
        }
        
        // Step 8: Retirement Goals (optional)
        console.log('\n📍 Step 8: Retirement Goals (skipping)');
        if (window.retirementWizard && window.retirementWizard.currentStep === 8) {
            await sleep(1000);
            clickButton('Next');
            await sleep(1500);
        }
        
        // Step 9: Review & Calculate
        console.log('\n📍 Step 9: Review & Calculate');
        if (window.retirementWizard && window.retirementWizard.currentStep === 9) {
            console.log('📊 At review step - checking data...');
            await sleep(2000);
            
            // Try to find and click calculate button
            const calculateBtn = Array.from(document.querySelectorAll('button')).find(btn => 
                btn.textContent.includes('Calculate') || 
                btn.textContent.includes('חשב')
            );
            
            if (calculateBtn) {
                console.log('🔄 Calculating score...');
                calculateBtn.click();
                await sleep(3000);
                
                // Extract score
                extractAndDisplayScore();
            } else {
                console.error('❌ Calculate button not found');
            }
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Function to extract and display the score
function extractAndDisplayScore() {
    console.log('\n🔍 Extracting score...');
    
    // Try various selectors to find the score
    const scoreSelectors = [
        '.financial-health-score',
        '.score-display',
        '.total-score',
        '[data-testid="health-score"]',
        '.health-score-value',
        'h1:contains("Score")',
        'h2:contains("Score")'
    ];
    
    let score = null;
    
    // Try selectors
    for (const selector of scoreSelectors) {
        try {
            const element = document.querySelector(selector);
            if (element) {
                const text = element.textContent;
                const match = text.match(/(\d+)/);
                if (match) {
                    score = parseInt(match[1]);
                    break;
                }
            }
        } catch (e) {
            continue;
        }
    }
    
    // If not found, search in text
    if (!score) {
        const bodyText = document.body.innerText;
        const patterns = [
            /Financial Health Score[:\s]*(\d+)/i,
            /Score[:\s]*(\d+)/i,
            /ציון[:\s]*(\d+)/i,
            /(\d+)\s*\/\s*100/
        ];
        
        for (const pattern of patterns) {
            const match = bodyText.match(pattern);
            if (match) {
                score = parseInt(match[1]);
                break;
            }
        }
    }
    
    // Display results
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS');
    console.log('='.repeat(50));
    
    if (score !== null) {
        console.log(`🎯 Final Score: ${score}`);
        console.log(`📈 Expected Range: 70-90`);
        
        if (score >= 27 && score <= 29) {
            console.error('❌ CRITICAL BUG DETECTED: Score is 27-29!');
            console.error('The bug is still present in production!');
        } else if (score >= 70 && score <= 90) {
            console.log('✅ SUCCESS: Score is in expected range!');
            console.log('The bug appears to be fixed!');
        } else {
            console.warn(`⚠️ WARNING: Score ${score} is outside expected range (70-90)`);
            console.warn('This may indicate a different issue');
        }
    } else {
        console.error('❌ Could not extract score');
        console.log('Check if the financial health score is displayed on the page');
    }
    
    console.log('='.repeat(50));
    
    // Also check for any factor scores
    console.log('\n📊 Looking for factor scores...');
    const factors = ['savingsRate', 'retirementReadiness', 'timeHorizon', 'riskAlignment', 
                    'diversification', 'taxEfficiency', 'emergencyFund', 'debtManagement'];
    
    factors.forEach(factor => {
        const elements = document.querySelectorAll('*');
        for (const el of elements) {
            if (el.textContent.includes(factor)) {
                console.log(`- ${factor}: ${el.textContent}`);
                break;
            }
        }
    });
}

// Instructions
console.log('\n📖 INSTRUCTIONS:');
console.log('1. Make sure you are on https://ypollak2.github.io/advanced-retirement-planner/');
console.log('2. Type: runAutomatedTest()');
console.log('3. Press Enter to start the test');
console.log('\nThe test will automatically fill in data for a high-income individual.');
console.log('Expected score: 70-90 (NOT 27-29)');
console.log('\nType runAutomatedTest() to begin...');