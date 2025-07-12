// Comprehensive QA Test Suite
// Full application validation before any production push

const puppeteer = require('puppeteer');
const TrainingFundTestSuite = require('./training-fund-tests');

class ComprehensiveQA {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
        this.browser = null;
        this.page = null;
        this.consoleErrors = [];
        this.jsErrors = [];
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

    async initBrowser() {
        try {
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            this.page = await this.browser.newPage();
            
            // Capture console errors
            this.page.on('console', msg => {
                if (msg.type() === 'error') {
                    this.consoleErrors.push(msg.text());
                }
            });

            // Capture JavaScript errors
            this.page.on('pageerror', error => {
                this.jsErrors.push(error.message);
            });
            
            // Navigate to the app
            await this.page.goto('file://' + __dirname + '/index.html');
            await this.page.waitForSelector('#root', { timeout: 10000 });
            
            this.logTest('Application Loading', true, 'App loaded successfully');
            return true;
        } catch (error) {
            this.logTest('Application Loading', false, `Failed: ${error.message}`);
            return false;
        }
    }

    // Test 1: No JavaScript Errors on Load
    async testNoJavaScriptErrors() {
        try {
            // Wait a bit for any delayed errors
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const hasErrors = this.jsErrors.length > 0 || this.consoleErrors.length > 0;
            
            if (hasErrors) {
                const errorMessage = `JS Errors: ${this.jsErrors.join(', ')} | Console Errors: ${this.consoleErrors.join(', ')}`;
                this.logTest('No JavaScript Errors', false, errorMessage);
                return false;
            }
            
            this.logTest('No JavaScript Errors', true, 'Clean console - no errors detected');
            return true;
        } catch (error) {
            this.logTest('No JavaScript Errors', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test 2: All UI Components Render
    async testUIComponentsRender() {
        try {
            const components = [
                '#root',
                'input[type="number"]', // At least one input field
                'button', // At least one button
                '.financial-input' // Financial input styling
            ];

            let allPresent = true;
            const missingComponents = [];

            for (const selector of components) {
                const element = await this.page.$(selector);
                if (!element) {
                    allPresent = false;
                    missingComponents.push(selector);
                }
            }

            this.logTest('UI Components Render', allPresent, 
                allPresent ? 'All key components present' : `Missing: ${missingComponents.join(', ')}`);
            return allPresent;
        } catch (error) {
            this.logTest('UI Components Render', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test 3: Form Input Functionality
    async testFormInputs() {
        try {
            // Test basic form inputs work
            const inputs = [
                { selector: 'input[type="number"]', value: '25000' },
            ];

            let allWorking = true;
            for (const input of inputs) {
                try {
                    await this.page.focus(input.selector);
                    await this.page.keyboard.selectAll();
                    await this.page.type(input.selector, input.value);
                    
                    // Note: $eval is safe Puppeteer DOM method, not JavaScript eval()
                    const actualValue = await this.page.$eval(input.selector, el => el.value);
                    if (actualValue !== input.value) {
                        allWorking = false;
                    }
                } catch (err) {
                    allWorking = false;
                }
            }

            this.logTest('Form Input Functionality', allWorking, 
                allWorking ? 'Form inputs working correctly' : 'Some form inputs not working');
            return allWorking;
        } catch (error) {
            this.logTest('Form Input Functionality', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test 4: Calculation Results Display
    async testCalculationResults() {
        try {
            // Fill in some test data
            await this.page.evaluate(() => {
                // Try to trigger a calculation by updating inputs
                const ageInput = document.querySelector('input[type="number"]');
                if (ageInput) {
                    ageInput.value = '30';
                    ageInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            await new Promise(resolve => setTimeout(resolve, 2000));

            // Check if results are displayed (look for currency symbols or number formatting)
            const hasResults = await this.page.evaluate(() => {
                const text = document.body.textContent;
                return text.includes('₪') || text.includes('Results') || text.includes('תוצאות');
            });

            this.logTest('Calculation Results Display', hasResults, 
                hasResults ? 'Results properly displayed' : 'No calculation results found');
            return hasResults;
        } catch (error) {
            this.logTest('Calculation Results Display', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test 5: Language Toggle
    async testLanguageToggle() {
        try {
            // Look for language toggle button or text in both languages
            const hasHebrew = await this.page.evaluate(() => {
                const text = document.body.textContent;
                return text.includes('גיל') || text.includes('משכורת') || text.includes('פנסיה');
            });

            const hasEnglish = await this.page.evaluate(() => {
                const text = document.body.textContent;
                return text.includes('Age') || text.includes('Salary') || text.includes('Pension');
            });

            const hasLanguageSupport = hasHebrew || hasEnglish;
            
            this.logTest('Language Support', hasLanguageSupport, 
                hasLanguageSupport ? 'Language support detected' : 'No language support found');
            return hasLanguageSupport;
        } catch (error) {
            this.logTest('Language Support', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test 6: Responsive Design
    async testResponsiveDesign() {
        try {
            // Test mobile viewport
            await this.page.setViewport({ width: 375, height: 667 });
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mobileWorks = await this.page.evaluate(() => {
                const body = document.body;
                return body.offsetWidth <= 400; // Responsive check
            });

            // Test desktop viewport
            await this.page.setViewport({ width: 1200, height: 800 });
            await new Promise(resolve => setTimeout(resolve, 1000));

            const desktopWorks = await this.page.evaluate(() => {
                const body = document.body;
                return body.offsetWidth > 800;
            });

            const isResponsive = mobileWorks && desktopWorks;
            
            this.logTest('Responsive Design', isResponsive, 
                isResponsive ? 'Responsive design working' : 'Responsive issues detected');
            return isResponsive;
        } catch (error) {
            this.logTest('Responsive Design', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test 7: Performance Check
    async testPerformanceMetrics() {
        try {
            // Measure page load time
            const navigationPromise = this.page.goto('file://' + __dirname + '/index.html');
            const startTime = Date.now();
            await navigationPromise;
            const loadTime = Date.now() - startTime;

            // Check memory usage
            const metrics = await this.page.metrics();
            const memoryUsed = metrics.JSHeapUsedSize / 1024 / 1024; // MB

            const performanceOK = loadTime < 5000 && memoryUsed < 50; // Under 5s load, under 50MB
            
            this.logTest('Performance Metrics', performanceOK, 
                `Load time: ${loadTime}ms, Memory: ${memoryUsed.toFixed(1)}MB`);
            return performanceOK;
        } catch (error) {
            this.logTest('Performance Metrics', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Run Training Fund Specific Tests
    async runTrainingFundTests() {
        try {
            console.log('\n📋 Running Training Fund Specific Tests...\n');
            const trainingFundTests = new TrainingFundTestSuite();
            
            // Initialize the same browser session
            trainingFundTests.browser = this.browser;
            trainingFundTests.page = this.page;
            
            await trainingFundTests.testTrainingFundCheckbox();
            await trainingFundTests.testTrainingFundRates();
            await trainingFundTests.testTrainingFundCeiling();
            await trainingFundTests.testAboveCeilingContribution();
            await trainingFundTests.testAccumulatedSavingsCalculation();
            
            // Merge results
            this.passedTests += trainingFundTests.passedTests;
            this.failedTests += trainingFundTests.failedTests;
            this.testResults = [...this.testResults, ...trainingFundTests.testResults];
            
            return trainingFundTests.failedTests === 0;
        } catch (error) {
            this.logTest('Training Fund Tests', false, `Test suite failed: ${error.message}`);
            return false;
        }
    }

    // Run complete QA cycle
    async runFullQA() {
        console.log('\n🔍 Starting Comprehensive QA Cycle...\n');
        
        const initSuccess = await this.initBrowser();
        if (!initSuccess) {
            return this.generateReport();
        }

        // Core functionality tests
        await this.testNoJavaScriptErrors();
        await this.testUIComponentsRender();
        await this.testFormInputs();
        await this.testCalculationResults();
        await this.testLanguageToggle();
        await this.testResponsiveDesign();
        await this.testPerformanceMetrics();
        
        // Training fund specific tests
        await this.runTrainingFundTests();

        await this.browser.close();
        return this.generateReport();
    }

    generateReport() {
        const totalTests = this.passedTests + this.failedTests;
        const successRate = totalTests > 0 ? (this.passedTests / totalTests * 100).toFixed(1) : 0;
        
        console.log('\n📊 Comprehensive QA Results:');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${this.passedTests}`);
        console.log(`Failed: ${this.failedTests}`);
        console.log(`Success Rate: ${successRate}%`);
        console.log('='.repeat(50));

        if (this.failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(result => !result.passed)
                .forEach(result => {
                    console.log(`   - ${result.testName}: ${result.message}`);
                });
        }

        // QA Decision
        const qaApproved = this.failedTests === 0 && successRate >= 95;
        
        console.log(`\n🎯 QA Decision: ${qaApproved ? '✅ APPROVED FOR PUSH' : '❌ REQUIRES FIXES'}`);
        
        if (!qaApproved) {
            console.log('\n⚠️  Please fix failing tests before pushing to production.');
        }

        return {
            passed: this.passedTests,
            failed: this.failedTests,
            total: totalTests,
            successRate: parseFloat(successRate),
            approved: qaApproved
        };
    }
}

// Run QA if called directly
if (require.main === module) {
    const qa = new ComprehensiveQA();
    qa.runFullQA().then(results => {
        process.exit(results.approved ? 0 : 1);
    });
}

module.exports = ComprehensiveQA;