import React from 'react';

function App() {
  console.log('Test App component rendering');
  
  return (
    <div style={{ 
      padding: '20px', 
      color: '#f1f5f9', 
      background: '#0f172a', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#3b82f6', marginBottom: '20px' }}>POS System Test</h1>
      <p style={{ marginBottom: '10px' }}>If you can see this, React is working!</p>
      <p style={{ color: '#94a3b8' }}>The issue is with the full App component.</p>
      <button 
        onClick={() => alert('Button works!')}
        style={{
          padding: '10px 20px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Test Button
      </button>
    </div>
  );
}

export default App;
