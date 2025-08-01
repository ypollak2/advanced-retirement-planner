// Robust localStorage Manager - Production-Ready State Management
// Implements QA Audit recommendations for wizard state management
// Handles quota exceeded, corruption recovery, and state validation

window.RobustLocalStorage = {
    // Configuration
    config: {
        maxDataSize: 4500000, // 4.5MB (below 5MB localStorage limit)
        compressionRatio: 0.6, // Target 60% size reduction when compressing
        maxRetries: 3,
        defaultState: {
            currentStep: 1,
            planningType: 'individual',
            completedSteps: [],
            step1: {},
            step2: {},
            step3: {},
            step4: {},
            step5: {},
            step6: {},
            step7: {},
            step8: {},
            metadata: {
                version: '7.4.12',
                created: Date.now(),
                lastModified: Date.now()
            }
        }
    },

    // Enhanced error handling with user notifications
    handleStorageError: function(error, operation, data) {
        const errorInfo = {
            type: error.name || 'StorageError',
            operation: operation,
            timestamp: Date.now(),
            dataSize: data ? JSON.stringify(data).length : 0
        };

        console.error('🚨 localStorage Error:', errorInfo, error);

        // User notification based on error type
        if (error.name === 'QuotaExceededError') {
            this.showUserNotification(
                'Storage Full', 
                'Your browser storage is full. We\'ll save essential data only. Consider clearing browser data.',
                'warning'
            );
            return this.handleQuotaExceeded(data);
        } else if (error.message && error.message.includes('JSON')) {
            this.showUserNotification(
                'Data Recovery', 
                'Your saved progress had an issue. We\'ve restored it to the last good state.',
                'info'
            );
            return this.recoverFromCorruption();
        } else {
            this.showUserNotification(
                'Save Issue', 
                'There was a problem saving your progress. Your data is still safe.',
                'error'
            );
            return false;
        }
    },

    // Show user notification (integrates with existing UI)
    showUserNotification: function(title, message, type = 'info') {
        // Create notification element if it doesn't exist
        let notificationContainer = document.getElementById('storage-notifications');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'storage-notifications';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                font-family: Arial, sans-serif;
            `;
            document.body.appendChild(notificationContainer);
        }

        // Create notification
        const notification = document.createElement('div');
        const bgColor = {
            info: '#3B82F6',
            warning: '#F59E0B', 
            error: '#EF4444'
        }[type] || '#3B82F6';

        notification.style.cssText = `
            background: ${bgColor};
            color: white;
            padding: 12px 16px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
            <div style="font-size: 14px;">${message}</div>
        `;

        notificationContainer.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);

        // Add CSS animations if not already present
        if (!document.getElementById('storage-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'storage-notification-styles';
            styles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }
    },

    // Handle quota exceeded with data compression
    handleQuotaExceeded: function(data) {
        console.log('💾 Handling localStorage quota exceeded - implementing compression');
        
        try {
            // Create compressed version of data
            const compressedData = this.compressWizardData(data);
            
            // Try to save compressed data
            const compressedString = JSON.stringify(compressedData);
            if (compressedString.length < this.config.maxDataSize) {
                localStorage.setItem('retirementWizardData', compressedString);
                localStorage.setItem('retirementWizardDataCompressed', 'true');
                
                console.log(`✅ Compressed data saved: ${compressedString.length} bytes (${Math.round((1 - compressedString.length / JSON.stringify(data).length) * 100)}% reduction)`);
                return true;
            } else {
                // Even compressed data is too large - save essential only
                const essentialData = this.extractEssentialData(data);
                localStorage.setItem('retirementWizardData', JSON.stringify(essentialData));
                localStorage.setItem('retirementWizardDataEssential', 'true');
                
                console.log('✅ Essential data saved due to storage constraints');
                return true;
            }
        } catch (e) {
            console.error('❌ Failed to handle quota exceeded:', e);
            return false;
        }
    },

    // Compress wizard data by removing non-essential information
    compressWizardData: function(data) {
        const compressed = {
            currentStep: data.currentStep,
            planningType: data.planningType,
            completedSteps: data.completedSteps || [],
            metadata: {
                version: data.metadata?.version || '6.6.4',
                lastModified: Date.now(),
                compressed: true
            }
        };

        // Preserve essential wizard step data
        for (let step = 1; step <= 8; step++) {
            const stepKey = `step${step}`;
            if (data[stepKey]) {
                compressed[stepKey] = this.compressStepData(data[stepKey], step);
            }
        }

        return compressed;
    },

    // Compress individual step data
    compressStepData: function(stepData, stepNumber) {
        // Remove large arrays and keep only essential fields
        const compressed = {};

        switch (stepNumber) {
            case 1: // Personal Information
                compressed.age = stepData.age;
                compressed.retirementAge = stepData.retirementAge;
                compressed.country = stepData.country;
                compressed.language = stepData.language;
                if (stepData.partner) {
                    compressed.partner = {
                        name: stepData.partner.name,
                        age: stepData.partner.age,
                        retirementAge: stepData.partner.retirementAge
                    };
                }
                break;

            case 2: // Salary Information
                compressed.salary = stepData.salary;
                compressed.bonus = stepData.bonus;
                compressed.rsu = stepData.rsu;
                if (stepData.partner) {
                    compressed.partner = {
                        salary: stepData.partner.salary,
                        bonus: stepData.partner.bonus,
                        rsu: stepData.partner.rsu
                    };
                }
                break;

            case 3: // Current Savings
                compressed.pensionSavings = stepData.pensionSavings;
                compressed.trainingFundSavings = stepData.trainingFundSavings;
                compressed.personalSavings = stepData.personalSavings;
                compressed.realEstate = stepData.realEstate;
                compressed.crypto = stepData.crypto;
                if (stepData.partner) {
                    compressed.partner = {
                        pensionSavings: stepData.partner.pensionSavings,
                        trainingFundSavings: stepData.partner.trainingFundSavings,
                        personalSavings: stepData.partner.personalSavings
                    };
                }
                break;

            case 4: // Contribution Rates
                compressed.pensionRate = stepData.pensionRate;
                compressed.employerRate = stepData.employerRate;
                compressed.trainingFundEnabled = stepData.trainingFundEnabled;
                if (stepData.partner) {
                    compressed.partner = {
                        pensionRate: stepData.partner.pensionRate,
                        employerRate: stepData.partner.employerRate,
                        trainingFundEnabled: stepData.partner.trainingFundEnabled
                    };
                }
                break;

            case 5: // Investment Preferences
                compressed.riskProfile = stepData.riskProfile;
                compressed.allocation = stepData.allocation;
                if (stepData.partner) {
                    compressed.partner = {
                        riskProfile: stepData.partner.riskProfile,
                        allocation: stepData.partner.allocation
                    };
                }
                break;

            default:
                // For other steps, preserve all data but remove large arrays
                for (const key in stepData) {
                    if (stepData.hasOwnProperty(key)) {
                        const value = stepData[key];
                        if (Array.isArray(value) && value.length > 10) {
                            // Keep only recent items from large arrays
                            compressed[key] = value.slice(-10);
                        } else if (typeof value === 'object' && value !== null) {
                            // Recursively compress objects
                            compressed[key] = this.compressStepData(value, stepNumber);
                        } else {
                            compressed[key] = value;
                        }
                    }
                }
                break;
        }

        return compressed;
    },

    // Extract only the most essential data
    extractEssentialData: function(data) {
        return {
            currentStep: data.currentStep || 1,
            planningType: data.planningType || 'individual',
            step1: {
                age: data.step1?.age,
                retirementAge: data.step1?.retirementAge,
                country: data.step1?.country || 'ISR'
            },
            step2: {
                salary: data.step2?.salary,
                partner: data.step2?.partner ? { salary: data.step2.partner.salary } : undefined
            },
            metadata: {
                version: '7.4.12',
                essential: true,
                lastModified: Date.now()
            }
        };
    },

    // Recover from corrupted localStorage data
    recoverFromCorruption: function() {
        console.log('🔧 Recovering from localStorage corruption');

        try {
            // Try to recover partial data
            const rawData = localStorage.getItem('retirementWizardData');
            if (rawData) {
                // Attempt manual JSON repair for common issues
                const repairedData = this.repairJsonData(rawData);
                if (repairedData) {
                    localStorage.setItem('retirementWizardData', JSON.stringify(repairedData));
                    console.log('✅ Successfully repaired corrupted data');
                    return repairedData;
                }
            }

            // If repair fails, restore default state
            const defaultState = { ...this.config.defaultState };
            localStorage.setItem('retirementWizardData', JSON.stringify(defaultState));
            
            // Keep backup of corrupted data for debugging
            if (rawData) {
                localStorage.setItem('retirementWizardDataCorrupted', rawData);
                localStorage.setItem('retirementWizardDataCorruptedAt', Date.now().toString());
            }

            console.log('✅ Default state restored after corruption');
            return defaultState;

        } catch (e) {
            console.error('❌ Failed to recover from corruption:', e);
            
            // Last resort - clear all retirement data and start fresh
            this.clearStorageAndRestart();
            return this.config.defaultState;
        }
    },

    // Attempt to repair common JSON corruption issues
    repairJsonData: function(rawData) {
        try {
            // Common repairs
            let repairedData = rawData;

            // Fix truncated JSON (missing closing braces)
            const openBraces = (repairedData.match(/{/g) || []).length;
            const closeBraces = (repairedData.match(/}/g) || []).length;
            if (openBraces > closeBraces) {
                repairedData += '}}'.repeat(openBraces - closeBraces);
            }

            // Fix common escape issues
            repairedData = repairedData.replace(/\\\\/g, '\\');
            
            // Try to parse repaired data
            const parsed = JSON.parse(repairedData);
            
            // Validate structure
            if (this.validateWizardState(parsed)) {
                return parsed;
            }

            return null;
        } catch (e) {
            console.log('🔧 JSON repair failed, will restore default state');
            return null;
        }
    },

    // Validate wizard state structure
    validateWizardState: function(state) {
        if (!state || typeof state !== 'object') {
            return false;
        }

        // Essential fields must exist
        const essentialFields = ['currentStep', 'planningType'];
        for (const field of essentialFields) {
            if (!(field in state)) {
                console.log(`❌ Missing essential field: ${field}`);
                return false;
            }
        }

        // Current step should be valid
        if (typeof state.currentStep !== 'number' || state.currentStep < 1 || state.currentStep > 8) {
            console.log(`❌ Invalid currentStep: ${state.currentStep}`);
            return false;
        }

        // Planning type should be valid
        if (!['individual', 'couple'].includes(state.planningType)) {
            console.log(`❌ Invalid planningType: ${state.planningType}`);
            return false;
        }

        // Step data should be objects
        for (let step = 1; step <= 8; step++) {
            const stepKey = `step${step}`;
            if (state[stepKey] && typeof state[stepKey] !== 'object') {
                console.log(`❌ Invalid step data type: ${stepKey}`);
                return false;
            }
        }

        return true;
    },

    // Clear storage and restart (nuclear option)
    clearStorageAndRestart: function() {
        console.log('🚨 Clearing all retirement data and restarting');
        
        const keysToRemove = [
            'retirementWizardData',
            'retirementWizardDataCompressed',
            'retirementWizardDataEssential',
            'retirementWizardDataCorrupted',
            'retirementWizardDataCorruptedAt'
        ];

        keysToRemove.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error(`Failed to remove ${key}:`, e);
            }
        });

        this.showUserNotification(
            'Fresh Start',
            'We had to reset your data due to a technical issue. You can start planning again.',
            'info'
        );
    },

    // Enhanced save with error handling and retries
    saveWizardData: function(data, retryCount = 0) {
        try {
            // Validate data before saving
            if (!this.validateWizardState(data)) {
                console.error('❌ Invalid wizard state - not saving');
                return false;
            }

            // Add metadata
            const dataWithMetadata = {
                ...data,
                metadata: {
                    ...data.metadata,
                    version: '7.4.12',
                    lastModified: Date.now()
                }
            };

            // Check data size
            const serializedData = JSON.stringify(dataWithMetadata);
            if (serializedData.length > this.config.maxDataSize) {
                console.log('📊 Data size exceeds limit, applying compression');
                return this.handleQuotaExceeded(dataWithMetadata);
            }

            // Save to localStorage
            localStorage.setItem('retirementWizardData', serializedData);
            
            // Clear compression flags if saving full data
            localStorage.removeItem('retirementWizardDataCompressed');
            localStorage.removeItem('retirementWizardDataEssential');

            console.log(`✅ Wizard data saved: ${serializedData.length} bytes`);
            return true;

        } catch (error) {
            if (retryCount < this.config.maxRetries) {
                console.log(`🔄 Save failed, retrying (${retryCount + 1}/${this.config.maxRetries})`);
                return this.saveWizardData(data, retryCount + 1);
            } else {
                return this.handleStorageError(error, 'save', data);
            }
        }
    },

    // Enhanced load with error handling and recovery
    loadWizardData: function() {
        try {
            const rawData = localStorage.getItem('retirementWizardData');
            
            if (!rawData) {
                console.log('📝 No saved wizard data found, using default state');
                return this.config.defaultState;
            }

            const parsedData = JSON.parse(rawData);
            
            // Validate loaded data
            if (!this.validateWizardState(parsedData)) {
                console.log('⚠️ Loaded data failed validation, attempting recovery');
                return this.recoverFromCorruption();
            }

            // Check if data was compressed/essential
            const isCompressed = localStorage.getItem('retirementWizardDataCompressed') === 'true';
            const isEssential = localStorage.getItem('retirementWizardDataEssential') === 'true';

            if (isCompressed) {
                console.log('📦 Loaded compressed wizard data');
                this.showUserNotification(
                    'Compressed Data',
                    'Your data was compressed to save space. All essential information is preserved.',
                    'info'
                );
            } else if (isEssential) {
                console.log('⚡ Loaded essential wizard data');
                this.showUserNotification(
                    'Essential Data',
                    'Only essential data was saved due to storage limits. You may need to re-enter some details.',
                    'warning'
                );
            }

            console.log(`✅ Wizard data loaded: ${rawData.length} bytes`);
            return parsedData;

        } catch (error) {
            console.error('❌ Failed to load wizard data:', error);
            return this.handleStorageError(error, 'load', null);
        }
    },

    // Check storage health
    checkStorageHealth: function() {
        const healthReport = {
            available: true,
            quotaUsage: 0,
            dataSize: 0,
            isCompressed: false,
            isEssential: false,
            issues: []
        };

        try {
            // Test localStorage availability
            const testKey = 'storage-health-test';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);

            // Check current data size
            const rawData = localStorage.getItem('retirementWizardData');
            if (rawData) {
                healthReport.dataSize = rawData.length;
            }

            // Check compression status
            healthReport.isCompressed = localStorage.getItem('retirementWizardDataCompressed') === 'true';
            healthReport.isEssential = localStorage.getItem('retirementWizardDataEssential') === 'true';

            // Estimate quota usage (rough approximation)
            let totalSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length;
                }
            }
            healthReport.quotaUsage = totalSize;

            // Check for issues
            if (healthReport.quotaUsage > 4000000) { // 4MB warning threshold
                healthReport.issues.push('High storage usage - approaching quota limit');
            }
            
            if (healthReport.isEssential) {
                healthReport.issues.push('Data was reduced to essential-only due to storage constraints');
            }

            if (localStorage.getItem('retirementWizardDataCorrupted')) {
                healthReport.issues.push('Previous data corruption detected and recovered');
            }

        } catch (error) {
            healthReport.available = false;
            healthReport.issues.push(`localStorage not available: ${error.message}`);
        }

        return healthReport;
    }
};

// Initialize storage health check on load
document.addEventListener('DOMContentLoaded', function() {
    const healthReport = window.RobustLocalStorage.checkStorageHealth();
    
    if (healthReport.issues.length > 0) {
        console.log('⚠️ Storage Health Issues:', healthReport.issues);
    } else {
        console.log('✅ Storage health check passed');
    }
});

console.log('✅ RobustLocalStorage utility loaded successfully');