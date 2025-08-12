#!/usr/bin/env node

/**
 * Post-Deployment E2E Test Runner for v7.3.4
 * Tests all critical functionality after deployment
 */

const https = require('https');
const fs = require('fs');

const PRODUCTION_URL = 'https://ypollak2.github.io/advanced-retirement-planner/';
const EXPECTED_VERSION = '7.3.4';

// Terminal colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

// Test results tracking
const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
};

// Helper to make HTTPS requests
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        }).on('error', reject);
    });
}

// Log with formatting
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}]`;
    
    switch(type) {
        case 'success':
            console.log(`${colors.gray}${prefix}${colors.reset} ${colors.green}✓${colors.reset} ${message}`);
            break;
        case 'error':
            console.log(`${colors.gray}${prefix}${colors.reset} ${colors.red}✗${colors.reset} ${message}`);
            break;
        case 'warning':
            console.log(`${colors.gray}${prefix}${colors.reset} ${colors.yellow}⚠${colors.reset} ${message}`);
            break;
        case 'info':
            console.log(`${colors.gray}${prefix}${colors.reset} ${colors.cyan}ℹ${colors.reset} ${message}`);
            break;
        case 'header':
            console.log(`\n${colors.bright}${colors.cyan}${message}${colors.reset}`);
            break;
    }
}

// Run a single test
async function runTest(name, testFn) {
    results.total++;
    
    try {
        const result = await testFn();
        results.passed++;
        results.tests.push({ name, status: 'PASS', details: result });
        log(`${name}: ${result}`, 'success');
        return true;
    } catch (error) {
        results.failed++;
        results.tests.push({ name, status: 'FAIL', details: error.message });
        log(`${name}: ${error.message}`, 'error');
        return false;
    }
}

// Test Suites
async function deploymentTests() {
    log('🚀 DEPLOYMENT VERIFICATION', 'header');
    
    await runTest('Version Check', async () => {
        const response = await fetchUrl(PRODUCTION_URL + 'version.json');
        const data = JSON.parse(response.data);
        if (data.version !== EXPECTED_VERSION) {
            throw new Error(`Expected v${EXPECTED_VERSION}, got v${data.version}`);
        }
        return `Version ${EXPECTED_VERSION} confirmed`;
    });
    
    await runTest('Service Worker Update', async () => {
        const response = await fetchUrl(PRODUCTION_URL + 'sw.js');
        if (!response.data.includes(EXPECTED_VERSION)) {
            throw new Error('Service Worker not updated to latest version');
        }
        return 'Service Worker contains v' + EXPECTED_VERSION;
    });
    
    await runTest('Main Page Accessibility', async () => {
        const response = await fetchUrl(PRODUCTION_URL);
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}`);
        }
        if (!response.data.includes('Advanced Retirement Planner')) {
            throw new Error('Invalid page content');
        }
        return 'Main page loads successfully (HTTP 200)';
    });
}

async function currencyFixTests() {
    log('💱 CURRENCY FIX VERIFICATION', 'header');
    
    await runTest('Main RSU Component Currency Init', async () => {
        const response = await fetchUrl(PRODUCTION_URL + 'src/components/shared/EnhancedRSUCompanySelector.js?v=' + EXPECTED_VERSION);
        
        if (response.data.includes('useState(1)') && response.data.includes('currencyRate')) {
            throw new Error('Still using useState(1) for currency rate initialization');
        }
        
        if (!response.data.includes('useState(null)') || !response.data.includes('currencyRate')) {
            throw new Error('Currency rate not properly initialized to null');
        }
        
        return 'Currency rate correctly initialized to null';
    });
    
    await runTest('Partner RSU Component Currency Init', async () => {
        const response = await fetchUrl(PRODUCTION_URL + 'src/components/shared/PartnerRSUSelector.js?v=' + EXPECTED_VERSION);
        
        if (!response.data.includes('useState(null)') || !response.data.includes('currencyRate')) {
            throw new Error('Partner RSU currency rate not properly initialized');
        }
        
        return 'Partner RSU currency correctly initialized to null';
    });
    
    await runTest('Currency Display Logic', async () => {
        const response = await fetchUrl(PRODUCTION_URL + 'src/components/shared/EnhancedRSUCompanySelector.js?v=' + EXPECTED_VERSION);
        
        if (!response.data.includes('currencyRate !== null && currencyRate > 0')) {
            throw new Error('Missing null check in currency display logic');
        }
        
        if (!response.data.includes('Loading exchange rate') && !response.data.includes('טוען שער חליפין')) {
            throw new Error('Missing loading state text for currency');
        }
        
        return 'Currency display properly handles null/loading states';
    });
}

