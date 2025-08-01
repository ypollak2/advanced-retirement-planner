// Debug script to trace NaN issue in Component Scores
// Run this in browser console on the production site

(function debugComponentScoresNaN() {
    console.log('\n🔍 === DEBUGGING COMPONENT SCORES NaN ISSUE ===\n');
    
    // 1. Check localStorage data
    const savedInputs = localStorage.getItem('retirementWizardInputs');
    if (savedInputs) {
        const inputs = JSON.parse(savedInputs);
        console.log('📦 Saved inputs:', {
            currentSalary: inputs.currentSalary,
            currentMonthlySalary: inputs.currentMonthlySalary,
            typeOfCurrentSalary: typeof inputs.currentSalary,
            typeOfCurrentMonthlySalary: typeof inputs.currentMonthlySalary
        });
    }
    
    // 2. Check formatCurrency function
    console.log('\n💰 formatCurrency function:', {
        exists: !!window.formatCurrency,
        type: typeof window.formatCurrency
    });
    
    if (window.formatCurrency) {
        // Test formatCurrency with various values
        console.log('Testing formatCurrency:');
        const testValues = [0, 20000, '20000', NaN, undefined, null];
        testValues.forEach(value => {
            try {
                const result = window.formatCurrency(value, 'ILS');
                console.log(`  formatCurrency(${value}, 'ILS') = "${result}"`);
            } catch (e) {
                console.error(`  formatCurrency(${value}, 'ILS') threw error:`, e.message);
            }
        });
    }
    
    // 3. Check the actual DOM element
    const incomeElement = document.querySelector('[data-testid="component-score-income"]');
    if (incomeElement) {
        console.log('\n📄 DOM Element:', {
            text: incomeElement.textContent,
            innerHTML: incomeElement.innerHTML
        });
    }
    
    // 4. Check if processedInputs is available in React DevTools
    console.log('\n🔧 To check processedInputs in React DevTools:');
    console.log('1. Open React DevTools');
    console.log('2. Find WizardStepReview component');
    console.log('3. Check hooks to see processedInputs value');
    
    // 5. Try to access the React component instance
    const rootElement = document.getElementById('root');
    if (rootElement && rootElement._reactRootContainer) {
        console.log('\n⚛️ React Root found, component tree accessible via React DevTools');
    }
    
    // 6. Check for any NaN values in the page
    const allTextNodes = [];
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.includes('NaN')) {
            allTextNodes.push({
                text: node.textContent.trim(),
                parent: node.parentElement?.className || 'no-class'
            });
        }
    }
    
    if (allTextNodes.length > 0) {
        console.log('\n⚠️ Found NaN text in DOM:', allTextNodes);
    }
    
    // 7. Check window.currencyAPI
    if (window.currencyAPI) {
        console.log('\n💱 Currency API status:', window.currencyAPI.getErrorStatus());
    }
    
    console.log('\n✅ Debug script completed\n');
})();