# Security Rules - Advanced Retirement Planner

## 🚨 CRITICAL SECURITY RULES

These are **MANDATORY** security rules that must be followed at all times. Violation of these rules will cause security scans to fail and block deployments.

### ❌ FORBIDDEN PRACTICES

#### 1. **NO eval() USAGE - ZERO TOLERANCE**
```javascript
// ❌ NEVER DO THIS - SECURITY VIOLATION
eval(userInput);
eval("console.log('test')");
const result = eval(dynamicCode);

// ✅ ALTERNATIVES: Use safe parsing and predefined functions
JSON.parse(jsonString);        // For JSON data
parseInt(numberString);        // For numbers
parseFloat(numberString);      // For decimals
switch(action) { ... }         // For dynamic behavior
```

**Why forbidden**: `eval()` executes arbitrary code and is the #1 vector for code injection attacks.

#### 2. **NO Function Constructor**
```javascript
// ❌ FORBIDDEN
new Function(userInput);
Function(code)();

// ✅ ALTERNATIVE: Use predefined functions
const allowedFunctions = { add: (a,b) => a+b, multiply: (a,b) => a*b };
```

#### 3. **NO Unsafe innerHTML with User Data**
```javascript
// ❌ DANGEROUS
element.innerHTML = userInput;
div.innerHTML = `<span>${userInput}</span>`;

// ✅ SAFE: Use textContent or sanitize
element.textContent = userInput;
element.innerHTML = DOMPurify.sanitize(userInput);
```

#### 4. **NO Inline Event Handlers**
```javascript
// ❌ AVOID
<button onclick="handleClick()">Click</button>
element.setAttribute('onclick', 'doSomething()');

// ✅ SAFE: Use addEventListener
element.addEventListener('click', handleClick);
```

#### 5. **NO javascript: URLs**
```javascript
// ❌ FORBIDDEN
<a href="javascript:doSomething()">Link</a>
window.location = "javascript:alert('xss')";

// ✅ SAFE: Use proper event handlers
<a href="#" onClick={handleClick}>Link</a>
```

### ✅ REQUIRED PRACTICES

#### 1. **Input Validation**
```javascript
// ✅ ALWAYS validate and sanitize user inputs
const validateAge = (age) => {
    const num = parseInt(age);
    return isNaN(num) ? 0 : Math.max(0, Math.min(120, num));
};

const validateSalary = (salary) => {
    const num = parseFloat(salary);
    return isNaN(num) ? 0 : Math.max(0, num);
};
```

#### 2. **Safe Number Handling**
```javascript
// ✅ Use fallback values
const safeValue = inputs.salary || 0;
const bounded = Math.max(0, Math.min(1000000, value));
```

#### 3. **Secure Data Storage**
```javascript
// ❌ NEVER store sensitive data in localStorage/sessionStorage
localStorage.setItem('password', userPassword); // FORBIDDEN

// ✅ SAFE: Only store non-sensitive UI preferences
localStorage.setItem('language', 'he');
localStorage.setItem('hasVisited', 'true');
```

#### 4. **Safe React Patterns**
```javascript
// ✅ Use React's built-in XSS protection
return React.createElement('div', {}, userInput); // Safe
return <div>{userInput}</div>; // Safe

// ❌ AVOID unless absolutely necessary and sanitized
return <div dangerouslySetInnerHTML={{__html: sanitizedHtml}} />;
```

## 🔍 AUTOMATED ENFORCEMENT

### Pre-commit Hooks
```bash
# Check for forbidden patterns before every commit
grep -r "eval(" --include="*.js" --include="*.html" src/
if [ $? -eq 0 ]; then
    echo "❌ SECURITY VIOLATION: eval() usage detected"
    exit 1
fi
```

### CI/CD Security Scan
Our security workflow automatically blocks deployments if:
- `eval()` usage is detected
- `new Function()` patterns found
- `javascript:` URLs present
- Unsafe `innerHTML` patterns detected

### Security Exceptions
**NO EXCEPTIONS** - These rules apply to ALL code:
- Core application files
- Module files
- Helper utilities
- Test files (except for testing security itself)
- Documentation examples

## 🛡️ SECURITY SCANNING

### Automated Checks
1. **eval() Detection**: `grep -r "eval(" --include="*.js" --include="*.html"`
2. **Function Constructor**: `grep -r "new Function\|Function(" --include="*.js"`
3. **JavaScript URLs**: `grep -r "javascript:" --include="*.html" --include="*.js"`
4. **Unsafe innerHTML**: `grep -r "innerHTML.*\+\|innerHTML.*\$" --include="*.js"`

### Manual Review Required
- Any dynamic code generation
- External library integration
- User-generated content handling
- Data export/import functionality

## 📋 VIOLATION RESPONSE

### If eval() is Found
1. **IMMEDIATE**: Remove eval() usage
2. **REPLACE**: Use safe alternatives (JSON.parse, parseInt, switch statements)
3. **TEST**: Verify functionality still works
4. **DOCUMENT**: Update code comments explaining the safe approach

### Reporting Security Issues
1. Create security issue in GitHub with `security` label
2. Tag as `critical` if it affects user data
3. Include proposed remediation
4. Test fix before requesting review

## ✅ COMPLIANCE VERIFICATION

### Before Every Push
- [ ] Run security scan: `node security-qa-analysis.js`
- [ ] No eval() usage anywhere in codebase
- [ ] All user inputs properly validated
- [ ] No sensitive data in localStorage/sessionStorage
- [ ] All external URLs use HTTPS

### Code Review Checklist
- [ ] No forbidden security patterns
- [ ] Input validation present
- [ ] Error handling implemented
- [ ] No hardcoded secrets or credentials
- [ ] Dependency security verified

---

## 🎯 REMEMBER: SECURITY IS NOT OPTIONAL

These rules exist to protect user data and prevent security vulnerabilities. **Every violation is a potential security breach.**

**When in doubt, choose the more secure option.**

---

*Last Updated: July 12, 2025*  
*Next Review: Every major release*