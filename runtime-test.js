// Runtime Testing Suite - Browser-based testing for JavaScript errors
// Tests the actual application running in browser environment

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class RuntimeTestSuite {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
        this.startTime = Date.now();
        this.browser = null;
        this.page = null;
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
            
            // Listen for console errors
            this.page.on('console', msg => {
                if (msg.type() === 'error') {
                    console.log('🚨 Browser Console Error:', msg.text());
                }
            });
            
            // Listen for page errors
            this.page.on('pageerror', error => {
                console.log('🚨 Page Error:', error.message);
            });
            
            return true;
        } catch (error) {
            console.log('⚠️ Could not launch browser - skipping runtime tests');
            console.log('   Install puppeteer: npm install puppeteer');
            return false;
        }
    }

    // Test basic page load
    async testPageLoad() {
        try {
            const startTime = Date.now();
            await this.page.goto('file://' + path.resolve('./index.html'), {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            const loadTime = Date.now() - startTime;
            
            this.logTest('Page Load', true, `Loaded in ${loadTime}ms`);
            return true;
        } catch (error) {
            this.logTest('Page Load', false, `Failed: ${error.message}`);
            return false;
        }
    }

    // Test for JavaScript errors
    async testJavaScriptErrors() {
        try {
            const errors = [];
            
            this.page.on('pageerror', error => {
                errors.push(error.message);
            });
            
            // Wait for app to initialize
            await this.page.waitForTimeout(3000);
            
            // Check for React app initialization
            const reactLoaded = await this.page.evaluate(() => {
                return typeof window.React !== 'undefined' && typeof window.ReactDOM !== 'undefined';
            });
            
            if (!reactLoaded) {
                this.logTest('React Dependencies', false, 'React or ReactDOM not loaded');
                return false;
            }
            
            // Check for core app initialization
            const appLoaded = await this.page.evaluate(() => {
                return typeof window.initializeRetirementPlannerCore !== 'undefined';
            });
            
            if (!appLoaded) {
                this.logTest('Core App Initialization', false, 'Core app function not found');
                return false;
            }
            
            if (errors.length === 0) {
                this.logTest('JavaScript Errors', true, 'No runtime errors detected');
                return true;
            } else {
                this.logTest('JavaScript Errors', false, `${errors.length} errors: ${errors.join(', ')}`);
                return false;
            }
        } catch (error) {
            this.logTest('JavaScript Errors', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test component rendering
    async testComponentRendering() {
        try {
            // Wait for components to render
            await this.page.waitForTimeout(2000);
            
            // Check if main title is rendered
            const titleElement = await this.page.$('h1');
            const titleText = await this.page.evaluate(el => el ? el.textContent : '', titleElement);
            const titleExists = titleText.includes('Advanced Retirement Planner') || titleText.includes('מתכנן הפרישה');
            
            if (!titleExists) {
                this.logTest('Main Title Rendering', false, 'Main title not found');
                return false;
            }
            
            // Check if tabs are rendered
            const buttonElements = await this.page.$$('button');
            const buttonTexts = await Promise.all(
                buttonElements.map(btn => this.page.evaluate(el => el.textContent, btn))
            );
            const tabsExist = buttonTexts.some(text => text.includes('Basic') || text.includes('בסיסי'));
            
            if (!tabsExist) {
                this.logTest('Tab Navigation Rendering', false, 'Navigation tabs not found');
                return false;
            }
            
            // Check if savings summary panel exists
            const summaryPanelExists = await this.page.$('.financial-card');
            
            if (!summaryPanelExists) {
                this.logTest('Savings Summary Panel', false, 'Financial card not found');
                return false;
            }
            
            this.logTest('Component Rendering', true, 'All main components rendered successfully');
            return true;
        } catch (error) {
            this.logTest('Component Rendering', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test form interactions
    async testFormInteractions() {
        try {
            // Try to fill in form inputs
            const ageInput = await this.page.$('input[type="number"]');
            if (ageInput) {
                await ageInput.click({ clickCount: 3 }); // Select all
                await ageInput.type('35');
                
                // Wait for auto-calculation
                await this.page.waitForTimeout(1000);
                
                this.logTest('Form Input Interaction', true, 'Successfully entered age value');
            } else {
                this.logTest('Form Input Interaction', false, 'No numeric input found');
                return false;
            }
            
            return true;
        } catch (error) {
            this.logTest('Form Input Interaction', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test export functionality
    async testExportFunctionality() {
        try {
            // Look for export buttons
            const exportButtonElements = await this.page.$$('button');
            const exportButtonTexts = await Promise.all(
                exportButtonElements.map(btn => this.page.evaluate(el => el.textContent, btn))
            );
            const exportButtons = exportButtonTexts.filter(text => 
                text.includes('Export') || 
                text.includes('ייצא') ||
                text.includes('PNG') ||
                text.includes('AI')
            ).length;
            
            if (exportButtons === 0) {
                this.logTest('Export Buttons', false, 'No export buttons found');
                return false;
            }
            
            this.logTest('Export Buttons', true, `Found ${exportButtons} export buttons`);
            return true;
        } catch (error) {
            this.logTest('Export Functionality', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test chart rendering
    async testChartRendering() {
        try {
            // Check if Chart.js is loaded
            const chartJsLoaded = await this.page.evaluate(() => {
                return typeof window.Chart !== 'undefined';
            });
            
            if (!chartJsLoaded) {
                this.logTest('Chart.js Loading', false, 'Chart.js not loaded');
                return false;
            }
            
            this.logTest('Chart.js Loading', true, 'Chart.js loaded successfully');
            return true;
        } catch (error) {
            this.logTest('Chart Rendering', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test stress testing module
    async testStressTestingModule() {
        try {
            // Try to click on stress testing tab
            const stressButtonElements = await this.page.$$('button');
            const stressButtonTexts = await Promise.all(
                stressButtonElements.map(btn => this.page.evaluate(el => el.textContent, btn))
            );
            const stressTabExists = stressButtonTexts.some(text => text.includes('Stress') || text.includes('לחץ'));
            
            if (!stressTabExists) {
                this.logTest('Stress Testing Tab', false, 'Stress testing tab not found');
                return false;
            }
            
            this.logTest('Stress Testing Tab', true, 'Stress testing tab available');
            return true;
        } catch (error) {
            this.logTest('Stress Testing Module', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test responsive design
    async testResponsiveDesign() {
        try {
            // Test mobile viewport
            await this.page.setViewport({ width: 375, height: 667 });
            await this.page.waitForTimeout(1000);
            
            // Check if elements are still visible
            const h1Element = await this.page.$('h1');
            const elementsVisible = await this.page.evaluate(el => {
                if (!el) return false;
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
            }, h1Element);
            
            if (!elementsVisible) {
                this.logTest('Mobile Responsive Design', false, 'Elements not visible on mobile');
                return false;
            }
            
            // Reset to desktop
            await this.page.setViewport({ width: 1920, height: 1080 });
            
            this.logTest('Mobile Responsive Design', true, 'Elements visible on mobile viewport');
            return true;
        } catch (error) {
            this.logTest('Responsive Design', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Run all runtime tests
    async runAllTests() {
        console.log('🧪 Advanced Retirement Planner - Runtime Test Suite');
        console.log('='.repeat(60));
        console.log('🚀 Testing Application Runtime in Browser Environment\n');
        
        const browserAvailable = await this.initBrowser();
        
        if (!browserAvailable) {
            console.log('⚠️ Browser testing not available. Install puppeteer for full runtime testing.');
            console.log('   npm install puppeteer');
            return { passed: 0, failed: 1, total: 1, successRate: 0 };
        }
        
        try {
            // Sequential testing to avoid conflicts
            const pageLoaded = await this.testPageLoad();
            if (!pageLoaded) return this.cleanup();
            
            await this.testJavaScriptErrors();
            await this.testComponentRendering();
            await this.testFormInteractions();
            await this.testExportFunctionality();
            await this.testChartRendering();
            await this.testStressTestingModule();
            await this.testResponsiveDesign();
            
        } catch (error) {
            console.error('🚨 Runtime testing failed:', error);
            this.logTest('Runtime Testing Suite', false, error.message);
        }
        
        return this.cleanup();
    }

    // Clean up and return results
    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
        
        return this.printSummary();
    }

    // Print test summary
    printSummary() {
        const totalTests = this.passedTests + this.failedTests;
        const successRate = totalTests > 0 ? ((this.passedTests / totalTests) * 100).toFixed(1) : 0;
        const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 Runtime Test Results Summary');
        console.log('='.repeat(60));
        console.log(`✅ Tests Passed: ${this.passedTests}`);
        console.log(`❌ Tests Failed: ${this.failedTests}`);
        console.log(`📈 Success Rate: ${successRate}%`);
        console.log(`⏱️  Duration: ${duration}s`);
        console.log('='.repeat(60));
        
        if (this.failedTests === 0) {
            console.log('🎉 All runtime tests passed! Application is working correctly.');
            console.log('✨ No JavaScript errors detected in browser environment.');
        } else {
            console.log('⚠️ Some runtime tests failed. Please fix the issues above.');
            console.log('🔧 Check browser console for detailed error messages.');
        }
        
        return {
            passed: this.passedTests,
            failed: this.failedTests,
            total: totalTests,
            successRate: parseFloat(successRate),
            duration: parseFloat(duration)
        };
    }
}

// Run the test suite if called directly
if (require.main === module) {
    const testSuite = new RuntimeTestSuite();
    testSuite.runAllTests().then((results) => {
        process.exit(results.failed > 0 ? 1 : 0);
    });
}

module.exports = RuntimeTestSuite;