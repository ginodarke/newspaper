import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App.tsx';
import './index.css';

// Add global error handler for debugging
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
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
  errorElement.innerHTML = `<h2>JavaScript Error</h2><p>${message}</p><p>Source: ${source}</p><p>Line: ${lineno}, Column: ${colno}</p>`;
  document.body.appendChild(errorElement);
  return false;
};

// Fallback UI for error boundary
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#ffebee', 
      color: '#b71c1c',
      margin: '20px',
      borderRadius: '8px',
      border: '1px solid #ef9a9a'
    }}>
      <h2>Something went wrong:</h2>
      <pre style={{ 
        background: '#fff', 
        padding: '10px', 
        borderRadius: '4px',
        overflow: 'auto'
      }}>{error.message + '\n\n' + (error.stack || '')}</pre>
      <button 
        onClick={resetErrorBoundary}
        style={{
          marginTop: '10px',
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

// Mount the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);

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