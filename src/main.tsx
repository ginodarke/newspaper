import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App.tsx';
import './index.css';

// Import debug utilities
import { recordError, initializeDebugHandlers } from './debug-helper';

// Initialize debug handlers
initializeDebugHandlers();

// Simplified fallback UI for error boundary
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  React.useEffect(() => {
    // Record error for debugging
    recordError(error, { source: 'ErrorBoundary' });
  }, [error]);
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      color: '#343a40',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      maxWidth: '800px',
      margin: '20px auto'
    }}>
      <h2>Something went wrong</h2>
      <p>We're sorry for the inconvenience. Please try again.</p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          onClick={resetErrorBoundary}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

// Add a visible loading indicator that will be removed when app renders
const loadingElement = document.createElement('div');
loadingElement.id = 'app-loading-indicator';
loadingElement.innerHTML = `
  <div style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    z-index: 9998;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  ">
    <h1 style="color: #2563eb;">Newspaper.AI</h1>
    <p>Loading application...</p>
    <div style="
      width: 50px;
      height: 50px;
      border: 5px solid #e5e7eb;
      border-top: 5px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-top: 20px;
    "></div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </div>
`;
document.body.appendChild(loadingElement);

// Ensure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element #root not found');
  document.body.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <h2>Application Error</h2>
      <p>Unable to initialize application. Please refresh the page.</p>
    </div>
  `;
  throw new Error('Root element #root not found');
}

// Mount the app with additional error handling
try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onError={(error, info) => {
          recordError(error, { 
            componentStack: info.componentStack 
          });
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  );
} catch (error) {
  console.error('Failed to render React application');
  document.body.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <h2>Application Error</h2>
      <p>Unable to initialize application. Please refresh the page.</p>
    </div>
  `;
}

// Remove loading indicator when component mounts
setTimeout(() => {
  const loadingIndicator = document.getElementById('app-loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.style.opacity = '0';
    loadingIndicator.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      if (loadingIndicator && loadingIndicator.parentNode) {
        loadingIndicator.parentNode.removeChild(loadingIndicator);
      }
    }, 500);
  }
}, 1000); 