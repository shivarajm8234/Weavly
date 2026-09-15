import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import type { ViewMode } from '../../types/project';

export const GridControls: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const updateGrid = useProjectStore((s) => s.updateGrid);

  const {
    viewMode, setViewMode,
    showGrid, toggleGrid,
    showRuler, setShowRuler,
    addToast,
  } = useUIStore();

  if (!project) return null;

  const currentGrid = project.currentGrid || project.grid;
  const stats = currentGrid?.stats;
  const totalCells = project.jacquard.hookWidth * project.jacquard.hookHeight;

  // Invert warp lift states (1 <-> 0)
  const handleInvertGrid = () => {
    if (!currentGrid) return;
    const currentData = currentGrid.data as unknown as ArrayLike<number>;
    const newData = new Uint8Array(currentData.length);
    for (let i = 0; i < currentData.length; i++) {
      newData[i] = currentData[i] === 1 ? 0 : 1;
    }
    const currentDensity = stats?.density ?? 50;
    updateGrid({
      ...currentGrid,
      data: newData,
      stats: {
        totalHooks: project.jacquard.hookWidth,
        totalPicks: project.jacquard.hookHeight,
        density: 100 - currentDensity,
      },
    });
    addToast({ type: 'info', message: 'Inverted Jacquard warp lift states' });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="panel-header -mx-4 -mt-4 mb-4">Jacquard Loom Controls</div>

      {/* Loom Specs Overview */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block">
          Loom Matrix Statistics
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[var(--color-bg-primary)] p-2.5 rounded-lg border border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-muted)] block">Total Hooks</span>
            <span className="text-base font-bold font-mono text-[var(--color-accent)]">
              {project.jacquard.hookWidth}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] block">Ends</span>
          </div>

          <div className="bg-[var(--color-bg-primary)] p-2.5 rounded-lg border border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-muted)] block">Total Picks</span>
            <span className="text-base font-bold font-mono text-[var(--color-accent)]">
              {project.jacquard.hookHeight}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] block">Rows</span>
          </div>

          <div className="bg-[var(--color-bg-primary)] p-2.5 rounded-lg border border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-muted)] block">Weave Points</span>
            <span className="text-sm font-bold font-mono text-[var(--color-text)]">
              {totalCells.toLocaleString()}
            </span>
          </div>

          <div className="bg-[var(--color-bg-primary)] p-2.5 rounded-lg border border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-muted)] block">Float Ratio</span>
            <span className="text-sm font-bold font-mono text-[var(--color-gold)]">
              {stats?.density ?? 50}%
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-2" />

      {/* View Mode */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
          Technical View Mode
        </label>
        <div className="space-y-1.5">
          {(
            [
              { id: 'grid', label: 'Jacquard Grid Card', desc: 'True punch card hook lift points' },
              { id: 'technical', label: 'Loom Matrix', desc: 'Electronic solenoid binary signals' },
              { id: 'monochrome', label: 'Monochrome Film', desc: '1-bit photographic film mask' },
              { id: 'contrast', label: 'High Contrast', desc: 'High visibility float inspector' },
              { id: 'color', label: 'Color Woven Preview', desc: 'Realistic textile fabric appearance' },
            ] as { id: ViewMode; label: string; desc: string }[]
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setViewMode(m.id)}
              className={`w-full p-2 rounded-lg border text-left transition-all ${
                viewMode === m.id
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-white'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] hover:text-white'
              }`}
            >
              <div className="text-xs font-semibold">{m.label}</div>
              <div className="text-[10px] opacity-70">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-2" />

      {/* Grid Display Options */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block">
          Display & Weaving Actions
        </label>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-text)]">Show Grid Lines</span>
          <button
            onClick={toggleGrid}
            className={`w-9 h-5 rounded-full transition-colors ${
              showGrid ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                showGrid ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-text)]">Hook & Pick Rulers</span>
          <button
            onClick={() => setShowRuler(!showRuler)}
            className={`w-9 h-5 rounded-full transition-colors ${
              showRuler ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                showRuler ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleInvertGrid}
          className="w-full py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-border)] text-xs font-medium text-[var(--color-text)] transition-all flex items-center justify-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          <span>Invert Warp / Weft Lift</span>
        </button>
      </div>
    </div>
  );
};
