// Score Validation Engine for Financial Health E2E Testing
// Validates score calculations against expected ranges and identifies issues

class ScoreValidationEngine {
    constructor() {
        this.scoringFactors = this.defineFactorWeights();
        this.expectedRanges = this.defineExpectedRanges();
        this.validationRules = this.defineValidationRules();
        this.knownIssues = this.defineKnownIssues();
        this.validationResults = [];
    }

    // Define scoring factor weights and expected behavior
    defineFactorWeights() {
        return {
            savingsRate: {
                weight: 25,
                name: 'Savings Rate',
                criticalForScore: true,
                expectedBehavior: {
                    zeroIncome: 'Should return 0',
                    negativeSavings: 'Should return 0',
                    highSavings: 'Should approach max weight'
                }
            },
            retirementReadiness: {
                weight: 20,
                name: 'Retirement Readiness',
                criticalForScore: true,
                expectedBehavior: {
                    youngAge: 'Lower expectations',
                    nearRetirement: 'Higher expectations',
                    noSavings: 'Should return 0 or very low'
                }
            },
            timeHorizon: {
                weight: 15,
                name: 'Time to Retirement',
                criticalForScore: true,
                expectedBehavior: {
                    longHorizon: 'Should score high',
                    shortHorizon: 'Should score low',
                    pastRetirement: 'Should return 0'
                }
            },
            riskAlignment: {
                weight: 12,
                name: 'Risk Alignment',
                criticalForScore: false,
                expectedBehavior: {
                    ageAppropriate: 'Should score high',
                    tooAggressive: 'Should penalize',
                    tooConservative: 'Should penalize'
                }
            },
            diversification: {
                weight: 10,
                name: 'Diversification',
                criticalForScore: false,
                expectedBehavior: {
                    multipleAssets: 'Should score high',
                    singleAsset: 'Should score low',
                    noAssets: 'Should return 0'
                }
            },
            taxEfficiency: {
                weight: 8,
                name: 'Tax Efficiency',
                criticalForScore: false,
                expectedBehavior: {
                    maxContributions: 'Should score high',
                    noContributions: 'Should score low',
                    overContributions: 'Should handle gracefully'
                }
            },
            emergencyFund: {
                weight: 7,
                name: 'Emergency Fund',
                criticalForScore: false,
                expectedBehavior: {
                    sixMonths: 'Should score high',
                    threeMonths: 'Should score medium',
                    none: 'Should return 0'
                }
            },
            debtManagement: {
                weight: 3,
                name: 'Debt Management',
                criticalForScore: false,
                expectedBehavior: {
                    noDebt: 'Should score max',
                    moderateDebt: 'Should score medium',
                    highDebt: 'Should return 0'
                }
            }
        };
    }

    // Define expected score ranges for different user profiles
    defineExpectedRanges() {
        return {
            // Age-based profiles
            youngProfessional: { // 25-35
                minimal: { min: 35, max: 55 },
                average: { min: 50, max: 70 },
                excellent: { min: 65, max: 85 }
            },
            midCareer: { // 36-50
                minimal: { min: 40, max: 60 },
                average: { min: 55, max: 75 },
                excellent: { min: 70, max: 90 }
            },
            preRetirement: { // 51-65
                minimal: { min: 45, max: 65 },
                average: { min: 60, max: 80 },
                excellent: { min: 75, max: 95 }
            },
            
            // Special cases
            unemployed: { min: 0, max: 30 },
            highDebt: { min: 15, max: 45 },
            highNetWorth: { min: 80, max: 100 },
            
            // Couple profiles
            dualIncome: { min: 60, max: 85 },
            singleIncome: { min: 45, max: 70 },
            
            // Edge cases
            zeroData: { min: 0, max: 10 },
            missingCriticalData: { min: 0, max: 40 }
        };
    }

