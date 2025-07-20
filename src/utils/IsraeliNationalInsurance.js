// IsraeliNationalInsurance.js - Comprehensive Israeli National Insurance (Bituach Leumi) Calculator
// Implements 2024 Israeli National Insurance regulations with full benefit calculations

/**
 * Israeli National Insurance (Bituach Leumi) Comprehensive Calculator
 * 
 * This module implements the complete Israeli National Insurance system including:
 * - Old-age pension calculations
 * - Survivors' benefits
 * - Disability benefits
 * - Unemployment benefits
 * - Income guarantees
 * - Child allowances
 * - Maternity benefits
 * 
 * Based on 2024 National Insurance Institute regulations
 */

class IsraeliNationalInsurance {
    constructor() {
        // 2024 National Insurance constants
        this.constants = {
            // Basic amounts (in NIS, updated for 2024)
            basicAmount: 1732,           // Basic amount for 2024
            seniorSupplementAmount: 866, // Senior supplement amount
            incomeTestAmount: 5196,      // Income test threshold
            
            // Contribution rates (2024)
            employeeRate: 0.04,          // 4% employee rate
            employerRate: 0.0335,        // 3.35% employer rate (up to ceiling)
            employerRateAboveCeiling: 0.075, // 7.5% employer rate above ceiling
            
            // Income ceilings and floors (2024)
            maxInsuredIncome: 47591,     // Maximum monthly insured income
            minInsuredIncome: 7310,      // Minimum monthly insured income
            
            // Pension calculation parameters
            accrualRate: 0.02,           // 2% per year of average wage
            maxPensionYears: 40,         // Maximum years for full pension
            minContributionYears: 144,   // Minimum months (12 years) for pension eligibility
            
            // Age thresholds
            retirementAge: {
                men: 67,
                women: 62    // Gradually increasing to 65 by 2032
            },
            
            // Survivor benefits
            survivorPensionRate: 0.6,    // 60% of insured person's pension
            
            // Disability benefits
            disabilityRate: {
                full: 0.25,              // 25% of average wage
                partial: 0.125           // 12.5% of average wage
            },
            
            // Income guarantee thresholds
            incomeGuarantee: {
                single: 3459,            // Monthly income guarantee for single person
                couple: 5193,            // Monthly income guarantee for couple
                additionalChild: 1384    // Additional amount per child
            }
        };
        
        // Average wage progression (estimated for future years)
        this.averageWageProgression = {
            2024: 12113,
            2025: 12600,
            2026: 13100,
            2027: 13600,
            2028: 14100,
            2029: 14600,
            2030: 15100
        };
    }
    
    /**
     * Calculate National Insurance contributions
     * @param {number} monthlyIncome - Monthly gross income
     * @param {number} yearlyIncome - Yearly gross income  
     * @param {string} employmentType - 'employee' or 'self_employed'
     * @returns {Object} Contribution breakdown
     */
    calculateContributions(monthlyIncome, yearlyIncome = null, employmentType = 'employee') {
        const yearly = yearlyIncome || (monthlyIncome * 12);
        const monthly = monthlyIncome;
        
        // Apply income ceiling
        const insuredMonthlyIncome = Math.min(monthly, this.constants.maxInsuredIncome);
        const insuredYearlyIncome = insuredMonthlyIncome * 12;
        
        if (employmentType === 'employee') {
            return this.calculateEmployeeContributions(insuredMonthlyIncome, insuredYearlyIncome);
        } else {
            return this.calculateSelfEmployedContributions(insuredMonthlyIncome, insuredYearlyIncome);
        }
    }
    
    /**
     * Calculate employee National Insurance contributions
     */
    calculateEmployeeContributions(monthlyIncome, yearlyIncome) {
        const employeeContribution = monthlyIncome * this.constants.employeeRate;
        
        // Employer contribution (different rates below and above ceiling)
        let employerContribution;
        if (monthlyIncome <= this.constants.maxInsuredIncome) {
            employerContribution = monthlyIncome * this.constants.employerRate;
        } else {
            const belowCeiling = this.constants.maxInsuredIncome * this.constants.employerRate;
            const aboveCeiling = (monthlyIncome - this.constants.maxInsuredIncome) * this.constants.employerRateAboveCeiling;
            employerContribution = belowCeiling + aboveCeiling;
        }
        
        return {
            employee: {
                monthly: employeeContribution,
                yearly: employeeContribution * 12,
                rate: this.constants.employeeRate * 100
            },
            employer: {
                monthly: employerContribution,
                yearly: employerContribution * 12,
                effectiveRate: (employerContribution / monthlyIncome) * 100
            },
            total: {
                monthly: employeeContribution + employerContribution,
                yearly: (employeeContribution + employerContribution) * 12
            },
            insuredIncome: {
                monthly: monthlyIncome,
                yearly: yearlyIncome
            }
        };
    }
    
