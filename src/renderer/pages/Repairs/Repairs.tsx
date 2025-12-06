import React, { useState } from 'react';
import { FiPlus, FiEdit, FiSearch, FiTool, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import './Repairs.css';

interface Repair {
  id: string;
  customerName: string;
  device: string;
  issue: string;
  status: 'pending' | 'in-progress' | 'completed' | 'ready';
  dateReceived: string;
  estimatedCost: number;
  estimatedCompletion: string;
}

const Repairs: React.FC = () => {
  const { t } = useLanguage();
  const [repairs, setRepairs] = useState<Repair[]>([
    {
      id: '1',
      customerName: 'John Doe',
      device: 'Laptop - Dell XPS 15',
      issue: 'Screen replacement needed',
      status: 'in-progress',
      dateReceived: '2024-01-15',
      estimatedCost: 250.00,
      estimatedCompletion: '2024-01-25'
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      device: 'Phone - iPhone 13',
      issue: 'Battery replacement',
      status: 'completed',
      dateReceived: '2024-01-10',
      estimatedCost: 80.00,
      estimatedCompletion: '2024-01-20'
    },
    {
      id: '3',
      customerName: 'Bob Johnson',
      device: 'Tablet - iPad Pro',
      issue: 'Charging port repair',
      status: 'ready',
      dateReceived: '2024-01-18',
      estimatedCost: 120.00,
      estimatedCompletion: '2024-01-22'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRepairs = repairs.filter(r => {
    const matchesSearch = 
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'badge-warning',
      'in-progress': 'badge-info',
      completed: 'badge-success',
      ready: 'badge-success'
    };
    return badges[status as keyof typeof badges] || 'badge-warning';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed' || status === 'ready') return FiCheckCircle;
    if (status === 'in-progress') return FiTool;
    return FiClock;
  };

  return (
    <div className="repairs">
      <div className="repairs-header">
        <h1 className="page-title">{t('repairs.title')}</h1>
        <div className="repairs-actions">
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <FiSearch className="input-icon" />
            <input
              type="text"
              className="input"
              placeholder={t('common.search') + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input"
            style={{ maxWidth: '150px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="ready">Ready</option>
          </select>
          <button className="btn btn-primary">
            <FiPlus /> New Repair
          </button>
        </div>
      </div>

      <div className="card">
        <div className="repairs-list">
          {filteredRepairs.map(repair => {
            const StatusIcon = getStatusIcon(repair.status);
            return (
              <div key={repair.id} className="repair-item">
                <div className="repair-header">
                  <div className="repair-info">
                    <h3 className="repair-device">{repair.device}</h3>
                    <p className="repair-customer">{repair.customerName}</p>
                  </div>
                  <span className={`badge ${getStatusBadge(repair.status)}`}>
                    <StatusIcon style={{ marginRight: '0.25rem' }} />
                    {repair.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="repair-body">
                  <div className="repair-details">
                    <div className="repair-detail">
                      <span className="detail-label">Issue:</span>
                      <span className="detail-value">{repair.issue}</span>
                    </div>
                    <div className="repair-detail">
                      <span className="detail-label">Date Received:</span>
                      <span className="detail-value">
                        {new Date(repair.dateReceived).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="repair-detail">
                      <span className="detail-label">Estimated Cost:</span>
                      <span className="detail-value">${repair.estimatedCost.toFixed(2)}</span>
                    </div>
                    <div className="repair-detail">
                      <span className="detail-label">Estimated Completion:</span>
                      <span className="detail-value">
                        {new Date(repair.estimatedCompletion).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="repair-actions">
                    <button className="btn btn-secondary btn-sm">
                      <FiEdit /> Update
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredRepairs.length === 0 && (
            <div className="empty-state">
              <p>No repairs found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Repairs;
