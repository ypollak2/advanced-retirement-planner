#!/usr/bin/env node

// Comprehensive Test Runner for Advanced Retirement Planner
// Orchestrates all test suites: unit, integration, API, accessibility, performance, and E2E

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🧪 Advanced Retirement Planner - Comprehensive Test Suite');
console.log('=========================================================');
console.log(`Started at: ${new Date().toISOString()}`);
console.log('');

// Test suite configuration
const testSuites = [
    {
        name: '🧮 Unit Tests - Core Calculations',
        path: './tests/unit/calculationEngine.test.js',
        description: 'Tests mathematical accuracy of retirement calculations',
        category: 'unit',
        priority: 'critical'
    },
    {
        name: '🧙‍♂️ Integration Tests - Wizard Flow',
        path: './tests/integration/wizardFlow.test.js',
        description: 'Tests wizard step integration and data flow',
        category: 'integration',
        priority: 'high'
    },
    {
        name: '🌐 API Tests - External Services',
        path: './tests/api/externalServices.test.js',
        description: 'Tests stock prices, currency APIs, and CORS proxy',
        category: 'api',
        priority: 'medium'
    },
    {
        name: '♿ Accessibility & Performance Tests',
        path: './tests/accessibility/a11y.test.js',
        description: 'Tests WCAG compliance and performance metrics',
        category: 'quality',
        priority: 'high'
    },
    {
        name: '🎭 End-to-End User Journey Tests',
        path: './tests/e2e/userJourney.test.js',
        description: 'Tests complete user workflows and scenarios',
        category: 'e2e',
        priority: 'high'
    },
    // Include existing specialized tests
    {
        name: '💰 Portfolio Tax Calculation Tests',
        path: './tests/portfolio-tax-calculation-test.js',
        description: 'Tests portfolio tax calculation features',
        category: 'feature',
        priority: 'high'
    },
    {
        name: '🧠 Financial Health Scoring Tests',
        path: './tests/test-financial-health-scoring.js',
        description: 'Tests financial health score accuracy',
        category: 'feature',
        priority: 'medium'
    },
    {
        name: '👫 Partner Mode Integration Tests',
        path: './tests/partner-mode-integration-test.js',
        description: 'Tests couple planning mode functionality',
        category: 'feature',
        priority: 'high'
    },
    {
        name: '💱 Currency Consistency Tests',
        path: './tests/currency-consistency-test.js',
        description: 'Tests currency conversion accuracy',
        category: 'feature',
        priority: 'medium'
    },
    {
        name: '🔒 Security & Vulnerability Tests',
        path: './tests/security/security-vulnerability-tests.js',
        description: 'Tests for security vulnerabilities and XSS protection',
        category: 'security',
        priority: 'critical'
    }
];

// Results tracking
let totalTestsPassed = 0;
let totalTestsFailed = 0;
let suiteResults = [];
let criticalFailures = [];

// Color coding for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

