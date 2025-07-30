// Review Components Index - Loads all review panel components
// Modular components extracted from WizardStepReview for better maintainability

console.log('🔄 Loading review components...');

// Load utility functions first
const script1 = document.createElement('script');
script1.src = './src/utils/reviewCalculations.js';
script1.onload = () => console.log('✅ Review calculations loaded');
document.head.appendChild(script1);

// Load review panel components
const reviewComponents = [
    './src/components/review/AdditionalIncomeTaxPanel.js',
    './src/components/review/CoupleCompatibilityPanel.js', 
    './src/components/review/RetirementProjectionPanel.js',
    './src/components/review/ExpenseAnalysisPanel.js'
];

reviewComponents.forEach((src, index) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
        const componentName = src.split('/').pop().replace('.js', '');
        console.log(`✅ ${componentName} loaded`);
        
        // Check if all components are loaded
        if (index === reviewComponents.length - 1) {
            console.log('🎉 All review components loaded successfully');
            
            // Dispatch event to notify that review components are ready
            window.dispatchEvent(new CustomEvent('reviewComponentsLoaded'));
        }
    };
    script.onerror = () => {
        console.error(`❌ Failed to load ${src}`);
    };
    document.head.appendChild(script);
});

// Export component availability checker
window.checkReviewComponentsAvailable = function() {
    const components = [
        'AdditionalIncomeTaxPanel',
        'CoupleCompatibilityPanel', 
        'RetirementProjectionPanel',
        'ExpenseAnalysisPanel'
    ];
    
    const utilities = [
        'calculateTotalCurrentSavings',
        'calculateOverallFinancialHealthScore',
        'generateImprovementSuggestions'
    ];
    
    const componentStatus = components.map(name => ({
        name,
        available: !!window[name]
    }));
    
    const utilityStatus = utilities.map(name => ({
        name, 
        available: !!window[name]
    }));
    
    return {
        components: componentStatus,
        utilities: utilityStatus,
        allLoaded: [...componentStatus, ...utilityStatus].every(item => item.available)
    };
};

console.log('📦 Review components index initialized');