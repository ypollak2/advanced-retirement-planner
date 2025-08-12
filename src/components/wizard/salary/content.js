// Salary Step Content Module
// Multi-language content for salary wizard step

function getSalaryContent(currencySymbol) {
    return {
        he: {
            mainSalary: 'משכורת חודשית עיקרית',
            grossSalary: `משכורת ברוטו לפני מסים (${currencySymbol})`,
            netSalary: `משכורת נטו אחרי מסים (${currencySymbol})`,
            netSalaryInfo: 'הכנסה בפועל שנשארת לך אחרי כל הניכויים (מסים, ביטוח לאומי, פנסיה)',
            salaryInfo: 'הזן את המשכורת הברוטו לפני מסים והפרשות. זה הסכום שמופיע בחוזה העבודה שלך',
            autoCalculated: 'מחושב אוטומטית',
            manualOverride: 'עריכה ידנית',
            switchToManual: 'החלף לעריכה ידנית',
            switchToAuto: 'חזור לחישוב אוטומטי',
            takeHomePercentage: 'אחוז המשכורת שנשאר',
            validationWarning: 'אזהרה',
            reasonableRange: 'טווח סביר: 50%-85%',
            netSalaryTooHigh: 'משכורת נטו גבוהה מדי',
            netSalaryTooLow: 'משכורת נטו נמוכה מדי',
            checkCalculation: 'בדוק את החישוב',
            additionalIncome: 'הכנסות נוספות',
            mainAdditionalIncome: 'הכנסות נוספות עיקריות',
            partnerAdditionalIncome: 'הכנסות נוספות בני הזוג',
            freelanceIncome: `הכנסות מעבודה עצמאית (${currencySymbol})`,
            rentalIncome: `הכנסות מדירות להשכרה (${currencySymbol})`,
            dividendIncome: `דיבידנדים והכנסות השקעה (${currencySymbol})`,
            annualBonus: `בונוס שנתי (${currencySymbol})`,
            quarterlyRSU: `RSU רבעוני (${currencySymbol})`,
            rsuFrequency: 'תדירות RSU',
            rsuAmount: `סכום RSU (${currencySymbol})`,
            monthly: 'חודשי',
            quarterly: 'רבעוני',
            yearly: 'שנתי',
            otherIncome: `הכנסות אחרות (${currencySymbol})`,
            partnerSalaries: 'משכורות בני הזוג',
            partner1Salary: 'משכורת ברוטו בן/בת זוג (לפני מסים)',
            partner2Salary: 'משכורת ברוטו בן/בת זוג נוסף (לפני מסים)',
            optional: 'אופציונלי',
            totalMonthlyIncome: 'סך הכנסה חודשית',
            incomeBreakdown: 'פירוט ההכנסות',
            afterTax: 'אחרי מס',
            beforeTax: 'לפני מס',
            taxRate: 'שיעור מס %',
            frequencyLabel: 'תדירות'
        },
        en: {
            mainSalary: 'Main Monthly Salary',
            grossSalary: `Gross Salary Before Taxes (${currencySymbol})`,
            netSalary: `Net Salary After Taxes (${currencySymbol})`,
            netSalaryInfo: 'Actual take-home income after all deductions (taxes, social security, pension)',
            salaryInfo: 'Enter your gross salary before taxes and deductions. This is the amount in your employment contract',
            autoCalculated: 'Auto-calculated',
            manualOverride: 'Manual Override',
            switchToManual: 'Switch to Manual Entry',
            switchToAuto: 'Switch to Auto-calculation',
            takeHomePercentage: 'Take-home percentage',
            validationWarning: 'Warning',
            reasonableRange: 'Reasonable range: 50%-85%',
            netSalaryTooHigh: 'Net salary too high',
            netSalaryTooLow: 'Net salary too low',
            checkCalculation: 'Please check calculation',
            additionalIncome: 'Additional Income Sources',
            mainAdditionalIncome: 'Main Additional Income',
            partnerAdditionalIncome: 'Partner Additional Income',
            freelanceIncome: `Freelance Income (${currencySymbol})`,
            rentalIncome: `Rental Income (${currencySymbol})`,
            dividendIncome: `Dividends & Investment Income (${currencySymbol})`,
            annualBonus: `Annual Bonus (${currencySymbol})`,
            quarterlyRSU: `Quarterly RSU (${currencySymbol})`,
            rsuFrequency: 'RSU Frequency',
            rsuAmount: `RSU Amount (${currencySymbol})`,
            monthly: 'Monthly',
            quarterly: 'Quarterly', 
            yearly: 'Yearly',
            otherIncome: `Other Income (${currencySymbol})`,
            partnerSalaries: 'Partner Salaries',
            partner1Salary: 'Partner Gross Salary (Before Taxes)',
            partner2Salary: 'Additional Partner Gross Salary (Before Taxes)',
            optional: 'Optional',
            totalMonthlyIncome: 'Total Monthly Income',
            incomeBreakdown: 'Income Breakdown',
            afterTax: 'After Tax',
            beforeTax: 'Before Tax',
            taxRate: 'Tax Rate %',
            frequencyLabel: 'Frequency'
        }
    };
}

// Currency symbol helper
function getCurrencySymbol(currency) {
    const symbols = {
        'ILS': '₪',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'BTC': '₿',
        'ETH': 'Ξ'
    };
    return symbols[currency] || '₪';
}

// Export to window
window.SalaryContent = {
    getSalaryContent,
    getCurrencySymbol
};

console.log('✅ Salary content module loaded');