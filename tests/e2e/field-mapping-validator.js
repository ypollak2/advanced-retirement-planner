// Field Mapping Validator for E2E Testing
// Validates that fields map correctly through the wizard steps to the scoring engine

class FieldMappingValidator {
    constructor() {
        this.criticalFields = this.defineCriticalFields();
        this.fieldVariations = this.defineFieldVariations();
        this.wizardStepMappings = this.defineWizardStepMappings();
        this.validationResults = [];
    }

    // Define all critical fields that must flow through the system
    defineCriticalFields() {
        return {
            // Personal Information
            planningType: {
                canonicalName: 'planningType',
                required: true,
                expectedValues: ['individual', 'couple'],
                affectsScoring: true
            },
            currentAge: {
                canonicalName: 'currentAge',
                required: true,
                minValue: 18,
                maxValue: 100,
                affectsScoring: true
            },
            retirementAge: {
                canonicalName: 'retirementAge',
                required: true,
                minValue: 50,
                maxValue: 100,
                affectsScoring: true
            },
            country: {
                canonicalName: 'country',
                required: true,
                expectedValues: ['israel', 'usa', 'uk', 'canada', 'other'],
                affectsScoring: true
            },

            // Income Fields
            currentMonthlySalary: {
                canonicalName: 'currentMonthlySalary',
                required: true,
                minValue: 0,
                affectsScoring: true,
                coupleMode: {
                    partner1: 'partner1Salary',
                    partner2: 'partner2Salary'
                }
            },

            // Expense Fields
            currentMonthlyExpenses: {
                canonicalName: 'currentMonthlyExpenses',
                required: true,
                minValue: 0,
                affectsScoring: true,
                alternativeSources: ['expenses.total', 'monthlyExpenses']
            },

            // Savings Fields
            currentPension: {
                canonicalName: 'currentPension',
                required: true,
                minValue: 0,
                affectsScoring: true,
                coupleMode: {
                    partner1: 'partner1CurrentPension',
                    partner2: 'partner2CurrentPension'
                }
            },
            currentTrainingFund: {
                canonicalName: 'currentTrainingFund',
                required: true,
                minValue: 0,
                affectsScoring: true,
                coupleMode: {
                    partner1: 'partner1CurrentTrainingFund',
                    partner2: 'partner2CurrentTrainingFund'
                }
            },
            currentPortfolio: {
                canonicalName: 'currentPortfolio',
                required: false,
                minValue: 0,
                affectsScoring: true,
                coupleMode: {
                    partner1: 'partner1Portfolio',
                    partner2: 'partner2Portfolio'
                }
            },
            currentRealEstate: {
                canonicalName: 'currentRealEstate',
                required: false,
                minValue: 0,
                affectsScoring: true
            },
            currentCrypto: {
                canonicalName: 'currentCrypto',
                required: false,
                minValue: 0,
                affectsScoring: true
            },
            currentSavingsAccount: {
                canonicalName: 'currentSavingsAccount',
                required: false,
                minValue: 0,
                affectsScoring: true
            },
            emergencyFund: {
                canonicalName: 'emergencyFund',
                required: true,
                minValue: 0,
                affectsScoring: true
            },

            // Contribution Rates
            pensionContributionRate: {
                canonicalName: 'pensionContributionRate',
                required: true,
                minValue: 0,
                maxValue: 50,
                affectsScoring: true,
                coupleMode: {
                    partner1: 'partner1PensionRate',
                    partner2: 'partner2PensionRate'
                }
            },
            trainingFundContributionRate: {
                canonicalName: 'trainingFundContributionRate',
                required: true,
                minValue: 0,
                maxValue: 20,
                affectsScoring: true,
                coupleMode: {
                    partner1: 'partner1TrainingFundRate',
                    partner2: 'partner2TrainingFundRate'
                }
            },

            // Risk and Return
            riskTolerance: {
                canonicalName: 'riskTolerance',
                required: true,
                expectedValues: ['conservative', 'balanced', 'moderate', 'aggressive', 'very_aggressive'],
                affectsScoring: true,
                coupleMode: {
                    partner1: 'partner1RiskProfile',
                    partner2: 'partner2RiskProfile'
                }
            },
            expectedAnnualReturn: {
                canonicalName: 'expectedAnnualReturn',
                required: true,
                minValue: 0,
                maxValue: 25,
                affectsScoring: true,
                coupleMode: {
                    partner1: 'partner1ExpectedReturn',
                    partner2: 'partner2ExpectedReturn'
                }
            }
        };
    }

