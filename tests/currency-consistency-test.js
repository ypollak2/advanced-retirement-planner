#!/usr/bin/env node

/**
 * Currency Consistency Test Suite
 * Verifies that currency changes propagate throughout the application
 * Tests that all money values update when currency is changed
 */

const fs = require('fs');
const path = require('path');

class CurrencyConsistencyTester {
    constructor() {
        this.testsPassed = 0;
        this.testsFailed = 0;
        this.results = [];
    }

    log(message, type = 'info') {
        const prefix = {
            info: '📋',
            pass: '✅',
            fail: '❌', 
            warn: '⚠️'
        }[type];
        console.log(`${prefix} ${message}`);
        this.results.push({ message, type });
    }

    async runTest(testName, testFn) {
        try {
            await testFn();
            this.testsPassed++;
            this.log(`${testName}: PASSED`, 'pass');
        } catch (error) {
            this.testsFailed++;
            this.log(`${testName}: FAILED - ${error.message}`, 'fail');
        }
    }

    // Test 1: CurrencyValue Component Implementation
    testCurrencyValueComponent() {
        const appPath = path.join(__dirname, '../src/components/core/RetirementPlannerApp.js');
        const appContent = fs.readFileSync(appPath, 'utf8');
        
        // Check for CurrencyValue component
        if (!appContent.includes('function CurrencyValue')) {
            throw new Error('CurrencyValue component not found');
        }

        // Check for proper currency symbol mapping
        if (!appContent.includes("'GBP': '£'")) {
            throw new Error('GBP currency symbol not properly mapped');
        }

        // Check for fallback rates
        if (!appContent.includes("'GBP': 0.22")) {
            throw new Error('GBP fallback rate not found');
        }

        // Check for useEffect dependency on currency
        if (!appContent.includes('[value, currency]')) {
            throw new Error('CurrencyValue component missing currency dependency');
        }
    }

    // Test 2: Currency Parameter Propagation
    testCurrencyParameterPropagation() {
        const files = [
            '../src/components/panels/summary/SummaryPanel.js',
            '../src/components/StressTestInterface.js',
            '../src/components/charts/DynamicPartnerCharts.js',
            '../src/components/charts/FinancialChart.js',
            '../src/components/panels/RetirementResultsPanel.js'
        ];

        for (const file of files) {
            const filePath = path.join(__dirname, file);
            if (!fs.existsSync(filePath)) continue;
            
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check if component accepts workingCurrency parameter
            if (!content.includes('workingCurrency')) {
                throw new Error(`${file} missing workingCurrency parameter`);
            }
        }
    }

