// Missing Data Modal Test Suite
// Tests comprehensive missing data completion functionality
// Created for Advanced Retirement Planner v7.0.3+

const fs = require('fs');
const path = require('path');

/**
 * Test Missing Data Modal Component Availability
 */
function testMissingDataModalAvailability() {
    console.log('🧪 Testing Missing Data Modal availability...');
    
    const tests = [
        {
            name: 'MissingDataModal.js exists',
            test: () => fs.existsSync('src/components/shared/MissingDataModal.js'),
            expected: true,
            description: 'Missing Data Modal component file should exist'
        },
        {
            name: 'MissingDataModal.js loaded in index.html',
            test: () => {
                const indexContent = fs.readFileSync('index.html', 'utf8');
                return indexContent.includes('src/components/shared/MissingDataModal.js');
            },
            expected: true,
            description: 'Missing Data Modal should be loaded in index.html'
        },
        {
            name: 'FinancialHealthScoreEnhanced.js updated for modal integration',
            test: () => {
                const healthScoreContent = fs.readFileSync('src/components/shared/FinancialHealthScoreEnhanced.js', 'utf8');
                return healthScoreContent.includes('isMissingDataModalOpen') && 
                       healthScoreContent.includes('setIsMissingDataModalOpen');
            },
            expected: true,
            description: 'FinancialHealthScoreEnhanced should include modal state management'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test Missing Data Modal Component Structure
 */
function testMissingDataModalStructure() {
    console.log('🧪 Testing Missing Data Modal component structure...');
    
    const modalPath = 'src/components/shared/MissingDataModal.js';
    
    const tests = [
        {
            name: 'MissingDataModal component defined and exported',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('const MissingDataModal = ({') && 
                       content.includes('window.MissingDataModal = MissingDataModal');
            },
            expected: true,
            description: 'MissingDataModal component should be defined and exported to window'
        },
        {
            name: 'Modal accepts required props',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('isOpen') && 
                       content.includes('onClose') && 
                       content.includes('inputs') && 
                       content.includes('onInputUpdate') && 
                       content.includes('healthReport');
            },
            expected: true,
            description: 'Modal should accept all required props for functionality'
        },
        {
            name: 'Modal includes state management',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('useState') && 
                       content.includes('formData') && 
                       content.includes('setFormData') && 
                       content.includes('currentStep') && 
                       content.includes('previewScore');
            },
            expected: true,
            description: 'Modal should include proper state management for form data and UI'
        },
        {
            name: 'Modal supports multi-language',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('language = \'en\'') && 
                       content.includes('he:') && 
                       content.includes('en:') && 
                       content.includes('const t = content[language]');
            },
            expected: true,
            description: 'Modal should support Hebrew and English languages'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test Missing Data Analysis Logic
 */
function testMissingDataAnalysis() {
    console.log('🧪 Testing missing data analysis logic...');
    
    const modalPath = 'src/components/shared/MissingDataModal.js';
    
    const tests = [
        {
            name: 'analyzeMissingData function implemented',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('const analyzeMissingData = () => {') && 
                       content.includes('healthReport.factors') && 
                       content.includes('factorData.score === 0');
            },
            expected: true,
            description: 'Should include function to analyze missing data from health report'
        },
        {
            name: 'Identifies salary-related missing data',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('savingsRate') && 
                       content.includes('missing_income_data') && 
                       content.includes('monthlySalary') && 
                       content.includes('partner1Salary') && 
                       content.includes('partner2Salary');
            },
            expected: true,
            description: 'Should identify missing salary data for both individual and couple modes'
        },
        {
            name: 'Identifies contribution-related missing data',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('missing_contribution_data') && 
                       content.includes('pensionRate') && 
                       content.includes('trainingFundRate') && 
                       content.includes('taxEfficiency');
            },
            expected: true,
            description: 'Should identify missing pension and training fund contribution rates'
        },
        {
            name: 'Identifies investment-related missing data',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('emergencyFund') && 
                       content.includes('personalPortfolio') && 
                       content.includes('realEstate') && 
                       content.includes('diversification');
            },
            expected: true,
            description: 'Should identify missing investment and asset data'
        },
        {
            name: 'Groups data by logical steps',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('step: \'salary\'') && 
                       content.includes('step: \'savings\'') && 
                       content.includes('step: \'investments\'') && 
                       content.includes('groupedSteps');
            },
            expected: true,
            description: 'Should group missing data by logical completion steps'
        },
        {
            name: 'Assigns priority levels to missing data',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('priority: \'high\'') && 
                       content.includes('priority: \'medium\'') && 
                       content.includes('priority: \'low\'');
            },
            expected: true,
            description: 'Should assign priority levels to different types of missing data'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test Form Generation and Validation
 */
