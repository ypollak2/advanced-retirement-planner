// Market constants for GitHub Pages compatibility
window.exchangeRates = {
    USD: 3.37,
    GBP: 4.60,
    EUR: 3.60
};

window.countryData = {
    israel: {
        name: 'Israel',
        pensionTax: 0.15,
        socialSecurity: 2500,
        flag: '🇮🇱'
    },
    usa: {
        name: 'USA',
        pensionTax: 0.12,
        socialSecurity: 1800,
        flag: '🇺🇸'
    },
    uk: {
        name: 'UK',
        pensionTax: 0.20,
        socialSecurity: 1400,
        flag: '🇬🇧'
    },
    germany: {
        name: 'Germany',
        pensionTax: 0.22,
        socialSecurity: 1500,
        flag: '🇩🇪'
    },
    france: {
        name: 'France',
        pensionTax: 0.18,
        socialSecurity: 1600,
        flag: '🇫🇷'
    }
};

window.historicalReturns = {
    5: {
        'Tel Aviv 35': 8.2,
        'S&P 500': 11.3,
        'NASDAQ': 13.1,
        'Government Bonds': 3.8,
        'Corporate Bonds': 5.2,
        'Real Estate': 6.5,
        'Gold': 4.1,
        'Commodities': 3.9
    },
    10: {
        'Tel Aviv 35': 7.8,
        'S&P 500': 10.9,
        'NASDAQ': 12.7,
        'Government Bonds': 4.2,
        'Corporate Bonds': 5.8,
        'Real Estate': 7.1,
        'Gold': 5.2,
        'Commodities': 4.5
    },
    15: {
        'Tel Aviv 35': 7.5,
        'S&P 500': 10.5,
        'NASDAQ': 11.8,
        'Government Bonds': 4.5,
        'Corporate Bonds': 6.1,
        'Real Estate': 7.3,
        'Gold': 5.8,
        'Commodities': 5.1
    },
    20: {
        'Tel Aviv 35': 7.2,
        'S&P 500': 10.0,
        'NASDAQ': 11.2,
        'Government Bonds': 4.8,
        'Corporate Bonds': 6.4,
        'Real Estate': 7.5,
        'Gold': 6.2,
        'Commodities': 5.4
    },
    25: {
        'Tel Aviv 35': 6.9,
        'S&P 500': 9.7,
        'NASDAQ': 10.8,
        'Government Bonds': 5.0,
        'Corporate Bonds': 6.6,
        'Real Estate': 7.6,
        'Gold': 6.4,
        'Commodities': 5.6
    },
    30: {
        'Tel Aviv 35': 6.7,
        'S&P 500': 9.5,
        'NASDAQ': 10.5,
        'Government Bonds': 5.2,
        'Corporate Bonds': 6.8,
        'Real Estate': 7.8,
        'Gold': 6.6,
        'Commodities': 5.8
    }
};

window.indexNames = {
    'Tel Aviv 35': { he: 'ת"א 35', en: 'Tel Aviv 35' },
    'S&P 500': { he: 'S&P 500', en: 'S&P 500' },
    'NASDAQ': { he: 'נאסד"ק', en: 'NASDAQ' },
    'Government Bonds': { he: 'אג"ח ממשלתיות', en: 'Government Bonds' },
    'Corporate Bonds': { he: 'אג"ח קונצרניות', en: 'Corporate Bonds' },
    'Real Estate': { he: 'נדל"ן', en: 'Real Estate' },
    'Gold': { he: 'זהב', en: 'Gold' },
    'Commodities': { he: 'סחורות', en: 'Commodities' }
};

window.riskScenarios = {
    veryConservative: { 
        multiplier: 0.7, 
        name: { he: 'שמרני מאוד', en: 'Very Conservative' },
        description: { he: 'סיכון נמוך מאוד, תשואה נמוכה', en: 'Very low risk, low return' }
    },
    conservative: { 
        multiplier: 0.85, 
        name: { he: 'שמרני', en: 'Conservative' },
        description: { he: 'סיכון נמוך, תשואה מתונה', en: 'Low risk, moderate return' }
    },
    moderate: { 
        multiplier: 1.0, 
        name: { he: 'בינוני', en: 'Moderate' },
        description: { he: 'סיכון בינוני, תשואה סטנדרטית', en: 'Moderate risk, standard return' }
    },
    aggressive: { 
        multiplier: 1.15, 
        name: { he: 'אגרסיבי', en: 'Aggressive' },
        description: { he: 'סיכון גבוה, תשואה גבוהה', en: 'High risk, high return' }
    },
    veryAggressive: { 
        multiplier: 1.3, 
        name: { he: 'אגרסיבי מאוד', en: 'Very Aggressive' },
        description: { he: 'סיכון גבוה מאוד, תשואה גבוהה מאוד', en: 'Very high risk, very high return' }
    }
};