    // Define validation rules for score calculations
    defineValidationRules() {
        return {
            // Total score rules
            totalScore: {
                min: 0,
                max: 100,
                criticalLowRange: { min: 27, max: 29 }, // Known bug range
                suspiciousRanges: [
                    { min: 0, max: 0, reason: 'Exact zero suspicious' },
                    { min: 100, max: 100, reason: 'Perfect score suspicious' }
                ]
            },
            
            // Factor score rules
            factorScores: {
                mustSumToTotal: true,
                allowedDeviation: 0.1, // Rounding tolerance
                zeroFactorLimit: 4, // Max factors that can be zero
                requiredFactors: ['savingsRate', 'retirementReadiness', 'timeHorizon']
            },
            
            // Data validation rules
            inputValidation: {
                requiredFields: [
                    'planningType', 'currentAge', 'retirementAge',
                    'currentMonthlySalary', 'currentMonthlyExpenses'
                ],
                numericFields: {
                    minValues: {
                        currentAge: 18,
                        retirementAge: 50,
                        currentMonthlySalary: 0,
                        currentMonthlyExpenses: 0
                    },
                    maxValues: {
                        currentAge: 100,
                        retirementAge: 100,
                        currentMonthlySalary: 1000000,
                        currentMonthlyExpenses: 1000000
                    }
                }
            },
            
            // Logical consistency rules
            consistency: {
                ageLogic: 'currentAge < retirementAge',
                incomeExpenseLogic: 'Allow expenses > income (debt scenario)',
                savingsLogic: 'Total savings should be reasonable for age and income',
                contributionLogic: 'Contribution rates should be within legal limits'
            }
        };
    }

    // Define known issues to check for
    defineKnownIssues() {
        return {
            CRITICAL_LOW_SCORE_BUG: {
                description: 'Scores consistently return 27-29 regardless of input',
                detection: (score) => score >= 27 && score <= 29,
                severity: 'critical',
                impact: 'Makes scoring system unreliable'
            },
            FIELD_MAPPING_FAILURE: {
                description: 'Fields not mapping correctly to scoring engine',
                detection: (result) => result.factorScores && 
                    Object.values(result.factorScores).filter(f => f.details?.error === 'field_not_found').length > 2,
                severity: 'high',
                impact: 'Inaccurate scores due to missing data'
            },
            ZERO_SCORE_EPIDEMIC: {
                description: 'Too many factors returning zero',
                detection: (result) => result.factorScores && 
                    Object.values(result.factorScores).filter(f => f.score === 0).length > 4,
                severity: 'high',
                impact: 'Artificially low scores'
            },
            COUPLE_MODE_COMBINATION_FAILURE: {
                description: 'Partner data not combining correctly',
                detection: (result, inputs) => inputs.planningType === 'couple' && 
                    result.totalScore < 20 && 
                    (inputs.partner1Salary > 0 || inputs.partner2Salary > 0),
                severity: 'high',
                impact: 'Couple scores much lower than expected'
            },
            CALCULATION_OVERFLOW: {
                description: 'Score calculation produces NaN or Infinity',
                detection: (result) => !isFinite(result.totalScore) || isNaN(result.totalScore),
                severity: 'critical',
                impact: 'Complete calculation failure'
            }
        };
    }

    // Main validation method
    validateScore(scenario, scoringResult) {
        const validation = {
            scenarioId: scenario.id,
            timestamp: new Date().toISOString(),
            passed: true,
            score: {
                actual: scoringResult.totalScore,
                expected: scenario.expectedScoreRange,
                inRange: false,
                deviation: 0
            },
            factorAnalysis: {},
            issues: [],
            warnings: [],
            detectedBugs: []
        };

        // 1. Validate total score
        validation.score = this.validateTotalScore(scoringResult.totalScore, scenario.expectedScoreRange);
        
        // 2. Validate factor scores
        validation.factorAnalysis = this.validateFactorScores(scoringResult.factorScores, scenario.inputs);
        
        // 3. Check for known issues
        validation.detectedBugs = this.checkKnownIssues(scoringResult, scenario.inputs);
        
        // 4. Validate score consistency
        validation.consistency = this.validateScoreConsistency(scoringResult, scenario.inputs);
        
        // 5. Profile-based validation
        validation.profileValidation = this.validateAgainstProfile(scenario, scoringResult);
        
        // Compile issues and determine pass/fail
        this.compileValidationResults(validation);
        
        this.validationResults.push(validation);
        return validation;
    }

    // Validate total score
    validateTotalScore(actualScore, expectedRange) {
        const result = {
            actual: actualScore,
            expected: expectedRange,
            inRange: actualScore >= expectedRange.min && actualScore <= expectedRange.max,
            deviation: 0,
            status: 'unknown'
        };

        // Calculate deviation
        if (!result.inRange) {
            if (actualScore < expectedRange.min) {
                result.deviation = expectedRange.min - actualScore;
                result.status = 'below_range';
            } else {
                result.deviation = actualScore - expectedRange.max;
                result.status = 'above_range';
            }
        } else {
            result.status = 'in_range';
        }

        // Check against validation rules
        if (actualScore < this.validationRules.totalScore.min || 
            actualScore > this.validationRules.totalScore.max) {
            result.status = 'out_of_bounds';
        }

        // Check for critical low score bug
        const criticalRange = this.validationRules.totalScore.criticalLowRange;
        if (actualScore >= criticalRange.min && actualScore <= criticalRange.max) {
            result.status = 'critical_bug_range';
        }

        return result;
    }

