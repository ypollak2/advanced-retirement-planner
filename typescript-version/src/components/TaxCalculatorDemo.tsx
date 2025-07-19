// Tax Calculator Demo Component - TypeScript Implementation
// Created by Yali Pollak (יהלי פולק) - v6.0.0-beta.1

import React, { useState, useCallback, useMemo } from 'react';
import { Country, Currency } from '@/types';
import { taxCalculator } from '@/utils/taxCalculator';
import { calculateNetSalaryFromGross, getAvailableTaxCountries } from '@/utils/retirementCalculations';

interface TaxCalculatorDemoProps {
  className?: string;
}

const TaxCalculatorDemo: React.FC<TaxCalculatorDemoProps> = ({ className = '' }) => {
  const [grossSalary, setGrossSalary] = useState<number>(100000);
  const [selectedCountry, setSelectedCountry] = useState<string>('israel');
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  // Get available countries
  const availableCountries = useMemo(() => {
    return getAvailableTaxCountries();
  }, []);

  // Calculate tax result
  const taxResult = useMemo(() => {
    if (grossSalary <= 0) return null;
    
    try {
      return calculateNetSalaryFromGross(grossSalary, selectedCountry, isAnnual);
    } catch (error) {
      console.error('Tax calculation error:', error);
      return null;
    }
  }, [grossSalary, selectedCountry, isAnnual]);

  // Get detailed tax breakdown from the tax calculator
  const detailedResult = useMemo(() => {
    if (grossSalary <= 0) return null;
    
    try {
      const countryEnum = selectedCountry.toLowerCase() as keyof typeof Country;
      const countryValue = Country[countryEnum.toUpperCase() as keyof typeof Country];
      
      if (!countryValue || !taxCalculator.isCountrySupported(countryValue)) {
        return null;
      }
      
      return taxCalculator.calculateNetSalary(grossSalary, countryValue, isAnnual);
    } catch (error) {
      return null;
    }
  }, [grossSalary, selectedCountry, isAnnual]);

  const handleSalaryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setGrossSalary(value);
  }, []);

  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  }, []);

  const handleSalaryTypeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAnnual(e.target.checked);
  }, []);

  const formatCurrency = useCallback((amount: number, country: string): string => {
    const countryEnum = country.toLowerCase() as keyof typeof Country;
    const countryValue = Country[countryEnum.toUpperCase() as keyof typeof Country];
    
    if (!countryValue) return amount.toLocaleString();
    
    const currencyMap: Record<Country, Currency> = {
      [Country.ISRAEL]: Currency.ILS,
      [Country.USA]: Currency.USD,
      [Country.UK]: Currency.GBP,
      [Country.GERMANY]: Currency.EUR,
      [Country.FRANCE]: Currency.EUR,
      [Country.CANADA]: Currency.USD,
      [Country.AUSTRALIA]: Currency.USD,
      [Country.NETHERLANDS]: Currency.EUR,
      [Country.SWEDEN]: Currency.EUR,
      [Country.NORWAY]: Currency.EUR,
    };
    
    const currency = currencyMap[countryValue] || Currency.USD;
    const currencySymbolMap = {
      [Currency.ILS]: '₪',
      [Currency.USD]: '$',
      [Currency.EUR]: '€',
      [Currency.GBP]: '£',
      [Currency.BTC]: '₿',
      [Currency.ETH]: 'Ξ',
    };
    
    return `${currencySymbolMap[currency]}${amount.toLocaleString()}`;
  }, []);

  const getCountryFlag = useCallback((country: string): string => {
    const flagMap: Record<string, string> = {
      israel: '🇮🇱',
      usa: '🇺🇸',
      uk: '🇬🇧',
      germany: '🇩🇪',
      france: '🇫🇷',
      canada: '🇨🇦',
      australia: '🇦🇺',
      netherlands: '🇳🇱',
      sweden: '🇸🇪',
      norway: '🇳🇴',
    };
    
    return flagMap[country.toLowerCase()] || '🌍';
  }, []);

  const formatCountryName = useCallback((country: string): string => {
    return country.charAt(0).toUpperCase() + country.slice(1);
  }, []);

  return (
    <div className={`tax-calculator-demo ${className}`}>
      <div className="professional-card">
        <h2 className="section-title">
          🏛️ Pre-Tax Salary Calculator
        </h2>
        <p className="text-gray-600 mb-6">
          Enter your gross salary to see the accurate take-home amount after taxes and social insurance contributions.
        </p>

        {/* Input Controls */}
        <div className="input-grid mb-6">
          <div className="input-group">
            <label htmlFor="gross-salary">
              Gross Salary ({isAnnual ? 'Annual' : 'Monthly'})
            </label>
            <input
              id="gross-salary"
              type="number"
              value={grossSalary}
              onChange={handleSalaryChange}
              min="0"
              step="1000"
            />
          </div>

          <div className="input-group">
            <label htmlFor="country-select">Country</label>
            <select
              id="country-select"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              {availableCountries.map(country => (
                <option key={country} value={country}>
                  {getCountryFlag(country)} {formatCountryName(country)}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAnnual}
                onChange={handleSalaryTypeChange}
                className="mr-2"
              />
              Annual Salary (uncheck for monthly)
            </label>
          </div>
        </div>

        {/* Results Display */}
        {taxResult && (
          <div className="tax-results">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">Gross Salary</div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(taxResult.grossSalary, selectedCountry)}
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-sm text-red-600 font-medium">Total Tax</div>
                <div className="text-2xl font-bold text-red-900">
                  {formatCurrency(taxResult.totalTax, selectedCountry)}
                </div>
                <div className="text-sm text-red-600">
                  ({taxResult.effectiveTaxRate.toFixed(1)}% effective rate)
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 font-medium">Net Salary</div>
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(taxResult.netSalary, selectedCountry)}
                </div>
                <div className="text-sm text-green-600">Take-home pay</div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            {detailedResult && (
              <div className="detailed-breakdown">
                <h3 className="text-lg font-semibold mb-4">Tax Breakdown</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tax Brackets */}
                  <div className="breakdown-section">
                    <h4 className="font-medium text-gray-700 mb-3">Income Tax Brackets</h4>
                    <div className="space-y-2">
                      {detailedResult.breakdown.taxBracketDetails.map((bracket, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {formatCurrency(bracket.min, selectedCountry)} - 
                            {bracket.max ? formatCurrency(bracket.max, selectedCountry) : '∞'} 
                            ({bracket.rate}%)
                          </span>
                          <span className="font-medium">
                            {formatCurrency(bracket.taxAmount, selectedCountry)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Insurance */}
                  <div className="breakdown-section">
                    <h4 className="font-medium text-gray-700 mb-3">Social Insurance</h4>
                    <div className="space-y-2">
                      {detailedResult.breakdown.socialInsuranceDetails.map((insurance, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {insurance.description} ({insurance.rate}%)
                          </span>
                          <span className="font-medium">
                            {formatCurrency(insurance.amount, selectedCountry)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                {detailedResult.breakdown.deductions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-3">Deductions & Allowances</h4>
                    <div className="space-y-2">
                      {detailedResult.breakdown.deductions.map((deduction, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{deduction.description}</span>
                          <span className="font-medium">
                            {formatCurrency(deduction.amount, selectedCountry)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Stats */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-600">Taxable Income</div>
                      <div className="font-semibold">
                        {formatCurrency(detailedResult.taxableIncome, selectedCountry)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Income Tax</div>
                      <div className="font-semibold">
                        {formatCurrency(detailedResult.incomeTax, selectedCountry)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Social Insurance</div>
                      <div className="font-semibold">
                        {formatCurrency(detailedResult.socialInsuranceTax, selectedCountry)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Marginal Rate</div>
                      <div className="font-semibold">{detailedResult.marginalTaxRate.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Tax calculations are based on 2024 tax rules and use standard deductions. 
            Actual taxes may vary based on personal circumstances, additional deductions, and local regulations. 
            This calculator provides estimates for retirement planning purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculatorDemo;