#!/bin/bash

# 🚀 v7.2.0 Deployment Verification Script
# Verifies that Financial Health Score System Repair is live

echo "🔍 VERIFYING v7.2.0 DEPLOYMENT - Financial Health Score System Repair"
echo "=================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

URL="https://ypollak2.github.io/advanced-retirement-planner"

echo -e "\n📡 Checking deployment at: ${BLUE}${URL}${NC}"

# Check if site is accessible
echo -e "\n1️⃣ Testing site accessibility..."
HTTP_STATUS=$(curl -s -L -o /dev/null -w "%{http_code}" "$URL")
if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "   ✅ Site is accessible (HTTP $HTTP_STATUS)"
else
    echo -e "   ⚠️  Site status: HTTP $HTTP_STATUS (may still be propagating)"
fi

# Check version in title
echo -e "\n2️⃣ Checking version in page title..."
TITLE_VERSION=$(curl -s -L "$URL" | grep -o '<title>Advanced Retirement Planner v[^<]*</title>' | grep -o 'v[0-9.]*')
if [ "$TITLE_VERSION" = "v7.2.0" ]; then
    echo -e "   ✅ Title shows correct version: $TITLE_VERSION"
else
    echo -e "   ⚠️  Title version: $TITLE_VERSION (may still be propagating)"
fi

# Check cache busting parameters
echo -e "\n3️⃣ Checking cache busting parameters..."
CACHE_COUNT=$(curl -s -L "$URL" | grep -c "v=7.2.0")
if [ "$CACHE_COUNT" -gt "50" ]; then
    echo -e "   ✅ Cache busting updated ($CACHE_COUNT occurrences of v=7.2.0)"
else
    echo -e "   ⚠️  Cache busting may need propagation ($CACHE_COUNT occurrences)"
fi

# Check for Financial Health Debug Panel
echo -e "\n4️⃣ Checking for Financial Health Debug Panel..."
DEBUG_PANEL=$(curl -s -L "$URL" | grep -c "FinancialHealthDebugPanel")
if [ "$DEBUG_PANEL" -gt "0" ]; then
    echo -e "   ✅ Debug Panel component loaded ($DEBUG_PANEL references)"
else
    echo -e "   ❌ Debug Panel not found - may indicate deployment issue"
fi

# Check for enhanced Financial Health Score
echo -e "\n5️⃣ Checking for enhanced Financial Health Score..."
ENHANCED_SCORE=$(curl -s -L "$URL" | grep -c "FinancialHealthScoreEnhanced")
if [ "$ENHANCED_SCORE" -gt "0" ]; then
    echo -e "   ✅ Enhanced Financial Health Score loaded ($ENHANCED_SCORE references)"
else
    echo -e "   ❌ Enhanced Score component not found"
fi

# Check for validation page
echo -e "\n6️⃣ Checking validation interface..."
VALIDATION_URL="${URL}/validate-v7.2.0-features.html"
VALIDATION_STATUS=$(curl -s -L -o /dev/null -w "%{http_code}" "$VALIDATION_URL")
if [ "$VALIDATION_STATUS" = "200" ]; then
    echo -e "   ✅ Validation interface available: ${BLUE}${VALIDATION_URL}${NC}"
else
    echo -e "   ⚠️  Validation interface not yet available (HTTP $VALIDATION_STATUS)"
fi

echo -e "\n📊 DEPLOYMENT VERIFICATION SUMMARY"
echo "=================================="

if [ "$TITLE_VERSION" = "v7.2.0" ] && [ "$CACHE_COUNT" -gt "50" ] && [ "$DEBUG_PANEL" -gt "0" ]; then
    echo -e "${GREEN}✅ DEPLOYMENT VERIFIED SUCCESSFULLY!${NC}"
    echo -e "   🎉 Financial Health Score v7.2.0 is live and ready"
    echo -e "   🔧 Debug tools are available"
    echo -e "   📊 Validation interface: ${VALIDATION_URL}"
    echo ""
    echo -e "📋 ${YELLOW}MANUAL VERIFICATION STEPS:${NC}"
    echo -e "   1. Visit: ${URL}"
    echo -e "   2. Complete the wizard with sample data"
    echo -e "   3. Verify Financial Health Score shows non-zero values"
    echo -e "   4. Test real-time updates by changing inputs"
    echo -e "   5. Click 🔧 Debug Panel button to test diagnostic tools"
    echo -e "   6. Run validation suite: ${VALIDATION_URL}"
elif [ "$TITLE_VERSION" != "v7.2.0" ] || [ "$CACHE_COUNT" -lt "50" ]; then
    echo -e "${YELLOW}⏳ DEPLOYMENT PROPAGATING...${NC}"
    echo -e "   🔄 GitHub Pages is still updating (typical: 5-15 minutes)"
    echo -e "   📊 Current title version: $TITLE_VERSION"
    echo -e "   🗂️  Cache parameters updated: $CACHE_COUNT/95+"
    echo ""
    echo -e "💡 ${BLUE}Run this script again in 5-10 minutes${NC}"
    echo -e "   Or check manually: ${URL}"
else
    echo -e "${RED}❌ DEPLOYMENT ISSUES DETECTED${NC}"
    echo -e "   🔍 Manual investigation required"
    echo -e "   📞 Check GitHub Actions for deployment status"
fi

echo -e "\n🔗 USEFUL LINKS:"
echo -e "   📱 Main App: ${URL}"
echo -e "   🧪 Validation: ${VALIDATION_URL}"
echo -e "   📊 GitHub: https://github.com/ypollak2/advanced-retirement-planner"
echo -e "   📋 Issues: https://github.com/ypollak2/advanced-retirement-planner/issues"

echo -e "\n🏁 Verification complete!"