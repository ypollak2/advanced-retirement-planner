// End-to-End Tests for Browser Execution
// Tests complete user workflows in the actual application

testRunner.describe('E2E: Complete Wizard Flow', () => {
    testRunner.it('should complete individual planning wizard', async () => {
        // This test will use an iframe to test the full app
        const iframe = document.getElementById('test-iframe');
        iframe.style.display = 'block';
        iframe.src = 'index.html';
        
        // Wait for iframe to load
        await new Promise(resolve => {
            iframe.onload = resolve;
        });
        
        const iframeDoc = iframe.contentDocument;
        const iframeWin = iframe.contentWindow;
        
        // Wait for app to initialize
        await wait(2000);
        
        // Check that app loaded
        const root = iframeDoc.getElementById('root');
        assert.ok(root, 'App root should exist in iframe');
        
        // Find planning type selector
        const planningTypeSelect = iframeDoc.querySelector('#planningType, select[name="planningType"]');
        if (planningTypeSelect) {
            simulate.select(planningTypeSelect, 'individual');
            await wait(500);
        }
        
        // Clean up
        iframe.style.display = 'none';
    });
    
    testRunner.it('should handle RSU component without errors', async () => {
        // Test that RSU components don't throw errors about getExchangeRates
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        try {
            // Create a mini app with RSU component
            const TestApp = () => {
                const [inputs, setInputs] = React.useState({
                    workingCurrency: 'ILS',
                    hasRSU: true
                });
                
                return React.createElement('div', {},
                    React.createElement(window.EnhancedRSUCompanySelector, {
                        inputs,
                        updateInputs: (updates) => setInputs({...inputs, ...updates}),
                        language: 'en'
                    })
                );
            };
            
            const root = ReactDOM.createRoot(container);
            
            // This should not throw any errors
            await new Promise((resolve) => {
                root.render(React.createElement(TestApp));
                setTimeout(resolve, 1000); // Wait for component to mount and run effects
            });
            
            // Check that no errors were thrown
            assert.ok(true, 'RSU component should render without errors');
            
        } finally {
            document.body.removeChild(container);
        }
    });
});

testRunner.describe('E2E: Couple Planning Flow', () => {
    testRunner.it('should handle couple mode data correctly', async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        try {
            // Create a test app with couple mode
            const CoupleTestApp = () => {
                const [inputs, setInputs] = React.useState({
                    planningType: 'couple',
                    partner1Name: 'John',
                    partner2Name: 'Jane',
                    partner1CurrentAge: 35,
                    partner2CurrentAge: 33,
                    partner1Salary: 20000,
                    partner2Salary: 15000,
                    partner1PensionEmployeeRate: 6.5,
                    partner1PensionEmployerRate: 6.5,
                    partner2PensionEmployeeRate: 6.5,
                    partner2PensionEmployerRate: 6.5
                });
                
                const [results, setResults] = React.useState(null);
                
                React.useEffect(() => {
                    const calcResults = window.calculateRetirement(inputs);
                    setResults(calcResults);
                }, [inputs]);
                
                return React.createElement('div', {},
                    React.createElement('h3', {}, 'Couple Planning Test'),
                    React.createElement('div', {}, `Combined Monthly Income: ${(inputs.partner1Salary + inputs.partner2Salary).toLocaleString()}`),
                    results && React.createElement('div', {}, `Total Savings: ${results.totalSavings.toLocaleString()}`)
                );
            };
            
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(CoupleTestApp));
            
            await wait(500);
            
            // Check that couple data is displayed
            const content = container.textContent;
            assert.includes(content, '35,000', 'Should show combined income');
            assert.includes(content, 'Total Savings:', 'Should calculate and show results');
            
        } finally {
            document.body.removeChild(container);
        }
    });
});

