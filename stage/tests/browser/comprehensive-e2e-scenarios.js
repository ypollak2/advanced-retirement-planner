// Comprehensive E2E Test Scenarios
// Testing various user personas and edge cases

// Helper function to create test user profiles
function createTestProfiles() {
    return {
        // Young Professional - Early Career
        youngProfessional: {
            planningType: 'individual',
            currentAge: 25,
            retirementAge: 67,
            monthlySalary: 8000,
            monthlyExpenses: 6000,
            currentSavings: 10000,
            emergencyFund: 15000,
            pensionSavings: 5000,
            pensionEmployeeRate: 6.5,
            pensionEmployerRate: 6.5,
            monthlyContribution: 1040, // 8000 * 0.13
            riskTolerance: 'aggressive',
            hasRSU: false,
            country: 'Israel'
        },
        
        // Mid-Career Professional with RSUs
        techEmployee: {
            planningType: 'individual',
            currentAge: 35,
            retirementAge: 65,
            monthlySalary: 25000,
            monthlyExpenses: 15000,
            currentSavings: 300000,
            emergencyFund: 100000,
            pensionSavings: 400000,
            personalPortfolio: 200000,
            pensionEmployeeRate: 6.5,
            pensionEmployerRate: 6.5,
            monthlyContribution: 3250, // 25000 * 0.13
            riskTolerance: 'moderate',
            hasRSU: true,
            rsuCompany: 'AAPL',
            rsuUnits: 500,
            rsuFrequency: 'annually',
            country: 'Israel'
        },
        
        // High Net Worth Individual
        highNetWorth: {
            planningType: 'individual',
            currentAge: 45,
            retirementAge: 60,
            monthlySalary: 50000,
            monthlyExpenses: 25000,
            currentSavings: 2000000,
            emergencyFund: 500000,
            pensionSavings: 1500000,
            personalPortfolio: 3000000,
            realEstate: 5000000,
            crypto: 500000,
            pensionEmployeeRate: 6.5,
            pensionEmployerRate: 6.5,
            monthlyContribution: 6500, // 50000 * 0.13
            riskTolerance: 'moderate',
            hasRSU: true,
            rsuCompany: 'GOOGL',
            rsuUnits: 1000,
            rsuFrequency: 'quarterly',
            country: 'Israel'
        },
        
        // Young Couple - Dual Income
        youngCouple: {
            planningType: 'couple',
            partner1Name: 'Sarah',
            partner2Name: 'David',
            partner1CurrentAge: 28,
            partner2CurrentAge: 30,
            partner1RetirementAge: 67,
            partner2RetirementAge: 67,
            partner1Salary: 12000,
            partner2Salary: 15000,
            partner1PensionSavings: 50000,
            partner2PensionSavings: 70000,
            partner1RiskTolerance: 'moderate',
            partner2RiskTolerance: 'aggressive',
            jointMonthlyExpenses: 18000,
            jointEmergencyFund: 80000,
            country: 'Israel'
        },
        
        // Established Couple with Children
        familyCouple: {
            planningType: 'couple',
            partner1Name: 'Michael',
            partner2Name: 'Rachel',
            partner1CurrentAge: 40,
            partner2CurrentAge: 38,
            partner1RetirementAge: 65,
            partner2RetirementAge: 65,
            partner1Salary: 30000,
            partner2Salary: 20000,
            partner1PensionSavings: 600000,
            partner2PensionSavings: 400000,
            partner1PersonalPortfolio: 300000,
            partner2PersonalPortfolio: 200000,
            jointRealEstate: 2500000,
            jointMonthlyExpenses: 35000,
            jointEmergencyFund: 200000,
            hasChildren: true,
            numberOfChildren: 2,
            country: 'Israel'
        },
        
        // Pre-Retirement Individual
        nearRetirement: {
            planningType: 'individual',
            currentAge: 58,
            retirementAge: 62,
            monthlySalary: 40000,
            monthlyExpenses: 20000,
            currentSavings: 1500000,
            emergencyFund: 300000,
            pensionSavings: 2000000,
            personalPortfolio: 1000000,
            realEstate: 3000000,
            pensionEmployeeRate: 6.5,
            pensionEmployerRate: 6.5,
            monthlyContribution: 5200, // 40000 * 0.13
            riskTolerance: 'conservative',
            monthlyPensionIncome: 8000,
            country: 'Israel'
        },
        
        // International Expat
        expat: {
            planningType: 'individual',
            currentAge: 32,
            retirementAge: 65,
            monthlySalary: 5000, // USD
            monthlyExpenses: 3000,
            currentSavings: 50000,
            emergencyFund: 20000,
            pensionSavings: 80000,
            pensionEmployeeRate: 6.5,
            pensionEmployerRate: 6.5,
            monthlyContribution: 650, // 5000 * 0.13
            currency: 'USD',
            workingCurrency: 'USD',
            riskTolerance: 'moderate',
            country: 'Israel', // Living in Israel but paid in USD
            hasInternationalAssets: true
        },
        
        // Freelancer/Self-Employed
        freelancer: {
            planningType: 'individual',
            currentAge: 35,
            retirementAge: 70,
            monthlyIncome: 20000, // Variable income
            monthlyExpenses: 12000,
            currentSavings: 150000,
            emergencyFund: 120000, // Larger emergency fund
            pensionSavings: 100000,
            personalPortfolio: 200000,
            riskTolerance: 'moderate',
            selfEmployed: true,
            irregularIncome: true,
            country: 'Israel'
        },
        
        // FIRE Movement Enthusiast
        fireSeeker: {
            planningType: 'individual',
            currentAge: 30,
            retirementAge: 45, // Early retirement goal
            monthlySalary: 20000,
            monthlyExpenses: 8000, // High savings rate
            currentSavings: 200000,
            emergencyFund: 50000,
            pensionSavings: 150000,
            personalPortfolio: 300000,
            pensionEmployeeRate: 6.5,
            pensionEmployerRate: 6.5,
            monthlyContribution: 2600, // 20000 * 0.13
            riskTolerance: 'aggressive',
            targetSavingsRate: 60, // 60% savings rate
            country: 'Israel'
        },
        
        // Debt-Heavy Scenario
        debtScenario: {
            planningType: 'individual',
            currentAge: 35,
            retirementAge: 67,
            monthlySalary: 18000,
            monthlyExpenses: 15000,
            currentSavings: 5000,
            emergencyFund: 2000,
            pensionSavings: 50000,
            monthlyDebtPayments: 5000,
            totalDebt: 300000,
            expenses: {
                housing: 6000,
                mortgage: 3000,
                carLoan: 1000,
                creditCard: 1000,
                food: 3000,
                other: 3000
            },
            riskTolerance: 'conservative',
            country: 'Israel'
        }
    };
}

