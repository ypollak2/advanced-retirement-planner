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
            
            {/* Partner Planning Section */}
            <div className="glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-orange-700 mb-6 flex items-center">
                    <span className="mr-2">🤝</span>
                    {language === 'he' ? "תכנון פרישה משותף" : "Partner Planning"}
                </h2>
                
                <div className="bg-orange-50 rounded-lg p-4 mb-6 border border-orange-200">
                    <p className="text-sm text-orange-700 mb-2">
                        {language === 'he' ? 
                            "הגדר פרטי בן/בת הזוג שלך לתכנון פרישה משותף מקיף" : 
                            "Configure your partner's details for comprehensive joint retirement planning"}
                    </p>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="partnerPlanning"
                            checked={inputs.partnerPlanningEnabled}
                            onChange={(e) => setInputs({...inputs, partnerPlanningEnabled: e.target.checked})}
                            className="mr-3 h-5 w-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                        />
                        <label htmlFor="partnerPlanning" className="text-sm font-medium text-gray-700">
                            {language === 'he' ? "אפשר תכנון פרישה לבן/בת הזוג" : "Enable partner retirement planning"}
                        </label>
                    </div>
                    
                    {inputs.partnerPlanningEnabled && (
                        <div className="mt-4 space-y-4 border-t pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {language === 'he' ? "גיל נוכחי של בן/בת הזוג" : "Partner's Current Age"}
                                    </label>
                                    <input
                                        type="number"
                                        value={inputs.partnerCurrentAge}
                                        onChange={(e) => setInputs({...inputs, partnerCurrentAge: parseInt(e.target.value) || 0})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {language === 'he' ? "גיל פרישה של בן/בת הזוג" : "Partner's Retirement Age"}
                                    </label>
                                    <input
                                        type="number"
                                        value={inputs.partnerRetirementAge}
                                        onChange={(e) => setInputs({...inputs, partnerRetirementAge: parseInt(e.target.value) || 0})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {language === 'he' ? "חיסכון נוכחי בפנסיה של בן/בת הזוג (₪)" : "Partner's Current Pension Savings (₪)"}
                                    </label>
                                    <input
                                        type="number"
                                        value={inputs.partnerCurrentSavings}
                                        onChange={(e) => setInputs({...inputs, partnerCurrentSavings: parseInt(e.target.value) || 0})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {language === 'he' ? "מכלול הכנסות חודשיות נוכחי של בן/בת הזוג (₪)" : "Partner's Current Monthly Salary (₪)"}
                                    </label>
                                    <input
                                        type="number"
                                        value={inputs.partnerCurrentSalary}
                                        onChange={(e) => setInputs({...inputs, partnerCurrentSalary: parseInt(e.target.value) || 0})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {language === 'he' ? "יתרת קרן הכשרה נוכחית של בן/בת הזוג (₪)" : "Partner's Current Training Fund Balance (₪)"}
                                    </label>
                                    <input
                                        type="number"
                                        value={inputs.partnerCurrentTrainingFund}
                                        onChange={(e) => setInputs({...inputs, partnerCurrentTrainingFund: parseInt(e.target.value) || 0})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {language === 'he' ? "הוצאות חודשיות משותפות (₪)" : "Joint Monthly Expenses (₪)"}
                                    </label>
                                    <input
                                        type="number"
                                        value={inputs.jointMonthlyExpenses}
                                        onChange={(e) => setInputs({...inputs, jointMonthlyExpenses: parseInt(e.target.value) || 0})}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
                                <div className="text-sm text-orange-700">
                                    <p className="font-medium mb-1">
                                        {language === 'he' ? "הכנסה שנתית של בן/בת הזוג:" : "Partner's Annual Income:"}
                                    </p>
                                    <p className="text-lg font-bold">
                                        {(inputs.partnerCurrentSalary * 12).toLocaleString()} ₪
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Save/Load Personal Data Section */}
            <div className="glass-effect rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-teal-700 mb-6 flex items-center">
                    <span className="mr-2">💾</span>
                    {language === 'he' ? "שמירה וטעינת נתונים" : "Save & Load Data"}
                </h2>
                
                <div className="bg-teal-50 rounded-lg p-4 mb-6 border border-teal-200">
                    <p className="text-sm text-teal-700 mb-2">
                        {language === 'he' ? 
                            "שמור או טען את הנתונים הפיננסיים האישיים שלך לשימוש עתידי" : 
                            "Save or load your personal financial data for future use"}
                    </p>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <button
                                onClick={() => {
                                    const dataToSave = {
                                        inputs,
                                        workPeriods: window.retirementPlannerState?.workPeriods || [],
                                        partnerWorkPeriods: window.retirementPlannerState?.partnerWorkPeriods || [],
                                        pensionIndexAllocation: window.retirementPlannerState?.pensionIndexAllocation || [],
                                        trainingFundIndexAllocation: window.retirementPlannerState?.trainingFundIndexAllocation || [],
                                        savedDate: new Date().toISOString()
                                    };
                                    const dataStr = JSON.stringify(dataToSave, null, 2);
                                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                                    const url = URL.createObjectURL(dataBlob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `retirement-plan-${new Date().toISOString().split('T')[0]}.json`;
                                    link.click();
                                    URL.revokeObjectURL(url);
                                }}
                                className="w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium flex items-center justify-center"
                            >
                                <span className="mr-2">💾</span>
                                {language === 'he' ? "הורד נתונים" : "Download Data"}
                            </button>
                        </div>
                        <div>
                            <label className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center cursor-pointer">
                                <span className="mr-2">📁</span>
                                {language === 'he' ? "טען נתונים" : "Load Data"}
                                <input
                                    type="file"
                                    accept=".json"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                try {
                                                    const loadedData = JSON.parse(event.target.result);
                                                    if (loadedData.inputs) {
                                                        setInputs(loadedData.inputs);
                                                    }
                                                    if (loadedData.workPeriods && window.retirementPlannerState?.setWorkPeriods) {
                                                        window.retirementPlannerState.setWorkPeriods(loadedData.workPeriods);
                                                    }
                                                    if (loadedData.partnerWorkPeriods && window.retirementPlannerState?.setPartnerWorkPeriods) {
                                                        window.retirementPlannerState.setPartnerWorkPeriods(loadedData.partnerWorkPeriods);
                                                    }
                                                    if (loadedData.pensionIndexAllocation && window.retirementPlannerState?.setPensionIndexAllocation) {
                                                        window.retirementPlannerState.setPensionIndexAllocation(loadedData.pensionIndexAllocation);
                                                    }
                                                    if (loadedData.trainingFundIndexAllocation && window.retirementPlannerState?.setTrainingFundIndexAllocation) {
                                                        window.retirementPlannerState.setTrainingFundIndexAllocation(loadedData.trainingFundIndexAllocation);
                                                    }
                                                    alert(language === 'he' ? 'הנתונים נטענו בהצלחה!' : 'Data loaded successfully!');
                                                } catch (error) {
                                                    console.error('Error loading data:', error);
                                                    alert(language === 'he' ? 'שגיאה בטעינת הנתונים' : 'Error loading data');
                                                }
                                            };
                                            reader.readAsText(file);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200">
                        <div className="text-sm text-teal-700">
                            <p className="font-medium mb-1">
                                {language === 'he' ? "הערה חשובה:" : "Important Note:"}
                            </p>
                            <p>
                                {language === 'he' ? 
                                    "הנתונים נשמרים כקובץ JSON על המחשב שלך ולא נשלחים לשרת" : 
                                    "Data is saved as a JSON file on your computer and not sent to any server"}
                            </p>
                        </div>
                    </div>
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