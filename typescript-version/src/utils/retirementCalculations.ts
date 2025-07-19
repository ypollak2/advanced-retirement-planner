// Retirement Calculations - TypeScript Implementation
// Created by Yali Pollak (יהלי פולק) - v6.0.0-beta.1

import {
  Currency,
  Language,
  RiskTolerance,
  Country,
  ValidationError,
  CalculationError,
  type BasicInputs,
  type AdvancedInputs,
  type PartnerInputs,
  type FinancialResults,
  type PartnerResults,
  type YearlyBreakdown,
} from '@/types';

import { currencyAPI } from './currencyAPI';
import { taxCalculator } from './taxCalculator';

// =====================================================
// INTERFACES FOR CALCULATION INPUTS
// =====================================================

interface WorkPeriod {
  readonly id: number;
  readonly country: string;
  readonly startAge: number;
  readonly endAge: number;
  readonly monthlyContribution: number;
  readonly salary: number;
  readonly pensionReturn: number;
  readonly pensionDepositFee: number;
  readonly pensionAnnualFee: number;
  readonly monthlyTrainingFund: number;
}

interface PeriodResult {
  readonly country: string;
  readonly countryName: string;
  readonly flag: string;
  readonly years: number;
  readonly contributions: number;
  readonly netContributions: number;
  readonly growth: number;
  readonly pensionReturn: number;
  readonly pensionDepositFee: number;
  readonly pensionAnnualFee: number;
  readonly pensionEffectiveReturn: number;
  readonly monthlyTrainingFund: number;
}

interface IndexAllocation {
  readonly index: number;
  readonly percentage: number;
  readonly customReturn: number | null;
}

interface HistoricalReturns {
  readonly [timeHorizon: number]: readonly number[];
}

interface RiskScenario {
  readonly multiplier: number;
  readonly name: string;
  readonly description: string;
}

interface CountryData {
  readonly name: string;
  readonly flag: string;
  readonly currency: Currency;
  readonly taxRates: {
    readonly income: number;
    readonly pension: number;
    readonly capital: number;
  };
}

// =====================================================
// CONSTANTS AND CONFIGURATIONS
// =====================================================

const RISK_SCENARIOS: Record<RiskTolerance, RiskScenario> = {
  conservative: {
    multiplier: 0.85,
    name: 'Conservative',
    description: 'Lower risk, lower return',
  },
  moderate: {
    multiplier: 1.0,
    name: 'Moderate',
    description: 'Balanced risk and return',
  },
  aggressive: {
    multiplier: 1.15,
    name: 'Aggressive',
    description: 'Higher risk, higher return',
  },
} as const;

const COUNTRY_DATA: Record<string, CountryData> = {
  israel: {
    name: 'Israel',
    flag: '🇮🇱',
    currency: Currency.ILS,
    taxRates: { income: 36, pension: 25, capital: 25 },
  },
  usa: {
    name: 'United States',
    flag: '🇺🇸',
    currency: Currency.USD,
    taxRates: { income: 32, pension: 20, capital: 20 },
  },
  uk: {
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: Currency.GBP,
    taxRates: { income: 40, pension: 25, capital: 20 },
  },
  germany: {
    name: 'Germany',
    flag: '🇩🇪',
    currency: Currency.EUR,
    taxRates: { income: 42, pension: 30, capital: 26 },
  },
} as const;

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Format currency amount with proper locale and symbol
 */
export function formatCurrency(
  amount: number,
  currency: Currency = Currency.ILS,
  language: Language = Language.HE
): string {
  return currencyAPI.formatCurrency(amount, currency, language);
}

/**
 * Convert currency with exchange rates
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): Promise<number> {
  return await currencyAPI.convertAmountSimple(amount, fromCurrency, toCurrency);
}

/**
 * Calculate net return after management fees
 */
export function getNetReturn(grossReturn: number, managementFee: number): number {
  if (grossReturn < 0 || managementFee < 0) {
    throw new ValidationError('Returns and fees must be non-negative', 'returns', { grossReturn, managementFee });
  }
  return grossReturn - managementFee;
}

