// Export Functionality Test Suite
// Tests comprehensive export features including JSON, PDF, PNG, and Claude prompts
// Created for Advanced Retirement Planner v7.0.3+

const fs = require('fs');
const path = require('path');

/**
 * Test Export Functions Availability and Integration
 */
function testExportFunctionsAvailability() {
    console.log('🧪 Testing export functions availability...');
    
    const tests = [
        {
            name: 'exportFunctions.js exists',
            test: () => fs.existsSync('src/utils/exportFunctions.js'),
            expected: true,
            description: 'Export utility functions file should exist'
        },
        {
            name: 'ExportControls.js exists',
            test: () => fs.existsSync('src/components/shared/ExportControls.js'),
            expected: true,
            description: 'Export controls component file should exist'
        },
        {
            name: 'exportFunctions.js loaded in index.html',
            test: () => {
                const indexContent = fs.readFileSync('index.html', 'utf8');
                return indexContent.includes('src/utils/exportFunctions.js');
            },
            expected: true,
            description: 'Export functions should be loaded in index.html'
        },
        {
            name: 'ExportControls.js loaded in index.html',
            test: () => {
                const indexContent = fs.readFileSync('index.html', 'utf8');
                return indexContent.includes('src/components/shared/ExportControls.js');
            },
            expected: true,
            description: 'Export controls component should be loaded in index.html'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test Export Functions Implementation
 */
function testExportFunctionImplementation() {
    console.log('🧪 Testing export function implementation...');
    
    const exportFunctionsPath = 'src/utils/exportFunctions.js';
    const exportControlsPath = 'src/components/shared/ExportControls.js';
    
    const tests = [
        {
            name: 'exportAsImage function defined',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('async function exportAsImage') && 
                       content.includes('window.exportAsImage = exportAsImage');
            },
            expected: true,
            description: 'exportAsImage function should be defined and exported to window'
        },
        {
            name: 'exportForLLMAnalysis function defined',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('function exportForLLMAnalysis') && 
                       content.includes('window.exportForLLMAnalysis = exportForLLMAnalysis');
            },
            expected: true,
            description: 'exportForLLMAnalysis function should be defined and exported to window'
        },
        {
            name: 'copyClaudePromptToClipboard function defined',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('async function copyClaudePromptToClipboard') && 
                       content.includes('window.copyClaudePromptToClipboard = copyClaudePromptToClipboard');
            },
            expected: true,
            description: 'copyClaudePromptToClipboard function should be defined and exported to window'
        },
        {
            name: 'Export functions support PNG format',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('exportCanvasAsPNG') && content.includes('image/png');
            },
            expected: true,
            description: 'Export functions should support PNG format'
        },
        {
            name: 'Export functions support PDF format',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('exportCanvasAsPDF') && content.includes('jsPDF');
            },
            expected: true,
            description: 'Export functions should support PDF format via jsPDF'
        },
        {
            name: 'Export functions include metadata',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('metadata:') && 
                       content.includes('exportDate') && 
                       content.includes('version:');
            },
            expected: true,
            description: 'Export functions should include metadata with date and version'
        },
        {
            name: 'Export functions support partner data',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('partnerResults') && content.includes('partnerData');
            },
            expected: true,
            description: 'Export functions should support partner data for couple planning'
        },
        {
            name: 'Claude prompt includes Israeli specifics',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('Israeli retirement planning') && content.includes('tax laws');
            },
            expected: true,
            description: 'Claude prompt should include Israeli-specific guidance'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test ExportControls Component Integration
 */
