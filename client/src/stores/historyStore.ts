import { create } from 'zustand';
import type { SareeProject } from '../types/project';

interface HistoryEntry {
  timestamp: string;
  description: string;
  snapshot: string; // JSON-serialized partial project
}

interface HistoryStore {
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  maxHistory: number;

  pushState: (project: SareeProject, description: string) => void;
  undo: () => Partial<SareeProject> | null;
  redo: () => Partial<SareeProject> | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clear: () => void;
}

function serializeProject(project: SareeProject): string {
  // Serialize only essential fields (skip large grid data for perf)
  const slim = {
    body: project.body,
    border: project.border,
    pallu: project.pallu,
    blouse: project.blouse,
    palette: project.palette,
    jacquard: project.jacquard,
    designStyle: project.designStyle,
    name: project.name,
  };
  return JSON.stringify(slim);
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  undoStack: [],
  redoStack: [],
  maxHistory: 50,

  pushState: (project, description) => {
    const { undoStack, maxHistory } = get();
    const entry: HistoryEntry = {
      timestamp: new Date().toISOString(),
      description,
      snapshot: serializeProject(project),
    };
    const newStack = [...undoStack, entry];
    if (newStack.length > maxHistory) newStack.shift();
    set({ undoStack: newStack, redoStack: [] });
  },

  undo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return null;
    const entry = undoStack[undoStack.length - 1];
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, entry],
    });
    return JSON.parse(entry.snapshot);
  },

  redo: () => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return null;
    const entry = redoStack[redoStack.length - 1];
    set({
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, entry],
    });
    return JSON.parse(entry.snapshot);
  },

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,
  clear: () => set({ undoStack: [], redoStack: [] }),
}));
