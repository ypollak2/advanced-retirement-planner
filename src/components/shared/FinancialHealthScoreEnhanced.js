// Enhanced Financial Health Score Component with tooltips and improvements
// Created by Yali Pollak (יהלי פולק) - v6.6.5

(function() {
    'use strict';

    const FinancialHealthScoreEnhanced = ({ inputs, setInputs, language = 'en' }) => {
        const { createElement, useState, useEffect, useCallback } = React;
        
        // State for missing data modal, debug panel, and real-time updates
        const [isMissingDataModalOpen, setIsMissingDataModalOpen] = useState(false);
        const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);
        const [isRecalculating, setIsRecalculating] = useState(false);
        const [lastCalculationTime, setLastCalculationTime] = useState(Date.now());
        
        // Debounced recalculation state
        const [debouncedInputs, setDebouncedInputs] = useState(inputs);
        
        // Translations
        const content = {
            en: {
                financialHealthScore: 'Financial Health Score',
                whatIsThis: 'What is the Financial Health Score?',
                scoreExplanation: 'The score evaluates your overall financial wellness based on several important factors. A higher score indicates better retirement readiness and financial stability.',
                scoreComposition: 'The score consists of: Savings Rate, Retirement Readiness, Risk Alignment, Tax Efficiency, and Diversification.',
                viewDetails: 'View Details',
                scoreBreakdown: 'Score Calculation Breakdown',
                formulaInfo: 'The total score is calculated as a weighted average of all factors below:',
                excellent: 'Excellent',
                good: 'Good',
                needsImprovement: 'Needs Improvement',
                critical: 'Critical',
                savingsRateScore: 'Savings Rate',
                retirementReadiness: 'Retirement Readiness',
                riskAlignment: 'Risk Alignment',
                taxEfficiency: 'Tax Efficiency',
                diversification: 'Diversification',
                emergencyFund: 'Emergency Fund',
                debtManagement: 'Debt Management',
                timeToRetirement: 'Time to Retirement',
                improvementSuggestions: 'Ways to Improve Your Score:',
                currentRate: 'Current rate',
                currentEfficiency: 'Current efficiency',
                yearsRemaining: 'Years remaining',
                assetClasses: 'Asset classes',
                monthsCovered: 'Months covered',
                debtRatio: 'Debt-to-income',
                // Tooltips
                savingsRateTooltip: 'Percentage of income saved monthly. Target: 15% or higher.',
                retirementReadinessTooltip: 'Projected ability to meet retirement income goals.',
                riskAlignmentTooltip: 'Portfolio volatility vs. your risk preference.',
                taxEfficiencyTooltip: 'Use of tax-advantaged accounts and deductions.',
                diversificationTooltip: 'Spread across asset classes, regions, and sectors.',
                emergencyFundTooltip: 'Liquid savings for unexpected expenses. Target: 6 months.',
                debtManagementTooltip: 'Managing debt levels for financial flexibility.',
                timeHorizonTooltip: 'Years until retirement affects investment strategy.',
                // Debug messages
                missingData: 'Missing data',
                checkInputs: 'Please check your inputs',
                whyZeroScore: 'Why is this score 0?',
                debugPanel: 'Debug Panel',
                openDebug: 'Open Debug Analysis',
                noIncomeFound: 'No monthly income data found',
                noContributionsFound: 'No contribution rates found',
                addSalaryData: 'Add salary information in Step 2',
                addContributionData: 'Add contribution rates in Step 4',
                quickFix: 'Quick Fix',
                goToStep: 'Go to Step',
                fillMissingData: 'Fill Missing Data',
                dataCompleteness: 'Data Completeness'
            },
            he: {
                financialHealthScore: 'ציון הבריאות הפיננסית',
                whatIsThis: 'מה זה ציון הבריאות הפיננסית?',
                scoreExplanation: 'הציון מעריך את מצבך הפיננסי הכולל על סמך מספר גורמים חשובים. ציון גבוה יותר מצביע על מוכנות טובה יותר לפרישה ויציבות פיננסית.',
                scoreComposition: 'הציון מורכב מ: שיעור חיסכון, מוכנות לפרישה, התאמת סיכון, יעילות מס, ופיזור השקעות.',
                viewDetails: 'הצג פירוט מלא',
                scoreBreakdown: 'פירוט חישוב הציון',
                formulaInfo: 'הציון הכולל מחושב כממוצע משוקלל של כל הגורמים להלן:',
                excellent: 'מצוין',
                good: 'טוב',
                needsImprovement: 'דורש שיפור',
                critical: 'קריטי',
                savingsRateScore: 'שיעור חיסכון',
                retirementReadiness: 'מוכנות לפרישה',
                riskAlignment: 'התאמת סיכון',
                taxEfficiency: 'יעילות מס',
                diversification: 'פיזור השקעות',
                emergencyFund: 'קרן חירום',
                debtManagement: 'ניהול חובות',
                timeToRetirement: 'זמן לפרישה',
                improvementSuggestions: 'דרכים לשיפור הציון שלך:',
                currentRate: 'שיעור נוכחי',
                currentEfficiency: 'יעילות נוכחית',
                yearsRemaining: 'שנים נותרות',
                assetClasses: 'סוגי נכסים',
                monthsCovered: 'חודשים מכוסים',
                debtRatio: 'חוב להכנסה',
                // Tooltips
                savingsRateTooltip: 'אחוז מההכנסה שנחסך מדי חודש. יעד: 15% או יותר.',
                retirementReadinessTooltip: 'יכולת צפויה לעמוד ביעדי ההכנסה בפרישה.',
                riskAlignmentTooltip: 'תנודתיות התיק מול העדפת הסיכון שלך.',
                taxEfficiencyTooltip: 'שימוש בחשבונות חיסכון עם הטבות מס.',
                diversificationTooltip: 'פיזור בין סוגי נכסים, אזורים ומגזרים.',
                emergencyFundTooltip: 'חיסכון נזיל להוצאות בלתי צפויות. יעד: 6 חודשים.',
                debtManagementTooltip: 'ניהול רמות חוב לגמישות פיננסית.',
                timeHorizonTooltip: 'שנים עד פרישה משפיעות על אסטרטגיית ההשקעה.',
                // Debug messages
                missingData: 'חסרים נתונים',
                checkInputs: 'אנא בדוק את הנתונים שהזנת',
                whyZeroScore: 'למה הציון הזה 0?',
                noIncomeFound: 'לא נמצאו נתוני הכנסה חודשית',
                noContributionsFound: 'לא נמצאו שיעורי הפקדה',
                addSalaryData: 'הוסף מידע על שכר בשלב 2',
                addContributionData: 'הוסף שיעורי הפקדה בשלב 4',
                quickFix: 'תיקון מהיר',
                goToStep: 'עבור לשלב',
                fillMissingData: 'השלם נתונים חסרים',
                dataCompleteness: 'שלמות נתונים'
            }
        };

        const t = content[language] || content.en;
        
        // Debounced input update effect - prevents excessive recalculations
        useEffect(() => {
            const debounceTimer = setTimeout(() => {
                setDebouncedInputs(inputs);
                setIsRecalculating(false);
            }, 300); // 300ms debounce
            
            setIsRecalculating(true);
            
            return () => clearTimeout(debounceTimer);
        }, [inputs]);
        
        // Performance monitoring effect
        useEffect(() => {
            const startTime = Date.now();
            
            return () => {
                const calculationTime = Date.now() - startTime;
                setLastCalculationTime(calculationTime);
                
                if (calculationTime > 500) {
                    console.warn(`⚠️ Financial Health Score calculation took ${calculationTime}ms (> 500ms threshold)`);
                } else {
                    console.log(`✅ Financial Health Score calculated in ${calculationTime}ms`);
                }
            };
        }, [debouncedInputs]);
        
        // Memoized calculation function to prevent unnecessary recalculations
        const calculateHealthScore = useCallback(() => {
            if (!window.calculateFinancialHealthScore) {
                console.warn('❌ Financial Health Engine not available');
                return null;
            }
            
            const startTime = performance.now();
            
            // Use debounced inputs for calculation
            const processedInputs = debouncedInputs.planningType === 'couple' && window.getFieldValue ? 
                {
                    ...debouncedInputs,
                    currentSalary: window.getFieldValue(debouncedInputs, ['currentSalary'], { combinePartners: true }),
                    monthlyExpenses: window.getFieldValue(debouncedInputs, ['currentMonthlyExpenses'], { combinePartners: true }),
                    currentSavings: window.getFieldValue(debouncedInputs, ['currentSavings'], { combinePartners: true })
                } : debouncedInputs;
            
            const result = window.calculateFinancialHealthScore(processedInputs, { 
                combinePartners: debouncedInputs.planningType === 'couple',
                debugMode: true 
            });
            
            const endTime = performance.now();
            const calculationTime = Math.round(endTime - startTime);
            
            console.log(`🏥 Financial Health Score recalculated in ${calculationTime}ms`);
            
            return result;
        }, [debouncedInputs]);
        
        // Calculate health report using memoized function
        const healthReport = calculateHealthScore();
        
        // Calculate data completeness percentage
        const calculateDataCompleteness = useCallback(() => {
            if (!healthReport || !healthReport.factors) return 0;
            
            const totalFactors = Object.keys(healthReport.factors).length;
            const factorsWithData = Object.values(healthReport.factors).filter(f => f.score > 0).length;
            
            return totalFactors > 0 ? Math.round((factorsWithData / totalFactors) * 100) : 0;
        }, [healthReport]);
        
        const dataCompleteness = calculateDataCompleteness();

        // Use comprehensive Financial Health Engine with couple mode support
        // Calculation is now handled by the memoized calculateHealthScore function above

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

        // CRITICAL FIX: Add normalization function to convert factor scores to 0-100 scale
        const normalizeFactorScore = (factorScore, factorKey) => {
            if (!factorScore || typeof factorScore.score !== 'number') return 0;
            
            const maxWeight = window.SCORE_FACTORS?.[factorKey]?.weight || 25;
            const normalizedScore = Math.round((factorScore.score / maxWeight) * 100);
            
            // Ensure score is within 0-100 range
            return Math.max(0, Math.min(100, normalizedScore));
        };

        // Helper to render score factor with tooltip
        const renderScoreFactor = (factorKey, factorData, factorInfo) => {
            const rawScore = factorData?.score || 0;
            const normalizedScore = normalizeFactorScore(factorData, factorKey);
            const details = factorData?.details || {};
            const debugInfo = details?.debugInfo || {};
            const tooltipKey = factorKey + 'Tooltip';
            const tooltip = t[tooltipKey] || factorInfo?.description || '';
            
            let detailText = '';
            let debugText = '';
            
            switch(factorKey) {
                case 'savingsRate':
                    detailText = details.rate ? `${t.currentRate}: ${details.rate.toFixed(1)}%` : '';
                    if (rawScore === 0) {
                        if (details.status === 'missing_income_data') {
                            debugText = debugInfo.suggestion || `${t.noIncomeFound}. ${t.addSalaryData}`;
                        } else if (details.status === 'missing_contribution_data') {
                            debugText = debugInfo.suggestion || `${t.noContributionsFound}. ${t.addContributionData}`;
                        } else if (debugInfo.reason) {
                            debugText = debugInfo.reason;
                        }
                    }
                    break;
                case 'taxEfficiency':
                    detailText = details.efficiencyScore ? `${t.currentEfficiency}: ${details.efficiencyScore.toFixed(0)}%` : '';
                    if (rawScore === 0) {
                        if (details.status === 'missing_income_data') {
                            debugText = debugInfo.suggestion || `${t.noIncomeFound}. ${t.addSalaryData}`;
                        } else if (details.status === 'missing_contribution_data') {
                            debugText = debugInfo.suggestion || `${t.noContributionsFound}. ${t.addContributionData}`;
                        } else if (debugInfo.reason) {
                            debugText = debugInfo.reason;
                        }
                    }
                    break;
                case 'timeHorizon':
                    detailText = details.yearsToRetirement ? `${t.yearsRemaining}: ${details.yearsToRetirement}` : '';
                    break;
                case 'diversification':
                    detailText = details.assetClasses ? `${t.assetClasses}: ${details.assetClasses}` : '';
                    break;
                case 'emergencyFund':
                    detailText = details.months ? `${t.monthsCovered}: ${details.months.toFixed(1)}` : '';
                    break;
                case 'debtManagement':
                    detailText = details.ratio ? `${t.debtRatio}: ${(details.ratio * 100).toFixed(0)}%` : '';
                    break;
            }

            return createElement('div', { 
                key: factorKey, 
                className: "text-center relative group" 
            }, [
                createElement('div', {
                    key: 'score',
                    className: `text-2xl font-bold text-${getScoreColor(normalizedScore)}-600`
                }, `${normalizedScore}%`),
                createElement('div', {
                    key: 'label',
                    className: "text-sm text-gray-600 cursor-help flex items-center justify-center"
                }, [
                    createElement('span', { key: 'label-text' }, t[factorKey] || factorInfo?.name || factorKey),
                    normalizedScore === 0 && createElement('span', {
                        key: 'warning-icon',
                        className: "ml-1 text-red-500",
                        title: t.whyZeroScore
                    }, '❓')
                ]),
                
                // Tooltip
                createElement('div', {
                    key: 'tooltip',
                    className: "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50",
                    style: { pointerEvents: 'none' }
                }, [
                    createElement('div', {
                        key: 'tooltip-content',
                        className: "bg-gray-900 text-white p-3 rounded-lg shadow-xl text-xs w-48"
                    }, [
                        createElement('div', { 
                            key: 'tooltip-title', 
                            className: "font-semibold mb-1" 
                        }, t[factorKey] || factorInfo?.name),
                        createElement('div', { 
                            key: 'tooltip-desc',
                            className: "mb-2"
                        }, tooltip),
                        detailText && createElement('div', { 
                            key: 'tooltip-details', 
                            className: "text-xs opacity-80 mb-2" 
                        }, detailText),
                        
                        // Enhanced calculation explanation for non-zero scores
                        normalizedScore > 0 && createElement('div', {
                            key: 'calculation-explanation',
                            className: "text-xs bg-blue-600 bg-opacity-20 p-2 rounded mb-2"
                        }, [
                            createElement('div', { key: 'calc-title', className: "font-semibold mb-1" }, 
                                language === 'he' ? 'איך מחושב הציון:' : 'How this score is calculated:'),
                            factorKey === 'savingsRate' && details.rate && createElement('div', { key: 'calc-details' }, 
                                `${details.monthlyAmount ? Math.round(details.monthlyAmount).toLocaleString() : 0} ÷ ${details.monthlyIncome ? Math.round(details.monthlyIncome).toLocaleString() : 0} = ${details.rate.toFixed(1)}%`),
                            factorKey === 'taxEfficiency' && details.efficiencyScore && createElement('div', { key: 'calc-details' }, 
                                `${details.currentRate.toFixed(1)}% ÷ ${details.optimalRate}% × 100 = ${details.efficiencyScore.toFixed(0)}%`),
                            factorKey === 'diversification' && details.assetClasses && createElement('div', { key: 'calc-details' }, 
                                `${details.assetClasses} ${language === 'he' ? 'סוגי נכסים מזוהים' : 'asset classes identified'}`),
                            factorKey === 'emergencyFund' && details.months && createElement('div', { key: 'calc-details' }, 
                                `${details.currentAmount ? Math.round(details.currentAmount).toLocaleString() : 0} ÷ ${language === 'he' ? 'הוצאות חודשיות' : 'monthly expenses'} = ${details.months.toFixed(1)} ${language === 'he' ? 'חודשים' : 'months'}`)
                        ]),
                        
                        // Improvement suggestions for low scores
                        normalizedScore < 70 && normalizedScore > 0 && createElement('div', {
                            key: 'improvement-suggestion',
                            className: "text-xs bg-green-600 bg-opacity-20 p-2 rounded mb-2"
                        }, [
                            createElement('div', { key: 'improve-title', className: "font-semibold mb-1" }, 
                                language === 'he' ? 'להשיג ציון טוב יותר:' : 'To improve this score:'),
                            factorKey === 'savingsRate' && createElement('div', { key: 'improve-text' }, 
                                language === 'he' ? 
                                    `הגדל חיסכון ל-15% מההכנסה (₪${details.monthlyIncome ? Math.round(details.monthlyIncome * 0.15).toLocaleString() : 0} לחודש)` :
                                    `Increase savings to 15% of income (₪${details.monthlyIncome ? Math.round(details.monthlyIncome * 0.15).toLocaleString() : 0}/month)`),
                            factorKey === 'taxEfficiency' && createElement('div', { key: 'improve-text' }, 
                                language === 'he' ? 
                                    `הגדל הפקדות פנסיוניות ל-${details.optimalRate}% מההכנסה` :
                                    `Increase retirement contributions to ${details.optimalRate}% of income`),
                            factorKey === 'diversification' && createElement('div', { key: 'improve-text' }, 
                                language === 'he' ? 
                                    `הוסף ${Math.max(3 - (details.assetClasses || 0), 0)} סוגי נכסים נוספים` :
                                    `Add ${Math.max(3 - (details.assetClasses || 0), 0)} more asset class(es)`)
                        ]),
                        
                        debugText && createElement('div', { 
                            key: 'tooltip-debug', 
                            className: "text-xs bg-red-600 bg-opacity-20 p-2 rounded mt-2" 
                        }, [
                            createElement('span', { key: 'debug-icon', className: "mr-1" }, '⚠️'),
                            createElement('span', { key: 'debug-text' }, debugText)
                        ])
                    ]),
                    createElement('div', {
                        key: 'tooltip-arrow',
                        className: "absolute top-full left-1/2 transform -translate-x-1/2 -mt-1"
                    }, [
                        createElement('div', {
                            key: 'arrow-inner',
                            className: "w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
                        })
                    ])
                ])
            ]);
        };

        // Show loading state during recalculation
        if (isRecalculating) {
            return createElement('div', {
                className: "bg-white rounded-xl p-6 border border-gray-200 animate-pulse"
            }, [
                createElement('div', { key: 'loading-header', className: "flex items-center justify-center mb-4" }, [
                    createElement('div', { key: 'spinner', className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3" }),
                    createElement('span', { key: 'text', className: "text-gray-600" }, 
                        language === 'he' ? 'מחשב ציון בריאות פיננסית...' : 'Calculating financial health score...')
                ]),
                createElement('div', { key: 'loading-skeleton', className: "space-y-3" }, [
                    createElement('div', { key: 'skeleton-1', className: "h-4 bg-gray-200 rounded w-3/4" }),
                    createElement('div', { key: 'skeleton-2', className: "h-4 bg-gray-200 rounded w-1/2" }),
                    createElement('div', { key: 'skeleton-3', className: "h-4 bg-gray-200 rounded w-2/3" })
                ])
            ]);
        }
        
        if (!healthReport || healthReport.status === 'error') {
            return createElement('div', {
                className: "bg-red-50 rounded-lg p-4 text-red-700"
            }, language === 'he' ? 
                'שגיאה בחישוב ציון הבריאות הפיננסית. אנא ודא שכל השדות הנדרשים מולאו.' :
                'Error calculating financial health score. Please ensure all required fields are filled.');
        }

        return createElement('div', {
            className: "bg-white rounded-xl p-6 border border-gray-200"
        }, [
            // Header with info button
            createElement('h3', {
                key: 'header',
                className: "text-xl font-semibold text-gray-700 mb-6 flex items-center justify-between"
            }, [
                createElement('div', { key: 'title-section', className: "flex items-center" }, [
                    createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🏥'),
                    createElement('span', { key: 'title-text' }, t.financialHealthScore)
                ]),
                // Info button
                createElement('button', {
                    key: 'info-button',
                    className: "text-blue-500 hover:text-blue-700 transition-colors",
                    onClick: () => {
                        const helpPanel = document.getElementById('health-score-help');
                        if (helpPanel) {
                            helpPanel.style.display = helpPanel.style.display === 'none' ? 'block' : 'none';
                        }
                    },
                    title: t.whatIsThis
                }, [
                    createElement('svg', {
                        key: 'info-icon',
                        width: "20",
                        height: "20",
                        viewBox: "0 0 20 20",
                        fill: "currentColor"
                    }, [
                        createElement('path', {
                            key: 'info-path',
                            fillRule: "evenodd",
                            d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
                            clipRule: "evenodd"
                        })
                    ])
                ])
            ]),

            // Help panel (hidden by default)
            createElement('div', {
                key: 'help-panel',
                id: 'health-score-help',
                className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6",
                style: { display: 'none' }
            }, [
                createElement('h4', {
                    key: 'help-title',
                    className: "font-semibold text-blue-800 mb-2"
                }, t.whatIsThis),
                createElement('p', {
                    key: 'help-text',
                    className: "text-blue-700 text-sm mb-3"
                }, t.scoreExplanation),
                createElement('div', {
                    key: 'help-factors',
                    className: "text-sm text-blue-600"
                }, t.scoreComposition)
            ]),

            // Data Completeness Indicator
            createElement('div', {
                key: 'data-completeness',
                className: "bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200"
            }, [
                createElement('div', { key: 'completeness-header', className: "flex items-center justify-between mb-2" }, [
                    createElement('span', { key: 'title', className: "text-sm font-medium text-blue-800" }, 
                        `📊 ${t.dataCompleteness}`),
                    createElement('span', { key: 'percentage', className: "text-sm font-bold text-blue-900" }, 
                        `${dataCompleteness}%`)
                ]),
                createElement('div', { key: 'progress-bar', className: "w-full bg-blue-200 rounded-full h-2" }, [
                    createElement('div', {
                        key: 'progress-fill',
                        className: `bg-blue-600 h-2 rounded-full transition-all duration-500`,
                        style: { width: `${dataCompleteness}%` }
                    })
                ]),
                dataCompleteness < 100 && createElement('p', { 
                    key: 'completeness-tip', 
                    className: "text-xs text-blue-700 mt-2" 
                }, language === 'he' ? 
                    `השלמת ${100 - dataCompleteness}% נתונים נוספים תשפר את דיוק הציון` :
                    `Adding ${100 - dataCompleteness}% more data will improve score accuracy`)
            ]),
            
            // Overall score display
            createElement('div', {
                key: 'overall-score',
                className: `bg-${getScoreColor(healthReport.totalScore)}-50 rounded-lg p-6 border border-${getScoreColor(healthReport.totalScore)}-200 mb-6`
            }, [
                createElement('div', { key: 'score-display', className: "text-center" }, [
                    createElement('div', {
                        key: 'score-number',
                        className: `text-4xl font-bold text-${getScoreColor(healthReport.totalScore)}-800`
                    }, `${healthReport.totalScore}/100`),
                    createElement('div', {
                        key: 'score-label',
                        className: `text-lg font-medium text-${getScoreColor(healthReport.totalScore)}-700 mt-2`
                    }, getScoreLabel(healthReport.totalScore))
                ]),
                
                // View Details & Debug Buttons
                createElement('div', { key: 'details-button-container', className: "text-center mt-4 space-x-4" }, [
                    createElement('button', {
                        key: 'view-details',
                        className: "text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors",
                        onClick: () => {
                            const detailsPanel = document.getElementById('score-details-panel');
                            if (detailsPanel) {
                                detailsPanel.style.display = detailsPanel.style.display === 'none' ? 'block' : 'none';
                            }
                        }
                    }, t.viewDetails),
                    
                    // Debug Panel Button
                    createElement('button', {
                        key: 'debug-button',
                        className: "px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition-colors",
                        onClick: () => setIsDebugPanelOpen(true),
                        title: 'Open diagnostic panel to troubleshoot score calculation issues'
                    }, `🔧 ${t.debugPanel}`)
                ])
            ]),

            // Score Details Panel (hidden by default)
            createElement('div', {
                key: 'score-details-panel',
                id: 'score-details-panel',
                className: "bg-gray-50 rounded-lg p-4 mb-6",
                style: { display: 'none' }
            }, [
                createElement('h4', {
                    key: 'details-title',
                    className: "font-semibold text-gray-800 mb-3"
                }, t.scoreBreakdown),
                
                createElement('div', { key: 'calculation-details', className: "space-y-2 text-sm" }, [
                    createElement('div', { key: 'formula-info', className: "text-gray-600 mb-3" }, 
                        t.formulaInfo),
                    
                    // Factor weights breakdown
                    Object.entries(healthReport.factors || {}).map(([factorName, factorData]) => {
                        const factorInfo = window.SCORE_FACTORS && window.SCORE_FACTORS[factorName];
                        return createElement('div', {
                            key: `factor-${factorName}`,
                            className: "flex justify-between items-center py-1 border-b border-gray-200"
                        }, [
                            createElement('span', { key: 'name', className: "text-gray-700" }, 
                                t[factorName] || factorInfo?.name || factorName),
                            createElement('span', { key: 'score', className: "font-medium" }, 
                                `${factorData.score}/${factorInfo?.weight || 'N/A'} (${factorInfo?.weight || 'N/A'}%)`)
                        ]);
                    })
                ])
            ]),

            // Component scores grid with tooltips
            createElement('div', { 
                key: 'component-scores', 
                className: "grid grid-cols-2 md:grid-cols-4 gap-4" 
            }, [
                // Primary factors
                healthReport.factors.savingsRate && 
                    renderScoreFactor('savingsRate', healthReport.factors.savingsRate, window.SCORE_FACTORS?.savingsRate),
                healthReport.factors.retirementReadiness && 
                    renderScoreFactor('retirementReadiness', healthReport.factors.retirementReadiness, window.SCORE_FACTORS?.retirementReadiness),
                healthReport.factors.riskAlignment && 
                    renderScoreFactor('riskAlignment', healthReport.factors.riskAlignment, window.SCORE_FACTORS?.riskAlignment),
                healthReport.factors.taxEfficiency && 
                    renderScoreFactor('taxEfficiency', healthReport.factors.taxEfficiency, window.SCORE_FACTORS?.taxEfficiency),
                healthReport.factors.diversification && 
                    renderScoreFactor('diversification', healthReport.factors.diversification, window.SCORE_FACTORS?.diversification),
                healthReport.factors.emergencyFund && 
                    renderScoreFactor('emergencyFund', healthReport.factors.emergencyFund, window.SCORE_FACTORS?.emergencyFund),
                healthReport.factors.debtManagement && 
                    renderScoreFactor('debtManagement', healthReport.factors.debtManagement, window.SCORE_FACTORS?.debtManagement),
                healthReport.factors.timeHorizon && 
                    renderScoreFactor('timeToRetirement', healthReport.factors.timeHorizon, window.SCORE_FACTORS?.timeHorizon)
            ].filter(Boolean)),

            // Enhanced Missing Data Alert Panel
            (healthReport.debugInfo?.zeroScoreFactors?.length > 0 || 
             Object.values(healthReport.factors || {}).some(f => f.score === 0)) &&
            createElement('div', {
                key: 'missing-data-panel',
                className: "mt-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6"
            }, [
                createElement('h4', {
                    key: 'missing-data-title',
                    className: "font-bold text-red-800 mb-4 flex items-center text-lg"
                }, [
                    createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🚨'),
                    createElement('span', { key: 'text' }, 
                        language === 'he' ? 'נתונים חסרים משפיעים על הציון' : 'Missing Data Affecting Your Score')
                ]),
                
                createElement('div', { key: 'missing-items', className: "space-y-4" },
                    Object.entries(healthReport.factors || {}).filter(([_, f]) => f.score === 0).map(([factorName, factorData]) => {
                        const debugInfo = factorData.details?.debugInfo || {};
                        const status = factorData.details?.status || 'unknown';
                        
                        let stepNumber = '';
                        let actionText = '';
                        let priority = 'medium';
                        
                        if (factorName === 'savingsRate') {
                            if (status === 'missing_income_data') {
                                stepNumber = '2';
                                actionText = language === 'he' ? 'הוסף מידע על שכר' : 'Add salary information';
                                priority = 'high';
                            } else if (status === 'missing_contribution_data') {
                                stepNumber = '4';
                                actionText = language === 'he' ? 'הוסף שיעורי הפקדה' : 'Add contribution rates';
                                priority = 'high';
                            }
                        } else if (factorName === 'taxEfficiency') {
                            if (status === 'missing_income_data') {
                                stepNumber = '2';
                                actionText = language === 'he' ? 'הוסף מידע על שכר' : 'Add salary information';
                                priority = 'high';
                            } else if (status === 'missing_contribution_data') {
                                stepNumber = '4';
                                actionText = language === 'he' ? 'הוסף שיעורי הפקדה' : 'Add contribution rates';
                                priority = 'high';
                            }
                        }
                        
                        const priorityColor = priority === 'high' ? 'red' : 'amber';
                        
                        return createElement('div', {
                            key: `missing-${factorName}`,
                            className: `bg-white rounded-lg p-4 border-l-4 border-${priorityColor}-500 shadow-sm`
                        }, [
                            createElement('div', { key: 'missing-header', className: "flex items-center justify-between mb-2" }, [
                                createElement('div', { key: 'factor-info', className: "flex items-center" }, [
                                    createElement('span', { key: 'factor-name', className: `font-semibold text-${priorityColor}-700` }, 
                                        t[factorName] || factorName),
                                    createElement('span', { key: 'score-badge', className: `ml-2 px-2 py-1 bg-${priorityColor}-100 text-${priorityColor}-700 text-xs rounded` }, 
                                        '0/100')
                                ]),
                                stepNumber && createElement('div', { key: 'step-badge', className: `px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full` }, 
                                    `${language === 'he' ? 'שלב' : 'Step'} ${stepNumber}`)
                            ]),
                            createElement('div', { key: 'missing-description', className: `text-sm text-${priorityColor}-600 mb-2` }, 
                                debugInfo.reason || (language === 'he' ? 'נתונים חסרים' : 'Missing required data')),
                            actionText && createElement('div', { key: 'missing-action', className: `text-sm font-medium text-${priorityColor}-800` }, 
                                `→ ${actionText}`)
                        ]);
                    })
                ),
                
                // Quick action button
                createElement('div', { key: 'quick-action', className: "mt-4 pt-4 border-t border-red-200" }, [
                    createElement('div', { key: 'action-text', className: "text-sm text-red-700 mb-3" }, 
                        language === 'he' ? 
                            'השלמת הנתונים החסרים תשפר משמעותית את ציון הבריאות הפיננסית שלך' :
                            'Completing the missing data will significantly improve your financial health score'),
                    createElement('button', {
                        key: 'action-button',
                        className: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        onClick: () => {
                            setIsMissingDataModalOpen(true);
                        }
                    }, language === 'he' ? 'השלם נתונים חסרים' : 'Complete Missing Data')
                ])
            ]),

            // Improvement Suggestions
            healthReport.suggestions && healthReport.suggestions.length > 0 && 
            createElement('div', {
                key: 'improvement-suggestions',
                className: "mt-6 space-y-3"
            }, [
                createElement('h4', {
                    key: 'suggestions-title',
                    className: "font-semibold text-gray-800 mb-3 flex items-center"
                }, [
                    createElement('span', { key: 'icon', className: "mr-2" }, '💡'),
                    createElement('span', { key: 'text' }, t.improvementSuggestions)
                ]),
                
                healthReport.suggestions.slice(0, 3).map((suggestion, index) => 
                    createElement('div', {
                        key: `suggestion-${index}`,
                        className: `p-3 rounded-lg border ${suggestion.priority === 'high' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`
                    }, [
                        createElement('div', {
                            key: 'suggestion-header',
                            className: "flex items-center justify-between mb-1"
                        }, [
                            createElement('span', {
                                key: 'category',
                                className: `text-sm font-medium ${suggestion.priority === 'high' ? 'text-red-700' : 'text-yellow-700'}`
                            }, suggestion.category),
                            createElement('span', {
                                key: 'impact',
                                className: `text-xs ${suggestion.priority === 'high' ? 'text-red-600' : 'text-yellow-600'}`
                            }, suggestion.impact)
                        ]),
                        createElement('p', {
                            key: 'issue',
                            className: `text-sm ${suggestion.priority === 'high' ? 'text-red-600' : 'text-yellow-600'} mb-1`
                        }, suggestion.issue),
                        createElement('p', {
                            key: 'action',
                            className: `text-sm font-medium ${suggestion.priority === 'high' ? 'text-red-800' : 'text-yellow-800'}`
                        }, `→ ${suggestion.action}`)
                    ])
                )
            ]),

            // Missing Data Modal
            window.MissingDataModal && createElement(window.MissingDataModal, {
                key: 'missing-data-modal',
                isOpen: isMissingDataModalOpen,
                onClose: () => setIsMissingDataModalOpen(false),
                inputs: inputs,
                onInputUpdate: (updatedData) => {
                    if (setInputs) {
                        console.log('💡 FinancialHealthScore: Updating inputs with new data:', updatedData);
                        setInputs(prevInputs => ({ ...prevInputs, ...updatedData }));
                        
                        // Force a re-render by closing and reopening the modal state after a brief delay
                        setTimeout(() => {
                            console.log('💡 FinancialHealthScore: State update completed, score should recalculate');
                        }, 50);
                    }
                },
                language: language,
                healthReport: healthReport
            }),
            
            // Debug Panel
            window.FinancialHealthDebugPanel && createElement(window.FinancialHealthDebugPanel, {
                key: 'debug-panel',
                isOpen: isDebugPanelOpen,
                onClose: () => setIsDebugPanelOpen(false),
                inputs: inputs,
                language: language
            }),
            
            // Performance Indicator (only shown in development or when slow)
            (lastCalculationTime > 200 || window.location.hostname === 'localhost') && 
            createElement('div', {
                key: 'performance-indicator',
                className: "mt-2 text-xs text-gray-500 text-center"
            }, [
                createElement('span', { key: 'calc-time' }, 
                    language === 'he' ? 
                        `חישוב בוצע ב-${lastCalculationTime}ms` :
                        `Calculated in ${lastCalculationTime}ms`),
                lastCalculationTime > 500 && createElement('span', { 
                    key: 'slow-warning', 
                    className: "ml-2 text-amber-600" 
                }, '⚠️'),
                isRecalculating && createElement('span', { 
                    key: 'recalc-indicator', 
                    className: "ml-2 text-blue-600" 
                }, '🔄')
            ])
        ]);
    };

    // Export to window
    window.FinancialHealthScoreEnhanced = FinancialHealthScoreEnhanced;

    console.log('✅ Enhanced Financial Health Score component loaded successfully');
})();