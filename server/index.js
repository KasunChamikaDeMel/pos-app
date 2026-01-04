const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Database setup
const db = new sqlite3.Database('./pos_database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      barcode TEXT UNIQUE,
      description TEXT,
      category TEXT,
      price REAL NOT NULL,
      cost REAL,
      stock_quantity INTEGER DEFAULT 0,
      min_stock_level INTEGER DEFAULT 0,
      supplier TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Customers table with loyalty points
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      address TEXT,
      loyalty_points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Sales table
    db.run(`CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER,
      total_amount REAL NOT NULL,
      payment_method TEXT,
      discount_amount REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    )`);

    // Sale items table
    db.run(`CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )`);

    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      first_name TEXT,
      last_name TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('Database tables created successfully');
  });

  // Insert sample data
  insertSampleData();
}

function insertSampleData() {
  // Check if products exist
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err || row.count > 0) return;

    // Insert sample grocery products
    const products = [
      // Rice & Grains
      ['Basmati Rice', 'RICE001', 'Premium quality basmati rice', 'Rice & Grains', 850.00, 750.00, 50, 10, 'Ceylon Grains', ''],
      ['Red Raw Rice', 'RICE002', 'Traditional Sri Lankan red rice', 'Rice & Grains', 680.00, 600.00, 75, 15, 'Ceylon Grains', ''],
      ['Nadu Rice', 'RICE003', 'Local nadu rice variety', 'Rice & Grains', 520.00, 450.00, 100, 20, 'Ceylon Grains', ''],
      ['Kurakkan Flour', 'FLOUR001', 'Millet flour for traditional cooking', 'Flour & Grains', 280.00, 240.00, 40, 8, 'Local Mill', ''],
      ['Wheat Flour', 'FLOUR002', 'Premium wheat flour', 'Flour & Grains', 320.00, 280.00, 60, 12, 'Local Mill', ''],
      
      // Spices & Condiments
      ['Chili Powder', 'SPC001', 'Pure red chili powder', 'Spices', 450.00, 380.00, 30, 5, 'Spice Island', ''],
      ['Turmeric Powder', 'SPC002', 'Organic turmeric powder', 'Spices', 380.00, 320.00, 25, 5, 'Spice Island', ''],
      ['Pepper Black', 'SPC003', 'Whole black pepper', 'Spices', 520.00, 450.00, 20, 3, 'Spice Island', ''],
      ['Cinnamon Sticks', 'SPC004', 'Ceylon cinnamon sticks', 'Spices', 750.00, 650.00, 15, 3, 'Spice Island', ''],
      ['Curry Powder Mix', 'SPC005', 'Traditional curry powder blend', 'Spices', 280.00, 220.00, 35, 8, 'Spice Island', ''],
      ['Salt Packet', 'SPC006', 'Iodized salt 1kg', 'Spices', 85.00, 70.00, 100, 20, 'Salt Co', ''],
      
      // Vegetables
      ['Tomatoes', 'VEG001', 'Fresh red tomatoes', 'Vegetables', 120.00, 90.00, 0, 10, 'Local Farm', ''],
      ['Onions', 'VEG002', 'Fresh red onions', 'Vegetables', 95.00, 75.00, 0, 15, 'Local Farm', ''],
      ['Potatoes', 'VEG003', 'Fresh local potatoes', 'Vegetables', 110.00, 85.00, 0, 20, 'Local Farm', ''],
      ['Carrots', 'VEG004', 'Fresh orange carrots', 'Vegetables', 85.00, 65.00, 0, 12, 'Local Farm', ''],
      ['Green Chilies', 'VEG005', 'Fresh green chilies', 'Vegetables', 75.00, 55.00, 0, 8, 'Local Farm', ''],
      ['Cabbage', 'VEG006', 'Fresh green cabbage', 'Vegetables', 65.00, 45.00, 0, 10, 'Local Farm', ''],
      ['Leeks', 'VEG007', 'Fresh leeks', 'Vegetables', 90.00, 70.00, 0, 8, 'Local Farm', ''],
      
      // Fruits
      ['Bananas', 'FRU001', 'Fresh local bananas', 'Fruits', 150.00, 120.00, 0, 25, 'Local Farm', ''],
      ['Apples', 'FRU002', 'Imported red apples', 'Fruits', 280.00, 220.00, 0, 30, 'Import Co', ''],
      ['Oranges', 'FRU003', 'Fresh sweet oranges', 'Fruits', 220.00, 180.00, 0, 20, 'Import Co', ''],
      ['Mangoes', 'FRU004', 'Seasonal sweet mangoes', 'Fruits', 180.00, 150.00, 0, 15, 'Local Farm', ''],
      ['Pineapple', 'FRU005', 'Fresh pineapples', 'Fruits', 160.00, 130.00, 0, 12, 'Local Farm', ''],
      ['Papaya', 'FRU006', 'Fresh papaya fruit', 'Fruits', 120.00, 95.00, 0, 18, 'Local Farm', ''],
      
      // Dairy Products
      ['Fresh Milk', 'DAI001', 'Fresh cow milk 1L', 'Dairy', 220.00, 180.00, 0, 15, 'Dairy Farm', ''],
      ['Yogurt Plain', 'DAI002', 'Plain yogurt 500g', 'Dairy', 180.00, 140.00, 0, 20, 'Dairy Farm', ''],
      ['Butter Salted', 'DAI003', 'Salted butter 250g', 'Dairy', 450.00, 380.00, 25, 5, 'Dairy Farm', ''],
      ['Cheese Block', 'DAI004', 'Processed cheese block', 'Dairy', 680.00, 550.00, 15, 3, 'Dairy Farm', ''],
      ['Curd Pot', 'DAI005', 'Traditional curd pot', 'Dairy', 320.00, 260.00, 0, 12, 'Dairy Farm', ''],
      
      // Meat & Fish
      ['Chicken Fresh', 'MEAT001', 'Fresh whole chicken', 'Meat & Fish', 450.00, 380.00, 0, 8, 'Meat Shop', ''],
      ['Beef Pieces', 'MEAT002', 'Fresh beef cuts', 'Meat & Fish', 850.00, 720.00, 0, 6, 'Meat Shop', ''],
      ['Fish Tuna', 'FISH001', 'Fresh tuna fish', 'Meat & Fish', 680.00, 550.00, 0, 10, 'Fish Market', ''],
      ['Fish Sardines', 'FISH002', 'Fresh sardines', 'Meat & Fish', 280.00, 220.00, 0, 20, 'Fish Market', ''],
      ['Eggs Pack', 'EGG001', 'Fresh eggs 12 pack', 'Meat & Fish', 180.00, 150.00, 30, 8, 'Poultry Farm', ''],
      
      // Bakery Items
      ['Bread White', 'BAK001', 'Fresh white bread', 'Bakery', 120.00, 90.00, 0, 25, 'Local Bakery', ''],
      ['Bread Whole Wheat', 'BAK002', 'Whole wheat bread', 'Bakery', 140.00, 110.00, 0, 20, 'Local Bakery', ''],
      ['Biscuits Pack', 'BAK003', 'Assorted biscuits pack', 'Bakery', 85.00, 65.00, 40, 10, 'Local Bakery', ''],
      ['Cake Butter', 'BAK004', 'Butter cake slice', 'Bakery', 180.00, 140.00, 0, 15, 'Local Bakery', ''],
      
      // Beverages
      ['Water Bottle', 'BEV001', 'Drinking water 1L', 'Beverages', 65.00, 45.00, 50, 15, 'Water Co', ''],
      ['Tea Bags', 'TEA001', 'Ceylon tea bags 25 pack', 'Beverages', 280.00, 220.00, 60, 10, 'Ceylon Tea', ''],
      ['Coffee Powder', 'COF001', 'Instant coffee powder', 'Beverages', 450.00, 380.00, 30, 5, 'Coffee Co', ''],
      ['Soft Drink Cola', 'SDR001', 'Cola soft drink 1.5L', 'Beverages', 150.00, 120.00, 40, 8, 'Beverage Co', ''],
      ['Orange Juice', 'JUICE001', 'Fresh orange juice 1L', 'Beverages', 220.00, 180.00, 0, 20, 'Juice Co', ''],
      
      // Cooking Essentials
      ['Coconut Oil', 'OIL001', 'Pure coconut oil 750ml', 'Cooking Essentials', 450.00, 380.00, 35, 5, 'Oil Co', ''],
      ['Vegetable Oil', 'OIL002', 'Refined vegetable oil 1L', 'Cooking Essentials', 380.00, 320.00, 40, 8, 'Oil Co', ''],
      ['Sugar White', 'SUG001', 'White sugar 1kg', 'Cooking Essentials', 150.00, 120.00, 60, 12, 'Sugar Co', ''],
      ['Dhal Red', 'DAL001', 'Red lentils 500g', 'Cooking Essentials', 220.00, 180.00, 45, 8, 'Pulse Co', ''],
      ['Maldive Fish', 'FISH003', 'Dried Maldive fish', 'Cooking Essentials', 850.00, 720.00, 20, 3, 'Fish Market', ''],
      
      // Personal Care
      ['Soap Bath', 'SOAP001', 'Bathing soap bar', 'Personal Care', 85.00, 65.00, 50, 15, 'Care Co', ''],
      ['Toothpaste', 'PASTE001', 'Fluoride toothpaste', 'Personal Care', 180.00, 140.00, 30, 8, 'Care Co', ''],
      ['Shampoo', 'SHAM001', 'Hair shampoo 200ml', 'Personal Care', 220.00, 180.00, 25, 5, 'Care Co', ''],
      ['Toilet Paper', 'TP001', 'Toilet paper roll', 'Personal Care', 120.00, 90.00, 40, 10, 'Care Co', ''],
      
      // Cleaning Supplies
      ['Detergent Powder', 'DET001', 'Washing detergent 1kg', 'Cleaning', 280.00, 220.00, 30, 6, 'Clean Co', ''],
      ['Dish Soap', 'DISH001', 'Dish washing liquid', 'Cleaning', 180.00, 140.00, 35, 8, 'Clean Co', ''],
      ['Bleach Liquid', 'BLEACH001', 'Household bleach 1L', 'Cleaning', 150.00, 120.00, 20, 5, 'Clean Co', ''],
      ['Floor Cleaner', 'FLOOR001', 'Floor cleaning liquid', 'Cleaning', 220.00, 180.00, 25, 4, 'Clean Co', '']
    ];

    const stmt = db.prepare("INSERT INTO products (name, barcode, description, category, price, cost, stock_quantity, min_stock_level, supplier, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    products.forEach(product => {
      stmt.run(product);
    });
    
    stmt.finalize();

    // Insert sample customer with loyalty points
    db.run("INSERT INTO customers (name, email, phone, address, loyalty_points) VALUES (?, ?, ?, ?, ?)", 
      ['John Doe', 'john@example.com', '555-0123', '123 Main St, City, State', 100]);

    // Insert sample user (password: admin123)
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.run("INSERT INTO users (username, email, password_hash, role, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)", 
      ['admin', 'admin@pos.com', hashedPassword, 'admin', 'Admin', 'User']);

    console.log('Sample data inserted');
  });
}

