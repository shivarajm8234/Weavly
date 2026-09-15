export interface Motif {
  id: string;
  name: string;
  category: MotifCategory;
  svgPath?: string;        // SVG path data
  pathData?: string;       // SVG path data alternative
  viewBox: string;         // SVG viewBox
  symmetry?: 'none' | 'horizontal' | 'vertical' | 'radial';
  repeatable?: boolean;
  colors?: string[];        // default color slots
  tags: string[];
  width?: number;
  height?: number;
  author?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export type MotifDefinition = Motif;

export type MotifCategory =
  | 'floral' | 'paisley' | 'peacock' | 'temple' | 'lotus'
  | 'mango' | 'geometric' | 'leaves' | 'traditional'
  | 'borders' | 'butta' | 'checks' | 'stripes' | 'animal';

export const MOTIF_CATEGORIES: { value: MotifCategory; label: string; icon: string }[] = [
  { value: 'floral', label: 'Floral', icon: '🌸' },
  { value: 'paisley', label: 'Paisley', icon: '🍃' },
  { value: 'peacock', label: 'Peacock', icon: '🦚' },
  { value: 'temple', label: 'Temple', icon: '🛕' },
  { value: 'lotus', label: 'Lotus', icon: '🪷' },
  { value: 'mango', label: 'Mango', icon: '🥭' },
  { value: 'geometric', label: 'Geometric', icon: '◆' },
  { value: 'leaves', label: 'Leaves', icon: '🌿' },
  { value: 'traditional', label: 'Traditional', icon: '✦' },
  { value: 'borders', label: 'Borders', icon: '▬' },
  { value: 'butta', label: 'Butta', icon: '❋' },
  { value: 'checks', label: 'Checks', icon: '▦' },
  { value: 'stripes', label: 'Stripes', icon: '▤' },
];
