import React, { useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';
import { api } from '../../utils/api';
const PRESETS = [
  { label: '100 × 100', w: 100, h: 100 },
  { label: '200 × 200', w: 200, h: 200 },
  { label: '300 × 300', w: 300, h: 300 },
  { label: '400 × 400', w: 400, h: 400 },
  { label: '500 × 500', w: 500, h: 500 },
];

export const NewProjectDialog: React.FC = () => {
  const { setShowNewProjectDialog, setShowWelcome, addToast } = useUIStore();
  const { createNewProject } = useProjectStore();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [designerName, setDesignerName] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [sareeType, setSareeType] = useState('Traditional Silk Saree');
  const [fabricType, setFabricType] = useState('Silk');
  const [designStyle, setDesignStyle] = useState('traditional');
  const [gridWidth, setGridWidth] = useState(400);
  const [gridHeight, setGridHeight] = useState(400);
  const [repeatWidth, setRepeatWidth] = useState(100);
  const [repeatHeight, setRepeatHeight] = useState(100);
  const [borderWidth, setBorderWidth] = useState(40);
  const [palluLength, setPalluLength] = useState(100);
  const [bodyLength, setBodyLength] = useState(260);
  const [selectedPreset, setSelectedPreset] = useState(3); // 400×400
  const [errors, setErrors] = useState<string[]>([]);

  const totalCells = gridWidth * gridHeight;

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!name.trim()) errs.push('Project name is required');
    if (gridWidth < 10) errs.push('Grid width must be at least 10');
    if (gridHeight < 10) errs.push('Grid height must be at least 10');
    if (gridWidth > 2000) errs.push('Grid width cannot exceed 2000');
    if (gridHeight > 2000) errs.push('Grid height cannot exceed 2000');
    if (borderWidth < 0) errs.push('Border width cannot be negative');
    if (palluLength < 0) errs.push('Pallu length cannot be negative');
    if (borderWidth * 2 >= gridWidth) errs.push('Border width is too large for grid width');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    const project = createNewProject({
      name: name.trim(),
      designerName,
      collectionName,
      sareeType,
      fabricType,
      designStyle: designStyle as any,
      jacquard: {
        hookWidth: gridWidth,
        hookHeight: gridHeight,
        gridWidth,
        gridHeight,
        repeatWidth,
        repeatHeight,
        borderWidth,
        palluLength,
        bodyLength,
      },
    });

    try {
      await api.createProject(project as any);
    } catch {
      // Will be saved by autosave
    }

    setShowNewProjectDialog(false);
    setShowWelcome(false);
    addToast({ type: 'success', message: `Created "${name.trim()}"` });
  };

  const handlePresetClick = (idx: number) => {
    setSelectedPreset(idx);
    setGridWidth(PRESETS[idx].w);
    setGridHeight(PRESETS[idx].h);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowNewProjectDialog(false)}>
      <div className="w-full max-w-lg bg-[var(--color-bg-secondary)] rounded-xl shadow-2xl border border-[var(--color-border)] animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">New Saree Design</h2>
          <button onClick={() => setShowNewProjectDialog(false)} className="btn-ghost p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 px-6 pt-4">
          {['Basic Info', 'Jacquard Config'].map((label, i) => (
            <button key={i} onClick={() => setStep(i)} className={`flex items-center gap-1.5 text-xs font-medium ${step === i ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === i ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-tertiary)]'}`}>{i + 1}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {step === 0 ? (
            <>
              <div>
                <label className="label">Project Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Royal Lotus" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Designer Name</label>
                  <input value={designerName} onChange={(e) => setDesignerName(e.target.value)} className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="label">Collection</label>
                  <input value={collectionName} onChange={(e) => setCollectionName(e.target.value)} className="input" placeholder="Heritage 2024" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Saree Type</label>
                  <select value={sareeType} onChange={(e) => setSareeType(e.target.value)} className="select">
                    <option>Traditional Silk Saree</option>
                    <option>Banarasi Saree</option>
                    <option>Kanchipuram Saree</option>
                    <option>Cotton Saree</option>
                    <option>Patola Saree</option>
                    <option>Custom</option>
                  </select>
                </div>
                <div>
                  <label className="label">Fabric Type</label>
                  <select value={fabricType} onChange={(e) => setFabricType(e.target.value)} className="select">
                    <option>Silk</option>
                    <option>Pure Silk</option>
                    <option>Cotton</option>
                    <option>Cotton-Silk Blend</option>
                    <option>Polyester</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Design Style</label>
                <select value={designStyle} onChange={(e) => setDesignStyle(e.target.value)} className="select">
                  <option value="traditional">Traditional</option>
                  <option value="contemporary">Contemporary</option>
                  <option value="minimal">Minimal</option>
                  <option value="royal">Royal</option>
                  <option value="temple">Temple</option>
                  <option value="floral">Floral</option>
                  <option value="geometric">Geometric</option>
                  <option value="southIndian">South Indian</option>
                  <option value="banarasi">Banarasi-Inspired</option>
                  <option value="kanchipuram">Kanchipuram-Inspired</option>
                </select>
              </div>
            </>
          ) : (
            <>
              {/* Grid Presets */}
              <div>
                <label className="label">Hook/Grid Size</label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESETS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handlePresetClick(i)}
                      className={`p-2 rounded-lg border text-xs font-mono text-center transition-all ${
                        selectedPreset === i
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Grid Width</label>
                  <input type="number" value={gridWidth} onChange={(e) => { setGridWidth(parseInt(e.target.value) || 0); setSelectedPreset(-1); }} className="input font-mono" min="10" max="2000" />
                </div>
                <div>
                  <label className="label">Grid Height</label>
                  <input type="number" value={gridHeight} onChange={(e) => { setGridHeight(parseInt(e.target.value) || 0); setSelectedPreset(-1); }} className="input font-mono" min="10" max="2000" />
                </div>
              </div>

              {/* Cell Count */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-bg-tertiary)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
                </svg>
                <span className="text-sm text-[var(--color-text)]">
                  <span className="font-semibold font-mono">{totalCells.toLocaleString()}</span> cells
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">({gridWidth} × {gridHeight})</span>
              </div>

              {/* Repeat & Structure */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Repeat Width</label>
                  <input type="number" value={repeatWidth} onChange={(e) => setRepeatWidth(parseInt(e.target.value) || 0)} className="input font-mono" min="1" />
                </div>
                <div>
                  <label className="label">Repeat Height</label>
                  <input type="number" value={repeatHeight} onChange={(e) => setRepeatHeight(parseInt(e.target.value) || 0)} className="input font-mono" min="1" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Border Width</label>
                  <input type="number" value={borderWidth} onChange={(e) => setBorderWidth(parseInt(e.target.value) || 0)} className="input font-mono" min="0" />
                </div>
                <div>
                  <label className="label">Pallu Length</label>
                  <input type="number" value={palluLength} onChange={(e) => setPalluLength(parseInt(e.target.value) || 0)} className="input font-mono" min="0" />
                </div>
                <div>
                  <label className="label">Body Length</label>
                  <input type="number" value={bodyLength} onChange={(e) => setBodyLength(parseInt(e.target.value) || 0)} className="input font-mono" min="0" />
                </div>
              </div>
            </>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              {errors.map((e, i) => (
                <p key={i} className="text-xs text-red-400">• {e}</p>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)]">
          <div>
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="btn-secondary text-sm">← Back</button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowNewProjectDialog(false)} className="btn-secondary text-sm">Cancel</button>
            {step < 1 ? (
              <button onClick={() => setStep(1)} className="btn-primary text-sm" disabled={!name.trim()}>Next →</button>
            ) : (
              <button onClick={handleCreate} className="btn-gold text-sm">Create Project</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