/**
 * Calculate weighted return based on allocations and time horizon
 */
export function calculateWeightedReturn(
  allocations: readonly IndexAllocation[],
  timeHorizon: number = 20,
  historicalReturns: HistoricalReturns
): number {
  if (timeHorizon <= 0) {
    throw new ValidationError('Time horizon must be positive', 'timeHorizon', timeHorizon);
  }

  let totalReturn = 0;
  let totalPercentage = 0;

  const availableTimeHorizons = [5, 10, 15, 20, 25, 30];
  const closestTimeHorizon = availableTimeHorizons.reduce((prev, curr) =>
    Math.abs(curr - timeHorizon) < Math.abs(prev - timeHorizon) ? curr : prev
  );

  for (const allocation of allocations) {
    if (allocation.percentage > 0) {
      const returnRate =
        allocation.customReturn !== null
          ? allocation.customReturn
          : historicalReturns[closestTimeHorizon]?.[allocation.index] || 0;

      totalReturn += (returnRate * allocation.percentage) / 100;
      totalPercentage += allocation.percentage;
    }
  }

  return totalPercentage > 0 ? totalReturn : 0;
}

/**
 * Adjust return based on risk tolerance
 */
export function getAdjustedReturn(
  baseReturn: number,
  riskLevel: RiskTolerance = RiskTolerance.MODERATE
): number {
  const riskMultiplier = RISK_SCENARIOS[riskLevel]?.multiplier || 1.0;
  return baseReturn * riskMultiplier;
}

/**
 * Validate inputs before calculation
 */
function validateInputs(inputs: BasicInputs | AdvancedInputs): void {
  if (inputs.currentAge >= inputs.retirementAge) {
    throw new ValidationError(
      'Retirement age must be greater than current age',
      'retirementAge',
      inputs.retirementAge
    );
  }

  if (inputs.currentAge < 18 || inputs.currentAge > 100) {
    throw new ValidationError('Current age must be between 18 and 100', 'currentAge', inputs.currentAge);
  }

  if (inputs.retirementAge < 50 || inputs.retirementAge > 100) {
    throw new ValidationError(
      'Retirement age must be between 50 and 100',
      'retirementAge',
      inputs.retirementAge
    );
  }

  if (inputs.currentSalary < 0) {
    throw new ValidationError('Current salary cannot be negative', 'currentSalary', inputs.currentSalary);
  }

  if (inputs.monthlyContribution < 0) {
    throw new ValidationError(
      'Monthly contribution cannot be negative',
      'monthlyContribution',
      inputs.monthlyContribution
    );
  }
}

// =====================================================
// MAIN CALCULATION FUNCTIONS
// =====================================================

/**
 * Calculate retirement projections based on inputs and work periods
 */
