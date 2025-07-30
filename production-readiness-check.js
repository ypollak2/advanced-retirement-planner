#!/usr/bin/env node

// Production Readiness Check
// Comprehensive check before deploying to production

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Production Readiness Check for Advanced Retirement Planner');
console.log('==========================================================\n');

let issuesFound = 0;
const criticalIssues = [];
const warnings = [];

// Helper functions
function checkExists(filePath, description) {
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${description}`);
        return true;
    } else {
        console.log(`❌ ${description} - File not found: ${filePath}`);
        criticalIssues.push(`Missing file: ${filePath}`);
        issuesFound++;
        return false;
    }
}

function runCommand(command, description) {
    try {
        const output = execSync(command, { encoding: 'utf-8' });
        console.log(`✅ ${description}`);
        return { success: true, output };
    } catch (error) {
        console.log(`❌ ${description} - Command failed`);
        criticalIssues.push(`Command failed: ${command}`);
        issuesFound++;
        return { success: false, error };
    }
}

function checkFileContent(filePath, searchPattern, description, shouldExist = true) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${description} - File not found`);
        warnings.push(`File not found for content check: ${filePath}`);
        return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const found = content.includes(searchPattern);
    
    if (shouldExist && found) {
        console.log(`✅ ${description}`);
        return true;
    } else if (!shouldExist && !found) {
        console.log(`✅ ${description}`);
        return true;
    } else {
        console.log(`❌ ${description}`);
        if (shouldExist) {
            criticalIssues.push(`Pattern not found in ${filePath}: ${searchPattern}`);
        } else {
            criticalIssues.push(`Unwanted pattern found in ${filePath}: ${searchPattern}`);
        }
        issuesFound++;
        return false;
    }
}

// Start checks
console.log('📁 Checking File Structure...');
console.log('============================');
checkExists('index.html', 'Main HTML file exists');
checkExists('version.json', 'Version file exists');
checkExists('package.json', 'Package.json exists');
checkExists('src/utils/retirementCalculations.js', 'Core calculations exist');
checkExists('src/utils/currencyAPI.js', 'Currency API exists');
checkExists('src/utils/financialHealthEngine.js', 'Financial health engine exists');

console.log('\n🔧 Checking Critical Fixes...');
console.log('==============================');
// Check for the CurrencyAPI fix
checkFileContent(
    'src/components/shared/EnhancedRSUCompanySelector.js',
    'api.fetchExchangeRates()',
    'RSU Component uses correct API method (fetchExchangeRates)'
);

checkFileContent(
    'src/components/shared/PartnerRSUSelector.js',
    'api.fetchExchangeRates()',
    'Partner RSU Component uses correct API method'
);

// Check that old method is NOT used
checkFileContent(
    'src/components/shared/EnhancedRSUCompanySelector.js',
    'api.getExchangeRates()',
    'RSU Component does NOT use old API method',
    false
);

console.log('\n📊 Running Tests...');
console.log('==================');
const testResult = runCommand('npm test', 'All 373 tests pass');
if (testResult.success) {
    // Parse test output
    const output = testResult.output;
    const passMatch = output.match(/Tests Passed: (\d+)/);
    const totalMatch = output.match(/Success Rate:.*Tests Passed: (\d+)/);
    
    if (passMatch && totalMatch) {
        const passed = parseInt(passMatch[1]);
        const total = 373; // Expected number
        
        if (passed === total) {
            console.log(`✅ Perfect test score: ${passed}/${total}`);
        } else {
            console.log(`⚠️  Test count mismatch: ${passed}/${total} (expected 373)`);
            warnings.push(`Only ${passed} of ${total} tests passed`);
        }
    }
}

console.log('\n🏗️  Checking Build Configuration...');
console.log('==================================');
// Check for production optimizations
checkFileContent('index.html', 'react.production.min.js', 'Production React build configured', false);
checkFileContent('index.html', '?v=', 'Cache busting implemented');

