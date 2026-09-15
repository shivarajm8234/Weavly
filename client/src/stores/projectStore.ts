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
    { id: 'c2', name: 'Antique Gold', hex: '#D4AF37', role: 'zari' as const },
    { id: 'c3', name: 'Warm Cream', hex: '#F5E6B3', role: 'accent' as const },
    { id: 'c4', name: 'Ivory', hex: '#FFFFF0', role: 'background' as const },
  ] as ColorEntry[],
};

function normalizeProject(p: SareeProject): SareeProject {
  const body = p.body || (p.regions?.body) || { ...DEFAULTS.region };
  const border = p.border || (p.regions?.border) || { ...DEFAULTS.region, pattern: 'temple' };
  const pallu = p.pallu || (p.regions?.pallu) || { ...DEFAULTS.region, pattern: 'peacock' };
  const blouse = p.blouse || (p.regions?.blouse) || { ...DEFAULTS.region, pattern: 'floral' };
  const regions = { body, border, pallu, blouse };
  const grid = p.grid || p.currentGrid || null;

  return {
    ...p,
    body,
    border,
    pallu,
    blouse,
    regions,
    grid,
    currentGrid: grid,
  };
}

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
  loadProject: (project: SareeProject) => void;
  setProjects: (projects: ProjectListItem[]) => void;

  createNewProject: (overrides?: Partial<SareeProject>) => SareeProject;
  updateProject: (updates: Partial<SareeProject>) => void;
  updateProjectMetadata: (updates: Partial<SareeProject>) => void;

  updateJacquard: (config: Partial<JacquardConfig>) => void;
  updateRegion: (region: SareeRegion, updates: Partial<DesignRegion>) => void;
  updatePalette: (palette: ColorEntry[]) => void;
  setPalette: (palette: ColorEntry[]) => void;
  updateGrid: (grid: GridData | null) => void;

  addVersion: (version: DesignVersion) => void;
  saveCurrentVersion: (description?: string) => void;
  restoreVersion: (idOrIndex: string | number) => void;

  markClean: () => void;
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

  setProject: (project) => set({ project: project ? normalizeProject(project) : null, isDirty: false, error: null }),
  loadProject: (project) => set({ project: normalizeProject(project), isDirty: false, error: null }),
  setProjects: (projects) => set({ projects }),

  createNewProject: (overrides = {}) => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const body = { ...DEFAULTS.region, prompt: '' };
    const border = { ...DEFAULTS.region, prompt: '', pattern: 'temple' as const };
    const pallu = { ...DEFAULTS.region, prompt: '', pattern: 'peacock' as const };
    const blouse = { ...DEFAULTS.region, prompt: '', pattern: 'floral' as const };

    const project: SareeProject = normalizeProject({
      id,
      name: 'Untitled Saree Design',
      designerName: '',
      collectionName: '',
      sareeType: 'Traditional Silk Saree',
      fabricType: 'Silk',
      designStyle: 'traditional',
      jacquard: { ...DEFAULTS.jacquard },
      body,
      border,
      pallu,
      blouse,
      regions: { body, border, pallu, blouse },
      palette: [...DEFAULTS.palette],
      motifs: [],
      grid: null,
      currentGrid: null,
      versions: [],
      currentVersionIndex: -1,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    });
    set({ project, isDirty: true, error: null });
    return project;
  },

  updateProject: (updates) => {
    const { project } = get();
    if (!project) return;
    set({
      project: normalizeProject({ ...project, ...updates, updatedAt: new Date().toISOString() }),
      isDirty: true,
    });
  },

  updateProjectMetadata: (updates) => {
    const { project } = get();
    if (!project) return;
    set({
      project: normalizeProject({ ...project, ...updates, updatedAt: new Date().toISOString() }),
      isDirty: true,
    });
  },

  updateJacquard: (config) => {
    const { project } = get();
    if (!project) return;
    set({
      project: normalizeProject({
        ...project,
        jacquard: { ...project.jacquard, ...config },
        updatedAt: new Date().toISOString(),
      }),
      isDirty: true,
    });
  },

  updateRegion: (region, updates) => {
    const { project } = get();
    if (!project) return;
    const currentReg = project[region] || project.regions?.[region] || { ...DEFAULTS.region };
    const updatedReg = { ...currentReg, ...updates };

    const updatedRegions = {
      ...(project.regions || { body: project.body, border: project.border, pallu: project.pallu, blouse: project.blouse }),
      [region]: updatedReg,
    };

    set({
      project: normalizeProject({
        ...project,
        [region]: updatedReg,
        regions: updatedRegions,
        updatedAt: new Date().toISOString(),
      }),
      isDirty: true,
    });
  },

  updatePalette: (palette) => {
    const { project } = get();
    if (!project) return;
    set({
      project: normalizeProject({ ...project, palette, updatedAt: new Date().toISOString() }),
      isDirty: true,
    });
  },

  setPalette: (palette) => {
    const { project } = get();
    if (!project) return;
    set({
      project: normalizeProject({ ...project, palette, updatedAt: new Date().toISOString() }),
      isDirty: true,
    });
  },

  updateGrid: (grid) => {
    const { project } = get();
    if (!project) return;
    set({
      project: normalizeProject({ ...project, grid, currentGrid: grid, updatedAt: new Date().toISOString() }),
      isDirty: true,
    });
  },

  addVersion: (version) => {
    const { project } = get();
    if (!project) return;
    const versions = [...project.versions, version];
    set({
      project: normalizeProject({
        ...project,
        versions,
        currentVersionIndex: versions.length - 1,
        updatedAt: new Date().toISOString(),
      }),
      isDirty: true,
    });
  },

  saveCurrentVersion: (description) => {
    const { project } = get();
    if (!project) return;
    const newVer: DesignVersion = {
      id: crypto.randomUUID(),
      number: project.versions.length + 1,
      name: description || `Version ${project.versions.length + 1}`,
      description: description || `Version ${project.versions.length + 1}`,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      regions: project.regions,
    };
    get().addVersion(newVer);
  },

  restoreVersion: (idOrIndex) => {
    const { project } = get();
    if (!project) return;
    let version: DesignVersion | undefined;
    let idx = -1;
    if (typeof idOrIndex === 'number') {
      idx = idOrIndex;
      version = project.versions[idx];
    } else {
      idx = project.versions.findIndex((v) => v.id === idOrIndex);
      version = project.versions[idx];
    }
    if (!version) return;

    const updates: Partial<SareeProject> = {
      currentVersionIndex: idx,
      updatedAt: new Date().toISOString(),
    };
    if (version.regions) {
      updates.regions = version.regions;
      updates.body = version.regions.body;
      updates.border = version.regions.border;
      updates.pallu = version.regions.pallu;
      updates.blouse = version.regions.blouse;
    }
    set({ project: normalizeProject({ ...project, ...updates }), isDirty: true });
  },

  markClean: () => set({ isDirty: false }),
  setDirty: (isDirty) => set({ isDirty }),
  setSaving: (isSaving) => set({ isSaving }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setLastSaved: (lastSaved) => set({ lastSaved }),
  setError: (error) => set({ error }),
}));
