import type { SareeProject, DesignRegion, SareeRegion, ColorEntry } from '../types/project';
import { BUILTIN_MOTIFS } from './motifs';
import { RepeatEngine } from './RepeatEngine';

// Cached Path2D objects for fast canvas rendering
const pathCache = new Map<string, Path2D>();

function getOrCreatePath(svgPath: string): Path2D {
  let p = pathCache.get(svgPath);
  if (!p) {
    p = new Path2D(svgPath);
    pathCache.set(svgPath, p);
  }
  return p;
}

export class ProceduralEngine {
  /**
   * Render a specific saree region into an HTML Canvas context
   */
  static renderRegion(
    ctx: CanvasRenderingContext2D,
    regionKey: SareeRegion,
    regionConfig: DesignRegion,
    x: number,
    y: number,
    width: number,
    height: number,
    palette: ColorEntry[]
  ) {
    if (width <= 0 || height <= 0) return;

    ctx.save();
    // Clip to region bounds
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();

    // 1. Draw region background / base fabric weave
    const primaryColor = palette.find((c) => c.role === 'primary')?.hex || '#701020';
    const secondaryColor = palette.find((c) => c.role === 'secondary')?.hex || '#D4AF37';
    const accentColor = palette.find((c) => c.role === 'accent')?.hex || '#F5E6B3';
    const zariColor = palette.find((c) => (c.role as string) === 'zari')?.hex || secondaryColor || '#E6C229';

    // Different base tone for pallu / border vs body
    if (regionKey === 'border') {
      const grad = ctx.createLinearGradient(x, y, x, y + height);
      grad.addColorStop(0, zariColor);
      grad.addColorStop(0.5, secondaryColor);
      grad.addColorStop(1, primaryColor);
      ctx.fillStyle = grad;
    } else if (regionKey === 'pallu') {
      const grad = ctx.createLinearGradient(x, y, x + width, y);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(0.3, secondaryColor);
      grad.addColorStop(1, primaryColor);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = primaryColor;
    }
    ctx.fillRect(x, y, width, height);

    // 2. Micro-texture / Jacquard warp-weft weave simulation
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    for (let py = y; py < y + height; py += 3) {
      ctx.fillRect(x, py, width, 1);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let px = x; px < x + width; px += 3) {
      ctx.fillRect(px, y, 1, height);
    }
    ctx.restore();

    // 3. Find motifs to use
    let motif = BUILTIN_MOTIFS.find((m) => regionConfig.motifIds.includes(m.id));
    if (!motif) {
      // Pick sensible default based on region
      if (regionKey === 'border') {
        motif = BUILTIN_MOTIFS.find((m) => m.id === 'temple_spire') || BUILTIN_MOTIFS[1];
      } else if (regionKey === 'pallu') {
        motif = BUILTIN_MOTIFS.find((m) => m.id === 'kamal_lotus') || BUILTIN_MOTIFS[2];
      } else if (regionKey === 'blouse') {
        motif = BUILTIN_MOTIFS.find((m) => m.id === 'butti_coin') || BUILTIN_MOTIFS[10];
      } else {
        motif = BUILTIN_MOTIFS.find((m) => m.id === 'kalka_classic') || BUILTIN_MOTIFS[0];
      }
    }

    // 4. Calculate motif layout
    const baseItemSize = Math.max(16, Math.min(width, height) * 0.18 * (regionConfig.scale || 1));
    const layoutItems = RepeatEngine.generateLayout(
      width,
      height,
      baseItemSize,
      baseItemSize,
      regionConfig.repeatType || 'tile',
      regionConfig.density || 50,
      regionConfig.rotation || 0
    );

    // 5. Draw motifs
    const path = getOrCreatePath(motif.pathData || motif.svgPath || '');
    const motifColor = regionKey === 'border' || regionKey === 'pallu' ? zariColor : accentColor;

    layoutItems.forEach((item) => {
      ctx.save();
      ctx.translate(x + item.x, y + item.y);
      ctx.rotate((item.rotation * Math.PI) / 180);
      ctx.scale((baseItemSize / 100) * item.scaleX, (baseItemSize / 100) * item.scaleY);
      ctx.translate(-50, -50); // center of 100x100 viewBox

      // Shadow / embossing for Jacquard relief effect
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.save();
      ctx.translate(1.5, 1.5);
      ctx.fill(path);
      ctx.restore();

      // Main motif fill
      ctx.fillStyle = motifColor;
      ctx.fill(path);

      // Gold highlight sheen
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke(path);

      ctx.restore();
    });

    // 6. Draw additional borders for Pallu & Borders
    if (regionKey === 'border') {
      ctx.strokeStyle = zariColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);
    }

    ctx.restore();
  }

  /**
   * Render the complete saree on a single canvas
   */
  static renderFullSaree(
    canvas: HTMLCanvasElement,
    project: SareeProject,
    targetWidth?: number,
    targetHeight?: number
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = targetWidth || canvas.width || 1200;
    const h = targetHeight || canvas.height || 600;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);

    const { jacquard, palette } = project;
    const body = project.body || project.regions?.body || { prompt: '', pattern: 'floral', motifIds: [], density: 50, scale: 1, rotation: 0, symmetry: 'vertical', repeatType: 'tile', colors: [] };
    const border = project.border || project.regions?.border || { prompt: '', pattern: 'temple', motifIds: [], density: 60, scale: 0.9, rotation: 0, symmetry: 'horizontal', repeatType: 'tile', colors: [] };
    const pallu = project.pallu || project.regions?.pallu || { prompt: '', pattern: 'peacock', motifIds: [], density: 75, scale: 1.4, rotation: 0, symmetry: 'dual', repeatType: 'radial', colors: [] };

    // Calculate proportions
    const borderH = Math.max(20, Math.round(h * (jacquard.borderWidth / jacquard.gridHeight)));
    const palluW = Math.max(60, Math.round(w * (jacquard.palluLength / jacquard.gridWidth)));
    const bodyW = w - palluW;
    const bodyH = h - borderH * 2;

    // 1. Body Field
    this.renderRegion(ctx, 'body', body, 0, borderH, bodyW, bodyH, palette);

    // 2. Top Border
    this.renderRegion(ctx, 'border', border, 0, 0, w, borderH, palette);

    // 3. Bottom Border
    this.renderRegion(ctx, 'border', border, 0, h - borderH, w, borderH, palette);

    // 4. Pallu (Grand End Piece)
    this.renderRegion(ctx, 'pallu', pallu, bodyW, borderH, palluW, bodyH, palette);

    // 5. Border separator accent lines
    ctx.fillStyle = palette.find((c) => (c.role as string) === 'zari')?.hex || '#D4AF37';
    ctx.fillRect(0, borderH - 1, w, 2);
    ctx.fillRect(0, h - borderH - 1, w, 2);
    ctx.fillRect(bodyW - 1, borderH, 2, bodyH);
  }
}
