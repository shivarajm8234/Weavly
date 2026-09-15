import React, { useState } from 'react';
import { BUILTIN_MOTIFS } from '../../engine/motifs';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import type { MotifCategory } from '../../types/motif';

const CATEGORIES: { id: MotifCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'traditional', label: 'Traditional' },
  { id: 'floral', label: 'Floral' },
  { id: 'geometric', label: 'Geometric' },
  { id: 'animal', label: 'Animal' },
];

export const MotifLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<MotifCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const project = useProjectStore((s) => s.project);
  const updateRegion = useProjectStore((s) => s.updateRegion);
  const { selectedRegion, addToast } = useUIStore();

  const filteredMotifs = BUILTIN_MOTIFS.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const assignMotifToRegion = (motifId: string) => {
    if (!project || !selectedRegion) {
      addToast({ type: 'warning', message: 'Select a saree region first!' });
      return;
    }

    updateRegion(selectedRegion, {
      motifIds: [motifId],
    });
    addToast({
      type: 'success',
      message: `Assigned motif to ${selectedRegion.toUpperCase()}`,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="panel-header -mx-4 -mt-4 mb-4">Motif Heritage Library</div>

      {/* Search Input */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search motifs (kalka, lotus, temple...)"
          className="input-field w-full text-xs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Active Target Banner */}
      <div className="flex items-center justify-between bg-[var(--color-bg-primary)] p-2 rounded-lg border border-[var(--color-border)] text-xs">
        <span className="text-[var(--color-text-muted)]">Target Region:</span>
        <span className="font-semibold uppercase text-[var(--color-gold)]">
          {selectedRegion || 'None Selected'}
        </span>
      </div>

      {/* Motif Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredMotifs.map((motif) => {
          const isAssigned =
            selectedRegion &&
            project?.regions[selectedRegion]?.motifIds?.includes(motif.id);

          return (
            <div
              key={motif.id}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-between transition-all group ${
                isAssigned
                  ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/10 ring-1 ring-[var(--color-gold)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-white/40'
              }`}
            >
              {/* Motif SVG Preview */}
              <div className="w-16 h-16 flex items-center justify-center my-1 text-[var(--color-gold)] group-hover:scale-105 transition-transform">
                <svg
                  viewBox={motif.viewBox}
                  className="w-full h-full drop-shadow-md fill-current"
                >
                  <path d={motif.pathData} />
                </svg>
              </div>

              {/* Title & Tag */}
              <div className="w-full text-center mt-1">
                <div className="text-xs font-semibold text-[var(--color-text)] truncate" title={motif.name}>
                  {motif.name}
                </div>
                <div className="text-[10px] text-[var(--color-text-muted)] capitalize">
                  {motif.category}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => assignMotifToRegion(motif.id)}
                disabled={!selectedRegion}
                className={`mt-2 w-full py-1 text-[11px] rounded font-medium transition-all ${
                  isAssigned
                    ? 'bg-[var(--color-gold)] text-black font-semibold'
                    : 'bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent)] hover:text-white text-[var(--color-text-muted)]'
                }`}
              >
                {isAssigned ? '✓ Active' : `Apply to ${selectedRegion ? selectedRegion : 'Region'}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
