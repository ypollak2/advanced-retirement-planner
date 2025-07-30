# Code Style and Conventions

## JavaScript Style (NO ES6 MODULES)
- **NO ES6 imports/exports** - Use window exports pattern
- **NO JSX** - Use React.createElement only
- **Variable declarations**: Use `var` not `let`/`const` 
- **Functions**: Regular function declarations, not arrow functions
- **React Hooks**: Standard pattern with `var [state, setState] = React.useState()`
- **Component exports**: `window.ComponentName = ComponentName`

## Code Patterns

### Component Structure
```javascript
// Component definition
function ComponentName(props) {
    var languageState = React.useState('en');
    var language = languageState[0];
    var setLanguage = languageState[1];
    
    // Component logic
    
    return React.createElement('div', null, ...);
}

// Export pattern
window.ComponentName = ComponentName;
```

### No Comments Rule
- **CRITICAL**: DO NOT ADD ANY COMMENTS unless explicitly requested
- Code should be self-documenting
- Only exception: File headers with version/author info

### Financial Calculations
- Always validate inputs before calculations
- Use formatCurrency() for display
- Handle division by zero
- Currency conversion must support 6 types
- RSU calculations: units × stock price × frequency

### Error Handling
- Use try/catch blocks extensively
- Log with context: `console.error('Component: Error details', error)`
- Never let errors crash the app
- Provide user-friendly messages in both languages

### Naming Conventions
- Components: PascalCase (e.g., RetirementPlannerApp)
- Functions: camelCase (e.g., calculateRetirement)
- Files: PascalCase for components, camelCase for utils
- Partner fields: partner1FieldName, partner2FieldName

### State Management
- LocalStorage keys: 'retirementWizardInputs', 'wizardCurrentStep'
- Use getFieldValue() for field access in couple mode
- Validate loaded data (backward compatibility)

### Testing Requirements
- Every new feature needs tests
- Tests must cover individual AND couple modes
- Use existing test patterns in test-runner.js
- 100% pass rate required (302/302 tests)

## Important Patterns

### Script Loading
- All scripts loaded via index.html
- Use cache-busting: `?v=X.Y.Z`
- Dependencies loaded BEFORE components
- Maximum 5 inline script tags

### API Integration
- ALL external APIs need CORS proxy
- Implement fallback data
- Cache with 5-minute TTL minimum
- Domain validation required

### Internationalization
- Use multiLanguage.js for all text
- Support Hebrew (he) and English (en)
- RTL support for Hebrew
- Currency symbols match locale