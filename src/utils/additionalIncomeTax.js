// Additional Income Tax Calculations
// Handles country-specific tax calculations for bonuses, RSUs, and other supplemental income

window.AdditionalIncomeTax = (() => {
    
    // Calculate tax on annual bonus based on marginal tax rate
    const calculateBonusTax = (annualBonus, baseSalary, country) => {
        if (!annualBonus || annualBonus <= 0) {
            return { tax: 0, netBonus: 0, effectiveRate: 0 };
        }
        
        // Calculate tax on base salary + bonus vs just base salary
        const taxWithBonus = calculateAnnualTax(baseSalary + annualBonus, country);
        const taxWithoutBonus = calculateAnnualTax(baseSalary, country);
        const bonusTax = taxWithBonus.totalTax - taxWithoutBonus.totalTax;
        const netBonus = annualBonus - bonusTax;
        const effectiveRate = (bonusTax / annualBonus) * 100;
        
        // Debug logging
        console.log(`🧮 Bonus Tax Calculation:`, {
            annualBonus,
            baseSalary,
            totalIncomeWithBonus: baseSalary + annualBonus,
            taxWithBonus: taxWithBonus.totalTax,
            taxWithoutBonus: taxWithoutBonus.totalTax,
            bonusTax,
            effectiveRate: Math.round(effectiveRate)
        });
        
        return {
            tax: Math.round(bonusTax),
            netBonus: Math.round(netBonus),
            effectiveRate: Math.round(effectiveRate)
        };
    };
    
    // Calculate tax on RSU vesting
    const calculateRSUTax = (rsuValue, baseSalary, country) => {
        if (!rsuValue || rsuValue <= 0) {
            return { tax: 0, netRSU: 0, effectiveRate: 0 };
        }
        
        // RSUs are taxed as ordinary income at vesting
        const taxWithRSU = calculateAnnualTax(baseSalary + rsuValue, country);
        const taxWithoutRSU = calculateAnnualTax(baseSalary, country);
        const rsuTax = taxWithRSU.totalTax - taxWithoutRSU.totalTax;
        const netRSU = rsuValue - rsuTax;
        const effectiveRate = (rsuTax / rsuValue) * 100;
        
        return {
            tax: Math.round(rsuTax),
            netRSU: Math.round(netRSU),
            effectiveRate: Math.round(effectiveRate)
        };
    };
    
    // Calculate total annual tax including all income sources
    const calculateAnnualTax = (totalAnnualIncome, country) => {
        switch (country) {
            case 'israel':
            case 'ISR':
                return calculateIsraeliAnnualTax(totalAnnualIncome);
            case 'uk':
            case 'UK':
                return calculateUKAnnualTax(totalAnnualIncome);
            case 'us':
            case 'US':
                return calculateUSAnnualTax(totalAnnualIncome);
            default:
                return { totalTax: 0, breakdown: {} };
        }
    };
    
    // Israeli annual tax calculation with all income sources
    const calculateIsraeliAnnualTax = (annualIncome) => {
        let incomeTax = 0;
        let remainingIncome = annualIncome;
        
        // Israeli tax brackets 2025 (NIS)
        const brackets = [
            { min: 0, max: 81480, rate: 0.10 },
            { min: 81480, max: 116760, rate: 0.14 },
            { min: 116760, max: 188280, rate: 0.20 },
            { min: 188280, max: 269280, rate: 0.31 },
            { min: 269280, max: 558240, rate: 0.35 },
            { min: 558240, max: 718440, rate: 0.47 },
            { min: 718440, max: Infinity, rate: 0.50 }
        ];
        
        // Calculate income tax
        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;
            
            const taxableInThisBracket = Math.min(
                remainingIncome, 
                bracket.max - bracket.min
            );
            
            if (taxableInThisBracket > 0) {
                incomeTax += taxableInThisBracket * bracket.rate;
                remainingIncome -= taxableInThisBracket;
            }
        }
        
        // Health insurance (3.1%)
        const healthInsurance = annualIncome * 0.031;
        
        // National Insurance (12% up to ceiling)
        const nationalInsuranceCeiling = 494580; // 2025 ceiling
        const nationalInsurance = Math.min(annualIncome, nationalInsuranceCeiling) * 0.12;
        
        return {
            totalTax: incomeTax + healthInsurance + nationalInsurance,
            breakdown: {
                incomeTax,
                healthInsurance,
                nationalInsurance
            }
        };
    };
    
    // UK annual tax calculation
    const calculateUKAnnualTax = (annualIncome) => {
        let incomeTax = 0;
        
        // UK tax allowances and brackets 2024/25
        const personalAllowance = 12570;
        const basicRateLimit = 50270;
        const higherRateLimit = 125140;
        
        // Reduce personal allowance for high earners
        let adjustedPersonalAllowance = personalAllowance;
        if (annualIncome > 100000) {
            const reduction = Math.min(personalAllowance, (annualIncome - 100000) / 2);
            adjustedPersonalAllowance = Math.max(0, personalAllowance - reduction);
        }
        
        const taxableIncome = Math.max(0, annualIncome - adjustedPersonalAllowance);
        
        // Calculate income tax
        if (taxableIncome > 0) {
            // Basic rate (20%)
            const basicRateTax = Math.min(taxableIncome, basicRateLimit - adjustedPersonalAllowance) * 0.20;
            
            // Higher rate (40%)
            const higherRateIncome = Math.max(0, Math.min(
                taxableIncome - (basicRateLimit - adjustedPersonalAllowance),
                higherRateLimit - basicRateLimit
            ));
            const higherRateTax = higherRateIncome * 0.40;
            
            // Additional rate (45%)
            const additionalRateIncome = Math.max(0, taxableIncome - (higherRateLimit - adjustedPersonalAllowance));
            const additionalRateTax = additionalRateIncome * 0.45;
            
            incomeTax = basicRateTax + higherRateTax + additionalRateTax;
        }
        
        // National Insurance
        const niThreshold = 12570;
        const upperEarningsLimit = 50270;
        let nationalInsurance = 0;
        
        if (annualIncome > niThreshold) {
            // 12% on earnings between threshold and upper limit
            const primaryNI = Math.min(annualIncome - niThreshold, upperEarningsLimit - niThreshold) * 0.12;
            // 2% on earnings above upper limit
            const additionalNI = Math.max(0, annualIncome - upperEarningsLimit) * 0.02;
            nationalInsurance = primaryNI + additionalNI;
        }
        
        return {
            totalTax: incomeTax + nationalInsurance,
            breakdown: {
                incomeTax,
                nationalInsurance
            }
        };
    };
    
    // US annual tax calculation
    const calculateUSAnnualTax = (annualIncome) => {
        let federalTax = 0;
        
        // US federal tax brackets 2024 (single filer)
        const standardDeduction = 14600;
        const taxableIncome = Math.max(0, annualIncome - standardDeduction);
        
        const brackets = [
            { min: 0, max: 11000, rate: 0.10 },
            { min: 11000, max: 44725, rate: 0.12 },
            { min: 44725, max: 95375, rate: 0.22 },
            { min: 95375, max: 182050, rate: 0.24 },
            { min: 182050, max: 231250, rate: 0.32 },
            { min: 231250, max: 578125, rate: 0.35 },
            { min: 578125, max: Infinity, rate: 0.37 }
        ];
        
        let remainingIncome = taxableIncome;
        
        // Calculate federal income tax
        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;
            
            const taxableInThisBracket = Math.min(
                remainingIncome,
                bracket.max - bracket.min
            );
            
            if (taxableInThisBracket > 0) {
                federalTax += taxableInThisBracket * bracket.rate;
                remainingIncome -= taxableInThisBracket;
            }
        }
        
        // Social Security (6.2% up to wage base)
        const socialSecurityWageBase = 160200;
        const socialSecurity = Math.min(annualIncome, socialSecurityWageBase) * 0.062;
        
        // Medicare (1.45% + additional 0.9% for high earners)
        let medicare = annualIncome * 0.0145;
        if (annualIncome > 200000) {
            medicare += (annualIncome - 200000) * 0.009; // Additional Medicare tax
        }
        
        return {
            totalTax: federalTax + socialSecurity + medicare,
            breakdown: {
                federalTax,
                socialSecurity,
                medicare
            }
        };
    };
    
    // Calculate tax on all additional income sources
    const calculateTotalAdditionalIncomeTax = (inputs) => {
        const country = inputs.country || 'israel';
        const baseSalary = (parseFloat(inputs.currentMonthlySalary) || 0) * 12;
        
        // Get all additional income sources
        const annualBonus = parseFloat(inputs.annualBonus) || 0;
        
        // Enhanced RSU calculation with stock prices
        let annualRSU = 0;
        if (inputs.rsuUnits && inputs.rsuCurrentStockPrice) {
            // Calculate RSU value based on units × stock price
            const rsuUnits = parseFloat(inputs.rsuUnits) || 0;
            const stockPrice = parseFloat(inputs.rsuCurrentStockPrice) || 0;
            const frequency = inputs.rsuFrequency || 'quarterly';
            
            // Calculate annual RSU value based on vesting frequency
            if (frequency === 'monthly') {
                annualRSU = rsuUnits * stockPrice * 12; // Monthly vesting
            } else if (frequency === 'quarterly') {
                annualRSU = rsuUnits * stockPrice * 4; // Quarterly vesting
            } else if (frequency === 'yearly') {
                annualRSU = rsuUnits * stockPrice; // Yearly vesting
            }
            
            console.log(`🎯 RSU Calculation: ${rsuUnits} units × $${stockPrice} (${frequency}) = $${annualRSU} annually`);
        } else {
            // Fallback to legacy calculation for backward compatibility
            annualRSU = (parseFloat(inputs.quarterlyRSU) || 0) * 4; // Annual RSU value
        }
        const quarterlyRSU = annualRSU; // Keep variable name for compatibility
        
        // Helper function to convert income to annual based on frequency
        const convertToAnnual = (amount, frequency) => {
            if (!amount || amount === 0) return 0;
            switch (frequency) {
                case 'monthly':
                    return amount * 12;
                case 'quarterly':
                    return amount * 4;
                case 'yearly':
                    return amount;
                default:
                    return amount * 12; // Default to monthly
            }
        };
        
        // Helper function to apply tax if income is before tax
        const applyTaxToIncome = (amount, isAfterTax, taxRate = 30) => {
            if (!amount || amount === 0) return { gross: 0, net: 0, tax: 0 };
            if (isAfterTax) {
                return { gross: amount, net: amount, tax: 0 };
            }
            const tax = amount * (taxRate / 100);
            return { gross: amount, net: amount - tax, tax: tax };
        };
        
        // Calculate each income type with frequency and tax handling
        const freelanceAnnual = convertToAnnual(inputs.freelanceIncome || 0, inputs.freelanceIncomeFrequency || 'monthly');
        const freelanceTaxInfo = applyTaxToIncome(freelanceAnnual, inputs.freelanceIncomeAfterTax, inputs.freelanceIncomeTaxRate || 30);
        
        const rentalAnnual = convertToAnnual(inputs.rentalIncome || 0, inputs.rentalIncomeFrequency || 'monthly');
        const rentalTaxInfo = applyTaxToIncome(rentalAnnual, inputs.rentalIncomeAfterTax, inputs.rentalIncomeTaxRate || 31);
        
        const dividendAnnual = convertToAnnual(inputs.dividendIncome || 0, inputs.dividendIncomeFrequency || 'quarterly');
        const dividendTaxInfo = applyTaxToIncome(dividendAnnual, inputs.dividendIncomeAfterTax, inputs.dividendIncomeTaxRate || 25);
        
        const otherAnnual = convertToAnnual(inputs.otherIncome || 0, inputs.otherIncomeFrequency || 'monthly');
        const otherTaxInfo = applyTaxToIncome(otherAnnual, inputs.otherIncomeAfterTax, inputs.otherIncomeTaxRate || 30);
        
        // If income is marked as after-tax, use the net values directly
        const freelanceIncome = inputs.freelanceIncomeAfterTax ? freelanceTaxInfo.net : freelanceAnnual;
        const rentalIncome = inputs.rentalIncomeAfterTax ? rentalTaxInfo.net : rentalAnnual;
        const dividendIncome = inputs.dividendIncomeAfterTax ? dividendTaxInfo.net : dividendAnnual;
        const otherIncomeAmount = inputs.otherIncomeAfterTax ? otherTaxInfo.net : otherAnnual;
        
        // Calculate total annual income (including otherIncome)
        const totalAnnualIncome = baseSalary + annualBonus + quarterlyRSU + 
                                  freelanceIncome + rentalIncome + dividendIncome + otherIncomeAmount;
        
        // Calculate taxes
        const baseTax = calculateAnnualTax(baseSalary, country);
        const totalTax = calculateAnnualTax(totalAnnualIncome, country);
        const additionalIncomeTax = totalTax.totalTax - baseTax.totalTax;
        
        // Calculate net amounts for each income type
        const bonusTaxInfo = calculateBonusTax(annualBonus, baseSalary, country);
        const rsuCustomTaxRate = inputs.rsuTaxRate; // Use custom rate if provided
        const rsuTaxInfo = calculateRSUTax(quarterlyRSU, baseSalary + annualBonus, country, rsuCustomTaxRate);
        
        // For other income types, calculate proportional tax
        const otherIncome = freelanceIncome + rentalIncome + dividendIncome + otherIncomeAmount;
        const otherIncomeTax = otherIncome > 0 ? 
            (additionalIncomeTax - bonusTaxInfo.tax - rsuTaxInfo.tax) : 0;
        
        return {
            totalAdditionalIncome: annualBonus + quarterlyRSU + freelanceIncome + 
                                   rentalIncome + dividendIncome + otherIncomeAmount,
            totalAdditionalTax: Math.round(additionalIncomeTax),
            effectiveRate: totalAnnualIncome > 0 ? 
                Math.round((totalTax.totalTax / totalAnnualIncome) * 100) : 0,
            marginalRate: getMarginalTaxRate(totalAnnualIncome, country),
            breakdown: {
                bonus: {
                    gross: annualBonus,
                    tax: bonusTaxInfo.tax,
                    net: bonusTaxInfo.netBonus,
                    rate: bonusTaxInfo.effectiveRate
                },
                rsu: {
                    gross: quarterlyRSU,
                    tax: rsuTaxInfo.tax,
                    net: rsuTaxInfo.netRSU,
                    rate: rsuTaxInfo.effectiveRate
                },
                otherIncome: {
                    gross: otherIncome,
                    tax: Math.round(otherIncomeTax),
                    net: Math.round(otherIncome - otherIncomeTax),
                    rate: otherIncome > 0 ? Math.round((otherIncomeTax / otherIncome) * 100) : 0
                }
            }
        };
    };
    
    // Get marginal tax rate for a given income level
    const getMarginalTaxRate = (annualIncome, country) => {
        switch (country) {
            case 'israel':
            case 'ISR':
                if (annualIncome > 718440) return 50;
                if (annualIncome > 558240) return 47;
                if (annualIncome > 269280) return 35;
                if (annualIncome > 188280) return 31;
                if (annualIncome > 116760) return 20;
                if (annualIncome > 81480) return 14;
                return 10;
            
            case 'uk':
            case 'UK':
                if (annualIncome > 125140) return 45;
                if (annualIncome > 50270) return 40;
                if (annualIncome > 12570) return 20;
                return 0;
            
            case 'us':
            case 'US':
                if (annualIncome > 578125) return 37;
                if (annualIncome > 231250) return 35;
                if (annualIncome > 182050) return 32;
                if (annualIncome > 95375) return 24;
                if (annualIncome > 44725) return 22;
                if (annualIncome > 11000) return 12;
                return 10;
            
            default:
                return 0;
        }
    };
    
    // Calculate partner RSU income for couple mode
    const calculatePartnerRSUIncome = (inputs, partnerKey) => {
        const country = inputs.country || 'israel';
        const baseSalary = (parseFloat(inputs[`${partnerKey}Salary`]) || 0) * 12;
        
        // Calculate partner RSU value
        let annualRSU = 0;
        const rsuUnits = parseFloat(inputs[`${partnerKey}RsuUnits`]) || 0;
        const stockPrice = parseFloat(inputs[`${partnerKey}RsuCurrentStockPrice`]) || 0;
        const frequency = inputs[`${partnerKey}RsuFrequency`] || 'quarterly';
        
        if (rsuUnits && stockPrice) {
            if (frequency === 'monthly') {
                annualRSU = rsuUnits * stockPrice * 12;
            } else if (frequency === 'quarterly') {
                annualRSU = rsuUnits * stockPrice * 4;
            } else if (frequency === 'yearly') {
                annualRSU = rsuUnits * stockPrice;
            }
        }
        
        // Calculate tax with custom rate if provided
        const customTaxRate = inputs[`${partnerKey}RsuTaxRate`];
        const rsuTaxInfo = calculateRSUTax(annualRSU, baseSalary, country, customTaxRate);
        
        return {
            grossAnnual: annualRSU,
            netAnnual: rsuTaxInfo.netRSU,
            tax: rsuTaxInfo.tax,
            effectiveRate: rsuTaxInfo.effectiveRate,
            monthlyNet: Math.round(rsuTaxInfo.netRSU / 12)
        };
    };
    
    // Calculate monthly after-tax additional income for retirement projections
    const getMonthlyAfterTaxAdditionalIncome = (inputs) => {
        const country = inputs.country || 'israel';
        const baseSalary = (parseFloat(inputs.currentMonthlySalary) || 0) * 12;
        
        // Helper functions
        const convertToAnnual = (amount, frequency) => {
            if (!amount || amount === 0) return 0;
            switch (frequency) {
                case 'monthly':
                    return amount * 12;
                case 'quarterly':
                    return amount * 4;
                case 'yearly':
                    return amount;
                default:
                    return amount * 12;
            }
        };
        
        const getNetAmount = (amount, frequency, isAfterTax, taxRate = 30) => {
            const annual = convertToAnnual(amount, frequency);
            if (!annual) return 0;
            if (isAfterTax) return annual;
            return annual * (1 - taxRate / 100);
        };
        
        // Calculate net amounts for each income type
        const freelanceNet = getNetAmount(
            inputs.freelanceIncome || 0,
            inputs.freelanceIncomeFrequency || 'monthly',
            inputs.freelanceIncomeAfterTax,
            inputs.freelanceIncomeTaxRate || 30
        );
        
        const rentalNet = getNetAmount(
            inputs.rentalIncome || 0,
            inputs.rentalIncomeFrequency || 'monthly',
            inputs.rentalIncomeAfterTax,
            inputs.rentalIncomeTaxRate || 31
        );
        
        const dividendNet = getNetAmount(
            inputs.dividendIncome || 0,
            inputs.dividendIncomeFrequency || 'quarterly',
            inputs.dividendIncomeAfterTax,
            inputs.dividendIncomeTaxRate || 25
        );
        
        const otherNet = getNetAmount(
            inputs.otherIncome || 0,
            inputs.otherIncomeFrequency || 'monthly',
            inputs.otherIncomeAfterTax,
            inputs.otherIncomeTaxRate || 30
        );
        
        // Calculate bonus and RSU using existing methods
        const annualBonus = parseFloat(inputs.annualBonus) || 0;
        const bonusTaxInfo = calculateBonusTax(annualBonus, baseSalary, country);
        
        // Enhanced RSU calculation
        let annualRSU = 0;
        if (inputs.rsuUnits && inputs.rsuCurrentStockPrice) {
            const rsuUnits = parseFloat(inputs.rsuUnits) || 0;
            const stockPrice = parseFloat(inputs.rsuCurrentStockPrice) || 0;
            const frequency = inputs.rsuFrequency || 'quarterly';
            
            if (frequency === 'monthly') {
                annualRSU = rsuUnits * stockPrice * 12;
            } else if (frequency === 'quarterly') {
                annualRSU = rsuUnits * stockPrice * 4;
            } else if (frequency === 'yearly') {
                annualRSU = rsuUnits * stockPrice;
            }
        } else {
            annualRSU = (parseFloat(inputs.quarterlyRSU) || 0) * 4;
        }
        
        const rsuTaxInfo = calculateRSUTax(annualRSU, baseSalary + annualBonus, country, inputs.rsuTaxRate);
        
        // Calculate monthly values
        return {
            monthlyNetBonus: Math.round(bonusTaxInfo.netBonus / 12),
            monthlyNetRSU: Math.round(rsuTaxInfo.netRSU / 12),
            monthlyNetOther: Math.round((freelanceNet + rentalNet + dividendNet + otherNet) / 12),
            totalMonthlyNet: Math.round(
                (bonusTaxInfo.netBonus + rsuTaxInfo.netRSU + 
                 freelanceNet + rentalNet + dividendNet + otherNet) / 12
            ),
            // Detailed breakdown
            breakdown: {
                freelance: { annual: freelanceNet, monthly: Math.round(freelanceNet / 12) },
                rental: { annual: rentalNet, monthly: Math.round(rentalNet / 12) },
                dividend: { annual: dividendNet, monthly: Math.round(dividendNet / 12) },
                other: { annual: otherNet, monthly: Math.round(otherNet / 12) }
            }
        };
    };
    
    return {
        calculateBonusTax,
        calculateRSUTax,
        calculateTotalAdditionalIncomeTax,
        getMonthlyAfterTaxAdditionalIncome,
        getMarginalTaxRate,
        calculatePartnerRSUIncome
    };
})();

// Log successful loading
console.log('✅ AdditionalIncomeTax utilities loaded');