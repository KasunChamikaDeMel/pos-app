import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiLayout,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiBarChart2,
  FiTool,
  FiSettings,
  FiLogOut,
  FiTruck,
  FiRefreshCw,
  FiUser,
  FiShield,
  FiDollarSign
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import './Sidebar.css';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, onLogout }) => {
  const { t } = useLanguage();

  const menuItems = [
    { path: '/dashboard', icon: FiLayout, label: 'Dashboard' },
    { path: '/sale', icon: FiShoppingCart, label: 'Sale' },
    { path: '/repairs', icon: FiTool, label: 'Repairs' },
    { path: '/sales', icon: FiDollarSign, label: 'Sales' },
    { path: '/returns', icon: FiRefreshCw, label: 'Returns' },
    { path: '/inventory', icon: FiPackage, label: 'Products' },
    { path: '/grn', icon: FiTruck, label: 'GRN' },
    { path: '/users', icon: FiUser, label: 'User Management' },
    { path: '/stocks', icon: FiPackage, label: 'Stocks' },
    { path: '/analytics', icon: FiBarChart2, label: 'Analysis' },
    { path: '/customers', icon: FiUsers, label: 'Customers' },
    { path: '/warranty', icon: FiShield, label: 'Warranty' },
    { path: '/settings', icon: FiSettings, label: 'Settings' }
  ];

  // Get shop name from localStorage or use default
  const shopName = localStorage.getItem('shopName') || 'POS System';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">{shopName}</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path === '/sale' && currentPath === '/sales');
          return (
            <button
              key={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.path)}
            >
              <Icon className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-item" onClick={onLogout}>
          <FiLogOut className="sidebar-icon" />
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
