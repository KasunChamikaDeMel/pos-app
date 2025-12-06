import React, { useState, useEffect } from 'react';
import { FiPackage, FiSearch } from 'react-icons/fi';
import './Stocks.css';

interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  price: number;
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const Stocks: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const saved = localStorage.getItem('products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      // Sample data
      const sample: Product[] = [
        {
          id: 'PROD-1',
          name: 'MSI',
          barcode: '74185296',
          category: 'Vegetables',
          price: 500,
          stock: 16,
          status: 'low-stock'
        },
        {
          id: 'REPAIR-SERVICE',
          name: 'Repair Service',
          barcode: 'REPAIR-SERVICE',
          category: 'Service',
          price: 0,
          stock: 1,
          status: 'low-stock'
        },
        {
          id: 'PROD-2',
          name: 'Windows 11',
          barcode: '789653026',
          category: 'Services',
          price: 1500,
          stock: 49996,
          status: 'in-stock'
        },
        {
          id: 'PROD-3',
          name: 'bola bite',
          barcode: 'Not set',
          category: 'Vegetables',
          price: 500,
          stock: 500,
          status: 'in-stock'
        }
      ];
      setProducts(sample);
      localStorage.setItem('products', JSON.stringify(sample));
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter(p => p.status === 'low-stock' || p.stock < 10).length;

  return (
    <div className="stocks-page">
      <div className="stocks-header">
        <h1>Stocks</h1>
      </div>

      <div className="stocks-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FiPackage />
          </div>
          <div className="stat-content">
            <p className="stat-label">TOTAL PRODUCTS</p>
            <p className="stat-value">{totalProducts}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <FiPackage />
          </div>
          <div className="stat-content">
            <p className="stat-label">TOTAL STOCK</p>
            <p className="stat-value">{totalStock.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <FiPackage />
          </div>
          <div className="stat-content">
            <p className="stat-label">LOW STOCK</p>
            <p className="stat-value">{lowStock}</p>
          </div>
        </div>
      </div>

      <div className="stocks-content">
        <div className="stocks-filters">
          <h2>Product Inventory</h2>
          <div className="search-group">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="input search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>PRODUCT NAME</th>
              <th>BARCODE</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.barcode}</td>
                  <td>{product.category}</td>
                  <td>Rs. {product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`badge ${
                      product.status === 'in-stock' ? 'badge-success' :
                      product.status === 'low-stock' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {product.status === 'in-stock' ? 'In Stock' :
                       product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                    </span>
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

export default Stocks;

