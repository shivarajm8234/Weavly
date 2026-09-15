import React, { useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';
import { Exporters } from '../../utils/exporters';

export const ExportPanel: React.FC = () => {
  const { setShowExportDialog, addToast } = useUIStore();
  const project = useProjectStore((s) => s.project);

  const [exporting, setExporting] = useState<string | null>(null);
  const [resolution, setResolution] = useState<'standard' | 'high' | 'ultra'>('high');

  if (!project) return null;

  const handleExportPNG = async () => {
    setExporting('png');
    const scale = resolution === 'ultra' ? 4 : resolution === 'high' ? 2 : 1;
    try {
      await Exporters.exportPNG(project, 1200 * scale, 600 * scale);
      addToast({ type: 'success', message: 'PNG image exported!' });
    } catch (e) {
      addToast({ type: 'error', message: 'PNG export failed' });
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    setExporting('pdf');
    try {
      await Exporters.exportPDF(project);
      addToast({ type: 'success', message: 'PDF Tech Pack exported!' });
    } catch (e) {
      addToast({ type: 'error', message: 'PDF export failed' });
    } finally {
      setExporting(null);
    }
  };

  const handleExportCSV = () => {
    try {
      Exporters.exportCSV(project);
      addToast({ type: 'success', message: 'Jacquard CSV punch matrix exported!' });
    } catch (e) {
      addToast({ type: 'error', message: 'CSV export failed' });
    }
  };

  const handleExportSVG = () => {
    try {
      Exporters.exportSVG(project);
      addToast({ type: 'success', message: 'SVG vector spec exported!' });
    } catch (e) {
      addToast({ type: 'error', message: 'SVG export failed' });
    }
  };

  const handleExportJSON = () => {
    try {
      Exporters.exportJSON(project);
      addToast({ type: 'success', message: 'Project JSON exported!' });
    } catch (e) {
      addToast({ type: 'error', message: 'JSON export failed' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <div>
              <h2 className="text-base font-bold text-[var(--color-text)]">Export Jacquard Design</h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Production-ready files for electronic Jacquard looms and tech packs
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowExportDialog(false)}
            className="text-[var(--color-text-muted)] hover:text-white p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Resolution toggle for image */}
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
              Render Quality
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'standard', label: 'Standard', desc: '1200 × 600' },
                { id: 'high', label: 'High Res (2×)', desc: '2400 × 1200' },
                { id: 'ultra', label: 'Master Print (4×)', desc: '4800 × 2400' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setResolution(r.id as any)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    resolution === r.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-white font-semibold'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] hover:text-white'
                  }`}
                >
                  <div className="text-xs">{r.label}</div>
                  <div className="text-[10px] opacity-70 font-mono">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* PNG Image */}
            <button
              onClick={handleExportPNG}
              disabled={!!exporting}
              className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-tertiary)] text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🖼️</span>
                <span className="text-xs font-semibold text-[var(--color-text)]">High-Res PNG</span>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                Woven saree fabric visual with micro-texture relief
              </p>
            </button>

            {/* PDF Tech Pack */}
            <button
              onClick={handleExportPDF}
              disabled={!!exporting}
              className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-tertiary)] text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">📑</span>
                <span className="text-xs font-semibold text-[var(--color-text)]">PDF Tech Pack</span>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                Mill production sheet with loom hook & warp/weft specs
              </p>
            </button>

            {/* CSV Punch Card Matrix */}
            <button
              onClick={handleExportCSV}
              disabled={!project.currentGrid}
              className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-tertiary)] text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">▦</span>
                <span className="text-xs font-semibold text-[var(--color-text)]">Jacquard CSV Grid</span>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                {project.jacquard.hookWidth}×{project.jacquard.hookHeight} binary solenoid lifter matrix
              </p>
            </button>

            {/* SVG Vector */}
            <button
              onClick={handleExportSVG}
              className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-tertiary)] text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">📐</span>
                <span className="text-xs font-semibold text-[var(--color-text)]">SVG Vector Spec</span>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                Scalable vector markup with region bounding coordinates
              </p>
            </button>
          </div>

          {/* Full Project JSON */}
          <div className="pt-2">
            <button
              onClick={handleExportJSON}
              className="w-full py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-border)] text-xs font-medium text-[var(--color-text)] transition-all flex items-center justify-center gap-2"
            >
              <span>💾 Backup Project (JSON)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--color-bg-primary)] border-t border-[var(--color-border)] flex justify-end">
          <button
            onClick={() => setShowExportDialog(false)}
            className="btn-ghost text-xs px-4 py-1.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
