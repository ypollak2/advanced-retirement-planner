// Browser Test Framework for Advanced Retirement Planner
// A lightweight test framework that runs directly in the browser

class BrowserTestRunner {
    constructor(options = {}) {
        this.resultsElement = options.resultsElement;
        this.consoleElement = options.consoleElement;
        this.categoriesElement = options.categoriesElement;
        this.passedElement = options.passedElement;
        this.failedElement = options.failedElement;
        this.totalElement = options.totalElement;
        this.progressElement = options.progressElement;
        
        this.tests = [];
        this.categories = new Map();
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
        
        // Error tracking
        this.errors = [];
        this.warnings = [];
        this.failedTests = [];
        
        // Capture console output
        this.setupConsoleCapture();
        
        // Make runner globally available
        window.testRunner = this;
    }
    
    setupConsoleCapture() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
            originalLog.apply(console, args);
            this.logToConsole('log', args);
        };
        
        console.error = (...args) => {
            originalError.apply(console, args);
            this.logToConsole('error', args);
            this.errors.push({
                type: 'console.error',
                message: args.join(' '),
                timestamp: new Date()
            });
        };
        
        console.warn = (...args) => {
            originalWarn.apply(console, args);
            this.logToConsole('warn', args);
            this.warnings.push({
                type: 'console.warn',
                message: args.join(' '),
                timestamp: new Date()
            });
        };
        
        // Global error handler
        window.addEventListener('error', (event) => {
            this.errors.push({
                type: 'uncaught-error',
                message: event.message,
                file: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                timestamp: new Date()
            });
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.errors.push({
                type: 'unhandled-promise-rejection',
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
                timestamp: new Date()
            });
        });
    }
    
    logToConsole(type, args) {
        if (!this.consoleElement) return;
        
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        const entry = document.createElement('div');
        entry.className = `console-${type} mb-1`;
        
        const timestamp = new Date().toLocaleTimeString();
        const color = type === 'error' ? 'text-red-400' : type === 'warn' ? 'text-yellow-400' : 'text-green-400';
        
        entry.innerHTML = `<span class="text-gray-500">[${timestamp}]</span> <span class="${color}">${this.escapeHtml(message)}</span>`;
        
        this.consoleElement.appendChild(entry);
        this.consoleElement.scrollTop = this.consoleElement.scrollHeight;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    describe(category, callback) {
        console.log(`Registering test category: ${category}`);
        const suite = {
            category,
            tests: []
        };
        
        this.currentSuite = suite;
        callback();
        
        console.log(`Category ${category} registered with ${suite.tests.length} tests`);
        this.categories.set(category, suite);
        this.tests.push(...suite.tests);
    }
    
    it(description, testFn) {
        if (!this.currentSuite) {
            throw new Error('Test must be defined within a describe block');
        }
        
        this.currentSuite.tests.push({
            category: this.currentSuite.category,
            description,
            testFn,
            status: 'pending'
        });
    }
    
    async runAllTests() {
        this.clearResults();
        this.updateProgress(0);
        
        console.log('🧪 Starting browser test suite...');
        
        let testIndex = 0;
        for (const test of this.tests) {
            await this.runTest(test);
            testIndex++;
            this.updateProgress((testIndex / this.tests.length) * 100);
        }
        
        this.displaySummary();
    }
    
    async runCategory(category) {
        this.clearResults();
        
        const suite = this.categories.get(category);
        if (!suite) {
            console.error(`Category "${category}" not found`);
            return;
        }
        
        console.log(`🧪 Running ${category} tests...`);
        
        let testIndex = 0;
        for (const test of suite.tests) {
            await this.runTest(test);
            testIndex++;
            this.updateProgress((testIndex / suite.tests.length) * 100);
        }
        
        this.displaySummary();
    }
    
    async runTest(test) {
        const startTime = Date.now();
        let result;
        
        try {
            // Update UI to show test is running
            this.addTestResult(test, 'running');
            
            // Run the test
            const testResult = test.testFn();
            
            // Handle async tests
            if (testResult && typeof testResult.then === 'function') {
                await testResult;
            }
            
            // Test passed
            test.status = 'passed';
            test.duration = Date.now() - startTime;
            this.results.passed++;
            
            result = { status: 'passed', duration: test.duration };
            
        } catch (error) {
            // Test failed
            test.status = 'failed';
            test.error = error;
            test.duration = Date.now() - startTime;
            this.results.failed++;
            
            result = { status: 'failed', error: error.message, duration: test.duration };
            console.error(`Test failed: ${test.description}`, error);
            
            // Track failed test details
            this.failedTests.push({
                category: test.category,
                description: test.description,
                error: error.message,
                stack: error.stack,
                duration: test.duration,
                timestamp: new Date()
            });
        }
        
        this.results.total++;
        this.updateTestResult(test, result);
        this.updateCounters();
        
        // Small delay to make test execution visible
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    addTestResult(test, status) {
        if (!this.resultsElement) return;
        
        const testDiv = document.createElement('div');
        testDiv.id = `test-${this.results.total}`;
        testDiv.className = `p-3 mb-2 rounded test-${status}`;
        
        testDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <span class="font-semibold">${test.category}</span>: ${test.description}
                </div>
                <div class="text-sm">
                    ${status === 'running' ? '⏱️ Running...' : ''}
                </div>
            </div>
        `;
        
        this.resultsElement.appendChild(testDiv);
    }
    
    updateTestResult(test, result) {
        const testDiv = document.getElementById(`test-${this.results.total - 1}`);
        if (!testDiv) return;
        
        testDiv.className = `p-3 mb-2 rounded test-${result.status}`;
        
        const statusIcon = result.status === 'passed' ? '✅' : '❌';
        const statusText = result.status === 'passed' ? 'PASS' : 'FAIL';
        
        testDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <span class="font-semibold">${test.category}</span>: ${test.description}
                </div>
                <div class="text-sm">
                    ${statusIcon} ${statusText} (${result.duration}ms)
                </div>
            </div>
            ${result.error ? `<div class="mt-2 text-sm text-red-600">${this.escapeHtml(result.error)}</div>` : ''}
        `;
    }
    
    clearResults() {
        this.results = { passed: 0, failed: 0, total: 0 };
        this.updateCounters();
        
        if (this.resultsElement) {
            this.resultsElement.innerHTML = '';
        }
        
        if (this.consoleElement) {
            this.consoleElement.innerHTML = '<p class="text-gray-500">Console cleared</p>';
        }
        
        // Reset all test statuses
        this.tests.forEach(test => {
            test.status = 'pending';
            delete test.error;
            delete test.duration;
        });
    }
    
    updateCounters() {
        if (this.passedElement) this.passedElement.textContent = this.results.passed;
        if (this.failedElement) this.failedElement.textContent = this.results.failed;
        if (this.totalElement) this.totalElement.textContent = this.results.total;
    }
    
    updateProgress(percentage) {
        if (this.progressElement) {
            this.progressElement.style.width = `${percentage}%`;
        }
    }
    
    displaySummary() {
        const summary = document.createElement('div');
        summary.className = 'mt-4 p-4 rounded ' + (this.results.failed === 0 ? 'bg-green-100' : 'bg-red-100');
        
        const percentage = this.results.total > 0 
            ? ((this.results.passed / this.results.total) * 100).toFixed(1)
            : 0;
            
        summary.innerHTML = `
            <h3 class="font-bold text-lg mb-2">Test Summary</h3>
            <p>✅ Passed: ${this.results.passed}</p>
            <p>❌ Failed: ${this.results.failed}</p>
            <p>📊 Total: ${this.results.total}</p>
            <p>📈 Success Rate: ${percentage}%</p>
        `;
        
        if (this.resultsElement) {
            this.resultsElement.appendChild(summary);
        }
        
        console.log(`\n🎉 Test run complete: ${this.results.passed}/${this.results.total} passed (${percentage}%)`);
        
        // Display categories
        this.displayCategories();
        
        // Generate error report
        this.generateErrorReport();
    }
    
    generateErrorReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                passed: this.results.passed,
                failed: this.results.failed,
                total: this.results.total,
                successRate: this.results.total > 0 ? ((this.results.passed / this.results.total) * 100).toFixed(1) + '%' : '0%'
            },
            failedTests: this.failedTests,
            errors: this.errors,
            warnings: this.warnings,
            categories: Array.from(this.categories.entries()).map(([name, suite]) => ({
                name,
                totalTests: suite.tests.length,
                passed: suite.tests.filter(t => t.status === 'passed').length,
                failed: suite.tests.filter(t => t.status === 'failed').length
            }))
        };
        
        // Create download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600';
        downloadBtn.textContent = 'Download Error Report';
        downloadBtn.onclick = () => this.downloadReport(report);
        
        if (this.resultsElement) {
            this.resultsElement.appendChild(downloadBtn);
        }
        
        // Log report to console
        console.log('📋 Test Error Report:', report);
        
        // Store in window for easy access
        window.testErrorReport = report;
    }
    
    downloadReport(report) {
        const content = JSON.stringify(report, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test-error-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    displayCategories() {
        if (!this.categoriesElement) return;
        
        this.categoriesElement.innerHTML = '';
        
        this.categories.forEach((suite, category) => {
            const passed = suite.tests.filter(t => t.status === 'passed').length;
            const total = suite.tests.length;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'test-category border rounded p-4 mb-2';
            
            categoryDiv.innerHTML = `
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-lg">
                        <span class="collapse-icon">▼</span> ${category}
                    </h3>
                    <div class="text-sm">
                        ${passed}/${total} passed
                    </div>
                </div>
                <div class="test-list mt-2 space-y-1">
                    ${suite.tests.map(test => `
                        <div class="text-sm pl-6 ${test.status === 'passed' ? 'text-green-600' : test.status === 'failed' ? 'text-red-600' : 'text-gray-500'}">
                            ${test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏸️'} ${test.description}
                            ${test.duration ? `(${test.duration}ms)` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Add collapse functionality
            categoryDiv.addEventListener('click', (e) => {
                if (e.target.closest('.test-list')) return;
                categoryDiv.classList.toggle('collapsed');
            });
            
            this.categoriesElement.appendChild(categoryDiv);
        });
    }
}

// Test assertion helpers
const assert = {
    equal(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected} but got ${actual}`);
        }
    },
    
    notEqual(actual, expected, message) {
        if (actual === expected) {
            throw new Error(message || `Expected ${actual} to not equal ${expected}`);
        }
    },
    
    deepEqual(actual, expected, message) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(message || `Deep equality check failed: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`);
        }
    },
    
    ok(value, message) {
        if (!value) {
            throw new Error(message || `Expected truthy value but got ${value}`);
        }
    },
    
    notOk(value, message) {
        if (value) {
            throw new Error(message || `Expected falsy value but got ${value}`);
        }
    },
    
    throws(fn, message) {
        let threw = false;
        try {
            fn();
        } catch (e) {
            threw = true;
        }
        if (!threw) {
            throw new Error(message || 'Expected function to throw');
        }
    },
    
    async rejects(promise, message) {
        let rejected = false;
        try {
            await promise;
        } catch (e) {
            rejected = true;
        }
        if (!rejected) {
            throw new Error(message || 'Expected promise to reject');
        }
    },
    
    includes(array, value, message) {
        if (!array.includes(value)) {
            throw new Error(message || `Expected array to include ${value}`);
        }
    },
    
    match(string, regex, message) {
        if (!regex.test(string)) {
            throw new Error(message || `Expected "${string}" to match ${regex}`);
        }
    },
    
    instanceOf(object, constructor, message) {
        if (!(object instanceof constructor)) {
            throw new Error(message || `Expected instance of ${constructor.name}`);
        }
    }
};

// Helper for waiting
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for waiting for elements
const waitFor = async (selector, timeout = 5000) => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
        const element = document.querySelector(selector);
        if (element) return element;
        await wait(100);
    }
    
    throw new Error(`Element ${selector} not found after ${timeout}ms`);
};

// Helper for simulating events
const simulate = {
    click(element) {
        element.click();
    },
    
    input(element, value) {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    },
    
    select(element, value) {
        element.value = value;
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }
};

// Export globals
window.BrowserTestRunner = BrowserTestRunner;
window.assert = assert;
window.wait = wait;
window.waitFor = waitFor;
window.simulate = simulate;

console.log('✅ Browser test framework loaded');