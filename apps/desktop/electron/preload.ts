// ============================================
// Electron Preload 脚本 - electron/preload.ts
// ============================================
import { contextBridge, ipcRenderer } from 'electron';

// ============================================
// 统一运行时注入 - 支持多平台（web / electron / tauri）
// ============================================
contextBridge.exposeInMainWorld('__RUNTIME__', {
  platform: 'electron',
  version: process.versions.electron,
  window: {
    minimize: () => ipcRenderer.send('win:minimize'),
    maximize: () => ipcRenderer.send('win:maximize'),
    close: () => ipcRenderer.send('win:close')
  }
})

// DOM 加载完成后添加桌面端标识
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('is-desktop');
});

// ============================================
// 安全白名单 API - 完整功能暴露
// ============================================

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

