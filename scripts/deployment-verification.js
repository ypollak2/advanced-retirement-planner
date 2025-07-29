#!/usr/bin/env node
/**
 * Post-Deployment Verification Script
 * Validates that the deployment was successful and the site is functioning correctly
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Production URLs to verify
const PRODUCTION_URLS = [
    'https://ypollak2.github.io/advanced-retirement-planner/',
    'https://advanced-retirement-planner.netlify.app/'
];

// Validation results
const results = {
    timestamp: new Date().toISOString(),
    urls: {},
    summary: {
        totalChecks: 0,
        passed: 0,
        failed: 0,
        warnings: 0
    }
};

// Utility functions
function log(message, type = 'info') {
    const prefix = {
        info: chalk.blue('ℹ'),
        success: chalk.green('✓'),
        error: chalk.red('✗'),
        warning: chalk.yellow('⚠'),
        header: chalk.cyan('►')
    };
    
    console.log(`${prefix[type] || ''} ${message}`);
}

// Fetch URL with timeout
function fetchUrl(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                resolve({
                    statusCode: response.statusCode,
                    headers: response.headers,
                    body: data
                });
            });
        });
        
        request.on('error', (error) => {
            reject(error);
        });
        
        request.setTimeout(timeout, () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

// Verify a single URL
async function verifyUrl(url) {
    log(`\nVerifying ${url}...`, 'header');
    
    const urlResults = {
        url,
        checks: {},
        summary: { passed: 0, failed: 0, warnings: 0 }
    };
    
    try {
        // 1. Check URL accessibility
        log('Checking accessibility...', 'info');
        const response = await fetchUrl(url);
        
        if (response.statusCode === 200) {
            log('Site is accessible', 'success');
            urlResults.checks.accessibility = { passed: true };
            urlResults.summary.passed++;
        } else {
            log(`Site returned status code: ${response.statusCode}`, 'error');
            urlResults.checks.accessibility = { passed: false, error: `Status ${response.statusCode}` };
            urlResults.summary.failed++;
        }
        
        // 2. Check page title
        log('Checking page title...', 'info');
        if (response.body.includes('<title>Advanced Retirement Planner')) {
            log('Page title is correct', 'success');
            urlResults.checks.title = { passed: true };
            urlResults.summary.passed++;
        } else {
            log('Page title is missing or incorrect', 'error');
            urlResults.checks.title = { passed: false };
            urlResults.summary.failed++;
        }
        
        // 3. Check React app presence
        log('Checking React app...', 'info');
        if (response.body.includes('RetirementPlannerApp') || response.body.includes('root')) {
            log('React app container found', 'success');
            urlResults.checks.reactApp = { passed: true };
            urlResults.summary.passed++;
        } else {
            log('React app container not found', 'error');
            urlResults.checks.reactApp = { passed: false };
            urlResults.summary.failed++;
        }
        
        // 4. Check version indicator
        log('Checking version indicator...', 'info');
        const versionMatch = response.body.match(/version["\s:]+(\d+\.\d+\.\d+)/i);
        if (versionMatch) {
            const version = versionMatch[1];
            log(`Version ${version} found`, 'success');
            urlResults.checks.version = { passed: true, version };
            urlResults.summary.passed++;
            
            // Compare with local version
            try {
                const localVersion = JSON.parse(fs.readFileSync('version.json', 'utf8')).version;
                if (version !== localVersion) {
                    log(`Version mismatch: deployed ${version} vs local ${localVersion}`, 'warning');
                    urlResults.checks.versionMatch = { passed: false, warning: true };
                    urlResults.summary.warnings++;
                } else {
                    log('Deployed version matches local version', 'success');
                    urlResults.checks.versionMatch = { passed: true };
                    urlResults.summary.passed++;
                }
            } catch (e) {
                log('Could not compare with local version', 'warning');
                urlResults.summary.warnings++;
            }
        } else {
            log('Version indicator not found', 'warning');
            urlResults.checks.version = { passed: false, warning: true };
            urlResults.summary.warnings++;
        }
        
        // 5. Check critical scripts
        log('Checking critical scripts...', 'info');
        const criticalScripts = ['main.js', 'app.js', 'chart', 'retirement'];
        let scriptsFound = 0;
        
        criticalScripts.forEach(script => {
            if (response.body.includes(script)) {
                scriptsFound++;
            }
        });
        
        if (scriptsFound >= 2) {
            log(`Found ${scriptsFound} critical scripts`, 'success');
            urlResults.checks.scripts = { passed: true, count: scriptsFound };
            urlResults.summary.passed++;
        } else {
            log(`Only found ${scriptsFound} critical scripts`, 'warning');
            urlResults.checks.scripts = { passed: false, warning: true, count: scriptsFound };
            urlResults.summary.warnings++;
        }
        
        // 6. Check Service Worker
        log('Checking Service Worker...', 'info');
        try {
            const swResponse = await fetchUrl(url + 'sw.js', 5000);
            if (swResponse.statusCode === 200) {
                log('Service Worker is available', 'success');
                urlResults.checks.serviceWorker = { passed: true };
                urlResults.summary.passed++;
            } else {
                log(`Service Worker returned status ${swResponse.statusCode}`, 'warning');
                urlResults.checks.serviceWorker = { passed: false, warning: true };
                urlResults.summary.warnings++;
            }
        } catch (error) {
            log('Service Worker not accessible', 'warning');
            urlResults.checks.serviceWorker = { passed: false, warning: true, error: error.message };
            urlResults.summary.warnings++;
        }
        
        // 7. Check for console errors (basic check in HTML)
        log('Checking for obvious errors...', 'info');
        if (response.body.includes('error') || response.body.includes('Error')) {
            // This is a basic check - false positives possible
            log('Found potential error strings in HTML (may be false positive)', 'warning');
            urlResults.checks.errors = { passed: false, warning: true };
            urlResults.summary.warnings++;
        } else {
            log('No obvious errors in HTML', 'success');
            urlResults.checks.errors = { passed: true };
            urlResults.summary.passed++;
        }
        
        // 8. Performance check - page size
        log('Checking page size...', 'info');
        const pageSizeKB = (response.body.length / 1024).toFixed(2);
        if (pageSizeKB < 500) {
            log(`Page size is ${pageSizeKB}KB (good)`, 'success');
            urlResults.checks.pageSize = { passed: true, size: pageSizeKB };
            urlResults.summary.passed++;
        } else {
            log(`Page size is ${pageSizeKB}KB (consider optimization)`, 'warning');
            urlResults.checks.pageSize = { passed: false, warning: true, size: pageSizeKB };
            urlResults.summary.warnings++;
        }
        
    } catch (error) {
        log(`Failed to verify URL: ${error.message}`, 'error');
        urlResults.checks.accessibility = { passed: false, error: error.message };
        urlResults.summary.failed++;
    }
    
    results.urls[url] = urlResults;
    results.summary.totalChecks += urlResults.summary.passed + urlResults.summary.failed + urlResults.summary.warnings;
    results.summary.passed += urlResults.summary.passed;
    results.summary.failed += urlResults.summary.failed;
    results.summary.warnings += urlResults.summary.warnings;
    
    return urlResults;
}

// Generate report
function generateReport() {
    log('\nGenerating verification report...', 'header');
    
    // Save detailed report
    const reportPath = path.join(process.cwd(), 'deployment-verification-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    log(`Detailed report saved to: ${reportPath}`, 'info');
    
    // Display summary
    console.log('\n' + chalk.cyan('═'.repeat(60)));
    console.log(chalk.cyan.bold('DEPLOYMENT VERIFICATION SUMMARY'));
    console.log(chalk.cyan('═'.repeat(60)));
    
    const allPassed = results.summary.failed === 0;
    
    if (allPassed && results.summary.warnings === 0) {
        console.log(chalk.green.bold('\n✅ DEPLOYMENT VERIFIED - ALL CHECKS PASSED\n'));
    } else if (allPassed) {
        console.log(chalk.yellow.bold('\n⚠️  DEPLOYMENT VERIFIED WITH WARNINGS\n'));
    } else {
        console.log(chalk.red.bold('\n❌ DEPLOYMENT VERIFICATION FAILED\n'));
    }
    
    console.log(`Total Checks: ${chalk.blue(results.summary.totalChecks)}`);
    console.log(`Passed: ${chalk.green(results.summary.passed)}`);
    console.log(`Failed: ${chalk.red(results.summary.failed)}`);
    console.log(`Warnings: ${chalk.yellow(results.summary.warnings)}`);
    
    // Show results per URL
    Object.entries(results.urls).forEach(([url, urlResults]) => {
        console.log(`\n${chalk.cyan(url)}`);
        console.log(`  Passed: ${chalk.green(urlResults.summary.passed)}`);
        console.log(`  Failed: ${chalk.red(urlResults.summary.failed)}`);
        console.log(`  Warnings: ${chalk.yellow(urlResults.summary.warnings)}`);
        
        // Show failed checks
        Object.entries(urlResults.checks).forEach(([check, result]) => {
            if (!result.passed && !result.warning) {
                console.log(chalk.red(`  ✗ ${check}: ${result.error || 'Failed'}`));
            }
        });
        
        // Show warnings
        Object.entries(urlResults.checks).forEach(([check, result]) => {
            if (result.warning) {
                console.log(chalk.yellow(`  ⚠ ${check}: ${result.error || 'Warning'}`));
            }
        });
    });
    
    console.log('\n' + chalk.cyan('═'.repeat(60)));
    
    if (!allPassed) {
        console.log(chalk.red.bold('\n⛔ CRITICAL: Deployment verification failed. Investigate immediately.\n'));
    } else if (results.summary.warnings > 0) {
        console.log(chalk.yellow.bold('\n⚠️  Review warnings above and monitor the deployment.\n'));
    } else {
        console.log(chalk.green.bold('\n✅ Deployment is fully operational!\n'));
    }
    
    return allPassed;
}

// Main execution
async function main() {
    console.log(chalk.cyan.bold('\n🔍 DEPLOYMENT VERIFICATION\n'));
    console.log('Verifying production deployment...\n');
    
    // Verify each URL
    for (const url of PRODUCTION_URLS) {
        await verifyUrl(url);
    }
    
    // Generate report
    const success = generateReport();
    
    process.exit(success ? 0 : 1);
}

// Run verification
main().catch(error => {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
});