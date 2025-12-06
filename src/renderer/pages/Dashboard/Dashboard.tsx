import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiPackage, FiUsers, FiTrendingUp, FiShoppingCart, FiAlertTriangle } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockItems: 0,
    totalCustomers: 0,
    todaySales: 0,
    totalSales: 0,
    totalSalesCount: 0,
    averageSale: 0,
    totalInventoryValue: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    
    const today = new Date().toDateString();
    const todaySales = sales
      .filter((s: any) => new Date(s.date).toDateString() === today)
      .reduce((sum: number, s: any) => sum + s.total, 0);
    
    const totalSales = sales.reduce((sum: number, s: any) => sum + s.total, 0);
    const totalStock = products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0);
    const lowStockItems = products.filter((p: any) => (p.stock || 0) < 10).length;
    const totalInventoryValue = products.reduce((sum: number, p: any) => sum + ((p.stock || 0) * (p.price || 0)), 0);
    const averageSale = sales.length > 0 ? totalSales / sales.length : 0;

    setStats({
      totalProducts: products.length,
      totalStock,
      lowStockItems,
      totalCustomers: customers.length,
      todaySales,
      totalSales,
      totalSalesCount: sales.length,
      averageSale,
      totalInventoryValue
    });
  };

  const statCards = [
    {
      title: 'TOTAL PRODUCTS',
      value: stats.totalProducts.toString(),
      icon: FiPackage,
      color: 'blue'
    },
    {
      title: 'TOTAL STOCK',
      value: stats.totalStock.toLocaleString(),
      icon: FiShoppingCart,
      color: 'green'
    },
    {
      title: 'LOW STOCK ITEMS',
      value: stats.lowStockItems.toString(),
      icon: FiAlertTriangle,
      color: 'red'
    },
    {
      title: 'TOTAL CUSTOMERS',
      value: stats.totalCustomers.toString(),
      icon: FiUsers,
      color: 'purple'
    },
    {
      title: 'TODAY\'S SALES',
      value: `Rs. ${stats.todaySales.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'yellow'
    },
    {
      title: 'TOTAL SALES',
      value: `Rs. ${stats.totalSales.toFixed(2)}`,
      icon: FiTrendingUp,
      color: 'green'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome to Kyndex POS System</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`stat-card stat-card-${stat.color}`}>
              <div className="stat-icon">
                <Icon />
              </div>
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="quick-stats">
        <h2>Quick Stats</h2>
        <div className="quick-stats-grid">
          <div className="quick-stat-item">
            <span className="quick-stat-label">Total Sales Count:</span>
            <span className="quick-stat-value">{stats.totalSalesCount}</span>
          </div>
          <div className="quick-stat-item">
            <span className="quick-stat-label">Average Sale:</span>
            <span className="quick-stat-value">Rs. {stats.averageSale.toFixed(2)}</span>
          </div>
          <div className="quick-stat-item">
            <span className="quick-stat-label">Total Inventory Value:</span>
            <span className="quick-stat-value">Rs. {stats.totalInventoryValue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
