// Secure Input Component with Built-in Validation and XSS Protection
// Wraps standard input with validation, sanitization, and error handling

window.SecureInput = function(props) {
    const {
        type = 'text',
        value,
        onChange,
        validation,
        validationOptions = {},
        className = '',
        errorClassName = 'text-red-500 text-sm mt-1',
        showError = true,
        debounceDelay = 300,
        label,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        required = false,
        ...otherProps
    } = props;

    const [error, setError] = React.useState(null);
    const [internalValue, setInternalValue] = React.useState(value || '');
    const [isValidating, setIsValidating] = React.useState(false);

    // Create debounced validator if needed
    const debouncedValidate = React.useMemo(() => {
        if (!validation || !window.InputValidation) return null;
        
        const validator = window.InputValidation.validators[validation];
        if (!validator) return null;

        return window.InputValidation.createDebouncedValidator(validator, debounceDelay);
    }, [validation, debounceDelay]);

    // Handle input change with validation
    const handleChange = React.useCallback(async (e) => {
        const rawValue = e.target.value;
        setInternalValue(rawValue);

        if (!validation || !window.InputValidation) {
            onChange && onChange(e);
            return;
        }

        setIsValidating(true);

        try {
            const validator = window.InputValidation.validators[validation];
            if (!validator) {
                onChange && onChange(e);
                return;
            }

            // Use debounced validation for async validation
            const result = debouncedValidate 
                ? await debouncedValidate(rawValue, validationOptions)
                : validator(rawValue, validationOptions);

            setError(result.error);
            
            // Create synthetic event with validated value
            const syntheticEvent = {
                ...e,
                target: {
                    ...e.target,
                    value: result.value
                }
            };

            onChange && onChange(syntheticEvent);
        } catch (err) {
            console.error('Validation error:', err);
            setError('Validation error occurred');
        } finally {
            setIsValidating(false);
        }
    }, [onChange, validation, validationOptions, debouncedValidate]);

    // Sync internal value with prop value
    React.useEffect(() => {
        setInternalValue(value || '');
    }, [value]);

    // Map validation types to input types
    const getInputType = () => {
        if (type) return type;
        
        switch (validation) {
            case 'email':
                return 'email';
            case 'number':
            case 'age':
            case 'currency':
            case 'percentage':
                return 'number';
            case 'date':
                return 'date';
            default:
                return 'text';
        }
    };

    // Add validation-specific props
    const getValidationProps = () => {
        const validProps = {};

        switch (validation) {
            case 'age':
                validProps.min = 18;
                validProps.max = 120;
                break;
            case 'percentage':
                validProps.min = 0;
                validProps.max = 100;
                validProps.step = 0.01;
                break;
            case 'currency':
                validProps.min = 0;
                validProps.step = 0.01;
                break;
        }

        return validProps;
    };

    // Generate unique IDs for accessibility
    const inputId = otherProps.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const labelId = `${inputId}-label`;
    
    const wrapperElements = [];
    
    // Add label if provided
    if (label) {
        wrapperElements.push(
            React.createElement('label', {
                key: 'input-label',
                id: labelId,
                htmlFor: inputId,
                className: 'block text-sm font-medium text-gray-700 mb-2 touch-target'
            }, [
                label,
                required && React.createElement('span', {
                    key: 'required-indicator',
                    className: 'text-red-500 ml-1',
                    'aria-label': 'required'
                }, '*')
            ])
        );
    }
    
    // Create accessible input
    wrapperElements.push(
        React.createElement('input', {
            ...otherProps,
            ...getValidationProps(),
            id: inputId,
            type: getInputType(),
            value: internalValue,
            onChange: handleChange,
            className: `professional-input touch-target ${className} ${error ? 'border-red-500' : ''}`,
            'aria-invalid': !!error,
            'aria-describedby': error ? errorId : undefined,
            'aria-labelledby': label ? labelId : ariaLabelledBy,
            'aria-label': !label && !ariaLabelledBy ? ariaLabel : undefined,
            'aria-required': required,
            key: 'secure-input'
        }),
        
        showError && error && React.createElement('div', {
            id: errorId,
            className: errorClassName,
            role: 'alert',
            'aria-live': 'polite',
            key: 'error-message'
        }, error),

        isValidating && React.createElement('div', {
            className: 'text-gray-500 text-sm mt-1',
            'aria-live': 'polite',
            key: 'validation-status'
        }, 'Validating...')
    );
    
    return React.createElement('div', { 
        className: 'secure-input-wrapper',
        key: 'secure-input-wrapper'
    }, wrapperElements);
};

// Example usage patterns for documentation
window.SecureInput.examples = {
    age: {
        validation: 'age',
        placeholder: 'Enter age (18-120)'
    },
    currency: {
        validation: 'currency',
        placeholder: 'Enter amount',
        validationOptions: { max: 1000000 }
    },
    percentage: {
        validation: 'percentage',
        placeholder: 'Enter percentage (0-100)'
    },
    email: {
        validation: 'email',
        placeholder: 'Enter email address'
    },
    name: {
        validation: 'string',
        validationOptions: { 
            maxLength: 50,
            stripHtml: true,
            escapeHtml: true
        },
        placeholder: 'Enter name'
    }
};