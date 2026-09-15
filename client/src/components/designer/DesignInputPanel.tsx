import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import { ColorPalettePicker } from './ColorPalettePicker';
import type { SareeRegion, DesignStyle } from '../../types/project';

const STYLES: { id: DesignStyle; label: string }[] = [
  { id: 'traditional', label: 'Traditional' },
  { id: 'contemporary', label: 'Contemporary' },
  { id: 'geometric', label: 'Geometric' },
  { id: 'floral', label: 'Floral' },
  { id: 'minimal', label: 'Minimalist' },
  { id: 'royal', label: 'Royal Heritage' },
];

export const DesignInputPanel: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const updateProjectMetadata = useProjectStore((s) => s.updateProjectMetadata);
  const updateJacquard = useProjectStore((s) => s.updateJacquard);
  const { selectedRegion, setSelectedRegion } = useUIStore();

  if (!project) {
    return (
      <div className="p-4 text-xs text-[var(--color-text-muted)] text-center">
        Open or create a project to configure design parameters.
      </div>
    );
  }

  const regions: { id: SareeRegion; label: string; icon: string; count: number }[] = [
    { id: 'body', label: 'Saree Body', icon: '🥻', count: (project.body?.motifIds || project.regions?.body?.motifIds || []).length },
    { id: 'border', label: 'Border', icon: '🏛️', count: (project.border?.motifIds || project.regions?.border?.motifIds || []).length },
    { id: 'pallu', label: 'Grand Pallu', icon: '🦚', count: (project.pallu?.motifIds || project.regions?.pallu?.motifIds || []).length },
    { id: 'blouse', label: 'Blouse Piece', icon: '✂️', count: (project.blouse?.motifIds || project.regions?.blouse?.motifIds || []).length },
  ];

  return (
    <div className="p-4 space-y-5">
      <div className="panel-header -mx-4 -mt-4 mb-4">Saree Specification</div>

      {/* Basic Meta */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
            Saree Type
          </label>
          <input
            type="text"
            value={project.sareeType}
            onChange={(e) => updateProjectMetadata({ sareeType: e.target.value })}
            className="input-field w-full text-xs"
            placeholder="e.g. Kanjivaram Bridal Silk"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              Fabric
            </label>
            <input
              type="text"
              value={project.fabricType}
              onChange={(e) => updateProjectMetadata({ fabricType: e.target.value })}
              className="input-field w-full text-xs"
              placeholder="e.g. Mulberry Silk"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              Design Style
            </label>
            <select
              value={project.designStyle}
              onChange={(e) => updateProjectMetadata({ designStyle: e.target.value as DesignStyle })}
              className="input-field w-full text-xs"
            >
              {STYLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-4" />

      {/* Jacquard Loom Setup */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
          Jacquard Loom Setup
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[var(--color-bg-primary)] p-2.5 rounded-lg border border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-muted)] block">Loom Hooks (Warp)</span>
            <span className="text-sm font-bold font-mono text-[var(--color-accent)]">
              {project.jacquard.hookWidth}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] ml-1">hooks</span>
          </div>

          <div className="bg-[var(--color-bg-primary)] p-2.5 rounded-lg border border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-muted)] block">Picks / Height (Weft)</span>
            <span className="text-sm font-bold font-mono text-[var(--color-accent)]">
              {project.jacquard.hookHeight}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] ml-1">picks</span>
          </div>
        </div>

        <div className="mt-2 space-y-2">
          <div>
            <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
              <span>Border Width</span>
              <span className="font-mono">{project.jacquard.borderWidth} picks</span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              value={project.jacquard.borderWidth}
              onChange={(e) => updateJacquard({ borderWidth: Number(e.target.value) })}
              className="w-full accent-[var(--color-accent)]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
              <span>Pallu Length</span>
              <span className="font-mono">{project.jacquard.palluLength} hooks</span>
            </div>
            <input
              type="range"
              min="40"
              max="200"
              value={project.jacquard.palluLength}
              onChange={(e) => updateJacquard({ palluLength: Number(e.target.value) })}
              className="w-full accent-[var(--color-accent)]"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-4" />

      {/* Regions Quick Switch */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
          Saree Regions
        </label>
        <div className="grid grid-cols-2 gap-2">
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                selectedRegion === r.id
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-text)]'
                  : 'border-[var(--color-border)] hover:border-white/30 text-[var(--color-text-muted)]'
              }`}
            >
              <span className="text-base">{r.icon}</span>
              <div>
                <div className="text-xs font-medium leading-tight">{r.label}</div>
                <div className="text-[10px] opacity-70">
                  {(project[r.id] || project.regions?.[r.id])?.pattern} • {(project[r.id] || project.regions?.[r.id])?.repeatType}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-4" />

      {/* Threads & Palette */}
      <ColorPalettePicker />
    </div>
  );
};