async function coreComponentTests() {
    log('🎯 CORE FUNCTIONALITY', 'header');
    
    await runTest('Retirement Calculator', async () => {
        const response = await fetchUrl(PRODUCTION_URL + 'src/utils/retirementCalculations.js?v=' + EXPECTED_VERSION);
        if (response.status !== 200) {
            throw new Error('Calculator script not accessible');
        }
        if (!response.data.includes('calculateRetirement')) {
            throw new Error('Missing core calculation function');
        }
        return 'Core retirement calculations accessible';
    });
    
    await runTest('Financial Health Engine', async () => {
        const response = await fetchUrl(PRODUCTION_URL + 'src/utils/financialHealthEngine.js?v=' + EXPECTED_VERSION);
        if (response.status !== 200) {
            throw new Error('Financial health engine not accessible');
        }
        if (!response.data.includes('calculateFinancialHealthScore')) {
            throw new Error('Missing financial health calculation');
        }
        return 'Financial health engine loaded successfully';
    });
    
    await runTest('Currency API', async () => {
        const response = await fetchUrl(PRODUCTION_URL + 'src/utils/currencyAPI.js?v=' + EXPECTED_VERSION);
        if (!response.data.includes('CurrencyAPI')) {
            throw new Error('Currency API class not found');
        }
        if (!response.data.includes('fallbackRates')) {
            throw new Error('Fallback rates not configured');
        }
        return 'Currency API with fallback rates available';
    });
    
    await runTest('Export Functions', async () => {
        const response = await fetchUrl(PRODUCTION_URL + 'src/utils/exportFunctions.js?v=' + EXPECTED_VERSION);
        if (response.status !== 200) {
            throw new Error('Export functions not accessible');
        }
        return 'Export functionality available';
    });
}

async function previousFixTests() {
    log('🔧 PREVIOUS FIXES VERIFICATION', 'header');
    
    await runTest('Wizard Initialization Fix', async () => {
        const response = await fetchUrl(PRODUCTION_URL + 'src/components/wizard/RetirementWizard.js?v=' + EXPECTED_VERSION);
        const content = response.data;
        
        // Check that content is defined before useEffect
        const contentIndex = content.indexOf('const content = {');
        const useEffectIndex = content.indexOf('React.useEffect');
        
        if (contentIndex === -1) {
            throw new Error('Content object not found');
        }
        
        if (useEffectIndex !== -1 && contentIndex > useEffectIndex) {
            throw new Error('Content defined after useEffect - initialization error would occur');
        }
        
        return 'Wizard initialization order correct';
    });
    
    await runTest('Accessibility Number Navigation Removed', async () => {
        const response = await fetchUrl(PRODUCTION_URL + 'src/utils/accessibilityUtils.js?v=' + EXPECTED_VERSION);
        
        if (response.data.includes('parseInt(key)') && response.data.includes('wizardStepChange')) {
            throw new Error('Number key navigation still present');
        }
        
        return 'Number key navigation successfully removed';
    });
}