export function calculateRetirement(
  inputs: BasicInputs | AdvancedInputs,
  workPeriods: readonly WorkPeriod[],
  pensionIndexAllocation: readonly IndexAllocation[],
  trainingFundIndexAllocation: readonly IndexAllocation[],
  historicalReturns: HistoricalReturns,
  monthlyTrainingFundContribution: number,
  partnerWorkPeriods: readonly WorkPeriod[] = []
): FinancialResults {
  try {
    // Validate inputs
    validateInputs(inputs);

    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;

    if (yearsToRetirement <= 0) {
      throw new CalculationError('Years to retirement must be positive', { yearsToRetirement });
    }

    // Calculate weighted returns
    const basePensionWeightedReturn = calculateWeightedReturn(
      pensionIndexAllocation,
      yearsToRetirement,
      historicalReturns
    );
    const baseTrainingFundWeightedReturn = calculateWeightedReturn(
      trainingFundIndexAllocation,
      yearsToRetirement,
      historicalReturns
    );

    const pensionWeightedReturn = getAdjustedReturn(basePensionWeightedReturn, inputs.riskTolerance);
    const trainingFundWeightedReturn = getAdjustedReturn(baseTrainingFundWeightedReturn, inputs.riskTolerance);

    // Initialize values
    let totalPensionSavings = inputs.currentSavings;
    const currentTrainingFund = 'currentTrainingFund' in inputs ? inputs.currentTrainingFund || 0 : 0;
    const currentPersonalPortfolio = 'currentPersonalPortfolio' in inputs ? inputs.currentPersonalPortfolio || 0 : 0;
    const currentCrypto = 'currentCrypto' in inputs ? inputs.currentCrypto || 0 : 0;
    const currentRealEstate = 'currentRealEstate' in inputs ? inputs.currentRealEstate || 0 : 0;

    let totalTrainingFund = currentTrainingFund;
    let totalPersonalPortfolio = currentPersonalPortfolio;
    let totalCrypto = currentCrypto;
    let totalRealEstate = currentRealEstate;

    const periodResults: PeriodResult[] = [];

    // Sort work periods by start age
    const sortedPeriods = [...workPeriods].sort((a, b) => a.startAge - b.startAge);

    // Calculate pension savings from work periods
    for (const period of sortedPeriods) {
      const country = COUNTRY_DATA[period.country];
      if (!country) {
        console.warn(`Unknown country: ${period.country}`);
        continue;
      }

      const periodYears = Math.max(
        0,
        Math.min(period.endAge, inputs.retirementAge) - Math.max(period.startAge, inputs.currentAge)
      );

      if (periodYears > 0) {
        const adjustedPensionReturn = getAdjustedReturn(period.pensionReturn, inputs.riskTolerance);
        const effectiveReturn = adjustedPensionReturn - period.pensionAnnualFee;
        const monthlyReturn = effectiveReturn / 100 / 12;
        const periodMonths = periodYears * 12;

        const existingGrowth = totalPensionSavings * Math.pow(1 + monthlyReturn, periodMonths);

        const netMonthlyContribution = period.monthlyContribution * (1 - period.pensionDepositFee / 100);
        const contributionsValue =
          monthlyReturn !== 0
            ? (netMonthlyContribution * (Math.pow(1 + monthlyReturn, periodMonths) - 1)) / monthlyReturn
            : netMonthlyContribution * periodMonths;

        const newTotal = existingGrowth + contributionsValue;

        periodResults.push({
          country: period.country,
          countryName: country.name,
          flag: country.flag,
          years: periodYears,
          contributions: period.monthlyContribution * periodMonths,
          netContributions: netMonthlyContribution * periodMonths,
          growth: newTotal - totalPensionSavings,
          pensionReturn: adjustedPensionReturn,
          pensionDepositFee: period.pensionDepositFee,
          pensionAnnualFee: period.pensionAnnualFee,
          pensionEffectiveReturn: effectiveReturn,
          monthlyTrainingFund: period.monthlyTrainingFund,
        });

        totalPensionSavings = newTotal;
      }
    }

    // Calculate training fund growth
    const trainingFundReturn = 'trainingFundReturn' in inputs ? inputs.trainingFundReturn || 7 : 7;
    const trainingFundManagementFee = 'trainingFundManagementFee' in inputs ? inputs.trainingFundManagementFee || 1 : 1;
    
    const adjustedTrainingFundReturn = getAdjustedReturn(trainingFundReturn, inputs.riskTolerance);
    const trainingFundNetReturn = adjustedTrainingFundReturn - trainingFundManagementFee;

    totalTrainingFund = totalTrainingFund * Math.pow(1 + trainingFundNetReturn / 100, yearsToRetirement);

    // Add training fund contributions from work periods
    for (const period of sortedPeriods) {
      const periodYears = Math.max(
        0,
        Math.min(period.endAge, inputs.retirementAge) - Math.max(period.startAge, inputs.currentAge)
      );
      if (periodYears > 0) {
        const monthlyReturn = trainingFundNetReturn / 100 / 12;
        const periodMonths = periodYears * 12;
        const contributionsValue =
          monthlyReturn !== 0
            ? (monthlyTrainingFundContribution * (Math.pow(1 + monthlyReturn, periodMonths) - 1)) / monthlyReturn
            : monthlyTrainingFundContribution * periodMonths;
        totalTrainingFund += contributionsValue;
      }
    }

    // Calculate other investments (if advanced inputs)
    if ('personalPortfolioReturn' in inputs) {
      const personalPortfolioReturn = inputs.personalPortfolioReturn || 8;
      const personalPortfolioMonthly = inputs.personalPortfolioMonthly || 0;
      
      const adjustedPersonalPortfolioReturn = getAdjustedReturn(personalPortfolioReturn, inputs.riskTolerance);
      const personalPortfolioMonthlyReturn = adjustedPersonalPortfolioReturn / 100 / 12;
      const personalPortfolioMonths = yearsToRetirement * 12;

      const personalPortfolioGrowth = totalPersonalPortfolio * Math.pow(1 + personalPortfolioMonthlyReturn, personalPortfolioMonths);
      const personalPortfolioContributions =
        personalPortfolioMonthlyReturn !== 0
          ? (personalPortfolioMonthly * (Math.pow(1 + personalPortfolioMonthlyReturn, personalPortfolioMonths) - 1)) / personalPortfolioMonthlyReturn
          : personalPortfolioMonthly * personalPortfolioMonths;
      totalPersonalPortfolio = personalPortfolioGrowth + personalPortfolioContributions;
    }

    if ('cryptoReturn' in inputs) {
      const cryptoReturn = inputs.cryptoReturn || 12;
      const cryptoMonthly = inputs.cryptoMonthly || 0;
      
      const adjustedCryptoReturn = getAdjustedReturn(cryptoReturn, inputs.riskTolerance);
      const cryptoMonthlyReturn = adjustedCryptoReturn / 100 / 12;
      const cryptoMonths = yearsToRetirement * 12;

      const cryptoGrowth = totalCrypto * Math.pow(1 + cryptoMonthlyReturn, cryptoMonths);
      const cryptoContributions =
        cryptoMonthlyReturn !== 0
          ? (cryptoMonthly * (Math.pow(1 + cryptoMonthlyReturn, cryptoMonths) - 1)) / cryptoMonthlyReturn
          : cryptoMonthly * cryptoMonths;
      totalCrypto = cryptoGrowth + cryptoContributions;
    }

    if ('realEstateReturn' in inputs) {
      const realEstateReturn = inputs.realEstateReturn || 5;
      const realEstateMonthly = inputs.realEstateMonthly || 0;
      
      const adjustedRealEstateReturn = getAdjustedReturn(realEstateReturn, inputs.riskTolerance);
      const realEstateMonthlyReturn = adjustedRealEstateReturn / 100 / 12;
      const realEstateMonths = yearsToRetirement * 12;

      const realEstateGrowth = totalRealEstate * Math.pow(1 + realEstateMonthlyReturn, realEstateMonths);
      const realEstateContributions =
        realEstateMonthlyReturn !== 0
          ? (realEstateMonthly * (Math.pow(1 + realEstateMonthlyReturn, realEstateMonths) - 1)) / realEstateMonthlyReturn
          : realEstateMonthly * realEstateMonths;
      totalRealEstate = realEstateGrowth + realEstateContributions;
    }

    // Calculate total savings and retirement metrics
    const totalSavings = totalPensionSavings + totalTrainingFund + totalPersonalPortfolio + totalCrypto + totalRealEstate;

    // Calculate monthly pension (simplified - 4% withdrawal rule)
    const monthlyPension = (totalSavings * 0.04) / 12;

    // Calculate replacement ratio
    const finalSalary = inputs.currentSalary * Math.pow(1.03, yearsToRetirement); // 3% salary growth
    const replacementRatio = (monthlyPension * 12) / finalSalary * 100;

    // Calculate shortfall
    const targetIncome = finalSalary * (inputs.targetReplacement / 100);
    const shortfall = Math.max(0, targetIncome - monthlyPension * 12);

    // Generate yearly breakdown
    const yearlyBreakdown: YearlyBreakdown[] = [];
    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = inputs.currentAge + year;
      const yearlyContribution = inputs.monthlyContribution * 12;
      const balance = totalSavings * (year / yearsToRetirement); // Simplified progression
      
      yearlyBreakdown.push({
        year,
        age,
        contribution: yearlyContribution,
        balance,
        pensionPayment: year === yearsToRetirement ? monthlyPension : 0,
        expenses: inputs.currentMonthlyExpenses * 12,
        netWorth: balance,
      });
    }

    // Calculate readiness score (0-100)
    const readinessScore = Math.min(100, Math.max(0, replacementRatio * 1.2)); // Simplified scoring

    // Generate recommendations
    const recommendations: string[] = [];
    if (replacementRatio < 80) {
      recommendations.push('Consider increasing monthly contributions');
    }
    if (shortfall > 0) {
      recommendations.push('You may need additional savings to meet your target');
    }
    if (inputs.riskTolerance === RiskTolerance.CONSERVATIVE && yearsToRetirement > 10) {
      recommendations.push('Consider a more aggressive investment strategy');
    }

    return {
      totalSavings,
      monthlyPension,
      replacementRatio,
      shortfall,
      projectedNetWorth: totalSavings,
      yearlyBreakdown,
      readinessScore,
      recommendations,
    };
  } catch (error) {
    if (error instanceof ValidationError || error instanceof CalculationError) {
      throw error;
    }
    throw new CalculationError('Unexpected error during retirement calculation', { error });
  }
}

