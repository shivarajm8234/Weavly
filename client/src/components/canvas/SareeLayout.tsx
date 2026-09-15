import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';
import type { SareeRegion } from '../../types/project';

interface Props {
  width: number;
  height: number;
}

export const SareeLayout: React.FC<Props> = ({ width, height }) => {
  const { selectedRegion, setSelectedRegion, showRegionBounds } = useUIStore();
  const project = useProjectStore((s) => s.project);

  if (!project || !showRegionBounds || width <= 0 || height <= 0) return null;

  const { jacquard } = project;
  const borderH = Math.max(20, Math.round(height * (jacquard.borderWidth / jacquard.gridHeight)));
  const palluW = Math.max(60, Math.round(width * (jacquard.palluLength / jacquard.gridWidth)));
  const bodyW = width - palluW;
  const bodyH = height - borderH * 2;

  const regions: { id: SareeRegion; label: string; x: number; y: number; w: number; h: number; color: string }[] = [
    {
      id: 'border',
      label: 'Top Border',
      x: 0,
      y: 0,
      w: width,
      h: borderH,
      color: '#D4AF37',
    },
    {
      id: 'body',
      label: 'Saree Body',
      x: 0,
      y: borderH,
      w: bodyW,
      h: bodyH,
      color: '#A91B32',
    },
    {
      id: 'border',
      label: 'Bottom Border',
      x: 0,
      y: height - borderH,
      w: width,
      h: borderH,
      color: '#D4AF37',
    },
    {
      id: 'pallu',
      label: 'Grand Pallu',
      x: bodyW,
      y: borderH,
      w: palluW,
      h: bodyH,
      color: '#7C3AED',
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {regions.map((r, i) => {
        const isSelected = selectedRegion === r.id;
        return (
          <div
            key={`${r.id}-${i}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRegion(r.id);
            }}
            style={{
              left: `${r.x}px`,
              top: `${r.y}px`,
              width: `${r.w}px`,
              height: `${r.h}px`,
            }}
            className={`absolute pointer-events-auto cursor-pointer transition-all duration-150 ${
              isSelected
                ? 'ring-2 ring-white ring-inset bg-white/10 shadow-lg'
                : 'hover:bg-white/5 border border-dashed border-white/20'
            }`}
          >
            <div className="absolute top-1 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold text-white tracking-wider shadow">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }} />
              <span>{r.label}</span>
              <span className="opacity-60 text-[9px]">({Math.round(r.w)}×{Math.round(r.h)})</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
