import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './Login.css';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - accept any username/password for demo
    if (username || password) {
      localStorage.setItem('authToken', 'demo-token');
      onLogin();
    } else {
      // Even if empty, allow login for demo
      localStorage.setItem('authToken', 'demo-token');
      onLogin();
    }
  };

  console.log('Login component rendering');

  return (
    <div className="login-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-card" style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div className="login-header">
          <h1 className="login-title" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Login</h1>
          <p className="login-subtitle" style={{ color: 'var(--text-secondary)' }}>Point of Sale System</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Enter any credentials to continue
          </p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Username</label>
            <input
              id="username"
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              background: 'var(--primary-color)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
