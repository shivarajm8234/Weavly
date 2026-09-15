import React, { useEffect, useState } from 'react';
import { useProjectStore, type ProjectListItem } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import { api } from '../../utils/api';

export const ProjectList: React.FC = () => {
  const projects = useProjectStore((s) => s.projects);
  const setProjects = useProjectStore((s) => s.setProjects);
  const setProject = useProjectStore((s) => s.setProject);
  const { setShowNewProjectDialog, addToast } = useUIStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const list = await api.listProjects();
      setProjects(list as unknown as ProjectListItem[]);
    } catch { /* server may not be ready */ }
    finally { setLoading(false); }
  };

  const handleOpen = async (id: string) => {
    try {
      const project = await api.getProject(id);
      setProject(project as any);
    } catch {
      addToast({ type: 'error', message: 'Failed to open project' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.deleteProject(id);
      addToast({ type: 'success', message: `Deleted "${name}"` });
      loadProjects();
    } catch {
      addToast({ type: 'error', message: 'Failed to delete project' });
    }
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Projects</span>
        <button onClick={() => setShowNewProjectDialog(true)} className="btn-ghost p-1 text-xs" title="New project">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-xs text-[var(--color-text-muted)]">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-[var(--color-text-muted)] mb-3">No projects yet</p>
          <button onClick={() => setShowNewProjectDialog(true)} className="btn-primary text-xs">Create New</button>
        </div>
      ) : (
        <div className="space-y-1.5">
          {projects.map((p) => (
            <div key={p.id} className="group flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer" onClick={() => handleOpen(p.id)}>
              <div className="w-8 h-8 rounded bg-gradient-to-br from-primary-800/20 to-gold-500/20 flex items-center justify-center text-[10px] font-mono text-[var(--color-text-muted)]">
                {p.gridWidth}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-[var(--color-text)] truncate">{p.name}</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">{p.gridWidth}×{p.gridHeight}</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.name); }}
                className="opacity-0 group-hover:opacity-100 btn-ghost p-1 text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
                title="Delete"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
