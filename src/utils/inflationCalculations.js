// Inflation-Adjusted Calculations Engine
// Provides real vs nominal value tracking with historical inflation data

window.inflationCalculations = {
    
    // Historical inflation data and projections
    inflationData: {
        israel: {
            historicalAverage: 2.1,    // Long-term average (2000-2024)
            recentAverage: 3.2,        // Recent 5-year average (2019-2024)
            currentProjection: 2.5,    // Current Bank of Israel projection
            targetRate: 2.0,           // Bank of Israel target
            volatility: 1.8,           // Historical volatility
            periods: {
                '2020': 0.6, '2021': 2.8, '2022': 4.4, '2023': 4.3, '2024': 2.9
            }
        },
        usa: {
            historicalAverage: 2.3,
            recentAverage: 4.1,
            currentProjection: 2.2,
            targetRate: 2.0,
            volatility: 1.5,
            periods: {
                '2020': 1.2, '2021': 4.7, '2022': 8.0, '2023': 4.1, '2024': 3.2
            }
        },
        eurozone: {
            historicalAverage: 1.7,
            recentAverage: 3.4,
            currentProjection: 2.1,
            targetRate: 2.0,
            volatility: 1.3,
            periods: {
                '2020': 0.3, '2021': 2.6, '2022': 8.4, '2023': 5.4, '2024': 2.6
            }
        }
    },
    
    // Inflation impact by asset class
    assetInflationImpact: {
        pension: {
            inflationProtection: 0.7,    // 70% protection against inflation
            realReturnAdjustment: -0.8   // Reduce real return by 0.8pp
        },
        trainingFund: {
            inflationProtection: 0.6,    // 60% protection
            realReturnAdjustment: -1.0   // Reduce real return by 1.0pp
        },
        personalPortfolio: {
            stocks: {
                inflationProtection: 0.8,  // Stocks generally good inflation hedge
                realReturnAdjustment: -0.5
            },
            bonds: {
                inflationProtection: 0.3,  // Bonds poor inflation protection
                realReturnAdjustment: -1.5
            }
        },
        realEstate: {
            inflationProtection: 0.9,    // Excellent inflation hedge
            realReturnAdjustment: 0.2    // Actually benefits from inflation
        },
        crypto: {
            inflationProtection: 0.4,    // Unclear inflation relationship
            realReturnAdjustment: -2.0   // High volatility makes it unreliable
        },
        cash: {
            inflationProtection: 0.0,    // No inflation protection
            realReturnAdjustment: -2.5   // Loses to inflation
        }
    },
    
    // Calculate inflation-adjusted values
    adjustForInflation: function(nominalValue, inflationRate, years, compounding = true) {
        if (!nominalValue || years <= 0) return nominalValue;
        
        const adjustedInflationRate = inflationRate / 100;
        
        if (compounding) {
            return nominalValue / Math.pow(1 + adjustedInflationRate, years);
        } else {
            return nominalValue / (1 + (adjustedInflationRate * years));
        }
    },
    
    // Calculate real returns after inflation
    calculateRealReturns: function(nominalReturns, inflationRates) {
        const realReturns = {};
        
        Object.keys(nominalReturns).forEach(assetType => {
            const nominalReturn = nominalReturns[assetType];
            const inflationRate = Array.isArray(inflationRates) ? 
                inflationRates.reduce((a, b) => a + b, 0) / inflationRates.length :
                inflationRates;
            
            // Real return = ((1 + nominal return) / (1 + inflation)) - 1
            realReturns[assetType] = ((1 + nominalReturn / 100) / (1 + inflationRate / 100)) - 1;
            realReturns[assetType] *= 100; // Convert back to percentage
        });
        
        return realReturns;
    },
    
    // Comprehensive inflation impact analysis
    analyzeInflationImpact: function(inputs, projectionYears, country = 'israel', language = 'en') {
        const countryData = this.inflationData[country] || this.inflationData.israel;
        const analysis = {
            baseProjections: {},
            inflationProjections: {},
            realValueAnalysis: {},
            purchasing_power: {},
            recommendations: []
        };
        
        // Project inflation scenarios
        const inflationScenarios = {
            optimistic: countryData.targetRate,
            moderate: countryData.currentProjection,
            pessimistic: countryData.recentAverage,
            historical: countryData.historicalAverage
        };
        
        // Calculate impact on different asset types
        const assetTypes = [
            'pensionReturn', 'trainingFundReturn', 'personalPortfolioReturn',
            'realEstateReturn', 'cryptoReturn'
        ];
        
        assetTypes.forEach(assetType => {
            const nominalReturn = parseFloat(inputs[assetType] || 0);
            analysis.baseProjections[assetType] = nominalReturn;
            
            analysis.inflationProjections[assetType] = {};
            Object.entries(inflationScenarios).forEach(([scenario, inflationRate]) => {
                const realReturn = ((1 + nominalReturn / 100) / (1 + inflationRate / 100)) - 1;
                analysis.inflationProjections[assetType][scenario] = realReturn * 100;
            });
        });
        
        // Calculate purchasing power erosion
        const initialPurchasingPower = 100000; // Base amount for calculation
        analysis.purchasing_power = {};
        
        Object.entries(inflationScenarios).forEach(([scenario, inflationRate]) => {
            analysis.purchasing_power[scenario] = [];
            
            for (let year = 1; year <= Math.min(projectionYears, 40); year++) {
                const realValue = this.adjustForInflation(initialPurchasingPower, inflationRate, year);
                const erosion = ((initialPurchasingPower - realValue) / initialPurchasingPower) * 100;
                
                analysis.purchasing_power[scenario].push({
                    year: year,
                    realValue: realValue,
                    erosionPercentage: erosion,
                    equivalentNominal: initialPurchasingPower * Math.pow(1 + inflationRate / 100, year)
                });
            }
        });
        
        // Real value analysis of retirement savings
        const totalCurrentSavings = this.calculateTotalCurrentSavings(inputs);
        analysis.realValueAnalysis = {
            currentNominal: totalCurrentSavings,
            projectedReal: {},
            inflationProtection: this.calculateInflationProtection(inputs)
        };
        
        Object.entries(inflationScenarios).forEach(([scenario, inflationRate]) => {
            analysis.realValueAnalysis.projectedReal[scenario] = 
                this.adjustForInflation(totalCurrentSavings, inflationRate, projectionYears);
        });
        
        // Generate recommendations
        analysis.recommendations = this.generateInflationRecommendations(analysis, inputs, language);
        
        return analysis;
    },
    
    // Calculate total current savings
    calculateTotalCurrentSavings: function(inputs) {
        return (parseFloat(inputs.currentSavings || 0) +
                parseFloat(inputs.currentTrainingFund || 0) +
                parseFloat(inputs.currentPersonalPortfolio || 0) +
                parseFloat(inputs.currentRealEstate || 0) +
                parseFloat(inputs.currentCrypto || 0));
    },
    
    // Calculate overall inflation protection of portfolio
    calculateInflationProtection: function(inputs) {
        const totalValue = this.calculateTotalCurrentSavings(inputs);
        if (totalValue === 0) return 0;
        
        let weightedProtection = 0;
        
        // Pension savings
        const pensionWeight = (parseFloat(inputs.currentSavings || 0)) / totalValue;
        weightedProtection += pensionWeight * this.assetInflationImpact.pension.inflationProtection;
        
        // Training fund
        const trainingFundWeight = (parseFloat(inputs.currentTrainingFund || 0)) / totalValue;
        weightedProtection += trainingFundWeight * this.assetInflationImpact.trainingFund.inflationProtection;
        
        // Personal portfolio (assume 60% stocks, 40% bonds)
        const portfolioWeight = (parseFloat(inputs.currentPersonalPortfolio || 0)) / totalValue;
        const stockAllocation = parseFloat(inputs.stockPercentage || 60) / 100;
        const bondAllocation = 1 - stockAllocation;
        
        weightedProtection += portfolioWeight * (
            stockAllocation * this.assetInflationImpact.personalPortfolio.stocks.inflationProtection +
            bondAllocation * this.assetInflationImpact.personalPortfolio.bonds.inflationProtection
        );
        
        // Real estate
        const realEstateWeight = (parseFloat(inputs.currentRealEstate || 0)) / totalValue;
        weightedProtection += realEstateWeight * this.assetInflationImpact.realEstate.inflationProtection;
        
        // Crypto
        const cryptoWeight = (parseFloat(inputs.currentCrypto || 0)) / totalValue;
        weightedProtection += cryptoWeight * this.assetInflationImpact.crypto.inflationProtection;
        
        return Math.round(weightedProtection * 100); // Return as percentage
    },
    
    // Generate inflation-specific recommendations
    generateInflationRecommendations: function(analysis, inputs, language = 'en') {
        const recommendations = [];
        const content = language === 'he' ? this.getContentHe() : this.getContentEn();
        
        // Low inflation protection warning
        if (analysis.realValueAnalysis.inflationProtection < 50) {
            recommendations.push({
                type: 'low_protection',
                priority: 'high',
                title: content.lowProtection.title,
                description: content.lowProtection.description.replace('{protection}', 
                    analysis.realValueAnalysis.inflationProtection),
                actions: [
                    content.lowProtection.increaseStocks,
                    content.lowProtection.addRealEstate,
                    content.lowProtection.reduceCash
                ],
                impact: `${language === 'he' ? 'שיפור הגנה ל-' : 'Improve protection to '}65%`
            });
        }
        
        // Real return warnings
        const moderateInflation = analysis.inflationProjections;
        const assetWarnings = [];
        
        Object.entries(moderateInflation).forEach(([assetType, scenarios]) => {
            if (scenarios.moderate < 1.5) { // Real return below 1.5%
                assetWarnings.push(assetType);
            }
        });
        
        if (assetWarnings.length > 0) {
            recommendations.push({
                type: 'low_real_returns',
                priority: 'medium',
                title: content.lowRealReturns.title,
                description: content.lowRealReturns.description,
                actions: [
                    content.lowRealReturns.reviewAssumptions,
                    content.lowRealReturns.diversifyAssets,
                    content.lowRealReturns.considerInflationBonds
                ]
            });
        }
        
        // Purchasing power erosion warning
        const purchasingPowerAt20Years = analysis.purchasing_power.moderate.find(p => p.year === 20);
        if (purchasingPowerAt20Years && purchasingPowerAt20Years.erosionPercentage > 35) {
            recommendations.push({
                type: 'purchasing_power',
                priority: 'high',
                title: content.purchasingPower.title,
                description: content.purchasingPower.description.replace('{erosion}', 
                    Math.round(purchasingPowerAt20Years.erosionPercentage)),
                actions: [
                    content.purchasingPower.inflationLinkedBonds,
                    content.purchasingPower.realAssets,
                    content.purchasingPower.internationalDiversification
                ]
            });
        }
        
        // High cash allocation warning
        const totalAssets = this.calculateTotalCurrentSavings(inputs);
        const cashEquivalents = parseFloat(inputs.currentTrainingFund || 0); // Treating training fund as cash-like
        const cashPercentage = totalAssets > 0 ? (cashEquivalents / totalAssets) * 100 : 0;
        
        if (cashPercentage > 30) {
            recommendations.push({
                type: 'excess_cash',
                priority: 'medium',
                title: content.excessCash.title,
                description: content.excessCash.description.replace('{percentage}', 
                    Math.round(cashPercentage)),
                actions: [
                    content.excessCash.investInStocks,
                    content.excessCash.considerREITs,
                    content.excessCash.gradualInvestment
                ]
            });
        }
        
        // Age-based inflation recommendations
        const currentAge = parseInt(inputs.currentAge || 30);
        const yearsToRetirement = (parseInt(inputs.retirementAge || 67)) - currentAge;
        
        if (yearsToRetirement > 20) {
            recommendations.push({
                type: 'long_term',
                priority: 'low',
                title: content.longTerm.title,
                description: content.longTerm.description,
                actions: [
                    content.longTerm.emphasizeGrowth,
                    content.longTerm.acceptVolatility,
                    content.longTerm.regularRebalancing
                ]
            });
        } else if (yearsToRetirement < 10) {
            recommendations.push({
                type: 'near_retirement',
                priority: 'medium',
                title: content.nearRetirement.title,
                description: content.nearRetirement.description,
                actions: [
                    content.nearRetirement.balanceGrowthProtection,
                    content.nearRetirement.considerTIPS,
                    content.nearRetirement.planWithdrawalStrategy
                ]
            });
        }
        
        return recommendations;
    },
    
    // Create inflation-adjusted retirement projections
    createInflationAdjustedProjections: function(inputs, workPeriods, projectionYears = 30, country = 'israel') {
        const countryData = this.inflationData[country] || this.inflationData.israel;
        const projections = {
            nominal: {},
            real: {},
            scenarios: {}
        };
        
        const inflationScenarios = {
            optimistic: countryData.targetRate,
            moderate: countryData.currentProjection,
            pessimistic: countryData.recentAverage
        };
        
        // Calculate projections for each scenario
        Object.entries(inflationScenarios).forEach(([scenario, inflationRate]) => {
            projections.scenarios[scenario] = {
                inflationRate: inflationRate,
                yearlyProjections: []
            };
            
            for (let year = 1; year <= projectionYears; year++) {
                // Calculate nominal values (using existing calculation)
                const nominalValue = this.calculateNominalProjection(inputs, workPeriods, year);
                
                // Convert to real value
                const realValue = this.adjustForInflation(nominalValue, inflationRate, year);
                
                // Calculate purchasing power
                const purchasingPowerVsToday = (realValue / nominalValue) * 100;
                
                projections.scenarios[scenario].yearlyProjections.push({
                    year: year,
                    nominal: nominalValue,
                    real: realValue,
                    purchasingPowerVsToday: purchasingPowerVsToday,
                    cumulativeInflation: Math.pow(1 + inflationRate / 100, year) - 1
                });
            }
        });
        
        return projections;
    },
    
    // Simplified nominal projection calculation (would integrate with main calculation engine)
    calculateNominalProjection: function(inputs, workPeriods, targetYear) {
        // This is a simplified version - in practice would use the full retirement calculation
        const currentSavings = this.calculateTotalCurrentSavings(inputs);
        const averageReturn = 7; // Simplified average return
        const monthlyContributions = parseFloat(inputs.monthlyContributions || 1000);
        
        // Compound growth of current savings
        const futureValueCurrent = currentSavings * Math.pow(1 + averageReturn / 100, targetYear);
        
        // Future value of monthly contributions
        const monthlyReturn = averageReturn / 100 / 12;
        const months = targetYear * 12;
        const futureValueContributions = monthlyContributions * 
            ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
        
        return futureValueCurrent + futureValueContributions;
    },
    
    // Multi-language content
    getContentEn: function() {
        return {
            lowProtection: {
                title: 'Low Inflation Protection',
                description: 'Your portfolio has only {protection}% inflation protection',
                increaseStocks: 'Increase stock allocation for better inflation hedge',
                addRealEstate: 'Consider adding real estate investments',
                reduceCash: 'Reduce cash holdings to productive assets'
            },
            lowRealReturns: {
                title: 'Low Real Returns Expected',
                description: 'Some assets may not beat inflation in moderate scenario',
                reviewAssumptions: 'Review return assumptions for conservative assets',
                diversifyAssets: 'Diversify into inflation-resistant asset classes',
                considerInflationBonds: 'Consider inflation-linked bonds'
            },
            purchasingPower: {
                title: 'Significant Purchasing Power Erosion',
                description: 'Inflation may erode {erosion}% of purchasing power over 20 years',
                inflationLinkedBonds: 'Add inflation-linked government bonds',
                realAssets: 'Increase allocation to real assets (real estate, commodities)',
                internationalDiversification: 'Consider international diversification'
            },
            excessCash: {
                title: 'High Cash Allocation Risk',
                description: '{percentage}% in cash-equivalent assets loses to inflation',
                investInStocks: 'Gradually invest in stock-based assets',
                considerREITs: 'Consider REITs for inflation protection',
                gradualInvestment: 'Use dollar-cost averaging for gradual investment'
            },
            longTerm: {
                title: 'Long-term Inflation Strategy',
                description: 'With 20+ years to retirement, prioritize growth over inflation protection',
                emphasizeGrowth: 'Emphasize growth assets (stocks, real estate)',
                acceptVolatility: 'Accept short-term volatility for long-term growth',
                regularRebalancing: 'Rebalance regularly to maintain target allocation'
            },
            nearRetirement: {
                title: 'Near-Retirement Inflation Planning',
                description: 'Balance growth needs with inflation protection as retirement approaches',
                balanceGrowthProtection: 'Balance growth assets with inflation-protected securities',
                considerTIPS: 'Consider Treasury Inflation-Protected Securities (TIPS)',
                planWithdrawalStrategy: 'Plan withdrawal strategy accounting for inflation'
            }
        };
    },
    
    getContentHe: function() {
        return {
            lowProtection: {
                title: 'הגנה נמוכה מפני אינפלציה',
                description: 'לתיק שלך יש רק {protection}% הגנה מפני אינפלציה',
                increaseStocks: 'הגדל הקצאת מניות להגנה טובה יותר מפני אינפלציה',
                addRealEstate: 'שקול הוספת השקעות נדל״ן',
                reduceCash: 'הפחת אחזקות מזומן לטובת נכסים יצרניים'
            },
            lowRealReturns: {
                title: 'תשואות ריאליות נמוכות צפויות',
                description: 'חלק מהנכסים עלולים לא לנצח את האינפלציה',
                reviewAssumptions: 'סקור הנחות תשואה לנכסים שמרניים',
                diversifyAssets: 'פזר השקעות לסוגי נכסים עמידים באינפלציה',
                considerInflationBonds: 'שקול אג״ח צמודי אינפלציה'
            },
            purchasingPower: {
                title: 'שחיקת כוח קנייה משמעותית',
                description: 'אינפלציה עלולה לשחוק {erosion}% מכוח הקנייה תוך 20 שנה',
                inflationLinkedBonds: 'הוסף אג״ח ממשלתיים צמודי אינפלציה',
                realAssets: 'הגדל הקצאה לנכסים ריאליים (נדל״ן, סחורות)',
                internationalDiversification: 'שקול פיזור בינלאומי'
            },
            excessCash: {
                title: 'סיכון הקצאת מזומן גבוהה',
                description: '{percentage}% בנכסים דמויי מזומן מפסידים לאינפלציה',
                investInStocks: 'השקע בהדרגה בנכסים מבוססי מניות',
                considerREITs: 'שקול קרנות נדל״ן להגנה מפני אינפלציה',
                gradualInvestment: 'השתמש בהשקעה הדרגתית'
            },
            longTerm: {
                title: 'אסטרטגיית אינפלציה ארוכת טווח',
                description: 'עם 20+ שנים לפרישה, תן עדיפות לצמיחה על פני הגנה מאינפלציה',
                emphasizeGrowth: 'הדגש נכסי צמיחה (מניות, נדל״ן)',
                acceptVolatility: 'קבל תנודתיות קצרת טווח למען צמיחה ארוכת טווח',
                regularRebalancing: 'בצע איזון תיק סדיר לשמירה על הקצאת יעד'
            },
            nearRetirement: {
                title: 'תכנון אינפלציה לקראת פרישה',
                description: 'איזן בין צרכי צמיחה להגנה מאינפלציה',
                balanceGrowthProtection: 'איזן נכסי צמיחה עם ניירות הגנה מאינפלציה',
                considerTIPS: 'שקול אג״ח הגנה מאינפלציה',
                planWithdrawalStrategy: 'תכנן אסטרטגיית משיכה המתחשבת באינפלציה'
            }
        };
    }
};

// Export for global access
window.analyzeInflationImpact = window.inflationCalculations.analyzeInflationImpact.bind(window.inflationCalculations);
window.createInflationAdjustedProjections = window.inflationCalculations.createInflationAdjustedProjections.bind(window.inflationCalculations);
window.adjustForInflation = window.inflationCalculations.adjustForInflation.bind(window.inflationCalculations);

console.log('✅ Inflation Calculations system loaded successfully');