import React from 'react';
import type { GridData } from '../../types/project';

interface CellInspectorProps {
  x: number;
  y: number;
  grid: GridData | null;
  onClose?: () => void;
}

export const CellInspector: React.FC<CellInspectorProps> = ({ x, y, grid, onClose }) => {
  if (!grid || x < 0 || x >= grid.width || y < 0 || y >= grid.height) return null;

  const currentVal = grid.data[y * grid.width + x];
  const hookNumber = x + 1;
  const pickNumber = y + 1;

  // Extract 5x5 neighborhood matrix
  const matrix: number[][] = [];
  for (let dy = -2; dy <= 2; dy++) {
    const row: number[] = [];
    for (let dx = -2; dx <= 2; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < grid.width && ny >= 0 && ny < grid.height) {
        row.push(grid.data[ny * grid.width + nx]);
      } else {
        row.push(-1); // out of bounds
      }
    }
    matrix.push(row);
  }

  return (
    <div className="absolute bottom-4 right-4 z-20 bg-[var(--color-bg-secondary)]/95 backdrop-blur-md p-3.5 rounded-xl border border-[var(--color-border)] shadow-2xl w-64 animate-fade-in text-xs">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span>Hook & Pick Inspector</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-white">✕</button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-[11px] font-mono">
        <div className="bg-[var(--color-bg-tertiary)] p-1.5 rounded-md">
          <span className="text-[var(--color-text-muted)] block">Hook #</span>
          <span className="text-[var(--color-accent)] font-bold">{hookNumber}</span> / {grid.width}
        </div>
        <div className="bg-[var(--color-bg-tertiary)] p-1.5 rounded-md">
          <span className="text-[var(--color-text-muted)] block">Pick #</span>
          <span className="text-[var(--color-accent)] font-bold">{pickNumber}</span> / {grid.height}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[var(--color-text-muted)]">State:</span>
          <span className={`px-2 py-0.5 rounded font-medium text-[11px] ${
            currentVal === 1
              ? 'bg-[var(--color-gold)]/20 text-[var(--color-gold)] border border-[var(--color-gold)]/40'
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}>
            {currentVal === 1 ? 'Warp Up (Float)' : 'Warp Down (Ground)'}
          </span>
        </div>
      </div>

      {/* 5x5 matrix zoom preview */}
      <div>
        <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider block mb-1.5 font-semibold">
          Weave Matrix (5×5)
        </span>
        <div className="grid grid-cols-5 gap-0.5 bg-[var(--color-bg-primary)] p-1 rounded-lg border border-[var(--color-border)]">
          {matrix.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const isCenter = rIdx === 2 && cIdx === 2;
              let bg = 'bg-gray-800';
              if (val === 1) bg = 'bg-[var(--color-gold)]';
              else if (val === 0) bg = 'bg-red-950';

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`h-4 rounded-sm flex items-center justify-center text-[8px] font-mono transition-all ${bg} ${
                    isCenter ? 'ring-2 ring-white ring-offset-1 z-10 font-bold scale-110' : 'opacity-80'
                  }`}
                  title={`Hook: ${x + (cIdx - 2) + 1}, Pick: ${y + (rIdx - 2) + 1}`}
                >
                  {val >= 0 ? val : ''}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
