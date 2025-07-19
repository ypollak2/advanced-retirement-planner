// Tax Calculator - Country-Specific Tax Guidelines
// Created by Yali Pollak (יהלי פולק) - v6.0.0-beta.1

import {
  Country,
  Currency,
  TaxBracketType,
  SocialInsuranceType,
  DeductionType,
  TaxCalculationError,
  type CountryTaxRule,
  type TaxCalculationResult,
  type TaxBracket,
  type SocialInsurance,
  type TaxDeduction,
} from '@/types';

// =====================================================
// TAX RULES DATABASE - 2024 TAX YEAR
// =====================================================

export class TaxCalculator {
  private readonly taxRules: Map<Country, CountryTaxRule> = new Map();

  constructor() {
    this.initializeTaxRules();
  }

  private initializeTaxRules(): void {
    // Israel Tax Rules (2024)
    this.taxRules.set(Country.ISRAEL, {
      country: Country.ISRAEL,
      currency: Currency.ILS,
      year: 2024,
      bracketType: TaxBracketType.PROGRESSIVE,
      description: 'Israel Progressive Income Tax System 2024',
      lastUpdated: new Date('2024-01-01'),
      taxBrackets: [
        { min: 0, max: 81240, rate: 10 }, // First bracket: 10%
        { min: 81241, max: 116760, rate: 14 }, // Second bracket: 14%
        { min: 116761, max: 187440, rate: 20 }, // Third bracket: 20%
        { min: 187441, max: 241680, rate: 31 }, // Fourth bracket: 31%
        { min: 241681, max: 498360, rate: 35 }, // Fifth bracket: 35%
        { min: 498361, max: 721560, rate: 47 }, // Sixth bracket: 47%
        { min: 721561, max: null, rate: 50 }, // Top bracket: 50%
      ],
      socialInsurances: [
        {
          type: SocialInsuranceType.SOCIAL_SECURITY,
          rate: 12, // Total: 12% (employee 3.5% + employer 8.5%)
          cap: 47520, // Bituach Leumi cap
          employerContribution: 8.5,
          description: 'Bituach Leumi (National Insurance)',
        },
        {
          type: SocialInsuranceType.HEALTH_INSURANCE,
          rate: 8, // Total: 8% (employee 3.1% + employer 4.9%)
          employerContribution: 4.9,
          description: 'Health Insurance Tax',
        },
      ],
      deductions: [
        {
          type: DeductionType.PERSONAL_ALLOWANCE,
          amount: 2640, // Monthly credit point value
          description: 'Personal Tax Credit (2.64 credit points)',
        },
      ],
    });

    // USA Tax Rules (2024)
    this.taxRules.set(Country.USA, {
      country: Country.USA,
      currency: Currency.USD,
      year: 2024,
      bracketType: TaxBracketType.PROGRESSIVE,
      description: 'US Federal Income Tax System 2024 (Single Filer)',
      lastUpdated: new Date('2024-01-01'),
      taxBrackets: [
        { min: 0, max: 11000, rate: 10 },
        { min: 11001, max: 44725, rate: 12 },
        { min: 44726, max: 95375, rate: 22 },
        { min: 95376, max: 182050, rate: 24 },
        { min: 182051, max: 231250, rate: 32 },
        { min: 231251, max: 578125, rate: 35 },
        { min: 578126, max: null, rate: 37 },
      ],
      socialInsurances: [
        {
          type: SocialInsuranceType.SOCIAL_SECURITY,
          rate: 12.4, // Total: 12.4% (employee 6.2% + employer 6.2%)
          cap: 160200, // 2024 Social Security cap
          employerContribution: 6.2,
          description: 'Social Security Tax (OASDI)',
        },
        {
          type: SocialInsuranceType.MEDICARE,
          rate: 2.9, // Total: 2.9% (employee 1.45% + employer 1.45%)
          employerContribution: 1.45,
          description: 'Medicare Tax',
        },
      ],
      deductions: [
        {
          type: DeductionType.STANDARD,
          amount: 14600, // 2024 standard deduction for single filer
          description: 'Standard Deduction (Single)',
        },
      ],
    });

    // UK Tax Rules (2024-2025)
    this.taxRules.set(Country.UK, {
      country: Country.UK,
      currency: Currency.GBP,
      year: 2024,
      bracketType: TaxBracketType.PROGRESSIVE,
      description: 'UK Income Tax System 2024-2025',
      lastUpdated: new Date('2024-04-06'),
      taxBrackets: [
        { min: 0, max: 12570, rate: 0 }, // Personal allowance
        { min: 12571, max: 50270, rate: 20 }, // Basic rate
        { min: 50271, max: 125140, rate: 40 }, // Higher rate
        { min: 125141, max: null, rate: 45 }, // Additional rate
      ],
      socialInsurances: [
        {
          type: SocialInsuranceType.SOCIAL_SECURITY,
          rate: 12, // Total National Insurance (employee portion)
          cap: 50270, // Reduced rate above this
          description: 'National Insurance Class 1 (Employee)',
        },
      ],
      deductions: [
        {
          type: DeductionType.PERSONAL_ALLOWANCE,
          amount: 12570, // 2024-2025 personal allowance
          description: 'Personal Allowance',
        },
      ],
    });

    // Germany Tax Rules (2024)
    this.taxRules.set(Country.GERMANY, {
      country: Country.GERMANY,
      currency: Currency.EUR,
      year: 2024,
      bracketType: TaxBracketType.PROGRESSIVE,
      description: 'Germany Income Tax System 2024',
      lastUpdated: new Date('2024-01-01'),
      taxBrackets: [
        { min: 0, max: 11604, rate: 0 }, // Tax-free allowance
        { min: 11605, max: 17005, rate: 14 }, // Entry rate (progressive)
        { min: 17006, max: 66760, rate: 24 }, // Progressive zone
        { min: 66761, max: 277825, rate: 42 }, // Top rate
        { min: 277826, max: null, rate: 45 }, // Rich tax
      ],
      socialInsurances: [
        {
          type: SocialInsuranceType.PENSION_CONTRIBUTION,
          rate: 18.6, // Total pension insurance
          cap: 87600, // 2024 contribution ceiling
          employerContribution: 9.3,
          description: 'Pension Insurance (Rentenversicherung)',
        },
        {
          type: SocialInsuranceType.UNEMPLOYMENT,
          rate: 2.6, // Total unemployment insurance
          cap: 87600,
          employerContribution: 1.3,
          description: 'Unemployment Insurance (Arbeitslosenversicherung)',
        },
        {
          type: SocialInsuranceType.HEALTH_INSURANCE,
          rate: 14.6, // Average health insurance rate
          cap: 62100,
          employerContribution: 7.3,
          description: 'Health Insurance (Krankenversicherung)',
        },
      ],
      deductions: [
        {
          type: DeductionType.STANDARD,
          amount: 1230, // Employee deduction (Arbeitnehmer-Pauschbetrag)
          description: 'Employee Standard Deduction',
        },
      ],
    });

    console.log('TaxCalculator v6.0.0-beta.1 loaded successfully');
  }

