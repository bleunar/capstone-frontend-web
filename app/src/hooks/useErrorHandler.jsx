import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for handling errors in functional components
 * Provides error state management and consistent error handling
 */
export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleError = useCallback((error, showToast = true) => {
    console.error('Error caught by useErrorHandler:', error);

    setError(error);
    setIsError(true);

    // Show toast notification if enabled
    if (showToast) {
      const errorMessage = error?.response?.data?.error ||
        error?.message ||
        'An unexpected error occurred';

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  const resetError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    error,
    isError,
    handleError,
    clearError,
    resetError
  };
};

// wrap components with error handler
export const withErrorHandler = (WrappedComponent) => {
  return function WithErrorHandlerComponent(props) {
    const errorHandler = useErrorHandler();

    return (
      <WrappedComponent
        {...props}
        errorHandler={errorHandler}
      />
    );
  };
};
