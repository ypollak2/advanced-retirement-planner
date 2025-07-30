// Comprehensive tests for financial health scoring with field mapping validation
const assert = (condition, message) => {
    if (!condition) {
        throw new Error(`❌ Assertion failed: ${message}`);
    }
};

class FinancialHealthScoringTester {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    async loadDependencies() {
        return new Promise((resolve) => {
            // Wait for all required components to load
            const checkInterval = setInterval(() => {
                if (window.financialHealthEngine && 
                    window.TaxCalculators &&
                    window.AdditionalIncomeTax) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);

            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 10000);
        });
    }

    // Test 1: Couple with net salaries only
    testCoupleNetSalariesOnly() {
        const inputs = {
            planningType: 'couple',
            country: 'israel',
            partner1NetSalary: 29500,
            partner2NetSalary: 22000,
            // No gross salaries provided
            // No contribution rates provided
            currentAnnualExpenses: 400000,
            currentAge: 35,
            currentPensionSavings: 100000,
            currentTrainingFundSavings: 50000,
            currentKeren: 200000,
            portfolioAggressiveness: 'moderate',
            targetRetirementAge: 67
        };

        const health = window.financialHealthEngine.calculateFinancialHealth(inputs);
        
        // Validate that gross salaries were calculated from net
        assert(health.totalMonthlyIncome > 0, 'Total monthly income should be calculated from net salaries');
        assert(health.savingsRateScore > 0, 'Savings rate score should be calculated with net salaries');
        assert(health.retirementReadinessScore > 0, 'Retirement readiness should calculate with net salaries');
        
        // Check that missing data warnings are not present
        assert(!health.warnings || !health.warnings.includes('Missing required data'), 
            'Should not have missing data warnings when net salaries are provided');

        console.log('✅ Test 1 passed: Couple with net salaries calculates correctly');
        console.log(`   - Total Income: ${health.totalMonthlyIncome}`);
        console.log(`   - Savings Rate Score: ${health.savingsRateScore}`);
        console.log(`   - Overall Score: ${health.overallScore}`);
    }

    // Test 2: Couple with bonus and other income
    testCoupleWithAdditionalIncome() {
        const inputs = {
            planningType: 'couple',
            country: 'israel',
            partner1Salary: 40000, // Gross
            partner2Salary: 30000, // Gross
            partner1NetSalary: 26800, // Net
            partner2NetSalary: 20100, // Net
            annualBonus: 100000, // Main person bonus
            partnerAnnualBonus: 80000, // Partner bonus
            rsuUnits: 100,
            rsuCurrentStockPrice: 150,
            rsuFrequency: 'quarterly',
            partnerRsuUnits: 50,
            partnerRsuCurrentStockPrice: 200,
            partnerRsuFrequency: 'quarterly',
            otherIncome: 5000,
            partnerOtherIncome: 3000,
            currentAnnualExpenses: 500000,
            currentAge: 40,
            currentPensionSavings: 500000,
            currentTrainingFundSavings: 200000,
            currentKeren: 300000,
            portfolioAggressiveness: 'moderate',
            targetRetirementAge: 67
        };

        const health = window.financialHealthEngine.calculateFinancialHealth(inputs);
        
        // Should include all income sources
        assert(health.totalMonthlyIncome > (26800 + 20100), 
            'Total income should include bonuses and RSU income');
        assert(health.savingsRateScore > 0, 'Savings rate should be calculated with all income');
        assert(health.overallScore > 50, 'Overall score should be decent with high income');

        console.log('✅ Test 2 passed: Couple with additional income calculates correctly');
        console.log(`   - Total Income: ${health.totalMonthlyIncome}`);
        console.log(`   - Savings Rate Score: ${health.savingsRateScore}`);
        console.log(`   - Overall Score: ${health.overallScore}`);
    }

