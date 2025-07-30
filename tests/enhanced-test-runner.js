#!/usr/bin/env node

// Enhanced Test Runner for Advanced Retirement Planner
// Supports categorized tests, parallel execution, and detailed reporting

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const glob = require('glob');
const chalk = require('chalk');

// Test categories and their patterns
const TEST_CATEGORIES = {
    all: '**/*.test.js',
    unit: 'unit/**/*.test.js',
    integration: 'integration/**/*.test.js',
    e2e: 'e2e/**/*.test.js',
    performance: 'performance/**/*.test.js',
    security: 'security/**/*.test.js',
    existing: '../*.js' // Existing test files
};

// Configuration
const config = {
    testDir: __dirname,
    maxParallel: 4,
    timeout: 60000,
    verbose: process.argv.includes('--verbose'),
    category: process.argv.find(arg => arg.startsWith('--category='))?.split('=')[1] || 'all',
    watch: process.argv.includes('--watch'),
    coverage: process.argv.includes('--coverage'),
    reporter: process.argv.find(arg => arg.startsWith('--reporter='))?.split('=')[1] || 'default'
};

// Test results collector
const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0,
    tests: [],
    startTime: Date.now()
};

// Console output helpers
const log = {
    info: (msg) => console.log(chalk.blue('ℹ'), msg),
    success: (msg) => console.log(chalk.green('✓'), msg),
    error: (msg) => console.log(chalk.red('✗'), msg),
    warn: (msg) => console.log(chalk.yellow('⚠'), msg),
    debug: (msg) => config.verbose && console.log(chalk.gray('▸'), msg)
};

// Main test runner
async function runTests() {
    console.log(chalk.bold.cyan('\n🧪 Enhanced Test Runner for Advanced Retirement Planner'));
    console.log(chalk.gray('='.repeat(60)));
    
    // Find test files
    const pattern = TEST_CATEGORIES[config.category] || TEST_CATEGORIES.all;
    const testFiles = await findTestFiles(pattern);
    
    if (testFiles.length === 0) {
        log.warn(`No test files found for category: ${config.category}`);
        return;
    }
    
    log.info(`Found ${testFiles.length} test files in category: ${config.category}`);
    
    // Run tests
    if (config.maxParallel > 1 && testFiles.length > 1) {
        await runTestsParallel(testFiles);
    } else {
        await runTestsSequential(testFiles);
    }
    
    // Run existing test suite if category is 'all' or 'existing'
    if (config.category === 'all' || config.category === 'existing') {
        await runExistingTests();
    }
    
    // Generate report
    generateReport();
}

// Find test files matching pattern
async function findTestFiles(pattern) {
    return new Promise((resolve, reject) => {
        glob(pattern, { cwd: config.testDir }, (err, files) => {
            if (err) reject(err);
            else resolve(files.map(f => path.join(config.testDir, f)));
        });
    });
}

// Run tests sequentially
async function runTestsSequential(testFiles) {
    for (const file of testFiles) {
        await runTestFile(file);
    }
}

// Run tests in parallel
async function runTestsParallel(testFiles) {
    const chunks = [];
    const chunkSize = Math.ceil(testFiles.length / config.maxParallel);
    
    for (let i = 0; i < testFiles.length; i += chunkSize) {
        chunks.push(testFiles.slice(i, i + chunkSize));
    }
    
    await Promise.all(chunks.map(chunk => runTestsSequential(chunk)));
}

// Run a single test file
async function runTestFile(file) {
    const testName = path.relative(config.testDir, file);
    log.debug(`Running: ${testName}`);
    
    const startTime = Date.now();
    const testResult = {
        file: testName,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0,
        errors: []
    };
    
    try {
        const output = await executeTest(file);
        const parsed = parseTestOutput(output);
        
        testResult.passed = parsed.passed;
        testResult.failed = parsed.failed;
        testResult.skipped = parsed.skipped;
        testResult.errors = parsed.errors;
        
        if (parsed.failed > 0) {
            log.error(`${testName}: ${parsed.failed} failed`);
        } else {
            log.success(`${testName}: ${parsed.passed} passed`);
        }
    } catch (error) {
        testResult.failed = 1;
        testResult.errors = [error.message];
        log.error(`${testName}: Execution failed - ${error.message}`);
    }
    
    testResult.duration = Date.now() - startTime;
    
    // Update global results
    results.total += testResult.passed + testResult.failed + testResult.skipped;
    results.passed += testResult.passed;
    results.failed += testResult.failed;
    results.skipped += testResult.skipped;
    results.tests.push(testResult);
}

