import { create } from 'zustand';
import type { SareeRegion, ViewMode, GridViewMode } from '../types/project';

export type SidebarTab = 'projects' | 'design' | 'generate' | 'motifs' | 'layers' | 'grid' | 'export' | 'settings';
export type CanvasTool = 'select' | 'move' | 'brush' | 'eraser' | 'motif' | 'repeat' | 'mirror' | 'scale' | 'rotate' | 'crop' | 'grid' | 'measure';

interface UIStore {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Sidebar
  sidebarTab: SidebarTab;
  setSidebarTab: (tab: SidebarTab) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Inspector
  inspectorCollapsed: boolean;
  toggleInspector: () => void;

  // Canvas
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  showRuler: boolean;
  showRegionBounds: boolean;
  snapToGrid: boolean;
  canvasTool: CanvasTool;

  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  toggleGrid: () => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setShowGrid: (show: boolean) => void;
  setShowRuler: (show: boolean) => void;
  setShowRegionBounds: (show: boolean) => void;
  setSnapToGrid: (snap: boolean) => void;
  setCanvasTool: (tool: CanvasTool) => void;
  fitToScreen: () => void;

  // Selection
  selectedRegion: SareeRegion | null;
  setSelectedRegion: (region: SareeRegion | null) => void;

  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  gridViewMode: GridViewMode;
  setGridViewMode: (mode: GridViewMode) => void;

  // Dialogs
  showNewProjectDialog: boolean;
  setShowNewProjectDialog: (show: boolean) => void;
  showExportDialog: boolean;
  setShowExportDialog: (show: boolean) => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;

  // Toast notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Theme
  theme: (typeof window !== 'undefined' && localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    set({ theme: next });
  },

  // Sidebar
  sidebarTab: 'design',
  setSidebarTab: (sidebarTab) => set({ sidebarTab }),
  sidebarCollapsed: false,
  toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),

  // Inspector
  inspectorCollapsed: false,
  toggleInspector: () => set({ inspectorCollapsed: !get().inspectorCollapsed }),

  // Canvas
  zoom: 1,
  panX: 0,
  panY: 0,
  showGrid: true,
  showRuler: true,
  showRegionBounds: true,
  snapToGrid: true,
  canvasTool: 'select',

  zoomIn: () => set({ zoom: Math.min(10, get().zoom + 0.1) }),
  zoomOut: () => set({ zoom: Math.max(0.1, get().zoom - 0.1) }),
  resetZoom: () => set({ zoom: 1, panX: 0, panY: 0 }),
  toggleGrid: () => set({ showGrid: !get().showGrid }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
  setPan: (panX, panY) => set({ panX, panY }),
  setShowGrid: (showGrid) => set({ showGrid }),
  setShowRuler: (showRuler) => set({ showRuler }),
  setShowRegionBounds: (showRegionBounds) => set({ showRegionBounds }),
  setSnapToGrid: (snapToGrid) => set({ snapToGrid }),
  setCanvasTool: (canvasTool) => set({ canvasTool }),
  fitToScreen: () => set({ zoom: 1, panX: 0, panY: 0 }),

  // Selection
  selectedRegion: null,
  setSelectedRegion: (selectedRegion) => set({ selectedRegion }),

  // View mode
  viewMode: 'design',
  setViewMode: (viewMode) => set({ viewMode }),
  gridViewMode: 'fullColor',
  setGridViewMode: (gridViewMode) => set({ gridViewMode }),

  // Dialogs
  showNewProjectDialog: false,
  setShowNewProjectDialog: (showNewProjectDialog) => set({ showNewProjectDialog }),
  showExportDialog: false,
  setShowExportDialog: (showExportDialog) => set({ showExportDialog }),
  showWelcome: true,
  setShowWelcome: (showWelcome) => set({ showWelcome }),

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID();
    set({ toasts: [...get().toasts, { ...toast, id }] });
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => get().removeToast(id), duration);
    }
  },
  removeToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
