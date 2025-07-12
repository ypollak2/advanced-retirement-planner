// Performance Tests for Advanced Retirement Planner
// Tests tab switching speed, module loading, and UI responsiveness

const puppeteer = require('puppeteer');

class PerformanceTestSuite {
    constructor() {
        this.testResults = [];
        this.browser = null;
        this.page = null;
    }

    logTest(testName, passed, message = '', duration = null) {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        const timestamp = new Date().toLocaleTimeString();
        const durationText = duration ? ` (${duration}ms)` : '';
        
        console.log(`[${timestamp}] ${status} ${testName}${durationText}`);
        if (message) console.log(`    ${message}`);
        
        this.testResults.push({
            testName,
            passed,
            message,
            duration,
            timestamp
        });
    }

    async initBrowser() {
        try {
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            this.page = await this.browser.newPage();
            
            // Navigate to the app
            await this.page.goto('file://' + __dirname + '/../index.html');
            await this.page.waitForSelector('#root', { timeout: 10000 });
            
            this.logTest('Browser Initialization', true, 'Performance test environment ready');
            return true;
        } catch (error) {
            this.logTest('Browser Initialization', false, `Failed: ${error.message}`);
            return false;
        }
    }

    // Test 1: Initial Page Load Performance
    async testInitialLoadPerformance() {
        try {
            const startTime = Date.now();
            
            // Navigate to fresh page
            await this.page.goto('file://' + __dirname + '/../index.html');
            await this.page.waitForSelector('#root');
            
            // Wait for app initialization
            await this.page.waitForFunction(() => {
                return document.querySelector('#root').children.length > 0;
            }, { timeout: 10000 });
            
            const loadTime = Date.now() - startTime;
            const passed = loadTime < 3000; // Should load within 3 seconds
            
            this.logTest('Initial Page Load', passed, 
                passed ? 'Fast initial load' : 'Slow initial load', loadTime);
            return passed;
        } catch (error) {
            this.logTest('Initial Page Load', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test 2: Tab Switching Performance
    async testTabSwitchingPerformance() {
        try {
            const tabTests = [
                { tabName: 'Advanced', selector: '.tab-modern:nth-child(2)', expectedContent: 'advanced' },
                { tabName: 'Basic', selector: '.tab-modern:nth-child(1)', expectedContent: 'basic' }
            ];

            let allPassed = true;
            const results = [];

            for (const tab of tabTests) {
                const startTime = Date.now();
                
                // Click on tab
                await this.page.click(tab.selector);
                
                // Wait for content to appear
                await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to start loading
                
                // Wait for tab content to be visible/loaded
                await this.page.waitForFunction((tabName) => {
                    const activeTab = document.querySelector('.tab-content.active');
                    return activeTab && activeTab.children.length > 0;
                }, { timeout: 5000 }, tab.tabName);
                
                const switchTime = Date.now() - startTime;
                const passed = switchTime < 1000; // Should switch within 1 second
                
                results.push({ tab: tab.tabName, time: switchTime, passed });
                
                if (!passed) allPassed = false;
                
                this.logTest(`Tab Switch - ${tab.tabName}`, passed, 
                    passed ? 'Fast tab switch' : 'Slow tab switch', switchTime);
            }

            return allPassed;
        } catch (error) {
            this.logTest('Tab Switching Performance', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test 3: Module Loading Performance
    async testModuleLoadingPerformance() {
        try {
            // Test advanced portfolio module loading
            const startTime = Date.now();
            
            // Click on advanced tab to trigger module loading
            await this.page.click('.tab-modern:nth-child(2)');
            
            // Wait for module to load (check for specific module content)
            await this.page.waitForFunction(() => {
                return window.AdvancedPortfolio !== undefined;
            }, { timeout: 5000 });
            
            const loadTime = Date.now() - startTime;
            const passed = loadTime < 2000; // Module should load within 2 seconds
            
            this.logTest('Module Loading', passed, 
                passed ? 'Fast module loading' : 'Slow module loading', loadTime);
            return passed;
        } catch (error) {
            this.logTest('Module Loading', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test 4: Memory Usage Performance
    async testMemoryUsage() {
        try {
            const metrics = await this.page.metrics();
            const memoryUsed = metrics.JSHeapUsedSize / 1024 / 1024; // MB
            const passed = memoryUsed < 100; // Should use less than 100MB
            
            this.logTest('Memory Usage', passed, 
                `Memory usage: ${memoryUsed.toFixed(1)}MB`, null);
            return passed;
        } catch (error) {
            this.logTest('Memory Usage', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test 5: Calculation Performance
    async testCalculationPerformance() {
        try {
            // Input test data
            await this.page.type('input[type="number"]', '25000');
            
            const startTime = Date.now();
            
            // Trigger calculation by changing input
            await this.page.keyboard.press('Tab');
            
            // Wait for results to update
            await this.page.waitForFunction(() => {
                const results = document.querySelector('.financial-card');
                return results && results.textContent.includes('₪');
            }, { timeout: 2000 });
            
            const calcTime = Date.now() - startTime;
            const passed = calcTime < 500; // Calculations should complete within 500ms
            
            this.logTest('Calculation Performance', passed, 
                passed ? 'Fast calculations' : 'Slow calculations', calcTime);
            return passed;
        } catch (error) {
            this.logTest('Calculation Performance', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Test 6: Preloading Effectiveness
    async testPreloadingEffectiveness() {
        try {
            // Wait for preloading to complete (3 seconds after page load)  
            await new Promise(resolve => setTimeout(resolve, 3500));
            
            // Check if modules are preloaded
            const preloadedModules = await this.page.evaluate(() => {
                return {
                    advancedPortfolio: window.AdvancedPortfolio !== undefined,
                    scenariosStress: window.ScenariosStress !== undefined
                };
            });
            
            const modulesPreloaded = Object.values(preloadedModules).filter(Boolean).length;
            const passed = modulesPreloaded >= 1; // At least one module should be preloaded
            
            this.logTest('Preloading Effectiveness', passed, 
                `${modulesPreloaded} modules preloaded successfully`);
            return passed;
        } catch (error) {
            this.logTest('Preloading Effectiveness', false, `Test failed: ${error.message}`);
            return false;
        }
    }

    // Run comprehensive performance test suite
    async runPerformanceTests() {
        console.log('\n⚡ Starting Performance Test Suite...\n');
        
        const initSuccess = await this.initBrowser();
        if (!initSuccess) {
            return this.generateReport();
        }

        // Run all performance tests
        await this.testInitialLoadPerformance();
        await this.testTabSwitchingPerformance();
        await this.testModuleLoadingPerformance();
        await this.testMemoryUsage();
        await this.testCalculationPerformance();
        await this.testPreloadingEffectiveness();

        await this.browser.close();
        return this.generateReport();
    }

    generateReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(result => result.passed).length;
        const failedTests = totalTests - passedTests;
        const successRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : 0;
        
        console.log('\n⚡ Performance Test Results:');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${failedTests}`);
        console.log(`Success Rate: ${successRate}%`);
        console.log('='.repeat(50));

        // Performance benchmarks
        console.log('\n📊 Performance Benchmarks:');
        this.testResults.forEach(result => {
            if (result.duration) {
                const benchmark = this.getPerformanceBenchmark(result.testName, result.duration);
                console.log(`   ${result.testName}: ${result.duration}ms ${benchmark}`);
            }
        });

        if (failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(result => !result.passed)
                .forEach(result => {
                    console.log(`   - ${result.testName}: ${result.message}`);
                });
        }

        // Overall performance rating
        const performanceRating = this.calculatePerformanceRating();
        console.log(`\n🎯 Overall Performance: ${performanceRating}`);

        return {
            passed: passedTests,
            failed: failedTests,
            total: totalTests,
            successRate: parseFloat(successRate),
            performanceRating
        };
    }

    getPerformanceBenchmark(testName, duration) {
        const benchmarks = {
            'Initial Page Load': { excellent: 1000, good: 2000, poor: 3000 },
            'Tab Switch - Advanced': { excellent: 300, good: 700, poor: 1000 },
            'Tab Switch - Basic': { excellent: 200, good: 500, poor: 1000 },
            'Module Loading': { excellent: 500, good: 1000, poor: 2000 },
            'Calculation Performance': { excellent: 100, good: 300, poor: 500 }
        };

        const benchmark = benchmarks[testName];
        if (!benchmark) return '';

        if (duration <= benchmark.excellent) return '🚀 EXCELLENT';
        if (duration <= benchmark.good) return '✅ GOOD';
        if (duration <= benchmark.poor) return '⚠️ ACCEPTABLE';
        return '❌ POOR';
    }

    calculatePerformanceRating() {
        const passedTests = this.testResults.filter(result => result.passed).length;
        const totalTests = this.testResults.length;
        const successRate = (passedTests / totalTests) * 100;

        if (successRate >= 90) return '🚀 EXCELLENT';
        if (successRate >= 75) return '✅ GOOD';
        if (successRate >= 60) return '⚠️ ACCEPTABLE';
        return '❌ NEEDS IMPROVEMENT';
    }
}

// Run tests if called directly
if (require.main === module) {
    const performanceTests = new PerformanceTestSuite();
    performanceTests.runPerformanceTests().then(results => {
        process.exit(results.failed > 0 ? 1 : 0);
    });
}

module.exports = PerformanceTestSuite;