/**
 * Generate chart data for visualization
 */
export function generateChartData(
  inputs: BasicInputs | AdvancedInputs,
  results: FinancialResults,
  chartView: 'combined' | 'partner1' | 'partner2' = 'combined',
  partnerResults?: PartnerResults
): Array<{
  age: number;
  totalSavings: number;
  inflationAdjusted: number;
  pensionSavings: number;
  trainingFund: number;
  personalPortfolio: number;
  crypto: number;
  realEstate: number;
}> {
  const chartData = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const inflationRate = 'expectedInflation' in inputs ? inputs.expectedInflation || 3 : 3;

  // Create a copy of inputs for simulation
  const simulationInputs = { ...inputs };

  for (let age = currentAge; age <= retirementAge; age++) {
    const yearsElapsed = age - currentAge;
    const inflationDivisor = Math.pow(1 + inflationRate / 100, yearsElapsed);

    let dataPoint = {
      age,
      totalSavings: results.totalSavings,
      inflationAdjusted: results.totalSavings / inflationDivisor,
      pensionSavings: results.totalSavings, // Simplified for chart
      trainingFund: 0, // Would need separate calculation
      personalPortfolio: 0,
      crypto: 0,
      realEstate: 0,
    };

    // Handle partner data if in couple planning mode
    if (inputs.planningType === 'couple' && partnerResults) {
      // Partner-specific data would be handled here
      // This is a simplified implementation
    }

    chartData.push(dataPoint);
  }

  return chartData;
}

