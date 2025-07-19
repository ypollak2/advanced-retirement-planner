// Core Type Definitions for Advanced Retirement Planner TypeScript Version
// Created by Yali Pollak (יהלי פולק) - v6.0.0-beta.1

import { z } from 'zod';

// =====================================================
// ENUMS AND CONSTANTS
// =====================================================

export enum Currency {
  ILS = 'ILS',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  BTC = 'BTC',
  ETH = 'ETH',
}

export enum Language {
  EN = 'en',
  HE = 'he',
}

export enum RiskTolerance {
  CONSERVATIVE = 'conservative',
  MODERATE = 'moderate',
  AGGRESSIVE = 'aggressive',
}

export enum PlanningType {
  INDIVIDUAL = 'individual',
  COUPLE = 'couple',
}

export enum Country {
  ISRAEL = 'israel',
  USA = 'usa',
  UK = 'uk',
  GERMANY = 'germany',
  FRANCE = 'france',
  CANADA = 'canada',
  AUSTRALIA = 'australia',
  NETHERLANDS = 'netherlands',
  SWEDEN = 'sweden',
  NORWAY = 'norway',
}

export enum TaxBracketType {
  MARGINAL = 'marginal',
  FLAT = 'flat',
  PROGRESSIVE = 'progressive',
}

export enum DeductionType {
  STANDARD = 'standard',
  ITEMIZED = 'itemized',
  PERSONAL_ALLOWANCE = 'personal_allowance',
}

export enum SocialInsuranceType {
  SOCIAL_SECURITY = 'social_security',
  MEDICARE = 'medicare',
  UNEMPLOYMENT = 'unemployment',
  DISABILITY = 'disability',
  PENSION_CONTRIBUTION = 'pension_contribution',
  HEALTH_INSURANCE = 'health_insurance',
}

// =====================================================
// ZOD SCHEMAS FOR VALIDATION
// =====================================================

export const CurrencySchema = z.nativeEnum(Currency);
export const LanguageSchema = z.nativeEnum(Language);
export const RiskToleranceSchema = z.nativeEnum(RiskTolerance);
export const PlanningTypeSchema = z.nativeEnum(PlanningType);
export const CountrySchema = z.nativeEnum(Country);

// =====================================================
// FINANCIAL INPUT TYPES
// =====================================================

export const BasicInputsSchema = z.object({
  currentAge: z.number().min(18).max(100),
  retirementAge: z.number().min(50).max(100),
  currentSalary: z.number().min(0),
  currentSavings: z.number().min(0),
  monthlyContribution: z.number().min(0),
  currentMonthlyExpenses: z.number().min(0),
  targetReplacement: z.number().min(0).max(100),
  riskTolerance: RiskToleranceSchema,
  planningType: PlanningTypeSchema,
  workingCurrency: CurrencySchema,
});

export const AdvancedInputsSchema = BasicInputsSchema.extend({
  currentPersonalPortfolio: z.number().min(0).optional(),
  currentRealEstate: z.number().min(0).optional(),
  currentCrypto: z.number().min(0).optional(),
  expectedInflation: z.number().min(0).max(20).optional(),
  expectedReturn: z.number().min(0).max(30).optional(),
  salaryGrowthRate: z.number().min(0).max(20).optional(),
  retirementDuration: z.number().min(1).max(50).optional(),
  healthcareCosts: z.number().min(0).optional(),
  legacyGoal: z.number().min(0).optional(),
});

export const PartnerInputsSchema = z.object({
  partnerCurrentAge: z.number().min(18).max(100),
  partnerRetirementAge: z.number().min(50).max(100),
  partnerCurrentSalary: z.number().min(0),
  partnerSavings: z.number().min(0),
  partnerMonthlyContribution: z.number().min(0),
  partnerRiskTolerance: RiskToleranceSchema,
});

export type BasicInputs = z.infer<typeof BasicInputsSchema>;
export type AdvancedInputs = z.infer<typeof AdvancedInputsSchema>;
export type PartnerInputs = z.infer<typeof PartnerInputsSchema>;

// =====================================================
// FINANCIAL CALCULATION TYPES
// =====================================================

export interface FinancialResults {
  readonly totalSavings: number;
  readonly monthlyPension: number;
  readonly replacementRatio: number;
  readonly shortfall: number;
  readonly projectedNetWorth: number;
  readonly yearlyBreakdown: readonly YearlyBreakdown[];
  readonly readinessScore: number;
  readonly recommendations: readonly string[];
}

export interface YearlyBreakdown {
  readonly year: number;
  readonly age: number;
  readonly contribution: number;
  readonly balance: number;
  readonly pensionPayment: number;
  readonly expenses: number;
  readonly netWorth: number;
}

export interface PartnerResults extends FinancialResults {
  readonly combinedResults: FinancialResults;
}

// =====================================================
// COMPONENT PROP TYPES
// =====================================================

export interface BaseComponentProps {
  readonly language: Language;
  readonly workingCurrency: Currency;
}

export interface DashboardProps extends BaseComponentProps {
  readonly inputs: BasicInputs | AdvancedInputs;
  readonly results: FinancialResults;
  readonly formatCurrency: (amount: number) => string;
  readonly onSectionExpand?: (sectionId: string, expanded: boolean) => void;
}

export interface InputComponentProps extends BaseComponentProps {
  readonly inputs: BasicInputs | AdvancedInputs;
  readonly onInputsChange: (inputs: BasicInputs | AdvancedInputs) => void;
  readonly onCalculate: () => void;
}

