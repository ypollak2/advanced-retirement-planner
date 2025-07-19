// Dashboard Component - TypeScript Implementation
// Created by Yali Pollak (יהלי פולק) - v6.0.0-beta.1

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Currency, 
  Language,
  type DashboardProps,
  type ExchangeRates 
} from '@/types';
import { currencyAPI } from '@/utils/currencyAPI';

interface ExpandedSections {
  pension: boolean;
  investments: boolean;
  partner: boolean;
  scenarios: boolean;
}

interface HealthStatus {
  status: 'excellent' | 'good' | 'needsWork' | 'critical';
  className: string;
}

interface Translations {
  readonly dashboard: string;
  readonly healthMeter: string;
  readonly retirementCountdown: string;
  readonly netWorth: string;
  readonly quickActions: string;
  readonly planPension: string;
  readonly manageInvestments: string;
  readonly partnerPlanning: string;
  readonly testScenarios: string;
  readonly years: string;
  readonly untilRetirement: string;
  readonly excellent: string;
  readonly good: string;
  readonly needsWork: string;
  readonly critical: string;
  readonly financialHealth: string;
  readonly currentAge: string;
  readonly targetAge: string;
  readonly lastUpdated: string;
  readonly changeFrom: string;
  readonly yesterday: string;
  readonly pensionPlanning: string;
  readonly investmentPortfolio: string;
  readonly scenarioTesting: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  [Language.HE]: {
    dashboard: 'לוח הבקרה הפיננסי',
    healthMeter: 'מד בריאות פיננסית',
    retirementCountdown: 'ספירה לאחור לפרישה',
    netWorth: 'שווי נטו',
    quickActions: 'פעולות מהירות',
    planPension: 'תכנן פנסיה',
    manageInvestments: 'נהל השקעות',
    partnerPlanning: 'תכנון משותף',
    testScenarios: 'בדוק תרחישים',
    years: 'שנים',
    untilRetirement: 'עד הפרישה',
    excellent: 'מעולה',
    good: 'טוב',
    needsWork: 'זקוק לשיפור',
    critical: 'דורש טיפול',
    financialHealth: 'בריאות פיננסית',
    currentAge: 'גיל נוכחי',
    targetAge: 'גיל פרישה',
    lastUpdated: 'עודכן לאחרונה',
    changeFrom: 'שינוי מ',
    yesterday: 'אתמול',
    pensionPlanning: 'תכנון פנסיה',
    investmentPortfolio: 'תיק השקעות',
    scenarioTesting: 'בדיקת תרחישים',
  },
  [Language.EN]: {
    dashboard: 'Financial Dashboard',
    healthMeter: 'Financial Health Meter',
    retirementCountdown: 'Retirement Countdown',
    netWorth: 'Net Worth',
    quickActions: 'Quick Actions',
    planPension: 'Plan Pension',
    manageInvestments: 'Manage Investments',
    partnerPlanning: 'Partner Planning',
    testScenarios: 'Test Scenarios',
    years: 'years',
    untilRetirement: 'until retirement',
    excellent: 'Excellent',
    good: 'Good',
    needsWork: 'Needs Work',
    critical: 'Critical',
    financialHealth: 'Financial Health',
    currentAge: 'Current Age',
    targetAge: 'Target Age',
    lastUpdated: 'Last Updated',
    changeFrom: 'Change from',
    yesterday: 'yesterday',
    pensionPlanning: 'Pension Planning',
    investmentPortfolio: 'Investment Portfolio',
    scenarioTesting: 'Scenario Testing',
  },
} as const;

