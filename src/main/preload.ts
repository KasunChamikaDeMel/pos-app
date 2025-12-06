import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // License APIs
  license: {
    verify: () => ipcRenderer.invoke('license:verify'),
    register: (key: string) => ipcRenderer.invoke('license:register', key),
    getHardwareId: () => ipcRenderer.invoke('license:get-hardware-id')
  },

  // Dialog APIs
  dialog: {
    showMessageBox: (options: any) => ipcRenderer.invoke('dialog:showMessageBox', options),
    showOpenDialog: (options: any) => ipcRenderer.invoke('dialog:showOpenDialog', options),
    showSaveDialog: (options: any) => ipcRenderer.invoke('dialog:showSaveDialog', options)
  },

  // Barcode scanner
  barcode: {
    onData: (callback: (data: string) => void) => {
      ipcRenderer.on('barcode:data', (_event, data) => callback(data));
    },
    scan: (data: string) => ipcRenderer.send('barcode:scan', data)
  }
});

