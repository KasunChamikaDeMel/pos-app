import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiPrinter, FiSearch, FiX } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { generateReceiptPDF } from '../../utils/pdfGenerator';
import ProductSearchModal from '../../components/Sales/ProductSearchModal';
import './Sales.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode?: string;
}

const Sales: React.FC = () => {
  const { t } = useLanguage();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Listen for barcode scanner input
    if (window.electronAPI) {
      window.electronAPI.barcode.onData((data: string) => {
        handleBarcodeScan(data);
      });
    }

    // Focus barcode input on mount
    barcodeInputRef.current?.focus();
  }, []);

  const handleBarcodeScan = (barcode: string) => {
    // Search for product by barcode
    const product = findProductByBarcode(barcode);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      alert(`Product with barcode ${barcode} not found`);
    }
  };

  const findProductByBarcode = (barcode: string) => {
    // Mock product data (in production, fetch from API)
    const mockProducts = [
      { id: '1', name: 'Product A', price: 29.99, barcode: '123456789' },
      { id: '2', name: 'Product B', price: 49.99, barcode: '987654321' },
    ];
    return mockProducts.find(p => p.barcode === barcode);
  };

  const addToCart = (product: { id: string; name: string; price: number; barcode?: string }) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    // Generate receipt
    await generateReceiptPDF({
      items: cart,
      subtotal,
      tax,
      total,
      date: new Date(),
      invoiceNumber: `INV-${Date.now()}`
    });

    // Clear cart
    setCart([]);
    alert('Sale completed! Receipt generated.');
  };

  return (
    <div className="sales">
      <div className="sales-header">
        <h1 className="page-title">{t('sales.title')}</h1>
        <div className="sales-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowProductModal(true)}
          >
            <FiPlus /> {t('common.add')} {t('common.product')}
          </button>
        </div>
      </div>

      <div className="sales-content">
        <div className="sales-left">
          <div className="barcode-input-section">
            <div className="input-group">
              <FiSearch className="input-icon" />
              <input
                ref={barcodeInputRef}
                type="text"
                className="input"
                placeholder={t('common.barcode') + '...'}
                value={barcodeInput}
                onChange={(e) => {
                  setBarcodeInput(e.target.value);
                  if (e.target.value.length >= 8) {
                    handleBarcodeScan(e.target.value);
                  }
                }}
              />
              {barcodeInput && (
                <button
                  className="input-clear"
                  onClick={() => setBarcodeInput('')}
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          <div className="cart-section">
            <h2 className="section-title">Cart</h2>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>{t('common.cart')} is empty</p>
                <p className="empty-cart-hint">Scan barcode or add products manually</p>
              </div>
            ) : (
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="quantity-input"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        min="1"
                      />
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sales-right">
          <div className="checkout-card">
            <h2 className="checkout-title">Order Summary</h2>
            <div className="checkout-details">
              <div className="checkout-row">
                <span>{t('common.subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-row">
                <span>{t('common.tax')} (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="checkout-row checkout-total">
                <span>{t('common.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleCheckout}
              disabled={cart.length === 0}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              <FiPrinter /> Complete Sale
            </button>
          </div>
        </div>
      </div>

      {showProductModal && (
        <ProductSearchModal
          onClose={() => setShowProductModal(false)}
          onSelectProduct={addToCart}
        />
      )}
    </div>
  );
};

export default Sales;
