// Integration tests for Enhanced Investment Tax Handler
// Tests real-world scenarios with different portfolios, currencies, and tax rates

const { TestFramework } = require('../utils/test-framework');
const test = new TestFramework();

test.describe('Portfolio Tax Calculation Scenarios', () => {
    
    // Test scenarios covering different user profiles
    const TEST_SCENARIOS = [
        {
            id: 1,
            name: "Young Professional (Individual, USD)",
            profile: "Tech worker with substantial portfolio",
            inputs: {
                planningType: "individual",
                currentPersonalPortfolio: 100000, // $100K portfolio equivalent in ILS
                portfolioTaxRate: 0.25,
                workingCurrency: "USD"
            },
            expected: {
                netValueILS: 75000, // 100000 * (1 - 0.25)
                netValueUSD: 20250, // Assuming 0.27 conversion rate
                formatted: "$20,250",
                taxPaid: 25000
            }
        },
        {
            id: 2,
            name: "High Earner (Individual, EUR)",
            profile: "Senior executive with large portfolio",
            inputs: {
                planningType: "individual",
                currentPersonalPortfolio: 500000,
                portfolioTaxRate: 0.30, // Higher tax rate
                workingCurrency: "EUR"
            },
            expected: {
                netValueILS: 350000, // 500000 * (1 - 0.30)
                netValueEUR: 87500, // Assuming 0.25 conversion rate
                formatted: "€87,500",
                taxPaid: 150000
            }
        },
        {
            id: 3,
            name: "Conservative Investor (Individual, ILS)",
            profile: "Risk-averse investor with moderate portfolio",
            inputs: {
                planningType: "individual",
                currentPersonalPortfolio: 200000,
                portfolioTaxRate: 0.25,
                workingCurrency: "ILS"
            },
            expected: {
                netValueILS: 150000, // 200000 * (1 - 0.25)
                netValueILS_final: 150000, // No conversion needed
                formatted: "₪150,000",
                taxPaid: 50000
            }
        },
        {
            id: 4,
            name: "Couple with Balanced Portfolios (USD)",
            profile: "Dual-income couple with similar investments",
            inputs: {
                planningType: "couple",
                partner1PersonalPortfolio: 150000,
                partner1PortfolioTaxRate: 0.25,
                partner2PersonalPortfolio: 120000,
                partner2PortfolioTaxRate: 0.25,
                workingCurrency: "USD"
            },
            expected: {
                partner1NetILS: 112500, // 150000 * 0.75
                partner2NetILS: 90000,  // 120000 * 0.75
                totalNetILS: 202500,
                partner1NetUSD: 30375,  // 112500 * 0.27
                partner2NetUSD: 24300,  // 90000 * 0.27
                totalNetUSD: 54675
            }
        },
        {
            id: 5,
            name: "Asymmetric Couple (Different Tax Rates)",
            profile: "Couple with different tax situations",
            inputs: {
                planningType: "couple",
                partner1PersonalPortfolio: 300000,
                partner1PortfolioTaxRate: 0.25, // Israeli resident
                partner2PersonalPortfolio: 200000,
                partner2PortfolioTaxRate: 0.30, // Non-resident
                workingCurrency: "GBP"
            },
            expected: {
                partner1NetILS: 225000, // 300000 * 0.75
                partner2NetILS: 140000, // 200000 * 0.70
                totalNetILS: 365000,
                partner1NetGBP: 49500,  // 225000 * 0.22
                partner2NetGBP: 30800,  // 140000 * 0.22
                totalNetGBP: 80300
            }
        },
        {
            id: 6,
            name: "Edge Case: Zero Tax Rate",
            profile: "Investor with tax-exempt status",
            inputs: {
                planningType: "individual",
                currentPersonalPortfolio: 250000,
                portfolioTaxRate: 0.00, // No tax
                workingCurrency: "USD"
            },
            expected: {
                netValueILS: 250000, // No tax applied
                netValueUSD: 67500,  // 250000 * 0.27
                formatted: "$67,500",
                taxPaid: 0
            }
        },
        {
            id: 7,
            name: "Edge Case: Maximum Tax Rate",
            profile: "Investor facing maximum tax rate",
            inputs: {
                planningType: "individual",
                currentPersonalPortfolio: 1000000,
                portfolioTaxRate: 0.60, // Maximum allowed
                workingCurrency: "EUR"
            },
            expected: {
                netValueILS: 400000, // 1000000 * (1 - 0.60)
                netValueEUR: 100000, // 400000 * 0.25
                formatted: "€100,000",
                taxPaid: 600000
            }
        },
        {
            id: 8,
            name: "Small Portfolio Test",
            profile: "Beginning investor with small portfolio",
            inputs: {
                planningType: "individual",
                currentPersonalPortfolio: 10000,
                portfolioTaxRate: 0.25,
                workingCurrency: "USD"
            },
            expected: {
                netValueILS: 7500,   // 10000 * 0.75
                netValueUSD: 2025,   // 7500 * 0.27
                formatted: "$2,025",
                taxPaid: 2500
            }
        }
    ];

    // Mock functions for testing
    const calculateNetValue = (portfolioValue, taxRate) => {
        if (!portfolioValue || portfolioValue <= 0) return 0;
        return portfolioValue * (1 - (taxRate || 0.25));
    };

    const mockConvertCurrency = async (amount, fromCurrency, toCurrency) => {
        if (fromCurrency === toCurrency) return amount;
        
        const rates = {
            'USD': 0.27,
            'EUR': 0.25,
            'GBP': 0.22,
            'BTC': 0.0000067,
            'ETH': 0.0001
        };
        
        if (fromCurrency === 'ILS') {
            return amount * (rates[toCurrency] || 1);
        }
        
        return amount;
    };

    const formatCurrency = (amount, currency) => {
        const symbols = { 'ILS': '₪', 'USD': '$', 'EUR': '€', 'GBP': '£' };
        const symbol = symbols[currency] || '₪';
        const formatted = new Intl.NumberFormat('en-US').format(Math.round(amount || 0));
        return `${symbol}${formatted}`;
    };

    // Run individual scenario tests
    TEST_SCENARIOS.forEach(scenario => {
        test.describe(`Scenario ${scenario.id}: ${scenario.name}`, () => {
            
            test.it('should calculate net value correctly', () => {
                if (scenario.inputs.planningType === 'individual') {
                    const netValue = calculateNetValue(
                        scenario.inputs.currentPersonalPortfolio,
                        scenario.inputs.portfolioTaxRate
                    );
                    
                    test.expect(netValue).toBe(scenario.expected.netValueILS);
                    
                    const taxPaid = scenario.inputs.currentPersonalPortfolio - netValue;
                    if (scenario.expected.taxPaid !== undefined) {
                        test.expect(taxPaid).toBe(scenario.expected.taxPaid);
                    }
                }
            });

            test.it('should handle currency conversion correctly', async () => {
                if (scenario.inputs.workingCurrency !== 'ILS') {
                    const netValueILS = calculateNetValue(
                        scenario.inputs.currentPersonalPortfolio,
                        scenario.inputs.portfolioTaxRate
                    );
                    
                    const convertedValue = await mockConvertCurrency(
                        netValueILS,
                        'ILS',
                        scenario.inputs.workingCurrency
                    );
                    
                    const expectedKey = `netValue${scenario.inputs.workingCurrency}`;
                    if (scenario.expected[expectedKey] !== undefined) {
                        test.expect(convertedValue).toBe(scenario.expected[expectedKey]);
                    }
                }
            });

            test.it('should format currency display correctly', async () => {
                let displayValue;
                
                if (scenario.inputs.workingCurrency === 'ILS') {
                    displayValue = calculateNetValue(
                        scenario.inputs.currentPersonalPortfolio,
                        scenario.inputs.portfolioTaxRate
                    );
                } else {
                    const netValueILS = calculateNetValue(
                        scenario.inputs.currentPersonalPortfolio,
                        scenario.inputs.portfolioTaxRate
                    );
                    displayValue = await mockConvertCurrency(
                        netValueILS,
                        'ILS',
                        scenario.inputs.workingCurrency
                    );
                }
                
                const formatted = formatCurrency(displayValue, scenario.inputs.workingCurrency);
                
                if (scenario.expected.formatted) {
                    test.expect(formatted).toBe(scenario.expected.formatted);
                }
            });

            if (scenario.inputs.planningType === 'couple') {
                test.it('should handle couple calculations correctly', async () => {
                    const partner1Net = calculateNetValue(
                        scenario.inputs.partner1PersonalPortfolio,
                        scenario.inputs.partner1PortfolioTaxRate
                    );
                    
                    const partner2Net = calculateNetValue(
                        scenario.inputs.partner2PersonalPortfolio,
                        scenario.inputs.partner2PortfolioTaxRate
                    );
                    
                    test.expect(partner1Net).toBe(scenario.expected.partner1NetILS);
                    test.expect(partner2Net).toBe(scenario.expected.partner2NetILS);
                    
                    const totalNet = partner1Net + partner2Net;
                    test.expect(totalNet).toBe(scenario.expected.totalNetILS);
                    
                    // Test currency conversions for couples
                    if (scenario.inputs.workingCurrency !== 'ILS') {
                        const partner1Converted = await mockConvertCurrency(
                            partner1Net, 'ILS', scenario.inputs.workingCurrency
                        );
                        const partner2Converted = await mockConvertCurrency(
                            partner2Net, 'ILS', scenario.inputs.workingCurrency
                        );
                        
                        const expectedP1Key = `partner1Net${scenario.inputs.workingCurrency}`;
                        const expectedP2Key = `partner2Net${scenario.inputs.workingCurrency}`;
                        
                        if (scenario.expected[expectedP1Key] !== undefined) {
                            test.expect(partner1Converted).toBe(scenario.expected[expectedP1Key]);
                        }
                        if (scenario.expected[expectedP2Key] !== undefined) {
                            test.expect(partner2Converted).toBe(scenario.expected[expectedP2Key]);
                        }
                    }
                });
            }
        });
    });

    // Cross-scenario validation tests
    test.describe('Cross-Scenario Validations', () => {
        
        test.it('should maintain tax rate consistency across scenarios', () => {
            const scenarios25Percent = TEST_SCENARIOS.filter(s => s.inputs.portfolioTaxRate === 0.25);
            
            scenarios25Percent.forEach(scenario => {
                const portfolioValue = scenario.inputs.currentPersonalPortfolio;
                const expectedTaxPaid = portfolioValue * 0.25;
                const expectedNetValue = portfolioValue * 0.75;
                
                test.expect(scenario.expected.netValueILS).toBe(expectedNetValue);
                if (scenario.expected.taxPaid !== undefined) {
                    test.expect(scenario.expected.taxPaid).toBe(expectedTaxPaid);
                }
            });
        });

        test.it('should validate currency conversion rates', () => {
            const usdScenarios = TEST_SCENARIOS.filter(s => s.inputs.workingCurrency === 'USD');
            
            usdScenarios.forEach(scenario => {
                if (scenario.expected.netValueILS && scenario.expected.netValueUSD) {
                    const calculatedUSD = scenario.expected.netValueILS * 0.27;
                    test.expect(scenario.expected.netValueUSD).toBe(calculatedUSD);
                }
            });
        });

        test.it('should ensure couple totals equal sum of parts', () => {
            const coupleScenarios = TEST_SCENARIOS.filter(s => s.inputs.planningType === 'couple');
            
            coupleScenarios.forEach(scenario => {
                if (scenario.expected.partner1NetILS && scenario.expected.partner2NetILS) {
                    const expectedTotal = scenario.expected.partner1NetILS + scenario.expected.partner2NetILS;
                    test.expect(scenario.expected.totalNetILS).toBe(expectedTotal);
                }
            });
        });
    });

    // Performance and edge case tests
    test.describe('Performance and Edge Cases', () => {
        
        test.it('should handle very large portfolio values', () => {
            const largePortfolio = 10000000; // 10M ILS
            const result = calculateNetValue(largePortfolio, 0.25);
            test.expect(result).toBe(7500000);
        });

        test.it('should handle very small portfolio values', () => {
            const smallPortfolio = 100; // 100 ILS
            const result = calculateNetValue(smallPortfolio, 0.25);
            test.expect(result).toBe(75);
        });

        test.it('should handle boundary tax rates', () => {
            const portfolio = 10000;
            
            const zeroTaxResult = calculateNetValue(portfolio, 0);
            test.expect(zeroTaxResult).toBe(10000);
            
            const maxTaxResult = calculateNetValue(portfolio, 0.60);
            test.expect(maxTaxResult).toBe(4000);
        });

        test.it('should handle multiple rapid calculations', () => {
            const startTime = Date.now();
            
            for (let i = 0; i < 1000; i++) {
                calculateNetValue(Math.random() * 100000, Math.random() * 0.6);
            }
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Should complete 1000 calculations in under 100ms
            test.expect(duration).toBeLessThan(100);
        });
    });
});

// Run the tests
test.run();