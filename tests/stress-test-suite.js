// Stress Testing QA Suite for Advanced Retirement Planner v5.3.0
// Tests the economic scenario testing functionality
// Created by Yali Pollak (יהלי פולק) - v5.3.0

const fs = require('fs');
const path = require('path');

// Test configuration
const testConfig = {
    name: 'Stress Testing Suite',
    version: '5.3.0',
    totalTests: 0,
    passedTests: 0,
    results: []
};

// Helper function to log test results
function logTest(testName, passed, details = '') {
    testConfig.totalTests++;
    if (passed) testConfig.passedTests++;
    
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(`[${timestamp}] ${status} ${testName}`);
    if (details) console.log(`    ${details}`);
    
    testConfig.results.push({
        name: testName,
        passed,
        details,
        timestamp
    });
}

// Test stress test scenarios utility
function testStressTestScenariosUtility() {
    console.log('\n🧪 Testing Stress Test Scenarios Utility...');
    
    try {
        const utilityPath = path.join(__dirname, '../src/utils/stressTestScenarios.js');
        const utilityContent = fs.readFileSync(utilityPath, 'utf8');
        
        // Test scenario definitions
        const hasConservativeScenario = utilityContent.includes('conservative') && 
                                      utilityContent.includes('pensionReturn: 4.5');
        logTest('Conservative scenario defined', hasConservativeScenario);
        
        const hasOptimisticScenario = utilityContent.includes('optimistic') && 
                                    utilityContent.includes('pensionReturn: 9.5');
        logTest('Optimistic scenario defined', hasOptimisticScenario);
        
        const hasMarketCrashScenario = utilityContent.includes('marketCrash') && 
                                     utilityContent.includes('marketCrashYear: 10') &&
                                     utilityContent.includes('economicShockImpact: -35');
        logTest('Market crash scenario defined', hasMarketCrashScenario);
        
        const hasHighInflationScenario = utilityContent.includes('highInflation') && 
                                       utilityContent.includes('inflationRate: 7.5');
        logTest('High inflation scenario defined', hasHighInflationScenario);
        
        const hasEconomicStagnationScenario = utilityContent.includes('economicStagnation') && 
                                            utilityContent.includes('pensionReturn: 5.5');
        logTest('Economic stagnation scenario defined', hasEconomicStagnationScenario);
        
        // Test utility functions
        const hasRunStressTestFunction = utilityContent.includes('function runStressTest');
        logTest('runStressTest function exists', hasRunStressTestFunction);
        
        const hasGenerateComparisonFunction = utilityContent.includes('function generateStressTestComparison');
        logTest('generateStressTestComparison function exists', hasGenerateComparisonFunction);
        
        const hasClaudeTranslatorFunction = utilityContent.includes('function translateClaudeScenario');
        logTest('translateClaudeScenario function exists', hasClaudeTranslatorFunction);
        
        // Test market crash logic
        const hasMarketCrashLogic = utilityContent.includes('function applyMarketCrash') &&
                                  utilityContent.includes('portfolioAtCrash') &&
                                  utilityContent.includes('postCrashPortfolio');
        logTest('Market crash application logic', hasMarketCrashLogic);
        
        // Test Claude scenario parsing
        const hasScenarioParsingLogic = utilityContent.includes('description.toLowerCase()') &&
                                      utilityContent.includes('recession') &&
                                      utilityContent.includes('inflation');
        logTest('Claude scenario parsing logic', hasScenarioParsingLogic);
        
        // Test window exports
        const hasWindowExports = utilityContent.includes('window.STRESS_TEST_SCENARIOS') &&
                               utilityContent.includes('window.runStressTest') &&
                               utilityContent.includes('window.generateStressTestComparison');
        logTest('Window exports for stress testing', hasWindowExports);
        
    } catch (error) {
        logTest('Stress test scenarios utility file exists', false, error.message);
    }
}

