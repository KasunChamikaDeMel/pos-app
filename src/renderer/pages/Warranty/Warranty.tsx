import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiShield, FiSearch } from 'react-icons/fi';
import './Warranty.css';

interface WarrantyItem {
  id: string;
  productName: string;
  customerName: string;
  purchaseDate: string;
  warrantyExpiry: string;
  status: 'active' | 'expired' | 'void';
}

const Warranty: React.FC = () => {
  const [warranties, setWarranties] = useState<WarrantyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadWarranties();
  }, []);

  const loadWarranties = () => {
    const saved = localStorage.getItem('warranties');
    if (saved) {
      setWarranties(JSON.parse(saved));
    } else {
      setWarranties([]);
    }
  };

  const filteredWarranties = warranties.filter(w =>
    w.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const active = warranties.filter(w => w.status === 'active').length;
  const expired = warranties.filter(w => w.status === 'expired').length;

  return (
    <div className="warranty-page">
      <div className="warranty-header">
        <h1>Warranty</h1>
        <button className="btn btn-primary">
          <FiPlus /> Add Warranty
        </button>
      </div>

      <div className="warranty-stats">
        <div className="stat-card">
          <div className="stat-icon green">
            <FiShield />
          </div>
          <div className="stat-content">
            <p className="stat-label">ACTIVE WARRANTIES</p>
            <p className="stat-value">{active}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <FiShield />
          </div>
          <div className="stat-content">
            <p className="stat-label">EXPIRED</p>
            <p className="stat-value">{expired}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">
            <FiShield />
          </div>
          <div className="stat-content">
            <p className="stat-label">TOTAL WARRANTIES</p>
            <p className="stat-value">{warranties.length}</p>
          </div>
        </div>
      </div>

      <div className="warranty-content">
        <div className="warranty-filters">
          <div className="search-group">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="input search-input"
              placeholder="Search warranties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>CUSTOMER</th>
              <th>PURCHASE DATE</th>
              <th>EXPIRY DATE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredWarranties.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  No warranty records found
                </td>
              </tr>
            ) : (
              filteredWarranties.map(w => (
                <tr key={w.id}>
                  <td>{w.productName}</td>
                  <td>{w.customerName}</td>
                  <td>{new Date(w.purchaseDate).toLocaleDateString()}</td>
                  <td>{new Date(w.warrantyExpiry).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${
                      w.status === 'active' ? 'badge-success' :
                      w.status === 'expired' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm">
                        <FiEdit />
                      </button>
                      <button className="btn btn-danger btn-sm">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Warranty;