    // Define all possible field name variations
    defineFieldVariations() {
        return {
            currentMonthlySalary: [
                'currentMonthlySalary',
                'currentSalary',
                'monthlySalary',
                'salary',
                'monthly_salary',
                'monthlyIncome',
                'currentMonthlyIncome'
            ],
            currentMonthlyExpenses: [
                'currentMonthlyExpenses',
                'monthlyExpenses',
                'expenses',
                'monthly_expenses',
                'totalMonthlyExpenses',
                'currentExpenses'
            ],
            currentPension: [
                'currentPension',
                'pensionSavings',
                'pension',
                'currentPensionSavings',
                'pensionBalance',
                'retirementSavings'
            ],
            currentTrainingFund: [
                'currentTrainingFund',
                'trainingFund',
                'trainingFundBalance',
                'studyFund',
                'educationFund',
                'currentStudyFund'
            ],
            emergencyFund: [
                'emergencyFund',
                'emergencySavings',
                'emergency_fund',
                'emergencyReserve',
                'emergencyBalance'
            ],
            currentAge: [
                'currentAge',
                'age',
                'current_age',
                'userAge',
                'personAge'
            ],
            retirementAge: [
                'retirementAge',
                'retirement_age',
                'targetRetirementAge',
                'plannedRetirementAge',
                'retireAge'
            ]
        };
    }

    // Define wizard step to field mappings
    defineWizardStepMappings() {
        return {
            // Step 1: Personal Information
            step1: {
                fields: ['planningType', 'currentAge', 'retirementAge', 'country'],
                validation: (data) => {
                    return data.planningType && data.currentAge && data.retirementAge && data.country;
                }
            },
            // Step 2: Income & Salary
            step2: {
                fields: ['currentMonthlySalary', 'partner1Salary', 'partner2Salary'],
                validation: (data) => {
                    if (data.planningType === 'couple') {
                        return data.partner1Salary >= 0 && data.partner2Salary >= 0;
                    }
                    return data.currentMonthlySalary >= 0;
                }
            },
            // Step 3: Expenses
            step3: {
                fields: ['currentMonthlyExpenses', 'expenses'],
                validation: (data) => {
                    return data.currentMonthlyExpenses >= 0 || (data.expenses && data.expenses.total >= 0);
                }
            },
            // Step 4: Current Savings
            step4: {
                fields: ['currentPension', 'currentTrainingFund', 'currentPortfolio', 'currentRealEstate', 'currentCrypto', 'currentSavingsAccount', 'emergencyFund'],
                validation: (data) => {
                    // At least pension and training fund should be defined
                    return data.currentPension !== undefined && data.currentTrainingFund !== undefined;
                }
            },
            // Step 5: Contribution Rates
            step5: {
                fields: ['pensionContributionRate', 'trainingFundContributionRate'],
                validation: (data) => {
                    return data.pensionContributionRate >= 0 && data.trainingFundContributionRate >= 0;
                }
            },
            // Step 6: Management Fees
            step6: {
                fields: ['pensionManagementFee', 'trainingFundManagementFee'],
                validation: (data) => true // Optional
            },
            // Step 7: Investment Preferences
            step7: {
                fields: ['riskTolerance', 'expectedAnnualReturn'],
                validation: (data) => {
                    return data.riskTolerance && data.expectedAnnualReturn >= 0;
                }
            },
            // Step 8: Goals
            step8: {
                fields: ['retirementGoal', 'monthlyRetirementIncome'],
                validation: (data) => true // Optional
            },
            // Step 9: Review
            step9: {
                fields: [], // All fields should be available
                validation: (data) => {
                    // Check all critical fields are present
                    return this.validateAllCriticalFields(data);
                }
            }
        };
    }

    // Validate field mapping for a specific scenario
    validateScenario(scenario, actualData, scoringResult) {
        const validation = {
            scenarioId: scenario.id,
            timestamp: new Date().toISOString(),
            passed: true,
            fieldResults: {},
            dataFlowResults: {},
            scoringIntegrity: {},
            issues: []
        };

        // 1. Validate field presence and values
        validation.fieldResults = this.validateFieldPresence(scenario.inputs, actualData);
        
        // 2. Validate data flow through wizard steps
        validation.dataFlowResults = this.validateDataFlow(scenario.inputs, actualData);
        
        // 3. Validate scoring integration
        validation.scoringIntegrity = this.validateScoringIntegration(scenario.inputs, scoringResult);
        
        // 4. Validate couple mode field mapping
        if (scenario.inputs.planningType === 'couple') {
            validation.coupleModeResults = this.validateCoupleMode(scenario.inputs, actualData);
        }

        // Compile issues
        validation.issues = this.compileIssues(validation);
        validation.passed = validation.issues.length === 0;

        this.validationResults.push(validation);
        return validation;
    }

