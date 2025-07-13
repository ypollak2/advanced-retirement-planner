// RSU (Restricted Stock Units) Feature Tests
// Tests for RSU input section, company selection, and integration

const fs = require('fs');

class RSUFeatureTests {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
    }

    logTest(testName, passed, message = '') {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        const timestamp = new Date().toLocaleTimeString();
        
        console.log(`[${timestamp}] ${status} ${testName}`);
        if (message) console.log(`    ${message}`);
        
        this.testResults.push({
            testName,
            passed,
            message,
            timestamp
        });

        if (passed) {
            this.passedTests++;
        } else {
            this.failedTests++;
        }
    }

    // Test 1: RSU Section Exists
    testRSUSectionExists() {
        console.log('\\n📈 Testing RSU Section Existence...\\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Check for RSU section
            const hasRSUSection = content.includes('RSU') && 
                                content.includes('Restricted Stock Units') &&
                                content.includes('rsu-section');
            this.logTest('RSU section exists', hasRSUSection, 
                hasRSUSection ? 'RSU section found in application' : 'RSU section not found');

            // Check for RSU Hebrew translation
            const hasHebrewRSU = content.includes('יחידות מניה מוגבלות');
            this.logTest('RSU Hebrew translation', hasHebrewRSU, 
                hasHebrewRSU ? 'Hebrew RSU translation present' : 'Hebrew RSU translation missing');
        }
    }

    // Test 2: Company Selection Dropdown
    testCompanySelection() {
        console.log('\\n🏢 Testing Company Selection...\\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Check for major tech companies
            const companies = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA'];
            const missingCompanies = [];
            
            companies.forEach(company => {
                if (!content.includes(company)) {
                    missingCompanies.push(company);
                }
            });

            const allCompaniesPresent = missingCompanies.length === 0;
            this.logTest('Major tech companies in dropdown', allCompaniesPresent,
                allCompaniesPresent ? 'All major tech companies included' : `Missing: ${missingCompanies.join(', ')}`);

            // Check for company selection input
            const hasCompanySelect = content.includes('rsuCompany') && content.includes('select');
            this.logTest('Company selection input', hasCompanySelect,
                hasCompanySelect ? 'Company selection dropdown implemented' : 'Company selection missing');

            // Check for "Other" option
            const hasOtherOption = content.includes('OTHER') || content.includes('אחר');
            this.logTest('Other company option', hasOtherOption,
                hasOtherOption ? 'Other company option available' : 'Other company option missing');
        }
    }

    // Test 3: RSU Input Fields
    testRSUInputFields() {
        console.log('\\n📝 Testing RSU Input Fields...\\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Required RSU fields
            const requiredFields = [
                'rsuCompany',
                'rsuUnits', 
                'rsuCurrentPrice',
                'rsuVestingYears',
                'rsuTaxCountry',
                'rsuExpectedGrowth'
            ];

            let allFieldsFound = true;
            const missingFields = [];

            requiredFields.forEach(field => {
                if (!content.includes(field)) {
                    allFieldsFound = false;
                    missingFields.push(field);
                }
            });

            this.logTest('RSU input fields complete', allFieldsFound,
                allFieldsFound ? 'All 6 RSU input fields found' : `Missing fields: ${missingFields.join(', ')}`);

            // Check field types
            const hasNumberInputs = content.includes('rsuUnits') && content.includes("type: 'number'") &&
                                  content.includes('rsuCurrentPrice') && content.includes("step: '0.01'");
            this.logTest('RSU number input validation', hasNumberInputs,
                hasNumberInputs ? 'Number inputs with proper validation' : 'Number input validation issues');

            // Check vesting period options
            const vestingOptions = ['1', '2', '3', '4', '5'];
            const hasVestingOptions = vestingOptions.every(option => 
                content.includes(`value: ${option}`) || content.includes(`value=${option}`)
            );
            this.logTest('Vesting period options', hasVestingOptions,
                hasVestingOptions ? 'All vesting period options (1-5 years) available' : 'Vesting period options incomplete');
        }
    }

    // Test 4: Tax Country Support
    testRSUTaxCountrySupport() {
        console.log('\\n💼 Testing RSU Tax Country Support...\\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Check for RSU tax country selection
            const hasRSUTaxCountry = content.includes('rsuTaxCountry');
            this.logTest('RSU tax country field', hasRSUTaxCountry,
                hasRSUTaxCountry ? 'RSU tax country selection available' : 'RSU tax country field missing');

            // Check for Israel and US options (main RSU markets)
            const hasIsraelOption = content.includes('rsu-israel') && content.includes('ישראל');
            const hasUSOption = content.includes('rsu-us') && content.includes('ארה״ב');
            
            this.logTest('Israel RSU tax option', hasIsraelOption,
                hasIsraelOption ? 'Israel RSU taxation option available' : 'Israel RSU option missing');
            
            this.logTest('US RSU tax option', hasUSOption,
                hasUSOption ? 'US RSU taxation option available' : 'US RSU option missing');

            // Check default value
            const hasDefaultTaxCountry = content.includes("rsuTaxCountry || 'israel'");
            this.logTest('RSU tax country default', hasDefaultTaxCountry,
                hasDefaultTaxCountry ? 'Default RSU tax country set to Israel' : 'No default RSU tax country');
        }
    }

    // Test 5: RSU UI Design and Integration
    testRSUUIDesign() {
        console.log('\\n🎨 Testing RSU UI Design...\\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Check for consistent styling
            const hasConsistentStyling = content.includes('bg-indigo-50') && 
                                       content.includes('border-indigo-200') &&
                                       content.includes('text-indigo-700');
            this.logTest('RSU section styling', hasConsistentStyling,
                hasConsistentStyling ? 'Consistent indigo theme for RSU section' : 'RSU styling inconsistent');

            // Check for RSU icon
            const hasRSUIcon = content.includes('📈');
            this.logTest('RSU section icon', hasRSUIcon,
                hasRSUIcon ? 'RSU section has appropriate icon' : 'RSU icon missing');

            // Check for responsive grid
            const hasResponsiveGrid = content.includes('grid-cols-1 md:grid-cols-2');
            this.logTest('RSU responsive layout', hasResponsiveGrid,
                hasResponsiveGrid ? 'RSU inputs use responsive grid layout' : 'RSU layout not responsive');

            // Check for info section
            const hasInfoSection = content.includes('rsu-info') && 
                                  content.includes('bg-indigo-100') &&
                                  content.includes('tech company benefits');
            this.logTest('RSU information section', hasInfoSection,
                hasInfoSection ? 'Informative RSU description provided' : 'RSU info section missing');
        }
    }

    // Test 6: RSU Integration with Form
    testRSUFormIntegration() {
        console.log('\\n🔗 Testing RSU Form Integration...\\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Check RSU section is properly placed in form
            const rsuSectionIndex = content.indexOf('rsu-section');
            const formEndIndex = content.indexOf(']);', rsuSectionIndex);
            
            const isProperlyIntegrated = rsuSectionIndex > 0 && formEndIndex > rsuSectionIndex;
            this.logTest('RSU form integration', isProperlyIntegrated,
                isProperlyIntegrated ? 'RSU section properly integrated in form' : 'RSU section integration issues');

            // Check for proper input state management
            const hasStateManagement = content.includes('setInputs({...inputs, rsu');
            this.logTest('RSU state management', hasStateManagement,
                hasStateManagement ? 'RSU inputs connected to state management' : 'RSU state management missing');

            // Check for proper key attributes
            const hasProperKeys = content.includes('key: \'rsu-') && 
                                content.includes('key: \'rsu-company\'') &&
                                content.includes('key: \'rsu-units\'');
            this.logTest('RSU React keys', hasProperKeys,
                hasProperKeys ? 'Proper React keys for RSU elements' : 'RSU React key issues');
        }
    }

    // Test 7: Stock Price API Integration
    testStockPriceAPI() {
        console.log('\\n📊 Testing Stock Price API Integration...\\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Check for fetchStockPrice function
            const hasFetchFunction = content.includes('fetchStockPrice') && 
                                   content.includes('async (symbol)');
            this.logTest('Stock price fetch function', hasFetchFunction,
                hasFetchFunction ? 'Stock price API function implemented' : 'Stock price API function missing');

            // Check for Yahoo Finance API integration
            const hasYahooAPI = content.includes('query1.finance.yahoo.com');
            this.logTest('Yahoo Finance API integration', hasYahooAPI,
                hasYahooAPI ? 'Yahoo Finance API integrated' : 'Yahoo Finance API missing');

            // Check for fallback prices
            const hasFallbackPrices = content.includes('fallbackPrices') && 
                                    content.includes('AAPL') && 
                                    content.includes('190.50');
            this.logTest('Fallback stock prices', hasFallbackPrices,
                hasFallbackPrices ? 'Fallback prices available for offline mode' : 'Fallback prices missing');

            // Check for auto-fetch on company selection
            const hasAutoFetch = content.includes('onChange: async (e)') && 
                               content.includes('await fetchStockPrice');
            this.logTest('Auto-fetch on company selection', hasAutoFetch,
                hasAutoFetch ? 'Stock prices auto-fetch when company selected' : 'Auto-fetch functionality missing');
        }
    }

    // Test 8: RSU Taxation Logic
    testRSUTaxationLogic() {
        console.log('\\n💰 Testing RSU Taxation Logic...\\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Check for taxation function
            const hasTaxFunction = content.includes('calculateRSUTaxes') && 
                                 content.includes('(rsuValue, taxCountry, income)');
            this.logTest('RSU taxation function', hasTaxFunction,
                hasTaxFunction ? 'RSU taxation calculation function exists' : 'RSU taxation function missing');

            // Check for Israeli tax logic
            const hasIsraeliTax = content.includes("taxCountry === 'israel'") && 
                                content.includes('marginalRate') &&
                                content.includes('nationalInsurance');
            this.logTest('Israeli RSU taxation', hasIsraeliTax,
                hasIsraeliTax ? 'Israeli RSU tax logic implemented' : 'Israeli RSU tax logic missing');

            // Check for US tax logic
            const hasUSTax = content.includes("taxCountry === 'us'") && 
                           content.includes('federalRate') &&
                           content.includes('socialSecurity');
            this.logTest('US RSU taxation', hasUSTax,
                hasUSTax ? 'US RSU tax logic implemented' : 'US RSU tax logic missing');

            // Check for RSU projections
            const hasProjections = content.includes('calculateRSUProjections') && 
                                  content.includes('vestingYears') &&
                                  content.includes('annualGrowthRate');
            this.logTest('RSU projections calculation', hasProjections,
                hasProjections ? 'RSU projection calculations implemented' : 'RSU projections missing');
        }
    }

    // Test 9: RSU Results Display
    testRSUResultsDisplay() {
        console.log('\\n📈 Testing RSU Results Display...\\n');
        
        const appMainPath = 'src/core/app-main.js';
        if (fs.existsSync(appMainPath)) {
            const content = fs.readFileSync(appMainPath, 'utf8');
            
            // Check for RSU results section
            const hasResultsSection = content.includes('rsu-results') && 
                                    content.includes('RSU Projections') &&
                                    content.includes('תחזית RSU');
            this.logTest('RSU results section', hasResultsSection,
                hasResultsSection ? 'RSU results display section implemented' : 'RSU results section missing');

            // Check for all result metrics
            const hasAllMetrics = content.includes('Gross Value') && 
                                content.includes('Net Value') &&
                                content.includes('Taxes') &&
                                content.includes('Total Units');
            this.logTest('RSU result metrics', hasAllMetrics,
                hasAllMetrics ? 'All RSU metrics displayed (gross, net, taxes, units)' : 'Some RSU metrics missing');

            // Check for tax information
            const hasTaxInfo = content.includes('Tax calculation based on') && 
                             content.includes('Effective tax rate');
            this.logTest('RSU tax information', hasTaxInfo,
                hasTaxInfo ? 'Tax calculation information displayed' : 'Tax information missing');

            // Check for conditional display
            const hasConditionalDisplay = content.includes('inputs.rsuCompany && inputs.rsuUnits && inputs.rsuCurrentPrice');
            this.logTest('RSU conditional display', hasConditionalDisplay,
                hasConditionalDisplay ? 'RSU results show only when inputs provided' : 'RSU conditional display missing');
        }
    }

    // Run all RSU feature tests
    async runRSUFeatureTests() {
        console.log('📈 RSU Feature Test Suite');
        console.log('========================');
        console.log('🔍 Testing Restricted Stock Units functionality\\n');

        this.testRSUSectionExists();
        this.testCompanySelection();
        this.testRSUInputFields();
        this.testRSUTaxCountrySupport();
        this.testRSUUIDesign();
        this.testRSUFormIntegration();
        this.testStockPriceAPI();
        this.testRSUTaxationLogic();
        this.testRSUResultsDisplay();

        return this.generateReport();
    }

    generateReport() {
        const totalTests = this.passedTests + this.failedTests;
        const successRate = totalTests > 0 ? (this.passedTests / totalTests * 100).toFixed(1) : 0;
        
        console.log('\\n📈 RSU Feature Test Results:');
        console.log('=============================');
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${this.passedTests}`);
        console.log(`Failed: ${this.failedTests}`);
        console.log(`Success Rate: ${successRate}%`);

        if (this.failedTests > 0) {
            console.log('\\n❌ Failed Tests:');
            this.testResults
                .filter(result => !result.passed)
                .forEach(result => {
                    console.log(`   - ${result.testName}: ${result.message}`);
                });
        }

        const overallRating = this.calculateRating(successRate);
        console.log(`\\n🎯 Overall Rating: ${overallRating}`);

        return {
            passed: this.passedTests,
            failed: this.failedTests,
            total: totalTests,
            successRate: parseFloat(successRate),
            rating: overallRating
        };
    }

    calculateRating(successRate) {
        if (successRate >= 95) return '🚀 EXCELLENT';
        if (successRate >= 85) return '✅ GOOD';
        if (successRate >= 70) return '⚠️ ACCEPTABLE';
        return '❌ NEEDS IMPROVEMENT';
    }
}

// Run tests if called directly
if (require.main === module) {
    const rsuTests = new RSUFeatureTests();
    rsuTests.runRSUFeatureTests().then(results => {
        process.exit(results.failed > 0 ? 1 : 0);
    });
}

module.exports = RSUFeatureTests;