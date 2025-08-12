// Income Calculations Module
// Retirement income calculations and tax handling

window.RetirementIncome = {
    calculateRetirementIncome: function(params) {
        const {
            inputs,
            yearsToRetirement,
            totalPensionSavings,
            totalTrainingFund,
            totalPersonalPortfolio,
            totalCrypto,
            totalRealEstate,
            realEstateRentalIncome,
            periodResults,
            sortedPeriods,
            workPeriods,
            partnerResults,
            pensionWeightedReturn,
            trainingFundWeightedReturn,
            trainingFundNetReturn,
            combinedIncome,
            totalIncome
        } = params;

        // Calculate monthly incomes
        const monthlyPension = totalPensionSavings * 0.04 / 12;
        const monthlyTrainingFundIncome = totalTrainingFund * 0.05 / 12;
        
        // Calculate monthly income from new investment types
        const monthlyPersonalPortfolioIncome = totalPersonalPortfolio * 0.04 / 12;
        const monthlyCryptoIncome = totalCrypto * 0.04 / 12;
        const monthlyRealEstateIncome = totalRealEstate * 0.04 / 12; // Capital gains withdrawal
        
        // Apply taxes to new investment types
        const personalPortfolioTax = monthlyPersonalPortfolioIncome * ((inputs.personalPortfolioTaxRate || inputs.portfolioTaxRate || 25) / 100);
        const cryptoTax = monthlyCryptoIncome * (inputs.cryptoTaxRate / 100);
        const realEstateTax = monthlyRealEstateIncome * (inputs.realEstateTaxRate / 100);
        
        const netPersonalPortfolioIncome = monthlyPersonalPortfolioIncome - personalPortfolioTax;
        const netCryptoIncome = monthlyCryptoIncome - cryptoTax;
        const netRealEstateIncome = monthlyRealEstateIncome - realEstateTax + realEstateRentalIncome;
        
        // Calculate pension tax
        let weightedTaxRate = 0;
        let totalWeight = 0;
        
        for (const result of periodResults) {
            if (!result || !result.country || !window.countryData || !window.countryData[result.country]) {
                console.warn('Invalid period result or country data:', result);
                continue;
            }
            const country = window.countryData[result.country];
            weightedTaxRate += country.pensionTax * result.growth;
            totalWeight += result.growth;
        }
        
        if (totalWeight > 0) {
            weightedTaxRate = weightedTaxRate / totalWeight;
        } else {
            // Fallback to default tax rate if no valid work periods
            if (workPeriods.length > 0 && workPeriods[0] && workPeriods[0].country && window.countryData && window.countryData[workPeriods[0].country]) {
                weightedTaxRate = window.countryData[workPeriods[0].country].pensionTax;
            } else {
                weightedTaxRate = 0.25; // Default 25% tax rate
            }
        }
        
        const pensionTax = monthlyPension * weightedTaxRate;
        const netPension = monthlyPension - pensionTax;
        const netTrainingFundIncome = monthlyTrainingFundIncome;
        
        // Get social security from last valid country or default
        let socialSecurity = 0;
        let lastCountry = null;
        if (sortedPeriods.length > 0) {
            const lastPeriod = sortedPeriods[sortedPeriods.length - 1];
            if (lastPeriod && lastPeriod.country && window.countryData && window.countryData[lastPeriod.country]) {
                lastCountry = window.countryData[lastPeriod.country];
                socialSecurity = lastCountry.socialSecurity;
            }
        }
        // Default to Israel if no country data available
        if (!lastCountry && window.countryData) {
            lastCountry = window.countryData.israel || { socialSecurity: 0 };
        }
        
        // Calculate partner income (if applicable)
        let partnerNetIncome = 0;
        let partnerSocialSecurity = 0;
        if (partnerResults) {
            const partnerMonthlyPension = partnerResults.totalPensionSavings * 0.04 / 12;
            const partnerMonthlyTrainingFund = partnerResults.totalTrainingFund * 0.05 / 12;
            const partnerMonthlyPersonalPortfolio = partnerResults.totalPersonalPortfolio * 0.04 / 12;
            
            // Apply taxes to partner income
            const partnerPensionTax = partnerMonthlyPension * (weightedTaxRate / 100);
            const partnerPersonalTax = partnerMonthlyPersonalPortfolio * (inputs.partnerPersonalPortfolioTaxRate / 100);
            
            const partnerNetPension = partnerMonthlyPension - partnerPensionTax;
            const partnerNetTrainingFund = partnerMonthlyTrainingFund; // Usually tax-free
            const partnerNetPersonalPortfolio = partnerMonthlyPersonalPortfolio - partnerPersonalTax;
            
            partnerSocialSecurity = lastCountry ? lastCountry.socialSecurity : 0; // Same country assumed
            partnerNetIncome = partnerNetPension + partnerNetTrainingFund + partnerNetPersonalPortfolio + partnerSocialSecurity;
        }
        
        // Calculate additional income sources
        const currentSalary = inputs.planningType === 'couple' ? combinedIncome : 
                             (inputs.currentMonthlySalary || inputs.currentSalary || 0);
        
        // Get after-tax additional income values using marginal tax rates
        let annualBonusMonthly = 0;
        let quarterlyRSUMonthly = 0;
        let freelanceIncome = 0;
        let rentalIncome = 0;
        let dividendIncome = 0;
        
        if (window.TaxCalculators && window.TaxCalculators.getMonthlyAfterTaxAdditionalIncome) {
            const afterTaxIncome = window.TaxCalculators.getMonthlyAfterTaxAdditionalIncome(inputs);
            annualBonusMonthly = afterTaxIncome.monthlyNetBonus || 0;
            quarterlyRSUMonthly = afterTaxIncome.monthlyNetRSU || 0;
            
            // Other income (freelance, rental, dividends) grouped together
            const otherIncomeMonthly = afterTaxIncome.monthlyNetOther || 0;
            
            // Distribute other income proportionally if we have the breakdown
            const totalOtherGross = (parseFloat(inputs.freelanceIncome) || 0) + 
                                    (parseFloat(inputs.rentalIncome) || 0) + 
                                    (parseFloat(inputs.dividendIncome) || 0);
            
            if (totalOtherGross > 0) {
                freelanceIncome = otherIncomeMonthly * ((parseFloat(inputs.freelanceIncome) || 0) / totalOtherGross);
                rentalIncome = otherIncomeMonthly * ((parseFloat(inputs.rentalIncome) || 0) / totalOtherGross);
                dividendIncome = otherIncomeMonthly * ((parseFloat(inputs.dividendIncome) || 0) / totalOtherGross);
            }
        } else {
            // Fallback to simple calculation if tax utilities not available
            console.warn('Additional income tax utilities not available, using gross values');
            annualBonusMonthly = (parseFloat(inputs.annualBonus) || 0) / 12;
            
            // Calculate RSU monthly income from new fields or fall back to legacy field
            let rsuAnnual = 0;
            if (inputs.rsuUnits && inputs.rsuCurrentStockPrice) {
                const units = parseFloat(inputs.rsuUnits) || 0;
                const price = parseFloat(inputs.rsuCurrentStockPrice) || 0;
                const frequency = inputs.rsuFrequency || 'quarterly';
                
                if (units && price) {
                    if (frequency === 'monthly') {
                        rsuAnnual = units * price * 12;
                    } else if (frequency === 'quarterly') {
                        rsuAnnual = units * price * 4;
                    } else if (frequency === 'yearly' || frequency === 'annual') {
                        rsuAnnual = units * price;
                    }
                }
            }
            
            // Use calculated RSU or fall back to legacy quarterlyRSU field
            quarterlyRSUMonthly = rsuAnnual > 0 ? rsuAnnual / 12 : (parseFloat(inputs.quarterlyRSU) || 0) / 3;
            
            freelanceIncome = parseFloat(inputs.freelanceIncome) || 0;
            rentalIncome = parseFloat(inputs.rentalIncome) || 0;
            dividendIncome = parseFloat(inputs.dividendIncome) || 0;
        }
        
        // Partner additional income sources with tax treatment
        let partnerAdditionalIncome = 0;
        if (inputs.planningType === 'couple') {
            partnerAdditionalIncome = this.calculatePartnerAdditionalIncome(inputs);
        }
        
        const additionalIncomeTotal = annualBonusMonthly + quarterlyRSUMonthly + freelanceIncome + rentalIncome + dividendIncome;
        const individualNetIncome = netPension + netTrainingFundIncome + socialSecurity + netPersonalPortfolioIncome + netCryptoIncome + netRealEstateIncome + additionalIncomeTotal;
        const totalNetIncome = individualNetIncome + partnerNetIncome + partnerAdditionalIncome;
        
        // Calculate expenses using detailed tracking or fallback to simple estimate
        let baseExpenses = 0;
        let expenseBreakdown = null;
        let yearlyAdjustment = inputs.inflationRate || 2.5;
        
        if (inputs.expenses && window.calculateTotalExpenses) {
            // Use detailed expense tracking
            baseExpenses = window.calculateTotalExpenses(inputs.expenses);
            yearlyAdjustment = inputs.expenses.yearlyAdjustment || inputs.inflationRate || 2.5;
            
            // Generate expense summary for retirement
            if (window.generateExpenseSummaryForRetirement) {
                const expenseSummary = window.generateExpenseSummaryForRetirement(inputs, yearsToRetirement);
                baseExpenses = expenseSummary.currentMonthlyExpenses;
                expenseBreakdown = expenseSummary.categoryBreakdown;
            }
        } else {
            // Fallback to simple expense tracking
            baseExpenses = inputs.partnerPlanningEnabled && inputs.jointMonthlyExpenses > 0 
                ? inputs.jointMonthlyExpenses 
                : inputs.currentMonthlyExpenses || 0;
        }
        
        const futureMonthlyExpenses = baseExpenses * Math.pow(1 + yearlyAdjustment / 100, yearsToRetirement);
        const remainingAfterExpenses = totalNetIncome - futureMonthlyExpenses;

        const finalSalary = workPeriods.length > 0 ? workPeriods[workPeriods.length - 1].salary : 0;
        const targetMonthlyIncome = (finalSalary * inputs.targetReplacement) / 100;
        const achievesTarget = totalNetIncome >= targetMonthlyIncome;

        // Enhanced helper function for precise financial calculations
        const safeRound = (value, decimals = 0) => {
            if (isNaN(value) || !isFinite(value)) return 0;
            if (decimals === 0) return Math.round(value);
            const factor = Math.pow(10, decimals);
            return Math.round(value * factor) / factor;
        };
        
        // Helper function for monetary values (whole numbers)
        const safeMoney = (value) => safeRound(value, 0);
        
        // Helper function for rates and percentages (2 decimal places)
        const safeRate = (value) => safeRound(value, 2);
        
        // Helper function for large monetary amounts with precision
        const safePreciseMoney = (value) => safeRound(value, 2);

        return {
            // Individual results (monetary values - whole numbers)
            totalSavings: safeMoney(totalPensionSavings),
            trainingFundValue: safeMoney(totalTrainingFund),
            personalPortfolioValue: safeMoney(totalPersonalPortfolio),
            currentCrypto: safeMoney(totalCrypto),
            currentRealEstate: safeMoney(totalRealEstate),
            monthlyPension: safeMoney(monthlyPension),
            monthlyTrainingFundIncome: safeMoney(monthlyTrainingFundIncome),
            monthlyPersonalPortfolioIncome: safeMoney(monthlyPersonalPortfolioIncome),
            monthlyCryptoIncome: safeMoney(monthlyCryptoIncome),
            monthlyRealEstateIncome: safeMoney(monthlyRealEstateIncome),
            realEstateRentalIncome: safeMoney(realEstateRentalIncome),
            pensionTax: safeMoney(pensionTax),
            personalPortfolioTax: safeMoney(personalPortfolioTax),
            cryptoTax: safeMoney(cryptoTax),
            realEstateTax: safeMoney(realEstateTax),
            netPension: safeMoney(netPension),
            netTrainingFundIncome: safeMoney(netTrainingFundIncome),
            netPersonalPortfolioIncome: safeMoney(netPersonalPortfolioIncome),
            netCryptoIncome: safeMoney(netCryptoIncome),
            netRealEstateIncome: safeMoney(netRealEstateIncome),
            socialSecurity: socialSecurity || 0,
            individualNetIncome: safeMoney(individualNetIncome),
            
            // Partner results (if enabled)
            partnerResults: partnerResults,
            partnerNetIncome: safeMoney(partnerNetIncome),
            partnerSocialSecurity: partnerSocialSecurity || 0,
            
            // Additional income breakdown
            annualBonusMonthly: safeMoney(annualBonusMonthly),
            quarterlyRSUMonthly: safeMoney(quarterlyRSUMonthly),
            freelanceIncome: safeMoney(freelanceIncome),
            additionalRentalIncome: safeMoney(rentalIncome),
            dividendIncome: safeRound(dividendIncome),
            additionalIncomeTotal: safeRound(additionalIncomeTotal),
            partnerAdditionalIncome: safeRound(partnerAdditionalIncome),
            
            // Combined household results
            totalNetIncome: safeRound(totalNetIncome),
            monthlyIncome: safeRound(totalNetIncome), // Add missing monthlyIncome property
            monthlyRetirementIncome: safeRound(totalNetIncome), // Alias for test compatibility
            isJointPlanning: inputs.partnerPlanningEnabled || false,
            
            // Other calculations
            periodResults: periodResults || [],
            lastCountry: lastCountry,
            weightedTaxRate: safeRate(weightedTaxRate * 100),
            inflationAdjustedIncome: safePreciseMoney(totalNetIncome / Math.pow(1 + (inputs.inflationRate || 3) / 100, yearsToRetirement)),
            trainingFundNetReturn: trainingFundNetReturn || 0,
            pensionWeightedReturn: pensionWeightedReturn || 0,
            trainingFundWeightedReturn: trainingFundWeightedReturn || 0,
            futureMonthlyExpenses: safeMoney(futureMonthlyExpenses),
            remainingAfterExpenses: safeMoney(remainingAfterExpenses),
            remainingAfterExpensesInflationAdjusted: safePreciseMoney(remainingAfterExpenses / Math.pow(1 + (inputs.inflationRate || 3) / 100, yearsToRetirement)),
            targetMonthlyIncome: safeRound(targetMonthlyIncome),
            achievesTarget: achievesTarget || false,
            targetGap: safeRound(targetMonthlyIncome - totalNetIncome),
            riskLevel: inputs.riskTolerance || 'moderate',
            riskMultiplier: window.riskScenarios ? (window.riskScenarios[inputs.riskTolerance]?.multiplier || 1.0) : 1.0,
            
            // Tax optimization analysis (if tax optimization utility is available)
            taxOptimization: (() => {
                try {
                    return window.taxOptimization ? window.taxOptimization.analyzePersonalTaxSituation(inputs) : null;
                } catch (error) {
                    console.warn('Tax optimization analysis failed:', error);
                    return null;
                }
            })(),
            
            // Inflation-adjusted analysis (comprehensive real vs nominal values)
            inflationAnalysis: this.calculateInflationAnalysis(inputs, yearsToRetirement, {
                totalPensionSavings,
                totalTrainingFund,
                totalPersonalPortfolio,
                totalCrypto,
                totalRealEstate,
                totalNetIncome
            }),
            
            // Readiness score calculation
            readinessScore: (() => {
                if (!targetMonthlyIncome || targetMonthlyIncome === 0) return 50;
                const incomeRatio = totalNetIncome / targetMonthlyIncome;
                if (incomeRatio >= 1.2) return 100;
                if (incomeRatio >= 1.0) return 90;
                if (incomeRatio >= 0.8) return 70;
                if (incomeRatio >= 0.6) return 50;
                if (incomeRatio >= 0.4) return 30;
                return 20;
            })(),
            
            // Expense tracking data
            baseExpenses: safeMoney(baseExpenses),
            expenseBreakdown: expenseBreakdown,
            yearlyExpenseAdjustment: yearlyAdjustment,
            hasDetailedExpenses: !!(inputs.expenses && Object.keys(inputs.expenses).length > 1)
        };
    },

    calculatePartnerAdditionalIncome: function(inputs) {
        // Helper to calculate RSU income from new fields
        const calculateRSUIncome = (units, price, frequency) => {
            const u = parseFloat(units) || 0;
            const p = parseFloat(price) || 0;
            const f = frequency || 'quarterly';
            
            if (u && p) {
                if (f === 'monthly') {
                    return u * p * 12; // Annual
                } else if (f === 'quarterly') {
                    return u * p * 4; // Annual
                } else if (f === 'yearly' || f === 'annual') {
                    return u * p; // Annual
                }
            }
            return 0;
        };
        
        // Calculate partner RSU annual values
        const partner1RSUAnnual = calculateRSUIncome(
            inputs.partner1RsuUnits, 
            inputs.partner1RsuCurrentStockPrice, 
            inputs.partner1RsuFrequency
        ) || (parseFloat(inputs.partner1QuarterlyRSU) || 0) * 4; // Fallback to legacy field
        
        const partner2RSUAnnual = calculateRSUIncome(
            inputs.partner2RsuUnits, 
            inputs.partner2RsuCurrentStockPrice, 
            inputs.partner2RsuFrequency
        ) || (parseFloat(inputs.partner2QuarterlyRSU) || 0) * 4; // Fallback to legacy field
        
        // Create partner 1 inputs object for tax calculation
        const partner1Inputs = {
            country: inputs.country,
            currentMonthlySalary: inputs.partner1Salary || 0,
            annualBonus: inputs.partner1AnnualBonus || 0,
            quarterlyRSU: partner1RSUAnnual / 4, // Convert to quarterly for compatibility
            freelanceIncome: inputs.partner1FreelanceIncome || 0,
            rentalIncome: inputs.partner1RentalIncome || 0,
            dividendIncome: inputs.partner1DividendIncome || 0,
            // Include new RSU fields for proper tax calculation
            partner1RsuUnits: inputs.partner1RsuUnits,
            partner1RsuCurrentStockPrice: inputs.partner1RsuCurrentStockPrice,
            partner1RsuFrequency: inputs.partner1RsuFrequency,
            partner1RsuTaxRate: inputs.partner1RsuTaxRate
        };
        
        // Create partner 2 inputs object for tax calculation
        const partner2Inputs = {
            country: inputs.country,
            currentMonthlySalary: inputs.partner2Salary || 0,
            annualBonus: inputs.partner2AnnualBonus || 0,
            quarterlyRSU: partner2RSUAnnual / 4, // Convert to quarterly for compatibility
            freelanceIncome: inputs.partner2FreelanceIncome || 0,
            rentalIncome: inputs.partner2RentalIncome || 0,
            dividendIncome: inputs.partner2DividendIncome || 0,
            // Include new RSU fields for proper tax calculation
            partner2RsuUnits: inputs.partner2RsuUnits,
            partner2RsuCurrentStockPrice: inputs.partner2RsuCurrentStockPrice,
            partner2RsuFrequency: inputs.partner2RsuFrequency,
            partner2RsuTaxRate: inputs.partner2RsuTaxRate
        };
        
        let partnerAdditionalIncome = 0;
        
        if (window.TaxCalculators && window.TaxCalculators.getMonthlyAfterTaxAdditionalIncome) {
            const partner1AfterTax = window.TaxCalculators.getMonthlyAfterTaxAdditionalIncome(partner1Inputs);
            const partner2AfterTax = window.TaxCalculators.getMonthlyAfterTaxAdditionalIncome(partner2Inputs);
            partnerAdditionalIncome = partner1AfterTax.totalMonthlyNet + partner2AfterTax.totalMonthlyNet;
        } else {
            // Fallback to gross values
            const partner1AnnualBonusMonthly = (parseFloat(inputs.partner1AnnualBonus) || 0) / 12;
            const partner1RSUMonthly = partner1RSUAnnual / 12; // Use calculated RSU value
            const partner1FreelanceIncome = parseFloat(inputs.partner1FreelanceIncome) || 0;
            const partner1RentalIncome = parseFloat(inputs.partner1RentalIncome) || 0;
            const partner1DividendIncome = parseFloat(inputs.partner1DividendIncome) || 0;
            
            const partner2AnnualBonusMonthly = (parseFloat(inputs.partner2AnnualBonus) || 0) / 12;
            const partner2RSUMonthly = partner2RSUAnnual / 12; // Use calculated RSU value
            const partner2FreelanceIncome = parseFloat(inputs.partner2FreelanceIncome) || 0;
            const partner2RentalIncome = parseFloat(inputs.partner2RentalIncome) || 0;
            const partner2DividendIncome = parseFloat(inputs.partner2DividendIncome) || 0;
            
            partnerAdditionalIncome = partner1AnnualBonusMonthly + partner1RSUMonthly + partner1FreelanceIncome + partner1RentalIncome + partner1DividendIncome +
                                     partner2AnnualBonusMonthly + partner2RSUMonthly + partner2FreelanceIncome + partner2RentalIncome + partner2DividendIncome;
        }
        
        return partnerAdditionalIncome;
    },

    calculateInflationAnalysis: function(inputs, yearsToRetirement, values) {
        try {
            if (window.inflationCalculations) {
                const inflationRate = parseFloat(inputs.inflationRate || 3);
                const country = inputs.country || 'israel';
                
                // Calculate real values of all major savings components
                const realValues = {
                    totalSavings: window.adjustForInflation(values.totalPensionSavings, inflationRate, yearsToRetirement),
                    trainingFundValue: window.adjustForInflation(values.totalTrainingFund, inflationRate, yearsToRetirement),
                    personalPortfolioValue: window.adjustForInflation(values.totalPersonalPortfolio, inflationRate, yearsToRetirement),
                    currentCrypto: window.adjustForInflation(values.totalCrypto, inflationRate, yearsToRetirement),
                    currentRealEstate: window.adjustForInflation(values.totalRealEstate, inflationRate, yearsToRetirement),
                    totalNetIncome: window.adjustForInflation(values.totalNetIncome, inflationRate, yearsToRetirement)
                };
                
                // Calculate inflation protection score
                const inflationProtection = window.inflationCalculations.calculateInflationProtection(inputs);
                
                // Calculate real returns
                const nominalReturns = {
                    pensionReturn: inputs.pensionReturn || 7.0,
                    trainingFundReturn: inputs.trainingFundReturn || 6.5,
                    personalPortfolioReturn: inputs.personalPortfolioReturn || 8.0,
                    realEstateReturn: inputs.realEstateReturn || 6.0,
                    cryptoReturn: inputs.cryptoReturn || 15.0
                };
                const realReturns = window.inflationCalculations.calculateRealReturns(nominalReturns, inflationRate);
                
                return {
                    inflationRate,
                    yearsToRetirement,
                    realValues,
                    nominalValues: {
                        totalSavings: values.totalPensionSavings,
                        trainingFundValue: values.totalTrainingFund,
                        personalPortfolioValue: values.totalPersonalPortfolio,
                        currentCrypto: values.totalCrypto,
                        currentRealEstate: values.totalRealEstate,
                        totalNetIncome: values.totalNetIncome
                    },
                    inflationProtection,
                    realReturns,
                    nominalReturns,
                    purchasingPowerErosion: ((values.totalNetIncome - realValues.totalNetIncome) / values.totalNetIncome) * 100,
                    realVsNominalRatio: realValues.totalNetIncome / values.totalNetIncome
                };
            }
            return null;
        } catch (error) {
            console.warn('Inflation analysis failed:', error);
            return null;
        }
    }
};

console.log('✅ Retirement income calculations module loaded');