// Test stress test interface component
function testStressTestInterface() {
    console.log('\n🖥️ Testing Stress Test Interface Component...');
    
    try {
        const componentPath = path.join(__dirname, '../src/components/StressTestInterface.js');
        const componentContent = fs.readFileSync(componentPath, 'utf8');
        
        // Test component structure
        const hasValidComponentStructure = componentContent.includes('const StressTestInterface') &&
                                         componentContent.includes('React.createElement');
        logTest('Valid React component structure', hasValidComponentStructure);
        
        // Test props handling
        const hasRequiredProps = componentContent.includes('inputs,') &&
                                componentContent.includes('workPeriods') &&
                                componentContent.includes('results') &&
                                componentContent.includes('language') &&
                                componentContent.includes('formatCurrency');
        logTest('Required props handling', hasRequiredProps);
        
        // Test state management
        const hasStateManagement = componentContent.includes('useState(\'baseline\')') &&
                                  componentContent.includes('setActiveScenario') &&
                                  componentContent.includes('setStressTestResults') &&
                                  componentContent.includes('setIsCalculating');
        logTest('Proper state management', hasStateManagement);
        
        // Test scenario selection
        const hasScenarioButtons = componentContent.includes('baseline') &&
                                 componentContent.includes('conservative') &&
                                 componentContent.includes('optimistic') &&
                                 componentContent.includes('marketCrash') &&
                                 componentContent.includes('highInflation') &&
                                 componentContent.includes('economicStagnation');
        logTest('All scenario selection buttons', hasScenarioButtons);
        
        // Test Claude translator integration
        const hasClaudeTranslator = componentContent.includes('claudeTranslator') &&
                                  componentContent.includes('translateClaudeScenario') &&
                                  componentContent.includes('customScenario') &&
                                  componentContent.includes('textarea');
        logTest('Claude translator integration', hasClaudeTranslator);
        
        // Test results display
        const hasResultsDisplay = componentContent.includes('totalSavings') &&
                                componentContent.includes('monthlyIncome') &&
                                componentContent.includes('formatCurrency') &&
                                componentContent.includes('table');
        logTest('Results display functionality', hasResultsDisplay);
        
        // Test comparison table
        const hasComparisonTable = componentContent.includes('comparison-table') &&
                                  componentContent.includes('getScenarioData') &&
                                  componentContent.includes('formatDifference') &&
                                  componentContent.includes('baseline');
        logTest('Scenario comparison table', hasComparisonTable);
        
        // Test translations
        const hasTranslations = componentContent.includes('content = {') &&
                              componentContent.includes('he:') &&
                              componentContent.includes('en:') &&
                              componentContent.includes('מבחני עקה') &&
                              componentContent.includes('Economic Stress Testing');
        logTest('Hebrew/English translations', hasTranslations);
        
        // Test instructions section
        const hasInstructions = componentContent.includes('instructions') &&
                              componentContent.includes('section-instructions') &&
                              componentContent.includes('tips.map');
        logTest('Comprehensive instructions section', hasInstructions);
        
        // Test window export
        const hasWindowExport = componentContent.includes('window.StressTestInterface = StressTestInterface');
        logTest('Component window export', hasWindowExport);
        
    } catch (error) {
        logTest('Stress test interface component exists', false, error.message);
    }
}

