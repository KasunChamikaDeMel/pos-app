import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiMail, FiPhone } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import './Customers.css';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
  warrantyItems: number;
  joinDate: string;
}

const Customers: React.FC = () => {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      totalPurchases: 1250.50,
      warrantyItems: 3,
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321',
      address: '456 Oak Ave',
      totalPurchases: 890.25,
      warrantyItems: 1,
      joinDate: '2024-02-20'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="customers">
      <div className="customers-header">
        <h1 className="page-title">{t('customers.title')}</h1>
        <div className="customers-actions">
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
          <button className="btn btn-primary">
            <FiPlus /> {t('common.add')} Customer
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Customers</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('common.name')}</th>
                <th>{t('common.email')}</th>
                <th>{t('common.phone')}</th>
                <th>{t('common.address')}</th>
                <th>Total Purchases</th>
                <th>Warranty Items</th>
                <th>Join Date</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-cell">
                      <span className="customer-name">{customer.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <FiMail className="contact-icon" />
                      {customer.email}
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <FiPhone className="contact-icon" />
                      {customer.phone}
                    </div>
                  </td>
                  <td>{customer.address}</td>
                  <td>${customer.totalPurchases.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-info">{customer.warrantyItems}</span>
                  </td>
                  <td>{new Date(customer.joinDate).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn" title="Edit">
                        <FiEdit />
                      </button>
                      <button className="icon-btn" title="View Warranty">
                        Warranty
                      </button>
                      <button className="icon-btn icon-btn-danger" title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="empty-state">
              <p>No customers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
