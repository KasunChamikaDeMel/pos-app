import React, { useState } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import './ProductSearchModal.css';

interface Product {
  id: string;
  name: string;
  price: number;
  barcode?: string;
  stock: number;
}

interface ProductSearchModalProps {
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

const ProductSearchModal: React.FC<ProductSearchModalProps> = ({ onClose, onSelectProduct }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock products (in production, fetch from API)
  const products: Product[] = [
    { id: '1', name: 'Product A', price: 29.99, barcode: '123456789', stock: 50 },
    { id: '2', name: 'Product B', price: 49.99, barcode: '987654321', stock: 30 },
    { id: '3', name: 'Product C', price: 19.99, barcode: '456789123', stock: 25 },
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barcode?.includes(searchTerm)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t('common.search')} {t('common.product')}</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          <div className="input-group">
            <FiSearch className="input-icon" />
            <input
              type="text"
              className="input"
              placeholder={t('common.search') + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="product-list">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="product-item"
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
              >
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-details">
                    ${product.price.toFixed(2)} • Stock: {product.stock}
                  </p>
                </div>
                <button className="btn btn-primary btn-sm">Add</button>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="empty-state">No products found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchModal;