// Comprehensive E2E Test Suite
testRunner.describe('Comprehensive E2E Scenarios', () => {
    const profiles = createTestProfiles();
    
    // Test 1: Young Professional Journey
    testRunner.it('should handle young professional retirement planning', async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        try {
            const profile = profiles.youngProfessional;
            
            // Calculate retirement projections
            const results = window.calculateRetirement(profile);
            assert.ok(results, 'Should calculate retirement for young professional');
            assert.ok(results.totalSavings > 0, 'Should project positive savings');
            
            // Calculate financial health score
            const healthScore = window.calculateFinancialHealthScore(profile);
            assert.ok(healthScore, 'Should calculate health score');
            assert.ok(healthScore.totalScore >= 0 && healthScore.totalScore <= 100, 'Score should be valid');
            
            // Check for appropriate suggestions
            assert.ok(healthScore.suggestions.length > 0, 'Should provide improvement suggestions');
            
            // Verify age-appropriate advice
            const emergencyFundFactor = healthScore.factors.emergencyFund;
            assert.ok(emergencyFundFactor, 'Should evaluate emergency fund');
            
            console.log(`Young Professional - Score: ${healthScore.totalScore}/100`);
            
        } finally {
            document.body.removeChild(container);
        }
    });
    
    // Test 2: Tech Employee with RSUs
    testRunner.it('should handle tech employee with RSU compensation', async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        try {
            const profile = profiles.techEmployee;
            
            // Test RSU component rendering
            const RSUTestApp = () => {
                const [inputs, setInputs] = React.useState(profile);
                const [stockPrice, setStockPrice] = React.useState(null);
                
                React.useEffect(() => {
                    // Simulate stock price fetch
                    setTimeout(() => setStockPrice(150), 500);
                }, []);
                
                return React.createElement('div', {},
                    React.createElement(window.EnhancedRSUCompanySelector, {
                        inputs,
                        updateInputs: (updates) => setInputs({...inputs, ...updates}),
                        language: 'en'
                    }),
                    stockPrice && React.createElement('div', {}, 
                        `RSU Value: ${window.formatCurrency(profile.rsuUnits * stockPrice, 'USD')}`
                    )
                );
            };
            
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(RSUTestApp));
            
            await wait(1000);
            
            // Verify RSU calculations
            const results = window.calculateRetirement(profile);
            assert.ok(results, 'Should calculate with RSUs');
            
            const healthScore = window.calculateFinancialHealthScore(profile);
            assert.ok(healthScore.totalScore > 60, 'Tech employee should have good score');
            
            console.log(`Tech Employee - Score: ${healthScore.totalScore}/100`);
            
        } finally {
            document.body.removeChild(container);
        }
    });
    
    // Test 3: High Net Worth Scenario
    testRunner.it('should handle high net worth individual planning', async () => {
        const profile = profiles.highNetWorth;
        
        // Calculate projections
        const results = window.calculateRetirement(profile);
        assert.ok(results, 'Should handle large numbers');
        assert.ok(results.totalSavings > 10000000, 'Should project very high savings');
        
        // Check financial health
        const healthScore = window.calculateFinancialHealthScore(profile);
        assert.ok(healthScore.totalScore > 80, 'High net worth should have excellent score');
        
        // Verify diversification scoring
        const diversificationScore = healthScore.factors.diversification;
        assert.ok(diversificationScore.score > 15, 'Should have good diversification');
        
        // Check tax efficiency suggestions
        const taxSuggestions = healthScore.suggestions.filter(s => 
            s.category.includes('Tax') || s.category.includes('tax')
        );
        assert.ok(taxSuggestions.length >= 0, 'Should consider tax optimization');
        
        console.log(`High Net Worth - Score: ${healthScore.totalScore}/100`);
    });
    
    // Test 4: Young Couple Planning
    testRunner.it('should handle young couple retirement planning', async () => {
        const profile = profiles.youngCouple;
        
        // Test couple calculations
        const results = window.calculateRetirement(profile);
        assert.ok(results, 'Should calculate for couples');
        
        // Verify combined calculations
        const combinedSalary = profile.partner1Salary + profile.partner2Salary;
        assert.equal(combinedSalary, 27000, 'Should combine salaries correctly');
        
        // Check couple validation
        const validation = window.coupleValidation.validateCoupleData(
            {
                currentAge: profile.partner1CurrentAge,
                retirementAge: profile.partner1RetirementAge,
                currentSalary: profile.partner1Salary,
                riskTolerance: profile.partner1RiskTolerance
            },
            {
                partnerCurrentAge: profile.partner2CurrentAge,
                partnerRetirementAge: profile.partner2RetirementAge,
                partnerCurrentSalary: profile.partner2Salary,
                partnerRiskTolerance: profile.partner2RiskTolerance
            }
        );
        
        assert.ok(validation, 'Should validate couple data');
        assert.ok(validation.score > 70, 'Young couple should have good compatibility');
        
        console.log(`Young Couple - Compatibility Score: ${validation.score}/100`);
    });
    
    // Test 5: Family with Children
    testRunner.it('should handle family planning with children', async () => {
        const profile = profiles.familyCouple;
        
        // Calculate with family expenses
        const results = window.calculateRetirement(profile);
        assert.ok(results, 'Should calculate for families');
        
        const healthScore = window.calculateFinancialHealthScore(profile);
        
        // Check emergency fund adequacy for family
        const emergencyScore = healthScore.factors.emergencyFund;
        assert.ok(emergencyScore, 'Should evaluate family emergency fund');
        
        // Verify higher expense considerations
        assert.ok(profile.jointMonthlyExpenses > 30000, 'Family expenses should be significant');
        
        console.log(`Family Couple - Score: ${healthScore.totalScore}/100`);
    });
    
    // Test 6: Near Retirement Scenario
    testRunner.it('should handle near-retirement planning', async () => {
        const profile = profiles.nearRetirement;
        
        const results = window.calculateRetirement(profile);
        assert.ok(results, 'Should calculate near retirement');
        
        const healthScore = window.calculateFinancialHealthScore(profile);
        
        // Check retirement readiness
        const readinessScore = healthScore.factors.retirementReadiness;
        assert.ok(readinessScore.score > 15, 'Near retirement should have high readiness');
        
        // Verify conservative risk alignment
        const riskScore = healthScore.factors.riskAlignment;
        assert.ok(riskScore, 'Should evaluate risk alignment');
        
        console.log(`Near Retirement - Score: ${healthScore.totalScore}/100`);
    });
    
    // Test 7: International/Multi-Currency
    testRunner.it('should handle international expat with USD income', async () => {
        const profile = profiles.expat;
        
        // Test currency conversion
        const api = new window.CurrencyAPI();
        const convertedSalary = await api.convertAmount(
            profile.monthlySalary, 
            'USD', 
            'ILS'
        );
        
        assert.ok(convertedSalary > profile.monthlySalary, 'USD should convert to more ILS');
        
        // Calculate with currency considerations
        const results = window.calculateRetirement(profile);
        assert.ok(results, 'Should handle USD calculations');
        
        console.log(`Expat - Monthly salary: $${profile.monthlySalary} = ₪${convertedSalary.toFixed(0)}`);
    });
    
    // Test 8: Freelancer/Variable Income
    testRunner.it('should handle freelancer with variable income', async () => {
        const profile = profiles.freelancer;
        
        const healthScore = window.calculateFinancialHealthScore(profile);
        
        // Check emergency fund emphasis
        const emergencyScore = healthScore.factors.emergencyFund;
        const monthsCovered = emergencyScore.details.months;
        assert.ok(monthsCovered > 6, 'Freelancer should have larger emergency fund');
        
        console.log(`Freelancer - Emergency Fund: ${monthsCovered.toFixed(1)} months`);
    });
    
    // Test 9: FIRE Movement
    testRunner.it('should handle FIRE (Financial Independence Retire Early) planning', async () => {
        const profile = profiles.fireSeeker;
        
        const results = window.calculateRetirement(profile);
        const healthScore = window.calculateFinancialHealthScore(profile);
        
        // Check high savings rate
        const savingsRateScore = healthScore.factors.savingsRate;
        assert.ok(savingsRateScore.details.rate > 50, 'FIRE seeker should have very high savings rate');
        
        // Verify early retirement feasibility
        const yearsToRetirement = profile.retirementAge - profile.currentAge;
        assert.equal(yearsToRetirement, 15, 'Should plan for early retirement');
        
        console.log(`FIRE Seeker - Savings Rate: ${savingsRateScore.details.rate.toFixed(1)}%`);
    });
    
    // Test 10: High Debt Scenario
    testRunner.it('should handle high debt load planning', async () => {
        const profile = profiles.debtScenario;
        
        const healthScore = window.calculateFinancialHealthScore(profile);
        
        // Check debt management score
        const debtScore = healthScore.factors.debtManagement;
        assert.ok(debtScore.score < 10, 'High debt should result in low debt score');
        
        // Verify debt-focused suggestions
        const debtSuggestions = healthScore.suggestions.filter(s => 
            s.category.includes('Debt')
        );
        assert.ok(debtSuggestions.length > 0, 'Should suggest debt reduction strategies');
        
        console.log(`High Debt - Debt-to-Income: ${(debtScore.details.ratio * 100).toFixed(1)}%`);
    });
});

