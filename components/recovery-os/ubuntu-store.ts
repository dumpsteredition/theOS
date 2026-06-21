import { useSyncExternalStore } from 'react';

type StoreSetter<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
type StoreGetter<T> = () => T;
type StoreHook<T> = {
  <Selected>(selector: (state: T) => Selected): Selected;
  getState: StoreGetter<T>;
};

function create<T>(initializer: (set: StoreSetter<T>, get: StoreGetter<T>) => T): StoreHook<T> {
  let state: T;
  const listeners = new Set<() => void>();

  const get: StoreGetter<T> = () => state;
  const set: StoreSetter<T> = (partial) => {
    const nextPartial = typeof partial === 'function' ? partial(state) : partial;
    state = { ...state, ...nextPartial };
    listeners.forEach((listener) => listener());
  };

  state = initializer(set, get);

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const useStore = <Selected,>(selector: (currentState: T) => Selected) =>
    useSyncExternalStore(
      subscribe,
      () => selector(state),
      () => selector(state),
    );

  useStore.getState = get;

  return useStore;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  zIndex: number;
  minSize?: { width: number; height: number };
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
}

export const APP_DEFINITIONS: AppDefinition[] = [
  { id: 'files', name: 'Files', icon: '📁', category: 'Utilities', description: 'Browse files and documents', defaultSize: { width: 800, height: 500 }, minSize: { width: 400, height: 300 } },
  { id: 'terminal', name: 'Terminal', icon: '⬛', category: 'Utilities', description: 'Command line interface', defaultSize: { width: 720, height: 480 }, minSize: { width: 400, height: 250 } },
  { id: 'settings', name: 'Settings', icon: '⚙️', category: 'System', description: 'System settings and information', defaultSize: { width: 850, height: 560 }, minSize: { width: 600, height: 400 } },
  { id: 'text-editor', name: 'Text Editor', icon: '📝', category: 'Utilities', description: 'Edit text files', defaultSize: { width: 750, height: 500 }, minSize: { width: 400, height: 300 } },
  { id: 'system-monitor', name: 'System Monitor', icon: '📊', category: 'System', description: 'Monitor system processes and resources', defaultSize: { width: 800, height: 550 }, minSize: { width: 600, height: 400 } },
  { id: 'calculator', name: 'Calculator', icon: '🧮', category: 'Utilities', description: 'Perform calculations', defaultSize: { width: 320, height: 480 }, minSize: { width: 280, height: 400 } },
  { id: 'firefox', name: 'Firefox', icon: '🦊', category: 'Internet', description: 'Browse the web', defaultSize: { width: 900, height: 600 }, minSize: { width: 500, height: 350 } },
  { id: 'software', name: 'App Center', icon: '🛍️', category: 'System', description: 'Software center and toolkit', defaultSize: { width: 800, height: 550 }, minSize: { width: 500, height: 350 } },
];

let nextZIndex = 10;

interface UbuntuStore {
  // Login state
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  loginTime: Date | null;

  // Desktop state
  showAppGrid: boolean;
  showCalendar: boolean;
  showQuickSettings: boolean;
  showContextMenu: boolean;
  contextMenuPosition: { x: number; y: number };

  // Windows
  windows: WindowState[];
  activeWindowId: string | null;

  // Actions
  login: () => void;
  logout: () => void;
  setLoggedIn: (value: boolean) => void;
  openApp: (appId: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, x: number, y: number) => void;
  updateWindowSize: (windowId: string, width: number, height: number) => void;
  toggleAppGrid: () => void;
  setShowAppGrid: (value: boolean) => void;
  toggleCalendar: () => void;
  toggleQuickSettings: () => void;
  toggleContextMenu: (x?: number, y?: number) => void;
  closeAllPopups: () => void;
}

