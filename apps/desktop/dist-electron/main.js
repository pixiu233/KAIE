import require$$0, { ipcMain, dialog, app, BrowserWindow, globalShortcut, shell } from "electron";
import fs from "fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import path from "path";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
const electron = require$$0;
if (typeof electron === "string") {
  throw new TypeError("Not running in an Electron environment!");
}
const isEnvSet = "ELECTRON_IS_DEV" in process.env;
const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
var electronIsDev = isEnvSet ? getFromEnv : !electron.app.isPackaged;
const isDev = /* @__PURE__ */ getDefaultExportFromCjs(electronIsDev);
let mainWindow = null;
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = dirname(__filename$1);
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    // 关键：关闭系统边框
    titleBarStyle: "hidden",
    // macOS 推荐
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname$1, "preload.mjs"),
      spellcheck: false
    },
    show: false,
    titleBarOverlay: {
      color: "#1e293b",
      symbolColor: "#ffffff",
      height: 40
    },
    backgroundColor: "#0f172a",
    trafficLightPosition: { x: 20, y: 10 }
  });
  const startUrl = isDev ? "http://localhost:5173" : `file://${path.join(__dirname$1, "../dist/index.html")}`;
  mainWindow.loadURL(startUrl);
  mainWindow.once("ready-to-show", () => {
    mainWindow == null ? void 0 : mainWindow.show();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}
ipcMain.on("win:minimize", () => mainWindow == null ? void 0 : mainWindow.minimize());
ipcMain.on("win:maximize", () => {
  if (mainWindow == null ? void 0 : mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow == null ? void 0 : mainWindow.maximize();
  }
});
ipcMain.on("win:close", () => mainWindow == null ? void 0 : mainWindow.close());
ipcMain.handle("show-open-dialog", async (_event, options) => {
  return dialog.showOpenDialog(mainWindow, options);
});
ipcMain.handle("show-save-dialog", async (_event, options) => {
  return dialog.showSaveDialog(mainWindow, options);
});
ipcMain.handle("show-message-box", async (_event, options) => {
  return dialog.showMessageBox(mainWindow, options);
});
ipcMain.handle("read-file", async (_event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
ipcMain.handle("write-file", async (_event, filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});
ipcMain.handle("get-platform", () => {
  return process.platform;
});
function registerShortcuts() {
  globalShortcut.register("CommandOrControl+Shift+I", () => {
    mainWindow == null ? void 0 : mainWindow.webContents.toggleDevTools();
  });
  globalShortcut.register("F5", () => {
    mainWindow == null ? void 0 : mainWindow.reload();
  });
}
app.whenReady().then(() => {
  createWindow();
  registerShortcuts();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("before-quit", () => {
  globalShortcut.unregisterAll();
});
app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", (event) => {
    if (isDev && contents.getURL().startsWith("http://localhost:5173")) {
      return;
    }
    event.preventDefault();
  });
  contents.setWindowOpenHandler(({ url }) => {
    if (isDev && url.startsWith("http://localhost:5173")) {
      return { action: "allow" };
    }
    shell.openExternal(url);
    return { action: "deny" };
  });
});
