"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // 系统主题
  getSystemTheme: () => electron.ipcRenderer.invoke("get-system-theme"),
  setSystemTheme: (theme) => electron.ipcRenderer.invoke("set-system-theme", theme),
  // 窗口控制
  windowMinimize: () => electron.ipcRenderer.invoke("window-minimize"),
  windowMaximize: () => electron.ipcRenderer.invoke("window-maximize"),
  windowClose: () => electron.ipcRenderer.invoke("window-close"),
  // 对话框
  showOpenDialog: (options) => electron.ipcRenderer.invoke("show-open-dialog", options),
  showSaveDialog: (options) => electron.ipcRenderer.invoke("show-save-dialog", options),
  showMessageBox: (options) => electron.ipcRenderer.invoke("show-message-box", options),
  // 文件系统
  readFile: (filePath) => electron.ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath, content) => electron.ipcRenderer.invoke("write-file", filePath, content),
  // 应用信息
  getAppVersion: () => electron.ipcRenderer.invoke("get-app-version"),
  getPlatform: () => electron.ipcRenderer.invoke("get-platform"),
  // 监听主题变化
  onThemeChanged: (callback) => {
    electron.ipcRenderer.on("theme-changed", (_, theme) => callback(theme));
  }
});
process.env.ELECTRON_DISABLE_SANDBOX = "true";
