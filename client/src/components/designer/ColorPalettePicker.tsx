import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import type { ColorEntry } from '../../types/project';

const PRESET_PALETTES: { name: string; colors: Omit<ColorEntry, 'id'>[] }[] = [
  {
    name: 'Banarasi Crimson & Gold',
    colors: [
      { name: 'Deep Crimson', hex: '#8B0000', role: 'primary' },
      { name: 'Antique Gold Zari', hex: '#D4AF37', role: 'zari' },
      { name: 'Warm Amber', hex: '#FFBF00', role: 'secondary' },
      { name: 'Cream Silk', hex: '#FFFDD0', role: 'accent' },
    ],
  },
  {
    name: 'Kanjivaram Peacock & Copper',
    colors: [
      { name: 'Peacock Blue', hex: '#004953', role: 'primary' },
      { name: 'Copper Zari', hex: '#B87333', role: 'zari' },
      { name: 'Mustard Gold', hex: '#E1AD01', role: 'secondary' },
      { name: 'Ivory Weft', hex: '#FFFFF0', role: 'accent' },
    ],
  },
  {
    name: 'Paithani Emerald & Ruby',
    colors: [
      { name: 'Bottle Green', hex: '#004225', role: 'primary' },
      { name: 'Pure Gold', hex: '#FFD700', role: 'zari' },
      { name: 'Ruby Red', hex: '#9B111E', role: 'secondary' },
      { name: 'Silver Glow', hex: '#E5E4E2', role: 'accent' },
    ],
  },
  {
    name: 'Chanderi Twilight Silver',
    colors: [
      { name: 'Midnight Violet', hex: '#2E1A47', role: 'primary' },
      { name: 'Silver Zari', hex: '#C0C0C0', role: 'zari' },
      { name: 'Lilac Rose', hex: '#C8A2C8', role: 'secondary' },
      { name: 'Soft Pearl', hex: '#FDF6E2', role: 'accent' },
    ],
  },
];

export const ColorPalettePicker: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const setPalette = useProjectStore((s) => s.setPalette);

  if (!project) return null;

  const handleColorChange = (index: number, newHex: string) => {
    const updated = [...project.palette];
    updated[index] = { ...updated[index], hex: newHex };
    setPalette(updated);
  };

  const applyPreset = (presetColors: Omit<ColorEntry, 'id'>[]) => {
    setPalette(
      presetColors.map((c, i) => ({
        id: `c_${Date.now()}_${i}`,
        name: c.name,
        hex: c.hex,
        role: c.role,
      }))
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
          Active Thread Palette
        </label>
        <div className="space-y-2">
          {project.palette.map((color, idx) => (
            <div
              key={color.id || idx}
              className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)]"
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => handleColorChange(idx, e.target.value)}
                  className="w-7 h-7 rounded border border-[var(--color-border)] cursor-pointer bg-transparent"
                />
                <div>
                  <div className="text-xs font-medium text-[var(--color-text)]">{color.name}</div>
                  <div className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase">{color.hex}</div>
                </div>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider ${
                color.role === 'zari' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                color.role === 'primary' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {color.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preset palettes */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
          Heritage Color Presets
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {PRESET_PALETTES.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.colors)}
              className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-primary)] border border-transparent hover:border-[var(--color-border)] transition-all text-left group"
            >
              <span className="text-xs font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]">
                {preset.name}
              </span>
              <div className="flex -space-x-1">
                {preset.colors.map((c, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: c.hex }}
                    className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                    title={`${c.name} (${c.role})`}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
