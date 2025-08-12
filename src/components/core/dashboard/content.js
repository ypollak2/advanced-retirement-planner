// Dashboard Content Module
// Multi-language translations for dashboard sections

const dashboardContent = {
    he: {
        dashboard: 'לוח הבקרה הפיננסי',
        healthMeter: 'מד בריאות פיננסית',
        netWorth: 'שווי נטו',
        quickActions: 'פעולות מהירות',
        planPension: 'תכנן פנסיה',
        manageInvestments: 'נהל השקעות',
        partnerPlanning: 'תכנון משותף',
        testScenarios: 'בדוק תרחישים',
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
        partnerPlanning: 'תכנון משותף',
        scenarioTesting: 'בדיקת תרחישים',
        goalTracking: 'מעקב יעדים',
        inheritancePlanning: 'תכנון ירושה ועזבון',
        taxOptimization: 'אופטימיזציה מיסויית',
        nationalInsurance: 'ביטוח לאומי',
        estateValue: 'שווי עזבון',
        totalAssets: 'סך נכסים',
        totalDebts: 'סך חובות',
        hasWillStatus: 'סטטוס צוואה',
        lifeInsurance: 'ביטוח חיים',
        taxEfficiency: 'יעילות מיסויית',
        pensionOptimized: 'פנסיה מותאמת',
        trainingFundOptimized: 'קרן השתלמות מותאמת',
        monthlyBenefit: 'זכאות חודשית',
        totalBenefit: 'זכאות כוללת'
    },
    en: {
        dashboard: 'Financial Dashboard',
        healthMeter: 'Financial Health Meter',
        netWorth: 'Net Worth',
        quickActions: 'Quick Actions',
        planPension: 'Plan Pension',
        manageInvestments: 'Manage Investments',
        partnerPlanning: 'Partner Planning',
        testScenarios: 'Test Scenarios',
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
        partnerPlanning: 'Partner Planning',
        scenarioTesting: 'Scenario Testing',
        goalTracking: 'Goal Tracking',
        inheritancePlanning: 'Inheritance Planning',
        taxOptimization: 'Tax Optimization',
        nationalInsurance: 'National Insurance',
        estateValue: 'Estate Value',
        totalAssets: 'Total Assets',
        totalDebts: 'Total Debts',
        hasWillStatus: 'Will Status',
        lifeInsurance: 'Life Insurance',
        taxEfficiency: 'Tax Efficiency',
        pensionOptimized: 'Pension Optimized',
        trainingFundOptimized: 'Training Fund Optimized',
        monthlyBenefit: 'Monthly Benefit',
        totalBenefit: 'Total Benefit'
    }
};

// Export functions
window.DashboardContent = {
    getDashboardContent: () => dashboardContent
};

console.log('✅ Dashboard content module loaded');