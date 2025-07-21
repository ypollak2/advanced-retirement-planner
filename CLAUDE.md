# Claude Code Development Standards for Advanced Retirement Planner

## CRITICAL REQUIREMENT: Pre-Release QA Checkpoint

**⚠️ MANDATORY: Every release MUST pass the Pre-Release QA Checkpoint**

```bash
npm run qa:pre-release
```

This is the **MANDATORY CHECKPOINT** before every release that validates:
- 🛡️ **Security**: No critical vulnerabilities, XSS protection, CSP policy
- 🧪 **Functionality**: All tests pass (100% required)
- 📝 **Syntax**: All JavaScript files valid
- 🏷️ **Version Consistency**: All 6 files have matching versions
- 💼 **Business Logic**: Calculations, inflation, contributions
- ⚡ **Performance**: File sizes within limits

**EXIT CODES:**
- **0**: ✅ APPROVED FOR RELEASE - All critical checks passed
- **1**: ❌ BLOCKED FOR RELEASE - Critical issues found

**Files that MUST have consistent versions:**
1. `version.json` - `"version": "X.X.X"`
2. `package.json` - `"version": "X.X.X"`
3. `src/version.js` - `number: "X.X.X"`
4. `index.html` - `Advanced Retirement Planner vX.X.X`
5. `README.md` - `# 🚀 Advanced Retirement Planner vX.X.X`

**Report Generation:**
- Detailed JSON report: `pre-release-qa-report.json`
- Real-time console output with pass/fail status
- Critical and high-priority issue categorization

## CRITICAL SECURITY RULE: No eval() or Function() Usage

**⚠️ MANDATORY: Zero tolerance for dynamic code execution**

```bash
npm run security:check
```

**FORBIDDEN PATTERNS:**
- `eval()` - Dynamic code execution vulnerability
- `Function()` - Constructor-based code injection risk  
- `document.write()` - XSS vulnerability vector

**SECURITY SCANNING:**
- External scanners must not detect ANY eval/Function references
- Security analysis files must use obfuscated patterns to avoid false positives
- All source code must pass: `npm run security:check` (exit code 0)

**ENFORCEMENT:**
- Any PR with eval/Function usage will be BLOCKED
- Security scan failures prevent deployment
- Version bumps required for security pattern fixes

## Mandatory Pre-Work Validation Protocol

**ALWAYS run before making ANY code changes:**

```bash
npm run validate:pre-work
```

This command ensures:
- ✅ All JavaScript files have valid syntax
- ✅ No browser compatibility issues
- ✅ All 116 tests pass
- ✅ System is ready for development

## Real-Time Validation Workflow

### Before Editing Files:
```bash
# Validate specific file before editing
node -c src/components/ComponentName.js
```

### After Editing Files:
```bash
# Validate the edited file immediately
node -c src/components/ComponentName.js

# Quick validation of all changes
npm run validate:quick
```

## Validation Commands Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run validate:pre-work` | Complete pre-work validation | Before starting any coding session |
| `npm run validate:quick` | Fast syntax + browser + orphans | After making changes |
| `npm run validate:syntax` | JavaScript syntax only | Quick syntax verification |
| `npm run validate:browser` | Browser compatibility | Check ES6/module issues |
| `npm run validate:orphans` | Orphaned code detection | Find broken code patterns |
| `npm run qa:syntax` | Full enhanced QA | Complete validation suite |
| `npm test` | Functionality tests | Verify application works |

### **NEW: Granular Validation Modes (Phase 2)**

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run validate:dev` | Development mode validation | During active development |
| `npm run validate:file` | Single file validation | After editing specific files |
| `npm run validate:granular` | Quick granular checks | Fast development feedback |
| `npm run validate:syntax-only` | Pure syntax validation | Ultra-fast syntax checks |

### **Advanced Validation Modes**

```bash
# Single file validation
node scripts/pre-commit-enhanced.js file src/components/ComponentName.js

# Development mode (syntax + browser + orphans)
node scripts/pre-commit-enhanced.js development

# Syntax only mode (fastest)
node scripts/pre-commit-enhanced.js syntax-only

# Quick mode (essential checks)
node scripts/pre-commit-enhanced.js quick

