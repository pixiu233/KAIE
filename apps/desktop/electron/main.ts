// ============================================
// Electron 主进程 - electron/main.ts
// ============================================
import {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  nativeTheme,
  globalShortcut,
  dialog,
} from 'electron';
import path from 'path';
import fs from 'fs';
import isDev from 'electron-is-dev';

let mainWindow: BrowserWindow | null = null;
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      spellcheck: false,
    },
    show: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#1e293b',
      symbolColor: '#ffffff',
      height: 40,
    },
    backgroundColor: '#0f172a',
    trafficLightPosition: { x: 20, y: 10 },
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // 开发环境打开 DevTools
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// ============================================
// IPC 通信接口定义 - Preload 白名单
// ============================================

// 系统主题
ipcMain.handle('get-system-theme', async () => {
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
});

ipcMain.handle('set-system-theme', (_, theme: 'dark' | 'light') => {
  nativeTheme.themeSource = theme;
  return true;
});

// 窗口控制
ipcMain.handle('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('window-close', () => {
  mainWindow?.close();
});

// 对话框
ipcMain.handle('show-open-dialog', async (options) => {
  return dialog.showOpenDialog(mainWindow!, options);
});

ipcMain.handle('show-save-dialog', async (options) => {
  return dialog.showSaveDialog(mainWindow!, options);
});

ipcMain.handle('show-message-box', async (options) => {
  return dialog.showMessageBox(mainWindow!, options);
});

// 文件系统
ipcMain.handle('read-file', async (filePath: string) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('write-file', async (filePath: string, content: string) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

// 应用信息
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-platform', () => {
  return process.platform;
});

// 注册全局快捷键
function registerShortcuts() {
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow?.webContents.toggleDevTools();
  });

  globalShortcut.register('F5', () => {
    mainWindow?.reload();
  });
}

// ============================================
// 应用生命周期
// ============================================

app.whenReady().then(() => {
  createWindow();
  registerShortcuts();

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

app.on('before-quit', () => {
  globalShortcut.unregisterAll();
});

// ============================================
// 安全策略
// ============================================

// 禁用远程协议
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event) => {
    if (isDev && contents.getURL().startsWith('http://localhost:5173')) {
      return;
    }
    event.preventDefault();
  });

  contents.setWindowOpenHandler(({ url }) => {
    if (isDev && url.startsWith('http://localhost:5173')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });
});

