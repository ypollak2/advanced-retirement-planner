// Constants and Configuration for Financial Health Engine
// Defines scoring factors, benchmarks, and thresholds

// Score factor definitions with weights and benchmarks
const SCORE_FACTORS = {
    savingsRate: {
        weight: 25,
        name: 'Savings Rate',
        description: 'Percentage of income saved monthly',
        benchmarks: {
            excellent: 20,  // 20%+ savings rate
            good: 15,       // 15%+ savings rate  
            fair: 10,       // 10%+ savings rate
            poor: 5         // 5%+ savings rate
        }
    },
    retirementReadiness: {
        weight: 20,
        name: 'Retirement Readiness',
        description: 'Current savings vs age-appropriate targets',
        benchmarks: {
            excellent: 1.5,  // 1.5x target savings
            good: 1.0,       // 1.0x target savings
            fair: 0.7,       // 0.7x target savings
            poor: 0.4        // 0.4x target savings
        }
    },
    timeHorizon: {
        weight: 15,
        name: 'Time to Retirement',
        description: 'Years remaining until retirement',
        benchmarks: {
            excellent: 30,   // 30+ years
            good: 20,        // 20+ years
            fair: 10,        // 10+ years
            poor: 5          // 5+ years
        }
    },
    riskAlignment: {
        weight: 12,
        name: 'Risk Alignment',
        description: 'Investment allocation matches age and goals',
        benchmarks: {
            excellent: 95,   // 95%+ alignment score
            good: 85,        // 85%+ alignment score
            fair: 70,        // 70%+ alignment score
            poor: 50         // 50%+ alignment score
        }
    },
    diversification: {
        weight: 10,
        name: 'Portfolio Diversification',
        description: 'Spread across multiple asset classes',
        benchmarks: {
            excellent: 4,    // 4+ asset classes
            good: 3,         // 3+ asset classes
            fair: 2,         // 2+ asset classes
            poor: 1          // 1+ asset class
        }
    },
    taxEfficiency: {
        weight: 8,
        name: 'Tax Optimization',
        description: 'Effective use of tax-advantaged accounts',
        benchmarks: {
            excellent: 90,   // 90%+ tax efficiency
            good: 75,        // 75%+ tax efficiency
            fair: 60,        // 60%+ tax efficiency
            poor: 40         // 40%+ tax efficiency
        }
    },
    emergencyFund: {
        weight: 7,
        name: 'Emergency Fund',
        description: 'Months of expenses covered',
        benchmarks: {
            excellent: 8,    // 8+ months
            good: 6,         // 6+ months
            fair: 3,         // 3+ months
            poor: 1          // 1+ month
        }
    },
    debtManagement: {
        weight: 3,
        name: 'Debt Management',
        description: 'Debt-to-income ratio and high-interest debt',
        benchmarks: {
            excellent: 0.1,  // <10% debt-to-income
            good: 0.2,       // <20% debt-to-income
            fair: 0.3,       // <30% debt-to-income
            poor: 0.5        // <50% debt-to-income
        }
    }
};

// Age-based peer comparison data
const PEER_BENCHMARKS = {
    '20-29': { averageScore: 45, topQuartile: 65 },
    '30-39': { averageScore: 55, topQuartile: 75 },
    '40-49': { averageScore: 65, topQuartile: 80 },
    '50-59': { averageScore: 70, topQuartile: 85 },
    '60+': { averageScore: 75, topQuartile: 90 }
};

// Country-specific adjustments
const COUNTRY_FACTORS = {
    'ISR': { socialSecurityWeight: 0.8, taxAdvantageBonus: 5 },
    'USA': { socialSecurityWeight: 0.6, taxAdvantageBonus: 8 },
    'GBR': { socialSecurityWeight: 0.5, taxAdvantageBonus: 6 },
    'EUR': { socialSecurityWeight: 0.7, taxAdvantageBonus: 4 }
};

// Retirement readiness age-based targets
const AGE_BASED_TARGETS = {
    25: { target: 0.5, label: '0.5x annual income' },
    30: { target: 1.0, label: '1x annual income' },
    35: { target: 2.0, label: '2x annual income' },
    40: { target: 3.0, label: '3x annual income' },
    45: { target: 4.0, label: '4x annual income' },
    50: { target: 5.0, label: '5x annual income' },
    55: { target: 7.0, label: '7x annual income' },
    60: { target: 9.0, label: '9x annual income' },
    65: { target: 11.0, label: '11x annual income' }
};

// Risk profile definitions
const RISK_PROFILES = {
    conservative: {
        equityRange: { min: 20, max: 40 },
        bondRange: { min: 40, max: 60 },
        name: 'Conservative'
    },
    moderate: {
        equityRange: { min: 40, max: 60 },
        bondRange: { min: 30, max: 50 },
        name: 'Moderate'
    },
    aggressive: {
        equityRange: { min: 60, max: 80 },
        bondRange: { min: 10, max: 30 },
        name: 'Aggressive'
    },
    veryAggressive: {
        equityRange: { min: 80, max: 95 },
        bondRange: { min: 0, max: 20 },
        name: 'Very Aggressive'
    }
};

// Asset class definitions for diversification
const ASSET_CLASSES = {
    stocks: ['stocks', 'equities', 'equity'],
    bonds: ['bonds', 'fixed income', 'fixedIncome'],
    realEstate: ['real estate', 'realEstate', 'property', 'REIT'],
    commodities: ['commodities', 'gold', 'precious metals'],
    crypto: ['crypto', 'cryptocurrency', 'bitcoin', 'ethereum'],
    cash: ['cash', 'savings', 'money market'],
    alternatives: ['alternatives', 'hedge funds', 'private equity']
};

// Debt categorization
const DEBT_CATEGORIES = {
    highInterest: {
        threshold: 10, // 10%+ interest rate
        weight: 3,     // 3x penalty weight
        examples: ['Credit cards', 'Payday loans', 'Personal loans']
    },
    mediumInterest: {
        threshold: 5,  // 5-10% interest rate
        weight: 1.5,   // 1.5x penalty weight
        examples: ['Car loans', 'Student loans', 'Home equity loans']
    },
    lowInterest: {
        threshold: 0,  // <5% interest rate
        weight: 0.5,   // 0.5x penalty weight
        examples: ['Mortgage', 'Subsidized student loans']
    }
};

// Score interpretation thresholds
const SCORE_INTERPRETATION = {
    excellent: { min: 85, label: 'Excellent', color: '#10b981', emoji: '🌟' },
    good: { min: 70, label: 'Good', color: '#3b82f6', emoji: '✅' },
    fair: { min: 50, label: 'Fair', color: '#f59e0b', emoji: '⚠️' },
    poor: { min: 0, label: 'Needs Improvement', color: '#ef4444', emoji: '❌' }
};

// Export all constants
window.financialHealthConstants = {
    SCORE_FACTORS,
    PEER_BENCHMARKS,
    COUNTRY_FACTORS,
    AGE_BASED_TARGETS,
    RISK_PROFILES,
    ASSET_CLASSES,
    DEBT_CATEGORIES,
    SCORE_INTERPRETATION
};

// Also export directly for backward compatibility
window.SCORE_FACTORS = SCORE_FACTORS;
window.PEER_BENCHMARKS = PEER_BENCHMARKS;
window.COUNTRY_FACTORS = COUNTRY_FACTORS;

console.log('✅ Financial Health Constants loaded');