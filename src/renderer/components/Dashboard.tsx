import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

interface DashboardStats {
  total_products: number;
  low_stock_items: number;
  total_customers: number;
  today_sales: number;
  total_sales: number;
  today_sales_count: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_products: 0,
    low_stock_items: 0,
    total_customers: 0,
    today_sales: 0,
    total_sales: 0,
    today_sales_count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const statCards = [
    {
      title: "Today's Sales",
      value: formatCurrency(stats.today_sales),
      icon: '💰',
      color: '#3b82f6',
      subtitle: `${stats.today_sales_count} transactions`
    },
    {
      title: 'Total Products',
      value: stats.total_products.toString(),
      icon: '📦',
      color: '#10b981',
      subtitle: `${stats.low_stock_items} low stock`
    },
    {
      title: 'Total Customers',
      value: stats.total_customers.toString(),
      icon: '👥',
      color: '#f59e0b',
      subtitle: 'Active customers'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.total_sales),
      icon: '📈',
      color: '#8b5cf6',
      subtitle: 'All time sales'
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: '#64748b' }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        {statCards.map((card, index) => (
          <div
            key={index}
            style={{
              background: '#1e293b',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #334155',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '32px', marginRight: '12px' }}>{card.icon}</span>
              <div>
                <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                  {card.title}
                </div>
                <div style={{ 
                  color: card.color, 
                  fontSize: '28px', 
                  fontWeight: 'bold',
                  lineHeight: '1'
                }}>
                  {card.value}
                </div>
              </div>
            </div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>
              {card.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: '20px' }}>
          Quick Actions
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px' 
        }}>
          <button
            onClick={() => window.location.href = '/sales'}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#334155';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#1e293b';
              e.currentTarget.style.borderColor = '#334155';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
            <div style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '500' }}>
              New Sale
            </div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
              Start a new transaction
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/products'}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#334155';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#1e293b';
              e.currentTarget.style.borderColor = '#334155';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
            <div style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '500' }}>
              Add Product
            </div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
              Add new product to inventory
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/customers'}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#334155';
              e.currentTarget.style.borderColor = '#f59e0b';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#1e293b';
              e.currentTarget.style.borderColor = '#334155';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
            <div style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '500' }}>
              Add Customer
            </div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
              Register new customer
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/reports'}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#334155';
              e.currentTarget.style.borderColor = '#8b5cf6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#1e293b';
              e.currentTarget.style.borderColor = '#334155';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
            <div style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '500' }}>
              View Reports
            </div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
              Sales and inventory reports
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: '20px' }}>
          System Overview
        </h2>
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div>
              <h3 style={{ color: '#3b82f6', marginBottom: '16px', fontSize: '16px' }}>
                Inventory Status
              </h3>
              <div style={{ color: '#f1f5f9', marginBottom: '8px' }}>
                Total Products: {stats.total_products}
              </div>
              <div style={{ color: stats.low_stock_items > 0 ? '#ef4444' : '#10b981' }}>
                Low Stock Items: {stats.low_stock_items}
                {stats.low_stock_items > 0 && (
                  <span style={{ marginLeft: '8px', fontSize: '12px' }}>
                    ⚠️ Needs attention
                  </span>
                )}
              </div>
            </div>
            
            <div>
              <h3 style={{ color: '#10b981', marginBottom: '16px', fontSize: '16px' }}>
                Customer Management
              </h3>
              <div style={{ color: '#f1f5f9', marginBottom: '8px' }}>
                Total Customers: {stats.total_customers}
              </div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>
                Active customer base
              </div>
            </div>
            
            <div>
              <h3 style={{ color: '#f59e0b', marginBottom: '16px', fontSize: '16px' }}>
                Sales Performance
              </h3>
              <div style={{ color: '#f1f5f9', marginBottom: '8px' }}>
                Today: {formatCurrency(stats.today_sales)}
              </div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>
                All Time: {formatCurrency(stats.total_sales)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
