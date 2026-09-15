import { create } from 'zustand';
import type {
  SareeProject, DesignRegion, JacquardConfig, ColorEntry,
  GridData, DesignVersion, SareeRegion,
} from '../types/project';

// Re-import defaults as values
const DEFAULTS = {
  jacquard: { hookWidth: 400, hookHeight: 400, gridWidth: 400, gridHeight: 400, repeatWidth: 100, repeatHeight: 100, borderWidth: 40, palluLength: 100, bodyLength: 260 } as JacquardConfig,
  region: { prompt: '', pattern: 'floral' as const, motifIds: [], density: 50, scale: 1, rotation: 0, symmetry: 'vertical' as const, repeatType: 'tile' as const, colors: [] } as DesignRegion,
  palette: [
    { id: 'c1', name: 'Deep Maroon', hex: '#8B0000', role: 'primary' as const },
    { id: 'c2', name: 'Antique Gold', hex: '#D4AF37', role: 'secondary' as const },
    { id: 'c3', name: 'Warm Cream', hex: '#F5E6B3', role: 'accent' as const },
    { id: 'c4', name: 'Ivory', hex: '#FFFFF0', role: 'background' as const },
  ] as ColorEntry[],
};

interface ProjectStore {
  // State
  project: SareeProject | null;
  projects: ProjectListItem[];
  isDirty: boolean;
  isSaving: boolean;
  isGenerating: boolean;
  lastSaved: string | null;
  error: string | null;

  // Actions
  setProject: (project: SareeProject | null) => void;
  setProjects: (projects: ProjectListItem[]) => void;

  createNewProject: (overrides?: Partial<SareeProject>) => SareeProject;
  updateProject: (updates: Partial<SareeProject>) => void;

  updateJacquard: (config: Partial<JacquardConfig>) => void;
  updateRegion: (region: SareeRegion, updates: Partial<DesignRegion>) => void;
  updatePalette: (palette: ColorEntry[]) => void;
  updateGrid: (grid: GridData | null) => void;

  addVersion: (version: DesignVersion) => void;
  restoreVersion: (index: number) => void;

  setDirty: (dirty: boolean) => void;
  setSaving: (saving: boolean) => void;
  setGenerating: (gen: boolean) => void;
  setLastSaved: (ts: string | null) => void;
  setError: (err: string | null) => void;
}

export interface ProjectListItem {
  id: string;
  name: string;
  designerName: string;
  collectionName: string;
  sareeType: string;
  gridWidth: number;
  gridHeight: number;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: null,
  projects: [],
  isDirty: false,
  isSaving: false,
  isGenerating: false,
  lastSaved: null,
  error: null,

  setProject: (project) => set({ project, isDirty: false, error: null }),
  setProjects: (projects) => set({ projects }),

  createNewProject: (overrides = {}) => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const project: SareeProject = {
      id,
      name: 'Untitled Design',
      designerName: '',
      collectionName: '',
      sareeType: 'Traditional Silk Saree',
      fabricType: 'Silk',
      designStyle: 'traditional',
      jacquard: { ...DEFAULTS.jacquard },
      body: { ...DEFAULTS.region, prompt: '' },
      border: { ...DEFAULTS.region, prompt: '', pattern: 'temple' },
      pallu: { ...DEFAULTS.region, prompt: '', pattern: 'peacock' },
      blouse: { ...DEFAULTS.region, prompt: '', pattern: 'floral' },
      palette: [...DEFAULTS.palette],
      motifs: [],
      grid: null,
      versions: [],
      currentVersionIndex: -1,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
    set({ project, isDirty: true, error: null });
    return project;
  },

  updateProject: (updates) => {
    const { project } = get();
    if (!project) return;
    set({
      project: { ...project, ...updates, updatedAt: new Date().toISOString() },
      isDirty: true,
    });
  },

  updateJacquard: (config) => {
    const { project } = get();
    if (!project) return;
    set({
      project: {
        ...project,
        jacquard: { ...project.jacquard, ...config },
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    });
  },

  updateRegion: (region, updates) => {
    const { project } = get();
    if (!project) return;
    set({
      project: {
        ...project,
        [region]: { ...project[region], ...updates },
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    });
  },

  updatePalette: (palette) => {
    const { project } = get();
    if (!project) return;
    set({
      project: { ...project, palette, updatedAt: new Date().toISOString() },
      isDirty: true,
    });
  },

  updateGrid: (grid) => {
    const { project } = get();
    if (!project) return;
    set({
      project: { ...project, grid, updatedAt: new Date().toISOString() },
      isDirty: true,
    });
  },

  addVersion: (version) => {
    const { project } = get();
    if (!project) return;
    const versions = [...project.versions, version];
    set({
      project: {
        ...project,
        versions,
        currentVersionIndex: versions.length - 1,
        updatedAt: new Date().toISOString(),
      },
      isDirty: true,
    });
  },

  restoreVersion: (index) => {
    const { project } = get();
    if (!project || !project.versions[index]) return;
    const version = project.versions[index];
    const updates: Partial<SareeProject> = {
      currentVersionIndex: index,
      updatedAt: new Date().toISOString(),
    };
    if (version.body) updates.body = { ...project.body, imageData: version.body };
    if (version.border) updates.border = { ...project.border, imageData: version.border };
    if (version.pallu) updates.pallu = { ...project.pallu, imageData: version.pallu };
    if (version.blouse) updates.blouse = { ...project.blouse, imageData: version.blouse };
    set({ project: { ...project, ...updates }, isDirty: true });
  },

  setDirty: (isDirty) => set({ isDirty }),
  setSaving: (isSaving) => set({ isSaving }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setLastSaved: (lastSaved) => set({ lastSaved }),
  setError: (error) => set({ error }),
}));
