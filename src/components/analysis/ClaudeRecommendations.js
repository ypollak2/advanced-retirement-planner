// ClaudeRecommendations.js - AI-powered financial planning recommendations
// Immediate actionable insights based on user's financial profile

const ClaudeRecommendations = ({ inputs, results, partnerResults, language = 'en', workingCurrency = 'ILS' }) => {
    const [recommendations, setRecommendations] = React.useState([]);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [showExportPrompt, setShowExportPrompt] = React.useState(false);
    const timeoutRef = React.useRef(null); // MEMORY LEAK FIX: Track timeout for cleanup

    const content = {
        he: {
            title: 'המלצות Claude AI',
            subtitle: 'המלצות מותאמות אישית לתכנון הפנסיה שלך',
            generating: 'מייצר המלצות...',
            noRecommendations: 'אין המלצות זמינות כרגע',
            categories: {
                savings: 'חיסכון והשקעות',
                risk: 'ניהול סיכונים',
                diversification: 'פיזור השקעות',
                contributions: 'הפקדות חודשיות',
                timeline: 'לוח זמנים לפרישה',
                partner: 'תכנון זוגי',
                tax: 'אופטימיזציה מיסויית',
                estate: 'תכנון עזבון'
            },
            priority: {
                high: 'עדיפות גבוהה',
                medium: 'עדיפות בינונית',
                low: 'עדיפות נמוכה'
            },
            exportPrompt: 'ייצא לבקשת Claude',
            exportDescription: 'קבל ניתוח מפורט מ-Claude AI על בסיס המידע הפיננסי שלך',
            copyPrompt: 'העתק לכלל לחיצה',
            refreshRecommendations: 'רענן המלצות'
        },
        en: {
            title: 'Claude AI Recommendations',
            subtitle: 'Personalized insights for your retirement planning',
            generating: 'Generating recommendations...',
            noRecommendations: 'No recommendations available at this time',
            categories: {
                savings: 'Savings & Investments',
                risk: 'Risk Management',
                diversification: 'Diversification',
                contributions: 'Monthly Contributions',
                timeline: 'Retirement Timeline',
                partner: 'Partner Planning',
                tax: 'Tax Optimization',
                estate: 'Estate Planning'
            },
            priority: {
                high: 'High Priority',
                medium: 'Medium Priority',
                low: 'Low Priority'
            },
            exportPrompt: 'Export to Claude',
            exportDescription: 'Get detailed analysis from Claude AI based on your financial information',
            copyPrompt: 'Copy to Clipboard',
            refreshRecommendations: 'Refresh Recommendations'
        }
    };

    const t = content[language] || content.en;

    // Generate recommendations based on user data
    const generateRecommendations = React.useCallback(() => {
        // MEMORY LEAK FIX: Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        setIsGenerating(true);
        
        timeoutRef.current = setTimeout(() => {
            const newRecommendations = [];

            // Analyze current financial situation
            const currentAge = inputs.currentAge || 30;
            const retirementAge = inputs.retirementAge || 67;
            const yearsToRetirement = retirementAge - currentAge;
            const monthlyIncome = results?.monthlyIncome || 0;
            const totalSavings = results?.totalSavings || 0;
            const savingsRate = ((inputs.currentMonthlySalary || 20000) - (inputs.currentMonthlyExpenses || 15000)) / (inputs.currentMonthlySalary || 20000) * 100;

            // Savings Rate Analysis
            if (savingsRate < 10) {
                newRecommendations.push({
                    id: 'low-savings-rate',
                    category: 'savings',
                    priority: 'high',
                    title: language === 'he' ? 'שיעור חיסכון נמוך מדי' : 'Savings Rate Too Low',
                    description: language === 'he' 
                        ? `שיעור החיסכון שלך הוא ${savingsRate.toFixed(1)}%. מומלץ לחסוך לפחות 15-20% מההכנסה לפרישה נוחה.`
                        : `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 15-20% of income for a comfortable retirement.`,
                    action: language === 'he'
                        ? 'הגדל את ההפקדות החודשיות לפנסיה וקרן השתלמות'
                        : 'Increase monthly contributions to pension and training funds',
                    impact: language === 'he' ? 'השפעה גבוהה על הכנסת הפרישה' : 'High impact on retirement income'
                });
            }

            // Timeline Analysis
            if (yearsToRetirement > 30) {
                newRecommendations.push({
                    id: 'aggressive-growth',
                    category: 'risk',
                    priority: 'medium',
                    title: language === 'he' ? 'הזדמנות לצמיחה אגרסיבית' : 'Opportunity for Aggressive Growth',
                    description: language === 'he'
                        ? `עם ${yearsToRetirement} שנים עד הפרישה, יש לך זמן לקחת סיכונים מחושבים להשגת תשואות גבוהות יותר.`
                        : `With ${yearsToRetirement} years until retirement, you have time for calculated risks to achieve higher returns.`,
                    action: language === 'he'
                        ? 'שקול הגדלת חשיפה למניות ואגרסיביות בתיק ההשקעות'
                        : 'Consider increasing equity exposure and portfolio aggressiveness',
                    impact: language === 'he' ? 'פוטנציאל לתשואות גבוהות משמעותית' : 'Potential for significantly higher returns'
                });
            } else if (yearsToRetirement < 10) {
                newRecommendations.push({
                    id: 'risk-reduction',
                    category: 'risk',
                    priority: 'high',
                    title: language === 'he' ? 'הגן על החיסכון שלך' : 'Protect Your Savings',
                    description: language === 'he'
                        ? `עם ${yearsToRetirement} שנים עד הפרישה, הגיע הזמן להפחית סיכונים ולהגן על ההון הנצבר.`
                        : `With ${yearsToRetirement} years until retirement, it's time to reduce risk and protect accumulated wealth.`,
                    action: language === 'he'
                        ? 'הגדל חשיפה לאג"ח ונכסים יציבים, הפחת מניות'
                        : 'Increase bond allocation and stable assets, reduce equity exposure',
                    impact: language === 'he' ? 'הגנה על ההון הקיים' : 'Protection of existing capital'
                });
            }

            // Diversification Analysis
            const portfolioBreakdown = calculatePortfolioBreakdown();
            if (portfolioBreakdown) {
                const maxAllocation = Math.max(
                    portfolioBreakdown.pension || 0,
                    portfolioBreakdown.training || 0,
                    portfolioBreakdown.personal || 0,
                    portfolioBreakdown.realEstate || 0,
                    portfolioBreakdown.crypto || 0
                );

                if (maxAllocation > 70) {
                    newRecommendations.push({
                        id: 'over-concentration',
                        category: 'diversification',
                        priority: 'medium',
                        title: language === 'he' ? 'ריכוז יתר בנכס בודד' : 'Over-Concentration Risk',
                        description: language === 'he'
                            ? `${maxAllocation.toFixed(1)}% מהתיק שלך מרוכז בסוג נכס אחד. זה מגדיל את הסיכון.`
                            : `${maxAllocation.toFixed(1)}% of your portfolio is concentrated in one asset type. This increases risk.`,
                        action: language === 'he'
                            ? 'פזר את ההשקעות בין סוגי נכסים שונים'
                            : 'Diversify investments across different asset classes',
                        impact: language === 'he' ? 'הפחתת סיכון וייצוב תשואות' : 'Risk reduction and return stabilization'
                    });
                }
            }

            // Partner Planning Analysis
            if (inputs.planningType === 'couple') {
                const hasPartnerData = partnerResults && Object.keys(partnerResults).length > 0;
                if (!hasPartnerData) {
                    newRecommendations.push({
                        id: 'missing-partner-data',
                        category: 'partner',
                        priority: 'high',
                        title: language === 'he' ? 'השלם מידע על בן/בת הזוג' : 'Complete Partner Information',
                        description: language === 'he'
                            ? 'נתונים חסרים על בן/בת הזוג עלולים להוביל לתכנון לא מדויק.'
                            : 'Missing partner data can lead to inaccurate retirement planning.',
                        action: language === 'he'
                            ? 'מלא את כל השלבים באשף התכנון הזוגי'
                            : 'Complete all steps in the partner planning wizard',
                        impact: language === 'he' ? 'תכנון מדויק יותר לפרישה משותפת' : 'More accurate joint retirement planning'
                    });
                }
            }

            // Contribution Analysis
            const currentContributions = (inputs.monthlyContribution || 0) + (inputs.trainingFundMonthly || 0);
            const targetContributions = (inputs.currentMonthlySalary || 20000) * 0.15; // 15% target
            
            if (currentContributions < targetContributions) {
                newRecommendations.push({
                    id: 'increase-contributions',
                    category: 'contributions',
                    priority: 'high',
                    title: language === 'he' ? 'הגדל הפקדות חודשיות' : 'Increase Monthly Contributions',
                    description: language === 'he'
                        ? `מפריד ₪${(targetContributions - currentContributions).toLocaleString()} בחודש מהיעד המומלץ.`
                        : `You're ₪${(targetContributions - currentContributions).toLocaleString()} short of the recommended monthly target.`,
                    action: language === 'he'
                        ? 'הגדל הפקדות לפנסיה ו/או קרן השתלמות'
                        : 'Increase pension and/or training fund contributions',
                    impact: language === 'he' ? 'שיפור משמעותי בהכנסת הפרישה' : 'Significant improvement in retirement income'
                });
            }

            // Tax Optimization
            if (inputs.currentMonthlySalary > 45000 && !inputs.keren_hishtalmut) {
                newRecommendations.push({
                    id: 'tax-optimization',
                    category: 'tax',
                    priority: 'medium',
                    title: language === 'he' ? 'אופטימיזציה מיסויית' : 'Tax Optimization',
                    description: language === 'he'
                        ? 'עם משכורת גבוהה, יש הזדמנויות לחיסכון מס משמעותי.'
                        : 'With a high salary, there are opportunities for significant tax savings.',
                    action: language === 'he'
                        ? 'מקסם הפקדות לקרן השתלמות וחשב על פטור מס'
                        : 'Maximize training fund contributions and consider tax exemptions',
                    impact: language === 'he' ? 'חיסכון מס שנתי משמעותי' : 'Significant annual tax savings'
                });
            }

            setRecommendations(newRecommendations);
            setIsGenerating(false);
            timeoutRef.current = null; // Clear reference after completion
        }, 1500); // Simulate processing time
    }, [inputs, results, partnerResults, language]);
    
    // MEMORY LEAK FIX: Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Calculate portfolio breakdown helper
    const calculatePortfolioBreakdown = () => {
        const pension = parseFloat(inputs.currentSavings || 0);
        const training = parseFloat(inputs.currentTrainingFund || 0);
        const personal = parseFloat(inputs.currentPersonalPortfolio || 0);
        const realEstate = parseFloat(inputs.currentRealEstate || 0);
        const crypto = parseFloat(inputs.currentCrypto || 0);
        
        const total = pension + training + personal + realEstate + crypto;
        
        if (total === 0) return null;
        
        return {
            pension: (pension / total) * 100,
            training: (training / total) * 100,
            personal: (personal / total) * 100,
            realEstate: (realEstate / total) * 100,
            crypto: (crypto / total) * 100
        };
    };

    // Generate export prompt for Claude
    const generateClaudePrompt = () => {
        const financialSummary = {
            age: inputs.currentAge,
            retirementAge: inputs.retirementAge,
            monthlySalary: inputs.currentMonthlySalary,
            monthlyExpenses: inputs.currentMonthlyExpenses,
            currentSavings: inputs.currentSavings,
            planningType: inputs.planningType,
            projectedRetirementIncome: results?.monthlyIncome,
            totalProjectedSavings: results?.totalSavings
        };

        const prompt = `Please analyze this retirement planning scenario and provide detailed recommendations:

**Financial Profile:**
- Current Age: ${financialSummary.age}
- Retirement Age: ${financialSummary.retirementAge}
- Monthly Salary: ₪${financialSummary.monthlySalary?.toLocaleString()}
- Monthly Expenses: ₪${financialSummary.monthlyExpenses?.toLocaleString()}
- Current Savings: ₪${financialSummary.currentSavings?.toLocaleString()}
- Planning Type: ${financialSummary.planningType}

**Projections:**
- Projected Monthly Retirement Income: ₪${financialSummary.projectedRetirementIncome?.toLocaleString()}
- Total Projected Savings at Retirement: ₪${financialSummary.totalProjectedSavings?.toLocaleString()}

Please provide:
1. Assessment of current financial position
2. Specific actionable recommendations
3. Risk analysis and mitigation strategies
4. Timeline and priority of actions
5. Potential optimization opportunities

Focus on practical, implementable advice for the Israeli market context.`;

        return prompt;
    };

    // Copy prompt to clipboard
    const copyPromptToClipboard = async () => {
        const prompt = generateClaudePrompt();
        try {
            await navigator.clipboard.writeText(prompt);
            alert(language === 'he' ? 'הועתק ללוח!' : 'Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    // Generate recommendations on component mount
    React.useEffect(() => {
        if (inputs && results) {
            generateRecommendations();
        }
    }, [inputs, results, generateRecommendations]);

    return React.createElement('div', { className: "bg-white rounded-xl shadow-lg p-6 border border-gray-200" }, [
        // Header
        React.createElement('div', { key: 'header', className: "flex items-center justify-between mb-6" }, [
            React.createElement('div', { key: 'title-section' }, [
                React.createElement('h2', { 
                    key: 'title',
                    className: "text-xl font-bold text-gray-800 flex items-center" 
                }, [
                    React.createElement('span', { key: 'icon', className: "mr-3 text-2xl" }, '🤖'),
                    t.title
                ]),
                React.createElement('p', { 
                    key: 'subtitle',
                    className: "text-sm text-gray-600 mt-1" 
                }, t.subtitle)
            ]),
            React.createElement('div', { key: 'actions', className: "flex gap-2" }, [
                React.createElement('button', {
                    key: 'refresh',
                    onClick: generateRecommendations,
                    disabled: isGenerating,
                    className: "px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs font-medium disabled:opacity-50"
                }, t.refreshRecommendations),
                React.createElement('button', {
                    key: 'export',
                    onClick: () => setShowExportPrompt(!showExportPrompt),
                    className: "px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-xs font-medium"
                }, t.exportPrompt)
            ])
        ]),

        // Export Prompt Panel
        showExportPrompt && React.createElement('div', {
            key: 'export-panel',
            className: "mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg"
        }, [
            React.createElement('h3', {
                key: 'export-title',
                className: "font-semibold text-purple-800 mb-2"
            }, t.exportPrompt),
            React.createElement('p', {
                key: 'export-desc',
                className: "text-sm text-purple-700 mb-3"
            }, t.exportDescription),
            React.createElement('button', {
                key: 'copy-btn',
                onClick: copyPromptToClipboard,
                className: "w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            }, t.copyPrompt)
        ]),

        // Loading State
        isGenerating && React.createElement('div', {
            key: 'loading',
            className: "flex items-center justify-center py-8"
        }, [
            React.createElement('div', {
                key: 'spinner',
                className: "animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-3"
            }),
            React.createElement('span', {
                key: 'loading-text',
                className: "text-gray-600"
            }, t.generating)
        ]),

        // Recommendations List
        !isGenerating && recommendations.length === 0 && React.createElement('div', {
            key: 'no-recommendations',
            className: "text-center py-8 text-gray-500"
        }, t.noRecommendations),

        !isGenerating && recommendations.length > 0 && React.createElement('div', {
            key: 'recommendations-list',
            className: "space-y-4"
        }, recommendations.map(rec => 
            React.createElement('div', {
                key: rec.id,
                className: `p-4 border-l-4 rounded-lg ${
                    rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                    rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                }`
            }, [
                React.createElement('div', { key: 'rec-header', className: "flex items-center justify-between mb-2" }, [
                    React.createElement('h3', {
                        key: 'rec-title',
                        className: `font-semibold text-gray-800`
                    }, rec.title),
                    React.createElement('span', {
                        key: 'rec-priority',
                        className: `px-2 py-1 rounded-full text-xs font-medium ${
                            rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                            rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-green-200 text-green-800'
                        }`
                    }, t.priority[rec.priority])
                ]),
                React.createElement('p', {
                    key: 'rec-description',
                    className: "text-gray-700 text-sm mb-2"
                }, rec.description),
                React.createElement('div', {
                    key: 'rec-action',
                    className: "bg-white p-3 rounded border border-gray-200"
                }, [
                    React.createElement('p', {
                        key: 'action-text',
                        className: "font-medium text-gray-800 text-sm mb-1"
                    }, rec.action),
                    React.createElement('p', {
                        key: 'impact-text',
                        className: "text-xs text-gray-600"
                    }, rec.impact)
                ])
            ])
        ))
    ]);
};

window.ClaudeRecommendations = ClaudeRecommendations;
console.log('✅ ClaudeRecommendations component loaded successfully');