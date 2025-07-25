// Comprehensive Error Boundary Component for Advanced Retirement Planner
// Provides graceful error handling with user-friendly error messages and recovery options

window.ErrorBoundary = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details for debugging
        console.error('🚨 Error Boundary caught an error:', error, errorInfo);
        
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Report error to analytics or error reporting service if available
        if (window.reportError) {
            window.reportError(error, errorInfo);
        }
    }

    handleRetry = () => {
        this.setState(prevState => ({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: prevState.retryCount + 1
        }));
    }

    handleRefresh = () => {
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            const { fallback, language = 'en' } = this.props;
            
            // Multi-language error messages
            const messages = {
                en: {
                    title: 'Something went wrong',
                    subtitle: 'The application encountered an unexpected error',
                    description: 'This error has been logged and we\'re working to fix it. You can try the options below:',
                    retryButton: 'Try Again',
                    refreshButton: 'Refresh Page',
                    reportButton: 'Report Issue',
                    technicalDetails: 'Technical Details (for developers)',
                    showDetails: 'Show Details',
                    hideDetails: 'Hide Details'
                },
                he: {
                    title: 'משהו השתבש',
                    subtitle: 'האפליקציה נתקלה בשגיאה לא צפויה',
                    description: 'השגיאה נרשמה ואנחנו עובדים על תיקונה. אתה יכול לנסות את האפשרויות למטה:',
                    retryButton: 'נסה שוב',
                    refreshButton: 'רענן דף',
                    reportButton: 'דווח על בעיה',
                    technicalDetails: 'פרטים טכניים (למפתחים)',
                    showDetails: 'הראה פרטים',
                    hideDetails: 'הסתר פרטים'
                }
            };

            const t = messages[language] || messages.en;

            // If custom fallback is provided, use it
            if (fallback) {
                return fallback;
            }

            // Default error boundary UI
            return React.createElement('div', {
                className: 'error-boundary-container min-h-screen flex items-center justify-center bg-gray-50 px-4',
                style: { 
                    fontFamily: 'Arial, sans-serif',
                    direction: language === 'he' ? 'rtl' : 'ltr'
                }
            }, [
                React.createElement('div', {
                    key: 'error-card',
                    className: 'bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center'
                }, [
                    // Error icon
                    React.createElement('div', {
                        key: 'error-icon',
                        className: 'text-6xl mb-4',
                        style: { color: '#e53e3e' }
                    }, '⚠️'),
                    
                    // Error title
                    React.createElement('h1', {
                        key: 'error-title',
                        className: 'text-2xl font-bold text-gray-800 mb-2'
                    }, t.title),
                    
                    // Error subtitle
                    React.createElement('p', {
                        key: 'error-subtitle',
                        className: 'text-gray-600 mb-4'
                    }, t.subtitle),
                    
                    // Error description
                    React.createElement('p', {
                        key: 'error-description',
                        className: 'text-gray-500 text-sm mb-6'
                    }, t.description),
                    
                    // Action buttons
                    React.createElement('div', {
                        key: 'error-actions',
                        className: 'space-y-3'
                    }, [
                        // Retry button
                        React.createElement('button', {
                            key: 'retry-btn',
                            onClick: this.handleRetry,
                            className: 'w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors',
                            disabled: this.state.retryCount >= 3
                        }, `${t.retryButton} ${this.state.retryCount > 0 ? `(${this.state.retryCount}/3)` : ''}`),
                        
                        // Refresh button
                        React.createElement('button', {
                            key: 'refresh-btn',
                            onClick: this.handleRefresh,
                            className: 'w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors'
                        }, t.refreshButton),
                        
                        // Report issue button (if available)
                        window.reportIssue && React.createElement('button', {
                            key: 'report-btn',
                            onClick: () => window.reportIssue(this.state.error),
                            className: 'w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors'
                        }, t.reportButton)
                    ]),
                    
                    // Technical details (collapsible)
                    process.env.NODE_ENV === 'development' && this.state.error && React.createElement('div', {
                        key: 'technical-details',
                        className: 'mt-6 text-left'
                    }, [
                        React.createElement('details', {
                            key: 'details-element',
                            className: 'text-sm'
                        }, [
                            React.createElement('summary', {
                                key: 'details-summary',
                                className: 'cursor-pointer text-gray-600 hover:text-gray-800'
                            }, t.technicalDetails),
                            React.createElement('pre', {
                                key: 'error-stack',
                                className: 'mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto',
                                style: { direction: 'ltr' }
                            }, [
                                React.createElement('div', {
                                    key: 'error-message',
                                    className: 'font-bold text-red-600 mb-2'
                                }, this.state.error.toString()),
                                React.createElement('div', {
                                    key: 'error-stack-trace'
                                }, this.state.errorInfo.componentStack)
                            ])
                        ])
                    ])
                ])
            ]);
        }

        return this.props.children;
    }
};

// Higher-order component to wrap components with error boundary
window.withErrorBoundary = (Component, errorBoundaryProps = {}) => {
    return function WrappedComponent(props) {
        return React.createElement(window.ErrorBoundary, errorBoundaryProps, 
            React.createElement(Component, props)
        );
    };
};

// Safe component wrapper that catches errors during rendering
window.SafeComponent = ({ component: Component, fallback, ...props }) => {
    return React.createElement(window.ErrorBoundary, {
        fallback: fallback || React.createElement('div', {
            className: 'bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800'
        }, 'Component temporarily unavailable')
    }, React.createElement(Component, props));
};

console.log('✅ ErrorBoundary component loaded successfully');