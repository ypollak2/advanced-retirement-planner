// Automated Test Runner for CI/CD Integration
// This script can be run with Puppeteer or Playwright to automate browser tests

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function runBrowserTests() {
    console.log('🚀 Starting automated browser tests...\n');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Capture console output
        const consoleLogs = [];
        page.on('console', msg => {
            consoleLogs.push({
                type: msg.type(),
                text: msg.text(),
                timestamp: new Date()
            });
        });
        
        // Capture errors
        const errors = [];
        page.on('error', err => {
            errors.push({
                message: err.message,
                stack: err.stack,
                timestamp: new Date()
            });
        });
        
        page.on('pageerror', err => {
            errors.push({
                message: err.toString(),
                timestamp: new Date()
            });
        });
        
        // Navigate to test runner
        const testRunnerPath = `file://${path.join(__dirname, '../../test-runner-browser.html')}?autorun=true`;
        await page.goto(testRunnerPath, { waitUntil: 'networkidle0' });
        
        // Wait for tests to complete (max 60 seconds)
        await page.waitForFunction(
            () => {
                const totalEl = document.getElementById('total-count');
                const progressEl = document.getElementById('progress-bar');
                return totalEl && totalEl.textContent !== '0' && 
                       progressEl && progressEl.style.width === '100%';
            },
            { timeout: 60000 }
        );
        
        // Extract test results
        const results = await page.evaluate(() => {
            return {
                passed: parseInt(document.getElementById('passed-count').textContent),
                failed: parseInt(document.getElementById('failed-count').textContent),
                total: parseInt(document.getElementById('total-count').textContent),
                categories: Array.from(document.querySelectorAll('#test-categories .test-category')).map(cat => {
                    const title = cat.querySelector('h3').textContent.replace('▼', '').trim();
                    const summary = cat.querySelector('.text-sm').textContent;
                    const tests = Array.from(cat.querySelectorAll('.test-list > div')).map(test => ({
                        name: test.textContent.replace(/[✅❌⏸️]/g, '').replace(/\(\d+ms\)/, '').trim(),
                        status: test.classList.contains('text-green-600') ? 'passed' : 
                               test.classList.contains('text-red-600') ? 'failed' : 'pending',
                        duration: test.textContent.match(/\((\d+)ms\)/)?.[1] || null
                    }));
                    return { title, summary, tests };
                })
            };
        });
        
        // Extract failed test details
        const failedTests = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.test-fail')).map(el => ({
                category: el.querySelector('.font-semibold').textContent,
                description: el.querySelector('div:not(.font-semibold)').textContent.split('❌')[0].trim(),
                error: el.querySelector('.text-red-600')?.textContent || 'No error message'
            }));
        });
        
        // Generate report
        console.log('📊 Test Results Summary');
        console.log('=======================');
        console.log(`✅ Passed: ${results.passed}`);
        console.log(`❌ Failed: ${results.failed}`);
        console.log(`📊 Total: ${results.total}`);
        console.log(`📈 Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`);
        
        if (results.failed > 0) {
            console.log('❌ Failed Tests:');
            console.log('================');
            failedTests.forEach(test => {
                console.log(`\n[${test.category}] ${test.description}`);
                console.log(`  Error: ${test.error}`);
            });
            console.log('');
        }
        
        // Check for specific production issues
        console.log('🔍 Production Issue Checks:');
        console.log('===========================');
        
        // Check for CurrencyAPI issues
        const currencyAPIErrors = consoleLogs.filter(log => 
            log.text.includes('getExchangeRates') || 
            log.text.includes('is not a function')
        );
        
        if (currencyAPIErrors.length > 0) {
            console.log('❌ CurrencyAPI errors found:');
            currencyAPIErrors.forEach(err => {
                console.log(`  - ${err.text}`);
            });
        } else {
            console.log('✅ No CurrencyAPI method errors');
        }
        
        // Check for React errors
        const reactErrors = errors.filter(err => 
            err.message.includes('React') || 
            err.message.includes('Component')
        );
        
        if (reactErrors.length > 0) {
            console.log('❌ React errors found:');
            reactErrors.forEach(err => {
                console.log(`  - ${err.message}`);
            });
        } else {
            console.log('✅ No React component errors');
        }
        
        // Check for unhandled promise rejections
        const promiseRejections = consoleLogs.filter(log => 
            log.text.includes('Unhandled Promise Rejection') ||
            log.text.includes('UnhandledPromiseRejectionWarning')
        );
        
        if (promiseRejections.length > 0) {
            console.log('❌ Unhandled promise rejections found');
        } else {
            console.log('✅ No unhandled promise rejections');
        }
        
        // Save detailed report
        const report = {
            timestamp: new Date().toISOString(),
            summary: results,
            failedTests,
            errors,
            consoleLogs: consoleLogs.filter(log => log.type === 'error' || log.type === 'warn'),
            productionIssues: {
                currencyAPIErrors: currencyAPIErrors.length,
                reactErrors: reactErrors.length,
                promiseRejections: promiseRejections.length
            }
        };
        
        fs.writeFileSync(
            path.join(__dirname, '../../test-results/browser-test-report.json'),
            JSON.stringify(report, null, 2)
        );
        
        console.log('\n📄 Detailed report saved to: test-results/browser-test-report.json');
        
        // Return exit code based on results
        return results.failed === 0 ? 0 : 1;
        
    } catch (error) {
        console.error('❌ Test runner error:', error);
        return 1;
    } finally {
        await browser.close();
    }
}

// Run tests if called directly
if (require.main === module) {
    runBrowserTests().then(exitCode => {
        process.exit(exitCode);
    });
}

module.exports = { runBrowserTests };