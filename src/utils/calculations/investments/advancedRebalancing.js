// Advanced Portfolio Rebalancing Engine
// Enhanced rebalancing system with automatic triggers, calendar scheduling, and tax optimization

window.advancedRebalancing = {
    
    // Rebalancing triggers and thresholds
    rebalancingTriggers: {
        threshold: {
            minor: 5,      // 5% deviation triggers review
            moderate: 8,   // 8% deviation triggers action
            major: 12,     // 12% deviation triggers immediate action
            critical: 20   // 20+ deviation requires urgent action
        },
        timeBasedTriggers: {
            quarterly: 3,   // months
            semiAnnual: 6,  // months
            annual: 12      // months
        },
        marketConditionTriggers: {
            volatilitySpike: 25,    // VIX level
            marketCorrection: -10,  // % market drop
            marketRally: 20         // % market gain
        }
    },
    
    // Tax-efficient rebalancing strategies
    taxOptimizedStrategies: {
        // Use new money to rebalance instead of selling
        newMoneyFirst: {
            name: { en: 'New Money First', he: 'כסף חדש ראשון' },
            description: { 
                en: 'Use new contributions to restore target allocation before selling',
                he: 'השתמש בהפקדות חדשות לשחזור הקצאת היעד לפני מכירה'
            },
            priority: 'high',
            taxEfficiency: 95
        },
        
        // Harvest tax losses while rebalancing
        taxLossHarvesting: {
            name: { en: 'Tax Loss Harvesting', he: 'קציר הפסדי מס' },
            description: { 
                en: 'Sell losing positions first, defer gains to future periods',
                he: 'מכור תחילה פוזיציות מפסידות, דחה רווחים לתקופות עתידיות'
            },
            priority: 'high',
            taxEfficiency: 85
        },
        
        // Rebalance in tax-advantaged accounts first
        taxAdvantaged: {
            name: { en: 'Tax-Advantaged Priority', he: 'עדיפות חשבונות מוגנים' },
            description: { 
                en: 'Rebalance within pension and training fund accounts first',
                he: 'בצע איזון בחשבונות פנסיה וקרן השתלמות תחילה'
            },
            priority: 'medium',
            taxEfficiency: 90
        },
        
        // Asset location optimization
        assetLocation: {
            name: { en: 'Asset Location Optimization', he: 'אופטימיזציה של מיקום נכסים' },
            description: { 
                en: 'Place tax-inefficient assets in tax-advantaged accounts',
                he: 'מקם נכסים לא יעילים ממבחינת מס בחשבונות מוגנים'
            },
            priority: 'medium',
            taxEfficiency: 80
        }
    },
    
    // Automated rebalancing calendars
    rebalancingCalendars: {
        conservative: {
            frequency: 'annual',
            triggerThreshold: 10,
            preferredMonths: [1, 7], // January and July
            considerations: ['tax year', 'dividend payments']
        },
        moderate: {
            frequency: 'semiAnnual',
            triggerThreshold: 8,
            preferredMonths: [1, 4, 7, 10], // Quarterly options
            considerations: ['earnings seasons', 'portfolio review']
        },
        aggressive: {
            frequency: 'quarterly',
            triggerThreshold: 5,
            preferredMonths: [1, 4, 7, 10],
            considerations: ['market volatility', 'opportunity cost']
        }
    },
    
    // Advanced rebalancing analysis
    analyzeRebalancingNeeds: function(inputs, currentPortfolio, targetPortfolio, lastRebalanceDate, language = 'en') {
        const analysis = {
            needsRebalancing: false,
            urgency: 'none', // none, low, medium, high, critical
            triggers: [],
            recommendations: [],
            taxImplications: {},
            timeUntilNext: null,
            costBenefit: {}
        };
        
        // Calculate deviations
        const deviations = this.calculateDeviations(currentPortfolio, targetPortfolio);
        const maxDeviation = Math.max(...Object.values(deviations).map(Math.abs));
        
        // Check threshold triggers
        if (maxDeviation >= this.rebalancingTriggers.threshold.critical) {
            analysis.needsRebalancing = true;
            analysis.urgency = 'critical';
            analysis.triggers.push({
                type: 'threshold',
                level: 'critical',
                value: maxDeviation,
                message: language === 'he' ? 
                    `סטייה קריטית של ${maxDeviation.toFixed(1)}% מהיעד` :
                    `Critical ${maxDeviation.toFixed(1)}% deviation from target`
            });
        } else if (maxDeviation >= this.rebalancingTriggers.threshold.major) {
            analysis.needsRebalancing = true;
            analysis.urgency = 'high';
            analysis.triggers.push({
                type: 'threshold',
                level: 'major',
                value: maxDeviation,
                message: language === 'he' ? 
                    `סטייה משמעותית של ${maxDeviation.toFixed(1)}% מהיעד` :
                    `Major ${maxDeviation.toFixed(1)}% deviation from target`
            });
        } else if (maxDeviation >= this.rebalancingTriggers.threshold.moderate) {
            analysis.needsRebalancing = true;
            analysis.urgency = 'medium';
            analysis.triggers.push({
                type: 'threshold',
                level: 'moderate',
                value: maxDeviation,
                message: language === 'he' ? 
                    `סטייה בינונית של ${maxDeviation.toFixed(1)}% מהיעד` :
                    `Moderate ${maxDeviation.toFixed(1)}% deviation from target`
            });
        }
        
        // Check time-based triggers
        const timeTrigger = this.checkTimeBasedTriggers(lastRebalanceDate, inputs.riskTolerance);
        if (timeTrigger.triggered) {
            analysis.triggers.push(timeTrigger);
            if (maxDeviation >= this.rebalancingTriggers.threshold.minor) {
                analysis.needsRebalancing = true;
                if (analysis.urgency === 'none') analysis.urgency = 'low';
            }
        }
        
        // Calculate tax implications
        analysis.taxImplications = this.calculateTaxImplications(currentPortfolio, targetPortfolio, inputs);
        
        // Generate recommendations
        analysis.recommendations = this.generateRebalancingRecommendations(
            deviations, analysis.urgency, analysis.taxImplications, inputs, language
        );
        
        // Calculate cost-benefit
        analysis.costBenefit = this.calculateCostBenefit(currentPortfolio, targetPortfolio, analysis.taxImplications, inputs);
        
        return analysis;
    },
    
    // Calculate portfolio deviations
    calculateDeviations: function(current, target) {
        const deviations = {};
        
        ['stocks', 'bonds', 'alternatives', 'cash'].forEach(category => {
            Object.keys(target[category] || {}).forEach(asset => {
                const currentAlloc = (current[category] && current[category][asset]) || 0;
                const targetAlloc = target[category][asset] || 0;
                const key = `${category}.${asset}`;
                deviations[key] = targetAlloc - currentAlloc;
            });
        });
        
        return deviations;
    },
    
    // Check time-based rebalancing triggers
    checkTimeBasedTriggers: function(lastRebalanceDate, riskTolerance) {
        const now = new Date();
        const lastRebalance = new Date(lastRebalanceDate || now);
        const monthsSinceRebalance = (now - lastRebalance) / (1000 * 60 * 60 * 24 * 30.44);
        
        const calendar = this.rebalancingCalendars[riskTolerance] || this.rebalancingCalendars.moderate;
        const requiredFrequency = this.rebalancingTriggers.timeBasedTriggers[calendar.frequency];
        
        return {
            triggered: monthsSinceRebalance >= requiredFrequency,
            monthsOverdue: Math.max(0, monthsSinceRebalance - requiredFrequency),
            nextScheduledDate: new Date(lastRebalance.getTime() + requiredFrequency * 30.44 * 24 * 60 * 60 * 1000),
            frequency: calendar.frequency,
            message: monthsSinceRebalance >= requiredFrequency ?
                (riskTolerance === 'he' ? 
                    `זמן לאיזון תיק - ${monthsSinceRebalance.toFixed(1)} חודשים מהאחרון` :
                    `Time to rebalance - ${monthsSinceRebalance.toFixed(1)} months since last`) :
                null
        };
    },
    
    // Calculate tax implications of rebalancing
    calculateTaxImplications: function(current, target, inputs) {
        const totalAssets = window.PortfolioOptimizer?.calculateTotalAssets(inputs) || 0;
        const taxableAssets = (parseFloat(inputs.currentPersonalPortfolio || 0) + 
                              parseFloat(inputs.currentRealEstate || 0) + 
                              parseFloat(inputs.currentCrypto || 0));
        
        let taxableGains = 0;
        let taxableTransactions = [];
        
        // Estimate gains/losses for each asset class requiring rebalancing
        ['stocks', 'bonds', 'alternatives'].forEach(category => {
            Object.keys(target[category] || {}).forEach(asset => {
                const currentAlloc = (current[category] && current[category][asset]) || 0;
                const targetAlloc = target[category][asset] || 0;
                const difference = targetAlloc - currentAlloc;
                
                if (difference < -5) { // Need to sell more than 5%
                    const sellAmount = Math.abs(difference / 100) * totalAssets;
                    // Assume 20% average gain (conservative estimate)
                    const estimatedGain = sellAmount * 0.20;
                    taxableGains += estimatedGain;
                    
                    taxableTransactions.push({
                        category,
                        asset,
                        action: 'sell',
                        amount: sellAmount,
                        estimatedGain
                    });
                }
            });
        });
        
        // Calculate tax cost
        const capitalGainsTaxRate = parseFloat(inputs.personalPortfolioTaxRate || 25) / 100;
        const estimatedTaxCost = taxableGains * capitalGainsTaxRate;
        
        return {
            taxableGains,
            estimatedTaxCost,
            taxableTransactions,
            taxEfficiencyScore: Math.max(0, 100 - (estimatedTaxCost / totalAssets * 1000))
        };
    },
    
    // Generate enhanced rebalancing recommendations
    generateRebalancingRecommendations: function(deviations, urgency, taxImplications, inputs, language) {
        const recommendations = [];
        const content = language === 'he' ? this.getContentHe() : this.getContentEn();
        
        // Tax-efficient strategies
        if (taxImplications.estimatedTaxCost > 0) {
            recommendations.push({
                type: 'tax_efficiency',
                priority: 'high',
                title: content.taxEfficiency.title,
                description: content.taxEfficiency.description.replace('{cost}', 
                    Math.round(taxImplications.estimatedTaxCost).toLocaleString()),
                actions: [
                    content.taxEfficiency.useNewMoney,
                    content.taxEfficiency.taxLossHarvest,
                    content.taxEfficiency.deferRebalancing
                ],
                potentialSavings: taxImplications.estimatedTaxCost * 0.6
            });
        }
        
        // Urgency-based recommendations
        if (urgency === 'critical') {
            recommendations.push({
                type: 'urgent_action',
                priority: 'critical',
                title: content.urgent.title,
                description: content.urgent.description,
                actions: [
                    content.urgent.immediateRebalance,
                    content.urgent.riskReduction,
                    content.urgent.professionalAdvice
                ],
                deadline: '1 week'
            });
        } else if (urgency === 'high') {
            recommendations.push({
                type: 'high_priority',
                priority: 'high',
                title: content.highPriority.title,
                description: content.highPriority.description,
                actions: [
                    content.highPriority.planRebalance,
                    content.highPriority.reviewStrategy,
                    content.highPriority.monitorMarkets
                ],
                deadline: '2 weeks'
            });
        }
        
        // Asset-specific recommendations
        Object.entries(deviations).forEach(([assetKey, deviation]) => {
            if (Math.abs(deviation) > 8) {
                const [category, asset] = assetKey.split('.');
                const action = deviation > 0 ? 'increase' : 'decrease';
                recommendations.push({
                    type: 'asset_specific',
                    priority: 'medium',
                    title: `${action === 'increase' ? content.increase : content.decrease} ${category} - ${asset}`,
                    description: content.assetSpecific.description
                        .replace('{asset}', asset)
                        .replace('{deviation}', Math.abs(deviation).toFixed(1)),
                    actions: [action === 'increase' ? 
                        content.assetSpecific.buyMore : 
                        content.assetSpecific.sellSome]
                });
            }
        });
        
        // Automated rebalancing recommendations
        if (urgency === 'low' || urgency === 'medium') {
            recommendations.push({
                type: 'automation',
                priority: 'low',
                title: content.automation.title,
                description: content.automation.description,
                actions: [
                    content.automation.setSchedule,
                    content.automation.useThresholds,
                    content.automation.autoInvest
                ],
                benefits: [
                    content.automation.disciplined,
                    content.automation.taxEfficient,
                    content.automation.timeEfficient
                ]
            });
        }
        
        return recommendations;
    },
    
    // Calculate cost-benefit analysis
    calculateCostBenefit: function(current, target, taxImplications, inputs) {
        const totalAssets = window.PortfolioOptimizer?.calculateTotalAssets(inputs) || 0;
        
        // Costs
        const tradingCosts = totalAssets * 0.001; // 0.1% trading cost estimate
        const taxCosts = taxImplications.estimatedTaxCost || 0;
        const opportunityCosts = 0; // Time value of not rebalancing
        const totalCosts = tradingCosts + taxCosts + opportunityCosts;
        
        // Benefits
        const currentMetrics = window.PortfolioOptimizer?.calculatePortfolioMetrics(current) || {};
        const targetMetrics = window.PortfolioOptimizer?.calculatePortfolioMetrics(target) || {};
        
        const returnImprovement = (targetMetrics.expectedReturn || 0) - (currentMetrics.expectedReturn || 0);
        const riskReduction = (currentMetrics.volatility || 0) - (targetMetrics.volatility || 0);
        const sharpeImprovement = (targetMetrics.sharpeRatio || 0) - (currentMetrics.sharpeRatio || 0);
        
        // Estimate annual benefit in monetary terms
        const annualBenefit = totalAssets * (returnImprovement / 100) * 0.5; // Conservative estimate
        
        return {
            costs: {
                trading: tradingCosts,
                taxes: taxCosts,
                total: totalCosts
            },
            benefits: {
                returnImprovement: returnImprovement,
                riskReduction: riskReduction,
                sharpeImprovement: sharpeImprovement,
                annualBenefit: annualBenefit
            },
            netBenefit: annualBenefit - totalCosts,
            paybackPeriod: totalCosts > 0 ? totalCosts / Math.max(annualBenefit, 1) : 0,
            recommendation: annualBenefit > totalCosts * 1.5 ? 'proceed' : 
                          annualBenefit > totalCosts ? 'consider' : 'defer'
        };
    },
    
    // Generate automated rebalancing schedule
    createRebalancingSchedule: function(inputs, preferences = {}, language = 'en') {
        const riskTolerance = inputs.riskTolerance || 'moderate';
        const calendar = this.rebalancingCalendars[riskTolerance];
        
        const schedule = {
            frequency: preferences.frequency || calendar.frequency,
            thresholdTrigger: preferences.threshold || calendar.triggerThreshold,
            preferredMonths: preferences.months || calendar.preferredMonths,
            taxOptimized: preferences.taxOptimized !== false,
            autoExecute: preferences.autoExecute || false,
            notifications: preferences.notifications !== false
        };
        
        // Generate next 12 months schedule
        const now = new Date();
        schedule.upcomingDates = [];
        
        for (let i = 0; i < 12; i++) {
            const checkDate = new Date(now.getFullYear(), now.getMonth() + i, 15); // Mid-month
            if (schedule.preferredMonths.includes(checkDate.getMonth() + 1)) {
                schedule.upcomingDates.push({
                    date: checkDate,
                    type: 'scheduled',
                    description: language === 'he' ? 
                        'איזון תיק מתוכנן' : 
                        'Scheduled portfolio rebalancing'
                });
            }
        }
        
        // Add threshold-based checks (monthly)
        for (let i = 0; i < 12; i++) {
            const checkDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
            if (!schedule.preferredMonths.includes(checkDate.getMonth() + 1)) {
                schedule.upcomingDates.push({
                    date: checkDate,
                    type: 'threshold_check',
                    description: language === 'he' ? 
                        'בדיקת סטיות מהיעד' : 
                        'Threshold deviation check'
                });
            }
        }
        
        schedule.upcomingDates.sort((a, b) => a.date - b.date);
        
        return schedule;
    },
    
    // Multi-language content
    getContentEn: function() {
        return {
            taxEfficiency: {
                title: 'Tax-Efficient Rebalancing',
                description: 'Rebalancing will incur approximately ₪{cost} in taxes',
                useNewMoney: 'Use new contributions to rebalance first',
                taxLossHarvest: 'Harvest tax losses to offset gains',
                deferRebalancing: 'Consider deferring rebalancing to next tax year'
            },
            urgent: {
                title: 'Urgent Rebalancing Required',
                description: 'Portfolio has deviated significantly from target allocation',
                immediateRebalance: 'Rebalance within 1 week',
                riskReduction: 'Prioritize risk reduction',
                professionalAdvice: 'Consider consulting a financial advisor'
            },
            highPriority: {
                title: 'High Priority Rebalancing',
                description: 'Portfolio requires rebalancing within 2 weeks',
                planRebalance: 'Plan rebalancing strategy',
                reviewStrategy: 'Review investment strategy',
                monitorMarkets: 'Monitor market conditions'
            },
            increase: 'Increase',
            decrease: 'Decrease',
            assetSpecific: {
                description: '{asset} is {deviation}% away from target allocation',
                buyMore: 'Buy more of this asset',
                sellSome: 'Sell some of this asset'
            },
            automation: {
                title: 'Automated Rebalancing',
                description: 'Set up automated rebalancing to maintain optimal allocation',
                setSchedule: 'Set rebalancing schedule',
                useThresholds: 'Use threshold triggers',
                autoInvest: 'Enable automatic investing',
                disciplined: 'Maintains disciplined approach',
                taxEfficient: 'Optimizes for tax efficiency',
                timeEfficient: 'Saves time and effort'
            }
        };
    },
    
    getContentHe: function() {
        return {
            taxEfficiency: {
                title: 'איזון יעיל ממבחינת מס',
                description: 'איזון התיק יגרור מס של כ-₪{cost}',
                useNewMoney: 'השתמש בהפקדות חדשות לאיזון תחילה',
                taxLossHarvest: 'קצור הפסדי מס לקיזוז רווחים',
                deferRebalancing: 'שקול דחיית איזון לשנת מס הבאה'
            },
            urgent: {
                title: 'נדרש איזון דחוף',
                description: 'התיק סטה משמעותית מההקצאה המיועדת',
                immediateRebalance: 'בצע איזון תוך שבוע',
                riskReduction: 'תן עדיפות להפחתת סיכון',
                professionalAdvice: 'שקול התייעצות עם יועץ פיננסי'
            },
            highPriority: {
                title: 'איזון בעדיפות גבוהה',
                description: 'התיק דורש איזון תוך שבועיים',
                planRebalance: 'תכנן אסטרטגיית איזון',
                reviewStrategy: 'סקור אסטרטגיית השקעה',
                monitorMarkets: 'עקב אחר תנאי שוק'
            },
            increase: 'הגדל',
            decrease: 'הקטן',
            assetSpecific: {
                description: '{asset} סוטה ב-{deviation}% מההקצאה המיועדת',
                buyMore: 'רכוש יותר מנכס זה',
                sellSome: 'מכור חלק מהנכס'
            },
            automation: {
                title: 'איזון אוטומטי',
                description: 'הגדר איזון אוטומטי לשמירה על הקצאה אופטימלית',
                setSchedule: 'הגדר לוח זמנים לאיזון',
                useThresholds: 'השתמש בטריגרי סף',
                autoInvest: 'אפשר השקעה אוטומטית',
                disciplined: 'שומר על גישה ממושמעת',
                taxEfficient: 'מאופטם ליעילות מס',
                timeEfficient: 'חוסך זמן ומאמץ'
            }
        };
    }
};

// Export for global access
window.analyzeRebalancingNeeds = window.advancedRebalancing.analyzeRebalancingNeeds.bind(window.advancedRebalancing);
window.createRebalancingSchedule = window.advancedRebalancing.createRebalancingSchedule.bind(window.advancedRebalancing);

console.log('✅ Advanced Rebalancing system loaded successfully');