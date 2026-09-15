import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import { GridEngine } from '../../engine/GridEngine';
import { CellInspector } from './CellInspector';

interface GridViewProps {
  width: number;
  height: number;
}

export const GridView: React.FC<GridViewProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const project = useProjectStore((s) => s.project);
  const updateGrid = useProjectStore((s) => s.updateGrid);
  const viewMode = useUIStore((s) => s.viewMode);
  const showGrid = useUIStore((s) => s.showGrid);

  const [inspectCoord, setInspectCoord] = useState<{ x: number; y: number } | null>(null);

  // Redraw grid whenever project.currentGrid or viewMode changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const grid = project?.currentGrid || project?.grid;
    if (!canvas || !grid) return;

    canvas.width = width;
    canvas.height = height;
    GridEngine.renderGridToCanvas(canvas, grid, viewMode as any, showGrid);
  }, [project?.currentGrid, project?.grid, viewMode, showGrid, width, height]);

  // Handle canvas mouse move for cell inspection
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !project?.currentGrid) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const gridX = Math.floor((mouseX / canvas.width) * project.currentGrid.width);
      const gridY = Math.floor((mouseY / canvas.height) * project.currentGrid.height);

      if (gridX >= 0 && gridX < project.currentGrid.width && gridY >= 0 && gridY < project.currentGrid.height) {
        setInspectCoord({ x: gridX, y: gridY });
      }
    },
    [project?.currentGrid]
  );

  // Handle canvas click to toggle warp lift state of cell
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !project?.currentGrid) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const gridX = Math.floor((mouseX / canvas.width) * project.currentGrid.width);
      const gridY = Math.floor((mouseY / canvas.height) * project.currentGrid.height);

      if (gridX >= 0 && gridX < project.currentGrid.width && gridY >= 0 && gridY < project.currentGrid.height) {
        const idx = gridY * project.currentGrid.width + gridX;
        const newData = new Uint8Array(project.currentGrid.data);
        newData[idx] = newData[idx] === 1 ? 0 : 1; // toggle

        updateGrid({
          ...project.currentGrid,
          data: newData,
        });
      }
    },
    [project?.currentGrid, updateGrid]
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setInspectCoord(null)}
        onClick={handleClick}
        className="cursor-crosshair shadow-2xl rounded-sm border border-[var(--color-border)]"
      />

      {inspectCoord && project?.currentGrid && (
        <CellInspector
          x={inspectCoord.x}
          y={inspectCoord.y}
          grid={project.currentGrid}
          onClose={() => setInspectCoord(null)}
        />
      )}
    </div>
  );
};
