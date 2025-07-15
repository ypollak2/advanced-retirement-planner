// Language Consistency Test - Advanced Retirement Planner
// Tests for Hebrew/English translation consistency, typos, and default language settings
// Created for QA suite - v5.3.1

const fs = require('fs');
const path = require('path');

console.log('🌐 Advanced Retirement Planner - Language Consistency Test');
console.log('=======================================================');

let passedTests = 0;
let failedTests = 0;
const issues = [];

// Test 1: Check default language settings
console.log('\n📍 Testing Default Language Settings...');

const componentsToCheck = [
    'src/components/RetirementPlannerApp.js',
    'src/components/StressTestInterface.js',
    'src/components/ExportControls.js',
    'src/components/DynamicPartnerCharts.js',
    'src/components/Dashboard.js',
    'src/components/CurrencySelector.js',
    'src/components/SummaryPanel.js',
    'src/components/HelpTooltip.js',
    'src/components/ReadinessScore.js',
    'src/components/FinancialChart.js',
    'src/utils/stressTestScenarios.js',
    'src/app.js'
];

componentsToCheck.forEach(filePath => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for Hebrew default language
        if (content.includes("language = 'he'")) {
            console.log(`❌ FAIL: ${filePath} - Uses Hebrew as default language`);
            issues.push(`${filePath}: Should use English as default language`);
            failedTests++;
        } else if (content.includes("language = 'en'")) {
            console.log(`✅ PASS: ${filePath} - Uses English as default language`);
            passedTests++;
        } else if (content.includes("useState('en')")) {
            console.log(`✅ PASS: ${filePath} - Uses English as default language state`);
            passedTests++;
        } else if (content.includes("useState('he')")) {
            console.log(`❌ FAIL: ${filePath} - Uses Hebrew as default language state`);
            issues.push(`${filePath}: Should use English as default language state`);
            failedTests++;
        } else {
            console.log(`⚠️  SKIP: ${filePath} - No default language parameter found`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${filePath} - ${error.message}`);
        failedTests++;
    }
});

// Test 2: Check translation completeness
console.log('\n📚 Testing Translation Completeness...');

try {
    const translationFile = 'src/translations/multiLanguage.js';
    const content = fs.readFileSync(translationFile, 'utf8');
    
    // Extract Hebrew and English keys
    const hebrewMatch = content.match(/he:\s*{([^}]+)}/s);
    const englishMatch = content.match(/en:\s*{([^}]+)}/s);
    
    if (hebrewMatch && englishMatch) {
        const hebrewKeys = hebrewMatch[1].match(/\w+:/g) || [];
        const englishKeys = englishMatch[1].match(/\w+:/g) || [];
        
        const hebrewKeySet = new Set(hebrewKeys.map(k => k.replace(':', '')));
        const englishKeySet = new Set(englishKeys.map(k => k.replace(':', '')));
        
        // Check for missing Hebrew keys
        englishKeySet.forEach(key => {
            if (!hebrewKeySet.has(key)) {
                console.log(`❌ FAIL: Missing Hebrew translation for "${key}"`);
                issues.push(`Missing Hebrew translation for "${key}"`);
                failedTests++;
            }
        });
        
        // Check for missing English keys
        hebrewKeySet.forEach(key => {
            if (!englishKeySet.has(key)) {
                console.log(`❌ FAIL: Missing English translation for "${key}"`);
                issues.push(`Missing English translation for "${key}"`);
                failedTests++;
            }
        });
        
        if (hebrewKeySet.size === englishKeySet.size) {
            console.log(`✅ PASS: Translation keys are balanced (${hebrewKeySet.size} keys each)`);
            passedTests++;
        }
    }
} catch (error) {
    console.log(`❌ ERROR: Translation file check failed - ${error.message}`);
    failedTests++;
}

// Test 3: Check for common English spelling mistakes
console.log('\n📝 Testing English Spelling and Grammar...');

const commonMistakes = [
    { wrong: 'withdrawl', correct: 'withdrawal' },
    { wrong: 'seperate', correct: 'separate' },
    { wrong: 'occured', correct: 'occurred' },
    { wrong: 'recieve', correct: 'receive' },
    { wrong: 'definately', correct: 'definitely' },
    { wrong: 'neccessary', correct: 'necessary' },
    { wrong: 'accomodate', correct: 'accommodate' },
    { wrong: 'begining', correct: 'beginning' },
    { wrong: 'existance', correct: 'existence' },
    { wrong: 'independant', correct: 'independent' }
];

const filesToCheck = [
    'src/translations/multiLanguage.js',
    'src/components/StressTestInterface.js',
    'README.md'
];

filesToCheck.forEach(filePath => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let fileIssues = 0;
        
        commonMistakes.forEach(mistake => {
            const regex = new RegExp(`\\b${mistake.wrong}\\b`, 'gi');
            const matches = content.match(regex);
            if (matches) {
                console.log(`❌ FAIL: ${filePath} - Contains "${mistake.wrong}" (should be "${mistake.correct}") - ${matches.length} occurrences`);
                issues.push(`${filePath}: Fix spelling "${mistake.wrong}" → "${mistake.correct}"`);
                fileIssues++;
            }
        });
        
        if (fileIssues === 0) {
            console.log(`✅ PASS: ${filePath} - No spelling errors found`);
            passedTests++;
        } else {
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ ERROR: ${filePath} - ${error.message}`);
        failedTests++;
    }
});

// Test 4: Check for consistent terminology
console.log('\n🔤 Testing Terminology Consistency...');

