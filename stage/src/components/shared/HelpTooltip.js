// HelpTooltip.js - Comprehensive help system with financial literacy education
// Provides contextual explanations, tooltips, and "What does this mean?" support

const HelpTooltip = ({ term, children, language = 'en', position = 'top' }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [helpContent, setHelpContent] = React.useState(null);
    
    // Comprehensive financial education content
    const helpDatabase = {
        he: {
            // Basic Financial Terms
            'retirement-age': {
                title: 'גיל פרישה',
                content: 'הגיל שבו אתה מתכנן להפסיק לעבד ולהתחיל לחיות מחיסכונות הפנסיה שלך.',
                example: 'בישראל גיל הפנסיה הרשמי הוא 67 לגברים ו-62 לנשים, אך ניתן לפרוש מוקדם או מאוחר.',
                tips: ['פרישה מאוחרת מאפשרת חיסכון נוסף', 'שנה נוספת של עבודה = שנה פחות של צריכה מהחיסכונות']
            },
            'inflation-rate': {
                title: 'שיעור אינפלציה',
                content: 'העלייה השנתית הממוצעת במחירים. משפיעה על כוח הקנייה של הכסף לאורך זמן.',
                example: 'אם האינפלציה 3% בשנה, מוצר שעולה היום 100₪ יעלה 103₪ בשנה הבאה.',
                tips: ['בישראל האינפלציה הממוצעת היא כ-2-3% בשנה', 'חשוב להתאים את התשואות הצפויות לאינפלציה']
            },
            'risk-tolerance': {
                title: 'סובלנות סיכון',
                content: 'המידה שבה אתה מוכן לקבל תנודתיות בתיק ההשקעות בתמורה לתשואה גבוהה יותר.',
                example: 'סובלנות נמוכה = יותר אג"ח, פחות מניות. סובלנות גבוהה = יותר מניות.',
                tips: ['ככל שיש יותר זמן עד הפנסיה, ניתן לקחת יותר סיכון', 'דיברסיפיקציה מפחיתה סיכון']
            },
            'compound-interest': {
                title: 'ריבית דריבית',
                content: 'התופעה שבה התשואה שלך מרוויחה בעצמה תשואה, מה שיוצר גידול מעריכי של ההון.',
                example: '1,000₪ שמרוויחים 10% בשנה יהפכו ל-1,100₪ בשנה א\', ל-1,210₪ בשנה ב\'.',
                tips: ['ההתחלה מוקדם היא הכי חשובה', 'כל שנה של דחייה יכולה לעלות אלפי שקלים']
            },
            'training-fund': {
                title: 'קרן השתלמות',
                content: 'חיסכון עם הטבת מס למטרות השתלמות, שניתן למשוך לאחר 6 שנים לכל מטרה.',
                example: 'תקרת הפקדה: 7.5% מהמעסיק + 2.5% מהעובד עד שכר של 15,972₪ בחודש.',
                tips: ['אפשר למשוך אחרי 6 שנים ללא מס', 'כדאי להפקיד גם מעל התקרה אם יש יכולת']
            },
            'pension-fund': {
                title: 'קרן פנסיה',
                content: 'חיסכון חובה לפנסיה עם הטבות מס, נועד לספק הכנסה חודשית לאחר הפרישה.',
                example: 'הפקדה חובה: 6% מהעובד + 6.5% מהמעסיק מהשכר הברוטו.',
                tips: ['ניתן להפקיד בנוסף השתתפות מרצון', 'המשכה חודשית או חד-פעמית בפרישה']
            },
            'rsu-options': {
                title: 'אופציות ומניות חברה',
                content: 'מניות או זכויות לקנייה במחיר נוח מהחברה המעסיקה, חלק מחבילת השכר.',
                example: 'RSU = קבלת מניות בחינם בהדרגה. אופציות = זכות לקנות במחיר קבוע.',
                tips: ['חשוב לפזר - לא להחזיק רק מניות של החברה', 'יש השלכות מס שונות לכל סוג']
            },
            'emergency-fund': {
                title: 'קרן חירום',
                content: 'כסף נזיל לכיסוי הוצאות בזמן משבר (אובדן עבודה, מחלה, תיקונים דחופים).',
                example: 'מומלץ לשמור 6-12 חודשי הוצאות בחשבון נפרד וזמין.',
                tips: ['קודם קרן חירום, אחר כך השקעות', 'להחזיק בחשבון חיסכון או פקדונות קצרים']
            },
            // Advanced Financial Concepts
            'monte-carlo': {
                title: 'סימולציית מונטה קרלו',
                content: 'שיטת חישוב שבודקת אלפי תרחישים אפשריים של תשואות שוק למציאת הסתברות ההצלחה.',
                example: 'במקום להניח תשואה קבועה של 7%, בודקים 1000 תרחישים שונים עם תשואות משתנות.',
                tips: ['מציאותי יותר מחישובים פשוטים', 'עוזר להבין את הסיכונים בתכנית']
            },
            'sequence-risk': {
                title: 'סיכון רצף תשואות',
                content: 'הסיכון שתשואות נמוכות בתחילת הפרישה יזיקו לכל התכנית הפיננסית.',
                example: 'מי שפרש ב-2008 נפגע יותר ממי שפרש ב-2009, למרות שהתשואה הכוללת זהה.',
                tips: ['חשוב לשמור יותר כסף נזיל בתחילת הפרישה', 'לשקול אסטרטגיית משיכה גמישה']
            },
            'withdrawal-strategy': {
                title: 'אסטרטגיית משיכה',
                content: 'התכנון של סדר ומתזמון משיכת הכסף מכלי החיסכון השונים בפרישה.',
                example: 'לרוב כדאי למשוך קודם מחיסכון רגיל, אחר כך מקרן השתלמות, ולבסוף מקרן פנסיה.',
                tips: ['סדר המשיכה משפיע על המס שתשלם', 'יעוץ מקצועי חשוב בנושא']
            },
            'tax-efficiency': {
                title: 'יעילות מס',
                content: 'תכנון השקעות ומשיכות באופן שממזער את הנטל המס הכולל.',
                example: 'השקעה בקרן פנסיה מפחיתה מס עכשיו, אבל תשלם מס על המשיכה בפרישה.',
                tips: ['כדאי לפזר משיכות על כמה שנים', 'לשקול מתזמון של השקעות ומשיכות']
            },
            // Financial Health Score Components
            'savings-rate-score': {
                title: 'ציון שיעור החיסכון',
                content: 'מודד את אחוז ההכנסה החודשית שאתה מחסיף לפנסיה. ציון גבוה יותר = חיסכון גבוה יותר.',
                example: 'אם אתה מחסיף 3,000₪ מתוך הכנסה של 15,000₪, שיעור החיסכון הוא 20% (ציון מצוין).',
                tips: ['מטרה: לפחות 15-20% מההכנסה', 'התחל בשיעור נמוך והגדל בהדרגה', 'השתמש בהעברה אוטומטית']
            },
            'retirement-readiness-score': {
                title: 'ציון מוכנות לפנסיה',
                content: 'מודד עד כמה אתה צפוי להגיע ליעד הפנסיה שלך בהתבסס על החיסכון הנוכחי.',
                example: 'אם יעד הפנסיה הוא 2 מיליון ₪ ואתה צפוי להגיע ל-1.8 מיליון ₪, הציון הוא 90%.',
                tips: ['ציון מתחת ל-70% דורש תיקונים', 'כל שנת עבודה נוספת משפרת משמעותית', 'שקול להקטין הוצאות בפנסיה']
            },
            'risk-alignment-score': {
                title: 'ציון התאמת סיכון',
                content: 'מודד עד כמה חלוקת ההשקעות מתאימה לגילך ולזמן שנותר עד הפנסיה.',
                example: 'בגיל 30: 70% מניות, 30% אג"ח. בגיל 60: 40% מניות, 60% אג"ח.',
                tips: ['צעירים יכולים לקחת יותר סיכון', 'מבוגרים צריכים יותר ביטחון', 'עדכן חלוקה כל 5 שנים']
            },
            'tax-efficiency-score': {
                title: 'ציון יעילות מס',
                content: 'מודד עד כמה אתה מנצל כלי חיסכון מוטבי מס כמו קרן פנסיה וקרן השתלמות.',
                example: 'ציון גבוה = מקסום הפקדות לקרן פנסיה וקרן השתלמות עד התקרה.',
                tips: ['מקסם קודם קרן פנסיה', 'אחר כך קרן השתלמות', 'לבסוף חיסכון רגיל']
            },
            'diversification-score': {
                title: 'ציון פיזור השקעות',
                content: 'מודד עד כמה ההשקעות מפוזרות בין נכסים, מטבעות ושווקים שונים.',
                example: 'פיזור טוב: 40% מניות ישראל, 30% מניות עולם, 20% אג"ח, 10% נדל"ן.',
                tips: ['אל תשקיע הכל במקום אחד', 'פזר בין גיאוגרפיות', 'השתמש בקרנות מדד']
            },
            'financial-health-score': {
                title: 'ציון בריאות פיננסית',
                content: 'ציון כולל המשלב את כל ההיבטים: חיסכון, מוכנות לפנסיה, סיכון, מס ופיזור.',
                example: 'ציון 85+ = מצוין, 70-84 = טוב, 50-69 = בינוני, מתחת ל-50 = דורש שיפור.',
                tips: ['התמקד בנושא עם הציון הנמוך ביותר', 'שיפור קטן בכל תחום = שיפור גדול בכלל', 'עדכן תכנון כל שנה']
            }
        },
        en: {
            // Basic Financial Terms
            'retirement-age': {
                title: 'Retirement Age',
                content: 'The age at which you plan to stop working and start living off your retirement savings.',
                example: 'In Israel, official retirement age is 67 for men and 62 for women, but you can retire earlier or later.',
                tips: ['Later retirement allows for more savings', 'One extra year of work = one less year of spending savings']
            },
            'inflation-rate': {
                title: 'Inflation Rate',
                content: 'The average annual increase in prices. Affects the purchasing power of money over time.',
                example: 'If inflation is 3% annually, a product costing 100₪ today will cost 103₪ next year.',
                tips: ['Average inflation in Israel is around 2-3% annually', 'Important to adjust expected returns for inflation']
            },
            'risk-tolerance': {
                title: 'Risk Tolerance',
                content: 'The degree to which you\'re willing to accept volatility in your investment portfolio in exchange for higher returns.',
                example: 'Low tolerance = more bonds, fewer stocks. High tolerance = more stocks.',
                tips: ['More time until retirement allows for more risk', 'Diversification reduces risk']
            },
            'compound-interest': {
                title: 'Compound Interest',
                content: 'The phenomenon where your returns earn returns themselves, creating exponential growth of capital.',
                example: '1,000₪ earning 10% annually becomes 1,100₪ in year 1, 1,210₪ in year 2.',
                tips: ['Starting early is most important', 'Each year of delay can cost thousands']
            },
            'training-fund': {
                title: 'Training Fund',
                content: 'Tax-advantaged savings for education purposes, withdrawable after 6 years for any purpose.',
                example: 'Contribution ceiling: 7.5% employer + 2.5% employee up to salary of 15,972₪/month.',
                tips: ['Can withdraw after 6 years tax-free', 'Worth contributing above ceiling if possible']
            },
            'pension-fund': {
                title: 'Pension Fund',
                content: 'Mandatory retirement savings with tax benefits, designed to provide monthly income after retirement.',
                example: 'Mandatory contribution: 6% employee + 6.5% employer from gross salary.',
                tips: ['Can contribute additional voluntary amount', 'Monthly or lump-sum withdrawal at retirement']
            },
            'rsu-options': {
                title: 'Stock Options & RSUs',
                content: 'Company stocks or rights to purchase at favorable prices, part of compensation package.',
                example: 'RSU = receiving free stocks gradually. Options = right to buy at fixed price.',
                tips: ['Important to diversify - don\'t hold only company stock', 'Different tax implications for each type']
            },
            'emergency-fund': {
                title: 'Emergency Fund',
                content: 'Liquid money to cover expenses during crisis (job loss, illness, urgent repairs).',
                example: 'Recommended to keep 6-12 months of expenses in separate, accessible account.',
                tips: ['Emergency fund first, then investments', 'Keep in savings account or short-term deposits']
            },
            // Advanced Financial Concepts
            'monte-carlo': {
                title: 'Monte Carlo Simulation',
                content: 'Calculation method that tests thousands of possible market return scenarios to find success probability.',
                example: 'Instead of assuming fixed 7% return, tests 1000 different scenarios with varying returns.',
                tips: ['More realistic than simple calculations', 'Helps understand risks in the plan']
            },
            'sequence-risk': {
                title: 'Sequence of Returns Risk',
                content: 'The risk that poor returns early in retirement will harm the entire financial plan.',
                example: 'Someone who retired in 2008 was hurt more than someone who retired in 2009, despite same total returns.',
                tips: ['Important to keep more liquid money early in retirement', 'Consider flexible withdrawal strategy']
            },
            'withdrawal-strategy': {
                title: 'Withdrawal Strategy',
                content: 'Planning the order and timing of withdrawing money from different savings vehicles in retirement.',
                example: 'Usually best to withdraw first from regular savings, then training fund, finally pension fund.',
                tips: ['Order of withdrawal affects taxes paid', 'Professional advice important on this topic']
            },
            'tax-efficiency': {
                title: 'Tax Efficiency',
                content: 'Planning investments and withdrawals to minimize overall tax burden.',
                example: 'Pension fund investment reduces tax now, but you\'ll pay tax on withdrawal at retirement.',
                tips: ['Worth spreading withdrawals over several years', 'Consider timing of investments and withdrawals']
            },
            // Financial Health Score Components
            'savings-rate-score': {
                title: 'Savings Rate Score',
                content: 'Measures the percentage of monthly income you save for retirement. Higher score = higher savings rate.',
                example: 'If you save 3,000₪ from 15,000₪ income, savings rate is 20% (excellent score).',
                tips: ['Target: at least 15-20% of income', 'Start low and increase gradually', 'Use automatic transfers']
            },
            'retirement-readiness-score': {
                title: 'Retirement Readiness Score',
                content: 'Measures how likely you are to reach your retirement goal based on current savings.',
                example: 'If retirement goal is 2 million ₪ and you\'re projected to reach 1.8 million ₪, score is 90%.',
                tips: ['Score below 70% requires adjustments', 'Each extra work year helps significantly', 'Consider reducing retirement expenses']
            },
            'risk-alignment-score': {
                title: 'Risk Alignment Score',
                content: 'Measures how well your investment allocation matches your age and time to retirement.',
                example: 'Age 30: 70% stocks, 30% bonds. Age 60: 40% stocks, 60% bonds.',
                tips: ['Young people can take more risk', 'Older people need more security', 'Rebalance every 5 years']
            },
            'tax-efficiency-score': {
                title: 'Tax Efficiency Score',
                content: 'Measures how well you utilize tax-advantaged savings tools like pension and training funds.',
                example: 'High score = maximizing pension fund and training fund contributions up to ceiling.',
                tips: ['Maximize pension fund first', 'Then training fund', 'Finally regular savings']
            },
            'diversification-score': {
                title: 'Diversification Score',
                content: 'Measures how well investments are spread across different assets, currencies, and markets.',
                example: 'Good diversification: 40% Israeli stocks, 30% global stocks, 20% bonds, 10% real estate.',
                tips: ['Don\'t put all eggs in one basket', 'Diversify geographically', 'Use index funds']
            },
            'financial-health-score': {
                title: 'Financial Health Score',
                content: 'Overall score combining all aspects: savings, retirement readiness, risk, tax, and diversification.',
                example: 'Score 85+ = excellent, 70-84 = good, 50-69 = fair, below 50 = needs improvement.',
                tips: ['Focus on lowest scoring area', 'Small improvement in each area = big overall improvement', 'Review plan annually']
            }
        }
    };

    const t = helpDatabase[language] || helpDatabase['en'];

    React.useEffect(() => {
        if (term && t[term]) {
            setHelpContent(t[term]);
        }
    }, [term, language]);

    const showTooltip = () => setIsVisible(true);
    const hideTooltip = () => setIsVisible(false);

    const getTooltipPosition = () => {
        const positions = {
            top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
            bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
            left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
            right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
        };
        return positions[position] || positions.top;
    };

    if (!helpContent) {
        return children;
    }

    return React.createElement('div', {
        className: 'relative inline-block',
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
        tabIndex: 0,
        role: 'button',
        'aria-describedby': `tooltip-${term}`,
        'aria-label': language === 'he' ? 'לחץ לעזרה' : 'Click for help'
    }, [
        // Trigger element with help icon
        React.createElement('span', {
            key: 'trigger',
            className: 'inline-flex items-center gap-1 cursor-help'
        }, [
            children,
            React.createElement('span', {
                key: 'help-icon',
                className: 'inline-flex items-center justify-center w-4 h-4 text-xs text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors',
                'aria-hidden': 'true'
            }, '?')
        ]),

        // Tooltip content
        isVisible && React.createElement('div', {
            key: 'tooltip',
            id: `tooltip-${term}`,
            className: `absolute z-50 ${getTooltipPosition()} w-80 max-w-sm`,
            role: 'tooltip'
        }, [
            React.createElement('div', {
                key: 'tooltip-content',
                className: 'bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm',
                style: { direction: language === 'he' ? 'rtl' : 'ltr' }
            }, [
                // Title
                React.createElement('h4', {
                    key: 'title',
                    className: 'font-bold text-gray-900 mb-2'
                }, helpContent.title),

                // Main content
                React.createElement('p', {
                    key: 'content',
                    className: 'text-gray-700 mb-3 leading-relaxed'
                }, helpContent.content),

                // Example
                helpContent.example && React.createElement('div', {
                    key: 'example',
                    className: 'mb-3'
                }, [
                    React.createElement('p', {
                        key: 'example-label',
                        className: 'font-semibold text-gray-800 mb-1'
                    }, language === 'he' ? 'דוגמה:' : 'Example:'),
                    React.createElement('p', {
                        key: 'example-text',
                        className: 'text-gray-600 italic'
                    }, helpContent.example)
                ]),

                // Tips
                helpContent.tips && helpContent.tips.length > 0 && React.createElement('div', {
                    key: 'tips'
                }, [
                    React.createElement('p', {
                        key: 'tips-label',
                        className: 'font-semibold text-gray-800 mb-1'
                    }, language === 'he' ? 'טיפים:' : 'Tips:'),
                    React.createElement('ul', {
                        key: 'tips-list',
                        className: 'text-gray-600 text-xs space-y-1'
                    }, helpContent.tips.map((tip, index) =>
                        React.createElement('li', {
                            key: index,
                            className: 'flex items-start'
                        }, [
                            React.createElement('span', {
                                key: 'bullet',
                                className: 'inline-block w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0'
                            }),
                            React.createElement('span', {
                                key: 'text'
                            }, tip)
                        ])
                    ))
                ])
            ]),

            // Arrow
            React.createElement('div', {
                key: 'arrow',
                className: `absolute w-2 h-2 bg-white border transform rotate-45 ${
                    position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-r-0 border-b-0' :
                    position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l-0 border-t-0' :
                    position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t-0 border-r-0' :
                    'right-full top-1/2 -translate-y-1/2 -mr-1 border-b-0 border-l-0'
                }`
            })
        ])
    ]);
};

// Enhanced wrapper for form labels with help
const LabelWithHelp = ({ label, helpTerm, required = false, language = 'en', children }) => {
    return React.createElement('div', {
        className: 'space-y-1'
    }, [
        React.createElement('label', {
            key: 'label',
            className: 'block text-sm font-medium text-gray-700'
        }, [
            React.createElement(HelpTooltip, {
                key: 'help',
                term: helpTerm,
                language: language
            }, [
                React.createElement('span', { key: 'text' }, label),
                required && React.createElement('span', {
                    key: 'required',
                    className: 'text-red-500 ml-1'
                }, '*')
            ])
        ]),
        children && React.createElement('div', { key: 'children' }, children)
    ]);
};

// Export to window for global access
window.HelpTooltip = HelpTooltip;
window.LabelWithHelp = LabelWithHelp;