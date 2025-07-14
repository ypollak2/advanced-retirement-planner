#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 Advanced Retirement Planner - User Experience Test Suite');
console.log('==========================================================\n');

let testsPassed = 0;
let testsFailed = 0;

function logTest(name, passed, message = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    console.log(`[${timestamp}] ${status} ${name}`);
    if (message) {
        console.log(`    ${message}`);
    }
    
    if (passed) {
        testsPassed++;
    } else {
        testsFailed++;
    }
}

// Test user interface clarity and usability
function testUserInterfaceClarity() {
    console.log('🖼️  Testing User Interface Clarity...');
    
    try {
        // Check for clear labeling and instructions
        const translationContent = fs.readFileSync('src/translations/multiLanguage.js', 'utf8');
        
        const hasHelpText = translationContent.includes('help') || 
                           translationContent.includes('tooltip') ||
                           translationContent.includes('description');
        logTest('Help text availability', hasHelpText, 
            'Users should have access to helpful explanations');
        
        const hasErrorMessages = translationContent.includes('error') || 
                                translationContent.includes('invalid');
        logTest('Error message localization', hasErrorMessages, 
            'Error messages should be user-friendly and localized');
        
        // Check for language support
        const supportsHebrew = translationContent.includes('he') && translationContent.includes('עברית');
        const supportsEnglish = translationContent.includes('en') && translationContent.includes('English');
        
        logTest('Hebrew language support', supportsHebrew, 
            'Critical for Israeli retirement planning audience');
        
        logTest('English language support', supportsEnglish, 
            'Important for international users');
        
        // Check for RTL support
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        const hasRTLSupport = htmlContent.includes('dir=') || htmlContent.includes('rtl');
        logTest('RTL language support', hasRTLSupport, 
            'Essential for Hebrew users');
        
    } catch (error) {
        logTest('UI clarity analysis', false, `Error: ${error.message}`);
    }
}

// Test financial calculation transparency
function testFinancialTransparency() {
    console.log('\n💰 Testing Financial Calculation Transparency...');
    
    try {
        const calcContent = fs.readFileSync('src/utils/retirementCalculations.js', 'utf8');
        
        // Check for calculation explanations
        const hasComments = calcContent.includes('//') && calcContent.includes('calculation');
        logTest('Calculation documentation', hasComments, 
            'Financial calculations should be well-documented');
        
        // Check for fee transparency
        const showsFees = calcContent.includes('fee') && calcContent.includes('cost');
        logTest('Fee transparency', showsFees, 
            'Users should understand all costs involved');
        
        // Check for inflation adjustments
        const handlesInflation = calcContent.includes('inflation') && calcContent.includes('adjust');
        logTest('Inflation consideration', handlesInflation, 
            'Critical for long-term retirement planning');
        
        // Check for tax considerations
        const handlesTax = calcContent.includes('tax') || calcContent.includes('Tax');
        logTest('Tax consideration', handlesTax, 
            'Tax implications are important for retirement planning');
        
        // Check for multiple scenarios
        const supportsScenarios = calcContent.includes('scenario') || calcContent.includes('stress');
        logTest('Scenario planning', supportsScenarios, 
            'Users should be able to plan for different outcomes');
        
    } catch (error) {
        logTest('Financial transparency analysis', false, `Error: ${error.message}`);
    }
}

// Test user guidance and onboarding
function testUserGuidance() {
    console.log('\n🎓 Testing User Guidance...');
    
    try {
        // Check for progressive disclosure
        const appContent = fs.readFileSync('src/components/RetirementPlannerApp.js', 'utf8');
        
        const hasTabSystem = appContent.includes('tab') && appContent.includes('basic');
        logTest('Progressive disclosure', hasTabSystem, 
            'Complex features should be introduced gradually');
        
        // Check for form validation feedback
        const basicFormContent = fs.readFileSync('src/components/RetirementBasicForm.js', 'utf8');
        const hasValidation = basicFormContent.includes('validation') || 
                             basicFormContent.includes('required') ||
                             basicFormContent.includes('error');
        logTest('Form validation feedback', hasValidation, 
            'Users should get immediate feedback on input errors');
        
        // Check for results explanation
        const resultsContent = fs.readFileSync('src/components/RetirementResultsPanel.js', 'utf8');
        const explainsResults = resultsContent.includes('explanation') || 
                               resultsContent.includes('summary') ||
                               resultsContent.includes('breakdown');
        logTest('Results explanation', explainsResults, 
            'Results should be clearly explained to users');
        
        // Check for export capabilities
        const hasExport = resultsContent.includes('export') || resultsContent.includes('download');
        logTest('Export capabilities', hasExport, 
            'Users should be able to save their planning results');
        
    } catch (error) {
        logTest('User guidance analysis', false, `Error: ${error.message}`);
    }
}

