// Tax Calculator Tests - TypeScript Implementation
// Created by Yali Pollak (יהלי פולק) - v6.0.0-beta.1

import { describe, it, expect } from 'vitest';
import { TaxCalculator, taxCalculator } from '@/utils/taxCalculator';
import { Country, Currency, TaxCalculationError } from '@/types';

describe('TaxCalculator', () => {
  describe('TaxCalculator Class', () => {
    it('should create a new instance', () => {
      const calculator = new TaxCalculator();
      expect(calculator).toBeInstanceOf(TaxCalculator);
    });

    it('should have all required methods', () => {
      expect(typeof taxCalculator.calculateNetSalary).toBe('function');
      expect(typeof taxCalculator.getAvailableCountries).toBe('function');
      expect(typeof taxCalculator.getTaxRule).toBe('function');
      expect(typeof taxCalculator.isCountrySupported).toBe('function');
    });
  });

  describe('getAvailableCountries', () => {
    it('should return supported countries', () => {
      const countries = taxCalculator.getAvailableCountries();
      expect(countries).toContain(Country.ISRAEL);
      expect(countries).toContain(Country.USA);
      expect(countries).toContain(Country.UK);
      expect(countries).toContain(Country.GERMANY);
      expect(countries.length).toBeGreaterThan(0);
    });
  });

  describe('isCountrySupported', () => {
    it('should return true for supported countries', () => {
      expect(taxCalculator.isCountrySupported(Country.ISRAEL)).toBe(true);
      expect(taxCalculator.isCountrySupported(Country.USA)).toBe(true);
      expect(taxCalculator.isCountrySupported(Country.UK)).toBe(true);
      expect(taxCalculator.isCountrySupported(Country.GERMANY)).toBe(true);
    });

    it('should return false for unsupported countries', () => {
      expect(taxCalculator.isCountrySupported(Country.FRANCE)).toBe(false);
    });
  });

  describe('getTaxRule', () => {
    it('should return tax rule for supported countries', () => {
      const israelRule = taxCalculator.getTaxRule(Country.ISRAEL);
      expect(israelRule).toBeDefined();
      expect(israelRule?.country).toBe(Country.ISRAEL);
      expect(israelRule?.currency).toBe(Currency.ILS);
      expect(israelRule?.taxBrackets).toBeDefined();
      expect(israelRule?.socialInsurances).toBeDefined();
    });

    it('should return undefined for unsupported countries', () => {
      const rule = taxCalculator.getTaxRule(Country.FRANCE);
      expect(rule).toBeUndefined();
    });
  });

  describe('calculateNetSalary - Israel', () => {
    it('should calculate net salary for low income in Israel', () => {
      const result = taxCalculator.calculateNetSalary(60000, Country.ISRAEL, true);
      
      expect(result.grossSalary).toBe(60000);
      expect(result.country).toBe(Country.ISRAEL);
      expect(result.currency).toBe(Currency.ILS);
      expect(result.netSalary).toBeLessThan(result.grossSalary);
      expect(result.totalTax).toBeGreaterThan(0);
      expect(result.effectiveTaxRate).toBeGreaterThan(0);
      expect(result.effectiveTaxRate).toBeLessThan(50);
      
      // Verify breakdown structure
      expect(result.breakdown.deductions).toBeDefined();
      expect(result.breakdown.taxBracketDetails).toBeDefined();
      expect(result.breakdown.socialInsuranceDetails).toBeDefined();
    });

    it('should calculate net salary for high income in Israel', () => {
      const result = taxCalculator.calculateNetSalary(800000, Country.ISRAEL, true);
      
      expect(result.grossSalary).toBe(800000);
      expect(result.netSalary).toBeLessThan(result.grossSalary);
      expect(result.effectiveTaxRate).toBeGreaterThan(30); // High earner should have higher effective rate
      expect(result.marginalTaxRate).toBe(50); // Top bracket is 50%
    });

    it('should handle monthly salary conversion for Israel', () => {
      const monthlyResult = taxCalculator.calculateNetSalary(10000, Country.ISRAEL, false);
      const annualResult = taxCalculator.calculateNetSalary(120000, Country.ISRAEL, true);
      
      expect(monthlyResult.grossSalary).toBe(120000); // Should convert to annual
      expect(Math.abs(monthlyResult.netSalary - annualResult.netSalary)).toBeLessThan(1); // Should be approximately equal
    });
  });

  describe('calculateNetSalary - USA', () => {
    it('should calculate net salary for USA', () => {
      const result = taxCalculator.calculateNetSalary(75000, Country.USA, true);
      
      expect(result.grossSalary).toBe(75000);
      expect(result.country).toBe(Country.USA);
      expect(result.currency).toBe(Currency.USD);
      expect(result.netSalary).toBeLessThan(result.grossSalary);
      
      // Check Social Security and Medicare
      const socialInsuranceDetails = result.breakdown.socialInsuranceDetails;
      const socialSecurity = socialInsuranceDetails.find(s => s.type === 'social_security');
      const medicare = socialInsuranceDetails.find(s => s.type === 'medicare');
      
      expect(socialSecurity).toBeDefined();
      expect(medicare).toBeDefined();
      expect(socialSecurity?.rate).toBe(6.2); // Employee portion
      expect(medicare?.rate).toBe(1.45); // Employee portion
    });

    it('should apply Social Security cap correctly', () => {
      const highIncomeResult = taxCalculator.calculateNetSalary(200000, Country.USA, true);
      const socialInsuranceDetails = highIncomeResult.breakdown.socialInsuranceDetails;
      const socialSecurity = socialInsuranceDetails.find(s => s.type === 'social_security');
      
      // Social Security should be capped at $160,200 for 2024
      expect(socialSecurity?.amount).toBeLessThan((200000 * 6.2) / 100);
    });
  });

  describe('calculateNetSalary - UK', () => {
    it('should calculate net salary for UK', () => {
      const result = taxCalculator.calculateNetSalary(45000, Country.UK, true);
      
      expect(result.grossSalary).toBe(45000);
      expect(result.country).toBe(Country.UK);
      expect(result.currency).toBe(Currency.GBP);
      expect(result.netSalary).toBeLessThan(result.grossSalary);
      
      // Should use personal allowance
      expect(result.taxableIncome).toBe(45000 - 12570); // Gross minus personal allowance
    });

    it('should handle personal allowance correctly', () => {
      const lowIncomeResult = taxCalculator.calculateNetSalary(10000, Country.UK, true);
      
      // Income below personal allowance should have no income tax
      expect(lowIncomeResult.incomeTax).toBe(0);
      expect(lowIncomeResult.taxableIncome).toBe(0);
    });
  });

  describe('calculateNetSalary - Germany', () => {
    it('should calculate net salary for Germany', () => {
      const result = taxCalculator.calculateNetSalary(50000, Country.GERMANY, true);
      
      expect(result.grossSalary).toBe(50000);
      expect(result.country).toBe(Country.GERMANY);
      expect(result.currency).toBe(Currency.EUR);
      expect(result.netSalary).toBeLessThan(result.grossSalary);
      
      // Germany has multiple social insurances
      const socialInsuranceDetails = result.breakdown.socialInsuranceDetails;
      expect(socialInsuranceDetails.length).toBeGreaterThan(2);
      
      // Check for pension, unemployment, and health insurance
      expect(socialInsuranceDetails.some(s => s.type === 'pension_contribution')).toBe(true);
      expect(socialInsuranceDetails.some(s => s.type === 'unemployment')).toBe(true);
      expect(socialInsuranceDetails.some(s => s.type === 'health_insurance')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should throw error for negative salary', () => {
      expect(() => {
        taxCalculator.calculateNetSalary(-1000, Country.ISRAEL, true);
      }).toThrow(TaxCalculationError);
      
      expect(() => {
        taxCalculator.calculateNetSalary(-1000, Country.ISRAEL, true);
      }).toThrow('Gross salary cannot be negative');
    });

    it('should throw error for unsupported country', () => {
      expect(() => {
        taxCalculator.calculateNetSalary(50000, Country.FRANCE, true);
      }).toThrow(TaxCalculationError);
      
      expect(() => {
        taxCalculator.calculateNetSalary(50000, Country.FRANCE, true);
      }).toThrow('Tax rules not available for france');
    });
  });

  describe('Tax Calculations Edge Cases', () => {
    it('should handle zero salary', () => {
      const result = taxCalculator.calculateNetSalary(0, Country.ISRAEL, true);
      
      expect(result.grossSalary).toBe(0);
      expect(result.incomeTax).toBe(0);
      expect(result.socialInsuranceTax).toBe(0);
      expect(result.netSalary).toBe(0);
      expect(result.effectiveTaxRate).toBe(0);
    });

    it('should calculate effective tax rate correctly', () => {
      const result = taxCalculator.calculateNetSalary(100000, Country.ISRAEL, true);
      
      const expectedEffectiveRate = (result.totalTax / result.grossSalary) * 100;
      expect(Math.abs(result.effectiveTaxRate - expectedEffectiveRate)).toBeLessThan(0.01);
    });

    it('should have consistent tax bracket calculations', () => {
      const result = taxCalculator.calculateNetSalary(100000, Country.USA, true);
      
      // Sum of tax amounts in brackets should equal total income tax
      const totalFromBrackets = result.breakdown.taxBracketDetails.reduce(
        (sum, bracket) => sum + bracket.taxAmount,
        0
      );
      
      expect(Math.abs(totalFromBrackets - result.incomeTax)).toBeLessThan(0.01);
    });
  });

  describe('Integration with Retirement Planning', () => {
    it('should provide accurate net salary for retirement calculations', () => {
      // Test various salary levels across different countries
      const testCases = [
        { salary: 50000, country: Country.ISRAEL },
        { salary: 75000, country: Country.USA },
        { salary: 40000, country: Country.UK },
        { salary: 60000, country: Country.GERMANY },
      ];

      testCases.forEach(({ salary, country }) => {
        const result = taxCalculator.calculateNetSalary(salary, country, true);
        
        expect(result.netSalary).toBeGreaterThan(0);
        expect(result.netSalary).toBeLessThan(result.grossSalary);
        expect(result.effectiveTaxRate).toBeGreaterThan(0);
        expect(result.effectiveTaxRate).toBeLessThan(100);
        
        // Net salary should be reasonable (not below 30% of gross for these ranges)
        expect(result.netSalary).toBeGreaterThan(salary * 0.3);
      });
    });
  });
});