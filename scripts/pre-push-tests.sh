#!/bin/bash

# Pre-push regression test script
# Runs essential tests before allowing push to remote

echo "🧪 Running pre-push regression tests..."
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILED_TESTS=0

# Function to run a test and check result
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -n "Running $test_name... "
    
    if $test_command > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Must run from project root directory${NC}"
    exit 1
fi

# Run critical tests
echo "Running critical tests before push..."
echo ""

# 1. Syntax validation
run_test "Syntax validation" "npm run validate:syntax"

# 2. Main test suite
run_test "Main test suite" "npm test"

# 3. Financial health tests
run_test "Financial health tests" "npm run test:financial-health"

# 4. Security tests
run_test "Security tests" "npm run test:security"

# 5. Version consistency
run_test "Version consistency" "npm run test:version"

# Summary
echo ""
echo "====================================="
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ All pre-push tests passed!${NC}"
    echo "You can safely push your changes."
    exit 0
else
    echo -e "${RED}❌ $FAILED_TESTS test(s) failed!${NC}"
    echo ""
    echo "Please fix the failing tests before pushing."
    echo "To see detailed output, run the failing test commands directly."
    echo ""
    echo "To bypass this check (NOT RECOMMENDED), use:"
    echo "  git push --no-verify"
    exit 1
fi