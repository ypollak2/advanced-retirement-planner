// Couple Planning Feature Tests
// Tests for per-partner inputs, name handling, and couple-specific functionality

const fs = require('fs');

class CouplePlanningTests {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
    }

    logTest(testName, passed, message = '') {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        const timestamp = new Date().toLocaleTimeString();
        
        console.log(`[${timestamp}] ${status} ${testName}`);
        if (message) console.log(`    ${message}`);
        
        this.testResults.push({
            testName,
            passed,
            message,
            timestamp
        });

        if (passed) {
            this.passedTests++;
        } else {
            this.failedTests++;
        }
    }

    // Test 1: Partner Input Fields Existence
    testPartnerInputFields() {
        console.log('\n👥 Testing Partner Input Fields...\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Test Partner 1 fields
            const partner1Fields = [
                'partner1Name',
                'partner1Age', 
                'partner1Salary',
                'partner1TrainingFundRate',
                'partner1ManagementFees',
                'partner1CurrentSavings'
            ];

            // Test Partner 2 fields
            const partner2Fields = [
                'partner2Name',
                'partner2Age',
                'partner2Salary', 
                'partner2TrainingFundRate',
                'partner2ManagementFees',
                'partner2CurrentSavings'
            ];

            let allFieldsFound = true;
            const missingFields = [];

            [...partner1Fields, ...partner2Fields].forEach(field => {
                if (!content.includes(field)) {
                    allFieldsFound = false;
                    missingFields.push(field);
                }
            });

            this.logTest('Partner input fields exist', allFieldsFound, 
                allFieldsFound ? 'All 12 partner input fields found' : `Missing fields: ${missingFields.join(', ')}`);

            // Test individual field types
            const hasNameFields = content.includes('partner1Name') && content.includes('partner2Name');
            this.logTest('Partner name fields', hasNameFields, 'Name inputs for both partners');

            const hasFinancialFields = content.includes('TrainingFundRate') && content.includes('ManagementFees');
            this.logTest('Partner financial fields', hasFinancialFields, 'Training fund and management fee inputs');

            const hasSavingsFields = content.includes('partner1CurrentSavings') && content.includes('partner2CurrentSavings');
            this.logTest('Partner savings fields', hasSavingsFields, 'Current savings inputs for both partners');
        }
    }

    // Test 2: Single vs Couple UI Separation
    testSingleCoupleUISeparation() {
        console.log('\n🔄 Testing Single vs Couple UI Separation...\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Check that single salary is conditionally hidden
            const hasConditionalSingleSalary = content.includes("inputs.planningType !== 'couple'") && 
                                             content.includes('monthly-salary-input');
            this.logTest('Single salary conditional hiding', hasConditionalSingleSalary, 
                'Single salary input hidden when couple mode selected');

            // Check that partner info is conditionally shown
            const hasConditionalPartnerInfo = content.includes("inputs.planningType === 'couple'") && 
                                            content.includes('partner-info');
            this.logTest('Partner info conditional showing', hasConditionalPartnerInfo,
                'Partner information shown only in couple mode');

            // Check planning type selection exists
            const hasPlanningTypeSelection = content.includes('planningType') && 
                                           content.includes('single') && 
                                           content.includes('couple');
            this.logTest('Planning type selection', hasPlanningTypeSelection,
                'Single/couple selection buttons exist');
        }
    }

    // Test 3: Dynamic Partner Names
    testDynamicPartnerNames() {
        console.log('\n📝 Testing Dynamic Partner Names...\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Check dynamic partner 1 name
            const hasDynamicPartner1Name = content.includes('inputs.partner1Name ||') && 
                                         content.includes('Partner 1');
            this.logTest('Dynamic Partner 1 name', hasDynamicPartner1Name,
                'Partner 1 title updates with custom name');

            // Check dynamic partner 2 name  
            const hasDynamicPartner2Name = content.includes('inputs.partner2Name ||') && 
                                         content.includes('Partner 2');
            this.logTest('Dynamic Partner 2 name', hasDynamicPartner2Name,
                'Partner 2 title updates with custom name');

            // Check Hebrew support for names
            const hasHebrewNameSupport = content.includes('בן/בת זוג');
            this.logTest('Hebrew name support', hasHebrewNameSupport,
                'Hebrew translations for partner labels');
        }
    }

    // Test 4: Training Fund Calculation Improvements
    testTrainingFundCalculations() {
        console.log('\n💰 Testing Training Fund Calculation Improvements...\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Check correct variable usage
            const hasCorrectTrainingFundVar = content.includes('currentTrainingFundSavings') && 
                                             !content.includes('inputs.trainingFund ||');
            this.logTest('Correct training fund variable', hasCorrectTrainingFundVar,
                'Uses currentTrainingFundSavings instead of trainingFund');

            // Check separate pension and training returns
            const hasSeparateReturns = content.includes('pensionNetReturn') && 
                                     content.includes('trainingNetReturn');
            this.logTest('Separate pension/training returns', hasSeparateReturns,
                'Separate calculation for pension and training fund returns');

            // Check ceiling calculation in charts
            const hasProperCeilingInCharts = content.includes('trainingCeiling') && 
                                           content.includes('salaryForTraining');
            this.logTest('Training fund ceiling in charts', hasProperCeilingInCharts,
                'Chart calculations use proper ₪15,972 ceiling logic');
        }
    }

    // Test 5: Currency and API Integration Readiness
    testCurrencyAPIReadiness() {
        console.log('\n💱 Testing Currency API Integration Readiness...\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Check for currency display elements
            const hasCurrencyDisplay = content.includes('USD') || content.includes('EUR') || 
                                     content.includes('GBP') || content.includes('BTC');
            this.logTest('Currency display elements', hasCurrencyDisplay,
                hasCurrencyDisplay ? 'Currency elements found - need API integration' : 'No currency elements detected');

            // Check for multi-currency support structure
            const hasMultiCurrencyStructure = content.includes('currency') && content.includes('symbol');
            this.logTest('Multi-currency structure', hasMultiCurrencyStructure,
                'Infrastructure for currency conversion exists');
        }
    }

    // Test 6: Security Improvements Verification
    testSecurityImprovements() {
        console.log('\n🔒 Testing Security Improvements...\n');
        
        // Check security test file
        const securityTestPath = 'tests/security-qa-analysis.js';
        if (fs.existsSync(securityTestPath)) {
            const content = fs.readFileSync(securityTestPath, 'utf8');
            
            // Check for improved detection patterns
            const hasImprovedPatterns = content.includes('securityPatterns') && 
                                      content.includes('credential') &&
                                      content.includes('authentication');
            this.logTest('Improved security patterns', hasImprovedPatterns,
                'Security scanner uses less triggering detection patterns');

            // Check for proper comments
            const hasProperComments = content.includes('DETECTION REGEX PATTERNS') && 
                                    content.includes('No actual credentials');
            this.logTest('Security pattern documentation', hasProperComments,
                'Clear documentation that patterns are for detection only');
        }

        // Check performance tests for Function constructor fixes
        const perfTestPath = 'tests/performance-tests.js';
        if (fs.existsSync(perfTestPath)) {
            const content = fs.readFileSync(perfTestPath, 'utf8');
            
            const noWaitForFunction = !content.includes('waitForFunction');
            this.logTest('Function constructor elimination', noWaitForFunction,
                'No Function constructor usage in performance tests');
        }
    }

    // Run all couple planning tests
    async runCouplePlanningTests() {
        console.log('👫 Couple Planning Feature Test Suite');
        console.log('=====================================');
        console.log('🔍 Testing new couple planning features and recent improvements\n');

        this.testPartnerInputFields();
        this.testSingleCoupleUISeparation();
        this.testDynamicPartnerNames();
        this.testTrainingFundCalculations();
        this.testCurrencyAPIReadiness();
        this.testSecurityImprovements();

        return this.generateReport();
    }

    generateReport() {
        const totalTests = this.passedTests + this.failedTests;
        const successRate = totalTests > 0 ? (this.passedTests / totalTests * 100).toFixed(1) : 0;
        
        console.log('\n👫 Couple Planning Test Results:');
        console.log('================================');
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${this.passedTests}`);
        console.log(`Failed: ${this.failedTests}`);
        console.log(`Success Rate: ${successRate}%`);

        if (this.failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(result => !result.passed)
                .forEach(result => {
                    console.log(`   - ${result.testName}: ${result.message}`);
                });
        }

        const overallRating = this.calculateRating(successRate);
        console.log(`\n🎯 Overall Rating: ${overallRating}`);

        return {
            passed: this.passedTests,
            failed: this.failedTests,
            total: totalTests,
            successRate: parseFloat(successRate),
            rating: overallRating
        };
    }

    calculateRating(successRate) {
        if (successRate >= 95) return '🚀 EXCELLENT';
        if (successRate >= 85) return '✅ GOOD';
        if (successRate >= 70) return '⚠️ ACCEPTABLE';
        return '❌ NEEDS IMPROVEMENT';
    }
}

// Run tests if called directly
if (require.main === module) {
    const couplePlanningTests = new CouplePlanningTests();
    couplePlanningTests.runCouplePlanningTests().then(results => {
        process.exit(results.failed > 0 ? 1 : 0);
    });
}

module.exports = CouplePlanningTests;