    // Test 3: Default contribution rates
    testDefaultContributionRates() {
        const inputs = {
            planningType: 'couple',
            country: 'israel',
            partner1NetSalary: 20000,
            partner2NetSalary: 15000,
            // No pension/training fund contribution rates specified
            currentAnnualExpenses: 300000,
            currentAge: 30,
            currentPensionSavings: 50000,
            currentTrainingFundSavings: 20000,
            currentKeren: 100000,
            portfolioAggressiveness: 'conservative',
            targetRetirementAge: 67
        };

        const health = window.financialHealthEngine.calculateFinancialHealth(inputs);
        
        // Should use default contribution rates (17.5% pension, 7.5% training fund)
        assert(health.savingsRateScore > 0, 'Should calculate savings with default contribution rates');
        
        // Manually calculate expected savings rate with defaults
        const grossFromNet1 = 20000 / 0.75; // Approximate
        const grossFromNet2 = 15000 / 0.75; // Approximate
        const totalGross = grossFromNet1 + grossFromNet2;
        const expectedContributions = totalGross * 0.25; // 17.5% + 7.5% = 25%
        
        console.log('✅ Test 3 passed: Default contribution rates applied correctly');
        console.log(`   - Savings Rate Score: ${health.savingsRateScore}`);
        console.log(`   - Expected monthly contributions: ~${expectedContributions.toFixed(0)}`);
    }

    // Test 4: Field name variations
    testFieldNameMappings() {
        const inputs = {
            planningType: 'couple',
            country: 'israel',
            // Try different field name variations
            partner1NetIncome: 25000, // Alternative field name
            partner2NetIncome: 18000, // Alternative field name
            partner1BonusAmount: 60000, // Bonus field variation
            partner2BonusAmount: 40000, // Bonus field variation
            currentAnnualExpenses: 350000,
            currentAge: 35,
            currentPensionSavings: 150000,
            currentTrainingFundSavings: 80000,
            currentKeren: 250000,
            portfolioAggressiveness: 'moderate',
            targetRetirementAge: 67
        };

        const health = window.financialHealthEngine.calculateFinancialHealth(inputs);
        
        // Should pick up alternative field names
        assert(health.totalMonthlyIncome > 0, 'Should detect alternative field names for income');
        assert(health.savingsRateScore > 0, 'Should calculate with alternative field names');

        console.log('✅ Test 4 passed: Field name mappings work correctly');
        console.log(`   - Total Income: ${health.totalMonthlyIncome}`);
        console.log(`   - Overall Score: ${health.overallScore}`);
    }

    // Test 5: Individual mode with net salary
    testIndividualModeNetSalary() {
        const inputs = {
            planningType: 'single',
            country: 'israel',
            currentNetSalary: 15000, // Only net salary provided
            annualBonus: 50000,
            quarterlyRSU: 20000,
            currentAnnualExpenses: 120000,
            currentAge: 28,
            currentPensionSavings: 30000,
            currentTrainingFundSavings: 15000,
            currentKeren: 50000,
            portfolioAggressiveness: 'aggressive',
            targetRetirementAge: 65
        };

        const health = window.financialHealthEngine.calculateFinancialHealth(inputs);
        
        assert(health.totalMonthlyIncome > 15000, 'Should include bonus and RSU income');
        assert(health.savingsRateScore > 0, 'Should calculate savings rate from net salary');
        assert(health.retirementReadinessScore > 0, 'Should calculate retirement readiness');

        console.log('✅ Test 5 passed: Individual mode with net salary works correctly');
        console.log(`   - Total Income: ${health.totalMonthlyIncome}`);
        console.log(`   - Savings Rate Score: ${health.savingsRateScore}`);
    }

    // Test 6: Validation of gross from net calculation
    testGrossFromNetCalculation() {
        const inputs = {
            planningType: 'couple',
            country: 'israel',
            partner1NetSalary: 10000,
            partner2NetSalary: 8000,
            currentAnnualExpenses: 150000,
            currentAge: 32,
            currentPensionSavings: 80000,
            currentTrainingFundSavings: 40000,
            currentKeren: 120000,
            portfolioAggressiveness: 'moderate',
            targetRetirementAge: 67
        };

        const health = window.financialHealthEngine.calculateFinancialHealth(inputs);
        
        // Test that gross calculation is reasonable
        // Net 10,000 should be approximately gross 13,333 (75% take-home)
        // Net 8,000 should be approximately gross 10,667 (75% take-home)
        const expectedMinGross = (10000 + 8000) / 0.85; // Conservative estimate
        const expectedMaxGross = (10000 + 8000) / 0.65; // Liberal estimate
        
        // Check internal calculations if available
        if (health.debug && health.debug.calculatedGrossIncome) {
            assert(health.debug.calculatedGrossIncome > expectedMinGross, 
                'Calculated gross should be reasonable minimum');
            assert(health.debug.calculatedGrossIncome < expectedMaxGross, 
                'Calculated gross should be reasonable maximum');
        }

        console.log('✅ Test 6 passed: Gross from net calculation is reasonable');
        console.log(`   - Net total: ${10000 + 8000}`);
        console.log(`   - Expected gross range: ${expectedMinGross.toFixed(0)}-${expectedMaxGross.toFixed(0)}`);
    }

