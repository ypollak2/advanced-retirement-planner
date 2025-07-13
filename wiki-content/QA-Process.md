# QA Process

## Testing Strategy

Our comprehensive testing strategy includes multiple layers to ensure code quality before any production push:

1. **Automated Logic Testing** - Core calculation validation
2. **Manual UI Testing** - User interface and interaction validation  
3. **Cross-browser Testing** - Compatibility validation
4. **Performance Testing** - Speed and memory validation

## Pre-Push QA Requirements

**CRITICAL**: Every push MUST have a full QA cycle completed beforehand.

### 1. Automated Testing

#### Quick Logic Validation
```bash
node quick-qa-test.js
```
Tests core business logic, calculations, and validation rules.

#### Comprehensive Test Suite  
```bash
node comprehensive-qa-test.js
```
Full browser automation testing (when working).

#### Training Fund Specific Tests
```bash
node training-fund-tests.js  
```
Focused testing for training fund functionality.

### 2. Manual Testing

Use the **MANUAL_QA_CHECKLIST.md** for systematic UI validation:
- Form functionality
- Calculation accuracy  
- Display correctness
- Edge cases
- Browser compatibility

### 3. Test Coverage Requirements

- **Logic Tests**: Must achieve 100% pass rate
- **UI Tests**: Must complete all checklist items
- **Browser Tests**: Chrome, Firefox, Safari minimum
- **Performance**: Load time < 3s, calculations < 1s

## Test Execution Order

1. **Security Rules Check**: `./security-check.sh` - Must pass with 0 violations
2. **Logic Validation**: `node quick-qa-test.js` - Must pass 100%
3. **Manual UI Testing**: Complete checklist validation
4. **Browser Testing**: Chrome, Firefox, Safari minimum
5. **Performance**: Validate load times and memory usage
6. **Documentation**: Update and verify accuracy
7. **Final Sign-off**: Get approval before push

### CRITICAL: Security Rules Enforcement

**MANDATORY FIRST STEP**: Every QA cycle MUST start with security rule validation:

```bash
./security-check.sh
```

**ZERO TOLERANCE POLICIES:**
- ❌ **NO eval() usage** - Blocks deployment immediately
- ❌ **NO Function constructor** - Security violation
- ❌ **NO javascript: URLs** - XSS vulnerability
- ❌ **NO sensitive data in localStorage** - Data exposure risk

If security check fails, **STOP immediately** and fix violations before proceeding.

## Test Data

Use standardized test cases from MANUAL_QA_CHECKLIST.md:
- Standard case: ₪15,000 salary
- Above ceiling: ₪25,000 salary  
- No training fund: ₪18,000 salary

## QA Sign-off Process

All of the following must be completed before production push:

- [ ] Automated tests: 100% pass rate
- [ ] Manual UI tests: All checklist items completed
- [ ] Cross-browser: Chrome, Firefox, Safari tested
- [ ] Performance: Metrics within acceptable ranges
- [ ] Documentation: Updated and accurate
- [ ] Code review: Completed and approved

## Emergency Hotfix Process

For critical production issues:
1. Run quick-qa-test.js (minimum requirement)
2. Test specific fix functionality manually
3. Deploy with monitoring
4. Complete full QA post-deployment

## Quality Metrics

- **Target**: 95%+ automated test pass rate
- **Target**: 100% manual checklist completion
- **Target**: Zero critical bugs in production
- **Target**: Load time under 3 seconds

---

*QA process ensures reliable, high-quality releases every time.*