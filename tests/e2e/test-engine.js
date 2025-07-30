// Test Engine for Production E2E Tests
// Handles test execution, browser automation simulation, and result tracking

class TestEngine {
    constructor() {
        this.iframe = null;
        this.appWindow = null;
        this.results = {};
        this.currentTest = null;
        this.testQueue = [];
        this.isRunning = false;
    }

    // Initialize the test engine
    async initialize() {
        this.iframe = document.getElementById('testApp');
        
        // Wait for iframe to load
        return new Promise((resolve) => {
            if (this.iframe.contentWindow && this.iframe.contentWindow.RetirementWizard) {
                this.appWindow = this.iframe.contentWindow;
                resolve(true);
            } else {
                this.iframe.onload = () => {
                    this.appWindow = this.iframe.contentWindow;
                    setTimeout(() => resolve(true), 2000); // Give app time to initialize
                };
            }
        });
    }

    // Helper function to wait for element
    async waitForElement(selector, timeout = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            try {
                const element = this.appWindow.document.querySelector(selector);
                if (element && element.offsetParent !== null) {
                    return element;
                }
            } catch (e) {
                // Cross-origin restrictions
                console.warn('Waiting for element:', selector);
            }
            await this.sleep(100);
        }
        throw new Error(`Element not found: ${selector}`);
    }

    // Helper to simulate clicks
    async click(selector) {
        const element = await this.waitForElement(selector);
        element.click();
        await this.sleep(300); // Give UI time to update
    }

    // Helper to set input values
    async setInputValue(selector, value) {
        const element = await this.waitForElement(selector);
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        await this.sleep(100);
    }

    // Helper to get text content
    async getText(selector) {
        const element = await this.waitForElement(selector);
        return element.textContent.trim();
    }

    // Helper to check if element exists
    async elementExists(selector, timeout = 1000) {
        try {
            await this.waitForElement(selector, timeout);
            return true;
        } catch {
            return false;
        }
    }

    // Sleep helper
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Take screenshot simulation (would use real screenshot API in production)
    async takeScreenshot(name) {
        // In a real implementation, this would use html2canvas or similar
        return {
            name: name,
            timestamp: new Date().toISOString(),
            url: this.iframe.src
        };
    }

    // Get localStorage data
    getLocalStorage(key) {
        try {
            return this.appWindow.localStorage.getItem(key);
        } catch (e) {
            console.warn('Cannot access localStorage:', e);
            return null;
        }
    }

    // Clear localStorage
    clearLocalStorage() {
        try {
            this.appWindow.localStorage.clear();
        } catch (e) {
            console.warn('Cannot clear localStorage:', e);
        }
    }

    // Reload the app
    async reloadApp() {
        this.iframe.src = this.iframe.src;
        await this.initialize();
    }

    // Get current wizard step
    async getCurrentStep() {
        try {
            const stepIndicator = await this.waitForElement('.step-indicator.active', 1000);
            const stepText = stepIndicator.textContent;
            const match = stepText.match(/Step (\d+)/);
            return match ? parseInt(match[1]) : null;
        } catch {
            return null;
        }
    }

    // Check for console errors
    getConsoleErrors() {
        // In real implementation, would intercept console.error
        return [];
    }

    // Run a single test
    async runTest(testId, testFunction) {
        this.currentTest = testId;
        const startTime = Date.now();
        const result = {
            id: testId,
            name: testFunction.name || testId,
            status: 'running',
            startTime: new Date().toISOString(),
            steps: [],
            screenshots: [],
            errors: []
        };

        try {
            // Update UI
            this.updateTestStatus(testId, 'running');
            
            // Initialize app
            await this.initialize();
            
            // Clear any previous state
            this.clearLocalStorage();
            await this.reloadApp();
            
            // Run the actual test
            await testFunction.call(this);
            
            // Mark as passed
            result.status = 'passed';
            result.endTime = new Date().toISOString();
            result.duration = Date.now() - startTime;
            
            this.updateTestStatus(testId, 'passed');
            log(`✅ ${testId} passed in ${result.duration}ms`, 'success');
            
        } catch (error) {
            // Mark as failed
            result.status = 'failed';
            result.error = error.message;
            result.stack = error.stack;
            result.endTime = new Date().toISOString();
            result.duration = Date.now() - startTime;
            
            this.updateTestStatus(testId, 'failed');
            log(`❌ ${testId} failed: ${error.message}`, 'error');
        }

        this.results[testId] = result;
        return result;
    }

    // Update test status in UI
    updateTestStatus(testId, status) {
        const testItem = document.querySelector(`[onclick="runSingleTest('${testId}')"]`);
        const statusIcon = document.getElementById(`status-${testId}`);
        
        if (testItem) {
            testItem.classList.remove('running', 'passed', 'failed');
            testItem.classList.add(status);
        }
        
        if (statusIcon) {
            const icons = {
                running: '<span class="spinner"></span>',
                passed: '✅',
                failed: '❌'
            };
            statusIcon.innerHTML = icons[status] || '';
        }
    }

    // Log test step
    async logStep(description, action) {
        const step = {
            description,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        try {
            const result = await action();
            step.status = 'passed';
            step.result = result;
        } catch (error) {
            step.status = 'failed';
            step.error = error.message;
            throw error;
        }

        if (this.results[this.currentTest]) {
            this.results[this.currentTest].steps.push(step);
        }

        return step;
    }

    // Assert helper
    assert(condition, message) {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }

    // Assert equals helper
    assertEquals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message}: expected ${expected}, got ${actual}`);
        }
    }

    // Assert contains helper
    assertContains(text, substring, message) {
        if (!text.includes(substring)) {
            throw new Error(`${message}: "${substring}" not found in "${text}"`);
        }
    }

    // Assert greater than helper
    assertGreaterThan(actual, expected, message) {
        if (actual <= expected) {
            throw new Error(`${message}: ${actual} is not greater than ${expected}`);
        }
    }

    // Assert element exists
    async assertElementExists(selector, message) {
        const exists = await this.elementExists(selector);
        if (!exists) {
            throw new Error(`${message}: Element ${selector} not found`);
        }
    }

    // Assert element not exists
    async assertElementNotExists(selector, message) {
        const exists = await this.elementExists(selector, 500);
        if (exists) {
            throw new Error(`${message}: Element ${selector} should not exist`);
        }
    }

    // Get financial health scores
    async getFinancialHealthScores() {
        try {
            // Try to get scores from the UI
            const scores = {};
            const scoreElements = await this.appWindow.document.querySelectorAll('.score-value');
            scoreElements.forEach(el => {
                const label = el.parentElement.querySelector('.score-label');
                if (label) {
                    scores[label.textContent] = parseInt(el.textContent) || 0;
                }
            });
            return scores;
        } catch {
            // Fallback to calling the engine directly
            return {};
        }
    }

    // Fill basic wizard data
    async fillBasicWizardData(data = {}) {
        const defaults = {
            planningType: 'couple',
            userName: 'Test User 1',
            partnerName: 'Test User 2',
            country: 'israel',
            currentAge: 35,
            partnerAge: 33,
            targetRetirementAge: 67,
            partnerTargetRetirementAge: 67
        };

        const finalData = { ...defaults, ...data };

        // Step 1: Planning type
        if (finalData.planningType === 'couple') {
            await this.click('[data-value="couple"]');
        } else {
            await this.click('[data-value="individual"]');
        }
        await this.click('button:contains("Next")');

        // Fill in other steps as needed...
    }

    // Generate test report
    generateReport() {
        const report = {
            summary: {
                total: Object.keys(this.results).length,
                passed: Object.values(this.results).filter(r => r.status === 'passed').length,
                failed: Object.values(this.results).filter(r => r.status === 'failed').length,
                duration: Object.values(this.results).reduce((sum, r) => sum + (r.duration || 0), 0)
            },
            results: this.results,
            timestamp: new Date().toISOString(),
            environment: {
                url: this.iframe?.src,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            }
        };

        return report;
    }
}

// Create global test engine instance
window.testEngine = new TestEngine();

// Helper functions for test execution
async function runSingleTest(testId) {
    const test = window.testScenarios[testId];
    if (!test) {
        log(`Test ${testId} not found`, 'error');
        return;
    }

    testResults.total = 1;
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.startTime = Date.now();

    const result = await window.testEngine.runTest(testId, test);
    
    if (result.status === 'passed') {
        testResults.passed++;
    } else {
        testResults.failed++;
    }

    testResults.results[testId] = result;
    testResults.endTime = Date.now();
    updateMetrics();
}

async function runCategory(category) {
    const categoryTests = {
        navigation: ['test1', 'test2', 'test3', 'test4', 'test5'],
        validation: ['test6', 'test7', 'test8', 'test9', 'test10', 'test11'],
        couple: ['test12', 'test13', 'test14', 'test15'],
        calculations: ['test16', 'test17', 'test18', 'test19', 'test20'],
        ui: ['test21', 'test22', 'test23', 'test24', 'test25']
    };

    const tests = categoryTests[category];
    if (!tests) {
        log(`Category ${category} not found`, 'error');
        return;
    }

    testResults.total = tests.length;
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.startTime = Date.now();

    for (const testId of tests) {
        const test = window.testScenarios[testId];
        if (test) {
            const result = await window.testEngine.runTest(testId, test);
            if (result.status === 'passed') {
                testResults.passed++;
            } else {
                testResults.failed++;
            }
            testResults.results[testId] = result;
            updateMetrics();
        }
    }

    testResults.endTime = Date.now();
    updateMetrics();
}

async function runAllTests() {
    const allTests = [
        'test1', 'test2', 'test3', 'test4', 'test5',
        'test6', 'test7', 'test8', 'test9', 'test10', 'test11',
        'test12', 'test13', 'test14', 'test15',
        'test16', 'test17', 'test18', 'test19', 'test20',
        'test21', 'test22', 'test23', 'test24', 'test25'
    ];

    testResults.total = allTests.length;
    testResults.passed = 0;
    testResults.failed = 0;
    testResults.running = 0;
    testResults.startTime = Date.now();

    log(`Starting all ${allTests.length} tests...`, 'info');

    for (const testId of allTests) {
        const test = window.testScenarios[testId];
        if (test) {
            testResults.running++;
            const result = await window.testEngine.runTest(testId, test);
            testResults.running--;
            
            if (result.status === 'passed') {
                testResults.passed++;
            } else {
                testResults.failed++;
            }
            
            testResults.results[testId] = result;
            updateMetrics();
        }
    }

    testResults.endTime = Date.now();
    updateMetrics();
    
    const report = window.testEngine.generateReport();
    log(`All tests completed. ${testResults.passed}/${testResults.total} passed`, 
        testResults.failed === 0 ? 'success' : 'warning');
    
    return report;
}