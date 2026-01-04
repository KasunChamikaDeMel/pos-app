import React, { useState, useEffect } from 'react';
import { salesAPI, productsAPI, customersAPI } from '../services/api';

interface SalesData {
  id: number;
  sale_number: string;
  total_amount: number;
  created_at: string;
  customer_name?: string;
}

const Reports: React.FC = () => {
  const [sales, setSales] = useState<SalesData[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0] // Today
  });

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const [salesData, productsData, customersData] = await Promise.all([
        salesAPI.getAll({ start_date: dateRange.start, end_date: dateRange.end, limit: 100 }),
        productsAPI.getAll(),
        customersAPI.getAll()
      ]);
      
      setSales(salesData);
      setProducts(productsData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-LK', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      time: date.toLocaleTimeString('en-LK', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const calculateStats = () => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
    const totalSales = sales.length;
    const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;
    
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock_quantity <= p.min_stock_level).length;
    const outOfStockProducts = products.filter(p => p.stock_quantity === 0).length;
    
    const totalCustomers = customers.length;
    
    // Sales by day
    const salesByDay: { [key: string]: number } = {};
    sales.forEach(sale => {
      const date = new Date(sale.created_at).toLocaleDateString();
      salesByDay[date] = (salesByDay[date] || 0) + sale.total_amount;
    });
    
    return {
      totalRevenue,
      totalSales,
      averageSale,
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalCustomers,
      salesByDay
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: '#64748b' }}>Loading reports...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#f1f5f9', margin: '0 0 20px 0' }}>Reports & Analytics</h2>
        
        {/* Date Range Filter */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ color: '#64748b', fontSize: '14px', marginRight: '8px' }}>From:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              style={{
                padding: '8px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#f1f5f9'
              }}
            />
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: '14px', marginRight: '8px' }}>To:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              style={{
                padding: '8px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#f1f5f9'
              }}
            />
          </div>
          <button
            onClick={loadReportData}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
            Total Revenue
          </div>
          <div style={{ color: '#3b82f6', fontSize: '28px', fontWeight: 'bold' }}>
            {formatCurrency(stats.totalRevenue)}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
            From {stats.totalSales} sales
          </div>
        </div>

        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
            Average Sale
          </div>
          <div style={{ color: '#10b981', fontSize: '28px', fontWeight: 'bold' }}>
            {formatCurrency(stats.averageSale)}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
            Per transaction
          </div>
        </div>

        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
            Products
          </div>
          <div style={{ color: '#f59e0b', fontSize: '28px', fontWeight: 'bold' }}>
            {stats.totalProducts}
          </div>
          <div style={{ 
            color: stats.outOfStockProducts > 0 ? '#ef4444' : '#10b981', 
            fontSize: '12px', 
            marginTop: '4px' 
          }}>
            {stats.lowStockProducts} low stock
          </div>
        </div>

        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
            Customers
          </div>
          <div style={{ color: '#8b5cf6', fontSize: '28px', fontWeight: 'bold' }}>
            {stats.totalCustomers}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
            Total registered
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>Recent Sales</h3>
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '12px' }}>
                    Sale #
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '12px' }}>
                    Customer
                  </th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: '12px' }}>
                    Amount
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '12px' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '12px' }}>
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '12px', color: '#f1f5f9', fontSize: '14px' }}>
                      {sale.sale_number}
                    </td>
                    <td style={{ padding: '12px', color: '#f1f5f9', fontSize: '14px' }}>
                      {sale.customer_name || 'Walk-in Customer'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#3b82f6', fontWeight: '500' }}>
                      {formatCurrency(sale.total_amount)}
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: '14px' }}>
                      {formatDateTime(sale.created_at).date}
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: '14px' }}>
                      {formatDateTime(sale.created_at).time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {sales.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No sales found in this period
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Status */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>Inventory Status</h3>
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
            <h4 style={{ color: '#10b981', marginBottom: '15px' }}>In Stock</h4>
            <div style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: 'bold' }}>
              {products.filter(p => p.stock_quantity > p.min_stock_level).length}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>
              Products with adequate stock
            </div>
          </div>

          <div style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h4 style={{ color: '#f59e0b', marginBottom: '15px' }}>Low Stock</h4>
            <div style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: 'bold' }}>
              {stats.lowStockProducts}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>
              Products need restocking
            </div>
          </div>

          <div style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h4 style={{ color: '#ef4444', marginBottom: '15px' }}>Out of Stock</h4>
            <div style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: 'bold' }}>
              {stats.outOfStockProducts}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>
              Products unavailable
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div>
        <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>Export Reports</h3>
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap' 
        }}>
          <button
            onClick={() => alert('PDF export coming soon')}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '10px 20px',
              color: '#f1f5f9',
              cursor: 'pointer'
            }}
          >
            📄 Export as PDF
          </button>
          <button
            onClick={() => alert('Excel export coming soon')}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '10px 20px',
              color: '#f1f5f9',
              cursor: 'pointer'
            }}
          >
            📊 Export as Excel
          </button>
          <button
            onClick={() => alert('CSV export coming soon')}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '10px 20px',
              color: '#f1f5f9',
              cursor: 'pointer'
            }}
          >
            📋 Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