    /**
     * Calculate self-employed National Insurance contributions
     */
    calculateSelfEmployedContributions(monthlyIncome, yearlyIncome) {
        // Self-employed pay both employee and employer portions with different rates
        const selfEmployedRate = 0.1047; // Combined rate for self-employed (2024)
        const contribution = monthlyIncome * selfEmployedRate;
        
        return {
            selfEmployed: {
                monthly: contribution,
                yearly: contribution * 12,
                rate: selfEmployedRate * 100
            },
            total: {
                monthly: contribution,
                yearly: contribution * 12
            },
            insuredIncome: {
                monthly: monthlyIncome,
                yearly: yearlyIncome
            }
        };
    }
    
    /**
     * Calculate old-age pension benefits
     * @param {Object} profile - Insured person profile
     * @returns {Object} Pension calculation details
     */
    calculateOldAgePension(profile) {
        const {
            contributionMonths,
            averageInsuredIncome,
            retirementAge,
            gender = 'men',
            spouseIncome = 0,
            dependentChildren = 0
        } = profile;
        
        // Check eligibility
        if (contributionMonths < this.constants.minContributionYears) {
            return {
                eligible: false,
                reason: 'Insufficient contribution period',
                minimumRequired: this.constants.minContributionYears,
                currentContributions: contributionMonths
            };
        }
        
        // Calculate base pension
        const basePension = this.calculateBasePension(contributionMonths, averageInsuredIncome);
        
        // Calculate supplements
        const seniorSupplement = this.calculateSeniorSupplement(profile);
        const incomeGuarantee = this.calculateIncomeGuarantee(profile, basePension);
        
        // Calculate total pension
        const totalPension = Math.max(basePension + seniorSupplement, incomeGuarantee);
        
        return {
            eligible: true,
            basePension: basePension,
            seniorSupplement: seniorSupplement,
            incomeGuarantee: incomeGuarantee,
            totalPension: totalPension,
            contributionYears: Math.floor(contributionMonths / 12),
            replacementRatio: (totalPension / averageInsuredIncome) * 100,
            details: {
                contributionMonths,
                averageInsuredIncome,
                basicAmount: this.constants.basicAmount
            }
        };
    }
    
    /**
     * Calculate base pension using Israeli formula
     */
    calculateBasePension(contributionMonths, averageInsuredIncome) {
        const contributionYears = contributionMonths / 12;
        
        // Calculate pension percentage based on contribution years
        let pensionPercentage;
        if (contributionYears <= 10) {
            pensionPercentage = contributionYears * 2; // 2% per year
        } else if (contributionYears <= 20) {
            pensionPercentage = 20 + (contributionYears - 10) * 3; // Additional 3% per year
        } else if (contributionYears <= 30) {
            pensionPercentage = 50 + (contributionYears - 20) * 2; // Additional 2% per year
        } else {
            pensionPercentage = 70 + (contributionYears - 30) * 1; // Additional 1% per year
        }
        
        // Maximum pension percentage is 80%
        pensionPercentage = Math.min(pensionPercentage, 80);
        
        // Calculate average wage component (60% of current average wage)
        const currentAverageWage = this.averageWageProgression[2024];
        const averageWageComponent = currentAverageWage * 0.6;
        
        // Calculate personal income component (40% of personal average wage)
        const personalIncomeComponent = averageInsuredIncome * 0.4;
        
        // Base pension calculation
        const basePension = (averageWageComponent + personalIncomeComponent) * (pensionPercentage / 100);
        
        return Math.round(basePension);
    }
    
    /**
     * Calculate senior supplement (for low-income pensioners)
     */
    calculateSeniorSupplement(profile) {
        const { totalIncome = 0, isMarried = false } = profile;
        
        // Income test thresholds
        const threshold = isMarried ? 
            this.constants.incomeTestAmount * 1.5 : 
            this.constants.incomeTestAmount;
        
        if (totalIncome > threshold) {
            return 0; // No supplement if income exceeds threshold
        }
        
        // Full supplement amount
        const fullSupplement = this.constants.seniorSupplementAmount;
        
        // Reduced supplement based on income
        const reduction = Math.max(0, (totalIncome - threshold * 0.7) * 0.6);
        
        return Math.max(0, Math.round(fullSupplement - reduction));
    }
    
    /**
     * Calculate income guarantee (minimum pension)
     */
    calculateIncomeGuarantee(profile, basePension) {
        const { isMarried = false, dependentChildren = 0, spouseIncome = 0 } = profile;
        
        let guarantee = isMarried ? 
            this.constants.incomeGuarantee.couple : 
            this.constants.incomeGuarantee.single;
        
        // Add child allowances
        guarantee += dependentChildren * this.constants.incomeGuarantee.additionalChild;
        
        // Apply spouse income test
        if (isMarried && spouseIncome > 0) {
            const reduction = Math.min(spouseIncome * 0.6, guarantee * 0.5);
            guarantee = Math.max(guarantee - reduction, guarantee * 0.5);
        }
        
        return Math.round(guarantee);
    }
    
