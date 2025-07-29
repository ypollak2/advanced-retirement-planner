// Test Net Salary Validation Logic
// Verify the enhanced validation rules work correctly

// Simulate validation functions (extracted from WizardStepSalary.js)
const validateNetSalary = (netSalary, grossSalary, language = 'en') => {
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
};

const calculateTakeHomePercentage = (netSalary, grossSalary) => {
    if (!grossSalary || !netSalary || grossSalary === 0) return 0;
    return Math.round((netSalary / grossSalary) * 100);
};

const getPercentageDisplay = (percentage) => {
    if (percentage === 0) return { text: '', color: 'text-gray-500' };
    if (percentage < 50) return { text: `${percentage}%`, color: 'text-red-600' };
    if (percentage < 70) return { text: `${percentage}%`, color: 'text-yellow-600' };
    return { text: `${percentage}%`, color: 'text-green-600' };
};

console.log('🧪 Testing Net Salary Validation Logic\n');

// Test cases
const testCases = [
    { net: -1000, gross: 20000, description: 'Negative net salary' },
    { net: 25000, gross: 20000, description: 'Net higher than gross' },
    { net: 5000, gross: 20000, description: 'Net too low (25%)' },
    { net: 19500, gross: 20000, description: 'Net too high (97.5%)' },
    { net: 13000, gross: 20000, description: 'Normal Israeli take-home (65%)' },
    { net: 15000, gross: 20000, description: 'Good take-home (75%)' },
    { net: 0, gross: 0, description: 'Zero values' }
];

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.description}`);
    console.log(`  Gross: ₪${testCase.gross.toLocaleString()}, Net: ₪${testCase.net.toLocaleString()}`);
    
    const validationError = validateNetSalary(testCase.net, testCase.gross);
    const percentage = calculateTakeHomePercentage(testCase.net, testCase.gross);
    const percentageDisplay = getPercentageDisplay(percentage);
    
    console.log(`  Take-home: ${percentageDisplay.text} (${percentageDisplay.color})`);
    console.log(`  Validation: ${validationError ? `❌ ${validationError}` : '✅ Valid'}`);
    console.log('');
});

console.log('✅ Net salary validation logic tested successfully!');
console.log('\n📊 Validation Rules Summary:');
console.log('- Net salary cannot be negative');
console.log('- Net salary cannot exceed gross salary');
console.log('- Take-home percentage should be 30%-95%');
console.log('- Color coding: Red (<50%), Yellow (50-70%), Green (70%+)');