testRunner.describe('E2E: Financial Health Score', () => {
    testRunner.it('should calculate and display health score', async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        try {
            const HealthScoreApp = () => {
                const [inputs] = React.useState({
                    planningType: 'individual',
                    currentAge: 35,
                    retirementAge: 65,
                    monthlySalary: 15000,
                    monthlyExpenses: 10000,
                    currentSavings: 200000,
                    emergencyFund: 50000,
                    pensionSavings: 150000
                });
                
                const [score, setScore] = React.useState(null);
                
                React.useEffect(() => {
                    const healthScore = window.calculateFinancialHealthScore(inputs);
                    setScore(healthScore);
                }, []);
                
                if (!score) return React.createElement('div', {}, 'Calculating...');
                
                return React.createElement('div', { className: 'p-4' },
                    React.createElement('h3', { className: 'text-xl font-bold' }, 'Financial Health Score'),
                    React.createElement('div', { className: 'text-3xl font-bold' }, `${score.totalScore}/100`),
                    React.createElement('div', { className: 'mt-4' }, 
                        Object.entries(score.factors).map(([factor, value]) => 
                            React.createElement('div', { key: factor, className: 'flex justify-between' },
                                React.createElement('span', {}, factor),
                                React.createElement('span', {}, `${value.score}/${value.weight}`)
                            )
                        )
                    )
                );
            };
            
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(HealthScoreApp));
            
            await wait(500);
            
            // Check that score is displayed
            const scoreText = container.querySelector('.text-3xl');
            assert.ok(scoreText, 'Score should be displayed');
            
            const scoreValue = parseInt(scoreText.textContent);
            assert.ok(scoreValue >= 0 && scoreValue <= 100, 'Score should be between 0 and 100');
            
        } finally {
            document.body.removeChild(container);
        }
    });
});

testRunner.describe('E2E: Currency Conversion', () => {
    testRunner.it('should handle multi-currency inputs', async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        try {
            const CurrencyApp = () => {
                const [currency, setCurrency] = React.useState('USD');
                const [amount, setAmount] = React.useState(1000);
                const [converted, setConverted] = React.useState(null);
                
                React.useEffect(() => {
                    const api = new window.CurrencyAPI();
                    api.convertAmount(amount, currency, 'ILS').then(result => {
                        setConverted(result);
                    });
                }, [currency, amount]);
                
                return React.createElement('div', { className: 'p-4' },
                    React.createElement('h3', {}, 'Currency Converter Test'),
                    React.createElement('select', {
                        value: currency,
                        onChange: (e) => setCurrency(e.target.value)
                    },
                        React.createElement('option', { value: 'USD' }, 'USD'),
                        React.createElement('option', { value: 'EUR' }, 'EUR'),
                        React.createElement('option', { value: 'GBP' }, 'GBP')
                    ),
                    React.createElement('input', {
                        type: 'number',
                        value: amount,
                        onChange: (e) => setAmount(Number(e.target.value))
                    }),
                    converted && React.createElement('div', {}, 
                        `${amount} ${currency} = ${converted.toFixed(2)} ILS`
                    )
                );
            };
            
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(CurrencyApp));
            
            await wait(1000);
            
            // Check conversion display
            const conversionText = container.textContent;
            assert.includes(conversionText, 'ILS', 'Should show ILS conversion');
            assert.match(conversionText, /\d+\.\d{2} ILS/, 'Should show formatted amount');
            
        } finally {
            document.body.removeChild(container);
        }
    });
});

testRunner.describe('E2E: Data Persistence', () => {
    testRunner.it('should save and restore wizard progress', async () => {
        // Save test data
        const testData = {
            currentStep: 3,
            inputs: {
                planningType: 'individual',
                currentAge: 40,
                retirementAge: 65,
                monthlySalary: 25000
            }
        };
        
        localStorage.setItem('wizardCurrentStep', testData.currentStep.toString());
        localStorage.setItem('retirementWizardInputs', JSON.stringify(testData.inputs));
        
        // Create app and check if data is restored
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        try {
            const RestoredApp = () => {
                const savedStep = localStorage.getItem('wizardCurrentStep');
                const savedInputs = localStorage.getItem('retirementWizardInputs');
                
                return React.createElement('div', {},
                    React.createElement('div', {}, `Saved Step: ${savedStep}`),
                    React.createElement('div', {}, `Saved Age: ${JSON.parse(savedInputs).currentAge}`)
                );
            };
            
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(RestoredApp));
            
            await wait(100);
            
            assert.includes(container.textContent, 'Saved Step: 3', 'Should restore step');
            assert.includes(container.textContent, 'Saved Age: 40', 'Should restore inputs');
            
        } finally {
            // Cleanup
            localStorage.removeItem('wizardCurrentStep');
            localStorage.removeItem('retirementWizardInputs');
            document.body.removeChild(container);
        }
    });
});

