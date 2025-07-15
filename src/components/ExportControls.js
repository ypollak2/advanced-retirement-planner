// Export Controls Component - Professional export functionality for retirement plans
// Created by Yali Pollak (יהלי פולק) - v5.3.1

const ExportControls = ({ 
    inputs, 
    results, 
    partnerResults, 
    language = 'he' 
}) => {
    const [isExporting, setIsExporting] = React.useState(false);
    const [exportStatus, setExportStatus] = React.useState(null);
    const [showClaudePrompt, setShowClaudePrompt] = React.useState(false);

    // Content translations
    const content = {
        he: {
            title: 'ייצוא ושיתוף',
            subtitle: 'ייצא את תוכנית הפנסיה שלך לפורמטים שונים',
            exportImage: 'ייצא כתמונה',
            exportPDF: 'ייצא כ-PDF',
            exportLLM: 'ייצא לניתוח AI',
            claudeRecommendations: 'המלצות Claude',
            exportSuccess: 'הייצוא הושלם בהצלחה!',
            exportError: 'שגיאה בייצוא:',
            exporting: 'מייצא...',
            promptCopied: 'הטקסט הועתק ללוח!',
            instructions: {
                title: 'הוראות ייצוא',
                description: 'ייצא את נתוני התכנון שלך לפורמטים שונים לשיתוף ואחסון.',
                tips: [
                    'ייצוא כתמונה - מושלם לשיתוף מהיר או הדפסה',
                    'ייצוא כ-PDF - מסמך מקצועי לארכיון או לייעוץ פיננסי',
                    'ייצוא לניתוח AI - קובץ JSON מפורט לניתוח מתקדם',
                    'המלצות Claude - העתק טקסט מובנה לקבלת ייעוץ מותאם אישית',
                    'כל הייצואים כוללים את נתוני התאריך והגרסה'
                ]
            }
        },
        en: {
            title: 'Export & Share',
            subtitle: 'Export your retirement plan to various formats',
            exportImage: 'Export as Image',
            exportPDF: 'Export as PDF',
            exportLLM: 'Export for AI Analysis',
            claudeRecommendations: 'Claude Recommendations',
            exportSuccess: 'Export completed successfully!',
            exportError: 'Export error:',
            exporting: 'Exporting...',
            promptCopied: 'Prompt copied to clipboard!',
            instructions: {
                title: 'Export Instructions',
                description: 'Export your planning data to different formats for sharing and storage.',
                tips: [
                    'Export as Image - Perfect for quick sharing or printing',
                    'Export as PDF - Professional document for archiving or financial consultation',
                    'Export for AI Analysis - Detailed JSON file for advanced analysis',
                    'Claude Recommendations - Copy structured text for personalized advice',
                    'All exports include date and version information'
                ]
            }
        }
    };

    const t = content[language] || content.he;

    // Handle image export
    const handleImageExport = async (format) => {
        if (!window.exportAsImage) {
            setExportStatus({ type: 'error', message: 'Export function not available' });
            return;
        }

        setIsExporting(true);
        setExportStatus(null);

        try {
            const result = await window.exportAsImage(format, true);
            setExportStatus({ 
                type: 'success', 
                message: `${t.exportSuccess} (${format.toUpperCase()})` 
            });
            console.log(`✅ ${format.toUpperCase()} export completed:`, result);
        } catch (error) {
            setExportStatus({ 
                type: 'error', 
                message: `${t.exportError} ${error.message}` 
            });
            console.error(`❌ ${format.toUpperCase()} export failed:`, error);
        } finally {
            setIsExporting(false);
            // Clear status after 3 seconds
            setTimeout(() => setExportStatus(null), 3000);
        }
    };

    // Handle LLM analysis export
    const handleLLMExport = () => {
        if (!window.exportForLLMAnalysis) {
            setExportStatus({ type: 'error', message: 'Export function not available' });
            return;
        }

        setIsExporting(true);
        setExportStatus(null);

        try {
            const result = window.exportForLLMAnalysis(inputs, results, partnerResults);
            setExportStatus({ 
                type: 'success', 
                message: `${t.exportSuccess} (JSON)` 
            });
            console.log('✅ LLM export completed:', result);
        } catch (error) {
            setExportStatus({ 
                type: 'error', 
                message: `${t.exportError} ${error.message}` 
            });
            console.error('❌ LLM export failed:', error);
        } finally {
            setIsExporting(false);
            setTimeout(() => setExportStatus(null), 3000);
        }
    };

    // Handle Claude prompt copy
    const handleClaudePrompt = async () => {
        if (!window.copyClaudePromptToClipboard) {
            setExportStatus({ type: 'error', message: 'Claude prompt function not available' });
            return;
        }

        setIsExporting(true);
        setExportStatus(null);

        try {
            const result = await window.copyClaudePromptToClipboard(inputs, results, partnerResults);
            setExportStatus({ 
                type: 'success', 
                message: t.promptCopied 
            });
            console.log('✅ Claude prompt copied:', result);
        } catch (error) {
            setExportStatus({ 
                type: 'error', 
                message: `${t.exportError} ${error.message}` 
            });
            console.error('❌ Claude prompt copy failed:', error);
        } finally {
            setIsExporting(false);
            setTimeout(() => setExportStatus(null), 3000);
        }
    };

    return React.createElement('div', {
        className: 'professional-card animate-fade-in-up'
    }, [
        // Instructions Section
        React.createElement('div', {
            key: 'instructions',
            className: 'section-instructions'
        }, [
            React.createElement('h4', {
                key: 'instructions-title'
            }, t.instructions.title),
            React.createElement('p', {
                key: 'instructions-desc'
            }, t.instructions.description),
            React.createElement('ul', {
                key: 'instructions-tips'
            }, t.instructions.tips.map((tip, index) =>
                React.createElement('li', { key: index }, tip)
            ))
        ]),

        // Header
        React.createElement('div', {
            key: 'header',
            className: 'mb-6'
        }, [
            React.createElement('h2', {
                key: 'title',
                className: 'text-xl font-bold text-gray-800 mb-2'
            }, [
                React.createElement('span', { key: 'icon' }, '📤'),
                ' ',
                t.title
            ]),
            React.createElement('p', {
                key: 'subtitle',
                className: 'text-sm text-gray-600'
            }, t.subtitle)
        ]),

        // Export Status
        exportStatus && React.createElement('div', {
            key: 'status',
            className: `mb-4 p-3 rounded-lg ${exportStatus.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`
        }, [
            React.createElement('span', { key: 'status-icon' }, 
                exportStatus.type === 'success' ? '✅' : '❌'),
            ' ',
            exportStatus.message
        ]),

        // Export Options Grid
        React.createElement('div', {
            key: 'export-grid',
            className: 'grid grid-cols-1 md:grid-cols-2 gap-4'
        }, [
            // Image Export
            React.createElement('div', {
                key: 'image-exports',
                className: 'space-y-3'
            }, [
                React.createElement('h3', {
                    key: 'image-title',
                    className: 'font-semibold text-gray-700 text-sm'
                }, '🖼️ ' + (language === 'he' ? 'ייצוא חזותי' : 'Visual Export')),
                React.createElement('button', {
                    key: 'png-export',
                    onClick: () => handleImageExport('png'),
                    disabled: isExporting,
                    className: 'w-full btn-professional btn-outline disabled:opacity-50'
                }, [
                    React.createElement('span', { key: 'icon' }, '🖼️'),
                    ' ',
                    t.exportImage,
                    ' (PNG)'
                ]),
                React.createElement('button', {
                    key: 'pdf-export',
                    onClick: () => handleImageExport('pdf'),
                    disabled: isExporting,
                    className: 'w-full btn-professional btn-outline disabled:opacity-50'
                }, [
                    React.createElement('span', { key: 'icon' }, '📄'),
                    ' ',
                    t.exportPDF
                ])
            ]),

            // AI Analysis Export
            React.createElement('div', {
                key: 'ai-exports',
                className: 'space-y-3'
            }, [
                React.createElement('h3', {
                    key: 'ai-title',
                    className: 'font-semibold text-gray-700 text-sm'
                }, '🤖 ' + (language === 'he' ? 'ניתוח AI' : 'AI Analysis')),
                React.createElement('button', {
                    key: 'llm-export',
                    onClick: handleLLMExport,
                    disabled: isExporting,
                    className: 'w-full btn-professional btn-outline disabled:opacity-50'
                }, [
                    React.createElement('span', { key: 'icon' }, '📊'),
                    ' ',
                    t.exportLLM
                ]),
                React.createElement('button', {
                    key: 'claude-prompt',
                    onClick: handleClaudePrompt,
                    disabled: isExporting,
                    className: 'w-full btn-professional btn-primary disabled:opacity-50'
                }, [
                    React.createElement('span', { key: 'icon' }, '🧠'),
                    ' ',
                    t.claudeRecommendations
                ])
            ])
        ]),

        // Loading indicator
        isExporting && React.createElement('div', {
            key: 'loading',
            className: 'mt-4 flex items-center justify-center gap-2 text-sm text-gray-600'
        }, [
            React.createElement('div', {
                key: 'spinner',
                className: 'animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full'
            }),
            t.exporting
        ])
    ]);
};

// Export to window for global access
window.ExportControls = ExportControls;