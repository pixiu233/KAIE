// ============================================
// Electron Preload 脚本 - electron/preload.ts
// ============================================
import { contextBridge, ipcRenderer } from 'electron';

// ============================================
// 安全白名单 API
// ============================================
// Renderer 只能通过这些 API 访问主进程功能

contextBridge.exposeInMainWorld('electronAPI', {
  // 系统主题
  getSystemTheme: () => ipcRenderer.invoke('get-system-theme'),
  setSystemTheme: (theme: 'dark' | 'light') => ipcRenderer.invoke('set-system-theme', theme),

  // 窗口控制
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),

  // 对话框
  showOpenDialog: (options: Electron.OpenDialogOptions) =>
    ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options: Electron.SaveDialogOptions) =>
    ipcRenderer.invoke('show-save-dialog', options),
  showMessageBox: (options: Electron.MessageBoxOptions) =>
    ipcRenderer.invoke('show-message-box', options),

  // 文件系统
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('write-file', filePath, content),

  // 应用信息
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),

  // 监听主题变化
  onThemeChanged: (callback: (theme: string) => void) => {
    ipcRenderer.on('theme-changed', (_, theme) => callback(theme));
  },
});

// 安全警告
process.env.ELECTRON_DISABLE_SANDBOX = 'true';

