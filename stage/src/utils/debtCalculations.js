// Debt Calculations Utility - Comprehensive debt analysis and payoff timeline
// Created by Yali Pollak (יהלי פולק) - v6.6.5

(function() {
    'use strict';

    // Debt Payoff Timeline Calculator
    const calculateDebtPayoffTimeline = (debtBalance, interestRate, monthlyPayment, extraPayment = 0, currency = 'ILS') => {
        if (!debtBalance || debtBalance <= 0 || !monthlyPayment || monthlyPayment <= 0) {
            return {
                isValid: false,
                error: 'Invalid debt balance or payment amount',
                timeline: []
            };
        }

        const monthlyRate = (interestRate || 0) / 100 / 12;
        const totalMonthlyPayment = monthlyPayment + (extraPayment || 0);
        
        // Check if payment covers interest
        const monthlyInterest = debtBalance * monthlyRate;
        if (totalMonthlyPayment <= monthlyInterest) {
            return {
                isValid: false,
                error: 'Monthly payment insufficient to cover interest',
                minimumPayment: Math.ceil(monthlyInterest + 1),
                timeline: []
            };
        }

        let remainingBalance = debtBalance;
        let month = 0;
        let totalInterestPaid = 0;
        const timeline = [];
        const maxMonths = 600; // 50 years safety limit

        while (remainingBalance > 0.01 && month < maxMonths) {
            month++;
            
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = Math.min(totalMonthlyPayment - interestPayment, remainingBalance);
            
            remainingBalance -= principalPayment;
            totalInterestPaid += interestPayment;

            // Store monthly data (every 12 months for summary, or last few months)
            if (month % 12 === 0 || remainingBalance <= 0.01 || month <= 12) {
                timeline.push({
                    month: month,
                    year: Math.ceil(month / 12),
                    remainingBalance: Math.max(0, remainingBalance),
                    principalPayment: principalPayment,
                    interestPayment: interestPayment,
                    totalInterestPaid: totalInterestPaid,
                    totalPaid: debtBalance - remainingBalance + totalInterestPaid
                });
            }
        }

        const payoffTimeYears = Math.ceil(month / 12);
        const payoffTimeMonths = month % 12;
        const totalAmountPaid = debtBalance + totalInterestPaid;

        return {
            isValid: true,
            payoffTime: {
                totalMonths: month,
                years: payoffTimeYears,
                months: payoffTimeMonths,
                formattedTime: payoffTimeMonths > 0 ? 
                    `${payoffTimeYears} years, ${payoffTimeMonths} months` : 
                    `${payoffTimeYears} years`
            },
            financial: {
                originalBalance: debtBalance,
                totalAmountPaid: totalAmountPaid,
                totalInterestPaid: totalInterestPaid,
                monthlyPayment: totalMonthlyPayment,
                extraPayment: extraPayment,
                interestRate: interestRate
            },
            timeline: timeline,
            currency: currency
        };
    };

    // Calculate interest savings from extra payments
    const calculateInterestSavings = (debtBalance, interestRate, basePayment, extraPayment) => {
        // Calculate payoff with base payment only
        const baseScenario = calculateDebtPayoffTimeline(debtBalance, interestRate, basePayment, 0);
        
        // Calculate payoff with extra payment
        const extraScenario = calculateDebtPayoffTimeline(debtBalance, interestRate, basePayment, extraPayment);
        
        if (!baseScenario.isValid || !extraScenario.isValid) {
            return 0;
        }

        return baseScenario.financial.totalInterestPaid - extraScenario.financial.totalInterestPaid;
    };

    // Debt Consolidation Analysis
    const analyzeDebtConsolidation = (debts, consolidationRate, consolidationFee = 0) => {
        if (!Array.isArray(debts) || debts.length === 0) {
            return { isValid: false, error: 'No debts provided' };
        }

        let totalBalance = 0;
        let weightedRate = 0;
        let totalMinimumPayment = 0;
        const currentScenarios = [];

        // Analyze current debts
        debts.forEach((debt, index) => {
            const balance = parseFloat(debt.balance) || 0;
            const rate = parseFloat(debt.interestRate) || 0;
            const payment = parseFloat(debt.monthlyPayment) || 0;

            if (balance > 0) {
                totalBalance += balance;
                weightedRate += (balance * rate);
                totalMinimumPayment += payment;

                const scenario = calculateDebtPayoffTimeline(balance, rate, payment);
                currentScenarios.push({
                    ...scenario,
                    debtName: debt.name || `Debt ${index + 1}`,
                    originalDebt: debt
                });
            }
        });

        if (totalBalance === 0) {
            return { isValid: false, error: 'No valid debt balances' };
        }

        const currentWeightedRate = weightedRate / totalBalance;
        
        // Calculate consolidated scenario
        const consolidatedBalance = totalBalance + consolidationFee;
        const consolidatedScenario = calculateDebtPayoffTimeline(
            consolidatedBalance, 
            consolidationRate, 
            totalMinimumPayment
        );

        // Calculate current total payoff
        const currentTotalInterest = currentScenarios.reduce((sum, scenario) => 
            sum + (scenario.financial?.totalInterestPaid || 0), 0);
        const currentTotalPayment = currentScenarios.reduce((sum, scenario) => 
            sum + (scenario.financial?.totalAmountPaid || 0), 0);
        const currentMaxPayoffTime = Math.max(...currentScenarios.map(scenario => 
            scenario.payoffTime?.totalMonths || 0));

        return {
            isValid: true,
            current: {
                totalBalance: totalBalance,
                weightedInterestRate: currentWeightedRate,
                totalMinimumPayment: totalMinimumPayment,
                totalInterestPaid: currentTotalInterest,
                totalAmountPaid: currentTotalPayment,
                payoffTimeMonths: currentMaxPayoffTime,
                scenarios: currentScenarios
            },
            consolidated: {
                balance: consolidatedBalance,
                interestRate: consolidationRate,
                monthlyPayment: totalMinimumPayment,
                fee: consolidationFee,
                scenario: consolidatedScenario
            },
            comparison: {
                interestSavings: consolidatedScenario.isValid ? 
                    (currentTotalInterest - consolidatedScenario.financial.totalInterestPaid) : 0,
                timeSavings: consolidatedScenario.isValid ? 
                    (currentMaxPayoffTime - consolidatedScenario.payoffTime.totalMonths) : 0,
                isConsolidationBetter: consolidatedScenario.isValid && 
                    consolidatedScenario.financial.totalInterestPaid < currentTotalInterest,
                rateDifference: consolidationRate - currentWeightedRate
            }
        };
    };

    // Debt-to-Income Ratio Analysis
    const calculateDebtToIncomeRatio = (monthlyDebts, monthlyIncome) => {
        if (!monthlyIncome || monthlyIncome <= 0) {
            return {
                isValid: false,
                error: 'Invalid monthly income'
            };
        }

        const totalMonthlyDebt = Array.isArray(monthlyDebts) ? 
            monthlyDebts.reduce((sum, debt) => sum + (parseFloat(debt.payment) || 0), 0) :
            parseFloat(monthlyDebts) || 0;

        const ratio = totalMonthlyDebt / monthlyIncome;
        const percentage = ratio * 100;

        let riskLevel = 'low';
        let recommendation = 'Excellent debt management';
        
        if (percentage > 40) {
            riskLevel = 'critical';
            recommendation = 'Debt consolidation or payment plan urgently needed';
        } else if (percentage > 30) {
            riskLevel = 'high';
            recommendation = 'Consider debt reduction strategies';
        } else if (percentage > 20) {
            riskLevel = 'moderate';
            recommendation = 'Monitor debt levels and avoid new debt';
        } else if (percentage > 10) {
            riskLevel = 'low';
            recommendation = 'Good debt management, some room for improvement';
        }

        return {
            isValid: true,
            ratio: ratio,
            percentage: percentage,
            totalMonthlyDebt: totalMonthlyDebt,
            monthlyIncome: monthlyIncome,
            riskLevel: riskLevel,
            recommendation: recommendation,
            benchmarks: {
                excellent: 10,
                good: 20,
                moderate: 30,
                high: 40
            }
        };
    };

    // Debt Avalanche vs Snowball Comparison
    const compareDebtStrategies = (debts, extraPayment = 0) => {
        if (!Array.isArray(debts) || debts.length === 0) {
            return { isValid: false, error: 'No debts provided' };
        }

        // Debt Avalanche (highest interest rate first)
        const avalancheOrder = [...debts].sort((a, b) => 
            (parseFloat(b.interestRate) || 0) - (parseFloat(a.interestRate) || 0)
        );

        // Debt Snowball (lowest balance first)
        const snowballOrder = [...debts].sort((a, b) => 
            (parseFloat(a.balance) || 0) - (parseFloat(b.balance) || 0)
        );

        const calculateStrategyResults = (orderedDebts) => {
            let totalInterest = 0;
            let totalTime = 0;
            let remainingExtraPayment = extraPayment;
            const payoffSchedule = [];

            orderedDebts.forEach((debt, index) => {
                const balance = parseFloat(debt.balance) || 0;
                const rate = parseFloat(debt.interestRate) || 0;
                const minPayment = parseFloat(debt.monthlyPayment) || 0;
                
                // Add extra payment to first debt, then roll over payments
                const totalPayment = minPayment + remainingExtraPayment;
                const scenario = calculateDebtPayoffTimeline(balance, rate, totalPayment);
                
                if (scenario.isValid) {
                    totalInterest += scenario.financial.totalInterestPaid;
                    totalTime = Math.max(totalTime, scenario.payoffTime.totalMonths + (index * 0.1)); // Slight offset for sequential payoff
                    remainingExtraPayment += minPayment; // Roll over payment to next debt
                    
                    payoffSchedule.push({
                        debtName: debt.name || `Debt ${index + 1}`,
                        payoffOrder: index + 1,
                        scenario: scenario
                    });
                }
            });

            return {
                totalInterestPaid: totalInterest,
                totalPayoffTime: totalTime,
                payoffSchedule: payoffSchedule
            };
        };

        const avalancheResults = calculateStrategyResults(avalancheOrder);
        const snowballResults = calculateStrategyResults(snowballOrder);

        return {
            isValid: true,
            avalanche: {
                strategy: 'Highest Interest First',
                order: avalancheOrder.map((debt, index) => ({
                    rank: index + 1,
                    name: debt.name || `Debt ${index + 1}`,
                    balance: debt.balance,
                    interestRate: debt.interestRate
                })),
                results: avalancheResults
            },
            snowball: {
                strategy: 'Lowest Balance First',
                order: snowballOrder.map((debt, index) => ({
                    rank: index + 1,
                    name: debt.name || `Debt ${index + 1}`,
                    balance: debt.balance,
                    interestRate: debt.interestRate
                })),
                results: snowballResults
            },
            comparison: {
                interestSavings: snowballResults.totalInterestPaid - avalancheResults.totalInterestPaid,
                timeDifference: snowballResults.totalPayoffTime - avalancheResults.totalPayoffTime,
                recommendedStrategy: avalancheResults.totalInterestPaid < snowballResults.totalInterestPaid ? 'avalanche' : 'snowball',
                psychologicalBenefit: snowballResults.payoffSchedule.length > avalancheResults.payoffSchedule.length ? 'snowball' : 'avalanche'
            }
        };
    };

    // Export functions to window
    window.calculateDebtPayoffTimeline = calculateDebtPayoffTimeline;
    window.calculateInterestSavings = calculateInterestSavings;
    window.analyzeDebtConsolidation = analyzeDebtConsolidation;
    window.calculateDebtToIncomeRatio = calculateDebtToIncomeRatio;
    window.compareDebtStrategies = compareDebtStrategies;

    // Combined debt analysis function
    window.analyzeAllDebts = (inputs) => {
        const expenses = inputs.expenses || {};
        const debts = [];

        // Extract debt information from expenses
        if (expenses.creditCardDebt && expenses.creditCardDebt > 0) {
            debts.push({
                name: 'Credit Card',
                balance: expenses.creditCardDebt,
                interestRate: expenses.creditCardRate || 18,
                monthlyPayment: expenses.creditCardPayment || (expenses.creditCardDebt * 0.03)
            });
        }

        if (expenses.personalLoanDebt && expenses.personalLoanDebt > 0) {
            debts.push({
                name: 'Personal Loan',
                balance: expenses.personalLoanDebt,
                interestRate: expenses.personalLoanRate || 12,
                monthlyPayment: expenses.personalLoanPayment || (expenses.personalLoanDebt * 0.05)
            });
        }

        if (expenses.otherDebt && expenses.otherDebt > 0) {
            debts.push({
                name: 'Other Debt',
                balance: expenses.otherDebt,
                interestRate: expenses.otherDebtRate || 10,
                monthlyPayment: expenses.otherDebtPayment || (expenses.otherDebt * 0.04)
            });
        }

        const monthlyIncome = inputs.currentMonthlySalary || inputs.monthlyIncome || 0;
        const extraPayment = inputs.extraDebtPayment || 0;

        return {
            debts: debts,
            debtToIncomeRatio: calculateDebtToIncomeRatio(debts.map(d => ({ payment: d.monthlyPayment })), monthlyIncome),
            payoffTimelines: debts.map(debt => ({
                ...debt,
                timeline: calculateDebtPayoffTimeline(debt.balance, debt.interestRate, debt.monthlyPayment, extraPayment)
            })),
            strategies: debts.length > 1 ? compareDebtStrategies(debts, extraPayment) : null,
            consolidationAnalysis: debts.length > 1 ? analyzeDebtConsolidation(debts, 8, 0) : null
        };
    };

    console.log('✅ Debt calculations utility loaded successfully');
})();