/**
 * Validate partner data
 */
export function validatePartnerData(partnerData: unknown): partnerData is PartnerInputs {
  if (!partnerData || typeof partnerData !== 'object') {
    return false;
  }

  const data = partnerData as Record<string, unknown>;
  const requiredFields = ['partnerCurrentAge', 'partnerCurrentSalary'];
  
  return requiredFields.every(field => 
    field in data && 
    typeof data[field] === 'number' && 
    data[field] !== null && 
    !isNaN(data[field] as number)
  );
}

// =====================================================
// TAX CALCULATION INTEGRATION
// =====================================================

/**
 * Calculate net salary from gross salary using country-specific tax rules
 * @param grossSalary - Annual gross salary
 * @param country - Country enum value
 * @param isAnnual - Whether the salary is annual (default: true)
 * @returns Object containing gross salary, net salary, and tax breakdown
 */
export function calculateNetSalaryFromGross(
  grossSalary: number, 
  country: string, 
  isAnnual: boolean = true
): {
  grossSalary: number;
  netSalary: number;
  totalTax: number;
  effectiveTaxRate: number;
  taxBreakdown: {
    incomeTax: number;
    socialInsurance: number;
  };
} {
  try {
    // Convert string country to Country enum if needed
    const countryEnum = country.toLowerCase() as keyof typeof Country;
    const countryValue = Country[countryEnum.toUpperCase() as keyof typeof Country];
    
    if (!countryValue || !taxCalculator.isCountrySupported(countryValue)) {
      // Fallback to simplified calculation if country not supported
      console.warn(`Tax calculation not supported for ${country}, using simplified calculation`);
      const estimatedTaxRate = 0.25; // 25% estimated tax rate
      const netSalary = grossSalary * (1 - estimatedTaxRate);
      return {
        grossSalary,
        netSalary,
        totalTax: grossSalary - netSalary,
        effectiveTaxRate: estimatedTaxRate * 100,
        taxBreakdown: {
          incomeTax: grossSalary * 0.15,
          socialInsurance: grossSalary * 0.10,
        },
      };
    }

    const result = taxCalculator.calculateNetSalary(grossSalary, countryValue, isAnnual);
    
    return {
      grossSalary: result.grossSalary,
      netSalary: result.netSalary,
      totalTax: result.totalTax,
      effectiveTaxRate: result.effectiveTaxRate,
      taxBreakdown: {
        incomeTax: result.incomeTax,
        socialInsurance: result.socialInsuranceTax,
      },
    };
  } catch (error) {
    // Fallback calculation if tax calculation fails
    console.warn('Tax calculation failed, using simplified fallback:', error);
    const estimatedTaxRate = 0.25; // 25% estimated tax rate
    const netSalary = grossSalary * (1 - estimatedTaxRate);
    return {
      grossSalary,
      netSalary,
      totalTax: grossSalary - netSalary,
      effectiveTaxRate: estimatedTaxRate * 100,
      taxBreakdown: {
        incomeTax: grossSalary * 0.15,
        socialInsurance: grossSalary * 0.10,
      },
    };
  }
}

