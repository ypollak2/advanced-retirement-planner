// Dynamic Return Assumptions for Advanced Retirement Planner
// Provides market scenarios, historical context, and customizable return assumptions

window.dynamicReturnAssumptions = {
    
    // Market scenario presets with historical context
    marketScenarios: {
        conservative: {
            name: { en: 'Conservative', he: 'שמרני' },
            description: { 
                en: 'Based on lower-risk investments and conservative market outlook',
                he: 'מבוסס על השקעות נמוכות סיכון ותחזית שמרנית'
            },
            returns: {
                pensionReturn: 5.5,         // Lower than historical average
                trainingFundReturn: 5.0,    // Conservative bond-heavy
                personalPortfolioReturn: 6.5, // Conservative equity mix
                realEstateReturn: 4.5,      // Below inflation expectations
                cryptoReturn: 10.0          // Reduced from aggressive assumption
            },
            riskLevel: 'low',
            historicalBasis: {
                en: 'Based on 10th-30th percentile of historical returns',
                he: 'מבוסס על האחוזון ה-10 עד ה-30 של תשואות היסטוריות'
            }
        },
        
        moderate: {
            name: { en: 'Moderate (Recommended)', he: 'מתון (מומלץ)' },
            description: { 
                en: 'Balanced approach based on long-term historical averages',
                he: 'גישה מאוזנת המבוססת על ממוצעים היסטוריים ארוכי טווח'
            },
            returns: {
                pensionReturn: 7.0,         // Historical Israeli pension funds
                trainingFundReturn: 6.5,    // Balanced portfolio
                personalPortfolioReturn: 8.0, // Diversified equity/bond mix
                realEstateReturn: 6.0,      // Long-term real estate appreciation
                cryptoReturn: 15.0          // Conservative crypto assumption
            },
            riskLevel: 'medium',
            historicalBasis: {
                en: 'Based on 40th-60th percentile of historical returns',
                he: 'מבוסס על האחוזון ה-40 עד ה-60 של תשואות היסטוריות'
            }
        },
        
        aggressive: {
            name: { en: 'Aggressive', he: 'אגרסיבי' },
            description: { 
                en: 'Higher growth expectations with increased risk tolerance',
                he: 'ציפיות צמיחה גבוהות עם סובלנות סיכון מוגברת'
            },
            returns: {
                pensionReturn: 8.5,         // Above average expectations
                trainingFundReturn: 8.0,    // Equity-heavy allocation
                personalPortfolioReturn: 10.0, // High equity concentration
                realEstateReturn: 7.5,      // Optimistic real estate
                cryptoReturn: 20.0          // Higher crypto expectations
            },
            riskLevel: 'high',
            historicalBasis: {
                en: 'Based on 70th-90th percentile of historical returns',
                he: 'מבוסס על האחוזון ה-70 עד ה-90 של תשואות היסטוריות'
            }
        },
        
        custom: {
            name: { en: 'Custom', he: 'מותאם אישית' },
            description: { 
                en: 'Set your own return assumptions based on personal research',
                he: 'הגדר הנחות תשואה משלך על בסיס מחקר אישי'
            },
            returns: null, // Will use user inputs
            riskLevel: 'custom',
            historicalBasis: {
                en: 'User-defined assumptions',
                he: 'הנחות מוגדרות משתמש'
            }
        }
    },
    
    // Historical context and ranges for each asset class
    historicalRanges: {
        pensionReturn: {
            min: 3.0, max: 12.0, 
            historical: { en: '4-8% (Israeli pension funds, 20-year average)', he: '4-8% (קופות גמל ישראליות, ממוצע 20 שנה)' },
            riskWarning: { 
                en: 'Past performance does not guarantee future results',
                he: 'ביצועי עבר אינם מבטיחים תוצאות עתידיות' 
            }
        },
        trainingFundReturn: {
            min: 2.0, max: 10.0,
            historical: { en: '4-7% (balanced portfolios, long-term)', he: '4-7% (תיקים מאוזנים, טווח ארוך)' },
            riskWarning: { 
                en: 'Training fund returns vary with market conditions',
                he: 'תשואות קרן השתלמות משתנות עם תנאי השוק' 
            }
        },
        personalPortfolioReturn: {
            min: 3.0, max: 15.0,
            historical: { en: '6-10% (diversified equity/bond portfolios)', he: '6-10% (תיקים מגוונים מניות/אגחים)' },
            riskWarning: { 
                en: 'Higher returns typically involve higher risk',
                he: 'תשואות גבוהות כרוכות בדרך כלל בסיכון גבוה' 
            }
        },
        realEstateReturn: {
            min: 2.0, max: 12.0,
            historical: { en: '4-8% (Israeli real estate, excluding leverage)', he: '4-8% (נדל״ן ישראלי, ללא מינוף)' },
            riskWarning: { 
                en: 'Real estate markets can be volatile and illiquid',
                he: 'שווקי נדל״ן יכולים להיות תנודתיים ולא נזילים' 
            }
        },
        cryptoReturn: {
            min: -20.0, max: 50.0,
            historical: { en: 'Highly volatile, no reliable historical average', he: 'תנודתי מאוד, אין ממוצע היסטורי אמין' },
            riskWarning: { 
                en: 'Cryptocurrency is extremely risky and speculative',
                he: 'מטבעות דיגיטליים הם בעלי סיכון ספקולטיבי גבוה ביותר' 
            }
        }
    },
    
    // Get scenario by name
    getScenario: (scenarioName) => {
        return window.dynamicReturnAssumptions.marketScenarios[scenarioName] || 
               window.dynamicReturnAssumptions.marketScenarios.moderate;
    },
    
    // Apply scenario to inputs
    applyScenario: (inputs, scenarioName) => {
        const scenario = window.dynamicReturnAssumptions.getScenario(scenarioName);
        
        if (!scenario.returns) {
            // Custom scenario - don't override user inputs
            return { ...inputs, returnScenario: scenarioName };
        }
        
        return {
            ...inputs,
            returnScenario: scenarioName,
            pensionReturn: scenario.returns.pensionReturn,
            trainingFundReturn: scenario.returns.trainingFundReturn, 
            personalPortfolioReturn: scenario.returns.personalPortfolioReturn,
            realEstateReturn: scenario.returns.realEstateReturn,
            cryptoReturn: scenario.returns.cryptoReturn,
            // Update work periods with new pension returns
            workPeriods: (inputs.workPeriods || []).map(period => ({
                ...period,
                pensionReturn: scenario.returns.pensionReturn
            }))
        };
    },
    
    // Validate return assumption
    validateReturn: (assetType, returnValue, language = 'en') => {
        const ranges = window.dynamicReturnAssumptions.historicalRanges[assetType];
        if (!ranges) {
            return { isValid: true, warning: null };
        }
        
        const warnings = [];
        
        if (returnValue < ranges.min) {
            warnings.push(language === 'he' ? 
                `תשואה נמוכה מהמינימום ההיסטורי (${ranges.min}%)` :
                `Below historical minimum (${ranges.min}%)`);
        } else if (returnValue > ranges.max) {
            warnings.push(language === 'he' ? 
                `תשואה גבוהה מהמקסימום ההיסטורי (${ranges.max}%)` :
                `Above historical maximum (${ranges.max}%)`);
        }
        
        if (returnValue > 12 && assetType !== 'cryptoReturn') {
            warnings.push(language === 'he' ? 
                'תשואה גבוהה יוצאת דופן - בדוק היטב' :
                'Exceptionally high return - please verify');
        }
        
        if (returnValue < 1 && assetType !== 'cryptoReturn') {
            warnings.push(language === 'he' ? 
                'תשואה נמוכה מהאינפלציה הצפויה' :
                'Below expected inflation rate');
        }
        
        return {
            isValid: warnings.length === 0,
            warnings,
            historical: ranges.historical[language],
            riskWarning: ranges.riskWarning[language]
        };
    },
    
    // Generate time-based return adjustments
    calculateTimeBasedReturns: (baseReturns, yearsToRetirement) => {
        // Adjust returns based on time horizon (glide path concept)
        const adjustmentFactor = (() => {
            if (yearsToRetirement >= 30) return 1.0;  // Long-term: no adjustment
            if (yearsToRetirement >= 20) return 0.95; // Moderate-term: slight reduction
            if (yearsToRetirement >= 10) return 0.90; // Short-term: reduce risk
            if (yearsToRetirement >= 5) return 0.85;  // Near-term: conservative
            return 0.80; // Very near-term: very conservative
        })();
        
        return {
            pensionReturn: Math.max(3.0, baseReturns.pensionReturn * adjustmentFactor),
            trainingFundReturn: Math.max(2.5, baseReturns.trainingFundReturn * adjustmentFactor),
            personalPortfolioReturn: Math.max(4.0, baseReturns.personalPortfolioReturn * adjustmentFactor),
            realEstateReturn: Math.max(3.0, baseReturns.realEstateReturn * adjustmentFactor),
            cryptoReturn: baseReturns.cryptoReturn, // Don't adjust crypto (too volatile for glide path)
            adjustmentFactor,
            explanation: {
                en: `Returns adjusted by ${Math.round((1 - adjustmentFactor) * 100)}% for ${yearsToRetirement}-year horizon`,
                he: `תשואות הותאמו ב-${Math.round((1 - adjustmentFactor) * 100)}% לטווח של ${yearsToRetirement} שנים`
            }
        };
    },
    
    // Get recommendations based on user profile
    getReturnRecommendations: (inputs, language = 'en') => {
        const age = inputs.currentAge || 30;
        const yearsToRetirement = (inputs.retirementAge || 67) - age;
        const riskTolerance = inputs.riskTolerance || 'moderate';
        
        const recommendations = [];
        
        // Age-based recommendations
        if (age < 35) {
            recommendations.push({
                type: 'age_young',
                priority: 'medium',
                title: language === 'he' ? 'צעיר - תשואות גבוהות' : 'Young Investor - Higher Returns',
                description: language === 'he' ? 
                    'בגילך, ניתן לקחת יותר סיכון עבור תשואות גבוהות יותר' :
                    'At your age, you can take more risk for potentially higher returns',
                suggestion: language === 'he' ? 
                    'שקול תרחיש "אגרסיבי"' : 
                    'Consider "Aggressive" scenario'
            });
        } else if (age > 50) {
            recommendations.push({
                type: 'age_mature',
                priority: 'high',
                title: language === 'he' ? 'בוגר - שמירת הון' : 'Mature Investor - Capital Preservation',
                description: language === 'he' ? 
                    'בגילך, חשוב יותר לשמור על הון מלצבור אותו' :
                    'At your age, capital preservation is more important than accumulation',
                suggestion: language === 'he' ? 
                    'שקול תרחיש "שמרני" או "מתון"' : 
                    'Consider "Conservative" or "Moderate" scenario'
            });
        }
        
        // Risk tolerance recommendations
        if (riskTolerance === 'conservative' && (inputs.personalPortfolioReturn || 8) > 7) {
            recommendations.push({
                type: 'risk_mismatch',
                priority: 'high',
                title: language === 'he' ? 'אי-התאמה בסיכון' : 'Risk Tolerance Mismatch',
                description: language === 'he' ? 
                    'הגדרת סובלנות הסיכון כשמרנית אך ציפיות התשואה גבוהות' :
                    'Risk tolerance is set to conservative but return expectations are high',
                suggestion: language === 'he' ? 
                    'הקטן ציפיות תשואה או שנה סובלנות סיכון' : 
                    'Lower return expectations or change risk tolerance'
            });
        }
        
        // Time horizon recommendations
        if (yearsToRetirement <= 10 && riskTolerance === 'aggressive') {
            recommendations.push({
                type: 'time_horizon',
                priority: 'high',
                title: language === 'he' ? 'אופק זמן קצר' : 'Short Time Horizon',
                description: language === 'he' ? 
                    'עם פחות מ-10 שנים לפרישה, סיכון גבוה עלול להזיק' :
                    'With less than 10 years to retirement, high risk could be harmful',
                suggestion: language === 'he' ? 
                    'שקול הפחתת רמת הסיכון' : 
                    'Consider reducing risk level'
            });
        }
        
        return recommendations;
    },
    
    // Comprehensive return analysis
    analyzeReturnAssumptions: (inputs, language = 'en') => {
        const currentReturns = {
            pensionReturn: inputs.pensionReturn || 7.0,
            trainingFundReturn: inputs.trainingFundReturn || 6.5,
            personalPortfolioReturn: inputs.personalPortfolioReturn || 8.0,
            realEstateReturn: inputs.realEstateReturn || 6.0,
            cryptoReturn: inputs.cryptoReturn || 15.0
        };
        
        const yearsToRetirement = (inputs.retirementAge || 67) - (inputs.currentAge || 30);
        
        // Validate each return assumption
        const validations = {};
        Object.keys(currentReturns).forEach(assetType => {
            validations[assetType] = window.dynamicReturnAssumptions.validateReturn(
                assetType, currentReturns[assetType], language
            );
        });
        
        // Calculate time-based adjustments
        const timeAdjusted = window.dynamicReturnAssumptions.calculateTimeBasedReturns(
            currentReturns, yearsToRetirement
        );
        
        // Get scenario recommendations
        const recommendations = window.dynamicReturnAssumptions.getReturnRecommendations(inputs, language);
        
        // Determine if current assumptions match any preset scenario
        const currentScenario = (() => {
            for (const [name, scenario] of Object.entries(window.dynamicReturnAssumptions.marketScenarios)) {
                if (!scenario.returns) continue;
                
                const matches = Math.abs(currentReturns.pensionReturn - scenario.returns.pensionReturn) < 0.5 &&
                               Math.abs(currentReturns.trainingFundReturn - scenario.returns.trainingFundReturn) < 0.5 &&
                               Math.abs(currentReturns.personalPortfolioReturn - scenario.returns.personalPortfolioReturn) < 1.0;
                
                if (matches) return name;
            }
            return 'custom';
        })();
        
        return {
            currentReturns,
            currentScenario,
            validations,
            timeAdjusted,
            recommendations,
            yearsToRetirement,
            summary: {
                averageReturn: Object.values(currentReturns).reduce((a, b) => a + b, 0) / Object.keys(currentReturns).length,
                riskLevel: inputs.riskTolerance || 'moderate',
                hasWarnings: Object.values(validations).some(v => !v.isValid),
                scenarioMatch: currentScenario !== 'custom'
            }
        };
    }
};

// Export main functions to window
window.getMarketScenarios = () => window.dynamicReturnAssumptions.marketScenarios;
window.applyReturnScenario = window.dynamicReturnAssumptions.applyScenario;
window.analyzeReturnAssumptions = window.dynamicReturnAssumptions.analyzeReturnAssumptions;
window.validateReturnAssumption = window.dynamicReturnAssumptions.validateReturn;