import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    onLogout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <Sidebar currentPath={location.pathname} onNavigate={navigate} onLogout={handleLogout} />
      <div className="layout-content">
        <Header onLogout={onLogout} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
