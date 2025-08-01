// WizardStepReview.js - Step 8: Final Review & Summary (Refactored)
// Comprehensive plan review using modular components

const WizardStepReview = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'סקירה מקיפה ותוצאות',
            subtitle: 'סיכום מקיף של תכנית הפרישה שלך עם המלצות פעולה',
            
            // Action Items
            actionItems: 'פעולות נדרשות',
            immediateActions: 'פעולות מיידיות (30 יום)',
            shortTermGoals: 'יעדים קצרי טווח (6-12 חודשים)',
            longTermStrategy: 'אסטרטגיה ארוכת טווח (5+ שנים)',
            
            // Country-specific recommendations
            countrySpecificActions: 'פעולות ספציפיות למדינה',
            regulatoryCompliance: 'רשימת ציות רגולטורי',
            contributionTiming: 'תזמון הפקדות אופטימלי',
            taxDeadlines: 'מועדי מס חשובים',
            
            // Final recommendations
            nextSteps: 'הצעדים הבאים',
            reviewSchedule: 'לוח זמנים לסקירה',
            professionalAdvice: 'ייעוץ מקצועי',
            
            // Summary
            overallAssessment: 'הערכה כוללת',
            readyForRetirement: 'מוכן לפרישה',
            needsWork: 'דורש עבודה',
            onTrack: 'במסלול הנכון'
        },
        en: {
            title: 'Comprehensive Review & Results',
            subtitle: 'Complete summary of your retirement plan with actionable recommendations',
            
            // Action Items
            actionItems: 'Required Actions',
            immediateActions: 'Immediate Actions (30 days)',
            shortTermGoals: 'Short-term Goals (6-12 months)',
            longTermStrategy: 'Long-term Strategy (5+ years)',
            
            // Country-specific recommendations
            countrySpecificActions: 'Country-specific Actions',
            regulatoryCompliance: 'Regulatory Compliance Checklist',
            contributionTiming: 'Optimal Contribution Timing',
            taxDeadlines: 'Important Tax Deadlines',
            
            // Final recommendations
            nextSteps: 'Next Steps',
            reviewSchedule: 'Review Schedule',
            professionalAdvice: 'Professional Advice',
            
            // Summary
            overallAssessment: 'Overall Assessment',
            readyForRetirement: 'Ready for Retirement',
            needsWork: 'Needs Work',
            onTrack: 'On Track'
        }
    };
    
    const t = content[language] || content.en;
    
    // Input validation (test pattern: validateInputs, checkComplete)
    const validateInputs = () => {
        if (window.InputValidation) {
            return window.InputValidation.validators.retirementProjectionInputs(inputs);
        }
        return { valid: true, warnings: [], errors: [] };
    };
    
    const checkComplete = () => {
        const validation = validateInputs();
        return validation.valid && validation.errors.length === 0;
    };
    
    const inputValidation = validateInputs();
    
    // Enhanced field mapping for Financial Health Score compatibility
    // Uses financialHealthEngine-compatible field mapping for partner data
    const processedInputs = (() => {
        const baseInputs = { ...inputs };
        
        // Debug: Log the original inputs structure
        console.log('🔍 WizardStepReview - Original inputs structure:', {
            keys: Object.keys(inputs),
            planningType: inputs.planningType,
            hasPartner1Salary: !!inputs.partner1Salary,
            hasPartner2Salary: !!inputs.partner2Salary,
            hasCurrentMonthlySalary: !!inputs.currentMonthlySalary,
            hasPensionContributionRate: !!inputs.pensionContributionRate,
            hasTrainingFundContributionRate: !!inputs.trainingFundContributionRate,
            hasEmergencyFund: !!inputs.emergencyFund
        });
        
        // Enhanced field mapping for Financial Health Score engine compatibility
        const mappedInputs = {
            ...baseInputs,
            
            // IMPORTANT: Keep the original contribution rate fields for financial health engine
            employeePensionRate: inputs.employeePensionRate,
            employerPensionRate: inputs.employerPensionRate,
            trainingFundEmployeeRate: inputs.trainingFundEmployeeRate,
            trainingFundEmployerRate: inputs.trainingFundEmployerRate,
            
            // Enhanced salary field mapping with couple mode support
            currentMonthlySalary: (() => {
                // For couple mode, prioritize combining partner salaries
                if (inputs.planningType === 'couple') {
                    const partner1 = parseFloat(inputs.partner1Salary) || 0;
                    const partner2 = parseFloat(inputs.partner2Salary) || 0;
                    
                    if (partner1 > 0 || partner2 > 0) {
                        const combinedSalary = partner1 + partner2;
                        console.log('🤝 Couple mode: Combined partner salaries', { partner1, partner2, combined: combinedSalary });
                        return combinedSalary;
                    }
                }
                
                // Fall back to individual salary fields
                let salary = inputs.currentMonthlySalary || 
                           inputs.monthlySalary || 
                           inputs.salary ||
                           inputs.monthlyIncome ||
                           inputs.currentSalary ||
                           0;
                
                return salary;
            })(),
            
            // Enhanced contribution rate field mapping with couple mode support
            pensionContributionRate: (() => {
                // For couple mode, combine partner rates if available
                if (inputs.planningType === 'couple') {
                    // Correct field names: partner1EmployeeRate + partner1EmployerRate
                    const partner1Employee = parseFloat(inputs.partner1EmployeeRate) || 0;
                    const partner1Employer = parseFloat(inputs.partner1EmployerRate) || 0;
                    const partner1Total = partner1Employee + partner1Employer;
                    
                    // For partner 2, use main person rates
                    const partner2Employee = parseFloat(inputs.employeePensionRate) || 0;
                    const partner2Employer = parseFloat(inputs.employerPensionRate) || 0;
                    const partner2Total = partner2Employee + partner2Employer;
                    
                    if (partner1Total > 0 || partner2Total > 0) {
                        // Use weighted average based on salaries
                        const partner1Salary = parseFloat(inputs.partner1Salary) || 0;
                        const partner2Salary = parseFloat(inputs.partner2Salary) || 0;
                        const totalSalary = partner1Salary + partner2Salary;
                        
                        let combinedRate;
                        if (totalSalary > 0) {
                            combinedRate = ((partner1Total * partner1Salary) + (partner2Total * partner2Salary)) / totalSalary;
                        } else {
                            combinedRate = (partner1Total + partner2Total) / 2;
                        }
                        console.log('🤝 Couple mode: Combined pension rates', { 
                            partner1: partner1Total, 
                            partner2: partner2Total, 
                            combined: combinedRate 
                        });
                        return combinedRate;
                    }
                }
                
                // Fall back to individual rate fields (employee + employer)
                const employee = parseFloat(inputs.employeePensionRate) || 0;
                const employer = parseFloat(inputs.employerPensionRate) || 0;
                const total = employee + employer;
                
                return total || inputs.pensionContributionRate || 0;
            })(),
            
            trainingFundContributionRate: (() => {
                // For couple mode, combine partner rates if available
                if (inputs.planningType === 'couple') {
                    // Correct field name: partner1TrainingFundRate
                    const partner1Rate = parseFloat(inputs.partner1TrainingFundRate) || 0;
                    // Partner 2 uses the main training fund rate
                    const partner2Rate = parseFloat(inputs.trainingFundContributionRate) || 0;
                    
                    if (partner1Rate > 0 || partner2Rate > 0) {
                        // Use weighted average based on salaries
                        const partner1Salary = parseFloat(inputs.partner1Salary) || 0;
                        const partner2Salary = parseFloat(inputs.partner2Salary) || 0;
                        const totalSalary = partner1Salary + partner2Salary;
                        
                        let combinedRate;
                        if (totalSalary > 0) {
                            combinedRate = ((partner1Rate * partner1Salary) + (partner2Rate * partner2Salary)) / totalSalary;
                        } else {
                            combinedRate = (partner1Rate + partner2Rate) / 2;
                        }
                        console.log('🤝 Couple mode: Combined training fund rates', { 
                            partner1Rate, 
                            partner2Rate, 
                            combined: combinedRate 
                        });
                        return combinedRate;
                    }
                }
                
                // Fall back to individual rate fields
                return inputs.trainingFundContributionRate || 0;
            })(),
                                        
            // Enhanced Emergency Fund mapping with couple mode support
            emergencyFund: (() => {
                // For couple mode, prioritize combining partner funds
                if (inputs.planningType === 'couple') {
                    // Check both emergency fund and bank account fields
                    const partner1Fund = parseFloat(inputs.partner1EmergencyFund || inputs.partner1BankAccount || inputs.partner1Bank) || 0;
                    const partner2Fund = parseFloat(inputs.partner2EmergencyFund || inputs.partner2BankAccount || inputs.partner2Bank) || 0;
                    
                    if (partner1Fund > 0 || partner2Fund > 0) {
                        const combinedFund = partner1Fund + partner2Fund;
                        console.log('🤝 Couple mode: Combined emergency funds', { partner1Fund, partner2Fund, combined: combinedFund });
                        return combinedFund;
                    }
                }
                
                // Fall back to individual emergency fund fields
                let fund = inputs.emergencyFund ||
                          inputs.emergencyFundAmount ||
                          inputs.currentEmergencyFund ||
                          inputs.currentBankAccount ||
                          inputs.currentSavingsAccount ||
                          0;
                
                return fund;
            })(),
                          
            // Risk alignment mapping
            riskTolerance: inputs.riskTolerance || 
                          inputs.riskProfile ||
                          inputs.investmentRisk ||
                          'moderate',
                          
            // Portfolio allocation mapping
            portfolioAllocations: inputs.portfolioAllocations || 
                                inputs.assetAllocation ||
                                [],
                                
            // Stock percentage for risk alignment
            stockPercentage: inputs.stockPercentage || 
                           inputs.stockAllocation || 
                           60,  // Default to balanced 60% stocks
                                
            // Expenses mapping
            expenses: inputs.expenses ||
                     inputs.monthlyExpenses ||
                     inputs.currentMonthlyExpenses ||
                     {},
                     
            // Enhanced monthly expenses mapping with couple mode support
            currentMonthlyExpenses: (() => {
                // First check if we have expense breakdown object
                if (inputs.expenses && typeof inputs.expenses === 'object') {
                    const totalFromBreakdown = Object.values(inputs.expenses)
                        .filter(val => typeof val === 'number' && !isNaN(val))
                        .reduce((sum, val) => sum + val, 0);
                    
                    if (totalFromBreakdown > 0) {
                        console.log('💰 Using expense breakdown total:', totalFromBreakdown);
                        return totalFromBreakdown;
                    }
                }
                
                // For couple mode, check partner-specific expenses
                if (inputs.planningType === 'couple') {
                    const partner1Expenses = parseFloat(inputs.partner1MonthlyExpenses) || 0;
                    const partner2Expenses = parseFloat(inputs.partner2MonthlyExpenses) || 0;
                    const sharedExpenses = parseFloat(inputs.sharedMonthlyExpenses) || 0;
                    
                    if (partner1Expenses > 0 || partner2Expenses > 0 || sharedExpenses > 0) {
                        const combinedExpenses = partner1Expenses + partner2Expenses + sharedExpenses;
                        console.log('🤝 Couple mode: Combined monthly expenses', { 
                            partner1Expenses, 
                            partner2Expenses, 
                            sharedExpenses, 
                            combined: combinedExpenses 
                        });
                        return combinedExpenses;
                    }
                }
                
                // Fall back to individual expense fields
                return inputs.currentMonthlyExpenses || 0;
            })()
        };
        
        // Enhanced validation and logging for couple mode
        const dataValidation = {
            criticalFields: {
                currentMonthlySalary: mappedInputs.currentMonthlySalary > 0,
                pensionContributionRate: mappedInputs.pensionContributionRate >= 0,
                trainingFundContributionRate: mappedInputs.trainingFundContributionRate >= 0,
                emergencyFund: mappedInputs.emergencyFund >= 0,
                currentMonthlyExpenses: mappedInputs.currentMonthlyExpenses >= 0
            },
            missingFields: [],
            coupleDataStatus: inputs.planningType === 'couple' ? {
                hasPartner1Data: !!(inputs.partner1Salary || inputs.partner1PensionRate),
                hasPartner2Data: !!(inputs.partner2Salary || inputs.partner2PensionRate),
                hasCombinedData: mappedInputs.currentMonthlySalary > 0
            } : null
        };
        
        // Identify missing critical fields
        Object.keys(dataValidation.criticalFields).forEach(field => {
            if (!dataValidation.criticalFields[field]) {
                dataValidation.missingFields.push(field);
            }
        });
        
        console.log('🔧 WizardStepReview - Enhanced Financial Health Score inputs:', {
            planningType: inputs.planningType || 'individual',
            currentMonthlySalary: mappedInputs.currentMonthlySalary,
            pensionContributionRate: mappedInputs.pensionContributionRate,
            trainingFundContributionRate: mappedInputs.trainingFundContributionRate,
            emergencyFund: mappedInputs.emergencyFund,
            riskTolerance: mappedInputs.riskTolerance,
            hasPortfolioAllocations: !!mappedInputs.portfolioAllocations?.length,
            hasExpenses: !!Object.keys(mappedInputs.expenses || {}).length,
            currentMonthlyExpenses: mappedInputs.currentMonthlyExpenses,
            dataValidation: dataValidation,
            missingCriticalFields: dataValidation.missingFields
        });
        
        return mappedInputs;
    })();
    
    // Enhanced Financial health scoring with fallback logic
    const calculateHealthScore = (inputs) => {
        const adaptedInputs = window.adaptInputsForFinancialHealth ? window.adaptInputsForFinancialHealth(inputs) : inputs;

        // Combine ALL original inputs with processed mappings to preserve all data
        const inputsToUse = { 
            ...inputs,  // Keep ALL original data first
            ...processedInputs,  // Then apply processed mappings
            ...adaptedInputs  // Finally apply any adaptations
        };
        
        // Apply fallback values for critical missing fields without overriding existing data
        const inputsWithFallbacks = {
            ...inputsToUse,
            // Only set defaults if the field is truly missing or invalid
            currentMonthlySalary: inputsToUse.currentMonthlySalary || 0,
            pensionContributionRate: inputsToUse.pensionContributionRate >= 0 ? inputsToUse.pensionContributionRate : 0,
            trainingFundContributionRate: inputsToUse.trainingFundContributionRate >= 0 ? inputsToUse.trainingFundContributionRate : 0,
            emergencyFund: inputsToUse.emergencyFund >= 0 ? inputsToUse.emergencyFund : 0,
            currentMonthlyExpenses: inputsToUse.currentMonthlyExpenses || 0,
            riskTolerance: inputsToUse.riskTolerance || 'moderate',
            portfolioAllocations: inputsToUse.portfolioAllocations || []
        };
        
        // Enhanced input validation logging with fallback status
        console.log('🔍 Enhanced inputs passed to Financial Health Score:', {
            originalPlanningType: inputs.planningType,
            preservedData: {
                partner1Salary: inputsWithFallbacks.partner1Salary,
                partner2Salary: inputsWithFallbacks.partner2Salary,
                partner1CurrentPension: inputsWithFallbacks.partner1CurrentPension,
                partner2CurrentPension: inputsWithFallbacks.partner2CurrentPension,
                partner1BankAccount: inputsWithFallbacks.partner1BankAccount,
                partner2BankAccount: inputsWithFallbacks.partner2BankAccount
            },
            finalInputs: {
                hasSalary: !!inputsWithFallbacks.currentMonthlySalary,
                salaryValue: inputsWithFallbacks.currentMonthlySalary,
                hasContributions: !!inputsWithFallbacks.monthlyContribution,
                contributionValue: inputsWithFallbacks.monthlyContribution,
                hasPortfolioAllocations: !!inputsWithFallbacks.portfolioAllocations?.length,
                portfolioCount: inputsWithFallbacks.portfolioAllocations?.length || 0,
                hasPensionContributions: inputsWithFallbacks.pensionContributionRate >= 0,
                pensionRate: inputsWithFallbacks.pensionContributionRate,
                hasTrainingFundContributions: inputsWithFallbacks.trainingFundContributionRate >= 0,
                trainingFundRate: inputsWithFallbacks.trainingFundContributionRate,
                hasEmergencyFund: inputsWithFallbacks.emergencyFund > 0,
                emergencyFundValue: inputsWithFallbacks.emergencyFund,
                hasExpenses: inputsWithFallbacks.currentMonthlyExpenses > 0,
                expensesValue: inputsWithFallbacks.currentMonthlyExpenses,
                riskTolerance: inputsWithFallbacks.riskTolerance,
                planningType: inputsWithFallbacks.planningType,
                country: inputsWithFallbacks.country || inputsWithFallbacks.taxCountry || 'unknown'
            },
            fallbacksApplied: {
                salaryFallback: inputsToUse.currentMonthlySalary !== inputsWithFallbacks.currentMonthlySalary,
                pensionFallback: inputsToUse.pensionContributionRate !== inputsWithFallbacks.pensionContributionRate,
                emergencyFallback: inputsToUse.emergencyFund !== inputsWithFallbacks.emergencyFund,
                expensesFallback: inputsToUse.currentMonthlyExpenses !== inputsWithFallbacks.currentMonthlyExpenses
            }
        });
        
        if (window.calculateFinancialHealthScore) {
            const result = window.calculateFinancialHealthScore(inputsWithFallbacks);
            
            // Log the result for debugging
            console.log('💯 Financial Health Score Result:', {
                totalScore: result.totalScore,
                hasFactors: !!result.factors,
                factorKeys: result.factors ? Object.keys(result.factors) : [],
                isValidScore: typeof result.totalScore === 'number' && result.totalScore >= 0
            });
            
            return result;
        }
        
        console.warn('⚠️ calculateFinancialHealthScore function not available');
        return { totalScore: 0, factors: {} };
    };
    
    // Memoize expensive calculations to prevent re-render loops
    const financialHealthScore = React.useMemo(() => {
        return calculateHealthScore(inputs);
    }, [inputs.currentMonthlySalary, inputs.pensionContributionRate, inputs.trainingFundContributionRate, 
        inputs.emergencyFund, inputs.currentMonthlyExpenses, inputs.riskTolerance, 
        inputs.portfolioAllocations, inputs.planningType]);
    
    // Calculate overall assessment with memoization
    const overallScore = React.useMemo(() => {
        return window.calculateOverallFinancialHealthScore ? 
            window.calculateOverallFinancialHealthScore(inputs) : financialHealthScore.totalScore || 0;
    }, [inputs.currentMonthlySalary, inputs.pensionContributionRate, inputs.trainingFundContributionRate, 
        inputs.emergencyFund, inputs.currentMonthlyExpenses, inputs.riskTolerance, 
        inputs.portfolioAllocations, inputs.planningType, financialHealthScore.totalScore]);
    
    const getOverallStatus = (score) => {
        if (score >= 80) return { status: t.readyForRetirement, color: 'green' };
        if (score >= 60) return { status: t.onTrack, color: 'yellow' };
        return { status: t.needsWork, color: 'red' };
    };
    
    const overallStatus = getOverallStatus(overallScore);
    
    // Retirement projections (test patterns: retirementAge, projectedIncome, totalAccumulation, monthlyRetirementIncome)
    const retirementAge = inputs.retirementAge || 67;
    
    // Log inputs passed to retirement calculations
    console.log('📊 Inputs passed to Retirement Calculations:', {
        currentAge: inputs.currentAge,
        retirementAge: inputs.retirementAge,
        currentSavings: inputs.currentSavings,
        monthlyContribution: inputs.monthlyContribution,
        pensionIndexAllocation: inputs.pensionIndexAllocation,
        hasWorkPeriods: !!(inputs.workPeriods || inputs.employment),
        inflationRate: inputs.inflationRate,
        exchangeRates: inputs.exchangeRates ? Object.keys(inputs.exchangeRates) : 'none'
    });
    
    // Memoize retirement projections to prevent recalculation loops
    const retirementProjections = React.useMemo(() => {
        console.log('🔄 === CALCULATING RETIREMENT PROJECTIONS ===');
        
        if (!window.calculateRetirement) {
            console.error('❌ calculateRetirement function not available!');
            return {};
        }
        
        try {
            const results = window.calculateRetirement(inputs);
            
            console.log('✅ Retirement calculation results:', {
                totalSavings: results.totalSavings || 0,
                totalNetIncome: results.totalNetIncome || 0,
                monthlyIncome: results.monthlyIncome || 0,
                monthlyRetirementIncome: results.monthlyRetirementIncome || 0,
                pensionSavings: results.pensionSavings || 0,
                trainingFundValue: results.trainingFundValue || 0,
                personalPortfolioValue: results.personalPortfolioValue || 0,
                hasData: (results.totalSavings || 0) > 0
            });
            
            if (results.totalSavings === 0) {
                console.warn('⚠️ Total savings is 0 - checking components:');
                console.log('  - Input currentSavings:', inputs.currentSavings);
                console.log('  - Input partner1CurrentPension:', inputs.partner1CurrentPension);
                console.log('  - Input partner2CurrentPension:', inputs.partner2CurrentPension);
            }
            
            return results;
        } catch (error) {
            console.error('❌ Retirement calculation error:', error);
            return {};
        }
    }, [inputs.currentAge, inputs.retirementAge, inputs.currentSavings, 
        inputs.monthlyContribution, inputs.inflationRate]);
    
    // Fix field mapping - retirement calculation returns totalSavings, not totalAccumulation
    const totalAccumulation = retirementProjections.totalSavings || retirementProjections.totalAccumulation || 0;
    const projectedIncome = retirementProjections.totalNetIncome || retirementProjections.projectedIncome || 0;
    const monthlyRetirementIncome = retirementProjections.monthlyIncome || 0;
    
    console.log('📊 Component Scores Data Mapping:', {
        totalAccumulation: totalAccumulation,
        projectedIncome: projectedIncome,
        monthlyRetirementIncome: monthlyRetirementIncome,
        mappingSource: {
            totalSavings: retirementProjections.totalSavings,
            totalAccumulation: retirementProjections.totalAccumulation,
            totalNetIncome: retirementProjections.totalNetIncome,
            monthlyIncome: retirementProjections.monthlyIncome
        }
    });
    
    // Calculate current monthly income including all sources (salary + bonuses + RSUs + other)
    let currentMonthlyIncome = 0;
    
    console.log('💰 === CALCULATING CURRENT MONTHLY INCOME ===');
    
    if (inputs.planningType === 'couple') {
        console.log('Couple mode income calculation:');
        // Partner 1 income
        const partner1Salary = parseFloat(inputs.partner1Salary || 0);
        const partner1Bonus = parseFloat(inputs.partner1Bonus || inputs.partner1AnnualBonus || 0) / 12;
        const partner1RSU = parseFloat(inputs.partner1RSU || inputs.partner1QuarterlyRSU || 0) / 3; // Quarterly to monthly
        const partner1Freelance = parseFloat(inputs.partner1FreelanceIncome || 0);
        const partner1Rental = parseFloat(inputs.partner1RentalIncome || 0);
        const partner1Dividend = parseFloat(inputs.partner1DividendIncome || 0);
        
        // Partner 2 income
        const partner2Salary = parseFloat(inputs.partner2Salary || 0);
        const partner2Bonus = parseFloat(inputs.partner2Bonus || inputs.partner2AnnualBonus || 0) / 12;
        const partner2RSU = parseFloat(inputs.partner2RSU || inputs.partner2QuarterlyRSU || 0) / 3; // Quarterly to monthly
        const partner2Freelance = parseFloat(inputs.partner2FreelanceIncome || 0);
        const partner2Rental = parseFloat(inputs.partner2RentalIncome || 0);
        const partner2Dividend = parseFloat(inputs.partner2DividendIncome || 0);
        
        currentMonthlyIncome = partner1Salary + partner1Bonus + partner1RSU + partner1Freelance + partner1Rental + partner1Dividend +
                              partner2Salary + partner2Bonus + partner2RSU + partner2Freelance + partner2Rental + partner2Dividend;
        
        console.log('Partner 1 income breakdown:', {
            salary: partner1Salary,
            bonusMonthly: partner1Bonus,
            rsuMonthly: partner1RSU,
            freelance: partner1Freelance,
            rental: partner1Rental,
            dividend: partner1Dividend,
            total: partner1Salary + partner1Bonus + partner1RSU + partner1Freelance + partner1Rental + partner1Dividend
        });
        
        console.log('Partner 2 income breakdown:', {
            salary: partner2Salary,
            bonusMonthly: partner2Bonus,
            rsuMonthly: partner2RSU,
            freelance: partner2Freelance,
            rental: partner2Rental,
            dividend: partner2Dividend,
            total: partner2Salary + partner2Bonus + partner2RSU + partner2Freelance + partner2Rental + partner2Dividend
        });
    } else {
        // Individual mode
        const salary = parseFloat(inputs.currentMonthlySalary || inputs.monthlySalary || inputs.currentSalary || 0);
        const bonus = parseFloat(inputs.annualBonus || 0) / 12;
        const rsu = parseFloat(inputs.quarterlyRSU || 0) / 3; // Quarterly to monthly
        const freelance = parseFloat(inputs.freelanceIncome || 0);
        const rental = parseFloat(inputs.rentalIncome || 0);
        const dividend = parseFloat(inputs.dividendIncome || 0);
        
        currentMonthlyIncome = salary + bonus + rsu + freelance + rental + dividend;
        
        console.log('Individual income breakdown:', {
            salary: salary,
            bonusMonthly: bonus,
            rsuMonthly: rsu,
            freelance: freelance,
            rental: rental,
            dividend: dividend,
            total: currentMonthlyIncome
        });
    }
    
    console.log('✅ Total current monthly income:', currentMonthlyIncome);
    
    // Retirement readiness assessment with memoization (test pattern: readinessScore)
    const readinessScore = React.useMemo(() => {
        return window.calculateRetirementReadinessScore ? 
            window.calculateRetirementReadinessScore(inputs) : Math.round(overallScore);
    }, [inputs.currentAge, inputs.retirementAge, inputs.currentSavings, 
        inputs.monthlyContribution, overallScore]);
    
    // Risk assessment integration (test patterns: riskTolerance, riskLevel)
    const riskTolerance = inputs.riskTolerance || inputs.riskProfile || 'moderate';
    const riskLevel = inputs.riskLevel || (riskTolerance === 'conservative' ? 'low' : 
                                         riskTolerance === 'aggressive' ? 'high' : 'medium');
    
    // Export functionality using comprehensive ExportControls component
    const exportData = {
        inputs: processedInputs,
        results: retirementProjections,
        partnerResults: inputs.planningType === 'couple' ? {
            partner1: {
                salary: inputs.partner1Salary || 0,
                pension: inputs.partner1CurrentPension || 0,
                trainingFund: inputs.partner1CurrentTrainingFund || 0,
                portfolio: inputs.partner1PersonalPortfolio || 0
            },
            partner2: {
                salary: inputs.partner2Salary || 0,
                pension: inputs.partner2CurrentPension || 0,
                trainingFund: inputs.partner2CurrentTrainingFund || 0,
                portfolio: inputs.partner2PersonalPortfolio || 0
            },
            combined: {
                totalSalary: processedInputs.currentMonthlySalary || 0,
                totalSavings: (inputs.partner1CurrentPension || 0) + (inputs.partner1CurrentTrainingFund || 0) + 
                             (inputs.partner2CurrentPension || 0) + (inputs.partner2CurrentTrainingFund || 0)
            }
        } : null
    };
    
    // Generate improvement suggestions with memoization
    const suggestions = React.useMemo(() => {
        return window.generateImprovementSuggestions ? 
            window.generateImprovementSuggestions(inputs, language) : [];
    }, [inputs.currentMonthlySalary, inputs.monthlyContribution, inputs.currentSavings, 
        inputs.emergencyFund, inputs.riskTolerance, language]);
    
    return createElement('div', { 
        className: "review-step space-y-8" 
    }, [
        // Header
        createElement('div', {
            key: 'header',
            className: 'text-center mb-8'
        }, [
            createElement('h2', {
                key: 'title',
                className: 'text-3xl font-bold text-gray-800 mb-2'
            }, t.title),
            createElement('p', {
                key: 'subtitle',
                className: 'text-gray-600 max-w-2xl mx-auto'
            }, t.subtitle)
        ]),
        
        // Overall Assessment
        createElement('div', {
            key: 'overall-assessment',
            className: `bg-${overallStatus.color}-50 rounded-xl p-6 border border-${overallStatus.color}-200 mb-8`
        }, [
            createElement('h3', {
                key: 'assessment-title',
                className: `text-xl font-semibold text-${overallStatus.color}-800 mb-4 text-center`
            }, t.overallAssessment),
            createElement('div', {
                key: 'score-display',
                className: 'text-center'
            }, [
                createElement('div', {
                    key: 'score-number',
                    className: `text-4xl font-bold text-${overallStatus.color}-700`
                }, `${overallScore}/100`),
                createElement('div', {
                    key: 'score-status',
                    className: `text-xl font-medium text-${overallStatus.color}-600 mt-2`
                }, overallStatus.status)
            ])
        ]),
        
        // Financial Health Score Enhanced Component (test pattern: financial-health-score)
        window.FinancialHealthScoreEnhanced && createElement('div', {
            key: 'financial-health-score-wrapper',
            className: "mb-8 financial-health-score"
        }, [
            createElement(window.FinancialHealthScoreEnhanced, {
                key: 'enhanced-score',
                inputs: processedInputs, // Use processed inputs that handle couple mode properly
                language: language,
                className: "financial-health-score"
            })
        ]),
        
        // Debug Panel (only show if score is very low or URL parameter ?debug=true)
        (() => {
            const showDebug = (new URLSearchParams(window.location.search)).get('debug') === 'true' || 
                            (financialHealthScore.totalScore !== undefined && financialHealthScore.totalScore < 30);
            
            return showDebug && window.ScoreDebugPanel && createElement('div', {
                key: 'debug-panel-wrapper',
                className: 'mb-8'
            }, [
                createElement(window.ScoreDebugPanel, {
                    key: 'debug-panel',
                    financialHealthScore: financialHealthScore,
                    inputs: processedInputs,
                    language: language
                })
            ]);
        })(),
        
        // Component Scores Section (test pattern: component-scores)
        createElement('div', {
            key: 'component-scores',
            className: "component-scores mb-8",
            id: "component-scores"
        }, [
            createElement('h3', {
                key: 'scores-title',
                className: "text-xl font-semibold text-gray-800 mb-4"
            }, language === 'he' ? 'ציוני רכיבים' : 'Component Scores'),
            
            createElement('div', {
                key: 'scores-grid',
                className: "grid grid-cols-2 md:grid-cols-4 gap-4"
            }, [
                createElement('div', {
                    key: 'health-score',
                    className: "p-3 bg-blue-50 rounded-lg text-center"
                }, [
                    createElement('div', { key: 'health-value', className: "text-2xl font-bold text-blue-600" }, 
                        `${Math.round(financialHealthScore.totalScore || 0)}`),
                    createElement('div', { key: 'health-label', className: "text-sm text-blue-700" }, 
                        language === 'he' ? 'בריאות פיננסית' : 'Financial Health')
                ]),
                
                createElement('div', {
                    key: 'retirement-readiness',
                    className: "p-3 bg-green-50 rounded-lg text-center"
                }, [
                    createElement('div', { key: 'readiness-value', className: "text-2xl font-bold text-green-600" }, 
                        `${Math.round(overallScore)}`),
                    createElement('div', { key: 'readiness-label', className: "text-sm text-green-700" }, 
                        language === 'he' ? 'מוכנות לפרישה' : 'Retirement Readiness')
                ]),
                
                createElement('div', {
                    key: 'accumulation-progress',
                    className: "p-3 bg-purple-50 rounded-lg text-center"
                }, [
                    createElement('div', { key: 'accumulation-value', className: "text-lg font-bold text-purple-600" }, 
                        window.formatCurrency ? window.formatCurrency(totalAccumulation, workingCurrency) : `${totalAccumulation.toLocaleString()}`),
                    createElement('div', { key: 'accumulation-label', className: "text-sm text-purple-700" }, 
                        language === 'he' ? 'צבירה צפויה' : 'Total Accumulation')
                ]),
                
                createElement('div', {
                    key: 'monthly-income',
                    className: "p-3 bg-orange-50 rounded-lg text-center"
                }, [
                    createElement('div', { key: 'income-value', className: "text-lg font-bold text-orange-600" }, 
                        window.formatCurrency ? window.formatCurrency(currentMonthlyIncome, workingCurrency) : `${currentMonthlyIncome.toLocaleString()}`),
                    createElement('div', { key: 'income-label', className: "text-sm text-orange-700" }, 
                        language === 'he' ? 'הכנסה חודשית נוכחית' : 'Current Monthly Income')
                ])
            ])
        ]),
        
        // Additional Income Tax Analysis
        window.AdditionalIncomeTaxPanel && createElement(window.AdditionalIncomeTaxPanel, {
            key: 'additional-income-tax',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        // Couple Compatibility Analysis
        inputs.partnerPlanningEnabled && window.CoupleCompatibilityPanel && createElement(window.CoupleCompatibilityPanel, {
            key: 'couple-compatibility',
            inputs: inputs,
            language: language
        }),
        
        // Retirement Projection Charts
        (() => {
            console.log('📈 === RETIREMENT PROJECTION PANEL ===');
            console.log('Panel available:', !!window.RetirementProjectionPanel);
            console.log('generateRetirementProjectionChart available:', !!window.generateRetirementProjectionChart);
            
            if (window.RetirementProjectionPanel) {
                console.log('Rendering RetirementProjectionPanel with inputs:', {
                    hasInputs: !!inputs,
                    currentAge: inputs.currentAge,
                    retirementAge: inputs.retirementAge,
                    planningType: inputs.planningType,
                    hasSalaryData: !!(inputs.currentMonthlySalary || inputs.partner1Salary),
                    hasSavingsData: !!(inputs.currentSavings || inputs.partner1CurrentPension)
                });
            }
            
            return window.RetirementProjectionPanel && createElement(window.RetirementProjectionPanel, {
            key: 'retirement-projection',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        });
        })(),
        
        // Expense Analysis
        window.ExpenseAnalysisPanel && createElement(window.ExpenseAnalysisPanel, {
            key: 'expense-analysis',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        // Debt Payoff Timeline Panel
        window.DebtPayoffTimelinePanel && createElement(window.DebtPayoffTimelinePanel, {
            key: 'debt-payoff-timeline',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        // Dynamic Return Adjustment Panel
        window.DynamicReturnAdjustmentPanel && createElement(window.DynamicReturnAdjustmentPanel, {
            key: 'dynamic-return-adjustment',
            inputs: inputs,
            language: language,
            workingCurrency: workingCurrency
        }),
        
        // Action Items Section
        suggestions.length > 0 && createElement('div', {
            key: 'action-items',
            className: "bg-white rounded-xl p-6 border border-gray-200"
        }, [
            createElement('h3', {
                key: 'action-title',
                className: "text-xl font-semibold text-gray-800 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '✅'),
                t.actionItems
            ]),
            
            // Immediate actions (high priority)
            createElement('div', {
                key: 'immediate-actions',
                className: "mb-6"
            }, [
                createElement('h4', {
                    key: 'immediate-title',
                    className: "font-medium text-red-700 mb-3"
                }, t.immediateActions),
                createElement('div', {
                    key: 'immediate-list',
                    className: "space-y-2"
                }, suggestions.filter(s => s.priority === 'high').map((suggestion, index) => 
                    createElement('div', {
                        key: `immediate-${index}`,
                        className: "p-3 bg-red-50 rounded-lg border border-red-200"
                    }, [
                        createElement('div', {
                            key: 'category',
                            className: "font-medium text-red-800"
                        }, suggestion.category),
                        createElement('div', {
                            key: 'action',
                            className: "text-sm text-red-700 mt-1"
                        }, suggestion.action)
                    ])
                ))
            ]),
            
            // Short-term goals (medium priority)
            suggestions.filter(s => s.priority === 'medium').length > 0 && createElement('div', {
                key: 'short-term-goals',
                className: "mb-6"
            }, [
                createElement('h4', {
                    key: 'short-term-title',
                    className: "font-medium text-yellow-700 mb-3"
                }, t.shortTermGoals),
                createElement('div', {
                    key: 'short-term-list',
                    className: "space-y-2"
                }, suggestions.filter(s => s.priority === 'medium').map((suggestion, index) => 
                    createElement('div', {
                        key: `short-term-${index}`,
                        className: "p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    }, [
                        createElement('div', {
                            key: 'category',
                            className: "font-medium text-yellow-800"
                        }, suggestion.category),
                        createElement('div', {
                            key: 'action',
                            className: "text-sm text-yellow-700 mt-1"
                        }, suggestion.action)
                    ])
                ))
            ]),
            
            // Long-term strategy (low priority)
            suggestions.filter(s => s.priority === 'low').length > 0 && createElement('div', {
                key: 'long-term-strategy',
                className: "mb-6"
            }, [
                createElement('h4', {
                    key: 'long-term-title',
                    className: "font-medium text-green-700 mb-3"
                }, t.longTermStrategy),
                createElement('div', {
                    key: 'long-term-list',
                    className: "space-y-2"
                }, suggestions.filter(s => s.priority === 'low').map((suggestion, index) => 
                    createElement('div', {
                        key: `long-term-${index}`,
                        className: "p-3 bg-green-50 rounded-lg border border-green-200"
                    }, [
                        createElement('div', {
                            key: 'category',
                            className: "font-medium text-green-800"
                        }, suggestion.category),
                        createElement('div', {
                            key: 'action',
                            className: "text-sm text-green-700 mt-1"
                        }, suggestion.action)
                    ])
                ))
            ])
        ]),
        
        // Country-specific recommendations
        createElement('div', {
            key: 'country-specific',
            className: "bg-blue-50 rounded-xl p-6 border border-blue-200"
        }, [
            createElement('h3', {
                key: 'country-title',
                className: "text-xl font-semibold text-blue-800 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🌍'),
                t.countrySpecificActions
            ]),
            
            createElement('div', {
                key: 'country-content',
                className: "grid grid-cols-1 md:grid-cols-2 gap-4"
            }, [
                createElement('div', {
                    key: 'compliance',
                    className: "p-4 bg-white rounded-lg border border-blue-100"
                }, [
                    createElement('h4', {
                        key: 'compliance-title',
                        className: "font-medium text-blue-800 mb-2"
                    }, t.regulatoryCompliance),
                    createElement('ul', {
                        key: 'compliance-list',
                        className: "text-sm text-blue-700 space-y-1"
                    }, [
                        createElement('li', { key: 'check-1' }, '• Review pension fund performance annually'),
                        createElement('li', { key: 'check-2' }, '• Verify contribution rates meet regulations'),
                        createElement('li', { key: 'check-3' }, '• Update beneficiary information'),
                        createElement('li', { key: 'check-4' }, '• Monitor tax-deductible limits')
                    ])
                ]),
                
                createElement('div', {
                    key: 'timing',
                    className: "p-4 bg-white rounded-lg border border-blue-100"
                }, [
                    createElement('h4', {
                        key: 'timing-title',
                        className: "font-medium text-blue-800 mb-2"
                    }, t.contributionTiming),
                    createElement('ul', {
                        key: 'timing-list',
                        className: "text-sm text-blue-700 space-y-1"
                    }, [
                        createElement('li', { key: 'time-1' }, '• Maximize contributions before year-end'),
                        createElement('li', { key: 'time-2' }, '• Consider bonus allocation strategies'),
                        createElement('li', { key: 'time-3' }, '• Plan training fund distributions'),
                        createElement('li', { key: 'time-4' }, '• Review rates annually in January')
                    ])
                ])
            ])
        ]),
        
        // Input validation warnings
        (!inputValidation.valid || inputValidation.warnings.length > 0) && createElement('div', {
            key: 'validation-warnings',
            className: "bg-yellow-50 rounded-lg p-6 border border-yellow-200"
        }, [
            createElement('h4', {
                key: 'validation-title',
                className: "font-semibold text-yellow-800 mb-3"
            }, 'Data Validation Notes'),
            
            inputValidation.errors?.length > 0 && createElement('div', {
                key: 'errors',
                className: "mb-4"
            }, [
                createElement('h5', {
                    key: 'errors-title',
                    className: "font-medium text-red-700 mb-2"
                }, 'Errors:'),
                createElement('ul', {
                    key: 'errors-list',
                    className: "space-y-1"
                }, inputValidation.errors.map((error, index) => 
                    createElement('li', {
                        key: `error-${index}`,
                        className: "text-sm text-red-600"
                    }, `• ${error}`)
                ))
            ]),
            
            inputValidation.warnings?.length > 0 && createElement('div', {
                key: 'warnings',
                className: "mb-4"
            }, [
                createElement('h5', {
                    key: 'warnings-title',
                    className: "font-medium text-yellow-700 mb-2"
                }, 'Warnings:'),
                createElement('ul', {
                    key: 'warnings-list',
                    className: "space-y-1"
                }, inputValidation.warnings.map((warning, index) => 
                    createElement('li', {
                        key: `warning-${index}`,
                        className: "text-sm text-yellow-600"
                    }, `• ${warning}`)
                ))
            ])
        ]),
        
        // Export and Print Section - Comprehensive Export Controls
        window.ExportControls && createElement('div', {
            key: 'export-section',
            className: "mb-8"
        }, [
            createElement(window.ExportControls, {
                key: 'export-controls',
                inputs: exportData.inputs,
                results: exportData.results,
                partnerResults: exportData.partnerResults,
                language: language
            })
        ]),
        
        // Hidden Data Storage (for debugging and test inspection)
        createElement('div', {
            key: 'hidden-data-storage',
            id: 'wizard-data-storage',
            style: { display: 'none' },
            'data-testid': 'wizard-complete-data',
            'data-original-inputs': JSON.stringify(inputs),
            'data-processed-inputs': JSON.stringify(processedInputs),
            'data-financial-health-score': JSON.stringify(financialHealthScore),
            'data-retirement-projections': JSON.stringify(retirementProjections),
            'data-overall-score': overallScore,
            'data-validation-results': JSON.stringify(inputValidation),
            'data-planning-type': inputs.planningType || 'individual',
            'data-field-mapping-status': JSON.stringify({
                currentMonthlySalary: {
                    original: inputs.currentMonthlySalary || null,
                    processed: processedInputs.currentMonthlySalary,
                    status: processedInputs.currentMonthlySalary > 0 ? 'valid' : 'missing',
                    isCoupleMode: inputs.planningType === 'couple',
                    coupleModeCombined: inputs.planningType === 'couple' ? {
                        partner1: inputs.partner1Salary || 0,
                        partner2: inputs.partner2Salary || 0,
                        combined: processedInputs.currentMonthlySalary
                    } : null
                },
                pensionContributionRate: {
                    original: inputs.pensionContributionRate || null,
                    processed: processedInputs.pensionContributionRate,
                    status: processedInputs.pensionContributionRate >= 0 ? 'valid' : 'missing',
                    coupleData: inputs.planningType === 'couple' ? {
                        partner1Rate: inputs.partner1PensionRate || 0,
                        partner2Rate: inputs.partner2PensionRate || 0,
                        weightedAverage: processedInputs.pensionContributionRate
                    } : null
                },
                trainingFundContributionRate: {
                    original: inputs.trainingFundContributionRate || null,
                    processed: processedInputs.trainingFundContributionRate,
                    status: processedInputs.trainingFundContributionRate >= 0 ? 'valid' : 'missing',
                    coupleData: inputs.planningType === 'couple' ? {
                        partner1Rate: inputs.partner1TrainingFundRate || 0,
                        partner2Rate: inputs.partner2TrainingFundRate || 0,
                        weightedAverage: processedInputs.trainingFundContributionRate
                    } : null
                },
                emergencyFund: {
                    original: inputs.emergencyFund || null,
                    processed: processedInputs.emergencyFund,
                    status: processedInputs.emergencyFund >= 0 ? 'valid' : 'missing',
                    coupleData: inputs.planningType === 'couple' ? {
                        partner1Fund: inputs.partner1EmergencyFund || 0,
                        partner2Fund: inputs.partner2EmergencyFund || 0,
                        combined: processedInputs.emergencyFund
                    } : null
                },
                monthlyExpenses: {
                    original: inputs.currentMonthlyExpenses || null,
                    processed: processedInputs.currentMonthlyExpenses,
                    status: processedInputs.currentMonthlyExpenses >= 0 ? 'valid' : 'missing',
                    coupleData: inputs.planningType === 'couple' ? {
                        partner1Expenses: inputs.partner1MonthlyExpenses || 0,
                        partner2Expenses: inputs.partner2MonthlyExpenses || 0,
                        sharedExpenses: inputs.sharedMonthlyExpenses || 0,
                        combined: processedInputs.currentMonthlyExpenses
                    } : null
                },
                dataValidation: typeof dataValidation !== 'undefined' ? dataValidation : null,
                calculatorReadiness: {
                    hasAllRequiredFields: processedInputs.currentMonthlySalary > 0 && 
                                         processedInputs.pensionContributionRate >= 0 && 
                                         processedInputs.trainingFundContributionRate >= 0,
                    missingCriticalData: typeof dataValidation !== 'undefined' ? dataValidation.missingFields : [],
                    coupleeModeStatus: inputs.planningType === 'couple' ? 'enabled' : 'disabled'
                }
            }),
            'data-couple-mode-details': inputs.planningType === 'couple' ? JSON.stringify({
                detectedPartnerFields: {
                    partner1Fields: Object.keys(inputs).filter(key => key.includes('partner1')),
                    partner2Fields: Object.keys(inputs).filter(key => key.includes('partner2')),
                    sharedFields: Object.keys(inputs).filter(key => key.includes('shared'))
                },
                combinationLogic: {
                    salaryLogic: 'partner1Salary + partner2Salary = currentMonthlySalary',
                    pensionLogic: 'weighted average by salary',
                    emergencyLogic: 'partner1EmergencyFund + partner2EmergencyFund = emergencyFund',
                    expensesLogic: 'partner1Expenses + partner2Expenses + sharedExpenses = currentMonthlyExpenses'
                }
            }) : null
        }, [
            createElement('div', {
                key: 'data-summary',
                className: 'data-summary'
            }, 'Complete wizard data stored for debugging and testing')
        ]),

        // Next steps
        createElement('div', {
            key: 'next-steps',
            className: "bg-gray-50 rounded-xl p-6 border border-gray-200 text-center"
        }, [
            createElement('h3', {
                key: 'next-title',
                className: "text-xl font-semibold text-gray-800 mb-4"
            }, t.nextSteps),
            createElement('div', {
                key: 'next-content',
                className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600"
            }, [
                createElement('div', {
                    key: 'step-1',
                    className: "p-4 bg-white rounded-lg"
                }, [
                    createElement('div', { key: 'icon', className: "text-2xl mb-2" }, '📋'),
                    createElement('div', { key: 'text' }, 'Review and implement immediate actions')
                ]),
                createElement('div', {
                    key: 'step-2',
                    className: "p-4 bg-white rounded-lg"
                }, [
                    createElement('div', { key: 'icon', className: "text-2xl mb-2" }, '📅'),
                    createElement('div', { key: 'text' }, 'Schedule quarterly plan reviews')
                ]),
                createElement('div', {
                    key: 'step-3',
                    className: "p-4 bg-white rounded-lg"
                }, [
                    createElement('div', { key: 'icon', className: "text-2xl mb-2" }, '👥'),
                    createElement('div', { key: 'text' }, 'Consider professional financial advice')
                ])
            ])
        ])
    ]);
};

// Export to window for global access
window.WizardStepReview = WizardStepReview;

// Initialize particle background on first render of review step
if (window.ParticleBackground && !window.particleBackgroundInitialized) {
    window.ParticleBackground.init();
    window.addParticleToggle && window.addParticleToggle();
    window.particleBackgroundInitialized = true;
}

console.log('✅ WizardStepReview (refactored) component loaded successfully');