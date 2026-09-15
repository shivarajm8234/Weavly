import React from 'react';
import { useUIStore, type ViewMode } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';

export const CanvasToolbar: React.FC = () => {
  const {
    zoom, zoomIn, zoomOut, resetZoom,
    viewMode, setViewMode,
    showGrid, toggleGrid,
    showRuler, setShowRuler,
    showRegionBounds, setShowRegionBounds,
  } = useUIStore();

  const project = useProjectStore((s) => s.project);

  const viewModes: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'color', label: 'Color Preview', icon: '🎨' },
    { id: 'monochrome', label: 'Monochrome', icon: '⚪' },
    { id: 'grid', label: 'Jacquard Grid', icon: '▦' },
    { id: 'contrast', label: 'High Contrast', icon: '⚡' },
    { id: 'technical', label: 'Loom Matrix', icon: '⚙️' },
  ];

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-1.5 bg-[var(--color-bg-secondary)]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--color-border)] shadow-lg">
      {/* View mode switcher */}
      <div className="flex items-center gap-1 pr-2 border-r border-[var(--color-border)]">
        {viewModes.map((vm) => (
          <button
            key={vm.id}
            onClick={() => setViewMode(vm.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
              viewMode === vm.id
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
            title={`${vm.label} (${viewModes.indexOf(vm) + 1})`}
          >
            <span>{vm.icon}</span>
            <span className="hidden md:inline">{vm.label}</span>
          </button>
        ))}
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-1 px-2 border-r border-[var(--color-border)]">
        <button
          onClick={toggleGrid}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            showGrid ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]'
          }`}
          title="Toggle Grid Overlay (G)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
        </button>

        <button
          onClick={() => setShowRegionBounds(!showRegionBounds)}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            showRegionBounds ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]'
          }`}
          title="Toggle Saree Regions Overlay"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
        </button>

        <button
          onClick={() => setShowRuler(!showRuler)}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            showRuler ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]'
          }`}
          title="Toggle Loom Rulers"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M2 6h20M2 18h20"/><path d="M6 2v4M10 2v4M14 2v4M18 2v4"/></svg>
        </button>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1 pl-1">
        <button
          onClick={zoomOut}
          className="btn-ghost p-1 rounded-lg text-xs"
          title="Zoom Out (Ctrl -)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </button>
        <button
          onClick={resetZoom}
          className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded hover:bg-[var(--color-bg-tertiary)]"
          title="Reset Zoom (Ctrl 0)"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={zoomIn}
          className="btn-ghost p-1 rounded-lg text-xs"
          title="Zoom In (Ctrl +)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </button>
      </div>

      {/* Jacquard info badge */}
      {project && (
        <div className="ml-2 pl-2 border-l border-[var(--color-border)] hidden lg:flex items-center gap-2 text-[11px] text-[var(--color-text-muted)] font-mono">
          <span>{project.jacquard.hookWidth}H × {project.jacquard.hookHeight}P</span>
          <span className="text-[var(--color-gold)]">★ {project.sareeType}</span>
        </div>
      )}
    </div>
  );
};
