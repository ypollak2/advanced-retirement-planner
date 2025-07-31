# 🚀 Advanced Retirement Planner v7.3.6 - Development Guide

## Overview

This guide provides comprehensive development standards and workflows for the Advanced Retirement Planner v7.3.6. It covers component development, testing requirements, deployment processes, and best practices learned from production hotfixes and quality improvements.

## 🎯 Development Philosophy

### **Code Quality First**
- **100% Test Pass Rate**: All 374 tests must pass before deployment
- **Runtime Error Prevention**: Component validation prevents production crashes
- **Security by Design**: Input validation, XSS prevention, secret scanning
- **Performance Optimized**: Parallel loading, caching, minimal bundle size

### **Development Principles**
- **Test-Driven Development**: Write tests as you develop features
- **Component Safety**: Validate component rendering before deployment
- **Incremental Updates**: Small, testable changes over large refactors
- **Documentation First**: Update docs alongside code changes

## 🏗️ Development Environment Setup

### **Prerequisites**
```bash
Node.js >= 18.x
npm >= 8.x
Git with proper configuration
```

### **Local Development Setup**
```bash
# Clone repository
git clone https://github.com/ypollak2/advanced-retirement-planner.git
cd advanced-retirement-planner

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests (required before any changes)
npm test

# Validate components (new requirement)
npm run validate:components
```

### **Development Scripts**
```bash
# Core Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run preview                # Preview production build

# Testing (CRITICAL)
npm test                       # Run all 374 tests
npm run validate:components    # Component render validation
npm run validate:render        # React render testing
npm run test:watch             # Watch mode for development

# Quality Assurance  
npm run validate:syntax        # Syntax validation
npm run validate:quick         # Quick validation suite
npm run qa:pre-commit          # Pre-commit checks

# Deployment
npm run deploy:pre-check       # Pre-deployment validation
npm run deploy:verify          # Post-deployment verification
```

## 🧩 Component Development Standards

### **React Component Guidelines**

#### **1. Function Declaration Order (CRITICAL)**
Always define functions BEFORE `useEffect` hooks that reference them:

```javascript
// ✅ CORRECT: Functions defined first
const MyComponent = ({ onComplete }) => {
  const [state, setState] = React.useState(null);
  
  // Define functions BEFORE useEffect
  const handleNext = React.useCallback(() => {
    // Implementation
  }, [dependencies]);
  
  const handlePrevious = React.useCallback(() => {
    // Implementation  
  }, [dependencies]);
  
  // useEffect comes AFTER function definitions
  React.useEffect(() => {
    // Safe to use handleNext and handlePrevious
  }, [handleNext, handlePrevious]);
  
  return React.createElement('div', null, 'Content');
};
```

```javascript
// ❌ INCORRECT: Will cause "Cannot access before initialization"
const MyComponent = ({ onComplete }) => {
  // useEffect references functions not yet defined
  React.useEffect(() => {
    handleNext(); // ERROR: handleNext not defined yet
  }, [handleNext, handlePrevious]);
  
  // Functions defined AFTER useEffect (causes errors)
  const handleNext = React.useCallback(() => {
    // Implementation
  }, [dependencies]);
};
```

#### **2. Component Export Pattern**
```javascript
// Window export for script tag loading
window.MyComponent = MyComponent;

// Or with validation
if (typeof window !== 'undefined') {
  window.MyComponent = MyComponent;
}
```