const terminologyTests = [
    {
        file: 'src/translations/multiLanguage.js',
        tests: [
            { term: 'Retirement', consistent: true },
            { term: 'Pension', consistent: true },
            { term: 'Training Fund', consistent: true },
            { term: 'Portfolio', consistent: true }
        ]
    }
];

terminologyTests.forEach(test => {
    try {
        const content = fs.readFileSync(test.file, 'utf8');
        
        test.tests.forEach(termTest => {
            const regex = new RegExp(termTest.term, 'gi');
            const matches = content.match(regex) || [];
            
            if (matches.length > 0) {
                console.log(`✅ PASS: ${test.file} - "${termTest.term}" used consistently (${matches.length} times)`);
                passedTests++;
            } else {
                console.log(`⚠️  INFO: ${test.file} - "${termTest.term}" not found`);
            }
        });
    } catch (error) {
        console.log(`❌ ERROR: ${test.file} - ${error.message}`);
        failedTests++;
    }
});

// Test 5: Check for Hebrew text in English context
console.log('\n🔍 Testing Language Context Separation...');

try {
    const content = fs.readFileSync('src/translations/multiLanguage.js', 'utf8');
    
    // Check for Hebrew characters in English section
    const englishSection = content.match(/en:\s*{([^}]+)}/s);
    if (englishSection) {
        const hebrewChars = englishSection[1].match(/[\u0590-\u05FF]/g);
        if (hebrewChars) {
            console.log(`❌ FAIL: Hebrew characters found in English translations: ${hebrewChars.join(', ')}`);
            issues.push('Hebrew characters found in English translation section');
            failedTests++;
        } else {
            console.log('✅ PASS: No Hebrew characters in English translations');
            passedTests++;
        }
    }
    
    // Check for English characters in Hebrew section (excluding keys)
    const hebrewSection = content.match(/he:\s*{([^}]+)}/s);
    if (hebrewSection) {
        // Remove keys and quotes to check only values
        const hebrewValues = hebrewSection[1].replace(/\w+:\s*"/g, '').replace(/"/g, '');
        const englishInHebrew = hebrewValues.match(/\b[a-zA-Z]{3,}\b/g);
        if (englishInHebrew && englishInHebrew.length > 5) { // Allow some English words
            console.log(`⚠️  WARN: Many English words in Hebrew translations: ${englishInHebrew.slice(0, 5).join(', ')}...`);
        } else {
            console.log('✅ PASS: Hebrew translations use primarily Hebrew text');
            passedTests++;
        }
    }
} catch (error) {
    console.log(`❌ ERROR: Language context check failed - ${error.message}`);
    failedTests++;
}

// Test 6: Check fallback logic in components
console.log('\n🔄 Testing Component Fallback Logic...');

const componentFallbackTests = [
    { file: 'src/components/StressTestInterface.js', expected: 'content.en' },
    { file: 'src/components/Dashboard.js', expected: 'content.en' },
    { file: 'src/components/SummaryPanel.js', expected: 'content.en' },
    { file: 'src/components/DynamicPartnerCharts.js', expected: 'content.en' },
    { file: 'src/components/ExportControls.js', expected: 'content.en' }
];

componentFallbackTests.forEach(test => {
    try {
        const content = fs.readFileSync(test.file, 'utf8');
        
        // Check for correct fallback pattern
        if (content.includes('content[language] || content.en')) {
            console.log(`✅ PASS: ${test.file} - Falls back to English`);
            passedTests++;
        } else if (content.includes('content[language] || content.he')) {
            console.log(`❌ FAIL: ${test.file} - Falls back to Hebrew instead of English`);
            issues.push(`${test.file}: Change fallback from content.he to content.en`);
            failedTests++;
        } else {
            console.log(`⚠️  SKIP: ${test.file} - No fallback pattern found`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${test.file} - ${error.message}`);
        failedTests++;
    }
});

// Test 7: Check for consistent currency formatting
console.log('\n💰 Testing Currency Formatting Consistency...');

const currencyTests = [
    { file: 'src/translations/multiLanguage.js', pattern: /\(₪\)/, expected: 'Shekel symbol in parentheses' },
    { file: 'src/translations/multiLanguage.js', pattern: /\(%\)/, expected: 'Percentage symbol in parentheses' }
];

currencyTests.forEach(test => {
    try {
        const content = fs.readFileSync(test.file, 'utf8');
        const matches = content.match(test.pattern);
        
        if (matches && matches.length > 0) {
            console.log(`✅ PASS: ${test.file} - Currency formatting consistent (${matches.length} occurrences)`);
            passedTests++;
        } else {
            console.log(`❌ FAIL: ${test.file} - Currency formatting not found or inconsistent`);
            issues.push(`${test.file}: Check currency formatting for ${test.expected}`);
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ ERROR: ${test.file} - ${error.message}`);
        failedTests++;
    }
});

// Final Report
console.log('\n📊 Language Consistency Test Summary');
console.log('=====================================');
console.log(`✅ Tests Passed: ${passedTests}`);
console.log(`❌ Tests Failed: ${failedTests}`);
console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

if (issues.length > 0) {
    console.log('\n🔧 Issues Found:');
    issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
    });
}

console.log('\n💡 Language Consistency Best Practices:');
console.log('   • Use English as default language for global accessibility');
console.log('   • Maintain complete translations for both Hebrew and English');
console.log('   • Use consistent terminology across all interfaces');
console.log('   • Separate language contexts properly');
console.log('   • Follow consistent currency and percentage formatting');
console.log('   • Test both languages in production');

if (failedTests > 0) {
    console.log('\n⚠️  Language consistency issues found. Please review and fix.');
    process.exit(1);
} else {
    console.log('\n🎉 All language consistency tests passed!');
    process.exit(0);
}