    // Test 3: Hardcoded Currency Symbol Check
    testNoHardcodedCurrencySymbols() {
        const componentDir = path.join(__dirname, '../src/components');
        const files = fs.readdirSync(componentDir).filter(f => f.endsWith('.js'));
        
        const problematicFiles = [];
        
        for (const file of files) {
            const filePath = path.join(componentDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Look for hardcoded ₪ symbols in formatCurrency calls or fallbacks
            const hardcodedMatches = content.match(/formatCurrency[^}]*\`₪/g) || 
                                   content.match(/[^'"]₪[^'"]/g) ||
                                   content.match(/\+ '₪'/g);
                                   
            if (hardcodedMatches && hardcodedMatches.length > 0) {
                // Filter out acceptable patterns (like in currency symbol maps)
                const acceptablePatterns = [
                    "'ILS': '₪'",
                    '"ILS": "₪"',
                    'symbols = {',
                    'currencySymbol ='
                ];
                
                const problematicMatches = hardcodedMatches.filter(match => 
                    !acceptablePatterns.some(pattern => content.includes(pattern) && 
                        content.indexOf(match) > content.indexOf(pattern) - 100 &&
                        content.indexOf(match) < content.indexOf(pattern) + 100)
                );
                
                if (problematicMatches.length > 0) {
                    problematicFiles.push({ file, matches: problematicMatches });
                }
            }
        }
        
        if (problematicFiles.length > 0) {
            throw new Error(`Hardcoded ₪ symbols found in: ${problematicFiles.map(f => f.file).join(', ')}`);
        }
    }

    // Test 4: Chart Components Currency Integration
    testChartCurrencyIntegration() {
        const chartFiles = [
            '../src/components/charts/FinancialChart.js',
            '../src/components/charts/DynamicPartnerCharts.js'
        ];

        for (const file of chartFiles) {
            const filePath = path.join(__dirname, file);
            if (!fs.existsSync(filePath)) continue;
            
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for dynamic currency symbol usage in charts
            if (!content.includes('getCurrencySymbol') && !content.includes('workingCurrency')) {
                throw new Error(`${file} charts not using dynamic currency symbols`);
            }
        }
    }

    // Test 5: Dashboard Currency Parameter Passing
    testDashboardCurrencyPassing() {
        const dashboardPath = path.join(__dirname, '../src/components/core/Dashboard.js');
        const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
        
        // Check that Dashboard receives workingCurrency
        if (!dashboardContent.includes('workingCurrency')) {
            throw new Error('Dashboard component not receiving workingCurrency parameter');
        }

        // Check that it doesn't maintain its own selectedCurrency state
        if (dashboardContent.includes('selectedCurrency')) {
            throw new Error('Dashboard still has local selectedCurrency state instead of using workingCurrency');
        }
    }

    // Test 6: Version Consistency with Currency Features
    testVersionConsistency() {
        const versionPath = path.join(__dirname, '../src/version.js');
        const versionContent = fs.readFileSync(versionPath, 'utf8');
        
        // Extract version
        const versionMatch = versionContent.match(/number:\s*["']([^"']+)["']/);
        if (!versionMatch) {
            throw new Error('Could not extract version from version.js');
        }
        
        const version = versionMatch[1];
        
        // Check package.json version matches
        const packagePath = path.join(__dirname, '../package.json');
        const packageContent = fs.readFileSync(packagePath, 'utf8');
        const packageData = JSON.parse(packageContent);
        
        if (packageData.version !== version) {
            throw new Error(`Version mismatch: version.js(${version}) vs package.json(${packageData.version})`);
        }
    }

    async runAllTests() {
        this.log('🚀 Starting Currency Consistency Test Suite', 'info');
        
        await this.runTest('CurrencyValue Component Implementation', () => this.testCurrencyValueComponent());
        await this.runTest('Currency Parameter Propagation', () => this.testCurrencyParameterPropagation());
        await this.runTest('No Hardcoded Currency Symbols', () => this.testNoHardcodedCurrencySymbols());
        await this.runTest('Chart Components Currency Integration', () => this.testChartCurrencyIntegration());
        await this.runTest('Dashboard Currency Parameter Passing', () => this.testDashboardCurrencyPassing());
        await this.runTest('Version Consistency', () => this.testVersionConsistency());
        
        // Summary
        this.log(`\n📊 Test Results Summary:`, 'info');
        this.log(`Tests Passed: ${this.testsPassed}`, 'pass');
        this.log(`Tests Failed: ${this.testsFailed}`, this.testsFailed > 0 ? 'fail' : 'pass');
        this.log(`Success Rate: ${Math.round((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100)}%`, 'info');
        
        if (this.testsFailed > 0) {
            this.log('\n❌ CURRENCY CONSISTENCY TESTS FAILED', 'fail');
            process.exit(1);
        } else {
            this.log('\n✅ ALL CURRENCY CONSISTENCY TESTS PASSED', 'pass');
        }
        
        return this.testsFailed === 0;
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new CurrencyConsistencyTester();
    tester.runAllTests().catch(error => {
        console.error('❌ Test suite crashed:', error);
        process.exit(1);
    });
}

module.exports = CurrencyConsistencyTester;