# Full validation (all checks)
node scripts/pre-commit-enhanced.js full
```

### **Development File Watcher (Phase 2)**

For continuous development with real-time validation:

```bash
# Start development watcher (validates files as you edit them)
npm run dev:watch
```

Features:
- **Real-time validation** as files change
- **Debounced validation** (1-second delay to avoid spam)
- **Color-coded output** for quick visual feedback
- **Statistics tracking** (success rate, total validations)
- **Browser compatibility checks** for component files
- **Graceful error handling** and auto-restart

Use this during active development for immediate feedback on syntax and compatibility issues.

### **Test-Driven Development Workflow (Phase 2)**

```bash
# Generate test for new feature
npm run test:generate:feature "feature-name" "ComponentName"

# Generate regression test for bug fix  
npm run test:generate:regression "bug-description" "filename"

# Run generated tests
node tests/feature-name-test.js
node tests/regression-bug-description-test.js
```

### **Pre-Push Validation (Phase 2)**

**Before every push, run:**
```bash
npm run validate:pre-push
```

This validates:
- ✅ Version consistency across all files
- ✅ Documentation updates (README, CLAUDE.md)
- ✅ Complete QA test suite (100% pass required)
- ✅ Git status and branch validation
- ✅ Pre-push checklist compliance

**Only push if validation passes 100%!**

## CRITICAL REQUIREMENT: Test-After-Implementation

**⚠️ MANDATORY: Every fix or new feature MUST get tests added to the QA process afterward**

This means:
1. **Implement the fix/feature**
2. **Write tests** to verify the fix/feature works correctly  
3. **Add regression tests** to prevent the issue from reoccurring
4. **Update QA process** to include the new test coverage

**Never consider a task complete without adding appropriate tests!**

## CRITICAL REQUIREMENT: Version Consistency

**⚠️ MANDATORY: ALL version numbers MUST be consistent across all files:**

### Version Files That Must Match:
- **version.json** → `"version": "X.Y.Z"`
- **package.json** → `"version": "X.Y.Z"`
- **src/version.js** → `number: "X.Y.Z"`
- **index.html** → `<title>Advanced Retirement Planner vX.Y.Z</title>`
- **index.html** → `window.APP_VERSION = 'X.Y.Z'` (fallback)
- **README.md** → `# 🚀 Advanced Retirement Planner vX.Y.Z ✨`

### Automated Version Consistency Check:
```bash
# Version consistency is automatically tested
npm test  # Includes version consistency validation
```

### Manual Version Consistency Check:
```bash
echo "🏷️ Checking Version Consistency"
echo "version.json: $(grep -o '"version": "[^"]*"' version.json | head -1)"
echo "package.json: $(grep -o '"version": "[^"]*"' package.json | head -1)"
echo "src/version.js: $(grep -o 'number: "[^"]*"' src/version.js | head -1)"
echo "index.html title: $(grep -o '<title>[^<]*v[0-9.]*[^<]*</title>' index.html)"
echo "README.md: $(grep -o '# 🚀 Advanced Retirement Planner v[0-9.]*' README.md | head -1)"
```

**NEVER commit if versions don't match across ALL files!**

## CRITICAL REQUIREMENT: Pre-Push Protocol

**⚠️ MANDATORY: Every push MUST follow this exact sequence:**

1. **Version bump** (package.json, version.json, src/version.js, index.html)
2. **Update README** and related documentation
3. **Full QA testing** - ALL tests must pass 100%
4. **Only if 100% pass** → then push

**Never push without completing ALL steps in order!**

## Mandatory Workflow Steps

### 1. Session Start Protocol
```bash
# Check git status
git status

# Validate current state
npm run validate:pre-work

# Result: ✅ Ready to start coding
```

### 2. File Editing Protocol
```bash
# Before editing
node -c [filename]

# Make changes using Edit/MultiEdit tools

# Immediately after editing
node -c [filename]

# If multiple files changed
npm run validate:quick
```

### 3. Pre-Commit Protocol
```bash
# Before suggesting commits
npm run qa:syntax
npm test
npm run qa:deployment
```

## Error Prevention Patterns

