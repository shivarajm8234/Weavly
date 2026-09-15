import type { SymmetryType } from '../types/project';

export class SymmetryEngine {
  /**
   * Applies symmetry transformation matrix to canvas 2D context
   */
  static applySymmetry(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    symmetry: SymmetryType,
    drawFn: () => void
  ) {
    drawFn();

    switch (symmetry) {
      case 'horizontal': {
        ctx.save();
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        drawFn();
        ctx.restore();
        break;
      }

      case 'vertical': {
        ctx.save();
        ctx.translate(0, height);
        ctx.scale(1, -1);
        drawFn();
        ctx.restore();
        break;
      }

      case 'dual': {
        // Horizontal
        ctx.save();
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        drawFn();
        ctx.restore();

        // Vertical
        ctx.save();
        ctx.translate(0, height);
        ctx.scale(1, -1);
        drawFn();
        ctx.restore();

        // Both
        ctx.save();
        ctx.translate(width, height);
        ctx.scale(-1, -1);
        drawFn();
        ctx.restore();
        break;
      }

      case 'rotational': {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(Math.PI);
        ctx.translate(-width / 2, -height / 2);
        drawFn();
        ctx.restore();
        break;
      }

      case 'none':
      default:
        break;
    }
  }
}