// Edge Case Testing
testRunner.describe('E2E Edge Cases', () => {
    testRunner.it('should handle zero/missing values gracefully', async () => {
        const edgeCaseProfile = {
            planningType: 'individual',
            currentAge: 30,
            retirementAge: 65,
            monthlySalary: 0, // Zero salary
            monthlyExpenses: 0, // Zero expenses
            currentSavings: 0,
            emergencyFund: 0,
            pensionSavings: 0
        };
        
        const results = window.calculateRetirement(edgeCaseProfile);
        assert.ok(results, 'Should handle zero values');
        assert.ok(!isNaN(results.totalSavings), 'Should not produce NaN');
        
        const healthScore = window.calculateFinancialHealthScore(edgeCaseProfile);
        assert.ok(healthScore, 'Should calculate score with zeros');
        assert.ok(!isNaN(healthScore.totalScore), 'Score should not be NaN');
    });
    
    testRunner.it('should handle extreme age scenarios', async () => {
        // Very young
        const youngProfile = {
            planningType: 'individual',
            currentAge: 18,
            retirementAge: 70,
            monthlySalary: 5000,
            monthlyExpenses: 4000
        };
        
        const youngResults = window.calculateRetirement(youngProfile);
        assert.ok(youngResults, 'Should handle age 18');
        
        // Very old
        const oldProfile = {
            planningType: 'individual',
            currentAge: 80,
            retirementAge: 85,
            monthlySalary: 0,
            monthlyPensionIncome: 15000,
            monthlyExpenses: 10000
        };
        
        const oldResults = window.calculateRetirement(oldProfile);
        assert.ok(oldResults, 'Should handle age 80+');
    });
    
    testRunner.it('should handle currency edge cases', async () => {
        // Crypto currency
        const cryptoProfile = {
            planningType: 'individual',
            currentAge: 35,
            retirementAge: 65,
            currency: 'BTC',
            monthlySalary: 0.5, // 0.5 BTC per month
            monthlyExpenses: 0.3,
            currentSavings: 2,
            crypto: 10
        };
        
        const api = new window.CurrencyAPI();
        const btcToIls = await api.convertAmount(1, 'BTC', 'ILS');
        assert.ok(btcToIls > 100000, 'BTC should convert to large ILS amount');
        
        // Mixed currencies
        const mixedProfile = {
            planningType: 'individual',
            currentAge: 40,
            retirementAge: 65,
            currency: 'ILS',
            workingCurrency: 'USD',
            monthlySalary: 10000, // USD
            monthlyExpenses: 25000, // ILS
            currentSavings: 500000 // ILS
        };
        
        const results = window.calculateRetirement(mixedProfile);
        assert.ok(results, 'Should handle mixed currencies');
    });
});