    // Validate field presence and correct values
    validateFieldPresence(expectedData, actualData) {
        const results = {};

        Object.entries(this.criticalFields).forEach(([fieldName, fieldConfig]) => {
            const result = {
                found: false,
                value: null,
                expectedValue: expectedData[fieldName],
                variations: [],
                issues: []
            };

            // Check canonical name
            if (actualData[fieldName] !== undefined) {
                result.found = true;
                result.value = actualData[fieldName];
            } else {
                // Check variations
                const variations = this.fieldVariations[fieldName] || [fieldName];
                for (const variation of variations) {
                    if (actualData[variation] !== undefined) {
                        result.found = true;
                        result.value = actualData[variation];
                        result.variations.push(variation);
                        break;
                    }
                }
            }

            // Validate value
            if (result.found) {
                // Check if value matches expected
                if (expectedData[fieldName] !== undefined && result.value !== expectedData[fieldName]) {
                    // Allow for numeric tolerance
                    if (typeof result.value === 'number' && typeof expectedData[fieldName] === 'number') {
                        const diff = Math.abs(result.value - expectedData[fieldName]);
                        if (diff > 0.01) {
                            result.issues.push(`Value mismatch: expected ${expectedData[fieldName]}, got ${result.value}`);
                        }
                    } else {
                        result.issues.push(`Value mismatch: expected ${expectedData[fieldName]}, got ${result.value}`);
                    }
                }

                // Validate constraints
                if (fieldConfig.minValue !== undefined && result.value < fieldConfig.minValue) {
                    result.issues.push(`Value below minimum: ${result.value} < ${fieldConfig.minValue}`);
                }
                if (fieldConfig.maxValue !== undefined && result.value > fieldConfig.maxValue) {
                    result.issues.push(`Value above maximum: ${result.value} > ${fieldConfig.maxValue}`);
                }
                if (fieldConfig.expectedValues && !fieldConfig.expectedValues.includes(result.value)) {
                    result.issues.push(`Invalid value: ${result.value} not in ${fieldConfig.expectedValues.join(', ')}`);
                }
            } else if (fieldConfig.required) {
                result.issues.push('Required field not found');
            }

            results[fieldName] = result;
        });

        return results;
    }

    // Validate data flow through wizard steps
    validateDataFlow(inputData, wizardData) {
        const results = {};

        Object.entries(this.wizardStepMappings).forEach(([step, stepConfig]) => {
            const stepResult = {
                step: step,
                fieldsPresent: [],
                fieldsMissing: [],
                validationPassed: false
            };

            // Check each field expected in this step
            stepConfig.fields.forEach(field => {
                if (wizardData[field] !== undefined || this.findFieldValue(wizardData, field)) {
                    stepResult.fieldsPresent.push(field);
                } else {
                    stepResult.fieldsMissing.push(field);
                }
            });

            // Run step validation
            stepResult.validationPassed = stepConfig.validation(wizardData);

            results[step] = stepResult;
        });

        return results;
    }

    // Validate scoring integration
    validateScoringIntegration(inputData, scoringResult) {
        const results = {
            scoreCalculated: false,
            factorsReceivingData: [],
            factorsMissingData: [],
            fieldMappingSuccess: {},
            criticalErrors: []
        };

        if (!scoringResult) {
            results.criticalErrors.push('No scoring result provided');
            return results;
        }

        results.scoreCalculated = scoringResult.totalScore !== undefined && scoringResult.totalScore >= 0;

        // Check each scoring factor
        if (scoringResult.factorScores) {
            Object.entries(scoringResult.factorScores).forEach(([factor, data]) => {
                if (data.score > 0 || data.details?.dataFound) {
                    results.factorsReceivingData.push(factor);
                } else {
                    results.factorsMissingData.push(factor);
                }

                // Check specific field mappings for each factor
                results.fieldMappingSuccess[factor] = this.validateFactorFieldMapping(factor, inputData, data);
            });
        }

        // Check for critical scoring errors
        if (scoringResult.totalScore >= 27 && scoringResult.totalScore <= 29) {
            results.criticalErrors.push('CRITICAL_LOW_SCORE_BUG: Score in problematic range 27-29');
        }

        if (results.factorsMissingData.length > 4) {
            results.criticalErrors.push('Too many factors missing data');
        }

        return results;
    }

