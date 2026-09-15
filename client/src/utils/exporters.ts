import type { SareeProject } from '../types/project';
import { ProceduralEngine } from '../engine/ProceduralEngine';
import jsPDF from 'jspdf';

export class Exporters {
  /**
   * Export high-resolution PNG of the saree
   */
  static exportPNG(project: SareeProject, width = 2400, height = 1200): Promise<void> {
    return new Promise((resolve) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      ProceduralEngine.renderFullSaree(offscreen, project, width, height);

      offscreen.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_design.png`;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    });
  }

  /**
   * Export SVG representation of the saree
   */
  static exportSVG(project: SareeProject, width = 1200, height = 600) {
    const { jacquard, regions, palette } = project;
    const borderH = Math.max(20, Math.round(height * (jacquard.borderWidth / jacquard.gridHeight)));
    const palluW = Math.max(60, Math.round(width * (jacquard.palluLength / jacquard.gridWidth)));
    const bodyW = width - palluW;
    const bodyH = height - borderH * 2;

    const primaryHex = palette.find((c) => c.role === 'primary')?.hex || '#800020';
    const zariHex = palette.find((c) => c.role === 'zari')?.hex || '#D4AF37';

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .body-bg { fill: ${primaryHex}; }
      .border-bg { fill: ${zariHex}; opacity: 0.9; }
      .pallu-bg { fill: ${primaryHex}; }
      .zari-line { stroke: ${zariHex}; stroke-width: 2; }
    </style>
  </defs>
  <!-- Top Border -->
  <rect x="0" y="0" width="${width}" height="${borderH}" class="border-bg" />
  <!-- Body -->
  <rect x="0" y="${borderH}" width="${bodyW}" height="${bodyH}" class="body-bg" />
  <!-- Pallu -->
  <rect x="${bodyW}" y="${borderH}" width="${palluW}" height="${bodyH}" class="pallu-bg" />
  <!-- Bottom Border -->
  <rect x="0" y="${height - borderH}" width="${width}" height="${borderH}" class="border-bg" />
  <!-- Boundary lines -->
  <line x1="0" y1="${borderH}" x2="${width}" y2="${borderH}" class="zari-line" />
  <line x1="0" y1="${height - borderH}" x2="${width}" y2="${height - borderH}" class="zari-line" />
  <line x1="${bodyW}" y1="${borderH}" x2="${bodyW}" y2="${height - borderH}" class="zari-line" />
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_spec.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Export complete project JSON
   */
  static exportJSON(project: SareeProject) {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_project.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Export Jacquard Loom punch card binary grid as CSV (hook x pick matrix)
   */
  static exportCSV(project: SareeProject) {
    if (!project.currentGrid) return;
    const { width, height, data } = project.currentGrid;

    const rows: string[] = [];
    // Header with hook numbers
    const header = Array.from({ length: width }, (_, i) => `Hook_${i + 1}`).join(',');
    rows.push(`Pick_Number,${header}`);

    for (let y = 0; y < height; y++) {
      const rowVals: number[] = [];
      for (let x = 0; x < width; x++) {
        rowVals.push(data[y * width + x]);
      }
      rows.push(`${y + 1},${rowVals.join(',')}`);
    }

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_jacquard_matrix_${width}x${height}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Export professional PDF production tech pack
   */
  static async exportPDF(project: SareeProject) {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Header title
    doc.setFillColor(139, 0, 0); // Royal Crimson
    doc.rect(0, 0, 297, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('AI JACQUARD SAREE PRODUCTION TECH PACK', 15, 16);

    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55);
    doc.text('WEAVLY STUDIO SPECIFICATION', 230, 16);

    // Metadata Section
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.text(`Project: ${project.name}`, 15, 36);
    doc.setFontSize(10);
    doc.text(`Designer: ${project.designerName || 'In-House'}`, 15, 43);
    doc.text(`Collection: ${project.collectionName || 'Heritage 2026'}`, 15, 50);
    doc.text(`Saree Style: ${project.sareeType} (${project.fabricType})`, 15, 57);

    // Loom technical specs table
    doc.text('JACQUARD LOOM PARAMETERS:', 150, 36);
    doc.setFontSize(9);
    doc.text(`• Total Warp Hooks: ${project.jacquard.hookWidth} Ends`, 150, 43);
    doc.text(`• Total Weft Picks: ${project.jacquard.hookHeight} Rows`, 150, 49);
    doc.text(`• Repeat Dimension: ${project.jacquard.repeatWidth} × ${project.jacquard.repeatHeight}`, 150, 55);
    doc.text(`• Border Width: ${project.jacquard.borderWidth} picks | Pallu Length: ${project.jacquard.palluLength} hooks`, 150, 61);

    // Render snapshot into canvas & put image in PDF
    const offscreen = document.createElement('canvas');
    offscreen.width = 1200;
    offscreen.height = 600;
    ProceduralEngine.renderFullSaree(offscreen, project, 1200, 600);
    const imgData = offscreen.toDataURL('image/jpeg', 0.9);

    doc.addImage(imgData, 'JPEG', 15, 70, 267, 100);

    // Footer Palette details
    doc.setFontSize(9);
    doc.text('Thread Palette Yarn Allocation:', 15, 180);
    let palX = 15;
    project.palette.forEach((p) => {
      doc.setFillColor(p.hex);
      doc.rect(palX, 184, 8, 8, 'F');
      doc.text(`${p.name} (${p.role.toUpperCase()})`, palX + 10, 189);
      palX += 50;
    });

    doc.save(`${project.name.toLowerCase().replace(/\s+/g, '_')}_techpack.pdf`);
  }
}