    // Validate individual factor scores
    validateFactorScores(factorScores, inputs) {
        const analysis = {
            factorResults: {},
            totalFromFactors: 0,
            zeroFactors: [],
            missingFactors: [],
            issues: []
        };

        if (!factorScores) {
            analysis.issues.push('No factor scores provided');
            return analysis;
        }

        // Analyze each factor
        Object.entries(this.scoringFactors).forEach(([factorName, factorConfig]) => {
            const factorData = factorScores[factorName];
            
            if (!factorData) {
                analysis.missingFactors.push(factorName);
                if (factorConfig.criticalForScore) {
                    analysis.issues.push(`Critical factor missing: ${factorName}`);
                }
                return;
            }

            const factorResult = {
                score: factorData.score || 0,
                maxScore: factorConfig.weight,
                percentage: ((factorData.score || 0) / factorConfig.weight) * 100,
                status: 'unknown',
                details: factorData.details || {}
            };

            // Validate factor score
            if (factorResult.score === 0) {
                analysis.zeroFactors.push(factorName);
                factorResult.status = 'zero';
                
                // Check if zero is expected
                if (!this.isZeroExpected(factorName, inputs)) {
                    factorResult.status = 'unexpected_zero';
                    analysis.issues.push(`Unexpected zero score for ${factorName}`);
                }
            } else if (factorResult.score > factorConfig.weight) {
                factorResult.status = 'exceeds_max';
                analysis.issues.push(`${factorName} exceeds maximum weight`);
            } else if (factorResult.score < 0) {
                factorResult.status = 'negative';
                analysis.issues.push(`${factorName} has negative score`);
            } else {
                factorResult.status = 'normal';
            }

            analysis.factorResults[factorName] = factorResult;
            analysis.totalFromFactors += factorResult.score;
        });

        // Check if factors sum to total
        if (Math.abs(analysis.totalFromFactors - (factorScores.totalScore || 0)) > this.validationRules.factorScores.allowedDeviation) {
            analysis.issues.push(`Factor sum (${analysis.totalFromFactors}) doesn't match total score`);
        }

        // Check zero factor limit
        if (analysis.zeroFactors.length > this.validationRules.factorScores.zeroFactorLimit) {
            analysis.issues.push(`Too many zero factors: ${analysis.zeroFactors.length}`);
        }

        return analysis;
    }

    // Check if zero score is expected for a factor
    isZeroExpected(factorName, inputs) {
        switch (factorName) {
            case 'savingsRate':
                return inputs.currentMonthlySalary === 0 || 
                       inputs.currentMonthlyExpenses >= inputs.currentMonthlySalary;
            
            case 'retirementReadiness':
                return !inputs.currentPension && !inputs.currentTrainingFund && 
                       !inputs.currentPortfolio && !inputs.currentRealEstate;
            
            case 'timeHorizon':
                return inputs.currentAge >= inputs.retirementAge;
            
            case 'emergencyFund':
                return !inputs.emergencyFund || inputs.emergencyFund === 0;
            
            case 'debtManagement':
                return false; // No debt should score max, not zero
            
            default:
                return false;
        }
    }

    // Check for known issues
    checkKnownIssues(scoringResult, inputs) {
        const detectedBugs = [];

        Object.entries(this.knownIssues).forEach(([bugName, bugConfig]) => {
            if (bugConfig.detection(scoringResult, inputs)) {
                detectedBugs.push({
                    name: bugName,
                    description: bugConfig.description,
                    severity: bugConfig.severity,
                    impact: bugConfig.impact
                });
            }
        });

        return detectedBugs;
    }

