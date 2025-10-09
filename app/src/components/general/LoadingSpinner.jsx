import React from 'react';
import { Spinner } from 'react-bootstrap';

/**
 * Reusable loading spinner component with different variants
 */
const LoadingSpinner = ({
  size = 'md',
  variant = 'primary',
  text = 'Loading...',
  centered = false,
  overlay = false,
  className = ''
}) => {
  const sizeMap = {
    sm: { width: '1rem', height: '1rem' },
    md: { width: '2rem', height: '2rem' },
    lg: { width: '3rem', height: '3rem' }
  };

  const spinnerElement = (
    <div className={`d-flex align-items-center ${className}`}>
      <Spinner
        animation="border"
        variant={variant}
        style={sizeMap[size]}
        role="status"
        aria-hidden="true"
      />
      {text && (
        <span className="ms-2 text-muted">
          {text}
        </span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div
        className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1050,
          backdropFilter: 'blur(2px)'
        }}
      >
        {spinnerElement}
      </div>
    );
  }

  if (centered) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 h-100">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

/**
 * Loading skeleton for content placeholders
 */
export const LoadingSkeleton = ({ lines = 3, height = '1rem', className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className="bg-light rounded mb-2"
          style={{
            height,
            width: index === lines - 1 ? '75%' : '100%'
          }}
        />
      ))}
    </div>
  );
};

/**
 * Loading button component
 */
export const LoadingButton = ({
  loading = false,
  children,
  disabled = false,
  loadingText = 'Loading...',
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`btn ${props.className || 'btn-primary'}`}
    >
      {loading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingSpinner;
