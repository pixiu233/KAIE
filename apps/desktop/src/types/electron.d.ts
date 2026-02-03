// ============================================
// 类型声明 - src/types/electron.d.ts
// ============================================

// 统一运行时类型
declare global {
  interface Window {
    __RUNTIME__?: {
      platform: 'electron' | 'tauri';
      version?: string;
      window?: {
        minimize(): void;
        maximize(): void;
        close(): void;
      };
    };
    electronAPI: {
      // 系统主题
      getSystemTheme: () => Promise<'dark' | 'light'>;
      setSystemTheme: (theme: 'dark' | 'light') => Promise<boolean>;

      // 窗口控制
      windowMinimize: () => Promise<void>;
      windowMaximize: () => Promise<void>;
      windowClose: () => Promise<void>;

      // 对话框
      showOpenDialog: (options: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>;
      showSaveDialog: (options: Electron.SaveDialogOptions) => Promise<Electron.SaveDialogReturnValue>;
      showMessageBox: (options: Electron.MessageBoxOptions) => Promise<Electron.MessageBoxReturnValue>;

      // 文件系统
      readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
      writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;

      // 应用信息
      getAppVersion: () => Promise<string>;
      getPlatform: () => Promise<string>;

      // 主题监听
      onThemeChanged: (callback: (theme: string) => void) => void;
    };
  }
}

export {};