    // Validate score consistency
    validateScoreConsistency(scoringResult, inputs) {
        const consistency = {
            logicalErrors: [],
            warnings: [],
            dataQuality: 'unknown'
        };

        // Age logic
        if (inputs.currentAge >= inputs.retirementAge) {
            consistency.warnings.push('Current age >= retirement age');
        }

        // Income/expense logic
        const savingsRate = (inputs.currentMonthlySalary - inputs.currentMonthlyExpenses) / inputs.currentMonthlySalary;
        if (savingsRate < -0.5) {
            consistency.warnings.push('Expenses exceed income by more than 50%');
        }

        // Score vs data quality
        if (scoringResult.totalScore > 80 && (!inputs.currentPension || inputs.currentPension < 10000)) {
            consistency.logicalErrors.push('High score with minimal retirement savings');
        }

        if (scoringResult.totalScore < 30 && inputs.currentMonthlySalary > 50000 && savingsRate > 0.3) {
            consistency.logicalErrors.push('Low score despite high income and savings rate');
        }

        // Determine data quality
        const criticalFieldsPresent = ['currentMonthlySalary', 'currentMonthlyExpenses', 'currentAge', 'retirementAge']
            .every(field => inputs[field] !== undefined && inputs[field] !== null);

        if (criticalFieldsPresent) {
            consistency.dataQuality = 'complete';
        } else {
            consistency.dataQuality = 'incomplete';
        }

        return consistency;
    }

    // Validate against expected profile
    validateAgainstProfile(scenario, scoringResult) {
        const validation = {
            profileMatched: false,
            expectedProfile: null,
            deviationFromProfile: 0,
            explanation: ''
        };

        // Determine profile based on scenario
        let expectedRange = null;
        let profileName = '';

        // Age-based profile
        const age = scenario.inputs.currentAge;
        if (age <= 35) {
            profileName = 'youngProfessional';
            expectedRange = this.expectedRanges.youngProfessional;
        } else if (age <= 50) {
            profileName = 'midCareer';
            expectedRange = this.expectedRanges.midCareer;
        } else {
            profileName = 'preRetirement';
            expectedRange = this.expectedRanges.preRetirement;
        }

        // Override for special cases
        if (scenario.inputs.currentMonthlySalary === 0) {
            profileName = 'unemployed';
            expectedRange = this.expectedRanges.unemployed;
        } else if (this.calculateDebtRatio(scenario.inputs) > 0.5) {
            profileName = 'highDebt';
            expectedRange = this.expectedRanges.highDebt;
        } else if (this.calculateNetWorth(scenario.inputs) > 5000000) {
            profileName = 'highNetWorth';
            expectedRange = this.expectedRanges.highNetWorth;
        }

        validation.expectedProfile = profileName;

        // Check if score matches profile
        if (expectedRange) {
            if (expectedRange.minimal && expectedRange.average && expectedRange.excellent) {
                // Determine which sub-profile matches
                const netWorth = this.calculateNetWorth(scenario.inputs);
                const income = scenario.inputs.currentMonthlySalary;
                
                if (netWorth > income * 100) {
                    expectedRange = expectedRange.excellent;
                } else if (netWorth > income * 50) {
                    expectedRange = expectedRange.average;
                } else {
                    expectedRange = expectedRange.minimal;
                }
            }

            validation.profileMatched = scoringResult.totalScore >= expectedRange.min && 
                                      scoringResult.totalScore <= expectedRange.max;
            
            if (!validation.profileMatched) {
                if (scoringResult.totalScore < expectedRange.min) {
                    validation.deviationFromProfile = expectedRange.min - scoringResult.totalScore;
                    validation.explanation = `Score ${validation.deviationFromProfile} points below ${profileName} profile`;
                } else {
                    validation.deviationFromProfile = scoringResult.totalScore - expectedRange.max;
                    validation.explanation = `Score ${validation.deviationFromProfile} points above ${profileName} profile`;
                }
            }
        }

        return validation;
    }

    // Calculate debt ratio
    calculateDebtRatio(inputs) {
        const income = inputs.currentMonthlySalary || 0;
        if (income === 0) return 0;

        let monthlyDebt = 0;
        if (inputs.expenses) {
            monthlyDebt = (inputs.expenses.mortgage || 0) + 
                         (inputs.expenses.carLoan || 0) + 
                         (inputs.expenses.creditCard || 0) + 
                         (inputs.expenses.otherDebt || 0);
        }

        return monthlyDebt / income;
    }

    // Calculate net worth
    calculateNetWorth(inputs) {
        return (inputs.currentPension || 0) + 
               (inputs.currentTrainingFund || 0) + 
               (inputs.currentPortfolio || 0) + 
               (inputs.currentRealEstate || 0) + 
               (inputs.currentCrypto || 0) + 
               (inputs.currentSavingsAccount || 0) + 
               (inputs.emergencyFund || 0);
    }

