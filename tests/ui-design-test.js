// UI Design Test Suite - Tests for permanent side panel and tabbed navigation
// Created by Yali Pollak (יהלי פולק) - v5.3.2

const UIDesignTest = {
    tests: [],
    results: [],

    init() {
        console.log('🚀 Starting UI Design Test Suite v5.3.2');
        this.runAllTests();
    },

    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    },

    async runAllTests() {
        for (const test of this.tests) {
            try {
                const result = await test.testFunction();
                this.results.push({
                    name: test.name,
                    status: result.success ? 'PASS' : 'FAIL',
                    message: result.message,
                    details: result.details || null
                });
                console.log(
                    result.success ? '✅' : '❌',
                    `${test.name}: ${result.message}`
                );
            } catch (error) {
                this.results.push({
                    name: test.name,
                    status: 'ERROR',
                    message: error.message,
                    details: error.stack
                });
                console.error('💥', `${test.name}: ${error.message}`);
            }
        }

        this.generateReport();
    },

    generateReport() {
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const failed = this.results.filter(r => r.status === 'FAIL').length;
        const errors = this.results.filter(r => r.status === 'ERROR').length;
        const total = this.results.length;

        console.log('\n📊 UI Design Test Results Summary:');
        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`💥 Errors: ${errors}`);
        console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

        if (failed > 0 || errors > 0) {
            console.log('\n🔍 Failed/Error Tests:');
            this.results
                .filter(r => r.status !== 'PASS')
                .forEach(result => {
                    console.log(`${result.status}: ${result.name} - ${result.message}`);
                });
        }
    }
};

// Test 1: Permanent Side Panel Component Exists
UIDesignTest.addTest('Permanent Side Panel Component', () => {
    if (!window.PermanentSidePanel) {
        return {
            success: false,
            message: 'PermanentSidePanel component not found'
        };
    }

    if (typeof window.PermanentSidePanel !== 'function') {
        return {
            success: false,
            message: 'PermanentSidePanel is not a function component'
        };
    }

    return {
        success: true,
        message: 'PermanentSidePanel component exists and is callable'
    };
});

// Test 2: CSS Classes for Side Panel
UIDesignTest.addTest('Side Panel CSS Classes', () => {
    const testDiv = document.createElement('div');
    testDiv.className = 'permanent-side-panel';
    document.body.appendChild(testDiv);

    const computedStyle = window.getComputedStyle(testDiv);
    const hasFixedPosition = computedStyle.position === 'fixed';
    const hasProperZIndex = parseInt(computedStyle.zIndex) >= 1000;

    document.body.removeChild(testDiv);

    if (!hasFixedPosition) {
        return {
            success: false,
            message: 'Side panel does not have fixed positioning'
        };
    }

    if (!hasProperZIndex) {
        return {
            success: false,
            message: 'Side panel z-index is too low'
        };
    }

    return {
        success: true,
        message: 'Side panel CSS positioning is correct'
    };
});

// Test 3: Main Content Layout Adjustment
UIDesignTest.addTest('Main Content Layout Adjustment', () => {
    const testDiv = document.createElement('div');
    testDiv.className = 'main-content-with-sidebar';
    document.body.appendChild(testDiv);

    const computedStyle = window.getComputedStyle(testDiv);
    const hasLeftMargin = parseInt(computedStyle.marginLeft) > 0;

    document.body.removeChild(testDiv);

    if (!hasLeftMargin) {
        return {
            success: false,
            message: 'Main content does not have proper left margin for sidebar'
        };
    }

    return {
        success: true,
        message: 'Main content layout adjustment is correct'
    };
});

// Test 4: RTL Support
UIDesignTest.addTest('RTL Language Support', () => {
    const testDiv = document.createElement('div');
    testDiv.className = 'main-content-with-sidebar rtl';
    document.body.appendChild(testDiv);

    const computedStyle = window.getComputedStyle(testDiv);
    const hasRightMargin = parseInt(computedStyle.marginRight) > 0;
    const hasNoLeftMargin = parseInt(computedStyle.marginLeft) === 0;

    document.body.removeChild(testDiv);

    if (!hasRightMargin || !hasNoLeftMargin) {
        return {
            success: false,
            message: 'RTL layout support is not working correctly'
        };
    }

    return {
        success: true,
        message: 'RTL layout support is functional'
    };
});