    // Validate factor-specific field mapping
    validateFactorFieldMapping(factor, inputData, factorData) {
        const mapping = {
            fieldsUsed: [],
            fieldsMissing: [],
            mappingSuccess: true
        };

        switch (factor) {
            case 'savingsRate':
                // Should use salary and expenses
                if (inputData.currentMonthlySalary && inputData.currentMonthlyExpenses) {
                    mapping.fieldsUsed.push('currentMonthlySalary', 'currentMonthlyExpenses');
                } else {
                    mapping.fieldsMissing.push('salary or expenses');
                    mapping.mappingSuccess = false;
                }
                break;

            case 'retirementReadiness':
                // Should use all savings fields
                const savingsFields = ['currentPension', 'currentTrainingFund', 'currentPortfolio'];
                savingsFields.forEach(field => {
                    if (inputData[field] >= 0) {
                        mapping.fieldsUsed.push(field);
                    } else {
                        mapping.fieldsMissing.push(field);
                    }
                });
                break;

            case 'emergencyFund':
                // Should use emergency fund and expenses
                if (inputData.emergencyFund >= 0) {
                    mapping.fieldsUsed.push('emergencyFund');
                } else {
                    mapping.fieldsMissing.push('emergencyFund');
                    mapping.mappingSuccess = false;
                }
                break;

            // Add more factor-specific validations...
        }

        return mapping;
    }

    // Validate couple mode field mapping
    validateCoupleMode(inputData, actualData) {
        const results = {
            partner1FieldsFound: [],
            partner2FieldsFound: [],
            combinedFieldsCorrect: [],
            issues: []
        };

        Object.entries(this.criticalFields).forEach(([fieldName, config]) => {
            if (config.coupleMode) {
                // Check partner 1
                if (actualData[config.coupleMode.partner1] !== undefined) {
                    results.partner1FieldsFound.push(config.coupleMode.partner1);
                } else if (inputData[config.coupleMode.partner1] !== undefined) {
                    results.issues.push(`Partner 1 field missing: ${config.coupleMode.partner1}`);
                }

                // Check partner 2
                if (actualData[config.coupleMode.partner2] !== undefined) {
                    results.partner2FieldsFound.push(config.coupleMode.partner2);
                } else if (inputData[config.coupleMode.partner2] !== undefined) {
                    results.issues.push(`Partner 2 field missing: ${config.coupleMode.partner2}`);
                }

                // Validate combination logic
                const p1Value = actualData[config.coupleMode.partner1] || 0;
                const p2Value = actualData[config.coupleMode.partner2] || 0;
                const expectedCombined = (parseFloat(inputData[config.coupleMode.partner1]) || 0) + 
                                       (parseFloat(inputData[config.coupleMode.partner2]) || 0);

                if (config.affectsScoring && Math.abs((p1Value + p2Value) - expectedCombined) < 0.01) {
                    results.combinedFieldsCorrect.push(fieldName);
                }
            }
        });

        // Check that individual mode fields are NOT used in couple mode
        if (actualData.currentMonthlySalary && inputData.planningType === 'couple') {
            results.issues.push('Individual salary field used in couple mode');
        }

        return results;
    }

    // Find field value using variations
    findFieldValue(data, fieldName) {
        const variations = this.fieldVariations[fieldName] || [fieldName];
        for (const variation of variations) {
            if (data[variation] !== undefined) {
                return data[variation];
            }
        }
        return undefined;
    }

    // Compile all issues from validation results
    compileIssues(validation) {
        const issues = [];

        // Field presence issues
        Object.entries(validation.fieldResults).forEach(([field, result]) => {
            if (result.issues.length > 0) {
                issues.push(`Field '${field}': ${result.issues.join(', ')}`);
            }
        });

        // Data flow issues
        Object.entries(validation.dataFlowResults).forEach(([step, result]) => {
            if (result.fieldsMissing.length > 0) {
                issues.push(`${step}: Missing fields - ${result.fieldsMissing.join(', ')}`);
            }
            if (!result.validationPassed) {
                issues.push(`${step}: Validation failed`);
            }
        });

        // Scoring integration issues
        if (validation.scoringIntegrity.criticalErrors.length > 0) {
            issues.push(...validation.scoringIntegrity.criticalErrors);
        }
        if (validation.scoringIntegrity.factorsMissingData.length > 0) {
            issues.push(`Scoring factors missing data: ${validation.scoringIntegrity.factorsMissingData.join(', ')}`);
        }

        // Couple mode issues
        if (validation.coupleModeResults?.issues.length > 0) {
            issues.push(...validation.coupleModeResults.issues);
        }

        return issues;
    }

