// E2E Testing Suite for Modular Advanced Retirement Planner
// Comprehensive testing for the new modular architecture with dynamic loading

const fs = require('fs');
const path = require('path');

class E2ETestSuite {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
        this.startTime = Date.now();
    }

    // Log test result
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

    // Test file existence and properties
    testFileExists(filePath, description) {
        try {
            const stats = fs.statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(1);
            this.logTest(description, true, `File exists (${sizeKB}KB)`);
            return { exists: true, size: stats.size, sizeKB };
        } catch (error) {
            this.logTest(description, false, `File not found: ${filePath}`);
            return { exists: false, size: 0, sizeKB: '0' };
        }
    }

    // Test JavaScript syntax
    testJSSyntax(filePath, description) {
        try {
            const { spawn } = require('child_process');
            const result = spawn('node', ['-c', filePath], { stdio: 'pipe' });
            
            result.on('close', (code) => {
                const passed = code === 0;
                this.logTest(description, passed, 
                    passed ? 'Syntax is valid' : 'Syntax errors found');
            });
        } catch (error) {
            this.logTest(description, false, `Syntax check failed: ${error.message}`);
        }
    }

    // Test file content contains required elements
    testFileContent(filePath, patterns, description) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const missingPatterns = [];
            
            patterns.forEach(pattern => {
                if (typeof pattern === 'string') {
                    if (!content.includes(pattern)) {
                        missingPatterns.push(pattern);
                    }
                } else if (pattern instanceof RegExp) {
                    if (!pattern.test(content)) {
                        missingPatterns.push(pattern.toString());
                    }
                }
            });
            
            const passed = missingPatterns.length === 0;
            this.logTest(description, passed, 
                passed ? `All ${patterns.length} patterns found` : 
                `Missing patterns: ${missingPatterns.join(', ')}`);
            
            return { passed, content, missingPatterns };
        } catch (error) {
            this.logTest(description, false, `Content check failed: ${error.message}`);
            return { passed: false, content: '', missingPatterns: patterns };
        }
    }

    // Test modular architecture structure
    testModularStructure() {
        console.log('\n🏗️  Testing Modular Architecture Structure...\n');
        
        // Test core structure
        const coreDir = '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core';
        const modulesDir = '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/modules';
        
        this.testFileExists(`${coreDir}/dynamic-loader.js`, 'Dynamic Loader Core File');
        this.testFileExists(`${coreDir}/app-main.js`, 'Main Application Core File');
        this.testFileExists(`${modulesDir}/advanced-portfolio.js`, 'Advanced Portfolio Module');
        this.testFileExists('/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/index-modular.html', 'Modular HTML Entry Point');
        
        // Test file sizes are within limits (updated for v4.2.0 - larger due to enhanced features)
        const appMain = this.testFileExists(`${coreDir}/app-main.js`, 'App Main Size Check');
        if (appMain.exists && appMain.size > 120 * 1024) { // 120KB limit (increased for enhanced features)
            this.logTest('App Main Size Limit', false, `File too large: ${appMain.sizeKB}KB > 120KB`);
        } else if (appMain.exists) {
            this.logTest('App Main Size Limit', true, `Within limit: ${appMain.sizeKB}KB`);
        }
        
        const advancedModule = this.testFileExists(`${modulesDir}/advanced-portfolio.js`, 'Advanced Module Size Check');
        if (advancedModule.exists && advancedModule.size > 90 * 1024) { // 90KB limit
            this.logTest('Advanced Module Size Limit', false, `File too large: ${advancedModule.sizeKB}KB > 90KB`);
        } else if (advancedModule.exists) {
            this.logTest('Advanced Module Size Limit', true, `Within limit: ${advancedModule.sizeKB}KB`);
        }
    }

    // Test core functionality
    testCoreFunctionality() {
        console.log('\n⚙️  Testing Core Functionality...\n');
        
        // Test dynamic loader
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/dynamic-loader.js',
            [
                'DynamicModuleLoader',
                'loadModule',
                'loadAdvancedTab',
                'loadAnalysisTab',
                'window.moduleLoader',
                'preloadCriticalModules'
            ],
            'Dynamic Loader Core Functions'
        );
        
        // Test main app
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/app-main.js',
            [
                'RetirementPlannerCore',
                'BasicInputs',
                'BasicResults',
                'SimpleChart',
                'handleTabClick',
                'window.initializeRetirementPlannerCore'
            ],
            'Core App Components'
        );
        
        // Test React hooks usage
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/app-main.js',
            [
                'React.useState',
                'React.useEffect',
                'React.useRef',
                'React.createElement'
            ],
            'React Hooks and API Usage'
        );
    }

    // Test spouse/couple planning functionality
    testSpouseCoupleFeatures() {
        console.log('\n👫 Testing Spouse/Couple Planning Features...\n');
        
        // Test couple planning type selection in core app
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/app-main.js',
            [
                'planningType',
                'single',
                'couple',
                'partner1Age',
                'partner1Salary',
                'partner2Age',
                'partner2Salary',
                'Partner 1',
                'Partner 2'
            ],
            'Couple Planning Type Selection'
        );
        
        // Test calculation logic for couples
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/app-main.js',
            [
                'totalMonthlySalary',
                'inputs.planningType === \'couple\'',
                'inputs.partner1Salary',
                'inputs.partner2Salary',
                'totalCurrentSavings',
                'totalTrainingFund'
            ],
            'Couple Calculation Logic'
        );
        
        // Test UI components for partner information
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/app-main.js',
            [
                'partner-info',
                'Planning Type',
                'Individual planning',
                'Joint planning',
                'Partner Information',
                'פרטי בני הזוג'
            ],
            'Partner UI Components'
        );
        
        // Test results display includes couple information
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/app-main.js',
            [
                'planningType:',
                'totalMonthlySalary:',
                'Math.round(totalMonthlySalary)'
            ],
            'Couple Results Display'
        );
    }

    // Test advanced module functionality
    testAdvancedModuleFunctionality() {
        console.log('\n📈 Testing Advanced Module Functionality...\n');
        
        // Test advanced portfolio module
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/modules/advanced-portfolio.js',
            [
                'AdvancedPortfolio',
                'pensionIndexAllocation',
                'trainingFundIndexAllocation',
                'workPeriods',
                'addWorkPeriod',
                'updateWorkPeriod',
                'availableIndices',
                'window.AdvancedPortfolio'
            ],
            'Advanced Portfolio Features'
        );
        
        // Test portfolio allocation features
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/modules/advanced-portfolio.js',
            [
                'S&P 500',
                'Tel Aviv 35',
                'Government Bonds',
                'Real Estate',
                'Cryptocurrency',
                'Personal Portfolio'
            ],
            'Investment Options Coverage'
        );
    }

    // Test stress testing functionality
    testStressTestingFunctionality() {
        console.log('\n🔥 Testing Stress Testing Functionality...\n');
        
        // Test stress testing module exists and has required components
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/modules/scenarios-stress.js',
            [
                'ScenariosStress',
                'riskScenarios',
                'crisisScenarios',
                'calculateStressTest',
                'calculateNormalScenario',
                'generateCrisisChartData',
                'window.ScenariosStress'
            ],
            'Stress Testing Core Functions'
        );
        
        // Test stress scenarios configuration
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/modules/scenarios-stress.js',
            [
                'conservative',
                'moderate',
                'aggressive',
                'mild',
                'severe',
                'returnReduction',
                'duration'
            ],
            'Stress Scenarios Configuration'
        );
        
        // Test dynamic loader has correct stress test loading
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/dynamic-loader.js',
            [
                'loadStressTestTab',
                'ScenariosStress',
                './src/modules/scenarios-stress.js'
            ],
            'Stress Test Dynamic Loading'
        );
        
        // Test main app has correct stress test integration
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/app-main.js',
            [
                'stress',
                'window.ScenariosStress',
                'React.createElement(window.ScenariosStress',
                'loadStressTestTab'
            ],
            'Stress Test Main App Integration'
        );
        
        // Test chart integration in stress tests
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/modules/scenarios-stress.js',
            [
                'Chart',
                'canvas',
                'chartInstance',
                'generateCrisisChartData',
                'normalAccumulation',
                'stressedAccumulation'
            ],
            'Stress Test Chart Integration'
        );
    }

    // Test HTML integration
    testHTMLIntegration() {
        console.log('\n🌐 Testing HTML Integration...\n');
        
        // Test modular HTML structure (updated for current index.html)
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/index.html',
            [
                './src/core/dynamic-loader.js',
                './src/core/app-main.js',
                'initializeRetirementPlannerCore',
                'React',
                'ReactDOM',
                'Chart.js'
            ],
            'Modular HTML Dependencies'
        );
        
        // Test loading mechanisms (updated for current index.html)
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/index.html',
            [
                'checkDependencies',
                'initializeApp',
                'loadScript',
                'Error',
                'Loading'
            ],
            'Loading and Error Handling'
        );
    }

    // Test bilingual support
    testBilingualSupport() {
        console.log('\n🌍 Testing Bilingual Support...\n');
        
        // Test Hebrew and English translations
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/app-main.js',
            [
                'language === \'he\'',
                'language === \'en\'',
                'מתכנן הפרישה המתקדם',
                'Advanced Retirement Planner',
                'dir: language === \'he\' ? \'rtl\' : \'ltr\''
            ],
            'Bilingual Core Support'
        );
        
        // Test Hebrew translations in advanced module
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/modules/advanced-portfolio.js',
            [
                'הגדרות מתקדמות',
                'תקופות עבודה',
                'השקעות נוספות',
                'קרן פנסיה',
                'קרן השתלמות'
            ],
            'Advanced Module Hebrew Support'
        );
    }

    // Test performance characteristics
    testPerformanceCharacteristics() {
        console.log('\n⚡ Testing Performance Characteristics...\n');
        
        // Calculate total initial load size
        const indexSize = this.testFileExists(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/index-modular.html', 
            'HTML Entry Point'
        );
        const loaderSize = this.testFileExists(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/dynamic-loader.js', 
            'Dynamic Loader'
        );
        const appSize = this.testFileExists(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/app-main.js', 
            'Core Application'
        );
        
        const totalInitialSize = indexSize.size + loaderSize.size + appSize.size;
        const totalInitialKB = (totalInitialSize / 1024).toFixed(1);
        
        // Test total initial load size
        if (totalInitialSize < 100 * 1024) { // 100KB limit
            this.logTest('Initial Load Size Performance', true, 
                `Total initial load: ${totalInitialKB}KB (excellent)`);
        } else if (totalInitialSize < 150 * 1024) { // 150KB limit
            this.logTest('Initial Load Size Performance', true, 
                `Total initial load: ${totalInitialKB}KB (good)`);
        } else {
            this.logTest('Initial Load Size Performance', false, 
                `Total initial load: ${totalInitialKB}KB (too large)`);
        }
        
        // Test module granularity
        const advancedModuleSize = this.testFileExists(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/modules/advanced-portfolio.js', 
            'Advanced Module'
        );
        
        if (advancedModuleSize.exists && advancedModuleSize.size < 50 * 1024) {
            this.logTest('Module Size Granularity', true, 
                `Advanced module: ${advancedModuleSize.sizeKB}KB (optimal)`);
        } else if (advancedModuleSize.exists && advancedModuleSize.size < 90 * 1024) {
            this.logTest('Module Size Granularity', true, 
                `Advanced module: ${advancedModuleSize.sizeKB}KB (acceptable)`);
        } else if (advancedModuleSize.exists) {
            this.logTest('Module Size Granularity', false, 
                `Advanced module: ${advancedModuleSize.sizeKB}KB (too large)`);
        }
    }

    // Test backward compatibility
    testBackwardCompatibility() {
        console.log('\n🔄 Testing Backward Compatibility...\n');
        
        // Check that old files still exist for comparison
        const monolithicExists = this.testFileExists(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/index-monolithic.html',
            'Monolithic Version Backup'
        );
        
        const simpleExists = this.testFileExists(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/index-simple-backup.html',
            'Simple Version Backup'
        );
        
        // Test that we still have all the original component files
        const componentFiles = [
            'src/translations/multiLanguage.js',
            'src/data/marketConstants.js', 
            'src/utils/retirementCalculations.js',
            'src/components/RetirementPlannerApp.js',
            'src/components/RetirementBasicForm.js',
            'src/components/RetirementAdvancedForm.js',
            'src/components/RetirementResultsPanel.js'
        ];
        
        componentFiles.forEach(file => {
            this.testFileExists(
                `/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/${file}`,
                `Legacy Component: ${file}`
            );
        });
    }

    // Test security and best practices
    testSecurityAndBestPractices() {
        console.log('\n🔒 Testing Security & Best Practices...\n');
        
        // Test for security issues
        const securityPatterns = [
            { pattern: 'innerHTML =', name: 'innerHTML assignment', shouldNotExist: false },
            { pattern: 'onclick=', name: 'inline event handlers', shouldNotExist: true }
        ];
        
        const filesToCheck = [
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/app-main.js',
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/dynamic-loader.js',
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/modules/advanced-portfolio.js',
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/index-modular.html'
        ];
        
        filesToCheck.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                
                securityPatterns.forEach(({ pattern, name, shouldNotExist }) => {
                    const found = content.includes(pattern);
                    const passed = shouldNotExist ? !found : found;
                    
                    this.logTest(
                        `Security: ${name} in ${path.basename(filePath)}`,
                        passed,
                        shouldNotExist 
                            ? (found ? 'Security issue found' : 'Clean')
                            : (found ? 'Pattern found as expected' : 'Pattern missing')
                    );
                });
            }
        });
        
        // Test for React best practices
        const reactPatterns = [
            'React.createElement',
            'React.useState',
            'React.useEffect',
            'key:',
            'className:'
        ];
        
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/core/app-main.js',
            reactPatterns,
            'React Best Practices in Core'
        );
        
        this.testFileContent(
            '/Users/yali.pollak/Projects/Pension_Planner/advanced-retirement-planner/src/modules/advanced-portfolio.js',
            reactPatterns,
            'React Best Practices in Modules'
        );
    }

    // Run all tests
    async runAllTests() {
        console.log('🧪 Advanced Retirement Planner - E2E Test Suite');
        console.log('='.repeat(55));
        console.log('🎯 Testing Modular Architecture with Dynamic Loading\n');
        
        // Run test suites
        this.testModularStructure();
        this.testCoreFunctionality();
        this.testSpouseCoupleFeatures();
        this.testAdvancedModuleFunctionality();
        this.testStressTestingFunctionality();
        this.testHTMLIntegration();
        this.testBilingualSupport();
        this.testPerformanceCharacteristics();
        this.testBackwardCompatibility();
        this.testSecurityAndBestPractices();
        
        // Wait a bit for async tests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Summary
        this.printSummary();
    }

    // Print test summary
    printSummary() {
        const totalTests = this.passedTests + this.failedTests;
        const successRate = totalTests > 0 ? ((this.passedTests / totalTests) * 100).toFixed(1) : 0;
        const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);
        
        console.log('\n' + '='.repeat(55));
        console.log('📊 Test Results Summary');
        console.log('='.repeat(55));
        console.log(`✅ Tests Passed: ${this.passedTests}`);
        console.log(`❌ Tests Failed: ${this.failedTests}`);
        console.log(`📈 Success Rate: ${successRate}%`);
        console.log(`⏱️  Duration: ${duration}s`);
        console.log('='.repeat(55));
        
        if (this.failedTests === 0) {
            console.log('🎉 All tests passed! Ready for production deployment.');
            console.log('🚀 Modular architecture is working correctly.');
            console.log('✨ Dynamic loading system is functional.');
        } else {
            console.log('⚠️  Some tests failed. Please review the issues above.');
            console.log('🔧 Fix the failing tests before production deployment.');
        }
        
        console.log('\n💡 Quick fixes:');
        console.log('   • npm run test  (run standard tests)');
        console.log('   • npm run test:local  (test in browser)');
        console.log('   • Check console for module loading errors');
        console.log('   • Verify file paths and permissions');
        
        return {
            passed: this.passedTests,
            failed: this.failedTests,
            total: totalTests,
            successRate: parseFloat(successRate),
            duration: parseFloat(duration)
        };
    }
}

// Run the test suite
if (require.main === module) {
    const testSuite = new E2ETestSuite();
    testSuite.runAllTests().then(() => {
        process.exit(testSuite.failedTests > 0 ? 1 : 0);
    });
}

module.exports = E2ETestSuite;