# Testing Principles - Dynamic Test Targeting

## Core Rule: Tests Must Adapt to Architecture

**NEVER assume static file structures or patterns - tests must be dynamic and architecture-aware.**

### The Problem We Solved
- Tests were hardcoded to check `index.html` but we were using `index-modular.html`
- Tests looked for old patterns (`src/components/`, `checkModules`) but architecture had evolved
- Tests failed because they didn't adapt to the new modular structure

### New Testing Principles

#### 1. **Dynamic File Discovery**
```javascript
// BAD: Hardcoded file paths
const html = fs.readFileSync('index.html', 'utf8');

// GOOD: Discover the actual entry point
function findEntryPoint() {
    const candidates = ['index.html', 'index-modular.html', 'main.html'];
    return candidates.find(file => fs.existsSync(file)) || 'index.html';
}
const entryFile = findEntryPoint();
const html = fs.readFileSync(entryFile, 'utf8');
```

#### 2. **Architecture-Aware Pattern Detection**
```javascript
// BAD: Assumes specific structure
test: html.includes('src/components/')

// GOOD: Adapts to actual architecture
test: html.includes('src/core/') || html.includes('src/modules/') || html.includes('src/components/')
```

#### 3. **Evolution-Tolerant Checks**
```javascript
// BAD: Expects exact function names
test: html.includes('checkModules')

// GOOD: Accepts functional equivalents
test: html.includes('checkDependencies') || html.includes('checkModules') || html.includes('dependencyCheck')
```

#### 4. **Content-Based Validation**
```javascript
// BAD: Assumes implementation details
test: html.includes('RetirementPlannerApp') && html.includes('BasicInputs')

// GOOD: Validates actual functionality
test: html.includes('initializeRetirementPlannerCore') || 
      (html.includes('RetirementPlannerApp') && html.includes('BasicInputs'))
```

### Implementation Strategy

#### Before Every Test Run:
1. **Scan the current architecture**
2. **Detect the entry point file**
3. **Identify the module structure**
4. **Adapt test patterns accordingly**

#### Test Structure:
```javascript
// Architecture discovery phase
const architecture = discoverArchitecture();
const entryFile = architecture.entryPoint;
const moduleStructure = architecture.moduleType; // 'monolithic', 'modular', 'hybrid'

// Adaptive test patterns
const patterns = getTestPatterns(moduleStructure);
```

### Key Learnings Applied:

1. **Never hardcode file paths** - always discover dynamically
2. **Test for functionality, not implementation** - what matters is that ErrorBoundary works, not where it's defined
3. **Make tests evolution-proof** - they should pass when we improve the architecture
4. **Validate the actual user experience** - does the app work, not does it match old assumptions

### Future Test Development Rules:

✅ **DO:**
- Scan for actual files before testing
- Test multiple possible patterns
- Focus on user-facing functionality
- Make tests architecture-agnostic
- Update test patterns when architecture evolves

❌ **DON'T:**
- Hardcode file names or paths
- Assume specific implementation details
- Test for exact string matches
- Make tests brittle to refactoring
- Ignore test failures without understanding root cause

### Example: Dynamic Test Implementation
```javascript
function testHTMLStructure() {
    // 1. Discover entry point
    const entryFile = findActualEntryPoint();
    
    // 2. Load and analyze
    const html = fs.readFileSync(entryFile, 'utf8');
    
    // 3. Adaptive checks
    const checks = [
        { 
            name: 'Error boundary', 
            test: hasErrorBoundary(html) // Function that checks multiple patterns
        },
        {
            name: 'Module system',
            test: hasModuleSystem(html) // Adapts to monolithic vs modular
        }
    ];
}
```

This principle ensures tests remain valuable and accurate as the codebase evolves, preventing the exact issue we encountered.