    // Validate all critical fields are present
    validateAllCriticalFields(data) {
        const requiredFields = Object.entries(this.criticalFields)
            .filter(([_, config]) => config.required)
            .map(([field, _]) => field);

        return requiredFields.every(field => 
            data[field] !== undefined || this.findFieldValue(data, field) !== undefined
        );
    }

    // Generate field mapping report
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalValidations: this.validationResults.length,
            passed: this.validationResults.filter(v => v.passed).length,
            failed: this.validationResults.filter(v => !v.passed).length,
            commonIssues: this.findCommonIssues(),
            fieldMappingSuccess: this.calculateFieldMappingSuccess(),
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    // Find common issues across all validations
    findCommonIssues() {
        const issueCounts = {};

        this.validationResults.forEach(validation => {
            validation.issues.forEach(issue => {
                // Extract issue type
                const issueType = issue.split(':')[0];
                issueCounts[issueType] = (issueCounts[issueType] || 0) + 1;
            });
        });

        return Object.entries(issueCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([issue, count]) => ({ issue, count, percentage: (count / this.validationResults.length * 100).toFixed(2) }));
    }

    // Calculate field mapping success rates
    calculateFieldMappingSuccess() {
        const fieldSuccess = {};

        Object.keys(this.criticalFields).forEach(field => {
            let found = 0;
            let total = 0;

            this.validationResults.forEach(validation => {
                if (validation.fieldResults[field]) {
                    total++;
                    if (validation.fieldResults[field].found && validation.fieldResults[field].issues.length === 0) {
                        found++;
                    }
                }
            });

            fieldSuccess[field] = {
                successRate: total > 0 ? (found / total * 100).toFixed(2) : 0,
                found: found,
                total: total
            };
        });

        return fieldSuccess;
    }

    // Generate recommendations based on validation results
    generateRecommendations() {
        const recommendations = [];

        // Check for systematic field mapping issues
        const fieldSuccess = this.calculateFieldMappingSuccess();
        Object.entries(fieldSuccess).forEach(([field, stats]) => {
            if (parseFloat(stats.successRate) < 80) {
                recommendations.push({
                    type: 'field_mapping',
                    severity: 'high',
                    field: field,
                    message: `Field '${field}' has low success rate (${stats.successRate}%). Check field name variations and mapping logic.`
                });
            }
        });

        // Check for critical low score bug
        const criticalLowScores = this.validationResults.filter(v =>
            v.issues.some(i => i.includes('CRITICAL_LOW_SCORE_BUG'))
        ).length;

        if (criticalLowScores > 0) {
            recommendations.push({
                type: 'scoring_bug',
                severity: 'critical',
                message: `Critical low score bug detected in ${criticalLowScores} tests. Scores consistently returning 27-29.`
            });
        }

        // Check for couple mode issues
        const coupleModeFailures = this.validationResults.filter(v =>
            v.coupleModeResults && v.coupleModeResults.issues.length > 0
        ).length;

        if (coupleModeFailures > 0) {
            recommendations.push({
                type: 'couple_mode',
                severity: 'high',
                message: `Couple mode field mapping issues in ${coupleModeFailures} tests. Partner fields not combining correctly.`
            });
        }

        return recommendations;
    }

    // Export validation results
    exportResults(format = 'json') {
        const data = {
            report: this.generateReport(),
            detailedResults: this.validationResults,
            fieldDefinitions: this.criticalFields,
            wizardMappings: this.wizardStepMappings
        };

        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.convertToCSV(data);
            default:
                return data;
        }
    }

    // Convert results to CSV format
    convertToCSV(data) {
        const rows = [['Scenario ID', 'Passed', 'Issues Count', 'Critical Issues', 'Field Mapping Success', 'Scoring Success']];

        this.validationResults.forEach(v => {
            const fieldSuccess = Object.values(v.fieldResults).filter(f => f.found && f.issues.length === 0).length;
            const totalFields = Object.keys(v.fieldResults).length;
            const scoringSuccess = v.scoringIntegrity.scoreCalculated && v.scoringIntegrity.criticalErrors.length === 0;

            rows.push([
                v.scenarioId,
                v.passed ? 'Yes' : 'No',
                v.issues.length,
                v.scoringIntegrity.criticalErrors.join('; '),
                `${fieldSuccess}/${totalFields}`,
                scoringSuccess ? 'Yes' : 'No'
            ]);
        });

        return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }
}

// Export for use in tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FieldMappingValidator;
} else {
    window.FieldMappingValidator = FieldMappingValidator;
}