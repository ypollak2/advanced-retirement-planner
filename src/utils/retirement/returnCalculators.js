// Return Calculators Module
// Investment return and allocation calculations

window.getNetReturn = (grossReturn, managementFee) => {
    return grossReturn - managementFee;
};

window.calculateWeightedReturn = (allocations, timeHorizon = 20, historicalReturns) => {
    // Add comprehensive null/undefined checks to prevent crashes
    if (!allocations || !Array.isArray(allocations) || allocations.length === 0) {
        console.warn('calculateWeightedReturn: Invalid or empty allocations array provided', allocations);
        return 0;
    }
    
    if (!historicalReturns || typeof historicalReturns !== 'object') {
        console.warn('calculateWeightedReturn: Invalid historicalReturns object', historicalReturns);
        return 0;
    }
    
    let totalWeight = 0;
    let weightedReturn = 0;
    
    allocations.forEach(allocation => {
        // Add null checks for each allocation object
        if (!allocation || typeof allocation !== 'object') {
            console.warn('calculateWeightedReturn: Invalid allocation object', allocation);
            return;
        }
        
        const assetClass = allocation.assetClass || allocation.name || allocation.type;
        const weight = parseFloat(allocation.allocation || allocation.percentage || allocation.weight || 0) / 100;
        
        if (!assetClass || isNaN(weight)) {
            console.warn('calculateWeightedReturn: Invalid allocation data', { assetClass, weight });
            return;
        }
        
        totalWeight += weight;
        
        // Check if historicalReturns has the required data
        if (historicalReturns[assetClass]) {
            const returnData = historicalReturns[assetClass];
            
            // Handle different data structures
            let averageReturn = 0;
            if (typeof returnData === 'number') {
                averageReturn = returnData;
            } else if (returnData.average !== undefined) {
                averageReturn = returnData.average;
            } else if (returnData.mean !== undefined) {
                averageReturn = returnData.mean;
            } else if (returnData.expectedReturn !== undefined) {
                averageReturn = returnData.expectedReturn;
            } else {
                console.warn(`calculateWeightedReturn: No valid return data for asset class ${assetClass}`, returnData);
            }
            
            weightedReturn += weight * averageReturn;
        } else {
            console.warn(`calculateWeightedReturn: No historical return data for asset class ${assetClass}`);
        }
    });
    
    // Normalize if weights don't sum to 1
    if (totalWeight > 0 && totalWeight !== 1) {
        console.info(`calculateWeightedReturn: Normalizing weights from ${totalWeight} to 1`);
        weightedReturn = weightedReturn / totalWeight;
    }
    
    return weightedReturn;
};

window.calculateDynamicReturn = (portfolio, timeUntilRetirement, riskProfile) => {
    if (!portfolio || typeof portfolio !== 'object') {
        console.warn('calculateDynamicReturn: Invalid portfolio object', portfolio);
        return 0;
    }
    
    if (timeUntilRetirement === undefined || timeUntilRetirement === null) {
        console.warn('calculateDynamicReturn: Invalid timeUntilRetirement', timeUntilRetirement);
        return 0;
    }
    
    const { stocks = 0, bonds = 0, cash = 0, alternatives = 0 } = portfolio;
    const totalAllocation = stocks + bonds + cash + alternatives;
    if (totalAllocation === 0) return 0;
    
    // Base returns
    const baseReturns = {
        stocks: 8,
        bonds: 4,
        cash: 2,
        alternatives: 6
    };
    
    // Apply time-based adjustments
    const timeAdjustment = timeUntilRetirement > 10 ? 1.1 : (timeUntilRetirement < 5 ? 0.9 : 1);
    
    // Calculate weighted return
    let weightedReturn = 0;
    Object.keys(baseReturns).forEach(asset => {
        const weight = portfolio[asset] / totalAllocation;
        weightedReturn += weight * baseReturns[asset] * timeAdjustment;
    });
    
    return weightedReturn;
};

// Export functions
window.ReturnCalculators = {
    getNetReturn: window.getNetReturn,
    calculateWeightedReturn: window.calculateWeightedReturn,
    calculateDynamicReturn: window.calculateDynamicReturn
};

console.log('✅ Return calculators module loaded');