// Main Application Component - TypeScript Implementation
// Created by Yali Pollak (יהלי פולק) - v6.0.0-beta.1

import React, { useState, useEffect } from 'react';
import { 
  Language, 
  Currency,
  PlanningType,
  RiskTolerance,
  type BasicInputs,
  type FinancialResults,
} from '@/types';
import { Dashboard } from '@/components/Dashboard';
import TaxCalculatorDemo from '@/components/TaxCalculatorDemo';
import { calculateRetirement, formatCurrency } from '@/utils/retirementCalculations';

const App: React.FC = () => {
  // Application state
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [workingCurrency, setWorkingCurrency] = useState<Currency>(Currency.ILS);
  const [inputs, setInputs] = useState<BasicInputs>({
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
  });
  const [results, setResults] = useState<FinancialResults | null>(null);

  // Calculate results when inputs change
  useEffect(() => {
    const calculateResults = (): void => {
      try {
        // Mock work periods for demo
        const workPeriods = [
          {
            id: 1,
            country: 'israel',
            startAge: inputs.currentAge,
            endAge: inputs.retirementAge,
            monthlyContribution: inputs.monthlyContribution,
            salary: inputs.currentSalary,
            pensionReturn: 7.0,
            pensionDepositFee: 0.5,
            pensionAnnualFee: 1.0,
            monthlyTrainingFund: 500,
          },
        ];

        // Mock allocations
        const pensionIndexAllocation = [
          { index: 0, percentage: 60, customReturn: null },
          { index: 1, percentage: 40, customReturn: null },
        ];

        const trainingFundIndexAllocation = [
          { index: 0, percentage: 100, customReturn: null },
        ];

        // Mock historical returns
        const historicalReturns = {
          5: [5, 6],
          10: [6, 7],
          15: [7, 8],
          20: [7.5, 8.5],
          25: [8, 9],
          30: [8.5, 9.5],
        };

        const monthlyTrainingFundContribution = 500;

        const calculationResults = calculateRetirement(
          inputs,
          workPeriods,
          pensionIndexAllocation,
          trainingFundIndexAllocation,
          historicalReturns,
          monthlyTrainingFundContribution
        );

        setResults(calculationResults);
      } catch (error) {
        console.error('Calculation error:', error);
        // Set default results in case of error
        setResults({
          totalSavings: 0,
          monthlyPension: 0,
          replacementRatio: 0,
          shortfall: 0,
          projectedNetWorth: 0,
          yearlyBreakdown: [],
          readinessScore: 0,
          recommendations: ['Please check your inputs'],
        });
      }
    };

    calculateResults();
  }, [inputs]);

  // Format currency function
  const handleFormatCurrency = (amount: number): string => {
    return formatCurrency(amount, workingCurrency, language);
  };

  // Handle section expansion
  const handleSectionExpand = (sectionId: string, expanded: boolean): void => {
    console.log(`Section ${sectionId} ${expanded ? 'expanded' : 'collapsed'}`);
  };

  return (
    <div className="app-container">
      {/* Version indicator */}
      <div className="version-indicator">
        ✨ v6.0.0-beta.1 (TypeScript)
      </div>

      {/* Language Toggle */}
      <div className="language-toggle">
        <button
          onClick={() => setLanguage(language === Language.EN ? Language.HE : Language.EN)}
          className="btn-secondary"
        >
          {language === Language.EN ? 'עברית' : 'English'}
        </button>
      </div>

      {/* Currency Toggle */}
      <div className="currency-toggle">
        <select
          value={workingCurrency}
          onChange={(e) => setWorkingCurrency(e.target.value as Currency)}
          className="currency-select"
        >
          <option value={Currency.ILS}>₪ ILS</option>
          <option value={Currency.USD}>$ USD</option>
          <option value={Currency.EUR}>€ EUR</option>
          <option value={Currency.GBP}>£ GBP</option>
          <option value={Currency.BTC}>₿ BTC</option>
          <option value={Currency.ETH}>Ξ ETH</option>
        </select>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <header className="app-header">
          <h1 className="app-title">
            {language === Language.HE 
              ? 'מתכנן הפרישה המתקדם - גרסת TypeScript' 
              : 'Advanced Retirement Planner - TypeScript Version'
            }
          </h1>
          <p className="app-subtitle">
            {language === Language.HE
              ? 'גרסה חדשה עם בטיחות טיפוסים משופרת וביצועים טובים יותר'
              : 'Next-generation version with enhanced type safety and improved performance'
            }
          </p>
        </header>

        {/* Demo Input Controls */}
        <section className="demo-controls">
          <h2>
            {language === Language.HE ? 'בקרות הדגמה' : 'Demo Controls'}
          </h2>
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="currentAge">
                {language === Language.HE ? 'גיל נוכחי' : 'Current Age'}
              </label>
              <input
                id="currentAge"
                type="number"
                value={inputs.currentAge}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  currentAge: parseInt(e.target.value) || 30 
                }))}
                min="18"
                max="100"
              />
            </div>

            <div className="input-group">
              <label htmlFor="retirementAge">
                {language === Language.HE ? 'גיל פרישה' : 'Retirement Age'}
              </label>
              <input
                id="retirementAge"
                type="number"
                value={inputs.retirementAge}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  retirementAge: parseInt(e.target.value) || 67 
                }))}
                min="50"
                max="100"
              />
            </div>

            <div className="input-group">
              <label htmlFor="currentSalary">
                {language === Language.HE ? 'משכורת נוכחית' : 'Current Salary'}
              </label>
              <input
                id="currentSalary"
                type="number"
                value={inputs.currentSalary}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  currentSalary: parseInt(e.target.value) || 15000 
                }))}
                min="0"
              />
            </div>

            <div className="input-group">
              <label htmlFor="monthlyContribution">
                {language === Language.HE ? 'הפקדה חודשית' : 'Monthly Contribution'}
              </label>
              <input
                id="monthlyContribution"
                type="number"
                value={inputs.monthlyContribution}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  monthlyContribution: parseInt(e.target.value) || 2000 
                }))}
                min="0"
              />
            </div>
          </div>
        </section>

        {/* Tax Calculator Demo */}
        <TaxCalculatorDemo />

        {/* Dashboard */}
        {results && (
          <Dashboard
            inputs={inputs}
            results={results}
            language={language}
            formatCurrency={handleFormatCurrency}
            onSectionExpand={handleSectionExpand}
            workingCurrency={workingCurrency}
          />
        )}

        {/* TypeScript Features Demo */}
        <section className="typescript-demo">
          <h2>
            {language === Language.HE ? 'תכונות TypeScript' : 'TypeScript Features'}
          </h2>
          <div className="feature-list">
            <div className="feature-item">
              <h3>🔒 Type Safety</h3>
              <p>
                {language === Language.HE 
                  ? 'בדיקת טיפוסים מלאה בזמן קומפילציה'
                  : 'Full type checking at compile time'
                }
              </p>
            </div>
            <div className="feature-item">
              <h3>⚡ Performance</h3>
              <p>
                {language === Language.HE 
                  ? 'בילד מותאם וזמני טעינה מהירים יותר'
                  : 'Optimized builds and faster load times'
                }
              </p>
            </div>
            <div className="feature-item">
              <h3>🛠️ Developer Experience</h3>
              <p>
                {language === Language.HE 
                  ? 'השלמה אוטומטית וכלי פיתוח משופרים'
                  : 'Auto-completion and enhanced tooling'
                }
              </p>
            </div>
            <div className="feature-item">
              <h3>🧪 Testing</h3>
              <p>
                {language === Language.HE 
                  ? 'מסגרת בדיקות מתקדמת עם Vitest'
                  : 'Advanced testing framework with Vitest'
                }
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          {language === Language.HE 
            ? 'מתכנן הפרישה המתקדם - גרסת TypeScript'
            : 'Advanced Retirement Planner - TypeScript Version'
          } v6.0.0-beta.1
        </p>
        <p>
          {language === Language.HE 
            ? 'נוצר על ידי יהלי פולק'
            : 'Created by Yali Pollak (יהלי פולק)'
          }
        </p>
      </footer>
    </div>
  );
};

export default App;