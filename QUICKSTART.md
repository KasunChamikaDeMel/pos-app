# Quick Start Guide

## Installation

1. **Navigate to the pos-app directory:**
   ```bash
   cd pos-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   This may take a few minutes as it installs Electron and all required packages.

## Running the Application

### Development Mode (Recommended for testing)

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   This will start the webpack dev server on http://localhost:3000

2. **In a new terminal, build the Electron main process:**
   ```bash
   npm run build:main
   npm run build:preload
   ```

3. **Start Electron:**
   ```bash
   npm start
   ```

### Production Build

1. **Build all components:**
   ```bash
   npm run build
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

## First Time Setup

### License Activation

On first launch:
1. The application will prompt for a license key
2. Note your Hardware ID (displayed on screen)
3. Enter your license key (or use demo mode for testing)
4. Click "Activate License"

### Login

- Default credentials (for demo):
  - Username: Any (not enforced in demo)
  - Password: Any (not enforced in demo)

In production, you'll need to implement proper authentication.

## Using the Application

### Making a Sale

1. Navigate to **Sales** from the sidebar
2. Scan a barcode or search for products manually
3. Add items to cart
4. Adjust quantities as needed
5. Click "Complete Sale" to generate receipt

### Managing Inventory

1. Go to **Inventory** page
2. View all products with stock levels
3. Low stock items are highlighted
4. Use search to find specific products

### Customer Management

1. Navigate to **Customers**
2. View customer list with purchase history
3. Track warranty items per customer
4. Add new customers as needed

### Viewing Analytics

1. Go to **Analytics** dashboard
2. View sales statistics
3. Check top-selling products
4. Monitor revenue trends

### Managing Repairs

1. Navigate to **Repairs & Services**
2. Create new repair orders
3. Track repair status
4. Update completion dates and costs

## Troubleshooting

### Build Errors

If you encounter build errors:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use

If port 3000 is in use, you can change it in `webpack.dev.config.js`

### Electron Not Starting

Make sure you've built the main process:
```bash
npm run build:main
npm run build:preload
```

## Next Steps

- Customize company information in Settings
- Configure tax rates
- Add your product inventory
- Set up customer database
- Configure barcode scanner (if using hardware scanner)

## Support

For issues or questions, refer to the main README.md or contact support.
