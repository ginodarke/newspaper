import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App.tsx';
import './index.css';

// Add global error handler for debugging
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  
  // Log additional details that might help debug the issue
  console.error('Navigator:', {
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  });

  console.error('Environment:', {
    NODE_ENV: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    // Log if keys exist, but not their values
    hasSupabaseUrl: Boolean(import.meta.env.VITE_SUPABASE_URL),
    hasSupabaseAnonKey: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY),
    hasOpenRouterKey: Boolean(import.meta.env.VITE_OPENROUTER_API_KEY),
    hasNewsApiKey: Boolean(import.meta.env.VITE_NEWS_API_KEY),
    baseUrl: import.meta.env.BASE_URL,
  });
  
  // Create visible error display for white screen debugging
  const errorElement = document.createElement('div');
  errorElement.style.position = 'fixed';
  errorElement.style.top = '0';
  errorElement.style.left = '0';
  errorElement.style.right = '0';
  errorElement.style.backgroundColor = '#f44336';
  errorElement.style.color = 'white';
  errorElement.style.padding = '20px';
  errorElement.style.zIndex = '9999';
  errorElement.innerHTML = `
    <h2>JavaScript Error</h2>
    <p><strong>Message:</strong> ${message}</p>
    <p><strong>Source:</strong> ${source}</p>
    <p><strong>Line:</strong> ${lineno}, <strong>Column:</strong> ${colno}</p>
    <p><strong>User Agent:</strong> ${navigator.userAgent}</p>
    <p><strong>Online:</strong> ${navigator.onLine}</p>
    <details>
      <summary>Stack Trace</summary>
      <pre style="white-space: pre-wrap; font-size: 12px;">${error?.stack || 'No stack trace available'}</pre>
    </details>
  `;
  document.body.appendChild(errorElement);
  return false;
};

// Fallback UI for error boundary
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  React.useEffect(() => {
    // Log detailed error information
    console.error('Error boundary caught error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for React-specific errors
    if (error.message && error.message.includes('React')) {
      console.error('This appears to be a React-specific error');
    }
    
    // Log environment details
    console.error('Environment:', {
      NODE_ENV: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD,
      baseUrl: import.meta.env.BASE_URL,
    });
  }, [error]);
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#ffebee', 
      color: '#b71c1c',
      borderRadius: '8px',
      border: '1px solid #ef9a9a',
      maxWidth: '800px',
      margin: '20px auto'
    }}>
      <h2>Something went wrong:</h2>
      <p style={{
        fontSize: '16px',
        marginBottom: '15px'
      }}>
        <strong>Error:</strong> {error.message || 'Unknown error'}
      </p>
      
      <details style={{ marginBottom: '15px' }}>
        <summary style={{ 
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '10px' 
        }}>
          Technical Details
        </summary>
        <div style={{
          background: '#fff', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '12px',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          maxHeight: '200px'
        }}>
          <p><strong>Name:</strong> {error.name}</p>
          <p><strong>Message:</strong> {error.message}</p>
          <p><strong>Stack:</strong></p>
          <pre>{error.stack || 'No stack trace available'}</pre>
        </div>
      </details>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={resetErrorBoundary}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
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
            backgroundColor: '#546e7a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Home
        </button>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
        <p>If the problem persists, please try:</p>
        <ul>
          <li>Refreshing the page</li>
          <li>Clearing your browser cache</li>
          <li>Checking your internet connection</li>
          <li>Accessing the <a href="/fallback.html" style={{ color: '#1976d2' }}>fallback page</a></li>
        </ul>
      </div>
    </div>
  );
}

// Log environment variables (without sensitive info)
console.log('Environment:', {
  NODE_ENV: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  // Log if keys exist, but not their values
  hasSupabaseUrl: Boolean(import.meta.env.VITE_SUPABASE_URL),
  hasSupabaseAnonKey: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY),
  hasOpenRouterKey: Boolean(import.meta.env.VITE_OPENROUTER_API_KEY),
  hasNewsApiKey: Boolean(import.meta.env.VITE_NEWS_API_KEY),
  baseUrl: import.meta.env.BASE_URL,
});

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
  const errorMsg = 'Root element #root not found';
  console.error(errorMsg);
  document.body.innerHTML = `
    <div style="
      padding: 20px;
      margin: 20px;
      background-color: #ffebee;
      color: #b71c1c;
      border-radius: 8px;
      border: 1px solid #ef9a9a;
    ">
      <h2>Critical Error</h2>
      <p>${errorMsg}</p>
      <p>This could be due to:</p>
      <ul>
        <li>Missing or incorrect HTML structure</li>
        <li>HTML not being properly loaded</li>
        <li>A JavaScript error occurring before React initialization</li>
      </ul>
    </div>
  `;
  throw new Error(errorMsg);
}

// Mount the app with additional error handling
try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onError={(error, info) => {
          console.error('Error caught by ErrorBoundary:', error);
          console.error('Component stack:', info.componentStack);
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  );
} catch (error) {
  console.error('Failed to render React application:', error);
  document.body.innerHTML = `
    <div style="
      padding: 20px;
      margin: 20px;
      background-color: #ffebee;
      color: #b71c1c;
      border-radius: 8px;
      border: 1px solid #ef9a9a;
    ">
      <h2>Failed to Initialize Application</h2>
      <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
      <p>Please try refreshing the page. If the problem persists, contact support.</p>
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
}, 1000); // Give the app 1 second to render 