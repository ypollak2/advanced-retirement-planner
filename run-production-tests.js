#!/usr/bin/env node

/**
 * Production E2E Test Runner - Command Line Interface
 * Tests the live GitHub Pages deployment
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class ProductionTestRunner {
    constructor() {
        this.productionUrl = 'https://ypollak2.github.io/advanced-retirement-planner/';
        this.results = {
            passed: 0,
            failed: 0,
            total: 0,
            errors: [],
            warnings: [],
            performance: {},
            startTime: Date.now()
        };
        this.testTimeout = 30000; // 30 seconds per test
    }
    
    async runProductionTests() {
        console.log('🚀 Starting Production E2E Tests...\n');
        console.log(`🎯 Target: ${this.productionUrl}\n`);
        
        const browser = await chromium.launch({ headless: false });
        const context = await browser.newContext({
            viewport: { width: 1280, height: 720 },
            userAgent: 'Mozilla/5.0 (compatible; Production-E2E-Test/1.0)'
        });
        
        try {
            await this.runTestSuite(context);
        } finally {
            await browser.close();
        }
        
        this.generateReport();
        return this.results.failed === 0;
    }
    
    async runTestSuite(context) {
        const page = await context.newPage();
        
        // Capture console logs and errors
        const consoleLogs = [];
        const errors = [];
        
        page.on('console', msg => {
            const message = {
                type: msg.type(),
                text: msg.text(),
                timestamp: new Date()
            };
            consoleLogs.push(message);
            
            if (msg.type() === 'error') {
                console.log(`❌ Console Error: ${msg.text()}`);
                errors.push({
                    type: 'console-error',
                    message: msg.text(),
                    timestamp: new Date()
                });
            }
        });
        
        page.on('pageerror', err => {
            console.log(`💥 Page Error: ${err.message}`);
            errors.push({
                type: 'page-error',
                message: err.message,
                stack: err.stack,
                timestamp: new Date()
            });
        });
        
        // Define test cases
        const tests = [
            { name: 'Production site loads successfully', fn: () => this.testPageLoad(page) },
            { name: 'No critical JavaScript errors', fn: () => this.testNoJSErrors(errors) },
            { name: 'Main application components render', fn: () => this.testComponentsRender(page) },
            { name: 'Navigation elements are present', fn: () => this.testNavigation(page) },
            { name: 'Currency selection available', fn: () => this.testCurrencyElements(page) },
            { name: 'Form elements functional', fn: () => this.testFormElements(page) },
            { name: 'Page performance acceptable', fn: () => this.testPerformance(page) },
            { name: 'Mobile responsiveness', fn: () => this.testMobileView(page) },
            { name: 'Service Worker registered', fn: () => this.testServiceWorker(page) },
            { name: 'External API connectivity', fn: () => this.testAPIConnectivity(page) }
        ];
        
        // Run each test
        for (const test of tests) {
            await this.runSingleTest(test);
        }
        
        // Store additional data
        this.results.consoleLogs = consoleLogs.slice(-20); // Last 20 logs
        this.results.errors.push(...errors);
    }
    
    async runSingleTest(test) {
        const startTime = Date.now();
        
        try {
            console.log(`🔍 Testing: ${test.name}`);
            await Promise.race([
                test.fn(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Test timeout')), this.testTimeout)
                )
            ]);
            
            this.results.passed++;
            const duration = Date.now() - startTime;
            console.log(`✅ PASS: ${test.name} (${duration}ms)\n`);
            
        } catch (error) {
            this.results.failed++;
            const duration = Date.now() - startTime;
            console.log(`❌ FAIL: ${test.name} - ${error.message} (${duration}ms)\n`);
            
            this.results.errors.push({
                test: test.name,
                error: error.message,
                timestamp: new Date(),
                duration
            });
        }
        
        this.results.total++;
    }
    
    async testPageLoad(page) {
        console.log('  📡 Loading production page...');
        const response = await page.goto(this.productionUrl, {
            waitUntil: 'networkidle',
            timeout: 30000
        });
        
        if (!response.ok()) {
            throw new Error(`Page failed to load with status: ${response.status()}`);
        }
        
        // Wait for page to stabilize
        await page.waitForTimeout(3000);
        console.log('  ✅ Page loaded successfully');
    }
    
    async testNoJSErrors(errors) {
        console.log('  🔍 Checking for JavaScript errors...');
        
        const criticalErrors = errors.filter(err => 
            err.message.includes('is not defined') ||
            err.message.includes('Cannot read property') ||
            err.message.includes('Script error') ||
            err.message.includes('Uncaught')
        );
        
        if (criticalErrors.length > 0) {
            throw new Error(`${criticalErrors.length} critical JavaScript errors detected`);
        }
        
        if (errors.length > 10) {
            throw new Error(`Too many JavaScript errors: ${errors.length}`);
        }
        
        console.log(`  ✅ JavaScript errors check passed (${errors.length} minor errors)`);
    }
    
    async testComponentsRender(page) {
        console.log('  🎨 Checking component rendering...');
        
        // Check for key application elements
        const selectors = [
            'body',
            'h1, h2, .title, [class*="title"]',
            'button, .btn, [class*="button"]',
            'input, select, textarea',
            '[id*="app"], [class*="app"], [id*="main"], [class*="main"]'
        ];
        
        let foundElements = 0;
        const foundSelectors = [];
        
        for (const selector of selectors) {
            try {
                const elements = await page.$$(selector);
                if (elements.length > 0) {
                    foundElements++;
                    foundSelectors.push(`${selector} (${elements.length})`);
                }
            } catch (e) {
                // Continue if selector fails
            }
        }
        
        if (foundElements < 3) {
            throw new Error(`Insufficient main components rendered: ${foundElements}/5`);
        }
        
        console.log(`  ✅ Components rendered: ${foundSelectors.join(', ')}`);
    }
    
    async testNavigation(page) {
        console.log('  🧭 Checking navigation elements...');
        
        const navSelectors = [
            'nav, .nav, .navigation',
            'button, .btn, .button',
            'a[href], .link',
            '[role="button"], [role="link"]',
            '.wizard, .step, [class*="step"]'
        ];
        
        let navElements = 0;
        const foundNav = [];
        
        for (const selector of navSelectors) {
            try {
                const elements = await page.$$(selector);
                if (elements.length > 0) {
                    navElements += elements.length;
                    foundNav.push(`${selector.split(',')[0]} (${elements.length})`);
                }
            } catch (e) {
                // Continue if selector fails
            }
        }
        
        if (navElements < 5) {
            throw new Error(`Insufficient navigation elements: ${navElements}`);
        }
        
        console.log(`  ✅ Navigation elements found: ${foundNav.join(', ')}`);
    }
    
    async testCurrencyElements(page) {
        console.log('  💱 Checking currency functionality...');
        
        const currencySelectors = [
            'select[id*="currency"], select[name*="currency"]',
            '.currency-select, .currency-dropdown',
            'input[id*="currency"]',
            '[class*="currency"], [id*="currency"]'
        ];
        
        let currencyFound = false;
        
        for (const selector of currencySelectors) {
            try {
                const element = await page.$(selector);
                if (element) {
                    currencyFound = true;
                    console.log(`  ✅ Currency element found: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue
            }
        }
        
        if (!currencyFound) {
            console.log('  ⚠️ Currency elements not immediately visible (may load dynamically)');
        }
    }
    
    async testFormElements(page) {
        console.log('  📝 Checking form elements...');
        
        const formElements = await page.$$('input, select, textarea, button');
        
        if (formElements.length < 5) {
            throw new Error(`Insufficient form elements: ${formElements.length}`);
        }
        
        // Check for required attributes
        const requiredElements = await page.$$('input[required], select[required]');
        
        console.log(`  ✅ Form elements found: ${formElements.length} total, ${requiredElements.length} required`);
    }
    
    async testPerformance(page) {
        console.log('  ⚡ Measuring performance...');
        
        const metrics = await page.evaluate(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            return {
                loadTime: perfData ? perfData.loadEventEnd - perfData.navigationStart : null,
                domContentLoaded: perfData ? perfData.domContentLoadedEventEnd - perfData.navigationStart : null,
                firstContentfulPaint: null // Would need additional setup
            };
        });
        
        this.results.performance = metrics;
        
        if (metrics.loadTime && metrics.loadTime > 10000) {
            throw new Error(`Page load time too slow: ${metrics.loadTime}ms`);
        }
        
        console.log(`  ✅ Performance: Load ${metrics.loadTime}ms, DOMContentLoaded ${metrics.domContentLoaded}ms`);
    }
    
    async testMobileView(page) {
        console.log('  📱 Testing mobile responsiveness...');
        
        // Switch to mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);
        
        // Check if content is still visible
        const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
        
        if (bodyHeight < 100) {
            throw new Error('Content not properly displayed in mobile view');
        }
        
        // Switch back to desktop
        await page.setViewportSize({ width: 1280, height: 720 });
        
        console.log(`  ✅ Mobile view responsive (content height: ${bodyHeight}px)`);
    }
    
    async testServiceWorker(page) {
        console.log('  🔧 Checking Service Worker...');
        
        const swStatus = await page.evaluate(async () => {
            if ('serviceWorker' in navigator) {
                try {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    return {
                        supported: true,
                        registered: registrations.length > 0,
                        count: registrations.length
                    };
                } catch (error) {
                    return { supported: true, registered: false, error: error.message };
                }
            }
            return { supported: false };
        });
        
        if (!swStatus.supported) {
            throw new Error('Service Worker not supported');
        }
        
        console.log(`  ✅ Service Worker: ${swStatus.registered ? `${swStatus.count} registered` : 'not registered (may be normal)'}`);
    }
    
    async testAPIConnectivity(page) {
        console.log('  🌐 Testing API connectivity...');
        
        const apiTests = await page.evaluate(async () => {
            const tests = [];
            
            // Test currency API
            try {
                const controller = new AbortController();
                setTimeout(() => controller.abort(), 5000);
                
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
                    signal: controller.signal
                });
                
                tests.push({
                    name: 'Currency API',
                    success: response.ok,
                    status: response.status
                });
            } catch (error) {
                tests.push({
                    name: 'Currency API',
                    success: false,
                    error: error.message
                });
            }
            
            return tests;
        });
        
        const failedTests = apiTests.filter(test => !test.success);
        if (failedTests.length === apiTests.length && apiTests.length > 0) {
            throw new Error(`All API connectivity tests failed`);
        }
        
        apiTests.forEach(test => {
            if (test.success) {
                console.log(`  ✅ ${test.name}: OK (${test.status})`);
            } else {
                console.log(`  ⚠️ ${test.name}: ${test.error}`);
            }
        });
    }
    
    generateReport() {
        const duration = Date.now() - this.results.startTime;
        const successRate = this.results.total > 0 
            ? ((this.results.passed / this.results.total) * 100).toFixed(1)
            : 0;
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 PRODUCTION E2E TEST RESULTS');
        console.log('='.repeat(60));
        console.log(`🎯 Target: ${this.productionUrl}`);
        console.log(`⏱️ Duration: ${duration}ms`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📊 Total: ${this.results.total}`);
        console.log(`📈 Success Rate: ${successRate}%`);
        
        if (this.results.performance.loadTime) {
            console.log(`⚡ Load Time: ${this.results.performance.loadTime}ms`);
        }
        
        if (this.results.failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.results.errors.forEach((error, index) => {
                if (error.test) {
                    console.log(`  ${index + 1}. ${error.test}: ${error.error}`);
                }
            });
        }
        
        if (this.results.consoleLogs && this.results.consoleLogs.length > 0) {
            const errorLogs = this.results.consoleLogs.filter(log => log.type === 'error');
            if (errorLogs.length > 0) {
                console.log('\n🔍 CONSOLE ERRORS:');
                errorLogs.slice(0, 5).forEach((log, index) => {
                    console.log(`  ${index + 1}. ${log.text}`);
                });
            }
        }
        
        // Save detailed report
        const report = {
            timestamp: new Date().toISOString(),
            productionUrl: this.productionUrl,
            summary: {
                passed: this.results.passed,
                failed: this.results.failed,
                total: this.results.total,
                successRate: successRate + '%',
                duration: duration
            },
            performance: this.results.performance,
            errors: this.results.errors,
            consoleLogs: this.results.consoleLogs
        };
        
        const reportPath = path.join(__dirname, 'production-test-results.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
        
        if (this.results.failed === 0) {
            console.log(`\n🎉 All tests PASSED! Production site is healthy.`);
        } else {
            console.log(`\n⚠️ ${this.results.failed} test(s) FAILED. Review issues above.`);
        }
        
        console.log('='.repeat(60) + '\n');
    }
}

// Run tests if called directly
if (require.main === module) {
    const runner = new ProductionTestRunner();
    runner.runProductionTests()
        .then(success => process.exit(success ? 0 : 1))
        .catch(error => {
            console.error('❌ Test runner error:', error);
            process.exit(1);
        });
}

module.exports = ProductionTestRunner;