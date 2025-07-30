// portfolioOptimizer.js - Portfolio Optimization and Rebalancing Engine
// Created by Yali Pollak (יהלי פולק) - Advanced Retirement Planner v6.3.0

/**
 * Portfolio optimization engine using Modern Portfolio Theory principles
 * Provides asset allocation recommendations and rebalancing suggestions
 */

const PortfolioOptimizer = {
    
    // Asset class definitions with historical returns and volatility
    assetClasses: {
        stocks: {
            domestic: {
                name: { en: 'Domestic Stocks', he: 'מניות מקומיות' },
                expectedReturn: 9.5,
                volatility: 18.5,
                correlation: 1.0
            },
            international: {
                name: { en: 'International Stocks', he: 'מניות בינלאומיות' },
                expectedReturn: 8.5,
                volatility: 20.0,
                correlation: 0.75
            },
            emerging: {
                name: { en: 'Emerging Market Stocks', he: 'מניות שווקים מתעוררים' },
                expectedReturn: 10.5,
                volatility: 25.0,
                correlation: 0.65
            }
        },
        bonds: {
            government: {
                name: { en: 'Government Bonds', he: 'אג"ח ממשלתי' },
                expectedReturn: 3.5,
                volatility: 5.0,
                correlation: -0.1
            },
            corporate: {
                name: { en: 'Corporate Bonds', he: 'אג"ח קונצרני' },
                expectedReturn: 5.0,
                volatility: 8.0,
                correlation: 0.2
            },
            highYield: {
                name: { en: 'High Yield Bonds', he: 'אג"ח תשואה גבוהה' },
                expectedReturn: 7.0,
                volatility: 12.0,
                correlation: 0.4
            }
        },
        alternatives: {
            realEstate: {
                name: { en: 'Real Estate', he: 'נדל"ן' },
                expectedReturn: 7.5,
                volatility: 15.0,
                correlation: 0.3
            },
            commodities: {
                name: { en: 'Commodities', he: 'סחורות' },
                expectedReturn: 6.0,
                volatility: 20.0,
                correlation: 0.2
            },
            crypto: {
                name: { en: 'Cryptocurrency', he: 'מטבעות דיגיטליים' },
                expectedReturn: 15.0,
                volatility: 60.0,
                correlation: 0.1
            }
        },
        cash: {
            savings: {
                name: { en: 'Cash & Savings', he: 'מזומן וחיסכון' },
                expectedReturn: 2.0,
                volatility: 1.0,
                correlation: 0.0
            }
        }
    },
    
    // Model portfolios based on risk tolerance
    modelPortfolios: {
        conservative: {
            stocks: { domestic: 15, international: 10, emerging: 0 },
            bonds: { government: 40, corporate: 25, highYield: 0 },
            alternatives: { realEstate: 5, commodities: 0, crypto: 0 },
            cash: { savings: 5 }
        },
        moderate: {
            stocks: { domestic: 30, international: 20, emerging: 5 },
            bonds: { government: 20, corporate: 15, highYield: 5 },
            alternatives: { realEstate: 5, commodities: 0, crypto: 0 },
            cash: { savings: 0 }
        },
        aggressive: {
            stocks: { domestic: 40, international: 25, emerging: 10 },
            bonds: { government: 5, corporate: 10, highYield: 5 },
            alternatives: { realEstate: 3, commodities: 2, crypto: 0 },
            cash: { savings: 0 }
        }
    },
    
    // Main optimization function
    optimizePortfolio: function(inputs, language = 'en') {
        const currentAge = parseInt(inputs.currentAge || 30);
        const retirementAge = parseInt(inputs.retirementAge || 67);
        const riskTolerance = inputs.riskTolerance || 'moderate';
        const currentPortfolio = this.parseCurrentPortfolio(inputs);
        
        // Calculate optimal allocation
        const optimalAllocation = this.calculateOptimalAllocation(
            currentAge, 
            retirementAge, 
            riskTolerance,
            inputs
        );
        
        // Calculate rebalancing recommendations
        const rebalancingActions = this.calculateRebalancing(
            currentPortfolio, 
            optimalAllocation,
            inputs
        );
        
        // Calculate portfolio metrics
        const metrics = this.calculatePortfolioMetrics(optimalAllocation);
        const currentMetrics = this.calculatePortfolioMetrics(currentPortfolio);
        
        // Generate recommendations
        const recommendations = this.generateRecommendations(
            currentPortfolio,
            optimalAllocation,
            inputs,
            language
        );
        
        return {
            currentAllocation: currentPortfolio,
            optimalAllocation: optimalAllocation,
            rebalancingActions: rebalancingActions,
            currentMetrics: currentMetrics,
            optimalMetrics: metrics,
            recommendations: recommendations,
            implementationPlan: this.createImplementationPlan(rebalancingActions, language)
        };
    },
    
    // Parse current portfolio from inputs
    parseCurrentPortfolio: function(inputs) {
        const totalAssets = this.calculateTotalAssets(inputs);
        if (totalAssets === 0) return this.getEmptyPortfolio();
        
        // Map inputs to asset classes
        const portfolio = this.getEmptyPortfolio();
        
        // Stocks allocation (based on existing stock percentage)
        const stockPercentage = parseFloat(inputs.stockPercentage || 60);
        const stockValue = (parseFloat(inputs.currentPersonalPortfolio || 0) + 
                           parseFloat(inputs.currentSavings || 0)) * (stockPercentage / 100);
        
        portfolio.stocks.domestic = (stockValue * 0.6) / totalAssets * 100;
        portfolio.stocks.international = (stockValue * 0.4) / totalAssets * 100;
        
        // Bonds allocation (remaining from stocks)
        const bondPercentage = 100 - stockPercentage;
        const bondValue = (parseFloat(inputs.currentPersonalPortfolio || 0) + 
                          parseFloat(inputs.currentSavings || 0)) * (bondPercentage / 100);
        
        portfolio.bonds.government = (bondValue * 0.6) / totalAssets * 100;
        portfolio.bonds.corporate = (bondValue * 0.4) / totalAssets * 100;
        
        // Real estate
        const realEstateValue = parseFloat(inputs.currentRealEstate || 0);
        portfolio.alternatives.realEstate = (realEstateValue / totalAssets) * 100;
        
        // Crypto
        const cryptoValue = parseFloat(inputs.currentCrypto || 0);
        portfolio.alternatives.crypto = (cryptoValue / totalAssets) * 100;
        
        // Cash (remaining)
        const allocatedPercentage = Object.values(portfolio).reduce((sum, category) => 
            sum + Object.values(category).reduce((catSum, val) => catSum + val, 0), 0
        );
        portfolio.cash.savings = Math.max(0, 100 - allocatedPercentage);
        
        return portfolio;
    },
    
    // Calculate optimal allocation based on age and risk
    calculateOptimalAllocation: function(currentAge, retirementAge, riskTolerance, inputs) {
        const yearsToRetirement = retirementAge - currentAge;
        let basePortfolio = { ...this.modelPortfolios[riskTolerance] };
        
        // Age-based adjustment (glide path)
        const ageAdjustmentFactor = Math.max(0, Math.min(1, yearsToRetirement / 35));
        
        // Reduce stock allocation as approaching retirement
        const stockReduction = (1 - ageAdjustmentFactor) * 20; // Max 20% reduction
        const totalStocks = basePortfolio.stocks.domestic + basePortfolio.stocks.international + basePortfolio.stocks.emerging;
        const stockAdjustment = totalStocks > 0 ? stockReduction / totalStocks : 0;
        
        // Apply adjustments
        Object.keys(basePortfolio.stocks).forEach(key => {
            basePortfolio.stocks[key] *= (1 - stockAdjustment);
        });
        
        // Add to bonds
        basePortfolio.bonds.government += stockReduction * 0.7;
        basePortfolio.bonds.corporate += stockReduction * 0.3;
        
        // Special considerations
        if (inputs.hasRealEstate || parseFloat(inputs.currentRealEstate || 0) > 0) {
            // If already has real estate, ensure allocation
            basePortfolio.alternatives.realEstate = Math.max(5, basePortfolio.alternatives.realEstate);
        }
        
        if (yearsToRetirement < 10) {
            // Near retirement - increase cash allocation
            basePortfolio.cash.savings = Math.max(5, basePortfolio.cash.savings);
        }
        
        // Normalize to 100%
        const total = Object.values(basePortfolio).reduce((sum, category) => 
            sum + Object.values(category).reduce((catSum, val) => catSum + val, 0), 0
        );
        
        if (total !== 100) {
            const factor = 100 / total;
            Object.keys(basePortfolio).forEach(category => {
                Object.keys(basePortfolio[category]).forEach(asset => {
                    basePortfolio[category][asset] *= factor;
                });
            });
        }
        
        return basePortfolio;
    },
    
    // Calculate rebalancing actions
    calculateRebalancing: function(currentPortfolio, optimalPortfolio, inputs) {
        const totalAssets = this.calculateTotalAssets(inputs);
        const actions = [];
        const threshold = 5; // 5% threshold for rebalancing
        
        Object.keys(optimalPortfolio).forEach(category => {
            Object.keys(optimalPortfolio[category]).forEach(asset => {
                const currentAllocation = currentPortfolio[category][asset] || 0;
                const optimalAllocation = optimalPortfolio[category][asset] || 0;
                const difference = optimalAllocation - currentAllocation;
                
                if (Math.abs(difference) > threshold) {
                    const amountToRebalance = (difference / 100) * totalAssets;
                    actions.push({
                        category: category,
                        asset: asset,
                        action: difference > 0 ? 'buy' : 'sell',
                        currentPercentage: currentAllocation,
                        targetPercentage: optimalAllocation,
                        differencePercentage: difference,
                        amount: Math.abs(amountToRebalance),
                        priority: Math.abs(difference) > 10 ? 'high' : 'medium'
                    });
                }
            });
        });
        
        // Sort by priority and amount
        actions.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority === 'high' ? -1 : 1;
            }
            return Math.abs(b.differencePercentage) - Math.abs(a.differencePercentage);
        });
        
        return actions;
    },
    
    // Calculate portfolio metrics
    calculatePortfolioMetrics: function(portfolio) {
        let expectedReturn = 0;
        let totalVolatility = 0;
        let totalAllocation = 0;
        
        Object.keys(portfolio).forEach(category => {
            Object.keys(portfolio[category]).forEach(asset => {
                const allocation = portfolio[category][asset] / 100;
                const assetData = this.assetClasses[category][asset];
                
                if (assetData && allocation > 0) {
                    expectedReturn += allocation * assetData.expectedReturn;
                    totalVolatility += Math.pow(allocation * assetData.volatility, 2);
                    totalAllocation += allocation;
                }
            });
        });
        
        // Calculate Sharpe ratio (assuming 2% risk-free rate)
        const riskFreeRate = 2.0;
        const sharpeRatio = totalVolatility > 0 ? 
            (expectedReturn - riskFreeRate) / Math.sqrt(totalVolatility) : 0;
        
        // Calculate diversification score
        const diversificationScore = this.calculateDiversificationScore(portfolio);
        
        return {
            expectedReturn: expectedReturn,
            volatility: Math.sqrt(totalVolatility),
            sharpeRatio: sharpeRatio,
            diversificationScore: diversificationScore,
            riskScore: this.calculateRiskScore(portfolio)
        };
    },
    
    // Generate recommendations
    generateRecommendations: function(currentPortfolio, optimalPortfolio, inputs, language) {
        const recommendations = [];
        const content = this.getContent(language);
        
        // Age-based recommendations
        const currentAge = parseInt(inputs.currentAge || 30);
        const retirementAge = parseInt(inputs.retirementAge || 67);
        const yearsToRetirement = retirementAge - currentAge;
        
        if (yearsToRetirement < 10) {
            recommendations.push({
                type: 'age_based',
                priority: 'high',
                title: content.recommendations.nearRetirement.title,
                description: content.recommendations.nearRetirement.description,
                action: content.recommendations.nearRetirement.action
            });
        }
        
        // Risk-based recommendations
        const currentStockAllocation = (currentPortfolio.stocks.domestic || 0) + 
                                      (currentPortfolio.stocks.international || 0) + 
                                      (currentPortfolio.stocks.emerging || 0);
        const optimalStockAllocation = (optimalPortfolio.stocks.domestic || 0) + 
                                      (optimalPortfolio.stocks.international || 0) + 
                                      (optimalPortfolio.stocks.emerging || 0);
        
        if (currentStockAllocation > optimalStockAllocation + 10) {
            recommendations.push({
                type: 'risk_reduction',
                priority: 'high',
                title: content.recommendations.reduceRisk.title,
                description: content.recommendations.reduceRisk.description.replace('{current}', Math.round(currentStockAllocation)).replace('{optimal}', Math.round(optimalStockAllocation)),
                action: content.recommendations.reduceRisk.action
            });
        }
        
        // Diversification recommendations
        const diversificationScore = this.calculateDiversificationScore(currentPortfolio);
        if (diversificationScore < 60) {
            recommendations.push({
                type: 'diversification',
                priority: 'medium',
                title: content.recommendations.improveDiversification.title,
                description: content.recommendations.improveDiversification.description,
                action: content.recommendations.improveDiversification.action
            });
        }
        
        // Cash allocation recommendations
        if (currentPortfolio.cash.savings > 20) {
            recommendations.push({
                type: 'cash_reduction',
                priority: 'medium',
                title: content.recommendations.reduceCash.title,
                description: content.recommendations.reduceCash.description.replace('{percentage}', Math.round(currentPortfolio.cash.savings)),
                action: content.recommendations.reduceCash.action
            });
        }
        
        // International diversification
        const internationalExposure = (currentPortfolio.stocks.international || 0) + 
                                     (currentPortfolio.stocks.emerging || 0);
        if (internationalExposure < 15) {
            recommendations.push({
                type: 'international',
                priority: 'low',
                title: content.recommendations.addInternational.title,
                description: content.recommendations.addInternational.description,
                action: content.recommendations.addInternational.action
            });
        }
        
        return recommendations;
    },
    
    // Create implementation plan
    createImplementationPlan: function(rebalancingActions, language) {
        const content = this.getContent(language);
        const plan = {
            immediate: [],
            shortTerm: [],
            longTerm: []
        };
        
        rebalancingActions.forEach(action => {
            const step = {
                action: action.action === 'buy' ? content.actions.buy : content.actions.sell,
                asset: this.assetClasses[action.category][action.asset].name[language],
                amount: action.amount,
                percentage: action.differencePercentage,
                reason: action.priority === 'high' ? 
                    content.reasons.highPriority : content.reasons.rebalancing
            };
            
            if (action.priority === 'high') {
                plan.immediate.push(step);
            } else if (Math.abs(action.differencePercentage) > 7) {
                plan.shortTerm.push(step);
            } else {
                plan.longTerm.push(step);
            }
        });
        
        return plan;
    },
    
    // Helper functions
    calculateTotalAssets: function(inputs) {
        return parseFloat(inputs.currentSavings || 0) +
               parseFloat(inputs.currentPersonalPortfolio || 0) +
               parseFloat(inputs.currentRealEstate || 0) +
               parseFloat(inputs.currentCrypto || 0) +
               parseFloat(inputs.currentTrainingFund || 0);
    },
    
    getEmptyPortfolio: function() {
        return {
            stocks: { domestic: 0, international: 0, emerging: 0 },
            bonds: { government: 0, corporate: 0, highYield: 0 },
            alternatives: { realEstate: 0, commodities: 0, crypto: 0 },
            cash: { savings: 0 }
        };
    },
    
    calculateDiversificationScore: function(portfolio) {
        let score = 100;
        let assetCount = 0;
        let maxAllocation = 0;
        
        Object.values(portfolio).forEach(category => {
            Object.values(category).forEach(allocation => {
                if (allocation > 0) {
                    assetCount++;
                    maxAllocation = Math.max(maxAllocation, allocation);
                }
            });
        });
        
        // Penalize concentration
        if (maxAllocation > 40) score -= (maxAllocation - 40);
        
        // Reward diversification
        score = Math.min(100, score + (assetCount * 5));
        
        // Penalize too few asset classes
        if (assetCount < 3) score -= 20;
        
        return Math.max(0, Math.round(score));
    },
    
    calculateRiskScore: function(portfolio) {
        const stockAllocation = (portfolio.stocks?.domestic || 0) + 
                               (portfolio.stocks?.international || 0) + 
                               (portfolio.stocks?.emerging || 0);
        const alternativeAllocation = (portfolio.alternatives?.realEstate || 0) + 
                                     (portfolio.alternatives?.commodities || 0) + 
                                     (portfolio.alternatives?.crypto || 0);
        
        // Base risk on stock and alternative allocation
        let riskScore = (stockAllocation * 0.7) + (alternativeAllocation * 0.3);
        
        // Adjust for crypto exposure
        if (portfolio.alternatives?.crypto > 5) {
            riskScore += portfolio.alternatives.crypto * 0.5;
        }
        
        return Math.min(100, Math.round(riskScore));
    },
    
    getContent: function(language) {
        const content = {
            he: {
                recommendations: {
                    nearRetirement: {
                        title: 'התאמת תיק לפרישה קרובה',
                        description: 'אתה מתקרב לפרישה. מומלץ להפחית סיכון',
                        action: 'העבר נכסים למכשירים סולידיים יותר'
                    },
                    reduceRisk: {
                        title: 'הפחתת סיכון',
                        description: 'הקצאת המניות הנוכחית ({current}%) גבוהה מהמומלץ ({optimal}%)',
                        action: 'שקול מכירת חלק מהמניות והעברה לאג"ח'
                    },
                    improveDiversification: {
                        title: 'שיפור פיזור',
                        description: 'התיק שלך מרוכז מדי בנכסים מעטים',
                        action: 'הוסף נכסים מסוגים שונים לפיזור סיכון'
                    },
                    reduceCash: {
                        title: 'הפחתת מזומן',
                        description: 'יש לך {percentage}% במזומן - גבוה מדי',
                        action: 'השקע חלק מהמזומן בנכסים מניבים'
                    },
                    addInternational: {
                        title: 'הוספת חשיפה בינלאומית',
                        description: 'חשיפה נמוכה לשווקים בינלאומיים',
                        action: 'שקול הוספת מניות או קרנות בינלאומיות'
                    }
                },
                actions: {
                    buy: 'רכוש',
                    sell: 'מכור'
                },
                reasons: {
                    highPriority: 'סטייה משמעותית מהיעד',
                    rebalancing: 'איזון תיק'
                }
            },
            en: {
                recommendations: {
                    nearRetirement: {
                        title: 'Adjust Portfolio for Near Retirement',
                        description: 'You are approaching retirement. Consider reducing risk',
                        action: 'Shift assets to more conservative instruments'
                    },
                    reduceRisk: {
                        title: 'Reduce Risk',
                        description: 'Current stock allocation ({current}%) is higher than recommended ({optimal}%)',
                        action: 'Consider selling some stocks and moving to bonds'
                    },
                    improveDiversification: {
                        title: 'Improve Diversification',
                        description: 'Your portfolio is too concentrated in few assets',
                        action: 'Add different asset types to spread risk'
                    },
                    reduceCash: {
                        title: 'Reduce Cash Holdings',
                        description: 'You have {percentage}% in cash - too high',
                        action: 'Invest some cash in income-producing assets'
                    },
                    addInternational: {
                        title: 'Add International Exposure',
                        description: 'Low exposure to international markets',
                        action: 'Consider adding international stocks or funds'
                    }
                },
                actions: {
                    buy: 'Buy',
                    sell: 'Sell'
                },
                reasons: {
                    highPriority: 'Significant deviation from target',
                    rebalancing: 'Portfolio rebalancing'
                }
            }
        };
        
        return content[language] || content.en;
    }
};

// Export for browser usage
if (typeof window !== 'undefined') {
    window.PortfolioOptimizer = PortfolioOptimizer;
    console.log('✅ PortfolioOptimizer utility loaded successfully');
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioOptimizer;
}