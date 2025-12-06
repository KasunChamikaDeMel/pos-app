import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import './Inventory.css';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode: string;
  sku: string;
}

const Inventory: React.FC = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Product A',
      category: 'Electronics',
      price: 29.99,
      stock: 50,
      barcode: '123456789',
      sku: 'SKU-001'
    },
    {
      id: '2',
      name: 'Product B',
      category: 'Clothing',
      price: 49.99,
      stock: 30,
      barcode: '987654321',
      sku: 'SKU-002'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barcode.includes(searchTerm) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.stock < 10);

  return (
    <div className="inventory">
      <div className="inventory-header">
        <h1 className="page-title">{t('inventory.title')}</h1>
        <div className="inventory-actions">
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
            <FiPlus /> {t('common.add')} {t('common.product')}
          </button>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="alert alert-warning">
          <FiPackage />
          <span>{lowStockProducts.length} product(s) are low on stock</span>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Products</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('common.product')}</th>
                <th>{t('common.category')}</th>
                <th>SKU</th>
                <th>{t('common.barcode')}</th>
                <th>{t('common.price')}</th>
                <th>{t('common.stock')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <span className="product-name">{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.sku}</td>
                  <td className="barcode-cell">{product.barcode}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span className={`stock-badge ${product.stock < 10 ? 'stock-low' : product.stock < 30 ? 'stock-medium' : 'stock-high'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn" title="Edit">
                        <FiEdit />
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
          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
