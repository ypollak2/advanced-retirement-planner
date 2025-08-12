// Post-deployment test runner for v7.3.3
const https = require('https');

const PRODUCTION_URL = 'https://ypollak2.github.io/advanced-retirement-planner/';
const EXPECTED_VERSION = '7.3.3';

console.log('🚀 Running Post-Deployment Tests for v7.3.3\n');

async function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        }).on('error', reject);
    });
}

async function runTests() {
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    // Test 1: Version Check
    console.log('📋 Test 1: Version Check');
    try {
        const versionRes = await fetchUrl(PRODUCTION_URL + 'version.json');
        const versionData = JSON.parse(versionRes.data);
        if (versionData.version === EXPECTED_VERSION) {
            console.log('✅ Version 7.3.3 confirmed');
            results.passed++;
            results.tests.push({ name: 'Version Check', status: 'PASS', details: 'v7.3.3 deployed' });
        } else {
            console.log(`❌ Version mismatch: expected ${EXPECTED_VERSION}, got ${versionData.version}`);
            results.failed++;
            results.tests.push({ name: 'Version Check', status: 'FAIL', details: `Found v${versionData.version}` });
        }
    } catch (e) {
        console.log('❌ Version check failed:', e.message);
        results.failed++;
        results.tests.push({ name: 'Version Check', status: 'FAIL', details: e.message });
    }

    // Test 2: Main Page Accessibility
    console.log('\n📋 Test 2: Main Page Accessibility');
    try {
        const mainRes = await fetchUrl(PRODUCTION_URL);
        if (mainRes.status === 200) {
            console.log('✅ Main page accessible (HTTP 200)');
            results.passed++;
            results.tests.push({ name: 'Main Page', status: 'PASS', details: 'HTTP 200 OK' });
        } else {
            console.log(`❌ Main page returned status ${mainRes.status}`);
            results.failed++;
            results.tests.push({ name: 'Main Page', status: 'FAIL', details: `HTTP ${mainRes.status}` });
        }
    } catch (e) {
        console.log('❌ Main page check failed:', e.message);
        results.failed++;
        results.tests.push({ name: 'Main Page', status: 'FAIL', details: e.message });
    }

    // Test 3: Service Worker Check
    console.log('\n📋 Test 3: Service Worker Check');
    try {
        const swRes = await fetchUrl(PRODUCTION_URL + 'sw.js');
        if (swRes.status === 200 && swRes.data.includes('7.3.3')) {
            console.log('✅ Service Worker updated to v7.3.3');
            results.passed++;
            results.tests.push({ name: 'Service Worker', status: 'PASS', details: 'Updated to v7.3.3' });
        } else {
            console.log('❌ Service Worker not updated');
            results.failed++;
            results.tests.push({ name: 'Service Worker', status: 'FAIL', details: 'Not updated' });
        }
    } catch (e) {
        console.log('❌ Service Worker check failed:', e.message);
        results.failed++;
        results.tests.push({ name: 'Service Worker', status: 'FAIL', details: e.message });
    }

    // Test 4: Critical JS Files
    console.log('\n📋 Test 4: Critical JavaScript Files');
    const criticalFiles = [
        'src/components/wizard/RetirementWizard.js',
        'src/utils/accessibilityUtils.js',
        'src/utils/financialHealthEngine.js'
    ];
    
    for (const file of criticalFiles) {
        try {
            const fileRes = await fetchUrl(PRODUCTION_URL + file + '?v=7.3.3');
            if (fileRes.status === 200) {
                console.log(`✅ ${file} - Accessible`);
                results.passed++;
                results.tests.push({ name: `File: ${file}`, status: 'PASS', details: 'Accessible' });
            } else {
                console.log(`❌ ${file} - HTTP ${fileRes.status}`);
                results.failed++;
                results.tests.push({ name: `File: ${file}`, status: 'FAIL', details: `HTTP ${fileRes.status}` });
            }
        } catch (e) {
            console.log(`❌ ${file} - Failed:`, e.message);
            results.failed++;
            results.tests.push({ name: `File: ${file}`, status: 'FAIL', details: e.message });
        }
    }

    // Test 5: Keyboard Fix Verification
    console.log('\n📋 Test 5: Keyboard Fix Verification');
    try {
        const a11yRes = await fetchUrl(PRODUCTION_URL + 'src/utils/accessibilityUtils.js?v=7.3.3');
        if (a11yRes.status === 200) {
            const hasNumberKeyNav = a11yRes.data.includes('parseInt(key)') && 
                                   a11yRes.data.includes('wizardStepChange');
            if (!hasNumberKeyNav) {
                console.log('✅ Number key navigation removed');
                results.passed++;
                results.tests.push({ name: 'Keyboard Fix', status: 'PASS', details: 'Number nav removed' });
            } else {
                console.log('❌ Number key navigation still present');
                results.failed++;
                results.tests.push({ name: 'Keyboard Fix', status: 'FAIL', details: 'Still present' });
            }
        }
    } catch (e) {
        console.log('❌ Keyboard fix check failed:', e.message);
        results.failed++;
        results.tests.push({ name: 'Keyboard Fix', status: 'FAIL', details: e.message });
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 POST-DEPLOYMENT TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${results.passed + results.failed}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));

    if (results.failed === 0) {
        console.log('\n🎉 ALL TESTS PASSED! Version 7.3.3 deployed successfully.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the results above.');
    }

    // Output JSON report
    const report = {
        version: EXPECTED_VERSION,
        timestamp: new Date().toISOString(),
        production_url: PRODUCTION_URL,
        summary: {
            total_tests: results.passed + results.failed,
            passed: results.passed,
            failed: results.failed,
            success_rate: ((results.passed / (results.passed + results.failed)) * 100).toFixed(1) + '%'
        },
        tests: results.tests,
        status: results.failed === 0 ? 'SUCCESS' : 'FAILURE'
    };

    console.log('\n📄 Detailed Report:');
    console.log(JSON.stringify(report, null, 2));
}

// Run the tests
runTests().catch(console.error);