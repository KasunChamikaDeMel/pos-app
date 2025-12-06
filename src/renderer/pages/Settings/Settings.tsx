import React, { useState, useEffect } from 'react';
import { FiSave, FiPrinter, FiShield, FiGlobe, FiDatabase, FiSettings, FiHome } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import './Settings.css';

const Settings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('shop');
  const [shopInfo, setShopInfo] = useState({
    name: localStorage.getItem('shopName') || 'POS System',
    address: localStorage.getItem('shopAddress') || '',
    phone: localStorage.getItem('shopPhone') || '',
    email: localStorage.getItem('shopEmail') || ''
  });
  const [printerSettings, setPrinterSettings] = useState({
    enabled: false,
    printerName: '',
    paperSize: 'A4'
  });
  const [barcodeSettings, setBarcodeSettings] = useState({
    enabled: true,
    autoAdd: true
  });
  const [generalSettings, setGeneralSettings] = useState({
    taxRate: parseFloat(localStorage.getItem('taxRate') || '0'),
    currency: localStorage.getItem('currency') || 'LKR',
    lowStockThreshold: parseInt(localStorage.getItem('lowStockThreshold') || '10')
  });

  useEffect(() => {
    const saved = localStorage.getItem('settings');
    if (saved) {
      const settings = JSON.parse(saved);
      if (settings.shopInfo) setShopInfo(settings.shopInfo);
      if (settings.printer) setPrinterSettings(settings.printer);
      if (settings.barcode) setBarcodeSettings(settings.barcode);
      if (settings.general) setGeneralSettings(settings.general);
    }
  }, []);

  const handleSaveShopInfo = () => {
    localStorage.setItem('shopName', shopInfo.name);
    localStorage.setItem('shopAddress', shopInfo.address);
    localStorage.setItem('shopPhone', shopInfo.phone);
    localStorage.setItem('shopEmail', shopInfo.email);
    alert('Shop information saved!');
  };

  const handleSaveSettings = () => {
    const allSettings = {
      shopInfo,
      printer: printerSettings,
      barcode: barcodeSettings,
      general: generalSettings
    };
    localStorage.setItem('settings', JSON.stringify(allSettings));
    localStorage.setItem('taxRate', generalSettings.taxRate.toString());
    localStorage.setItem('currency', generalSettings.currency);
    localStorage.setItem('lowStockThreshold', generalSettings.lowStockThreshold.toString());
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'shop', label: 'Shop Information', icon: FiHome },
    { id: 'printer', label: 'Printer Settings', icon: FiPrinter },
    { id: 'barcode', label: 'Barcode Reader', icon: FiSettings },
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'language', label: 'Language', icon: FiGlobe },
    { id: 'license', label: 'License', icon: FiShield },
    { id: 'data', label: 'Data Management', icon: FiDatabase }
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Configure your POS system, printers, and barcode readers</p>
      </div>

      <div className="settings-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="settings-content">
        {activeTab === 'shop' && (
          <div className="settings-tab-content">
            <div className="settings-panel">
              <h2>Shop Information</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label>Shop Name</label>
                  <input
                    type="text"
                    className="input"
                    value={shopInfo.name}
                    onChange={(e) => setShopInfo({ ...shopInfo, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Shop Address</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={shopInfo.address}
                    onChange={(e) => setShopInfo({ ...shopInfo, address: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Shop Phone</label>
                  <input
                    type="text"
                    className="input"
                    value={shopInfo.phone}
                    onChange={(e) => setShopInfo({ ...shopInfo, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Shop Email</label>
                  <input
                    type="email"
                    className="input"
                    value={shopInfo.email}
                    onChange={(e) => setShopInfo({ ...shopInfo, email: e.target.value })}
                  />
                </div>
                <button className="btn btn-primary" onClick={handleSaveShopInfo}>
                  <FiSave /> Save Shop Information
                </button>
              </div>
            </div>
            <div className="settings-preview">
              <h3>Receipt Preview</h3>
              <div className="receipt-preview">
                <div className="receipt-logo">Kyndex Labs</div>
                <div className="receipt-shop-name">{shopInfo.name}</div>
                <div className="receipt-details">
                  {shopInfo.address && <div>{shopInfo.address}</div>}
                  {shopInfo.phone && <div>Tel: {shopInfo.phone}</div>}
                  {shopInfo.email && <div>Email: {shopInfo.email}</div>}
                </div>
                <div className="receipt-note">This information will appear on all receipts</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'printer' && (
          <div className="settings-tab-content">
            <div className="settings-panel">
              <h2>Printer Settings</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={printerSettings.enabled}
                      onChange={(e) => setPrinterSettings({ ...printerSettings, enabled: e.target.checked })}
                    />
                    Enable Receipt Printing
                  </label>
                </div>
                <div className="form-group">
                  <label>Printer Name</label>
                  <input
                    type="text"
                    className="input"
                    value={printerSettings.printerName}
                    onChange={(e) => setPrinterSettings({ ...printerSettings, printerName: e.target.value })}
                    placeholder="Select printer..."
                  />
                </div>
                <div className="form-group">
                  <label>Paper Size</label>
                  <select
                    className="input"
                    value={printerSettings.paperSize}
                    onChange={(e) => setPrinterSettings({ ...printerSettings, paperSize: e.target.value })}
                  >
                    <option value="A4">A4</option>
                    <option value="Receipt">Receipt (58mm)</option>
                    <option value="Receipt80">Receipt (80mm)</option>
                  </select>
                </div>
                <button className="btn btn-primary" onClick={handleSaveSettings}>
                  <FiSave /> Save Printer Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'barcode' && (
          <div className="settings-tab-content">
            <div className="settings-panel">
              <h2>Barcode Reader Settings</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={barcodeSettings.enabled}
                      onChange={(e) => setBarcodeSettings({ ...barcodeSettings, enabled: e.target.checked })}
                    />
                    Enable Barcode Scanner
                  </label>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={barcodeSettings.autoAdd}
                      onChange={(e) => setBarcodeSettings({ ...barcodeSettings, autoAdd: e.target.checked })}
                    />
                    Auto-add to cart on scan
                  </label>
                </div>
                <button className="btn btn-primary" onClick={handleSaveSettings}>
                  <FiSave /> Save Barcode Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="settings-tab-content">
            <div className="settings-panel">
              <h2>General Settings</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label>Tax Rate (%)</label>
                  <input
                    type="number"
                    className="input"
                    value={generalSettings.taxRate}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, taxRate: parseFloat(e.target.value) || 0 })}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    className="input"
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                  >
                    <option value="LKR">LKR (Rs)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Low Stock Threshold</label>
                  <input
                    type="number"
                    className="input"
                    value={generalSettings.lowStockThreshold}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, lowStockThreshold: parseInt(e.target.value) || 0 })}
                    min="1"
                  />
                </div>
                <button className="btn btn-primary" onClick={handleSaveSettings}>
                  <FiSave /> Save General Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'language' && (
          <div className="settings-tab-content">
            <div className="settings-panel">
              <h2>Language Settings</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label>Select Language</label>
                  <select
                    className="input"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'si')}
                  >
                    <option value="en">English</option>
                    <option value="si">සිංහල (Sinhala)</option>
                  </select>
                </div>
                <button className="btn btn-primary" onClick={handleSaveSettings}>
                  <FiSave /> Save Language Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'license' && (
          <div className="settings-tab-content">
            <div className="settings-panel">
              <h2>License Information</h2>
              <div className="license-info">
                <div className="license-status-badge">
                  <FiShield /> License Active
                </div>
                <div className="license-details">
                  <div className="license-detail-item">
                    <span>License Type:</span>
                    <span>45-Day Trial</span>
                  </div>
                  <div className="license-detail-item">
                    <span>Activated On:</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                  <div className="license-detail-item">
                    <span>Status:</span>
                    <span style={{ color: '#10b981' }}>32 days remaining</span>
                  </div>
                  <div className="license-detail-item">
                    <span>Expires On:</span>
                    <span>{new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toLocaleString()}</span>
                  </div>
                </div>
                <div className="license-actions">
                  <button className="btn btn-danger">Deactivate License</button>
                  <button className="btn btn-secondary">Refresh Status</button>
                </div>
                <div className="license-note">
                  Note: Deactivating your license will require you to enter a new activation key to continue using the application.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="settings-tab-content">
            <div className="settings-panel">
              <h2>Data Management</h2>
              <div className="settings-form">
                <div className="data-actions">
                  <button className="btn btn-primary">
                    <FiDatabase /> Export Data
                  </button>
                  <button className="btn btn-secondary">
                    <FiDatabase /> Import Data
                  </button>
                  <button className="btn btn-danger">
                    <FiDatabase /> Clear All Data
                  </button>
                </div>
                <div className="data-info">
                  <p>Export your data to backup or transfer to another system.</p>
                  <p>Import data from a previous backup.</p>
                  <p className="warning">Warning: Clearing all data cannot be undone!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