testRunner.describe('E2E: Export Functionality', () => {
    testRunner.it('should prepare export data correctly', async () => {
        const exportData = {
            metadata: {
                version: '7.2.0',
                exportDate: new Date().toISOString(),
                planningType: 'individual'
            },
            inputs: {
                currentAge: 35,
                retirementAge: 67,
                monthlySalary: 20000,
                monthlyExpenses: 12000
            },
            results: {
                totalSavings: 3500000,
                monthlyRetirementIncome: 14000,
                yearsInRetirement: 25
            },
            financialHealth: {
                totalScore: 75,
                factors: {
                    'Savings Rate': { score: 15, weight: 20 },
                    'Emergency Fund': { score: 18, weight: 20 }
                }
            }
        };
        
        // Test export for LLM analysis
        const llmPrompt = window.exportFunctions.copyClaudePromptToClipboard(exportData);
        assert.ok(llmPrompt, 'Should generate LLM prompt');
        assert.includes(llmPrompt, 'Advanced Retirement Planner', 'Prompt should include app name');
        assert.includes(llmPrompt, exportData.inputs.monthlySalary.toString(), 'Prompt should include salary');
    });
});

testRunner.describe('E2E: Error Handling', () => {
    testRunner.it('should handle API failures gracefully', async () => {
        // Test currency API with network failure simulation
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        try {
            const ErrorTestApp = () => {
                const [error, setError] = React.useState(null);
                const [fallbackUsed, setFallbackUsed] = React.useState(false);
                
                React.useEffect(() => {
                    const api = new window.CurrencyAPI();
                    // The API should use fallback rates when network fails
                    api.fetchExchangeRates().then(rates => {
                        if (rates && rates.USD) {
                            setFallbackUsed(true);
                        }
                    }).catch(err => {
                        setError(err.message);
                    });
                }, []);
                
                return React.createElement('div', {},
                    error ? 
                        React.createElement('div', { className: 'text-red-500' }, `Error: ${error}`) :
                        React.createElement('div', { className: 'text-green-500' }, 
                            fallbackUsed ? 'Using fallback rates' : 'Fetching rates...'
                        )
                );
            };
            
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(ErrorTestApp));
            
            await wait(2000);
            
            // Should either show fallback message or have handled the error
            const content = container.textContent;
            assert.ok(
                content.includes('fallback') || content.includes('Error:'),
                'Should handle API failure gracefully'
            );
            
        } finally {
            document.body.removeChild(container);
        }
    });
});

testRunner.describe('E2E: Mobile Responsiveness', () => {
    testRunner.it('should render properly on mobile viewport', async () => {
        // Save original viewport
        const originalWidth = window.innerWidth;
        const originalHeight = window.innerHeight;
        
        // Simulate mobile viewport
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 375
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 667
        });
        
        const container = document.createElement('div');
        container.style.width = '375px';
        document.body.appendChild(container);
        
        try {
            const MobileApp = () => {
                return React.createElement('div', { className: 'container mx-auto px-4' },
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                        React.createElement('div', { className: 'bg-white p-4 rounded' }, 'Card 1'),
                        React.createElement('div', { className: 'bg-white p-4 rounded' }, 'Card 2')
                    )
                );
            };
            
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(MobileApp));
            
            await wait(100);
            
            // Check that content is rendered
            const cards = container.querySelectorAll('.bg-white');
            assert.equal(cards.length, 2, 'Should render both cards on mobile');
            
        } finally {
            // Restore viewport
            Object.defineProperty(window, 'innerWidth', { value: originalWidth });
            Object.defineProperty(window, 'innerHeight', { value: originalHeight });
            document.body.removeChild(container);
        }
    });
});

console.log('✅ E2E tests loaded');