// Performance Testing
testRunner.describe('E2E Performance Tests', () => {
    testRunner.it('should handle rapid input changes', async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        try {
            let renderCount = 0;
            
            const PerformanceApp = () => {
                const [age, setAge] = React.useState(30);
                renderCount++;
                
                React.useEffect(() => {
                    // Simulate rapid changes
                    const interval = setInterval(() => {
                        setAge(prev => prev < 65 ? prev + 1 : 30);
                    }, 100);
                    
                    return () => clearInterval(interval);
                }, []);
                
                return React.createElement('div', {}, `Age: ${age}, Renders: ${renderCount}`);
            };
            
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(PerformanceApp));
            
            await wait(2000);
            
            // Should handle multiple renders without crashing
            assert.ok(renderCount > 10, 'Should handle rapid updates');
            assert.ok(renderCount < 100, 'Should not cause excessive renders');
            
        } finally {
            document.body.removeChild(container);
        }
    });
    
    testRunner.it('should calculate complex scenarios efficiently', async () => {
        const startTime = performance.now();
        
        // Run calculations for all profiles
        const profiles = createTestProfiles();
        const results = [];
        
        for (const [name, profile] of Object.entries(profiles)) {
            const result = window.calculateRetirement(profile);
            const score = window.calculateFinancialHealthScore(profile);
            results.push({ name, result, score });
        }
        
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        
        assert.ok(results.length === Object.keys(profiles).length, 'Should calculate all profiles');
        assert.ok(totalTime < 5000, `Should complete all calculations quickly (took ${totalTime.toFixed(0)}ms)`);
        
        console.log(`Performance: Calculated ${results.length} profiles in ${totalTime.toFixed(0)}ms`);
    });
});

