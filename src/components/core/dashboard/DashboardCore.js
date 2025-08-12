// Dashboard Core Component
// Main orchestrator for dashboard functionality

const Dashboard = ({ 
    inputs, 
    results, 
    language = 'en',
    formatCurrency,
    onSectionExpand,
    workingCurrency = 'ILS',
    setViewMode
}) => {
    const [exchangeRates, setExchangeRates] = React.useState({});
    const [selectedCurrency, setSelectedCurrency] = React.useState(workingCurrency || 'ILS');
    
    // Get dependencies from modules
    const { getDashboardContent } = window.DashboardContent || {};
    const { getHealthStatus, calculateFinancialHealthScore, getLastUpdatedText } = window.DashboardHealthScore || {};
    const { 
        PensionPlanningSection, 
        InvestmentPortfolioSection, 
        PartnerPlanningSection, 
        ScenarioTestingSection 
    } = window.DashboardSections || {};
    const {
        GoalTrackingSection,
        InheritancePlanningSection,
        TaxOptimizationSection,
        NationalInsuranceSection
    } = window.DashboardAdditionalSections || {};
    
    // Partner field mapping integration for couple mode
    const processedInputs = inputs?.planningType === 'couple' && window.getFieldValue ? 
        {
            ...inputs,
            currentSalary: window.getFieldValue(inputs, ['currentSalary'], { combinePartners: true }),
            monthlyExpenses: window.getFieldValue(inputs, ['currentMonthlyExpenses'], { combinePartners: true }),
            currentSavings: window.getFieldValue(inputs, ['currentSavings'], { combinePartners: true }),
            monthlyContribution: window.getFieldValue(inputs, ['monthlyContribution'], { combinePartners: true })
        } : inputs;
    
    const [expandedSections, setExpandedSections] = React.useState({
        pension: false,
        investments: false,
        partner: false,
        scenarios: false,
        goals: false,
        inheritance: false,
        taxOptimization: false,
        nationalInsurance: false
    });

    // Get content translations
    const content = getDashboardContent ? getDashboardContent() : { he: {}, en: {} };
    const t = content[language] || content.en;

    // Toggle section expansion
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Calculate financial health score
    const financialHealthScore = calculateFinancialHealthScore ? 
        calculateFinancialHealthScore(inputs, processedInputs) : 
        { score: 0, factors: {} };
    
    const healthStatus = getHealthStatus ? getHealthStatus(financialHealthScore.score) : 
        { status: 'unknown', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };

    // Get validation issues
    const validationIssues = window.ValidationService ? 
        window.ValidationService.getValidationIssues(inputs) : [];
    
    // Filter issues by section
    const pensionIssues = validationIssues.filter(issue => 
        ['pensionContributionRate', 'currentPensionBalance'].includes(issue.field)
    );
    
    const coupleIssues = validationIssues.filter(issue => 
        issue.field && (issue.field.includes('partner1') || issue.field.includes('partner2'))
    );

    // Render the dashboard
    return React.createElement('div', {
        className: 'dashboard-container space-y-6'
    }, [
        // Health Score Header
        React.createElement('div', {
            key: 'health-header',
            className: 'health-meter-section bg-white rounded-lg shadow-sm p-6 border'
        }, [
            React.createElement('div', {
                key: 'meter-header',
                className: 'flex justify-between items-center mb-4'
            }, [
                React.createElement('h3', {
                    key: 'title',
                    className: 'text-xl font-semibold text-gray-800'
                }, t.healthMeter),
                React.createElement('span', {
                    key: 'timestamp',
                    className: 'text-sm text-gray-500'
                }, `${t.lastUpdated}: ${getLastUpdatedText ? getLastUpdatedText(language) : ''}`)
            ]),
            
            // Score Display
            React.createElement('div', {
                key: 'score-display',
                className: 'relative'
            }, [
                React.createElement('div', {
                    key: 'score-bar',
                    className: 'w-full bg-gray-200 rounded-full h-8 overflow-hidden'
                }, [
                    React.createElement('div', {
                        key: 'score-fill',
                        className: `h-full transition-all duration-500 ${
                            healthStatus.color === 'green' ? 'bg-green-500' :
                            healthStatus.color === 'blue' ? 'bg-blue-500' :
                            healthStatus.color === 'yellow' ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`,
                        style: { width: `${financialHealthScore.score}%` }
                    })
                ]),
                React.createElement('div', {
                    key: 'score-text',
                    className: 'absolute inset-0 flex items-center justify-center'
                }, [
                    React.createElement('span', {
                        key: 'score',
                        className: 'font-bold text-lg'
                    }, `${financialHealthScore.score}/100`),
                    React.createElement('span', {
                        key: 'status',
                        className: `ml-2 ${healthStatus.textColor}`
                    }, ` - ${t[healthStatus.status] || healthStatus.status}`)
                ])
            ]),
            
            // Quick Actions
            React.createElement('div', {
                key: 'quick-actions',
                className: 'mt-6'
            }, [
                React.createElement('h4', {
                    key: 'actions-title',
                    className: 'text-sm font-medium text-gray-700 mb-3'
                }, t.quickActions),
                React.createElement('div', {
                    key: 'actions-grid',
                    className: 'grid grid-cols-2 md:grid-cols-4 gap-3'
                }, [
                    React.createElement('button', {
                        key: 'plan-pension',
                        onClick: () => toggleSection('pension'),
                        className: 'px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors'
                    }, t.planPension),
                    React.createElement('button', {
                        key: 'manage-investments',
                        onClick: () => setViewMode ? setViewMode('investments') : toggleSection('investments'),
                        className: 'px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm font-medium transition-colors'
                    }, t.manageInvestments),
                    React.createElement('button', {
                        key: 'partner-planning',
                        onClick: () => setViewMode ? setViewMode('couple') : toggleSection('partner'),
                        className: 'px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-sm font-medium transition-colors'
                    }, t.partnerPlanning),
                    React.createElement('button', {
                        key: 'test-scenarios',
                        onClick: () => setViewMode ? setViewMode('scenarios') : toggleSection('scenarios'),
                        className: 'px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 text-sm font-medium transition-colors'
                    }, t.testScenarios)
                ])
            ])
        ]),

        // Planning Sections Container
        React.createElement('div', {
            key: 'planning-sections',
            className: 'planning-sections space-y-4'
        }, [
            // Pension Planning Section
            PensionPlanningSection && React.createElement(PensionPlanningSection, {
                key: 'pension',
                expanded: expandedSections.pension,
                onToggle: toggleSection,
                onSectionExpand,
                language,
                t,
                validationIssues: pensionIssues
            }),

            // Investment Portfolio Section
            InvestmentPortfolioSection && React.createElement(InvestmentPortfolioSection, {
                key: 'investments',
                expanded: expandedSections.investments,
                onToggle: toggleSection,
                setViewMode,
                language,
                t
            }),

            // Partner Planning Section
            PartnerPlanningSection && React.createElement(PartnerPlanningSection, {
                key: 'partner',
                expanded: expandedSections.partner,
                onToggle: toggleSection,
                setViewMode,
                language,
                t,
                inputs,
                validationIssues: coupleIssues,
                onSectionExpand
            }),

            // Scenario Testing Section
            ScenarioTestingSection && React.createElement(ScenarioTestingSection, {
                key: 'scenarios',
                expanded: expandedSections.scenarios,
                onToggle: toggleSection,
                setViewMode,
                language,
                t,
                inputs,
                results,
                formatCurrency,
                workingCurrency,
                onSectionExpand
            }),

            // Goal Tracking Section
            GoalTrackingSection && React.createElement(GoalTrackingSection, {
                key: 'goals',
                expanded: expandedSections.goals,
                onToggle: toggleSection,
                setViewMode,
                language,
                t,
                onSectionExpand
            }),

            // Inheritance Planning Section
            InheritancePlanningSection && React.createElement(InheritancePlanningSection, {
                key: 'inheritance',
                expanded: expandedSections.inheritance,
                onToggle: toggleSection,
                language,
                t,
                inputs,
                formatCurrency,
                workingCurrency
            }),

            // Tax Optimization Section
            TaxOptimizationSection && React.createElement(TaxOptimizationSection, {
                key: 'tax',
                expanded: expandedSections.taxOptimization,
                onToggle: toggleSection,
                setViewMode,
                language,
                t,
                inputs
            }),

            // National Insurance Section
            NationalInsuranceSection && React.createElement(NationalInsuranceSection, {
                key: 'national-insurance',
                expanded: expandedSections.nationalInsurance,
                onToggle: toggleSection,
                language,
                t,
                results,
                formatCurrency,
                workingCurrency
            })
        ])
    ]);
};

// Export to window for global access
window.Dashboard = Dashboard;

console.log('✅ Dashboard Core component loaded');