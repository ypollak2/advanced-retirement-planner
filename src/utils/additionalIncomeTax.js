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
        
        const freelanceIncome = (parseFloat(inputs.freelanceIncome) || 0) * 12;
        const rentalIncome = (parseFloat(inputs.rentalIncome) || 0) * 12;
        const dividendIncome = (parseFloat(inputs.dividendIncome) || 0) * 12;
        
        // Calculate total annual income
        const totalAnnualIncome = baseSalary + annualBonus + quarterlyRSU + 
                                  freelanceIncome + rentalIncome + dividendIncome;
        
        // Calculate taxes
        const baseTax = calculateAnnualTax(baseSalary, country);
        const totalTax = calculateAnnualTax(totalAnnualIncome, country);
        const additionalIncomeTax = totalTax.totalTax - baseTax.totalTax;
        
        // Calculate net amounts for each income type
        const bonusTaxInfo = calculateBonusTax(annualBonus, baseSalary, country);
        const rsuTaxInfo = calculateRSUTax(quarterlyRSU, baseSalary + annualBonus, country);
        
        // For other income types, calculate proportional tax
        const otherIncome = freelanceIncome + rentalIncome + dividendIncome;
        const otherIncomeTax = otherIncome > 0 ? 
            (additionalIncomeTax - bonusTaxInfo.tax - rsuTaxInfo.tax) : 0;
        
        return {
            totalAdditionalIncome: annualBonus + quarterlyRSU + freelanceIncome + 
                                   rentalIncome + dividendIncome,
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
    
    // Calculate monthly after-tax additional income for retirement projections
    const getMonthlyAfterTaxAdditionalIncome = (inputs) => {
        const taxInfo = calculateTotalAdditionalIncomeTax(inputs);
        
        return {
            monthlyNetBonus: Math.round(taxInfo.breakdown.bonus.net / 12),
            monthlyNetRSU: Math.round(taxInfo.breakdown.rsu.net / 12),
            monthlyNetOther: Math.round(taxInfo.breakdown.otherIncome.net / 12),
            totalMonthlyNet: Math.round(
                (taxInfo.breakdown.bonus.net + 
                 taxInfo.breakdown.rsu.net + 
                 taxInfo.breakdown.otherIncome.net) / 12
            )
        };
    };
    
    return {
        calculateBonusTax,
        calculateRSUTax,
        calculateTotalAdditionalIncomeTax,
        getMonthlyAfterTaxAdditionalIncome,
        getMarginalTaxRate
    };
})();

// Log successful loading
console.log('✅ AdditionalIncomeTax utilities loaded');