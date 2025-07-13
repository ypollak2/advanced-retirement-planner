const BottomLineSummary = ({ inputs, language, totalMonthlySalary, yearsToRetirement, estimatedMonthlyIncome, projectedWithGrowth, buyingPowerToday, formatCurrency }) => {
        
        // Calculate additional insights
        const replacementRatio = totalMonthlySalary > 0 ? ((estimatedMonthlyIncome / totalMonthlySalary) * 100) : 0;
        const isRetirementReady = replacementRatio >= 70; // 70% replacement ratio is considered good
        const savingsProgress = projectedWithGrowth / (estimatedMonthlyIncome * 12 * 25); // 25x annual expenses rule
        
        return React.createElement('div', {
            className: "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-slate-200 p-6 mb-6"
        }, [
            // Enhanced Header with Status Indicator
            React.createElement('div', { 
                key: 'enhanced-header',
                className: "flex items-center justify-between mb-6" 
            }, [
                React.createElement('div', {
                    key: 'title-section',
                    className: "flex items-center"
                }, [
                    React.createElement('div', {
                        key: 'icon-container',
                        className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4"
                    }, React.createElement('span', { 
                        key: 'icon',
                        className: "text-white text-xl font-bold" 
                    }, '📊')),
                    React.createElement('div', {
                        key: 'title-text-container'
                    }, [
                        React.createElement('h3', { 
                            key: 'main-title',
                            className: "text-xl font-bold text-slate-800 leading-normal break-words" 
                        }, language === 'he' ? 'תחזית פרישה מקצועית' : 'Professional Retirement Forecast'),
                        React.createElement('p', {
                            key: 'subtitle', 
                            className: "text-sm text-slate-600 mt-1"
                        }, language === 'he' ? 'נתונים מרכזיים ומדדי הצלחה' : 'Key Metrics & Success Indicators')
                    ])
                ]),
                React.createElement('div', {
                    key: 'status-badge',
                    className: `px-3 py-1 rounded-full text-xs font-semibold ${
                        isRetirementReady 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`
                }, isRetirementReady 
                    ? (language === 'he' ? '✅ מוכן לפרישה' : '✅ Retirement Ready')
                    : (language === 'he' ? '⚠️ דורש שיפור' : '⚠️ Needs Improvement')
                )
            ]),
            
            // Enhanced Metrics Grid with Better Visual Hierarchy
            React.createElement('div', { 
                key: 'enhanced-metrics-grid',
                className: "grid grid-cols-1 md:grid-cols-3 gap-4" 
            }, [
                // Primary Metric: Monthly Retirement Income
                React.createElement('div', {
                    key: 'primary-income-metric',
                    className: "relative bg-white rounded-xl p-5 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200"
                }, [
                    React.createElement('div', {
                        key: 'income-header',
                        className: "flex items-center justify-between mb-3"
                    }, [
                        React.createElement('div', {
                            key: 'income-icon',
                            className: "w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center"
                        }, React.createElement('span', { 
                            key: 'income-emoji',
                            className: "text-white text-lg" 
                        }, '💰')),
                        React.createElement('div', {
                            key: 'replacement-ratio',
                            className: `text-xs font-semibold px-2 py-1 rounded-full ${
                                replacementRatio >= 70 ? 'bg-green-100 text-green-700' : 
                                replacementRatio >= 50 ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-red-100 text-red-700'
                            }`
                        }, `${replacementRatio.toFixed(0)}%`)
                    ]),
                    React.createElement('div', { 
                        key: 'income-label',
                        className: "text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2" 
                    }, language === 'he' ? 'הכנסה חודשית בפרישה' : 'Monthly Retirement Income'),
                    React.createElement('div', { 
                        key: 'income-amount',
                        className: "text-2xl font-bold text-slate-800 mb-2" 
                    }, formatCurrency(estimatedMonthlyIncome || 0)),
                    React.createElement('div', { 
                        key: 'income-comparison',
                        className: "text-xs text-slate-500" 
                    }, `${language === 'he' ? 'מהמשכורת הנוכחית' : 'of current salary'} (${formatCurrency(totalMonthlySalary)})`)
                ]),
                
                // Secondary Metric: Time to Retirement with Progress
                React.createElement('div', {
                    key: 'time-metric',
                    className: "relative bg-white rounded-xl p-5 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200"
                }, [
                    React.createElement('div', {
                        key: 'time-header',
                        className: "flex items-center justify-between mb-3"
                    }, [
                        React.createElement('div', {
                            key: 'time-icon',
                            className: "w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center"
                        }, React.createElement('span', { 
                            key: 'time-emoji',
                            className: "text-white text-lg" 
                        }, '⏰')),
                        React.createElement('div', {
                            key: 'urgency-indicator',
                            className: `text-xs font-semibold px-2 py-1 rounded-full ${
                                yearsToRetirement > 20 ? 'bg-blue-100 text-blue-700' : 
                                yearsToRetirement > 10 ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-red-100 text-red-700'
                            }`
                        }, yearsToRetirement > 20 ? (language === 'he' ? 'זמן רב' : 'Long Term') :
                           yearsToRetirement > 10 ? (language === 'he' ? 'זמן בינוני' : 'Mid Term') :
                           (language === 'he' ? 'זמן קצר' : 'Short Term'))
                    ]),
                    React.createElement('div', { 
                        key: 'time-label',
                        className: "text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2" 
                    }, language === 'he' ? 'זמן לפרישה' : 'Time to Retirement'),
                    React.createElement('div', { 
                        key: 'years-display',
                        className: "text-2xl font-bold text-slate-800 mb-2" 
                    }, `${yearsToRetirement || 0} ${language === 'he' ? 'שנים' : 'years'}`),
                    React.createElement('div', { 
                        key: 'retirement-age',
                        className: "text-xs text-slate-500" 
                    }, `${language === 'he' ? 'פרישה בגיל' : 'Retiring at age'} ${inputs.retirementAge || 67}`)
                ]),
                
                // Tertiary Metric: Total Savings with Buying Power
                React.createElement('div', {
                    key: 'savings-metric',
                    className: "relative bg-white rounded-xl p-5 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200"
                }, [
                    React.createElement('div', {
                        key: 'savings-header',
                        className: "flex items-center justify-between mb-3"
                    }, [
                        React.createElement('div', {
                            key: 'savings-icon',
                            className: "w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center"
                        }, React.createElement('span', { 
                            key: 'savings-emoji',
                            className: "text-white text-lg" 
                        }, '🏦')),
                        React.createElement('div', {
                            key: 'savings-multiplier',
                            className: "text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700"
                        }, `${(projectedWithGrowth / Math.max(totalMonthlySalary * 12, 1)).toFixed(1)}x`)
                    ]),
                    React.createElement('div', { 
                        key: 'savings-label',
                        className: "text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2" 
                    }, language === 'he' ? 'סה"כ צבירה צפויה' : 'Total Projected Savings'),
                    React.createElement('div', { 
                        key: 'savings-amount',
                        className: "text-2xl font-bold text-slate-800 mb-2" 
                    }, formatCurrency(projectedWithGrowth || 0)),
                    React.createElement('div', { 
                        key: 'buying-power',
                        className: "text-xs text-slate-500" 
                    }, `${language === 'he' ? 'כוח קנייה היום:' : 'Today\'s buying power:'} ${formatCurrency(buyingPowerToday || 0)}`)
                ])
            ]),
            
            // Enhanced Footer with Key Insights
            React.createElement('div', {
                key: 'insights-footer',
                className: "mt-6 pt-4 border-t border-slate-200"
            }, [
                React.createElement('div', {
                    key: 'insights-grid',
                    className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
                }, [
                    React.createElement('div', { key: 'insight-1' }, [
                        React.createElement('div', { 
                            key: 'insight-1-value',
                            className: "text-lg font-semibold text-slate-700" 
                        }, `${replacementRatio.toFixed(0)}%`),
                        React.createElement('div', { 
                            key: 'insight-1-label',
                            className: "text-xs text-slate-500" 
                        }, language === 'he' ? 'יחס החלפה' : 'Replacement Ratio')
                    ]),
                    React.createElement('div', { key: 'insight-2' }, [
                        React.createElement('div', { 
                            key: 'insight-2-value',
                            className: "text-lg font-semibold text-slate-700" 
                        }, `${((projectedWithGrowth / Math.max(estimatedMonthlyIncome * 12, 1)) / 25 * 100).toFixed(0)}%`),
                        React.createElement('div', { 
                            key: 'insight-2-label',
                            className: "text-xs text-slate-500" 
                        }, language === 'he' ? 'יעד 25x' : '25x Rule Progress')
                    ]),
                    React.createElement('div', { key: 'insight-3' }, [
                        React.createElement('div', { 
                            key: 'insight-3-value',
                            className: "text-lg font-semibold text-slate-700" 
                        }, `${Math.round((projectedWithGrowth / Math.max(estimatedMonthlyIncome, 1)) / 12)}y`),
                        React.createElement('div', { 
                            key: 'insight-3-label',
                            className: "text-xs text-slate-500" 
                        }, language === 'he' ? 'שנות פרישה' : 'Retirement Years')
                    ]),
                    React.createElement('div', { key: 'insight-4' }, [
                        React.createElement('div', { 
                            key: 'insight-4-value',
                            className: "text-lg font-semibold text-slate-700" 
                        }, inputs.currentAge ? `${67 - inputs.currentAge}y` : '37y'),
                        React.createElement('div', { 
                            key: 'insight-4-label',
                            className: "text-xs text-slate-500" 
                        }, language === 'he' ? 'זמן לגמלאות' : 'Time to Pension')
                    ])
                ])
            ])
        ]);
    };