export interface ResultsComponentProps extends BaseComponentProps {
  readonly inputs: BasicInputs | AdvancedInputs;
  readonly results: FinancialResults;
  readonly partnerResults?: PartnerResults;
  readonly formatCurrency: (amount: number) => string;
}

// =====================================================
// CURRENCY AND EXCHANGE TYPES
// =====================================================

export interface ExchangeRates {
  readonly [key: string]: number;
}

export interface CurrencyInfo {
  readonly code: Currency;
  readonly symbol: string;
  readonly name: string;
  readonly decimals: number;
  readonly isStable: boolean;
}

export interface ConversionResult {
  readonly originalAmount: number;
  readonly convertedAmount: number;
  readonly fromCurrency: Currency;
  readonly toCurrency: Currency;
  readonly rate: number;
  readonly timestamp: Date;
}

// =====================================================
// API AND EXTERNAL SERVICE TYPES
// =====================================================

export interface StockPrice {
  readonly symbol: string;
  readonly price: number;
  readonly change: number;
  readonly changePercent: number;
  readonly timestamp: Date;
}

export interface MarketData {
  readonly stocks: readonly StockPrice[];
  readonly exchangeRates: ExchangeRates;
  readonly lastUpdated: Date;
}

// =====================================================
// TESTING AND STRESS TEST TYPES
// =====================================================

export interface StressTestScenario {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly marketCrashYear?: number;
  readonly marketCrashSeverity?: number;
  readonly inflationSpike?: number;
  readonly salaryFreezeYears?: number[];
  readonly healthcareCostMultiplier?: number;
}

export interface StressTestResult {
  readonly scenario: StressTestScenario;
  readonly results: FinancialResults;
  readonly impact: {
    readonly totalSavingsImpact: number;
    readonly replacementRatioImpact: number;
    readonly readinessScoreImpact: number;
  };
}

// =====================================================
// EXPORT TYPES
// =====================================================

export interface ExportOptions {
  readonly format: 'json' | 'pdf' | 'png';
  readonly includeCharts: boolean;
  readonly includeStressTests: boolean;
  readonly currency: Currency;
  readonly language: Language;
}

export interface ExportData {
  readonly metadata: {
    readonly exportDate: Date;
    readonly version: string;
    readonly currency: Currency;
    readonly language: Language;
  };
  readonly inputs: BasicInputs | AdvancedInputs;
  readonly results: FinancialResults;
  readonly partnerResults?: PartnerResults;
  readonly stressTestResults?: readonly StressTestResult[];
}

// =====================================================
// UTILITY TYPES
// =====================================================

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Type guards
export const isBasicInputs = (inputs: unknown): inputs is BasicInputs => {
  return BasicInputsSchema.safeParse(inputs).success;
};

export const isAdvancedInputs = (inputs: unknown): inputs is AdvancedInputs => {
  return AdvancedInputsSchema.safeParse(inputs).success;
};

export const isCurrency = (value: unknown): value is Currency => {
  return Object.values(Currency).includes(value as Currency);
};

export const isLanguage = (value: unknown): value is Language => {
  return Object.values(Language).includes(value as Language);
};

// =====================================================
// ERROR TYPES
// =====================================================

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class CalculationError extends Error {
  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message);
    this.name = 'CalculationError';
  }
}

export class CurrencyConversionError extends Error {
  constructor(
    message: string,
    public readonly fromCurrency: Currency,
    public readonly toCurrency: Currency
  ) {
    super(message);
    this.name = 'CurrencyConversionError';
  }
}

export class TaxCalculationError extends Error {
  constructor(
    message: string,
    public readonly country: Country,
    public readonly grossSalary: number
  ) {
    super(message);
    this.name = 'TaxCalculationError';
  }
}

// =====================================================
// TAX CALCULATION TYPES
// =====================================================

export interface TaxBracket {
  readonly min: number;
  readonly max: number | null; // null means no upper limit
  readonly rate: number; // percentage (e.g., 22 for 22%)
}

export interface SocialInsurance {
  readonly type: SocialInsuranceType;
  readonly rate: number; // percentage
  readonly cap?: number; // maximum income subject to this tax
  readonly employerContribution?: number; // employer's portion
  readonly description: string;
}

export interface TaxDeduction {
  readonly type: DeductionType;
  readonly amount: number;
  readonly description: string;
  readonly conditions?: string[];
}

export interface CountryTaxRule {
  readonly country: Country;
  readonly currency: Currency;
  readonly year: number;
  readonly taxBrackets: readonly TaxBracket[];
  readonly socialInsurances: readonly SocialInsurance[];
  readonly deductions: readonly TaxDeduction[];
  readonly bracketType: TaxBracketType;
  readonly description: string;
  readonly lastUpdated: Date;
}

export interface TaxCalculationResult {
  readonly grossSalary: number;
  readonly taxableIncome: number;
  readonly incomeTax: number;
  readonly socialInsuranceTax: number;
  readonly totalTax: number;
  readonly netSalary: number;
  readonly effectiveTaxRate: number; // percentage
  readonly marginalTaxRate: number; // percentage
  readonly country: Country;
  readonly currency: Currency;
  readonly breakdown: {
    readonly deductions: readonly {
      readonly type: string;
      readonly amount: number;
      readonly description: string;
    }[];
    readonly taxBracketDetails: readonly {
      readonly min: number;
      readonly max: number | null;
      readonly rate: number;
      readonly taxAmount: number;
      readonly incomeInBracket: number;
    }[];
    readonly socialInsuranceDetails: readonly {
      readonly type: string;
      readonly rate: number;
      readonly amount: number;
      readonly description: string;
    }[];
  };
}