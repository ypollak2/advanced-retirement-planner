// Test Environment Validation Utility
// Ensures all required functions are available for scenario testing

window.TestValidation = (function() {
    'use strict';

    // Required functions for comprehensive testing
    const REQUIRED_FUNCTIONS = [
        'calculateFinancialHealthScore',
        'validateFinancialInputs',
        'convertCurrency',
        'calculateRetirement'
    ];

    // Required global objects
    const REQUIRED_OBJECTS = [
        'TEST_SCENARIOS',
        'ScenarioTestRunner'
    ];

    // Validation results
    let validationResults = {
        functions: {},
        objects: {},
        isReady: false,
        errors: [],
        warnings: []
    };

    function validateEnvironment() {
        console.log('🔍 Validating test environment...');
        
        validationResults = {
            functions: {},
            objects: {},
            isReady: false,
            errors: [],
            warnings: []
        };

        // Check required functions
        REQUIRED_FUNCTIONS.forEach(funcName => {
            const isAvailable = typeof window[funcName] === 'function';
            validationResults.functions[funcName] = isAvailable;
            
            if (!isAvailable) {
                validationResults.errors.push(`Missing required function: ${funcName}()`);
                console.error(`❌ Missing function: ${funcName}()`);
            } else {
                console.log(`✅ Function available: ${funcName}()`);
            }
        });

        // Check required objects
        REQUIRED_OBJECTS.forEach(objName => {
            const isAvailable = typeof window[objName] !== 'undefined';
            validationResults.objects[objName] = isAvailable;
            
            if (!isAvailable) {
                validationResults.errors.push(`Missing required object: ${objName}`);
                console.error(`❌ Missing object: ${objName}`);
            } else {
                console.log(`✅ Object available: ${objName}`);
            }
        });

        // Special validation for TEST_SCENARIOS
        if (window.TEST_SCENARIOS) {
            if (!Array.isArray(window.TEST_SCENARIOS)) {
                validationResults.errors.push('TEST_SCENARIOS must be an array');
            } else if (window.TEST_SCENARIOS.length !== 10) {
                validationResults.warnings.push(`Expected 10 test scenarios, found ${window.TEST_SCENARIOS.length}`);
            } else {
                console.log(`✅ Found ${window.TEST_SCENARIOS.length} test scenarios`);
            }
        }

        // Test basic function functionality
        if (window.calculateFinancialHealthScore) {
            try {
                const testInput = {
                    planningType: 'individual',
                    currentAge: 30,
                    retirementAge: 65,
                    currentMonthlySalary: 10000,
                    currency: 'ILS'
                };
                
                const result = window.calculateFinancialHealthScore(testInput);
                
                if (result && typeof result.totalScore === 'number') {
                    console.log('✅ calculateFinancialHealthScore() basic test passed');
                } else {
                    validationResults.warnings.push('calculateFinancialHealthScore() may not return expected format');
                }
            } catch (error) {
                validationResults.errors.push(`calculateFinancialHealthScore() test failed: ${error.message}`);
            }
        }

        // Determine if environment is ready
        validationResults.isReady = validationResults.errors.length === 0;

        // Log summary
        if (validationResults.isReady) {
            console.log('✅ Test environment validation passed');
            if (validationResults.warnings.length > 0) {
                console.warn(`⚠️  ${validationResults.warnings.length} warnings found:`, validationResults.warnings);
            }
        } else {
            console.error(`❌ Test environment validation failed with ${validationResults.errors.length} errors`);
            validationResults.errors.forEach(error => console.error(`  - ${error}`));
        }

        return validationResults;
    }

    function createMockFunctions() {
        console.log('🔧 Creating mock functions for missing dependencies...');

        // Mock calculateFinancialHealthScore if missing
        if (!window.calculateFinancialHealthScore) {
            window.calculateFinancialHealthScore = function(inputs) {
                console.warn('Using mock calculateFinancialHealthScore function');
                
                // Simple mock calculation based on age and salary
                const age = parseInt(inputs.currentAge) || 30;
                const salary = parseFloat(inputs.currentMonthlySalary) || 10000;
                const yearsToRetirement = (parseInt(inputs.retirementAge) || 65) - age;
                
                // Mock score calculation
                const baseScore = Math.min(100, Math.max(0, 
                    (salary / 1000) + // Salary factor
                    (yearsToRetirement > 30 ? 25 : yearsToRetirement * 0.8) + // Time factor
                    Math.random() * 20 // Variability
                ));

                return {
                    totalScore: Math.round(baseScore),
                    factors: {
                        savingsRate: { score: Math.round(baseScore * 0.25) },
                        retirementReadiness: { score: Math.round(baseScore * 0.2) },
                        timeHorizon: { score: Math.round(baseScore * 0.15) },
                        riskAlignment: { score: Math.round(baseScore * 0.12) },
                        diversification: { score: Math.round(baseScore * 0.1) },
                        taxEfficiency: { score: Math.round(baseScore * 0.08) },
                        emergencyFund: { score: Math.round(baseScore * 0.07) },
                        debtManagement: { score: Math.round(baseScore * 0.03) }
                    },
                    isMocked: true
                };
            };
        }

        // Mock validateFinancialInputs if missing
        if (!window.validateFinancialInputs) {
            window.validateFinancialInputs = function(inputs) {
                console.warn('Using mock validateFinancialInputs function');
                
                const errors = [];
                if (!inputs.currentAge || inputs.currentAge < 18) {
                    errors.push('Valid age required (18+)');
                }
                if (!inputs.currentMonthlySalary || inputs.currentMonthlySalary <= 0) {
                    errors.push('Valid monthly salary required');
                }
                
                return {
                    isValid: errors.length === 0,
                    errors: errors,
                    warnings: [],
                    isMocked: true
                };
            };
        }

        // Mock convertCurrency if missing
        if (!window.convertCurrency) {
            window.convertCurrency = function(amount, fromCurrency, toCurrency) {
                console.warn('Using mock convertCurrency function');
                
                // Simple mock conversion rates
                const rates = {
                    'USD': { 'ILS': 3.5, 'EUR': 0.85, 'GBP': 0.75 },
                    'ILS': { 'USD': 0.29, 'EUR': 0.24, 'GBP': 0.21 },
                    'EUR': { 'USD': 1.18, 'ILS': 4.2, 'GBP': 0.88 },
                    'GBP': { 'USD': 1.33, 'ILS': 4.7, 'EUR': 1.14 }
                };
                
                if (fromCurrency === toCurrency) return amount;
                
                const rate = rates[fromCurrency]?.[toCurrency] || 1;
                return amount * rate;
            };
        }

        console.log('✅ Mock functions created');
    }

    function generateValidationReport() {
        const report = {
            timestamp: new Date().toISOString(),
            environment: 'Test Environment Validation',
            status: validationResults.isReady ? 'READY' : 'NOT_READY',
            summary: {
                functionsAvailable: Object.values(validationResults.functions).filter(Boolean).length,
                functionsTotal: REQUIRED_FUNCTIONS.length,
                objectsAvailable: Object.values(validationResults.objects).filter(Boolean).length,
                objectsTotal: REQUIRED_OBJECTS.length,
                errors: validationResults.errors.length,
                warnings: validationResults.warnings.length
            },
            details: validationResults
        };

        return report;
    }

    function displayValidationUI() {
        const validation = validateEnvironment();
        
        // Create validation UI element
        if (document.getElementById('validation-status')) {
            document.getElementById('validation-status').remove();
        }

        const statusDiv = document.createElement('div');
        statusDiv.id = 'validation-status';
        statusDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${validation.isReady ? '#d4edda' : '#f8d7da'};
            border: 1px solid ${validation.isReady ? '#c3e6cb' : '#f5c6cb'};
            color: ${validation.isReady ? '#155724' : '#721c24'};
            padding: 15px;
            border-radius: 8px;
            max-width: 300px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;

        const icon = validation.isReady ? '✅' : '❌';
        const status = validation.isReady ? 'Environment Ready' : 'Environment Issues';
        
        statusDiv.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">
                ${icon} ${status}
            </div>
            <div style="font-size: 12px; margin-bottom: 10px;">
                Functions: ${validation.summary.functionsAvailable}/${validation.summary.functionsTotal}<br>
                Objects: ${validation.summary.objectsAvailable}/${validation.summary.objectsTotal}<br>
                Errors: ${validation.summary.errors}<br>
                Warnings: ${validation.summary.warnings}
            </div>
            ${validation.errors.length > 0 ? `
                <div style="margin-top: 10px; font-size: 11px;">
                    <strong>Errors:</strong><br>
                    ${validation.errors.map(error => `• ${error}`).join('<br>')}
                </div>
            ` : ''}
            <button onclick="this.parentElement.remove()" style="
                margin-top: 10px;
                padding: 5px 10px;
                border: none;
                background: #007bff;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            ">Close</button>
        `;

        document.body.appendChild(statusDiv);

        // Auto-hide after 10 seconds if ready
        if (validation.isReady) {
            setTimeout(() => {
                if (statusDiv.parentElement) {
                    statusDiv.remove();
                }
            }, 10000);
        }
    }

    // Auto-validate on load
    if (typeof window !== 'undefined') {
        window.addEventListener('load', () => {
            setTimeout(() => {
                displayValidationUI();
            }, 1500);
        });
    }

    // Public API
    return {
        validate: validateEnvironment,
        createMocks: createMockFunctions,
        getResults: () => validationResults,
        generateReport: generateValidationReport,
        displayUI: displayValidationUI,
        
        // Utility functions for tests
        isReady: () => validationResults.isReady,
        hasErrors: () => validationResults.errors.length > 0,
        getErrors: () => validationResults.errors,
        getWarnings: () => validationResults.warnings
    };
})();

console.log('✅ Test Validation Utility loaded - Ready to validate environment');