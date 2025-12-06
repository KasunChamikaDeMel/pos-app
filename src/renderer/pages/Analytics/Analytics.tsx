import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiBarChart2, FiPieChart, FiDownload } from 'react-icons/fi';
import './Analytics.css';

const Analytics: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('today');
  const [period, setPeriod] = useState('daily');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    avgSaleValue: 0
  });

  useEffect(() => {
    loadAnalytics();
  }, [dateFilter]);

  const loadAnalytics = () => {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const totalRevenue = sales.reduce((sum: number, s: any) => sum + s.total, 0);
    const totalSales = sales.length;
    const avgSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    setStats({
      totalRevenue,
      totalSales,
      avgSaleValue
    });
  };

  const profitData = [
    { period: 'Daily', dateRange: new Date().toLocaleDateString(), revenue: 0, cost: 0, profit: 0 },
    { period: 'Weekly', dateRange: `${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}`, revenue: 0, cost: 0, profit: 0 },
    { period: 'Monthly', dateRange: `${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}`, revenue: 0, cost: 0, profit: 0 }
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analysis</h1>
        <div className="date-filter">
          <button className="btn btn-secondary">
            {dateFilter === 'today' ? 'Today' : dateFilter} <FiTrendingUp />
          </button>
        </div>
      </div>

      <div className="analytics-kpis">
        <div className="kpi-card">
          <div className="kpi-icon">
            <FiTrendingUp />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">TOTAL REVENUE</p>
            <p className="kpi-value">Rs. {stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">
            <FiBarChart2 />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">TOTAL SALES</p>
            <p className="kpi-value">{stats.totalSales}</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">
            <FiDollarSign />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">AVG. SALE VALUE</p>
            <p className="kpi-value">Rs. {stats.avgSaleValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="analytics-content">
        <div className="analytics-section">
          <div className="section-header">
            <FiBarChart2 className="section-icon" />
            <h2>Top Selling Products</h2>
          </div>
          <div className="empty-chart">
            <p>No sales data available yet. Complete some sales to see analysis.</p>
          </div>
        </div>

        <div className="analytics-section">
          <div className="section-header">
            <FiPieChart className="section-icon" />
            <h2>Sales Summary</h2>
          </div>
          <div className="empty-chart">
            <p>No sales data for selected period.</p>
          </div>
        </div>

        <div className="analytics-section profit-overview">
          <div className="section-header">
            <div>
              <h2>Profit Overview (Admin)</h2>
            </div>
            <div className="section-actions">
              <select
                className="input"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={{ width: '150px' }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <button className="btn btn-secondary btn-sm">
                <FiDownload /> Download Profit Summary
              </button>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>PERIOD</th>
                <th>DATE RANGE</th>
                <th>REVENUE</th>
                <th>COST</th>
                <th>PROFIT</th>
              </tr>
            </thead>
            <tbody>
              {profitData.map((row, index) => (
                <tr key={index}>
                  <td>{row.period}</td>
                  <td>{row.dateRange}</td>
                  <td>Rs. {row.revenue.toFixed(2)}</td>
                  <td>Rs. {row.cost.toFixed(2)}</td>
                  <td>Rs. {row.profit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="analytics-section">
          <div className="section-header">
            <h2>Cash Locker Check</h2>
          </div>
          <div className="cash-locker-form">
            <div className="form-group">
              <label>Business Date</label>
              <input
                type="date"
                className="input"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Opening Deposit (Rs.)</label>
              <input
                type="number"
                className="input"
                placeholder="0.00"
                defaultValue="0.00"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
