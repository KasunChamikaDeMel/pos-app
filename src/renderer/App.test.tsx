// Temporary test file to verify React is working
import React from 'react';

export const TestApp = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      color: 'white', 
      background: '#0f172a', 
      minHeight: '100vh',
      fontSize: '1.5rem'
    }}>
      <h1>React is Working!</h1>
      <p>If you see this, React is rendering correctly.</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