export const useUbuntuStore = create<UbuntuStore>((set, get) => ({
  isLoggedIn: false,
  isLoggingIn: false,
  isLoggingOut: false,
  loginTime: null,
  showAppGrid: false,
  showCalendar: false,
  showQuickSettings: false,
  showContextMenu: false,
  contextMenuPosition: { x: 0, y: 0 },
  windows: [],
  activeWindowId: null,

  login: () => {
    set({ isLoggingIn: true });
    setTimeout(() => {
      set({ isLoggedIn: true, isLoggingIn: false, loginTime: new Date() });
    }, 1500);
  },

  logout: () => {
    set({ isLoggingOut: true });
    setTimeout(() => {
      set({
        isLoggedIn: false,
        isLoggingOut: false,
        isLoggingIn: false,
        loginTime: null,
        windows: [],
        activeWindowId: null,
        showAppGrid: false,
        showCalendar: false,
        showQuickSettings: false,
        showContextMenu: false,
      });
    }, 1000);
  },

  setLoggedIn: (value) => set({ isLoggedIn: value }),

  openApp: (appId) => {
    const state = get();
    const appDef = APP_DEFINITIONS.find(a => a.id === appId);
    if (!appDef) return;

    // Check if app is already open - if so, focus it
    const existingWindow = state.windows.find(w => w.appId === appId && !w.isMinimized);
    if (existingWindow) {
      get().focusWindow(existingWindow.id);
      return;
    }

    // Check if minimized - unminimize
    const minimizedWindow = state.windows.find(w => w.appId === appId && w.isMinimized);
    if (minimizedWindow) {
      set({
        windows: state.windows.map(w =>
          w.id === minimizedWindow.id ? { ...w, isMinimized: false, zIndex: ++nextZIndex } : w
        ),
        activeWindowId: minimizedWindow.id,
      });
      return;
    }

    // Create new window
    const windowId = `${appId}-${Date.now()}`;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    nextZIndex++;

    const newWindow: WindowState = {
      id: windowId,
      appId,
      title: appDef.name,
      icon: appDef.icon,
      x: isMobile ? 0 : 100 + (state.windows.length % 5) * 30,
      y: isMobile ? 28 : 50 + (state.windows.length % 5) * 30,
      width: isMobile ? window.innerWidth : appDef.defaultSize.width,
      height: isMobile ? window.innerHeight - 28 - 56 : appDef.defaultSize.height,
      isMinimized: false,
      isMaximized: isMobile,
      isActive: true,
      zIndex: nextZIndex,
      minSize: appDef.minSize,
    };

    set({
      windows: [
        ...state.windows.map(w => ({ ...w, isActive: false })),
        newWindow,
      ],
      activeWindowId: windowId,
      showAppGrid: false,
    });
  },

  closeWindow: (windowId) => {
    const state = get();
    const remaining = state.windows.filter(w => w.id !== windowId);
    const newActiveId = remaining.length > 0 ? remaining[remaining.length - 1].id : null;
    set({
      windows: remaining.map((w, i) => ({
        ...w,
        isActive: i === remaining.length - 1,
      })),
      activeWindowId: newActiveId,
    });
  },

  minimizeWindow: (windowId) => {
    const state = get();
    const updated = state.windows.map(w =>
      w.id === windowId ? { ...w, isMinimized: true, isActive: false } : w
    );
    const visible = updated.filter(w => !w.isMinimized);
    const newActiveId = visible.length > 0 ? visible[visible.length - 1].id : null;
    if (newActiveId) {
      const idx = updated.findIndex(w => w.id === newActiveId);
      updated[idx] = { ...updated[idx], isActive: true, zIndex: ++nextZIndex };
    }
    set({ windows: updated, activeWindowId: newActiveId });
  },

  maximizeWindow: (windowId) => {
    const state = get();
    set({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, isMaximized: !w.isMaximized, zIndex: ++nextZIndex } : w
      ),
    });
  },

  focusWindow: (windowId) => {
    const state = get();
    nextZIndex++;
    set({
      windows: state.windows.map(w => ({
        ...w,
        isActive: w.id === windowId,
        zIndex: w.id === windowId ? nextZIndex : w.zIndex,
        isMinimized: w.id === windowId ? false : w.isMinimized,
      })),
      activeWindowId: windowId,
    });
  },

  updateWindowPosition: (windowId, x, y) => {
    const state = get();
    set({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, x, y } : w
      ),
    });
  },

  updateWindowSize: (windowId, width, height) => {
    const state = get();
    const win = state.windows.find(w => w.id === windowId);
    const minW = win?.minSize?.width ?? 200;
    const minH = win?.minSize?.height ?? 150;
    set({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, width: Math.max(width, minW), height: Math.max(height, minH) } : w
      ),
    });
  },

  toggleAppGrid: () => set(s => ({ showAppGrid: !s.showAppGrid, showCalendar: false, showQuickSettings: false, showContextMenu: false })),
  setShowAppGrid: (value) => set({ showAppGrid: value }),
  toggleCalendar: () => set(s => ({ showCalendar: !s.showCalendar, showAppGrid: false, showQuickSettings: false, showContextMenu: false })),
  toggleQuickSettings: () => set(s => ({ showQuickSettings: !s.showQuickSettings, showAppGrid: false, showCalendar: false, showContextMenu: false })),
  toggleContextMenu: (x, y) => set(s => ({
    showContextMenu: !s.showContextMenu,
    contextMenuPosition: x !== undefined && y !== undefined ? { x, y } : s.contextMenuPosition,
    showAppGrid: false,
    showCalendar: false,
    showQuickSettings: false,
  })),
  closeAllPopups: () => set({ showAppGrid: false, showCalendar: false, showQuickSettings: false, showContextMenu: false }),
}));