// API Routes

// Products
app.get('/api/products', (req, res) => {
  const { search, category } = req.query;
  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND (name LIKE ? OR barcode LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  query += " ORDER BY name";

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/products/:id', (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(row);
  });
});

app.post('/api/products', (req, res) => {
  const { name, barcode, description, category, price, cost, stock_quantity, min_stock_level, supplier, image_url } = req.body;
  
  db.run(
    `INSERT INTO products (name, barcode, description, category, price, cost, stock_quantity, min_stock_level, supplier, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, barcode, description, category, price, cost, stock_quantity, min_stock_level, supplier, image_url],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Product created successfully' });
    }
  );
});

app.put('/api/products/:id', (req, res) => {
  const { name, barcode, description, category, price, cost, stock_quantity, min_stock_level, supplier, image_url } = req.body;
  
  db.run(
    `UPDATE products SET name = ?, barcode = ?, description = ?, category = ?, price = ?, cost = ?, 
     stock_quantity = ?, min_stock_level = ?, supplier = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [name, barcode, description, category, price, cost, stock_quantity, min_stock_level, supplier, image_url, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
});

app.delete('/api/products/:id', (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// Sales
app.get('/api/sales', (req, res) => {
  const { start_date, end_date, limit = 50 } = req.query;
  let query = `
    SELECT s.*, c.name as customer_name 
    FROM sales s 
    LEFT JOIN customers c ON s.customer_id = c.id 
    WHERE 1=1
  `;
  const params = [];

  if (start_date) {
    query += " AND DATE(s.created_at) >= ?";
    params.push(start_date);
  }

  if (end_date) {
    query += " AND DATE(s.created_at) <= ?";
    params.push(end_date);
  }

  query += " ORDER BY s.created_at DESC LIMIT ?";

  db.all(query, [...params, parseInt(limit)], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/sales', (req, res) => {
  const { customer_id, items, payment_method, discount_amount } = req.body;
  const sale_date = new Date().toISOString();
  
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    
    // Generate sale number
    db.get("SELECT COUNT(*) as count FROM sales WHERE DATE(created_at) = DATE('now')", (err, row) => {
      if (err) {
        db.run("ROLLBACK");
        return res.status(500).json({ error: err.message });
      }
      
      const saleNumber = `SALE-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}-${String(row.count + 1).padStart(3, '0')}`;
      
      // Insert sale with date and time
      db.run(
        "INSERT INTO sales (sale_number, customer_id, total_amount, payment_method, discount_amount, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        [saleNumber, customer_id, 0, payment_method, discount_amount || 0, sale_date],
        function(err) {
          if (err) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: err.message });
          }
          
          const saleId = this.lastID;
          let totalAmount = 0;
          
          // Insert sale items
          let itemsProcessed = 0;
          const totalItems = items.length;
          
          items.forEach(item => {
            db.get("SELECT price, stock_quantity FROM products WHERE id = ?", [item.product_id], (err, product) => {
              if (err) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: err.message });
              }
              
              const itemTotal = item.unit_price * item.quantity;
              totalAmount += itemTotal;
              
              db.run(
                "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)",
                [saleId, item.product_id, item.quantity, item.unit_price, itemTotal],
                (err) => {
                  if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: err.message });
                  }
                  
                  // Update stock
                  db.run(
                    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                    [item.quantity, item.product_id],
                    (err) => {
                      if (err) {
                        db.run("ROLLBACK");
                        return res.status(500).json({ error: err.message });
                      }
                      
                      itemsProcessed++;
                      if (itemsProcessed === totalItems) {
                        // Update sale total
                        db.run(
                          "UPDATE sales SET total_amount = ? WHERE id = ?",
                          [totalAmount, saleId],
                          (err) => {
                            if (err) {
                              db.run("ROLLBACK");
                              return res.status(500).json({ error: err.message });
                            }
                            
                            db.run("COMMIT");
                            res.json({ 
                              id: saleId, 
                              sale_number: saleNumber,
                              total_amount: totalAmount,
                              created_at: sale_date,
                              message: 'Sale completed successfully' 
                            });
                          }
                        );
                      }
                    }
                  );
                }
              );
            });
          });
        }
      );
    });
  });
});

