// AdvancedInputs.js - Advanced inputs section component
import React from 'react';

export const AdvancedInputs = ({ 
    inputs, 
    setInputs, 
    language, 
    t,
    workPeriods,
    setWorkPeriods,
    addWorkPeriod,
    removeWorkPeriod,
    updateWorkPeriod,
    countryData,
    formatCurrency,
    Settings,
    PiggyBank,
    DollarSign,
    TrendingUp,
    Building,
    Globe,
    Plus,
    Trash2
}) => {
    return (
        <div className="space-y-6">
            {/* Advanced Settings */}
            <div className="glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-orange-700 mb-6 flex items-center">
                    <Settings className="mr-2" />
                    {language === 'he' ? "הגדרות מתקדמות" : "Advanced Settings"}
                </h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'he' ? "הוצאות חודשיות נוכחיות (₪)" : "Current Monthly Expenses (₪)"}
                            </label>
                            <input
                                type="number"
                                value={inputs.currentMonthlyExpenses}
                                onChange={(e) => setInputs({...inputs, currentMonthlyExpenses: parseInt(e.target.value) || 0})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.retirementAge}
                            </label>
                            <input
                                type="number"
                                value={inputs.retirementAge}
                                onChange={(e) => setInputs({...inputs, retirementAge: parseInt(e.target.value) || 0})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'he' ? "חיסכון נוכחי בפנסיה (₪)" : "Current Pension Savings (₪)"}
                            </label>
                            <input
                                type="number"
                                value={inputs.currentSavings}
                                onChange={(e) => setInputs({...inputs, currentSavings: parseInt(e.target.value) || 0})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'he' ? "אינפלציה שנתית (%)" : "Annual Inflation (%)"}
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={inputs.inflationRate}
                                onChange={(e) => setInputs({...inputs, inflationRate: parseFloat(e.target.value) || 0})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'he' ? "יעד: החלפת % ממשכורת" : "Target: Replace % of Salary"}
                            </label>
                            <input
                                type="number"
                                value={inputs.targetReplacement}
                                onChange={(e) => setInputs({...inputs, targetReplacement: parseInt(e.target.value) || 0})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                            <div className="bg-blue-50 rounded-lg p-4 mt-3 border border-blue-200">
                                <h4 className="font-semibold text-blue-800 mb-2 text-sm flex items-center">
                                    <span className="mr-2">💡</span>
                                    {language === 'he' ? "מה זה אחוז יעד החלפה ממשכורת?" : "What is Salary Replacement Percentage?"}
                                </h4>
                                <div className="text-sm text-blue-700 space-y-2">
                                    <p>
                                        {language === 'he' 
                                            ? "זהו האחוז מהמשכורת הנוכחית שלך שתרצה לקבל כהכנסה חודשית בפנסיה."
                                            : "This is the percentage of your current salary you want to receive as monthly income in retirement."
                                        }
                                    </p>
                                    <div className="bg-white/70 rounded p-3 mt-2">
                                        <strong className="text-blue-800">
                                            {language === 'he' ? "דוגמה:" : "Example:"}
                                        </strong>
                                        <br />
                                        <span>
                                            {language === 'he' 
                                                ? `• משכורת נוכחית: ₪15,000 לחודש`
                                                : `• Current salary: ₪15,000 per month`}
                                        </span>
                                        <br />
                                        <span>
                                            {language === 'he' 
                                                ? `• יעד החלפה 75%: ₪11,250 לחודש בפנסיה`
                                                : `• 75% replacement target: ₪11,250 per month in retirement`}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <strong className="text-blue-800">
                                            {language === 'he' ? "המלצות נפוצות:" : "Common Recommendations:"}
                                        </strong>
                                        <ul className="list-disc list-inside mt-1 space-y-1">
                                            <li>{language === 'he' ? "70-80% - רמת חיים נוחה" : "70-80% - Comfortable lifestyle"}</li>
                                            <li>{language === 'he' ? "60-70% - רמת חיים בסיסית" : "60-70% - Basic lifestyle"}</li>
                                            <li>{language === 'he' ? "80-100% - שמירה על רמת החיים הנוכחית" : "80-100% - Maintain current lifestyle"}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                {language === 'he' ? "רמת סיכון" : "Risk Level"}
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['veryConservative', 'conservative', 'moderate', 'aggressive', 'veryAggressive'].map(risk => {
                                    const labels = {
                                        he: {
                                            veryConservative: 'שמרני מאוד',
                                            conservative: 'שמרני',
                                            moderate: 'מתון',
                                            aggressive: 'אגרסיבי',
                                            veryAggressive: 'אגרסיבי מאוד'
                                        },
                                        en: {
                                            veryConservative: 'Very Conservative',
                                            conservative: 'Conservative',
                                            moderate: 'Moderate',
                                            aggressive: 'Aggressive',
                                            veryAggressive: 'Very Aggressive'
                                        }
                                    };
                                    const multipliers = {
                                        veryConservative: '-30%',
                                        conservative: '-15%',
                                        moderate: '0%',
                                        aggressive: '+15%',
                                        veryAggressive: '+30%'
                                    };
                                    return (
                                        <button
                                            key={risk}
                                            onClick={() => setInputs({...inputs, riskTolerance: risk})}
                                            className={`p-3 rounded-lg border-2 transition-all text-center ${
                                                inputs.riskTolerance === risk 
                                                    ? 'border-orange-500 bg-orange-50 text-orange-700' 
                                                    : 'border-gray-200 bg-white hover:border-orange-300'
                                            }`}
                                        >
                                            <div className="font-medium text-sm">{labels[language][risk]}</div>
                                            <div className="text-xs text-gray-500 mt-1">{multipliers[risk]}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Training Fund Section */}
            <div className="glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
                    <PiggyBank className="mr-2" />
                    {language === 'he' ? "קרן השתלמות" : "Training Fund"}
                </h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'he' ? "יתרה נוכחית בקרן השתלמות (₪)" : "Current Training Fund Balance (₪)"}
                            </label>
                            <input
                                type="number"
                                value={inputs.currentTrainingFund}
                                onChange={(e) => setInputs({...inputs, currentTrainingFund: parseInt(e.target.value) || 0})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'he' ? "תשואה שנתית קרן השתלמות (%)" : "Training Fund Annual Return (%)"}
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={inputs.trainingFundReturn}
                                onChange={(e) => setInputs({...inputs, trainingFundReturn: parseFloat(e.target.value) || 0})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "דמי ניהול על הצבירה (%)" : "Management Fee on Accumulation (%)"}
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={inputs.trainingFundManagementFee}
                            onChange={(e) => setInputs({...inputs, trainingFundManagementFee: parseFloat(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="text-sm text-green-700">
                            <strong>{language === 'he' ? "תשואה נטו:" : "Net Return:"}</strong>
                            <span className="ml-2 font-bold text-lg">
                                {(inputs.trainingFundReturn - inputs.trainingFundManagementFee).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Salary and Income Section */}
            <div className="glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
                    <DollarSign className="mr-2" />
                    {language === 'he' ? "משכורת והכנסות" : "Salary and Income"}
                </h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'he' ? "משכורת חודשית נוכחית (₪)" : "Current Monthly Salary (₪)"}
                            </label>
                            <input
                                type="number"
                                value={inputs.currentMonthlySalary}
                                onChange={(e) => setInputs({...inputs, currentMonthlySalary: parseInt(e.target.value) || 0})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'he' ? "צמיחה שנתית צפויה במשכורת (%)" : "Expected Annual Salary Growth (%)"}
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={inputs.expectedSalaryGrowth}
                                onChange={(e) => setInputs({...inputs, expectedSalaryGrowth: parseFloat(e.target.value) || 0})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="text-sm text-blue-700">
                            <strong>{language === 'he' ? "משכורת שנתית נוכחית:" : "Current Annual Salary:"}</strong>
                            <span className="ml-2 font-bold text-lg">
                                ₪{(inputs.currentMonthlySalary * 12).toLocaleString()}
                            </span>
                            <br />
                            <strong>{language === 'he' ? "משכורת חודשית בפרישה (צפויה):" : "Monthly Salary at Retirement (Projected):"}</strong>
                            <span className="ml-2 font-bold text-lg">
                                ₪{Math.round(inputs.currentMonthlySalary * Math.pow(1 + inputs.expectedSalaryGrowth/100, inputs.retirementAge - inputs.currentAge)).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Family Planning Section */}
            <div className="glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-pink-700 mb-6 flex items-center">
                    <span className="mr-2">👨‍👩‍👧‍👦</span>
                    {language === 'he' ? "תכנון משפחתי וילדים" : "Family Planning & Children"}
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                        <input
                            type="checkbox"
                            id="family-planning-toggle"
                            checked={inputs.familyPlanningEnabled}
                            onChange={(e) => setInputs({...inputs, familyPlanningEnabled: e.target.checked})}
                            className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="family-planning-toggle" className="text-sm font-medium text-gray-700">
                            {language === 'he' ? "כלול תכנון משפחתי בחישוב" : "Include family planning in calculation"}
                        </label>
                    </div>
                    
                    {inputs.familyPlanningEnabled && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {language === 'he' ? "מספר ילדים מתוכנן" : "Number of Planned Children"}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={inputs.numberOfChildren}
                                        onChange={(e) => setInputs({...inputs, numberOfChildren: parseInt(e.target.value) || 0})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {language === 'he' ? "עלות חודשית לילד (₪)" : "Monthly Cost per Child (₪)"}
                                    </label>
                                    <input
                                        type="number"
                                        value={inputs.childCostMonthly}
                                        onChange={(e) => setInputs({...inputs, childCostMonthly: parseInt(e.target.value) || 0})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            
                            {inputs.numberOfChildren >= 1 && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {language === 'he' ? "שנת לידה ילד ראשון" : "First Child Birth Year"}
                                        </label>
                                        <input
                                            type="number"
                                            min={new Date().getFullYear()}
                                            max={new Date().getFullYear() + 20}
                                            value={inputs.childBirthYear1}
                                            onChange={(e) => setInputs({...inputs, childBirthYear1: parseInt(e.target.value) || new Date().getFullYear()})}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    {inputs.numberOfChildren >= 2 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {language === 'he' ? "שנת לידה ילד שני" : "Second Child Birth Year"}
                                            </label>
                                            <input
                                                type="number"
                                                min={new Date().getFullYear()}
                                                max={new Date().getFullYear() + 25}
                                                value={inputs.childBirthYear2}
                                                onChange={(e) => setInputs({...inputs, childBirthYear2: parseInt(e.target.value) || new Date().getFullYear()})}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {language === 'he' ? "שנות תמיכה כלכלית לילד" : "Years of Financial Support per Child"}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="30"
                                        value={inputs.childCostYears}
                                        onChange={(e) => setInputs({...inputs, childCostYears: parseInt(e.target.value) || 18})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {language === 'he' ? "קרן חינוך לילד (₪)" : "Education Fund per Child (₪)"}
                                    </label>
                                    <input
                                        type="number"
                                        value={inputs.childEducationFund}
                                        onChange={(e) => setInputs({...inputs, childEducationFund: parseInt(e.target.value) || 0})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                                <h4 className="font-bold text-pink-800 mb-2">
                                    {language === 'he' ? "סיכום עלויות משפחתיות:" : "Family Cost Summary:"}
                                </h4>
                                <div className="text-sm text-pink-700 space-y-1">
                                    <div>
                                        <strong>{language === 'he' ? "עלות חודשית כוללת:" : "Total Monthly Cost:"}</strong>
                                        <span className="ml-2 font-bold">
                                            ₪{(inputs.childCostMonthly * inputs.numberOfChildren).toLocaleString()}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>{language === 'he' ? "עלות שנתית כוללת:" : "Total Annual Cost:"}</strong>
                                        <span className="ml-2 font-bold">
                                            ₪{(inputs.childCostMonthly * inputs.numberOfChildren * 12).toLocaleString()}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>{language === 'he' ? "קרנות חינוך כוללת:" : "Total Education Funds:"}</strong>
                                        <span className="ml-2 font-bold">
                                            ₪{(inputs.childEducationFund * inputs.numberOfChildren).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t border-pink-300 mt-2">
                                        <strong>{language === 'he' ? "עלות כוללת למשפחה:" : "Total Family Cost:"}</strong>
                                        <span className="ml-2 font-bold text-lg">
                                            ₪{((inputs.childCostMonthly * inputs.numberOfChildren * 12 * inputs.childCostYears) + (inputs.childEducationFund * inputs.numberOfChildren)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Personal Portfolio Section */}
            <div className="glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center">
                    <DollarSign className="mr-2" />
                    {language === 'he' ? "תיק השקעות אישי" : "Personal Investment Portfolio"}
                </h2>
                <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-200">
                    <p className="text-sm text-purple-700 mb-2">
                        <strong>{language === 'he' ? "חשוב לדעת:" : "Important to Know:"}</strong>
                        <span className="block mt-1">
                            {language === 'he' ? "השקעות אישיות אינן זוכות להטבות מס כמו פנסיה וקרן השתלמות" : "Personal investments don't receive tax benefits like pension and training funds"}
                        </span>
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "צבירה נוכחית (₪)" : "Current Accumulation (₪)"}
                        </label>
                        <input
                            type="number"
                            value={inputs.currentPersonalPortfolio}
                            onChange={(e) => setInputs({...inputs, currentPersonalPortfolio: parseInt(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "השקעה חודשית (₪)" : "Monthly Investment (₪)"}
                        </label>
                        <input
                            type="number"
                            value={inputs.personalPortfolioMonthly}
                            onChange={(e) => setInputs({...inputs, personalPortfolioMonthly: parseInt(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "תשואה מוערכת (%)" : "Expected Return (%)"}
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={inputs.personalPortfolioReturn}
                            onChange={(e) => setInputs({...inputs, personalPortfolioReturn: parseFloat(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "מס רווחי הון (%)" : "Capital Gains Tax (%)"}
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={inputs.personalPortfolioTaxRate}
                            onChange={(e) => setInputs({...inputs, personalPortfolioTaxRate: parseFloat(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>
            </div>
            
            {/* Cryptocurrency Portfolio */}
            <div className="glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-orange-700 mb-6 flex items-center">
                    <TrendingUp className="mr-2" />
                    {language === 'he' ? "תיק מטבעות דיגיטליים" : "Cryptocurrency Portfolio"}
                </h2>
                <div className="bg-orange-50 rounded-lg p-4 mb-6 border border-orange-200">
                    <p className="text-sm text-orange-700 mb-2">
                        <strong>{language === 'he' ? "שים לב:" : "Important:"}</strong>
                        <span className="block mt-1">
                            {language === 'he' ? "השקעות בקריפטו הן בסיכון גבוה ועלולות לחוות תנודתיות קיצונית" : "Crypto investments are high risk and may experience extreme volatility"}
                        </span>
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "צבירה נוכחית (₪)" : "Current Holdings (₪)"}
                        </label>
                        <input
                            type="number"
                            value={inputs.currentCrypto}
                            onChange={(e) => setInputs({...inputs, currentCrypto: parseInt(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "השקעה חודשית (₪)" : "Monthly Investment (₪)"}
                        </label>
                        <input
                            type="number"
                            value={inputs.cryptoMonthly}
                            onChange={(e) => setInputs({...inputs, cryptoMonthly: parseInt(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "תשואה מוערכת (%)" : "Expected Return (%)"}
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={inputs.cryptoReturn}
                            onChange={(e) => setInputs({...inputs, cryptoReturn: parseFloat(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "מס רווחי הון (%)" : "Capital Gains Tax (%)"}
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={inputs.cryptoTaxRate}
                            onChange={(e) => setInputs({...inputs, cryptoTaxRate: parseFloat(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>
            </div>
            
            {/* Real Estate Investment */}
            <div className="glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-emerald-700 mb-6 flex items-center">
                    <Building className="mr-2" />
                    {language === 'he' ? "השקעות נדל\"ן" : "Real Estate Investment"}
                </h2>
                <div className="bg-emerald-50 rounded-lg p-4 mb-6 border border-emerald-200">
                    <p className="text-sm text-emerald-700 mb-2">
                        <strong>{language === 'he' ? "כולל:" : "Includes:"}</strong>
                        <span className="block mt-1">
                            {language === 'he' ? "עליית ערך הנכס ודמי שכירות חודשיים" : "Property appreciation and monthly rental income"}
                        </span>
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "השקעה נוכחית (₪)" : "Current Investment (₪)"}
                        </label>
                        <input
                            type="number"
                            value={inputs.currentRealEstate}
                            onChange={(e) => setInputs({...inputs, currentRealEstate: parseInt(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "השקעה חודשית (₪)" : "Monthly Investment (₪)"}
                        </label>
                        <input
                            type="number"
                            value={inputs.realEstateMonthly}
                            onChange={(e) => setInputs({...inputs, realEstateMonthly: parseInt(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "עליית ערך שנתית (%)" : "Annual Appreciation (%)"}
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={inputs.realEstateReturn}
                            onChange={(e) => setInputs({...inputs, realEstateReturn: parseFloat(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "תשואת השכרה (%)" : "Rental Yield (%)"}
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={inputs.realEstateRentalYield}
                            onChange={(e) => setInputs({...inputs, realEstateRentalYield: parseFloat(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "מס רווחי הון (%)" : "Capital Gains Tax (%)"}
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={inputs.realEstateTaxRate}
                            onChange={(e) => setInputs({...inputs, realEstateTaxRate: parseFloat(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>
            </div>
            
            {/* Emergency Fund Section */}
            <div className="glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
                    <span className="mr-2 text-2xl">🛡️</span>
                    {language === 'he' ? "קרן חירום" : "Emergency Fund"}
                </h2>
                <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
                    <p className="text-sm text-red-700 mb-2">
                        <strong>{language === 'he' ? "חשיבות קרן החירום:" : "Importance of Emergency Fund:"}</strong>
                        <span className="block mt-1">
                            {language === 'he' ? "קרן חירום מספקת ביטחון פיננסי במקרה של אובדן הכנסה או הוצאות בלתי צפויות" : "Emergency fund provides financial security in case of income loss or unexpected expenses"}
                        </span>
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "קרן חירום נוכחית (₪)" : "Current Emergency Fund (₪)"}
                        </label>
                        <input
                            type="number"
                            value={inputs.currentEmergencyFund}
                            onChange={(e) => setInputs({...inputs, currentEmergencyFund: parseInt(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "יעד חודשי הוצאות" : "Target Months Coverage"}
                        </label>
                        <select
                            value={inputs.emergencyFundTarget}
                            onChange={(e) => setInputs({...inputs, emergencyFundTarget: parseInt(e.target.value)})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        >
                            <option value={3}>{language === 'he' ? "3 חודשים (מינימום)" : "3 months (minimum)"}</option>
                            <option value={6}>{language === 'he' ? "6 חודשים (מומלץ)" : "6 months (recommended)"}</option>
                            <option value={9}>{language === 'he' ? "9 חודשים (שמרני)" : "9 months (conservative)"}</option>
                            <option value={12}>{language === 'he' ? "12 חודשים (מאוד שמרני)" : "12 months (very conservative)"}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'he' ? "הפקדה חודשית (₪)" : "Monthly Contribution (₪)"}
                        </label>
                        <input
                            type="number"
                            value={inputs.emergencyFundMonthly}
                            onChange={(e) => setInputs({...inputs, emergencyFundMonthly: parseInt(e.target.value) || 0})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>
                {/* Emergency Fund Analysis */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                        {language === 'he' ? "ניתוח קרן החירום:" : "Emergency Fund Analysis:"}
                    </h4>
                    {(() => {
                        const targetAmount = inputs.currentMonthlyExpenses * inputs.emergencyFundTarget;
                        const currentCoverage = inputs.currentMonthlyExpenses > 0 ? 
                            (inputs.currentEmergencyFund / inputs.currentMonthlyExpenses).toFixed(1) : 0;
                        const gap = Math.max(0, targetAmount - inputs.currentEmergencyFund);
                        const monthsToTarget = inputs.emergencyFundMonthly > 0 ? 
                            Math.ceil(gap / inputs.emergencyFundMonthly) : 0;
                        
                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>{language === 'he' ? "יעד הקרן:" : "Target Fund:"}</span>
                                        <span className="font-semibold">{formatCurrency(targetAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{language === 'he' ? "כיסוי נוכחי:" : "Current Coverage:"}</span>
                                        <span className={`font-semibold ${currentCoverage >= inputs.emergencyFundTarget ? 'text-green-600' : 'text-red-600'}`}>
                                            {currentCoverage} {language === 'he' ? 'חודשים' : 'months'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>{language === 'he' ? "פער לכיסוי:" : "Gap to Cover:"}</span>
                                        <span className="font-semibold">{formatCurrency(gap)}</span>
                                    </div>
                                    {gap > 0 && inputs.emergencyFundMonthly > 0 && (
                                        <div className="flex justify-between">
                                            <span>{language === 'he' ? "זמן להשגת יעד:" : "Time to Target:"}</span>
                                            <span className="font-semibold text-blue-600">
                                                {monthsToTarget} {language === 'he' ? 'חודשים' : 'months'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
            
            {/* Work Periods */}
            <div className="glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-700 flex items-center">
                        <Globe className="mr-2" />
                        {t.workPeriods}
                    </h2>
                    <button
                        onClick={addWorkPeriod}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg flex items-center hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
                    >
                        <Plus size={16} className="mr-1" />
                        {t.addPeriod}
                    </button>
                </div>
                <div className="space-y-4">
                    {workPeriods.map((period, index) => (
                        <div
                            key={period.id}
                            className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-blue-50 animate-fade-in"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-800">
                                    {language === 'he' ? `תקופה ${index + 1}` : `Period ${index + 1}`}
                                </h3>
                                {workPeriods.length > 1 && (
                                    <button
                                        onClick={() => removeWorkPeriod(period.id)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        {language === 'he' ? "מגיל" : "From Age"}
                                    </label>
                                    <input
                                        type="number"
                                        value={period.startAge}
                                        onChange={(e) => updateWorkPeriod(period.id, 'startAge', parseInt(e.target.value) || 0)}
                                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        {language === 'he' ? "עד גיל" : "To Age"}
                                    </label>
                                    <input
                                        type="number"
                                        value={period.endAge}
                                        onChange={(e) => updateWorkPeriod(period.id, 'endAge', parseInt(e.target.value) || 0)}
                                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    {language === 'he' ? "מדינה" : "Country"}
                                </label>
                                <select
                                    value={period.country}
                                    onChange={(e) => updateWorkPeriod(period.id, 'country', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                                >
                                    {Object.entries(countryData).map(([code, data]) => (
                                        <option key={code} value={code}>
                                            {data.flag} {data.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};