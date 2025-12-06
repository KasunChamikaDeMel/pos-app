import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Sales from './pages/Sales/Sales';
import Sale from './pages/Sale/Sale';
import Inventory from './pages/Inventory/Inventory';
import Customers from './pages/Customers/Customers';
import Analytics from './pages/Analytics/Analytics';
import Repairs from './pages/Repairs/Repairs';
import Settings from './pages/Settings/Settings';
import LicenseVerification from './pages/License/LicenseVerification';
import GRN from './pages/GRN/GRN';
import Returns from './pages/Returns/Returns';
import UserManagement from './pages/UserManagement/UserManagement';
import Warranty from './pages/Warranty/Warranty';
import Stocks from './pages/Stocks/Stocks';
import { LanguageProvider } from './contexts/LanguageContext';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          color: '#f1f5f9', 
          background: '#0f172a', 
          minHeight: '100vh',
          fontSize: '1rem'
        }}>
          <h1 style={{ color: '#ef4444' }}>Something went wrong</h1>
          <p style={{ color: '#f1f5f9' }}>{this.state.error?.message || 'Unknown error'}</p>
          <pre style={{ background: '#1e293b', padding: '1rem', borderRadius: '4px', overflow: 'auto', color: '#f1f5f9' }}>
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLicenseValid, setIsLicenseValid] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    
    // Check license asynchronously
    const checkLicense = async () => {
      try {
        if (window.electronAPI && window.electronAPI.license) {
          const result = await window.electronAPI.license.verify();
          setIsLicenseValid(result.valid);
        } else {
          setIsLicenseValid(true);
        }
      } catch (error) {
        console.error('License check failed:', error);
        setIsLicenseValid(true);
      }
    };
    checkLicense();
  }, []);

  if (!isLicenseValid) {
    return (
      <ErrorBoundary>
        <LanguageProvider>
          <LicenseVerification onVerified={() => setIsLicenseValid(true)} />
        </LanguageProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login onLogin={() => setIsAuthenticated(true)} />
                )
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Layout onLogout={() => setIsAuthenticated(false)} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="sale" element={<Sale />} />
              <Route path="sales" element={<Sales />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="customers" element={<Customers />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="repairs" element={<Repairs />} />
              <Route path="settings" element={<Settings />} />
              <Route path="grn" element={<GRN />} />
              <Route path="returns" element={<Returns />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="warranty" element={<Warranty />} />
              <Route path="stocks" element={<Stocks />} />
            </Route>
          </Routes>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