// Test summary panel component
function testSummaryPanel() {
    console.log('\n📊 Testing Summary Panel Component...');
    
    try {
        const componentPath = path.join(__dirname, '../src/components/SummaryPanel.js');
        const componentContent = fs.readFileSync(componentPath, 'utf8');
        
        // Test component structure
        const hasValidComponentStructure = componentContent.includes('const SummaryPanel') &&
                                         componentContent.includes('React.createElement');
        logTest('Valid React component structure', hasValidComponentStructure);
        
        // Test inflation calculations
        const hasInflationCalculations = componentContent.includes('inflationFactor') &&
                                        componentContent.includes('totalSavingsReal') &&
                                        componentContent.includes('monthlyIncomeReal') &&
                                        componentContent.includes('purchasingPowerLoss');
        logTest('Inflation impact calculations', hasInflationCalculations);
        
        // Test portfolio breakdown
        const hasPortfolioBreakdown = componentContent.includes('calculatePortfolioBreakdown') &&
                                    componentContent.includes('pension') &&
                                    componentContent.includes('training') &&
                                    componentContent.includes('personal') &&
                                    componentContent.includes('realEstate') &&
                                    componentContent.includes('crypto');
        logTest('Portfolio breakdown analysis', hasPortfolioBreakdown);
        
        // Test diversification score
        const hasDiversificationScore = componentContent.includes('calculateDiversificationScore') &&
                                      componentContent.includes('nonZeroValues') &&
                                      componentContent.includes('length');
        logTest('Diversification score calculation', hasDiversificationScore);
        
        // Test readiness score
        const hasReadinessScore = componentContent.includes('calculateReadinessScore') &&
                                componentContent.includes('savingsScore') &&
                                componentContent.includes('diversificationPenalty') &&
                                componentContent.includes('agePenalty');
        logTest('Retirement readiness score calculation', hasReadinessScore);
        
        // Test savings rate tracking
        const hasSavingsRateTracking = componentContent.includes('currentSavingsRate') &&
                                     componentContent.includes('currentContributions') &&
                                     componentContent.includes('currentSalary') &&
                                     componentContent.includes('Target Rate');
        logTest('Savings rate tracking', hasSavingsRateTracking);
        
        // Test key metrics display
        const hasKeyMetrics = componentContent.includes('currentAge') &&
                            componentContent.includes('retirementAge') &&
                            componentContent.includes('yearsToRetirement') &&
                            componentContent.includes('basic-info');
        logTest('Key metrics dashboard', hasKeyMetrics);
        
        // Test color-coded status
        const hasColorCoding = componentContent.includes('getReadinessStatus') &&
                             componentContent.includes('text-green-600') &&
                             componentContent.includes('text-yellow-600') &&
                             componentContent.includes('text-red-600');
        logTest('Color-coded status indicators', hasColorCoding);
        
        // Test translations
        const hasTranslations = componentContent.includes('content = {') &&
                              componentContent.includes('he:') &&
                              componentContent.includes('en:') &&
                              componentContent.includes('סיכום מפתח') &&
                              componentContent.includes('Key Summary');
        logTest('Hebrew/English translations', hasTranslations);
        
        // Test window export
        const hasWindowExport = componentContent.includes('window.SummaryPanel = SummaryPanel');
        logTest('Component window export', hasWindowExport);
        
    } catch (error) {
        logTest('Summary panel component exists', false, error.message);
    }
}

// Test export functionality
function testExportFunctionality() {
    console.log('\n📤 Testing Export Functionality...');
    
    try {
        const utilityPath = path.join(__dirname, '../src/utils/exportFunctions.js');
        const utilityContent = fs.readFileSync(utilityPath, 'utf8');
        
        // Test export functions
        const hasImageExportFunction = utilityContent.includes('async function exportAsImage') &&
                                     utilityContent.includes('html2canvas') &&
                                     utilityContent.includes('jsPDF');
        logTest('Image export function (PNG/PDF)', hasImageExportFunction);
        
        const hasLLMExportFunction = utilityContent.includes('function exportForLLMAnalysis') &&
                                   utilityContent.includes('JSON.stringify') &&
                                   utilityContent.includes('analysisData');
        logTest('LLM analysis export function', hasLLMExportFunction);
        
        const hasClaudePromptFunction = utilityContent.includes('function generateClaudeRecommendationsPrompt') &&
                                      utilityContent.includes('Asset Allocation Optimization') &&
                                      utilityContent.includes('Tax Optimization');
        logTest('Claude recommendations prompt generation', hasClaudePromptFunction);
        
        const hasClipboardFunction = utilityContent.includes('async function copyClaudePromptToClipboard') &&
                                   utilityContent.includes('navigator.clipboard') &&
                                   utilityContent.includes('writeText');
        logTest('Clipboard copy functionality', hasClipboardFunction);
        
        // Test dynamic library loading
        const hasDynamicLoading = utilityContent.includes('async function loadHtml2Canvas') &&
                                utilityContent.includes('async function loadJsPDF') &&
                                utilityContent.includes('createElement(\'script\')');
        logTest('Dynamic library loading', hasDynamicLoading);
        
        // Test comprehensive data structure
        const hasComprehensiveData = utilityContent.includes('metadata') &&
                                   utilityContent.includes('personalInfo') &&
                                   utilityContent.includes('financialData') &&
                                   utilityContent.includes('investmentPortfolio') &&
                                   utilityContent.includes('projectionResults') &&
                                   utilityContent.includes('recommendationAreas');
        logTest('Comprehensive export data structure', hasComprehensiveData);
        
        // Test window exports
        const hasWindowExports = utilityContent.includes('window.exportAsImage') &&
                               utilityContent.includes('window.exportForLLMAnalysis') &&
                               utilityContent.includes('window.generateClaudeRecommendationsPrompt') &&
                               utilityContent.includes('window.copyClaudePromptToClipboard');
        logTest('Window exports for export functions', hasWindowExports);
        
    } catch (error) {
        logTest('Export functions utility exists', false, error.message);
    }
    
    // Test export controls component
    try {
        const componentPath = path.join(__dirname, '../src/components/ExportControls.js');
        const componentContent = fs.readFileSync(componentPath, 'utf8');
        
        const hasExportButtons = componentContent.includes('png-export') &&
                               componentContent.includes('pdf-export') &&
                               componentContent.includes('llm-export') &&
                               componentContent.includes('claude-prompt');
        logTest('Export control buttons', hasExportButtons);
        
        const hasLoadingStates = componentContent.includes('isExporting') &&
                               componentContent.includes('setIsExporting') &&
                               componentContent.includes('disabled:opacity-50');
        logTest('Export loading states', hasLoadingStates);
        
        const hasStatusFeedback = componentContent.includes('exportStatus') &&
                                componentContent.includes('setExportStatus') &&
                                componentContent.includes('bg-green-50') &&
                                componentContent.includes('bg-red-50');
        logTest('Export status feedback', hasStatusFeedback);
        
    } catch (error) {
        logTest('Export controls component exists', false, error.message);
    }
}

