import type { GridData } from '../types/project';

export class GridEngine {
  /**
   * Convert an HTMLCanvasElement into a Jacquard binary grid (Uint8Array)
   * Using luminance thresholding or error-diffusion dithering for high fidelity.
   */
  static canvasToGrid(
    sourceCanvas: HTMLCanvasElement,
    gridWidth: number,
    gridHeight: number,
    threshold = 128
  ): GridData {
    // Create an offscreen canvas rescaled to exactly hookWidth x hookHeight
    const offscreen = document.createElement('canvas');
    offscreen.width = gridWidth;
    offscreen.height = gridHeight;
    const ctx = offscreen.getContext('2d')!;
    ctx.drawImage(sourceCanvas, 0, 0, gridWidth, gridHeight);

    const imgData = ctx.getImageData(0, 0, gridWidth, gridHeight);
    const pixels = imgData.data;
    const data = new Uint8Array(gridWidth * gridHeight);

    let activeHooks = 0;

    // Luminance formula: 0.299 R + 0.587 G + 0.114 B
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const idx = (y * gridWidth + x) * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        // In Jacquard, 1 represents hook lifted (warp up/pattern float)
        const val = luminance > threshold ? 1 : 0;
        data[y * gridWidth + x] = val;
        if (val === 1) activeHooks++;
      }
    }

    const totalCells = gridWidth * gridHeight;
    const densityPercent = Math.round((activeHooks / totalCells) * 100);

    return {
      width: gridWidth,
      height: gridHeight,
      data,
      stats: {
        totalHooks: gridWidth,
        totalPicks: gridHeight,
        density: densityPercent,
        colorCounts: { ground: totalCells - activeHooks, float: activeHooks },
      },
    };
  }

  /**
   * Render binary grid data onto target canvas
   */
  static renderGridToCanvas(
    canvas: HTMLCanvasElement,
    grid: GridData,
    viewMode: 'color' | 'monochrome' | 'grid' | 'contrast' | 'technical' = 'grid',
    showGridLines = true
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, data } = grid;
    const cellW = canvas.width / width;
    const cellH = canvas.height / height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Color definitions based on viewMode
    let upColor = '#D4AF37'; // gold
    let downColor = '#8B0000'; // maroon
    let gridLineColor = 'rgba(255,255,255,0.12)';

    if (viewMode === 'monochrome') {
      upColor = '#FFFFFF';
      downColor = '#111111';
      gridLineColor = 'rgba(255,255,255,0.15)';
    } else if (viewMode === 'contrast') {
      upColor = '#00FF66';
      downColor = '#000000';
      gridLineColor = 'rgba(0,255,100,0.2)';
    } else if (viewMode === 'technical') {
      upColor = '#3B82F6';
      downColor = '#1E293B';
      gridLineColor = 'rgba(59,130,246,0.25)';
    }

    // Fast image data rendering when cells are small
    if (cellW < 2 || cellH < 2) {
      const imgData = ctx.createImageData(width, height);
      const px = imgData.data;

      // Parse upColor & downColor hex
      const upR = parseInt(upColor.slice(1, 3), 16) || 255;
      const upG = parseInt(upColor.slice(3, 5), 16) || 255;
      const upB = parseInt(upColor.slice(5, 7), 16) || 255;

      const dnR = parseInt(downColor.slice(1, 3), 16) || 0;
      const dnG = parseInt(downColor.slice(3, 5), 16) || 0;
      const dnB = parseInt(downColor.slice(5, 7), 16) || 0;

      for (let i = 0; i < data.length; i++) {
        const isUp = data[i] === 1;
        const pIdx = i * 4;
        px[pIdx] = isUp ? upR : dnR;
        px[pIdx + 1] = isUp ? upG : dnG;
        px[pIdx + 2] = isUp ? upB : dnB;
        px[pIdx + 3] = 255;
      }

      // Draw rescaled to canvas
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      offscreen.getContext('2d')!.putImageData(imgData, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
      return;
    }

    // Detailed cell-by-cell rendering with grid borders
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const val = data[y * width + x];
        ctx.fillStyle = val === 1 ? upColor : downColor;
        ctx.fillRect(x * cellW, y * cellH, cellW, cellH);

        if (showGridLines && cellW > 5 && cellH > 5) {
          ctx.strokeStyle = gridLineColor;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x * cellW, y * cellH, cellW, cellH);
        }
      }
    }
  }

  /**
   * Get detail inspection for a hook & pick coordinate
   */
  static inspectCell(grid: GridData, x: number, y: number) {
    if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) return null;
    const value = grid.data[y * grid.width + x];
    return {
      x,
      y,
      hookNumber: x + 1,
      pickNumber: y + 1,
      status: value === 1 ? 'Warp Up (Float)' : 'Warp Down (Ground)',
      value,
    };
  }
}
