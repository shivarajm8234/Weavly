import React from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import { useHistoryStore } from '../../stores/historyStore';
import { api } from '../../utils/api';

export const TopBar: React.FC = () => {
  const project = useProjectStore((s) => s.project);
  const isDirty = useProjectStore((s) => s.isDirty);
  const isSaving = useProjectStore((s) => s.isSaving);
  const lastSaved = useProjectStore((s) => s.lastSaved);
  const { viewMode, setViewMode, toggleTheme, theme, setShowExportDialog } = useUIStore();
  const canUndo = useHistoryStore((s) => s.canUndo());
  const canRedo = useHistoryStore((s) => s.canRedo());
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);

  const handleSave = async () => {
    if (!project) return;
    useProjectStore.getState().setSaving(true);
    try {
      await api.updateProject(project.id, project as any);
      useProjectStore.getState().setDirty(false);
      useProjectStore.getState().setLastSaved(new Date().toISOString());
      useUIStore.getState().addToast({ type: 'success', message: 'Project saved' });
    } catch {
      useUIStore.getState().addToast({ type: 'error', message: 'Failed to save project' });
    } finally {
      useProjectStore.getState().setSaving(false);
    }
  };

  const handleUndo = () => {
    const snapshot = undo();
    if (snapshot && project) {
      useProjectStore.getState().updateProject(snapshot);
    }
  };

  const handleRedo = () => {
    const snapshot = redo();
    if (snapshot && project) {
      useProjectStore.getState().updateProject(snapshot);
    }
  };

  const handleBack = () => {
    useProjectStore.getState().setProject(null);
    useUIStore.getState().setShowWelcome(true);
  };

  return (
    <header className="h-[var(--topbar-height)] flex items-center px-3 gap-3 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] select-none shrink-0">
      {/* Back & Logo */}
      <button onClick={handleBack} className="btn-ghost p-1.5 rounded-md" title="Back to projects">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M4 4h16v16H4z" /><path d="M4 12h16M12 4v16" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-[var(--color-text)] hidden lg:block">AI Jacquard Studio</span>
      </div>

      <div className="w-px h-6 bg-[var(--color-border)]" />

      {/* Project Info */}
      {project && (
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-[var(--color-text)] truncate max-w-48">{project.name}</span>
          <span className="badge bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]">
            {project.jacquard.gridWidth}×{project.jacquard.gridHeight}
          </span>
          {isSaving ? (
            <span className="text-xs text-[var(--color-text-muted)] animate-pulse-subtle">Saving...</span>
          ) : isDirty ? (
            <span className="text-xs text-[var(--color-warning)]">Unsaved</span>
          ) : lastSaved ? (
            <span className="text-xs text-[var(--color-success)]">Saved ✓</span>
          ) : null}
        </div>
      )}

      <div className="flex-1" />

      {/* View Mode Tabs */}
      <div className="flex items-center bg-[var(--color-bg-tertiary)] rounded-lg p-0.5">
        {(['design', 'technical', 'realistic'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
              viewMode === mode
                ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {mode === 'design' ? 'Design' : mode === 'technical' ? 'Technical' : 'Realistic'}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-[var(--color-border)]" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button onClick={handleUndo} disabled={!canUndo} className="btn-ghost p-1.5" title="Undo (Ctrl+Z)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10h10a5 5 0 0 1 0 10H9" /><path d="M3 10l4-4M3 10l4 4" />
          </svg>
        </button>
        <button onClick={handleRedo} disabled={!canRedo} className="btn-ghost p-1.5" title="Redo (Ctrl+Shift+Z)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10H11a5 5 0 0 0 0 10h4" /><path d="M21 10l-4-4M21 10l-4 4" />
          </svg>
        </button>

        <div className="w-px h-6 bg-[var(--color-border)]" />

        <button onClick={handleSave} className="btn-ghost p-1.5" title="Save (Ctrl+S)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
          </svg>
        </button>
        <button onClick={() => setShowExportDialog(true)} className="btn-secondary text-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </button>

        <div className="w-px h-6 bg-[var(--color-border)]" />

        <button onClick={toggleTheme} className="btn-ghost p-1.5" title="Toggle theme">
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};
