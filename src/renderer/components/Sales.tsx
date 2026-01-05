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

// Virtual Keyboard Component
const VirtualKeyboard: React.FC<{
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSpace: () => void;
  onClose: () => void;
  show: boolean;
}> = ({ onKeyPress, onBackspace, onClear, onSpace, onClose, show }) => {
  if (!show) return null;

  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '.', '@'],
    ['!', '?', '-', '_', '+', '=', '/', '\\', '*'],
  ];

  return (
    <div style={{
      background: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '10px',
      height: '100%',
      overflowY: 'auto',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}>
        <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '12px' }}>Virtual Keyboard</h4>
        <button
          onClick={onClose}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '2px 8px',
            cursor: 'pointer',
            fontSize: '10px',
          }}
        >
          Close
        </button>
      </div>

      {rows.map((row, rowIndex) => (
        <div key={rowIndex} style={{
          display: 'flex',
          gap: '3px',
          marginBottom: '3px',
          justifyContent: 'center',
        }}>
          {row.map(key => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              style={{
                padding: '8px',
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                minWidth: '25px',
                minHeight: '25px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#3b82f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#1e293b';
              }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      <div style={{
        display: 'flex',
        gap: '3px',
        marginTop: '8px',
        justifyContent: 'center',
      }}>
        <button
          onClick={onSpace}
          style={{
            padding: '8px 15px',
            background: '#334155',
            color: '#f1f5f9',
            border: '1px solid #475569',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          Space
        </button>
        <button
          onClick={onBackspace}
          style={{
            padding: '8px 10px',
            background: '#f59e0b',
            color: 'white',
            border: '1px solid #f59e0b',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          ⌫
        </button>
        <button
          onClick={onClear}
          style={{
            padding: '8px 10px',
            background: '#ef4444',
            color: 'white',
            border: '1px solid #ef4444',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

// Enhanced Number Pad Component
const NumberPad: React.FC<{
  onNumberClick: (num: string) => void;
  _onClear: () => void;
  _onBackspace: () => void;
  _showKeyboard: boolean;
}> = ({ onNumberClick, _onClear, _onBackspace, _showKeyboard }) => {
  const buttons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', '.', '⌫'];

  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '15px',
      marginTop: '10px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: '8px',
      }}>
        {buttons.slice(0, 9).map(button => (
          <button
            key={button}
            onClick={() => onNumberClick(button)}
            style={{
              padding: '15px',
              background: '#334155',
              color: '#f1f5f9',
              border: '1px solid #475569',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#3b82f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#334155';
            }}
          >
            {button}
          </button>
        ))}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
      }}>
        {buttons.slice(9).map(button => (
          <button
            key={button}
            onClick={() => onNumberClick(button)}
            style={{
              padding: '15px',
              background: button === 'C' ? '#ef4444' : button === '⌫' ? '#f59e0b' : '#334155',
              color: '#f1f5f9',
              border: '1px solid #475569',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = button === 'C' ? '#dc2626' : button === '⌫' ? '#d97706' : '#3b82f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = button === 'C' ? '#ef4444' : button === '⌫' ? '#f59e0b' : '#334155';
            }}
          >
            {button}
          </button>
        ))}
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Main Content Area */}
      <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' }}>
        {/* Products Section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Search and Customer Selection */}
          <div style={{ marginBottom: '20px' }}>
            {/* Touch Mode Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}>
              <span style={{ color: '#f1f5f9', fontSize: '14px' }}>Touch Mode:</span>
              <button
                onClick={() => setTouchMode(!touchMode)}
                style={{
                  padding: '6px 12px',
                  background: touchMode ? '#3b82f6' : '#334155',
                  color: '#f1f5f9',
                  border: '1px solid #475569',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                {touchMode ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search products or scan barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => touchMode && setActiveInput('search')}
                readOnly={touchMode && activeInput !== 'search'}
                onClick={() => touchMode && setActiveInput('search')}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: activeInput === 'search' ? '#334155' : '#1e293b',
                  border: activeInput === 'search' ? '2px solid #3b82f6' : '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f1f5f9',
                  fontSize: '16px',
                  marginBottom: '10px',
                  cursor: touchMode ? 'pointer' : 'text',
                }}
              />
              {touchMode && (
                <button
                  onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  📱
                </button>
              )}
            </div>

            <select
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const customer = customers.find(c => c.id === parseInt(e.target.value));
                setSelectedCustomer(customer || null);
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#f1f5f9',
                fontSize: '16px',
                marginBottom: '10px',
              }}
            >
              <option value="">Walk-in Customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>

            {/* Payment Method Selection */}
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#f1f5f9',
                fontSize: '16px',
                marginBottom: '10px',
              }}
            >
              <option value="cash">💵 Cash</option>
              <option value="card">💳 Card</option>
              <option value="mobile">📱 Mobile</option>
              <option value="installment">📅 Installment</option>
            </select>
          </div>

          {/* Products Grid */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '12px',
            }}>
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: product.stock_quantity === 0 ? 0.5 : 1,
                  }}
                  onMouseOver={(e) => {
                    if (product.stock_quantity > 0) {
                      e.currentTarget.style.background = '#334155';
                      e.currentTarget.style.borderColor = '#3b82f6';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#1e293b';
                    e.currentTarget.style.borderColor = '#334155';
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{
                      color: '#f1f5f9',
                      fontSize: '13px',
                      fontWeight: '500',
                      marginBottom: '4px',
                    }}>
                      {product.name}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>
                      {product.category}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '10px' }}>
                      {product.barcode}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '14px' }}>
                      {formatCurrency(product.price)}
                    </div>
                    <div style={{
                      color: product.stock_quantity <= 5 ? '#ef4444' : '#10b981',
                      fontSize: '10px',
                    }}>
                      Stock: {product.stock_quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div style={{
          width: '380px',
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h3 style={{ color: '#f1f5f9', marginBottom: '15px', fontSize: '16px' }}>Shopping Cart</h3>

          {selectedCustomer && (
            <div style={{
              background: '#0f172a',
              padding: '8px',
              borderRadius: '6px',
              marginBottom: '12px',
              fontSize: '13px',
              color: '#3b82f6',
            }}>
              Customer: {selectedCustomer.name}
            </div>
          )}

          {/* Cart Items */}
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px', maxHeight: '200px' }}>
            {cart.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#64748b',
                padding: '30px 0',
                fontSize: '14px',
              }}>
                Cart is empty
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} style={{
                  background: '#0f172a',
                  padding: '10px',
                  borderRadius: '6px',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}>
                    <div style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: '500' }}>
                      {item.name}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        cursor: 'pointer',
                        fontSize: '11px',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          background: '#334155',
                          color: '#f1f5f9',
                          border: 'none',
                          borderRadius: '4px',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        -
                      </button>
                      <span style={{
                        color: '#f1f5f9',
                        minWidth: '25px',
                        textAlign: 'center',
                        fontSize: '13px',
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          background: '#334155',
                          color: '#f1f5f9',
                          border: 'none',
                          borderRadius: '4px',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '13px' }}>
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Discount Entry */}
          {cart.length > 0 && (
            <div style={{
              background: '#0f172a',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '12px',
            }}>
              <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>
                Discount (LKR):
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  onFocus={() => touchMode && setActiveInput('discount')}
                  readOnly={touchMode && activeInput !== 'discount'}
                  onClick={() => touchMode && setActiveInput('discount')}
                  style={{
                    width: '100%',
                    padding: '6px',
                    background: activeInput === 'discount' ? '#334155' : '#1e293b',
                    border: activeInput === 'discount' ? '2px solid #3b82f6' : '1px solid #334155',
                    borderRadius: '4px',
                    color: '#f1f5f9',
                    fontSize: '13px',
                    cursor: touchMode ? 'pointer' : 'text',
                  }}
                  placeholder="Enter discount amount"
                />
                {touchMode && activeInput === 'discount' && (
                  <button
                    onClick={() => setActiveInput(null)}
                    style={{
                      position: 'absolute',
                      right: '6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '3px 6px',
                      cursor: 'pointer',
                      fontSize: '10px',
                    }}
                  >
                    ⌨️
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Total and Checkout */}
          {cart.length > 0 && (
            <div>
              <div style={{
                borderTop: '1px solid #334155',
                paddingTop: '12px',
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Subtotal:</span>
                  <span style={{ color: '#f1f5f9', fontSize: '13px' }}>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#f59e0b', fontSize: '13px' }}>Discount:</span>
                    <span style={{ color: '#f59e0b', fontSize: '13px' }}>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Tax (8%):</span>
                  <span style={{ color: '#f1f5f9', fontSize: '13px' }}>{formatCurrency(tax)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                }}>
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={processSale}
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: processing ? '#64748b' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                }}
              >
                {processing ? 'Processing...' : `Complete Sale (${paymentMethod})`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Input Area */}
      <div style={{
        background: '#0f172a',
        borderTop: '1px solid #334155',
        padding: '15px',
        display: 'flex',
        gap: '20px',
        minHeight: '280px',
      }}>
        {/* Number Pad - Always Visible */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#f1f5f9', fontSize: '14px', marginBottom: '10px', textAlign: 'center' }}>
            Number Pad
          </div>
          <NumberPad
            onNumberClick={handleNumberPadClick}
            _onClear={handleClearInput}
            _onBackspace={handleBackspaceInput}
            _showKeyboard={showVirtualKeyboard}
          />
        </div>

        {/* Virtual Keyboard - Always Visible */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#f1f5f9', fontSize: '14px', marginBottom: '10px', textAlign: 'center' }}>
            Virtual Keyboard
          </div>
          <VirtualKeyboard
            onKeyPress={handleVirtualKeyPress}
            onBackspace={handleVirtualBackspace}
            onClear={handleVirtualClear}
            onSpace={handleVirtualSpace}
            onClose={() => setShowVirtualKeyboard(false)}
            show={touchMode} // Always show when touch mode is on
          />
        </div>
      </div>
    </div>
  );
};

export default Sales;
