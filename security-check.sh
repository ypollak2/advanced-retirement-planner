#!/bin/bash

# Security Check Script - Enforce Security Rules
# This script enforces the security rules defined in SECURITY_RULES.md

echo "🛡️  Security Rules Enforcement Check"
echo "======================================"

# Initialize counters
VIOLATIONS=0
WARNINGS=0

# Function to report violation
report_violation() {
    echo "🚨 CRITICAL VIOLATION: $1"
    VIOLATIONS=$((VIOLATIONS + 1))
}

# Function to report warning
report_warning() {
    echo "⚠️  WARNING: $1"
    WARNINGS=$((WARNINGS + 1))
}

# Function to report success
report_success() {
    echo "✅ PASS: $1"
}

# CRITICAL RULE 1: NO eval() USAGE (ZERO TOLERANCE)
echo ""
echo "🔍 Rule 1: Checking for eval() usage (FORBIDDEN)..."
if grep -r "eval(" --include="*.html" --include="*.js" src/ index*.html 2>/dev/null | grep -v "/\*\|//\|console.log"; then
    report_violation "eval() usage detected in source code"
    echo "   📖 See SECURITY_RULES.md for safe alternatives"
    echo "   🔧 Use: JSON.parse(), parseInt(), parseFloat(), switch statements"
else
    report_success "No eval() usage found in source code"
fi

# RULE 2: NO Function Constructor
echo ""
echo "🔍 Rule 2: Checking for Function constructor usage..."
if grep -r "new Function\|Function(" --include="*.html" --include="*.js" src/ index*.html 2>/dev/null | grep -v "/\*\|//"; then
    report_violation "Function constructor usage detected"
    echo "   🔧 Use predefined functions instead"
else
    report_success "No Function constructor usage found"
fi

# RULE 3: NO javascript: URLs
echo ""
echo "🔍 Rule 3: Checking for javascript: URLs..."
if grep -r "javascript:" --include="*.html" --include="*.js" src/ index*.html 2>/dev/null; then
    report_violation "javascript: URLs detected"
    echo "   🔧 Use event handlers instead"
else
    report_success "No javascript: URLs found"
fi

# RULE 4: Safe innerHTML patterns
echo ""
echo "🔍 Rule 4: Checking for unsafe innerHTML usage..."
if grep -r "innerHTML.*\+\|innerHTML.*\$\|innerHTML.*inputs\." --include="*.js" src/ 2>/dev/null; then
    report_warning "Potentially unsafe innerHTML usage detected"
    echo "   🔧 Verify user input is sanitized or use textContent"
else
    report_success "innerHTML usage appears safe"
fi

# RULE 5: No hardcoded secrets
echo ""
echo "🔍 Rule 5: Checking for hardcoded secrets..."
if grep -r -i "password.*=\|api[_-]key.*=\|secret.*=\|token.*=" --include="*.js" src/ 2>/dev/null | grep -v "// Example\|/\*\|YOUR_API_KEY\|placeholder"; then
    report_violation "Potential hardcoded secrets detected"
    echo "   🔧 Use environment variables or configuration files"
else
    report_success "No hardcoded secrets detected"
fi

# RULE 6: Secure localStorage usage
echo ""
echo "🔍 Rule 6: Checking localStorage/sessionStorage usage..."
if grep -r "localStorage.*password\|sessionStorage.*password\|localStorage.*token\|sessionStorage.*token" --include="*.js" src/ 2>/dev/null; then
    report_violation "Sensitive data in localStorage/sessionStorage detected"
    echo "   🔧 Only store non-sensitive UI preferences"
else
    report_success "localStorage/sessionStorage usage appears safe"
fi

# Summary
echo ""
echo "======================================"
echo "📊 Security Check Summary"
echo "======================================"
echo "🚨 Critical Violations: $VIOLATIONS"
echo "⚠️  Warnings: $WARNINGS"

if [ $VIOLATIONS -gt 0 ]; then
    echo ""
    echo "❌ SECURITY CHECK FAILED"
    echo "🔧 Fix all critical violations before proceeding"
    echo "📖 See SECURITY_RULES.md for detailed guidance"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo ""
    echo "⚠️  SECURITY CHECK PASSED WITH WARNINGS"
    echo "💡 Consider addressing warnings for improved security"
    exit 0
else
    echo ""
    echo "✅ SECURITY CHECK PASSED"
    echo "🛡️  All security rules compliant"
    exit 0
fi