function testFormGenerationAndValidation() {
    console.log('🧪 Testing form generation and validation...');
    
    const modalPath = 'src/components/shared/MissingDataModal.js';
    
    const tests = [
        {
            name: 'Dynamic input field rendering',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('const renderInputField = (item) => {') && 
                       content.includes('createElement(\'input\'') && 
                       content.includes('type: \'number\'');
            },
            expected: true,
            description: 'Should dynamically render input fields based on missing data'
        },
        {
            name: 'Supports different input types',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('type: \'currency\'') && 
                       content.includes('type: \'percentage\'') && 
                       content.includes('currency-symbol') && 
                       content.includes('percentage-symbol');
            },
            expected: true,
            description: 'Should support currency and percentage input types with proper symbols'
        },
        {
            name: 'Input validation implemented',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('const validateField = (field, value) => {') && 
                       content.includes('validationErrors') && 
                       content.includes('isNaN(numValue)') && 
                       content.includes('Maximum 100%');
            },
            expected: true,
            description: 'Should include comprehensive input validation with error messages'
        },
        {
            name: 'Form handles input changes',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('const handleInputChange = (field, value) => {') && 
                       content.includes('setFormData(prev => ({ ...prev, [field]: value }))') && 
                       content.includes('onChange: (e) => handleInputChange');
            },
            expected: true,
            description: 'Should properly handle input changes and update form state'
        },
        {
            name: 'Form submission with validation',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('const handleSave = () => {') && 
                       content.includes('hasErrors') && 
                       content.includes('onInputUpdate(formData)') && 
                       content.includes('onClose()');
            },
            expected: true,
            description: 'Should validate form before submission and update inputs'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test Real-time Score Calculation
 */
function testRealTimeScoreCalculation() {
    console.log('🧪 Testing real-time score calculation...');
    
    const modalPath = 'src/components/shared/MissingDataModal.js';
    
    const tests = [
        {
            name: 'Preview score calculation on form changes',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('useEffect(() => {') && 
                       content.includes('setIsCalculating(true)') && 
                       content.includes('window.calculateFinancialHealthScore') && 
                       content.includes('setPreviewScore');
            },
            expected: true,
            description: 'Should calculate preview score when form data changes'
        },
        {
            name: 'Score comparison display',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('currentScore') && 
                       content.includes('projectedScore') && 
                       content.includes('improvement') && 
                       content.includes('healthReport?.totalScore');
            },
            expected: true,
            description: 'Should display current vs projected score comparison'
        },
        {
            name: 'Loading state during calculation',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('isCalculating') && 
                       content.includes('calculating') && 
                       content.includes('setTimeout') && 
                       content.includes('clearTimeout');
            },
            expected: true,
            description: 'Should show loading state during score calculation'
        },
        {
            name: 'Improvement indicator',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('previewScore > (healthReport?.totalScore || 0)') && 
                       content.includes('text-green-600') && 
                       content.includes('improvement');
            },
            expected: true,
            description: 'Should show improvement indicator when projected score is higher'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test Modal UI and UX Features
 */
