// Systematic Withdrawal Strategies for Retirement Planning
// Implements various withdrawal methods with tax optimization and longevity planning

window.withdrawalStrategies = {
    
    // Withdrawal strategy definitions
    strategies: {
        fixedDollar: {
            name: { en: 'Fixed Dollar Amount', he: 'סכום קבוע בש״ח' },
            description: { 
                en: 'Withdraw same dollar amount each year, adjusted for inflation',
                he: 'משוך אותו סכום כספי בכל שנה, מותאם לאינפלציה'
            },
            pros: ['Predictable income', 'Easy to budget', 'Inflation protection'],
            cons: ['May deplete portfolio in down markets', 'No flexibility for market conditions'],
            suitability: 'Conservative retirees who prioritize income predictability'
        },
        fixedPercentage: {
            name: { en: 'Fixed Percentage (4% Rule)', he: 'אחוז קבוע (חוק ה-4%)' },
            description: { 
                en: 'Withdraw fixed percentage of portfolio value each year',
                he: 'משוך אחוז קבוע מערך התיק בכל שנה'
            },
            pros: ['Portfolio preservation', 'Scales with market performance', 'Historically safe'],
            cons: ['Variable income', 'May be too conservative in bull markets'],
            suitability: 'Balanced approach for most retirees'
        },
        totalReturn: {
            name: { en: 'Total Return Strategy', he: 'אסטרטגיית תשואה כוללת' },
            description: { 
                en: 'Focus on total return, withdraw as needed without regard to income vs capital gains',
                he: 'התמקד בתשואה כוללת, משוך לפי צורך ללא הבחנה בין הכנסה לרווחי הון'
            },
            pros: ['Tax efficient', 'Maximum growth potential', 'Flexible'],
            cons: ['Complex tax planning', 'Requires active management', 'Variable income'],
            suitability: 'Sophisticated investors with flexible income needs'
        },
        bucketStrategy: {
            name: { en: 'Bucket Strategy', he: 'אסטרטגיית דליים' },
            description: { 
                en: 'Divide portfolio into buckets by time horizon and risk level',
                he: 'חלק תיק לדליים לפי אופק זמן ורמת סיכון'
            },
            pros: ['Reduces sequence risk', 'Peace of mind', 'Systematic approach'],
            cons: ['Complex to implement', 'May underperform', 'Requires rebalancing'],
            suitability: 'Risk-averse retirees concerned about market timing'
        },
        dynamicWithdrawal: {
            name: { en: 'Dynamic Withdrawal', he: 'משיכה דינמית' },
            description: { 
                en: 'Adjust withdrawal rate based on portfolio performance and market conditions',
                he: 'התאם שיעור משיכה בהתאם לביצועי התיק ותנאי השוק'
            },
            pros: ['Adapts to market conditions', 'Higher expected income', 'Portfolio preservation'],
            cons: ['Variable income', 'Complex rules', 'Requires discipline'],
            suitability: 'Flexible retirees comfortable with variable income'
        },
        floorCeiling: {
            name: { en: 'Floor and Ceiling', he: 'רצפה ותקרה' },
            description: { 
                en: 'Set minimum and maximum withdrawal amounts regardless of portfolio value',
                he: 'קבע סכומי משיכה מינימליים ומקסימליים ללא קשר לערך התיק'
            },
            pros: ['Income predictability', 'Upside participation', 'Risk management'],
            cons: ['May not preserve capital', 'Complex to optimize', 'Still some variability'],
            suitability: 'Retirees who want some predictability with upside potential'
        }
    },
    
    // Israeli-specific withdrawal considerations
    israeliWithdrawalRules: {
        pension: {
            earlyWithdrawalAge: 60,
            fullWithdrawalAge: 67,
            taxRates: {
                early: 35,      // 35% tax for early withdrawal
                regular: 15,    // 15% tax for regular withdrawal
                exempt: 0       // Tax-free portion
            },
            monthlyWithdrawalLimit: null, // No limit for pension
            annualWithdrawalLimit: null
        },
        trainingFund: {
            earlyWithdrawalAge: null,
            fullWithdrawalAge: null,
            withdrawalConditions: ['8 years from start', 'career change', 'unemployment'],
            taxRates: {
                regular: 25,    // 25% tax on gains
                principal: 0    // Tax-free on principal
            }
        },
        personalPortfolio: {
            capitalGainsTax: 25,        // 25% on gains
            dividendTax: 25,            // 25% on dividends
            foreignTax: 25,             // 25% on foreign investments
            taxOptimizationStrategies: [
                'Tax loss harvesting',
                'Asset location optimization',
                'Roth conversions (if applicable)'
            ]
        }
    },
    
    // Calculate withdrawal strategy outcomes
    calculateWithdrawalStrategy: function(inputs, strategy, projectionYears = 30, language = 'en') {
        const results = {
            strategy: strategy,
            projectionYears: projectionYears,
            yearlyProjections: [],
            totalWithdrawn: 0,
            finalPortfolioValue: 0,
            depletionYear: null,
            averageAnnualIncome: 0,
            inflationAdjustedIncome: 0,
            taxOptimization: {},
            riskMetrics: {},
            recommendations: []
        };
        
        // Initialize portfolio
        let portfolioValue = {
            pension: parseFloat(inputs.currentSavings || 0),
            trainingFund: parseFloat(inputs.currentTrainingFund || 0),
            personalPortfolio: parseFloat(inputs.currentPersonalPortfolio || 0),
            realEstate: parseFloat(inputs.currentRealEstate || 0),
            crypto: parseFloat(inputs.currentCrypto || 0)
        };
        
        const totalInitialValue = Object.values(portfolioValue).reduce((a, b) => a + b, 0);
        const inflationRate = parseFloat(inputs.inflationRate || 2.5) / 100;
        const retirementAge = parseInt(inputs.retirementAge || 67);
        
        // Strategy-specific parameters
        const strategyParams = this.getStrategyParameters(strategy, inputs);
        
        // Simulate each year
        for (let year = 1; year <= projectionYears; year++) {
            const currentAge = retirementAge + year - 1;
            const yearResult = this.simulateWithdrawalYear(
                portfolioValue,
                inputs,
                strategy,
                strategyParams,
                year,
                currentAge,
                results
            );
            
            results.yearlyProjections.push(yearResult);
            results.totalWithdrawn += yearResult.withdrawal;
            
            // Check for depletion
            const totalValue = Object.values(portfolioValue).reduce((a, b) => a + b, 0);
            if (totalValue <= 0 && !results.depletionYear) {
                results.depletionYear = year;
            }
        }
        
        // Calculate final metrics
        results.finalPortfolioValue = Object.values(portfolioValue).reduce((a, b) => a + b, 0);
        results.averageAnnualIncome = results.totalWithdrawn / projectionYears;
        results.inflationAdjustedIncome = results.averageAnnualIncome / Math.pow(1 + inflationRate, projectionYears / 2);
        
        // Calculate tax optimization opportunities
        results.taxOptimization = this.analyzeTaxOptimization(results, inputs);
        
        // Calculate risk metrics
        results.riskMetrics = this.calculateWithdrawalRiskMetrics(results, inputs);
        
        // Generate recommendations
        results.recommendations = this.generateWithdrawalRecommendations(results, inputs, language);
        
        return results;
    },
    
    // Get strategy-specific parameters
    getStrategyParameters: function(strategy, inputs) {
        const params = {};
        
        switch (strategy) {
            case 'fixedDollar':
                params.initialAmount = parseFloat(inputs.targetMonthlyIncome || 10000) * 12;
                params.inflationAdjustment = true;
                break;
            case 'fixedPercentage':
                params.withdrawalRate = parseFloat(inputs.withdrawalRate || 4) / 100;
                params.recalculateAnnually = false;
                break;
            case 'totalReturn':
                params.targetIncome = parseFloat(inputs.targetMonthlyIncome || 10000) * 12;
                params.maxWithdrawalRate = 0.06; // 6% maximum
                params.minWithdrawalRate = 0.02; // 2% minimum
                break;
            case 'bucketStrategy':
                params.buckets = {
                    conservative: 0.3,  // 3 years of expenses
                    moderate: 0.4,      // 7 years for growth
                    aggressive: 0.3     // Long-term growth
                };
                params.rebalanceFrequency = 2; // Every 2 years
                break;
            case 'dynamicWithdrawal':
                params.baseRate = 0.04;
                params.adjustmentFactor = 0.1; // 10% adjustment based on performance
                params.maxRate = 0.06;
                params.minRate = 0.025;
                break;
            case 'floorCeiling':
                params.floor = parseFloat(inputs.minimumIncome || 8000) * 12;
                params.ceiling = parseFloat(inputs.maximumIncome || 15000) * 12;
                params.baseRate = 0.04;
                break;
        }
        
        return params;
    },
    
    // Simulate one withdrawal year
    simulateWithdrawalYear: function(portfolioValue, inputs, strategy, params, year, age, previousResults) {
        const yearResult = {
            year: year,
            age: age,
            withdrawal: 0,
            taxes: 0,
            netIncome: 0,
            portfolioGrowth: 0,
            endingValue: 0,
            withdrawalRate: 0
        };
        
        const totalValue = Object.values(portfolioValue).reduce((a, b) => a + b, 0);
        const inflationRate = parseFloat(inputs.inflationRate || 2.5) / 100;
        
        // Calculate portfolio growth first
        const growthRates = {
            pension: (parseFloat(inputs.pensionReturn || 7) - 2) / 100, // Reduce return in retirement
            trainingFund: (parseFloat(inputs.trainingFundReturn || 6.5) - 2) / 100,
            personalPortfolio: (parseFloat(inputs.personalPortfolioReturn || 8) - 1.5) / 100,
            realEstate: (parseFloat(inputs.realEstateReturn || 6) - 1) / 100,
            crypto: (parseFloat(inputs.cryptoReturn || 15) - 5) / 100 // Much more conservative in retirement
        };
        
        Object.keys(portfolioValue).forEach(asset => {
            portfolioValue[asset] *= (1 + growthRates[asset]);
            yearResult.portfolioGrowth += portfolioValue[asset] * growthRates[asset];
        });
        
        // Calculate withdrawal based on strategy
        let withdrawal = 0;
        
        switch (strategy) {
            case 'fixedDollar':
                withdrawal = params.initialAmount * Math.pow(1 + inflationRate, year - 1);
                break;
                
            case 'fixedPercentage':
                const currentTotalValue = Object.values(portfolioValue).reduce((a, b) => a + b, 0);
                withdrawal = currentTotalValue * params.withdrawalRate;
                break;
                
            case 'totalReturn':
                withdrawal = Math.min(
                    params.targetIncome * Math.pow(1 + inflationRate, year - 1),
                    totalValue * params.maxWithdrawalRate
                );
                withdrawal = Math.max(withdrawal, totalValue * params.minWithdrawalRate);
                break;
                
            case 'bucketStrategy':
                // Simplified bucket strategy - withdraw from conservative bucket first
                const conservativeBucket = totalValue * params.buckets.conservative;
                withdrawal = Math.min(
                    params.targetIncome || (totalValue * 0.04),
                    conservativeBucket * 0.33 // 1/3 of conservative bucket per year
                );
                break;
                
            case 'dynamicWithdrawal':
                const performanceMultiplier = year > 1 ? 
                    (previousResults.yearlyProjections[year-2].portfolioGrowth > 0 ? 1.1 : 0.9) : 1.0;
                withdrawal = totalValue * params.baseRate * performanceMultiplier;
                withdrawal = Math.min(withdrawal, totalValue * params.maxRate);
                withdrawal = Math.max(withdrawal, totalValue * params.minRate);
                break;
                
            case 'floorCeiling':
                const baseWithdrawal = totalValue * params.baseRate;
                withdrawal = Math.max(params.floor, Math.min(params.ceiling, baseWithdrawal));
                break;
        }
        
        // Ensure we don't withdraw more than available
        withdrawal = Math.min(withdrawal, totalValue * 0.95); // Leave at least 5% in portfolio
        
        // Calculate tax-optimized withdrawal sequence
        const withdrawalSequence = this.calculateOptimalWithdrawalSequence(
            portfolioValue, withdrawal, inputs, age
        );
        
        // Execute withdrawals and calculate taxes
        let totalTaxes = 0;
        withdrawalSequence.forEach(w => {
            portfolioValue[w.asset] -= w.amount;
            totalTaxes += w.taxes;
        });
        
        yearResult.withdrawal = withdrawal;
        yearResult.taxes = totalTaxes;
        yearResult.netIncome = withdrawal - totalTaxes;
        yearResult.endingValue = Object.values(portfolioValue).reduce((a, b) => a + b, 0);
        yearResult.withdrawalRate = totalValue > 0 ? withdrawal / totalValue : 0;
        
        return yearResult;
    },
    
    // Calculate optimal withdrawal sequence for tax efficiency
    calculateOptimalWithdrawalSequence: function(portfolioValue, totalWithdrawal, inputs, age) {
        const sequence = [];
        let remainingWithdrawal = totalWithdrawal;
        
        // Israeli withdrawal priority (tax-optimized):
        // 1. Training fund (if conditions met and tax-advantaged)
        // 2. Personal portfolio (manage capital gains)
        // 3. Real estate (rental income first)
        // 4. Pension (last due to tax implications)
        // 5. Crypto (highest tax rate)
        
        const withdrawalPriority = this.getIsraeliWithdrawalPriority(inputs, age);
        
        withdrawalPriority.forEach(priority => {
            if (remainingWithdrawal > 0 && portfolioValue[priority.asset] > 0) {
                const availableAmount = portfolioValue[priority.asset];
                const withdrawAmount = Math.min(remainingWithdrawal, availableAmount * priority.maxPercentage);
                
                if (withdrawAmount > 0) {
                    const taxes = this.calculateWithdrawalTaxes(
                        priority.asset, withdrawAmount, inputs, age
                    );
                    
                    sequence.push({
                        asset: priority.asset,
                        amount: withdrawAmount,
                        taxes: taxes,
                        taxRate: taxes / withdrawAmount,
                        reason: priority.reason
                    });
                    
                    remainingWithdrawal -= withdrawAmount;
                }
            }
        });
        
        return sequence;
    },
    
    // Get Israeli-specific withdrawal priority
    getIsraeliWithdrawalPriority: function(inputs, age) {
        const country = inputs.country || 'israel';
        if (country !== 'israel') {
            // Generic priority for non-Israeli accounts
            return [
                { asset: 'personalPortfolio', maxPercentage: 0.8, reason: 'Lower tax rates' },
                { asset: 'realEstate', maxPercentage: 0.6, reason: 'Asset diversification' },
                { asset: 'pension', maxPercentage: 0.5, reason: 'Tax-deferred growth' },
                { asset: 'trainingFund', maxPercentage: 0.7, reason: 'Accessibility' },
                { asset: 'crypto', maxPercentage: 1.0, reason: 'Highest risk asset' }
            ];
        }
        
        // Israeli-specific priority
        const priority = [];
        
        // Training fund - if accessible (8+ years or conditions met)
        if (this.isTrainingFundAccessible(inputs, age)) {
            priority.push({
                asset: 'trainingFund',
                maxPercentage: 0.6,
                reason: 'Tax-advantaged withdrawal conditions met'
            });
        }
        
        // Personal portfolio - manage capital gains strategically
        priority.push({
            asset: 'personalPortfolio',
            maxPercentage: 0.7,
            reason: '25% capital gains tax, manageable through harvesting'
        });
        
        // Real estate - rental income and selective property sales
        priority.push({
            asset: 'realEstate',
            maxPercentage: 0.4,
            reason: 'Rental income + strategic property liquidation'
        });
        
        // Pension - last resort due to complexity
        if (age >= this.israeliWithdrawalRules.pension.fullWithdrawalAge) {
            priority.push({
                asset: 'pension',
                maxPercentage: 0.5,
                reason: 'Full withdrawal age reached, moderate tax rate'
            });
        } else if (age >= this.israeliWithdrawalRules.pension.earlyWithdrawalAge) {
            priority.push({
                asset: 'pension',
                maxPercentage: 0.3,
                reason: 'Early withdrawal with higher tax penalty'
            });
        }
        
        // Crypto - highest tax and risk
        priority.push({
            asset: 'crypto',
            maxPercentage: 1.0,
            reason: 'High risk asset, 25% tax on gains'
        });
        
        return priority;
    },
    
    // Check if training fund is accessible
    isTrainingFundAccessible: function(inputs, age) {
        // Simplified check - in practice would need employment history
        const workingYears = (inputs.retirementAge || 67) - (inputs.workStartAge || 25);
        return workingYears >= 8; // Assuming 8+ years of contributions
    },
    
    // Calculate taxes on withdrawal
    calculateWithdrawalTaxes: function(asset, amount, inputs, age) {
        const country = inputs.country || 'israel';
        
        if (country !== 'israel') {
            // Generic tax calculation
            switch (asset) {
                case 'personalPortfolio':
                    return amount * 0.15; // 15% capital gains
                case 'pension':
                    return amount * 0.20; // 20% ordinary income
                default:
                    return amount * 0.25; // 25% default
            }
        }
        
        // Israeli tax calculation
        switch (asset) {
            case 'pension':
                if (age >= this.israeliWithdrawalRules.pension.fullWithdrawalAge) {
                    return amount * (this.israeliWithdrawalRules.pension.taxRates.regular / 100);
                } else if (age >= this.israeliWithdrawalRules.pension.earlyWithdrawalAge) {
                    return amount * (this.israeliWithdrawalRules.pension.taxRates.early / 100);
                }
                return 0;
                
            case 'trainingFund':
                // Simplified - tax on gains only
                const gainPortion = 0.6; // Assume 60% of value is gains
                return amount * gainPortion * (this.israeliWithdrawalRules.trainingFund.taxRates.regular / 100);
                
            case 'personalPortfolio':
                // Capital gains tax
                const portfolioGainPortion = 0.4; // Assume 40% of value is gains
                return amount * portfolioGainPortion * (this.israeliWithdrawalRules.personalPortfolio.capitalGainsTax / 100);
                
            case 'realEstate':
                // Capital gains on property sales + rental income tax
                return amount * 0.25 * 0.25; // Assume 25% is taxable gains at 25% rate
                
            case 'crypto':
                // Capital gains tax (same as personal portfolio in Israel)
                const cryptoGainPortion = 0.7; // Assume 70% of value is gains
                return amount * cryptoGainPortion * 0.25;
                
            default:
                return 0;
        }
    },
    
    // Analyze tax optimization opportunities
    analyzeTaxOptimization: function(withdrawalResults, inputs) {
        const totalTaxes = withdrawalResults.yearlyProjections.reduce((sum, year) => sum + year.taxes, 0);
        const totalWithdrawn = withdrawalResults.totalWithdrawn;
        const effectiveTaxRate = totalWithdrawn > 0 ? totalTaxes / totalWithdrawn : 0;
        
        return {
            totalTaxes: totalTaxes,
            effectiveTaxRate: effectiveTaxRate,
            annualAverageTaxes: totalTaxes / withdrawalResults.projectionYears,
            optimizationOpportunities: [
                {
                    strategy: 'Asset Location Optimization',
                    potentialSavings: totalTaxes * 0.15,
                    description: 'Optimize which assets to withdraw from based on tax rates'
                },
                {
                    strategy: 'Tax Loss Harvesting',
                    potentialSavings: totalTaxes * 0.10,
                    description: 'Realize losses to offset capital gains'
                },
                {
                    strategy: 'Withdrawal Timing',
                    potentialSavings: totalTaxes * 0.08,
                    description: 'Time withdrawals to minimize tax bracket impacts'
                }
            ]
        };
    },
    
    // Calculate withdrawal-specific risk metrics
    calculateWithdrawalRiskMetrics: function(results, inputs) {
        const yearlyIncomes = results.yearlyProjections.map(y => y.netIncome);
        const yearlyRates = results.yearlyProjections.map(y => y.withdrawalRate);
        
        return {
            incomeVolatility: this.calculateVolatility(yearlyIncomes),
            maxWithdrawalRate: Math.max(...yearlyRates),
            minWithdrawalRate: Math.min(...yearlyRates),
            sequenceOfReturnsRisk: this.calculateSequenceRisk(results.yearlyProjections),
            longevityRisk: results.depletionYear ? (30 - results.depletionYear) : 0,
            inflationRisk: this.calculateInflationImpact(results, inputs)
        };
    },
    
    // Calculate sequence of returns risk
    calculateSequenceRisk: function(yearlyProjections) {
        // Simplified calculation - measures impact of early poor returns
        const earlyYears = yearlyProjections.slice(0, 5);
        const averageEarlyGrowth = earlyYears.reduce((sum, year) => 
            sum + (year.portfolioGrowth / year.endingValue), 0) / earlyYears.length;
        
        return averageEarlyGrowth < 0.02 ? 0.8 : 0.2; // High risk if early returns < 2%
    },
    
    // Calculate inflation impact on withdrawal strategy
    calculateInflationImpact: function(results, inputs) {
        const inflationRate = parseFloat(inputs.inflationRate || 2.5) / 100;
        const finalRealIncome = results.yearlyProjections[results.projectionYears - 1].netIncome / 
                               Math.pow(1 + inflationRate, results.projectionYears);
        const initialIncome = results.yearlyProjections[0].netIncome;
        
        return (initialIncome - finalRealIncome) / initialIncome; // Percentage loss of purchasing power
    },
    
    // Generate withdrawal strategy recommendations
    generateWithdrawalRecommendations: function(results, inputs, language = 'en') {
        const recommendations = [];
        const content = language === 'he' ? this.getContentHe() : this.getContentEn();
        
        // Portfolio depletion warning
        if (results.depletionYear && results.depletionYear < 25) {
            recommendations.push({
                type: 'depletion_risk',
                priority: 'critical',
                title: content.depletionRisk.title,
                description: content.depletionRisk.description.replace('{years}', results.depletionYear),
                actions: [
                    content.depletionRisk.reduceWithdrawals,
                    content.depletionRisk.increaseGrowthAllocation,
                    content.depletionRisk.considerDelayingRetirement
                ]
            });
        }
        
        // High tax burden
        if (results.taxOptimization.effectiveTaxRate > 0.30) {
            recommendations.push({
                type: 'high_taxes',
                priority: 'high',
                title: content.highTaxes.title,
                description: content.highTaxes.description.replace('{rate}', 
                    Math.round(results.taxOptimization.effectiveTaxRate * 100)),
                actions: [
                    content.highTaxes.optimizeWithdrawalSequence,
                    content.highTaxes.harvestTaxLosses,
                    content.highTaxes.considerRothConversions
                ]
            });
        }
        
        // Income volatility warning
        if (results.riskMetrics.incomeVolatility > 0.25) {
            recommendations.push({
                type: 'income_volatility',
                priority: 'medium',
                title: content.incomeVolatility.title,
                description: content.incomeVolatility.description,
                actions: [
                    content.incomeVolatility.considerBucketStrategy,
                    content.incomeVolatility.buildCashReserve,
                    content.incomeVolatility.adjustWithdrawalStrategy
                ]
            });
        }
        
        // Strategy-specific recommendations
        if (results.strategy === 'fixedPercentage' && results.riskMetrics.longevityRisk > 0) {
            recommendations.push({
                type: 'strategy_optimization',
                priority: 'medium',
                title: content.strategyOptimization.title,
                description: content.strategyOptimization.description,
                actions: [
                    content.strategyOptimization.considerDynamicStrategy,
                    content.strategyOptimization.implementFloorCeiling,
                    content.strategyOptimization.reviewRegularly
                ]
            });
        }
        
        return recommendations;
    },
    
    // Helper function to calculate volatility
    calculateVolatility: function(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
        return Math.sqrt(avgSquaredDiff) / mean; // Coefficient of variation
    },
    
    // Multi-language content
    getContentEn: function() {
        return {
            depletionRisk: {
                title: 'Portfolio Depletion Risk',
                description: 'Portfolio may be depleted in {years} years',
                reduceWithdrawals: 'Reduce withdrawal rate by 1-2%',
                increaseGrowthAllocation: 'Increase growth asset allocation',
                considerDelayingRetirement: 'Consider delaying retirement by 2-3 years'
            },
            highTaxes: {
                title: 'High Tax Burden',
                description: 'Effective tax rate of {rate}% on withdrawals',
                optimizeWithdrawalSequence: 'Optimize withdrawal sequence by asset type',
                harvestTaxLosses: 'Implement systematic tax loss harvesting',
                considerRothConversions: 'Consider Roth conversions in low-income years'
            },
            incomeVolatility: {
                title: 'High Income Volatility',
                description: 'Income varies significantly year to year',
                considerBucketStrategy: 'Consider implementing bucket strategy',
                buildCashReserve: 'Build 2-3 year cash reserve',
                adjustWithdrawalStrategy: 'Switch to more stable withdrawal method'
            },
            strategyOptimization: {
                title: 'Strategy Optimization Opportunity',
                description: 'Current strategy may not be optimal for your situation',
                considerDynamicStrategy: 'Consider dynamic withdrawal strategy',
                implementFloorCeiling: 'Implement floor and ceiling approach',
                reviewRegularly: 'Review and adjust strategy every 2-3 years'
            }
        };
    },
    
    getContentHe: function() {
        return {
            depletionRisk: {
                title: 'סיכון לדליפת תיק',
                description: 'התיק עלול להתרוקן תוך {years} שנים',
                reduceWithdrawals: 'הפחת שיעור משיכה ב-1-2%',
                increaseGrowthAllocation: 'הגדל הקצאה לנכסי צמיחה',
                considerDelayingRetirement: 'שקול דחיית הפרישה ב-2-3 שנים'
            },
            highTaxes: {
                title: 'נטל מס גבוה',
                description: 'שיעור מס אפקטיבי של {rate}% על משיכות',
                optimizeWithdrawalSequence: 'אופטם רצף משיכה לפי סוג נכס',
                harvestTaxLosses: 'יישם קציר הפסדי מס שיטתי',
                considerRothConversions: 'שקול המרות רות׳ בשנות הכנסה נמוכות'
            },
            incomeVolatility: {
                title: 'תנודתיות הכנסה גבוהה',
                description: 'ההכנסה משתנה משמעותית משנה לשנה',
                considerBucketStrategy: 'שקול יישום אסטרטגיית דליים',
                buildCashReserve: 'בנה רזרבת מזומן של 2-3 שנים',
                adjustWithdrawalStrategy: 'עבור לשיטת משיכה יציבה יותר'
            },
            strategyOptimization: {
                title: 'הזדמנות לאופטימיזציה של אסטרטגיה',
                description: 'האסטרטגיה הנוכחית עלולה לא להיות מיטבית',
                considerDynamicStrategy: 'שקול אסטרטגיית משיכה דינמית',
                implementFloorCeiling: 'יישם גישת רצפה ותקרה',
                reviewRegularly: 'סקור והתאם אסטרטגיה כל 2-3 שנים'
            }
        };
    }
};

// Export for global access
window.calculateWithdrawalStrategy = window.withdrawalStrategies.calculateWithdrawalStrategy.bind(window.withdrawalStrategies);
window.getWithdrawalStrategies = () => window.withdrawalStrategies.strategies;

console.log('✅ Withdrawal Strategies system loaded successfully');