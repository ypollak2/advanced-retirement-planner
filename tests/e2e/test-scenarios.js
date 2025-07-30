// Test Scenarios for Production E2E Tests
// Each test function is called with 'this' bound to the TestEngine instance

window.testScenarios = {
    // Test 1: Complete wizard flow - happy path
    test1: async function() {
        await this.logStep('Navigate to planning type selection', async () => {
            await this.assertElementExists('[data-value="couple"]', 'Planning type selector not found');
            await this.click('[data-value="couple"]');
        });

        await this.logStep('Enter user names', async () => {
            await this.setInputValue('input[name="userName"]', 'John Doe');
            await this.setInputValue('input[name="partnerName"]', 'Jane Doe');
            await this.click('button:contains("Next")');
        });

        await this.logStep('Select country and ages', async () => {
            await this.click('[data-country="israel"]');
            await this.setInputValue('input[name="currentAge"]', '35');
            await this.setInputValue('input[name="partnerAge"]', '33');
            await this.setInputValue('input[name="targetRetirementAge"]', '67');
            await this.setInputValue('input[name="partnerTargetRetirementAge"]', '67');
            await this.click('button:contains("Next")');
        });

        await this.logStep('Enter salaries', async () => {
            await this.setInputValue('input[name="partner1Salary"]', '40000');
            await this.setInputValue('input[name="partner2Salary"]', '30000');
            await this.sleep(500); // Wait for net salary calculation
            
            const partner1Net = await this.waitForElement('input[name="partner1NetSalary"]');
            this.assertGreaterThan(parseInt(partner1Net.value), 20000, 'Partner 1 net salary calculation failed');
            
            await this.click('button:contains("Next")');
        });

        await this.logStep('Navigate through remaining steps', async () => {
            // Step through expenses, savings, contributions, etc.
            for (let i = 0; i < 5; i++) {
                await this.sleep(500);
                await this.click('button:contains("Next")');
            }
        });

        await this.logStep('Verify results displayed', async () => {
            await this.assertElementExists('.financial-health-score', 'Financial health score not displayed');
            const scores = await this.getFinancialHealthScores();
            this.assert(Object.keys(scores).length > 0, 'No scores found in results');
        });
    },

    // Test 2: Skip optional steps validation
    test2: async function() {
        await this.logStep('Select individual planning', async () => {
            await this.click('[data-value="individual"]');
            await this.click('button:contains("Next")');
        });

        await this.logStep('Fill minimum required fields', async () => {
            await this.setInputValue('input[name="currentAge"]', '40');
            await this.setInputValue('input[name="targetRetirementAge"]', '65');
            await this.click('button:contains("Next")');
            
            await this.setInputValue('input[name="currentMonthlySalary"]', '25000');
            await this.click('button:contains("Next")');
        });

        await this.logStep('Skip optional steps', async () => {
            // Skip expenses (should use defaults)
            await this.click('button:contains("Skip")');
            
            // Skip additional income
            await this.click('button:contains("Skip")');
            
            // Skip investment preferences
            await this.click('button:contains("Skip")');
        });

        await this.logStep('Verify calculation still works', async () => {
            await this.assertElementExists('.results-panel', 'Results not displayed after skipping steps');
            const totalIncome = await this.getText('.total-income-value');
            this.assertContains(totalIncome, '25', 'Income calculation failed');
        });
    },

    // Test 3: Back/forward navigation persistence
    test3: async function() {
        const testData = {
            salary: '35000',
            age: '30',
            expenses: '15000'
        };

        await this.logStep('Enter data in first few steps', async () => {
            await this.click('[data-value="individual"]');
            await this.click('button:contains("Next")');
            
            await this.setInputValue('input[name="currentAge"]', testData.age);
            await this.click('button:contains("Next")');
            
            await this.setInputValue('input[name="currentMonthlySalary"]', testData.salary);
            await this.click('button:contains("Next")');
            
            await this.setInputValue('input[name="housing"]', testData.expenses);
        });

        await this.logStep('Navigate backwards', async () => {
            await this.click('button:contains("Previous")');
            await this.sleep(300);
            await this.click('button:contains("Previous")');
        });

        await this.logStep('Verify data persisted', async () => {
            const ageInput = await this.waitForElement('input[name="currentAge"]');
            this.assertEquals(ageInput.value, testData.age, 'Age data not persisted');
            
            await this.click('button:contains("Next")');
            const salaryInput = await this.waitForElement('input[name="currentMonthlySalary"]');
            this.assertEquals(salaryInput.value, testData.salary, 'Salary data not persisted');
            
            await this.click('button:contains("Next")');
            const expenseInput = await this.waitForElement('input[name="housing"]');
            this.assertEquals(expenseInput.value, testData.expenses, 'Expense data not persisted');
        });
    },

    // Test 4: Browser refresh mid-wizard
    test4: async function() {
        await this.logStep('Progress to step 3', async () => {
            await this.click('[data-value="couple"]');
            await this.setInputValue('input[name="userName"]', 'Test User');
            await this.click('button:contains("Next")');
            
            await this.setInputValue('input[name="currentAge"]', '45');
            await this.click('button:contains("Next")');
            
            await this.setInputValue('input[name="partner1Salary"]', '50000');
        });

        await this.logStep('Check localStorage before refresh', async () => {
            const savedProgress = this.getLocalStorage('retirementWizardProgress');
            this.assert(savedProgress !== null, 'Progress not saved to localStorage');
            const progress = JSON.parse(savedProgress);
            this.assertEquals(progress.currentStep, 3, 'Wrong step saved');
        });

        await this.logStep('Refresh browser', async () => {
            await this.reloadApp();
            await this.sleep(2000); // Give app time to restore state
        });

        await this.logStep('Verify wizard restored to correct step', async () => {
            const currentStep = await this.getCurrentStep();
            this.assertEquals(currentStep, 3, 'Wizard not restored to correct step');
            
            const salaryInput = await this.waitForElement('input[name="partner1Salary"]');
            this.assertEquals(salaryInput.value, '50000', 'Form data not restored after refresh');
        });
    },

    // Test 5: Clear progress functionality
    test5: async function() {
        await this.logStep('Create some progress', async () => {
            await this.click('[data-value="individual"]');
            await this.click('button:contains("Next")');
            await this.setInputValue('input[name="currentAge"]', '50');
            await this.click('button:contains("Next")');
        });

        await this.logStep('Verify progress saved', async () => {
            const saved = this.getLocalStorage('retirementWizardProgress');
            this.assert(saved !== null, 'Progress not saved');
        });

        await this.logStep('Clear progress', async () => {
            await this.click('button:contains("Clear Progress")');
            await this.sleep(500);
            
            // Confirm if there's a confirmation dialog
            const confirmBtn = await this.elementExists('button:contains("Confirm")');
            if (confirmBtn) {
                await this.click('button:contains("Confirm")');
            }
        });

        await this.logStep('Verify progress cleared', async () => {
            const saved = this.getLocalStorage('retirementWizardProgress');
            this.assert(saved === null || JSON.parse(saved).currentStep === 1, 'Progress not cleared');
            
            // Should be back at step 1
            await this.assertElementExists('[data-value="individual"]', 'Not returned to step 1');
        });
    },

    // Test 6: Negative numbers handling
    test6: async function() {
        await this.logStep('Navigate to salary input', async () => {
            await this.click('[data-value="individual"]');
            await this.click('button:contains("Next")');
            await this.setInputValue('input[name="currentAge"]', '35');
            await this.click('button:contains("Next")');
        });

        await this.logStep('Try entering negative salary', async () => {
            await this.setInputValue('input[name="currentMonthlySalary"]', '-5000');
            await this.sleep(300);
        });

        await this.logStep('Verify validation error', async () => {
            const errorExists = await this.elementExists('.error-message, .text-red-500');
            this.assert(errorExists, 'No error message for negative salary');
            
            // Try to proceed
            const nextBtn = await this.waitForElement('button:contains("Next")');
            const isDisabled = nextBtn.disabled || nextBtn.classList.contains('disabled');
            this.assert(isDisabled, 'Next button not disabled with invalid input');
        });

        await this.logStep('Verify negative values in savings', async () => {
            await this.setInputValue('input[name="currentMonthlySalary"]', '30000');
            await this.click('button:contains("Next")');
            await this.click('button:contains("Next")'); // Skip expenses
            
            await this.setInputValue('input[name="currentPensionSavings"]', '-10000');
            const savingsError = await this.elementExists('.error-message, .text-red-500');
            this.assert(savingsError, 'No error for negative savings');
        });
    },

    // Test 7: Extreme values (billions)
    test7: async function() {
        await this.logStep('Enter extreme salary values', async () => {
            await this.click('[data-value="couple"]');
            await this.click('button:contains("Next")');
            await this.click('button:contains("Next")'); // Skip names
            
            await this.setInputValue('input[name="partner1Salary"]', '999999999');
            await this.setInputValue('input[name="partner2Salary"]', '888888888');
            await this.sleep(500);
        });

        await this.logStep('Verify calculations handle large numbers', async () => {
            const netSalary1 = await this.waitForElement('input[name="partner1NetSalary"]');
            const netValue = parseInt(netSalary1.value);
            this.assertGreaterThan(netValue, 100000000, 'Net salary calculation failed for large numbers');
            this.assert(!isNaN(netValue), 'Net salary is NaN');
        });

        await this.logStep('Test extreme portfolio values', async () => {
            await this.click('button:contains("Next")');
            await this.click('button:contains("Next")'); // Skip expenses
            
            await this.setInputValue('input[name="currentKeren"]', '50000000000'); // 50 billion
            await this.setInputValue('input[name="currentRealEstate"]', '100000000000'); // 100 billion
        });

        await this.logStep('Verify no overflow in calculations', async () => {
            // Continue to results
            for (let i = 0; i < 4; i++) {
                await this.click('button:contains("Next")');
                await this.sleep(300);
            }
            
            await this.assertElementExists('.financial-health-score', 'Results not displayed');
            const scoreText = await this.getText('.overall-score');
            this.assert(!scoreText.includes('Infinity'), 'Infinity found in calculations');
            this.assert(!scoreText.includes('NaN'), 'NaN found in calculations');
        });
    },

    // Test 8: Zero/invalid age values
    test8: async function() {
        await this.logStep('Test age = 0', async () => {
            await this.click('[data-value="individual"]');
            await this.click('button:contains("Next")');
            
            await this.setInputValue('input[name="currentAge"]', '0');
            await this.sleep(300);
            
            const ageError = await this.elementExists('.error-message, .text-red-500');
            this.assert(ageError, 'No error for age = 0');
        });

        await this.logStep('Test retirement age < current age', async () => {
            await this.setInputValue('input[name="currentAge"]', '50');
            await this.setInputValue('input[name="targetRetirementAge"]', '45');
            await this.sleep(300);
            
            const retirementError = await this.elementExists('.error-message, .text-red-500');
            this.assert(retirementError, 'No error for retirement age < current age');
        });

        await this.logStep('Test age > 120', async () => {
            await this.setInputValue('input[name="currentAge"]', '150');
            await this.sleep(300);
            
            const maxAgeError = await this.elementExists('.error-message, .text-red-500');
            this.assert(maxAgeError, 'No error for age > 120');
        });
    },

    // Test 9: Special characters rejection
    test9: async function() {
        await this.logStep('Test special characters in numeric fields', async () => {
            await this.click('[data-value="individual"]');
            await this.click('button:contains("Next")');
            
            await this.setInputValue('input[name="currentAge"]', '35abc');
            await this.sleep(300);
            
            const ageInput = await this.waitForElement('input[name="currentAge"]');
            const ageValue = ageInput.value;
            this.assert(!isNaN(parseInt(ageValue)), 'Non-numeric characters not filtered');
        });

        await this.logStep('Test special characters in salary', async () => {
            await this.setInputValue('input[name="currentAge"]', '35');
            await this.click('button:contains("Next")');
            
            await this.setInputValue('input[name="currentMonthlySalary"]', '$50,000.00');
            await this.sleep(300);
            
            const salaryInput = await this.waitForElement('input[name="currentMonthlySalary"]');
            const salaryValue = parseInt(salaryInput.value);
            this.assert(!isNaN(salaryValue), 'Special characters not handled in salary');
        });

        await this.logStep('Test emoji and unicode in name fields', async () => {
            await this.reloadApp();
            await this.click('[data-value="couple"]');
            
            await this.setInputValue('input[name="userName"]', 'Test 😀 User 🚀');
            await this.setInputValue('input[name="partnerName"]', '测试用户');
            await this.click('button:contains("Next")');
            
            // Should accept unicode in name fields
            await this.assertElementExists('input[name="currentAge"]', 'Failed to proceed with unicode names');
        });
    },

    // Test 10: Expense limits (>75k)
    test10: async function() {
        await this.logStep('Navigate to expenses step', async () => {
            await this.click('[data-value="individual"]');
            await this.click('button:contains("Next")');
            await this.setInputValue('input[name="currentAge"]', '40');
            await this.click('button:contains("Next")');
            await this.setInputValue('input[name="currentMonthlySalary"]', '50000');
            await this.click('button:contains("Next")');
        });

        await this.logStep('Test expense limit for "other" category', async () => {
            await this.setInputValue('input[name="other"]', '80000');
            await this.sleep(500);
            
            // Check for warning or error
            const limitWarning = await this.elementExists('.warning-message, .text-yellow-500');
            this.assert(limitWarning, 'No warning for expense > 75k limit');
        });

        await this.logStep('Verify value is capped or warning shown', async () => {
            const otherInput = await this.waitForElement('input[name="other"]');
            const value = parseInt(otherInput.value);
            
            // Either value is capped at 75000 or warning is shown
            if (value > 75000) {
                const warningText = await this.getText('.warning-message, .text-yellow-500');
                this.assertContains(warningText, '75', 'Warning should mention limit');
            } else {
                this.assertEquals(value, 75000, 'Value not capped at limit');
            }
        });
    },

    // Test 11: Net > Gross salary validation
    test11: async function() {
        await this.logStep('Navigate to salary step in couple mode', async () => {
            await this.click('[data-value="couple"]');
            await this.click('button:contains("Next")');
            await this.click('button:contains("Next")'); // Skip names
        });

        await this.logStep('Enter gross salary', async () => {
            await this.setInputValue('input[name="partner1Salary"]', '20000');
            await this.sleep(500);
        });

        await this.logStep('Switch to manual net salary and enter higher value', async () => {
            // Click manual override button
            await this.click('button:contains("Manual")');
            await this.setInputValue('input[name="partner1NetSalary"]', '25000');
            await this.sleep(500);
        });

        await this.logStep('Verify validation error', async () => {
            const netError = await this.elementExists('.error-message, .text-red-500');
            this.assert(netError, 'No error for net > gross salary');
            
            const errorText = await this.getText('.error-message, .text-red-500');
            this.assertContains(errorText.toLowerCase(), 'net', 'Error should mention net salary');
        });
    },

    // Test 12: Switch from individual to couple mid-wizard
    test12: async function() {
        await this.logStep('Start as individual', async () => {
            await this.click('[data-value="individual"]');
            await this.click('button:contains("Next")');
            
            await this.setInputValue('input[name="currentAge"]', '35');
            await this.setInputValue('input[name="targetRetirementAge"]', '65');
            await this.click('button:contains("Next")');
            
            await this.setInputValue('input[name="currentMonthlySalary"]', '30000');
            await this.click('button:contains("Next")');
        });

        await this.logStep('Go back to planning type', async () => {
            await this.click('button:contains("Previous")');
            await this.sleep(300);
            await this.click('button:contains("Previous")');
            await this.sleep(300);
            await this.click('button:contains("Previous")');
        });

        await this.logStep('Switch to couple mode', async () => {
            await this.click('[data-value="couple"]');
            await this.click('button:contains("Next")');
        });

        await this.logStep('Verify couple-specific fields appear', async () => {
            await this.assertElementExists('input[name="userName"]', 'User name field not found');
            await this.assertElementExists('input[name="partnerName"]', 'Partner name field not found');
            
            await this.setInputValue('input[name="userName"]', 'User 1');
            await this.setInputValue('input[name="partnerName"]', 'User 2');
            await this.click('button:contains("Next")');
            
            // Verify partner age fields
            await this.assertElementExists('input[name="partnerAge"]', 'Partner age field not found');
        });
    },

    // Test 13: Couple mode with only one partner having income
    test13: async function() {
        await this.logStep('Setup couple with single income', async () => {
            await this.click('[data-value="couple"]');
            await this.click('button:contains("Next")');
            await this.click('button:contains("Next")'); // Skip names
            
            await this.setInputValue('input[name="partner1Salary"]', '60000');
            await this.setInputValue('input[name="partner2Salary"]', '0');
            await this.sleep(500);
        });

        await this.logStep('Verify net salary calculations', async () => {
            const net1 = await this.waitForElement('input[name="partner1NetSalary"]');
            const net2 = await this.waitForElement('input[name="partner2NetSalary"]');
            
            this.assertGreaterThan(parseInt(net1.value), 30000, 'Partner 1 net salary too low');
            this.assertEquals(parseInt(net2.value), 0, 'Partner 2 should have 0 net salary');
        });

        await this.logStep('Continue to results', async () => {
            for (let i = 0; i < 6; i++) {
                await this.click('button:contains("Next")');
                await this.sleep(300);
            }
        });

        await this.logStep('Verify calculations handle single income', async () => {
            await this.assertElementExists('.financial-health-score', 'Results not displayed');
            const incomeDisplay = await this.getText('.total-income');
            this.assertContains(incomeDisplay, '60', 'Income calculation incorrect');
        });
    },

    // Test 14: Partner RSU with different vesting frequencies
    test14: async function() {
        await this.logStep('Navigate to RSU input', async () => {
            await this.click('[data-value="couple"]');
            await this.click('button:contains("Next")');
            await this.click('button:contains("Next")'); // Skip names
        });

        await this.logStep('Enter different RSU frequencies', async () => {
            // Main person RSU
            await this.setInputValue('input[name="rsuUnits"]', '100');
            await this.setInputValue('select[name="rsuFrequency"]', 'quarterly');
            
            // Partner RSU (if separate fields exist)
            const partnerRSU = await this.elementExists('input[name="partnerRsuUnits"]');
            if (partnerRSU) {
                await this.setInputValue('input[name="partnerRsuUnits"]', '200');
                await this.setInputValue('select[name="partnerRsuFrequency"]', 'monthly');
            }
        });

        await this.logStep('Select RSU companies', async () => {
            // Click on company selector if exists
            const companySelector = await this.elementExists('.rsu-company-selector');
            if (companySelector) {
                await this.click('.rsu-company-selector');
                await this.sleep(500);
                await this.click('[data-company="AAPL"]');
            }
        });

        await this.logStep('Verify RSU calculations', async () => {
            await this.sleep(1000); // Wait for stock price fetch
            
            const rsuValue = await this.elementExists('.rsu-value-display');
            if (rsuValue) {
                const valueText = await this.getText('.rsu-value-display');
                this.assertContains(valueText, '$', 'RSU value should show currency');
            }
        });
    },

    // Test 15: Inheritance planning with multiple beneficiaries
    test15: async function() {
        await this.logStep('Navigate to inheritance step', async () => {
            await this.click('[data-value="couple"]');
            // Navigate through steps to inheritance
            for (let i = 0; i < 7; i++) {
                await this.click('button:contains("Next")');
                await this.sleep(300);
            }
        });

        await this.logStep('Add multiple beneficiaries', async () => {
            const addBeneficiary = await this.elementExists('button:contains("Add Beneficiary")');
            if (addBeneficiary) {
                await this.click('button:contains("Add Beneficiary")');
                await this.setInputValue('input[name="beneficiary1Name"]', 'Child 1');
                await this.setInputValue('input[name="beneficiary1Percentage"]', '40');
                
                await this.click('button:contains("Add Beneficiary")');
                await this.setInputValue('input[name="beneficiary2Name"]', 'Child 2');
                await this.setInputValue('input[name="beneficiary2Percentage"]', '40');
                
                await this.click('button:contains("Add Beneficiary")');
                await this.setInputValue('input[name="beneficiary3Name"]', 'Charity');
                await this.setInputValue('input[name="beneficiary3Percentage"]', '20');
            }
        });

        await this.logStep('Verify percentage validation', async () => {
            const totalPercentage = await this.elementExists('.total-percentage');
            if (totalPercentage) {
                const total = await this.getText('.total-percentage');
                this.assertContains(total, '100', 'Total should be 100%');
            }
        });
    },

    // Test 16: Tax calculations across different countries
    test16: async function() {
        const countries = ['israel', 'uk', 'us'];
        const testSalary = '50000';

        for (const country of countries) {
            await this.logStep(`Test tax calculation for ${country}`, async () => {
                await this.reloadApp();
                await this.click('[data-value="individual"]');
                await this.click('button:contains("Next")');
                
                await this.click(`[data-country="${country}"]`);
                await this.setInputValue('input[name="currentAge"]', '35');
                await this.click('button:contains("Next")');
                
                await this.setInputValue('input[name="currentMonthlySalary"]', testSalary);
                await this.sleep(500);
                
                const netSalary = await this.waitForElement('input[name="currentNetSalary"]');
                const netValue = parseInt(netSalary.value);
                
                // Verify different tax rates apply
                const expectedRanges = {
                    israel: { min: 35000, max: 40000 }, // ~25-30% tax
                    uk: { min: 33000, max: 38000 },     // ~28-35% tax
                    us: { min: 36000, max: 40000 }      // ~22-28% tax
                };
                
                const range = expectedRanges[country];
                this.assert(netValue >= range.min && netValue <= range.max, 
                    `${country} tax calculation out of range: ${netValue}`);
            });
        }
    },

    // Test 17: Portfolio tax rates from 0% to 50%
    test17: async function() {
        await this.logStep('Navigate to savings step', async () => {
            await this.click('[data-value="individual"]');
            await this.click('button:contains("Next")');
            await this.setInputValue('input[name="currentAge"]', '45');
            await this.click('button:contains("Next")');
            await this.setInputValue('input[name="currentMonthlySalary"]', '40000');
            await this.click('button:contains("Next")');
            await this.click('button:contains("Next")'); // Skip expenses
        });

        await this.logStep('Enter portfolio value', async () => {
            await this.setInputValue('input[name="currentKeren"]', '1000000');
        });

        const taxRates = [0, 25, 50];
        for (const rate of taxRates) {
            await this.logStep(`Test ${rate}% portfolio tax`, async () => {
                const taxInput = await this.elementExists('input[name="portfolioTaxRate"]');
                if (taxInput) {
                    await this.setInputValue('input[name="portfolioTaxRate"]', rate.toString());
                    await this.sleep(300);
                    
                    const netValue = await this.elementExists('.portfolio-net-value');
                    if (netValue) {
                        const netText = await this.getText('.portfolio-net-value');
                        const expectedNet = 1000000 * (1 - rate/100);
                        this.assertContains(netText, expectedNet.toString().substring(0, 3), 
                            `Net value incorrect for ${rate}% tax`);
                    }
                }
            });
        }
    },

    // Test 18: RSU calculations with live stock price updates
    test18: async function() {
        await this.logStep('Navigate to RSU section', async () => {
            await this.click('[data-value="individual"]');
            await this.click('button:contains("Next")');
            await this.click('button:contains("Next")'); // Skip age
        });

        await this.logStep('Select tech stock with RSU', async () => {
            const rsuSelector = await this.elementExists('.rsu-company-selector');
            if (rsuSelector) {
                await this.click('.rsu-company-selector');
                await this.sleep(500);
                
                // Select a popular stock
                const appleOption = await this.elementExists('[data-company="AAPL"]');
                if (appleOption) {
                    await this.click('[data-company="AAPL"]');
                    await this.sleep(2000); // Wait for price fetch
                }
            }
        });

        await this.logStep('Enter RSU units', async () => {
            await this.setInputValue('input[name="rsuUnits"]', '50');
            await this.setInputValue('select[name="rsuFrequency"]', 'quarterly');
            await this.sleep(1000);
        });

        await this.logStep('Verify live price calculation', async () => {
            const priceDisplay = await this.elementExists('.stock-price-display');
            if (priceDisplay) {
                const priceText = await this.getText('.stock-price-display');
                this.assertContains(priceText, '$', 'Stock price should show');
                
                const valueDisplay = await this.elementExists('.rsu-total-value');
                if (valueDisplay) {
                    const valueText = await this.getText('.rsu-total-value');
                    this.assert(parseInt(valueText.replace(/\D/g, '')) > 0, 'RSU value should be calculated');
                }
            }
        });
    },

    // Test 19: Training fund with unlimited contribution checkbox
    test19: async function() {
        await this.logStep('Navigate to contributions step', async () => {
            await this.click('[data-value="individual"]');
            for (let i = 0; i < 5; i++) {
                await this.click('button:contains("Next")');
                await this.sleep(300);
            }
        });

        await this.logStep('Check unlimited training fund option', async () => {
            const unlimitedCheckbox = await this.elementExists('input[type="checkbox"][name="unlimitedTrainingFund"]');
            if (unlimitedCheckbox) {
                await this.click('input[type="checkbox"][name="unlimitedTrainingFund"]');
                await this.sleep(500);
            }
        });

        await this.logStep('Enter high salary to test threshold', async () => {
            // Go back to salary step
            for (let i = 0; i < 3; i++) {
                await this.click('button:contains("Previous")');
                await this.sleep(300);
            }
            
            await this.setInputValue('input[name="currentMonthlySalary"]', '20000');
            
            // Go forward to contributions
            for (let i = 0; i < 3; i++) {
                await this.click('button:contains("Next")');
                await this.sleep(300);
            }
        });

        await this.logStep('Verify training fund calculation', async () => {
            const contributionDisplay = await this.elementExists('.training-fund-contribution');
            if (contributionDisplay) {
                const contribText = await this.getText('.training-fund-contribution');
                
                // With unlimited, should be 10% of full salary (2000)
                // Without unlimited, capped at threshold (~1579)
                const unlimited = await this.elementExists('input[type="checkbox"][name="unlimitedTrainingFund"]:checked');
                if (unlimited) {
                    this.assertContains(contribText, '2000', 'Unlimited contribution incorrect');
                } else {
                    this.assertContains(contribText, '157', 'Limited contribution incorrect');
                }
            }
        });
    },

    // Test 20: Emergency fund adequacy with high expenses
    test20: async function() {
        await this.logStep('Setup high expense scenario', async () => {
            await this.click('[data-value="couple"]');
            await this.click('button:contains("Next")');
            await this.click('button:contains("Next")'); // Skip names
            
            await this.setInputValue('input[name="partner1Salary"]', '30000');
            await this.setInputValue('input[name="partner2Salary"]', '25000');
            await this.click('button:contains("Next")');
        });

        await this.logStep('Enter high expenses', async () => {
            await this.setInputValue('input[name="housing"]', '20000');
            await this.setInputValue('input[name="transportation"]', '8000');
            await this.setInputValue('input[name="food"]', '10000');
            await this.setInputValue('input[name="insurance"]', '5000');
            await this.setInputValue('input[name="other"]', '7000');
            await this.click('button:contains("Next")');
        });

        await this.logStep('Set emergency fund', async () => {
            await this.setInputValue('input[name="currentEmergencyFund"]', '100000');
            await this.click('button:contains("Next")');
        });

        await this.logStep('Check emergency fund score', async () => {
            // Continue to results
            for (let i = 0; i < 4; i++) {
                await this.click('button:contains("Next")');
                await this.sleep(300);
            }
            
            const emergencyScore = await this.elementExists('.emergency-fund-score');
            if (emergencyScore) {
                const scoreText = await this.getText('.emergency-fund-score');
                const score = parseInt(scoreText);
                
                // With 50k monthly expenses, 100k fund = 2 months
                // Should get low score
                this.assert(score < 50, 'Emergency fund score too high for inadequate fund');
            }
        });
    },

    // Test 21: Mobile viewport - responsive design validation
    test21: async function() {
        await this.logStep('Set mobile viewport', async () => {
            // Would use Puppeteer's page.setViewport in real implementation
            window.innerWidth = 375;
            window.innerHeight = 667;
            window.dispatchEvent(new Event('resize'));
            await this.sleep(500);
        });

        await this.logStep('Check mobile menu', async () => {
            const mobileMenu = await this.elementExists('.mobile-menu, .hamburger-menu');
            this.assert(mobileMenu, 'Mobile menu not found');
        });

        await this.logStep('Verify touch-friendly buttons', async () => {
            await this.click('[data-value="individual"]');
            
            const nextBtn = await this.waitForElement('button:contains("Next")');
            const btnHeight = nextBtn.offsetHeight;
            this.assertGreaterThan(btnHeight, 44, 'Buttons too small for mobile (< 44px)');
        });

        await this.logStep('Check responsive grid layout', async () => {
            await this.click('button:contains("Next")');
            await this.click('button:contains("Next")');
            await this.click('button:contains("Next")');
            
            // Check if expense grid is single column on mobile
            const expenseInputs = await this.appWindow.document.querySelectorAll('.expense-input');
            if (expenseInputs.length > 1) {
                const firstRect = expenseInputs[0].getBoundingClientRect();
                const secondRect = expenseInputs[1].getBoundingClientRect();
                this.assert(secondRect.top > firstRect.bottom, 'Expense inputs not stacked on mobile');
            }
        });

        // Reset viewport
        window.innerWidth = 1024;
        window.innerHeight = 768;
        window.dispatchEvent(new Event('resize'));
    },

    // Test 22: Language switching (Hebrew/English) mid-wizard
    test22: async function() {
        await this.logStep('Start in English', async () => {
            await this.click('[data-value="individual"]');
            
            const nextBtnText = await this.getText('button:contains("Next")');
            this.assertEquals(nextBtnText, 'Next', 'Not in English mode');
        });

        await this.logStep('Switch to Hebrew', async () => {
            const langToggle = await this.elementExists('.language-toggle, button:contains("עב")');
            if (langToggle) {
                await this.click('.language-toggle, button:contains("עב")');
                await this.sleep(500);
            }
        });

        await this.logStep('Verify Hebrew UI', async () => {
            const nextBtn = await this.waitForElement('button.next-button, button:contains("הבא")');
            const btnText = nextBtn.textContent;
            this.assertContains(btnText, 'הבא', 'Next button not in Hebrew');
            
            // Check RTL layout
            const body = this.appWindow.document.body;
            const dir = body.getAttribute('dir') || window.getComputedStyle(body).direction;
            this.assertEquals(dir, 'rtl', 'RTL not applied for Hebrew');
        });

        await this.logStep('Verify data persists after language switch', async () => {
            await this.click('button:contains("הבא")');
            await this.setInputValue('input[name="currentAge"]', '40');
            
            // Switch back to English
            await this.click('.language-toggle, button:contains("EN")');
            await this.sleep(500);
            
            const ageInput = await this.waitForElement('input[name="currentAge"]');
            this.assertEquals(ageInput.value, '40', 'Data lost after language switch');
        });
    },

    // Test 23: Currency conversion accuracy
    test23: async function() {
        const currencies = ['ILS', 'USD', 'EUR', 'GBP'];
        const testAmount = 10000;

        await this.logStep('Navigate to currency selection', async () => {
            await this.click('[data-value="individual"]');
            await this.click('button:contains("Next")');
        });

        for (const currency of currencies) {
            await this.logStep(`Test ${currency} conversion`, async () => {
                const currencySelector = await this.elementExists('.currency-selector');
                if (currencySelector) {
                    await this.click('.currency-selector');
                    await this.click(`[data-currency="${currency}"]`);
                    await this.sleep(1000); // Wait for conversion
                    
                    await this.setInputValue('input[name="currentMonthlySalary"]', testAmount.toString());
                    await this.sleep(500);
                    
                    // Check if amounts show correct currency symbol
                    const salaryDisplay = await this.elementExists('.salary-display, .formatted-currency');
                    if (salaryDisplay) {
                        const displayText = await this.getText('.salary-display, .formatted-currency');
                        const symbols = { ILS: '₪', USD: '$', EUR: '€', GBP: '£' };
                        this.assertContains(displayText, symbols[currency], `Wrong currency symbol for ${currency}`);
                    }
                }
            });
        }
    },

    // Test 24: Export PDF/PNG functionality
    test24: async function() {
        await this.logStep('Complete wizard to get results', async () => {
            await this.click('[data-value="individual"]');
            for (let i = 0; i < 8; i++) {
                await this.click('button:contains("Next")');
                await this.sleep(300);
            }
        });

        await this.logStep('Test PNG export', async () => {
            const exportBtn = await this.elementExists('button:contains("Export")');
            if (exportBtn) {
                await this.click('button:contains("Export")');
                await this.sleep(500);
                
                const pngOption = await this.elementExists('button:contains("PNG")');
                if (pngOption) {
                    // In real test, would intercept download
                    await this.click('button:contains("PNG")');
                    await this.sleep(2000);
                    
                    // Check for success message
                    const successMsg = await this.elementExists('.success-message, .toast-success');
                    this.assert(successMsg, 'No success message after PNG export');
                }
            }
        });

        await this.logStep('Test PDF export', async () => {
            const pdfOption = await this.elementExists('button:contains("PDF")');
            if (pdfOption) {
                await this.click('button:contains("PDF")');
                await this.sleep(2000);
                
                // Check for loading state
                const loading = await this.elementExists('.loading-spinner, .export-loading');
                this.assert(loading || await this.elementExists('.success-message'), 
                    'No loading state or success for PDF export');
            }
        });
    },

    // Test 25: Missing data modal flow
    test25: async function() {
        await this.logStep('Skip required fields to trigger modal', async () => {
            await this.click('[data-value="individual"]');
            
            // Skip through without filling required data
            for (let i = 0; i < 7; i++) {
                const skipBtn = await this.elementExists('button:contains("Skip")');
                if (skipBtn) {
                    await this.click('button:contains("Skip")');
                } else {
                    await this.click('button:contains("Next")');
                }
                await this.sleep(300);
            }
        });

        await this.logStep('Check for missing data warning', async () => {
            const warningModal = await this.elementExists('.missing-data-modal, .warning-modal');
            this.assert(warningModal, 'Missing data modal not shown');
            
            const modalText = await this.getText('.modal-content, .warning-content');
            this.assertContains(modalText.toLowerCase(), 'missing', 'Modal should mention missing data');
        });

        await this.logStep('Fill missing data from modal', async () => {
            const fillDataBtn = await this.elementExists('button:contains("Fill Missing Data")');
            if (fillDataBtn) {
                await this.click('button:contains("Fill Missing Data")');
                await this.sleep(500);
                
                // Should show fields to fill
                await this.assertElementExists('input[type="number"]', 'No input fields in modal');
                
                // Fill some data
                const modalInputs = await this.appWindow.document.querySelectorAll('.modal-content input[type="number"]');
                for (let i = 0; i < Math.min(3, modalInputs.length); i++) {
                    modalInputs[i].value = '50000';
                    modalInputs[i].dispatchEvent(new Event('input', { bubbles: true }));
                }
                
                await this.click('button:contains("Update")');
                await this.sleep(1000);
            }
        });

        await this.logStep('Verify scores updated', async () => {
            const scores = await this.getFinancialHealthScores();
            const hasNonZeroScores = Object.values(scores).some(score => score > 0);
            this.assert(hasNonZeroScores, 'Scores not updated after filling missing data');
        });
    }
};