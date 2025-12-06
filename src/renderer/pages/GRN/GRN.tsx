import React, { useState, useEffect } from 'react';
import { FiPlus, FiEye, FiTrash2, FiTruck } from 'react-icons/fi';
import './GRN.css';

interface GRNItem {
  id: string;
  date: string;
  supplier: string;
  items: number;
  totalAmount: number;
  status: 'pending' | 'completed';
}

const GRN: React.FC = () => {
  const [grns, setGrns] = useState<GRNItem[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadGRNs();
  }, []);

  const loadGRNs = () => {
    const saved = localStorage.getItem('grns');
    if (saved) {
      setGrns(JSON.parse(saved));
    } else {
      // Sample data
      const sample: GRNItem[] = [
        {
          id: 'GRN001',
          date: '2025-10-24',
          supplier: 'MSI',
          items: 100,
          totalAmount: 125000,
          status: 'completed'
        },
        {
          id: 'GRN002',
          date: '2025-10-24',
          supplier: 'MSI',
          items: 100,
          totalAmount: 100000,
          status: 'completed'
        },
        {
          id: 'GRN003',
          date: '2025-10-27',
          supplier: 'samsung',
          items: 200,
          totalAmount: 700000,
          status: 'completed'
        },
        {
          id: 'GRN004',
          date: '2025-10-30',
          supplier: 'abdas',
          items: 500,
          totalAmount: 125000,
          status: 'completed'
        }
      ];
      setGrns(sample);
      localStorage.setItem('grns', JSON.stringify(sample));
    }
  };

  const filteredGRNs = filterStatus === 'all'
    ? grns
    : grns.filter(grn => grn.status === filterStatus);

  const totalGRNs = grns.length;
  const thisMonth = grns.filter(grn => {
    const grnDate = new Date(grn.date);
    const now = new Date();
    return grnDate.getMonth() === now.getMonth() && grnDate.getFullYear() === now.getFullYear();
  }).length;
  const pending = grns.filter(grn => grn.status === 'pending').length;
  const totalValue = grns.reduce((sum, grn) => sum + grn.totalAmount, 0);

  return (
    <div className="grn-page">
      <div className="grn-header">
        <h1>GRN</h1>
        <button className="btn btn-primary">
          <FiPlus /> New GRN
        </button>
      </div>

      <div className="grn-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FiTruck />
          </div>
          <div className="stat-content">
            <p className="stat-label">TOTAL GRNS</p>
            <p className="stat-value">{totalGRNs}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <FiTruck />
          </div>
          <div className="stat-content">
            <p className="stat-label">THIS MONTH</p>
            <p className="stat-value">{thisMonth}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <FiTruck />
          </div>
          <div className="stat-content">
            <p className="stat-label">PENDING</p>
            <p className="stat-value">{pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <FiTruck />
          </div>
          <div className="stat-content">
            <p className="stat-label">TOTAL VALUE</p>
            <p className="stat-value">Rs. {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="grn-content">
        <div className="grn-filters">
          <h2>GRN Records</h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input"
            style={{ width: '200px' }}
          >
            <option value="all">Filter by Status: All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>GRN ID</th>
              <th>DATE</th>
              <th>SUPPLIER</th>
              <th>ITEMS</th>
              <th>TOTAL AMOUNT</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredGRNs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  No GRN records found
                </td>
              </tr>
            ) : (
              filteredGRNs.map(grn => (
                <tr key={grn.id}>
                  <td>{grn.id}</td>
                  <td>{new Date(grn.date).toLocaleDateString()}</td>
                  <td>{grn.supplier}</td>
                  <td>{grn.items}</td>
                  <td>Rs. {grn.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`badge ${grn.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {grn.status.charAt(0).toUpperCase() + grn.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm">
                        <FiEye />
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

export default GRN;