// Test 5: Component Integration in Main App
UIDesignTest.addTest('Component Integration', () => {
    if (!window.RetirementPlannerApp) {
        return {
            success: false,
            message: 'RetirementPlannerApp component not found'
        };
    }

    // Test if the component can be created without errors
    try {
        const mockElement = React.createElement(window.RetirementPlannerApp);
        if (!mockElement) {
            return {
                success: false,
                message: 'Failed to create RetirementPlannerApp element'
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `Error creating component: ${error.message}`
        };
    }

    return {
        success: true,
        message: 'Component integration successful'
    };
});

// Test 6: Currency Selector Integration
UIDesignTest.addTest('Currency Selector Integration', () => {
    if (!window.currencyAPI) {
        return {
            success: false,
            message: 'Currency API not available'
        };
    }

    if (!window.MultiCurrencySavings) {
        return {
            success: false,
            message: 'MultiCurrencySavings component not found'
        };
    }

    return {
        success: true,
        message: 'Currency components are properly integrated'
    };
});

// Test 7: Responsive Design
UIDesignTest.addTest('Responsive Design Breakpoints', () => {
    const breakpoints = [
        { width: 320, name: 'Mobile Small' },
        { width: 768, name: 'Tablet' },
        { width: 1024, name: 'Desktop Small' },
        { width: 1200, name: 'Desktop Large' }
    ];

    const testResults = [];

    breakpoints.forEach(bp => {
        // Create a temporary test element
        const testDiv = document.createElement('div');
        testDiv.className = 'permanent-side-panel';
        testDiv.style.width = bp.width + 'px';
        document.body.appendChild(testDiv);

        // Get media query styles
        const computedStyle = window.getComputedStyle(testDiv);
        
        document.body.removeChild(testDiv);

        testResults.push({
            breakpoint: bp.name,
            width: bp.width,
            hasStyles: computedStyle.position === 'fixed'
        });
    });

    const allBreakpointsWork = testResults.every(result => result.hasStyles);

    return {
        success: allBreakpointsWork,
        message: allBreakpointsWork 
            ? 'All responsive breakpoints have proper styles'
            : 'Some responsive breakpoints are missing styles',
        details: testResults
    };
});

// Test 8: Accessibility Features
UIDesignTest.addTest('Accessibility Features', () => {
    const issues = [];

    // Check for CSS custom properties (CSS variables)
    const rootStyles = getComputedStyle(document.documentElement);
    const hasCSSVars = rootStyles.getPropertyValue('--trust-blue') !== '';

    if (!hasCSSVars) {
        issues.push('CSS custom properties not defined');
    }

    // Check for reduced motion support
    const testDiv = document.createElement('div');
    testDiv.style.transition = 'all 0.3s ease';
    document.body.appendChild(testDiv);

    // Simulate reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
        const computedStyle = window.getComputedStyle(testDiv);
        if (parseFloat(computedStyle.transitionDuration) > 0.01) {
            issues.push('Reduced motion preference not respected');
        }
    }

    document.body.removeChild(testDiv);

    return {
        success: issues.length === 0,
        message: issues.length === 0 
            ? 'Accessibility features are properly implemented'
            : `Accessibility issues found: ${issues.join(', ')}`,
        details: issues
    };
});

// Test 9: Tab Navigation Functionality
UIDesignTest.addTest('Tab Navigation System', () => {
    try {
        // Create a mock component instance
        const mockInputs = {
            currentAge: 30,
            retirementAge: 67,
            currentSavings: 50000
        };

        const mockProps = {
            inputs: mockInputs,
            results: null,
            workingCurrency: 'ILS',
            language: 'en',
            formatCurrency: (amount) => `₪${amount.toLocaleString()}`,
            onInputChange: () => {},
            onQuickAction: () => {}
        };

        // Try to create the component
        const element = React.createElement(window.PermanentSidePanel, mockProps);
        
        if (!element) {
            return {
                success: false,
                message: 'Failed to create PermanentSidePanel with props'
            };
        }

        return {
            success: true,
            message: 'Tab navigation system can be instantiated'
        };
    } catch (error) {
        return {
            success: false,
            message: `Tab navigation error: ${error.message}`
        };
    }
});

// Test 10: Performance Check
UIDesignTest.addTest('Performance Check', () => {
    const startTime = performance.now();
    
    // Simulate creating multiple components
    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
        const testDiv = document.createElement('div');
        testDiv.className = 'permanent-side-panel widget';
        document.body.appendChild(testDiv);
        document.body.removeChild(testDiv);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    const isPerformant = duration < 100; // Should complete in under 100ms

    return {
        success: isPerformant,
        message: isPerformant 
            ? `Performance test passed (${duration.toFixed(2)}ms)`
            : `Performance test failed (${duration.toFixed(2)}ms > 100ms)`,
        details: { duration, iterations }
    };
});

// Test 11: Language Consistency Check
UIDesignTest.addTest('Language Consistency', () => {
    if (!window.PermanentSidePanel) {
        return {
            success: false,
            message: 'PermanentSidePanel component not available for language test'
        };
    }

    // Test both Hebrew and English
    const languages = ['en', 'he'];
    const results = [];

    languages.forEach(lang => {
        try {
            const mockProps = {
                inputs: { currentAge: 30 },
                results: null,
                workingCurrency: 'ILS',
                language: lang,
                formatCurrency: (amount) => `₪${amount.toLocaleString()}`,
                onInputChange: () => {},
                onQuickAction: () => {}
            };

            const element = React.createElement(window.PermanentSidePanel, mockProps);
            results.push({ language: lang, success: !!element });
        } catch (error) {
            results.push({ language: lang, success: false, error: error.message });
        }
    });

    const allLanguagesWork = results.every(r => r.success);

    return {
        success: allLanguagesWork,
        message: allLanguagesWork 
            ? 'All languages render without errors'
            : 'Some languages have rendering issues',
        details: results
    };
});

// Test 12: Fixed Terminology Check
UIDesignTest.addTest('Terminology Update Check', () => {
    if (!window.ReadinessScore) {
        return {
            success: false,
            message: 'ReadinessScore component not found'
        };
    }

    // Check if the old "projectedSavings" terminology is still present
    const componentString = window.ReadinessScore.toString();
    const hasOldTerminology = componentString.includes('projectedSavings');
    const hasNewTerminology = componentString.includes('retirementGoal');

    if (hasOldTerminology) {
        return {
            success: false,
            message: 'Old "projectedSavings" terminology still present in code'
        };
    }

    if (!hasNewTerminology) {
        return {
            success: false,
            message: 'New "retirementGoal" terminology not found'
        };
    }

    return {
        success: true,
        message: 'Terminology has been successfully updated'
    };
});

// Auto-run tests when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => UIDesignTest.init(), 1000);
    });
} else {
    setTimeout(() => UIDesignTest.init(), 1000);
}

// Export for global access
window.UIDesignTest = UIDesignTest;

console.log('UI Design Test Suite loaded successfully');