import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiPrinter, FiSearch, FiX, FiRefreshCw } from 'react-icons/fi';
import './Sale.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode?: string;
}

const Sale: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceType, setPriceType] = useState('retail');
  const [customer, setCustomer] = useState('walk-in');
  const [creditSale, setCreditSale] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.barcode.onData((data: string) => {
        handleBarcodeScan(data);
      });
    }
    barcodeInputRef.current?.focus();
  }, []);

  const handleBarcodeScan = (barcode: string) => {
    const product = findProductByBarcode(barcode);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    }
  };

  const findProductByBarcode = (barcode: string) => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    return products.find((p: any) => p.barcode === barcode);
  };

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        barcode: product.barcode
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0;
  const total = subtotal + tax;

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    // Save sale to localStorage
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const newSale = {
      id: `SALE-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart,
      subtotal,
      tax,
      total,
      customer,
      paymentAmount: parseFloat(paymentAmount) || total
    };
    sales.push(newSale);
    localStorage.setItem('sales', JSON.stringify(sales));
    
    // Update stock
    cart.forEach(item => {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const product = products.find((p: any) => p.id === item.id);
      if (product) {
        product.stock = (product.stock || 0) - item.quantity;
      }
      localStorage.setItem('products', JSON.stringify(products));
    });

    alert('Sale completed successfully!');
    setCart([]);
    setBarcodeInput('');
    setPaymentAmount('');
    barcodeInputRef.current?.focus();
  };

  return (
    <div className="sale-page">
      <div className="sale-header">
        <h1>Sale #1</h1>
        <div className="sale-header-actions">
          <button className="btn btn-success">
            <FiPlus /> New Sale
          </button>
          <button className="btn btn-danger">
            <FiX /> Clear All Tabs
          </button>
        </div>
      </div>

      <div className="sale-controls">
        <div className="control-group">
          <label>Price Type:</label>
          <select value={priceType} onChange={(e) => setPriceType(e.target.value)} className="input">
            <option value="retail">Retail Price</option>
            <option value="wholesale">Wholesale Price</option>
          </select>
        </div>
        <div className="control-group">
          <label>Customer:</label>
          <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="input">
            <option value="walk-in">Walk-in Customer</option>
          </select>
        </div>
        <div className="control-group">
          <label>Credit Sale:</label>
          <input
            type="checkbox"
            checked={creditSale}
            onChange={(e) => setCreditSale(e.target.checked)}
          />
        </div>
      </div>

      <div className="sale-shortcuts">
        <span>Shortcuts: F1 Barcode | F2 Search | Tab Navigate Fields</span>
        <div>
          <button className="btn btn-success btn-sm">
            <FiRefreshCw /> Refresh Inputs
          </button>
          <button className="btn btn-danger btn-sm">
            <FiX /> Clear All Tabs
          </button>
        </div>
      </div>

      <div className="sale-search">
        <div className="barcode-input-group">
          <input
            ref={barcodeInputRef}
            type="text"
            className="input barcode-input"
            placeholder="Scan or enter barcode"
            value={barcodeInput}
            onChange={(e) => {
              setBarcodeInput(e.target.value);
              if (e.target.value.length > 0) {
                const product = findProductByBarcode(e.target.value);
                if (product) {
                  addToCart(product);
                  setBarcodeInput('');
                }
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && barcodeInput) {
                handleBarcodeScan(barcodeInput);
              }
            }}
          />
        </div>
        <div className="search-input-group">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="input search-input"
            placeholder="Search product by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="sale-content">
        <div className="cart-section">
          <h2>Cart Items</h2>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Cart is empty. Scan or search products to add.</p>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>Rs. {item.price.toFixed(2)} each</p>
                  </div>
                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    <span className="cart-item-total">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="btn-danger btn-sm">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="payment-section">
          <div className="payment-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (0%):</span>
              <span>Rs. {tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
            <div className="payment-input">
              <label>Payment Amount:</label>
              <input
                type="number"
                className="input"
                placeholder="Enter payment amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <button
              className="btn btn-success btn-lg"
              onClick={handleCompleteSale}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              <FiPrinter /> Complete Sale & Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sale;

