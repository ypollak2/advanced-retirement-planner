// src/components/shared/ScoreDebugPanel.js

const ScoreDebugPanel = ({ financialHealthScore, inputs, language = 'en' }) => {
    const createElement = React.createElement;

    if (!financialHealthScore) {
        return createElement('div', { 
            className: 'bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4'
        }, [
            createElement('h4', {
                key: 'title',
                className: 'font-semibold text-yellow-800 mb-2'
            }, 'Financial Health Score Debug - No Data'),
            createElement('p', {
                key: 'message',
                className: 'text-yellow-700'
            }, 'No financial health score data available. Check if scoring engine is loaded.')
        ]);
    }

    const content = {
        he: {
            title: 'לוח ניפוי שגיאות - ציון בריאות פיננסית',
            inputsTitle: 'תשומות לחישוב',
            originalInputs: 'נתונים מקוריים',
            mappedInputs: 'נתונים ממופים',
            totalScore: 'ציון כולל',
            factors: 'גורמים'
        },
        en: {
            title: 'Financial Health Score Debug Panel',
            inputsTitle: 'Key Inputs Detected',
            originalInputs: 'Original Inputs',
            mappedInputs: 'Mapped Inputs',
            totalScore: 'Total Score',
            factors: 'Score Factors'
        }
    };

    const t = content[language] || content.en;
    
    // Key inputs to check
    const keyInputs = [
        'currentMonthlySalary',
        'pensionContributionRate', 
        'trainingFundContributionRate',
        'emergencyFund',
        'currentMonthlyExpenses',
        'riskTolerance',
        'planningType'
    ];

    return createElement('div', { 
        className: 'bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-xs'
    }, [
        createElement('h3', { 
            key: 'title',
            className: 'font-semibold text-gray-800 mb-3 text-sm'
        }, t.title),
        
        createElement('div', {
            key: 'score-summary',
            className: 'mb-4 p-3 bg-white rounded border'
        }, [
            createElement('h4', { 
                key: 'score-title',
                className: 'font-medium text-gray-700 mb-2'
            }, `${t.totalScore}: ${financialHealthScore.totalScore || 0}/100`),
            
            createElement('div', {
                key: 'factors-grid',
                className: 'grid grid-cols-2 gap-2 text-xs'
            }, Object.entries(financialHealthScore.factors || {}).map(([factorName, factorData]) => 
                createElement('div', { 
                    key: factorName,
                    className: 'flex justify-between'
                }, [
                    createElement('span', { key: 'name' }, factorName),
                    createElement('span', { 
                        key: 'score',
                        className: factorData.score === 0 ? 'text-red-600 font-medium' : 'text-green-600'
                    }, `${factorData.score || 0}`)
                ])
            ))
        ]),
        
        createElement('div', {
            key: 'inputs-debug',
            className: 'p-3 bg-white rounded border'
        }, [
            createElement('h4', { 
                key: 'inputs-title',
                className: 'font-medium text-gray-700 mb-2'
            }, t.inputsTitle),
            
            createElement('div', {
                key: 'inputs-list',
                className: 'space-y-1'
            }, keyInputs.map(inputKey => {
                const value = inputs?.[inputKey];
                const hasValue = value !== undefined && value !== null && value !== '' && value !== 0;
                
                return createElement('div', { 
                    key: inputKey,
                    className: `flex justify-between ${hasValue ? 'text-green-700' : 'text-red-600'}`
                }, [
                    createElement('span', { key: 'key' }, inputKey),
                    createElement('span', { 
                        key: 'value',
                        className: 'font-mono'
                    }, hasValue ? JSON.stringify(value) : '❌ Missing')
                ]);
            }))
        ])
    ]);
};

window.ScoreDebugPanel = ScoreDebugPanel;
