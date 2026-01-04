import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/index.css';

// Ensure global is defined
if (typeof global === 'undefined') {
  (window as any).global = window;
}

// Simple render without complex initialization
const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('Found root element, rendering React app');
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element not found');
}