// Run a single test suite
function runTestSuite(suite) {
    return new Promise((resolve) => {
        console.log(`\n${colorize('▶️  Running:', 'cyan')} ${suite.name}`);
        console.log(`   ${colorize('Path:', 'blue')} ${suite.path}`);
        console.log(`   ${colorize('Description:', 'blue')} ${suite.description}`);
        console.log('   ' + '─'.repeat(80));

        // Check if test file exists
        if (!fs.existsSync(suite.path)) {
            console.log(`   ${colorize('⚠️  SKIP:', 'yellow')} Test file not found`);
            suiteResults.push({
                ...suite,
                status: 'skipped',
                testsPassed: 0,
                testsTotal: 0,
                duration: 0
            });
            resolve();
            return;
        }

        const startTime = Date.now();
        
        // Run the test
        const testProcess = spawn('node', [suite.path], {
            cwd: process.cwd(),
            stdio: 'pipe'
        });

        let output = '';
        let testsPassed = 0;
        let testsTotal = 0;

        testProcess.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            process.stdout.write('   ' + text);
            
            // Extract test results
            const passedMatch = text.match(/Tests Passed: (\d+)/);
            const totalMatch = text.match(/Tests? (?:Total|Failed): (\d+)/);
            
            if (passedMatch) testsPassed = parseInt(passedMatch[1]);
            if (totalMatch) testsTotal = parseInt(totalMatch[1]);
        });

        testProcess.stderr.on('data', (data) => {
            const text = data.toString();
            output += text;
            process.stdout.write('   ' + colorize(text, 'red'));
        });

        testProcess.on('close', (code) => {
            const duration = Date.now() - startTime;
            const testsFailed = testsTotal - testsPassed;
            
            // Try to extract results from require if available
            try {
                if (fs.existsSync(suite.path)) {
                    delete require.cache[require.resolve(suite.path)];
                    const moduleResult = require(suite.path);
                    if (moduleResult && typeof moduleResult.testsPassed === 'number') {
                        testsPassed = moduleResult.testsPassed;
                        testsTotal = moduleResult.testsTotal;
                    }
                }
            } catch (error) {
                // Ignore require errors for test files
            }

            const status = code === 0 ? 'passed' : 'failed';
            const successRate = testsTotal > 0 ? ((testsPassed / testsTotal) * 100).toFixed(1) : 0;
            
            console.log(`   ${colorize('Duration:', 'blue')} ${duration}ms`);
            console.log(`   ${colorize('Results:', 'blue')} ${testsPassed}/${testsTotal} passed (${successRate}%)`);
            
            if (status === 'passed') {
                console.log(`   ${colorize('✅ SUITE PASSED', 'green')}`);
            } else {
                console.log(`   ${colorize('❌ SUITE FAILED', 'red')}`);
                if (suite.priority === 'critical') {
                    criticalFailures.push(suite.name);
                }
            }

            // Track totals
            totalTestsPassed += testsPassed;
            totalTestsFailed += testsFailed;

            suiteResults.push({
                ...suite,
                status,
                testsPassed,
                testsTotal,
                testsFailed,
                successRate: parseFloat(successRate),
                duration,
                output
            });

            resolve();
        });
    });
}

// Run all test suites sequentially
async function runAllTests() {
    console.log(`${colorize('📋 Test Plan:', 'bright')} Running ${testSuites.length} test suites\n`);
    
    for (const suite of testSuites) {
        await runTestSuite(suite);
    }
    
    // Generate comprehensive report
    generateTestReport();
}

