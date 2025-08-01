// Production Hotfix for Review Step Issues
// Run this in console to fix the 4 persistent issues

(function applyReviewStepHotfix() {
    console.log('🔧 Applying Review Step Hotfix...');
    
    // 1. Add missing getAllInputs function
    if (!window.getAllInputs) {
        window.getAllInputs = function() {
            // Try localStorage first
            try {
                const savedInputs = localStorage.getItem('retirementWizardInputs');
                if (savedInputs) {
                    const inputs = JSON.parse(savedInputs);
                    console.log('✅ Retrieved', Object.keys(inputs).length, 'fields from localStorage');
                    return inputs;
                }
            } catch (e) {
                console.error('Failed to get inputs from localStorage:', e);
            }
            
            // Try window.wizardInputs
            if (window.wizardInputs) {
                return window.wizardInputs;
            }
            
            console.warn('⚠️ No inputs found');
            return {};
        };
        console.log('✅ Added window.getAllInputs()');
    }
    
    // 2. Fix Component Scores calculation
    const originalCalcRetirement = window.calculateRetirement;
    window.calculateRetirement = function(inputs) {
        const result = originalCalcRetirement ? originalCalcRetirement.call(this, inputs) : {};
        
        // Ensure totalSavings includes all components for couple mode
        if (inputs.planningType === 'couple' && result.totalSavings === 0) {
            let totalSavings = 0;
            
            // Add all partner savings
            totalSavings += parseFloat(inputs.partner1CurrentPension || 0);
            totalSavings += parseFloat(inputs.partner2CurrentPension || 0);
            totalSavings += parseFloat(inputs.partner1CurrentTrainingFund || 0);
            totalSavings += parseFloat(inputs.partner2CurrentTrainingFund || 0);
            totalSavings += parseFloat(inputs.partner1PersonalPortfolio || 0);
            totalSavings += parseFloat(inputs.partner2PersonalPortfolio || 0);
            totalSavings += parseFloat(inputs.partner1RealEstate || 0);
            totalSavings += parseFloat(inputs.partner2RealEstate || 0);
            totalSavings += parseFloat(inputs.partner1Crypto || 0);
            totalSavings += parseFloat(inputs.partner2Crypto || 0);
            
            result.totalSavings = totalSavings;
            console.log('✅ Fixed totalSavings calculation:', totalSavings);
        }
        
        // Calculate current monthly income (not retirement income)
        if (!result.currentMonthlyIncome) {
            let monthlyIncome = 0;
            
            if (inputs.planningType === 'couple') {
                // Partner salaries
                monthlyIncome += parseFloat(inputs.partner1Salary || 0);
                monthlyIncome += parseFloat(inputs.partner2Salary || 0);
                
                // Bonuses (annual to monthly)
                monthlyIncome += parseFloat(inputs.partner1Bonus || inputs.partner1AnnualBonus || 0) / 12;
                monthlyIncome += parseFloat(inputs.partner2Bonus || inputs.partner2AnnualBonus || 0) / 12;
                
                // RSUs (quarterly to monthly)
                monthlyIncome += parseFloat(inputs.partner1RSU || inputs.partner1QuarterlyRSU || 0) / 3;
                monthlyIncome += parseFloat(inputs.partner2RSU || inputs.partner2QuarterlyRSU || 0) / 3;
                
                // Other income
                monthlyIncome += parseFloat(inputs.partner1FreelanceIncome || 0);
                monthlyIncome += parseFloat(inputs.partner2FreelanceIncome || 0);
            } else {
                monthlyIncome += parseFloat(inputs.currentMonthlySalary || inputs.currentSalary || 0);
                monthlyIncome += parseFloat(inputs.annualBonus || 0) / 12;
                monthlyIncome += parseFloat(inputs.quarterlyRSU || 0) / 3;
                monthlyIncome += parseFloat(inputs.freelanceIncome || 0);
            }
            
            result.currentMonthlyIncome = monthlyIncome;
            console.log('✅ Calculated current monthly income:', monthlyIncome);
        }
        
        return result;
    };
    console.log('✅ Patched calculateRetirement function');
    
    // 3. Fix enhancedGetFieldValue if missing
    if (!window.enhancedGetFieldValue) {
        window.enhancedGetFieldValue = function(inputs, fieldNames, options = {}) {
            const { combinePartners = false, allowZero = false } = options;
            
            let values = [];
            for (const field of fieldNames) {
                const value = parseFloat(inputs[field] || 0);
                if (!isNaN(value) && (allowZero || value > 0)) {
                    values.push(value);
                }
            }
            
            if (values.length === 0) return 0;
            
            if (combinePartners && values.length > 1) {
                return values.reduce((sum, val) => sum + val, 0);
            }
            
            return values[0];
        };
        console.log('✅ Added enhancedGetFieldValue function');
    }
    
    // 4. Trigger recalculation
    const inputs = window.getAllInputs();
    if (Object.keys(inputs).length > 0) {
        console.log('🔄 Triggering recalculation with', Object.keys(inputs).length, 'fields');
        
        // Dispatch event to trigger React updates
        window.dispatchEvent(new CustomEvent('wizardInputsUpdated', { 
            detail: { inputs: inputs } 
        }));
        
        // If on Review step, try to force re-render
        const reviewStep = document.querySelector('[class*="review"], #step-9');
        if (reviewStep) {
            console.log('🔄 Attempting to refresh Review step...');
            // Trigger a small state change to force re-render
            const event = new Event('change', { bubbles: true });
            reviewStep.dispatchEvent(event);
        }
    }
    
    console.log('✅ Review Step Hotfix Applied!');
    console.log('📝 You may need to navigate away and back to the Review step to see changes');
    
    return {
        success: true,
        inputs: inputs,
        functions: {
            getAllInputs: !!window.getAllInputs,
            calculateRetirement: !!window.calculateRetirement,
            enhancedGetFieldValue: !!window.enhancedGetFieldValue
        }
    };
})();