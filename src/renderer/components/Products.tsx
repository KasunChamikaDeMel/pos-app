import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

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
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    description: '',
    category: '',
    price: '',
    cost: '',
    stock_quantity: '',
    min_stock_level: '',
    supplier: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      barcode: '',
      description: '',
      category: '',
      price: '',
      cost: '',
      stock_quantity: '',
      min_stock_level: '',
      supplier: ''
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock_quantity: parseInt(formData.stock_quantity),
        min_stock_level: parseInt(formData.min_stock_level)
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
      } else {
        await productsAPI.create(productData);
      }

      setShowAddModal(false);
      resetForm();
      loadProducts();
    } catch (error: any) {
      alert('Failed to save product: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      barcode: product.barcode,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock_quantity: product.stock_quantity.toString(),
      min_stock_level: product.min_stock_level.toString(),
      supplier: product.supplier
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsAPI.delete(id);
      loadProducts();
    } catch (error: any) {
      alert('Failed to delete product: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: '#64748b' }}>Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#f1f5f9', margin: 0 }}>Product Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '10px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#f1f5f9'
          }}
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#f1f5f9',
            minWidth: '150px'
          }}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
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
                <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '12px' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '12px' }}>Barcode</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '12px' }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: '12px' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: '12px' }}>Stock</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '12px', color: '#f1f5f9' }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{product.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{product.description}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: '#94a3b8', fontSize: '12px' }}>
                    {product.barcode}
                  </td>
                  <td style={{ padding: '12px', color: '#f1f5f9' }}>
                    {product.category}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#3b82f6', fontWeight: '500' }}>
                    {formatCurrency(product.price)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <span style={{ 
                      color: product.stock_quantity <= product.min_stock_level ? '#ef4444' : '#10b981',
                      fontWeight: '500'
                    }}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      background: product.stock_quantity === 0 ? '#ef4444' : 
                                  product.stock_quantity <= product.min_stock_level ? '#f59e0b' : '#10b981',
                      color: 'white'
                    }}>
                      {product.stock_quantity === 0 ? 'Out of Stock' : 
                       product.stock_quantity <= product.min_stock_level ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        marginRight: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#64748b' 
            }}>
              No products found
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1e293b',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#f1f5f9', marginBottom: '5px', fontSize: '14px' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f1f5f9'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: '#f1f5f9', marginBottom: '5px', fontSize: '14px' }}>
                    Barcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.barcode}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f1f5f9'
                    }}
                  />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', color: '#f1f5f9', marginBottom: '5px', fontSize: '14px' }}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f1f5f9'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: '#f1f5f9', marginBottom: '5px', fontSize: '14px' }}>
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f1f5f9'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: '#f1f5f9', marginBottom: '5px', fontSize: '14px' }}>
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f1f5f9'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: '#f1f5f9', marginBottom: '5px', fontSize: '14px' }}>
                    Sale Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f1f5f9'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: '#f1f5f9', marginBottom: '5px', fontSize: '14px' }}>
                    Cost Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f1f5f9'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: '#f1f5f9', marginBottom: '5px', fontSize: '14px' }}>
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f1f5f9'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: '#f1f5f9', marginBottom: '5px', fontSize: '14px' }}>
                    Min Stock Level *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.min_stock_level}
                    onChange={(e) => setFormData({...formData, min_stock_level: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f1f5f9'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '10px', 
                marginTop: '20px' 
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  style={{
                    background: '#64748b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    cursor: 'pointer'
                  }}
                >
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