app.get('/api/sales/:id', (req, res) => {
  const saleId = req.params.id;
  
  // Get sale details
  db.get("SELECT * FROM sales WHERE id = ?", [saleId], (err, sale) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!sale) {
      res.status(404).json({ error: 'Sale not found' });
      return;
    }

    // Get sale items
    db.all(
      `SELECT si.*, p.name as product_name 
       FROM sale_items si 
       JOIN products p ON si.product_id = p.id 
       WHERE si.sale_id = ?`,
      [saleId],
      (err, items) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({ ...sale, items });
      }
    );
  });
});

// Customers
app.get('/api/customers', (req, res) => {
  const { search } = req.query;
  let query = "SELECT * FROM customers WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += " ORDER BY name";

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/customers', (req, res) => {
  const { name, email, phone, address } = req.body;
  
  db.run(
    `INSERT INTO customers (name, email, phone, address)
     VALUES (?, ?, ?, ?)`,
    [name, email, phone, address],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Customer created successfully' });
    }
  );
});

// Update customer loyalty points
app.put('/api/customers/:id/points', (req, res) => {
  const { points } = req.body;
  
  db.run(
    "UPDATE customers SET loyalty_points = loyalty_points + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [points, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      res.json({ message: 'Loyalty points updated successfully' });
    }
  );
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  db.all(`
    SELECT 
      (SELECT COUNT(*) FROM products) as total_products,
      (SELECT COUNT(*) FROM products WHERE stock_quantity <= min_stock_level) as low_stock_items,
      (SELECT COUNT(*) FROM customers) as total_customers,
      (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE DATE(created_at) = ?) as today_sales,
      (SELECT COALESCE(SUM(total_amount), 0) FROM sales) as total_sales,
      (SELECT COUNT(*) FROM sales WHERE DATE(created_at) = ?) as today_sales_count
  `, [today, today], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows[0] || {});
  });
});

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const bcrypt = require('bcryptjs');
  
  db.get("SELECT * FROM users WHERE username = ? AND is_active = 1", [username], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  });
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`POS Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});