export const Dashboard: React.FC<DashboardProps> = ({
  inputs,
  results,
  language = Language.EN,
  formatCurrency,
  onSectionExpand,
  workingCurrency = Currency.ILS,
}) => {
  // State management
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(workingCurrency);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    pension: false,
    investments: false,
    partner: false,
    scenarios: false,
  });

  // Get translations
  const t = TRANSLATIONS[language];

  // Load exchange rates
  useEffect(() => {
    const loadRates = async (): Promise<void> => {
      try {
        const rates = await currencyAPI.fetchExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.warn('Failed to load exchange rates:', error);
        // Use fallback rates
        setExchangeRates({
          [Currency.USD]: 3.7,
          [Currency.GBP]: 4.6,
          [Currency.EUR]: 4.0,
          [Currency.BTC]: 0.000002,
          [Currency.ETH]: 0.0001,
        });
      }
    };

    void loadRates();
  }, []);

  // Calculate financial health score (0-100)
  const calculateHealthScore = useCallback((): number => {
    if (!inputs || !results) return 0;

    const currentAge = inputs.currentAge;
    const retirementAge = inputs.retirementAge;
    const yearsToRetirement = retirementAge - currentAge;
    const currentSavings = inputs.currentSavings;
    const monthlyExpenses = inputs.currentMonthlyExpenses;
    const targetReplacement = inputs.targetReplacement;

    let score = 0;

    // Factor 1: Savings rate (30 points)
    const annualSavings = inputs.monthlyContribution * 12;
    const annualIncome = inputs.currentSalary * 12;
    const savingsRate = annualIncome > 0 ? (annualSavings / annualIncome) * 100 : 0;
    score += Math.min(savingsRate * 2, 30);

    // Factor 2: Current savings adequacy (25 points)
    const recommendedSavings = currentAge * annualIncome * 0.01;
    const savingsAdequacy = recommendedSavings > 0 ? currentSavings / recommendedSavings : 0;
    score += Math.min(savingsAdequacy * 25, 25);

    // Factor 3: Time horizon (20 points)
    const timeScore = yearsToRetirement > 30 ? 20 : (yearsToRetirement / 30) * 20;
    score += timeScore;

    // Factor 4: Risk management (15 points)
    const riskScore = inputs.riskTolerance === 'aggressive' ? 15 : 
                     inputs.riskTolerance === 'moderate' ? 12 : 8;
    score += riskScore;

    // Factor 5: Diversification (10 points)
    const hasPersonalPortfolio = 'currentPersonalPortfolio' in inputs && (inputs.currentPersonalPortfolio || 0) > 0;
    const hasRealEstate = 'currentRealEstate' in inputs && (inputs.currentRealEstate || 0) > 0;
    const hasMultipleStreams = hasPersonalPortfolio || hasRealEstate;
    score += hasMultipleStreams ? 10 : 5;

    return Math.round(Math.min(score, 100));
  }, [inputs, results]);

  const healthScore = calculateHealthScore();

  // Get health status based on score
  const getHealthStatus = useCallback((score: number): HealthStatus => {
    if (score >= 85) return { status: 'excellent', className: 'health-meter-excellent status-excellent' };
    if (score >= 70) return { status: 'good', className: 'health-meter-good status-good' };
    if (score >= 50) return { status: 'needsWork', className: 'health-meter-warning status-warning' };
    return { status: 'critical', className: 'health-meter-critical status-critical' };
  }, []);

  const healthStatus = getHealthStatus(healthScore);

  // Calculate years until retirement
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;

  // Calculate net worth with currency conversion
  const calculateNetWorth = useCallback((): number => {
    const baseNetWorth = inputs.currentSavings + 
                        ('currentPersonalPortfolio' in inputs ? inputs.currentPersonalPortfolio || 0 : 0) + 
                        ('currentRealEstate' in inputs ? inputs.currentRealEstate || 0 : 0) + 
                        ('currentCrypto' in inputs ? inputs.currentCrypto || 0 : 0);

    if (selectedCurrency === Currency.ILS) return baseNetWorth;
    const rate = exchangeRates[selectedCurrency];
    return rate ? baseNetWorth / rate : baseNetWorth;
  }, [inputs, selectedCurrency, exchangeRates]);

  const netWorth = calculateNetWorth();

  // Format currency with selected currency
  const formatSelectedCurrency = useCallback((amount: number): string => {
    return currencyAPI.formatCurrency(amount, selectedCurrency, language);
  }, [selectedCurrency, language]);

  // Handle section expansion
  const toggleSection = useCallback((sectionId: keyof ExpandedSections): void => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));

    if (onSectionExpand) {
      onSectionExpand(sectionId, !expandedSections[sectionId]);
    }
  }, [expandedSections, onSectionExpand]);

  // SVG circle calculations for health meter
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="dashboard-container animate-fade-in-up">
      {/* Main Dashboard Content */}
      <div className="space-y-6">
        {/* Financial Health Meter */}
        <div className="professional-card text-center">
          <h2 className="section-title mb-6">
            <span>💚</span> {t.healthMeter}
          </h2>
          
          <div className="financial-health-meter">
            <svg className="health-meter-circle">
              <circle
                className="health-meter-background"
                cx="140"
                cy="140"
                r={radius}
                strokeDasharray={strokeDasharray}
              />
              <circle
                className={`health-meter-progress ${healthStatus.className.split(' ')[0]}`}
                cx="140"
                cy="140"
                r={radius}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="health-meter-center">
              <div className="health-score-value">{healthScore}</div>
              <div className="health-score-label">{t.financialHealth}</div>
              <div className={`health-score-status ${healthStatus.className.split(' ')[1] || ''}`}>
                {t[healthStatus.status]}
              </div>
            </div>
          </div>
        </div>

        {/* Retirement Countdown */}
        <div className="retirement-countdown">
          <div>
            <div className="countdown-years">{yearsToRetirement}</div>
            <div className="countdown-label">{`${t.years} ${t.untilRetirement}`}</div>
          </div>
          <div className="countdown-details">
            <div>{`${t.currentAge}: ${inputs.currentAge}`}</div>
            <div>{`${t.targetAge}: ${inputs.retirementAge}`}</div>
          </div>
        </div>

        {/* Net Worth Tracker */}
        <div className="net-worth-tracker">
          <div className="net-worth-header">
            <h3 className="section-title">
              <span>💎</span> {t.netWorth}
            </h3>
          </div>
          <div className="net-worth-value">
            {formatSelectedCurrency(netWorth)}
          </div>
          <div className="net-worth-change change-positive">
            <span>↗</span> +2.3% {t.changeFrom} {t.yesterday}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h3 className="section-title mb-4">
            <span>⚡</span> {t.quickActions}
          </h3>
          <div className="quick-actions-grid">
            <div 
              className="quick-action-card"
              onClick={() => toggleSection('pension')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleSection('pension');
                }
              }}
            >
              <div className="quick-action-icon action-pension">🏛️</div>
              <div className="quick-action-title">{t.planPension}</div>
              <div className="quick-action-description">
                Set up and optimize pension planning
              </div>
            </div>

            <div 
              className="quick-action-card"
              onClick={() => toggleSection('investments')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleSection('investments');
                }
              }}
            >
              <div className="quick-action-icon action-investment">📈</div>
              <div className="quick-action-title">{t.manageInvestments}</div>
              <div className="quick-action-description">
                Portfolio management and tracking
              </div>
            </div>

            <div 
              className="quick-action-card"
              onClick={() => toggleSection('partner')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleSection('partner');
                }
              }}
            >
              <div className="quick-action-icon action-partner">👥</div>
              <div className="quick-action-title">{t.partnerPlanning}</div>
              <div className="quick-action-description">
                Joint financial planning tools
              </div>
            </div>

            <div 
              className="quick-action-card"
              onClick={() => toggleSection('scenarios')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleSection('scenarios');
                }
              }}
            >
              <div className="quick-action-icon action-scenario">🧪</div>
              <div className="quick-action-title">{t.testScenarios}</div>
              <div className="quick-action-description">
                Stress test different economic scenarios
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure Sections */}
      <div className="space-y-4">
        {/* Pension Planning Section */}
        <div className="planning-section">
          <div 
            className={`section-header ${expandedSections.pension ? 'expanded' : ''}`}
            onClick={() => toggleSection('pension')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleSection('pension');
              }
            }}
          >
            <div className="section-title">
              <div className="section-icon">🏛️</div>
              {t.pensionPlanning}
            </div>
            <div className={`expand-icon ${expandedSections.pension ? 'expanded' : ''}`}>
              ▼
            </div>
          </div>
          <div className={`section-content ${expandedSections.pension ? 'expanded' : ''}`}>
            {expandedSections.pension && (
              <div>Pension planning content will be rendered here when BasicInputs/AdvancedInputs components are integrated.</div>
            )}
          </div>
        </div>

        {/* Additional sections would follow the same pattern */}
      </div>
    </div>
  );
};

// Export for backward compatibility
export default Dashboard;

// Make available globally for backward compatibility
if (typeof window !== 'undefined') {
  (window as any).Dashboard = Dashboard;
}