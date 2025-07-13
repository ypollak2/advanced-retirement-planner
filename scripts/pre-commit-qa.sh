#!/bin/bash

# Pre-commit QA Hook for Advanced Retirement Planner
# This script runs automatically before each commit to ensure code quality

echo "🧪 Running Pre-commit QA Checks..."
echo "=================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $message"
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ FAIL${NC}: $message"
        return 1
    elif [ "$status" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  WARN${NC}: $message"
    else
        echo -e "${BLUE}ℹ️  INFO${NC}: $message"
    fi
}

# Track if any tests failed
TESTS_FAILED=0

echo ""
echo "🔍 Step 1: Running Comprehensive Test Suite"
echo "----------------------------------------"

if npm test > /dev/null 2>&1; then
    print_status "PASS" "All QA tests passed"
else
    print_status "FAIL" "QA tests failed - run 'npm test' to see details"
    TESTS_FAILED=1
fi

echo ""
echo "🛡️ Step 2: Security Analysis"
echo "----------------------------"

# Run security analysis (allow warnings but fail on errors)
if node tests/security-qa-analysis.js > /dev/null 2>&1; then
    print_status "PASS" "Security analysis completed"
else
    # Check if it's just warnings or actual errors
    if node tests/security-qa-analysis.js 2>&1 | grep -q "FAIL"; then
        print_status "FAIL" "Security vulnerabilities detected"
        TESTS_FAILED=1
    else
        print_status "WARN" "Security analysis completed with warnings"
    fi
fi

echo ""
echo "📏 Step 3: File Size Analysis"
echo "-----------------------------"

# Check file sizes
INDEX_SIZE=$(stat -f%z index.html 2>/dev/null || stat -c%s index.html 2>/dev/null)
APP_SIZE=$(stat -f%z src/core/app-main.js 2>/dev/null || stat -c%s src/core/app-main.js 2>/dev/null)

if [ $INDEX_SIZE -lt 60000 ]; then
    print_status "PASS" "index.html size: $((INDEX_SIZE/1024))KB (optimal)"
else
    print_status "WARN" "index.html size: $((INDEX_SIZE/1024))KB (large)"
fi

if [ $APP_SIZE -lt 200000 ]; then
    print_status "PASS" "app-main.js size: $((APP_SIZE/1024))KB (optimal)"
else
    print_status "WARN" "app-main.js size: $((APP_SIZE/1024))KB (large)"
fi

echo ""
echo "🏷️ Step 4: Version Consistency Check"
echo "-----------------------------------"

# Check version consistency
PACKAGE_VERSION=$(node -p "require('./package.json').version" 2>/dev/null)
VERSION_JS=$(node -p "require('./version.js').full" 2>/dev/null)

if [ "$PACKAGE_VERSION" = "$VERSION_JS" ]; then
    print_status "PASS" "Version consistency verified ($PACKAGE_VERSION)"
else
    print_status "FAIL" "Version mismatch: package.json($PACKAGE_VERSION) vs version.js($VERSION_JS)"
    TESTS_FAILED=1
fi

echo ""
echo "🌐 Step 5: Essential Dependencies Check"
echo "-------------------------------------"

# Check for essential dependencies in HTML
if grep -q "React" index.html && grep -q "Chart.js" index.html; then
    print_status "PASS" "Essential dependencies found in HTML"
else
    print_status "FAIL" "Missing essential dependencies in HTML"
    TESTS_FAILED=1
fi

# Check for cache-busting parameters
if grep -q "?v=" index.html || grep -q "?emergency=" index.html; then
    print_status "PASS" "Cache-busting parameters detected"
else
    print_status "WARN" "No cache-busting parameters found"
fi

echo ""
echo "🔧 Step 6: File Structure Validation"
echo "-----------------------------------"

# Check for required files
REQUIRED_FILES=(
    "src/core/app-main.js"
    "src/utils/currencyExchange.js"
    "src/utils/pensionCalculations.js"
    "src/utils/rsuCalculations.js"
    "src/styles/main.css"
    "version.js"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    print_status "PASS" "All required files present"
else
    print_status "FAIL" "Missing files: ${MISSING_FILES[*]}"
    TESTS_FAILED=1
fi

echo ""
echo "📊 Pre-commit QA Summary"
echo "======================="

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL QA CHECKS PASSED!${NC}"
    echo -e "${GREEN}✅ Ready for commit${NC}"
    echo ""
    echo "📋 Summary:"
    echo "  • Test Suite: ✅ Passed"
    echo "  • Security: ✅ Validated"
    echo "  • File Sizes: ✅ Optimal"
    echo "  • Versions: ✅ Consistent"
    echo "  • Dependencies: ✅ Available"
    echo "  • File Structure: ✅ Complete"
    echo ""
    exit 0
else
    echo -e "${RED}❌ QA CHECKS FAILED!${NC}"
    echo -e "${RED}Please fix the issues above before committing${NC}"
    echo ""
    echo "🔧 Quick fixes:"
    echo "  • Run: npm test (for detailed test results)"
    echo "  • Check: version consistency in package.json and version.js"
    echo "  • Verify: all required files are present"
    echo "  • Review: security analysis output"
    echo ""
    exit 1
fi