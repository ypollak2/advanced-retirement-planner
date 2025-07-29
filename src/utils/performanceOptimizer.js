// Performance Optimizer for Financial Health Engine
// Implements caching, memoization, and batch processing optimizations

(function() {
    'use strict';
    
    // Cache for expensive calculations
    const calculationCache = new Map();
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL
    
    // Performance monitoring
    const performanceMetrics = {
        cacheHits: 0,
        cacheMisses: 0,
        totalCalculationTime: 0,
        calculationCount: 0
    };
    
    // Generate cache key from inputs
    function generateCacheKey(inputs, calculationType) {
        // Only include relevant fields for caching
        const relevantFields = [
            'planningType', 'currentAge', 'retirementAge', 'country',
            'currentMonthlySalary', 'partner1Salary', 'partner2Salary',
            'pensionEmployeeRate', 'pensionEmployerRate',
            'currentPensionSavings', 'current401k', 'currentIRA',
            'emergencyFund', 'totalDebt', 'monthlyDebtPayments',
            'rsuUnits', 'rsuCurrentStockPrice', 'rsuFrequency'
        ];
        
        const keyData = {};
        relevantFields.forEach(field => {
            if (inputs[field] !== undefined) {
                keyData[field] = inputs[field];
            }
        });
        
        return `${calculationType}:${JSON.stringify(keyData)}`;
    }
    
    // Memoized calculation wrapper
    function memoizedCalculation(calculationType, calculator, inputs) {
        const cacheKey = generateCacheKey(inputs, calculationType);
        const now = Date.now();
        
        // Check cache
        if (calculationCache.has(cacheKey)) {
            const cached = calculationCache.get(cacheKey);
            if (now - cached.timestamp < CACHE_TTL) {
                performanceMetrics.cacheHits++;
                return cached.result;
            }
        }
        
        // Perform calculation
        performanceMetrics.cacheMisses++;
        const startTime = performance.now();
        const result = calculator(inputs);
        const endTime = performance.now();
        
        // Update metrics
        performanceMetrics.totalCalculationTime += (endTime - startTime);
        performanceMetrics.calculationCount++;
        
        // Cache result
        calculationCache.set(cacheKey, {
            result: result,
            timestamp: now
        });
        
        // Cleanup old cache entries
        if (calculationCache.size > 100) {
            cleanupCache();
        }
        
        return result;
    }
    
    // Clean up expired cache entries
    function cleanupCache() {
        const now = Date.now();
        const entriesToDelete = [];
        
        calculationCache.forEach((value, key) => {
            if (now - value.timestamp > CACHE_TTL) {
                entriesToDelete.push(key);
            }
        });
        
        entriesToDelete.forEach(key => calculationCache.delete(key));
    }
    
    // Batch processing for multiple calculations
    function batchCalculate(calculations) {
        const results = {};
        const startTime = performance.now();
        
        // Process calculations in optimal order
        calculations.forEach(({ name, calculator, inputs }) => {
            results[name] = memoizedCalculation(name, calculator, inputs);
        });
        
        const endTime = performance.now();
        console.log(`Batch calculation completed in ${(endTime - startTime).toFixed(2)}ms`);
        
        return results;
    }
    
    // Optimized field value extraction
    const fieldValueCache = new Map();
    
    function optimizedGetFieldValue(inputs, fieldNames, options = {}) {
        // Create cache key for field lookup
        const cacheKey = `fields:${JSON.stringify({ 
            planningType: inputs.planningType, 
            fieldNames,
            options 
        })}`;
        
        // Check cache
        if (fieldValueCache.has(cacheKey)) {
            const cached = fieldValueCache.get(cacheKey);
            if (Object.keys(inputs).some(key => fieldNames.includes(key) && inputs[key] === cached.inputValue)) {
                return cached.result;
            }
        }
        
        // Perform lookup using original function
        const result = window.getFieldValue ? window.getFieldValue(inputs, fieldNames, options) : 0;
        
        // Cache result
        fieldValueCache.set(cacheKey, {
            result,
            inputValue: inputs[fieldNames[0]]
        });
        
        return result;
    }
    
    // Debounced calculation trigger
    let calculationTimeout;
    function debouncedCalculation(calculator, inputs, callback, delay = 300) {
        clearTimeout(calculationTimeout);
        
        calculationTimeout = setTimeout(() => {
            const result = calculator(inputs);
            callback(result);
        }, delay);
    }
    
    // Progressive calculation for better UX
    function progressiveCalculation(inputs, onProgress) {
        const factors = window.SCORE_FACTORS || {};
        const results = {};
        let completed = 0;
        const total = Object.keys(factors).length;
        
        // Calculate each factor progressively
        Object.entries(factors).forEach(([factorName, factorConfig], index) => {
            setTimeout(() => {
                const calculator = window.financialHealthEngine[`calculate${factorName.charAt(0).toUpperCase() + factorName.slice(1)}Score`];
                if (calculator) {
                    results[factorName] = memoizedCalculation(factorName, calculator, inputs);
                }
                
                completed++;
                if (onProgress) {
                    onProgress({
                        factor: factorName,
                        progress: (completed / total) * 100,
                        results: results
                    });
                }
            }, index * 10); // Stagger calculations by 10ms
        });
        
        return results;
    }
    
    // Performance monitoring utilities
    function getPerformanceMetrics() {
        return {
            ...performanceMetrics,
            averageCalculationTime: performanceMetrics.calculationCount > 0 
                ? (performanceMetrics.totalCalculationTime / performanceMetrics.calculationCount).toFixed(2) 
                : 0,
            cacheHitRate: performanceMetrics.cacheHits + performanceMetrics.cacheMisses > 0
                ? ((performanceMetrics.cacheHits / (performanceMetrics.cacheHits + performanceMetrics.cacheMisses)) * 100).toFixed(2)
                : 0,
            cacheSize: calculationCache.size
        };
    }
    
    function resetPerformanceMetrics() {
        performanceMetrics.cacheHits = 0;
        performanceMetrics.cacheMisses = 0;
        performanceMetrics.totalCalculationTime = 0;
        performanceMetrics.calculationCount = 0;
    }
    
    // Optimized calculation with all performance features
    function optimizedFinancialHealthScore(inputs) {
        const startTime = performance.now();
        
        // Use memoized calculation
        const result = memoizedCalculation('financialHealthScore', window.calculateFinancialHealthScore, inputs);
        
        const endTime = performance.now();
        
        // Log performance in debug mode
        if (inputs.debugMode || window.DEBUG_MODE) {
            console.log(`⚡ Financial Health Score calculated in ${(endTime - startTime).toFixed(2)}ms`);
            console.log('📊 Performance Metrics:', getPerformanceMetrics());
        }
        
        return result;
    }
    
    // Export performance utilities
    window.performanceOptimizer = {
        memoizedCalculation,
        batchCalculate,
        optimizedGetFieldValue,
        debouncedCalculation,
        progressiveCalculation,
        getPerformanceMetrics,
        resetPerformanceMetrics,
        optimizedFinancialHealthScore,
        clearCache: () => {
            calculationCache.clear();
            fieldValueCache.clear();
        }
    };
    
    // Replace the original calculation function with optimized version
    if (window.calculateFinancialHealthScore) {
        window.originalCalculateFinancialHealthScore = window.calculateFinancialHealthScore;
        window.calculateFinancialHealthScore = optimizedFinancialHealthScore;
    }
    
    console.log('⚡ Performance Optimizer loaded successfully');
})();