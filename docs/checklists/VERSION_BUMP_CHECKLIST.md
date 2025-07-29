# 🏷️ Complete Version Bump Checklist

## 📋 **MANDATORY CHECKLIST - Never Skip Any Item**

When bumping versions, **ALL** of the following files/patterns must be updated to prevent deployment issues like the footer showing wrong versions.

### **Core Version Files** (Auto-updated by `update-version.js`)
- [ ] `package.json` → `"version": "X.Y.Z"`
- [ ] `version.json` → `"version": "X.Y.Z"`
- [ ] `src/version.js` → `number: "X.Y.Z"` and `commit: "vX.Y.Z-description"`
- [ ] `index.html` → Title tag and ALL cache busting parameters `?v=X.Y.Z`
- [ ] `README.md` → Header title and version badge

### **Service Worker & Caching**
- [ ] `sw.js` → All cache names: `retirement-planner-vX.Y.Z`
- [ ] `src/utils/robustLocalStorage.js` → `version: 'X.Y.Z'` and `'X.Y.Z'` fallbacks

### **Component Fallback Versions** (Critical - Caused Footer Issue)
- [ ] `src/components/core/RetirementPlannerApp.js` → Fallback: `'vX.Y.Z'` (line ~1968)
- [ ] `src/utils/exportFunctions.js` → Metadata: `version: 'vX.Y.Z'`

### **Console Messages & Logging**
- [ ] `src/utils/currencyAPI.js` → `console.log('CurrencyAPI vX.Y.Z loaded successfully')`

### **Header Comments** (22 files - Update as needed)
- [ ] `src/components/core/RetirementPlannerApp.js` → `// Created by Yali Pollak - vX.Y.Z`
- [ ] `src/utils/exportFunctions.js` → Header comment version
- [ ] `src/utils/currencyAPI.js` → Header comment version
- [ ] `src/utils/designEvaluator.js` → Header comment version
- [ ] `src/utils/stressTestScenarios.js` → Header comment version
- [ ] All other component files with version headers

### **Documentation Updates**
- [ ] `CHANGELOG.md` → Add new version section with date and changes
- [ ] Update GitHub Wiki if major changes
- [ ] Update `docs/` files that reference specific versions

### **Testing & Validation**
- [ ] Run `npm test` → Must show 100% pass rate
- [ ] Run `npm run validate:pre-work` → All validations pass
- [ ] Manual check: Footer shows correct version
- [ ] Deployment validation passes

## 🚀 **Automated Process**

### **Step 1: Use the Enhanced Script**
```bash
# This will update core files automatically
node scripts/update-version.js X.Y.Z
```

### **Step 2: Manual Verification**
```bash
# Check that all patterns were caught
grep -r "v6\.8\.2" . --include="*.js" --include="*.json" --include="*.html" --include="*.md"

# Verify no old versions remain
grep -r "v6\.[0-7]\." . --include="*.js" --include="*.json" --include="*.html" --exclude-dir=node_modules
```

### **Step 3: Deploy and Test**
```bash
# Stage deployment
git add -A && git commit -m "Bump version to vX.Y.Z"
git push origin stage

# Test stage deployment - CHECK FOOTER VERSION
npm run test:stage

# Production deployment (only if stage tests pass)
git checkout main && git merge stage && git push origin main
```

## ⚠️ **Critical Patterns That Cause Issues**

### **The Footer Issue (Fixed)**
```javascript
// ❌ WRONG - Causes footer to show v6.5.0
}, window.versionInfo ? `v${window.versionInfo.number}` : 'v6.5.0'),

// ✅ CORRECT - Shows current version v6.8.2
}, window.versionInfo ? `v${window.versionInfo.number}` : 'v6.8.2'),
```

### **Cache Busting Mismatches**
```html
<!-- ❌ WRONG - Prevents users from getting latest version -->
<script src="src/file.js?v=6.7.0"></script>

<!-- ✅ CORRECT - Always matches current version -->
<script src="src/file.js?v=6.8.2"></script>
```

### **Service Worker Cache Names**
```javascript
// ❌ WRONG - Old cache never cleared
const CACHE_NAME = 'retirement-planner-v6.6.4';

// ✅ CORRECT - Cache properly versioned
const CACHE_NAME = 'retirement-planner-v6.8.2';
```

## 🔧 **Enhanced update-version.js Script Requirements**

The script should catch these additional patterns:

```javascript
// Additional patterns to add to update-version.js
{
    file: 'sw.js',
    patterns: [
        { pattern: /retirement-planner-v[0-9.]+/g, replacement: v => `retirement-planner-v${v}` },
        { pattern: /retirement-planner-static-v[0-9.]+/g, replacement: v => `retirement-planner-static-v${v}` },
        { pattern: /retirement-planner-dynamic-v[0-9.]+/g, replacement: v => `retirement-planner-dynamic-v${v}` }
    ]
},
{
    file: 'src/components/core/RetirementPlannerApp.js',
    pattern: /'v[0-9.]+'\)/,
    replacement: v => `'v${v}')`
},
{
    file: 'src/utils/exportFunctions.js',
    pattern: /version: 'v[0-9.]+'/,
    replacement: v => `version: 'v${v}'`
}
```

## 📊 **Version Consistency Verification**

Always run this after version bumps:

```bash
echo "🏷️ Version Consistency Check"
echo "package.json: $(grep -o '"version": "[^"]*"' package.json)"
echo "version.json: $(grep -o '"version": "[^"]*"' version.json)"  
echo "src/version.js: $(grep -o 'number: "[^"]*"' src/version.js)"
echo "index.html title: $(grep -o '<title>[^<]*v[0-9.]*[^<]*</title>' index.html)"
echo "Footer fallback: $(grep -o "'v[0-9.]*')" src/components/core/RetirementPlannerApp.js)"

# Should all show same version!
```

## 🎯 **Success Criteria**

✅ All version references match current version  
✅ Footer displays correct version (not v6.5.0!)  
✅ Cache busting parameters all match  
✅ Service worker cache names updated  
✅ All tests pass (100% required)  
✅ Deployment validation passes  
✅ No old version references found in grep search  

## 🚨 **Emergency Recovery**

If you find version mismatches after deployment:

```bash
# Quick fix for critical issues
find . -name "*.js" -type f -exec sed -i '' 's/v6\.5\.0/v6.8.2/g' {} \;
find . -name "*.js" -type f -exec sed -i '' 's/v6\.6\.4/v6.8.2/g' {} \;

# Then run proper version bump process
node scripts/update-version.js 6.8.2
```

---

**Last Updated**: v6.8.2 - July 28, 2025  
**Created By**: Yali Pollak (יהלי פולק)  
**Critical Issue Resolved**: Footer version mismatch (v6.5.0 → v6.8.2)