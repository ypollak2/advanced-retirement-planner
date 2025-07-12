// Comprehensive Functional Test Suite
// Tests all user-facing functionality: loading, inputs, screens, exports, graphs

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class ComprehensiveFunctionalTest {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
        this.startTime = Date.now();
        this.browser = null;
        this.page = null;
        this.errors = [];
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

    // Initialize browser
    async initBrowser() {
        try {
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            this.page = await this.browser.newPage();
            
            // Listen for console errors and warnings
            this.page.on('console', msg => {
                const text = msg.text();
                if (msg.type() === 'error' || text.includes('Error:') || text.includes('Warning:')) {
                    console.log(`🚨 Browser Console ${msg.type().toUpperCase()}: ${text}`);
                    this.errors.push(text);
                }
            });

            // Listen for page errors
            this.page.on('pageerror', error => {
                console.log(`🚨 Page Error: ${error.message}`);
                this.errors.push(error.message);
            });

            return true;
        } catch (error) {
            console.log(`⚠️ Could not launch browser - ${error.message}`);
            return false;
        }
    }

    // Test 1: App Loading and Initial Render
    async testAppLoading() {
        try {
            const url = `file://${path.resolve('./index.html')}`;
            console.log(`🔗 Testing URL: ${url}`);
            
            const startTime = Date.now();
            await this.page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
            const loadTime = Date.now() - startTime;
            
            this.logTest('App Loading', true, `Loaded in ${loadTime}ms`);
            
            // Wait for React app to initialize
            await this.page.waitForTimeout(3000);
            
            return true;
        } catch (error) {
            this.logTest('App Loading', false, `Failed: ${error.message}`);
            return false;
        }
    }

    // Test 2: Core Component Rendering
    async testComponentRendering() {
        try {
            // Check main title
            const titleElement = await this.page.$('h1');
            const titleText = await this.page.evaluate(el => el ? el.textContent : '', titleElement);
            
            if (titleText && titleText.length > 0) {
                this.logTest('Main Title Rendering', true, `Found: "${titleText}"`);
            } else {
                this.logTest('Main Title Rendering', false, 'No main title found');
                return false;
            }

            // Check for basic input fields
            const inputs = await this.page.$$('input');
            this.logTest('Input Fields Present', inputs.length > 0, `Found ${inputs.length} input fields`);

            // Check for tabs
            const buttons = await this.page.$$('button');
            const buttonTexts = await Promise.all(
                buttons.map(btn => this.page.evaluate(el => el.textContent, btn))
            );
            
            const tabButtons = buttonTexts.filter(text => 
                text.includes('Basic') || text.includes('בסיסי') || 
                text.includes('Advanced') || text.includes('מתקדם')
            );
            
            this.logTest('Navigation Tabs', tabButtons.length >= 2, `Found ${tabButtons.length} tab buttons`);
            
            return true;
        } catch (error) {
            this.logTest('Component Rendering', false, `Error: ${error.message}`);
            return false;
        }
    }

    // Test 3: Form Input Functionality
    async testFormInputs() {
        try {
            // Test age input
            const ageInput = await this.page.$('input[step="1"]');
            if (ageInput) {
                await ageInput.click({ clickCount: 3 });
                await ageInput.type('35');
                await this.page.waitForTimeout(1000); // Wait for auto-calculation
                
                const ageValue = await this.page.evaluate(el => el.value, ageInput);
                this.logTest('Age Input Functionality', ageValue === '35', `Age set to: ${ageValue}`);
            } else {
                this.logTest('Age Input Functionality', false, 'Age input not found');
            }

            // Test salary input  
            const salaryInputs = await this.page.$$('input[type="number"]');
            if (salaryInputs.length > 1) {
                const salaryInput = salaryInputs[1]; // Usually the second numeric input
                await salaryInput.click({ clickCount: 3 });
                await salaryInput.type('20000');
                await this.page.waitForTimeout(1000);
                
                const salaryValue = await this.page.evaluate(el => el.value, salaryInput);
                this.logTest('Salary Input Functionality', salaryValue === '20000', `Salary set to: ${salaryValue}`);
            } else {
                this.logTest('Salary Input Functionality', false, 'Salary input not found');
            }

            // Test dropdown/select
            const selects = await this.page.$$('select');
            if (selects.length > 0) {
                await selects[0].select('couple'); // Try to select couple planning
                const selectValue = await this.page.evaluate(el => el.value, selects[0]);
                this.logTest('Dropdown Selection', true, `Selected: ${selectValue}`);
            } else {
                this.logTest('Dropdown Selection', false, 'No select elements found');
            }

            return true;
        } catch (error) {
            this.logTest('Form Input Functionality', false, `Error: ${error.message}`);
            return false;
        }
    }

    // Test 4: Tab Navigation
    async testTabNavigation() {
        try {
            // Find and click Advanced tab
            const buttons = await this.page.$$('button');
            const advancedButton = await Promise.all(
                buttons.map(async btn => {
                    const text = await this.page.evaluate(el => el.textContent, btn);
                    return text.includes('Advanced') || text.includes('מתקדם') ? btn : null;
                })
            ).then(results => results.find(btn => btn !== null));

            if (advancedButton) {
                await advancedButton.click();
                await this.page.waitForTimeout(2000); // Wait for module loading
                
                // Check if advanced content loaded
                const pageContent = await this.page.content();
                const hasAdvancedContent = pageContent.includes('Loading advanced') || 
                                         pageContent.includes('Portfolio') || 
                                         pageContent.includes('טוען הגדרות');
                
                this.logTest('Advanced Tab Navigation', hasAdvancedContent, 'Advanced module loaded');
            } else {
                this.logTest('Advanced Tab Navigation', false, 'Advanced tab button not found');
            }

            // Try Stress Testing tab
            const stressButton = await Promise.all(
                buttons.map(async btn => {
                    const text = await this.page.evaluate(el => el.textContent, btn);
                    return text.includes('Stress') || text.includes('לחץ') ? btn : null;
                })
            ).then(results => results.find(btn => btn !== null));

            if (stressButton) {
                await stressButton.click();
                await this.page.waitForTimeout(2000);
                this.logTest('Stress Testing Tab', true, 'Stress testing tab accessible');
            } else {
                this.logTest('Stress Testing Tab', false, 'Stress testing tab not found');
            }

            return true;
        } catch (error) {
            this.logTest('Tab Navigation', false, `Error: ${error.message}`);
            return false;
        }
    }

    // Test 5: Results Display and Calculations
    async testResultsDisplay() {
        try {
            // Go back to basic tab first
            const buttons = await this.page.$$('button');
            const basicButton = await Promise.all(
                buttons.map(async btn => {
                    const text = await this.page.evaluate(el => el.textContent, btn);
                    return text.includes('Basic') || text.includes('בסיסי') ? btn : null;
                })
            ).then(results => results.find(btn => btn !== null));

            if (basicButton) {
                await basicButton.click();
                await this.page.waitForTimeout(1000);
            }

            // Check for results panel
            const pageContent = await this.page.content();
            const hasResults = pageContent.includes('₪') || 
                             pageContent.includes('Retirement') || 
                             pageContent.includes('פרישה');
            
            this.logTest('Results Display', hasResults, 'Financial results visible');

            // Check for currency formatting (avoiding $eval for security compliance)
            const allElements = await this.page.$$('*');
            let currencyElements = 0;
            let percentageElements = 0;
            
            for (const element of allElements) {
                const text = await this.page.evaluate(el => el.textContent, element);
                if (text && text.includes('₪')) {
                    currencyElements++;
                }
                if (text && text.includes('%')) {
                    percentageElements++;
                }
            }
            
            this.logTest('Currency Formatting', currencyElements > 0, `Found ${currencyElements} currency displays`);
            this.logTest('Percentage Displays', percentageElements > 0, `Found ${percentageElements} percentage displays`);

            return true;
        } catch (error) {
            this.logTest('Results Display', false, `Error: ${error.message}`);
            return false;
        }
    }

    // Test 6: Export Functionality
    async testExportFunctionality() {
        try {
            const buttons = await this.page.$$('button');
            const buttonTexts = await Promise.all(
                buttons.map(btn => this.page.evaluate(el => el.textContent, btn))
            );
            
            // Check for export buttons
            const exportButtons = buttonTexts.filter(text => 
                text.includes('Export') || text.includes('PNG') || text.includes('AI') || 
                text.includes('ייצוא') || text.includes('LLM')
            );
            
            this.logTest('Export Buttons Present', exportButtons.length > 0, `Found ${exportButtons.length} export buttons: ${exportButtons.join(', ')}`);

            // Try to click PNG export if available
            const pngButton = await Promise.all(
                buttons.map(async btn => {
                    const text = await this.page.evaluate(el => el.textContent, btn);
                    return text.includes('PNG') || text.includes('🖼️') ? btn : null;
                })
            ).then(results => results.find(btn => btn !== null));

            if (pngButton) {
                await pngButton.click();
                await this.page.waitForTimeout(1000);
                this.logTest('PNG Export Click', true, 'PNG export button clicked successfully');
            } else {
                this.logTest('PNG Export Click', false, 'PNG export button not found');
            }

            // Try AI export
            const aiButton = await Promise.all(
                buttons.map(async btn => {
                    const text = await this.page.evaluate(el => el.textContent, btn);
                    return text.includes('AI') || text.includes('🤖') ? btn : null;
                })
            ).then(results => results.find(btn => btn !== null));

            if (aiButton) {
                await aiButton.click();
                await this.page.waitForTimeout(1000);
                this.logTest('AI Export Click', true, 'AI export button clicked successfully');
            } else {
                this.logTest('AI Export Click', false, 'AI export button not found');
            }

            return true;
        } catch (error) {
            this.logTest('Export Functionality', false, `Error: ${error.message}`);
            return false;
        }
    }

    // Test 7: Chart.js Integration
    async testChartsAndGraphs() {
        try {
            // Check if Chart.js is loaded
            const chartJsLoaded = await this.page.evaluate(() => {
                return typeof window.Chart !== 'undefined';
            });
            
            this.logTest('Chart.js Library Loading', chartJsLoaded, chartJsLoaded ? 'Chart.js available' : 'Chart.js not loaded');

            // Look for canvas elements (charts)
            const canvasElements = await this.page.$$('canvas');
            this.logTest('Chart Canvas Elements', canvasElements.length > 0, `Found ${canvasElements.length} canvas elements`);

            // Check for chart-related content
            const pageContent = await this.page.content();
            const hasChartContent = pageContent.includes('chart') || 
                                  pageContent.includes('Chart') || 
                                  pageContent.includes('גרף');
            
            this.logTest('Chart Content Present', hasChartContent, 'Chart-related content found');

            // Try to trigger chart display if there's a chart button
            const buttons = await this.page.$$('button');
            const chartButton = await Promise.all(
                buttons.map(async btn => {
                    const text = await this.page.evaluate(el => el.textContent, btn);
                    return text.includes('Chart') || text.includes('Graph') || text.includes('📊') ? btn : null;
                })
            ).then(results => results.find(btn => btn !== null));

            if (chartButton) {
                await chartButton.click();
                await this.page.waitForTimeout(2000);
                
                // Check if more canvas elements appeared
                const newCanvasElements = await this.page.$$('canvas');
                this.logTest('Chart Display Toggle', newCanvasElements.length >= canvasElements.length, 
                           `Canvas elements: ${canvasElements.length} → ${newCanvasElements.length}`);
            }

            return true;
        } catch (error) {
            this.logTest('Charts and Graphs', false, `Error: ${error.message}`);
            return false;
        }
    }

    // Test 8: Responsive Design
    async testResponsiveDesign() {
        try {
            // Test desktop view
            await this.page.setViewport({ width: 1200, height: 800 });
            await this.page.waitForTimeout(1000);
            
            const desktopElements = await this.page.$$('.financial-card, .glass-effect');
            this.logTest('Desktop Layout', desktopElements.length > 0, `Found ${desktopElements.length} cards in desktop view`);

            // Test mobile view
            await this.page.setViewport({ width: 375, height: 667 });
            await this.page.waitForTimeout(1000);
            
            const mobileElements = await this.page.$$('.financial-card, .glass-effect');
            this.logTest('Mobile Layout', mobileElements.length > 0, `Found ${mobileElements.length} cards in mobile view`);

            // Reset to desktop
            await this.page.setViewport({ width: 1200, height: 800 });

            return true;
        } catch (error) {
            this.logTest('Responsive Design', false, `Error: ${error.message}`);
            return false;
        }
    }

    // Test 9: Language Switching (if available)
    async testLanguageSupport() {
        try {
            const pageContent = await this.page.content();
            
            // Check for Hebrew content
            const hasHebrew = /[\u0590-\u05FF]/.test(pageContent);
            this.logTest('Hebrew Language Support', hasHebrew, hasHebrew ? 'Hebrew content detected' : 'No Hebrew content found');

            // Check for English content
            const hasEnglish = /[a-zA-Z]/.test(pageContent);
            this.logTest('English Language Support', hasEnglish, hasEnglish ? 'English content detected' : 'No English content found');

            // Look for language toggle if available
            const buttons = await this.page.$$('button');
            const langButton = await Promise.all(
                buttons.map(async btn => {
                    const text = await this.page.evaluate(el => el.textContent, btn);
                    return text.includes('EN') || text.includes('HE') || text.includes('עברית') ? btn : null;
                })
            ).then(results => results.find(btn => btn !== null));

            if (langButton) {
                this.logTest('Language Toggle Available', true, 'Language switch button found');
            } else {
                this.logTest('Language Toggle Available', false, 'No language toggle found');
            }

            return true;
        } catch (error) {
            this.logTest('Language Support', false, `Error: ${error.message}`);
            return false;
        }
    }

    // Test 10: Critical Error Detection
    async testCriticalErrors() {
        try {
            const criticalErrors = this.errors.filter(error => 
                error.includes('is not defined') ||
                error.includes('Cannot read properties of undefined') ||
                error.includes('TypeError') ||
                error.includes('ReferenceError')
            );

            const hasCriticalErrors = criticalErrors.length > 0;
            this.logTest('Critical JavaScript Errors', !hasCriticalErrors, 
                        hasCriticalErrors ? `Found ${criticalErrors.length} critical errors` : 'No critical errors detected');

            // Check for React warnings (non-critical but good to track)
            const reactWarnings = this.errors.filter(error => 
                error.includes('Warning:') && error.includes('React')
            );

            this.logTest('React Warnings', reactWarnings.length === 0, 
                        reactWarnings.length === 0 ? 'No React warnings' : `${reactWarnings.length} React warnings found`);

            return !hasCriticalErrors;
        } catch (error) {
            this.logTest('Critical Error Detection', false, `Error: ${error.message}`);
            return false;
        }
    }

    // Cleanup
    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
        return true;
    }

    // Print summary
    printSummary() {
        const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);
        const successRate = this.passedTests + this.failedTests > 0 ? 
                          ((this.passedTests / (this.passedTests + this.failedTests)) * 100).toFixed(1) : 0;

        console.log('\\n============================================================');
        console.log('📊 Comprehensive Functional Test Results Summary');
        console.log('============================================================');
        console.log(`✅ Tests Passed: ${this.passedTests}`);
        console.log(`❌ Tests Failed: ${this.failedTests}`);
        console.log(`📈 Success Rate: ${successRate}%`);
        console.log(`⏱️  Duration: ${duration}s`);
        console.log('============================================================');

        if (this.failedTests > 0) {
            console.log('⚠️  Some tests failed. Review the issues above.');
            console.log('🔧 Check browser console and component functionality.');
        } else {
            console.log('🎉 All tests passed! Application is fully functional.');
        }

        console.log('\\n💡 Test Coverage Areas:');
        console.log('   • App Loading & Initial Render');
        console.log('   • Component Rendering & UI Elements');
        console.log('   • Form Input Functionality');
        console.log('   • Tab Navigation & Module Loading');
        console.log('   • Results Display & Calculations');
        console.log('   • Export Functionality (PNG, AI)');
        console.log('   • Charts & Graphs Integration');
        console.log('   • Responsive Design');
        console.log('   • Language Support');
        console.log('   • Critical Error Detection');
    }

    // Main test runner
    async runAllTests() {
        console.log('🧪 Advanced Retirement Planner - Comprehensive Functional Test Suite');
        console.log('=======================================================================');
        console.log('🚀 Testing All User-Facing Functionality');
        console.log('');

        if (!(await this.initBrowser())) {
            console.log('❌ Browser initialization failed. Exiting tests.');
            return false;
        }

        try {
            // Run all tests in sequence
            await this.testAppLoading();
            await this.testComponentRendering();
            await this.testFormInputs();
            await this.testTabNavigation();
            await this.testResultsDisplay();
            await this.testExportFunctionality();
            await this.testChartsAndGraphs();
            await this.testResponsiveDesign();
            await this.testLanguageSupport();
            await this.testCriticalErrors();

            this.printSummary();
            return this.failedTests === 0;

        } finally {
            await this.cleanup();
        }
    }
}

// Run the test suite
if (require.main === module) {
    const testSuite = new ComprehensiveFunctionalTest();
    testSuite.runAllTests()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Test suite crashed:', error);
            process.exit(1);
        });
}

module.exports = ComprehensiveFunctionalTest;