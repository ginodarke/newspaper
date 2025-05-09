/**
 * Debug helper functions and utilities for the application
 * Simplified for production deployment
 */

/**
 * Initialize debug handlers for the application
 */
export function initializeDebugHandlers(): void {
  // Only add error handlers in development
  if (process.env.NODE_ENV === 'development') {
    window.onerror = (message, source, line, column, error) => {
      console.error('Global error:', message);
      return false; // Let the error propagate
    };

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }
}

/**
 * Record an error for debugging purposes
 */
export function recordError(error: Error, context: Record<string, any> = {}): void {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error recorded:', error.message, context);
  }
  // In production, we would send to an error monitoring service
}

/**
 * Get environment info without sensitive data
 */
export function getEnvironmentInfo(): Record<string, any> {
  return {
    environment: process.env.NODE_ENV || 'unknown',
    isProduction: process.env.NODE_ENV === 'production'
  };
}

export default {
  initializeDebugHandlers,
  recordError,
  getDebugInfo: getEnvironmentInfo
}; 