# POS System - Comprehensive Point of Sale Desktop Application

A modern, feature-rich Point of Sale (POS) desktop application built with Electron, React, and TypeScript. This application combines web technologies with desktop functionality to provide a complete sales and inventory management solution.

## ✨ Key Features

### Core Functionality
- **Complete Sales & Billing System** - Streamlined checkout process with real-time calculations
- **Barcode Scanning Support** - Quick product lookup and checkout via barcode scanning
- **Real-time Inventory & Stock Management** - Track products, stock levels, and low stock alerts
- **Customer Management & Warranty Tracking** - Maintain customer database and warranty information
- **Sales Analytics & Reporting Dashboard** - Visual insights into sales performance and trends
- **Multi-language Support** - Full support for English and Sinhala (සිංහල)
- **PDF Receipt Generation** - Professional receipts using jsPDF
- **Hardware-locked Licensing System** - Secure license validation tied to hardware
- **Repair & Service Tracking** - Manage repair orders and service requests

### Technical Highlights
- Modern React 18 with TypeScript for type safety
- Electron.js for cross-platform desktop compatibility
- React Router v6 for navigation
- Beautiful UI with CSS3 animations and modern design
- Responsive layout optimized for desktop screens

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **React Icons** - Icon library
- **CSS3** - Styling with modern animations

### Desktop Framework
- **Electron.js** - Cross-platform desktop application framework

### Tools & Build
- **Webpack** - Module bundler
- **Babel** - JavaScript compiler
- **TypeScript** - Type checking and compilation

### Utilities
- **jsPDF** - PDF generation for receipts
- **electron-store** - Persistent data storage
- **date-fns** - Date manipulation utilities

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone or navigate to the project directory:**
   ```bash
   cd pos-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the application:**
   ```bash
   npm run build
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

### Development Mode

For development with hot-reloading:

```bash
npm run start:dev
```

This will:
- Watch for changes in the renderer process
- Watch for changes in the main process
- Watch for changes in the preload script
- Start Electron automatically

## 🏗️ Project Structure

```
pos-app/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.ts          # Main entry point
│   │   ├── preload.ts       # Preload script
│   │   └── utils/           # Utility functions
│   │       └── license.ts   # License management
│   └── renderer/            # React application
│       ├── components/      # Reusable components
│       │   └── Layout/     # Layout components
│       ├── contexts/        # React contexts
│       │   └── LanguageContext.tsx
│       ├── pages/           # Page components
│       │   ├── Auth/       # Authentication
│       │   ├── Dashboard/  # Dashboard
│       │   ├── Sales/      # Sales & Billing
│       │   ├── Inventory/  # Inventory Management
│       │   ├── Customers/  # Customer Management
│       │   ├── Analytics/  # Analytics & Reports
│       │   ├── Repairs/    # Repair & Service
│       │   ├── Settings/   # Settings
│       │   └── License/    # License Verification
│       ├── styles/          # Global styles
│       ├── utils/           # Utility functions
│       │   └── pdfGenerator.ts
│       ├── App.tsx          # Main App component
│       └── index.tsx        # Entry point
├── webpack.config.js        # Renderer webpack config
├── webpack.main.config.js   # Main process webpack config
├── webpack.preload.config.js # Preload webpack config
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project dependencies
└── README.md               # This file
```

## 🚀 Usage

### First Launch

1. **License Verification:**
   - On first launch, you'll be prompted to enter a license key
   - The system will display your unique Hardware ID
   - Enter your license key to activate the application

2. **Login:**
   - Use the default credentials or create a new account
   - The application will remember your session

### Main Features

#### Sales & Billing
- Access the Sales page from the sidebar
- Scan barcodes or manually search for products
- Add items to cart and adjust quantities
- Complete sale and generate PDF receipt

#### Inventory Management
- View all products with stock levels
- Get low stock alerts automatically
- Search and filter products
- Add, edit, or remove products

#### Customer Management
- Maintain customer database
- Track purchase history
- Manage warranty items
- View customer contact information

#### Analytics
- View sales statistics and trends
- Monitor top-selling products
- Track revenue and growth metrics
- Filter data by date ranges

#### Repairs & Services
- Create repair orders
- Track repair status
- Set estimated costs and completion dates
- Manage service requests

## 🔐 Licensing

The application uses a hardware-locked licensing system:
- License keys are tied to the specific hardware
- Hardware ID is generated based on system information
- License validation occurs on startup
- Licenses can be registered or verified through the UI

## 🌐 Multi-language Support

The application supports:
- **English (en)** - Default language
- **Sinhala (si)** - සිංහල

Switch languages using the globe icon in the header. The language preference is saved and persists across sessions.

## 📄 PDF Receipt Generation

Receipts are generated using jsPDF and include:
- Company information
- Invoice number and date
- Itemized list of products
- Subtotal, tax, and total
- Custom footer message

Receipts are automatically saved or can be printed directly.

## 🔧 Configuration

Application settings can be configured in the Settings page:
- Company name and details
- Tax rates
- Currency selection
- Receipt customization
- Inventory thresholds
- Auto-print settings

## 📝 Development Notes

### Adding New Features

1. **New Page:**
   - Create component in `src/renderer/pages/`
   - Add route in `src/renderer/App.tsx`
   - Add navigation item in `src/renderer/components/Layout/Sidebar.tsx`

2. **New Translation:**
   - Add translations to `LanguageContext.tsx`
   - Use `t()` function in components

3. **New IPC Handler:**
   - Add handler in `src/main/main.ts`
   - Expose API in `src/main/preload.ts`
   - Use in renderer via `window.electronAPI`

### Building for Production

```bash
npm run build
```

This compiles all TypeScript files and bundles the application for production.

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors:**
   - Ensure all dependencies are installed: `npm install`
   - Clear node_modules and reinstall if needed

2. **License Issues:**
   - Verify hardware ID matches the registered license
   - Contact support for license key issues

3. **Barcode Scanner:**
   - Ensure barcode scanner is connected and configured
   - Check if scanner is set to keyboard emulation mode

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For support and inquiries:
- Email: support@possystem.com
- Check the documentation for detailed feature guides

## 🔮 Future Enhancements

- Database integration (SQLite/PostgreSQL)
- Cloud synchronization
- Mobile app companion
- Advanced reporting features
- Multi-store support
- User roles and permissions
- Payment gateway integration

---

Built with ❤️ using Electron, React, and TypeScript