// Execute test file
function executeTest(file) {
    return new Promise((resolve, reject) => {
        let output = '';
        const child = spawn('node', [file], {
            env: { ...process.env, NODE_ENV: 'test' },
            timeout: config.timeout
        });
        
        child.stdout.on('data', (data) => {
            output += data.toString();
            if (config.verbose) process.stdout.write(data);
        });
        
        child.stderr.on('data', (data) => {
            output += data.toString();
            if (config.verbose) process.stderr.write(data);
        });
        
        child.on('close', (code) => {
            if (code === 0) resolve(output);
            else reject(new Error(`Test exited with code ${code}`));
        });
        
        child.on('error', reject);
    });
}

// Parse test output
function parseTestOutput(output) {
    const result = {
        passed: 0,
        failed: 0,
        skipped: 0,
        errors: []
    };
    
    // Parse different test output formats
    const lines = output.split('\n');
    
    for (const line of lines) {
        // Look for common test result patterns
        if (line.includes('✅ PASS') || line.includes('✓')) {
            result.passed++;
        } else if (line.includes('❌ FAIL') || line.includes('✗')) {
            result.failed++;
            
            // Try to extract error message
            const errorMatch = line.match(/(?:FAIL|Error|✗):\s*(.+)/);
            if (errorMatch) {
                result.errors.push(errorMatch[1]);
            }
        } else if (line.includes('⏭️ SKIP') || line.includes('⏭')) {
            result.skipped++;
        }
        
        // Also look for summary patterns
        const passMatch = line.match(/(?:Passed|passed|Pass):\s*(\d+)/);
        const failMatch = line.match(/(?:Failed|failed|Fail):\s*(\d+)/);
        const skipMatch = line.match(/(?:Skipped|skipped|Skip):\s*(\d+)/);
        
        if (passMatch) result.passed = Math.max(result.passed, parseInt(passMatch[1]));
        if (failMatch) result.failed = Math.max(result.failed, parseInt(failMatch[1]));
        if (skipMatch) result.skipped = Math.max(result.skipped, parseInt(skipMatch[1]));
    }
    
    return result;
}

// Run existing test suite
async function runExistingTests() {
    log.info('Running existing test suite...');
    
    try {
        const output = await executeTest(path.join(__dirname, 'test-runner.js'));
        const lines = output.split('\n');
        
        // Extract test counts from existing runner
        for (const line of lines) {
            if (line.includes('Tests Passed:')) {
                const match = line.match(/Tests Passed:\s*(\d+)/);
                if (match) {
                    const passed = parseInt(match[1]);
                    results.passed += passed;
                    results.total += passed;
                    log.success(`Existing tests: ${passed} passed`);
                }
            } else if (line.includes('Tests Failed:')) {
                const match = line.match(/Tests Failed:\s*(\d+)/);
                if (match) {
                    const failed = parseInt(match[1]);
                    results.failed += failed;
                    results.total += failed;
                    if (failed > 0) {
                        log.error(`Existing tests: ${failed} failed`);
                    }
                }
            }
        }
    } catch (error) {
        log.error(`Failed to run existing tests: ${error.message}`);
    }
}

// Generate test report
function generateReport() {
    results.duration = Date.now() - results.startTime;
    
    console.log(chalk.gray('\n' + '='.repeat(60)));
    console.log(chalk.bold('📊 Test Results Summary'));
    console.log(chalk.gray('='.repeat(60)));
    
    // Summary stats
    console.log(`${chalk.green('✓ Passed:')} ${results.passed}`);
    console.log(`${chalk.red('✗ Failed:')} ${results.failed}`);
    console.log(`${chalk.yellow('⏭ Skipped:')} ${results.skipped}`);
    console.log(`${chalk.blue('∑ Total:')} ${results.total}`);
    console.log(`${chalk.gray('⏱ Duration:')} ${(results.duration / 1000).toFixed(2)}s`);
    
    // Success rate
    const successRate = results.total > 0 
        ? ((results.passed / (results.passed + results.failed)) * 100).toFixed(1)
        : 0;
    console.log(`${chalk.cyan('📈 Success Rate:')} ${successRate}%`);
    
    // Failed tests details
    if (results.failed > 0) {
        console.log(chalk.red('\n❌ Failed Tests:'));
        results.tests.filter(t => t.failed > 0).forEach(test => {
            console.log(`  ${chalk.red('•')} ${test.file}`);
            test.errors.forEach(error => {
                console.log(`    ${chalk.gray('-')} ${error}`);
            });
        });
    }
    
    // Generate report files based on reporter type
    if (config.reporter !== 'console') {
        generateReportFile();
    }
    
    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0);
}