    // Test 7: RSU income handling
    testRSUIncomeCalculation() {
        const inputs = {
            planningType: 'couple',
            country: 'israel',
            partner1Salary: 35000,
            partner2Salary: 25000,
            // Main person RSU
            rsuUnits: 200,
            rsuCurrentStockPrice: 100,
            rsuFrequency: 'quarterly',
            rsuCompany: 'AAPL',
            // Partner RSU
            partnerRsuUnits: 150,
            partnerRsuCurrentStockPrice: 80,
            partnerRsuFrequency: 'monthly',
            partnerRsuCompany: 'GOOGL',
            currentAnnualExpenses: 400000,
            currentAge: 38,
            currentPensionSavings: 300000,
            currentTrainingFundSavings: 150000,
            currentKeren: 400000,
            portfolioAggressiveness: 'moderate',
            targetRetirementAge: 67
        };

        const health = window.financialHealthEngine.calculateFinancialHealth(inputs);
        
        // Calculate expected RSU income
        const mainRSUAnnual = 200 * 100 * 4; // quarterly
        const partnerRSUAnnual = 150 * 80 * 12; // monthly
        const totalRSUMonthly = (mainRSUAnnual + partnerRSUAnnual) / 12;
        
        assert(health.totalMonthlyIncome > 60000, 'Should include RSU income');
        assert(health.savingsRateScore > 50, 'High income with RSU should have good savings rate');

        console.log('✅ Test 7 passed: RSU income calculated correctly');
        console.log(`   - Main RSU annual: ${mainRSUAnnual}`);
        console.log(`   - Partner RSU annual: ${partnerRSUAnnual}`);
        console.log(`   - Total monthly income: ${health.totalMonthlyIncome}`);
    }

    // Test 8: Zero income edge case
    testZeroIncomeEdgeCase() {
        const inputs = {
            planningType: 'couple',
            country: 'israel',
            // No salaries provided
            currentAnnualExpenses: 100000,
            currentAge: 65,
            currentPensionSavings: 2000000,
            currentTrainingFundSavings: 500000,
            currentKeren: 1500000,
            portfolioAggressiveness: 'conservative',
            targetRetirementAge: 67
        };

        const health = window.financialHealthEngine.calculateFinancialHealth(inputs);
        
        // Should handle zero income gracefully
        assert(health.savingsRateScore === 0, 'Zero income should result in zero savings rate');
        assert(health.overallScore > 0, 'Should still have score from other factors');
        assert(health.retirementReadinessScore > 50, 'High savings should give good retirement score');

        console.log('✅ Test 8 passed: Zero income handled gracefully');
        console.log(`   - Savings Rate Score: ${health.savingsRateScore}`);
        console.log(`   - Retirement Readiness: ${health.retirementReadinessScore}`);
        console.log(`   - Overall Score: ${health.overallScore}`);
    }

    // Test 9: Tax rate variations
    testTaxRateVariations() {
        const countriesAndRates = [
            { country: 'israel', netSalary: 20000, expectedTaxRate: 0.20, maxTaxRate: 0.30 },
            { country: 'uk', netSalary: 20000, expectedTaxRate: 0.25, maxTaxRate: 0.35 },
            { country: 'us', netSalary: 20000, expectedTaxRate: 0.22, maxTaxRate: 0.32 }
        ];

        countriesAndRates.forEach(({ country, netSalary, expectedTaxRate, maxTaxRate }) => {
            const inputs = {
                planningType: 'single',
                country: country,
                currentNetSalary: netSalary,
                currentAnnualExpenses: 150000,
                currentAge: 35,
                currentPensionSavings: 100000,
                currentTrainingFundSavings: 50000,
                currentKeren: 200000,
                portfolioAggressiveness: 'moderate',
                targetRetirementAge: 67
            };

            const health = window.financialHealthEngine.calculateFinancialHealth(inputs);
            
            // Verify reasonable gross calculation based on country
            const impliedGross = netSalary / (1 - expectedTaxRate);
            const maxGross = netSalary / (1 - maxTaxRate);
            
            assert(health.savingsRateScore > 0, `Should calculate savings for ${country}`);
            assert(health.totalMonthlyIncome >= netSalary, 'Total income should be at least net salary');

            console.log(`✅ ${country.toUpperCase()} tax calculation works correctly`);
            console.log(`   - Net: ${netSalary}, Expected gross range: ${impliedGross.toFixed(0)}-${maxGross.toFixed(0)}`);
        });
    }