function testModalUIUX() {
    console.log('🧪 Testing modal UI and UX features...');
    
    const modalPath = 'src/components/shared/MissingDataModal.js';
    
    const tests = [
        {
            name: 'Modal overlay and positioning',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('fixed inset-0') && 
                       content.includes('bg-black bg-opacity-50') && 
                       content.includes('flex items-center justify-center z-50');
            },
            expected: true,
            description: 'Should include proper modal overlay and positioning'
        },
        {
            name: 'Multi-step navigation',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('currentStep') && 
                       content.includes('setCurrentStep') && 
                       content.includes('stepKeys.length > 1') && 
                       content.includes('progress-bar');
            },
            expected: true,
            description: 'Should support multi-step navigation with progress indicator'
        },
        {
            name: 'Navigation buttons',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('previous') && 
                       content.includes('next') && 
                       content.includes('complete') && 
                       content.includes('cancel');
            },
            expected: true,
            description: 'Should include proper navigation buttons (previous, next, complete, cancel)'
        },
        {
            name: 'Responsive design',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('max-w-2xl w-full') && 
                       content.includes('max-h-[90vh]') && 
                       content.includes('overflow-y-auto') && 
                       content.includes('p-4');
            },
            expected: true,
            description: 'Should include responsive design with proper sizing and overflow handling'
        },
        {
            name: 'Gradient styling and visual appeal',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('bg-gradient-to-r') && 
                       content.includes('from-blue-600 to-indigo-600') && 
                       content.includes('shadow-2xl') && 
                       content.includes('rounded-xl');
            },
            expected: true,
            description: 'Should include attractive gradient styling and visual elements'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test Integration with Financial Health System
 */
