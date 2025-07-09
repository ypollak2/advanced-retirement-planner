// BasicInputs.js - Basic inputs section component
import React from 'react';

export const BasicInputs = ({ 
    inputs, 
    setInputs, 
    language, 
    t, 
    Calculator, 
    PiggyBank, 
    DollarSign 
}) => {
    return (
        <div className="space-y-6">
            {/* Basic Data Section */}
            <div className="glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center">
                    <Calculator className="mr-2" />
                    {t.basic}
                </h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.currentAge}
                            </label>
                            <input
                                type="number"
                                value={inputs.currentAge}
                                onChange={(e) => setInputs({...inputs, currentAge: parseInt(e.target.value) || 0})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
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
                            {language === 'he' ? "תשואה שנתית צפויה (%)" : "Expected Annual Return (%)"}
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
                            {language === 'he' ? "שיעור מס על רווחי הון (%)" : "Capital Gains Tax Rate (%)"}
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
        </div>
    );
};