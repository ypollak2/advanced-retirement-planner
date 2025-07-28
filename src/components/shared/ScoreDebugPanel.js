// src/components/shared/ScoreDebugPanel.js

const ScoreDebugPanel = ({ financialHealthScore, language = 'en' }) => {
    const createElement = React.createElement;

    if (!financialHealthScore || !financialHealthScore.factors) {
        return createElement('div', null, 'No financial health score data to display.');
    }

    const content = {
        he: {
            title: 'לוח ניפוי שגיאות - ציון בריאות פיננסית',
            inputsTitle: 'תשומות לחישוב'
        },
        en: {
            title: 'Score Debug Panel - Financial Health Score',
            inputsTitle: 'Inputs for Calculation'
        }
    };

    const t = content[language] || content.en;

    return createElement('div', { className: 'score-debug-panel' },
        createElement('h3', { className: 'debug-title' }, t.title),
        Object.entries(financialHealthScore.factors).map(([factorName, factorData]) => {
            return createElement('div', { key: factorName, className: 'factor-debug' },
                createElement('h4', null, factorName),
                createElement('p', null, `Score: ${factorData.score}`),
                createElement('h5', null, t.inputsTitle),
                createElement('ul', null,
                    Object.entries(factorData.details.debugInfo.fieldsUsed).map(([inputName, inputValue]) => {
                        return createElement('li', { key: inputName }, `${inputName}: ${JSON.stringify(inputValue)}`);
                    })
                )
            );
        })
    );
};

window.ScoreDebugPanel = ScoreDebugPanel;
