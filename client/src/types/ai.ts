import type { DesignRegion, ColorEntry, DesignStyle } from './project';

// ─── AI Provider Interface ────────────────────────────────────────────────────

export interface AIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  generateDesign(request: SareeDesignRequest): Promise<GeneratedDesign>;
  generateRegion(request: RegionDesignRequest): Promise<GeneratedRegion>;
}

export interface SareeDesignRequest {
  gridWidth: number;
  gridHeight: number;
  body: DesignRegion;
  border: DesignRegion;
  pallu: DesignRegion;
  blouse: DesignRegion;
  palette: ColorEntry[];
  style: DesignStyle;
  density: number;
  complexity: number;
}

export interface RegionDesignRequest {
  region: 'body' | 'border' | 'pallu' | 'blouse';
  config: DesignRegion;
  gridWidth: number;
  gridHeight: number;
  palette: ColorEntry[];
  style: DesignStyle;
}

export interface GeneratedDesign {
  compositeImage: string;     // base64 full saree
  bodyImage: string;          // base64
  borderImage: string;
  palluImage: string;
  blouseImage: string;
  metadata: GenerationMetadata;
}

export interface GeneratedRegion {
  image: string;              // base64
  region: string;
  metadata: GenerationMetadata;
}

export interface GenerationMetadata {
  provider: string;
  timestamp: string;
  prompt?: string;
  parameters?: Record<string, unknown>;
  durationMs: number;
}

export type AIProviderType = 'local' | 'openai' | 'replicate' | 'stableDiffusion' | 'comfyui';