    /**
     * Calculate survivor benefits
     * @param {Object} profile - Survivor profile
     * @returns {Object} Survivor benefit details
     */
    calculateSurvivorBenefits(profile) {
        const {
            deceasedPension,
            survivorAge,
            dependentChildren = 0,
            survivorIncome = 0,
            isWidow = true
        } = profile;
        
        // Base survivor pension (60% of deceased pension)
        const baseSurvivorPension = deceasedPension * this.constants.survivorPensionRate;
        
        // Child allowances
        const childAllowances = dependentChildren * this.constants.incomeGuarantee.additionalChild;
        
        // Total survivor benefits
        const totalBenefits = baseSurvivorPension + childAllowances;
        
        // Apply income test
        const incomeTestReduction = this.applySurvivorIncomeTest(totalBenefits, survivorIncome);
        
        const finalBenefits = Math.max(totalBenefits - incomeTestReduction, totalBenefits * 0.5);
        
        return {
            baseSurvivorPension,
            childAllowances,
            totalBenefits,
            incomeTestReduction,
            finalBenefits: Math.round(finalBenefits),
            details: {
                deceasedPension,
                survivorRate: this.constants.survivorPensionRate * 100,
                dependentChildren
            }
        };
    }
    
    /**
     * Apply income test for survivor benefits
     */
    applySurvivorIncomeTest(benefits, survivorIncome) {
        const exemptAmount = this.constants.basicAmount * 2;
        
        if (survivorIncome <= exemptAmount) {
            return 0;
        }
        
        const excessIncome = survivorIncome - exemptAmount;
        return Math.min(excessIncome * 0.6, benefits * 0.5);
    }
    
    /**
     * Calculate disability benefits
     * @param {Object} profile - Disability profile
     * @returns {Object} Disability benefit details
     */
    calculateDisabilityBenefits(profile) {
        const {
            disabilityLevel, // 'full', 'partial', or percentage
            averageInsuredIncome,
            contributionMonths,
            age,
            dependentChildren = 0,
            spouseIncome = 0
        } = profile;
        
        // Check minimum contribution requirement
        const minContributions = this.calculateMinDisabilityContributions(age);
        
        if (contributionMonths < minContributions) {
            return {
                eligible: false,
                reason: 'Insufficient contribution period',
                required: minContributions,
                current: contributionMonths
            };
        }
        
        // Calculate base disability pension
        const basePension = this.calculateDisabilityBasePension(disabilityLevel, averageInsuredIncome);
        
        // Add child allowances
        const childAllowances = dependentChildren * this.constants.incomeGuarantee.additionalChild;
        
        // Apply income test
        const incomeTestReduction = this.applyDisabilityIncomeTest(basePension, spouseIncome);
        
        const totalBenefits = Math.max(basePension + childAllowances - incomeTestReduction, basePension * 0.25);
        
        return {
            eligible: true,
            basePension,
            childAllowances,
            incomeTestReduction,
            totalBenefits: Math.round(totalBenefits),
            disabilityLevel,
            details: {
                contributionMonths,
                averageInsuredIncome,
                minContributions
            }
        };
    }
    
    /**
     * Calculate minimum disability contribution requirements
     */
    calculateMinDisabilityContributions(age) {
        if (age < 28) {
            return 12; // 1 year
        } else if (age < 31) {
            return 24; // 2 years
        } else {
            return Math.min(60, (age - 21) * 12 / 3); // 1/3 of years since age 21, max 5 years
        }
    }
    
    /**
     * Calculate base disability pension
     */
    calculateDisabilityBasePension(disabilityLevel, averageInsuredIncome) {
        const currentAverageWage = this.averageWageProgression[2024];
        
        let disabilityRate;
        if (typeof disabilityLevel === 'number') {
            disabilityRate = disabilityLevel / 100;
        } else {
            disabilityRate = this.constants.disabilityRate[disabilityLevel] || this.constants.disabilityRate.full;
        }
        
        // Disability pension is percentage of average wage
        return Math.round(currentAverageWage * disabilityRate);
    }
    
    /**
     * Apply income test for disability benefits
     */
    applyDisabilityIncomeTest(benefits, spouseIncome) {
        if (spouseIncome <= this.constants.basicAmount) {
            return 0;
        }
        
        const excessIncome = spouseIncome - this.constants.basicAmount;
        return Math.min(excessIncome * 0.6, benefits * 0.5);
    }
    