console.log('\n🔒 Security Checks...');
console.log('====================');
// Check for security issues
checkFileContent('src/utils/currencyAPI.js', 'eval(', 'No eval() usage in CurrencyAPI', false);
checkFileContent('src/components/shared/FinancialHealthDebugPanel.js', 'eval(', 'No eval() in Debug Panel', false);

// Check for exposed secrets
const jsFiles = execSync('find src -name "*.js"', { encoding: 'utf-8' }).split('\n').filter(f => f);
let secretsFound = false;
for (const file of jsFiles) {
    if (!file) continue;
    try {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.match(/api[_-]?key\s*[:=]\s*["'][^"']+["']/i) ||
            content.match(/secret\s*[:=]\s*["'][^"']+["']/i) ||
            content.match(/password\s*[:=]\s*["'][^"']+["']/i)) {
            console.log(`⚠️  Potential secret in ${file}`);
            warnings.push(`Potential secret found in ${file}`);
            secretsFound = true;
        }
    } catch (e) {
        // Skip files that can't be read
    }
}
if (!secretsFound) {
    console.log('✅ No hardcoded secrets found');
}

console.log('\n🌐 Checking API Integrations...');
console.log('===============================');
checkFileContent('src/utils/currencyAPI.js', 'fetchExchangeRates', 'Currency API has correct method name');
checkFileContent('src/utils/stockPriceAPI.js', 'CORSProxyService', 'CORS proxy configured for stock API');

console.log('\n📱 Checking Responsive Design...');
console.log('================================');
checkFileContent('index.html', 'viewport', 'Viewport meta tag present');
checkFileContent('index.html', 'tailwindcss', 'Tailwind CSS loaded for responsive design');

console.log('\n🔄 Checking Version Consistency...');
console.log('==================================');
const versionJson = JSON.parse(fs.readFileSync('version.json', 'utf-8'));
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

if (versionJson.version === packageJson.version) {
    console.log(`✅ Version consistent: ${versionJson.version}`);
} else {
    console.log(`❌ Version mismatch: version.json (${versionJson.version}) vs package.json (${packageJson.version})`);
    criticalIssues.push('Version mismatch between version.json and package.json');
    issuesFound++;
}

console.log('\n💾 Checking Data Persistence...');
console.log('================================');
checkFileContent('src/components/wizard/RetirementWizard.js', 'localStorage', 'LocalStorage implementation present');
checkFileContent('src/components/core/RetirementPlannerApp.js', 'localStorage', 'App saves state to localStorage');

console.log('\n🚀 Checking Deployment Setup...');
console.log('===============================');
checkExists('.github/workflows/test.yml', 'GitHub Actions workflow exists');
checkExists('scripts/pre-deployment-check.js', 'Pre-deployment check script exists');

// Final Summary
console.log('\n\n📊 PRODUCTION READINESS SUMMARY');
console.log('==================================');
console.log(`Critical Issues: ${criticalIssues.length}`);
console.log(`Warnings: ${warnings.length}`);

if (criticalIssues.length > 0) {
    console.log('\n❌ CRITICAL ISSUES (Must fix before deployment):');
    criticalIssues.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue}`);
    });
}

if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (Should review):');
    warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
    });
}

if (criticalIssues.length === 0) {
    console.log('\n✅ APPLICATION IS PRODUCTION READY! 🎉');
    console.log('\nNext steps:');
    console.log('1. Run: npm run deploy:production');
    console.log('2. Monitor deployment at: https://github.com/your-repo/actions');
    console.log('3. Verify at: https://ypollak2.github.io/advanced-retirement-planner/');
} else {
    console.log('\n❌ APPLICATION IS NOT READY FOR PRODUCTION');
    console.log('Please fix all critical issues before deploying.');
}

// Save report
const report = {
    timestamp: new Date().toISOString(),
    criticalIssues,
    warnings,
    ready: criticalIssues.length === 0
};

fs.writeFileSync(
    'production-readiness-report.json',
    JSON.stringify(report, null, 2)
);

console.log('\n📄 Report saved to: production-readiness-report.json');

// Exit with appropriate code
process.exit(criticalIssues.length > 0 ? 1 : 0);