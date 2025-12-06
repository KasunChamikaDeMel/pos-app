import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/index.css';

// Ensure global is defined
if (typeof global === 'undefined') {
  (window as any).global = window;
}

console.log('[Renderer] Starting React app...');
console.log('[Renderer] React version:', React.version);
console.log('[Renderer] ReactDOM available:', !!ReactDOM);

// Error boundary for rendering
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    const errorMsg = 'Root element (#root) not found in DOM';
    console.error('[Renderer]', errorMsg);
    document.body.innerHTML = `
      <div style="padding: 20px; color: #ef4444; background: #1e293b; font-family: sans-serif; min-height: 100vh;">
        <h1>Error: Root element not found</h1>
        <p>${errorMsg}</p>
        <p>Please check the HTML structure.</p>
      </div>
    `;
    throw new Error(errorMsg);
  }

  console.log('[Renderer] Root element found, creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  console.log('[Renderer] React root created successfully');

  console.log('[Renderer] Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('[Renderer] App rendered successfully!');
} catch (error) {
  console.error('[Renderer] Failed to render app:', error);
  const errorMsg = error instanceof Error ? error.message : 'Unknown error';
  const errorStack = error instanceof Error ? error.stack : String(error);
  
  document.body.innerHTML = `
    <div style="padding: 20px; color: #f1f5f9; background: #1e293b; font-family: sans-serif; min-height: 100vh;">
      <h1 style="color: #ef4444;">Error Loading Application</h1>
      <p><strong>Error:</strong> ${errorMsg}</p>
      <p>Please check the console (F12 or View → Toggle Developer Tools) for more details.</p>
      <details style="margin-top: 1rem;">
        <summary style="cursor: pointer; color: #94a3b8;">Show error details</summary>
        <pre style="background: #0f172a; padding: 10px; border-radius: 4px; overflow: auto; color: #f1f5f9; margin-top: 0.5rem;">${errorStack}</pre>
      </details>
      <button 
        onclick="window.location.reload()" 
        style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem;">
        Reload Application
      </button>
    </div>
  `;
}