function testExportControlsComponent() {
    console.log('🧪 Testing ExportControls component...');
    
    const exportControlsPath = 'src/components/shared/ExportControls.js';
    
    const tests = [
        {
            name: 'ExportControls component defined',
            test: () => {
                const content = fs.readFileSync(exportControlsPath, 'utf8');
                return content.includes('const ExportControls = ({') && 
                       content.includes('window.ExportControls = ExportControls');
            },
            expected: true,
            description: 'ExportControls component should be defined and exported to window'
        },
        {
            name: 'ExportControls supports multiple export formats',
            test: () => {
                const content = fs.readFileSync(exportControlsPath, 'utf8');
                return content.includes('handleImageExport') && 
                       content.includes('handleLLMExport') && 
                       content.includes('handleClaudePrompt');
            },
            expected: true,
            description: 'ExportControls should support image, LLM, and Claude prompt exports'
        },
        {
            name: 'ExportControls includes proper error handling',
            test: () => {
                const content = fs.readFileSync(exportControlsPath, 'utf8');
                return content.includes('try {') && 
                       content.includes('catch (error)') && 
                       content.includes('setExportStatus');
            },
            expected: true,
            description: 'ExportControls should include proper error handling'
        },
        {
            name: 'ExportControls supports loading states',
            test: () => {
                const content = fs.readFileSync(exportControlsPath, 'utf8');
                return content.includes('isExporting') && 
                       content.includes('setIsExporting') && 
                       content.includes('disabled:opacity-50');
            },
            expected: true,
            description: 'ExportControls should support loading states and disabled buttons'
        },
        {
            name: 'ExportControls supports multi-language',
            test: () => {
                const content = fs.readFileSync(exportControlsPath, 'utf8');
                return content.includes('language = \'en\'') && 
                       content.includes('he:') && 
                       content.includes('en:');
            },
            expected: true,
            description: 'ExportControls should support Hebrew and English languages'
        },
        {
            name: 'ExportControls includes instructions',
            test: () => {
                const content = fs.readFileSync(exportControlsPath, 'utf8');
                return content.includes('instructions:') && 
                       content.includes('tips:') && 
                       content.includes('Export Instructions');
            },
            expected: true,
            description: 'ExportControls should include user instructions and tips'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test WizardStepReview Integration
 */
function testWizardStepReviewIntegration() {
    console.log('🧪 Testing WizardStepReview export integration...');
    
    const wizardReviewPath = 'src/components/wizard/steps/WizardStepReview.js';
    
    const tests = [
        {
            name: 'WizardStepReview uses ExportControls component',
            test: () => {
                const content = fs.readFileSync(wizardReviewPath, 'utf8');
                return content.includes('window.ExportControls') && 
                       content.includes('createElement(window.ExportControls');
            },
            expected: true,
            description: 'WizardStepReview should use ExportControls component'
        },
        {
            name: 'WizardStepReview prepares export data',
            test: () => {
                const content = fs.readFileSync(wizardReviewPath, 'utf8');
                return content.includes('exportData = {') && 
                       content.includes('inputs:') && 
                       content.includes('results:');
            },
            expected: true,
            description: 'WizardStepReview should prepare structured export data'
        },
        {
            name: 'WizardStepReview includes partner data for couples',
            test: () => {
                const content = fs.readFileSync(wizardReviewPath, 'utf8');
                return content.includes('partnerResults:') && 
                       content.includes('planningType === \'couple\'') && 
                       content.includes('partner1:') && 
                       content.includes('partner2:');
            },
            expected: true,
            description: 'WizardStepReview should include partner data for couple planning'
        },
        {
            name: 'WizardStepReview removed old export functions',
            test: () => {
                const content = fs.readFileSync(wizardReviewPath, 'utf8');
                return !content.includes('window.exportToPDF') && 
                       !content.includes('window.emailFinancialPlan') &&
                       !content.includes('PDF export functionality not available');
            },
            expected: true,
            description: 'WizardStepReview should have removed old non-functional export code'
        },
        {
            name: 'WizardStepReview passes language parameter',
            test: () => {
                const content = fs.readFileSync(wizardReviewPath, 'utf8');
                return content.includes('language: language') && 
                       content.includes('createElement(window.ExportControls');
            },
            expected: true,
            description: 'WizardStepReview should pass language parameter to ExportControls'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test Export Data Structure and Content
 */
function testExportDataStructure() {
    console.log('🧪 Testing export data structure...');
    
    const exportFunctionsPath = 'src/utils/exportFunctions.js';
    
    const tests = [
        {
            name: 'LLM export includes metadata',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('metadata: {') && 
                       content.includes('exportDate:') && 
                       content.includes('version:') && 
                       content.includes('tool:');
            },
            expected: true,
            description: 'LLM export should include comprehensive metadata'
        },
        {
            name: 'LLM export includes personal information',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('personalInfo: {') && 
                       content.includes('currentAge:') && 
                       content.includes('retirementAge:') && 
                       content.includes('planningType:');
            },
            expected: true,
            description: 'LLM export should include personal information'
        },
        {
            name: 'LLM export includes financial data',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('financialData: {') && 
                       content.includes('currentSavings:') && 
                       content.includes('currentSalary:') && 
                       content.includes('monthlyExpenses:');
            },
            expected: true,
            description: 'LLM export should include comprehensive financial data'
        },
        {
            name: 'LLM export includes investment portfolio',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('investmentPortfolio: {') && 
                       content.includes('trainingFund:') && 
                       content.includes('personalPortfolio:') && 
                       content.includes('realEstate:') && 
                       content.includes('cryptocurrency:');
            },
            expected: true,
            description: 'LLM export should include detailed investment portfolio breakdown'
        },
        {
            name: 'LLM export includes projection results',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('projectionResults: {') && 
                       content.includes('totalSavingsAtRetirement:') && 
                       content.includes('monthlyPensionIncome:') && 
                       content.includes('readinessScore:');
            },
            expected: true,
            description: 'LLM export should include projection results'
        },
        {
            name: 'LLM export includes recommendation areas',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('recommendationAreas: [') && 
                       content.includes('asset_allocation_optimization') && 
                       content.includes('tax_optimization_strategies') && 
                       content.includes('retirement_timing_analysis');
            },
            expected: true,
            description: 'LLM export should include recommendation areas for AI analysis'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test Export Security and Error Handling
 */
function testExportSecurity() {
    console.log('🧪 Testing export security and error handling...');
    
    const exportFunctionsPath = 'src/utils/exportFunctions.js';
    const exportControlsPath = 'src/components/shared/ExportControls.js';
    
    const tests = [
        {
            name: 'Export functions include error handling',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('try {') && 
                       content.includes('} catch (error) {') && 
                       content.includes('console.error');
            },
            expected: true,
            description: 'Export functions should include comprehensive error handling'
        },
        {
            name: 'Export functions validate inputs',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('if (!') && 
                       content.includes('throw new Error');
            },
            expected: true,
            description: 'Export functions should validate inputs and throw appropriate errors'
        },
        {
            name: 'Export controls include timeout cleanup',
            test: () => {
                const content = fs.readFileSync(exportControlsPath, 'utf8');
                return content.includes('clearTimeout') && 
                       content.includes('timeoutRef') && 
                       content.includes('React.useEffect');
            },
            expected: true,
            description: 'Export controls should include proper timeout cleanup'
        },
        {
            name: 'Export functions use secure data handling',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('JSON.stringify') && 
                       content.includes('Blob') && 
                       content.includes('URL.createObjectURL') && 
                       content.includes('URL.revokeObjectURL');
            },
            expected: true,
            description: 'Export functions should use secure data handling with proper cleanup'
        },
        {
            name: 'Claude prompt uses secure clipboard API',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('navigator.clipboard') && 
                       content.includes('window.isSecureContext') && 
                       content.includes('document.execCommand(\'copy\')');
            },
            expected: true,
            description: 'Claude prompt should use secure clipboard API with fallback'
        }
    ];
    
    return runTests(tests);
}

