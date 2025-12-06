import React, { useState, useEffect } from 'react';
import { FiPlus, FiEye, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import './Returns.css';

interface ReturnItem {
  id: string;
  date: string;
  saleId: string;
  customer: string;
  items: number;
  totalAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const Returns: React.FC = () => {
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadReturns();
  }, []);

  const loadReturns = () => {
    const saved = localStorage.getItem('returns');
    if (saved) {
      setReturns(JSON.parse(saved));
    } else {
      setReturns([]);
    }
  };

  const filteredReturns = filterStatus === 'all'
    ? returns
    : returns.filter(ret => ret.status === filterStatus);

  const totalReturns = returns.length;
  const pending = returns.filter(ret => ret.status === 'pending').length;
  const approved = returns.filter(ret => ret.status === 'approved').length;
  const totalValue = returns.reduce((sum, ret) => sum + ret.totalAmount, 0);

  return (
    <div className="returns-page">
      <div className="returns-header">
        <h1>Returns</h1>
        <button className="btn btn-primary">
          <FiPlus /> New Return
        </button>
      </div>

      <div className="returns-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FiRefreshCw />
          </div>
          <div className="stat-content">
            <p className="stat-label">TOTAL RETURNS</p>
            <p className="stat-value">{totalReturns}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <FiRefreshCw />
          </div>
          <div className="stat-content">
            <p className="stat-label">PENDING</p>
            <p className="stat-value">{pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <FiRefreshCw />
          </div>
          <div className="stat-content">
            <p className="stat-label">APPROVED</p>
            <p className="stat-value">{approved}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <FiRefreshCw />
          </div>
          <div className="stat-content">
            <p className="stat-label">TOTAL VALUE</p>
            <p className="stat-value">Rs. {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="returns-content">
        <div className="returns-filters">
          <h2>Return Records</h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input"
            style={{ width: '200px' }}
          >
            <option value="all">Filter by Status: All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>RETURN ID</th>
              <th>DATE</th>
              <th>SALE ID</th>
              <th>CUSTOMER</th>
              <th>ITEMS</th>
              <th>AMOUNT</th>
              <th>REASON</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                  No return records found
                </td>
              </tr>
            ) : (
              filteredReturns.map(ret => (
                <tr key={ret.id}>
                  <td>{ret.id}</td>
                  <td>{new Date(ret.date).toLocaleDateString()}</td>
                  <td>{ret.saleId}</td>
                  <td>{ret.customer}</td>
                  <td>{ret.items}</td>
                  <td>Rs. {ret.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{ret.reason}</td>
                  <td>
                    <span className={`badge ${
                      ret.status === 'approved' ? 'badge-success' :
                      ret.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {ret.status.charAt(0).toUpperCase() + ret.status.slice(1)}
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

export default Returns;

