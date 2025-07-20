// Lazy Component Loader for React Components
// Created by Yali Pollak (יהלי פולק) - v6.1.0

const LazyComponent = ({ 
    componentName, 
    fallback = null, 
    priority = 'normal',
    children,
    ...props 
}) => {
    const [component, setComponent] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        // Check if component is already loaded
        if (window[componentName]) {
            setComponent(window[componentName]);
            return;
        }

        // Load component dynamically
        setLoading(true);
        setError(null);

        if (window.ComponentLoader) {
            window.ComponentLoader.loadComponent(componentName, priority)
                .then((loadedComponent) => {
                    setComponent(loadedComponent);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err);
                    setLoading(false);
                    console.error(`Failed to load component ${componentName}:`, err);
                });
        } else {
            setError(new Error('ComponentLoader not available'));
            setLoading(false);
        }
    }, [componentName, priority]);

    // Show loading state
    if (loading) {
        return fallback || React.createElement('div', {
            className: 'flex items-center justify-center p-8',
            key: 'loading'
        }, [
            React.createElement('div', {
                className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600',
                key: 'spinner'
            }),
            React.createElement('span', {
                className: 'ml-3 text-gray-600',
                key: 'text'
            }, `Loading ${componentName}...`)
        ]);
    }

    // Show error state
    if (error) {
        return React.createElement('div', {
            className: 'p-4 bg-red-50 border border-red-200 rounded-lg',
            key: 'error'
        }, [
            React.createElement('h3', {
                className: 'text-red-800 font-medium',
                key: 'title'
            }, 'Component Load Error'),
            React.createElement('p', {
                className: 'text-red-600 text-sm mt-1',
                key: 'message'
            }, `Failed to load ${componentName}: ${error.message}`),
            React.createElement('button', {
                className: 'mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700',
                onClick: () => window.location.reload(),
                key: 'reload'
            }, 'Reload Page')
        ]);
    }

    // Render component if loaded
    if (component) {
        if (typeof children === 'function') {
            return children(component);
        }
        return React.createElement(component, props);
    }

    // Default fallback
    return fallback;
};

// Wizard wrapper with lazy loading
const LazyWizard = (props) => {
    const [wizardSteps, setWizardSteps] = React.useState({});
    const [loadingSteps, setLoadingSteps] = React.useState(true);

    React.useEffect(() => {
        const stepComponents = [
            'WizardStepSalary',
            'WizardStepSavings', 
            'WizardStepContributions',
            'WizardStepFees'
        ];

        Promise.all(
            stepComponents.map(async (stepName) => {
                try {
                    if (window[stepName]) {
                        return { name: stepName, component: window[stepName] };
                    }
                    const component = await window.ComponentLoader.loadComponent(stepName, 'high');
                    return { name: stepName, component };
                } catch (error) {
                    console.error(`Failed to load ${stepName}:`, error);
                    return { name: stepName, component: null };
                }
            })
        ).then((results) => {
            const steps = {};
            results.forEach(({ name, component }) => {
                if (component) {
                    steps[name] = component;
                }
            });
            setWizardSteps(steps);
            setLoadingSteps(false);
        });
    }, []);

    if (loadingSteps) {
        return React.createElement('div', {
            className: 'flex flex-col items-center justify-center p-12',
            key: 'wizard-loading'
        }, [
            React.createElement('div', {
                className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4',
                key: 'spinner'
            }),
            React.createElement('h3', {
                className: 'text-lg font-medium text-gray-700 mb-2',
                key: 'title'
            }, 'Loading Retirement Wizard...'),
            React.createElement('p', {
                className: 'text-gray-500 text-center',
                key: 'subtitle'
            }, 'Preparing your personalized retirement planning experience')
        ]);
    }

    if (!window.RetirementWizard) {
        return React.createElement('div', {
            className: 'p-6 bg-yellow-50 border border-yellow-200 rounded-lg',
            key: 'wizard-error'
        }, [
            React.createElement('h3', {
                className: 'text-yellow-800 font-medium mb-2',
                key: 'title'
            }, 'Wizard Not Available'),
            React.createElement('p', {
                className: 'text-yellow-700',
                key: 'message'
            }, 'The retirement wizard is currently unavailable. Please try refreshing the page.')
        ]);
    }

    return React.createElement(window.RetirementWizard, {
        ...props,
        // Pass loaded wizard step components
        ...wizardSteps
    });
};

// Export components
window.LazyComponent = LazyComponent;
window.LazyWizard = LazyWizard;

console.log('🚀 Lazy Component system initialized');