function testFinancialHealthIntegration() {
    console.log('🧪 Testing integration with financial health system...');
    
    const healthScorePath = 'src/components/shared/FinancialHealthScoreEnhanced.js';
    
    const tests = [
        {
            name: 'Modal state added to FinancialHealthScoreEnhanced',
            test: () => {
                const content = fs.readFileSync(healthScorePath, 'utf8');
                return content.includes('isMissingDataModalOpen') && 
                       content.includes('setIsMissingDataModalOpen') && 
                       content.includes('useState(false)');
            },
            expected: true,
            description: 'FinancialHealthScoreEnhanced should include modal state management'
        },
        {
            name: 'Button triggers modal opening',
            test: () => {
                const content = fs.readFileSync(healthScorePath, 'utf8');
                return content.includes('setIsMissingDataModalOpen(true)') && 
                       content.includes('onClick: () => {') && 
                       !content.includes('alert(');
            },
            expected: true,
            description: 'Complete Missing Data button should open modal instead of showing alert'
        },
        {
            name: 'Modal component integrated in render',
            test: () => {
                const content = fs.readFileSync(healthScorePath, 'utf8');
                return content.includes('window.MissingDataModal') && 
                       content.includes('createElement(window.MissingDataModal') && 
                       content.includes('isOpen: isMissingDataModalOpen');
            },
            expected: true,
            description: 'Modal should be integrated in the component render with proper props'
        },
        {
            name: 'Input update handler implemented',
            test: () => {
                const content = fs.readFileSync(healthScorePath, 'utf8');
                return content.includes('onInputUpdate: (updatedData) => {') && 
                       content.includes('setInputs') && 
                       content.includes('prevInputs => ({ ...prevInputs, ...updatedData })');
            },
            expected: true,
            description: 'Should include handler to update inputs when modal saves data'
        },
        {
            name: 'Modal receives health report data',
            test: () => {
                const content = fs.readFileSync(healthScorePath, 'utf8');
                return content.includes('healthReport: healthReport') && 
                       content.includes('inputs: inputs') && 
                       content.includes('language: language');
            },
            expected: true,
            description: 'Modal should receive all necessary data including health report'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test Couple Mode Support
 */
function testCoupleModeSupport() {
    console.log('🧪 Testing couple mode support...');
    
    const modalPath = 'src/components/shared/MissingDataModal.js';
    
    const tests = [
        {
            name: 'Detects couple planning mode',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('inputs.planningType === \'couple\'') && 
                       content.includes('partner1Salary') && 
                       content.includes('partner2Salary');
            },
            expected: true,
            description: 'Should detect couple planning mode and show partner fields'
        },
        {
            name: 'Partner field labels in multiple languages',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('partner1Salary: \'Partner 1 Salary\'') &&
                       content.includes('partner2Salary: \'Partner 2 Salary\'') &&
                       content.includes('partner1Pension') &&
                       content.includes('בן/בת הזוג');
            },
            expected: true,
            description: 'Should include partner field labels in both Hebrew and English'
        },
        {
            name: 'Individual vs couple field logic',
            test: () => {
                const content = fs.readFileSync(modalPath, 'utf8');
                return content.includes('if (inputs.planningType === \'couple\')') && 
                       content.includes('monthlySalary') && 
                       content.includes('else {');
            },
            expected: true,
            description: 'Should have different field logic for individual vs couple modes'
        }
    ];
    
    return runTests(tests);
}

/**
 * Run a set of tests and return results
 */
function runTests(tests) {
    let passed = 0;
    let failed = 0;
    
    tests.forEach(test => {
        try {
            const result = test.test();
            if (result === test.expected) {
                console.log(`[${new Date().toISOString().slice(11, 19)}] ✅ PASS ${test.name}`);
                if (test.description) {
                    console.log(`    ${test.description}`);
                }
                passed++;
            } else {
                console.log(`[${new Date().toISOString().slice(11, 19)}] ❌ FAIL ${test.name}`);
                console.log(`    Expected: ${test.expected}, Got: ${result}`);
                if (test.description) {
                    console.log(`    ${test.description}`);
                }
                failed++;
            }
        } catch (error) {
            console.log(`[${new Date().toISOString().slice(11, 19)}] ❌ ERROR ${test.name}`);
            console.log(`    Error: ${error.message}`);
            failed++;
        }
    });
    
    return { passed, failed };
}

/**
 * Main test runner for Missing Data Modal functionality
 */
function runMissingDataModalTests() {
    console.log('🧪 Advanced Retirement Planner - Missing Data Modal Test Suite');
    console.log('='.repeat(70));
    console.log('');
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    // Run all test suites
    const testSuites = [
        { name: 'Missing Data Modal Availability', fn: testMissingDataModalAvailability },
        { name: 'Modal Component Structure', fn: testMissingDataModalStructure },
        { name: 'Missing Data Analysis Logic', fn: testMissingDataAnalysis },
        { name: 'Form Generation and Validation', fn: testFormGenerationAndValidation },
        { name: 'Real-time Score Calculation', fn: testRealTimeScoreCalculation },
        { name: 'Modal UI and UX Features', fn: testModalUIUX },
        { name: 'Financial Health Integration', fn: testFinancialHealthIntegration },
        { name: 'Couple Mode Support', fn: testCoupleModeSupport }
    ];
    
    testSuites.forEach(suite => {
        console.log(`\n📁 Testing ${suite.name}...`);
        const results = suite.fn();
        totalPassed += results.passed;
        totalFailed += results.failed;
    });
    
    // Summary
    console.log('\n📊 Missing Data Modal Test Summary');
    console.log('='.repeat(40));
    console.log(`✅ Tests Passed: ${totalPassed}`);
    console.log(`❌ Tests Failed: ${totalFailed}`);
    console.log(`📈 Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
    
    if (totalFailed === 0) {
        console.log('\n🎉 All Missing Data Modal tests passed! Feature is ready for use.');
    } else {
        console.log(`\n⚠️ ${totalFailed} test(s) failed. Please review and fix the issues above.`);
    }
    
    return { passed: totalPassed, failed: totalFailed };
}

// Export for use in main test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runMissingDataModalTests };
}

// Run tests if called directly
if (require.main === module) {
    runMissingDataModalTests();
}