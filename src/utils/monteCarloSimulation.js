// Monte Carlo Risk Modeling for Retirement Planning
// Provides probabilistic projections and risk analysis for retirement outcomes

window.monteCarloSimulation = {
    
    // Asset class risk parameters (historical volatility and correlation data)
    assetParameters: {
        pension: {
            expectedReturn: 7.0,
            volatility: 12.0,
            distribution: 'normal',
            correlations: { stocks: 0.8, bonds: 0.6, realEstate: 0.4, crypto: 0.3 }
        },
        trainingFund: {
            expectedReturn: 6.5,
            volatility: 10.0,
            distribution: 'normal',
            correlations: { stocks: 0.7, bonds: 0.8, realEstate: 0.3, crypto: 0.2 }
        },
        personalPortfolio: {
            stocks: {
                expectedReturn: 9.0,
                volatility: 16.0,
                distribution: 'normal'
            },
            bonds: {
                expectedReturn: 4.5,
                volatility: 6.0,
                distribution: 'normal'
            }
        },
        realEstate: {
            expectedReturn: 6.0,
            volatility: 14.0,
            distribution: 'normal',
            correlations: { stocks: 0.4, bonds: 0.2 }
        },
        crypto: {
            expectedReturn: 15.0,
            volatility: 60.0,
            distribution: 'lognormal', // More appropriate for crypto
            correlations: { stocks: 0.3, bonds: 0.1 }
        },
        inflation: {
            expectedReturn: 2.5,
            volatility: 1.5,
            distribution: 'normal'
        }
    },
    
    // Economic scenario parameters
    economicScenarios: {
        recession: {
            probability: 0.15, // 15% chance in any given year
            stockReturnMultiplier: -0.2, // 20% loss
            bondReturnMultiplier: 1.1,   // 10% gain (flight to safety)
            realEstateReturnMultiplier: -0.1, // 10% loss
            inflationMultiplier: 0.5,    // Lower inflation
            duration: 1.2 // Average recession length in years
        },
        expansion: {
            probability: 0.65, // 65% chance - normal growth
            stockReturnMultiplier: 1.0,
            bondReturnMultiplier: 1.0,
            realEstateReturnMultiplier: 1.0,
            inflationMultiplier: 1.0,
            duration: 5.0
        },
        boom: {
            probability: 0.15, // 15% chance - high growth
            stockReturnMultiplier: 1.5,
            bondReturnMultiplier: 0.8,
            realEstateReturnMultiplier: 1.3,
            inflationMultiplier: 1.2,
            duration: 2.0
        },
        stagflation: {
            probability: 0.05, // 5% chance - high inflation, low growth
            stockReturnMultiplier: 0.3,
            bondReturnMultiplier: -0.2,
            realEstateReturnMultiplier: 0.8,
            inflationMultiplier: 2.0,
            duration: 2.5
        }
    },
    
    // Run Monte Carlo simulation
    runSimulation: function(inputs, projectionYears = 30, simulations = 10000, language = 'en') {
        const results = {
            simulations: simulations,
            projectionYears: projectionYears,
            outcomes: [],
            statistics: {},
            riskMetrics: {},
            recommendations: [],
            scenarios: {}
        };
        
        // Pre-calculate some constants
        const currentAge = parseInt(inputs.currentAge || 30);
        const retirementAge = parseInt(inputs.retirementAge || 67);
        const yearsToRetirement = retirementAge - currentAge;
        const inflationRate = parseFloat(inputs.inflationRate || 2.5) / 100;
        
        console.log(`Starting Monte Carlo simulation with ${simulations} iterations...`);
        
        // Run simulations
        for (let sim = 0; sim < simulations; sim++) {
            const outcome = this.runSingleSimulation(inputs, projectionYears, yearsToRetirement);
            results.outcomes.push(outcome);
        }
        
        // Calculate statistics
        results.statistics = this.calculateStatistics(results.outcomes);
        results.riskMetrics = this.calculateRiskMetrics(results.outcomes, inputs);
        results.scenarios = this.analyzeScenarios(results.outcomes);
        results.recommendations = this.generateRiskRecommendations(results, inputs, language);
        
        console.log('Monte Carlo simulation completed');
        return results;
    },
    
    // Run a single simulation path
    runSingleSimulation: function(inputs, projectionYears, yearsToRetirement) {
        const outcome = {
            yearlyResults: [],
            finalPortfolioValue: 0,
            finalMonthlyIncome: 0,
            inflationAdjustedIncome: 0,
            successProbability: 0,
            shortfallRisk: 0,
            maxDrawdown: 0,
            economicEvents: []
        };
        
        // Initialize portfolio values
        let portfolioValue = {
            pension: parseFloat(inputs.currentSavings || 0),
            trainingFund: parseFloat(inputs.currentTrainingFund || 0),
            personalPortfolio: parseFloat(inputs.currentPersonalPortfolio || 0),
            realEstate: parseFloat(inputs.currentRealEstate || 0),
            crypto: parseFloat(inputs.currentCrypto || 0)
        };
        
        let totalValue = Object.values(portfolioValue).reduce((a, b) => a + b, 0);
        let maxValue = totalValue;
        let cumulativeInflation = 1.0;
        
        // Simulate each year
        for (let year = 1; year <= projectionYears; year++) {
            const yearResult = this.simulateYear(portfolioValue, inputs, year, yearsToRetirement);
            
            // Update portfolio values
            Object.keys(portfolioValue).forEach(asset => {
                portfolioValue[asset] *= (1 + yearResult.returns[asset]);
                
                // Add contributions if still working
                if (year <= yearsToRetirement) {
                    portfolioValue[asset] += yearResult.contributions[asset] || 0;
                }
            });
            
            const newTotalValue = Object.values(portfolioValue).reduce((a, b) => a + b, 0);
            
            // Track drawdown
            if (newTotalValue > maxValue) {
                maxValue = newTotalValue;
            }
            const currentDrawdown = (maxValue - newTotalValue) / maxValue;
            outcome.maxDrawdown = Math.max(outcome.maxDrawdown, currentDrawdown);
            
            // Update cumulative inflation
            cumulativeInflation *= (1 + yearResult.inflation);
            
            // Store yearly results
            outcome.yearlyResults.push({
                year: year,
                totalValue: newTotalValue,
                realValue: newTotalValue / cumulativeInflation,
                inflation: yearResult.inflation,
                returns: yearResult.returns,
                economicScenario: yearResult.economicScenario
            });
            
            totalValue = newTotalValue;
        }
        
        // Calculate final outcomes
        outcome.finalPortfolioValue = totalValue;
        outcome.finalMonthlyIncome = totalValue * 0.04 / 12; // 4% withdrawal rule
        outcome.inflationAdjustedIncome = outcome.finalMonthlyIncome / cumulativeInflation;
        
        // Calculate success metrics
        const targetMonthlyIncome = parseFloat(inputs.targetMonthlyIncome || 10000);
        outcome.successProbability = outcome.inflationAdjustedIncome >= targetMonthlyIncome ? 1 : 0;
        outcome.shortfallRisk = Math.max(0, targetMonthlyIncome - outcome.inflationAdjustedIncome) / targetMonthlyIncome;
        
        return outcome;
    },
    
    // Simulate a single year
    simulateYear: function(portfolioValue, inputs, year, yearsToRetirement) {
        const yearResult = {
            returns: {},
            contributions: {},
            inflation: 0,
            economicScenario: 'expansion'
        };
        
        // Determine economic scenario
        const rand = Math.random();
        let cumulativeProbability = 0;
        for (const [scenario, params] of Object.entries(this.economicScenarios)) {
            cumulativeProbability += params.probability;
            if (rand <= cumulativeProbability) {
                yearResult.economicScenario = scenario;
                break;
            }
        }
        
        const scenarioParams = this.economicScenarios[yearResult.economicScenario];
        
        // Generate inflation
        yearResult.inflation = Math.max(0, this.generateRandomReturn(
            this.assetParameters.inflation.expectedReturn,
            this.assetParameters.inflation.volatility,
            'normal'
        ) * scenarioParams.inflationMultiplier) / 100;
        
        // Generate asset returns
        Object.keys(portfolioValue).forEach(asset => {
            if (portfolioValue[asset] > 0) {
                let baseReturn = 0;
                
                switch (asset) {
                    case 'pension':
                        baseReturn = this.generateRandomReturn(
                            parseFloat(inputs.pensionReturn || this.assetParameters.pension.expectedReturn),
                            this.assetParameters.pension.volatility,
                            'normal'
                        );
                        break;
                    case 'trainingFund':
                        baseReturn = this.generateRandomReturn(
                            parseFloat(inputs.trainingFundReturn || this.assetParameters.trainingFund.expectedReturn),
                            this.assetParameters.trainingFund.volatility,
                            'normal'
                        );
                        break;
                    case 'personalPortfolio':
                        // Weighted average of stocks and bonds
                        const stockAllocation = parseFloat(inputs.stockPercentage || 60) / 100;
                        const bondAllocation = 1 - stockAllocation;
                        
                        const stockReturn = this.generateRandomReturn(
                            this.assetParameters.personalPortfolio.stocks.expectedReturn,
                            this.assetParameters.personalPortfolio.stocks.volatility,
                            'normal'
                        );
                        const bondReturn = this.generateRandomReturn(
                            this.assetParameters.personalPortfolio.bonds.expectedReturn,
                            this.assetParameters.personalPortfolio.bonds.volatility,
                            'normal'
                        );
                        
                        baseReturn = stockReturn * stockAllocation + bondReturn * bondAllocation;
                        break;
                    case 'realEstate':
                        baseReturn = this.generateRandomReturn(
                            parseFloat(inputs.realEstateReturn || this.assetParameters.realEstate.expectedReturn),
                            this.assetParameters.realEstate.volatility,
                            'normal'
                        );
                        break;
                    case 'crypto':
                        baseReturn = this.generateRandomReturn(
                            parseFloat(inputs.cryptoReturn || this.assetParameters.crypto.expectedReturn),
                            this.assetParameters.crypto.volatility,
                            'lognormal'
                        );
                        break;
                }
                
                // Apply economic scenario multiplier
                let multiplier = 1.0;
                switch (asset) {
                    case 'pension':
                    case 'personalPortfolio':
                        multiplier = scenarioParams.stockReturnMultiplier;
                        break;
                    case 'trainingFund':
                        multiplier = scenarioParams.bondReturnMultiplier;
                        break;
                    case 'realEstate':
                        multiplier = scenarioParams.realEstateReturnMultiplier;
                        break;
                    case 'crypto':
                        multiplier = scenarioParams.stockReturnMultiplier; // Crypto follows stock-like behavior in scenarios
                        break;
                }
                
                yearResult.returns[asset] = (baseReturn * multiplier) / 100;
            } else {
                yearResult.returns[asset] = 0;
            }
        });
        
        // Calculate contributions (if still working)
        if (year <= yearsToRetirement) {
            const monthlyContribution = parseFloat(inputs.monthlyContributions || 1000);
            yearResult.contributions.pension = monthlyContribution * 12 * 0.6; // 60% to pension
            yearResult.contributions.personalPortfolio = monthlyContribution * 12 * 0.4; // 40% to personal
        }
        
        return yearResult;
    },
    
    // Generate random return based on distribution type
    generateRandomReturn: function(mean, volatility, distribution = 'normal') {
        switch (distribution) {
            case 'normal':
                return this.normalRandom(mean, volatility);
            case 'lognormal':
                // For lognormal, mean and volatility are in log space
                const logMean = Math.log(mean / 100) - (volatility * volatility) / (2 * 10000);
                const logVol = volatility / 100;
                return (Math.exp(this.normalRandom(logMean, logVol)) - 1) * 100;
            default:
                return this.normalRandom(mean, volatility);
        }
    },
    
    // Box-Muller transformation for normal random numbers
    normalRandom: function(mean, stdDev) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdDev + mean;
    },
    
    // Calculate simulation statistics
    calculateStatistics: function(outcomes) {
        const finalValues = outcomes.map(o => o.finalPortfolioValue);
        const finalIncomes = outcomes.map(o => o.inflationAdjustedIncome);
        const maxDrawdowns = outcomes.map(o => o.maxDrawdown);
        
        return {
            portfolio: {
                mean: this.mean(finalValues),
                median: this.percentile(finalValues, 50),
                std: this.standardDeviation(finalValues),
                min: Math.min(...finalValues),
                max: Math.max(...finalValues),
                percentiles: {
                    p10: this.percentile(finalValues, 10),
                    p25: this.percentile(finalValues, 25),
                    p75: this.percentile(finalValues, 75),
                    p90: this.percentile(finalValues, 90)
                }
            },
            income: {
                mean: this.mean(finalIncomes),
                median: this.percentile(finalIncomes, 50),
                std: this.standardDeviation(finalIncomes),
                min: Math.min(...finalIncomes),
                max: Math.max(...finalIncomes),
                percentiles: {
                    p10: this.percentile(finalIncomes, 10),
                    p25: this.percentile(finalIncomes, 25),
                    p75: this.percentile(finalIncomes, 75),
                    p90: this.percentile(finalIncomes, 90)
                }
            },
            drawdown: {
                mean: this.mean(maxDrawdowns),
                median: this.percentile(maxDrawdowns, 50),
                max: Math.max(...maxDrawdowns),
                percentiles: {
                    p75: this.percentile(maxDrawdowns, 75),
                    p90: this.percentile(maxDrawdowns, 90),
                    p95: this.percentile(maxDrawdowns, 95)
                }
            }
        };
    },
    
    // Calculate risk metrics
    calculateRiskMetrics: function(outcomes, inputs) {
        const targetIncome = parseFloat(inputs.targetMonthlyIncome || 10000);
        const successfulOutcomes = outcomes.filter(o => o.inflationAdjustedIncome >= targetIncome);
        
        const shortfallRisks = outcomes.map(o => o.shortfallRisk).filter(r => r > 0);
        
        return {
            successProbability: successfulOutcomes.length / outcomes.length,
            shortfallProbability: (outcomes.length - successfulOutcomes.length) / outcomes.length,
            averageShortfall: shortfallRisks.length > 0 ? this.mean(shortfallRisks) : 0,
            worstCaseShortfall: shortfallRisks.length > 0 ? Math.max(...shortfallRisks) : 0,
            valueAtRisk: {
                var95: this.percentile(outcomes.map(o => o.finalPortfolioValue), 5),
                var99: this.percentile(outcomes.map(o => o.finalPortfolioValue), 1)
            },
            expectedShortfall: this.calculateExpectedShortfall(outcomes, targetIncome)
        };
    },
    
    // Calculate Expected Shortfall (Conditional VaR)
    calculateExpectedShortfall: function(outcomes, targetIncome) {
        const sortedIncomes = outcomes.map(o => o.inflationAdjustedIncome).sort((a, b) => a - b);
        const var95Index = Math.floor(outcomes.length * 0.05);
        const worstOutcomes = sortedIncomes.slice(0, var95Index);
        
        return worstOutcomes.length > 0 ? this.mean(worstOutcomes) : 0;
    },
    
    // Analyze economic scenarios
    analyzeScenarios: function(outcomes) {
        const scenarios = {};
        
        outcomes.forEach(outcome => {
            outcome.yearlyResults.forEach(year => {
                if (!scenarios[year.economicScenario]) {
                    scenarios[year.economicScenario] = {
                        occurrences: 0,
                        averageReturn: 0,
                        returns: []
                    };
                }
                scenarios[year.economicScenario].occurrences++;
                scenarios[year.economicScenario].returns.push(year.totalValue);
            });
        });
        
        // Calculate averages
        Object.keys(scenarios).forEach(scenario => {
            scenarios[scenario].averageReturn = this.mean(scenarios[scenario].returns);
            scenarios[scenario].frequency = scenarios[scenario].occurrences / (outcomes.length * outcomes[0].yearlyResults.length);
        });
        
        return scenarios;
    },
    
    // Generate risk-based recommendations
    generateRiskRecommendations: function(results, inputs, language = 'en') {
        const recommendations = [];
        const content = language === 'he' ? this.getContentHe() : this.getContentEn();
        
        // Success probability recommendations
        if (results.riskMetrics.successProbability < 0.7) {
            recommendations.push({
                type: 'low_success_probability',
                priority: 'high',
                title: content.lowSuccess.title,
                description: content.lowSuccess.description.replace('{probability}', 
                    Math.round(results.riskMetrics.successProbability * 100)),
                actions: [
                    content.lowSuccess.increaseContributions,
                    content.lowSuccess.extendWorkingYears,
                    content.lowSuccess.increaseRisk,
                    content.lowSuccess.reduceExpenses
                ]
            });
        } else if (results.riskMetrics.successProbability > 0.9) {
            recommendations.push({
                type: 'high_success_probability',
                priority: 'low',
                title: content.highSuccess.title,
                description: content.highSuccess.description.replace('{probability}', 
                    Math.round(results.riskMetrics.successProbability * 100)),
                actions: [
                    content.highSuccess.reduceRisk,
                    content.highSuccess.retireEarlier,
                    content.highSuccess.increaseLifestyle
                ]
            });
        }
        
        // High drawdown risk
        if (results.statistics.drawdown.percentiles.p90 > 0.4) {
            recommendations.push({
                type: 'high_drawdown_risk',
                priority: 'medium',
                title: content.highDrawdown.title,
                description: content.highDrawdown.description.replace('{drawdown}', 
                    Math.round(results.statistics.drawdown.percentiles.p90 * 100)),
                actions: [
                    content.highDrawdown.diversify,
                    content.highDrawdown.reduceBonds,
                    content.highDrawdown.addAlternatives
                ]
            });
        }
        
        // Shortfall risk
        if (results.riskMetrics.averageShortfall > 0.2) {
            recommendations.push({
                type: 'shortfall_risk',
                priority: 'high',
                title: content.shortfall.title,
                description: content.shortfall.description.replace('{shortfall}', 
                    Math.round(results.riskMetrics.averageShortfall * 100)),
                actions: [
                    content.shortfall.reviewTargets,
                    content.shortfall.boostSavings,
                    content.shortfall.optimizeAllocation
                ]
            });
        }
        
        return recommendations;
    },
    
    // Helper functions for statistical calculations
    mean: function(array) {
        return array.reduce((a, b) => a + b, 0) / array.length;
    },
    
    standardDeviation: function(array) {
        const mean = this.mean(array);
        const squaredDiffs = array.map(value => Math.pow(value - mean, 2));
        return Math.sqrt(this.mean(squaredDiffs));
    },
    
    percentile: function(array, p) {
        const sorted = [...array].sort((a, b) => a - b);
        const index = (p / 100) * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;
        
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    },
    
    // Multi-language content
    getContentEn: function() {
        return {
            lowSuccess: {
                title: 'Low Retirement Success Probability',
                description: 'Only {probability}% chance of meeting retirement income goals',
                increaseContributions: 'Increase monthly savings contributions',
                extendWorkingYears: 'Consider working 2-3 additional years',
                increaseRisk: 'Consider higher-return investments',
                reduceExpenses: 'Review and reduce retirement expense targets'
            },
            highSuccess: {
                title: 'High Retirement Success Probability',
                description: '{probability}% chance of exceeding retirement goals',
                reduceRisk: 'Consider reducing portfolio risk',
                retireEarlier: 'You may be able to retire earlier',
                increaseLifestyle: 'Consider upgrading retirement lifestyle plans'
            },
            highDrawdown: {
                title: 'High Portfolio Drawdown Risk',
                description: '90% chance of experiencing {drawdown}% portfolio decline',
                diversify: 'Improve portfolio diversification',
                reduceBonds: 'Consider reducing bond allocation during accumulation',
                addAlternatives: 'Add alternative investments for stability'
            },
            shortfall: {
                title: 'Significant Shortfall Risk',
                description: 'Average income shortfall of {shortfall}% in worst scenarios',
                reviewTargets: 'Review retirement income targets',
                boostSavings: 'Significantly boost monthly savings',
                optimizeAllocation: 'Optimize asset allocation for better risk-adjusted returns'
            }
        };
    },
    
    getContentHe: function() {
        return {
            lowSuccess: {
                title: 'הסתברות נמוכה להצלחה בפרישה',
                description: 'רק {probability}% סיכוי לעמוד ביעדי הכנסה בפרישה',
                increaseContributions: 'הגדל הפקדות חודשיות',
                extendWorkingYears: 'שקול עבודה 2-3 שנים נוספות',
                increaseRisk: 'שקול השקעות עם תשואה גבוהה יותר',
                reduceExpenses: 'סקור והקטן יעדי הוצאות פרישה'
            },
            highSuccess: {
                title: 'הסתברות גבוהה להצלחה בפרישה',
                description: '{probability}% סיכוי לחרוג מיעדי הפרישה',
                reduceRisk: 'שקול הפחתת סיכון התיק',
                retireEarlier: 'תוכל לפרוש מוקדם יותר',
                increaseLifestyle: 'שקול שיפור תוכניות אורח חיים בפרישה'
            },
            highDrawdown: {
                title: 'סיכון גבוה לירידת תיק',
                description: '90% סיכוי לחוות ירידה של {drawdown}% בתיק',
                diversify: 'שפר פיזור תיק ההשקעות',
                reduceBonds: 'שקול הפחתת הקצאת אג״ח בתקופת צבירה',
                addAlternatives: 'הוסף השקעות אלטרנטיביות ליציבות'
            },
            shortfall: {
                title: 'סיכון מחסור משמעותי',
                description: 'מחסור הכנסה ממוצע של {shortfall}% בתרחישים גרועים',
                reviewTargets: 'סקור יעדי הכנסה בפרישה',
                boostSavings: 'הגדל משמעותית חיסכון חודשי',
                optimizeAllocation: 'אופטם הקצאת נכסים לתשואה מותאמת סיכון טובה יותר'
            }
        };
    }
};

// Export for global access
window.runMonteCarloSimulation = window.monteCarloSimulation.runSimulation.bind(window.monteCarloSimulation);

console.log('✅ Monte Carlo Risk Modeling system loaded successfully');