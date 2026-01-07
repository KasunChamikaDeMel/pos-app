import React, { useState, useEffect } from 'react';
import { salesAPI, productsAPI, customersAPI } from '../services/api';

interface Product {
  id: number;
  name: string;
  barcode: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stock_quantity: number;
  min_stock_level: number;
  supplier: string;
  image_url: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Modern QWERTY Keyboard Component
const ModernKeyboard: React.FC<{
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSpace: () => void;
  onClose: () => void;
  show: boolean;
}> = ({ onKeyPress, onBackspace, onClear, onSpace, onClose, show }) => {
  if (!show) return null;

  const mainRows = [
    ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['Caps Lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
    ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
  ];

  const numpadKeys = [
    ['NumLock', '/', '*'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', 'Enter'],
    ['0', '.', 'Del']
  ];

  const getKeyStyle = (key: string, isNumpad: boolean = false) => {
    const baseStyle = {
      padding: '8px',
      border: '1px solid #4a5568',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: isNumpad ? '14px' : '12px',
      fontWeight: '500',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#e2e8f0',
      background: '#2d3748',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    // Special key widths
    if (key === 'Backspace') return { ...baseStyle, width: '80px' };
    if (key === 'Tab') return { ...baseStyle, width: '60px' };
    if (key === 'Caps Lock') return { ...baseStyle, width: '85px' };
    if (key === 'Enter') return { ...baseStyle, width: '70px' };
    if (key === 'Shift') return { ...baseStyle, width: '95px' };
    if (key === 'Space') return { ...baseStyle, flex: 1 };
    if (key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Menu') return { ...baseStyle, width: '50px' };
    if (key === 'NumLock') return { ...baseStyle, width: '60px' };
    if (key === 'Del') return { ...baseStyle, width: '50px' };
    
    return { ...baseStyle, minWidth: '35px' };
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      border: '2px solid #4a5568',
      borderRadius: '12px',
      padding: '15px',
      height: '100%',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      position: 'relative'
    }}>
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: '#e53e3e',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(229, 62, 62, 0.4)'
        }}
      >
        ×
      </button>
      
      <div style={{ display: 'flex', gap: '15px', height: '100%' }}>
        {/* Main Keyboard */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Function Keys Row */}
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
            {mainRows[0].map(key => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                style={{
                  ...getKeyStyle(key),
                  background: '#4a5568',
                  fontSize: '10px',
                  minWidth: '30px',
                  height: '25px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#718096';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#4a5568';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Main Keyboard Rows */}
          {mainRows.slice(1).map((row, rowIndex) => (
            <div key={rowIndex} style={{
              display: 'flex',
              gap: '4px',
              justifyContent: 'flex-start',
              flex: 1
            }}>
              {row.map(key => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'Backspace') {
                      onBackspace();
                    } else if (key === 'Space') {
                      onSpace();
                    } else if (key === 'Enter') {
                      onKeyPress('\r');
                    } else if (key === 'Tab') {
                      onKeyPress('\t');
                    } else if (key === 'Esc') {
                      onClose();
                    } else if (key === 'Caps Lock' || key === 'Shift' || key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Menu') {
                      // Modifier keys - could implement toggle logic if needed
                      return;
                    } else {
                      onKeyPress(key);
                    }
                  }}
                  disabled={key === 'Caps Lock' || key === 'Shift' || key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Menu'}
                  style={getKeyStyle(key)}
                  onMouseOver={(e) => {
                    if (!(key === 'Caps Lock' || key === 'Shift' || key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Menu')) {
                      e.currentTarget.style.background = '#4299e1';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 153, 225, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#2d3748';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                >
                  {key === 'Backspace' ? '⌫' : key === 'Tab' ? '⇥' : key === 'Enter' ? '↵' : key === 'Caps Lock' ? '⇪' : key === 'Shift' ? '⇧' : key === 'Space' ? '␣' : key}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Numeric Keypad */}
        <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {numpadKeys.map((row, rowIndex) => (
            <div key={rowIndex} style={{
              display: 'flex',
              gap: '4px',
              justifyContent: 'center',
              flex: 1
            }}>
              {row.map(key => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'Del') {
                      onBackspace();
                    } else if (key === 'Enter') {
                      onKeyPress('\r');
                    } else if (key === 'NumLock') {
                      // NumLock toggle - could implement if needed
                      return;
                    } else {
                      onKeyPress(key);
                    }
                  }}
                  disabled={key === 'NumLock'}
                  style={getKeyStyle(key, true)}
                  onMouseOver={(e) => {
                    if (key !== 'NumLock') {
                      e.currentTarget.style.background = key === 'Del' || key === 'Enter' ? '#ed8936' : '#48bb78';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(72, 187, 120, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#2d3748';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                >
                  {key === 'Del' ? '⌫' : key === 'Enter' ? '↵' : key === 'NumLock' ? 'NL' : key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const VirtualKeyboard: React.FC<{
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSpace: () => void;
  onClose: () => void;
  show: boolean;
  onNumberPadClick?: (num: string) => void;
}> = ({ onKeyPress, onBackspace, onClear, onSpace, onClose, show, onNumberPadClick }) => {
  if (!show) return null;

  const mainRows = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Menu', 'Ctrl']
  ];

  const numpadKeys = [
    ['NumLock', '/', '*'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', 'Enter'],
    ['0', '.', 'Del']
  ];

  const getKeyWidth = (key: string) => {
    const specialKeys: { [key: string]: string } = {
      'Backspace': '80px',
      'Tab': '60px',
      'Caps': '70px',
      'Enter': '80px',
      'Shift': '90px',
      'Ctrl': '50px',
      'Win': '50px',
      'Alt': '50px',
      'Space': '200px',
      'Fn': '50px',
      'Menu': '50px',
      'NumLock': '60px',
      'Del': '60px'
    };
    return specialKeys[key] || '35px';
  };

  const getNumpadKeyWidth = (key: string) => {
    const specialKeys: { [key: string]: string } = {
      'NumLock': '60px',
      'Enter': '60px',
      'Del': '60px'
    };
    return specialKeys[key] || '35px';
  };

  return (
    <div style={{
      background: '#0f172a',
      border: '2px solid #334155',
      borderRadius: '8px',
      padding: '2px',
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      gap: '4px',
      position: 'relative'
    }}>
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '2px 6px',
          cursor: 'pointer',
          fontSize: '8px',
          zIndex: 10,
          minWidth: '20px',
          minHeight: '20px'
        }}
      >
        ✕
      </button>
      
      {/* Main Keyboard */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {mainRows.map((row, rowIndex) => (
          <div key={rowIndex} style={{
            display: 'flex',
            gap: '1px',
            justifyContent: 'flex-start',
            flex: 1
          }}>
            {row.map(key => (
              <button
                key={key}
                onClick={() => {
                  if (key === 'Backspace') {
                    onBackspace();
                  } else if (key === 'Space') {
                    onSpace();
                  } else if (key === 'Clear') {
                    onClear();
                  } else if (key === 'Tab') {
                    onKeyPress('\t');
                  } else if (key === 'Enter') {
                    onKeyPress('\r');
                  } else if (key === 'Caps' || key === 'Shift' || key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Fn' || key === 'Menu') {
                    return null;
                  } else {
                    onKeyPress(key);
                  }
                }}
                disabled={key === 'Caps' || key === 'Shift' || key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Fn' || key === 'Menu'}
                style={{
                  width: getKeyWidth(key),
                  padding: '1px',
                  background: key === 'Backspace' || key === 'Tab' || key === 'Enter' || key === 'Shift' || key === 'Caps' ? '#f59e0b' : '#1e293b',
                  color: '#f1f5f9',
                  border: '1px solid #334155',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '8px',
                  fontWeight: '600',
                  flex: key === 'Space' ? 1 : 'none',
                  opacity: (key === 'Caps' || key === 'Shift' || key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Fn' || key === 'Menu') ? 0.5 : 1,
                  minHeight: '100%',
                  transition: 'all 0.1s ease'
                }}
                onMouseOver={(e) => {
                  if (!(key === 'Caps' || key === 'Shift' || key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Fn' || key === 'Menu')) {
                    e.currentTarget.style.background = '#3b82f6';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (key === 'Backspace' || key === 'Tab' || key === 'Enter' || key === 'Shift' || key === 'Caps') {
                    e.currentTarget.style.background = '#f59e0b';
                  } else if (!(key === 'Caps' || key === 'Shift' || key === 'Ctrl' || key === 'Win' || key === 'Alt' || key === 'Fn' || key === 'Menu')) {
                    e.currentTarget.style.background = '#1e293b';
                  }
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {key === 'Backspace' ? '⌫' : key === 'Tab' ? '⇥' : key === 'Enter' ? '↵' : key === 'Caps' ? '⇪' : key === 'Shift' ? '⇧' : key === 'Ctrl' ? 'Ctrl' : key === 'Win' ? '⊞' : key === 'Alt' ? 'Alt' : key === 'Space' ? '' : key === 'Fn' ? 'Fn' : key === 'Menu' ? '☰' : key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Numeric Keypad */}
      <div style={{ width: '140px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {numpadKeys.map((row, rowIndex) => (
          <div key={rowIndex} style={{
            display: 'flex',
            gap: '1px',
            justifyContent: 'center',
            flex: 1
          }}>
            {row.map(key => (
              <button
                key={key}
                onClick={() => {
                  if (key === 'Del') {
                    onBackspace();
                  } else if (key === 'Enter') {
                    onKeyPress('\r');
                  } else if (key === 'NumLock') {
                    return null;
                  } else {
                    onNumberPadClick ? onNumberPadClick(key) : onKeyPress(key);
                  }
                }}
                disabled={key === 'NumLock'}
                style={{
                  flex: 1,
                  padding: '1px',
                  background: key === 'Del' || key === 'Enter' ? '#f59e0b' : '#334155',
                  color: '#f1f5f9',
                  border: '1px solid #475569',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '9px',
                  fontWeight: '600',
                  opacity: key === 'NumLock' ? 0.5 : 1,
                  minHeight: '100%',
                  transition: 'all 0.1s ease'
                }}
                onMouseOver={(e) => {
                  if (key !== 'NumLock') {
                    e.currentTarget.style.background = key === 'Del' || key === 'Enter' ? '#d97706' : '#3b82f6';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (key === 'Del' || key === 'Enter') {
                    e.currentTarget.style.background = '#f59e0b';
                  } else if (key !== 'NumLock') {
                    e.currentTarget.style.background = '#334155';
                  }
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {key === 'Del' ? '⌫' : key === 'Enter' ? '↵' : key === 'NumLock' ? 'NL' : key}
              </button>
            ))}
          </div>
        ))}
        
        {/* Function buttons */}
        <div style={{
          display: 'flex',
          gap: '1px',
          marginTop: '1px'
        }}>
          <button
            onClick={onClear}
            style={{
              flex: 1,
              padding: '2px',
              background: '#ef4444',
              color: 'white',
              border: '1px solid #ef4444',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '8px',
              fontWeight: '600',
              transition: 'all 0.1s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#dc2626';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#ef4444';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Clear
          </button>
          <button
            onClick={onBackspace}
            style={{
              flex: 1,
              padding: '2px',
              background: '#f59e0b',
              color: 'white',
              border: '1px solid #f59e0b',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '8px',
              fontWeight: '600',
              transition: 'all 0.1s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#d97706';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f59e0b';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

// Utility function for currency formatting
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount);
};

// Item Selector Component
const ItemSelector: React.FC<{
  products: Product[];
  onAddToCart: (product: Product) => void;
  onClose: () => void;
  show: boolean;
}> = ({ products, onAddToCart, onClose, show }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!show) return null;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#1e293b',
        border: '2px solid #334155',
        borderRadius: '12px',
        padding: '20px',
        width: '90%',
        maxWidth: '1200px',
        height: '80%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '20px' }}>Select Items</h3>
          <button
            onClick={onClose}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Close
          </button>
        </div>

        <input
          type="text"
          placeholder="Search products or scan barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            background: '#0f172a',
            border: '2px solid #334155',
            borderRadius: '8px',
            color: '#f1f5f9',
            fontSize: '16px',
            marginBottom: '20px'
          }}
        />

        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              style={{
                background: '#0f172a',
                border: '2px solid #334155',
                borderRadius: '10px',
                padding: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: product.stock_quantity === 0 ? 0.5 : 1
              }}
              onMouseOver={(e) => {
                if (product.stock_quantity > 0) {
                  e.currentTarget.style.background = '#334155';
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#0f172a';
                e.currentTarget.style.borderColor = '#334155';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <div style={{ 
                  color: '#f1f5f9', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  marginBottom: '5px'
                }}>
                  {product.name}
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  {product.category}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                  Barcode: {product.barcode}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '18px' }}>
                  {formatCurrency(product.price)}
                </div>
                <div style={{ 
                  color: product.stock_quantity <= 5 ? '#ef4444' : '#10b981', 
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Stock: {product.stock_quantity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Sales: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [touchMode, setTouchMode] = useState(true); // Touch mode by default
  const [showItemSelector, setShowItemSelector] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);

  const loadProducts = async () => {
    try {
      const productsData = await productsAPI.getAll();
      setProducts(productsData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const customersData = await customersAPI.getAll();
      setCustomers(customersData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading customers:', error);
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock_quantity === 0) {
      alert('This product is out of stock');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock_quantity) {
        alert('Cannot add more than available stock');
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleNumberPadClick = (num: string) => {
    if (activeInput === 'search') {
      if (num === 'C') {
        setSearchTerm('');
      } else if (num === '⌫') {
        setSearchTerm((prev: string) => prev.slice(0, -1));
      } else {
        setSearchTerm((prev: string) => prev + num);
      }
    } else if (activeInput === 'discount') {
      if (num === 'C') {
        setDiscountAmount(0);
      } else if (num === '⌫') {
        const current = discountAmount.toString();
        if (current.length > 1) {
          setDiscountAmount(parseFloat(current.slice(0, -1)) || 0);
        } else {
          setDiscountAmount(0);
        }
      } else {
        const current = discountAmount.toString();
        setDiscountAmount(parseFloat(current + num) || parseFloat(num));
      }
    }
  };

  const handleVirtualKeyPress = (key: string) => {
    if (activeInput === 'search') {
      setSearchTerm((prev: string) => prev + key);
    }
  };

  const handleVirtualBackspace = () => {
    if (activeInput === 'search') {
      setSearchTerm((prev: string) => prev.slice(0, -1));
    }
  };

  const handleVirtualClear = () => {
    if (activeInput === 'search') {
      setSearchTerm('');
    }
  };

  const handleVirtualSpace = () => {
    if (activeInput === 'search') {
      setSearchTerm((prev: string) => `${prev} `);
    }
  };

  const handleClearInput = () => {
    if (activeInput === 'search') {
      setSearchTerm('');
    } else if (activeInput === 'discount') {
      setDiscountAmount(0);
    }
  };

  const handleBackspaceInput = () => {
    if (activeInput === 'search') {
      setSearchTerm((prev: string) => prev.slice(0, -1));
    } else if (activeInput === 'discount') {
      const current = discountAmount.toString();
      if (current.length > 1) {
        setDiscountAmount(parseFloat(current.slice(0, -1)) || 0);
      } else {
        setDiscountAmount(0);
      }
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity > product.stock_quantity) {
      alert('Cannot exceed available stock');
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item,
      ));
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = discountAmount;
    const tax = (subtotal - discount) * 0.08; // 8% tax
    return { subtotal, discount, tax, total: subtotal - discount + tax };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount);
  };

  const processSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    setProcessing(true);
    try {
      calculateTotal();
      await salesAPI.create({
        customer_id: selectedCustomer?.id || null,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        payment_method: paymentMethod,
        discount_amount: discountAmount,
      });

      alert('Sale completed successfully!');
      setCart([]);
      setSelectedCustomer(null);
      setDiscountAmount(0);
      setPaymentMethod('cash');
      loadProducts(); // Refresh stock levels
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to process sale: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const { subtotal, discount, tax, total } = calculateTotal();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: '#64748b' }}>Loading products...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 120px)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Modern Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🛒
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>POS System</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Admin User | {new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '10px', 
              height: '10px', 
              background: '#10b981', 
              borderRadius: '50%' 
            }}></div>
            <span>Drawer: Open</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '10px', 
              height: '10px', 
              background: '#3b82f6', 
              borderRadius: '50%' 
            }}></div>
            <span>Receipt: Auto</span>
          </div>
          <button
            onClick={() => setTouchMode(!touchMode)}
            style={{
              padding: '8px 16px',
              background: touchMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '12px',
              backdropFilter: 'blur(10px)'
            }}
          >
            {touchMode ? '👆 Touch ON' : '⌨️ Touch OFF'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden',
        gap: '20px',
        padding: '20px'
      }}>
        {/* Left Panel - Item Entry */}
        <div style={{ 
          flex: 1, 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Search Section */}
          <div style={{ 
            padding: '25px',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            background: 'rgba(255,255,255,0.5)'
          }}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="🔍 Search items or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => touchMode && setActiveInput('search')}
                  readOnly={touchMode && activeInput !== 'search'}
                  onClick={() => touchMode && setActiveInput('search')}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '15px',
                    fontSize: '16px',
                    background: activeInput === 'search' ? 'rgba(102, 126, 234, 0.1)' : 'white',
                    color: '#2d3748',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: activeInput === 'search' ? '0 4px 20px rgba(102, 126, 234, 0.3)' : '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                />
                {touchMode && activeInput === 'search' && (
                  <button
                    onClick={() => setActiveInput(null)}
                    style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ⌨️
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowItemSelector(true)}
                style={{
                  padding: '15px 25px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 30px rgba(102, 126, 234, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.3)';
                }}
              >
                📦 Browse Items
              </button>
            </div>
            
            {/* Quick Categories */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['📱 Electronics', '👕 Clothing', '🍔 Food', '🥤 Drinks', '📚 Other'].map(category => (
                <button
                  key={category}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#2d3748',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Items */}
          <div style={{ 
            flex: 1,
            padding: '25px',
            overflowY: 'auto'
          }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#2d3748', fontWeight: '600' }}>
              ⭐ Recent Items
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
              {products.slice(0, 8).map(product => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  style={{
                    background: 'white',
                    border: '2px solid rgba(102, 126, 234, 0.1)',
                    borderRadius: '15px',
                    padding: '20px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '14px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '8px', color: '#2d3748' }}>{product.name}</div>
                  <div style={{ color: '#667eea', fontSize: '18px', fontWeight: 'bold' }}>{formatCurrency(product.price)}</div>
                  <div style={{ fontSize: '12px', color: '#718096', marginTop: '5px' }}>Stock: {product.stock_quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Cart and Payment */}
        <div style={{ 
          width: '450px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Cart Header */}
          <div style={{
            padding: '25px',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            background: 'rgba(255,255,255,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#2d3748', fontWeight: '600' }}>
                🛒 Current Sale
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  value={selectedCustomer?.id || ''}
                  onChange={(e) => {
                    const customer = customers.find(c => c.id === parseInt(e.target.value));
                    setSelectedCustomer(customer || null);
                  }}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '10px',
                    fontSize: '12px',
                    background: 'white',
                    color: '#2d3748'
                  }}
                >
                  <option value="">Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setCart([])}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: '0 2px 10px rgba(240, 147, 251, 0.3)'
                  }}
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div style={{ 
            flex: 1,
            overflowY: 'auto',
            padding: '20px'
          }}>
            {cart.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#718096', 
                padding: '60px 20px',
                fontSize: '16px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
                <div>No items in cart</div>
                <div style={{ fontSize: '14px', marginTop: '10px' }}>Click "Browse Items" to add products</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ 
                    background: 'white',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    borderRadius: '15px',
                    padding: '15px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      <div style={{ color: '#2d3748', fontSize: '16px', fontWeight: '600' }}>
                        {item.name}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          width: '30px',
                          height: '30px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '16px',
                          boxShadow: '0 2px 10px rgba(240, 147, 251, 0.3)'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            background: 'white',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            fontSize: '18px',
                            color: '#667eea',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          -
                        </button>
                        <span style={{ 
                          minWidth: '40px', 
                          textAlign: 'center',
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#2d3748'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            background: 'white',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            fontSize: '18px',
                            color: '#667eea',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          +
                        </button>
                      </div>
                      <div style={{ color: '#667eea', fontWeight: 'bold', fontSize: '18px' }}>
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div style={{
            padding: '25px',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            background: 'rgba(255,255,255,0.5)'
          }}>
            {/* Discount Entry */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input
                type="number"
                placeholder="💰 Discount"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                onFocus={() => touchMode && setActiveInput('discount')}
                readOnly={touchMode && activeInput !== 'discount'}
                onClick={() => touchMode && setActiveInput('discount')}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: activeInput === 'discount' ? 'rgba(102, 126, 234, 0.1)' : 'white',
                  color: '#2d3748',
                  outline: 'none'
                }}
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{
                  padding: '12px',
                  border: '2px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: 'white',
                  color: '#2d3748'
                }}
              >
                <option value="cash">💵 Cash</option>
                <option value="card">💳 Card</option>
                <option value="mobile">📱 Mobile</option>
              </select>
            </div>

            {/* Totals */}
            <div style={{ fontSize: '14px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#4a5568' }}>Subtotal:</span>
                <span style={{ color: '#2d3748', fontWeight: '500' }}>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#4a5568' }}>Discount:</span>
                  <span style={{ color: '#f5576c', fontWeight: '500' }}>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#4a5568' }}>Tax (8%):</span>
                <span style={{ color: '#2d3748', fontWeight: '500' }}>{formatCurrency(tax)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontWeight: 'bold',
                fontSize: '18px',
                borderTop: '2px solid rgba(102, 126, 234, 0.2)',
                paddingTop: '10px',
                marginTop: '10px',
                color: '#667eea'
              }}>
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={processSale}
                disabled={processing || cart.length === 0}
                style={{
                  flex: 1,
                  padding: '15px',
                  background: processing ? '#718096' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  cursor: processing || cart.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!processing && cart.length > 0) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 30px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';
                }}
              >
                {processing ? '⏳ Processing...' : '💰 PAY'}
              </button>
              <button
                style={{
                  padding: '15px 20px',
                  background: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 20px rgba(71, 80, 96, 0.3)'
                }}
              >
                ⏸️ Hold
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Keyboard */}
      <div style={{
        height: '250px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderTop: '3px solid #4a5568',
        padding: '10px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
      }}>
        <ModernKeyboard
          onKeyPress={handleVirtualKeyPress}
          onBackspace={handleVirtualBackspace}
          onClear={handleVirtualClear}
          onSpace={handleVirtualSpace}
          onClose={() => setShowVirtualKeyboard(false)}
          show={touchMode}
        />
      </div>

      {/* Item Selector Modal */}
      <ItemSelector
        products={products}
        onAddToCart={addToCart}
        onClose={() => setShowItemSelector(false)}
        show={showItemSelector}
      />
    </div>
  );
};

export default Sales;