    // Compile validation results
    compileValidationResults(validation) {
        // Add score issues
        if (!validation.score.inRange) {
            validation.issues.push(`Score out of expected range by ${validation.score.deviation} points`);
        }
        
        if (validation.score.status === 'critical_bug_range') {
            validation.issues.push('CRITICAL: Score in bug range 27-29');
        }

        // Add factor issues
        if (validation.factorAnalysis.issues) {
            validation.issues.push(...validation.factorAnalysis.issues);
        }

        // Add detected bugs
        validation.detectedBugs.forEach(bug => {
            if (bug.severity === 'critical') {
                validation.issues.push(`BUG: ${bug.name} - ${bug.description}`);
            } else {
                validation.warnings.push(`BUG: ${bug.name} - ${bug.description}`);
            }
        });

        // Add consistency issues
        if (validation.consistency) {
            validation.issues.push(...validation.consistency.logicalErrors);
            validation.warnings.push(...validation.consistency.warnings);
        }

        // Add profile validation issues
        if (validation.profileValidation && !validation.profileValidation.profileMatched) {
            validation.warnings.push(validation.profileValidation.explanation);
        }

        // Determine pass/fail
        validation.passed = validation.issues.length === 0 && 
                          validation.detectedBugs.filter(b => b.severity === 'critical').length === 0;
    }

