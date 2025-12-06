// Type definitions for Electron API exposed via preload
export interface ElectronAPI {
  license: {
    verify: () => Promise<{ valid: boolean; message: string }>;
    register: (key: string) => Promise<{ success: boolean; hardwareId: string }>;
    getHardwareId: () => Promise<string>;
  };
  dialog: {
    showMessageBox: (options: any) => Promise<any>;
    showOpenDialog: (options: any) => Promise<any>;
    showSaveDialog: (options: any) => Promise<any>;
  };
  barcode: {
    onData: (callback: (data: string) => void) => void;
    scan: (data: string) => void;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
