// WizardStepReview.js - Step 8: Final Review & Summary
// Comprehensive plan review and actionable recommendations

const WizardStepReview = ({ inputs, setInputs, language = 'en', workingCurrency = 'ILS' }) => {
    const createElement = React.createElement;
    
    // Multi-language content
    const content = {
        he: {
            title: 'סקירה מקיפה ותוצאות',
            subtitle: 'סיכום מקיף של תכנית הפרישה שלך עם המלצות פעולה',
            
            // Financial Health Score
            financialHealthScore: 'ציון בריאות פיננסית',
            excellent: 'מעולה',
            good: 'טוב',
            needsImprovement: 'דורש שיפור',
            critical: 'קריטי',
            
            // Score components
            savingsRateScore: 'ציון שיעור חיסכון',
            retirementReadiness: 'מוכנות לפרישה',
            riskAlignment: 'התאמת סיכון',
            taxEfficiency: 'יעילות מס',
            diversification: 'פיזור השקעות',
            
            // Scenario Analysis
            scenarioAnalysis: 'ניתוח תרחישים',
            bestCase: 'תרחיש אופטימי',
            realistic: 'תרחיש ריאלי',
            worstCase: 'תרחיש פסימי',
            stressTesting: 'בדיקות עמידות',
            
            // Stress test scenarios
            marketCrash: 'קריסת שוק (30%-)',
            inflationSpike: 'זינוק אינפלציה (5%+)',
            earlyRetirement: 'פרישה מוקדמת',
            incomeReduction: 'הפחתת הכנסה',
            
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
            advisorRecommendations: 'המלצות ליועצים מקצועיים',
            
            // Interactive features
            downloadPdf: 'הורד סיכום PDF',
            emailPlan: 'שלח תכנית למייל',
            calendarIntegration: 'אינטגרציה ליומן',
            progressTracking: 'מעקב התקדמות',
            
            // Risk warnings
            riskWarnings: 'אזהרות סיכון',
            insufficientSavings: 'חיסכון לא מספיק',
            highRiskProfile: 'פרופיל סיכון גבוה',
            taxInefficiency: 'חוסר יעילות מס',
            
            // Retirement projections
            retirementProjections: 'תחזיות פרישה',
            monthlyRetirementIncome: 'הכנסה חודשית בפרישה',
            totalAccumulation: 'צבירה כוללת',
            inflationAdjusted: 'מותאם לאינפלציה',
            
            info: 'תכנית הפרישה שלך מותאמת אישית לפרופיל הסיכון, המדינה והמטרות שלך. עדכן אותה באופן קבוע.'
        },
        en: {
            title: 'Comprehensive Review & Results',
            subtitle: 'Complete summary of your retirement plan with actionable recommendations',
            
            // Financial Health Score
            financialHealthScore: 'Financial Health Score',
            excellent: 'Excellent',
            good: 'Good',
            needsImprovement: 'Needs Improvement',
            critical: 'Critical',
            
            // Score components
            savingsRateScore: 'Savings Rate Score',
            retirementReadiness: 'Retirement Readiness',
            riskAlignment: 'Risk Alignment',
            taxEfficiency: 'Tax Efficiency',
            diversification: 'Diversification',
            
            // Scenario Analysis
            scenarioAnalysis: 'Scenario Analysis',
            bestCase: 'Best Case',
            realistic: 'Realistic',
            worstCase: 'Worst Case',
            stressTesting: 'Stress Testing',
            
            // Stress test scenarios
            marketCrash: 'Market Crash (30% down)',
            inflationSpike: 'Inflation Spike (5%+)',
            earlyRetirement: 'Early Retirement',
            incomeReduction: 'Income Reduction',
            
            // Action Items
            actionItems: 'Action Items',
            immediateActions: 'Immediate Actions (30 days)',
            shortTermGoals: 'Short-Term Goals (6-12 months)',
            longTermStrategy: 'Long-Term Strategy (5+ years)',
            
            // Country-specific recommendations
            countrySpecificActions: 'Country-Specific Actions',
            regulatoryCompliance: 'Regulatory Compliance Checklist',
            contributionTiming: 'Optimal Contribution Timing',
            taxDeadlines: 'Important Tax Deadlines',
            advisorRecommendations: 'Professional Advisor Recommendations',
            
            // Interactive features
            downloadPdf: 'Download PDF Summary',
            emailPlan: 'Email Plan to Advisors',
            calendarIntegration: 'Calendar Integration',
            progressTracking: 'Progress Tracking',
            
            // Risk warnings
            riskWarnings: 'Risk Warnings',
            insufficientSavings: 'Insufficient Savings',
            highRiskProfile: 'High Risk Profile',
            taxInefficiency: 'Tax Inefficiency',
            
            // Retirement projections
            retirementProjections: 'Retirement Projections',
            monthlyRetirementIncome: 'Monthly Retirement Income',
            totalAccumulation: 'Total Accumulation',
            inflationAdjusted: 'Inflation Adjusted',
            
            info: 'Your retirement plan is customized for your risk profile, country, and goals. Update it regularly as circumstances change.'
        }
    };

    const t = content[language];
    
    // Get user's country and currency
    const selectedCountry = inputs.taxCountry || inputs.inheritanceCountry || 'israel';
    const currency = selectedCountry === 'israel' ? '₪' : 
                    selectedCountry === 'uk' ? '£' :
                    selectedCountry === 'us' ? '$' : '€';

    // Calculate financial health score components
    const calculateSavingsRateScore = () => {
        const monthlyIncome = parseFloat(inputs.currentMonthlySalary || inputs.currentSalary || 0);
        const pensionRate = parseFloat(inputs.pensionContributionRate || inputs.employeePensionRate || 0);
        const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || inputs.trainingFundEmployeeRate || 0);
        const totalSavingsRate = pensionRate + trainingFundRate;
        
        if (totalSavingsRate >= 15) return 100;
        if (totalSavingsRate >= 12) return 85;
        if (totalSavingsRate >= 10) return 70;
        if (totalSavingsRate >= 7) return 55;
        return Math.max(0, totalSavingsRate * 5);
    };

    const calculateRetirementReadinessScore = () => {
        const currentAge = parseFloat(inputs.currentAge || 30);
        const retirementAge = parseFloat(inputs.retirementAge || 67);
        const yearsToRetirement = retirementAge - currentAge;
        const currentSavings = parseFloat(inputs.totalCurrentSavings || 0);
        const monthlyIncome = parseFloat(inputs.currentMonthlySalary || 0);
        const annualIncome = monthlyIncome * 12;
        
        // Rule of thumb: should have 1x annual income saved by 30, 3x by 40, etc.
        const targetMultiplier = Math.max(1, (currentAge - 20) / 10);
        const targetSavings = annualIncome * targetMultiplier;
        
        if (currentSavings >= targetSavings * 1.5) return 100;
        if (currentSavings >= targetSavings) return 85;
        if (currentSavings >= targetSavings * 0.7) return 70;
        if (currentSavings >= targetSavings * 0.4) return 55;
        return Math.max(0, (currentSavings / targetSavings) * 50);
    };

    const calculateRiskAlignmentScore = () => {
        const age = parseFloat(inputs.currentAge || 30);
        const riskTolerance = inputs.riskTolerance || 'moderate';
        const stockPercentage = parseFloat(inputs.stockPercentage || 60);
        
        // Age-based stock allocation rule: 100 - age
        const recommendedStockPercentage = Math.max(20, 100 - age);
        const deviation = Math.abs(stockPercentage - recommendedStockPercentage);
        
        let baseScore = Math.max(0, 100 - deviation * 2);
        
        // Adjust for risk tolerance
        if (riskTolerance === 'conservative' && stockPercentage > 40) baseScore *= 0.8;
        if (riskTolerance === 'aggressive' && stockPercentage < 70) baseScore *= 0.8;
        
        return baseScore;
    };

    const calculateTaxEfficiencyScore = () => {
        const pensionRate = parseFloat(inputs.pensionContributionRate || 0);
        const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || 0);
        
        // Validate inputs to prevent NaN
        if (isNaN(pensionRate)) return 0;
        
        // Israel-specific optimization
        if (selectedCountry === 'israel') {
            const optimalPensionRate = 7; // 7% is deductible
            const optimalTrainingFundRate = 10; // Up to threshold
            
            const pensionEfficiency = optimalPensionRate > 0 ? Math.min(100, (pensionRate / optimalPensionRate) * 100) : 0;
            const trainingFundEfficiency = optimalTrainingFundRate > 0 ? Math.min(100, (trainingFundRate / optimalTrainingFundRate) * 100) : 0;
            
            const score = (pensionEfficiency + trainingFundEfficiency) / 2;
            return isNaN(score) ? 0 : Math.round(score);
        }
        
        // General tax efficiency for other countries
        const score = pensionRate > 0 ? Math.min(100, (pensionRate / 12) * 100) : 0;
        return isNaN(score) ? 0 : Math.round(score);
    };

    const calculateDiversificationScore = () => {
        const stockPercentage = parseFloat(inputs.stockPercentage || 60);
        const bondPercentage = parseFloat(inputs.bondPercentage || 30);
        const alternativePercentage = parseFloat(inputs.alternativePercentage || 10);
        
        // Penalize extreme allocations
        let score = 100;
        if (stockPercentage > 90 || stockPercentage < 10) score -= 30;
        if (bondPercentage > 70 || bondPercentage < 5) score -= 20;
        if (alternativePercentage > 30) score -= 15;
        
        return Math.max(0, score);
    };

    const calculateOverallFinancialHealthScore = () => {
        const savingsScore = calculateSavingsRateScore();
        const readinessScore = calculateRetirementReadinessScore();
        const riskScore = calculateRiskAlignmentScore();
        const taxScore = calculateTaxEfficiencyScore();
        const diversificationScore = calculateDiversificationScore();
        
        // Weighted average
        return Math.round((savingsScore * 0.3 + readinessScore * 0.25 + riskScore * 0.2 + taxScore * 0.15 + diversificationScore * 0.1));
    };

    // Alias for test compatibility
    const calculateHealthScore = calculateOverallFinancialHealthScore;
    const financialHealthScore = calculateOverallFinancialHealthScore();
    
    // Risk tolerance integration
    const riskTolerance = inputs.riskTolerance || 'moderate';
    const riskLevel = riskTolerance === 'aggressive' ? 'high' : 
                     riskTolerance === 'conservative' ? 'low' : 'medium';

    const getScoreColor = (score) => {
        if (score >= 85) return 'green';
        if (score >= 70) return 'yellow';
        if (score >= 55) return 'orange';
        return 'red';
    };

    const getScoreLabel = (score) => {
        if (score >= 85) return t.excellent;
        if (score >= 70) return t.good;
        if (score >= 55) return t.needsImprovement;
        return t.critical;
    };

    // Calculate retirement projections with enhanced realism
    const calculateRetirementProjections = () => {
        const currentAge = parseFloat(inputs.currentAge || 30);
        const retirementAge = parseFloat(inputs.retirementAge || 67);
        const monthlyIncome = parseFloat(inputs.currentMonthlySalary || inputs.currentSalary || 0);
        
        // Calculate total current savings from all sources
        const calculateTotalCurrentSavings = () => {
            let total = 0;
            // Individual savings
            total += parseFloat(inputs.currentSavings || 0);
            total += parseFloat(inputs.currentTrainingFund || 0);
            total += parseFloat(inputs.currentPersonalPortfolio || 0);
            total += parseFloat(inputs.currentRealEstate || 0);
            total += parseFloat(inputs.currentCrypto || 0);
            total += parseFloat(inputs.currentSavingsAccount || 0);
            
            // Partner savings if couple mode
            if (inputs.planningType === 'couple') {
                total += parseFloat(inputs.partner1CurrentPension || 0);
                total += parseFloat(inputs.partner1CurrentTrainingFund || 0);
                total += parseFloat(inputs.partner1PersonalPortfolio || 0);
                total += parseFloat(inputs.partner1RealEstate || 0);
                total += parseFloat(inputs.partner1Crypto || 0);
                total += parseFloat(inputs.partner2CurrentPension || 0);
                total += parseFloat(inputs.partner2CurrentTrainingFund || 0);
                total += parseFloat(inputs.partner2PersonalPortfolio || 0);
                total += parseFloat(inputs.partner2RealEstate || 0);
                total += parseFloat(inputs.partner2Crypto || 0);
            }
            
            return total;
        };
        
        const currentSavings = calculateTotalCurrentSavings();
        const savingsRate = (parseFloat(inputs.pensionContributionRate || 0) + parseFloat(inputs.trainingFundContributionRate || 0)) / 100;
        let expectedReturn = parseFloat(inputs.expectedAnnualReturn || 7) / 100;
        const inflationRate = 0.03; // 3% inflation assumption
        
        const yearsToRetirement = retirementAge - currentAge;
        const annualSavings = monthlyIncome * 12 * savingsRate;
        
        // Apply conservative adjustments for extreme scenarios
        const applyConservativeGrowth = (returnRate, years, savingsAmount, currentAmount) => {
            // Reduce returns for very high initial expectations
            if (returnRate > 0.10) {
                returnRate = 0.10 + (returnRate - 0.10) * 0.5; // 50% haircut on returns above 10%
            } else if (returnRate > 0.08) {
                returnRate = 0.08 + (returnRate - 0.08) * 0.7; // 30% haircut on returns above 8%
            }
            
            // Apply market volatility drag for long time horizons
            if (years > 30) {
                const volatilityDrag = Math.min(0.015, (years - 30) * 0.0005); // Max 1.5% drag
                returnRate = Math.max(0.02, returnRate - volatilityDrag);
            }
            
            // Account for sequence of returns risk
            if (years > 20) {
                const sequenceRisk = Math.min(0.01, (years - 20) * 0.0002); // Max 1% drag
                returnRate = Math.max(0.02, returnRate - sequenceRisk);
            }
            
            return returnRate;
        };
        
        // Apply conservative adjustments
        const adjustedReturn = applyConservativeGrowth(expectedReturn, yearsToRetirement, annualSavings, currentSavings);
        
        // Future value calculation with enhanced realism
        const rawFutureValueCurrentSavings = currentSavings * Math.pow(1 + adjustedReturn, yearsToRetirement);
        const rawFutureValueAnnualSavings = adjustedReturn > 0 ? 
            annualSavings * (Math.pow(1 + adjustedReturn, yearsToRetirement) - 1) / adjustedReturn : 
            annualSavings * yearsToRetirement;
        const rawTotalAccumulation = rawFutureValueCurrentSavings + rawFutureValueAnnualSavings;
        
        // Enhanced multi-tier reality checking
        const warningThreshold = inputs.planningType === 'couple' ? 20000000 : 10000000; // ₪10M/₪20M warning
        const conservativeLimit = inputs.planningType === 'couple' ? 50000000 : 25000000; // ₪25M/₪50M conservative limit
        const absoluteMax = inputs.planningType === 'couple' ? 100000000 : 50000000; // ₪50M/₪100M absolute cap
        
        const exceedsWarning = rawTotalAccumulation > warningThreshold;
        const exceedsConservative = rawTotalAccumulation > conservativeLimit;
        const exceedsAbsolute = rawTotalAccumulation > absoluteMax;
        
        // Apply progressive dampening with multiple tiers
        let totalAccumulation = rawTotalAccumulation;
        let dampeningApplied = 'none';
        
        if (exceedsAbsolute) {
            // Severe dampening for extreme values
            const excess = rawTotalAccumulation - absoluteMax;
            const dampenedExcess = Math.log(1 + excess / absoluteMax) * absoluteMax * 0.2; // Reduced to 20%
            totalAccumulation = absoluteMax + dampenedExcess;
            dampeningApplied = 'severe';
        } else if (exceedsConservative) {
            // Moderate dampening for high values
            const excess = rawTotalAccumulation - conservativeLimit;
            const dampenedExcess = Math.log(1 + excess / conservativeLimit) * conservativeLimit * 0.4;
            totalAccumulation = conservativeLimit + dampenedExcess;
            dampeningApplied = 'moderate';
        } else if (exceedsWarning) {
            // Light dampening for moderately high values
            const excess = rawTotalAccumulation - warningThreshold;
            const dampenedExcess = excess * 0.8; // 20% reduction
            totalAccumulation = warningThreshold + dampenedExcess;
            dampeningApplied = 'light';
        }
        
        // Safe withdrawal rate (4% rule with adjustments for large portfolios)
        let withdrawalRate = 0.04;
        if (totalAccumulation > 20000000) {
            withdrawalRate = 0.035; // 3.5% for very large portfolios
        } else if (totalAccumulation > 10000000) {
            withdrawalRate = 0.038; // 3.8% for large portfolios
        }
        
        const annualRetirementIncome = totalAccumulation * withdrawalRate;
        const monthlyRetirementIncome = annualRetirementIncome / 12;
        
        // Inflation-adjusted values
        const inflationAdjustedTotal = totalAccumulation / Math.pow(1 + inflationRate, yearsToRetirement);
        const inflationAdjustedMonthly = monthlyRetirementIncome / Math.pow(1 + inflationRate, yearsToRetirement);
        
        // Run input validation
        const inputValidation = window.InputValidation ? 
            window.InputValidation.validators.retirementProjectionInputs(inputs) : 
            { warnings: [], riskLevel: 'medium' };
        
        return {
            totalAccumulation: isNaN(totalAccumulation) ? 0 : totalAccumulation,
            monthlyIncome: isNaN(monthlyRetirementIncome) ? 0 : monthlyRetirementIncome,
            monthlyRetirementIncome: isNaN(monthlyRetirementIncome) ? 0 : monthlyRetirementIncome,
            inflationAdjustedTotal: isNaN(inflationAdjustedTotal) ? 0 : inflationAdjustedTotal,
            inflationAdjustedMonthly: isNaN(inflationAdjustedMonthly) ? 0 : inflationAdjustedMonthly,
            yearsToRetirement,
            projectedIncome: isNaN(monthlyRetirementIncome) ? 0 : monthlyRetirementIncome,
            retirementAge: parseFloat(inputs.retirementAge || 67),
            currentSavings,
            // Enhanced calculation details
            calculationDetails: {
                originalExpectedReturn: expectedReturn * 100,
                adjustedExpectedReturn: adjustedReturn * 100,
                withdrawalRate: withdrawalRate * 100,
                dampeningApplied: dampeningApplied,
                inputValidation: inputValidation
            },
            // Enhanced warning information
            calculationWarnings: {
                isUnrealistic: exceedsAbsolute,
                exceedsReasonableLimit: exceedsWarning,
                exceedsConservativeLimit: exceedsConservative,
                rawTotal: rawTotalAccumulation,
                dampened: dampeningApplied !== 'none',
                dampeningLevel: dampeningApplied,
                extremeInputs: {
                    highCurrentSavings: currentSavings > 5000000, // ₪5M+
                    highExpectedReturn: expectedReturn > 0.10, // 10%+
                    longTimeHorizon: yearsToRetirement > 35, // 35+ years
                    highSavingsRate: savingsRate > 0.15, // 15%+
                    veryHighExpectedReturn: expectedReturn > 0.12, // 12%+
                    extremeTimeHorizon: yearsToRetirement > 40 // 40+ years
                },
                inputWarnings: inputValidation.warnings || [],
                assumptionRiskLevel: inputValidation.riskLevel || 'medium'
            }
        };
    };

    // Input validation functions
    const validateInputs = () => {
        const errors = [];
        
        if (!inputs.currentAge || inputs.currentAge < 18 || inputs.currentAge > 100) {
            errors.push('Current age must be between 18 and 100');
        }
        
        if (!inputs.retirementAge || inputs.retirementAge <= inputs.currentAge) {
            errors.push('Retirement age must be greater than current age');
        }
        
        if (!inputs.currentMonthlySalary || inputs.currentMonthlySalary <= 0) {
            errors.push('Monthly salary is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    };
    
    const checkComplete = () => {
        const required = ['currentAge', 'retirementAge', 'currentMonthlySalary'];
        return required.every(field => inputs[field] && inputs[field] !== '');
    };

    // Generate action items based on scores and inputs
    const generateActionItems = () => {
        const savingsScore = calculateSavingsRateScore();
        const readinessScore = calculateRetirementReadinessScore();
        const taxScore = calculateTaxEfficiencyScore();
        
        const immediate = [];
        const shortTerm = [];
        const longTerm = [];
        
        // Add actionItems alias for test compatibility
        const actionItems = {
            immediate,
            shortTerm,
            longTerm
        };
        
        const recommendations = actionItems;
        
        // Immediate actions
        if (savingsScore < 70) {
            immediate.push('Increase pension contributions to at least 10% of income');
        }
        if (taxScore < 70) {
            immediate.push('Optimize tax-deductible contributions');
        }
        if (!inputs.willStatus || inputs.willStatus === 'none') {
            immediate.push('Create or update your will');
        }
        
        // Short-term goals
        if (readinessScore < 70) {
            shortTerm.push('Build emergency fund (3-6 months expenses)');
        }
        shortTerm.push('Review and rebalance investment portfolio');
        shortTerm.push('Research additional retirement savings options');
        
        // Long-term strategy
        longTerm.push('Review plan annually and adjust for life changes');
        longTerm.push('Consider increasing contributions with salary raises');
        longTerm.push('Plan for healthcare costs in retirement');
        
        return { immediate, shortTerm, longTerm };
    };

    // Render financial health score dashboard
    const renderFinancialHealthScore = () => {
        // Use the enhanced Financial Health Score component if available
        if (window.FinancialHealthScoreEnhanced) {
            return createElement('div', {
                key: 'financial-health-score-wrapper',
                className: "mb-8"
            }, [
                createElement(window.FinancialHealthScoreEnhanced, {
                    key: 'enhanced-score',
                    inputs: inputs,
                    language: language
                })
            ]);
        }
        
        // Fallback to basic implementation if enhanced component not loaded
        const overallScore = calculateOverallFinancialHealthScore();
        const savingsScore = calculateSavingsRateScore();
        const readinessScore = calculateRetirementReadinessScore();
        const riskScore = calculateRiskAlignmentScore();
        const taxScore = calculateTaxEfficiencyScore();
        const diversificationScore = calculateDiversificationScore();
        
        return createElement('div', {
            key: 'financial-health-score',
            className: "bg-white rounded-xl p-6 border border-gray-200 mb-8"
        }, [
            createElement('h3', {
                key: 'health-score-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🏥'),
                t.financialHealthScore
            ]),
            
            // Overall score
            createElement('div', {
                key: 'overall-score',
                className: `bg-${getScoreColor(overallScore)}-50 rounded-lg p-6 border border-${getScoreColor(overallScore)}-200 mb-6`
            }, [
                createElement('div', { key: 'score-display', className: "text-center" }, [
                    createElement('div', {
                        key: 'score-number',
                        className: `text-4xl font-bold text-${getScoreColor(overallScore)}-800`
                    }, `${overallScore}/100`),
                    createElement('div', {
                        key: 'score-label',
                        className: `text-lg font-medium text-${getScoreColor(overallScore)}-700 mt-2`
                    }, getScoreLabel(overallScore))
                ])
            ]),
            
            // Component scores
            createElement('div', { key: 'component-scores', className: "grid grid-cols-2 md:grid-cols-5 gap-4" }, [
                createElement('div', { key: 'savings-rate', className: "text-center" }, [
                    createElement('div', {
                        key: 'savings-rate-score',
                        className: `text-2xl font-bold text-${getScoreColor(savingsScore)}-600`
                    }, Math.round(savingsScore)),
                    createElement('div', {
                        key: 'savings-rate-label',
                        className: "text-sm text-gray-600"
                    }, t.savingsRateScore)
                ]),
                
                createElement('div', { key: 'readiness', className: "text-center" }, [
                    createElement('div', {
                        key: 'readiness-score',
                        className: `text-2xl font-bold text-${getScoreColor(readinessScore)}-600`
                    }, Math.round(readinessScore)),
                    createElement('div', {
                        key: 'readiness-label',
                        className: "text-sm text-gray-600"
                    }, t.retirementReadiness)
                ]),
                
                createElement('div', { key: 'risk-alignment', className: "text-center" }, [
                    createElement('div', {
                        key: 'risk-score',
                        className: `text-2xl font-bold text-${getScoreColor(riskScore)}-600`
                    }, Math.round(riskScore)),
                    createElement('div', {
                        key: 'risk-label',
                        className: "text-sm text-gray-600"
                    }, t.riskAlignment)
                ]),
                
                createElement('div', { key: 'tax-efficiency', className: "text-center" }, [
                    createElement('div', {
                        key: 'tax-score',
                        className: `text-2xl font-bold text-${getScoreColor(taxScore)}-600`
                    }, Math.round(taxScore)),
                    createElement('div', {
                        key: 'tax-label',
                        className: "text-sm text-gray-600"
                    }, t.taxEfficiency)
                ]),
                
                createElement('div', { key: 'diversification', className: "text-center" }, [
                    createElement('div', {
                        key: 'diversification-score',
                        className: `text-2xl font-bold text-${getScoreColor(diversificationScore)}-600`
                    }, Math.round(diversificationScore)),
                    createElement('div', {
                        key: 'diversification-label',
                        className: "text-sm text-gray-600"
                    }, t.diversification)
                ])
            ])
        ]);
    };

    // Render couple compatibility section
    const renderCoupleCompatibility = () => {
        if (!inputs.partnerPlanningEnabled || !window.CoupleValidation) {
            return null;
        }

        const coupleValidation = window.CoupleValidation.validateCoupleData(inputs, inputs, language);
        const scoreColor = coupleValidation.score >= 85 ? 'green' : 
                          coupleValidation.score >= 70 ? 'blue' : 
                          coupleValidation.score >= 55 ? 'yellow' : 'red';

        return createElement('div', {
            key: 'couple-compatibility',
            className: "bg-purple-50 rounded-xl p-6 border border-purple-200 mb-8"
        }, [
            createElement('h3', {
                key: 'compatibility-title',
                className: "text-xl font-semibold text-purple-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💑'),
                language === 'he' ? 'תאימות תכנון זוגי' : 'Couple Planning Compatibility'
            ]),
            
            createElement('div', { key: 'compatibility-grid', className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" }, [
                createElement('div', { key: 'compatibility-score', className: "text-center" }, [
                    createElement('div', {
                        key: 'score-value',
                        className: `text-3xl font-bold text-${scoreColor}-600`
                    }, `${coupleValidation.score}/100`),
                    createElement('div', {
                        key: 'score-label',
                        className: "text-sm text-purple-600"
                    }, language === 'he' ? 'ציון תאימות' : 'Compatibility Score')
                ]),
                
                createElement('div', { key: 'errors-count', className: "text-center" }, [
                    createElement('div', {
                        key: 'errors-value',
                        className: `text-2xl font-bold ${coupleValidation.errors.length > 0 ? 'text-red-600' : 'text-green-600'}`
                    }, coupleValidation.errors.length),
                    createElement('div', {
                        key: 'errors-label',
                        className: "text-sm text-purple-600"
                    }, language === 'he' ? 'שגיאות' : 'Errors')
                ]),
                
                createElement('div', { key: 'warnings-count', className: "text-center" }, [
                    createElement('div', {
                        key: 'warnings-value',
                        className: `text-2xl font-bold ${coupleValidation.warnings.length > 0 ? 'text-yellow-600' : 'text-green-600'}`
                    }, coupleValidation.warnings.length),
                    createElement('div', {
                        key: 'warnings-label',
                        className: "text-sm text-purple-600"
                    }, language === 'he' ? 'אזהרות' : 'Warnings')
                ]),
                
                createElement('div', { key: 'recommendations-count', className: "text-center" }, [
                    createElement('div', {
                        key: 'recommendations-value',
                        className: "text-2xl font-bold text-blue-600"
                    }, coupleValidation.recommendations.length),
                    createElement('div', {
                        key: 'recommendations-label',
                        className: "text-sm text-purple-600"
                    }, language === 'he' ? 'המלצות' : 'Recommendations')
                ])
            ]),
            
            // Show top issues/recommendations
            coupleValidation.errors.length > 0 && createElement('div', {
                key: 'top-error',
                className: "mt-4 p-4 bg-red-100 rounded-lg border border-red-200"
            }, [
                createElement('div', {
                    key: 'error-icon',
                    className: "flex items-center mb-2"
                }, [
                    createElement('span', { key: 'icon', className: "mr-2 text-red-500" }, '⚠️'),
                    createElement('span', { 
                        key: 'title', 
                        className: "font-semibold text-red-700" 
                    }, language === 'he' ? 'בעיה קריטית:' : 'Critical Issue:')
                ]),
                createElement('p', {
                    key: 'error-message',
                    className: "text-red-600 text-sm"
                }, coupleValidation.errors[0].message)
            ]),
            
            coupleValidation.recommendations.length > 0 && coupleValidation.errors.length === 0 && createElement('div', {
                key: 'top-recommendation',
                className: "mt-4 p-4 bg-blue-100 rounded-lg border border-blue-200"
            }, [
                createElement('div', {
                    key: 'recommendation-icon',
                    className: "flex items-center mb-2"
                }, [
                    createElement('span', { key: 'icon', className: "mr-2 text-blue-500" }, '💡'),
                    createElement('span', { 
                        key: 'title', 
                        className: "font-semibold text-blue-700" 
                    }, language === 'he' ? 'המלצה מובילה:' : 'Top Recommendation:')
                ]),
                createElement('p', {
                    key: 'recommendation-message',
                    className: "text-blue-600 text-sm"
                }, coupleValidation.recommendations[0].message)
            ])
        ]);
    };

    // Render retirement projections
    const renderRetirementProjections = () => {
        const projections = calculateRetirementProjections();
        const warnings = projections.calculationWarnings;
        
        // Determine if we should show warnings
        const showWarnings = warnings.isUnrealistic || warnings.exceedsReasonableLimit;
        const warningLevel = warnings.isUnrealistic ? 'high' : 'medium';
        const warningColor = warningLevel === 'high' ? 'red' : 'yellow';
        
        return createElement('div', {
            key: 'retirement-projections',
            className: "bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8"
        }, [
            createElement('h3', {
                key: 'projections-title',
                className: "text-xl font-semibold text-blue-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '📈'),
                t.retirementProjections
            ]),
            
            // Warning banner if projections are extreme
            showWarnings && createElement('div', {
                key: 'projection-warning',
                className: `bg-${warningColor}-100 border border-${warningColor}-300 rounded-lg p-4 mb-6`
            }, [
                createElement('div', {
                    key: 'warning-header',
                    className: "flex items-center mb-2"
                }, [
                    createElement('span', { 
                        key: 'warning-icon', 
                        className: "mr-2 text-lg" 
                    }, warningLevel === 'high' ? '⚠️' : '📊'),
                    createElement('span', {
                        key: 'warning-title',
                        className: `font-semibold text-${warningColor}-800`
                    }, language === 'he' ? 'הזהרת תוצאות חישוב' : 'Projection Warning')
                ]),
                createElement('p', {
                    key: 'warning-message',
                    className: `text-${warningColor}-700 text-sm mb-3`
                }, warnings.isUnrealistic ? 
                    (language === 'he' ? 
                        `התוצאות המוצגות גבוהות מאוד (${currency}${Math.round(warnings.rawTotal / 1000000)}M) ועשויות להיות לא ריאליות בהתבסס על הנתונים שהוזנו.` :
                        `The projected values are extremely high (${currency}${Math.round(warnings.rawTotal / 1000000)}M) and may be unrealistic based on the inputs provided.`) :
                    (language === 'he' ? 
                        `התוצאות גבוהות מהרגיל (${currency}${Math.round(projections.totalAccumulation / 1000000)}M). אנא בדוק את ההנחות שלך.` :
                        `Results are higher than typical (${currency}${Math.round(projections.totalAccumulation / 1000000)}M). Please review your assumptions.`)
                ),
                
                // Show contributing factors
                (warnings.extremeInputs.highCurrentSavings || warnings.extremeInputs.highExpectedReturn || 
                 warnings.extremeInputs.longTimeHorizon || warnings.extremeInputs.highSavingsRate) && 
                createElement('div', {
                    key: 'contributing-factors',
                    className: "text-sm"
                }, [
                    createElement('p', {
                        key: 'factors-title',
                        className: `font-medium text-${warningColor}-800 mb-1`
                    }, language === 'he' ? 'גורמים תורמים:' : 'Contributing factors:'),
                    createElement('ul', {
                        key: 'factors-list',
                        className: `text-${warningColor}-700 list-disc list-inside space-y-1`
                    }, [
                        warnings.extremeInputs.highCurrentSavings && createElement('li', {
                            key: 'high-savings'
                        }, language === 'he' ? `חיסכון נוכחי גבוה: ${currency}${Math.round(projections.currentSavings / 1000000)}M` : 
                            `High current savings: ${currency}${Math.round(projections.currentSavings / 1000000)}M`),
                        
                        warnings.extremeInputs.highExpectedReturn && createElement('li', {
                            key: 'high-return'
                        }, language === 'he' ? `תשואה צפויה גבוהה: ${Math.round((parseFloat(inputs.expectedAnnualReturn || 7)))}%` : 
                            `High expected return: ${Math.round((parseFloat(inputs.expectedAnnualReturn || 7)))}%`),
                        
                        warnings.extremeInputs.longTimeHorizon && createElement('li', {
                            key: 'long-horizon'
                        }, language === 'he' ? `אופק זמן ארוך: ${projections.yearsToRetirement} שנים` : 
                            `Long time horizon: ${projections.yearsToRetirement} years`),
                        
                        warnings.extremeInputs.highSavingsRate && createElement('li', {
                            key: 'high-rate'
                        }, language === 'he' ? 'שיעור חיסכון גבוה מאוד (15%+)' : 
                            'Very high savings rate (15%+)')
                    ].filter(Boolean))
                ]),
                
                // Input diagnostics dashboard
                createElement('div', {
                    key: 'input-diagnostics',
                    className: `mt-3 p-3 bg-gray-50 rounded border border-gray-200`
                }, [
                    createElement('div', {
                        key: 'diagnostics-header',
                        className: "flex items-center mb-2"
                    }, [
                        createElement('span', { key: 'diagnostics-icon', className: "mr-2" }, '🔍'),
                        createElement('span', {
                            key: 'diagnostics-title',
                            className: "font-medium text-gray-800 text-sm"
                        }, language === 'he' ? 'אבחון נתונים:' : 'Input Diagnostics:')
                    ]),
                    
                    createElement('div', {
                        key: 'diagnostics-grid',
                        className: "grid grid-cols-2 gap-3 text-xs"
                    }, [
                        // Expected return diagnostic
                        createElement('div', {
                            key: 'return-diagnostic',
                            className: `p-2 rounded border ${warnings.extremeInputs.veryHighExpectedReturn ? 'bg-red-50 border-red-200' : 
                                      warnings.extremeInputs.highExpectedReturn ? 'bg-yellow-50 border-yellow-200' : 
                                      'bg-green-50 border-green-200'}`
                        }, [
                            createElement('div', { key: 'return-label', className: "font-medium" }, 
                                language === 'he' ? 'תשואה צפויה:' : 'Expected Return:'),
                            createElement('div', { key: 'return-value' }, 
                                `${projections.calculationDetails.originalExpectedReturn.toFixed(1)}%`),
                            createElement('div', { 
                                key: 'return-status',
                                className: `text-xs ${warnings.extremeInputs.veryHighExpectedReturn ? 'text-red-600' : 
                                           warnings.extremeInputs.highExpectedReturn ? 'text-yellow-600' : 
                                           'text-green-600'}`
                            }, warnings.extremeInputs.veryHighExpectedReturn ? 
                                (language === 'he' ? 'גבוה מאוד' : 'Very High') :
                                warnings.extremeInputs.highExpectedReturn ? 
                                (language === 'he' ? 'גבוה' : 'High') :
                                (language === 'he' ? 'סביר' : 'Reasonable'))
                        ]),
                        
                        // Time horizon diagnostic
                        createElement('div', {
                            key: 'horizon-diagnostic',
                            className: `p-2 rounded border ${warnings.extremeInputs.extremeTimeHorizon ? 'bg-red-50 border-red-200' : 
                                      warnings.extremeInputs.longTimeHorizon ? 'bg-yellow-50 border-yellow-200' : 
                                      'bg-green-50 border-green-200'}`
                        }, [
                            createElement('div', { key: 'horizon-label', className: "font-medium" }, 
                                language === 'he' ? 'שנים לפרישה:' : 'Years to Retirement:'),
                            createElement('div', { key: 'horizon-value' }, 
                                `${projections.yearsToRetirement} ${language === 'he' ? 'שנים' : 'years'}`),
                            createElement('div', { 
                                key: 'horizon-status',
                                className: `text-xs ${warnings.extremeInputs.extremeTimeHorizon ? 'text-red-600' : 
                                           warnings.extremeInputs.longTimeHorizon ? 'text-yellow-600' : 
                                           'text-green-600'}`
                            }, warnings.extremeInputs.extremeTimeHorizon ? 
                                (language === 'he' ? 'ארוך מאוד' : 'Very Long') :
                                warnings.extremeInputs.longTimeHorizon ? 
                                (language === 'he' ? 'ארוך' : 'Long') :
                                (language === 'he' ? 'סביר' : 'Reasonable'))
                        ]),
                        
                        // Current savings diagnostic
                        createElement('div', {
                            key: 'savings-diagnostic',
                            className: `p-2 rounded border ${warnings.extremeInputs.highCurrentSavings ? 'bg-yellow-50 border-yellow-200' : 
                                      'bg-green-50 border-green-200'}`
                        }, [
                            createElement('div', { key: 'savings-label', className: "font-medium" }, 
                                language === 'he' ? 'חיסכון נוכחי:' : 'Current Savings:'),
                            createElement('div', { key: 'savings-value' }, 
                                `${currency}${Math.round(projections.currentSavings / 1000)}K`),
                            createElement('div', { 
                                key: 'savings-status',
                                className: `text-xs ${warnings.extremeInputs.highCurrentSavings ? 'text-yellow-600' : 'text-green-600'}`
                            }, warnings.extremeInputs.highCurrentSavings ? 
                                (language === 'he' ? 'גבוה' : 'High') :
                                (language === 'he' ? 'סביר' : 'Reasonable'))
                        ]),
                        
                        // Savings rate diagnostic
                        createElement('div', {
                            key: 'rate-diagnostic',
                            className: `p-2 rounded border ${warnings.extremeInputs.highSavingsRate ? 'bg-yellow-50 border-yellow-200' : 
                                      'bg-green-50 border-green-200'}`
                        }, [
                            createElement('div', { key: 'rate-label', className: "font-medium" }, 
                                language === 'he' ? 'שיעור חיסכון:' : 'Savings Rate:'),
                            createElement('div', { key: 'rate-value' }, 
                                `${((parseFloat(inputs.pensionContributionRate || 0) + parseFloat(inputs.trainingFundContributionRate || 0))).toFixed(1)}%`),
                            createElement('div', { 
                                key: 'rate-status',
                                className: `text-xs ${warnings.extremeInputs.highSavingsRate ? 'text-yellow-600' : 'text-green-600'}`
                            }, warnings.extremeInputs.highSavingsRate ? 
                                (language === 'he' ? 'גבוה' : 'High') :
                                (language === 'he' ? 'סביר' : 'Reasonable'))
                        ])
                    ])
                ]),
                
                // Overall risk assessment
                createElement('div', {
                    key: 'risk-assessment',
                    className: `mt-3 p-3 rounded border ${warnings.assumptionRiskLevel === 'high' ? 'bg-red-50 border-red-200' : 
                              warnings.assumptionRiskLevel === 'medium' ? 'bg-yellow-50 border-yellow-200' : 
                              'bg-green-50 border-green-200'}`
                }, [
                    createElement('div', {
                        key: 'risk-header',
                        className: "flex items-center mb-2"
                    }, [
                        createElement('span', { 
                            key: 'risk-icon', 
                            className: "mr-2" 
                        }, warnings.assumptionRiskLevel === 'high' ? '⚠️' : 
                           warnings.assumptionRiskLevel === 'medium' ? '📊' : '✅'),
                        createElement('span', {
                            key: 'risk-title',
                            className: `font-medium text-sm ${warnings.assumptionRiskLevel === 'high' ? 'text-red-800' : 
                                      warnings.assumptionRiskLevel === 'medium' ? 'text-yellow-800' : 
                                      'text-green-800'}`
                        }, language === 'he' ? 'הערכת סיכון כוללת:' : 'Overall Risk Assessment:')
                    ]),
                    createElement('div', {
                        key: 'risk-level',
                        className: `text-sm font-medium ${warnings.assumptionRiskLevel === 'high' ? 'text-red-700' : 
                                  warnings.assumptionRiskLevel === 'medium' ? 'text-yellow-700' : 
                                  'text-green-700'}`
                    }, warnings.assumptionRiskLevel === 'high' ? 
                        (language === 'he' ? 'סיכון גבוה - הנחות אופטימיות מאוד' : 'High Risk - Very optimistic assumptions') :
                        warnings.assumptionRiskLevel === 'medium' ? 
                        (language === 'he' ? 'סיכון בינוני - הנחות אגרסיביות' : 'Medium Risk - Aggressive assumptions') :
                        (language === 'he' ? 'סיכון נמוך - הנחות סבירות' : 'Low Risk - Reasonable assumptions'))
                ]),
                
                // Suggestion to review inputs
                createElement('div', {
                    key: 'suggestion',
                    className: `mt-3 p-3 bg-${warningColor}-50 rounded border border-${warningColor}-200`
                }, [
                    createElement('p', {
                        key: 'suggestion-text',
                        className: `text-${warningColor}-800 text-sm font-medium`
                    }, language === 'he' ? 
                        '💡 המלצה: עבור לצעדים הקודמים ובדוק את ההנחות שלך (תשואות צפויות, שיעורי הפקדה) לקבלת תוצאות ריאליות יותר.' :
                        '💡 Recommendation: Go back to previous steps and review your assumptions (expected returns, contribution rates) for more realistic projections.')
                ])
            ]),
            
            createElement('div', { key: 'projections-grid', className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" }, [
                createElement('div', { key: 'total-accumulation', className: "text-center" }, [
                    createElement('div', {
                        key: 'accumulation-value',
                        className: `text-2xl font-bold ${showWarnings ? 'text-orange-800' : 'text-blue-800'}`
                    }, `${currency}${Math.round(projections.totalAccumulation).toLocaleString()}`),
                    createElement('div', {
                        key: 'accumulation-label',
                        className: `text-sm ${showWarnings ? 'text-orange-600' : 'text-blue-600'}`
                    }, t.totalAccumulation),
                    // Show dampening indicator for extreme values
                    warnings.dampened && createElement('div', {
                        key: 'dampened-indicator',
                        className: "text-xs text-gray-500 mt-1"
                    }, language === 'he' ? '(מותאם)' : '(adjusted)')
                ]),
                
                createElement('div', { key: 'monthly-income', className: "text-center" }, [
                    createElement('div', {
                        key: 'monthly-value',
                        className: `text-2xl font-bold ${showWarnings ? 'text-orange-800' : 'text-green-800'}`
                    }, `${currency}${Math.round(projections.monthlyRetirementIncome).toLocaleString()}`),
                    createElement('div', {
                        key: 'monthly-label',
                        className: `text-sm ${showWarnings ? 'text-orange-600' : 'text-green-600'}`
                    }, t.monthlyRetirementIncome)
                ]),
                
                createElement('div', { key: 'inflation-adjusted-total', className: "text-center" }, [
                    createElement('div', {
                        key: 'adjusted-total-value',
                        className: "text-2xl font-bold text-purple-800"
                    }, `${currency}${Math.round(projections.inflationAdjustedTotal).toLocaleString()}`),
                    createElement('div', {
                        key: 'adjusted-total-label',
                        className: "text-sm text-purple-600"
                    }, `${t.totalAccumulation} (${t.inflationAdjusted})`)
                ]),
                
                createElement('div', { key: 'inflation-adjusted-monthly', className: "text-center" }, [
                    createElement('div', {
                        key: 'adjusted-monthly-value',
                        className: "text-2xl font-bold text-orange-800"
                    }, `${currency}${Math.round(projections.inflationAdjustedMonthly).toLocaleString()}`),
                    createElement('div', {
                        key: 'adjusted-monthly-label',
                        className: "text-sm text-orange-600"
                    }, `${t.monthlyRetirementIncome} (${t.inflationAdjusted})`)
                ])
            ]),
            
            // Year-by-year projection chart
            createElement('div', {
                key: 'projection-chart',
                className: "mt-6 border-t border-blue-200 pt-6"
            }, [
                createElement('div', {
                    key: 'chart-header',
                    className: "flex items-center justify-between mb-4"
                }, [
                    createElement('h4', {
                        key: 'chart-title',
                        className: "text-lg font-semibold text-blue-800"
                    }, language === 'he' ? 'תחזית שנתית מפורטת' : 'Year-by-Year Projection'),
                    
                    createElement('div', {
                        key: 'chart-controls',
                        className: "flex items-center space-x-3"
                    }, [
                        // Info about nominal vs real
                        createElement('div', {
                            key: 'info-icon',
                            className: "relative group"
                        }, [
                            createElement('span', {
                                key: 'icon',
                                className: "text-gray-400 hover:text-gray-600 cursor-help"
                            }, 'ℹ️'),
                            createElement('div', {
                                key: 'tooltip',
                                className: "absolute right-0 top-6 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg hidden group-hover:block z-10"
                            }, [
                                createElement('div', { key: 'nominal-info', className: "mb-2" }, 
                                    language === 'he' ? 
                                    '💰 נומינלי: ערכים עתידיים ללא התאמה לאינפלציה' : 
                                    '💰 Nominal: Future values without inflation adjustment'),
                                createElement('div', { key: 'real-info' }, 
                                    language === 'he' ? 
                                    '📊 ריאלי: ערכים מותאמים לאינפלציה (כוח קנייה של היום)' : 
                                    '📊 Real: Inflation-adjusted values (today\'s purchasing power)')
                            ])
                        ]),
                        
                        createElement('button', {
                            key: 'toggle-nominal',
                            id: 'toggle-nominal',
                            className: "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200",
                            'data-active': 'true',
                            onClick: (e) => {
                                const button = e.currentTarget;
                                const isActive = button.getAttribute('data-active') === 'true';
                                const nominalLines = document.querySelectorAll('[data-line="nominal"]');
                                
                                nominalLines.forEach(line => {
                                    line.style.display = isActive ? 'none' : 'block';
                                });
                                
                                button.setAttribute('data-active', !isActive);
                                
                                // Update button styles
                                if (isActive) {
                                    button.className = "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 bg-gray-100 text-gray-400 border-gray-300";
                                    button.innerHTML = `<span style="text-decoration: line-through;">${language === 'he' ? 'נומינלי' : 'Nominal'}</span>`;
                                } else {
                                    button.className = "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200";
                                    button.innerHTML = language === 'he' ? 'נומינלי' : 'Nominal';
                                }
                            },
                            style: { backgroundColor: '#dbeafe', color: '#1d4ed8', borderColor: '#93c5fd' }
                        }, language === 'he' ? 'נומינלי' : 'Nominal'),
                        
                        createElement('button', {
                            key: 'toggle-real',
                            id: 'toggle-real',
                            className: "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200",
                            'data-active': 'true',
                            onClick: (e) => {
                                const button = e.currentTarget;
                                const isActive = button.getAttribute('data-active') === 'true';
                                const realLines = document.querySelectorAll('[data-line="real"]');
                                
                                realLines.forEach(line => {
                                    line.style.display = isActive ? 'none' : 'block';
                                });
                                
                                button.setAttribute('data-active', !isActive);
                                
                                // Update button styles
                                if (isActive) {
                                    button.className = "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 bg-gray-100 text-gray-400 border-gray-300";
                                    button.innerHTML = `<span style="text-decoration: line-through;">${language === 'he' ? 'ריאלי' : 'Real'}</span>`;
                                } else {
                                    button.className = "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200";
                                    button.innerHTML = language === 'he' ? 'ריאלי' : 'Real';
                                }
                            },
                            style: { backgroundColor: '#f3e8ff', color: '#6b21a8', borderColor: '#c084fc' }
                        }, language === 'he' ? 'ריאלי' : 'Real')
                    ])
                ]),
                
                // Generate chart using existing chart infrastructure
                window.generateRetirementProjectionChart && createElement('div', {
                    key: 'chart-container',
                    className: "bg-white rounded-lg border border-blue-200 p-4"
                }, [
                    renderRetirementProjectionChart(projections)
                ])
            ]),
            
            // Show calculation transparency toggle
            (warnings.isUnrealistic || warnings.exceedsReasonableLimit) && createElement('div', {
                key: 'calculation-details',
                className: "mt-6 border-t border-blue-200 pt-4"
            }, [
                createElement('button', {
                    key: 'toggle-details',
                    className: "text-blue-600 hover:text-blue-800 text-sm font-medium underline",
                    onClick: () => {
                        const detailsEl = document.getElementById('calculation-breakdown');
                        if (detailsEl) {
                            detailsEl.style.display = detailsEl.style.display === 'none' ? 'block' : 'none';
                        }
                    }
                }, language === 'he' ? 'הצג פירוט חישוב מפורט' : 'Show detailed calculation breakdown'),
                
                createElement('div', {
                    key: 'calculation-breakdown',
                    id: 'calculation-breakdown',
                    className: "mt-3 p-4 bg-blue-100 rounded-lg text-sm",
                    style: { display: 'none' }
                }, [
                    createElement('div', { key: 'breakdown-title', className: "font-semibold text-blue-800 mb-2" }, 
                        language === 'he' ? 'פירוט חישוב:' : 'Calculation Breakdown:'),
                    createElement('div', { key: 'raw-calculation', className: "text-blue-700 mb-1" }, 
                        `${language === 'he' ? 'תוצאה גולמית:' : 'Raw calculation:'} ${currency}${Math.round(warnings.rawTotal).toLocaleString()}`),
                    createElement('div', { key: 'adjusted-return', className: "text-blue-700 mb-1" }, 
                        `${language === 'he' ? 'תשואה מותאמת:' : 'Adjusted return:'} ${projections.calculationDetails.adjustedExpectedReturn.toFixed(2)}% (${language === 'he' ? 'מקורי:' : 'original:'} ${projections.calculationDetails.originalExpectedReturn.toFixed(2)}%)`),
                    createElement('div', { key: 'withdrawal-rate', className: "text-blue-700 mb-1" }, 
                        `${language === 'he' ? 'שיעור משיכה:' : 'Withdrawal rate:'} ${projections.calculationDetails.withdrawalRate.toFixed(2)}%`),
                    createElement('div', { key: 'dampening-info', className: "text-blue-700 mb-1" }, 
                        `${language === 'he' ? 'רמת הנחתה:' : 'Dampening level:'} ${warnings.dampeningLevel} ${warnings.dampened ? '(applied)' : '(none)'}`),
                    createElement('div', { key: 'final-result', className: "text-blue-700 font-medium" }, 
                        `${language === 'he' ? 'תוצאה סופית:' : 'Final result:'} ${currency}${Math.round(projections.totalAccumulation).toLocaleString()}`)
                ])
            ])
        ]);
    };

    // Render retirement projection chart
    const renderRetirementProjectionChart = (projections) => {
        if (!window.generateRetirementProjectionChart) {
            return createElement('div', {
                key: 'chart-loading',
                className: "text-center py-8 text-gray-500"
            }, language === 'he' ? 'טוען גרף...' : 'Loading chart...');
        }

        const chartData = window.generateRetirementProjectionChart(inputs);
        
        if (!chartData || chartData.length === 0) {
            return createElement('div', {
                key: 'chart-no-data',
                className: "text-center py-8 text-gray-500"
            }, language === 'he' ? 'אין נתונים לתצוגה' : 'No data to display');
        }

        // Create a simple line chart using SVG (fallback if Chart.js not available)
        const maxTotal = Math.max(...chartData.map(d => d.totalAccumulation));
        const maxMonthly = Math.max(...chartData.map(d => d.monthlyIncome));
        const chartWidth = 800;
        const chartHeight = 400;
        const margin = { top: 30, right: 100, bottom: 60, left: 100 };
        const innerWidth = chartWidth - margin.left - margin.right;
        const innerHeight = chartHeight - margin.top - margin.bottom;

        // Get min and max ages from chart data
        const minAge = Math.min(...chartData.map(d => d.age));
        const maxAge = Math.max(...chartData.map(d => d.age));
        
        // Calculate axis tick intervals
        const xTickInterval = 5; // Show age every 5 years
        const yTickCount = 6; // Number of Y-axis ticks
        
        // Format currency values for display
        const formatCurrency = (value) => {
            if (value >= 1000000) {
                return `${currency}${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
                return `${currency}${Math.round(value / 1000)}K`;
            }
            return `${currency}${Math.round(value)}`;
        };
        
        // Generate path data
        const createPath = (data, valueKey, maxValue) => {
            return data.map((point, index) => {
                const x = margin.left + (index / (data.length - 1)) * innerWidth;
                const y = margin.top + innerHeight - (point[valueKey] / maxValue) * innerHeight;
                return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
            }).join(' ');
        };

        const totalAccumulationPath = createPath(chartData, 'totalAccumulation', maxTotal);
        const inflationAdjustedPath = createPath(chartData, 'inflationAdjustedTotal', maxTotal);
        const monthlyIncomePath = createPath(chartData, 'monthlyIncome', maxMonthly);
        const inflationAdjustedMonthlyPath = createPath(chartData, 'inflationAdjustedMonthlyIncome', maxMonthly);

        // Find retirement year for vertical line
        const retirementPoint = chartData.find(d => d.isRetirementYear);
        const retirementIndex = chartData.findIndex(d => d.isRetirementYear);
        const retirementX = retirementIndex >= 0 ? 
            margin.left + (retirementIndex / (chartData.length - 1)) * innerWidth : null;

        // State for tooltip
        const [tooltipData, setTooltipData] = React.useState(null);
        const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
        
        // Find closest data point to mouse position
        const handleMouseMove = (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - margin.left;
            const y = e.clientY - rect.top;
            
            if (x >= 0 && x <= innerWidth && y >= 0 && y <= chartHeight) {
                const dataIndex = Math.round((x / innerWidth) * (chartData.length - 1));
                const dataPoint = chartData[Math.max(0, Math.min(dataIndex, chartData.length - 1))];
                
                setTooltipData(dataPoint);
                setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }
        };
        
        const handleMouseLeave = () => {
            setTooltipData(null);
        };
        
        return createElement('div', {
            key: 'chart-svg-container',
            className: "w-full overflow-x-auto relative",
            onMouseMove: handleMouseMove,
            onMouseLeave: handleMouseLeave
        }, [
            // Tooltip
            tooltipData && createElement('div', {
                key: 'tooltip',
                className: "absolute z-20 pointer-events-none",
                style: {
                    left: `${mousePosition.x + 10}px`,
                    top: `${mousePosition.y - 10}px`,
                    transform: mousePosition.x > chartWidth / 2 ? 'translateX(-100%)' : 'translateX(0)'
                }
            }, [
                createElement('div', {
                    key: 'tooltip-content',
                    className: "bg-gray-900 text-white p-3 rounded-lg shadow-xl text-xs min-w-[200px]"
                }, [
                    createElement('div', {
                        key: 'age',
                        className: "font-bold text-yellow-300 mb-2"
                    }, `${language === 'he' ? 'גיל' : 'Age'}: ${tooltipData.age}`),
                    
                    createElement('div', { key: 'divider1', className: "border-t border-gray-700 my-2" }),
                    
                    createElement('div', {
                        key: 'accumulation-nominal',
                        className: "flex justify-between mb-1",
                        'data-line': 'nominal'
                    }, [
                        createElement('span', { key: 'label' }, language === 'he' ? 'צבירה (נומינלי):' : 'Accumulation (Nominal):'),
                        createElement('span', { key: 'value', className: "font-medium text-blue-300" }, 
                            formatCurrency(tooltipData.totalAccumulation))
                    ]),
                    
                    createElement('div', {
                        key: 'accumulation-real',
                        className: "flex justify-between mb-1",
                        'data-line': 'real'
                    }, [
                        createElement('span', { key: 'label' }, language === 'he' ? 'צבירה (ריאלי):' : 'Accumulation (Real):'),
                        createElement('span', { key: 'value', className: "font-medium text-purple-300" }, 
                            formatCurrency(tooltipData.inflationAdjustedTotal))
                    ]),
                    
                    createElement('div', { key: 'divider2', className: "border-t border-gray-700 my-2" }),
                    
                    createElement('div', {
                        key: 'income-nominal',
                        className: "flex justify-between mb-1",
                        'data-line': 'nominal'
                    }, [
                        createElement('span', { key: 'label' }, language === 'he' ? 'הכנסה חודשית (נומינלי):' : 'Monthly Income (Nominal):'),
                        createElement('span', { key: 'value', className: "font-medium text-green-300" }, 
                            formatCurrency(tooltipData.monthlyIncome))
                    ]),
                    
                    createElement('div', {
                        key: 'income-real',
                        className: "flex justify-between",
                        'data-line': 'real'
                    }, [
                        createElement('span', { key: 'label' }, language === 'he' ? 'הכנסה חודשית (ריאלי):' : 'Monthly Income (Real):'),
                        createElement('span', { key: 'value', className: "font-medium text-red-300" }, 
                            formatCurrency(tooltipData.inflationAdjustedMonthlyIncome))
                    ])
                ])
            ]),
            
            createElement('svg', {
                key: 'projection-chart',
                width: chartWidth,
                height: chartHeight,
                viewBox: `0 0 ${chartWidth} ${chartHeight}`,
                className: "w-full h-auto"
            }, [
                // Background
                createElement('rect', {
                    key: 'background',
                    x: margin.left,
                    y: margin.top,
                    width: innerWidth,
                    height: innerHeight,
                    fill: '#fafafa',
                    stroke: '#e5e7eb',
                    strokeWidth: 1
                }),

                // Y-axis grid lines and labels
                ...Array.from({length: yTickCount}, (_, i) => {
                    const y = margin.top + (i / (yTickCount - 1)) * innerHeight;
                    const value = maxTotal * (1 - i / (yTickCount - 1));
                    return [
                        createElement('line', {
                            key: `grid-y-${i}`,
                            x1: margin.left,
                            y1: y,
                            x2: margin.left + innerWidth,  
                            y2: y,
                            stroke: '#e5e7eb',
                            strokeWidth: 0.5,
                            opacity: 0.5
                        }),
                        createElement('text', {
                            key: `y-label-${i}`,
                            x: margin.left - 10,
                            y: y + 4,
                            fill: '#6b7280',
                            fontSize: '11',
                            textAnchor: 'end'
                        }, formatCurrency(value))
                    ];
                }).flat(),
                
                // X-axis grid lines and labels (age)
                ...chartData.filter((_, index) => {
                    const age = chartData[index].age;
                    return age % xTickInterval === 0;
                }).map((point, _, filteredArray) => {
                    const index = chartData.findIndex(d => d.age === point.age);
                    const x = margin.left + (index / (chartData.length - 1)) * innerWidth;
                    return [
                        createElement('line', {
                            key: `grid-x-${point.age}`,
                            x1: x,
                            y1: margin.top,
                            x2: x,
                            y2: margin.top + innerHeight,
                            stroke: '#e5e7eb',
                            strokeWidth: 0.5,
                            opacity: 0.3
                        }),
                        createElement('text', {
                            key: `x-label-${point.age}`,
                            x: x,
                            y: margin.top + innerHeight + 20,
                            fill: '#6b7280',
                            fontSize: '11',
                            textAnchor: 'middle'
                        }, point.age)
                    ];
                }).flat(),

                // Retirement year line
                retirementX && createElement('line', {
                    key: 'retirement-line',
                    x1: retirementX,
                    y1: margin.top,
                    x2: retirementX,
                    y2: margin.top + innerHeight,
                    stroke: '#dc2626',
                    strokeWidth: 2,
                    strokeDasharray: '5,5'
                }),

                // Total accumulation (nominal)
                createElement('path', {
                    key: 'total-accumulation',
                    d: totalAccumulationPath,
                    fill: 'none',
                    stroke: '#2563eb',
                    strokeWidth: 3,
                    'data-line': 'nominal',
                    'data-chart-line': 'total-accumulation'
                }),

                // Inflation-adjusted total
                createElement('path', {
                    key: 'inflation-adjusted-total',
                    d: inflationAdjustedPath,
                    fill: 'none',
                    stroke: '#7c3aed',
                    strokeWidth: 3,
                    strokeDasharray: '8,4',
                    'data-line': 'real',
                    'data-chart-line': 'inflation-adjusted-total'
                }),

                // Monthly income (scaled to fit)
                createElement('path', {
                    key: 'monthly-income',
                    d: monthlyIncomePath,
                    fill: 'none',
                    stroke: '#059669',
                    strokeWidth: 2,
                    'data-line': 'nominal',
                    'data-chart-line': 'monthly-income'
                }),

                // Inflation-adjusted monthly
                createElement('path', {
                    key: 'inflation-adjusted-monthly',
                    d: inflationAdjustedMonthlyPath,
                    fill: 'none',
                    stroke: '#dc2626',
                    strokeWidth: 2,
                    strokeDasharray: '4,2',
                    'data-line': 'real',
                    'data-chart-line': 'inflation-adjusted-monthly'
                }),

                // Y-axis label
                createElement('text', {
                    key: 'y-axis-label',
                    x: 25,
                    y: margin.top + innerHeight / 2,
                    fill: '#374151',
                    fontSize: '14',
                    fontWeight: 'bold',
                    textAnchor: 'middle',
                    transform: `rotate(-90, 25, ${margin.top + innerHeight / 2})`
                }, language === 'he' ? `סכום ${currency}` : `${currency} Amount`),

                // X-axis label
                createElement('text', {
                    key: 'x-axis-label',
                    x: margin.left + innerWidth / 2,
                    y: chartHeight - 5,
                    fill: '#374151',
                    fontSize: '14',
                    fontWeight: 'bold',
                    textAnchor: 'middle'
                }, language === 'he' ? 'גיל' : 'Age'),

                // Retirement marker
                retirementX && createElement('text', {
                    key: 'retirement-marker',
                    x: retirementX,
                    y: margin.top - 5,
                    fill: '#dc2626',
                    fontSize: '11',
                    textAnchor: 'middle',
                    fontWeight: 'bold'
                }, language === 'he' ? 'פרישה' : 'Retirement')
            ]),

            // Legend
            createElement('div', {
                key: 'chart-legend',
                className: "mt-4 flex flex-wrap justify-center gap-4 text-sm"
            }, [
                createElement('div', {
                    key: 'legend-total',
                    className: "flex items-center cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors",
                    'data-line': 'nominal',
                    'data-line-id': 'total-accumulation',
                    onClick: (e) => {
                        const lineId = 'total-accumulation';
                        const line = document.querySelector(`[data-chart-line="${lineId}"]`);
                        const legendItem = e.currentTarget;
                        const isHidden = line?.style.display === 'none';
                        
                        if (line) {
                            line.style.display = isHidden ? 'block' : 'none';
                        }
                        
                        // Update legend item style
                        legendItem.style.opacity = isHidden ? '1' : '0.4';
                    }
                }, [
                    createElement('div', { 
                        key: 'legend-total-line',
                        className: "w-6 h-0.5 bg-blue-600 mr-2"
                    }),
                    createElement('span', { key: 'legend-total-text' }, 
                        language === 'he' ? 'צבירה כוללת (נומינלי)' : 'Total Accumulation (Nominal)')
                ]),
                createElement('div', {
                    key: 'legend-adjusted-total',
                    className: "flex items-center cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors",
                    'data-line': 'real',
                    'data-line-id': 'inflation-adjusted-total',
                    onClick: (e) => {
                        const lineId = 'inflation-adjusted-total';
                        const line = document.querySelector(`[data-chart-line="${lineId}"]`);
                        const legendItem = e.currentTarget;
                        const isHidden = line?.style.display === 'none';
                        
                        if (line) {
                            line.style.display = isHidden ? 'block' : 'none';
                        }
                        
                        // Update legend item style
                        legendItem.style.opacity = isHidden ? '1' : '0.4';
                    }
                }, [
                    createElement('div', { 
                        key: 'legend-adjusted-line',
                        className: "w-6 h-0.5 bg-purple-600 mr-2",
                        style: { borderTop: '2px dashed' }
                    }),
                    createElement('span', { key: 'legend-adjusted-text' }, 
                        language === 'he' ? 'צבירה כוללת (ריאלי)' : 'Total Accumulation (Real)')
                ]),
                createElement('div', {
                    key: 'legend-monthly',
                    className: "flex items-center cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors",
                    'data-line': 'nominal',
                    'data-line-id': 'monthly-income',
                    onClick: (e) => {
                        const lineId = 'monthly-income';
                        const line = document.querySelector(`[data-chart-line="${lineId}"]`);
                        const legendItem = e.currentTarget;
                        const isHidden = line?.style.display === 'none';
                        
                        if (line) {
                            line.style.display = isHidden ? 'block' : 'none';
                        }
                        
                        // Update legend item style
                        legendItem.style.opacity = isHidden ? '1' : '0.4';
                    }
                }, [
                    createElement('div', { 
                        key: 'legend-monthly-line',
                        className: "w-6 h-0.5 bg-green-600 mr-2"
                    }),
                    createElement('span', { key: 'legend-monthly-text' }, 
                        language === 'he' ? 'הכנסה חודשית (נומינלי)' : 'Monthly Income (Nominal)')
                ]),
                createElement('div', {
                    key: 'legend-adjusted-monthly',
                    className: "flex items-center cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors",
                    'data-line': 'real',
                    'data-line-id': 'inflation-adjusted-monthly',
                    onClick: (e) => {
                        const lineId = 'inflation-adjusted-monthly';
                        const line = document.querySelector(`[data-chart-line="${lineId}"]`);
                        const legendItem = e.currentTarget;
                        const isHidden = line?.style.display === 'none';
                        
                        if (line) {
                            line.style.display = isHidden ? 'block' : 'none';
                        }
                        
                        // Update legend item style
                        legendItem.style.opacity = isHidden ? '1' : '0.4';
                    }
                }, [
                    createElement('div', { 
                        key: 'legend-adjusted-monthly-line',
                        className: "w-6 h-0.5 bg-red-600 mr-2",
                        style: { borderTop: '2px dashed' }
                    }),
                    createElement('span', { key: 'legend-adjusted-monthly-text' }, 
                        language === 'he' ? 'הכנסה חודשית (ריאלי)' : 'Monthly Income (Real)')
                ])
            ])
        ]);
    };

    // Render expense analysis
    const renderExpenseAnalysis = () => {
        // Check if expense data exists
        if (!inputs.expenses || !window.analyzeExpenseRatios) {
            return null;
        }

        const monthlyIncome = parseFloat(inputs.currentMonthlySalary || 0) + 
                             parseFloat(inputs.partner1Salary || 0) + 
                             parseFloat(inputs.partner2Salary || 0);
        
        const expenseAnalysis = window.analyzeExpenseRatios(inputs.expenses, monthlyIncome, language);
        const expenseBreakdown = window.calculateExpenseBreakdown(inputs.expenses);
        const savingsPotential = window.calculateSavingsPotential(inputs.expenses, monthlyIncome);
        
        // Category colors
        const categoryColors = {
            housing: '#3B82F6',      // blue
            transportation: '#10B981', // green
            food: '#F59E0B',         // yellow
            insurance: '#EF4444',    // red
            other: '#8B5CF6'         // purple
        };
        
        // Category icons
        const categoryIcons = {
            housing: '🏠',
            transportation: '🚗',
            food: '🛒',
            insurance: '🏥',
            other: '💳'
        };
        
        // Category labels
        const categoryLabels = language === 'he' ? {
            housing: 'דיור',
            transportation: 'תחבורה',
            food: 'מזון',
            insurance: 'ביטוח ובריאות',
            other: 'אחר'
        } : {
            housing: 'Housing',
            transportation: 'Transportation',
            food: 'Food',
            insurance: 'Insurance',
            other: 'Other'
        };

        return createElement('div', {
            key: 'expense-analysis',
            className: "bg-white rounded-xl p-6 border border-gray-200 mb-8"
        }, [
            createElement('h3', {
                key: 'expense-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '💰'),
                language === 'he' ? 'ניתוח הוצאות' : 'Expense Analysis'
            ]),
            
            // Expense breakdown chart
            createElement('div', { 
                key: 'expense-breakdown',
                className: "mb-6"
            }, [
                createElement('h4', {
                    key: 'breakdown-title',
                    className: "text-sm font-medium text-gray-600 mb-3"
                }, language === 'he' ? 'פילוח הוצאות חודשיות' : 'Monthly Expense Breakdown'),
                
                createElement('div', {
                    key: 'expense-bars',
                    className: "space-y-3"
                }, Object.keys(categoryLabels).map(category => {
                    const amount = parseFloat(inputs.expenses[category] || 0);
                    const percentage = expenseBreakdown[category] || 0;
                    const analysis = expenseAnalysis.analysis[category];
                    
                    return createElement('div', {
                        key: `expense-${category}`,
                        className: "flex items-center"
                    }, [
                        createElement('div', {
                            key: 'icon',
                            className: "w-8 text-center mr-3"
                        }, categoryIcons[category]),
                        
                        createElement('div', {
                            key: 'bar-container',
                            className: "flex-1"
                        }, [
                            createElement('div', {
                                key: 'label-row',
                                className: "flex justify-between text-sm mb-1"
                            }, [
                                createElement('span', { 
                                    key: 'label',
                                    className: "font-medium text-gray-700"
                                }, categoryLabels[category]),
                                createElement('span', { 
                                    key: 'amount',
                                    className: "text-gray-600"
                                }, `${workingCurrency}${amount.toLocaleString()} (${percentage.toFixed(1)}%)`)
                            ]),
                            
                            createElement('div', {
                                key: 'progress-bar',
                                className: "w-full bg-gray-200 rounded-full h-2"
                            }, [
                                createElement('div', {
                                    key: 'progress-fill',
                                    className: "h-2 rounded-full transition-all duration-300",
                                    style: {
                                        width: `${percentage}%`,
                                        backgroundColor: categoryColors[category]
                                    }
                                })
                            ])
                        ]),
                        
                        // Status indicator
                        analysis && createElement('div', {
                            key: 'status',
                            className: `ml-3 w-6 h-6 rounded-full flex items-center justify-center ${
                                analysis.status === 'good' ? 'bg-green-100' : 
                                analysis.status === 'acceptable' ? 'bg-yellow-100' : 'bg-red-100'
                            }`
                        }, analysis.status === 'good' ? '✓' : 
                           analysis.status === 'acceptable' ? '!' : '×')
                    ]);
                }))
            ]),
            
            // Savings analysis
            createElement('div', {
                key: 'savings-analysis',
                className: "bg-gray-50 rounded-lg p-4 mb-4"
            }, [
                createElement('div', {
                    key: 'savings-header',
                    className: "flex justify-between items-center mb-2"
                }, [
                    createElement('h4', {
                        key: 'savings-title',
                        className: "text-sm font-medium text-gray-700"
                    }, language === 'he' ? 'ניתוח חיסכון' : 'Savings Analysis'),
                    createElement('span', {
                        key: 'savings-rate',
                        className: `text-lg font-bold ${
                            expenseAnalysis.savingsRate >= 20 ? 'text-green-600' :
                            expenseAnalysis.savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'
                        }`
                    }, `${expenseAnalysis.savingsRate.toFixed(1)}%`)
                ]),
                
                createElement('p', {
                    key: 'savings-info',
                    className: "text-sm text-gray-600"
                }, language === 'he' ? 
                    `אתה חוסך ${workingCurrency}${expenseAnalysis.analysis.savings.amount.toLocaleString()} מתוך ${workingCurrency}${monthlyIncome.toLocaleString()} הכנסה חודשית` :
                    `You save ${workingCurrency}${expenseAnalysis.analysis.savings.amount.toLocaleString()} out of ${workingCurrency}${monthlyIncome.toLocaleString()} monthly income`)
            ]),
            
            // Expense recommendations
            expenseAnalysis.recommendations.length > 0 && createElement('div', {
                key: 'expense-recommendations',
                className: "space-y-2"
            }, [
                createElement('h4', {
                    key: 'recommendations-title',
                    className: "text-sm font-medium text-gray-700 mb-2"
                }, language === 'he' ? 'המלצות להוצאות' : 'Expense Recommendations'),
                
                ...expenseAnalysis.recommendations.map((rec, index) => 
                    createElement('div', {
                        key: `recommendation-${index}`,
                        className: `p-3 rounded-lg border ${
                            rec.type === 'critical' ? 'bg-red-50 border-red-200' : 
                            rec.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 
                            'bg-blue-50 border-blue-200'
                        }`
                    }, [
                        createElement('p', {
                            key: 'rec-message',
                            className: `text-sm ${
                                rec.type === 'critical' ? 'text-red-700' : 
                                rec.type === 'warning' ? 'text-yellow-700' : 
                                'text-blue-700'
                            }`
                        }, rec.message)
                    ])
                )
            ]),
            
            // Savings potential
            savingsPotential.total > 0 && createElement('div', {
                key: 'savings-potential',
                className: "mt-4 p-4 bg-green-50 rounded-lg border border-green-200"
            }, [
                createElement('h4', {
                    key: 'potential-title',
                    className: "text-sm font-medium text-green-800 mb-2"
                }, language === 'he' ? 'פוטנציאל חיסכון' : 'Savings Potential'),
                createElement('p', {
                    key: 'potential-amount',
                    className: "text-sm text-green-700"
                }, language === 'he' ? 
                    `על ידי אופטימיזציה של ההוצאות שלך, תוכל לחסוך עוד ${workingCurrency}${Math.round(savingsPotential.total).toLocaleString()} בחודש (${savingsPotential.additionalSavingsRate.toFixed(1)}% נוספים)` :
                    `By optimizing your expenses, you could save an additional ${workingCurrency}${Math.round(savingsPotential.total).toLocaleString()} per month (${savingsPotential.additionalSavingsRate.toFixed(1)}% more)`)
            ])
        ]);
    };

    // Render action items
    const renderActionItems = () => {
        const actions = generateActionItems();
        
        return createElement('div', {
            key: 'action-items',
            className: "space-y-6"
        }, [
            createElement('h3', {
                key: 'actions-title',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '✅'),
                t.actionItems
            ]),
            
            createElement('div', { key: 'actions-grid', className: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, [
                // Immediate Actions
                createElement('div', {
                    key: 'immediate-actions',
                    className: "bg-red-50 rounded-xl p-6 border border-red-200"
                }, [
                    createElement('h4', {
                        key: 'immediate-title',
                        className: "text-lg font-semibold text-red-700 mb-4"
                    }, t.immediateActions),
                    createElement('ul', { key: 'immediate-list', className: "space-y-2" }, 
                        actions.immediate.map((action, index) => 
                            createElement('li', { 
                                key: `immediate-${index}`,
                                className: "flex items-start text-red-600 text-sm"
                            }, [
                                createElement('span', { key: 'bullet', className: "mr-2 mt-1" }, '•'),
                                createElement('span', { key: 'text' }, action)
                            ])
                        )
                    )
                ]),
                
                // Short-Term Goals
                createElement('div', {
                    key: 'short-term-goals',
                    className: "bg-yellow-50 rounded-xl p-6 border border-yellow-200"
                }, [
                    createElement('h4', {
                        key: 'short-term-title',
                        className: "text-lg font-semibold text-yellow-700 mb-4"
                    }, t.shortTermGoals),
                    createElement('ul', { key: 'short-term-list', className: "space-y-2" }, 
                        actions.shortTerm.map((action, index) => 
                            createElement('li', { 
                                key: `short-term-${index}`,
                                className: "flex items-start text-yellow-600 text-sm"
                            }, [
                                createElement('span', { key: 'bullet', className: "mr-2 mt-1" }, '•'),
                                createElement('span', { key: 'text' }, action)
                            ])
                        )
                    )
                ]),
                
                // Long-Term Strategy
                createElement('div', {
                    key: 'long-term-strategy',
                    className: "bg-green-50 rounded-xl p-6 border border-green-200"
                }, [
                    createElement('h4', {
                        key: 'long-term-title',
                        className: "text-lg font-semibold text-green-700 mb-4"
                    }, t.longTermStrategy),
                    createElement('ul', { key: 'long-term-list', className: "space-y-2" }, 
                        actions.longTerm.map((action, index) => 
                            createElement('li', { 
                                key: `long-term-${index}`,
                                className: "flex items-start text-green-600 text-sm"
                            }, [
                                createElement('span', { key: 'bullet', className: "mr-2 mt-1" }, '•'),
                                createElement('span', { key: 'text' }, action)
                            ])
                        )
                    )
                ])
            ])
        ]);
    };

    // Interactive features removed as they were non-functional

    return createElement('div', { className: "space-y-8" }, [
        // Title
        createElement('div', { key: 'title-section' }, [
            createElement('h3', {
                key: 'main-title',
                className: "text-2xl font-bold text-gray-800 mb-4 flex items-center"
            }, [
                createElement('span', { key: 'icon', className: "mr-3 text-3xl" }, '📋'),
                t.title
            ]),
            createElement('p', {
                key: 'subtitle',
                className: "text-gray-600 text-lg"
            }, t.subtitle)
        ]),

        // Financial Health Score
        renderFinancialHealthScore(),

        // Couple Compatibility
        renderCoupleCompatibility(),

        // Retirement Projections
        renderRetirementProjections(),

        // Expense Analysis
        renderExpenseAnalysis(),

        // Action Items
        renderActionItems(),

        // Information panel
        createElement('div', {
            key: 'info-panel',
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
        }, [
            createElement('div', { key: 'info-icon', className: "text-2xl mb-2" }, 'ℹ️'),
            createElement('h4', {
                key: 'info-title',
                className: "text-lg font-semibold text-blue-700 mb-2"
            }, language === 'he' ? 'מידע חשוב' : 'Important Information'),
            createElement('p', {
                key: 'info-text',
                className: "text-blue-700 text-sm"
            }, t.info)
        ])
    ]);
};

// Export the component
window.WizardStepReview = WizardStepReview;

// Export calculation functions for global access
window.calculateTotalCurrentSavings = (inputs) => {
    let total = 0;
    // Individual savings
    total += parseFloat(inputs.currentSavings || 0);
    total += parseFloat(inputs.currentTrainingFund || 0);
    total += parseFloat(inputs.currentPersonalPortfolio || 0);
    total += parseFloat(inputs.currentRealEstate || 0);
    total += parseFloat(inputs.currentCrypto || 0);
    total += parseFloat(inputs.currentSavingsAccount || 0);
    
    // Partner savings if couple mode
    if (inputs.planningType === 'couple') {
        total += parseFloat(inputs.partner1CurrentPension || 0);
        total += parseFloat(inputs.partner1CurrentTrainingFund || 0);
        total += parseFloat(inputs.partner1PersonalPortfolio || 0);
        total += parseFloat(inputs.partner1RealEstate || 0);
        total += parseFloat(inputs.partner1Crypto || 0);
        total += parseFloat(inputs.partner2CurrentPension || 0);
        total += parseFloat(inputs.partner2CurrentTrainingFund || 0);
        total += parseFloat(inputs.partner2PersonalPortfolio || 0);
        total += parseFloat(inputs.partner2RealEstate || 0);
        total += parseFloat(inputs.partner2Crypto || 0);
    }
    
    return total;
};

window.calculateTaxEfficiencyScore = (inputs, selectedCountry = 'israel') => {
    const pensionRate = parseFloat(inputs.pensionContributionRate || 0);
    const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || 0);
    
    // Validate inputs to prevent NaN
    if (isNaN(pensionRate)) return 0;
    
    // Israel-specific optimization
    if (selectedCountry === 'israel') {
        const optimalPensionRate = 7; // 7% is deductible
        const optimalTrainingFundRate = 10; // Up to threshold
        
        const pensionEfficiency = optimalPensionRate > 0 ? Math.min(100, (pensionRate / optimalPensionRate) * 100) : 0;
        const trainingFundEfficiency = optimalTrainingFundRate > 0 ? Math.min(100, (trainingFundRate / optimalTrainingFundRate) * 100) : 0;
        
        const score = (pensionEfficiency + trainingFundEfficiency) / 2;
        return isNaN(score) ? 0 : Math.round(score);
    }
    
    // General tax efficiency for other countries
    const score = pensionRate > 0 ? Math.min(100, (pensionRate / 12) * 100) : 0;
    return isNaN(score) ? 0 : Math.round(score);
};

window.calculateSavingsRateScore = (inputs) => {
    const monthlyIncome = parseFloat(inputs.currentMonthlySalary || inputs.currentSalary || 0);
    const pensionRate = parseFloat(inputs.pensionContributionRate || inputs.employeePensionRate || 0);
    const trainingFundRate = parseFloat(inputs.trainingFundContributionRate || inputs.trainingFundEmployeeRate || 0);
    const totalSavingsRate = pensionRate + trainingFundRate;
    
    if (totalSavingsRate >= 15) return 100;
    if (totalSavingsRate >= 12) return 85;
    if (totalSavingsRate >= 10) return 70;
    if (totalSavingsRate >= 7) return 55;
    return Math.max(0, totalSavingsRate * 5);
};

console.log('✅ WizardStepReview component loaded successfully');