// Generate detailed test report
function generateTestReport() {
    console.log('\n' + '='.repeat(80));
    console.log(colorize('📊 COMPREHENSIVE TEST RESULTS SUMMARY', 'bright'));
    console.log('='.repeat(80));
    
    // Overall statistics
    const totalTests = totalTestsPassed + totalTestsFailed;
    const overallSuccessRate = totalTests > 0 ? ((totalTestsPassed / totalTests) * 100).toFixed(1) : 0;
    const totalDuration = suiteResults.reduce((sum, suite) => sum + suite.duration, 0);
    
    console.log(`${colorize('📈 Overall Results:', 'cyan')}`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${colorize(totalTestsPassed.toString(), 'green')}`);
    console.log(`   Failed: ${colorize(totalTestsFailed.toString(), totalTestsFailed > 0 ? 'red' : 'green')}`);
    console.log(`   Success Rate: ${colorize(overallSuccessRate + '%', overallSuccessRate >= 95 ? 'green' : overallSuccessRate >= 85 ? 'yellow' : 'red')}`);
    console.log(`   Total Duration: ${totalDuration}ms`);
    
    // Results by category
    console.log(`\n${colorize('📊 Results by Category:', 'cyan')}`);
    const categories = [...new Set(suiteResults.map(suite => suite.category))];
    
    categories.forEach(category => {
        const categoryResults = suiteResults.filter(suite => suite.category === category);
        const categoryPassed = categoryResults.reduce((sum, suite) => sum + suite.testsPassed, 0);
        const categoryTotal = categoryResults.reduce((sum, suite) => sum + suite.testsTotal, 0);
        const categoryRate = categoryTotal > 0 ? ((categoryPassed / categoryTotal) * 100).toFixed(1) : 0;
        
        console.log(`   ${category.toUpperCase()}: ${categoryPassed}/${categoryTotal} (${categoryRate}%)`);
    });
    
    // Individual suite results
    console.log(`\n${colorize('📋 Individual Suite Results:', 'cyan')}`);
    suiteResults.forEach(suite => {
        const statusColor = suite.status === 'passed' ? 'green' : 
                           suite.status === 'skipped' ? 'yellow' : 'red';
        const statusIcon = suite.status === 'passed' ? '✅' : 
                          suite.status === 'skipped' ? '⏭️' : '❌';
        
        console.log(`   ${statusIcon} ${colorize(suite.name, statusColor)}`);
        console.log(`      ${suite.testsPassed}/${suite.testsTotal} tests (${suite.successRate}%) - ${suite.duration}ms`);
        
        if (suite.status === 'failed' && suite.priority === 'critical') {
            console.log(`      ${colorize('⚠️  CRITICAL FAILURE', 'red')}`);
        }
    });
    
    // Critical failures
    if (criticalFailures.length > 0) {
        console.log(`\n${colorize('🚨 CRITICAL FAILURES:', 'red')}`);
        criticalFailures.forEach(failure => {
            console.log(`   • ${failure}`);
        });
    }
    
    // Recommendations
    console.log(`\n${colorize('💡 Recommendations:', 'cyan')}`);
    
    if (overallSuccessRate >= 95) {
        console.log(`   🎉 Excellent test coverage! App is ready for production deployment.`);
    } else if (overallSuccessRate >= 85) {
        console.log(`   ✅ Good test coverage. Consider addressing failing tests before deployment.`);
    } else if (overallSuccessRate >= 70) {
        console.log(`   ⚠️  Fair test coverage. Review and fix failing tests before deployment.`);
    } else {
        console.log(`   ❌ Poor test coverage. Significant issues need resolution before deployment.`);
    }
    
    if (criticalFailures.length > 0) {
        console.log(`   🚨 Critical failures must be resolved before deployment.`);
    }
    
    // Test categories needing attention
    const failingCategories = categories.filter(category => {
        const categoryResults = suiteResults.filter(suite => suite.category === category);
        const categoryPassed = categoryResults.reduce((sum, suite) => sum + suite.testsPassed, 0);
        const categoryTotal = categoryResults.reduce((sum, suite) => sum + suite.testsTotal, 0);
        return categoryTotal > 0 && (categoryPassed / categoryTotal) < 0.9;
    });
    
    if (failingCategories.length > 0) {
        console.log(`   📝 Focus attention on: ${failingCategories.join(', ')}`);
    }
    
    // Performance insights
    const slowSuites = suiteResults.filter(suite => suite.duration > 5000);
    if (slowSuites.length > 0) {
        console.log(`   ⏱️  Performance: Consider optimizing slow test suites`);
    }
    
    console.log('\n' + '='.repeat(80));
    
    // Save detailed report to file
    const reportData = {
        timestamp: new Date().toISOString(),
        overall: {
            totalTests,
            totalTestsPassed,
            totalTestsFailed,
            overallSuccessRate: parseFloat(overallSuccessRate),
            totalDuration
        },
        categories: categories.map(category => {
            const categoryResults = suiteResults.filter(suite => suite.category === category);
            return {
                name: category,
                passed: categoryResults.reduce((sum, suite) => sum + suite.testsPassed, 0),
                total: categoryResults.reduce((sum, suite) => sum + suite.testsTotal, 0),
                suites: categoryResults.length
            };
        }),
        suites: suiteResults,
        criticalFailures
    };
    
    const reportPath = path.join(__dirname, 'test-results', `comprehensive-report-${Date.now()}.json`);
    
    // Ensure directory exists
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`${colorize('📄 Detailed report saved:', 'blue')} ${reportPath}`);
    
    // Exit with appropriate code
    const exitCode = criticalFailures.length > 0 || overallSuccessRate < 85 ? 1 : 0;
    console.log(`\n${colorize('🏁 Test run completed', 'bright')} - Exit code: ${exitCode}`);
    
    process.exit(exitCode);
}

// Handle process interruption
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Test run interrupted by user');
    process.exit(1);
});

// Start test execution
console.log('🚀 Starting comprehensive test execution...\n');
runAllTests().catch(error => {
    console.error('❌ Test runner error:', error);
    process.exit(1);
});