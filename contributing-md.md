# Contributing to Advanced Retirement Planner

Thank you for your interest in contributing to the Advanced Retirement Planner! We welcome contributions from developers, financial experts, designers, and users who want to help improve this tool.

## 🤝 How to Contribute

### 1. Reporting Issues
- **Bug Reports**: Use the issue template to report bugs
- **Feature Requests**: Suggest new features or improvements
- **Documentation**: Help improve our documentation

### 2. Making Changes
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

## 📋 Development Guidelines

### Code Style
- **JavaScript**: Use modern ES6+ syntax
- **React**: Functional components with hooks
- **CSS**: Tailwind CSS utility classes
- **Comments**: Clear, concise comments for complex logic

### File Structure
```
src/
├── components/          # React components
├── utils/              # Helper functions
├── data/               # Static data (indices, countries)
├── styles/             # Custom styles
└── assets/             # Images, icons
```

### Naming Conventions
- **Variables**: camelCase (`currentAge`, `monthlyIncome`)
- **Functions**: camelCase (`calculateRetirement`, `formatCurrency`)
- **Components**: PascalCase (`RetirementPlanner`, `ChartDisplay`)
- **Constants**: UPPER_SNAKE_CASE (`EXCHANGE_RATES`, `RISK_SCENARIOS`)

## 🎯 Contribution Areas

### 🌍 Internationalization
- Add new language translations
- Improve existing translations
- Add currency formatting for new regions

**Current languages**: English, Hebrew
**Needed**: Spanish, French, German, Italian, Portuguese

### 📊 Financial Data
- Update historical index returns
- Add new investment indices
- Improve tax calculation accuracy
- Add support for new countries

**Current countries**: Israel, USA, UK, Germany, France
**Needed**: Canada, Australia, Netherlands, Switzerland

### 🎨 UI/UX Improvements
- Mobile responsiveness enhancements
- Accessibility improvements (WCAG compliance)
- New chart types and visualizations
- Dark mode support

### 🔧 Technical Enhancements
- Performance optimizations
- Better error handling
- Input validation improvements
- Unit tests and integration tests

### 📚 Documentation
- Code documentation
- User guides and tutorials
- API documentation
- Video tutorials

## 🧪 Testing Guidelines

### Before Submitting
- [ ] Test all calculator functions with various inputs
- [ ] Verify charts display correctly
- [ ] Check responsive design on mobile/tablet
- [ ] Test language switching functionality
- [ ] Validate currency conversions
- [ ] Ensure accessibility compliance

### Test Cases to Cover
- **Edge cases**: Zero values, very large numbers, negative inputs
- **Browser compatibility**: Chrome, Firefox, Safari, Edge
- **Mobile devices**: iOS Safari, Android Chrome
- **Slow connections**: Test with throttled network

## 📝 Pull Request Process

### PR Title Format
```
[Type]: Brief description of changes

Examples:
feat: Add support for Canadian tax calculations
fix: Resolve chart rendering issue on mobile
docs: Update installation instructions
style: Improve button hover animations
```

### PR Description Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested these changes locally
- [ ] I have added/updated tests as needed
- [ ] All existing tests pass

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] My changes generate no new warnings
- [ ] New and existing tests pass
```

## 🏗️ Development Setup

### Prerequisites
- Modern web browser
- Text editor (VS Code recommended)
- Basic knowledge of HTML, CSS, JavaScript
- Git for version control

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/advanced-retirement-planner.git

# Navigate to project directory
cd advanced-retirement-planner

# Open in browser
# Method 1: Double-click index.html
# Method 2: Use live server
npx live-server --port=3000

# Or use any other local server
python -m http.server 8000  # Python
php -S localhost:8000       # PHP
```

### Development Tools
- **VS Code Extensions**: 
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - GitLens
- **Browser Tools**: React Developer Tools

## 🎯 Specific Contribution Ideas

### High Priority
1. **Mobile Optimization**: Improve touch interactions and responsive design
2. **Accessibility**: Add ARIA labels, keyboard navigation, screen reader support
3. **Performance**: Optimize chart rendering and calculations
4. **Validation**: Better input validation and error messages

### Medium Priority
1. **Export Features**: PDF reports, Excel export, print-friendly views
2. **Advanced Scenarios**: Monte Carlo simulations, inflation variations
3. **Comparison Tools**: Side-by-side plan comparisons
4. **Social Features**: Share calculations, templates

### Nice to Have
1. **Dark Mode**: Complete dark theme implementation
2. **Animations**: Smooth transitions and micro-interactions
3. **Tutorials**: Interactive onboarding flow
4. **Plugins**: Extensible architecture for custom calculations

## 📊 Financial Data Guidelines

### Adding New Countries
```javascript
// Add to countryData object
newCountry: {
    name: 'Country Name',
    pensionTax: 0.15,           // Average pension tax rate
    socialSecurity: 2000,       // Monthly social security amount
    flag: '🏳️',                // Country flag emoji
    currency: 'USD',            // Primary currency
    retirementAge: 65           // Standard retirement age
}
```

### Adding New Indices
```javascript
// Add to historicalReturns object for each time period
'New Index Name': {
    5: 8.2,    // 5-year average return
    10: 7.8,   // 10-year average return
    15: 7.5,   // 15-year average return
    20: 7.2,   // 20-year average return
    25: 6.9,   // 25-year average return
    30: 6.6    // 30-year average return
}
```

### Data Source Requirements
- **Reliable sources**: Government agencies, financial institutions
- **Historical accuracy**: Verified historical data
- **Regular updates**: Commitment to maintaining current data
- **Proper attribution**: Credit data sources appropriately

## 🌟 Recognition

### Contributors Wall
All contributors will be recognized in:
- README.md contributors section
- CHANGELOG.md for each release
- Project website (when available)

### Contribution Types
- 💻 Code contributions
- 📖 Documentation
- 🎨 Design and UI/UX
- 📊 Financial data and research
- 🌍 Translations
- 🐛 Bug reports and testing
- 💡 Ideas and feature requests

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Request Comments**: Code-specific discussions

### Questions?
Before asking, please:
1. Check existing issues and discussions
2. Read this contributing guide
3. Review the project documentation

Still have questions? Open a discussion or issue with the `question` label.

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand what behavior is expected.

## 🏆 Thank You!

Your contributions make this project better for everyone. Whether you're fixing a small typo or adding a major feature, every contribution is valued and appreciated!

---

**Happy Contributing! 🚀**