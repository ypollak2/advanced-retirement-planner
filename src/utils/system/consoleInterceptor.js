// Console Interceptor for Production Debugging
// Captures all console output with rich context for LLM analysis
// Created by Yali Pollak - v7.2.1

(function() {
    // Global console log storage
    window.__consoleLogs = [];
    window.__maxLogEntries = 2000; // Increased for better context
    window.__logCaptureEnabled = true;
    
    // Store original console methods
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
        debug: console.debug,
        table: console.table,
        group: console.group,
        groupEnd: console.groupEnd,
        time: console.time,
        timeEnd: console.timeEnd
    };
    
    // Helper to safely stringify objects
    function safeStringify(obj, depth = 0, maxDepth = 3) {
        if (depth > maxDepth) return '[Max Depth Reached]';
        
        try {
            if (obj === null) return 'null';
            if (obj === undefined) return 'undefined';
            if (typeof obj === 'function') return `[Function: ${obj.name || 'anonymous'}]`;
            if (obj instanceof Error) {
                return `${obj.name}: ${obj.message}\n${obj.stack}`;
            }
            if (typeof obj === 'object') {
                if (obj instanceof Date) return obj.toISOString();
                if (obj instanceof RegExp) return obj.toString();
                if (Array.isArray(obj)) {
                    return '[' + obj.map(item => safeStringify(item, depth + 1, maxDepth)).join(', ') + ']';
                }
                // Handle circular references
                const cache = new Set();
                return JSON.stringify(obj, (key, value) => {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.has(value)) return '[Circular Reference]';
                        cache.add(value);
                    }
                    if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
                    return value;
                }, 2);
            }
            return String(obj);
        } catch (error) {
            return `[Stringify Error: ${error.message}]`;
        }
    }
    
    // Extract calling context
    function getCallerContext() {
        try {
            const stack = new Error().stack;
            const lines = stack.split('\n');
            // Skip first 3 lines (Error, getCallerContext, interceptor)
            const callerLine = lines[3] || '';
            const match = callerLine.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
            if (match) {
                return {
                    function: match[1],
                    file: match[2].split('/').pop().split('?')[0],
                    line: match[3],
                    column: match[4]
                };
            }
            // Fallback for different stack trace formats
            const simpleMatch = callerLine.match(/at\s+(.+?):(\d+):(\d+)/);
            if (simpleMatch) {
                return {
                    file: simpleMatch[1].split('/').pop().split('?')[0],
                    line: simpleMatch[2],
                    column: simpleMatch[3]
                };
            }
        } catch (e) {
            // Ignore stack trace errors
        }
        return null;
    }
    
    // Detect log category based on content
    function detectCategory(args) {
        const content = args.map(arg => safeStringify(arg)).join(' ').toLowerCase();
        
        // Financial calculations
        if (content.includes('calculation') || content.includes('salary') || 
            content.includes('pension') || content.includes('retirement') ||
            content.includes('financial') || content.includes('score')) {
            return 'calculation';
        }
        
        // Data operations
        if (content.includes('inputs') || content.includes('data') || 
            content.includes('field') || content.includes('value') ||
            content.includes('partner') || content.includes('couple')) {
            return 'data';
        }
        
        // API calls
        if (content.includes('api') || content.includes('fetch') || 
            content.includes('request') || content.includes('response')) {
            return 'api';
        }
        
        // Component lifecycle
        if (content.includes('component') || content.includes('render') || 
            content.includes('mount') || content.includes('update')) {
            return 'component';
        }
        
        // Validation
        if (content.includes('validation') || content.includes('error') || 
            content.includes('warning') || content.includes('invalid')) {
            return 'validation';
        }
        
        // Debug
        if (content.includes('debug') || content.includes('test')) {
            return 'debug';
        }
        
        return 'general';
    }
    
    // Capture log entry with rich context
    function captureLog(type, args) {
        if (!window.__logCaptureEnabled) return;
        
        const entry = {
            id: Date.now() + Math.random(),
            type: type,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleTimeString(),
            category: detectCategory(args),
            messages: args.map(arg => safeStringify(arg)),
            raw: args,
            caller: getCallerContext(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // Add to circular buffer
        window.__consoleLogs.push(entry);
        if (window.__consoleLogs.length > window.__maxLogEntries) {
            window.__consoleLogs.shift();
        }
        
        // Emit event for real-time updates
        window.dispatchEvent(new CustomEvent('consoleLogCaptured', { detail: entry }));
    }
    
    // Override console methods
    ['log', 'error', 'warn', 'info', 'debug'].forEach(method => {
        console[method] = function(...args) {
            captureLog(method, args);
            originalConsole[method].apply(console, args);
        };
    });
    
    // Special handling for console.table
    console.table = function(data, columns) {
        captureLog('table', [data, columns]);
        originalConsole.table.apply(console, [data, columns]);
    };
    
    // Group handling
    let groupDepth = 0;
    console.group = function(...args) {
        captureLog('group', args);
        groupDepth++;
        originalConsole.group.apply(console, args);
    };
    
    console.groupEnd = function() {
        groupDepth = Math.max(0, groupDepth - 1);
        captureLog('groupEnd', []);
        originalConsole.groupEnd.apply(console);
    };
    
    // Timing
    const timers = {};
    console.time = function(label) {
        timers[label] = Date.now();
        captureLog('time', [label]);
        originalConsole.time.apply(console, [label]);
    };
    
    console.timeEnd = function(label) {
        const duration = timers[label] ? Date.now() - timers[label] : 0;
        delete timers[label];
        captureLog('timeEnd', [label, `${duration}ms`]);
        originalConsole.timeEnd.apply(console, [label]);
    };
    
    // Export functions for analysis
    window.__exportConsoleLogs = function(format = 'json') {
        const logs = window.__consoleLogs;
        
        if (format === 'json') {
            return JSON.stringify({
                metadata: {
                    exportTime: new Date().toISOString(),
                    totalLogs: logs.length,
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                    appVersion: window.APP_VERSION || 'unknown'
                },
                logs: logs
            }, null, 2);
        } else if (format === 'text') {
            let output = '=== Console Log Export ===\n';
            output += `Export Time: ${new Date().toISOString()}\n`;
            output += `URL: ${window.location.href}\n`;
            output += `Total Logs: ${logs.length}\n`;
            output += '=' .repeat(50) + '\n\n';
            
            logs.forEach(log => {
                output += `[${log.time}] ${log.type.toUpperCase()} (${log.category})`;
                if (log.caller) {
                    output += ` - ${log.caller.file || 'unknown'}:${log.caller.line || '?'}`;
                }
                output += '\n';
                output += log.messages.join(' ') + '\n';
                output += '-'.repeat(50) + '\n';
            });
            
            return output;
        } else if (format === 'llm') {
            // Special format optimized for LLM analysis
            const categorizedLogs = {};
            logs.forEach(log => {
                if (!categorizedLogs[log.category]) {
                    categorizedLogs[log.category] = [];
                }
                categorizedLogs[log.category].push({
                    time: log.time,
                    type: log.type,
                    message: log.messages.join(' '),
                    file: log.caller?.file,
                    line: log.caller?.line
                });
            });
            
            return {
                summary: {
                    totalLogs: logs.length,
                    categories: Object.keys(categorizedLogs).map(cat => ({
                        name: cat,
                        count: categorizedLogs[cat].length
                    })),
                    errors: logs.filter(l => l.type === 'error').length,
                    warnings: logs.filter(l => l.type === 'warn').length
                },
                categorizedLogs,
                recentErrors: logs.filter(l => l.type === 'error').slice(-10),
                calculationContext: logs.filter(l => l.category === 'calculation').slice(-20),
                dataContext: logs.filter(l => l.category === 'data').slice(-20)
            };
        }
    };
    
    // Clear logs
    window.__clearConsoleLogs = function() {
        window.__consoleLogs = [];
        window.dispatchEvent(new CustomEvent('consoleLogsCleared'));
    };
    
    // Toggle capture
    window.__toggleLogCapture = function(enabled) {
        window.__logCaptureEnabled = enabled;
    };
    
    // Get logs by category
    window.__getLogsByCategory = function(category) {
        return window.__consoleLogs.filter(log => log.category === category);
    };
    
    // Get logs by type
    window.__getLogsByType = function(type) {
        return window.__consoleLogs.filter(log => log.type === type);
    };
    
    // Search logs
    window.__searchLogs = function(query) {
        const searchTerm = query.toLowerCase();
        return window.__consoleLogs.filter(log => 
            log.messages.some(msg => msg.toLowerCase().includes(searchTerm))
        );
    };
    
    console.log('📋 Console interceptor initialized - capturing all console output for debugging');
})();