### Common Issues to Watch For:
1. **Orphaned React.createElement calls** - Missing parent elements
2. **ES6 modules in browser files** - Use window.ComponentName instead
3. **Missing function declarations** - Orphaned try-catch blocks
4. **Syntax errors in large files** - Always validate after editing

### Quick Fixes:
- **Syntax Error**: Run `node -c filename` to identify exact line
- **Orphaned Code**: Check for incomplete React.createElement structures
- **Browser Issues**: Avoid `export default` in browser-loaded files

## Project-Specific Knowledge

### Architecture Notes:
- Uses React.createElement (not JSX)
- Components exported to window for browser access
- Service worker at /sw.js for offline functionality
- Multi-layer caching: memory + localStorage + service worker

### Critical Files:
- `src/components/Dashboard.js` - Main dashboard (watch for orphaned Quick Actions)
- `src/components/RetirementPlannerApp.js` - Main app component
- `src/utils/retirementCalculations.js` - Core calculations
- `tests/runtime-test.js` - Runtime browser tests (watch for orphaned try blocks)

### Known Patterns:
- React.createElement chains can create orphaned code
- Partner data requires null checks for country property
- Version consistency across: package.json, version.json, src/version.js, index.html

## Success Metrics

### Immediate Goals:
- ✅ Zero syntax errors in commits
- ✅ 100% test pass rate before deployment
- ✅ Sub-30 second validation cycles

### Validation Results (as of v6.2.0):
- JavaScript files: 67 files ✅ syntax validated
- Test suite: 116/116 tests passing ✅
- Deployment: Both GitHub Pages & Netlify operational ✅
- Service worker: Functional ✅

## Emergency Protocols

### If Validation Fails:
1. **Don't proceed with changes**
2. Fix validation errors first
3. Re-run validation
4. Only continue when all checks pass

### If Tests Fail:
1. **Don't suggest commits/deployments**
2. Identify failing test
3. Fix underlying issue
4. Re-run full test suite
5. Confirm 100% pass rate

## Active Development Todo List

### Current Session Tasks
| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| fix-countryrates-error | Fix 'countryRates is not defined' error in WizardStepContributions.js:837 | ✅ completed | high | Fixed scope issue in export functions |
| fix-cors-errors | Fix CORS policy errors for Yahoo Finance API stock price fetching | ✅ completed | medium | Disabled external API calls, using fallback prices only |
| fix-service-worker-caching | Fix service worker stock price caching failures due to CORS issues | ✅ completed | medium | Modified SW to cache fallback data instead of external APIs |
| update-claude-md-todos | Add todo list tracking system to CLAUDE.md for status management | ✅ completed | medium | Todo tracking system implemented in CLAUDE.md |
| fix-step4-duplications | Fix duplications in Wizard Step 4 (Contributions page) | 📋 pending | high | Remove duplicate elements and clean up UI |
| fix-training-fund-rules | Fix training fund calculation rules for Israeli threshold (15792 ILS) with correct 2.5%/7.5% split | 📋 pending | high | Update threshold value and calculation logic |
| change-returns-to-yield | Change 'returns' terminology to '%yield' in Step 5 | 📋 pending | medium | Update WizardStepFees.js terminology |
| create-step6-inheritance | Create Step 6 - Inheritance Planning (single/couple for ISR/UK/US/EU) | 📋 pending | high | Design and implement inheritance planning step |
| create-step7-taxes | Create Step 7 - Tax Planning & Optimization (country-specific) | 📋 pending | high | Design and implement tax optimization step |
| create-step8-review | Create Step 8 - Final Review & Summary (comprehensive plan review) | 📋 pending | high | Design and implement final review step |

### Wizard Steps Enhancement Plan

#### Step 6: Inheritance Planning (WizardStepInheritance.js)
**Scope**: Comprehensive inheritance and estate planning for different countries and relationship statuses

**Features by Country:**
- **Israel (ISR)**: 
  - Inheritance tax exemptions (spouse: unlimited, children: ₪2.5M each)
  - Pension fund survivor benefits calculation
  - Property transfer considerations
  - Life insurance recommendations
- **United Kingdom (UK)**:
  - Inheritance Tax (40% over £325k, spouse exempt)
  - Pension death benefits (25% tax-free lump sum)
  - Joint ownership vs. individual ownership