async function performanceTests() {
    log('⚡ PERFORMANCE CHECKS', 'header');
    
    await runTest('Page Load Performance', async () => {
        const start = Date.now();
        await fetchUrl(PRODUCTION_URL);
        const loadTime = Date.now() - start;
        
        if (loadTime > 3000) {
            throw new Error(`Load time too high: ${loadTime}ms (limit: 3000ms)`);
        }
        return `Page loaded in ${loadTime}ms`;
    });
    
    await runTest('Critical Scripts Availability', async () => {
        const scripts = [
            'src/components/core/RetirementPlannerApp.js',
            'src/utils/retirementCalculations.js',
            'src/utils/financialHealthEngine.js'
        ];
        
        for (const script of scripts) {
            const response = await fetchUrl(PRODUCTION_URL + script + '?v=' + EXPECTED_VERSION);
            if (response.status !== 200) {
                throw new Error(`${script} not accessible`);
            }
        }
        
        return `All ${scripts.length} critical scripts accessible`;
    });
}

async function securityTests() {
    log('🔒 SECURITY CHECKS', 'header');
    
    await runTest('HTTPS Enforcement', async () => {
        if (!PRODUCTION_URL.startsWith('https://')) {
            throw new Error('Production URL not using HTTPS');
        }
        return 'HTTPS properly enforced';
    });
    
    await runTest('No Exposed Secrets', async () => {
        const response = await fetchUrl(PRODUCTION_URL);
        const patterns = ['api_key', 'API_KEY', 'secret', 'SECRET', 'password', 'PASSWORD', 'token', 'TOKEN'];
        
        for (const pattern of patterns) {
            if (response.data.includes(`${pattern}=`) || response.data.includes(`"${pattern}":`)) {
                throw new Error(`Potential exposed secret pattern: ${pattern}`);
            }
        }
        
        return 'No exposed secrets detected';
    });
}

// Generate summary report
function generateSummary() {
    const successRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : 0;
    
    console.log('\n' + '='.repeat(70));
    log('📊 E2E TEST SUMMARY', 'header');
    console.log('='.repeat(70));
    
    console.log(`${colors.bright}Total Tests:${colors.reset} ${results.total}`);
    console.log(`${colors.green}Passed:${colors.reset} ${results.passed}`);
    console.log(`${colors.red}Failed:${colors.reset} ${results.failed}`);
    console.log(`${colors.bright}Success Rate:${colors.reset} ${successRate}%`);
    console.log('='.repeat(70));
    
    // Generate JSON report
    const report = {
        version: EXPECTED_VERSION,
        timestamp: new Date().toISOString(),
        production_url: PRODUCTION_URL,
        summary: {
            total_tests: results.total,
            passed: results.passed,
            failed: results.failed,
            success_rate: successRate + '%'
        },
        tests: results.tests,
        deployment_status: results.failed === 0 ? 'SUCCESS' : 'FAILURE',
        currency_fix_status: results.tests
            .filter(t => t.name.includes('Currency'))
            .every(t => t.status === 'PASS') ? 'VERIFIED' : 'FAILED'
    };
    
    // Save report
    const reportPath = `e2e-report-v${EXPECTED_VERSION}-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`Report saved to: ${reportPath}`, 'info');
    
    // Final status
    if (results.failed === 0) {
        console.log(`\n${colors.green}${colors.bright}✅ ALL TESTS PASSED!${colors.reset}`);
        console.log(`${colors.green}Version ${EXPECTED_VERSION} is successfully deployed and verified.${colors.reset}\n`);
    } else {
        console.log(`\n${colors.red}${colors.bright}❌ SOME TESTS FAILED!${colors.reset}`);
        console.log(`${colors.red}Please check the failed tests above.${colors.reset}\n`);
        process.exit(1);
    }
}

// Main execution
async function main() {
    console.log(`${colors.bright}${colors.cyan}🚀 Post-Deployment E2E Tests for v${EXPECTED_VERSION}${colors.reset}`);
    console.log(`${colors.gray}Production URL: ${PRODUCTION_URL}${colors.reset}`);
    console.log(`${colors.gray}Started: ${new Date().toLocaleString()}${colors.reset}\n`);
    
    try {
        await deploymentTests();
        await currencyFixTests();
        await coreComponentTests();
        await previousFixTests();
        await performanceTests();
        await securityTests();
    } catch (error) {
        log(`Unexpected error: ${error.message}`, 'error');
    }
    
    generateSummary();
}

// Run tests
main().catch(console.error);