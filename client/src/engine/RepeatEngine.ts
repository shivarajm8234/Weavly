import type { RepeatType } from '../types/project';

export interface RepeatItem {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  opacity: number;
}

export class RepeatEngine {
  /**
   * Generates placement positions for motifs in a bounding box
   */
  static generateLayout(
    width: number,
    height: number,
    itemWidth: number,
    itemHeight: number,
    repeatType: RepeatType,
    density = 50, // 10 to 100
    baseRotation = 0
  ): RepeatItem[] {
    const items: RepeatItem[] = [];
    if (width <= 0 || height <= 0 || itemWidth <= 0 || itemHeight <= 0) return items;

    // Density scales the spacing: higher density means smaller spacing
    const densityFactor = Math.max(0.3, Math.min(2.5, (110 - density) / 50));
    const stepX = Math.max(20, itemWidth * densityFactor);
    const stepY = Math.max(20, itemHeight * densityFactor);

    switch (repeatType) {
      case 'brick': {
        let row = 0;
        for (let y = itemHeight / 2; y < height + itemHeight; y += stepY) {
          const offsetX = (row % 2 === 1) ? stepX / 2 : 0;
          for (let x = itemWidth / 2 - stepX; x < width + itemWidth; x += stepX) {
            const posX = x + offsetX;
            if (posX >= -itemWidth && posX <= width + itemWidth && y >= -itemHeight && y <= height + itemHeight) {
              items.push({
                x: posX,
                y,
                scaleX: 1,
                scaleY: 1,
                rotation: baseRotation,
                opacity: 1,
              });
            }
          }
          row++;
        }
        break;
      }

      case 'halfdrop': {
        let col = 0;
        for (let x = itemWidth / 2; x < width + itemWidth; x += stepX) {
          const offsetY = (col % 2 === 1) ? stepY / 2 : 0;
          for (let y = itemHeight / 2 - stepY; y < height + itemHeight; y += stepY) {
            const posY = y + offsetY;
            if (x >= -itemWidth && x <= width + itemWidth && posY >= -itemHeight && posY <= height + itemHeight) {
              items.push({
                x,
                y: posY,
                scaleX: 1,
                scaleY: 1,
                rotation: baseRotation,
                opacity: 1,
              });
            }
          }
          col++;
        }
        break;
      }

      case 'mirror': {
        let row = 0;
        for (let y = itemHeight / 2; y < height + itemHeight; y += stepY) {
          let col = 0;
          for (let x = itemWidth / 2; x < width + itemWidth; x += stepX) {
            const mirrorX = (col % 2 === 1) ? -1 : 1;
            const mirrorY = (row % 2 === 1) ? -1 : 1;
            items.push({
              x,
              y,
              scaleX: mirrorX,
              scaleY: mirrorY,
              rotation: baseRotation,
              opacity: 1,
            });
            col++;
          }
          row++;
        }
        break;
      }

      case 'radial': {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) / 2;
        const rings = Math.max(1, Math.round(density / 25));

        for (let r = 1; r <= rings; r++) {
          const radius = (maxRadius / rings) * r;
          const count = Math.max(4, r * 6);
          const angleStep = (Math.PI * 2) / count;

          for (let i = 0; i < count; i++) {
            const angle = i * angleStep;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            const rotationDeg = (angle * 180) / Math.PI + 90 + baseRotation;

            items.push({
              x,
              y,
              scaleX: 1,
              scaleY: 1,
              rotation: rotationDeg,
              opacity: 1,
            });
          }
        }
        // Center item
        items.push({
          x: centerX,
          y: centerY,
          scaleX: 1.2,
          scaleY: 1.2,
          rotation: baseRotation,
          opacity: 1,
        });
        break;
      }

      case 'tile':
      default: {
        for (let y = itemHeight / 2; y < height + itemHeight; y += stepY) {
          for (let x = itemWidth / 2; x < width + itemWidth; x += stepX) {
            items.push({
              x,
              y,
              scaleX: 1,
              scaleY: 1,
              rotation: baseRotation,
              opacity: 1,
            });
          }
        }
        break;
      }
    }

    return items;
  }
}
