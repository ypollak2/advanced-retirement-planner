// Dashboard Health Score Module
// Financial health calculations and status determination

function getHealthStatus(score) {
    if (score >= 80) return { 
        status: 'excellent', 
        color: 'green', 
        bgColor: 'bg-green-100', 
        textColor: 'text-green-800',
        borderColor: 'border-green-300'
    };
    if (score >= 60) return { 
        status: 'good', 
        color: 'blue', 
        bgColor: 'bg-blue-100', 
        textColor: 'text-blue-800',
        borderColor: 'border-blue-300'
    };
    if (score >= 40) return { 
        status: 'needsWork', 
        color: 'yellow', 
        bgColor: 'bg-yellow-100', 
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-300'
    };
    return { 
        status: 'critical', 
        color: 'red', 
        bgColor: 'bg-red-100', 
        textColor: 'text-red-800',
        borderColor: 'border-red-300'
    };
}

function calculateFinancialHealthScore(inputs, processedInputs) {
    // Basic validation
    if (!inputs || !processedInputs) {
        console.warn('Missing inputs for health score calculation');
        return { score: 0, factors: {} };
    }

    // If FinancialHealthScore component exists, use it
    if (window.FinancialHealthScore && window.FinancialHealthScore.calculateScore) {
        const result = window.FinancialHealthScore.calculateScore(processedInputs);
        return { score: result.totalScore || 0, factors: result.factors || {} };
    }

    // Fallback calculation
    const factors = {
        emergencyFund: 0,
        savingsRate: 0,
        debtToIncome: 0,
        pensionContribution: 0,
        portfolioDiversification: 0
    };

    // Emergency fund (months of expenses)
    const monthlyExpenses = processedInputs.currentMonthlyExpenses || 0;
    const emergencyFund = processedInputs.emergencyFund || 0;
    if (monthlyExpenses > 0) {
        const monthsCovered = emergencyFund / monthlyExpenses;
        factors.emergencyFund = Math.min(monthsCovered / 6 * 100, 100);
    }

    // Savings rate
    const income = processedInputs.currentMonthlySalary || 0;
    const savings = processedInputs.monthlyContribution || 0;
    if (income > 0) {
        const savingsRate = (savings / income) * 100;
        factors.savingsRate = Math.min(savingsRate / 20 * 100, 100);
    }

    // Pension contribution rate
    const pensionRate = processedInputs.pensionContributionRate || 0;
    factors.pensionContribution = Math.min(pensionRate / 20 * 100, 100);

    // Calculate weighted score
    const weights = {
        emergencyFund: 0.25,
        savingsRate: 0.25,
        debtToIncome: 0.20,
        pensionContribution: 0.20,
        portfolioDiversification: 0.10
    };

    let totalScore = 0;
    Object.keys(factors).forEach(key => {
        totalScore += factors[key] * weights[key];
    });

    return { score: Math.round(totalScore), factors };
}

function getLastUpdatedText(language) {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    if (language === 'he') {
        return `${hour}:${minute.toString().padStart(2, '0')}`;
    } else {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    }
}

// Export functions
window.DashboardHealthScore = {
    getHealthStatus,
    calculateFinancialHealthScore,
    getLastUpdatedText
};

console.log('✅ Dashboard health score module loaded');