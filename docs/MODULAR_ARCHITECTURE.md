# Modular Architecture Documentation

## Overview
This document describes the modular architecture implemented in v7.5.11 to improve code maintainability and Claude Code compatibility.

## Architecture Principles

### 1. File Size Limits
- **Target**: All files under 800 lines
- **Maximum**: 1000 lines for complex components
- **Result**: Better Claude Code performance and easier navigation

### 2. Module Loading Strategy
- No ES6 modules (to maintain compatibility)
- Window object exports pattern
- Dynamic script loading with compatibility layers
- Sequential loading for dependencies

### 3. Backward Compatibility
- All original APIs preserved
- Compatibility layers handle module loading
- No breaking changes for existing code

## Modularized Components

### Financial Health Engine
**Original**: `src/utils/financialHealthEngine.js` (3,072 lines)  
**Location**: `src/utils/financialHealth/`

```
financialHealth/
├── safeCalculations.js     # Safe math operations (174 lines)
├── constants.js            # Score factors and benchmarks (196 lines)
├── fieldMapper.js          # Field mapping logic (227 lines)
├── scoringCalculators.js   # Core scoring calculators (339 lines)
├── additionalCalculators.js # Additional calculators (330 lines)
├── engine.js               # Main orchestrator (273 lines)
└── index.js                # Module loader (171 lines)
```

### Retirement Planner App
**Original**: `src/components/core/RetirementPlannerApp.js` (2,055 lines)  
**Location**: `src/components/core/app/`

```
app/
├── initialState.js         # State management (183 lines)
├── eventHandlers.js        # Event handling logic (242 lines)
├── uiComponents.js         # Reusable UI components (291 lines)
└── RetirementPlannerAppCore.js # Main component (280 lines)
```

### Wizard Step Salary
**Original**: `src/components/wizard/steps/WizardStepSalary.js` (1,709 lines)  
**Location**: `src/components/wizard/salary/`

```
salary/
├── content.js              # Multi-language content (109 lines)
├── validation.js           # Salary validation (65 lines)
├── calculations.js         # Income calculations (168 lines)
├── salaryInputs.js         # Salary input components (324 lines)
├── additionalIncome.js     # Additional income UI (437 lines)
├── incomeSummary.js        # Income summary (436 lines)
├── WizardStepSalaryCore.js # Main component (57 lines)
└── (compatibility layer)    # WizardStepSalary.js (88 lines)
```

### Retirement Calculations
**Original**: `src/utils/retirementCalculations.js` (1,179 lines)  
**Location**: `src/utils/retirement/`

```
retirement/
├── currencyHelpers.js      # Currency formatting (94 lines)
├── returnCalculators.js    # Investment returns (138 lines)
├── progressiveCalculations.js # Progressive savings (239 lines)
├── chartFormatting.js      # Chart formatting (133 lines)
├── incomeCalculations.js   # Income calculations (437 lines)
├── coreCalculations.js     # Main calculation engine (431 lines)
├── chartData.js            # Chart data generation (46 lines)
└── (compatibility layer)    # retirementCalculations.js (85 lines)
```

## Directory Reorganization

### Utils Directory Structure
```
src/utils/
├── api/                    # External API integrations
│   ├── currencyAPI.js
│   ├── stockPriceAPI.js
│   └── cryptoPriceAPI.js
├── calculations/           # Financial calculations
│   ├── tax/
│   │   ├── TaxCalculators.js
│   │   ├── additionalIncomeTax.js
│   │   └── taxOptimization.js
│   └── investments/
│       ├── dynamicReturnAssumptions.js
│       └── advancedRebalancing.js
├── validation/             # Input validation
│   ├── inputValidation.js
│   └── coupleValidation.js
├── ui/                     # UI utilities
│   ├── animations/
│   │   ├── celebrationAnimations.js
│   │   └── particleBackground.js
│   └── formatting/
├── storage/                # Storage utilities
│   └── sessionStorageGist.js
└── system/                 # System utilities
    ├── fullAppInitializer.js
    ├── performanceMonitor.js
    └── dynamicLoader.js
```

## Module Loading Pattern

### Compatibility Layer Example
```javascript
// WizardStepSavings.js - Compatibility Layer
console.log('💼 Loading Wizard Step Savings (modular structure)...');

(function() {
    if (window.WizardStepSavingsModulesLoaded === true) {
        console.log('✓ Wizard Step Savings already loaded');
        return;
    }
    
    window.WizardStepSavingsModulesLoaded = 'loading';
    
    const modules = [
        'src/components/wizard/savings/content.js',
        'src/components/wizard/savings/calculations.js',
        'src/components/wizard/savings/mainPersonSavings.js',
        'src/components/wizard/savings/partnerSavings.js',
        'src/components/wizard/savings/WizardStepSavingsCore.js'
    ];
    
    // Load modules sequentially...
})();
```

### Module Export Pattern
```javascript
// Example: calculations.js
(function() {
    // Module code...
    
    function calculateTotalIncome(inputs) {
        // Implementation...
    }
    
    // Export to window
    window.calculateTotalIncome = calculateTotalIncome;
})();
```

## Benefits

### 1. Improved Maintainability
- Smaller, focused files
- Clear separation of concerns
- Easier to locate specific functionality

### 2. Better Performance
- Parallel script loading where possible
- Lazy loading capabilities
- Reduced initial bundle size

### 3. Enhanced Developer Experience
- Files optimized for Claude Code (< 800 lines)
- Logical organization
- Self-documenting structure

### 4. Testing Benefits
- Isolated module testing
- Clear dependency tracking
- Easier mocking and stubbing

## Migration Guide

### For Developers
1. **Using modularized components**: No changes needed - compatibility layers handle everything
2. **Adding new features**: Follow the modular pattern in the appropriate subdirectory
3. **Modifying existing code**: Edit the specific module, not the compatibility layer

### For Testing
1. **Unit tests**: Can now test individual modules
2. **Integration tests**: Use compatibility layers
3. **Browser tests**: All functionality preserved

## Best Practices

1. **Keep modules focused**: One responsibility per module
2. **Use descriptive names**: Module name should indicate its purpose
3. **Maintain exports**: Always export to window object
4. **Document dependencies**: Comment any inter-module dependencies
5. **Test compatibility**: Ensure compatibility layer works after changes

## Future Enhancements

1. **Build process**: Consider webpack/rollup for production builds
2. **TypeScript**: Add type definitions for better IDE support
3. **Module federation**: For micro-frontend architecture
4. **Performance monitoring**: Track module load times

---
Last Updated: v7.5.11 - Repository Reorganization