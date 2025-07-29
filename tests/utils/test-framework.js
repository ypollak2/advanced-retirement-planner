// Enhanced Test Framework Utilities
// Provides advanced testing capabilities for the Advanced Retirement Planner

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

class TestFramework {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            skipped: 0,
            tests: [],
            startTime: null,
            endTime: null
        };
        this.currentSuite = null;
        this.config = {
            parallel: false,
            verbose: true,
            coverage: false,
            timeout: 5000
        };
    }

    // Test Suite Management
    describe(suiteName, callback) {
        const previousSuite = this.currentSuite;
        this.currentSuite = {
            name: suiteName,
            tests: [],
            beforeEach: null,
            afterEach: null,
            beforeAll: null,
            afterAll: null
        };
        
        callback();
        
        this.runSuite(this.currentSuite);
        this.currentSuite = previousSuite;
    }

    // Test Definition
    it(testName, callback) {
        if (!this.currentSuite) {
            throw new Error('Tests must be defined within a describe block');
        }
        
        this.currentSuite.tests.push({
            name: testName,
            callback,
            status: 'pending'
        });
    }

    // Skip Test
    skip(testName, callback) {
        if (!this.currentSuite) {
            throw new Error('Tests must be defined within a describe block');
        }
        
        this.currentSuite.tests.push({
            name: testName,
            callback,
            status: 'skipped'
        });
    }

    // Lifecycle Hooks
    beforeEach(callback) {
        if (this.currentSuite) {
            this.currentSuite.beforeEach = callback;
        }
    }

    afterEach(callback) {
        if (this.currentSuite) {
            this.currentSuite.afterEach = callback;
        }
    }

    beforeAll(callback) {
        if (this.currentSuite) {
            this.currentSuite.beforeAll = callback;
        }
    }

    afterAll(callback) {
        if (this.currentSuite) {
            this.currentSuite.afterAll = callback;
        }
    }

    // Run Test Suite
    async runSuite(suite) {
        console.log(`\n📦 ${suite.name}`);
        
        // Run beforeAll hook
        if (suite.beforeAll) {
            try {
                await this.runWithTimeout(suite.beforeAll, this.config.timeout);
            } catch (error) {
                console.error(`   ❌ beforeAll failed: ${error.message}`);
                return;
            }
        }

        // Run tests
        for (const test of suite.tests) {
            if (test.status === 'skipped') {
                this.results.skipped++;
                console.log(`   ⏭️  SKIP: ${test.name}`);
                continue;
            }

            // Run beforeEach hook
            if (suite.beforeEach) {
                try {
                    await this.runWithTimeout(suite.beforeEach, this.config.timeout);
                } catch (error) {
                    test.status = 'failed';
                    test.error = error;
                    this.results.failed++;
                    console.log(`   ❌ FAIL: ${test.name} (beforeEach failed)`);
                    continue;
                }
            }

            // Run test
            const startTime = performance.now();
            try {
                await this.runWithTimeout(test.callback, this.config.timeout);
                test.status = 'passed';
                test.duration = performance.now() - startTime;
                this.results.passed++;
                console.log(`   ✅ PASS: ${test.name} (${test.duration.toFixed(2)}ms)`);
            } catch (error) {
                test.status = 'failed';
                test.error = error;
                test.duration = performance.now() - startTime;
                this.results.failed++;
                console.log(`   ❌ FAIL: ${test.name} (${test.duration.toFixed(2)}ms)`);
                if (this.config.verbose) {
                    console.log(`      Error: ${error.message}`);
                    if (error.stack) {
                        console.log(`      Stack: ${error.stack.split('\n')[1].trim()}`);
                    }
                }
            }

            // Run afterEach hook
            if (suite.afterEach) {
                try {
                    await this.runWithTimeout(suite.afterEach, this.config.timeout);
                } catch (error) {
                    console.error(`      Warning: afterEach failed: ${error.message}`);
                }
            }

            this.results.tests.push({
                suite: suite.name,
                test: test.name,
                status: test.status,
                duration: test.duration,
                error: test.error
            });
        }

        // Run afterAll hook
        if (suite.afterAll) {
            try {
                await this.runWithTimeout(suite.afterAll, this.config.timeout);
            } catch (error) {
                console.error(`   ❌ afterAll failed: ${error.message}`);
            }
        }
    }

    // Run with timeout
    async runWithTimeout(fn, timeout) {
        return new Promise(async (resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Test timeout after ${timeout}ms`));
            }, timeout);

            try {
                const result = await fn();
                clearTimeout(timer);
                resolve(result);
            } catch (error) {
                clearTimeout(timer);
                reject(error);
            }
        });
    }

    // Assertion Library
    expect(actual) {
        return new Assertion(actual);
    }

    // Run all tests
    async run() {
        this.results.startTime = new Date();
        console.log('🧪 Running Test Suite');
        console.log('='.repeat(50));

        // Wait for all tests to complete
        await new Promise(resolve => setTimeout(resolve, 100));

        this.results.endTime = new Date();
        this.printSummary();
    }

    // Print test summary
    printSummary() {
        const duration = this.results.endTime - this.results.startTime;
        console.log('\n' + '='.repeat(50));
        console.log('📊 Test Summary');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`⏭️  Skipped: ${this.results.skipped}`);
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

        if (this.results.failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.results.tests
                .filter(test => test.status === 'failed')
                .forEach(test => {
                    console.log(`   - ${test.suite} > ${test.test}`);
                    if (test.error && this.config.verbose) {
                        console.log(`     ${test.error.message}`);
                    }
                });
        }

        // Exit with appropriate code
        process.exit(this.results.failed > 0 ? 1 : 0);
    }

    // Configure test runner
    configure(options) {
        this.config = { ...this.config, ...options };
    }
}

// Assertion class
class Assertion {
    constructor(actual) {
        this.actual = actual;
        this.not = new NegatedAssertion(actual);
    }

    toBe(expected) {
        if (this.actual !== expected) {
            throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(this.actual)}`);
        }
    }

    toEqual(expected) {
        if (JSON.stringify(this.actual) !== JSON.stringify(expected)) {
            throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(this.actual)}`);
        }
    }

    toBeGreaterThan(expected) {
        if (!(this.actual > expected)) {
            throw new Error(`Expected ${this.actual} to be greater than ${expected}`);
        }
    }

    toBeLessThan(expected) {
        if (!(this.actual < expected)) {
            throw new Error(`Expected ${this.actual} to be less than ${expected}`);
        }
    }

    toContain(expected) {
        if (Array.isArray(this.actual)) {
            if (!this.actual.includes(expected)) {
                throw new Error(`Expected array to contain ${expected}`);
            }
        } else if (typeof this.actual === 'string') {
            if (!this.actual.includes(expected)) {
                throw new Error(`Expected string to contain "${expected}"`);
            }
        } else {
            throw new Error('toContain can only be used with arrays or strings');
        }
    }

    toThrow(expectedError) {
        if (typeof this.actual !== 'function') {
            throw new Error('toThrow can only be used with functions');
        }
        
        let threw = false;
        let actualError;
        
        try {
            this.actual();
        } catch (error) {
            threw = true;
            actualError = error;
        }
        
        if (!threw) {
            throw new Error('Expected function to throw an error');
        }
        
        if (expectedError && actualError.message !== expectedError) {
            throw new Error(`Expected error "${expectedError}" but got "${actualError.message}"`);
        }
    }

    toBeTruthy() {
        if (!this.actual) {
            throw new Error(`Expected ${this.actual} to be truthy`);
        }
    }

    toBeFalsy() {
        if (this.actual) {
            throw new Error(`Expected ${this.actual} to be falsy`);
        }
    }

    toBeDefined() {
        if (this.actual === undefined) {
            throw new Error('Expected value to be defined');
        }
    }

    toBeNull() {
        if (this.actual !== null) {
            throw new Error(`Expected null but got ${this.actual}`);
        }
    }

    toHaveLength(expected) {
        if (!this.actual || this.actual.length === undefined) {
            throw new Error('toHaveLength can only be used with arrays or strings');
        }
        if (this.actual.length !== expected) {
            throw new Error(`Expected length ${expected} but got ${this.actual.length}`);
        }
    }

    toMatch(pattern) {
        if (typeof this.actual !== 'string') {
            throw new Error('toMatch can only be used with strings');
        }
        if (!pattern.test(this.actual)) {
            throw new Error(`Expected "${this.actual}" to match ${pattern}`);
        }
    }

    toBeInstanceOf(expectedClass) {
        if (!(this.actual instanceof expectedClass)) {
            throw new Error(`Expected instance of ${expectedClass.name}`);
        }
    }

    toHaveProperty(property, value) {
        if (!(property in this.actual)) {
            throw new Error(`Expected object to have property "${property}"`);
        }
        if (value !== undefined && this.actual[property] !== value) {
            throw new Error(`Expected property "${property}" to have value ${value} but got ${this.actual[property]}`);
        }
    }
}

// Negated assertions
class NegatedAssertion {
    constructor(actual) {
        this.actual = actual;
    }

    toBe(expected) {
        if (this.actual === expected) {
            throw new Error(`Expected ${JSON.stringify(this.actual)} not to be ${JSON.stringify(expected)}`);
        }
    }

    toEqual(expected) {
        if (JSON.stringify(this.actual) === JSON.stringify(expected)) {
            throw new Error(`Expected ${JSON.stringify(this.actual)} not to equal ${JSON.stringify(expected)}`);
        }
    }

    toContain(expected) {
        if (Array.isArray(this.actual) && this.actual.includes(expected)) {
            throw new Error(`Expected array not to contain ${expected}`);
        } else if (typeof this.actual === 'string' && this.actual.includes(expected)) {
            throw new Error(`Expected string not to contain "${expected}"`);
        }
    }

    toBeTruthy() {
        if (this.actual) {
            throw new Error(`Expected ${this.actual} not to be truthy`);
        }
    }

    toBeFalsy() {
        if (!this.actual) {
            throw new Error(`Expected ${this.actual} not to be falsy`);
        }
    }
}

// Mock utilities
class Mock {
    constructor(name = 'mock') {
        this.name = name;
        this.calls = [];
        this.returnValue = undefined;
        this.implementation = null;
    }

    mockReturnValue(value) {
        this.returnValue = value;
        return this;
    }

    mockImplementation(fn) {
        this.implementation = fn;
        return this;
    }

    mockClear() {
        this.calls = [];
    }

    mockReset() {
        this.calls = [];
        this.returnValue = undefined;
        this.implementation = null;
    }

    getMockFunction() {
        const mockFn = (...args) => {
            this.calls.push(args);
            if (this.implementation) {
                return this.implementation(...args);
            }
            return this.returnValue;
        };
        
        mockFn.mock = this;
        return mockFn;
    }
}

// Test utilities
const createMock = (name) => new Mock(name).getMockFunction();

const spyOn = (object, method) => {
    const original = object[method];
    const mock = createMock(`${object.constructor.name}.${method}`);
    
    object[method] = mock;
    
    return {
        mockRestore: () => {
            object[method] = original;
        },
        ...mock.mock
    };
};

// Export test framework
module.exports = {
    TestFramework,
    createMock,
    spyOn
};