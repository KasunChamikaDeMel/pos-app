import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    shopName: 'My POS Shop',
    shopAddress: '123 Main St, City, State',
    shopPhone: '+1-555-0123',
    shopEmail: 'shop@example.com',
    taxRate: '8',
    currency: 'LKR',
    lowStockAlert: '5',
    receiptHeader: 'Thank you for shopping with us!',
    receiptFooter: 'Please come again!',
    enableBarcode: true,
    enablePrintReceipt: true,
    enableEmailReceipt: false
  });

  const [users, setUsers] = useState([
    { id: 1, username: 'admin', role: 'admin', status: 'active' },
    { id: 2, username: 'cashier1', role: 'cashier', status: 'active' }
  ]);

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'backup', label: 'Backup', icon: '💾' },
    { id: 'system', label: 'System', icon: '🖥️' }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('posSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('posSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const renderGeneralSettings = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>Shop Information</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#64748b', marginBottom: '5px', fontSize: '14px' }}>
            Shop Name
          </label>
          <input
            type="text"
            value={settings.shopName}
            onChange={(e) => handleSettingChange('shopName', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#64748b', marginBottom: '5px', fontSize: '14px' }}>
            Address
          </label>
          <input
            type="text"
            value={settings.shopAddress}
            onChange={(e) => handleSettingChange('shopAddress', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#64748b', marginBottom: '5px', fontSize: '14px' }}>
            Phone
          </label>
          <input
            type="tel"
            value={settings.shopPhone}
            onChange={(e) => handleSettingChange('shopPhone', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#64748b', marginBottom: '5px', fontSize: '14px' }}>
            Email
          </label>
          <input
            type="email"
            value={settings.shopEmail}
            onChange={(e) => handleSettingChange('shopEmail', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9'
            }}
          />
        </div>
      </div>

      <div>
        <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>POS Configuration</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#64748b', marginBottom: '5px', fontSize: '14px' }}>
            Tax Rate (%)
          </label>
          <input
            type="number"
            value={settings.taxRate}
            onChange={(e) => handleSettingChange('taxRate', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#64748b', marginBottom: '5px', fontSize: '14px' }}>
            Currency
          </label>
          <select
            value={settings.currency}
            onChange={(e) => handleSettingChange('currency', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9'
            }}
          >
            <option value="LKR">LKR (රු)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#64748b', marginBottom: '5px', fontSize: '14px' }}>
            Low Stock Alert Level
          </label>
          <input
            type="number"
            value={settings.lowStockAlert}
            onChange={(e) => handleSettingChange('lowStockAlert', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', color: '#64748b', marginBottom: '10px', fontSize: '14px' }}>
            Features
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', color: '#f1f5f9', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.enableBarcode}
                onChange={(e) => handleSettingChange('enableBarcode', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Enable Barcode Scanning
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: '#f1f5f9', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.enablePrintReceipt}
                onChange={(e) => handleSettingChange('enablePrintReceipt', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Auto Print Receipts
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: '#f1f5f9', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.enableEmailReceipt}
                onChange={(e) => handleSettingChange('enableEmailReceipt', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Enable Email Receipts
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersSettings = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#f1f5f9', margin: 0 }}>User Management</h3>
        <button
          onClick={() => alert('Add user functionality coming soon')}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          Add User
        </button>
      </div>

      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f172a' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '12px' }}>
                Username
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '12px' }}>
                Role
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '12px' }}>
                Status
              </th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '12px', color: '#f1f5f9' }}>{user.username}</td>
                <td style={{ padding: '12px', color: '#f1f5f9' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: user.role === 'admin' ? '#3b82f6' : '#64748b',
                    color: 'white'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: user.status === 'active' ? '#10b981' : '#ef4444',
                    color: 'white'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => alert('Edit user functionality coming soon')}
                    style={{
                      background: '#334155',
                      color: '#f1f5f9',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      marginRight: '5px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => alert('Delete user functionality coming soon')}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div>
      <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>Backup & Restore</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h4 style={{ color: '#3b82f6', marginBottom: '15px' }}>Backup Database</h4>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>
            Create a backup of your entire database including products, sales, and customer data.
          </p>
          <button
            onClick={() => alert('Backup functionality coming soon')}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Create Backup
          </button>
        </div>

        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h4 style={{ color: '#10b981', marginBottom: '15px' }}>Restore Database</h4>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>
            Restore your database from a previous backup file.
          </p>
          <button
            onClick={() => alert('Restore functionality coming soon')}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Restore Backup
          </button>
        </div>

        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h4 style={{ color: '#f59e0b', marginBottom: '15px' }}>Auto Backup</h4>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>
            Configure automatic daily backups of your data.
          </p>
          <button
            onClick={() => alert('Auto backup configuration coming soon')}
            style={{
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Configure Auto Backup
          </button>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div>
      <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>System Information</h3>
      
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4 style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>Application</h4>
            <div style={{ color: '#f1f5f9', fontSize: '14px', marginBottom: '5px' }}>
              Version: 1.0.0
            </div>
            <div style={{ color: '#f1f5f9', fontSize: '14px', marginBottom: '5px' }}>
              Environment: Development
            </div>
            <div style={{ color: '#f1f5f9', fontSize: '14px' }}>
              Database: SQLite
            </div>
          </div>
          
          <div>
            <h4 style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>System</h4>
            <div style={{ color: '#f1f5f9', fontSize: '14px', marginBottom: '5px' }}>
              Platform: Web
            </div>
            <div style={{ color: '#f1f5f9', fontSize: '14px', marginBottom: '5px' }}>
              Browser: {navigator.userAgent.split(' ')[0]}
            </div>
            <div style={{ color: '#f1f5f9', fontSize: '14px' }}>
              Language: {navigator.language}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4 style={{ color: '#f1f5f9', marginBottom: '15px' }}>System Actions</h4>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => alert('Clear cache functionality coming soon')}
            style={{
              background: '#64748b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            Clear Cache
          </button>
          <button
            onClick={() => alert('Reset settings functionality coming soon')}
            style={{
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            Reset Settings
          </button>
          <button
            onClick={() => alert('System diagnostics coming soon')}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              cursor: 'pointer'
            }}
          >
            Run Diagnostics
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px',
        borderBottom: '1px solid #334155',
        paddingBottom: '20px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              background: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: '#f1f5f9',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'users' && renderUsersSettings()}
        {activeTab === 'backup' && renderBackupSettings()}
        {activeTab === 'system' && renderSystemSettings()}
      </div>

      {activeTab === 'general' && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: '30px',
          borderTop: '1px solid #334155',
          paddingTop: '20px'
        }}>
          <button
            onClick={saveSettings}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