/**
 * Get available countries for tax calculation
 */
export function getAvailableTaxCountries(): string[] {
  try {
    return taxCalculator.getAvailableCountries().map(country => country.toString());
  } catch (error) {
    console.warn('Could not load available tax countries:', error);
    return ['israel', 'usa', 'uk', 'germany'];
  }
}

/**
 * Check if tax calculation is supported for a country
 */
export function isTaxCalculationSupported(country: string): boolean {
  try {
    const countryEnum = country.toLowerCase() as keyof typeof Country;
    const countryValue = Country[countryEnum.toUpperCase() as keyof typeof Country];
    return countryValue ? taxCalculator.isCountrySupported(countryValue) : false;
  } catch (error) {
    return false;
  }
}

// =====================================================
// EXPORT FOR GLOBAL ACCESS (BACKWARD COMPATIBILITY)
// =====================================================

// Make functions available globally for backward compatibility
if (typeof window !== 'undefined') {
  (window as any).formatCurrency = formatCurrency;
  (window as any).convertCurrency = convertCurrency;
  (window as any).getNetReturn = getNetReturn;
  (window as any).calculateWeightedReturn = calculateWeightedReturn;
  (window as any).getAdjustedReturn = getAdjustedReturn;
  (window as any).calculateRetirement = calculateRetirement;
  (window as any).generateChartData = generateChartData;
  (window as any).validatePartnerData = validatePartnerData;
  (window as any).calculateNetSalaryFromGross = calculateNetSalaryFromGross;
  (window as any).getAvailableTaxCountries = getAvailableTaxCountries;
  (window as any).isTaxCalculationSupported = isTaxCalculationSupported;

  console.log('RetirementCalculations v6.0.0-beta.1 loaded successfully');
}