// Test integration in main application
function testApplicationIntegration() {
    console.log('\n🔗 Testing Application Integration...');
    
    try {
        const indexPath = path.join(__dirname, '../index.html');
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        
        // Test script loading
        const hasStressTestScript = indexContent.includes('stressTestScenarios.js?v=5.3.0');
        logTest('Stress test scenarios script loaded', hasStressTestScript);
        
        const hasStressTestInterfaceScript = indexContent.includes('StressTestInterface.js?v=5.3.0');
        logTest('Stress test interface script loaded', hasStressTestInterfaceScript);
        
        const hasSummaryPanelScript = indexContent.includes('SummaryPanel.js?v=5.3.0');
        logTest('Summary panel script loaded', hasSummaryPanelScript);
        
        const hasExportFunctionsScript = indexContent.includes('exportFunctions.js?v=5.3.0');
        logTest('Export functions script loaded', hasExportFunctionsScript);
        
        const hasExportControlsScript = indexContent.includes('ExportControls.js?v=5.3.0');
        logTest('Export controls script loaded', hasExportControlsScript);
        
        // Test version consistency
        const versionCount = (indexContent.match(/v5\.3\.0/g) || []).length;
        const hasConsistentVersioning = versionCount >= 5; // Should appear multiple times
        logTest('Consistent v5.3.0 versioning', hasConsistentVersioning, `Found ${versionCount} version references`);
        
    } catch (error) {
        logTest('Index.html file exists and accessible', false, error.message);
    }
    
    // Test results panel integration
    try {
        const resultsPath = path.join(__dirname, '../src/components/RetirementResultsPanel.js');
        const resultsContent = fs.readFileSync(resultsPath, 'utf8');
        
        const hasSummaryPanelIntegration = resultsContent.includes('window.SummaryPanel') &&
                                         resultsContent.includes('summary-panel');
        logTest('Summary panel integration in results', hasSummaryPanelIntegration);
        
        const hasStressTestIntegration = resultsContent.includes('window.StressTestInterface') &&
                                       resultsContent.includes('stress-test');
        logTest('Stress test integration in results', hasStressTestIntegration);
        
        const hasExportControlsIntegration = resultsContent.includes('window.ExportControls') &&
                                           resultsContent.includes('export-controls');
        logTest('Export controls integration in results', hasExportControlsIntegration);
        
    } catch (error) {
        logTest('Results panel integration', false, error.message);
    }
}

