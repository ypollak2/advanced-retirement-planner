# Production E2E Test Suite

Comprehensive end-to-end testing for the Advanced Retirement Planner production deployment on GitHub Pages.

## 🎯 Overview

This test suite monitors the production environment at `https://ypollak2.github.io/advanced-retirement-planner/` to detect:

- Console errors and JavaScript issues
- User flow problems and UI failures  
- API connectivity and performance issues
- Cross-browser compatibility problems
- Network-related failures

## 🏗️ Architecture

### Core Components

1. **Production E2E Runner** (`production-e2e-runner.html`)
   - Self-contained HTML test runner
   - Real-time console error monitoring
   - Comprehensive test execution and reporting
   - Downloadable JSON reports

2. **Console Monitor** (`console-monitor.js`)
   - Advanced error categorization
   - Performance tracking
   - Memory leak detection
   - Alert system for critical issues

3. **Test Scenarios** (`production-scenarios.js`)
   - Critical user flow validation
   - Form submission and validation tests
   - Currency conversion testing
   - Mobile responsiveness checks

4. **Network Monitor** (`network-monitor.js`)
   - External API health monitoring
   - Response time tracking
   - Service availability metrics
   - CORS and connectivity issue detection

5. **Production Dashboard** (`dashboard.html`)
   - Real-time monitoring interface
   - Service status visualization
   - Historical performance data
   - Quick action controls

6. **GitHub Actions Workflow** (`.github/workflows/production-e2e.yml`)
   - Automated daily testing
   - Multi-browser testing with Playwright
   - Automatic issue creation on failures
   - Slack notifications

## 🚀 Quick Start

### Manual Testing

1. **Open the Test Runner**
   ```
   tests/production/production-e2e-runner.html
   ```

2. **Run Tests**
   - Click "Run All Tests" for comprehensive testing
   - Use category buttons for focused testing
   - Monitor real-time console output

3. **View Dashboard**
   ```
   tests/production/dashboard.html
   ```

### Automated Testing

The GitHub Actions workflow runs automatically:
- **Daily**: Every day at 6 AM UTC
- **Manual**: Via GitHub Actions UI
- **On Demand**: Through workflow dispatch

## 📊 Test Categories

### Console Tests
- Page loads without critical errors
- No CurrencyAPI method errors  
- React components render properly
- No unhandled promise rejections
- Service Worker registration

### Flow Tests
- Complete wizard navigation
- Couple mode functionality
- Form validation and error handling
- Results calculation and display
- Language switching
- Data persistence

### API Tests
- External currency API connectivity
- Stock price API integration
- Offline fallback behavior
- CORS proxy functionality

### Performance Tests
- Page load time under 5 seconds
- Memory leak detection
- Mobile responsiveness
- Network request optimization

## 🔧 Configuration

### Environment Variables

```yaml
PRODUCTION_URL: 'https://ypollak2.github.io/advanced-retirement-planner/'
TEST_TIMEOUT: 300000  # 5 minutes
NODE_VERSION: '18.x'
```

### Test Categories

Available test categories for targeted testing:
- `all` - Run all test categories
- `console` - Console error and JavaScript tests
- `flow` - User flow and interaction tests  
- `api` - External service and API tests
- `performance` - Performance and optimization tests

## 📈 Monitoring & Alerts

### GitHub Issues
- Automatic issue creation on test failures
- Detailed error reports with stack traces
- Links to workflow runs and logs
- Auto-assignment to workflow triggerer

### Slack Notifications
- Critical failure alerts
- Daily summary reports (optional)
- Custom webhook integration

### Dashboard Features
- Real-time service status monitoring
- Performance metrics visualization
- Event logging and history
- Quick action controls

## 🛠️ Development

### Adding New Tests

1. **Console Tests**: Add to `setupConsoleCapture()` in the test runner
2. **Flow Tests**: Extend `ProductionTestScenarios` class
3. **API Tests**: Add endpoints to network monitor
4. **Custom Tests**: Create new test functions in scenarios

### Extending Monitoring

```javascript
// Add new service to monitor
const newService = {
    name: 'New API',
    url: 'https://api.example.com/health',
    critical: true
};

networkMonitor.services.push(newService);
```

### Custom Error Categories

```javascript
// Add new error categorization
categorizeError(errorInfo) {
    if (errorInfo.message.includes('my-custom-error')) {
        return 'custom-error-category';
    }
    // ... existing logic
}
```

## 📋 Test Results

### Success Criteria
- ✅ 100% success rate for critical tests
- ✅ Page load time < 5 seconds
- ✅ No critical console errors
- ✅ All external APIs responsive
- ✅ Mobile responsiveness maintained

### Failure Investigation
1. Check GitHub Actions logs
2. Review downloaded test reports
3. Examine console error details
4. Test API endpoints manually
5. Validate production deployment

## 🔍 Troubleshooting

### Common Issues

**CORS Errors**
- Expected for some external APIs
- Check CORS proxy configuration
- Verify domain whitelist settings

**Timeout Errors**
- Increase timeout values in configuration
- Check network connectivity
- Verify production site availability

**Service Worker Issues**
- Clear browser cache
- Check service worker registration
- Verify HTTPS deployment

**Cross-Origin Restrictions**
- Some tests limited by browser security
- Use network monitor for detailed API testing
- Consider headless browser testing

### Debug Mode

Enable verbose logging:
```javascript
window.productionTestRunner.options.debugMode = true;
```

## 📚 Resources

### Related Files
- `/tests/test-runner.js` - Main test suite (302 tests)
- `/scripts/validate-deployment.js` - Deployment validation
- `/.github/workflows/test-ci.yml` - CI/CD pipeline
- `/CLAUDE.md` - Development standards

### External Dependencies
- Playwright (automated testing)
- GitHub Actions (CI/CD)
- Modern browser with ES6+ support

### API Endpoints Monitored
- `https://api.exchangerate-api.com/v4/latest/USD`
- `https://api.fxratesapi.com/latest`
- `https://query1.finance.yahoo.com/v8/finance/chart/AAPL`
- `https://cors-anywhere.herokuapp.com/`

## 🏆 Best Practices

1. **Run tests before major deployments**
2. **Monitor dashboard regularly for trends**
3. **Investigate all critical failures immediately**
4. **Keep test scenarios updated with new features**
5. **Review and update API endpoints periodically**

---

**Last Updated**: July 2025  
**Version**: 1.0.0  
**Maintainer**: Advanced Retirement Planner Team