#### **3. State Management**
```javascript
// Use useState for local state
const [localState, setLocalState] = React.useState(initialValue);

// Use useCallback for functions in dependencies
const memoizedFunction = React.useCallback(() => {
  // Implementation
}, [dependency1, dependency2]);

// Use useEffect for side effects
React.useEffect(() => {
  // Side effect logic
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

### **Error Handling Standards**

```javascript
// Always wrap risky operations in try-catch
const saveData = React.useCallback(() => {
  try {
    localStorage.setItem('key', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
    // Handle error gracefully
  }
}, [data]);

// Use error boundaries for component crashes
const ComponentWithErrorBoundary = () => {
  return React.createElement(
    window.ErrorBoundary,
    { fallback: 'Something went wrong' },
    React.createElement(MyComponent)
  );
};
```

## 🧪 Testing Requirements

### **Mandatory Testing Before Deployment**

1. **All 374 Tests Must Pass**
   ```bash
   npm test
   # Must show: ✅ Tests Passed: 374, ❌ Tests Failed: 0
   ```

2. **Component Validation**
   ```bash
   npm run validate:components
   # Must show: ✅ All components validated successfully!
   ```

3. **Syntax Validation**
   ```bash
   npm run validate:syntax
   # Must show: ✅ All files syntax validated
   ```

### **Test-Driven Development Process**

1. **Write Test First**
   ```javascript
   test.describe('New Feature', () => {
     test.it('should handle new requirement', () => {
       // Test implementation
       const result = myNewFunction(input);
       test.assertEqual(result, expectedOutput);
     });
   });
   ```

2. **Implement Feature**
   - Write minimal code to make test pass
   - Follow component development standards
   - Ensure proper function ordering

3. **Validate Implementation**
   ```bash
   npm test                    # All tests pass
   npm run validate:components # Component validation passes
   ```

### **Component Testing Standards**

```javascript
// Test component can render without errors
test.describe('MyComponent', () => {
  test.it('should render without initialization errors', () => {
    const container = document.createElement('div');
    const root = ReactDOM.createRoot(container);
    
    // Should not throw
    test.assertNoThrow(() => {
      root.render(React.createElement(MyComponent));
    });
    
    root.unmount();
  });
});
```

## 🔧 Development Workflow

### **Feature Development Process**

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Run Pre-Development Validation**
   ```bash
   npm run validate:pre-work
   # Runs: validate:quick + npm test
   ```

3. **Develop with Testing**
   ```bash
   # Watch mode for continuous testing
   npm run test:watch
   
   # Validate components continuously
   npm run validate:components
   ```

4. **Pre-Commit Validation**
   ```bash
   npm run qa:pre-commit
   # Comprehensive quality checks
   ```

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: descriptive commit message"
   git push origin feature/new-feature-name
   ```

### **Hotfix Process**

For critical production issues:

1. **Create Hotfix Branch**
   ```bash
   git checkout -b hotfix/issue-description
   ```

2. **Fix Issue with Testing**
   ```bash
   # Fix the issue
   # Add/update tests
   npm test  # Must pass all 374 tests
   npm run validate:components  # Must pass
   ```

3. **Deploy Hotfix**
   ```bash
   # Commit fix
   git commit -m "🚨 HOTFIX: description of fix"
   
   # Push to main
   git push origin hotfix/issue-description
   
   # Create PR for review
   # After merge, hotfix deploys automatically
   ```

## 📦 Version Management

### **Version Update Process**

```bash
# Update version (updates all 121+ locations)
node scripts/update-version.js 7.3.7

# Commit version update
git commit -m "chore: Bump version to v7.3.7"

# Push for deployment
git push origin main
```

### **Cache Busting**
All scripts automatically include version parameters:
```html
<script src="src/components/MyComponent.js?v=7.3.6"></script>
```

## 🛡️ Security Development

### **Input Validation**
```javascript
// Always validate inputs
const validateInput = (value, type) => {
  if (type === 'number') {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) ? num : 0;
  }
  
  if (type === 'string') {
    return String(value).trim();
  }
  
  return value;
};
```

### **XSS Prevention**
```javascript
// Use textContent, not innerHTML
element.textContent = userInput;

// Use React.createElement for safe DOM creation
return React.createElement('div', {
  className: 'safe-content'
}, sanitizedContent);
```

### **Secret Protection**
- Never commit API keys or secrets
- Use environment variables for sensitive data
- Run `npm run security:scan` before commits

## 🚀 Deployment Standards

### **Pre-Deployment Checklist**

1. **[ ] All 374 tests passing**
   ```bash
   npm test
   ```

2. **[ ] Component render validation passing**
   ```bash
   npm run validate:components
   ```

3. **[ ] Version bumped correctly**
   ```bash
   node scripts/update-version.js X.Y.Z
   ```

4. **[ ] Documentation updated**
   - README.md "What's New" section
   - CHANGELOG.md entry

5. **[ ] No console errors in browser**
   - Test locally with `npm run preview`
   - Check browser console for errors

6. **[ ] Component validation in CI/CD**
   - GitHub Actions includes component validation
   - Automated deployment only after validation passes

### **Deployment Process**

1. **Automatic Deployment**
   - Push to `main` triggers GitHub Actions
   - CI/CD runs all tests and validations
   - Deploys to production if all checks pass

2. **Manual Deployment Check**
   ```bash
   npm run deploy:pre-check  # Pre-deployment validation
   npm run deploy:verify     # Post-deployment verification
   ```

## 🔍 Debugging & Monitoring

### **Console Interceptor**
Debug mode available with `?debug=true` URL parameter:
```
https://ypollak2.github.io/advanced-retirement-planner/?debug=true
```

### **Debug Features**
- Captures all console output
- Categorizes logs (calculation, data, api, component)  
- Export capabilities (JSON, Text, LLM-optimized)
- Search and filter functionality

### **Performance Monitoring**
```javascript
// Performance tracking built-in
console.log('📊 js_load_time: 240ms');
console.log('📊 js_size: 18864ms');
```

## 📚 Additional Resources

### **Documentation**
- [Architecture Guide](architecture.md) - System architecture
- [Testing Guide](testing/TESTING-GUIDE.md) - Comprehensive testing
- [Security Features](Security-Features.md) - Security measures
- [QA Process](qa.md) - Quality assurance

### **Key Files**
- `CLAUDE.md` - Development standards and rules
- `package.json` - Scripts and dependencies
- `version.json` - Version management
- `.github/workflows/` - CI/CD pipelines

### **npm Scripts Reference**
```bash
# Development
npm run dev                    # Development server
npm run build                  # Production build
npm run preview                # Preview build

# Testing (CRITICAL)
npm test                       # All 374 tests
npm run validate:components    # Component validation
npm run validate:syntax        # Syntax validation
npm run validate:quick         # Quick validation

# Quality Assurance
npm run qa:pre-commit          # Pre-commit checks
npm run qa:full                # Full QA suite

# Deployment
npm run deploy:pre-check       # Pre-deployment validation
npm run deploy:verify          # Post-deployment verification
```

## 🎯 Best Practices Summary

1. **Always define functions before `useEffect` that references them**
2. **Run `npm test` before every commit (374 tests must pass)**
3. **Use `npm run validate:components` before deployment**
4. **Follow React.useCallback patterns for functions in dependencies**
5. **Update documentation alongside code changes**
6. **Use try-catch for error-prone operations**
7. **Validate all user inputs**
8. **Test components can mount/unmount without errors**
9. **Follow semantic versioning for releases**
10. **Monitor production with debug tools when needed**

---

**Remember**: The #1 rule is **100% test pass rate before ANY deployment**. Component validation prevents production crashes. Follow these standards to maintain the high quality and reliability of the Advanced Retirement Planner.