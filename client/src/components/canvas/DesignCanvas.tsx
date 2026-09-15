import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import { ProceduralEngine } from '../../engine/ProceduralEngine';
import { GridEngine } from '../../engine/GridEngine';
import { CanvasToolbar } from './CanvasToolbar';
import { SareeLayout } from './SareeLayout';
import { GridView } from './GridView';

export const DesignCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const project = useProjectStore((s) => s.project);
  const updateGrid = useProjectStore((s) => s.updateGrid);

  const {
    zoom, setZoom,
    panX, panY, setPan,
    viewMode, showRuler,
  } = useUIStore();

  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Base canvas dimensions (16:9 or standard saree proportion ~ 1200 x 600)
  const canvasWidth = 1200;
  const canvasHeight = 600;

  // Render saree whenever project changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !project) return;

    ProceduralEngine.renderFullSaree(canvas, project, canvasWidth, canvasHeight);

    // Compute binary Jacquard grid from current render
    try {
      const grid = GridEngine.canvasToGrid(canvas, project.jacquard.hookWidth, project.jacquard.hookHeight);
      updateGrid(grid);
    } catch (e) {
      console.warn('Could not generate Jacquard grid:', e);
    }
  }, [
    project?.regions.body,
    project?.regions.border,
    project?.regions.pallu,
    project?.regions.blouse,
    project?.palette,
    project?.jacquard,
    updateGrid,
  ]);

  // Pan interaction
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Allow pan if middle click or clicking on container background
      if (e.button === 1 || e.target === containerRef.current) {
        e.preventDefault();
        setIsPanning(true);
        setStartPan({ x: e.clientX - panX, y: e.clientY - panY });
      }
    },
    [panX, panY]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;
      setPan(e.clientX - startPan.x, e.clientY - startPan.y);
    },
    [isPanning, startPan, setPan]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setZoom(Math.max(0.2, Math.min(4.0, zoom + delta)));
      }
    },
    [zoom, setZoom]
  );

  if (!project) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
        <div className="text-center space-y-2">
          <p className="text-sm">No project open</p>
          <p className="text-xs text-[var(--color-text-muted)]">Create or open a project to begin designing</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-full overflow-hidden select-none flex items-center justify-center ${
        isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    >
      <CanvasToolbar />

      {/* Rulers */}
      {showRuler && (
        <>
          <div className="absolute top-0 left-0 right-0 h-5 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] z-10 flex items-center px-6 text-[9px] font-mono text-[var(--color-text-muted)]">
            <span className="w-20">0 Hooks</span>
            <span className="flex-1 text-center">◄ Width: {project.jacquard.hookWidth} Hooks ►</span>
            <span className="w-20 text-right">{project.jacquard.hookWidth} Hooks</span>
          </div>
          <div className="absolute top-5 left-0 bottom-0 w-5 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] z-10 flex flex-col justify-between py-4 text-[9px] font-mono text-[var(--color-text-muted)] items-center">
            <span>0</span>
            <span className="rotate-90">Picks</span>
            <span>{project.jacquard.hookHeight}</span>
          </div>
        </>
      )}

      {/* Transform Container with Zoom & Pan */}
      <div
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 0.05s ease-out',
        }}
        className="relative shadow-2xl rounded-md bg-neutral-900 border border-[var(--color-border)]"
      >
        {viewMode === 'grid' || viewMode === 'technical' ? (
          <GridView width={canvasWidth} height={canvasHeight} />
        ) : (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className={`rounded-md ${
                viewMode === 'monochrome' ? 'grayscale contrast-125' : ''
              } ${viewMode === 'contrast' ? 'contrast-200 saturate-200' : ''}`}
            />
            <SareeLayout width={canvasWidth} height={canvasHeight} />
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-2 left-4 z-10 flex items-center gap-3 bg-[var(--color-bg-secondary)]/80 backdrop-blur px-3 py-1 rounded-full border border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Local Engine Active</span>
        </span>
        <span>•</span>
        <span>{project.name}</span>
        <span>•</span>
        <span>Grid: {project.jacquard.hookWidth} × {project.jacquard.hookHeight}</span>
        {project.currentGrid && (
          <>
            <span>•</span>
            <span className="text-[var(--color-gold)] font-medium">
              Weft Float: {project.currentGrid.stats.density}%
            </span>
          </>
        )}
      </div>
    </div>
  );
};