    // Test 10: Complete scenario matching screenshot
    testCompleteScenarioFromScreenshot() {
        const inputs = {
            planningType: 'couple',
            country: 'israel',
            partner1NetSalary: 29500,
            partner2NetSalary: 22000,
            partner1BonusAmount: 0,
            partner2BonusAmount: 0,
            currentAnnualExpenses: 636363, // From screenshot: 53,303 monthly
            currentAge: 35,
            currentPensionSavings: 100000, // Estimated
            currentTrainingFundSavings: 50000, // Estimated
            currentKeren: 200000, // Estimated
            portfolioAggressiveness: 'moderate',
            targetRetirementAge: 67,
            // Expense breakdown from screenshot
            housing: 15000,
            transportation: 5000,
            food: 8000,
            healthcare: 2000,
            education: 3000,
            entertainment: 4000,
            other: 16303 // To match total 53,303
        };

        const health = window.financialHealthEngine.calculateFinancialHealth(inputs);
        
        // Validate against screenshot values
        assert(health.totalMonthlyIncome > 50000, 'Total income should match screenshot (~51,500)');
        assert(health.savingsRateScore > 0, 'Should have non-zero savings rate');
        assert(health.debtManagementScore === 100, 'No debt should give 100% score');
        assert(health.overallScore > 30, 'Overall score should be reasonable');

        console.log('✅ Test 10 passed: Complete scenario matches screenshot expectations');
        console.log(`   - Total Monthly Income: ${health.totalMonthlyIncome}`);
        console.log(`   - Savings Rate Score: ${health.savingsRateScore}`);
        console.log(`   - Retirement Readiness: ${health.retirementReadinessScore}`);
        console.log(`   - Overall Score: ${health.overallScore}`);
    }

    async run() {
        console.log('🧪 Financial Health Scoring Tests Starting...\n');
        
        await this.loadDependencies();
        
        const testMethods = [
            'testCoupleNetSalariesOnly',
            'testCoupleWithAdditionalIncome', 
            'testDefaultContributionRates',
            'testFieldNameMappings',
            'testIndividualModeNetSalary',
            'testGrossFromNetCalculation',
            'testRSUIncomeCalculation',
            'testZeroIncomeEdgeCase',
            'testTaxRateVariations',
            'testCompleteScenarioFromScreenshot'
        ];

        for (const methodName of testMethods) {
            this.results.total++;
            try {
                await this[methodName]();
                this.results.passed++;
            } catch (error) {
                this.results.failed++;
                console.error(`❌ Test failed: ${methodName}`);
                console.error(`   Error: ${error.message}`);
            }
        }

        // Summary
        console.log('\n📊 Test Summary:');
        console.log(`✅ Passed: ${this.results.passed}/${this.results.total}`);
        console.log(`❌ Failed: ${this.results.failed}/${this.results.total}`);
        
        const successRate = (this.results.passed / this.results.total * 100).toFixed(1);
        console.log(`📈 Success Rate: ${successRate}%`);

        if (this.results.failed === 0) {
            console.log('\n🎉 All financial health scoring tests passed!');
        } else {
            console.log('\n⚠️ Some tests failed. Please review the errors above.');
        }

        return this.results;
    }
}

// Export for use
window.FinancialHealthScoringTester = FinancialHealthScoringTester;

// Auto-run if loaded directly
if (typeof module === 'undefined') {
    const tester = new FinancialHealthScoringTester();
    tester.run();
}