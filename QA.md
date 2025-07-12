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

1. Run `node quick-qa-test.js` - Must pass 100%
2. Complete manual UI testing checklist
3. Test in multiple browsers
4. Validate performance metrics
5. Document results
6. Get sign-off before push

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