    // Generate validation report
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalValidations: this.validationResults.length,
            summary: {
                passed: this.validationResults.filter(v => v.passed).length,
                failed: this.validationResults.filter(v => !v.passed).length,
                criticalBugs: this.countCriticalBugs(),
                scoreDistribution: this.analyzeScoreDistribution(),
                commonIssues: this.findCommonIssues(),
                factorPerformance: this.analyzeFactorPerformance()
            },
            recommendations: this.generateRecommendations(),
            detailedResults: this.validationResults
        };

        return report;
    }

    // Count critical bugs
    countCriticalBugs() {
        const bugCounts = {};
        
        this.validationResults.forEach(v => {
            v.detectedBugs.forEach(bug => {
                if (bug.severity === 'critical') {
                    bugCounts[bug.name] = (bugCounts[bug.name] || 0) + 1;
                }
            });
        });

        return bugCounts;
    }

    // Analyze score distribution
    analyzeScoreDistribution() {
        const distribution = {
            '0-20': 0,
            '21-40': 0,
            '41-60': 0,
            '61-80': 0,
            '81-100': 0,
            'critical_range_27-29': 0
        };

        this.validationResults.forEach(v => {
            const score = v.score.actual;
            if (score >= 27 && score <= 29) {
                distribution['critical_range_27-29']++;
            }
            
            if (score <= 20) distribution['0-20']++;
            else if (score <= 40) distribution['21-40']++;
            else if (score <= 60) distribution['41-60']++;
            else if (score <= 80) distribution['61-80']++;
            else distribution['81-100']++;
        });

        return distribution;
    }

    // Find common issues
    findCommonIssues() {
        const issueCounts = {};

        this.validationResults.forEach(v => {
            v.issues.forEach(issue => {
                const issueKey = issue.split(':')[0].trim();
                issueCounts[issueKey] = (issueCounts[issueKey] || 0) + 1;
            });
        });

        return Object.entries(issueCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([issue, count]) => ({
                issue,
                count,
                percentage: (count / this.validationResults.length * 100).toFixed(2)
            }));
    }

    // Analyze factor performance
    analyzeFactorPerformance() {
        const factorStats = {};

        Object.keys(this.scoringFactors).forEach(factor => {
            factorStats[factor] = {
                zeroCount: 0,
                averageScore: 0,
                averagePercentage: 0,
                unexpectedZeros: 0
            };
        });

        this.validationResults.forEach(v => {
            if (v.factorAnalysis && v.factorAnalysis.factorResults) {
                Object.entries(v.factorAnalysis.factorResults).forEach(([factor, data]) => {
                    if (data.score === 0) {
                        factorStats[factor].zeroCount++;
                        if (data.status === 'unexpected_zero') {
                            factorStats[factor].unexpectedZeros++;
                        }
                    }
                    factorStats[factor].averageScore += data.score;
                    factorStats[factor].averagePercentage += data.percentage;
                });
            }
        });

        // Calculate averages
        const validationCount = this.validationResults.length;
        Object.values(factorStats).forEach(stats => {
            stats.averageScore = (stats.averageScore / validationCount).toFixed(2);
            stats.averagePercentage = (stats.averagePercentage / validationCount).toFixed(2);
            stats.zeroRate = (stats.zeroCount / validationCount * 100).toFixed(2);
        });

        return factorStats;
    }

    // Generate recommendations
    generateRecommendations() {
        const recommendations = [];
        const summary = this.generateReport().summary;

        // Check for critical low score bug
        if (summary.scoreDistribution['critical_range_27-29'] > 0) {
            recommendations.push({
                priority: 'CRITICAL',
                issue: 'Critical Low Score Bug',
                description: `${summary.scoreDistribution['critical_range_27-29']} tests returned scores in the 27-29 range`,
                action: 'Investigate score calculation logic, especially factor summation'
            });
        }

        // Check for high failure rate
        const failureRate = (summary.failed / this.validationResults.length) * 100;
        if (failureRate > 20) {
            recommendations.push({
                priority: 'HIGH',
                issue: 'High Test Failure Rate',
                description: `${failureRate.toFixed(2)}% of tests failed`,
                action: 'Review expected score ranges and calculation logic'
            });
        }

        // Check factor performance
        const factorPerf = summary.factorPerformance;
        Object.entries(factorPerf).forEach(([factor, stats]) => {
            if (parseFloat(stats.unexpectedZeros) > 5) {
                recommendations.push({
                    priority: 'MEDIUM',
                    issue: `${factor} Calculation Issues`,
                    description: `${stats.unexpectedZeros} unexpected zero scores`,
                    action: `Review ${factor} calculation and field mapping`
                });
            }
        });

        // Check for common issues
        summary.commonIssues.forEach(issue => {
            if (parseFloat(issue.percentage) > 30) {
                recommendations.push({
                    priority: 'HIGH',
                    issue: issue.issue,
                    description: `Occurs in ${issue.percentage}% of tests`,
                    action: 'Address systematic issue'
                });
            }
        });

        return recommendations.sort((a, b) => {
            const priority = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
            return priority[a.priority] - priority[b.priority];
        });
    }

    // Export results
    exportResults(format = 'json') {
        const report = this.generateReport();

        switch (format) {
            case 'json':
                return JSON.stringify(report, null, 2);
                
            case 'csv':
                return this.exportAsCSV(report);
                
            case 'markdown':
                return this.exportAsMarkdown(report);
                
            default:
                return report;
        }
    }

    // Export as CSV
    exportAsCSV(report) {
        const rows = [
            ['Test ID', 'Passed', 'Actual Score', 'Expected Min', 'Expected Max', 'Deviation', 'Critical Bugs', 'Issues']
        ];

        report.detailedResults.forEach(result => {
            rows.push([
                result.scenarioId,
                result.passed ? 'Yes' : 'No',
                result.score.actual,
                result.score.expected.min,
                result.score.expected.max,
                result.score.deviation,
                result.detectedBugs.filter(b => b.severity === 'critical').map(b => b.name).join('; '),
                result.issues.slice(0, 3).join('; ')
            ]);
        });

        return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

    // Export as Markdown
    exportAsMarkdown(report) {
        let md = `# Score Validation Report\n\n`;
        md += `**Generated:** ${report.timestamp}\n`;
        md += `**Total Tests:** ${report.totalValidations}\n\n`;
        
        md += `## Summary\n\n`;
        md += `- **Passed:** ${report.summary.passed}\n`;
        md += `- **Failed:** ${report.summary.failed}\n`;
        md += `- **Success Rate:** ${(report.summary.passed / report.totalValidations * 100).toFixed(2)}%\n\n`;
        
        md += `## Critical Bugs Detected\n\n`;
        Object.entries(report.summary.criticalBugs).forEach(([bug, count]) => {
            md += `- **${bug}:** ${count} occurrences\n`;
        });
        
        md += `\n## Score Distribution\n\n`;
        Object.entries(report.summary.scoreDistribution).forEach(([range, count]) => {
            const percentage = (count / report.totalValidations * 100).toFixed(2);
            md += `- ${range}: ${count} tests (${percentage}%)\n`;
        });
        
        md += `\n## Recommendations\n\n`;
        report.recommendations.forEach((rec, index) => {
            md += `${index + 1}. **[${rec.priority}] ${rec.issue}**\n`;
            md += `   - ${rec.description}\n`;
            md += `   - Action: ${rec.action}\n\n`;
        });
        
        return md;
    }
}

// Export for use in tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoreValidationEngine;
} else {
    window.ScoreValidationEngine = ScoreValidationEngine;
}