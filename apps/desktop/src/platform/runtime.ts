// ============================================
// 跨平台运行时适配层 - src/platform/runtime.ts
// ============================================

export type RuntimePlatform = 'web' | 'electron' | 'tauri';

export interface Runtime {
  platform: RuntimePlatform;
  version?: string;
  window?: {
    minimize(): void;
    maximize(): void;
    close(): void;
  };
}

// 缓存运行时对象
let _runtime: Runtime | null = null;

function getRuntime(): Runtime {
  if (typeof window === 'undefined') {
    return { platform: 'web' };
  }
  
  // 延迟获取 __RUNTIME__（确保 contextBridge 已注入）
  if (!_runtime && (window as any).__RUNTIME__) {
    _runtime = (window as any).__RUNTIME__;
  }
  
  return _runtime || { platform: 'web' };
}

// 便捷属性：是否为桌面端
export const isDesktop = getRuntime().platform !== 'web';

// 运行时对象（每次访问实时获取）
export const runtime: Runtime = {
  get platform() {
    return getRuntime().platform;
  },
  get version() {
    return getRuntime().version;
  },
  get window() {
    return getRuntime().window;
  },
};

// 便捷方法：窗口控制（自动适配平台）
export const windowControl = {
  minimize: () => getRuntime().window?.minimize(),
  maximize: () => getRuntime().window?.maximize(),
  close: () => getRuntime().window?.close(),
};
