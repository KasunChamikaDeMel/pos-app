import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'sales', label: 'Sales', icon: '💰', path: '/sales' },
    { id: 'products', label: 'Products', icon: '📦', path: '/products' },
    { id: 'customers', label: 'Customers', icon: '👥', path: '/customers' },
    { id: 'reports', label: 'Reports', icon: '📈', path: '/reports' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const currentMenuItem = menuItems.find(item => item.path === location.pathname);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '250px' : '70px',
        background: '#1e293b',
        borderRight: '1px solid #334155',
        transition: 'width 0.3s ease',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '30px'
          }}>
            <h2 style={{ 
              color: '#3b82f6', 
              margin: 0,
              fontSize: sidebarOpen ? '20px' : '16px',
              whiteSpace: 'nowrap'
            }}>
              {sidebarOpen ? 'POS System' : 'POS'}
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '5px'
              }}
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          <nav>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '8px',
                  background: location.pathname === item.path ? '#3b82f6' : 'transparent',
                  color: '#f1f5f9',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.background = '#334155';
                  }
                }}
                onMouseOut={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ marginRight: sidebarOpen ? '10px' : '0', fontSize: '16px' }}>
                  {item.icon}
                </span>
                {sidebarOpen && item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User info - removed logout from here since it's now in header */}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          background: '#1e293b',
          borderBottom: '1px solid #334155',
          padding: '20px 30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ 
              margin: 0, 
              color: '#f1f5f9', 
              fontSize: '24px',
              fontWeight: '600'
            }}>
              {currentMenuItem?.label || 'POS System'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ color: '#64748b', fontSize: '14px' }}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', background: '#0f172a' }}>
          <div style={{ padding: '30px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
