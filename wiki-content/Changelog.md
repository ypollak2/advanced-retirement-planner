# Changelog

All notable changes to the Advanced Retirement Planner project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.6.0] - 2025-07-12

### Added - Israeli Training Fund Enhancement
- **Accurate Training Fund Calculations**: Implemented proper Israeli training fund logic with 2.5% employee + 7.5% employer contribution rates (10% total)
- **Ceiling Enforcement**: Added ₪15,972 monthly salary ceiling per Israeli law
- **Above Ceiling Option**: New checkbox to allow contributions on full salary with tax implications
- **Disable Training Fund**: Option to completely exclude training fund from calculations
- **Comprehensive QA Process**: Established mandatory pre-push QA with automated and manual testing

### Fixed - Calculation Accuracy
- **Accumulated Savings**: Corrected future value calculations to properly apply fees to training fund contributions
- **Precision Improvements**: Enhanced compound interest calculations with better handling of zero interest rates
- **Calculation Consistency**: Fixed fee application to ensure consistent treatment across pension and training fund

### Added - Quality Assurance
- **Automated Testing**: Created comprehensive test suite with 100% pass rate (10/10 tests)
- **Manual Testing**: Systematic UI validation checklist for thorough testing
- **Test Files**: 
  - `quick-qa-test.js` - Fast logic validation
  - `training-fund-tests.js` - Comprehensive training fund testing
  - `comprehensive-qa-test.js` - Full browser automation suite
  - `MANUAL_QA_CHECKLIST.md` - UI testing checklist
- **QA Documentation**: Updated QA.md with complete testing process

### Changed - Documentation
- **README**: Updated to reflect v4.6.0 features and 100% test coverage
- **Version**: Incremented to 4.6.0 with comprehensive description
- **Badges**: Updated test coverage badge to reflect 100% success rate

### Technical
- **Logic Validation**: All core training fund calculations mathematically verified
- **Edge Cases**: Robust handling of zero salary, maximum values, and decimal inputs
- **Integration**: Seamless integration with existing retirement savings calculations
- **Backward Compatibility**: No breaking changes to existing functionality

## [4.3.0] - Previous Release

### Added - UI Visibility & Export Fixes
- Enhanced CSS with better contrast and text shadows for maximum visibility
- Strengthened button styling with bold fonts and improved shadows
- Fixed PNG export functionality with better error handling and data validation
- Enhanced AI-compatible JSON export with proper error messages
- Improved Chart.js integration with better error handling and debugging

### Added - Enhanced Sidebar & Analysis
- Bottom Line Summary with prominent key metrics display
- Dynamic LLM Recommendations with real-time AI analysis
- Enhanced Financial Forecast with better visualization
- Improved Color Visibility with high contrast design for better accessibility

## [4.2.2] - Previous Release

### Fixed
- Resolved persistent initialization issues by refactoring application loading logic
- Ensured ErrorBoundary component functions correctly within test environment

---

## QA Requirements

Starting with v4.6.0, all releases must pass:

1. **Automated Tests**: 100% pass rate required
2. **Manual UI Testing**: Complete checklist validation
3. **Cross-browser Testing**: Chrome, Firefox, Safari minimum
4. **Performance Validation**: Load time <3s, calculations <1s
5. **Documentation Updates**: README, CHANGELOG, version.json

## Migration Notes

### For v4.6.0 Users
- Training fund calculations are now more accurate and comply with Israeli law
- New UI checkboxes provide more control over training fund contributions
- No breaking changes to existing saved calculations or user data
- Enhanced QA process ensures higher reliability

### For Developers
- New test files provide comprehensive validation framework
- QA process documentation in QA.md must be followed for all future releases
- Manual testing checklist ensures systematic UI validation
- Automated tests provide safety net for core logic changes