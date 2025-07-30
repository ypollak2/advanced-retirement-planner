# TICKET-008: Fix Currency Rate Initialization in RSU Components

## Problem Description
The RSU components (EnhancedRSUCompanySelector and PartnerRSUSelector) are showing incorrect currency conversion rates on initial load. The components display "1 USD = ₪1.00 ILS" instead of the correct rate (~3.7 ILS per USD).

## Root Cause Analysis
The issue occurs because:
1. Currency rate state is initialized to `1` instead of `null` or `0`
2. The UI displays this incorrect rate before the actual exchange rate is fetched
3. This creates a confusing user experience showing 1:1 conversion between USD and ILS

## Solution Implementation

### 1. Update EnhancedRSUCompanySelector.js
- Change line 12: `const [currencyRate, setCurrencyRate] = React.useState(null);`
- Add loading state handling for currency rate display
- Ensure proper fallback to API's fallback rates if fetch fails

### 2. Update PartnerRSUSelector.js  
- Change line 15: `const [currencyRate, setCurrencyRate] = React.useState(null);`
- Mirror the same fixes as EnhancedRSUCompanySelector

### 3. Add Proper Loading States
- Show "Loading exchange rate..." when currencyRate is null
- Only display exchange rate after successful fetch
- Use fallback rates from CurrencyAPI if fetch fails

## Testing Checklist
- [ ] Currency rate shows loading state on initial load
- [ ] Correct ILS/USD rate displays after fetch (~3.7)
- [ ] Fallback rates work if API fails
- [ ] Manual price entry still functions correctly
- [ ] Partner RSU selector works identically to main selector

## Why This is a Recurring Issue
This problem keeps happening because:
1. Default state values of `1` seem logical but create incorrect displays
2. The async nature of currency fetching isn't properly handled in UI
3. Components assume currency rate is always available immediately

## Prevention Guidelines
- Always initialize currency rates to `null` not `1`
- Show loading states for async data
- Test components with different currencies on initial load
- Consider extracting currency handling to a shared hook

## Files Modified
1. src/components/shared/EnhancedRSUCompanySelector.js
2. src/components/shared/PartnerRSUSelector.js

## Version
This fix will be deployed in v7.3.4