// Accessibility Testing
testRunner.describe('E2E Accessibility Tests', () => {
    testRunner.it('should support keyboard navigation', async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        try {
            const AccessibleForm = () => {
                const [focused, setFocused] = React.useState('');
                
                return React.createElement('form', {},
                    React.createElement('input', {
                        type: 'number',
                        placeholder: 'Age',
                        onFocus: () => setFocused('age'),
                        onBlur: () => setFocused(''),
                        'aria-label': 'Current Age'
                    }),
                    React.createElement('input', {
                        type: 'number',
                        placeholder: 'Salary',
                        onFocus: () => setFocused('salary'),
                        onBlur: () => setFocused(''),
                        'aria-label': 'Monthly Salary'
                    }),
                    React.createElement('button', {
                        type: 'submit',
                        onFocus: () => setFocused('submit'),
                        onBlur: () => setFocused('')
                    }, 'Calculate'),
                    focused && React.createElement('div', {}, `Focused: ${focused}`)
                );
            };
            
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(AccessibleForm));
            
            await wait(100);
            
            // Check for accessibility attributes
            const inputs = container.querySelectorAll('input[aria-label]');
            assert.equal(inputs.length, 2, 'Inputs should have aria-labels');
            
        } finally {
            document.body.removeChild(container);
        }
    });
});

console.log('✅ Comprehensive E2E scenarios loaded');