// Test mobile responsiveness enhancements
function testMobileResponsiveness() {
    console.log('\n📱 Testing Mobile Responsiveness Enhancements...');
    
    try {
        const stylePath = path.join(__dirname, '../src/styles/main.css');
        const styleContent = fs.readFileSync(stylePath, 'utf8');
        
        // Test mobile-first approach
        const hasMobileFirstStyles = styleContent.includes('/* Mobile-First Base Styles */') &&
                                   styleContent.includes('min-height: 44px') &&
                                   styleContent.includes('font-size: 16px; /* Prevents zoom on iOS */');
        logTest('Mobile-first base styles', hasMobileFirstStyles);
        
        // Test responsive breakpoints
        const hasResponsiveBreakpoints = styleContent.includes('@media (max-width: 480px)') &&
                                       styleContent.includes('@media (min-width: 481px) and (max-width: 768px)') &&
                                       styleContent.includes('@media (min-width: 769px) and (max-width: 1024px)') &&
                                       styleContent.includes('@media (min-width: 1025px)');
        logTest('Comprehensive responsive breakpoints', hasResponsiveBreakpoints);
        
        // Test touch optimizations
        const hasTouchOptimizations = styleContent.includes('@media (hover: none) and (pointer: coarse)') &&
                                    styleContent.includes('min-height: 48px') &&
                                    styleContent.includes('min-width: 48px');
        logTest('Touch device optimizations', hasTouchOptimizations);
        
        // Test accessibility features
        const hasAccessibilityFeatures = styleContent.includes('@media (prefers-reduced-motion: reduce)') &&
                                        styleContent.includes('@media (prefers-contrast: high)') &&
                                        styleContent.includes('animation-duration: 0.01ms');
        logTest('Accessibility media queries', hasAccessibilityFeatures);
        
        // Test print styles
        const hasPrintStyles = styleContent.includes('@media print') &&
                             styleContent.includes('display: none !important') &&
                             styleContent.includes('break-inside: avoid');
        logTest('Print optimization styles', hasPrintStyles);
        
        // Test text utilities
        const hasTextUtilities = styleContent.includes('truncate-ellipsis') &&
                                styleContent.includes('text-overflow: ellipsis') &&
                                styleContent.includes('responsive-text') &&
                                styleContent.includes('clamp(');
        logTest('Text truncation and responsive utilities', hasTextUtilities);
        
    } catch (error) {
        logTest('CSS styles file exists and accessible', false, error.message);
    }
}

// Main test execution
function runStressTestSuite() {
    console.log('🧪 Advanced Retirement Planner - Stress Testing QA Suite v5.3.0');
    console.log('═'.repeat(80));
    
    // Run all test categories
    testStressTestScenariosUtility();
    testStressTestInterface();
    testSummaryPanel();
    testExportFunctionality();
    testApplicationIntegration();
    testMobileResponsiveness();
    
    // Calculate and display results
    const successRate = ((testConfig.passedTests / testConfig.totalTests) * 100).toFixed(1);
    const timestamp = new Date().toISOString();
    
    console.log('\n' + '═'.repeat(80));
    console.log(`📊 STRESS TESTING QA RESULTS - ${timestamp}`);
    console.log('═'.repeat(80));
    console.log(`Total Tests: ${testConfig.totalTests}`);
    console.log(`Passed: ${testConfig.passedTests}`);
    console.log(`Failed: ${testConfig.totalTests - testConfig.passedTests}`);
    console.log(`Success Rate: ${successRate}%`);
    
    if (successRate >= 95) {
        console.log('🚀 EXCELLENT - Stress testing implementation ready for production!');
    } else if (successRate >= 85) {
        console.log('✅ GOOD - Minor improvements recommended before deployment.');
    } else {
        console.log('⚠️  NEEDS ATTENTION - Significant issues found, review required.');
    }
    
    // Generate detailed report
    const report = {
        testSuite: testConfig.name,
        version: testConfig.version,
        timestamp: timestamp,
        summary: {
            totalTests: testConfig.totalTests,
            passedTests: testConfig.passedTests,
            failedTests: testConfig.totalTests - testConfig.passedTests,
            successRate: parseFloat(successRate)
        },
        results: testConfig.results
    };
    
    // Save report
    const reportPath = path.join(__dirname, 'stress-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved: ${reportPath}`);
    
    return report;
}

// Export for use in other test suites
module.exports = {
    runStressTestSuite,
    testConfig
};

// Run if called directly
if (require.main === module) {
    runStressTestSuite();
}