  /**
   * Calculate net salary from gross salary for a specific country
   */
  public calculateNetSalary(
    grossSalary: number,
    country: Country,
    isAnnual: boolean = true
  ): TaxCalculationResult {
    if (grossSalary < 0) {
      throw new TaxCalculationError('Gross salary cannot be negative', country, grossSalary);
    }

    const taxRule = this.taxRules.get(country);
    if (!taxRule) {
      throw new TaxCalculationError(`Tax rules not available for ${country}`, country, grossSalary);
    }

    // Convert monthly to annual if needed
    const annualGrossSalary = isAnnual ? grossSalary : grossSalary * 12;

    // Calculate deductions
    const totalDeductions = this.calculateDeductions(annualGrossSalary, taxRule);
    const taxableIncome = Math.max(0, annualGrossSalary - totalDeductions);

    // Calculate income tax
    const incomeTax = this.calculateIncomeTax(taxableIncome, taxRule);

    // Calculate social insurance taxes
    const socialInsuranceTax = this.calculateSocialInsurance(annualGrossSalary, taxRule);

    // Calculate totals
    const totalTax = incomeTax + socialInsuranceTax;
    const netSalary = annualGrossSalary - totalTax;
    const effectiveTaxRate = annualGrossSalary > 0 ? (totalTax / annualGrossSalary) * 100 : 0;
    const marginalTaxRate = this.calculateMarginalTaxRate(taxableIncome, taxRule);

    // Generate detailed breakdown
    const breakdown = this.generateBreakdown(annualGrossSalary, taxableIncome, taxRule);

    return {
      grossSalary: annualGrossSalary,
      taxableIncome,
      incomeTax,
      socialInsuranceTax,
      totalTax,
      netSalary,
      effectiveTaxRate,
      marginalTaxRate,
      country: taxRule.country,
      currency: taxRule.currency,
      breakdown,
    };
  }