// Generate report file
function generateReportFile() {
    const reportDir = path.join(__dirname, '../test-results');
    fs.mkdirSync(reportDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // JSON report
    if (config.reporter === 'json' || config.reporter === 'all') {
        const jsonReport = {
            timestamp: new Date().toISOString(),
            category: config.category,
            summary: {
                total: results.total,
                passed: results.passed,
                failed: results.failed,
                skipped: results.skipped,
                duration: results.duration,
                successRate: results.total > 0 
                    ? ((results.passed / (results.passed + results.failed)) * 100).toFixed(1)
                    : 0
            },
            tests: results.tests
        };
        
        fs.writeFileSync(
            path.join(reportDir, `test-report-${timestamp}.json`),
            JSON.stringify(jsonReport, null, 2)
        );
    }
    
    // JUnit XML report
    if (config.reporter === 'junit' || config.reporter === 'all') {
        const junitXml = generateJUnitXML();
        fs.writeFileSync(
            path.join(reportDir, `junit-report-${timestamp}.xml`),
            junitXml
        );
    }
    
    // HTML report
    if (config.reporter === 'html' || config.reporter === 'all') {
        const htmlReport = generateHTMLReport();
        fs.writeFileSync(
            path.join(reportDir, `test-report-${timestamp}.html`),
            htmlReport
        );
    }
    
    log.info(`Reports generated in: ${reportDir}`);
}

// Generate JUnit XML report
function generateJUnitXML() {
    const xml = [];
    xml.push('<?xml version="1.0" encoding="UTF-8"?>');
    xml.push(`<testsuites tests="${results.total}" failures="${results.failed}" skipped="${results.skipped}" time="${(results.duration / 1000).toFixed(3)}">`);
    
    results.tests.forEach((test, index) => {
        xml.push(`  <testsuite name="${test.file}" tests="${test.passed + test.failed + test.skipped}" failures="${test.failed}" skipped="${test.skipped}" time="${(test.duration / 1000).toFixed(3)}">`);
        
        // Add individual test cases (simplified)
        for (let i = 0; i < test.passed; i++) {
            xml.push(`    <testcase name="Test ${i + 1}" classname="${test.file}" time="0.001"/>`);
        }
        
        test.errors.forEach((error, i) => {
            xml.push(`    <testcase name="Failed Test ${i + 1}" classname="${test.file}" time="0.001">`);
            xml.push(`      <failure message="${escapeXml(error)}"/>`);
            xml.push(`    </testcase>`);
        });
        
        xml.push(`  </testsuite>`);
    });
    
    xml.push('</testsuites>');
    return xml.join('\n');
}

// Generate HTML report
function generateHTMLReport() {
    const successRate = results.total > 0 
        ? ((results.passed / (results.passed + results.failed)) * 100).toFixed(1)
        : 0;
    
    return `<!DOCTYPE html>
<html>
<head>
    <title>Test Report - ${new Date().toISOString()}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .stat { padding: 15px; border-radius: 4px; flex: 1; text-align: center; }
        .stat.passed { background: #d4edda; color: #155724; }
        .stat.failed { background: #f8d7da; color: #721c24; }
        .stat.skipped { background: #fff3cd; color: #856404; }
        .stat.total { background: #d1ecf1; color: #0c5460; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8f9fa; }
        .failed-row { background: #ffebee; }
        .error { color: #c62828; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Test Execution Report</h1>
        <p>Generated: ${new Date().toISOString()}</p>
        
        <div class="summary">
            <div class="stat passed">
                <h3>${results.passed}</h3>
                <p>Passed</p>
            </div>
            <div class="stat failed">
                <h3>${results.failed}</h3>
                <p>Failed</p>
            </div>
            <div class="stat skipped">
                <h3>${results.skipped}</h3>
                <p>Skipped</p>
            </div>
            <div class="stat total">
                <h3>${results.total}</h3>
                <p>Total</p>
            </div>
        </div>
        
        <p><strong>Success Rate:</strong> ${successRate}%</p>
        <p><strong>Duration:</strong> ${(results.duration / 1000).toFixed(2)}s</p>
        
        <h2>Test Results</h2>
        <table>
            <thead>
                <tr>
                    <th>Test File</th>
                    <th>Passed</th>
                    <th>Failed</th>
                    <th>Skipped</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                ${results.tests.map(test => `
                    <tr class="${test.failed > 0 ? 'failed-row' : ''}">
                        <td>
                            ${test.file}
                            ${test.errors.map(e => `<div class="error">• ${escapeHtml(e)}</div>`).join('')}
                        </td>
                        <td>${test.passed}</td>
                        <td>${test.failed}</td>
                        <td>${test.skipped}</td>
                        <td>${(test.duration / 1000).toFixed(2)}s</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>`;
}

// Utility functions
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Watch mode
if (config.watch) {
    const chokidar = require('chokidar');
    
    log.info('Watch mode enabled. Monitoring for changes...');
    
    const watcher = chokidar.watch(['**/*.js', '!node_modules/**'], {
        cwd: path.join(__dirname, '..'),
        persistent: true
    });
    
    watcher.on('change', (file) => {
        log.info(`File changed: ${file}`);
        runTests();
    });
}

// Run tests
runTests().catch(error => {
    log.error(`Test runner failed: ${error.message}`);
    process.exit(1);
});