// Test mobile usability
function testMobileUsability() {
    console.log('\n📱 Testing Mobile Usability...');
    
    try {
        const cssContent = fs.readFileSync('src/styles/main.css', 'utf8');
        
        // Check for responsive design
        const hasResponsiveBreakpoints = cssContent.includes('@media') || cssContent.includes('sm:') || cssContent.includes('md:');
        logTest('Responsive breakpoints', hasResponsiveBreakpoints, 
            'Application should work well on all screen sizes');
        
        // Check for touch-friendly sizing
        const hasTouchFriendly = cssContent.includes('px-') || cssContent.includes('py-') || cssContent.includes('padding');
        logTest('Touch-friendly interface', hasTouchFriendly, 
            'Interactive elements should be easily tappable');
        
        // Check HTML viewport
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        const hasViewport = htmlContent.includes('width=device-width');
        logTest('Mobile viewport configuration', hasViewport, 
            'Proper viewport is essential for mobile experience');
        
    } catch (error) {
        logTest('Mobile usability analysis', false, `Error: ${error.message}`);
    }
}

// Test data visualization quality
function testDataVisualization() {
    console.log('\n📊 Testing Data Visualization...');
    
    try {
        // Check for chart implementation
        const chartContent = fs.readFileSync('src/components/FinancialChart.js', 'utf8');
        
        const hasChartLibrary = chartContent.includes('Chart') || chartContent.includes('chart');
        logTest('Chart implementation', hasChartLibrary, 
            'Visual representation of retirement data is important');
        
        // Check for chart customization
        const hasCustomization = chartContent.includes('color') && chartContent.includes('label');
        logTest('Chart customization', hasCustomization, 
            'Charts should be visually appealing and informative');
        
        // Check for data formatting
        const calcContent = fs.readFileSync('src/utils/retirementCalculations.js', 'utf8');
        const hasFormatting = calcContent.includes('formatCurrency') || calcContent.includes('toLocaleString');
        logTest('Number formatting', hasFormatting, 
            'Financial numbers should be properly formatted');
        
        // Check for multiple visualization types
        const supportsMultipleCharts = chartContent.includes('line') || chartContent.includes('bar');
        logTest('Multiple chart types', supportsMultipleCharts, 
            'Different data should use appropriate visualization types');
        
    } catch (error) {
        logTest('Data visualization analysis', false, `Error: ${error.message}`);
    }
}

// Run all UX tests
testUserInterfaceClarity();
testFinancialTransparency();
testUserGuidance();
testMobileUsability();
testDataVisualization();

// Final report
console.log('\n📊 User Experience Test Summary');
console.log('================================');
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

if (testsFailed > 0) {
    console.log('\n⚠️  UX issues found. Consider improvements.');
    console.log('\n💡 UX Best Practices for Retirement Planning:');
    console.log('   • Make financial calculations transparent and explainable');
    console.log('   • Provide clear guidance for first-time users');
    console.log('   • Support multiple languages for diverse user base');
    console.log('   • Use progressive disclosure for complex features');
    console.log('   • Ensure mobile-first responsive design');
    console.log('   • Provide helpful tooltips and explanations');
    console.log('   • Include scenario planning and stress testing');
    console.log('   • Make results exportable and shareable');
} else {
    console.log('\n🎉 Great user experience! All UX tests passed.');
}

console.log('\n🚀 Next Steps for UX Enhancement:');
console.log('   • Conduct user testing with real retirement planners');
console.log('   • A/B test different layouts and flows');
console.log('   • Gather feedback from financial advisors');
console.log('   • Test with users of different age groups');
console.log('   • Validate calculations with financial experts');

process.exit(testsFailed > 0 ? 1 : 0);