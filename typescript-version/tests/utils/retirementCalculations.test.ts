// Retirement Calculations Tests - TypeScript Implementation
// Created by Yali Pollak (יהלי פולק) - v6.0.0-beta.1

import { describe, it, expect } from 'vitest';
import { 
  formatCurrency, 
  getNetReturn, 
  calculateWeightedReturn, 
  getAdjustedReturn, 
  calculateRetirement,
  validatePartnerData 
} from '@/utils/retirementCalculations';
import { Currency, Language, RiskTolerance, PlanningType } from '@/types';

describe('Retirement Calculations', () => {
  describe('formatCurrency', () => {
    it('should format ILS currency correctly', () => {
      const result = formatCurrency(1000, Currency.ILS, Language.HE);
      expect(result).toMatch(/₪/);
    });

    it('should format USD currency correctly', () => {
      const result = formatCurrency(1000, Currency.USD, Language.EN);
      expect(result).toMatch(/\$/);
    });
  });

  describe('getNetReturn', () => {
    it('should calculate net return correctly', () => {
      const result = getNetReturn(8, 1.5);
      expect(result).toBe(6.5);
    });

    it('should throw error for negative values', () => {
      expect(() => getNetReturn(-5, 1)).toThrow('Returns and fees must be non-negative');
      expect(() => getNetReturn(5, -1)).toThrow('Returns and fees must be non-negative');
    });
  });

  describe('calculateWeightedReturn', () => {
    const mockHistoricalReturns = {
      5: [5, 6, 7],
      10: [6, 7, 8],
      15: [7, 8, 9],
      20: [7.5, 8.5, 9.5],
      25: [8, 9, 10],
      30: [8.5, 9.5, 10.5],
    };

    it('should calculate weighted return correctly', () => {
      const allocations = [
        { index: 0, percentage: 60, customReturn: null },
        { index: 1, percentage: 40, customReturn: null },
      ];
      
      const result = calculateWeightedReturn(allocations, 20, mockHistoricalReturns);
      expect(result).toBeCloseTo(7.9); // (7.5 * 0.6) + (8.5 * 0.4)
    });

    it('should use custom returns when provided', () => {
      const allocations = [
        { index: 0, percentage: 50, customReturn: 10 },
        { index: 1, percentage: 50, customReturn: 12 },
      ];
      
      const result = calculateWeightedReturn(allocations, 20, mockHistoricalReturns);
      expect(result).toBe(11); // (10 * 0.5) + (12 * 0.5)
    });

    it('should return 0 for empty allocations', () => {
      const result = calculateWeightedReturn([], 20, mockHistoricalReturns);
      expect(result).toBe(0);
    });

    it('should throw error for invalid time horizon', () => {
      const allocations = [{ index: 0, percentage: 100, customReturn: null }];
      expect(() => calculateWeightedReturn(allocations, -5, mockHistoricalReturns))
        .toThrow('Time horizon must be positive');
    });
  });

  describe('getAdjustedReturn', () => {
    it('should adjust return based on risk tolerance', () => {
      const baseReturn = 8;
      
      expect(getAdjustedReturn(baseReturn, RiskTolerance.CONSERVATIVE)).toBe(6.8); // 8 * 0.85
      expect(getAdjustedReturn(baseReturn, RiskTolerance.MODERATE)).toBe(8); // 8 * 1.0
      expect(getAdjustedReturn(baseReturn, RiskTolerance.AGGRESSIVE)).toBe(9.2); // 8 * 1.15
    });

    it('should default to moderate risk tolerance', () => {
      const result = getAdjustedReturn(10);
      expect(result).toBe(10);
    });
  });

  describe('calculateRetirement', () => {
    const validInputs = {
      currentAge: 30,
      retirementAge: 67,
      currentSalary: 15000,
      currentSavings: 100000,
      monthlyContribution: 2000,
      currentMonthlyExpenses: 10000,
      targetReplacement: 75,
      riskTolerance: RiskTolerance.MODERATE,
      planningType: PlanningType.INDIVIDUAL,
      workingCurrency: Currency.ILS,
    };

    const mockWorkPeriods = [
      {
        id: 1,
        country: 'israel',
        startAge: 30,
        endAge: 67,
        monthlyContribution: 2000,
        salary: 15000,
        pensionReturn: 7.0,
        pensionDepositFee: 0.5,
        pensionAnnualFee: 1.0,
        monthlyTrainingFund: 500,
      },
    ];

    const mockPensionAllocation = [
      { index: 0, percentage: 60, customReturn: null },
      { index: 1, percentage: 40, customReturn: null },
    ];

    const mockTrainingFundAllocation = [
      { index: 0, percentage: 100, customReturn: null },
    ];

    const mockHistoricalReturns = {
      20: [7.5, 8.5],
      37: [8, 9], // 67 - 30 = 37 years
    };

    it('should return valid financial results', () => {
      const result = calculateRetirement(
        validInputs,
        mockWorkPeriods,
        mockPensionAllocation,
        mockTrainingFundAllocation,
        mockHistoricalReturns,
        500
      );

      expect(result).toHaveProperty('totalSavings');
      expect(result).toHaveProperty('monthlyPension');
      expect(result).toHaveProperty('replacementRatio');
      expect(result).toHaveProperty('shortfall');
      expect(result).toHaveProperty('projectedNetWorth');
      expect(result).toHaveProperty('yearlyBreakdown');
      expect(result).toHaveProperty('readinessScore');
      expect(result).toHaveProperty('recommendations');

      expect(typeof result.totalSavings).toBe('number');
      expect(typeof result.monthlyPension).toBe('number');
      expect(typeof result.replacementRatio).toBe('number');
      expect(typeof result.readinessScore).toBe('number');
      expect(Array.isArray(result.yearlyBreakdown)).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('should throw error for invalid age inputs', () => {
      const invalidInputs = { ...validInputs, currentAge: 70, retirementAge: 65 };
      
      expect(() => calculateRetirement(
        invalidInputs,
        mockWorkPeriods,
        mockPensionAllocation,
        mockTrainingFundAllocation,
        mockHistoricalReturns,
        500
      )).toThrow('Retirement age must be greater than current age');
    });

    it('should throw error for age out of bounds', () => {
      const invalidInputs = { ...validInputs, currentAge: 15 };
      
      expect(() => calculateRetirement(
        invalidInputs,
        mockWorkPeriods,
        mockPensionAllocation,
        mockTrainingFundAllocation,
        mockHistoricalReturns,
        500
      )).toThrow('Current age must be between 18 and 100');
    });
  });

  describe('validatePartnerData', () => {
    it('should return true for valid partner data', () => {
      const validData = {
        partnerCurrentAge: 28,
        partnerCurrentSalary: 12000,
        partnerRetirementAge: 65,
        partnerSavings: 50000,
        partnerMonthlyContribution: 1500,
        partnerRiskTolerance: RiskTolerance.MODERATE,
      };

      expect(validatePartnerData(validData)).toBe(true);
    });

    it('should return false for invalid partner data', () => {
      expect(validatePartnerData(null)).toBe(false);
      expect(validatePartnerData(undefined)).toBe(false);
      expect(validatePartnerData({})).toBe(false);
      expect(validatePartnerData({ partnerCurrentAge: 'invalid' })).toBe(false);
      expect(validatePartnerData({ partnerCurrentAge: 30 })).toBe(false); // missing salary
    });
  });
});