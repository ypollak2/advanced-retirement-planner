// Salary Validation Module
// Handles validation logic for salary and net salary inputs

// Validation rules for salary inputs with ARIA support
function validateSalary(salary, language = 'en') {
    if (salary < 0) return language === 'he' ? 'משכורת לא יכולה להיות שלילית' : 'Salary cannot be negative';
    if (salary > 500000) return language === 'he' ? 'משכורת גבוהה מדי (מקסימום 500,000)' : 'Salary too high (max 500,000)';
    return null;
}

// Net salary validation with logical checks
function validateNetSalary(netSalary, grossSalary, language = 'en') {
    if (netSalary < 0) {
        return language === 'he' ? 'משכורת נטו לא יכולה להיות שלילית' : 'Net salary cannot be negative';
    }
    if (netSalary > grossSalary) {
        return language === 'he' ? 'משכורת נטו לא יכולה להיות גבוהה ממשכורת ברוטו' : 'Net salary cannot be higher than gross salary';
    }
    if (grossSalary > 0 && netSalary > 0) {
        const takeHomePercentage = (netSalary / grossSalary) * 100;
        if (takeHomePercentage < 30) {
            return language === 'he' ? 'משכורת נטו נמוכה מדי (פחות מ-30% ממשכורת ברוטו)' : 'Net salary too low (less than 30% of gross)';
        }
        if (takeHomePercentage > 95) {
            return language === 'he' ? 'משכורת נטו גבוהה מדי (יותר מ-95% ממשכורת ברוטו)' : 'Net salary too high (more than 95% of gross)';
        }
    }
    return null;
}

// Helper function for input styling with validation states
function getInputClassName(fieldName, baseClassName, validationErrors, isNetSalary = false) {
    const error = validationErrors[fieldName];
    if (error) {
        return `${baseClassName} border-red-500 focus:ring-red-500 focus:border-red-500`;
    }
    if (isNetSalary) {
        return `${baseClassName} border-green-300 focus:ring-green-500 focus:border-green-500`;
    }
    return `${baseClassName} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
}

// Calculate take-home percentage for display
function calculateTakeHomePercentage(netSalary, grossSalary) {
    if (!grossSalary || !netSalary || grossSalary === 0) return 0;
    return Math.round((netSalary / grossSalary) * 100);
}

// Format percentage with color coding
function getPercentageDisplay(percentage) {
    if (percentage === 0) return { text: '', color: 'text-gray-500' };
    if (percentage < 50) return { text: `${percentage}%`, color: 'text-red-600' };
    if (percentage < 70) return { text: `${percentage}%`, color: 'text-yellow-600' };
    return { text: `${percentage}%`, color: 'text-green-600' };
}

// Export to window
window.SalaryValidation = {
    validateSalary,
    validateNetSalary,
    getInputClassName,
    calculateTakeHomePercentage,
    getPercentageDisplay
};

console.log('✅ Salary validation module loaded');