- **United States (US)**:
  - Federal estate tax exemption ($12.92M per person)
  - State inheritance taxes
  - 401(k)/IRA beneficiary designations
  - Trust planning recommendations
- **European Union (EU)**:
  - Country-specific inheritance laws
  - Cross-border inheritance complications
  - EU succession regulations

**Single vs. Couple Planning:**
- Single: Focus on beneficiary designations, charitable giving, tax-efficient wealth transfer
- Couple: Spousal exemptions, joint ownership, survivor benefit optimization

#### Step 7: Tax Planning & Optimization (WizardStepTaxes.js)
**Scope**: Country-specific tax optimization strategies for retirement planning

**Tax Optimization Areas:**
- **Contribution Optimization**: 
  - Max tax-deductible contributions by country
  - Roth vs. traditional retirement accounts
  - Training fund tax benefits (Israel)
- **Withdrawal Strategies**:
  - Tax-efficient retirement income sequencing
  - Capital gains vs. income tax optimization
  - Currency conversion tax implications
- **International Tax Considerations**:
  - Double taxation treaties
  - Foreign pension reporting requirements
  - Tax residency planning

**Country-Specific Features:**
- Israel: Training fund vs. pension tax benefits, capital gains exemptions
- UK: ISA vs. pension contributions, basic vs. higher rate tax planning
- US: 401(k) vs. Roth IRA optimization, Required Minimum Distributions
- EU: Pillar 2 vs. Pillar 3 contributions, cross-border tax implications

#### Step 8: Final Review & Summary (WizardStepReview.js)
**Scope**: Comprehensive plan review and actionable recommendations

**Review Sections:**
1. **Financial Health Score** (0-100 scale)
   - Savings rate adequacy
   - Retirement readiness assessment
   - Risk profile alignment
   - Tax efficiency rating

2. **Scenario Analysis**:
   - Best case, worst case, realistic projections
   - Stress testing (market crashes, inflation spikes)
   - Early retirement feasibility
   - Late career income changes

3. **Actionable Recommendations**:
   - Immediate actions (next 30 days)
   - Short-term goals (6-12 months)
   - Long-term strategy (5+ years)
   - Regular review schedule

4. **Country-Specific Action Items**:
   - Regulatory compliance checklist
   - Optimal contribution timing
   - Tax planning deadlines
   - Professional advisor recommendations

**Interactive Features:**
- Download PDF summary
- Email plan to advisors
- Calendar integration for review dates
- Progress tracking dashboard

### Task Management Protocol
**All development tasks MUST be tracked in this todo list:**

1. **Create todos** at session start for complex/multi-step tasks
2. **Update status** in real-time: pending → in_progress → completed  
3. **Mark completed** immediately when tasks finish
4. **Add notes** for important context or blockers
5. **Update CLAUDE.md** with current todo status after each session

### Status Legend
- 📋 **pending**: Not yet started
- 🔄 **in_progress**: Currently working on
- ✅ **completed**: Finished successfully
- ❌ **blocked**: Cannot proceed due to external factors
- ⏸️ **paused**: Temporarily suspended

## Input Validation and XSS Protection

**⚠️ MANDATORY: All user inputs MUST be validated and sanitized**

```javascript
// Use InputValidation utility for all user inputs
const result = InputValidation.validateAge(userAge);
if (result.valid) {
    setInputs({...inputs, age: result.value});
}

// Use SecureInput component for form fields
React.createElement(SecureInput, {
    validation: 'currency',
    value: inputs.salary,
    onChange: (e) => setInputs({...inputs, salary: e.target.value}),
    validationOptions: { max: 1000000 }
})
```

**VALIDATION TYPES:**
- `age` - 18-120 years
- `currency` - Positive numbers with 2 decimals
- `percentage` - 0-100 with decimals
- `email` - Valid email format
- `string` - XSS protected text

**SECURITY REQUIREMENTS:**
- Strip all HTML tags from text inputs
- Escape HTML entities before display
- Validate numeric ranges and bounds
- Protect against SQL injection patterns
- Use debounced validation for performance

---

**Last Updated**: v6.4.1 - July 21, 2025
**Validation System**: Enhanced pre-commit QA + Input validation
**Security**: Comprehensive XSS protection implemented
**Status**: All systems operational ✅