import React from 'react';
import { FiBell, FiUser, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import './Header.css';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'si' : 'en');
  };

  const shopName = localStorage.getItem('shopName') || 'POS System';
  const userName = localStorage.getItem('userName') || 'Administrator';
  const userRole = localStorage.getItem('userRole') || 'Admin';

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{shopName}</h1>
      </div>
      <div className="header-right">
        <button
          className="header-icon-btn"
          onClick={toggleLanguage}
          title={language === 'en' ? 'Switch to Sinhala' : 'Switch to English'}
        >
          <FiGlobe />
          <span className="header-lang-badge">{language.toUpperCase()}</span>
        </button>
        <button className="header-icon-btn" title="Notifications">
          <FiBell />
          <span className="header-badge">3</span>
        </button>
        <button className="header-icon-btn" title={`${userName} ${userRole}`}>
          <FiUser />
          <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>
            {userName.charAt(0).toUpperCase()} {userName} {userRole}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