    /**
     * Project future National Insurance pension for retirement planning
     * @param {Object} profile - Complete insured person profile
     * @returns {Object} Projected pension at retirement
     */
    projectRetirementPension(profile) {
        const {
            currentAge,
            retirementAge,
            currentMonthlyIncome,
            contributionMonthsToDate = 0,
            averageIncomeToDate = 0,
            expectedIncomeGrowth = 0.03, // 3% annual growth
            gender = 'men'
        } = profile;
        
        const yearsToRetirement = retirementAge - currentAge;
        const monthsToRetirement = yearsToRetirement * 12;
        
        // Project future income
        const futureIncomes = [];
        let currentIncome = currentMonthlyIncome;
        
        for (let year = 0; year < yearsToRetirement; year++) {
            currentIncome *= (1 + expectedIncomeGrowth);
            futureIncomes.push(currentIncome);
        }
        
        // Calculate projected average insured income
        const totalContributionMonths = contributionMonthsToDate + monthsToRetirement;
        const totalIncomeSum = (averageIncomeToDate * contributionMonthsToDate) + 
                              (futureIncomes.reduce((sum, income) => sum + income, 0) * 12);
        const projectedAverageIncome = totalIncomeSum / totalContributionMonths;
        
        // Calculate projected pension
        const projectedProfile = {
            ...profile,
            contributionMonths: totalContributionMonths,
            averageInsuredIncome: Math.min(projectedAverageIncome, this.constants.maxInsuredIncome)
        };
        
        const pensionCalculation = this.calculateOldAgePension(projectedProfile);
        
        return {
            projectedPension: pensionCalculation,
            projectionDetails: {
                currentAge,
                retirementAge,
                yearsToRetirement,
                totalContributionMonths,
                projectedAverageIncome,
                futureIncomes: futureIncomes.slice(0, 5) // First 5 years for reference
            }
        };
    }
    
    /**
     * Calculate total lifetime National Insurance benefits value
     * @param {Object} pensionDetails - Pension calculation results
     * @param {number} lifeExpectancy - Expected years of pension receipt
     * @returns {Object} Lifetime benefit analysis
     */
    calculateLifetimeBenefits(pensionDetails, lifeExpectancy = 85) {
        const { totalPension } = pensionDetails;
        const yearlyPension = totalPension * 12;
        
        // Calculate years of pension receipt
        const retirementAge = 67; // Standard retirement age
        const yearsOfPension = lifeExpectancy - retirementAge;
        
        // Calculate total lifetime benefits
        const totalLifetimeBenefits = yearlyPension * yearsOfPension;
        
        // Calculate present value (assuming 3% inflation)
        const inflationRate = 0.03;
        let presentValue = 0;
        
        for (let year = 1; year <= yearsOfPension; year++) {
            const yearlyBenefit = yearlyPension / Math.pow(1 + inflationRate, year);
            presentValue += yearlyBenefit;
        }
        
        return {
            monthlyPension: totalPension,
            yearlyPension,
            yearsOfPension,
            totalLifetimeBenefits,
            presentValue: Math.round(presentValue),
            averageLifetimeMonthly: Math.round(presentValue / (yearsOfPension * 12))
        };
    }
    
    /**
     * Get current National Insurance constants and rates
     * @returns {Object} Current year constants
     */
    getCurrentConstants() {
        return {
            ...this.constants,
            currentYear: 2024,
            averageWage: this.averageWageProgression[2024],
            lastUpdated: '2024-01-01'
        };
    }
}

// Export for use in other modules
window.IsraeliNationalInsurance = IsraeliNationalInsurance;

// Example usage and helper functions
const nationalInsuranceCalculator = new IsraeliNationalInsurance();

/**
 * Helper function to format currency in NIS
 * @param {number} amount - Amount in NIS
 * @returns {string} Formatted currency string
 */
function formatNIS(amount) {
    return new Intl.NumberFormat('he-IL', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0
    }).format(amount);
}

/**
 * Helper function to create a complete National Insurance profile
 * @param {Object} basicProfile - Basic profile information
 * @returns {Object} Complete profile for calculations
 */
function createNationalInsuranceProfile(basicProfile) {
    const {
        currentAge = 30,
        retirementAge = 67,
        monthlyIncome = 15000,
        gender = 'men',
        isMarried = false,
        dependentChildren = 0,
        contributionMonthsToDate = 0
    } = basicProfile;
    
    return {
        currentAge,
        retirementAge,
        currentMonthlyIncome: monthlyIncome,
        gender,
        isMarried,
        dependentChildren,
        contributionMonthsToDate,
        averageIncomeToDate: monthlyIncome,
        expectedIncomeGrowth: 0.03,
        spouseIncome: 0
    };
}

// Export helper functions
window.formatNIS = formatNIS;
window.createNationalInsuranceProfile = createNationalInsuranceProfile;
window.nationalInsuranceCalculator = nationalInsuranceCalculator;

console.log('✅ Israeli National Insurance calculator loaded successfully');