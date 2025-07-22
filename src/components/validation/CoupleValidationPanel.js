// CoupleValidationPanel.js - Cross-Partner Dependency Validation Panel
// Created by Yali Pollak (יהלי פولק) - Advanced Retirement Planner v6.3.0

const CoupleValidationPanel = ({ 
    primaryInputs, 
    partnerInputs, 
    language = 'en',
    workingCurrency = 'ILS',
    onValidationUpdate,
    onFixIssue
}) => {
    const createElement = React.createElement;
    
    // State for validation results
    const [validationResults, setValidationResults] = React.useState(null);
    const [isValidating, setIsValidating] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [showDetails, setShowDetails] = React.useState(false);
    
    // Multi-language content
    const content = {
        he: {
            title: 'בדיקת תלות כלכלית בין בני הזוג',
            subtitle: 'וידוא עקביות וזיהוי בעיות פוטנציאליות בתכנון משותף',
            
            // Validation categories
            categories: {
                all: 'כל הקטגוריות',
                ages: 'גילאים ופרישה',
                finances: 'עקביות כלכלית',
                retirement: 'תכנון פרישה',
                beneficiary: 'מוטבים וירושה',
                dependency: 'תלות כלכלית',
                risk: 'התאמת סיכון'
            },
            
            // Severity levels
            severity: {
                high: 'גבוהה',
                medium: 'בינונית',
                low: 'נמוכה'
            },
            
            // Status
            validationScore: 'ציון תאימות זוגית',
            validationStatus: 'סטטוס בדיקה',
            validationPassed: 'עבר בדיקה',
            validationFailed: 'נכשל בבדיקה',
            
            // Actions
            runValidation: 'הרץ בדיקת תלות',
            viewDetails: 'הצג פרטים',
            hideDetails: 'הסתר פרטים',
            fixIssue: 'תקן בעיה',
            fixAll: 'תקן הכל',
            
            // Results
            errorsFound: 'שגיאות שנמצאו',
            warningsFound: 'אזהרות',
            recommendationsFound: 'המלצות',
            noIssues: 'לא נמצאו בעיות',
            
            // Categories descriptions
            categoryDescriptions: {
                ages: 'בדיקת פערי גילאים וגילי פרישה',
                finances: 'בדיקת עקביות הכנסות והוצאות',
                retirement: 'בדיקת תכנון פרישה משותף',
                beneficiary: 'בדיקת צוואות וביטוח חיים',
                dependency: 'בדיקת תלות כלכלית הדדית',
                risk: 'בדיקת התאמת סובלנות סיכון'
            },
            
            // Score interpretation
            scoreInterpretation: {
                excellent: 'מעולה - תאימות גבוהה',
                good: 'טוב - תאימות סבירה',
                fair: 'בינוני - דורש שיפורים',
                poor: 'חלש - דורש תיקונים משמעותיים'
            }
        },
        en: {
            title: 'Couple Financial Dependency Validation',
            subtitle: 'Ensure consistency and identify potential issues in joint planning',
            
            // Validation categories
            categories: {
                all: 'All Categories',
                ages: 'Ages & Retirement',
                finances: 'Financial Consistency',
                retirement: 'Retirement Planning',
                beneficiary: 'Beneficiaries & Inheritance',
                dependency: 'Financial Dependencies',
                risk: 'Risk Alignment'
            },
            
            // Severity levels
            severity: {
                high: 'High',
                medium: 'Medium',
                low: 'Low'
            },
            
            // Status
            validationScore: 'Couple Compatibility Score',
            validationStatus: 'Validation Status',
            validationPassed: 'Validation Passed',
            validationFailed: 'Validation Failed',
            
            // Actions
            runValidation: 'Run Dependency Check',
            viewDetails: 'View Details',
            hideDetails: 'Hide Details',
            fixIssue: 'Fix Issue',
            fixAll: 'Fix All',
            
            // Results
            errorsFound: 'Errors Found',
            warningsFound: 'Warnings',
            recommendationsFound: 'Recommendations',
            noIssues: 'No Issues Found',
            
            // Categories descriptions
            categoryDescriptions: {
                ages: 'Check age gaps and retirement age alignment',
                finances: 'Check income and expense consistency',
                retirement: 'Check joint retirement planning',
                beneficiary: 'Check wills and life insurance setup',
                dependency: 'Check mutual financial dependencies',
                risk: 'Check risk tolerance alignment'
            },
            
            // Score interpretation
            scoreInterpretation: {
                excellent: 'Excellent - High Compatibility',
                good: 'Good - Reasonable Compatibility',
                fair: 'Fair - Needs Improvements',
                poor: 'Poor - Requires Significant Fixes'
            }
        }
    };

    const t = content[language];

    // Run validation when inputs change
    React.useEffect(() => {
        if (primaryInputs && partnerInputs && primaryInputs.partnerPlanningEnabled) {
            runValidation();
        }
    }, [primaryInputs, partnerInputs]);

    // Run validation function
    const runValidation = async () => {
        if (!window.CoupleValidation) {
            console.warn('CoupleValidation utility not loaded');
            return;
        }

        setIsValidating(true);
        
        try {
            // Simulate async validation (could be actual API call)
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const results = window.CoupleValidation.validateCoupleData(
                primaryInputs, 
                partnerInputs, 
                language
            );
            
            setValidationResults(results);
            
            if (onValidationUpdate) {
                onValidationUpdate(results);
            }
        } catch (error) {
            console.error('Validation error:', error);
        } finally {
            setIsValidating(false);
        }
    };

    // Get score color and interpretation
    const getScoreInfo = (score) => {
        if (score >= 90) return { color: 'green', interpretation: t.scoreInterpretation.excellent };
        if (score >= 75) return { color: 'blue', interpretation: t.scoreInterpretation.good };
        if (score >= 60) return { color: 'yellow', interpretation: t.scoreInterpretation.fair };
        return { color: 'red', interpretation: t.scoreInterpretation.poor };
    };

    // Filter issues by category
    const filterIssues = (issues) => {
        if (selectedCategory === 'all') return issues;
        return issues.filter(issue => 
            issue.field === selectedCategory || 
            issue.type.includes(selectedCategory)
        );
    };

    // Handle fix issue action
    const handleFixIssue = (issue) => {
        if (onFixIssue) {
            onFixIssue(issue);
        } else {
            // Default behavior - scroll to relevant section
            const fieldMap = {
                'ages': 'personal-info',
                'salaries': 'salary-info',
                'expenses': 'expenses-info',
                'contributions': 'contributions-info',
                'life_insurance': 'insurance-info',
                'estate_planning': 'inheritance-info'
            };
            
            const elementId = fieldMap[issue.field];
            if (elementId) {
                const element = document.getElementById(elementId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    // Render validation score
    const renderValidationScore = () => {
        if (!validationResults) return null;
        
        const scoreInfo = getScoreInfo(validationResults.score);
        
        return createElement('div', {
            key: 'score-section',
            className: 'mb-6'
        }, [
            createElement('div', {
                key: 'score-card',
                className: `bg-${scoreInfo.color}-50 rounded-xl p-6 border border-${scoreInfo.color}-200`
            }, [
                createElement('div', {
                    key: 'score-header',
                    className: 'flex items-center justify-between mb-4'
                }, [
                    createElement('h3', {
                        key: 'score-title',
                        className: `text-lg font-semibold text-${scoreInfo.color}-800`
                    }, t.validationScore),
                    createElement('div', {
                        key: 'score-value',
                        className: `text-3xl font-bold text-${scoreInfo.color}-600`
                    }, `${validationResults.score}/100`)
                ]),
                
                createElement('div', {
                    key: 'score-interpretation',
                    className: `text-${scoreInfo.color}-700 mb-4`
                }, scoreInfo.interpretation),
                
                createElement('div', {
                    key: 'score-breakdown',
                    className: 'grid grid-cols-3 gap-4 text-sm'
                }, [
                    createElement('div', {
                        key: 'errors',
                        className: `text-center p-3 bg-red-100 rounded-lg border border-red-200`
                    }, [
                        createElement('div', {
                            key: 'errors-count',
                            className: 'text-xl font-bold text-red-600'
                        }, validationResults.errors.length),
                        createElement('div', {
                            key: 'errors-label',
                            className: 'text-red-700 text-xs'
                        }, t.errorsFound)
                    ]),
                    
                    createElement('div', {
                        key: 'warnings',
                        className: `text-center p-3 bg-yellow-100 rounded-lg border border-yellow-200`
                    }, [
                        createElement('div', {
                            key: 'warnings-count',
                            className: 'text-xl font-bold text-yellow-600'
                        }, validationResults.warnings.length),
                        createElement('div', {
                            key: 'warnings-label',
                            className: 'text-yellow-700 text-xs'
                        }, t.warningsFound)
                    ]),
                    
                    createElement('div', {
                        key: 'recommendations',
                        className: `text-center p-3 bg-blue-100 rounded-lg border border-blue-200`
                    }, [
                        createElement('div', {
                            key: 'recommendations-count',
                            className: 'text-xl font-bold text-blue-600'
                        }, validationResults.recommendations.length),
                        createElement('div', {
                            key: 'recommendations-label',
                            className: 'text-blue-700 text-xs'
                        }, t.recommendationsFound)
                    ])
                ])
            ])
        ]);
    };

    // Render issue item
    const renderIssue = (issue, index, type) => {
        const severityColors = {
            high: 'red',
            medium: 'yellow',
            low: 'blue'
        };
        
        const typeColors = {
            errors: 'red',
            warnings: 'yellow',
            recommendations: 'blue'
        };
        
        const color = severityColors[issue.severity] || typeColors[type] || 'gray';
        
        return createElement('div', {
            key: `${type}-${index}`,
            className: `bg-${color}-50 border border-${color}-200 rounded-lg p-4 mb-3`
        }, [
            createElement('div', {
                key: 'issue-header',
                className: 'flex justify-between items-start mb-2'
            }, [
                createElement('div', {
                    key: 'issue-info',
                    className: 'flex-1'
                }, [
                    createElement('div', {
                        key: 'message',
                        className: `text-${color}-800 font-medium mb-1`
                    }, issue.message),
                    issue.action && createElement('div', {
                        key: 'action',
                        className: `text-${color}-600 text-sm`
                    }, issue.action),
                    issue.severity && createElement('span', {
                        key: 'severity',
                        className: `inline-block mt-2 px-2 py-1 bg-${color}-200 text-${color}-700 rounded-full text-xs font-medium`
                    }, `${language === 'he' ? 'חומרה:' : 'Severity:'} ${t.severity[issue.severity]}`)
                ]),
                
                type !== 'recommendations' && createElement('button', {
                    key: 'fix-button',
                    onClick: () => handleFixIssue(issue),
                    className: `ml-4 px-3 py-1 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 transition-colors text-sm`
                }, t.fixIssue)
            ])
        ]);
    };

    // Render validation results
    const renderValidationResults = () => {
        if (!validationResults) return null;
        
        const filteredErrors = filterIssues(validationResults.errors);
        const filteredWarnings = filterIssues(validationResults.warnings);
        const filteredRecommendations = filterIssues(validationResults.recommendations);
        
        const totalIssues = filteredErrors.length + filteredWarnings.length + filteredRecommendations.length;
        
        if (totalIssues === 0) {
            return createElement('div', {
                key: 'no-issues',
                className: 'text-center py-8'
            }, [
                createElement('div', {
                    key: 'icon',
                    className: 'text-6xl mb-4'
                }, '✅'),
                createElement('h3', {
                    key: 'title',
                    className: 'text-xl font-semibold text-green-600 mb-2'
                }, t.noIssues),
                createElement('p', {
                    key: 'desc',
                    className: 'text-gray-600'
                }, language === 'he' ? 
                    'תכנון הזוג שלכם עקבי ומתואם' : 
                    'Your couple planning is consistent and well-coordinated')
            ]);
        }
        
        return createElement('div', {
            key: 'results',
            className: 'space-y-6'
        }, [
            // Errors section
            filteredErrors.length > 0 && createElement('div', {
                key: 'errors-section',
                className: 'space-y-3'
            }, [
                createElement('h4', {
                    key: 'errors-title',
                    className: 'text-lg font-semibold text-red-700 flex items-center'
                }, [
                    createElement('span', { key: 'icon', className: 'mr-2' }, '❌'),
                    `${t.errorsFound} (${filteredErrors.length})`
                ]),
                ...filteredErrors.map((error, index) => renderIssue(error, index, 'errors'))
            ]),
            
            // Warnings section
            filteredWarnings.length > 0 && createElement('div', {
                key: 'warnings-section',
                className: 'space-y-3'
            }, [
                createElement('h4', {
                    key: 'warnings-title',
                    className: 'text-lg font-semibold text-yellow-700 flex items-center'
                }, [
                    createElement('span', { key: 'icon', className: 'mr-2' }, '⚠️'),
                    `${t.warningsFound} (${filteredWarnings.length})`
                ]),
                ...filteredWarnings.map((warning, index) => renderIssue(warning, index, 'warnings'))
            ]),
            
            // Recommendations section
            filteredRecommendations.length > 0 && createElement('div', {
                key: 'recommendations-section',
                className: 'space-y-3'
            }, [
                createElement('h4', {
                    key: 'recommendations-title',
                    className: 'text-lg font-semibold text-blue-700 flex items-center'
                }, [
                    createElement('span', { key: 'icon', className: 'mr-2' }, '💡'),
                    `${t.recommendationsFound} (${filteredRecommendations.length})`
                ]),
                ...filteredRecommendations.map((recommendation, index) => renderIssue(recommendation, index, 'recommendations'))
            ])
        ]);
    };

    // Don't render if partner planning is not enabled
    if (!primaryInputs?.partnerPlanningEnabled) {
        return null;
    }

    return createElement('div', { className: "couple-validation-panel bg-white rounded-xl p-6 border border-gray-200 shadow-sm" }, [
        // Header
        createElement('div', { key: 'header', className: "mb-6" }, [
            createElement('h2', {
                key: 'title',
                className: "text-2xl font-bold text-gray-800 mb-2"
            }, t.title),
            createElement('p', {
                key: 'subtitle',
                className: "text-gray-600"
            }, t.subtitle)
        ]),

        // Controls
        createElement('div', {
            key: 'controls',
            className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6'
        }, [
            createElement('div', {
                key: 'category-filter',
                className: 'flex items-center space-x-4'
            }, [
                createElement('label', {
                    key: 'filter-label',
                    className: 'text-sm font-medium text-gray-700'
                }, language === 'he' ? 'סנן לפי:' : 'Filter by:'),
                createElement('select', {
                    key: 'category-select',
                    value: selectedCategory,
                    onChange: (e) => setSelectedCategory(e.target.value),
                    className: 'px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }, Object.keys(t.categories).map(category =>
                    createElement('option', {
                        key: category,
                        value: category
                    }, t.categories[category])
                ))
            ]),
            
            createElement('div', {
                key: 'action-buttons',
                className: 'flex space-x-3'
            }, [
                createElement('button', {
                    key: 'validate-button',
                    onClick: runValidation,
                    disabled: isValidating,
                    className: `px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center ${isValidating ? 'animate-pulse' : ''}`
                }, [
                    createElement('span', { key: 'icon', className: 'mr-2' }, isValidating ? '⏳' : '🔍'),
                    isValidating ? (language === 'he' ? 'בודק...' : 'Validating...') : t.runValidation
                ]),
                
                validationResults && createElement('button', {
                    key: 'details-button',
                    onClick: () => setShowDetails(!showDetails),
                    className: 'px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
                }, showDetails ? t.hideDetails : t.viewDetails)
            ])
        ]),

        // Validation score
        renderValidationScore(),

        // Validation results
        showDetails && createElement('div', {
            key: 'results-section',
            className: 'mt-6'
        }, [
            renderValidationResults()
        ])
    ]);
};

// Export the component
window.CoupleValidationPanel = CoupleValidationPanel;

console.log('✅ CoupleValidationPanel component loaded successfully');