// ─── Core Project Types ───────────────────────────────────────────────────────

export interface SareeProject {
  id: string;
  name: string;
  designerName: string;
  collectionName: string;
  sareeType: string;
  fabricType: string;
  designStyle: string;

  jacquard: JacquardConfig;

  body: DesignRegion;
  border: DesignRegion;
  pallu: DesignRegion;
  blouse: DesignRegion;

  palette: ColorEntry[];
  motifs: string[]; // motif IDs

  grid: GridData | null;

  versions: DesignVersion[];
  currentVersionIndex: number;

  createdAt: string;
  updatedAt: string;
}

export interface JacquardConfig {
  hookWidth: number;
  hookHeight: number;
  gridWidth: number;
  gridHeight: number;
  repeatWidth: number;
  repeatHeight: number;
  borderWidth: number;
  palluLength: number;
  bodyLength: number;
}

export interface DesignRegion {
  prompt: string;
  pattern: PatternType;
  motifIds: string[];
  density: number;       // 0-100
  scale: number;         // 0.1-5
  rotation: number;      // 0-360
  symmetry: SymmetryType;
  repeatType: RepeatType;
  colors: string[];
  imageData?: string;    // base64 of generated region
}

export interface GridData {
  width: number;
  height: number;
  data: number[];    // flattened Uint8Array values (serializable)
  threshold: number;
}

export interface DesignVersion {
  id: string;
  number: number;
  name: string;
  timestamp: string;
  thumbnail?: string;    // base64
  body?: string;         // base64 snapshot
  border?: string;
  pallu?: string;
  blouse?: string;
  compositeImage?: string;
}

export interface ColorEntry {
  id: string;
  name: string;
  hex: string;
  role: 'primary' | 'secondary' | 'accent' | 'background' | 'custom';
}

// ─── Enums ────────────────────────────────────────────────────────────────────

export type PatternType =
  | 'plain' | 'floral' | 'paisley' | 'geometric' | 'temple'
  | 'butta' | 'checks' | 'stripes' | 'peacock' | 'lotus'
  | 'mango' | 'leaves' | 'traditional' | 'contemporary' | 'custom';

export type SymmetryType = 'none' | 'horizontal' | 'vertical' | 'radial' | 'mirror';

export type RepeatType = 'none' | 'tile' | 'mirror' | 'halfDrop' | 'brick' | 'radial';

export type SareeRegion = 'body' | 'border' | 'pallu' | 'blouse';

export type ViewMode = 'design' | 'technical' | 'realistic';

export type GridViewMode = 'fullColor' | 'monochrome' | 'grid' | 'highContrast' | 'technical';

export type DesignStyle =
  | 'traditional' | 'contemporary' | 'minimal' | 'royal'
  | 'temple' | 'floral' | 'geometric' | 'southIndian'
  | 'banarasi' | 'kanchipuram' | 'custom';

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_JACQUARD: JacquardConfig = {
  hookWidth: 400,
  hookHeight: 400,
  gridWidth: 400,
  gridHeight: 400,
  repeatWidth: 100,
  repeatHeight: 100,
  borderWidth: 40,
  palluLength: 100,
  bodyLength: 260,
};

export const DEFAULT_REGION: DesignRegion = {
  prompt: '',
  pattern: 'floral',
  motifIds: [],
  density: 50,
  scale: 1,
  rotation: 0,
  symmetry: 'vertical',
  repeatType: 'tile',
  colors: [],
};

export const DEFAULT_PALETTE: ColorEntry[] = [
  { id: 'c1', name: 'Deep Maroon', hex: '#8B0000', role: 'primary' },
  { id: 'c2', name: 'Antique Gold', hex: '#D4AF37', role: 'secondary' },
  { id: 'c3', name: 'Warm Cream', hex: '#F5E6B3', role: 'accent' },
  { id: 'c4', name: 'Ivory', hex: '#FFFFF0', role: 'background' },
];

export const GRID_PRESETS = [
  { label: '100 × 100', width: 100, height: 100 },
  { label: '200 × 200', width: 200, height: 200 },
  { label: '300 × 300', width: 300, height: 300 },
  { label: '400 × 400', width: 400, height: 400 },
  { label: '500 × 500', width: 500, height: 500 },
  { label: 'Custom', width: 0, height: 0 },
];

export const PATTERN_OPTIONS: { value: PatternType; label: string }[] = [
  { value: 'plain', label: 'Plain' },
  { value: 'floral', label: 'Floral' },
  { value: 'paisley', label: 'Paisley' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'temple', label: 'Temple' },
  { value: 'butta', label: 'Butta' },
  { value: 'checks', label: 'Checks' },
  { value: 'stripes', label: 'Stripes' },
  { value: 'peacock', label: 'Peacock' },
  { value: 'lotus', label: 'Lotus' },
  { value: 'mango', label: 'Mango' },
  { value: 'leaves', label: 'Leaves' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'contemporary', label: 'Contemporary' },
  { value: 'custom', label: 'Custom' },
];

export const STYLE_OPTIONS: { value: DesignStyle; label: string }[] = [
  { value: 'traditional', label: 'Traditional' },
  { value: 'contemporary', label: 'Contemporary' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'royal', label: 'Royal' },
  { value: 'temple', label: 'Temple' },
  { value: 'floral', label: 'Floral' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'southIndian', label: 'South Indian' },
  { value: 'banarasi', label: 'Banarasi-Inspired' },
  { value: 'kanchipuram', label: 'Kanchipuram-Inspired' },
  { value: 'custom', label: 'Custom' },
];

export const SYMMETRY_OPTIONS: { value: SymmetryType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'radial', label: 'Radial' },
  { value: 'mirror', label: 'Mirror' },
];

export const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'tile', label: 'Basic Tile' },
  { value: 'mirror', label: 'Mirror' },
  { value: 'halfDrop', label: 'Half Drop' },
  { value: 'brick', label: 'Brick' },
  { value: 'radial', label: 'Radial' },
];