/**
 * Test Dynamic Library Loading
 */
function testDynamicLibraryLoading() {
    console.log('🧪 Testing dynamic library loading...');
    
    const exportFunctionsPath = 'src/utils/exportFunctions.js';
    
    const tests = [
        {
            name: 'html2canvas dynamic loading implemented',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('loadHtml2Canvas') && 
                       content.includes('html2canvas.min.js') && 
                       content.includes('cdnjs.cloudflare.com');
            },
            expected: true,
            description: 'Should include html2canvas dynamic loading functionality'
        },
        {
            name: 'jsPDF dynamic loading implemented',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('loadJsPDF') && 
                       content.includes('jspdf.umd.min.js') && 
                       content.includes('cdnjs.cloudflare.com');
            },
            expected: true,
            description: 'Should include jsPDF dynamic loading functionality'
        },
        {
            name: 'Library loading includes error handling',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('script.onerror') && 
                       content.includes('reject(new Error') && 
                       content.includes('Failed to load');
            },
            expected: true,
            description: 'Library loading should include error handling for failed CDN requests'
        },
        {
            name: 'Library loading checks existing availability',
            test: () => {
                const content = fs.readFileSync(exportFunctionsPath, 'utf8');
                return content.includes('typeof html2canvas !== \'undefined\'') && 
                       content.includes('typeof jsPDF !== \'undefined\'');
            },
            expected: true,
            description: 'Library loading should check if libraries are already available'
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
 * Main test runner for export functionality
 */
function runExportTests() {
    console.log('🧪 Advanced Retirement Planner - Export Functionality Test Suite');
    console.log('='.repeat(70));
    console.log('');
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    // Run all test suites
    const testSuites = [
        { name: 'Export Functions Availability', fn: testExportFunctionsAvailability },
        { name: 'Export Function Implementation', fn: testExportFunctionImplementation },
        { name: 'ExportControls Component', fn: testExportControlsComponent },
        { name: 'WizardStepReview Integration', fn: testWizardStepReviewIntegration },
        { name: 'Export Data Structure', fn: testExportDataStructure },
        { name: 'Export Security', fn: testExportSecurity },
        { name: 'Dynamic Library Loading', fn: testDynamicLibraryLoading }
    ];
    
    testSuites.forEach(suite => {
        console.log(`\n📁 Testing ${suite.name}...`);
        const results = suite.fn();
        totalPassed += results.passed;
        totalFailed += results.failed;
    });
    
    // Summary
    console.log('\n📊 Export Functionality Test Summary');
    console.log('='.repeat(40));
    console.log(`✅ Tests Passed: ${totalPassed}`);
    console.log(`❌ Tests Failed: ${totalFailed}`);
    console.log(`📈 Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
    
    if (totalFailed === 0) {
        console.log('\n🎉 All export functionality tests passed! Export features are ready for use.');
    } else {
        console.log(`\n⚠️ ${totalFailed} test(s) failed. Please review and fix the issues above.`);
    }
    
    return { passed: totalPassed, failed: totalFailed };
}

// Export for use in main test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runExportTests };
}

// Run tests if called directly
if (require.main === module) {
    runExportTests();
}