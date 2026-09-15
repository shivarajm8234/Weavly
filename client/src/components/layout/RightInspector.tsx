import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';
import type { SareeRegion, DesignRegion } from '../../types/project';

interface Props {
  collapsed: boolean;
}

export const RightInspector: React.FC<Props> = ({ collapsed }) => {
  const { selectedRegion, toggleInspector, viewMode } = useUIStore();
  const project = useProjectStore((s) => s.project);
  const updateRegion = useProjectStore((s) => s.updateRegion);
  const isGenerating = useProjectStore((s) => s.isGenerating);

  if (collapsed) {
    return (
      <aside className="w-10 bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)] flex flex-col items-center py-2 shrink-0">
        <button onClick={toggleInspector} className="btn-ghost p-2" title="Expand inspector">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </aside>
    );
  }

  const regionConfig = selectedRegion && project ? project[selectedRegion] : null;

  const handleRegionUpdate = (field: keyof DesignRegion, value: any) => {
    if (!selectedRegion) return;
    updateRegion(selectedRegion, { [field]: value });
  };

  const regionLabels: Record<SareeRegion, string> = {
    body: 'Body',
    border: 'Border',
    pallu: 'Pallu',
    blouse: 'Blouse',
  };

  const regionColors: Record<SareeRegion, string> = {
    body: 'var(--color-accent)',
    border: 'var(--color-gold)',
    pallu: '#7c3aed',
    blouse: 'var(--color-success)',
  };

  const patterns = [
    { value: 'plain', label: 'Plain' }, { value: 'floral', label: 'Floral' },
    { value: 'paisley', label: 'Paisley' }, { value: 'geometric', label: 'Geometric' },
    { value: 'temple', label: 'Temple' }, { value: 'butta', label: 'Butta' },
    { value: 'checks', label: 'Checks' }, { value: 'stripes', label: 'Stripes' },
    { value: 'peacock', label: 'Peacock' }, { value: 'lotus', label: 'Lotus' },
    { value: 'mango', label: 'Mango' }, { value: 'leaves', label: 'Leaves' },
    { value: 'traditional', label: 'Traditional' }, { value: 'contemporary', label: 'Contemporary' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <aside className="w-[var(--inspector-width)] bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)] flex flex-col shrink-0 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Inspector
        </span>
        <button onClick={toggleInspector} className="btn-ghost p-1" title="Collapse">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {!selectedRegion ? (
          /* No Region Selected */
          <div className="p-4">
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-tertiary)] flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
                  <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
                </svg>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">Select a region on the canvas to inspect and edit its properties</p>
            </div>

            {/* Quick Region Buttons */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">Quick Select</p>
              {(['body', 'border', 'pallu', 'blouse'] as SareeRegion[]).map((region) => (
                <button
                  key={region}
                  onClick={() => useUIStore.getState().setSelectedRegion(region)}
                  className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-[var(--color-bg-tertiary)] transition-colors text-left"
                >
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: regionColors[region] }} />
                  <span className="text-sm text-[var(--color-text)]">{regionLabels[region]}</span>
                </button>
              ))}
            </div>
          </div>
        ) : regionConfig ? (
          /* Region Properties */
          <div className="p-4 space-y-4">
            {/* Region Header */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: regionColors[selectedRegion] }} />
              <h3 className="text-sm font-semibold text-[var(--color-text)]">{regionLabels[selectedRegion]}</h3>
              <div className="flex-1" />
              <button
                onClick={() => useUIStore.getState().setSelectedRegion(null)}
                className="btn-ghost p-1 text-xs"
              >✕</button>
            </div>

            {/* Prompt */}
            <div>
              <label className="label">Description</label>
              <textarea
                value={regionConfig.prompt}
                onChange={(e) => handleRegionUpdate('prompt', e.target.value)}
                className="input min-h-[60px] resize-y text-xs"
                placeholder={`Describe ${selectedRegion} design...`}
                rows={3}
              />
            </div>

            {/* Pattern */}
            <div>
              <label className="label">Pattern</label>
              <select
                value={regionConfig.pattern}
                onChange={(e) => handleRegionUpdate('pattern', e.target.value)}
                className="select"
              >
                {patterns.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Density */}
            <div>
              <label className="label">Density: {regionConfig.density}%</label>
              <input
                type="range" min="0" max="100" step="1"
                value={regionConfig.density}
                onChange={(e) => handleRegionUpdate('density', parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none bg-[var(--color-border)] accent-[var(--color-accent)]"
              />
              <div className="flex justify-between text-[10px] text-[var(--color-text-muted)]">
                <span>Sparse</span><span>Dense</span>
              </div>
            </div>

            {/* Scale */}
            <div>
              <label className="label">Scale: {regionConfig.scale.toFixed(1)}x</label>
              <input
                type="range" min="0.1" max="5" step="0.1"
                value={regionConfig.scale}
                onChange={(e) => handleRegionUpdate('scale', parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none bg-[var(--color-border)] accent-[var(--color-accent)]"
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="label">Rotation: {regionConfig.rotation}°</label>
              <input
                type="range" min="0" max="360" step="15"
                value={regionConfig.rotation}
                onChange={(e) => handleRegionUpdate('rotation', parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none bg-[var(--color-border)] accent-[var(--color-accent)]"
              />
            </div>

            {/* Symmetry */}
            <div>
              <label className="label">Symmetry</label>
              <div className="grid grid-cols-3 gap-1">
                {['none', 'horizontal', 'vertical', 'radial', 'mirror'].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => handleRegionUpdate('symmetry', sym)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      regionConfig.symmetry === sym
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                    }`}
                  >
                    {sym.charAt(0).toUpperCase() + sym.slice(0, 4)}
                  </button>
                ))}
              </div>
            </div>

            {/* Repeat */}
            <div>
              <label className="label">Repeat Type</label>
              <select
                value={regionConfig.repeatType}
                onChange={(e) => handleRegionUpdate('repeatType', e.target.value)}
                className="select"
              >
                <option value="none">None</option>
                <option value="tile">Basic Tile</option>
                <option value="mirror">Mirror</option>
                <option value="halfDrop">Half Drop</option>
                <option value="brick">Brick</option>
                <option value="radial">Radial</option>
              </select>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2 border-t border-[var(--color-border)]">
              <button
                className="btn-primary w-full"
                disabled={isGenerating}
                onClick={() => {
                  // Trigger region-specific regeneration
                  const event = new CustomEvent('regenerate-region', { detail: { region: selectedRegion } });
                  window.dispatchEvent(event);
                }}
              >
                {isGenerating ? 'Generating...' : `Regenerate ${regionLabels[selectedRegion]}`}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-secondary text-xs" onClick={() => handleRegionUpdate('rotation', (regionConfig.rotation + 90) % 360)}>
                  ↻ Rotate
                </button>
                <button className="btn-secondary text-xs" onClick={() => {
                  handleRegionUpdate('symmetry', regionConfig.symmetry === 'mirror' ? 'none' : 'mirror');
                }}>
                  ⇄ Mirror
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Grid Info (always shown at bottom if project exists) */}
        {project && viewMode === 'technical' && (
          <div className="p-4 border-t border-[var(--color-border)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Grid Info</p>
            <div className="space-y-1 text-xs text-[var(--color-text-secondary)]">
              <div className="flex justify-between"><span>Width:</span><span className="font-mono">{project.jacquard.gridWidth}</span></div>
              <div className="flex justify-between"><span>Height:</span><span className="font-mono">{project.jacquard.gridHeight}</span></div>
              <div className="flex justify-between"><span>Cells:</span><span className="font-mono">{(project.jacquard.gridWidth * project.jacquard.gridHeight).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Repeat:</span><span className="font-mono">{project.jacquard.repeatWidth}×{project.jacquard.repeatHeight}</span></div>
              <div className="flex justify-between"><span>Border:</span><span className="font-mono">{project.jacquard.borderWidth}px</span></div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