  /**
   * Calculate total deductions
   */
  private calculateDeductions(grossSalary: number, taxRule: CountryTaxRule): number {
    return taxRule.deductions.reduce((total, deduction) => {
      return total + deduction.amount;
    }, 0);
  }

  /**
   * Calculate income tax using progressive brackets
   */
  private calculateIncomeTax(taxableIncome: number, taxRule: CountryTaxRule): number {
    let totalTax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of taxRule.taxBrackets) {
      if (remainingIncome <= 0) break;

      const bracketMin = bracket.min;
      const bracketMax = bracket.max || Infinity;
      
      if (taxableIncome > bracketMin) {
        const incomeInBracket = Math.min(remainingIncome, bracketMax - bracketMin);
        const taxInBracket = (incomeInBracket * bracket.rate) / 100;
        
        totalTax += taxInBracket;
        remainingIncome -= incomeInBracket;
      }
    }

    return totalTax;
  }

  /**
   * Calculate social insurance contributions
   */
  private calculateSocialInsurance(grossSalary: number, taxRule: CountryTaxRule): number {
    return taxRule.socialInsurances.reduce((total, insurance) => {
      const applicableIncome = insurance.cap ? Math.min(grossSalary, insurance.cap) : grossSalary;
      const employeeRate = insurance.employerContribution 
        ? insurance.rate - insurance.employerContribution 
        : insurance.rate;
      
      return total + (applicableIncome * employeeRate) / 100;
    }, 0);
  }

  /**
   * Calculate marginal tax rate
   */
  private calculateMarginalTaxRate(taxableIncome: number, taxRule: CountryTaxRule): number {
    for (const bracket of taxRule.taxBrackets) {
      if (taxableIncome >= bracket.min && (bracket.max === null || taxableIncome <= bracket.max)) {
        return bracket.rate;
      }
    }
    return 0;
  }

  /**
   * Generate detailed breakdown
   */
  private generateBreakdown(
    grossSalary: number,
    taxableIncome: number,
    taxRule: CountryTaxRule
  ) {
    // Deductions breakdown
    const deductions = taxRule.deductions.map(deduction => ({
      type: deduction.type,
      amount: deduction.amount,
      description: deduction.description,
    }));

    // Tax bracket breakdown
    const taxBracketDetails = [];
    let remainingIncome = taxableIncome;

    for (const bracket of taxRule.taxBrackets) {
      if (remainingIncome <= 0) break;

      const bracketMin = bracket.min;
      const bracketMax = bracket.max || Infinity;
      
      if (taxableIncome > bracketMin) {
        const incomeInBracket = Math.min(remainingIncome, bracketMax - bracketMin);
        const taxAmount = (incomeInBracket * bracket.rate) / 100;
        
        taxBracketDetails.push({
          min: bracketMin,
          max: bracket.max,
          rate: bracket.rate,
          taxAmount,
          incomeInBracket,
        });
        
        remainingIncome -= incomeInBracket;
      }
    }

    // Social insurance breakdown
    const socialInsuranceDetails = taxRule.socialInsurances.map(insurance => {
      const applicableIncome = insurance.cap ? Math.min(grossSalary, insurance.cap) : grossSalary;
      const employeeRate = insurance.employerContribution 
        ? insurance.rate - insurance.employerContribution 
        : insurance.rate;
      const amount = (applicableIncome * employeeRate) / 100;

      return {
        type: insurance.type,
        rate: employeeRate,
        amount,
        description: insurance.description,
      };
    });

    return {
      deductions,
      taxBracketDetails,
      socialInsuranceDetails,
    };
  }

  /**
   * Get available countries
   */
  public getAvailableCountries(): Country[] {
    return Array.from(this.taxRules.keys());
  }

  /**
   * Get tax rule for a specific country
   */
  public getTaxRule(country: Country): CountryTaxRule | undefined {
    return this.taxRules.get(country);
  }

  /**
   * Check if country is supported
   */
  public isCountrySupported(country: Country): boolean {
    return this.taxRules.has(country);
  }
}

// Export singleton instance
export const taxCalculator = new TaxCalculator();

// Export for backward compatibility and global access
declare global {
  interface Window {
    taxCalculator: TaxCalculator;
  }
}

if (typeof window !== 'undefined') {
  window.taxCalculator = taxCalculator;
}