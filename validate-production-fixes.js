// Production validation script for v7.5.2 fixes
// Tests all 5 critical issues that were fixed

console.log('🔍 Starting production validation for v7.5.2 fixes...\n');

async function validateProduction() {
    const results = {
        version: 'unknown',
        fixes: {
            portfolioTax: { pass: false, message: '' },
            healthScore: { pass: false, message: '' },
            componentScores: { pass: false, message: '' },
            retirementProjection: { pass: false, message: '' },
            monthlyIncome: { pass: false, message: '' }
        },
        overall: false
    };

    try {
        // 1. Check version
        const versionElement = document.querySelector('.version-display') || 
                              document.querySelector('[class*="version"]') ||
                              Array.from(document.querySelectorAll('*')).find(el => 
                                  el.textContent.includes('Version') && el.textContent.includes('7.5'));
        
        if (versionElement) {
            results.version = versionElement.textContent.trim();
            console.log(`✅ Version found: ${results.version}`);
        } else {
            console.log('⚠️ Version element not found');
        }

        // 2. Test portfolio tax calculation (requires being in wizard)
        console.log('\n📊 Testing Fix 1: Portfolio Tax Calculation...');
        // This would need to be tested manually in the wizard
        results.fixes.portfolioTax.message = 'Requires manual testing in wizard Step 3';
        console.log('ℹ️ Portfolio tax fix requires manual testing in Savings step');

        // 3. Test Financial Health Score
        console.log('\n📊 Testing Fix 2: Financial Health Score...');
        const healthScore = document.querySelector('.financial-health-score');
        if (healthScore) {
            const savingsRate = healthScore.textContent.includes('Savings Rate') && 
                               !healthScore.textContent.includes('0%');
            const taxEfficiency = healthScore.textContent.includes('Tax Efficiency') && 
                                 !healthScore.textContent.includes('0%');
            
            if (savingsRate && taxEfficiency) {
                results.fixes.healthScore.pass = true;
                results.fixes.healthScore.message = 'Savings Rate and Tax Efficiency showing values';
            } else {
                results.fixes.healthScore.message = 'Health score components still showing 0%';
            }
        } else {
            results.fixes.healthScore.message = 'Health score panel not found';
        }

        // 4. Test Component Scores
        console.log('\n📊 Testing Fix 3: Component Scores...');
        const componentScores = document.querySelector('.component-scores') || 
                               document.querySelector('[class*="component-score"]');
        if (componentScores) {
            const hasValues = !componentScores.textContent.includes('₪0') && 
                             !componentScores.textContent.includes('NaN');
            
            if (hasValues) {
                results.fixes.componentScores.pass = true;
                results.fixes.componentScores.message = 'Component scores showing actual values';
            } else {
                results.fixes.componentScores.message = 'Component scores still showing ₪0 or NaN';
            }
        } else {
            results.fixes.componentScores.message = 'Component scores panel not found';
        }

        // 5. Test Retirement Projection
        console.log('\n📊 Testing Fix 4: Retirement Projection...');
        const projectionPanel = document.querySelector('.retirement-projection') || 
                               document.querySelector('[class*="projection"]');
        if (projectionPanel) {
            const hasMissingData = projectionPanel.textContent.includes('Missing data');
            
            if (!hasMissingData) {
                results.fixes.retirementProjection.pass = true;
                results.fixes.retirementProjection.message = 'Projection showing data (no missing data message)';
            } else {
                results.fixes.retirementProjection.message = 'Still showing "Missing data" message';
            }
        } else {
            results.fixes.retirementProjection.message = 'Projection panel not found';
        }

        // 6. Test Monthly Income calculation
        console.log('\n📊 Testing Fix 5: Monthly Income Calculation...');
        // This requires checking the actual calculation in the wizard
        results.fixes.monthlyIncome.message = 'Requires manual testing with salary + bonus + RSU data';
        console.log('ℹ️ Monthly income fix requires manual testing with complete data');

        // 7. Test getAllInputs function
        console.log('\n📊 Testing getAllInputs function...');
        if (typeof window.getAllInputs === 'function') {
            try {
                const inputs = window.getAllInputs();
                console.log('✅ getAllInputs function is available');
                console.log('📦 Retrieved inputs:', Object.keys(inputs).length > 0 ? 'Has data' : 'Empty');
            } catch (e) {
                console.log('❌ getAllInputs function error:', e.message);
            }
        } else {
            console.log('❌ getAllInputs function not found');
        }

        // 8. Check for field mapping fix
        console.log('\n📊 Testing field mapping (currentSalary -> currentMonthlySalary)...');
        const savedData = localStorage.getItem('retirementWizardInputs');
        if (savedData) {
            const inputs = JSON.parse(savedData);
            if (inputs.currentSalary || inputs.currentMonthlySalary) {
                console.log('✅ Salary field mapping available');
                console.log(`   currentSalary: ${inputs.currentSalary || 'not set'}`);
                console.log(`   currentMonthlySalary: ${inputs.currentMonthlySalary || 'not set'}`);
            }
        }

    } catch (error) {
        console.error('❌ Validation error:', error);
    }

    // Overall result
    results.overall = Object.values(results.fixes).filter(f => f.pass).length >= 3;

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 VALIDATION SUMMARY:');
    console.log('='.repeat(50));
    console.log(`Version: ${results.version}`);
    console.log(`\nFixes validated:`);
    Object.entries(results.fixes).forEach(([fix, result], index) => {
        const status = result.pass ? '✅' : (result.message.includes('manual') ? 'ℹ️' : '❌');
        console.log(`${index + 1}. ${fix}: ${status} ${result.message}`);
    });
    console.log('\nOverall: ' + (results.overall ? '✅ PASS' : '❌ NEEDS ATTENTION'));
    console.log('='.repeat(50));

    return results;
}

// Run validation
if (typeof window !== 'undefined') {
    // Browser environment
    console.log('🌐 Running in browser environment');
    console.log('ℹ️ Navigate to: https://ypollak2.github.io/advanced-retirement-planner/');
    console.log('ℹ️ Then run: validateProduction()');
    
    window.validateProduction = validateProduction;
} else {
    // Node environment
    console.log('ℹ️ This script should be run in the browser console on the production site');
}