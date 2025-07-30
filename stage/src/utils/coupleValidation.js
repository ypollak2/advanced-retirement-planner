// coupleValidation.js - Cross-Partner Dependency Validation for Couple Planning
// Created by Yali Pollak (יהלי פולק) - Advanced Retirement Planner v6.3.0

/**
 * Comprehensive validation system for couple retirement planning
 * Ensures data consistency and identifies potential issues in joint planning
 */

const CoupleValidation = {
    
    // Main validation function
    validateCoupleData: function(primaryInputs, partnerInputs, language = 'en') {
        const errors = [];
        const warnings = [];
        const recommendations = [];
        
        // Run all validation checks
        const ageValidation = this.validateAges(primaryInputs, partnerInputs, language);
        const financeValidation = this.validateFinancialConsistency(primaryInputs, partnerInputs, language);
        const retirementValidation = this.validateRetirementPlanning(primaryInputs, partnerInputs, language);
        const beneficiaryValidation = this.validateBeneficiarySetup(primaryInputs, partnerInputs, language);
        const dependencyValidation = this.validateFinancialDependencies(primaryInputs, partnerInputs, language);
        const riskValidation = this.validateRiskAlignment(primaryInputs, partnerInputs, language);
        
        // Combine all validation results
        errors.push(...ageValidation.errors, ...financeValidation.errors, ...retirementValidation.errors, 
                  ...beneficiaryValidation.errors, ...dependencyValidation.errors, ...riskValidation.errors);
        
        warnings.push(...ageValidation.warnings, ...financeValidation.warnings, ...retirementValidation.warnings,
                     ...beneficiaryValidation.warnings, ...dependencyValidation.warnings, ...riskValidation.warnings);
        
        recommendations.push(...ageValidation.recommendations, ...financeValidation.recommendations, 
                            ...retirementValidation.recommendations, ...beneficiaryValidation.recommendations,
                            ...dependencyValidation.recommendations, ...riskValidation.recommendations);
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            recommendations,
            score: this.calculateCoupleCompatibilityScore(primaryInputs, partnerInputs)
        };
    },
    
    // Age-related validations
    validateAges: function(primary, partner, language) {
        const errors = [];
        const warnings = [];
        const recommendations = [];
        
        const primaryAge = parseInt(primary.currentAge || 30);
        const partnerAge = parseInt(partner.partnerCurrentAge || 30);
        const primaryRetirement = parseInt(primary.retirementAge || 67);
        const partnerRetirement = parseInt(partner.partnerRetirementAge || 67);
        
        const content = this.getContent(language);
        
        // Age gap validation
        const ageGap = Math.abs(primaryAge - partnerAge);
        if (ageGap > 15) {
            warnings.push({
                type: 'age_gap',
                message: content.warnings.largeAgeGap.replace('{gap}', ageGap),
                severity: 'medium',
                field: 'ages'
            });
            
            recommendations.push({
                type: 'age_gap_planning',
                message: content.recommendations.ageGapPlanning,
                action: 'Consider staggered retirement planning and survivor benefits',
                priority: 'medium'
            });
        }
        
        // Retirement age synchronization
        const retirementGap = Math.abs(primaryRetirement - partnerRetirement);
        if (retirementGap > 5) {
            warnings.push({
                type: 'retirement_gap',
                message: content.warnings.retirementAgeGap.replace('{gap}', retirementGap),
                severity: 'medium',
                field: 'retirementAges'
            });
        }
        
        // Early retirement feasibility for couples
        if (primaryRetirement < 60 || partnerRetirement < 60) {
            const earlyRetirer = primaryRetirement < partnerRetirement ? 'primary' : 'partner';
            recommendations.push({
                type: 'early_retirement_couple',
                message: content.recommendations.earlyRetirementCouple,
                action: `Consider ${earlyRetirer} healthcare coverage and joint expense planning`,
                priority: 'high'
            });
        }
        
        return { errors, warnings, recommendations };
    },
    
    // Financial consistency validations
    validateFinancialConsistency: function(primary, partner, language) {
        const errors = [];
        const warnings = [];
        const recommendations = [];
        
        const content = this.getContent(language);
        
        const primarySalary = parseFloat(primary.currentSalary || 0);
        const partnerSalary = parseFloat(partner.partnerCurrentSalary || 0);
        const jointExpenses = parseFloat(primary.jointMonthlyExpenses || 0);
        const primaryExpenses = parseFloat(primary.currentMonthlyExpenses || 0);
        const totalIncome = primarySalary + partnerSalary;
        
        // Income vs expenses validation
        const totalExpenses = jointExpenses + primaryExpenses;
        if (totalExpenses > totalIncome * 0.9) {
            errors.push({
                type: 'expense_income_ratio',
                message: content.errors.highExpenseRatio,
                severity: 'high',
                field: 'expenses'
            });
        }
        
        // Contribution rate consistency
        const primaryPensionRate = parseFloat(primary.pensionContributionRate || 17.5);
        const partnerPensionRate = parseFloat(partner.partnerPensionContributionRate || 17.5);
        const rateGap = Math.abs(primaryPensionRate - partnerPensionRate);
        
        if (rateGap > 5) {
            warnings.push({
                type: 'contribution_gap',
                message: content.warnings.contributionRateGap.replace('{gap}', rateGap.toFixed(1)),
                severity: 'medium',
                field: 'contributions'
            });
        }
        
        // Joint savings validation
        const primarySavings = parseFloat(primary.currentSavings || 0);
        const partnerSavings = parseFloat(partner.partnerCurrentSavings || 0);
        const totalSavings = primarySavings + partnerSavings;
        
        // Emergency fund adequacy for couples
        const emergencyFundTarget = totalExpenses * 6; // 6 months of expenses
        if (totalSavings < emergencyFundTarget) {
            recommendations.push({
                type: 'emergency_fund_couple',
                message: content.recommendations.emergencyFundCouple,
                action: `Build emergency fund to ${this.formatCurrency(emergencyFundTarget)}`,
                priority: 'high'
            });
        }
        
        // Income disparity analysis
        if (totalIncome > 0) {
            const incomeRatio = Math.max(primarySalary, partnerSalary) / Math.min(primarySalary, partnerSalary);
            if (incomeRatio > 3) {
                warnings.push({
                    type: 'income_disparity',
                    message: content.warnings.incomeDisparity,
                    severity: 'medium',
                    field: 'salaries'
                });
                
                recommendations.push({
                    type: 'income_protection',
                    message: content.recommendations.incomeProtection,
                    action: 'Consider life insurance for higher earner',
                    priority: 'high'
                });
            }
        }
        
        return { errors, warnings, recommendations };
    },
    
    // Retirement planning validations
    validateRetirementPlanning: function(primary, partner, language) {
        const errors = [];
        const warnings = [];
        const recommendations = [];
        
        const content = this.getContent(language);
        
        const primaryAge = parseInt(primary.currentAge || 30);
        const partnerAge = parseInt(partner.partnerCurrentAge || 30);
        const primaryRetirement = parseInt(primary.retirementAge || 67);
        const partnerRetirement = parseInt(partner.partnerRetirementAge || 67);
        
        // Retirement income replacement validation
        const primarySalary = parseFloat(primary.currentSalary || 0);
        const partnerSalary = parseFloat(partner.partnerCurrentSalary || 0);
        const totalCurrentIncome = primarySalary + partnerSalary;
        
        const primaryTargetReplacement = parseFloat(primary.targetReplacement || 75) / 100;
        const partnerTargetReplacement = parseFloat(partner.partnerTargetReplacement || 75) / 100;
        
        // Calculate projected retirement income
        const primaryProjectedIncome = this.calculateProjectedRetirementIncome(primary);
        const partnerProjectedIncome = this.calculateProjectedRetirementIncome(partner);
        const totalProjectedIncome = primaryProjectedIncome + partnerProjectedIncome;
        
        const targetJointIncome = totalCurrentIncome * Math.max(primaryTargetReplacement, partnerTargetReplacement);
        const incomeShortfall = targetJointIncome - totalProjectedIncome;
        
        if (incomeShortfall > totalCurrentIncome * 0.1) {
            errors.push({
                type: 'retirement_income_shortfall',
                message: content.errors.retirementIncomeShortfall.replace('{amount}', this.formatCurrency(incomeShortfall)),
                severity: 'high',
                field: 'retirement_income'
            });
            
            recommendations.push({
                type: 'increase_contributions',
                message: content.recommendations.increaseContributions,
                action: 'Consider increasing monthly contributions by both partners',
                priority: 'high'
            });
        }
        
        // Staggered retirement validation
        const retirementGap = Math.abs(primaryRetirement - partnerRetirement);
        if (retirementGap > 0) {
            const firstRetirer = primaryRetirement < partnerRetirement ? 'primary' : 'partner';
            const workingYears = retirementGap;
            
            recommendations.push({
                type: 'staggered_retirement',
                message: content.recommendations.staggeredRetirement,
                action: `Plan for ${workingYears} years of single income during transition`,
                priority: 'medium'
            });
        }
        
        // Healthcare transition validation
        if (primaryRetirement < 65 || partnerRetirement < 65) {
            warnings.push({
                type: 'early_retirement_healthcare',
                message: content.warnings.earlyRetirementHealthcare,
                severity: 'high',
                field: 'healthcare'
            });
        }
        
        return { errors, warnings, recommendations };
    },
    
    // Beneficiary and inheritance validations
    validateBeneficiarySetup: function(primary, partner, language) {
        const errors = [];
        const warnings = [];
        const recommendations = [];
        
        const content = this.getContent(language);
        
        // Will status validation
        const primaryHasWill = primary.hasWill || primary.willStatus === 'hasWill';
        const partnerHasWill = partner.partnerHasWill || partner.partnerWillStatus === 'hasWill';
        
        if (!primaryHasWill || !partnerHasWill) {
            errors.push({
                type: 'missing_will',
                message: content.errors.missingWill,
                severity: 'high',
                field: 'estate_planning'
            });
        }
        
        // Life insurance validation
        const primaryLifeInsurance = parseFloat(primary.lifeInsuranceAmount || 0);
        const partnerLifeInsurance = parseFloat(partner.partnerLifeInsuranceAmount || 0);
        const primarySalary = parseFloat(primary.currentSalary || 0);
        const partnerSalary = parseFloat(partner.partnerCurrentSalary || 0);
        
        // Life insurance adequacy (typically 10x annual salary)
        const primaryInsuranceNeeded = primarySalary * 12 * 10;
        const partnerInsuranceNeeded = partnerSalary * 12 * 10;
        
        if (primaryLifeInsurance < primaryInsuranceNeeded * 0.7) {
            warnings.push({
                type: 'insufficient_life_insurance',
                message: content.warnings.insufficientLifeInsurance.replace('{person}', 'primary').replace('{amount}', this.formatCurrency(primaryInsuranceNeeded - primaryLifeInsurance)),
                severity: 'high',
                field: 'life_insurance'
            });
        }
        
        if (partnerLifeInsurance < partnerInsuranceNeeded * 0.7) {
            warnings.push({
                type: 'insufficient_life_insurance',
                message: content.warnings.insufficientLifeInsurance.replace('{person}', 'partner').replace('{amount}', this.formatCurrency(partnerInsuranceNeeded - partnerLifeInsurance)),
                severity: 'high',
                field: 'life_insurance'
            });
        }
        
        // Estate planning recommendations
        const totalAssets = (parseFloat(primary.totalAssets || 0) + parseFloat(partner.partnerTotalAssets || 0));
        if (totalAssets > 1000000) { // High net worth couples
            recommendations.push({
                type: 'estate_planning_advanced',
                message: content.recommendations.estateProTax,
                action: 'Consider professional estate planning for tax optimization',
                priority: 'high'
            });
        }
        
        return { errors, warnings, recommendations };
    },
    
    // Financial dependency validations
    validateFinancialDependencies: function(primary, partner, language) {
        const errors = [];
        const warnings = [];
        const recommendations = [];
        
        const content = this.getContent(language);
        
        const primarySalary = parseFloat(primary.currentSalary || 0);
        const partnerSalary = parseFloat(partner.partnerCurrentSalary || 0);
        const totalIncome = primarySalary + partnerSalary;
        
        // Income dependency analysis
        if (totalIncome > 0) {
            const primaryIncomeShare = primarySalary / totalIncome;
            const partnerIncomeShare = partnerSalary / totalIncome;
            
            // High dependency warning (one partner earns >80%)
            if (primaryIncomeShare > 0.8 || partnerIncomeShare > 0.8) {
                const dependentPartner = primaryIncomeShare > 0.8 ? 'partner' : 'primary';
                const mainEarner = primaryIncomeShare > 0.8 ? 'primary' : 'partner';
                
                warnings.push({
                    type: 'high_income_dependency',
                    message: content.warnings.highIncomeDependency.replace('{dependent}', dependentPartner).replace('{earner}', mainEarner),
                    severity: 'high',
                    field: 'income_dependency'
                });
                
                recommendations.push({
                    type: 'diversify_income',
                    message: content.recommendations.diversifyIncome,
                    action: 'Consider developing additional income streams for dependent partner',
                    priority: 'medium'
                });
            }
        }
        
        // Savings contribution balance
        const primarySavingsRate = this.calculateSavingsRate(primary);
        const partnerSavingsRate = this.calculateSavingsRate(partner);
        const savingsRateGap = Math.abs(primarySavingsRate - partnerSavingsRate);
        
        if (savingsRateGap > 10) {
            warnings.push({
                type: 'unbalanced_savings',
                message: content.warnings.unbalancedSavings.replace('{gap}', savingsRateGap.toFixed(1)),
                severity: 'medium',
                field: 'savings_balance'
            });
        }
        
        // Joint account recommendations
        const jointExpenses = parseFloat(primary.jointMonthlyExpenses || 0);
        const totalExpenses = parseFloat(primary.currentMonthlyExpenses || 0) + jointExpenses;
        
        if (jointExpenses < totalExpenses * 0.3) {
            recommendations.push({
                type: 'joint_accounts',
                message: content.recommendations.jointAccounts,
                action: 'Consider consolidating more shared expenses into joint accounts',
                priority: 'low'
            });
        }
        
        return { errors, warnings, recommendations };
    },
    
    // Risk tolerance alignment validations
    validateRiskAlignment: function(primary, partner, language) {
        const errors = [];
        const warnings = [];
        const recommendations = [];
        
        const content = this.getContent(language);
        
        const primaryRisk = primary.riskTolerance || 'moderate';
        const partnerRisk = partner.partnerRiskTolerance || 'moderate';
        
        const riskLevels = { conservative: 1, moderate: 2, aggressive: 3 };
        const primaryRiskLevel = riskLevels[primaryRisk] || 2;
        const partnerRiskLevel = riskLevels[partnerRisk] || 2;
        const riskGap = Math.abs(primaryRiskLevel - partnerRiskLevel);
        
        if (riskGap >= 2) {
            warnings.push({
                type: 'risk_tolerance_mismatch',
                message: content.warnings.riskToleranceMismatch,
                severity: 'medium',
                field: 'risk_tolerance'
            });
            
            recommendations.push({
                type: 'risk_compromise',
                message: content.recommendations.riskCompromise,
                action: 'Consider separate investment accounts or blended portfolio approach',
                priority: 'medium'
            });
        }
        
        // Investment allocation consistency
        const primaryStockPercentage = parseFloat(primary.stockPercentage || 60);
        const partnerStockPercentage = parseFloat(partner.partnerStockPercentage || 60);
        const allocationGap = Math.abs(primaryStockPercentage - partnerStockPercentage);
        
        if (allocationGap > 30) {
            warnings.push({
                type: 'allocation_mismatch',
                message: content.warnings.allocationMismatch.replace('{gap}', allocationGap),
                severity: 'medium',
                field: 'investment_allocation'
            });
        }
        
        return { errors, warnings, recommendations };
    },
    
    // Helper functions
    calculateProjectedRetirementIncome: function(inputs) {
        // Simplified calculation - in real implementation would use full retirement calculation
        const currentSalary = parseFloat(inputs.currentSalary || inputs.partnerCurrentSalary || 0);
        const savingsRate = parseFloat(inputs.pensionContributionRate || inputs.partnerPensionContributionRate || 17.5) / 100;
        const yearsToRetirement = (parseInt(inputs.retirementAge || inputs.partnerRetirementAge || 67) - parseInt(inputs.currentAge || inputs.partnerCurrentAge || 30));
        const expectedReturn = 0.07; // 7% annual return assumption
        
        const annualContribution = currentSalary * 12 * savingsRate;
        const futureValue = annualContribution * (((1 + expectedReturn) ** yearsToRetirement - 1) / expectedReturn);
        const monthlyRetirementIncome = (futureValue * 0.04) / 12; // 4% withdrawal rate
        
        return monthlyRetirementIncome;
    },
    
    calculateSavingsRate: function(inputs) {
        const salary = parseFloat(inputs.currentSalary || inputs.partnerCurrentSalary || 0);
        const pensionRate = parseFloat(inputs.pensionContributionRate || inputs.partnerPensionContributionRate || 17.5);
        const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || inputs.partnerTrainingFundContributionRate || 7.5);
        return pensionRate + trainingFundRate;
    },
    
    calculateCoupleCompatibilityScore: function(primary, partner) {
        let score = 100;
        
        // Age compatibility (10 points)
        const ageGap = Math.abs((primary.currentAge || 30) - (partner.partnerCurrentAge || 30));
        score -= Math.min(ageGap * 0.5, 10);
        
        // Financial compatibility (20 points)
        const primarySalary = parseFloat(primary.currentSalary || 0);
        const partnerSalary = parseFloat(partner.partnerCurrentSalary || 0);
        if (primarySalary > 0 && partnerSalary > 0) {
            const incomeRatio = Math.max(primarySalary, partnerSalary) / Math.min(primarySalary, partnerSalary);
            score -= Math.min((incomeRatio - 1) * 2, 20);
        }
        
        // Risk tolerance compatibility (15 points)
        const riskLevels = { conservative: 1, moderate: 2, aggressive: 3 };
        const primaryRisk = riskLevels[primary.riskTolerance || 'moderate'];
        const partnerRisk = riskLevels[partner.partnerRiskTolerance || 'moderate'];
        score -= Math.abs(primaryRisk - partnerRisk) * 7.5;
        
        // Retirement planning alignment (25 points)
        const retirementGap = Math.abs((primary.retirementAge || 67) - (partner.partnerRetirementAge || 67));
        score -= Math.min(retirementGap * 2, 25);
        
        // Estate planning completeness (15 points)
        const primaryWill = primary.hasWill || primary.willStatus === 'hasWill';
        const partnerWill = partner.partnerHasWill || partner.partnerWillStatus === 'hasWill';
        if (!primaryWill) score -= 7.5;
        if (!partnerWill) score -= 7.5;
        
        // Contribution rate alignment (15 points)
        const primaryRate = parseFloat(primary.pensionContributionRate || 17.5);
        const partnerRate = parseFloat(partner.partnerPensionContributionRate || 17.5);
        const rateGap = Math.abs(primaryRate - partnerRate);
        score -= Math.min(rateGap, 15);
        
        return Math.max(0, Math.round(score));
    },
    
    formatCurrency: function(amount, currency = 'ILS') {
        const symbols = { ILS: '₪', USD: '$', GBP: '£', EUR: '€' };
        const symbol = symbols[currency] || '₪';
        return `${symbol}${Math.round(amount).toLocaleString()}`;
    },
    
    getContent: function(language) {
        const content = {
            he: {
                errors: {
                    highExpenseRatio: 'ההוצאות החודשיות גבוהות מדי ביחס להכנסה המשותפת',
                    retirementIncomeShortfall: 'חוסר בהכנסה צפויה בפרישה: {amount}',
                    missingWill: 'חסרה צוואה לאחד מבני הזוג או לשניהם'
                },
                warnings: {
                    largeAgeGap: 'פער גילאים גדול בין בני הזוג ({gap} שנים)',
                    retirementAgeGap: 'פער בגיל פרישה מתוכנן ({gap} שנים)',
                    contributionRateGap: 'פער בשיעור הפקדות פנסיוניות ({gap}%)',
                    incomeDisparity: 'פער הכנסות משמעותי בין בני הזוג',
                    highIncomeDependency: '{dependent} תלוי כלכלית ב{earner}',
                    unbalancedSavings: 'חוסר איזון בשיעור החיסכון ({gap}% פער)',
                    riskToleranceMismatch: 'אי התאמה בסובלנות הסיכון בין בני הזוג',
                    allocationMismatch: 'אי התאמה בהקצאת השקעות ({gap}% פער)',
                    earlyRetirementHealthcare: 'פרישה מוקדמת מחייבת תכנון ביטוח בריאות',
                    insufficientLifeInsurance: 'ביטוח חיים לא מספיק עבור {person} (חסר {amount})'
                },
                recommendations: {
                    ageGapPlanning: 'שקלו תכנון פרישה מדורג ודמי שאירים',
                    earlyRetirementCouple: 'תכננו כיסוי ביטוח בריאות והוצאות משותפות',
                    emergencyFundCouple: 'בנו קרן חירום משותפת המכסה 6 חודשי הוצאות',
                    incomeProtection: 'שקלו ביטוח חיים עבור בעל ההכנסה הגבוהה',
                    increaseContributions: 'שקלו העלאת הפקדות חודשיות על ידי שני הצדדים',
                    staggeredRetirement: 'תכננו מעבר הדרגתי לפרישה',
                    estateProTax: 'שקלו ייעוץ מקצועי לאופטימיזציה מיסויית',
                    diversifyIncome: 'שקלו פיתוח מקורות הכנסה נוספים',
                    jointAccounts: 'שקלו איחוד הוצאות משותפות נוספות',
                    riskCompromise: 'שקלו חשבונות השקעה נפרדים או גישה מעורבת'
                }
            },
            en: {
                errors: {
                    highExpenseRatio: 'Monthly expenses are too high relative to joint income',
                    retirementIncomeShortfall: 'Projected retirement income shortfall: {amount}',
                    missingWill: 'One or both partners lack a will'
                },
                warnings: {
                    largeAgeGap: 'Large age gap between partners ({gap} years)',
                    retirementAgeGap: 'Gap in planned retirement ages ({gap} years)',
                    contributionRateGap: 'Gap in pension contribution rates ({gap}%)',
                    incomeDisparity: 'Significant income disparity between partners',
                    highIncomeDependency: '{dependent} is financially dependent on {earner}',
                    unbalancedSavings: 'Unbalanced savings rates ({gap}% gap)',
                    riskToleranceMismatch: 'Risk tolerance mismatch between partners',
                    allocationMismatch: 'Investment allocation mismatch ({gap}% gap)',
                    earlyRetirementHealthcare: 'Early retirement requires healthcare coverage planning',
                    insufficientLifeInsurance: 'Insufficient life insurance for {person} (missing {amount})'
                },
                recommendations: {
                    ageGapPlanning: 'Consider staggered retirement planning and survivor benefits',
                    earlyRetirementCouple: 'Plan for healthcare coverage and joint expenses',
                    emergencyFundCouple: 'Build joint emergency fund covering 6 months of expenses',
                    incomeProtection: 'Consider life insurance for higher earner',
                    increaseContributions: 'Consider increasing monthly contributions by both partners',
                    staggeredRetirement: 'Plan for gradual transition to retirement',
                    estateProTax: 'Consider professional estate planning for tax optimization',
                    diversifyIncome: 'Consider developing additional income streams',
                    jointAccounts: 'Consider consolidating more shared expenses',
                    riskCompromise: 'Consider separate investment accounts or blended approach'
                }
            }
        };
        
        return content[language] || content.en;
    }
};

// Export for browser usage
if (typeof window !== 'undefined') {
    window.CoupleValidation = CoupleValidation;
    console.log('✅ CoupleValidation utility loaded successfully');
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoupleValidation;
}