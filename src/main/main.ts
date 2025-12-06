import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import Store from 'electron-store';
import { getSystemFingerprint } from './utils/license';

const store = new Store();

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    // icon: path.join(__dirname, '../assets/icon.png'), // Uncomment when icon is added
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, 'index.html');
    console.log('Loading file from:', indexPath);
    console.log('File exists:', fs.existsSync(indexPath));
    
    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load file:', err);
      dialog.showErrorBox('Load Error', `Failed to load application: ${err.message}`);
    });
    
    // Open DevTools in production for debugging (remove in final release)
    mainWindow.webContents.openDevTools();
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Log errors for debugging
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log(`[Renderer ${level}]:`, message);
  });
}

// License verification
ipcMain.handle('license:verify', async () => {
  const licenseKey = store.get('licenseKey') as string;
  const hardwareId = await getSystemFingerprint();
  
  if (!licenseKey) {
    return { valid: false, message: 'No license key found' };
  }

  // Simple license validation (in production, connect to license server)
  const storedHardwareId = store.get('hardwareId') as string;
  
  if (storedHardwareId && storedHardwareId === hardwareId) {
    return { valid: true, message: 'License verified' };
  }
  
  return { valid: false, message: 'License key not valid for this hardware' };
});

ipcMain.handle('license:register', async (_event, licenseKey: string) => {
  const hardwareId = await getSystemFingerprint();
  store.set('licenseKey', licenseKey);
  store.set('hardwareId', hardwareId);
  return { success: true, hardwareId };
});

ipcMain.handle('license:get-hardware-id', async () => {
  return await getSystemFingerprint();
});

// File operations
ipcMain.handle('dialog:showMessageBox', async (_event, options) => {
  if (mainWindow) {
    const result = await dialog.showMessageBox(mainWindow, options);
    return result;
  }
  return { response: 0 };
});

ipcMain.handle('dialog:showOpenDialog', async (_event, options) => {
  if (mainWindow) {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
  }
  return { canceled: true, filePaths: [] };
});

ipcMain.handle('dialog:showSaveDialog', async (_event, options) => {
  if (mainWindow) {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
  }
  return { canceled: true, filePath: undefined };
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Barcode scanner handler
ipcMain.on('barcode:scan', (_event, data) => {
  // Forward barcode data to renderer
  mainWindow?.webContents.send('barcode:data', data);
});
