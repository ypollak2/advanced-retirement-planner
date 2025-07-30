// Console Log Exporter Component - Production Debugging Tool
// Provides rich UI for viewing and exporting console logs
// Created by Yali Pollak - v7.2.1

const ConsoleLogExporter = ({ language = 'en' }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [logs, setLogs] = React.useState([]);
    const [filter, setFilter] = React.useState('all');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState('all');
    const [autoScroll, setAutoScroll] = React.useState(true);
    const [showExportOptions, setShowExportOptions] = React.useState(false);
    
    const logsEndRef = React.useRef(null);
    
    // Load existing logs on mount
    React.useEffect(() => {
        if (window.__consoleLogs) {
            setLogs([...window.__consoleLogs]);
        }
        
        // Listen for new logs
        const handleNewLog = (event) => {
            setLogs(prevLogs => {
                const newLogs = [...prevLogs, event.detail];
                // Maintain circular buffer size
                if (newLogs.length > window.__maxLogEntries) {
                    return newLogs.slice(-window.__maxLogEntries);
                }
                return newLogs;
            });
        };
        
        const handleClear = () => {
            setLogs([]);
        };
        
        window.addEventListener('consoleLogCaptured', handleNewLog);
        window.addEventListener('consoleLogsCleared', handleClear);
        
        return () => {
            window.removeEventListener('consoleLogCaptured', handleNewLog);
            window.removeEventListener('consoleLogsCleared', handleClear);
        };
    }, []);
    
    // Auto-scroll to bottom
    React.useEffect(() => {
        if (autoScroll && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, autoScroll]);
    
    // Filter logs
    const filteredLogs = React.useMemo(() => {
        let filtered = logs;
        
        // Type filter
        if (filter !== 'all') {
            filtered = filtered.filter(log => log.type === filter);
        }
        
        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(log => log.category === categoryFilter);
        }
        
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(log => 
                log.messages.some(msg => msg.toLowerCase().includes(query))
            );
        }
        
        return filtered;
    }, [logs, filter, categoryFilter, searchQuery]);
    
    // Count by type
    const counts = React.useMemo(() => {
        const c = {
            all: logs.length,
            error: logs.filter(l => l.type === 'error').length,
            warn: logs.filter(l => l.type === 'warn').length,
            log: logs.filter(l => l.type === 'log').length,
            info: logs.filter(l => l.type === 'info').length
        };
        return c;
    }, [logs]);
    
    // Count by category
    const categoryCounts = React.useMemo(() => {
        const counts = {};
        logs.forEach(log => {
            counts[log.category] = (counts[log.category] || 0) + 1;
        });
        return counts;
    }, [logs]);
    
    // Export functions
    const exportJSON = () => {
        try {
            const data = window.__exportConsoleLogs('json');
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `console-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('✅ JSON export completed');
        } catch (error) {
            console.error('Export JSON failed:', error);
            alert(language === 'he' ? 'שגיאה בייצוא JSON' : 'Failed to export JSON');
        }
    };
    
    const exportText = () => {
        try {
            const data = window.__exportConsoleLogs('text');
            const blob = new Blob([data], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `console-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('✅ Text export completed');
        } catch (error) {
            console.error('Export text failed:', error);
            alert(language === 'he' ? 'שגיאה בייצוא טקסט' : 'Failed to export text');
        }
    };
    
    const exportForLLM = () => {
        try {
            const data = window.__exportConsoleLogs('llm');
        const formatted = `# Console Log Analysis Request

## Context
I'm debugging issues in a retirement planning calculator. Here are the categorized console logs from a production session.

## Summary
- Total Logs: ${data.summary.totalLogs}
- Errors: ${data.summary.errors}
- Warnings: ${data.summary.warnings}
- Categories: ${data.summary.categories.map(c => `${c.name} (${c.count})`).join(', ')}

## Recent Errors
${data.recentErrors.length > 0 ? data.recentErrors.map(e => `- [${e.time}] ${e.messages ? e.messages.join(' ') : 'No message'} (${e.caller?.file || 'unknown'}:${e.caller?.line || '?'})`).join('\n') : 'No errors found'}

## Calculation Context (Last 20)
${data.calculationContext.length > 0 ? data.calculationContext.map(c => `- [${c.time}] ${c.message || c.messages?.join(' ') || 'No message'}`).join('\n') : 'No calculation logs found'}

## Data Context (Last 20)
${data.dataContext.length > 0 ? data.dataContext.map(d => `- [${d.time}] ${d.message || d.messages?.join(' ') || 'No message'}`).join('\n') : 'No data logs found'}

## Full Categorized Logs
${JSON.stringify(data.categorizedLogs, null, 2)}

Please analyze these logs and identify:
1. The root cause of any errors
2. Data flow issues
3. Calculation problems
4. Suggestions for fixes`;
        
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(formatted).then(() => {
                    alert(language === 'he' ? 'הועתק ללוח!' : 'Copied to clipboard!');
                }).catch((error) => {
                    console.error('Failed to copy to clipboard:', error);
                    // Fallback: show in prompt
                    prompt(language === 'he' ? 'העתק את הטקסט:' : 'Copy this text:', formatted);
                });
            } else {
                // Fallback for browsers without clipboard API
                prompt(language === 'he' ? 'העתק את הטקסט:' : 'Copy this text:', formatted);
            }
        } catch (error) {
            console.error('Export for LLM failed:', error);
            alert(language === 'he' ? 'שגיאה בהכנת נתונים ל-LLM' : 'Failed to prepare LLM data');
        }
    };
    
    const clearLogs = () => {
        if (confirm(language === 'he' ? 'למחוק את כל הלוגים?' : 'Clear all logs?')) {
            window.__clearConsoleLogs();
        }
    };
    
    // Type colors and icons
    const typeStyles = {
        error: { color: 'text-red-600', bg: 'bg-red-50', icon: '❌' },
        warn: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⚠️' },
        info: { color: 'text-blue-600', bg: 'bg-blue-50', icon: 'ℹ️' },
        log: { color: 'text-gray-600', bg: 'bg-gray-50', icon: '📝' },
        debug: { color: 'text-purple-600', bg: 'bg-purple-50', icon: '🔧' }
    };
    
    // Category icons
    const categoryIcons = {
        calculation: '🧮',
        data: '💾',
        api: '🌐',
        component: '🧩',
        validation: '✅',
        debug: '🐛',
        general: '📋'
    };
    
    // Don't render if not in debug mode
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true' || 
                     window.location.hostname === 'localhost' ||
                     localStorage.getItem('debugMode') === 'true';
    
    if (!debugMode) {
        return null;
    }
    
    return React.createElement(React.Fragment, null, [
        // Floating button
        !isExpanded && React.createElement('button', {
            key: 'toggle-button',
            onClick: () => setIsExpanded(true),
            className: 'fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center z-50',
            title: language === 'he' ? 'פתח מעקב לוגים' : 'Open Console Logger'
        }, [
            React.createElement('span', { key: 'icon', className: 'text-xl' }, '🐛'),
            counts.error > 0 && React.createElement('span', {
                key: 'error-badge',
                className: 'absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'
            }, counts.error)
        ]),
        
        // Expanded panel
        isExpanded && React.createElement('div', {
            key: 'panel',
            className: 'fixed bottom-0 right-0 w-full md:w-[600px] h-[70vh] bg-white shadow-2xl rounded-t-2xl border border-gray-200 z-50 flex flex-col'
        }, [
            // Header
            React.createElement('div', {
                key: 'header',
                className: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between'
            }, [
                React.createElement('div', {
                    key: 'title',
                    className: 'flex items-center gap-2'
                }, [
                    React.createElement('span', { key: 'icon', className: 'text-xl' }, '🐛'),
                    React.createElement('h3', {
                        key: 'text',
                        className: 'font-bold text-lg'
                    }, language === 'he' ? 'מעקב קונסול - ייצוא לאבחון' : 'Console Logger - Debug Export')
                ]),
                React.createElement('button', {
                    key: 'close',
                    onClick: () => setIsExpanded(false),
                    className: 'text-white hover:bg-white/20 rounded p-1'
                }, '✕')
            ]),
            
            // Toolbar
            React.createElement('div', {
                key: 'toolbar',
                className: 'p-3 border-b border-gray-200 space-y-2'
            }, [
                // Type filters
                React.createElement('div', {
                    key: 'type-filters',
                    className: 'flex gap-2 flex-wrap'
                }, [
                    ['all', 'error', 'warn', 'log', 'info'].map(type => 
                        React.createElement('button', {
                            key: type,
                            onClick: () => setFilter(type),
                            className: `px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                filter === type 
                                    ? 'bg-indigo-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`
                        }, [
                            type === 'all' ? '🔍' : typeStyles[type]?.icon || '📝',
                            ' ',
                            type.charAt(0).toUpperCase() + type.slice(1),
                            ` (${counts[type] || 0})`
                        ])
                    )
                ]),
                
                // Category filters
                React.createElement('div', {
                    key: 'category-filters',
                    className: 'flex gap-2 flex-wrap'
                }, [
                    React.createElement('button', {
                        key: 'all',
                        onClick: () => setCategoryFilter('all'),
                        className: `px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            categoryFilter === 'all'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`
                    }, `📋 All Categories`),
                    ...Object.entries(categoryCounts).map(([cat, count]) =>
                        React.createElement('button', {
                            key: cat,
                            onClick: () => setCategoryFilter(cat),
                            className: `px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                categoryFilter === cat
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`
                        }, `${categoryIcons[cat]} ${cat} (${count})`)
                    )
                ]),
                
                // Search and controls
                React.createElement('div', {
                    key: 'controls',
                    className: 'flex gap-2'
                }, [
                    React.createElement('input', {
                        key: 'search',
                        type: 'text',
                        value: searchQuery,
                        onChange: (e) => setSearchQuery(e.target.value),
                        placeholder: language === 'he' ? 'חפש בלוגים...' : 'Search logs...',
                        className: 'flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    }),
                    React.createElement('button', {
                        key: 'auto-scroll',
                        onClick: () => setAutoScroll(!autoScroll),
                        className: `px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                            autoScroll
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                        }`
                    }, autoScroll ? '📍 Auto' : '📌 Manual'),
                    React.createElement('button', {
                        key: 'clear',
                        onClick: clearLogs,
                        className: 'px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200'
                    }, '🗑️ Clear'),
                    React.createElement('button', {
                        key: 'export',
                        onClick: () => setShowExportOptions(!showExportOptions),
                        className: 'px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200'
                    }, '📤 Export')
                ])
            ]),
            
            // Export options
            showExportOptions && React.createElement('div', {
                key: 'export-options',
                className: 'p-3 bg-blue-50 border-b border-blue-200 flex gap-2'
            }, [
                React.createElement('button', {
                    key: 'json',
                    onClick: exportJSON,
                    className: 'px-3 py-1 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 border border-gray-300'
                }, '📄 JSON'),
                React.createElement('button', {
                    key: 'text',
                    onClick: exportText,
                    className: 'px-3 py-1 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 border border-gray-300'
                }, '📝 Text'),
                React.createElement('button', {
                    key: 'llm',
                    onClick: exportForLLM,
                    className: 'px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg text-sm font-medium hover:opacity-90'
                }, '🤖 Copy for LLM Analysis')
            ]),
            
            // Logs container
            React.createElement('div', {
                key: 'logs',
                className: 'flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs'
            }, [
                filteredLogs.length === 0 
                    ? React.createElement('div', {
                        key: 'empty',
                        className: 'text-center text-gray-500 py-8'
                    }, language === 'he' ? 'אין לוגים להצגה' : 'No logs to display')
                    : filteredLogs.map(log => 
                        React.createElement('div', {
                            key: log.id,
                            className: `p-2 rounded-lg ${typeStyles[log.type]?.bg || 'bg-gray-50'} border border-gray-200`
                        }, [
                            // Header
                            React.createElement('div', {
                                key: 'header',
                                className: 'flex items-center gap-2 mb-1'
                            }, [
                                React.createElement('span', {
                                    key: 'icon',
                                    className: typeStyles[log.type]?.color || 'text-gray-600'
                                }, typeStyles[log.type]?.icon || '📝'),
                                React.createElement('span', {
                                    key: 'time',
                                    className: 'text-gray-500'
                                }, log.time),
                                React.createElement('span', {
                                    key: 'category',
                                    className: 'bg-white px-2 py-0.5 rounded-full text-xs'
                                }, `${categoryIcons[log.category]} ${log.category}`),
                                log.caller && React.createElement('span', {
                                    key: 'caller',
                                    className: 'text-gray-400 text-xs'
                                }, `${log.caller.file}:${log.caller.line}`)
                            ]),
                            // Message
                            React.createElement('div', {
                                key: 'message',
                                className: `${typeStyles[log.type]?.color || 'text-gray-700'} break-all whitespace-pre-wrap`
                            }, log.messages.join(' '))
                        ])
                    ),
                React.createElement('div', { key: 'end', ref: logsEndRef })
            ]),
            
            // Status bar
            React.createElement('div', {
                key: 'status',
                className: 'p-2 bg-gray-100 border-t border-gray-200 text-xs text-gray-600 flex justify-between'
            }, [
                React.createElement('span', { key: 'count' }, 
                    `${language === 'he' ? 'מציג' : 'Showing'} ${filteredLogs.length} / ${logs.length} ${language === 'he' ? 'לוגים' : 'logs'}`
                ),
                React.createElement('span', { key: 'version' }, 
                    `v${window.APP_VERSION || '7.2.1'} | ${language === 'he' ? 'מצב דיבאג' : 'Debug Mode'}`
                )
            ])
        ])
    ]);
};

// Export to window
window.ConsoleLogExporter = ConsoleLogExporter;